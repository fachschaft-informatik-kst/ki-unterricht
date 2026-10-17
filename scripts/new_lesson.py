"""Create a lesson in a new or existing topic; IDs do not encode its position."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from course_model import ROOT, load_course, lesson_template, read_json
from new_chapter import slugify, create_chapter


def create(root: Path, title: str, *, chapter_title: str = "Einstieg und Auftrag",
           section: str | None = None, after: str | None = None,
           dry_run: bool = False) -> tuple[Path, Path, Path]:
    title = title.strip()
    if not title:
        raise ValueError("Titel der Doppellektion darf nicht leer sein.")
    identifier = slugify(title)
    slug = slugify(chapter_title)
    course = load_course(root)
    lessons = course["lessons"]
    if any(l["id"] == identifier for l in lessons):
        raise ValueError(f"Lektions-ID existiert bereits: {identifier}")
    manifest_path = root / "kursseiten/manifest.json"
    manifest = read_json(manifest_path)
    view = section or identifier
    if not re.fullmatch(r"[a-z][a-z0-9-]*", view):
        raise ValueError("Bereichs-ID muss mit einem Buchstaben beginnen.")
    definition = next((s for s in manifest["sections"] if s["id"] == view), None)
    if section and (definition is None or not definition.get("teaching")):
        raise ValueError(f"Unbekannter Unterrichtsbereich: {section}")
    if not section and definition:
        raise ValueError(f"Bereich existiert bereits; --section {view} verwenden.")
    order = max(l["order"] for l in lessons) + 10
    if after:
        preceding = next((l for l in lessons if l["id"] == after), None)
        if preceding is None:
            raise ValueError(f"Unbekannte Lektions-ID: {after}")
        following = min((l["order"] for l in lessons if l["order"] > preceding["order"]), default=preceding["order"] + 20)
        order = (preceding["order"] + following) / 2
    folder = root / "kursseiten" / view
    plan_path = folder / "planung.json"
    teacher_path = folder / "materialien.md"
    if not section and folder.exists():
        raise FileExistsError(f"Bereichsordner existiert bereits: {folder}")
    existing = read_json(plan_path)["lessons"] if section else []
    chapter_number = max((int(p.name[:3]) for p in folder.glob("[0-9][0-9][0-9]-*.md") if not p.name.startswith("999-")), default=0) + 10
    if chapter_number >= 999:
        raise ValueError("Kapitel-Reihenfolge hat keinen freien Platz.")
    chapter_path = folder / f"{chapter_number:03d}-{slug}.md"
    if section:
        slug = f"{identifier}-{slug}"
        chapter_path = create_chapter(root, view, chapter_title, str(len(existing) + 1), slug=slug, dry_run=True)
    if chapter_path.exists():
        raise FileExistsError(f"Kapitel existiert: {chapter_path}")
    lesson = dict(lesson_template(identifier, title, view), order=order)
    data = {"lessons": [*existing, lesson]}
    chapter = (
        "---\ntype: chapter\n"
        f"id: {view}-{slug}\nnummer: \"{len(existing) + 1}\"\n"
        f"titel: {json.dumps(chapter_title, ensure_ascii=False)}\n"
        f"kurz: {json.dumps(chapter_title, ensure_ascii=False)}\nopen: true\n---\n\n"
        "## Lernauftrag\n\nHier die Aufgabe beschreiben.\n"
    )
    materials = (teacher_path.read_text(encoding="utf-8") if section else "") + (
        f"\n\n## Doppellektion {identifier}\n\n### Zusätzliche Materialien\n\n"
        f"- [Zur Kursseite](index.html#{view})\n"
    )
    if not definition:
        nav_order = max(s.get("navigation", {}).get("order", -1) for s in manifest["sections"]) + 1
        manifest["sections"].append({"id": view, "class": "section", "teaching": True,
                                     "navigation": {"order": nav_order, "label": "", "title": title}})
    changes = {plan_path: json.dumps(data, ensure_ascii=False, indent=2) + "\n",
               chapter_path: chapter, teacher_path: materials,
               manifest_path: json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"}
    if not dry_run:
        originals = {p: p.read_bytes() if p.exists() else None for p in changes}
        folder.mkdir(parents=True, exist_ok=True)
        try:
            for path, content in changes.items():
                path.write_text(content, encoding="utf-8")
            load_course(root)
        except Exception:
            for path, original in originals.items():
                if original is None:
                    path.unlink(missing_ok=True)
                else:
                    path.write_bytes(original)
            if not section:
                folder.rmdir()
            raise
    return plan_path, chapter_path, teacher_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("title")
    parser.add_argument("--chapter", default="Einstieg und Auftrag")
    parser.add_argument("--section", help="Vorhandener Themenblock statt eines neuen Bereichs")
    parser.add_argument("--after", help="Stabile ID der vorhergehenden Doppellektion")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    try:
        paths = create(ROOT, args.title, chapter_title=args.chapter, section=args.section,
                       after=args.after, dry_run=args.dry_run)
    except (OSError, ValueError, KeyError) as exc:
        parser.error(str(exc))
    for path in paths:
        print(f"{'Vorschau' if args.dry_run else 'Erstellt/angepasst'}: {path.relative_to(ROOT)}")
    print("AVIVA-Platzhalter und Inhalte ausarbeiten; make preview.")


if __name__ == "__main__":
    main()
