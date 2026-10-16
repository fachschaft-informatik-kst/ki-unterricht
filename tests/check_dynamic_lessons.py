"""Integration test: adding lesson 11 creates course, plan and teacher materials.

Run on isolated source copies, never edit the ten existing lessons in the repository.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import shutil
import sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
import build_portal, build_course, build_materials
from lesson_schema import load_lessons, write_compatibility_file
from new_lesson import create as create_lesson

baseline=load_lessons(ROOT)
assert len(baseline)>=10 and [l["id"] for l in baseline[:10]]==[
    f"{n:02d}" for n in range(1,11)
]
with TemporaryDirectory() as tmp:
    dest=Path(tmp)
    for directory in ("unterricht","kursseiten","lehrperson","worksheets"):
        shutil.copytree(ROOT/directory,dest/directory,
                        ignore=shutil.ignore_patterns("*.pdf","__pycache__"))
    (dest/"content").symlink_to(ROOT/"content",target_is_directory=True)
    (dest/"projekt").mkdir()
    plan,chapter,materials=create_lesson(dest,"Neue KI-Anwendung untersuchen")
    assert plan.relative_to(dest).as_posix()=="unterricht/lektionen/11.json"
    assert chapter.relative_to(dest).as_posix()=="kursseiten/lektionen/11/010-einstieg.md"
    assert materials.relative_to(dest).as_posix()=="lehrperson/lektionen/11.md"
    lessons=load_lessons(dest)
    assert len(lessons)==len(baseline)+1
    assert lessons[:10]==baseline,"Existing AVIVA plans must be identical"
    assert sum(p["minutes"] for p in lessons[-1]["phases"])==90
    source=(ROOT/"projekt/index.html").read_text(encoding="utf-8")
    updated=build_portal.add_extra_lessons(source,dest)
    (dest/"projekt/index.html").write_text(updated,encoding="utf-8")
    build_course.ROOT=dest
    build_materials.ROOT=dest
    build_materials.SOURCE=dest/"lehrperson/materialien.md"
    build_materials.OUTPUT=dest/"projekt/materialien.html"
    build_materials.DOWNLOADS=dest/"projekt/materialien/downloads"
    build_course.build()
    student=BeautifulSoup((dest/"projekt/index.html").read_text(encoding="utf-8"),"html.parser")
    teacher=BeautifulSoup((dest/"projekt/unterrichtsplan.html").read_text(encoding="utf-8"),"html.parser")
    resources=BeautifulSoup((dest/"projekt/materialien.html").read_text(encoding="utf-8"),"html.parser")
    assert student.select_one('a[href="#lektion-11"]')
    assert student.select_one('section#lektion-11 details#lektion-11-einstieg')
    assert student.select_one('section#lektion-11 details.lesson-plan[data-lesson="11"]')
    assert teacher.select_one('details.lesson-plan[data-lesson="11"]')
    assert resources.select_one("section#dl-11")
    assert resources.select_one('a[href="#dl-11"]')
    assert len(teacher.select(".lesson-plan"))==11
    assert len(resources.select(".lesson-resources"))==11
    assert len(student.select("[id]"))==len(set(item["id"] for item in student.select("[id]")))
    assert "Neue KI-Anwendung untersuchen" in student.get_text(" ",strip=True)
    compat=write_compatibility_file(dest)
    assert len(compat)==11
    assert len(load_lessons(ROOT))==len(baseline),"No mutation of real source"
print("PASS new double lesson integrates into navigation, AVIVA plan, materials and old answers")
