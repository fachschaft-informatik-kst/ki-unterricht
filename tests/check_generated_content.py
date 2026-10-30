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
example = "Die Marke zeigt, worauf ein Meilenstein hauptsächlich beruht."
assert example in fragment.read_text(encoding="utf-8")
course = BeautifulSoup((ROOT / GENERATED[0]).read_text(encoding="utf-8"), "html.parser")
assert example in course.get_text(" ", strip=True)
assert course.select_one("#einstieg-3")
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
