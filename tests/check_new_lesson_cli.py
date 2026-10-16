"""Regression for the optional local new-lesson generator (no repository writes)."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_course import PHASES
from new_lesson import create, template

original = json.loads((ROOT / "projekt/kurs.json").read_text(encoding="utf-8"))
assert len(original["lessons"]) >= 10
with TemporaryDirectory() as tmp:
    root = Path(tmp)
    (root / "projekt").mkdir()
    plan = root / "projekt/kurs.json"
    plan.write_text(json.dumps(original, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    before = plan.read_bytes()

    dry = create(root, "KI im Alltag", chapter_title="Mensch und Maschine", dry_run=True)
    assert dry[0] == plan
    assert dry[1].relative_to(root).as_posix() == "kursseiten/dl-11/010-mensch-und-maschine.md"
    assert dry[2].relative_to(root).as_posix() == "lehrperson/ergaenzungen/dl-11.md"
    assert plan.read_bytes() == before and not dry[1].exists()

    files = create(root, "KI im Alltag", chapter_title="Mensch und Maschine")
    assert all(f.is_file() for f in files)
    updated = json.loads(plan.read_text(encoding="utf-8"))
    assert updated["lessons"][:10] == original["lessons"][:10]
    assert len(updated["lessons"]) == len(original["lessons"]) + 1
    new = updated["lessons"][-1]
    assert new == template("11", "KI im Alltag")
    assert new["view"] == "dl-11"
    assert [p["phase"] for p in new["phases"]] == PHASES
    assert sum(p["minutes"] for p in new["phases"]) == 90
    assert all(
        sum(s.get("min", 0) for s in p["schritte"]) == p["minutes"]
        and p["schritte"][-1]["art"] == "Ergebnis"
        for p in new["phases"]
    )
    assert "id: dl-11-mensch-und-maschine" in files[1].read_text(encoding="utf-8")
    assert "## Doppellektion 11" in files[2].read_text(encoding="utf-8")

    # A second call cannot silently overwrite anything and existing IDs stay put.
    (root / "kursseiten/dl-12").mkdir()
    try:
        create(root, "Folgethema")
    except FileExistsError:
        pass
    else:
        raise AssertionError("Existing chapter folder must block lesson creation")
    assert len(json.loads(plan.read_text(encoding="utf-8"))["lessons"]) == len(original["lessons"]) + 1

    for wrong_title in ("", "   "):
        try:
            create(root, wrong_title)
        except ValueError:
            pass
        else:
            raise AssertionError("Empty lesson names must fail")

assert json.loads((ROOT / "projekt/kurs.json").read_text(encoding="utf-8")) == original
print("PASS local lesson generator preserves existing lessons and creates AVIVA, chapter, materials")
