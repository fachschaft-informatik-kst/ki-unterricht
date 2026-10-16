"""Additional lessons are generated without modifying the legacy HTML template."""
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from bs4 import BeautifulSoup
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
import build_portal
from build_course import render, PHASES

original=json.loads((ROOT/"projekt/kurs.json").read_text(encoding="utf-8"))
assert len(original["lessons"])>=10
with TemporaryDirectory() as tmp:
    target=Path(tmp)
    pages=target/"kursseiten"
    pages.mkdir()
    for name in json.loads((ROOT/"kursseiten/manifest.json").read_text())["sections"]:
        (pages/name).symlink_to(ROOT/"kursseiten"/name, target_is_directory=True)
    (pages/"manifest.json").write_text((ROOT/"kursseiten/manifest.json").read_text())
    folder=pages/"dl-11"
    folder.mkdir()
    (folder/"010-beispiel.md").write_text(
        "---\ntype: chapter\nid: dl-11-beispiel\nnummer: \"1\"\ntitel: \"Zusatzkapitel\"\nkurz: \"Neue Aufgabe\"\n---\n\nEine neue Doppellektion.\n",
        encoding="utf-8")
    portal=target/"projekt"
    portal.mkdir()
    (portal/"index.template.html").write_text((ROOT/"projekt/index.template.html").read_text(),encoding="utf-8")
    new=dict(original["lessons"][-1])
    new.update({"id":"11","view":"dl-11","title":"Neue Doppellektion"})
    original["lessons"].append(new)
    (portal/"kurs.json").write_text(json.dumps(original),encoding="utf-8")
    old_pages,old_portal=build_portal.PAGES,build_portal.PORTAL
    try:
        build_portal.PAGES,build_portal.PORTAL=pages,portal
        rendered=build_portal.assemble()
    finally:
        build_portal.PAGES,build_portal.PORTAL=old_pages,old_portal
    soup=BeautifulSoup(rendered,"html.parser")
    assert soup.select_one("section#dl-11 details#dl-11-beispiel")
    assert soup.select_one('nav.nav a[href="#dl-11"]')
    assert "<!-- LESSONS:dl-11 -->" in rendered
    assert soup.select_one("section#einstieg")
    assert "Neue Doppellektion" in render(new,True)
    assert [p["phase"] for p in new["phases"]]==PHASES
print("PASS dynamic lesson 11 with navigable Markdown and AVIVA plan")
