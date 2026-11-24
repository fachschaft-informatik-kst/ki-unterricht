"""Build a separate 1st-year Kurzgymi course from the same source and design system."""
from __future__ import annotations
from pathlib import Path
import html
import json
import re
import shutil

from build_portal import render_fragment, MARKDOWN
from build_course import render as render_lesson, tabelle
from course_model import load_course
from glossary import render_glossary

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "kurse/bok/1-klasse/kursseiten/manifest.json"
SOURCE = ROOT / "shared/basis"
OUT = ROOT / "_build" / "site" / "basis"


def render_basis_lesson(lesson):
    """Use the visible lesson number in first-year anchors, preserving stable model IDs."""
    rendered = render_lesson(lesson)
    return rendered.replace(
        f'id="doppellektion-{lesson["id"]}"',
        f'id="doppellektion-{lesson["number"]:02d}"', 1
    )


def assemble(manifest_path: str = "kurse/bok/1-klasse/kursseiten/manifest.json", glossary_path: Path | None = None) -> tuple[str, list[dict]]:
    manifest = json.loads((ROOT / manifest_path).read_text(encoding="utf-8"))
    sections = manifest["sections"]
    course = load_course(ROOT, manifest_path)
    lessons = course["lessons"]
    by_view = {s["id"]: [lesson for lesson in lessons if lesson["view"] == s["id"]] for s in sections}
    pages_root = (ROOT / manifest_path).parent
    journal = next((path for path in (pages_root / "basis-daten" / "journal.md", pages_root / "basis-training" / "journal.md") if path.is_file()), None)
    cards = []
    for section in sections:
        slot = section.get("lessonWithoutPlan")
        if not section.get("teaching"):
            if slot:
                # Doppellektion ohne Unterrichtsplan (Theorieseite): Karte mit ihrer fest reservierten Nummer.
                tag = f'{slot["number"]}. Doppellektion'
                cards.append(
                    f'<a class="course-card" href="#{section["id"]}">'
                    f'<span class="tag">{html.escape(tag)}</span><h3>{html.escape(section["navigation"]["title"])}</h3>'
                    f'<p>{html.escape(section["overview"].get("summary", ""))}</p><span class="course-arrow">↗</span></a>'
                )
            continue
        group = by_view[section["id"]]
        lesson = group[0]
        first, last = lesson["number"], group[-1]["number"]
        tag = f"{first}.–{last}. Doppellektion" if first != last else f"{first}. Doppellektion"
        label = html.escape(section["navigation"]["title"])
        summary = html.escape(section.get("overview", {}).get("summary", lesson["goal"]))
        cards.append(
            f'<a class="course-card" href="#{section["id"]}">'
            f'<span class="tag">{html.escape(tag)}</span><h3>{label}</h3>'
            f'<p>{summary}</p><span class="course-arrow">↗</span></a>'
        )
    pieces = []
    nav = []
    for section in sorted(sections, key=lambda s: s["navigation"]["order"]):
        ident = section["id"]
        folder = (ROOT / manifest_path).parent / ident
        sources = sorted(folder.glob("[0-9][0-9][0-9]-*.md"))
        if not sources:
            raise ValueError(f"Keine Kapiteldatei: {folder}")
        content = "".join(render_fragment(file.read_text(encoding="utf-8"), file) for file in sources)
        content = content.replace("<!-- GLOSSARY -->", render_glossary("basis", source=glossary_path))
        content = content.replace("<!-- OVERVIEW -->", '<div class="course-grid">' + "".join(cards) + "</div>")
        start = f"<!-- LESSONS:{ident} -->"
        finish = f"<!-- /LESSONS:{ident} -->"
        if section.get("teaching"):
            if content.count(start) == 1 and content.count(finish) == 1:
                content = re.sub(re.escape(start) + r".*?" + re.escape(finish),
                                 "".join(render_basis_lesson(lesson) for lesson in by_view[ident]), content, flags=re.S)
            elif start in content or finish in content:
                raise ValueError(f"Unvollständiger Lektionsplatzhalter in {ident}")
            else:
                # A newly authored topic may start with a YAML chapter only.
                lesson = by_view[ident][0]
                content = (f'<h1>{html.escape(lesson["title"])}</h1>'
                           + "".join(render_basis_lesson(item) for item in by_view[ident]) + content)
        # Fourth-year lesson fragments use data-answer, while first-year download,
        # restore and journal features use data-basis-answer. Bridge keys in HTML
        # so the authored lesson sources stay equivalent to the fourth-year ones.
        def mirror_answer(match):
            tag = match.group(0)
            if "data-basis-answer=" in tag:
                return tag
            field = re.search(r'\bdata-answer="([^"]+)"', tag)
            return tag[:-1] + f' data-basis-answer="{field.group(1)}">' if field else tag

        content = re.sub(r"<(?:input|select|textarea)\b[^>]*>", mirror_answer, content)
        klass = html.escape(section["class"])
        pages = section.get("pages") or ("Fahrplan" if journal and ident in {"basis-daten", "basis-training", "basis-abschluss"} else None)
        page_mode = f' data-pages="{html.escape(pages)}"' if pages else ""
        pieces.append(f'<section class="{klass}" id="{ident}"{page_mode}>{content}</section>')
        if section.get("lessonWithoutPlan"):
            label = f'{section["lessonWithoutPlan"]["number"]:02d}'
        else:
            group = by_view[ident]
            if group:
                first, last = group[0]["number"], group[-1]["number"]
                label = f"{first:02d}–{last:02d}" if first != last else f"{first:02d}"
            else:
                label = section["navigation"]["label"]
        nav.append(f'<a href="#{ident}"><span>{label}</span>{html.escape(section["navigation"]["title"])}</a>')
    template = (SOURCE / "index.template.html").read_text(encoding="utf-8")
    # The full picture-project journal is an opt-in course source. Other
    # first-year courses retain their existing journal and storage schema.
    if journal:
        project_journal = render_fragment(journal.read_text(encoding="utf-8"), journal)
        template = re.sub(r'(<section class="section basis-utility-view" id="basis-journal" tabindex="-1">).*?(</section>)',
                          lambda m: m[1] + project_journal + m[2], template, count=1, flags=re.S)
        rubric = journal.parent.parent / "basis-abschluss" / "bewertungsraster.md"
        # Keep the assessment accessible inside the existing project view,
        # without adding a ninth double lesson or extra navigation item.
        for i, piece in enumerate(pieces):
            rubric_view = "basis-daten" if journal.parent.name == "basis-daten" else "basis-abschluss"
            if f'id="{rubric_view}"' in piece:
                pieces[i] = piece.removesuffix('</section>') + ( '<details class="card" id="basis-bewertung"><summary>Bewertungsraster</summary>' + MARKDOWN.render(rubric.read_text(encoding="utf-8")) + '</details></section>')
                break
    assert template.count("<!-- COURSE -->") == template.count("<!-- NAVIGATION -->") == 1
    return template.replace("<!-- COURSE -->", "".join(pieces)).replace("<!-- NAVIGATION -->", "".join(nav)), lessons


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    template = (ROOT / "shared/portal" / "index.template.html").read_text(encoding="utf-8")
    match = re.search(r"<style>(.*?)</style>", template, re.S)
    if not match:
        raise ValueError("Gemeinsame CSS-Basis der vertieften Kursseite fehlt")
    (OUT / "theme.css").write_text(match.group(1) + "\n", encoding="utf-8")
    shutil.copytree(ROOT / "kurse/bok/1-klasse/assets/grafiken", OUT / "grafiken", dirs_exist_ok=True)
    source_svg = (ROOT / "kurse/bok/1-klasse/assets/grafiken/netz_hintergrund.svg").read_text(encoding="utf-8")
    blue_svg = source_svg.replace("#076959", "#3653a3").replace("#b84d27", "#6488d6").replace("#f5f4ee", "#f3f5fb")
    (OUT / "grafiken" / "netz_hintergrund_blau.svg").write_text(blue_svg, encoding="utf-8")
    for filename in ("glossar.css", "glossar.js", "dl1_sort.css", "dl1_sort.js", "notebook-blocks.js"):
        (OUT / filename).write_bytes((ROOT / "shared/portal" / filename).read_bytes())
    for filename in ("basis.css", "basis.js", "persistence.js"):
        (OUT / filename).write_bytes((SOURCE / filename).read_bytes())
    page, lessons = assemble(glossary_path=(ROOT / "kurse/bok/1-klasse/kursseiten/glossar.json" if (ROOT / "kurse/bok/1-klasse/kursseiten/glossar.json").is_file() else None))
    (OUT / "index.html").write_text(page, encoding="utf-8")
    (OUT / "kurs.json").write_text(json.dumps({"course": "basis", "lessons": lessons}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    planning = ['<!doctype html><html lang="de-CH"><meta charset="utf-8"><title>Basis-Kurs · Unterrichtsplanung</title>',
                '<link rel="stylesheet" href="theme.css"><link rel="stylesheet" href="../projekt/portal.css"><link rel="stylesheet" href="basis.css">',
                f'<main><h1>Künstliche Intelligenz · AVIVA-Unterrichtsplan</h1><p>{len(lessons)} Doppellektionen à 90 Minuten.</p>']
    for lesson in lessons:
        planning.append(f'<h2>{lesson["number"]}. {html.escape(lesson["title"])}</h2>')
        planning.append('<div class="phase-table-wrap">' + tabelle(lesson) + '</div>')
    planning.append('</main></html>')
    (OUT / "unterrichtsplan.html").write_text("".join(planning), encoding="utf-8")
    from build_basis_materials import build as build_basic_materials
    build_basic_materials(ROOT / "kurse/bok/1-klasse", OUT, lessons)
    print(f"Built independent basis portal with {len(lessons)} double lessons")


if __name__ == "__main__":
    build()
