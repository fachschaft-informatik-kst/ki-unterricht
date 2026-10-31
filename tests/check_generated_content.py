"""Generated course pages must come from tracked sources, never from Git blobs."""
from pathlib import Path
import subprocess
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ("_build/site/projekt/index.html", "_build/site/projekt/unterrichtsplan.html")
for rel in GENERATED:
    path = ROOT / rel
    assert path.is_file(), f"Build missing: {rel}"
    # The test runs in a git checkout on CI; generated files must not be tracked.
    tracked = subprocess.run(
        ["git", "ls-files", "--error-unmatch", "--", rel],
        cwd=ROOT, capture_output=True, text=True, check=False,
    )
    assert tracked.returncode != 0, f"Build artifact is tracked in git: {rel}"
    ignored = subprocess.run(
        ["git", "check-ignore", "-q", "--", rel],
        cwd=ROOT, check=False,
    )
    assert ignored.returncode == 0, f"Generated artifact should be ignored: {rel}"

fragment = ROOT / "kursseiten/einstieg/030-einstieg-3.md"
example = "farbigen Marken neben den Meilenstein-Titeln"
assert example in fragment.read_text(encoding="utf-8")
course = BeautifulSoup((ROOT / GENERATED[0]).read_text(encoding="utf-8"), "html.parser")
assert example in course.get_text(" ", strip=True)
assert course.select_one("#einstieg-3")

# The blue/orange legend must be explicit in each course and use genuinely
# distinct shared colours rather than first-year-only blue overrides.
for doc,scope in ((course,"#einstieg-3"),(BeautifulSoup((ROOT / "_build/site/basis/index.html").read_text(encoding="utf-8"),"html.parser"),"#basis-ki #einstieg-3")):
    intro=doc.select_one(scope+" .section-intro")
    assert intro and "blau" in intro.get_text().lower() and "orange" in intro.get_text().lower()
    assert len(intro.select(".marke.regeln"))==1 and len(intro.select(".marke.daten"))==1
    assert "KI-Winter" in intro.get_text() and "Klickt auf einen Titel" in intro.get_text()
shared_css=(ROOT / "projekt/portal.css").read_text(encoding="utf-8")
basis_css=(ROOT / "basis/basis.css").read_text(encoding="utf-8")
assert ".marke.regeln{background:#1e40af;color:#fff}" in shared_css
assert ".marke.daten{background:#9a3412;color:#fff}" in shared_css
assert "body .marke.daten" not in basis_css and "body .marke.regeln" not in basis_css


# Both DL1 timelines must expose nine editable, sourced picture panels.
basis=BeautifulSoup((ROOT / "_build/site/basis/index.html").read_text(encoding="utf-8"), "html.parser")
for doc,section in ((course,"#einstieg-3"),(basis,"#basis-ki #einstieg-3")):
    timeline=doc.select_one(section)
    assert timeline is not None, section
    events=timeline.select("ol.timeline > li")
    assert len(events)==9,(section,len(events))

    intro=timeline.select_one(".section-intro")
    thinking=timeline.select_one(".timeline-thinking")
    assert "Wie wurde aus einer Idee" in intro.get_text(" ",strip=True)
    assert thinking and "21. Jahrhundert" in thinking.get_text(" ",strip=True)
    assert "Welche Art von KI dominiert" in thinking.get_text(" ",strip=True)
    assert "Begründet eure Vermutung" in thinking.get_text(" ",strip=True)
    def panel_image(ident):
        return timeline.select_one(f'template[data-milestone-detail="{ident}"] img')
    assert "Turing_test_diagram.svg" in panel_image("turing")["src"]
    assert panel_image("dartmouth")["src"]=="grafiken/ki_dartmouth_1955.svg"
    assert panel_image("perzeptron")["src"]=="grafiken/neuron_entscheider.svg"
    assert "Deep_Blue_versus_Kasparov" in panel_image("deepblue")["src"]
    generated=timeline.select_one('template[data-milestone-detail="chatgpt"]')
    assert len(generated.select("figure img"))==2
    assert len(generated.select("figure .milestone-source a"))==2
    assert all("2022-08-30.png" in image["src"] for image in generated.select("figure img"))
    assert "Stable Diffusion" in generated.decode_contents()

    for item in events:
        trigger=item.select_one("button.milestone-trigger[data-milestone-open]")
        panel=item.select_one("template[data-milestone-detail]")
        assert trigger and panel and trigger["data-milestone-open"]==panel["data-milestone-detail"]
        assert trigger.get("aria-haspopup")=="dialog"
        image=panel.select_one("img[alt][src]")
        assert image and panel.select_one("figcaption").decode_contents().strip()
        ident=panel["data-milestone-detail"]
        source=panel.select_one(".milestone-source a[href]")
        assert source
        if ident=="dartmouth":
            assert image["src"]=="grafiken/ki_dartmouth_1955.svg"
            assert "A_Proposal_for_the_Dartmouth" in source["href"]
            assert "Nachzeichnung" in panel.decode_contents()
        elif ident=="perzeptron":
            assert image["src"]=="grafiken/neuron_entscheider.svg"
            assert source["href"].endswith("/projekt/grafiken/neuron_entscheider.svg")
            assert "DL 3" in panel.decode_contents()
        else:
            assert image["src"].startswith("https://commons.wikimedia.org/wiki/Special:FilePath/")
            assert source["href"].startswith("https://commons.wikimedia.org/wiki/File:")
            assert any(token in source.decode_contents() for token in ("CC ","CC0","gemeinfrei"))
for topic in ("basis-ki","basis-lernen","basis-neuron","basis-netze","basis-daten","basis-plan","basis-training","basis-abschluss","basis-sprache","basis-gesellschaft"):
    assert basis.select_one(f"#{topic} .glossary-related a[href^='#basis-glossar-']"), topic

plan = BeautifulSoup((ROOT / GENERATED[1]).read_text(encoding="utf-8"), "html.parser")
assert plan.select_one("#doppellektion-01")
for name in ("index.html", "admin.js", "plan-editor.js", "course-model.js", "course-rules.json"):
    assert (ROOT / "_build/site/projekt/admin" / name).is_file(), f"Editor asset missing: {name}"
assert course.select_one('nav a[href="#gesellschaft"]').get_text(strip=True) == "10KI & Gesellschaft"
# Layout and saved-state navigation contracts of the previous public portal.
# The content model may change, but these anchors and section classes must not.
expected_sections = [
    ("start", "hero"), ("lernziele", "section"), ("projekt", "hero"),
    ("bewertung", "section"), ("einstieg", "section"), ("lernarten", "section"),
    ("perzeptron", "section"), ("netze", "section"), ("journal", "section"),
    ("sprache", "section"), ("gesellschaft", "section"), ("sicherung", "section"), ("glossar", "section"),
]
actual_sections = [(node.get("id"), node.get("class", [""])[0])
                   for node in course.select("main > section[id]")]
assert actual_sections == expected_sections, (actual_sections, expected_sections)
expected_nav = ["start", "lernziele", "einstieg", "lernarten", "perzeptron",
                "netze", "projekt", "sprache", "gesellschaft", "glossar"]
actual_nav = [node.get("href", "")[1:] for node in course.select(".sidebar nav a")]
assert actual_nav == expected_nav, (actual_nav, expected_nav)
assert course.select_one("#projekt")["data-nav"] == "projekt"
assert course.select_one("#bewertung")["data-nav"] == "projekt"
assert course.select_one("#journal")["data-nav"] == "projekt"
assert course.select_one("#sicherung")["data-nav"] == "projekt"
assert len(course.select(".crumb img.school-logo")) == 1
assert course.select_one(".crumb img.school-logo")["src"] == "grafiken/kst_logo.png"
assert not plan.select('a[href="KI_Planung.md"]'), "Broken teacher plan download link"
assert (ROOT / "_build/site/projekt/admin/course-model.js").is_file()
assert (ROOT / "_build/site/projekt/admin/course-rules.json").is_file()

print("PASS untracked, reproducible course HTML and teacher plan from content sources")
