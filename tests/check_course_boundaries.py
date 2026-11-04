"""Technical boundary contract: no authored course data outside kurse/."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for obsolete in ("kursseiten", "lehrperson", "content"):
    assert not (ROOT / obsolete).exists(), f"Legacy course data in root: {obsolete}"
assert not (ROOT / "scripts/sync_course_sources.py").exists()

courses = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
slugs = [course["slug"] for course in courses]
assert len(slugs) == len(set(slugs)) and len(slugs) >= 4

required_project = (
    "ki_projekt/fotostudio.html",
    "ki_projekt/fotostudio_core.js",
    "ki_projekt/fotostudio_storage.js",
    "ki_projekt/ki_foto_tools.py",
    "ki_projekt/ki_projekt_tools.py",
    "ki_projekt/foto_uebungsdaten.json",
    "unterricht_tools.py",
)
for course in courses:
    course_root = ROOT / course["courseRoot"]
    assert course_root == ROOT / "kurse" / course["slug"]
    pages = course_root / "kursseiten"
    teacher = course_root / "lehrperson"
    content = course_root / "content"
    assert (pages / "manifest.json").is_file(), course["slug"]
    assert (pages / "glossar.json").is_file(), course["slug"]
    for name in ("musterloesungen.md", "musterloesungen-felder.md"):
        assert (teacher / name).is_file(), f"{course['slug']} missing {name}"
    notebooks = sorted(content.rglob("*.ipynb"))
    assert notebooks, f"{course['slug']} has no notebook"
    assert len({item.name for item in notebooks}) == len(notebooks), course["slug"]
    for name in required_project:
        assert (content / name).is_file(), f"{course['slug']} missing {name}"
    published = ROOT / "dist" / course["slug"]
    if published.is_dir():
        for name in ("studio/index.html", "studio/fotostudio_storage.js",
                     "runtime/ki_foto_tools.py", "runtime/unterricht_tools.py"):
            assert (published / name).is_file(), f"{course['slug']} missing published {name}"
    print(f"PASS {course['slug']}: independent pages, teacher files and {len(notebooks)} notebooks")
print("PASS root contains no duplicated authored course sources")
