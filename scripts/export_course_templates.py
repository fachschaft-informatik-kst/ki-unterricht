"""Read-only integrity audit for the initial BOK template and course copies.

This command never writes or overwrites course content. After independently
editing a teacher course, compare that course to its template with Git diff,
not by running a bulk recopy script.
"""
from __future__ import annotations
import argparse
import filecmp
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def run(root:Path=ROOT,*,check:bool=False)->None:
    for grade in (1,4):
        template=root/"templates"/f"{grade}-klasse"
        if not (template/"kursseiten/manifest.json").is_file():
            raise FileNotFoundError(template/"kursseiten/manifest.json")
        originals={p.relative_to(template) for p in template.rglob("*") if p.is_file()}
        assert originals,template
        for teacher in ("bok","irn"):
            course=root/"kurse"/teacher/f"{grade}-klasse"
            missing=[p for p in originals if not (course/p).is_file()]
            changed=[p for p in originals if (course/p).is_file() and
                     not filecmp.cmp(template/p,course/p,shallow=False)]
            if check and (changed or missing):
                raise AssertionError(f"{course}: {len(changed)} geänderte, "
                                     f"{len(missing)} fehlende Template-Dateien. "
                                     "Nach eigenständiger Bearbeitung ist das normal.")
            print(f"PASS {course.relative_to(root)}: {len(originals)} Template-Dateien, "
                  f"{len(changed)} bearbeitet, {len(missing)} entfernt/verschoben")
    print("Vorlagen geprüft; es wurden keine Dateien verändert.")

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check",action="store_true",help="Require byte-for-byte initial copies")
    run(check=parser.parse_args().check)
