"""Regression checks for independent BOK/IRN snapshot creation."""
import json
import tempfile
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from export_course_templates import run


def test():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        course_list = []
        for grade in (1, 4):
            section = f"basis-{grade}-start"
            manifest = f"kursseiten/bok-{grade}-manifest.json"
            folder = root / "kursseiten" / section
            folder.mkdir(parents=True)
            (folder / "010-start.md").write_text(
                '<div data-notebook="content/example.ipynb">Test</div>', encoding="utf-8")
            (folder / "planung.json").write_text('{"lessons":[]}', encoding="utf-8")
            (folder / "materialien.md").write_text("Material", encoding="utf-8")
            (root / manifest).write_text(json.dumps({"sections": [{"id": section}]}),
                                         encoding="utf-8")
            teacher_file = f"lehrperson/bok-{grade}/felder.md"
            (root / teacher_file).parent.mkdir(parents=True, exist_ok=True)
            (root / teacher_file).write_text("Antworten", encoding="utf-8")
            course_list.append({"teacher": "BOK", "grade": grade,
                                "slug": f"bok/{grade}-klasse", "manifest": manifest,
                                "teacherFiles": {"fields": teacher_file}})
        (root / "content").mkdir()
        (root / "content/example.ipynb").write_text("{}", encoding="utf-8")
        (root / "shared").mkdir()
        (root / "shared/course-sites.json").write_text(
            json.dumps({"courses": course_list}), encoding="utf-8")
        run(root)
        run(root, check=True)
        template = root / "templates/1-klasse/kursseiten/basis-1-start/010-start.md"
        irn = root / "kurse/irn/1-klasse/kursseiten/basis-1-start/010-start.md"
        assert template.read_bytes() == irn.read_bytes()
        irn.write_text("IRN eigener Inhalt", encoding="utf-8")
        assert template.read_text(encoding="utf-8") != irn.read_text(encoding="utf-8")
        try:
            run(root, check=True)
        except AssertionError:
            pass
        else:
            raise AssertionError("Divergent copied file must fail byte-for-byte check")


if __name__ == "__main__":
    test()
    print("PASS independent course snapshot export")
