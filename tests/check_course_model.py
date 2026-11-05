"""Python/JavaScript validators must accept and reject the same AVIVA examples."""
from copy import deepcopy
import json
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import shutil

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course, lesson_template, validate_lessons

template = lesson_template("transfer", "Transfer", "gesellschaft")
cases = [{"lessons": [template]}, {"lessons": load_course(ROOT, "kurse/bok/4-klasse/kursseiten/manifest.json")["lessons"]}]
invalid = [{"lessons": []}, {"lessons": [None]}]
for change in (
    lambda l: l.pop("id"),
    lambda l: l.update(view=""),
    lambda l: l.update(goal=" "),
    lambda l: l.update(phases=l["phases"][::-1]),
    lambda l: l["phases"][0].update(minutes=6),
    lambda l: l["phases"][0]["schritte"][0].update(min=-1),
    lambda l: l["phases"][0]["schritte"][-1].update(art="Auftrag"),
    lambda l: l["phases"][0].update(schritte=[]),
    lambda l: l["phases"][0].update(schritte=[None]),
):
    lesson = deepcopy(template)
    change(lesson)
    invalid.append({"lessons": [lesson]})
invalid.append({"lessons": [template, template]})
for case in cases:
    validate_lessons(case["lessons"])
for case in invalid:
    try:
        validate_lessons(case["lessons"])
    except ValueError:
        pass
    else:
        raise AssertionError(f"Accepted invalid plan: {case}")
with TemporaryDirectory() as tmp:
    root = Path(tmp)
    shutil.copytree(ROOT / "kurse/bok/4-klasse/kursseiten", root / "kursseiten")
    path = root / "kursseiten/einstieg/planung.json"
    original = json.loads(path.read_text())
    for order in (None, float("inf"), True):
        plan = deepcopy(original)
        plan["lessons"][0]["order"] = order
        path.write_text(json.dumps(plan))
        try:
            load_course(root)
        except ValueError:
            pass
        else:
            raise AssertionError(f"Accepted invalid order: {order}")
    path.write_text(json.dumps(original))
    manifest_path = root / "kursseiten/manifest.json"
    manifest = json.loads(manifest_path.read_text())
    assert next(s for s in manifest["sections"] if s["id"] == "projekt").get("pages"), "Project must use page mode"
    section = lambda m, name: next(s for s in m["sections"] if s["id"] == name)
    for change in (
        lambda m: section(m, "projekt").update(pages=""),
        lambda m: section(m, "projekt").update(pages=True),
        lambda m: section(m, "journal").update(navChild={"label": "✎"}),
        lambda m: section(m, "einstieg").update(navChild={"label": "x", "title": "y"}),
    ):
        broken = deepcopy(manifest)
        change(broken)
        manifest_path.write_text(json.dumps(broken))
        try:
            load_course(root)
        except ValueError:
            pass
        else:
            raise AssertionError("Accepted invalid page navigation")
    manifest_path.write_text(json.dumps(manifest))
    load_course(root)
if "--json" in sys.argv:
    print(json.dumps({"valid": cases, "invalid": invalid, "template": template}))
else:
    print("PASS course validation: stable IDs, phase budgets, required fields and finite order")
