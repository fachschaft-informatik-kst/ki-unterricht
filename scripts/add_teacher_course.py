"""Create an isolated teacher course without copying another teacher's lessons.

Examples:
  python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#7155a0"
  python scripts/add_teacher_course.py MAI 4 "KI vertiefen" --dry-run
Only published courses appear as student lessons; drafts are editable privately.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from course_model import lesson_template
from course_registry import ROOT, REGISTRY, validate_registry


def create(root: Path, teacher: str, grade: int, title: str, accent: str = "#45628b",
           *, dry_run: bool = False, publish: bool = False) -> list[Path]:
    teacher = teacher.strip().upper()
    name = title.strip()
    ident = f"{teacher.lower()}-{grade}"
    course_id = f"{ident}-klasse"
    section = f"{ident}-kurs"
    manifest_path = f"kursseiten/{ident}-manifest.json"
    existing = json.loads((root / REGISTRY).read_text(encoding="utf-8"))
    if existing.get("version") != 1:
        raise ValueError("Unbekannte Kursregister-Version.")
    courses = existing["courses"]
    if any(c.get("id") == course_id or c.get("slug") == f"{teacher.lower()}/{grade}-klasse"
           for c in courses):
        raise ValueError(f"Kurs ist bereits vorhanden: {course_id}")
    lesson = lesson_template("01", "Einstieg und Lernfrage", section)
    lesson["order"] = 10
    course = {
        "id": course_id, "teacher": teacher, "grade": grade,
        "slug": f"{teacher.lower()}/{grade}-klasse",
        "source": "generated" if publish else None,
        "status": "published" if publish else "planned",
        "name": name, "theme": {"accent": accent},
        "editorKey": course_id,
        "manifest": manifest_path,
        "sectionPrefix": f"{ident}-",
        "notebookPrefix": f"{teacher.lower()}{grade}_",
        "teacherFiles": {
            "solutions": f"lehrperson/{ident}/musterloesungen.md",
            "fields": f"lehrperson/{ident}/musterloesungen-felder.md",
            "glossary": f"lehrperson/{ident}/glossar.md",
        },
    }
    validate_registry(courses + [course], root, check_files=False)
    manifest = {
        "version": 2, "course": ident, "title": f"{teacher} · {grade}. Klasse · {name}",
        "sections": [{
            "id": section, "class": "section", "teaching": True,
            "navigation": {"order": 1, "label": "01", "title": "Einstieg"},
            "overview": {"title": "Einstieg", "summary": "Eigene Lernziele und Inhalte ergänzen"},
        }],
    }
    chapter = (
        f"---\ntype: chapter\nid: {section}-start\nnummer: \"1\"\n"
        f"titel: Kursstart\nkurz: {teacher} · {grade}. Klasse\nopen: true\n---\n\n"
        f"## Willkommen im Kurs {name}\n\n"
        "Hier einen **eigenen Lernauftrag** für die Schülerinnen und Schüler formulieren.\n\n"
        "## Meine Antwort\n\n"
        f'<label class="field answer"><span>Was möchte ich über KI herausfinden?</span>'
        f'<textarea data-answer="{ident}-erste-frage" rows="4"></textarea></label>\n'
    )
    files = {
        manifest_path: json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        f"kursseiten/{section}/planung.json": json.dumps(
            {"lessons": [lesson]}, ensure_ascii=False, indent=2) + "\n",
        f"kursseiten/{section}/materialien.md":
            "## Doppellektion 01\n\n### Materialkoffer\n\nEigenes Unterrichtsmaterial ergänzen.\n",
        f"kursseiten/{section}/010-start.md": chapter,
        course["teacherFiles"]["solutions"]:
            "## DL 1 · Einstieg\n\nHier eine eigene Musterlösung oder einen fachlichen Hinweis ergänzen.\n",
        course["teacherFiles"]["fields"]:
            "## DL 1 · Einstieg\n\n| Antwortfeld | Musterantwort |\n|---|---|\n"
            f"| `{ident}-erste-frage` | Beispielantwort ergänzen. |\n",
        course["teacherFiles"]["glossary"]:
            "# Glossar\n\nBegriffserklärungen für diesen Kurs ergänzen.\n",
        REGISTRY: json.dumps({**existing, "courses": courses + [course]},
                             ensure_ascii=False, indent=2) + "\n",
    }
    for rel in files:
        target = root / rel
        if rel != REGISTRY and target.exists():
            raise FileExistsError(f"Datei ist bereits vorhanden: {target}")
    if not dry_run:
        for rel, content in files.items():
            target = root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
    for rel in files:
        print(("PLAN " if dry_run else "CREATED ") + rel)
    return [root / rel for rel in files]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("teacher", help="Kürzel der Lehrperson, z. B. MAI")
    parser.add_argument("grade", type=int, help="Klassenstufe, z. B. 1 oder 4")
    parser.add_argument("name", help="Angezeigter Kurstitel")
    parser.add_argument("--accent", default="#45628b", help="Kursfarbe als #RRGGBB")
    parser.add_argument("--publish", action="store_true",
                        help="Kurs direkt mit den generischen Kursbausteinen veröffentlichen")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    create(ROOT, args.teacher, args.grade, args.name, args.accent,
           dry_run=args.dry_run, publish=args.publish)
