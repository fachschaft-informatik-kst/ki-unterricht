"""Exclude teacher-only pages and answer resources from the public Pages artefact.

GitHub Pages has no authentication. All teaching references must point to the
existing OAuth-protected Worker. This is *not* repository source confidentiality:
the public GitHub repository (including history) still exposes authored files.
"""
from __future__ import annotations
import re
import shutil
import sys
from pathlib import Path

WORKER = "https://kst-ki-admin.kevin-bohn.workers.dev"
TEACHER_ONLY = ("unterrichtsplan.html", "materialien.html", "KI_Planung.md")
TEACHER_ONLY_DOWNLOADS = (
    "Arbeitsblatt_Perzeptron_Lsg.md",
    "KI_Bewertungsraster.md",
    "koordinatengitter_perzeptron_and_loesung.svg",
    "koordinatengitter_or_nand_xor.svg",
)
LINK_PATTERN = re.compile(
    r'(?P<attr>href|src)=(?P<quote>["\x27])'
    r'(?P<prefix>(?:\.\./|\./)*(?:projekt/|basis/)?)'
    r'(?P<file>unterrichtsplan\.html|materialien\.html|'
    r'musterloesungen(?:/index\.html|/)?|'
    r'materialien/downloads/[a-zA-Z0-9_.-]+)'
    r'(?P=quote)'
)

def protect(site: Path) -> None:
    site = Path(site)
    course_roots = {
        "projekt": "bok/4-klasse",
        "basis": "bok/1-klasse",
        "bok/1-klasse": "bok/1-klasse",
        "bok/4-klasse": "bok/4-klasse",
    }
    for relative, slug in course_roots.items():
        root = site / relative
        if not root.is_dir():
            continue
        for name in TEACHER_ONLY:
            (root / name).unlink(missing_ok=True)
        shutil.rmtree(root / "musterloesungen", ignore_errors=True)
        downloads = root / "materialien" / "downloads"
        for name in TEACHER_ONLY_DOWNLOADS:
            (downloads / name).unlink(missing_ok=True)
        def relink(match: re.Match) -> str:
            target = match.group("file")
            if target == "unterrichtsplan.html":
                kind = "planung"
            elif target == "materialien.html":
                kind = "materialien"
            elif target.startswith("musterloesungen"):
                kind = "musterloesungen"
            elif target.startswith("materialien/downloads/"):
                name = target.rsplit("/", 1)[1]
                if name not in TEACHER_ONLY_DOWNLOADS:
                    return match.group(0)  # existing student downloads stay public
                return f'{match.group("attr")}={match.group("quote")}{WORKER}/teacher/downloads/{name}{match.group("quote")}'
            else:
                return match.group(0)
            return f'{match.group("attr")}={match.group("quote")}{WORKER}/teacher/{slug}/{kind}{match.group("quote")}'
        for page in root.rglob("*.html"):
            content = page.read_text(encoding="utf-8")
            new = LINK_PATTERN.sub(relink, content)
            if new != content:
                page.write_text(new, encoding="utf-8")
    print("Protected teacher pages excluded from public Pages artefact")

if __name__ == "__main__":
    protect(Path(sys.argv[1]) if len(sys.argv)>1 else Path("dist"))
