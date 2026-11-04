"""Compatibility mirror for historical BOK build scripts.

Canonical authored sources live under kurse/bok/{1,4}-klasse. This script
materializes their historical paths for existing renderers and tests without
allowing edits to those mirror locations through the teacher editor.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def sync(root: Path = ROOT) -> None:
    for grade in (1, 4):
        base = root / "kurse" / "bok" / f"{grade}-klasse"
        pages = base / "kursseiten"
        manifest = json.loads((pages / "manifest.json").read_text(encoding="utf-8"))
        mirror = root / "kursseiten"
        mirror.mkdir(parents=True, exist_ok=True)
        (mirror / ("basis-manifest.json" if grade == 1 else "manifest.json")).write_bytes(
            (pages / "manifest.json").read_bytes())
        for section in manifest["sections"]:
            source = pages / section["id"]
            target = mirror / section["id"]
            if not source.is_dir():
                raise FileNotFoundError(source)
            if target.exists():
                shutil.rmtree(target)
            shutil.copytree(source, target)
        suffix = "musterloesungen-felder-" + str(grade) + "-klasse.md"
        teacher = root / "lehrperson"
        teacher.mkdir(exist_ok=True)
        (teacher / suffix).write_bytes((base / "lehrperson/musterloesungen-felder.md").read_bytes())
        if grade == 4:
            for name in ("materialien.md", "musterloesungen.md"):
                (teacher / name).write_bytes((base / "lehrperson" / name).read_bytes())
            (mirror / "glossar.json").write_bytes((pages / "glossar.json").read_bytes())


if __name__ == "__main__":
    sync()
    print("PASS BOK compatibility mirrors materialized from course-owned sources")
