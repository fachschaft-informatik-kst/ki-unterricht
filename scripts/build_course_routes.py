"""Publish stable teacher/grade URLs without changing legacy course paths or student data.

The existing /basis/ and /projekt/ paths remain intact: old bookmarks, stored
answer keys and notebook runtime endpoints must continue to work.
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "shared/course-sites.json"
RELATIVE_PARENT = re.compile(r"(?<![A-Za-z0-9./])(?:\.\./)+")


def add_path_depth(source: str) -> str:
    """A published course moved from one segment to two: ../ becomes ../../.

    Match whole parent-path prefixes, not each ../ separately, so paths that
    already contain multiple parent segments receive exactly one extra ../.
    """
    return RELATIVE_PARENT.sub(lambda match: "../" + match.group(0), source)


def planned_page(teacher: str, grade: int) -> str:
    name = f"{teacher} · {grade}. Klasse"
    return f"""<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} · KI-Unterricht</title>
<link rel="icon" href="../../projekt/favicon.svg" type="image/svg+xml">
<style>
body{{font:16px/1.65 system-ui,sans-serif;color:#182b31;background:#f5f4ee;margin:0}}
main{{max-width:650px;margin:12vh auto;padding:28px}}
small{{color:#076959;font-weight:750;letter-spacing:.06em}}
h1{{font-size:clamp(2rem,5vw,3rem);line-height:1.12}}
p{{color:#52656a}}a{{color:#076959}}
</style></head><body><main><small>{name}</small>
<h1>Dieser Kurs ist in Vorbereitung.</h1>
<p>IRN kann hier später eigene Unterrichtsmaterialien für die {grade}. Klasse veröffentlichen.
Es wurden noch keine Unterrichtsinhalte übernommen.</p>
<p><a href="../../kurse.html">Zurück zur Kursübersicht</a></p>
</main></body></html>"""


def build(out: Path) -> None:
    out = Path(out)
    records = json.loads(REGISTRY.read_text(encoding="utf-8"))["courses"]
    used = set()
    for course in records:
        slug, source = course["slug"], course["source"]
        if (not re.fullmatch(r"[a-z0-9-]+/[1-9][0-9]*-klasse", slug)
                or slug in used or course["status"] not in {"published", "planned"}):
            raise ValueError(f"Ungültige oder doppelte Kursadresse: {slug}")
        used.add(slug)
        target = out / slug
        if target.exists():
            shutil.rmtree(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        if course["status"] == "published":
            if source not in {"basis", "projekt"}:
                raise ValueError(f"Unbekannter Bestandskurs: {source}")
            origin = out / source
            if not (origin / "index.html").is_file():
                raise FileNotFoundError(origin / "index.html")
            shutil.copytree(origin, target, ignore=(
                (lambda folder, names: ["admin"] if Path(folder) == origin and "admin" in names else [])
                if source == "projekt" else None
            ))
            for file in target.rglob("*"):
                if file.suffix not in {".html", ".css", ".js"} or not file.is_file():
                    continue
                content = file.read_text(encoding="utf-8")
                updated = add_path_depth(content)
                if content != updated:
                    file.write_text(updated, encoding="utf-8")
        else:
            if source is not None:
                raise ValueError("Geplanter Kurs darf keine fremden Inhalte übernehmen")
            target.mkdir(parents=True, exist_ok=True)
            (target / "index.html").write_text(planned_page(course["teacher"], course["grade"]), encoding="utf-8")
        print(f"Course route: /{slug}/ ({course['status']})")
    for filename in ("kurse.html", "portal-index.html"):
        shutil.copyfile(ROOT / filename, out / ("index.html" if filename == "portal-index.html" else filename))


if __name__ == "__main__":
    build(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist")
