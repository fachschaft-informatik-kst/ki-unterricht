"""Publish teacher/grade URLs from shared, internal source templates.

The former /basis/ and /projekt/ public course indexes are removed after
the generated teacher/grade pages have been packaged.
"""
from __future__ import annotations

import json
from html import escape
import re
import shutil
import sys
from pathlib import Path

from course_registry import load_registry, validate_registry

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "shared/course-sites.json"
RELATIVE_PARENT = re.compile(r"(?<![A-Za-z0-9./])(?:\.\./)+")


def add_path_depth(source: str) -> str:
    """A published course moved from one segment to two: ../ becomes ../../.

    Match whole parent-path prefixes, not each ../ separately, so paths that
    already contain multiple parent segments receive exactly one extra ../.
    """
    return RELATIVE_PARENT.sub(lambda match: "../" + match.group(0), source)


def shade(hexcolor: str, percent: float) -> str:
    """Blend a dark accent with white for readable, restrained backgrounds."""
    rgb = [int(hexcolor[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (255 - x) * percent):02x}" for x in rgb)


def theme_css(course: dict) -> str:
    accent = course["theme"]["accent"]
    # Retain the original BOK colour schemes for course/editor parity.
    presets = {
        "#3653a3": ("#e9eefc", "#f3f5fb", "#d9e0ef"),
        "#076959": ("#e7f1eb", "#f5f4ee", "#d8dfdb"),
    }
    soft, paper, line = presets.get(accent.lower(), (
        shade(accent, .89), shade(accent, .965), shade(accent, .87)))
    return (f":root{{--accent:{accent};--soft:{soft};"
            f"--paper:{paper};--line:{line};}}"
            f" a:focus-visible{{outline-color:{accent};}}")


def course_tab_title(course: dict) -> str:
    """Uniform browser tab title, independent of the visible course name."""
    return f'{course["teacher"]} KI {course["grade"]}. Klasse'


def planned_page(course: dict) -> str:
    label = escape(f'{course["teacher"]} · {course["grade"]}. Klasse')
    name = escape(course["name"])
    tab_title = escape(course_tab_title(course))
    return f"""<!doctype html>
<html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{tab_title}</title>
<link rel="icon" href="../../projekt/favicon.svg" type="image/svg+xml">
<style>{theme_css(course)}
body{{font:16px/1.65 system-ui,sans-serif;color:#182b31;background:var(--paper);margin:0}}
main{{max-width:650px;margin:12vh auto;padding:28px;background:white;border-top:5px solid var(--accent);border-radius:14px}}
small{{color:var(--accent);font-weight:750;letter-spacing:.06em}}
h1{{font-size:clamp(2rem,5vw,3rem);line-height:1.12}}
p{{color:#52656a}}a{{color:var(--accent)}}</style>
</head><body><main><small>{label}</small>
<h1>{name}</h1><h2>Dieser Kurs ist in Vorbereitung.</h2>
<p>Hier entstehen eigenständige Unterrichtsmaterialien für die {course["grade"]}. Klasse.
Es wurden keine Inhalte einer anderen Lehrperson übernommen.</p>
<p><a href="../../kurse.html">Zurück zur Kursübersicht</a></p>
</main></body></html>"""


def course_cards(courses: list[dict]) -> str:
    groups = []
    for teacher in dict.fromkeys(c["teacher"] for c in courses):
        entries = [c for c in courses if c["teacher"] == teacher]
        heading = escape(teacher)
        cards = []
        for c in entries:
            accent = c["theme"]["accent"]
            status = "Verfügbar" if c["status"] == "published" else "In Vorbereitung"
            description = ("Eigenständige Unterrichtsmaterialien, Lernjournal und Übungen."
                           if c["status"] == "published" else
                           "Dieser Kursbereich ist eingerichtet. Die Inhalte folgen.")
            cards.append(
                f'<a class="choice{" planned-card" if c["status"] == "planned" else ""}"'
                f' href="{escape(c["slug"])}/" style="--course-accent:{accent}">' +
                f'<span class="tag">{heading} · {c["grade"]}. Klasse · {status}</span>'
                f'<h3>{escape(c["name"])}</h3><p>{description}</p>'
                f'<span class="choice-bottom"><span>'
                f'{"Zum Kurs" if c["status"] == "published" else "Kursstatus ansehen"}'
                f'</span><span aria-hidden="true">↗</span></span></a>'
            )
        groups.append(f'<section class="group" aria-label="{heading}">'
                      f'<div class="group-heading"><h2>{heading}</h2>'
                      f'<span>{len(entries)} Kurse</span></div>'
                      f'<div class="choices">{"".join(cards)}</div></section>')
    return "\n".join(groups)


def overview(courses: list[dict]) -> str:
    page = (ROOT / "kurse.html").read_text(encoding="utf-8")
    return re.sub(r'<!-- COURSE_GROUPS_START -->.*?<!-- COURSE_GROUPS_END -->',
                  lambda _: '<!-- COURSE_GROUPS_START -->\n' +
                  course_cards(courses) + '\n<!-- COURSE_GROUPS_END -->',
                  page, count=1, flags=re.S)


def build(out: Path) -> None:
    out = Path(out)
    courses = load_registry(ROOT)
    for course in courses:
        slug, source = course["slug"], course["source"]
        target = out / slug
        if target.exists():
            shutil.rmtree(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        if course["status"] == "published":
            origin = out / ("basis" if course["grade"] == 1 else "projekt")
            if not (origin / "index.html").is_file():
                raise FileNotFoundError(origin / "index.html")
            shutil.copytree(origin, target, ignore=(
                (lambda folder, names: ["admin"] if Path(folder) == origin and "admin" in names else [])
                if origin.name == "projekt" else None
            ))
            from build_teacher_clone import render_clone
            render_clone(course, target)
            label = f'{course["teacher"]} · {course["grade"]}. Klasse'
            for file in target.rglob("*"):
                if not file.is_file() or file.suffix not in {".html", ".css", ".js"}:
                    continue
                content = add_path_depth(file.read_text(encoding="utf-8"))
                if file.suffix == ".html":
                    # Internal BOK views are templates, not public entrypoints.
                    if file.name == "index.html" and file.parent == target:
                        content = re.sub(r"<title>[^<]*</title>",
                                         f"<title>{escape(course_tab_title(course))}</title>",
                                         content, count=1)
                        content = content.replace("Intelligenz<small>Informatik</small>",
                                                  "Intelligenz<small>" + escape(label) + "</small>")
                    # Apply the same theme to material, AVIVA and glossary HTML.
                    content = re.sub(r"</head>", "<style data-course-theme>" +
                                     theme_css(course) + "</style></head>",
                                     content, count=1, flags=re.I)
                file.write_text(content, encoding="utf-8")
        else:
            target.mkdir(parents=True, exist_ok=True)
            (target / "index.html").write_text(planned_page(course), encoding="utf-8")
        if course["status"] == "published":
            shutil.copy2(ROOT / course["courseRoot"] / "content/experiments.json", target / "experiments.json")
        print(f"Course route: /{slug}/ ({course['status']})")
    (out / "kurse.html").write_text(overview(courses), encoding="utf-8")
    shutil.copyfile(ROOT / "portal-index.html", out / "index.html")


if __name__ == "__main__":
    build(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist")
