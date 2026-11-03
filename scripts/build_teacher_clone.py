"""Build full BOK-style IRN pages from their own source copies.

Shared design and controllers stay in basis/ and projekt/. Course data comes
exclusively from the selected kurse/<teacher>/<grade>-klasse directory.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

from markdown_it import MarkdownIt

from build_basis import assemble as assemble_basis
from build_course import lehrpersonen_seite, render, tabelle
from build_portal import assemble as assemble_projekt
from course_model import load_course

ROOT = Path(__file__).resolve().parents[1]
MARKDOWN = MarkdownIt("commonmark", {"html": True}).enable("table")


def render_teacher_materials(course: dict, lessons: list[dict]) -> str:
    base = ROOT / course["courseRoot"] / "kursseiten"
    entries = []
    for lesson in lessons:
        source = (base / lesson["view"] / "materialien.md").read_text(encoding="utf-8")
        entries.append(f'<article id="dl-{lesson["number"]}"><h2>{lesson["number"]}. '
                       f'{html.escape(lesson["title"])}</h2>'
                       + MARKDOWN.render(source) + "</article>")
    return ('<!doctype html><html lang="de-CH"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Materialkoffer</title><link rel="stylesheet" href="portal.css">'
            '<style>main{max-width:1040px;margin:auto;padding:30px}'
            'article{padding:20px;margin:18px 0;border:1px solid #d8dfdb;border-radius:14px;background:#fff}'
            'article img{max-width:100%}</style></head><body><main>'
            '<p><a href="index.html">Zur Kursseite</a></p><h1>Materialkoffer</h1>'
            + "".join(entries) + '</main><script src="notebook-blocks.js" defer></script></body></html>')


def render_clone(course: dict, target: Path) -> None:
    pages = ROOT / course["courseRoot"] / "kursseiten"
    glossary = pages / "glossar.json"
    model = load_course(ROOT, course["manifest"])
    lessons = model["lessons"]
    if course["grade"] == 1:
        page, _ = assemble_basis(course["manifest"], glossary)
        planning = ['<!doctype html><html lang="de-CH"><meta charset="utf-8">'
                    '<link rel="stylesheet" href="theme.css"><link rel="stylesheet" href="basis.css">'
                    '<main><h1>AVIVA-Unterrichtsplan</h1>']
        for lesson in lessons:
            planning.append(f'<h2>{lesson["number"]}. {html.escape(lesson["title"])}</h2>')
            planning.append('<div class="phase-table-wrap">' + tabelle(lesson) + '</div>')
        planning.append('</main></html>')
        planning_html = "".join(planning)
    else:
        page = assemble_projekt(pages, course["manifest"], glossary)
        for view in dict.fromkeys(lesson["view"] for lesson in lessons):
            body = "\n".join(render(lesson) for lesson in lessons if lesson["view"] == view)
            pattern = rf'<!--\s*LESSONS:{re.escape(view)}\s*-->.*?<!--\s*/LESSONS:{re.escape(view)}\s*-->'
            page, count = re.subn(pattern,
                lambda _: f'<!-- LESSONS:{view} -->\n{body}\n<!-- /LESSONS:{view} -->',
                page, flags=re.S)
            if count != 1:
                raise ValueError(f"AVIVA-Einbettung fehlt: {view}")
        planning_html = lehrpersonen_seite(lessons, page)
    # Notebook document paths are isolated per IRN course. Existing BOK paths
    # keep their old names so saved student work and older URLs still resolve.
    prefix = "portal/" + course["slug"] + "/"
    page = page.replace("portal/", prefix)
    (target / "index.html").write_text(page, encoding="utf-8")
    (target / "kurs.json").write_text(json.dumps({
        "course": course["id"], "lessons": lessons}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (target / "unterrichtsplan.html").write_text(planning_html, encoding="utf-8")
    (target / "materialien.html").write_text(render_teacher_materials(course, lessons).replace("portal/", prefix), encoding="utf-8")
    for file in (target / "portal.js",target / "notebook-blocks.js"):
        if not file.exists():
            continue
        code = file.read_text(encoding="utf-8")
        code = code.replace("'portal/'+name", "'" + prefix + "'+name")
        code = code.replace('"portal/" + name', '"' + prefix + '" + name')
        code = code.replace('"portal/"+name', '"' + prefix + '"+name')
        if file.name == "portal.js":
            code = code.replace("'kst-ki-kursportal-v1'", "'kst-ki-" + course["id"] + "-v1'")
            code = code.replace("'ki-kursportal-v1'", "'ki-" + course["id"] + "-v1'")
            code = code.replace("'ki-kursantworten-v1'", "'ki-" + course["id"] + "-antworten-v1'")
            code = code.replace("'ki-last-opened-bok-4'", "'ki-last-opened-" + course["id"] + "'")
            code = code.replace("'kst-ki-kursportal'", "'kst-ki-" + course["id"] + "'")
            code = code.replace("indexedDB.open('kst-ki-kursportal'", "indexedDB.open('kst-ki-" + course["id"] + "'")
        if file.name == "notebook-blocks.js":
            code = code.replace('bok\\/1-klasse', 'bok\\/1-klasse|irn\\/1-klasse')
            code = code.replace('bok\\/(?:1|4)-klasse', '(?:bok|irn)\\/(?:1|4)-klasse')
            code = code.replace('ki-last-opened-bok-1', 'ki-last-opened-' + course["id"])
            code = code.replace('ki-last-opened-bok-4', 'ki-last-opened-' + course["id"])
        file.write_text(code, encoding="utf-8")
    if course["grade"] == 1:
        script = target / "basis.js"
        script.write_text(script.read_text(encoding="utf-8").replace("kst-ki-basis-", "kst-ki-" + course["id"] + "-"),
                          encoding="utf-8")
    if course["grade"] == 4:
        progress = target / "progress.js"
        data = progress.read_text(encoding="utf-8")
        data = data.replace("kst-ki-projekt-2026-v1", "kst-ki-" + course["id"] + "-progress-v1")
        data = data.replace("ki-projekt-seitenstand-v1", "ki-" + course["id"] + "-seitenstand-v1")
        data = data.replace("kst-ki-nav-collapsed", "kst-ki-" + course["id"] + "-nav-collapsed")
        data = data.replace("ki-projekt-seitenstand.json", "ki-" + course["id"] + "-seitenstand.json")
        progress.write_text(data, encoding="utf-8")
    if course["grade"] == 1:
        persistence = target / "persistence.js"
        code = persistence.read_text(encoding="utf-8")
        code = code.replace("kst-ki-basis", "kst-ki-" + course["id"])
        code = code.replace("ki-basis-zip", "ki-" + course["id"] + "-zip")
        code = code.replace("ki-last-opened-bok-1", "ki-last-opened-" + course["id"])
        code = code.replace("'portal/'+name", "'" + prefix + "'+name")
        code = code.replace("'portal/'+current", "'" + prefix + "'+current")
        persistence.write_text(code, encoding="utf-8")
    # No public teacher solutions under a teacher's student course route.
    import shutil
    shutil.rmtree(target / "musterloesungen", ignore_errors=True)
