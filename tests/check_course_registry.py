"""Ensure BOK and IRN copies are truly independent and teachers can clone templates."""
import json
import shutil
import tempfile
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from course_registry import load_registry, validate_registry
from add_teacher_course import create
from course_model import load_course

known=load_registry(ROOT)
assert {"bok/1-klasse","bok/4-klasse","irn/1-klasse","irn/4-klasse"} <= {c["slug"] for c in known}
assert len({c["courseRoot"] for c in known})==len(known)
for course in known:
    source=ROOT/course["courseRoot"]
    manifest=json.loads((ROOT/course["manifest"]).read_text(encoding="utf-8"))
    assert len(manifest["sections"])>=10
    for section in manifest["sections"]:
        assert (source/"kursseiten"/section["id"]).is_dir()
    for path in course["teacherFiles"].values():
        assert (ROOT/path).is_file()
    model=load_course(ROOT,course["manifest"])
    assert len(model["lessons"])>=10
for grade in (1,4):
    template=ROOT/"templates"/f"{grade}-klasse"
    assert (template/"kursseiten/manifest.json").is_file()
    for teacher in ("bok","irn"):
        copied=ROOT/"kurse"/teacher/f"{grade}-klasse"
        assert copied.resolve()!=template.resolve()
        assert not copied.is_symlink()
        assert (copied/"kursseiten/manifest.json").read_bytes()==(template/"kursseiten/manifest.json").read_bytes()
        assert (copied/"kursseiten/glossar.json").is_file()
        assert (copied/"lehrperson/musterloesungen.md").is_file()
        assert list((copied/"content").rglob("*.ipynb"))
with tempfile.TemporaryDirectory() as folder:
    target=Path(folder)
    (target/"shared").mkdir()
    (target/"shared/course-sites.json").write_text(json.dumps({"version":1,"courses":[]}),encoding="utf-8")
    shutil.copytree(ROOT/"templates/1-klasse",target/"templates/1-klasse")
    dry=create(target,"MAI",1,"KI entdecken",dry_run=True)
    assert not (target/"kurse").exists()
    created=create(target,"MAI",1,"KI entdecken",accent="#684e9b")
    assert all(path.is_file() for path in created)
    owner=load_registry(target)[0]
    assert owner["manifest"]=="kurse/mai/1-klasse/kursseiten/manifest.json"
    assert owner["sectionPrefix"]=="basis-"
    assert len(load_course(target,owner["manifest"])["lessons"])>=10
    assert owner["status"]=="planned" and owner["source"] is None
    assert (target/"kurse/mai/1-klasse/content").is_dir()
    try: create(target,"MAI",1,"Doppelter Kurs")
    except ValueError: pass
    else: raise AssertionError("Duplicate teacher should fail")
    entry=json.loads((target/"shared/course-sites.json").read_text(encoding="utf-8"))["courses"][0]
    entry["status"]="published"; entry["source"]="generated"
    validate_registry([entry],target)
    broken=entry.copy();broken["courseRoot"]="kurse/bok/1-klasse"
    try: validate_registry([broken],target)
    except ValueError: pass
    else: raise AssertionError("Cross-course ownership must fail")
print("PASS independent BOK/IRN copies, complete templates, teacher onboarding")
