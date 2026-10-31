"""Check teacher-scoped public URLs and backwards-compatible entrypoints."""
from pathlib import Path
import json
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_course_routes import add_path_depth
assert add_path_depth("../lab/") == "../../lab/"
assert add_path_depth("../../projekt/archive.js") == "../../../projekt/archive.js"
assert add_path_depth("https://example.org/a/../b") == "https://example.org/a/../b"

ROOT = Path(__file__).resolve().parents[1]
dist = ROOT / "dist"
manifest = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))
assert len(manifest["courses"]) == 4
expected = {"bok/1-klasse", "bok/4-klasse", "irn/1-klasse", "irn/4-klasse"}
assert {row["slug"] for row in manifest["courses"]} == expected
overview = (dist / "kurse.html").read_text(encoding="utf-8")
for slug in expected:
    assert (dist / slug / "index.html").is_file(), slug
    assert f'href="{slug}/"' in overview, slug
for slug, legacy in [("bok/1-klasse", "basis"), ("bok/4-klasse", "projekt")]:
    generated = (dist / slug / "index.html").read_text(encoding="utf-8")
    assert "BOK" in generated and f"{slug.split('/')[1][0]}. Klasse" in generated
    assert (dist / legacy / "index.html").is_file()
    assert 'href="../../kurse.html"' in generated
    assert (dist / slug / "grafiken/kst_logo.png").is_file()
    assert (dist / slug / "kurs.json").is_file()
    assert (dist / slug / "unterrichtsplan.html").is_file()
    assert not re.search(r'(?<!\\.)href="../kurse.html"', generated)
assert 'from \'../../projekt/archive.js\'' in (dist / "bok/1-klasse/persistence.js").read_text(encoding="utf-8")
assert "'../../lab/index.html?path='" in (dist / "bok/4-klasse/portal.js").read_text(encoding="utf-8")
assert (dist / "lab/index.html").is_file(), "Shared notebook runtime must remain available"
for slug in ("irn/1-klasse", "irn/4-klasse"):
    page = (dist / slug / "index.html").read_text(encoding="utf-8")
    assert "in Vorbereitung" in page
    assert "BOK" not in page
assert 'url=kurse.html' in (dist / "index.html").read_text(encoding="utf-8")
print("PASS 4 teacher/grade URLs, BOK course assets and legacy links, IRN placeholders")
