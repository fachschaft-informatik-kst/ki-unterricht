"""Contract for isolated per-teacher course source folders.

Every course owns kursseiten/<teacher>/<grade>-klasse/, including its manifest,
chapters, AVIVA plans, and teacher files. Template folders are never live courses.
Section IDs are local to a course folder; they may be shared across template
copies without cross-course ownership.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = "shared/course-sites.json"
IDENT = re.compile(r"[a-z][a-z0-9-]*")
SECTION = re.compile(r"[a-z][a-z0-9-]*")
ACCENT = re.compile(r"#[0-9a-fA-F]{6}")

LEGACY = {
    "bok/1-klasse": ("basis", "basis-", "basis_"),
    "bok/4-klasse": ("vertiefung", "", ""),
    "irn/1-klasse": ("irn1", "basis-", "irn1_"),
    "irn/4-klasse": ("irn4", "", "irn4_"),
}


def validate_registry(courses: list[dict], root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    """Reject duplicate identities, out-of-folder sources and invalid lessons."""
    if not isinstance(courses, list) or not courses:
        raise ValueError("Mindestens ein Kurs erforderlich.")
    seen_ids, seen_keys = set(), set()
    for course in courses:
        if not isinstance(course, dict):
            raise ValueError("Ungültiger Kursdatensatz.")
        teacher, grade = course.get("teacher"), course.get("grade")
        if (not isinstance(teacher, str) or not re.fullmatch(r"[A-Z][A-Z0-9]{1,9}", teacher)
                or type(grade) is not int or not 1 <= grade <= 20):
            raise ValueError(f"Ungültige Lehrperson oder Klasse: {teacher}/{grade}")
        slug = f"{teacher.lower()}/{grade}-klasse"
        ident = f"{teacher.lower()}-{grade}-klasse"
        if course.get("slug") != slug or course.get("id") != ident:
            raise ValueError(f"Kursidentität und URL passen nicht: {slug}")
        key = course.get("editorKey")
        if not isinstance(key, str) or not IDENT.fullmatch(key) or ident in seen_ids or key in seen_keys:
            raise ValueError(f"Doppelter Kurs oder ungültiger Editor-Schlüssel: {slug}")
        seen_ids.add(ident)
        seen_keys.add(key)
        name = course.get("name")
        if not isinstance(name, str) or not name.strip() or len(name) > 80:
            raise ValueError(f"Kurstitel ungültig: {slug}")
        if not ACCENT.fullmatch(course.get("theme", {}).get("accent", "")):
            raise ValueError(f"Kursfarbe ungültig: {slug}")
        source, status = course.get("source"), course.get("status")
        if (status not in {"planned", "published"}
                or (status == "planned" and source is not None)
                or (status == "published" and source not in {"basis", "projekt", "generated"})):
            raise ValueError(f"Veröffentlichungsstatus ungültig: {slug}")

        folder = f"kursseiten/{slug}"
        manifest = folder + "/manifest.json"
        if course.get("manifest") != manifest:
            raise ValueError(f"Kursmanifest ausserhalb des eigenen Ordners: {slug}")
        legacy = LEGACY.get(slug)
        if legacy:
            expected_key, expected_prefix, expected_notebooks = legacy
            if (key, course.get("sectionPrefix"), course.get("notebookPrefix")) != legacy:
                raise ValueError(f"Bestehender Kurs wurde falsch zugeordnet: {slug}")
            if source not in ({None, "basis"} if slug == "bok/1-klasse" else
                              {None, "projekt"} if slug == "bok/4-klasse" else {None}):
                raise ValueError(f"Falsche Kursquelle: {slug}")
        else:
            if (course.get("sectionPrefix") != f"{teacher.lower()}-{grade}-"
                    or course.get("notebookPrefix") != f"{teacher.lower()}{grade}_"
                    or source not in {None, "generated"}):
                raise ValueError(f"Ungültiger neuer Lehrpersonen-Namensraum: {slug}")
        files = course.get("teacherFiles")
        if not isinstance(files, dict) or not {"solutions", "fields", "glossary"} <= files.keys():
            raise ValueError(f"Lehrpersonenmaterial unvollständig: {slug}")
        if set(files) - {"solutions", "fields", "glossary", "materialsIntro"}:
            raise ValueError(f"Unbekannter Materialtyp: {slug}")
        for kind, path in files.items():
            if not isinstance(path, str) or ".." in path or not path.startswith(folder + "/"):
                raise ValueError(f"Fremder Lehrpersonenordner: {path}")
            if not (path.startswith(folder + "/lehrperson/") and path.endswith(".md")
                    or kind == "glossary" and path == folder + "/glossar.json"):
                raise ValueError(f"Ungültiger Lehrpersonenpfad: {path}")
            if check_files and not (root / path).is_file():
                raise ValueError(f"Materialdatei fehlt: {path}")
        if check_files:
            manifest_file = root / manifest
            if not manifest_file.is_file():
                raise ValueError(f"Kursmanifest fehlt: {manifest}")
            data = json.loads(manifest_file.read_text(encoding="utf-8"))
            sections = data.get("sections")
            if not isinstance(sections, list) or not sections:
                raise ValueError(f"Unterrichtsbereiche fehlen: {manifest}")
            seen_sections = set()
            for section in sections:
                sid = section.get("id", "") if isinstance(section, dict) else ""
                if (not SECTION.fullmatch(sid) or sid in seen_sections
                        or (course["sectionPrefix"] and not sid.startswith(course["sectionPrefix"]))):
                    raise ValueError(f"Ungültiger Unterrichtsbereich in {manifest}: {sid}")
                seen_sections.add(sid)
                section_folder = root / folder / sid
                if not list(section_folder.glob("[0-9][0-9][0-9]-*.md")):
                    raise ValueError(f"Kapitel fehlen: {section_folder}")
                if section.get("teaching") and not (
                        (section_folder / "planung.json").is_file()
                        and (section_folder / "materialien.md").is_file()):
                    raise ValueError(f"AVIVA/Materialkoffer fehlen: {sid}")
    return courses


def load_registry(root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    path = root / REGISTRY
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("version") != 1:
        raise ValueError("Unbekannte Kursregister-Version.")
    return validate_registry(data.get("courses"), root, check_files=check_files)


if __name__ == "__main__":
    for course in load_registry():
        print(f"PASS {course['slug']} → {course['manifest']}")
