"""One renderer handles existing topics, inserted topics and grouped lessons."""
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import shutil
import sys
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import build_portal
import build_course
import build_materials
import build_solutions
from course_model import load_course, output
from new_lesson import create

with TemporaryDirectory() as tmp:
    root = Path(tmp)
    for folder in ("kursseiten", "projekt", "lehrperson", "worksheets", "content", "shared", "experimente"):
        shutil.copytree(ROOT / folder, root / folder, ignore=shutil.ignore_patterns("__pycache__", "portal", "materialien", "musterloesungen", "index.html", "unterrichtsplan.html", "materialien.html"))
    create(root, "KI im Alltag", after="03")
    create(root, "Vertiefung", section="ki-im-alltag", after="ki-im-alltag")
    target = output(root)
    with patch.multiple(build_solutions, SOURCE=root/"lehrperson/musterloesungen.md",
                        OUTPUT=target/"musterloesungen/index.html"):
        with patch.multiple(build_portal, ROOT=root, PAGES=root/"kursseiten", PORTAL=root/"projekt"):
            build_portal.build()
    with patch.multiple(build_materials, ROOT=root, SOURCE=root/"lehrperson/materialien.md",
                        OUTPUT=target/"materialien.html", DOWNLOADS=target/"materialien/downloads"):
        with patch.object(build_course, "ROOT", root):
            build_course.build()
    soup = BeautifulSoup((target/"index.html").read_text(), "html.parser")
    assert soup.select_one("section#ki-im-alltag details.kapitel")
    assert len(soup.select("#ki-im-alltag .lesson-plan")) == 2
    nav = [a["href"] for a in soup.select(".nav > a")]
    assert nav.index("#perzeptron") < nav.index("#ki-im-alltag") < nav.index("#netze")
    assert soup.select_one('.course-card[href="#ki-im-alltag"]')
    assert soup.select_one("#doppellektion-03"), "Existing lesson URL must survive insertion"
    assert soup.select_one("#doppellektion-vertiefung")
    material = BeautifulSoup((target/"materialien.html").read_text(), "html.parser")
    assert len(material.select(".lesson-resources")) == 12
    assert material.select_one("#dl-vertiefung")
    assert [s["id"] for s in material.select(".lesson-resources")] == [
        "dl-" + l["id"] for l in load_course(root)["lessons"]
    ]
    course = load_course(root)
    assert next(l for l in course["lessons"] if l["id"] == "04")["number"] == 6
    assert "<!-- KURSPLAN -->" in (root/"worksheets/md/KI_Planung.md").read_text()
    assert "Vertiefung" in (target/"KI_Planung.md").read_text()
print("PASS full new-topic build, grouped lessons, inserted navigation, teacher material and source isolation")
