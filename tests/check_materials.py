"""Teacher resource kit: ten real lesson mappings, ready-to-print sheets, live local links."""
from pathlib import Path
from urllib.parse import urlsplit, unquote

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
P = ROOT / "projekt"
page = P / "materialien.html"
assert page.is_file(), "Build teacher material page before running this test"
soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
sections = soup.select("section.lesson-resources")
assert [s.get("id") for s in sections] == [f"dl-{i:02d}" for i in range(1, 11)]
assert len(soup.select("nav.quick a[href^='#dl-']")) == 10
assert len(soup.select("article.print-sheet")) >= 10
assert len(soup.select("button.print-this")) == len(soup.select("article.print-sheet"))
assert soup.select_one("meta[name='robots']")
for button in soup.select("button.print-this"):
    assert soup.select_one("#" + button["data-sheet"]) is not None

course = BeautifulSoup((P / "index.html").read_text(encoding="utf-8"), "html.parser")
plan = BeautifulSoup((P / "unterrichtsplan.html").read_text(encoding="utf-8"), "html.parser")
assert course.select_one('a[href="materialien.html"]')
for section in sections:
    assert section.select_one("h2")
    lesson = section["id"]
    assert plan.select_one("#doppellektion-" + lesson[-2:])
    assert len(section.select("a[href]")) >= 3, lesson

local_count = 0
for link in soup.select("a[href]"):
    href = link["href"]
    if href.startswith(("https://", "http://", "mailto:", "#")):
        continue
    url = urlsplit(href)
    target = P / unquote(url.path)
    if target.is_dir():
        target = target / "index.html"
    assert target.is_file(), f"Broken resource link: {href} -> {target}"
    if url.fragment:
        target_soup = BeautifulSoup(target.read_text(encoding="utf-8"), "html.parser")
        assert target_soup.find(id=unquote(url.fragment)), f"Broken anchor: {href}"
    local_count += 1
assert local_count >= 35, local_count
for essential in ("ki_tandemprojekt.ipynb", "KI_Bewertungsraster.md",
                  "perzeptron_und_neuronale_netze.ipynb", "daten_training.ipynb"):
    assert (P / "materialien/downloads" / essential).is_file(), essential
print(f"PASS teacher material kit: 10 lessons, print templates, {local_count} local links and downloads")
