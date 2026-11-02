"""Standalone blue teacher material index for the 1st-year course."""
from pathlib import Path
import html
import re
from markdown_it import MarkdownIt


def build(root: Path, out: Path, lessons: list[dict]) -> None:
    markdown = MarkdownIt("commonmark", {"html": False}).enable("table")
    links = []
    sections = []
    for lesson in lessons:
        material = root / "kursseiten" / lesson["view"] / "materialien.md"
        if not material.is_file():
            raise FileNotFoundError(f"Lehrpersonenmaterial fehlt: {material}")
        source = material.read_text(encoding="utf-8")
        # Old headings differ between lessons. The AVIVA lesson metadata is authoritative.
        source = re.sub(r"\A\s*##[^\n]*\n", "", source, count=1)
        title = html.escape(lesson["title"])
        ident = "dl-" + lesson["id"]
        label = str(lesson["number"]) + ". " + title
        links.append(f'<a href="#{ident}">{label}</a>')
        sections.append(
            f'<section class="basis-resource card" id="{ident}">'
            f'<h2>{label}</h2>{markdown.render(source)}</section>'
        )
    document = """<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Materialkoffer · KI entdecken · 1. Klasse</title>
<link rel="stylesheet" href="theme.css">
<link rel="stylesheet" href="../projekt/portal.css">
<link rel="stylesheet" href="basis.css">
<style>
main{max-width:1050px;margin:auto;padding:35px 28px 80px}
.basis-resource{margin:18px 0;scroll-margin-top:24px}
.basis-resource h2{font-size:1.5rem}
.materials-nav{display:flex;flex-wrap:wrap;gap:8px;margin:25px 0}
.materials-nav a{border:1px solid var(--line);border-radius:8px;background:white;padding:7px 11px;text-decoration:none}
</style></head><body><main>
<p><a href="index.html">← Zur Kursseite</a> · <a href="unterrichtsplan.html">Unterrichtsplan (AVIVA)</a></p>
<h1>Grafiken, Quellen und Materialien</h1>
<p class="section-intro">Materialkoffer für Lehrpersonen · 1. Kurzgymnasium. Zehn Doppellektionen zu je 90 Minuten.</p>
<nav class="materials-nav" aria-label="Doppellektionen">""" + "".join(links) + """</nav>
""" + "".join(sections) + """
<footer class="footer">Quelle: kursseiten/basis-*/materialien.md · Kantonsschule Stadelhofen</footer>
</main><script src="notebook-blocks.js" defer></script></body></html>
"""
    (out / "materialien.html").write_text(document, encoding="utf-8")
    print(f"Built first-year teacher material index: {len(lessons)} lessons")
