"""Export complete, isolated course source snapshots without touching live paths.

Usage:
    python scripts/export_course_templates.py
    python scripts/export_course_templates.py --check

The legacy build/editor still reads kursseiten/, lehrperson/ and content/.
This is a reversible staging step, not a runtime path migration.
"""
from __future__ import annotations

import argparse
import filecmp
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "shared/course-sites.json"
COURSE_DIR = ROOT / "kurse"
TEMPLATE_DIR = ROOT / "templates"

NOTEBOOK_RE = re.compile(r'(?:content/)([a-zA-Z0-9_./-]+\.ipynb)')


def copy(source: Path, target: Path, *, check: bool) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Quelle fehlt: {source}")
    if source.is_dir():
        for path in sorted(source.rglob("*")):
            if path.is_file():
                copy(path, target / path.relative_to(source), check=check)
        return
    if check:
        if not target.is_file() or not filecmp.cmp(source, target, shallow=False):
            raise AssertionError(f"Kopie fehlt oder weicht ab: {target}")
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)


def export_course(root: Path, course: dict, destination: Path, *, check: bool) -> None:
    manifest = root / course["manifest"]
    doc = json.loads(manifest.read_text(encoding="utf-8"))
    copy(manifest, destination / "kursseiten" / "manifest.json", check=check)
    for section in doc["sections"]:
        ident = section["id"]
        copy(root / "kursseiten" / ident, destination / "kursseiten" / ident, check=check)

    for kind, rel in course["teacherFiles"].items():
        # Keep original relative names in the snapshot to avoid collisions.
        copy(root / rel, destination / rel, check=check)

    # Include each referenced original notebook, including subdirectory notebooks.
    sources = [root / "kursseiten" / section["id"] for section in doc["sections"]]
    found: set[str] = set()
    for folder in sources:
        for chapter in folder.rglob("*.md"):
            for match in NOTEBOOK_RE.finditer(chapter.read_text(encoding="utf-8")):
                found.add(match.group(1))
    for notebook in sorted(found):
        relative = Path(notebook)
        if ".." in relative.parts:
            raise ValueError(f"Unsicherer Notebookpfad: {notebook}")
        source = root / "content" / relative
        if source.is_file():
            copy(source, destination / "content" / relative, check=check)

    identity = {
        "teacher": course["teacher"], "grade": course["grade"],
        "sourceCourse": course["slug"], "originalManifest": course["manifest"],
        "sections": [section["id"] for section in doc["sections"]],
        "notebooks": sorted(found),
    }
    data = json.dumps(identity, indent=2, ensure_ascii=False) + "\n"
    target = destination / "snapshot.json"
    if check:
        if not target.is_file() or target.read_text(encoding="utf-8") != data:
            raise AssertionError(f"Snapshot-Metadaten fehlen oder weichen ab: {target}")
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(data, encoding="utf-8")


def run(root: Path = ROOT, *, check: bool = False) -> None:
    courses = json.loads((root / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
    originals = {(item["teacher"], item["grade"]): item for item in courses}
    for grade in (1, 4):
        original = originals[("BOK", grade)]
        # Templates are immutable reference snapshots, not live course sources.
        export_course(root, original, root / "templates" / f"{grade}-klasse", check=check)
        for teacher in ("bok", "irn"):
            # Separate byte-for-byte source copies initially, not symlinks.
            export_course(root, original, root / "kurse" / teacher / f"{grade}-klasse", check=check)
    print("PASS: BOK-Templates sowie unabhängige BOK-/IRN-Kurskopien" if check
          else "Snapshots erstellt. Produktive Kursquellen bleiben unverändert.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Copies byte-for-byte verify")
    args = parser.parse_args()
    run(check=args.check)
