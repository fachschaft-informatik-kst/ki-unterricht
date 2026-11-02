"""Check solution content and absence of direct links in the public course UI."""
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"lehrperson/musterloesungen.md"
file=ROOT/"_build/site/projekt/musterloesungen/index.html"
assert src.is_file() and file.is_file()
soup=BeautifulSoup(file.read_text(encoding="utf-8"),"html.parser")
assert soup.select_one('meta[name="robots"]')["content"]=="noindex, nofollow, noarchive"
assert "Musterlösungen" in soup.h1.get_text()
assert len(soup.select("h2")) >= 7
content=soup.get_text(" ",strip=True)
for keyword in ("MobileNet","16 Neuronen","60 Epochen","XOR","Schulweg",
                "Testfreigabe","O'Neil","A/B","Papagei","Fremdauswertung"):
    assert keyword in content,keyword
for path in ("_build/site/projekt/index.html","projekt/index.template.html","projekt/portal.js",
             "projekt/progress.js","projekt/portal.css"):
    assert "musterloesungen" not in (ROOT/path).read_text(encoding="utf-8").lower(),path


# Every saved student response needs an explicit teacher example.
# Check the editable sources (including legacy/optional fields), not only a
# manually maintained list, so future new fields break CI until documented.
import re

COURSES = {
    "1. Klasse": {
        "files": list((ROOT / "kursseiten").glob("basis-*/*.md")) + [ROOT / "basis/index.template.html"],
        "attributes": ("data-basis-answer",),
        "solution": ROOT / "lehrperson/musterloesungen-felder-1-klasse.md",
    },
    "4. Klasse": {
        "files": [
            p for p in (ROOT / "kursseiten").glob("*/*.md")
            if not p.parent.name.startswith("basis-")
        ],
        "attributes": ("data-answer", "data-journal"),
        "solution": ROOT / "lehrperson/musterloesungen-felder-4-klasse.md",
    },
}
for course, conf in COURSES.items():
    documented = {
        match.group(1): match.group(2).strip()
        for match in re.finditer(r"(?m)^\|\s*\`([^\`]+)\`\s*\|\s*(.+?)\s*\|\s*$",
                                 conf["solution"].read_text(encoding="utf-8"))
    }
    fields = {}
    for path in conf["files"]:
        src_text = path.read_text(encoding="utf-8")
        for attr in conf["attributes"]:
            pattern = r'<(?:textarea|input|select)\b[^>]*\b' + attr + r'=["\x27]([^"\x27]+)["\x27]'
            for key in re.findall(pattern, src_text, re.IGNORECASE | re.DOTALL):
                fields.setdefault(key, []).append(path.relative_to(ROOT).as_posix())
    missing = sorted(set(fields) - set(documented))
    weak = sorted(k for k in fields if k in documented and not documented[k])
    assert not missing, f"{course}: Musterlösung fehlt für {[(k, fields[k]) for k in missing]}"
    assert not weak, f"{course}: zu kurze Musterlösung für {weak}"
    print(f"PASS {course}: {len(fields)} Antwortfelder mit einzelnen Musterlösungen")

for required in ("Apfel", "Birne", "Gabel", "Löffel", "P1/P2", "Trennschärfe"):
    # All example values are explicitly marked as illustrative in the preface.
    # The case study must retain two own and two different foreign classes.
    text = (ROOT / "lehrperson/musterloesungen-felder-4-klasse.md").read_text(encoding="utf-8")
    assert required in text, required

print("PASS complete teacher model-answer page, direct URL only, no student links")
