"""Local authoring supports new topics, grouped lessons and stable IDs on insertion."""
from pathlib import Path
from tempfile import TemporaryDirectory
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course
from new_lesson import create
from new_chapter import create_chapter

original = load_course(ROOT)
with TemporaryDirectory() as tmp:
    root = Path(tmp)
    shutil.copytree(ROOT / "kursseiten", root / "kursseiten")
    before = {p: p.read_bytes() for p in (root / "kursseiten").rglob("*") if p.is_file()}
    paths = create(root, "KI im Alltag", chapter_title="Mensch und Maschine", dry_run=True)
    assert not paths[0].exists()
    assert all(p.read_bytes() == data for p, data in before.items())
    paths = create(root, "KI im Alltag", chapter_title="Mensch und Maschine", after="03")
    assert all(p.is_file() for p in paths)
    lessons = load_course(root)["lessons"]
    new = next(l for l in lessons if l["id"] == "ki-im-alltag")
    assert new["number"] == 4 and new["view"] == "ki-im-alltag"
    assert [l["id"] for l in lessons if l["id"] != new["id"]] == [l["id"] for l in original["lessons"]]
    create(root, "Vertiefung", section="ki-im-alltag", after="ki-im-alltag")
    assert len([l for l in load_course(root)["lessons"] if l["view"] == "ki-im-alltag"]) == 2
    chapter = create_chapter(root, "ki-im-alltag", "Transfer", "3")
    assert chapter.is_file(), "New topic must use the same chapter generator"
    for kwargs in ({"title": ""}, {"title": "KI im Alltag"}, {"title": "Fehler", "section": "unbekannt"}):
        try:
            create(root, **kwargs)
        except (ValueError, FileExistsError):
            pass
        else:
            raise AssertionError(f"Invalid authoring accepted: {kwargs}")
assert load_course(ROOT) == original
print("PASS local authoring: dry run, insertion, grouped lessons, stable IDs, subchapters, validation")
