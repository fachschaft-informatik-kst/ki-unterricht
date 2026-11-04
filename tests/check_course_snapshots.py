"""Read-only source completeness checks; independent edits may differ from templates."""
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from export_course_templates import run
from course_registry import load_registry

for grade in (1,4):
    template=ROOT/"templates"/f"{grade}-klasse"
    assert (template/"kursseiten/manifest.json").is_file()
    reference=json.loads((template/"kursseiten/manifest.json").read_text(encoding="utf-8"))
    assert len(reference["sections"])>=10
    for teacher in ("bok","irn"):
        course=ROOT/"kurse"/teacher/f"{grade}-klasse"
        assert course.resolve()!=template.resolve() and not course.is_symlink()
        manifest=json.loads((course/"kursseiten/manifest.json").read_text(encoding="utf-8"))
        assert len(manifest["sections"])>=10
        assert (course/"kursseiten/glossar.json").is_file()
        assert (course/"lehrperson/musterloesungen.md").is_file()
        assert (course/"lehrperson/musterloesungen-felder.md").is_file()
        assert list((course/"content").rglob("*.ipynb"))
        for section in manifest["sections"]:
            folder=course/"kursseiten"/section["id"]
            assert list(folder.glob("[0-9][0-9][0-9]-*.md"))
            if section.get("teaching"):
                assert (folder/"planung.json").is_file() and (folder/"materialien.md").is_file()
run(ROOT,check=False)
assert len(load_registry(ROOT))>=4
print("PASS template completeness and independently editable BOK/IRN course roots")
