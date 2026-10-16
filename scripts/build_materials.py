"""Build the teacher's compact graphical resource index and offline downloads."""
from __future__ import annotations

import html
from pathlib import Path
import shutil

from bs4 import BeautifulSoup
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "lehrperson/materialien.md"
OUTPUT = ROOT / "projekt/materialien.html"
DOWNLOADS = ROOT / "projekt/materialien/downloads"

# Reuse the maintained source files rather than maintaining separate copies.
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
    "perzeptron_lernregel_flussdiagramm.svg": "content/img/perzeptron_lernregel_flussdiagramm.svg",
    "perzeptron_bias_shift.svg": "worksheets/md/svg/perzeptron_bias_shift.svg",
    "koordinatengitter_perzeptron_and_loesung.svg": "worksheets/md/svg/koordinatengitter_perzeptron_and_loesung.svg",
    "koordinatengitter_xor_einfach.svg": "worksheets/md/svg/koordinatengitter_xor_einfach.svg",
    "koordinatengitter_or_nand_xor.svg": "worksheets/md/svg/koordinatengitter_or_nand_xor.svg",
    "koordinatengitter_or_nand_xor_leer.svg": "worksheets/md/svg/koordinatengitter_or_nand_xor_leer.svg",
}

STYLE = """
:root{--ink:#182b31;--muted:#52656a;--accent:#076959;--paper:#f5f4ee;--line:#d8dfdb;--soft:#e7f1eb}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:20px}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1040px;margin:auto;padding:36px 30px 80px}
a{color:var(--accent);text-underline-offset:3px}
h1,h2,h3{line-height:1.25;letter-spacing:-.02em}
h1{font-size:clamp(2rem,4vw,2.9rem);margin:10px 0 12px}
h2{font-size:1.42rem;margin:0 0 17px}
h3{font-size:1rem;margin:22px 0 10px;color:var(--muted)}
header{margin-bottom:25px}
header p{margin:7px 0;color:var(--muted)}
nav.quick{display:flex;flex-wrap:wrap;gap:7px;margin:24px 0 32px}
nav.quick a{padding:6px 12px;border:1px solid var(--line);background:white;text-decoration:none;border-radius:7px;font-size:14px}
nav.quick a:hover{background:var(--soft)}
.lesson-resources{background:white;border:1px solid var(--line);border-radius:12px;padding:24px 26px;margin:18px 0;scroll-margin-top:18px}
.lesson-resources ul{padding-left:22px;margin:8px 0 14px}
.lesson-resources li{padding:0 0 2px;overflow-wrap:break-word}
.lesson-resources>p{margin:12px 0 4px;color:var(--muted);font-size:14px}
.graphic-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:15px;margin:12px 0 22px}
.graphic-grid figure{margin:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fafcfb}
.graphic-grid a{display:flex;align-items:center;justify-content:center;padding:12px;background:white;min-height:160px}
.graphic-grid img{display:block;width:100%;height:220px;object-fit:contain}
.graphic-grid figcaption{padding:9px 13px;color:var(--muted);font-size:13px;line-height:1.4}
.graphic-grid figcaption .phase-label{display:block;margin:0 0 5px;color:var(--accent);font-weight:750;font-size:11px}
.lesson-resources table{width:100%;border-collapse:collapse;margin:14px 0 22px;font-size:14px}
.lesson-resources th,.lesson-resources td{border:1px solid var(--line);padding:9px 11px;text-align:left}
.lesson-resources th{background:#edf5ef}
footer{color:var(--muted);font-size:13px;padding-top:20px}
@media(max-width:600px){main{padding:20px 13px 60px}.lesson-resources{padding:17px 14px}.graphic-grid{grid-template-columns:1fr}.graphic-grid img{height:auto;max-height:250px}}
@media print{body{background:white}main{padding:0;max-width:none}nav.quick,header a{display:none}.lesson-resources{border:0;border-bottom:1px solid #aaa;border-radius:0;break-inside:avoid;padding:16px 0}.graphic-grid img{height:180px}.graphic-grid figure{break-inside:avoid}}
"""

def build(lessons: list[dict]) -> None:
    if len(lessons) != 10:
        raise ValueError("Expected exactly ten lessons")
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    for name, rel in FILES.items():
        path = ROOT / rel
        if not path.is_file():
            raise FileNotFoundError(f"Missing teacher download: {rel}")
        shutil.copyfile(path, DOWNLOADS / name)
        if name == "perzeptron_lernregel_flussdiagramm.svg":
            # Pin the exported draw.io background to white in the deployed copy.
            target = DOWNLOADS / name
            svg = target.read_text(encoding="utf-8")
            svg = svg.replace(
                "background-color: light-dark(#ffffff, var(--ge-dark-color, #121212)); color-scheme: light dark;",
                "background-color: #ffffff; color-scheme: light;"
            ).replace(
                "fill: light-dark(#ffffff, var(--ge-dark-color, #121212));",
                "fill: #ffffff;"
            )
            target.write_text(svg, encoding="utf-8")

    source = SOURCE.read_text(encoding="utf-8")
    soup = BeautifulSoup(
        '<div id="materials-content">' +
        MarkdownIt("commonmark", {"html": False}).enable("table").render(source) + "</div>",
        "html.parser"
    )
    content = soup.find(id="materials-content")
    if "Grafiken und Materialien" not in content.h1.get_text():
        raise ValueError("Missing material index heading")
    headers = content.find_all("h2", recursive=False)
    expected = [f"Doppellektion {int(l['id']):02d}" for l in lessons]
    if [h.get_text(strip=True) for h in headers] != expected:
        raise ValueError("Material sections must match the ten lessons")

    for lesson, heading in zip(lessons, headers):
        group = soup.new_tag("section", id=f"dl-{lesson['id']}",
                             attrs={"class": "lesson-resources"})
        heading.insert_before(group)
        node = heading
        while node is not None and (node is heading or node.name != "h2"):
            next_node = node.find_next_sibling()
            group.append(node.extract())
            node = next_node
        heading.string = f"Doppellektion {int(lesson['id'])} · {lesson['title']}"

        images = group.select("p > img")
        if images:
            grid = soup.new_tag("div", attrs={"class": "graphic-grid"})
            images[0].parent.insert_before(grid)
            for img in images:
                paragraph = img.parent
                src = img.get("src", "")
                alt = img.get("alt", "")
                if not src or not alt:
                    raise ValueError(f"Image requires source and description in lesson {lesson['id']}")
                phase_info = img.get("title", "")
                if " | " not in phase_info:
                    raise ValueError(f"Missing AVIVA assignment for {src}")
                phase, roles = phase_info.split(" | ", 1)
                p = next((p for p in lesson["phases"] if p["phase"] == phase), None)
                if p is None:
                    raise ValueError(f"Unknown AVIVA phase {phase} in lesson {lesson['id']}")
                allowed = {step["wer"] for step in p["schritte"]}
                for role in (r.strip() for r in roles.split("→")):
                    if role not in allowed:
                        raise ValueError(f"Unplanned AVIVA role {role} in lesson {lesson['id']}")
                figure = soup.new_tag("figure")
                link = soup.new_tag("a", href=src, target="_blank", rel="noopener")
                img.extract()
                img.attrs.pop("title", None)
                img["loading"] = "lazy"
                link.append(img)
                figure.append(link)
                caption = soup.new_tag("figcaption")
                tag = soup.new_tag("span", attrs={"class": "phase-label"})
                tag.string = phase + " · " + roles
                caption.append(tag)
                caption.append(alt)
                figure.append(caption)
                grid.append(figure)
                paragraph.decompose()

    links = "".join(f'<a href="#dl-{l["id"]}">{int(l["id"])} · {html.escape(l["title"])}</a>'
                    for l in lessons)
    OUTPUT.write_text(f"""<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link href="favicon.svg" rel="icon" type="image/svg+xml">
<title>Grafiken &amp; Materialien · KI-Unterricht</title><style>{STYLE}</style></head>
<body><main><header><p>Lehrpersonenmaterial · Kantonsschule Stadelhofen</p>
<p><a href="unterrichtsplan.html">← Unterrichtsplan</a> · <a href="index.html">Kursseite</a></p></header>
<nav class="quick" aria-label="Doppellektionen">{links}</nav>
{content}
<footer>Grafiken können durch Anklicken vergrössert werden. Die Quelle dieser Übersicht liegt in <code>lehrperson/materialien.md</code>.</footer>
</main></body></html>
""", encoding="utf-8")
    print(f"Built teacher extras: {len(lessons)} lessons, {len(FILES)} downloads")

if __name__ == "__main__":
    import json
    build(json.loads((ROOT / "projekt/kurs.json").read_text(encoding="utf-8"))["lessons"])
