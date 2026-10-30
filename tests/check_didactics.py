"""Minimum editorial quality gate for AI-authored teaching plans.

This only catches objective omissions; pedagogical merit requires human review.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course

PLACEHOLDERS = (
    "lernziel für diese doppellektion formulieren",
    "leitfrage für diese doppellektion formulieren",
    "arbeitsauftrag und ablauf festlegen",
    "hier die aufgabe beschreiben",
)
def check(lessons, *, require_individual=True):
    issues = []
    for lesson in lessons:
        label = lesson["id"]
        for key in ("goal", "question", "product"):
            text = lesson[key].strip()
            if any(placeholder in text.casefold() for placeholder in PLACEHOLDERS):
                issues.append(f"{label}: placeholder in {key}")
        for phase in lesson["phases"]:
            for step in phase["schritte"]:
                if any(placeholder in step["text"].casefold() for placeholder in PLACEHOLDERS):
                    issues.append(f"{label}: placeholder in {phase['phase']}")
        if not require_individual or lesson["id"] in {"05", "06", "07", "08"}:
            continue
        final = [s for s in lesson["phases"][-1]["schritte"] if s.get("min", 0)][-1]
        if final["wer"] != "Einzeln" or final["min"] < 2:
            issues.append(f"{label}: missing individual learning consolidation")
        if not any(w in final["text"].casefold() for w in ("erklären", "begründen", "formulieren", "beantworten", "festhalten", "schreiben", "notieren")):
            issues.append(f"{label}: consolidation lacks observable student action")
    return issues

if __name__ == "__main__":
    issues = check(load_course(ROOT)["lessons"])
    issues += check(load_course(ROOT, "kursseiten/basis-manifest.json")["lessons"], require_individual=False)
    if issues:
        raise SystemExit("Didaktischer Mindestcheck:\\n" + "\\n".join(issues))
    print("PASS editorial quality gate for both courses (manual review still required)")
