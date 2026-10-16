"""Build the teacher's per-lesson material kit and real offline downloads.

The editable lesson-specific material is lehrperson/materialien.md. Lesson titles
and checks are driven by projekt/kurs.json. All local links must resolve.
"""
from __future__ import annotations

import html
from pathlib import Path
import re
import shutil

from bs4 import BeautifulSoup
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "lehrperson/materialien.md"
OUTPUT = ROOT / "projekt/materialien.html"
DOWNLOADS = ROOT / "projekt/materialien/downloads"

# Teacher material that exists in the repository but is not normally deployed
# with the public student JupyterLite portal.
FILES = {
    "perzeptron_und_neuronale_netze.ipynb": "content/perzeptron_und_neuronale_netze.ipynb",
    "mehrschichtige_netze.ipynb": "content/mehrschichtige_netze.ipynb",
    "daten_training.ipynb": "content/daten_training.ipynb",
    "ki_tandemprojekt.ipynb": "content/ki_projekt/ki_tandemprojekt.ipynb",
    "ki_lernlabor.ipynb": "content/ki_projekt/ki_lernlabor.ipynb",
    "ki_fotodaten.md": "content/ki_projekt/ki_fotodaten.md",
    "ki_projektauftrag.md": "content/ki_projekt/ki_projektauftrag.md",
    "KI_Bewertungsraster.md": "worksheets/md/KI_Bewertungsraster.md",
    "Arbeitsblatt_Perzeptron.md": "worksheets/md/Arbeitsblatt_Perzeptron.md",
    "Arbeitsblatt_Perzeptron_Lsg.md": "worksheets/md/Arbeitsblatt_Perzeptron_Lsg.md",
    "koordinatengitter_perzeptron.svg": "worksheets/md/svg/koordinatengitter_perzeptron.svg",
    "koordinatengitter_or_nand_xor_leer.svg": "worksheets/md/svg/koordinatengitter_or_nand_xor_leer.svg",
}

STYLE = """
:root {--ink:#182b31;--muted:#52656a;--accent:#076959;--paper:#f5f4ee;--line:#d8dfdb;--soft:#e7f1eb}
* {box-sizing:border-box}
html {scroll-behavior:smooth;scroll-padding-top:20px}
body {background:var(--paper);color:var(--ink);font:16px/1.58 system-ui,-apple-system,"Segoe UI",sans-serif;margin:0}
main {max-width:1180px;margin:auto;padding:35px 30px 100px}
a {color:var(--accent);text-underline-offset:3px}
h1,h2,h3 {line-height:1.27;letter-spacing:-.025em}
h1 {font-size:clamp(2.1rem,4vw,3.3rem);margin:12px 0 18px}
h2 {font-size:1.7rem;margin:0 0 16px}
h3 {font-size:1.12rem;margin:22px 0 9px}
p,li {overflow-wrap:break-word}
li {margin:6px 0}
nav.quick {display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 35px}
nav.quick a,.tool-link {display:inline-block;background:#fff;border:1px solid var(--line);border-radius:8px;padding:7px 12px;text-decoration:none;font-size:14px}
nav.quick a:hover,.tool-link:hover {background:var(--soft)}
.lead {color:var(--muted)}
.lesson-resources {background:white;padding:26px 30px;margin:24px 0;border:1px solid var(--line);border-radius:14px}
.lesson-resources>p:first-of-type {color:var(--muted)}
.lesson-resources>h3 {border-top:1px solid var(--line);padding-top:16px}
.lesson-resources ul {padding-left:22px}
.lesson-resources li {margin:5px 0}
.print-sheet {position:relative;background:#f8faf8;border:1px solid #cbdcd1;border-radius:12px;padding:16px 20px;margin:20px 0}
.print-sheet h3 {margin:6px 0 13px}
.print-this {display:block;margin:0 0 12px auto;background:var(--accent);border:0;color:white;border-radius:7px;padding:8px 13px;cursor:pointer;font-weight:650}
.print-this:hover {filter:brightness(.92)}
table {width:100%;border-collapse:collapse;font-size:14px;margin:13px 0}
th,td {border:1px solid #bccfc7;padding:9px 11px;text-align:left;vertical-align:top}
th {background:#e7f1eb}
code {background:#e7eee9;border-radius:4px;padding:2px 4px}
footer {margin:35px 0;color:var(--muted);font-size:13px}
@media(max-width:680px) {main{padding:18px 12px 60px}.lesson-resources{padding:17px 14px}table{display:block;overflow-x:auto;white-space:normal}.print-sheet{padding:12px 10px}}
@media print {
 body {background:white;color:#000;font-size:12pt}
 main {padding:0;max-width:none}
 .quick,.print-this,footer {display:none!important}
 .lesson-resources {break-before:page;border:0;padding:0;margin:0 0 14px}
 .print-sheet {break-inside:avoid;border:1px solid #777;background:white;margin:14px 0}
 table {font-size:10pt}th,td {padding:6px}
 body.print-one header,body.print-one .quick,body.print-one footer,body.print-one .lesson-resources {display:none!important}
 body.print-one .lesson-resources:has(.print-active) {display:block!important}
 body.print-one .lesson-resources:has(.print-active)>* {display:none!important}
 body.print-one .lesson-resources .print-active {display:block!important;border:0;padding:0;margin:0}
 body.print-one .lesson-resources .print-active>* {display:block}
 body.print-one .lesson-resources .print-active .print-this {display:none!important}
}
"""

SCRIPT = """
document.querySelectorAll('.print-this').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.print-active').forEach(el => el.classList.remove('print-active'));
    const section = document.getElementById(button.dataset.sheet);
    if (!section) return;
    section.classList.add('print-active');
    document.body.classList.add('print-one');
    window.print();
  });
});
window.addEventListener('afterprint', () => {
  document.body.classList.remove('print-one');
  document.querySelectorAll('.print-active').forEach(el => el.classList.remove('print-active'));
});
"""

def build(lessons: list[dict]) -> None:
    assert len(lessons) == 10
    for name, rel in FILES.items():
        src = ROOT / rel
        if not src.is_file():
            raise FileNotFoundError(f"Teacher download is missing: {rel}")
        DOWNLOADS.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, DOWNLOADS / name)

    source = SOURCE.read_text(encoding="utf-8")
    md = MarkdownIt("commonmark", {"html": False}).enable("table")
    soup = BeautifulSoup(
        '<div id="materials-content">' + md.render(source) + "</div>", "html.parser"
    )
    content = soup.find(id="materials-content")
    heading = content.find("h1", recursive=False)
    assert heading and "Materialkoffer" in heading.get_text()
    headers = content.find_all("h2", recursive=False)
    expected = [f"Doppellektion {int(l['id']):02d}" for l in lessons]
    actual = [h.get_text(strip=True) for h in headers]
    if actual != expected:
        raise ValueError(f"Material headings must exactly match lesson order: {actual!r}")

    for lesson, header in zip(lessons, headers):
        n = lesson["id"]
        group = soup.new_tag("section", id=f"dl-{n}", attrs={"class": "lesson-resources"})
        header.insert_before(group)
        node = header
        while node is not None and (node is header or node.name != "h2"):
            next_node = node.find_next_sibling()
            group.append(node.extract())
            node = next_node
        header.string = f"Doppellektion {int(n)} · {lesson['title']}"
        for j, h3 in enumerate(group.find_all("h3", recursive=False), start=1):
            if not h3.get_text(strip=True).startswith("Druckvorlage:"):
                continue
            id_ = f"druck-{n}-{j}"
            card = soup.new_tag("article", id=id_, attrs={"class": "print-sheet"})
            h3.insert_before(card)
            node = h3
            while node is not None and (node is h3 or node.name != "h3"):
                next_node = node.find_next_sibling()
                card.append(node.extract())
                node = next_node
            button = soup.new_tag("button", attrs={
                "type": "button", "class": "print-this", "data-sheet": id_
            })
            button.string = "Nur dieses Blatt drucken"
            card.insert(0, button)

    links = [
        f'<a href="#dl-{l["id"]}">{int(l["id"])} · {html.escape(l["title"])}</a>'
        for l in lessons
    ]
    top = '<nav class="quick" aria-label="Doppellektionen">' + "".join(links) + "</nav>"
    document = f"""<!doctype html>
<html lang="de-CH">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<title>Materialkoffer · KI-Unterricht · Lehrperson</title><style>{STYLE}</style></head>
<body><main>
<header><p class="lead">Kantonsschule Stadelhofen · Informatik · Lehrpersonenmaterial</p>
<p><a href="unterrichtsplan.html">← Unterrichtsplan</a> · <a href="index.html">Kursseite</a></p></header>
{top}{str(content)}
<footer>Die Quellen liegen unter <code>lehrperson/materialien.md</code>. Verlinkte Notebooks und Arbeitsblätter werden für diese Seite beim Build mitkopiert. Externe Angebote brauchen Internet.</footer>
</main><script>{SCRIPT}</script></body></html>
"""
    OUTPUT.write_text(document, encoding="utf-8")
    print(f"Built teacher material kit: {len(lessons)} lessons, {len(FILES)} downloads")

if __name__ == "__main__":
    import json
    build(json.loads((ROOT / "projekt/kurs.json").read_text(encoding="utf-8"))["lessons"])
