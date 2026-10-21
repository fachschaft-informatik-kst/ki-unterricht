"""Basic and advanced courses must build independently and remain pedagogically consistent."""
from pathlib import Path
import json
import sys

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course

basic = load_course(ROOT, "kursseiten/basis-manifest.json")
advanced = load_course(ROOT)
assert len(basic["lessons"]) == 10
assert len(advanced["lessons"]) >= 10
assert all(sum(p["minutes"] for p in lesson["phases"]) == 90 for lesson in basic["lessons"])
assert [lesson["number"] for lesson in basic["lessons"]] == list(range(1,11))
assert len({lesson["id"] for lesson in basic["lessons"]}) == 10
assert set(l["view"] for l in basic["lessons"]).isdisjoint({l["view"] for l in advanced["lessons"]})

base = ROOT / "_build/site/basis"
page = BeautifulSoup((base / "index.html").read_text(encoding="utf-8"), "html.parser")
assert page.select_one("#basis-start h1").get_text() == "KI entdecken"
assert len(page.select("main > section")) == 12
assert len(page.select("details.lesson-plan")) == 10
assert len(page.select("details.kapitel")) >= 30
assert len(page.select("[data-basis-answer]")) >= 24
assert len(page.select("a.course-card")) == 10
assert len(page.select(".nav > a")) == 12
assert page.select_one("#basis-neuron .basis-neuron table")
assert page.select_one("#basis-neuron img[src='grafiken/neuron_biologisch.svg']")
assert page.select_one("#basis-neuron #basis-neuron-vorbild")
assert page.select_one("#basis-sprache [data-basis-language] select[data-language-context]")
assert page.select_one("#basis-sprache #basis-sprache-papier")
assert page.select_one("#basis-sprache #basis-sprache-papagei iframe[src*='inf-schule.de']")
assert page.select_one("#basis-sprache #basis-sprache-netz img[src='grafiken/papagei_vs_netz.svg']")
assert page.select_one("#basis-sprache #basis-sprache-soekia.basis-optional")
assert len(page.select("#basis-sprache details.kapitel")) == 7
assert [l["view"] for l in basic["lessons"]] == ["basis-ki","basis-lernen","basis-neuron","basis-netze","basis-daten","basis-plan","basis-training","basis-abschluss","basis-sprache","basis-gesellschaft"]
assert [lesson["title"] for lesson in basic["lessons"]][7].lower().find("fachgespräch") >= 0
assert basic["lessons"][8]["view"] == "basis-sprache"
assert basic["lessons"][9]["view"] == "basis-gesellschaft"
assert page.select_one("#basis-netze [data-basis-network] table")
assert page.select_one("#basis-ki #einstieg-1")
assert page.select_one("#basis-lernen #lernarten-4")
assert page.select_one("#basis-lernen #memory-board")
assert page.select_one("#basis-gesellschaft #gesellschaft-1")
assert page.select_one(".crumb img.school-logo[src='grafiken/kst_logo.png']")
assert page.select_one("#basis-lernziele .grid.two")
assert len(page.select("#basis-lernziele .card")) == 7
assert not page.select("a[href='../projekt/']"), "Course switching must use the landing page, not direct cross-links"
assert page.select_one("a[href='../kurse.html']")
assert "Kantonsschule Stadelhofen Informatik Künstliche Intelligenz" in page.select_one(".crumb").get_text(" ",strip=True)
assert "Kantonsschule Stadelhofen" in page.get_text()
assert all(len(page.select(f"#{v} details.kapitel")) >= 2 for v in ("basis-neuron","basis-netze","basis-plan","basis-gesellschaft"))
assert "Sprachmodelle" in page.get_text()
assert "wahrscheinliche" in page.get_text()
assert page.select_one("a[href*='portal/basis_fotoprojekt.ipynb']")
assert (base/"persistence.js").is_file(), "Basis ZIP export/import controller missing"
for path in ["basis.css","basis.js","theme.css","kurs.json","unterrichtsplan.html"]:
    assert (base/path).is_file(), path
styles = (base/"theme.css").read_text(encoding="utf-8")
assert "--accent" in styles and ".sidebar" in styles
basic_style=(base/"basis.css").read_text(encoding="utf-8")
assert "--accent:#3653a3" in basic_style
assert (base/"grafiken/kst_logo.png").is_file(), "KST logo must be packaged with basic course"
assert (base/"grafiken/kst_logo.png").stat().st_size > 100, "Logo must contain real image data"
assert "basis-network-diagram" in basic_style
js=(base/"basis.js").read_text(encoding="utf-8")
assert "kst-ki-basis-v1" in js and "data-live-output" in js
assert "kst-ki-kursportal-v1" not in js
assert "kst-ki-kursportal-v1" in (ROOT/"projekt/portal.js").read_text(encoding="utf-8")
assert "kursseiten/basis-manifest.json" in (ROOT/"projekt/admin/admin.js").read_text(encoding="utf-8")
assert "basis-manifest.json" in (ROOT/"admin-worker/src/index.mjs").read_text(encoding="utf-8")
assert "KI entdecken" in (base/"unterrichtsplan.html").read_text(encoding="utf-8")
assert "Papagei" in (base/"index.html").read_text(encoding="utf-8")
print("PASS ten differentiated 90-minute basic lessons, shared styling, live activity, separate storage and one editor")
