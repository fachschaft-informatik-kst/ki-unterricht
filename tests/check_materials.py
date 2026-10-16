"""Check the compact teacher resource page, visible images and valid links."""
from pathlib import Path
from urllib.parse import urlsplit, unquote

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PORTAL = ROOT / "projekt"
page = PORTAL / "materialien.html"
assert page.is_file()
soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
sections = soup.select("section.lesson-resources")
assert [sec["id"] for sec in sections] == [f"dl-{n:02d}" for n in range(1, 11)]
assert len(soup.select("nav.quick a[href^='#dl-']")) == 10

# Real diagrams are shown inline and clickable; there are no synthetic memory
# cards, print templates, checklists or dead buttons.
figures = soup.select(".graphic-grid figure")
assert len(figures) >= 12, f"Expected the main course diagrams inline, got {len(figures)}"
for f in figures:
    img = f.select_one("a > img")
    assert img and img.get("alt")
    assert f.select_one("figcaption").get_text(strip=True) == img["alt"]
    assert f.a["href"] == img["src"]
assert not soup.select("article.print-sheet, button.print-this")
assert "Memory-Kartensatz" not in soup.get_text(" ", strip=True)
assert "Eigene vorhandene Memory-Spiele" in soup.get_text(" ", strip=True)
assert soup.select_one('meta[name="robots"]')

course = BeautifulSoup((PORTAL / "index.html").read_text(encoding="utf-8"), "html.parser")
plan = BeautifulSoup((PORTAL / "unterrichtsplan.html").read_text(encoding="utf-8"), "html.parser")
assert course.select_one('a[href="materialien.html"]')
for sec in sections:
    assert plan.find(id="doppellektion-" + sec["id"][-2:])
    assert len(sec.select("a[href]")) >= 2, sec["id"]

count = 0
for link in [*soup.select("a[href]"), *soup.select("img[src]")]:
    href = link.get("href") or link.get("src")
    if href.startswith(("https://", "http://", "mailto:", "#")):
        continue
    url = urlsplit(href)
    target = PORTAL / unquote(url.path)
    if target.is_dir():
        target = target / "index.html"
    assert target.is_file(), f"Broken local resource: {href}"
    if url.fragment:
        target_soup = BeautifulSoup(target.read_text(encoding="utf-8"), "html.parser")
        assert target_soup.find(id=unquote(url.fragment)), f"Broken anchor: {href}"
    count += 1
assert count >= 38, count
for required in ("perzeptron_und_neuronale_netze.ipynb", "ki_tandemprojekt.ipynb",
                 "KI_Bewertungsraster.md", "daten_training.ipynb"):
    assert (PORTAL / "materialien/downloads" / required).is_file()
print(f"PASS compact teacher resources: 10 lessons, {len(figures)} visible graphics and {count} valid links")
