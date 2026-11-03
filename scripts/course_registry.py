"""Shared course ownership contract for routes, editors and future teachers.

Existing BOK paths are intentionally kept intact: they back local student answers,
notebooks, links and old ZIP files. All new courses use a unique teacher/grade prefix.
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
    "bok/1-klasse": ("basis", "kursseiten/basis-manifest.json", "basis-", "basis_"),
    "bok/4-klasse": ("vertiefung", "kursseiten/manifest.json", "", ""),
    "irn/1-klasse": ("irn1", "kursseiten/irn-1-manifest.json", "irn-1-", "irn1_"),
    "irn/4-klasse": ("irn4", "kursseiten/irn-4-manifest.json", "irn-4-", "irn4_"),
}


def validate_registry(courses: list[dict], root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    """Refuse ambiguous ownership, path escapes or cross-course sections."""
    if not isinstance(courses, list) or not courses:
        raise ValueError("Mindestens ein Kurs erforderlich.")
    seen_ids, seen_slugs, seen_keys, seen_manifests, seen_sections = (set() for _ in range(5))
    for course in courses:
        if not isinstance(course, dict):
            raise ValueError("Ungültiger Kursdatensatz.")
        teacher = course.get("teacher")
        grade = course.get("grade")
        if (not isinstance(teacher, str) or not re.fullmatch(r"[A-Z][A-Z0-9]{1,9}", teacher)
                or type(grade) is not int or grade < 1 or grade > 20):
            raise ValueError(f"Ungültige Lehrperson oder Klasse: {teacher}/{grade}")
        slug = f"{teacher.lower()}/{grade}-klasse"
        ident = f"{teacher.lower()}-{grade}-klasse"
        if course.get("slug") != slug or course.get("id") != ident:
            raise ValueError(f"Kursidentität und URL passen nicht: {slug}")
        key = course.get("editorKey")
        if not isinstance(key, str) or not IDENT.fullmatch(key):
            raise ValueError(f"Editor-Kennung ungültig: {slug}")
        if ident in seen_ids or slug in seen_slugs or key in seen_keys:
            raise ValueError(f"Doppelter Kurs oder Editor-Schlüssel: {slug}")
        seen_ids.add(ident); seen_slugs.add(slug); seen_keys.add(key)
        name = course.get("name")
        if not isinstance(name, str) or not name.strip() or len(name) > 80:
            raise ValueError(f"Kurstitel ungültig: {slug}")
        if not ACCENT.fullmatch(course.get("theme", {}).get("accent", "")):
            raise ValueError(f"Kursfarbe ungültig: {slug}")
        source = course.get("source")
        status = course.get("status")
        if (status not in {"planned", "published"}
                or (status == "planned" and source is not None)
                or (status == "published" and source not in {"basis", "projekt", "generated"})):
            raise ValueError(f"Veröffentlichungsstatus ungültig: {slug}")
        manifest = course.get("manifest")
        if not isinstance(manifest, str) or not manifest.startswith("kursseiten/") or not manifest.endswith(".json"):
            raise ValueError(f"Manifestpfad ungültig: {slug}")
        prefix = course.get("sectionPrefix")
        notebook = course.get("notebookPrefix")
        legacy = LEGACY.get(slug)
        if legacy:
            if (key, manifest, prefix, notebook) != legacy:
                raise ValueError(f"Bestehende Kursquellen dürfen nicht vertauscht werden: {slug}")
            if source not in ({None, "basis"} if slug == "bok/1-klasse" else
                              {None, "projekt"} if slug == "bok/4-klasse" else {None}):
                raise ValueError(f"Legacy-Quellroute ungültig: {slug}")
        else:
            expected_prefix = f"{teacher.lower()}-{grade}-"
            if (manifest != f"kursseiten/{teacher.lower()}-{grade}-manifest.json"
                    or prefix != expected_prefix
                    or notebook != f"{teacher.lower()}{grade}_"
                    or source not in {None, "generated"}):
                raise ValueError(f"Neue Kurse benötigen unabhängige Namensräume: {slug}")
        if manifest in seen_manifests:
            raise ValueError(f"Manifest wird von mehreren Kursen verwendet: {manifest}")
        seen_manifests.add(manifest)
        files = course.get("teacherFiles")
        if not isinstance(files, dict) or not all(k in files for k in ("solutions", "fields", "glossary")):
            raise ValueError(f"Lehrpersonenmaterial unvollständig: {slug}")
        for kind, path in files.items():
            if kind not in {"solutions", "fields", "glossary", "materialsIntro"}:
                raise ValueError(f"Unbekannter Materialtyp: {kind}")
            if not isinstance(path, str) or ".." in path or not (
                    (path.startswith("lehrperson/") and path.endswith(".md"))
                    or (kind == "glossary" and path == "kursseiten/glossar.json")):
                raise ValueError(f"Ungültiger Lehrpersonenpfad: {path}")
            if (not legacy or teacher == "IRN") and not path.startswith(
                    f"lehrperson/{teacher.lower()}-{grade}/"):
                raise ValueError(f"Fremder Lehrpersonenordner: {path}")
            if teacher == "BOK" and legacy:
                allowed = {
                    "solutions": "lehrperson/musterloesungen.md",
                    "fields": f"lehrperson/musterloesungen-felder-{grade}-klasse.md",
                    "glossary": "kursseiten/glossar.json",
                    "materialsIntro": "lehrperson/materialien.md",
                }
                if path != allowed[kind] or (kind == "materialsIntro" and grade != 4):
                    raise ValueError(f"BOK-Material gehört zum falschen Kurs: {path}")
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
            for section in sections:
                sid = section.get("id", "") if isinstance(section, dict) else ""
                if not SECTION.fullmatch(sid) or (prefix and not sid.startswith(prefix)):
                    raise ValueError(f"Fremder Unterrichtsbereich in {manifest}: {sid}")
                if sid in seen_sections:
                    raise ValueError(f"Unterrichtsbereich wird von mehreren Kursen verwendet: {sid}")
                seen_sections.add(sid)
                folder = root / "kursseiten" / sid
                if not list(folder.glob("[0-9][0-9][0-9]-*.md")):
                    raise ValueError(f"Kapitel fehlen: {folder}")
                if section.get("teaching") and not (
                        (folder / "planung.json").is_file() and (folder / "materialien.md").is_file()):
                    raise ValueError(f"AVIVA/Materialkoffer fehlen: {sid}")
    return courses


def load_registry(root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    path = root / REGISTRY
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("version") != 1:
        raise ValueError("Unbekannte Kursregister-Version.")
    return validate_registry(data.get("courses"), root, check_files=check_files)


if __name__ == "__main__":
    courses = load_registry()
    for course in courses:
        print(f"PASS {course['slug']} → {course['manifest']}")
