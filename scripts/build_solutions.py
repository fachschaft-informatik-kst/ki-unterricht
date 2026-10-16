"""Build a deliberately unlinked teacher answer page from editable Markdown."""
from pathlib import Path
from markdown_it import MarkdownIt
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "lehrperson/musterloesungen.md"
OUTPUT = ROOT / "projekt/musterloesungen/index.html"

def render(source: str) -> str:
    body = MarkdownIt("commonmark", {"html": False}).enable("table").render(source)
    return """<!doctype html><html lang="de-CH"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Musterlösungen · KI-Unterricht</title>
<style>
:root{--ink:#182b31;--muted:#52656a;--accent:#076959;--line:#d8dfdb}*{box-sizing:border-box}
body{margin:0;background:#f5f4ee;color:var(--ink);font:16px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:940px;margin:auto;padding:45px 30px 90px}header{padding-bottom:20px;border-bottom:1px solid var(--line)}
.eyebrow{color:var(--accent);font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:700}
h1,h2,h3{line-height:1.24}h1{font-size:clamp(2rem,5vw,3rem)}
h2{font-size:1.65rem;margin:45px 0 18px;border-bottom:2px solid #d3e5dc;padding-bottom:8px}
h3{font-size:1.2rem;margin:28px 0 11px}li{margin-bottom:8px}ul,ol{padding-left:25px}code{background:#e8f0ea;padding:2px 5px}
table{width:100%;border-collapse:collapse;font-size:.93rem}th,td{border:1px solid var(--line);padding:9px;text-align:left}th{background:#e7f1eb}
footer{border-top:1px solid var(--line);margin-top:50px;padding-top:15px;color:var(--muted);font-size:13px}
@media(max-width:600px){main{padding:20px 16px 60px}table{display:block;overflow:auto}}
@media print{body{background:white}main{max-width:none;padding:10px}h2,h3{break-after:avoid}}
</style></head><body><main>
<header><p class="eyebrow">Lehrpersonenmaterial · nicht im Kursportal verlinkt</p><p>Fachliche Musterantworten und ein beispielhaftes Tandemjournal. Offene Aufgaben erlauben mehrere begründete Antworten.</p></header>
""" + body + """
<footer>Über die direkte URL erreichbar und nicht in der Navigation verlinkt. Öffentlich zugänglich für alle, die die URL kennen; kein Passwortschutz.</footer>
</main></body></html>"""

def build() -> None:
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    OUTPUT.write_text(render(SOURCE.read_text(encoding="utf-8")),encoding="utf-8")
    print("Built unlinked teacher solution page")

if __name__ == "__main__":
    build()
