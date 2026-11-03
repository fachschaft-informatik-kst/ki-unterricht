"""Regression audit of byte-for-byte initial templates and independent course roots."""
import filecmp
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from export_course_templates import run

for grade in (1,4):
    template=ROOT/"templates"/f"{grade}-klasse"
    template_files={p.relative_to(template) for p in template.rglob("*") if p.is_file()}
    assert template_files and "kursseiten/manifest.json" in {str(p) for p in template_files}
    for teacher in ("bok","irn"):
        folder=ROOT/"kurse"/teacher/f"{grade}-klasse"
        assert folder.resolve()!=template.resolve()
        assert all((folder/name).is_file() and filecmp.cmp(template/name,folder/name,shallow=False)
                   for name in template_files)
run(ROOT,check=True)
print("PASS independent complete source clones")
