"""Add an independent teacher course by copying the complete BOK template.

Examples:
    python scripts/add_teacher_course.py MAI 1 "Künstliche Intelligenz" --dry-run
    python scripts/add_teacher_course.py MAI 4 "Künstliche Intelligenz" --publish

Templates are sources, never links: changes after copying do not affect BOK,
IRN or other teacher courses.
"""
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from course_registry import ROOT, REGISTRY, validate_registry


def create(root: Path, teacher: str, grade: int, title: str, accent: str = "#45628b",
           *, dry_run: bool = False, publish: bool = False) -> list[Path]:
    teacher = teacher.strip().upper()
    name = title.strip()
    ident = f"{teacher.lower()}-{grade}-klasse"
    slug = f"{teacher.lower()}/{grade}-klasse"
    source = root / "kurse/_vorlagen" / f"{grade}-klasse"
    if grade not in (1, 4) or not (source / "kursseiten/manifest.json").is_file():
        raise ValueError(f"Keine vollständige Kursvorlage für die {grade}. Klasse.")
    course_root = f"kurse/{slug}"
    destination = root / course_root
    if destination.exists():
        raise FileExistsError(f"Kursverzeichnis existiert: {destination}")
    existing = json.loads((root / REGISTRY).read_text(encoding="utf-8"))
    if existing.get("version") != 1:
        raise ValueError("Unbekannte Kursregister-Version.")
    course = {
        "id": ident, "teacher": teacher, "grade": grade, "slug": slug,
        "source": "generated" if publish else None,
        "status": "published" if publish else "planned",
        "name": name, "theme": {"accent": accent},
        "editorKey": ident, "courseRoot": course_root,
        "manifest": f"{course_root}/kursseiten/manifest.json",
        "sectionPrefix": "basis-" if grade == 1 else "",
        "notebookPrefix": "basis_" if grade == 1 else "",
        "teacherFiles": {
            "solutions": f"{course_root}/lehrperson/musterloesungen.md",
            "fields": f"{course_root}/lehrperson/musterloesungen-felder.md",
            "glossary": f"{course_root}/kursseiten/glossar.json",
            **({"materialsIntro": f"{course_root}/lehrperson/materialien.md"} if grade == 4 else {}),
        },
    }
    if any(c["id"] == ident or c["slug"] == slug for c in existing["courses"]):
        raise ValueError(f"Kurs ist bereits vorhanden: {ident}")
    validate_registry(existing["courses"] + [course], root, check_files=False)
    files = sorted(p.relative_to(source) for p in source.rglob("*") if p.is_file())
    if not dry_run:
        shutil.copytree(source, destination)
        manifest = destination / "kursseiten/manifest.json"
        document = json.loads(manifest.read_text(encoding="utf-8"))
        document["course"] = ident
        document["title"] = f"{teacher} · {grade}. Klasse · {name}"
        manifest.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        snapshot = destination / "snapshot.json"
        metadata = json.loads(snapshot.read_text(encoding="utf-8"))
        metadata["copiedTo"] = slug
        snapshot.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (root / REGISTRY).write_text(json.dumps({
            "version": 1, "courses": existing["courses"] + [course],
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        validate_registry(existing["courses"] + [course], root, check_files=True)
    for relative in files:
        print(("PLAN " if dry_run else "CREATED ") + str(destination / relative))
    print(("PLAN " if dry_run else "UPDATED ") + str(root / REGISTRY))
    return [destination / relative for relative in files] + [root / REGISTRY]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("teacher", help="Kürzel der Lehrperson, z. B. MAI")
    parser.add_argument("grade", type=int, choices=(1, 4), help="Klassenstufe")
    parser.add_argument("name", help="Angezeigter Kurstitel")
    parser.add_argument("--accent", default="#45628b", help="Kursfarbe als #RRGGBB")
    parser.add_argument("--publish", action="store_true", help="Kurs direkt veröffentlichen")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    create(ROOT, args.teacher, args.grade, args.name, args.accent,
           dry_run=args.dry_run, publish=args.publish)
