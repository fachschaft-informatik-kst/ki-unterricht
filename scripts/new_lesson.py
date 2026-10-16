"""Create a complete new AVIVA double lesson using the current course schema.

Examples:
    python scripts/new_lesson.py "KI im Alltag" --chapter "Anwendungen entdecken"
    python scripts/new_lesson.py "KI im Alltag" --dry-run

This is the local, Git-based counterpart of "Neue Doppellektion" in the web editor.
All existing lesson IDs, learner answer IDs and notebook paths remain untouched.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from new_chapter import slugify

ROOT = Path(__file__).resolve().parents[1]
PHASES = ("Ankommen", "Vorwissen aktivieren", "Informieren", "Verarbeiten", "Auswerten")
MINUTES = (5, 10, 15, 50, 10)


def template(identifier: str, title: str) -> dict:
    return {
        "id": identifier,
        "title": title,
        "view": "dl-" + identifier,
        "goal": "Lernziel für diese Doppellektion formulieren.",
        "question": "Leitfrage für diese Doppellektion formulieren.",
        "motivation": "Begründen, weshalb dieses Thema relevant ist.",
        "product": "Ein begründetes Lernergebnis.",
        "phases": [
            {
                "phase": phase,
                "titel": phase,
                "minutes": minutes,
                "schritte": [
                    {"wer": "Lehrperson", "min": minutes - 1,
                     "text": "Arbeitsauftrag und Ablauf festlegen.", "art": "Auftrag"},
                    {"wer": "Ergebnis", "min": 1,
                     "text": "Ergebnis festhalten.", "art": "Ergebnis"},
                ],
            }
            for phase, minutes in zip(PHASES, MINUTES)
        ],
    }


def create(
    root: Path, title: str, *, chapter_title: str = "Einstieg und Auftrag",
    dry_run: bool = False
) -> tuple[Path, Path, Path]:
    """Create one new lesson, chapter, and materials, or report their paths."""
    title = title.strip()
    chapter_title = chapter_title.strip()
    if not title:
        raise ValueError("Titel der Doppellektion darf nicht leer sein.")
    slug = slugify(chapter_title)

    plan_path = root / "projekt" / "kurs.json"
    course = json.loads(plan_path.read_text(encoding="utf-8"))
    lessons = course["lessons"]
    if len(lessons) < 10 or len(lessons) >= 99:
        raise ValueError("Es werden mindestens 10 und höchstens 99 Doppellektionen unterstützt.")
    expected = [f"{i:02d}" for i in range(1, len(lessons) + 1)]
    if [lesson.get("id") for lesson in lessons] != expected:
        raise ValueError("Doppellektions-IDs müssen lückenlos mit 01 beginnen.")

    identifier = f"{len(lessons) + 1:02d}"
    view = "dl-" + identifier
    chapter_dir = root / "kursseiten" / view
    chapter_path = chapter_dir / ("010-" + slug + ".md")
    teacher_path = root / "lehrperson" / "ergaenzungen" / (view + ".md")
    if chapter_dir.exists() or teacher_path.exists():
        raise FileExistsError("Kapitelordner oder Materialien für " + view + " existieren bereits.")

    lesson = template(identifier, title)
    assert sum(p["minutes"] for p in lesson["phases"]) == 90
    course["lessons"].append(lesson)
    chapter = (
        "---\n"
        "type: chapter\n"
        "id: " + view + "-" + slug + "\n"
        'nummer: "1"\n'
        "titel: " + json.dumps(chapter_title, ensure_ascii=False) + "\n"
        "kurz: " + json.dumps(chapter_title, ensure_ascii=False) + "\n"
        "open: true\n"
        "---\n\n"
        "## Lernauftrag\n\n"
        "Hier die Aufgabe beschreiben.\n"
    )
    materials = (
        "## Doppellektion " + identifier + "\n\n"
        "### Zusätzliche Materialien\n\n"
        "Hier ergänzende Grafiken, Tabellen und Hinweise für die Lehrperson einfügen.\n\n"
        "- [Zur neuen Kursseite](index.html#" + view + ")\n"
    )
    if not dry_run:
        chapter_dir.mkdir(parents=True)
        teacher_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            chapter_path.write_text(chapter, encoding="utf-8")
            teacher_path.write_text(materials, encoding="utf-8")
            # Write the shared manifest last, so incomplete lesson files are not
            # referenced when file creation fails.
            plan_path.write_text(
                json.dumps(course, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8"
            )
        except Exception:
            chapter_path.unlink(missing_ok=True)
            teacher_path.unlink(missing_ok=True)
            chapter_dir.rmdir()
            raise
    return plan_path, chapter_path, teacher_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("title", help="Titel der neuen Doppellektion")
    parser.add_argument("--chapter", default="Einstieg und Auftrag",
                        help="Titel des ersten Unterkapitels")
    parser.add_argument("--dry-run", action="store_true",
                        help="Nur Dateipfade ausgeben, nichts verändern")
    args = parser.parse_args()
    try:
        paths = create(ROOT, args.title, chapter_title=args.chapter, dry_run=args.dry_run)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    for path in paths:
        print(("Vorschau: " if args.dry_run else "Erstellt/angepasst: ") + str(path.relative_to(ROOT)))
    if not args.dry_run:
        print("AVIVA-Platzhalter, Kapitel und Materialien bearbeiten, dann 'make preview' ausführen.")


if __name__ == "__main__":
    main()
