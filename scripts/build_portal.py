"""Assemble the course page from content fragments without changing existing HTML."""
from __future__ import annotations

import html
import json
from pathlib import Path
import re
import shutil

from markdown_it import MarkdownIt
import yaml
from course_model import load_course, output

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
        archived = meta.get("archiviert") is True
        status = " open" if meta.get("open", True) and not archived else ""
        if archived:
            status += ' data-archived="true" hidden style="display:none"'
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
    course = load_course(ROOT)
    grouped = {s["id"]: [l for l in course["lessons"] if l["view"] == s["id"]] for s in sections}
    def nav_order(section):
        return grouped[section["id"]][0]["number"] if grouped[section["id"]] else -100 + section["navigation"]["order"]

    overview = []
    for section in sorted((s for s in sections if s.get("teaching")), key=nav_order):
        lessons = grouped[section["id"]]
        first, last = lessons[0]["number"], lessons[-1]["number"]
        number = f"{first}.–{last}." if first != last else f"{first}."
        meta = section.get("overview", {})
        title = meta.get("title", section["navigation"]["title"])
        summary = meta.get("summary", lessons[0]["goal"])
        overview.append(f'<a class="course-card" href="#{section["id"]}"><span class="tag">{number} Doppellektion</span>'
                        f'<h3>{html.escape(html.unescape(title))}</h3><p>{html.escape(summary)}</p><span aria-hidden="true" class="course-arrow">↗</span></a>')
    page = (PORTAL / "index.template.html").read_text(encoding="utf-8")
    rendered = []
    for section in sections:
        view = section["id"]
        folder = PAGES / view
        files = sorted(folder.glob("[0-9][0-9][0-9]-*.md"))
        if not files:
            raise ValueError(f"No content files in {folder}")
        parts = [render_fragment(path.read_text(encoding="utf-8"), path) for path in files]
        content = "".join(parts)
        content = content.replace("<!-- OVERVIEW -->", '<div class="course-grid">' + "".join(overview) + "</div>")
        lessons = [l for l in course["lessons"] if l["view"] == view]
        if lessons and f"<!-- LESSONS:{view} -->" not in content:
            content = f'<!-- LESSONS:{view} --><!-- /LESSONS:{view} -->' + content
        attrs = f'class="{html.escape(section["class"])}" id="{view}"'
        if section.get("navParent"):
            attrs += f' data-nav="{html.escape(section["navParent"])}"'
        rendered.append(f"<section {attrs}>{content}</section>")
    navigation = []
    for section in sorted((s for s in sections if "navigation" in s), key=nav_order):
        nav = section["navigation"]
        label = nav["label"]
        if grouped[section["id"]]:
            nums = [l["number"] for l in grouped[section["id"]]]
            label = f"{nums[0]:02d}" if len(nums) == 1 else f"{nums[0]:02d}–{nums[-1]:02d}"
        navigation.append(f'<a href="#{section["id"]}"><span>{html.escape(label)}</span>{html.escape(nav["title"])}</a>')
    for marker, content in [("<!-- COURSE -->", "".join(rendered)), ("<!-- NAVIGATION -->", "".join(navigation))]:
        if page.count(marker) != 1:
            raise ValueError(f"Expected exactly one marker: {marker}")
        page = page.replace(marker, content)
    return page


def build() -> None:
    target = output(ROOT)
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(PORTAL, target, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns("*.template.html", "README.md", "index.html",
                                                 "unterrichtsplan.html", "materialien.html", "musterloesungen", "materialien"))
    for path in (ROOT / "shared").glob("*"):
        shutil.copyfile(path, target / "admin" / path.name)
    shutil.copyfile(ROOT / "experimente/registry.json", target / "experiments.json")
    (target / "index.html").write_text(assemble(), encoding="utf-8")
    (target / "kurs.json").write_text(json.dumps(load_course(ROOT), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    from build_solutions import build as build_solutions
    build_solutions()
    print("Built course portal from editable content fragments")


if __name__ == "__main__":
    build()
