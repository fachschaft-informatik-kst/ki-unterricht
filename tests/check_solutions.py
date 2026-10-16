"""Check solution content and absence of direct links in the public course UI."""
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"lehrperson/musterloesungen.md"
file=ROOT/"projekt/musterloesungen/index.html"
assert src.is_file() and file.is_file()
soup=BeautifulSoup(file.read_text(encoding="utf-8"),"html.parser")
assert soup.select_one('meta[name="robots"]')["content"]=="noindex, nofollow, noarchive"
assert "Musterlösungen" in soup.h1.get_text()
assert len(soup.select("h2")) >= 7
content=soup.get_text(" ",strip=True)
for keyword in ("MobileNet","16 Neuronen","60 Epochen","XOR","Schulweg",
                "Testfreigabe","O'Neil","A/B","Papagei","Fremdauswertung"):
    assert keyword in content,keyword
for path in ("projekt/index.html","projekt/index.template.html","projekt/portal.js",
             "projekt/progress.js","projekt/portal.css"):
    assert "musterloesungen" not in (ROOT/path).read_text(encoding="utf-8").lower(),path
print("PASS complete teacher model-answer page, direct URL only, no student links")
