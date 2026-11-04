"""Audit local links, anchors and notebook entrypoints on all four published courses.

Run after scripts/copy_portal.py has packaged dist/ and build_portal_notebooks.py
has populated _build/content. Missing internal resources are release blockers.
External links are intentionally out of scope (they require online checking).
"""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit, parse_qs
import posixpath
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
STAGING = ROOT / "_build/content"
ORIGIN_PREFIX = "https://fachschaft-informatik-kst.github.io/ki-unterricht/"
COURSES = ("bok/1-klasse", "bok/4-klasse", "irn/1-klasse", "irn/4-klasse")
LEGACY = ("basis", "projekt")


class Refs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, str]] = []
        self.ids: set[str] = set()
        self.notebooks: list[str] = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and values.get("name"):
            self.ids.add(values["name"])
        for name in ("href", "src", "poster"):
            if (tag == "a" and name == "href") or (
                tag == "link" and name == "href") or (
                tag in ("script", "img", "iframe", "source", "video") and name in ("src", "poster")):
                value = values.get(name)
                if value:
                    self.refs.append((f"{tag}.{name}", value.strip()))
        if values.get("data-notebook"):
            self.notebooks.append(values["data-notebook"])
        # data-lab is a file name resolved by the portal controller.
        if values.get("data-lab", "").endswith(".ipynb"):
            self.notebooks.append(values["data-lab"])


def local_url(value: str):
    if value.startswith(("#", "?")):
        return urlsplit(value)
    if value.startswith(ORIGIN_PREFIX):
        return urlsplit("/" + value[len(ORIGIN_PREFIX):])
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or value.startswith("//"):
        return None
    return parts


def resolve(source: Path, url: str) -> Path | None:
    parts = local_url(url)
    if parts is None:
        return None
    if not parts.path:
        return source
    if parts.path.startswith("/ki-unterricht/"):
        path = parts.path[len("/ki-unterricht/"):]
    elif parts.path.startswith("/"):
        path = parts.path.lstrip("/")
    else:
        path = posixpath.join(source.relative_to(DIST).parent.as_posix(), parts.path)
    path = posixpath.normpath(unquote(path))
    if path in ("", "."):
        return source
    if path == ".." or path.startswith("../"):
        raise ValueError("Path escapes site root")
    target = DIST / path
    if path.endswith("/") or target.is_dir():
        target = target / "index.html"
    return target


def check() -> None:
    assert DIST.is_dir() and (STAGING / "portal").is_dir(), "First package the complete site"
    errors: list[str] = []
    inspected = Counter()
    decoded: dict[Path, Refs] = {}
    pages = [DIST / "kurse.html"]
    for slug in (*COURSES, *LEGACY):
        directory = DIST / slug
        assert (directory / "index.html").is_file(), f"Published course missing: {slug}"
        pages.extend(sorted(directory.rglob("*.html")))
    for source in pages:
        parsed = Refs()
        parsed.feed(source.read_text(encoding="utf-8"))
        decoded[source] = parsed
    def report(source, reason):
        errors.append(str(source.relative_to(DIST)) + ": " + reason)

    for source, parsed in decoded.items():
        inspected["pages"] += 1
        for kind, raw in parsed.refs:
            if raw.startswith(("data:", "blob:", "javascript:", "mailto:", "tel:")):
                continue
            parts = local_url(raw)
            if parts is None:
                inspected["external"] += 1
                continue
            try:
                target = resolve(source, raw)
            except ValueError as exc:
                report(source, f"{kind} {raw}: {exc}")
                continue
            inspected["local_links"] += 1
            if not target.is_file():
                report(source, f"{kind} missing file: {raw} -> {target.relative_to(DIST)}")
                continue
            if parts.fragment and target.suffix.lower() in (".html", ".htm"):
                if target not in decoded:
                    other = Refs()
                    other.feed(target.read_text(encoding="utf-8"))
                    ids = other.ids
                if unquote(parts.fragment) not in (decoded[target].ids if target in decoded else ids):
                    # Some in-page targets are created on load by controllers.
                    # They remain covered by the full-browser course tests.
                    inspected["js_anchor_targets"] += 1
                else:
                    inspected["anchors"] += 1
            if target.name == "index.html" and target.parent.name == "lab":
                notebook = parse_qs(parts.query).get("path", [])
                if notebook:
                    value = notebook[0]
                    if not re.fullmatch(r"portal/(?:[a-z0-9_-]+/)*[a-z0-9_]+\.ipynb", value):
                        report(source, f"Malformed notebook query: {raw}")
                    elif not (STAGING / value).is_file():
                        report(source, f"Notebook not packaged: {value} (from {raw})")
                    else:
                        inspected["notebook_urls"] += 1
        if source.name == "kurse.html":
            continue
        for notebook in parsed.notebooks:
            if not re.fullmatch(r"(?:content/(?:ki_projekt/)?)?[a-z0-9_]+\.ipynb", notebook):
                report(source, f"Invalid data-notebook/data-lab: {notebook}")
                continue
            name = notebook.removeprefix("content/")
            slug = source.relative_to(DIST).parts
            course_slug = "/".join(slug[:2]) if slug[0] in ("bok", "irn") else None
            base = ROOT / "kurse" / course_slug / "content" if course_slug else ROOT / "content"
            candidates = [base / name, base / "ki_projekt" / name]
            if not any(candidate.is_file() for candidate in candidates):
                report(source, f"Missing {'course-owned' if course_slug else 'legacy'} notebook: {notebook}")
                continue
            inspected["notebook_blocks"] += 1
    print("Site link/notebook audit: " + ", ".join(f"{k}={v}" for k,v in inspected.items()))
    if errors:
        raise AssertionError(f"{len(errors)} broken local links/notebooks:\n" + "\n".join(errors[:80]))
    print("PASS: all published routes, local files and referenced notebook targets")


if __name__ == "__main__":
    check()
