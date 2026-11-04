"""Authoritative ownership and source isolation for teacher courses.

Each course owns its complete `kurse/<teacher>/<grade>-klasse` source tree.
Section IDs may match across courses because manifests and files do not overlap.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = "shared/course-sites.json"
IDENT = re.compile(r"[a-z][a-z0-9-]*")
ACCENT = re.compile(r"#[0-9a-fA-F]{6}")


def validate_registry(courses: list[dict], root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    if not isinstance(courses, list) or not courses:
        raise ValueError("Mindestens ein Kurs erforderlich.")
    seen_ids, seen_slugs, seen_keys, seen_manifests, seen_roots = (set() for _ in range(5))
    for course in courses:
        if not isinstance(course, dict):
            raise ValueError("Ungültiger Kursdatensatz.")
        teacher, grade = course.get("teacher"), course.get("grade")
        if not isinstance(teacher, str) or not re.fullmatch(r"[A-Z][A-Z0-9]{1,9}", teacher) or type(grade) is not int or not 1 <= grade <= 20:
            raise ValueError(f"Ungültige Lehrperson oder Klasse: {teacher}/{grade}")
        slug = f"{teacher.lower()}/{grade}-klasse"
        ident = f"{teacher.lower()}-{grade}-klasse"
        editor = course.get("editorKey")
        if course.get("slug") != slug or course.get("id") != ident or not isinstance(editor, str) or not IDENT.fullmatch(editor):
            raise ValueError(f"Kursidentität oder Editor-Kennung ungültig: {slug}")
        base = f"kurse/{slug}"
        manifest = f"{base}/kursseiten/manifest.json"
        if course.get("courseRoot") != base or course.get("manifest") != manifest:
            raise ValueError(f"Manifest muss zum Kursordner gehören: {slug}")
        if any(item in (seen_ids if key == "id" else seen_slugs if key == "slug" else seen_keys if key == "editorKey" else seen_manifests if key == "manifest" else seen_roots)
               for key, item in (("id", ident), ("slug", slug), ("editorKey", editor), ("manifest", manifest), ("root", base))):
            raise ValueError(f"Doppelter Kurs: {slug}")
        seen_ids.add(ident); seen_slugs.add(slug); seen_keys.add(editor)
        seen_manifests.add(manifest); seen_roots.add(base)
        if not isinstance(course.get("name"), str) or not course["name"].strip() or len(course["name"]) > 80:
            raise ValueError(f"Kurstitel ungültig: {slug}")
        if not ACCENT.fullmatch(course.get("theme", {}).get("accent", "")):
            raise ValueError(f"Kursfarbe ungültig: {slug}")
        status, source = course.get("status"), course.get("source")
        if status not in {"planned", "published"} or (
            status == "planned" and source is not None
        ) or (status == "published" and source not in {"basis", "projekt", "generated"}):
            raise ValueError(f"Veröffentlichungsstatus ungültig: {slug}")
        if teacher == "BOK" and grade in (1, 4) and status == "published" and source != ("basis" if grade == 1 else "projekt"):
            raise ValueError(f"BOK-Quellroute ungültig: {slug}")
        # A template can use historical section and notebook IDs without leaking data
        # because its owning file paths and answer stores are isolated by course.
        if grade in (1, 4):
            expected_section = "basis-" if grade == 1 else ""
            expected_notebook = "basis_" if grade == 1 else ""
            if (course.get("sectionPrefix"), course.get("notebookPrefix")) != (expected_section, expected_notebook):
                raise ValueError(f"Vorlagen-Namensraum ungültig: {slug}")
        else:
            raise ValueError(f"Keine Unterrichtsvorlage für Klasse {grade}.")
        files = course.get("teacherFiles")
        expected_files = {
            "solutions": f"{base}/lehrperson/musterloesungen.md",
            "fields": f"{base}/lehrperson/musterloesungen-felder.md",
            "glossary": f"{base}/kursseiten/glossar.json",
        }
        if grade == 4:
            expected_files["materialsIntro"] = f"{base}/lehrperson/materialien.md"
        if files != expected_files:
            raise ValueError(f"Lehrpersonenmaterial muss vollständig und kurslokal sein: {slug}")
        if check_files:
            for path in files.values():
                if not (root / path).is_file():
                    raise ValueError(f"Materialdatei fehlt: {path}")
            source_file = root / manifest
            if not source_file.is_file():
                raise ValueError(f"Kursmanifest fehlt: {manifest}")
            sections = json.loads(source_file.read_text(encoding="utf-8")).get("sections")
            if not isinstance(sections, list) or not sections:
                raise ValueError(f"Unterrichtsbereiche fehlen: {manifest}")
            local_ids = set()
            for section in sections:
                sid = section.get("id", "") if isinstance(section, dict) else ""
                if not IDENT.fullmatch(sid) or sid in local_ids or (course["sectionPrefix"] and not sid.startswith(course["sectionPrefix"])):
                    raise ValueError(f"Bereich ungültig oder doppelt in {manifest}: {sid}")
                local_ids.add(sid)
                folder = root / base / "kursseiten" / sid
                if not list(folder.glob("[0-9][0-9][0-9]-*.md")):
                    raise ValueError(f"Kapitel fehlen: {folder}")
                if section.get("teaching") and not ((folder / "planung.json").is_file() and (folder / "materialien.md").is_file()):
                    raise ValueError(f"AVIVA oder Materialkoffer fehlen: {sid}")
    return courses


def load_registry(root: Path = ROOT, *, check_files: bool = True) -> list[dict]:
    data = json.loads((root / REGISTRY).read_text(encoding="utf-8"))
    if data.get("version") != 1:
        raise ValueError("Unbekannte Kursregister-Version.")
    return validate_registry(data.get("courses"), root, check_files=check_files)


def load_experiments(course: dict, root: Path = ROOT) -> list[dict]:
    base = root / course["courseRoot"]
    entries = json.loads((base / "experimente/registry.json").read_text(encoding="utf-8"))
    if not isinstance(entries, list) or not entries:
        raise ValueError(f"Experimentregistrierung fehlt: {course['slug']}")
    names = set()
    for entry in entries:
        source = entry.get("source") if isinstance(entry, dict) else None
        if (not isinstance(source, str) or Path(source).is_absolute()
                or ".." in Path(source).parts or Path(source).suffix != ".ipynb"
                or not isinstance(entry.get("title"), str) or not entry["title"].strip()):
            raise ValueError(f"Ungültiges Experiment in {course['slug']}: {entry}")
        if Path(source).name in names or not (base / "content" / source).is_file():
            raise ValueError(f"Experiment fehlt oder hat doppelten Namen: {course['slug']}/{source}")
        names.add(Path(source).name)
    if sum(bool(entry.get("project")) for entry in entries) != 1:
        raise ValueError(f"Genau ein Projektnotebook erforderlich: {course['slug']}")
    return entries


if __name__ == "__main__":
    for course in load_registry():
        print(f"PASS {course['slug']} → {course['manifest']}")
