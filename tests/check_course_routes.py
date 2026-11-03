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
assert len(manifest["courses"]) >= 4
assert len({c["id"] for c in manifest["courses"]}) == 4
assert len({(c["teacher"], c["grade"]) for c in manifest["courses"]}) == 4
expected = {"bok/1-klasse", "bok/4-klasse", "irn/1-klasse", "irn/4-klasse"}
assert expected <= {row["slug"] for row in manifest["courses"]}
overview = (dist / "kurse.html").read_text(encoding="utf-8")
for slug in {row["slug"] for row in manifest["courses"]}:
    assert (dist / slug / "index.html").is_file(), slug
    assert f'href="{slug}/"' in overview
for slug, legacy in [("bok/1-klasse", "basis"), ("bok/4-klasse", "projekt")]:
    generated = (dist / slug / "index.html").read_text(encoding="utf-8")
    assert "BOK" in generated and f"{slug.split('/')[1][0]}. Klasse" in generated
    assert "data-course-theme" in generated
    assert (dist / legacy / "index.html").is_file()
    assert 'href="../../kurse.html"' in generated
    assert (dist / slug / "grafiken/kst_logo.png").is_file()
    assert not (dist / slug / "kurs.json").exists(), "The complete AVIVA JSON must not be public"
    assert not (dist / slug / "unterrichtsplan.html").exists()
    assert not (dist / slug / "materialien.html").exists()
    assert not (dist / slug / "musterloesungen").exists()
    assert "kst-ki-admin.kevin-bohn.workers.dev/teacher/" in generated
    assert 'href="https://kst-ki-admin.kevin-bohn.workers.dev/"' in generated, "Editor footer must link to authenticated Worker"
    assert not re.search(r'href="(?:admin/|\.\./projekt/admin/)"', generated), "Broken relative footer link"
    assert not re.search(r'(?<!\\.)href="../kurse.html"', generated)
assert 'from \'../../projekt/archive.js\'' in (dist / "bok/1-klasse/persistence.js").read_text(encoding="utf-8")
assert "'../../lab/index.html?path='" in (dist / "bok/4-klasse/portal.js").read_text(encoding="utf-8")
assert (dist / "lab/index.html").is_file(), "Shared notebook runtime must remain available"
assert (dist / "projekt/admin/index.html").is_file(), "Existing Cloudflare Worker editor must remain available"
for slug in ("irn/1-klasse", "irn/4-klasse"):
    page = (dist / slug / "index.html").read_text(encoding="utf-8")
    assert "in Vorbereitung" not in page
    assert "data-course-theme" in page
    assert "Jupyter" in page
    assert "lesson-plan" in page
    assert "portal/" + slug + "/" in page, "IRN notebooks need separate paths"
    for private in ("unterrichtsplan.html", "materialien.html", "kurs.json",
                    "musterloesungen/index.html"):
        assert not (dist / slug / private).exists(), "Public teacher-only file: "+slug+"/"+private
    assert "kst-ki-admin.kevin-bohn.workers.dev/teacher/" in page
    if slug.endswith("/4-klasse"):
        progress=(dist/slug/"progress.js").read_text(encoding="utf-8")
        assert "kst-ki-irn-4-klasse-progress-v1" in progress
        assert "kst-ki-projekt-2026-v1" not in progress
        portal=(dist/slug/"portal.js").read_text(encoding="utf-8")
        assert "course:'irn/4-klasse'" in portal
        assert "raw.course!=='irn/4-klasse'" in portal
        assert "'ki-irn-4-klasse-seitenstand-v1'" in portal
    else:
        persistence=(dist/slug/"persistence.js").read_text(encoding="utf-8")
        assert "kst-ki-irn-1-klasse-notebooks-v1" in persistence
        assert "kst-ki-basis-notebooks-v1" not in persistence
assert 'url=kurse.html' in (dist / "index.html").read_text(encoding="utf-8")
print("PASS 4 teacher/grade URLs, BOK course assets and legacy links, IRN placeholders")

for course in manifest["courses"]:
    slug = course["slug"]
    page = (dist / slug / "index.html").read_text(encoding="utf-8")
    tab_title = re.search(r"<title>([^<]*)</title>", page)
    assert tab_title and tab_title.group(1) == f'{course["teacher"]} KI {course["grade"]}. Klasse', slug
    assert course["theme"]["accent"] in page, slug
    assert f'style="--course-accent:{course["theme"]["accent"]}"' in overview, slug
    assert course["name"] in page or course["status"] == "published"
    assert f'href="{slug}/"' in overview
assert "COURSE_GROUPS_START" in overview

for root in ("basis", "projekt", "bok/1-klasse", "bok/4-klasse"):
    folder = dist / root
    for path in ("unterrichtsplan.html", "materialien.html", "KI_Planung.md",
                 "musterloesungen/index.html", "kurs.json", "materialien/downloads/Arbeitsblatt_Perzeptron_Lsg.md",
                 "materialien/downloads/KI_Bewertungsraster.md"):
        assert not (folder / path).exists(), f"Public teacher-only file: {root}/{path}"
