"""Authoritative course sources and shared validation rules."""
from __future__ import annotations

import json
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
RULES = json.loads((ROOT / "shared/course-rules.json").read_text(encoding="utf-8"))
PHASES = RULES["phases"]


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_lessons(lessons: list[dict]) -> None:
    if not isinstance(lessons, list) or not lessons:
        raise ValueError("Doppellektionen fehlen")
    ids = set()
    for lesson in lessons:
        if not isinstance(lesson, dict):
            raise ValueError("Doppellektion muss ein Objekt sein")
        identifier = lesson.get("id", "")
        if not isinstance(identifier, str) or not re.fullmatch(r"[a-z0-9][a-z0-9-]*", identifier) or identifier in ids:
            raise ValueError(f"Ungültige oder doppelte Lektions-ID: {identifier}")
        ids.add(identifier)
        if not isinstance(lesson.get("view"), str) or not re.fullmatch(r"[a-z][a-z0-9-]*", lesson["view"]):
            raise ValueError(f"Ungültiger Unterrichtsbereich: {identifier}")
        if any(not isinstance(lesson.get(k), str) or not lesson[k].strip() for k in RULES["required"]):
            raise ValueError(f"Pflichtfelder fehlen: {identifier}")
        phases = lesson.get("phases", [])
        if not isinstance(phases, list) or any(not isinstance(p, dict) for p in phases) or [p.get("phase") for p in phases] != PHASES:
            raise ValueError(f"AVIVA-Phasen ungültig: {identifier}")
        for phase in phases:
            steps = phase.get("schritte", [])
            if (type(phase.get("minutes")) is not int or phase["minutes"] < 1
                    or not isinstance(phase.get("titel"), str) or not phase["titel"].strip()
                    or not isinstance(steps, list) or not steps or any(not isinstance(s, dict) for s in steps)
                    or steps[-1].get("art") != "Ergebnis"
                    or any(any(not isinstance(s.get(k), str) or not s[k].strip() for k in ("wer", "text"))
                           or type(s.get("min", 0)) is not int or s.get("min", 0) < 0 for s in steps)
                    or sum(s.get("min", 0) for s in steps) != phase["minutes"]):
                raise ValueError(f"Arbeitsschritte oder Minuten ungültig: {identifier}/{phase['phase']}")
        if sum(p["minutes"] for p in phases) != RULES["duration"]:
            raise ValueError(f"Dauer muss {RULES['duration']} Minuten betragen: {identifier}")


def load_course(root: Path = ROOT) -> dict:
    manifest = read_json(root / "kursseiten/manifest.json")
    sections = manifest.get("sections")
    if not isinstance(sections, list) or not sections or any(not isinstance(s, dict) for s in sections):
        raise ValueError("Unterrichtsbereiche fehlen")
    names = [s.get("id") for s in sections]
    if any(not isinstance(name, str) for name in names):
        raise ValueError("Bereichs-ID fehlt")
    if len(names) != len(set(names)):
        raise ValueError("Doppelte Unterrichtsbereiche")
    lessons = []
    for section in sections:
        view = section["id"]
        if not re.fullmatch(r"[a-z][a-z0-9-]*", view):
            raise ValueError(f"Ungültiger Bereich: {view}")
        if not isinstance(section.get("class"), str) or not section["class"].strip():
            raise ValueError(f"Bereichsklasse fehlt: {view}")
        nav = section.get("navigation")
        if section.get("teaching") and not nav:
            raise ValueError(f"Navigation fehlt: {view}")
        if nav is not None and (not isinstance(nav, dict)
                or any(not isinstance(nav.get(k), str) for k in ("title", "label"))
                or type(nav.get("order")) is not int):
            raise ValueError(f"Navigation ungültig: {view}")
        path = root / "kursseiten" / view / "planung.json"
        if section.get("teaching"):
            block = read_json(path)["lessons"]
            validate_lessons(block)
            if any(l.get("view") != view for l in block):
                raise ValueError(f"Falsche Bereichszuordnung in {path}")
            lessons.extend(block)
    if any(type(l.get("order")) not in (int, float) or not math.isfinite(l["order"]) for l in lessons):
        raise ValueError("Lektionsreihenfolge muss eine endliche Zahl sein")
    lessons.sort(key=lambda l: l["order"])
    if len({l["order"] for l in lessons}) != len(lessons):
        raise ValueError("Doppelte Lektionsreihenfolge")
    validate_lessons(lessons)
    for number, lesson in enumerate(lessons, 1):
        lesson["number"] = number
    return {"minutes": RULES["duration"], "model": "AVIVA", "lessons": lessons}


def output(root: Path = ROOT) -> Path:
    return root / "_build/site/projekt"


def lesson_template(identifier: str, title: str, view: str) -> dict:
    return {
        "id": identifier, "title": title, "view": view, **RULES["defaults"],
        "phases": [
            {"phase": phase, "titel": phase, "minutes": minutes, "schritte": [
                {"wer": "Lehrperson", "min": minutes - 1, "text": "Arbeitsauftrag und Ablauf festlegen.", "art": "Auftrag"},
                {"wer": "Ergebnis", "min": 1, "text": "Ergebnis festhalten.", "art": "Ergebnis"},
            ]}
            for phase, minutes in zip(PHASES, RULES["defaultMinutes"])
        ],
    }
