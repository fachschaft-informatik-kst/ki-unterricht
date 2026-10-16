"""Generated course pages must come from tracked sources, never from Git blobs."""
from pathlib import Path
import subprocess
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ("projekt/index.html", "projekt/unterrichtsplan.html")
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
print("PASS untracked, reproducible course HTML and teacher plan from content sources")
