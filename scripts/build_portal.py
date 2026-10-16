"""Assemble the course page from content fragments without changing existing HTML."""
from __future__ import annotations

import html
import json
from pathlib import Path
import re

from markdown_it import MarkdownIt
import yaml

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "kursseiten"
PORTAL = ROOT / "projekt"
MARKDOWN = MarkdownIt("commonmark", {"html": True})


def render_fragment(source: str, filename: Path) -> str:
    """Render new Markdown while preserving old HTML and form keys byte-for-byte."""
    if source.startswith("---\n"):
        match = re.match(r"\A---\r?\n(.*?)\r?\n---\r?\n", source, re.S)
        if not match:
            raise ValueError(f"Invalid YAML header in {filename}")
        meta = yaml.safe_load(match.group(1))
        if not isinstance(meta, dict) or meta.get("type") != "chapter":
            raise ValueError(f"Chapter metadata requires type: chapter in {filename}")
        chapter_id = str(meta.get("id", ""))
        if not re.fullmatch(r"[a-z][a-z0-9-]*", chapter_id):
            raise ValueError(f"Invalid chapter ID in {filename}: {chapter_id!r}")
        number, title, short = (str(meta.get(key, "")) for key in ("nummer", "titel", "kurz"))
        if not (number and title and short):
            raise ValueError(f"Chapter needs nummer, titel and kurz in {filename}")
        status = " open" if meta.get("open", True) else ""
        body = MARKDOWN.render(source[match.end():])
        return (
            f'<details class="kapitel" id="{html.escape(chapter_id)}" '
            f'data-kurz="{html.escape(short)}"{status}>'
            f'<summary><span class="kapitel-nr">{html.escape(number)}</span>'
            f'<h2 class="kapitel-titel">{html.escape(title)}</h2></summary>'
            f'<div class="kapitel-body">{body}</div></details>'
        )

    pattern = r"<!-- MD:START -->\r?\n(.*?)\r?\n<!-- MD:END -->"
    return re.sub(pattern, lambda m: MARKDOWN.render(m.group(1)), source, flags=re.S)


def assemble() -> str:
    manifest = json.loads((PAGES / "manifest.json").read_text(encoding="utf-8"))
    sections = manifest["sections"]
    if len(sections) != len(set(sections)):
        raise ValueError("Duplicate section in manifest")
    page = (PORTAL / "index.template.html").read_text(encoding="utf-8")
    found = re.findall(r"<!-- CONTENT:([a-z0-9-]+) -->", page)
    if found != sections:
        raise ValueError(f"Template sections mismatch: {found!r} != {sections!r}")
    for section in sections:
        folder = PAGES / section
        files = sorted(folder.glob("*.md"))
        if not files:
            raise ValueError(f"No content files in {folder}")
        parts = [render_fragment(path.read_text(encoding="utf-8"), path) for path in files]
        marker = f"<!-- CONTENT:{section} -->"
        if page.count(marker) != 1:
            raise ValueError(f"Expected exactly one marker: {marker}")
        page = page.replace(marker, "".join(parts), 1)
    return page


def build() -> None:
    (PORTAL / "index.html").write_text(assemble(), encoding="utf-8")
    from build_solutions import build as build_solutions
    build_solutions()
    print("Built course portal from editable content fragments")


if __name__ == "__main__":
    build()
