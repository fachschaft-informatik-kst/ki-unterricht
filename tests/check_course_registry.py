"""Regression: adding an independent teacher needs no BOK or IRN source edits."""
import json
from pathlib import Path
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from course_registry import load_registry,validate_registry
from add_teacher_course import create
from generic_course import generic_page
from course_model import load_course

known=load_registry(ROOT)
assert {"bok/1-klasse","bok/4-klasse","irn/1-klasse","irn/4-klasse"} <= {
    c["slug"] for c in known}
for course in known:
    source_root = ROOT / course["manifest"]
    folder = source_root.parent
    assert source_root.is_file()
    manifest = json.loads(source_root.read_text(encoding="utf-8"))
    assert len(manifest["sections"]) >= 1
    template = ROOT / "kursseiten/template" / f'{course["grade"]}-klasse'
    assert template.is_dir(), template
    assert (template / "manifest.json").read_bytes() == source_root.read_bytes()
    for section in manifest["sections"]:
        assert (folder / section["id"]).is_dir(), (course["slug"], section["id"])
        assert (template / section["id"]).is_dir()
    for kind, path in course["teacherFiles"].items():
        assert (ROOT / path).is_file(), (course["slug"], kind, path)
        assert (ROOT / path).read_bytes() == (template / (Path(path).relative_to(folder))).read_bytes()

# A duplicated section ID across copied courses is valid; file ownership is not shared.
bok1 = known[0]
irn1 = known[2]
assert (ROOT / bok1["manifest"]).read_bytes() == (ROOT / irn1["manifest"]).read_bytes()
assert (ROOT / bok1["manifest"]).resolve() != (ROOT / irn1["manifest"]).resolve()

with tempfile.TemporaryDirectory() as temporary:
    target=Path(temporary)
    (target/"shared").mkdir()
    (target/"shared/course-sites.json").write_text(
        json.dumps({"version":1,"courses":[]}),encoding="utf-8")
    preview=create(target,"MAI",1,"KI entdecken",dry_run=True)
    assert not (target/"kursseiten").exists(), "Dry run must not create files"
    generated=create(target,"MAI",1,"KI entdecken",accent="#684e9b")
    assert all(file.is_file() for file in generated)
    assert len(load_registry(target))==1
    owner=load_registry(target)[0]
    assert owner["manifest"]=="kursseiten/mai/1-klasse/manifest.json"
    assert owner["sectionPrefix"]=="mai-1-"
    assert owner["notebookPrefix"]=="mai1_"
    model=load_course(target,owner["manifest"])
    assert len(model["lessons"])==1 and model["lessons"][0]["view"]=="mai-1-kurs"
    assert owner["status"]=="planned" and owner["source"] is None
    assert "MAI" in (target/owner["teacherFiles"]["solutions"]).read_text(encoding="utf-8") or (
        target/owner["teacherFiles"]["solutions"]).is_file()
    try:
        create(target,"MAI",1,"Doppelter Kurs")
        assert False,"Duplicate teacher course must be refused"
    except ValueError:
        pass
    data=json.loads((target/"shared/course-sites.json").read_text(encoding="utf-8"))
    course=data["courses"][0]
    course["status"]="published";course["source"]="generated"
    validate_registry([course],target)
    page=generic_page(course,target)
    assert 'data-course="mai-1-klasse"' in page
    assert "kst-ki-" in page and "antworten-v1" in page
    assert 'data-answer="mai-1-erste-frage"' in page
    assert "BOK" not in page and "IRN" not in page
    bad=structured=course.copy()
    bad["sectionPrefix"]="basis-"
    try:
        validate_registry([bad],target)
        assert False,"Cross-course source namespace must be refused"
    except ValueError:
        pass
print("PASS unique BOK/IRN ownership and new teacher scaffolding/publication")
