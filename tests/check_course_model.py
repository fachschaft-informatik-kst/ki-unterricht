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
cases = [{"lessons": [template]}, {"lessons": load_course(ROOT)["lessons"]}]
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
    shutil.copytree(ROOT / "kursseiten", root / "kursseiten")
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
if "--json" in sys.argv:
    print(json.dumps({"valid": cases, "invalid": invalid, "template": template}))
else:
    print("PASS course validation: stable IDs, phase budgets, required fields and finite order")
