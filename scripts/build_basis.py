"""Build a separate 1st-year Kurzgymi course from the same source and design system."""
from __future__ import annotations
from pathlib import Path
import html
import json
import re
import shutil

from build_portal import render_fragment
from build_course import render as render_lesson, tabelle
from course_model import load_course
from glossary import render_glossary

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "kursseiten" / "basis-manifest.json"
SOURCE = ROOT / "basis"
OUT = ROOT / "_build" / "site" / "basis"


def assemble() -> tuple[str, list[dict]]:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sections = manifest["sections"]
    course = load_course(ROOT, "kursseiten/basis-manifest.json")
    lessons = course["lessons"]
    by_view = {s["id"]: [lesson for lesson in lessons if lesson["view"] == s["id"]] for s in sections}
    cards = []
    for section in sections:
        if not section.get("teaching"):
            continue
        lesson = by_view[section["id"]][0]
        label = html.escape(section["navigation"]["title"])
        summary = html.escape(section.get("overview", {}).get("summary", lesson["goal"]))
        cards.append(
            f'<a class="course-card" href="#{section["id"]}">'
            f'<span class="tag">{lesson["number"]}. Doppellektion</span><h3>{label}</h3>'
            f'<p>{summary}</p><span class="course-arrow">↗</span></a>'
        )
    pieces = []
    nav = []
    for section in sorted(sections, key=lambda s: s["navigation"]["order"]):
        ident = section["id"]
        folder = ROOT / "kursseiten" / ident
        sources = sorted(folder.glob("[0-9][0-9][0-9]-*.md"))
        if not sources:
            raise ValueError(f"Keine Kapiteldatei: {folder}")
        content = "".join(render_fragment(file.read_text(encoding="utf-8"), file) for file in sources)
        content = content.replace("<!-- GLOSSARY -->", render_glossary("basis"))
        content = content.replace("<!-- OVERVIEW -->", '<div class="course-grid">' + "".join(cards) + "</div>")
        start = f"<!-- LESSONS:{ident} -->"
        finish = f"<!-- /LESSONS:{ident} -->"
        if section.get("teaching"):
            if content.count(start) == 1 and content.count(finish) == 1:
                content = re.sub(re.escape(start) + r".*?" + re.escape(finish),
                                 "".join(render_lesson(lesson) for lesson in by_view[ident]), content, flags=re.S)
            elif start in content or finish in content:
                raise ValueError(f"Unvollständiger Lektionsplatzhalter in {ident}")
            else:
                # A newly authored topic may start with a YAML chapter only.
                lesson = by_view[ident][0]
                content = (f'<h1>{html.escape(lesson["title"])}</h1>'
                           + "".join(render_lesson(item) for item in by_view[ident]) + content)
        klass = html.escape(section["class"])
        pieces.append(f'<section class="{klass}" id="{ident}">{content}</section>')
        label = f'{by_view[ident][0]["number"]:02d}' if by_view[ident] else section["navigation"]["label"]
        nav.append(f'<a href="#{ident}"><span>{label}</span>{html.escape(section["navigation"]["title"])}</a>')
    template = (SOURCE / "index.template.html").read_text(encoding="utf-8")
    assert template.count("<!-- COURSE -->") == template.count("<!-- NAVIGATION -->") == 1
    return template.replace("<!-- COURSE -->", "".join(pieces)).replace("<!-- NAVIGATION -->", "".join(nav)), lessons


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    template = (ROOT / "projekt" / "index.template.html").read_text(encoding="utf-8")
    match = re.search(r"<style>(.*?)</style>", template, re.S)
    if not match:
        raise ValueError("Gemeinsame CSS-Basis der vertieften Kursseite fehlt")
    (OUT / "theme.css").write_text(match.group(1) + "\n", encoding="utf-8")
    # Shared images stay authored in projekt/grafiken; copy them for relative editor URLs.
    shutil.copytree(ROOT / "projekt" / "grafiken", OUT / "grafiken", dirs_exist_ok=True)
    source_svg = (ROOT / "projekt" / "grafiken" / "netz_hintergrund.svg").read_text(encoding="utf-8")
    blue_svg = source_svg.replace("#076959", "#3653a3").replace("#b84d27", "#6488d6").replace("#f5f4ee", "#f3f5fb")
    (OUT / "grafiken" / "netz_hintergrund_blau.svg").write_text(blue_svg, encoding="utf-8")
    for filename in ("glossar.css", "glossar.js"):
        (OUT / filename).write_bytes((ROOT / "projekt" / filename).read_bytes())
    for filename in ("basis.css", "basis.js", "persistence.js"):
        (OUT / filename).write_bytes((SOURCE / filename).read_bytes())
    page, lessons = assemble()
    (OUT / "index.html").write_text(page, encoding="utf-8")
    (OUT / "kurs.json").write_text(json.dumps({"course": "basis", "lessons": lessons}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    planning = ['<!doctype html><html lang="de-CH"><meta charset="utf-8"><title>Basis-Kurs · Unterrichtsplanung</title>',
                '<link rel="stylesheet" href="theme.css"><link rel="stylesheet" href="../projekt/portal.css"><link rel="stylesheet" href="basis.css">',
                '<main><h1>KI entdecken · AVIVA-Unterrichtsplan</h1><p>Zehn Doppellektionen à 90 Minuten.</p>']
    for lesson in lessons:
        planning.append(f'<h2>{lesson["number"]}. {html.escape(lesson["title"])}</h2>')
        planning.append('<div class="phase-table-wrap">' + tabelle(lesson) + '</div>')
    planning.append('</main></html>')
    (OUT / "unterrichtsplan.html").write_text("".join(planning), encoding="utf-8")
    from build_basis_materials import build as build_basic_materials
    build_basic_materials(ROOT, OUT, lessons)
    print(f"Built independent basis portal with {len(lessons)} double lessons")


if __name__ == "__main__":
    build()
