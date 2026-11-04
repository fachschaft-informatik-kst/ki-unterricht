"""Publish teacher/grade URLs from shared, internal source templates.

The former /basis/ and /projekt/ public course indexes are removed after
the generated teacher/grade pages have been packaged.
"""
from __future__ import annotations

import json
import argparse
from html import escape
import re
import shutil
import sys
from pathlib import Path

from course_registry import load_registry, load_experiments, validate_registry

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
    """Blend an accent towards white (positive) or black (negative)."""
    rgb = [int(hexcolor[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(
        f"{max(0, min(255, round(x + (255 - x) * percent if percent >= 0 else x * (1 + percent)))):02x}"
        for x in rgb)

def course_artwork(course: dict, svg: str) -> str:
    accent = course["theme"]["accent"]
    return (svg.replace("#076959", accent)
            .replace("#0a8a74", accent)
            .replace("#054f43", shade(accent, -.2))
            .replace("#b84d27", shade(accent, .4))
            .replace("#f2a27a", shade(accent, .6))
            .replace("#f5f4ee", shade(accent, .965)))


def theme_css(course: dict) -> str:
    accent = course["theme"]["accent"]
    # Retain the original BOK colour schemes for course/editor parity.
    presets = {
        "#3653a3": ("#e9eefc", "#f3f5fb", "#d9e0ef"),
        "#076959": ("#e7f1eb", "#f5f4ee", "#d8dfdb"),
    }
    soft, paper, line = presets.get(accent.lower(), (
        shade(accent, .89), shade(accent, .965), shade(accent, .87)))
    glow = "#dfe9ff" if accent.lower() == "#3653a3" else soft
    sidebar = "#f5f8ff" if accent.lower() == "#3653a3" else shade(accent, .975)
    return (f":root{{--accent:{accent};--soft:{soft};"
            f"--paper:{paper};--line:{line};}}"
            f" a:focus-visible{{outline-color:{accent};}}"
            f"body{{--course-glow:{glow};--course-sidebar:{sidebar};"
            f"--course-light:{shade(accent, .4)};--course-dark:{shade(accent, -.2)};}}"
            "body:not(.studio-page){background:radial-gradient(1200px 600px at 85% -10%,"
            "var(--course-glow) 0,transparent 60%) no-repeat fixed,var(--paper)}"
            "body::before{background-image:url(grafiken/netz_hintergrund_kurs.svg)}"
            "body .sidebar{background:linear-gradient(180deg,#fff 0,var(--course-sidebar) 100%)}"
            "body .sidebar .brand .mark{background:linear-gradient(145deg,var(--accent),var(--course-dark))}"
            "body .course-card::before{background:linear-gradient(90deg,var(--accent),var(--course-light))}"
            "body .course-card:hover{box-shadow:0 14px 34px color-mix(in srgb,var(--accent) 10%,transparent)}"
            "body .nav a[aria-current],body .nav a:hover{background:var(--soft);color:var(--accent);border-left-color:var(--accent)}"
            "body .btn.primary{background:var(--accent);border-color:var(--accent)}"
            "body .lab-head,body .basis-language-result,body .basis-language-option:hover,"
            "body .basis-language-option:focus-visible,body .memory-card.matched,"
            "body .basis-memory-grid button[data-matched=true]{background:var(--soft)}"
            "body .basis-memory-grid button[data-matched=true]{color:var(--accent)}"
            "body .basis-answer textarea,body .basis-language-lab select,"
            "body .basis-language-option,body .group-box.train{border-color:var(--line)}"
            "body .basis-language-option,body .variant{background:var(--paper)}"
            "body .basis-language-bar{background:var(--line)}"
            "body .course-card>b{color:var(--course-light)}"
            "body .crumb span+span::before{border-color:var(--line)}"
            "body .lab-panel,body input[type=text]{border-color:var(--line)}"
            "body .project-train-flow li,body .lab-loading:not([hidden]){background:var(--paper)}"
            "body .project-train-flow em{background:var(--soft);color:var(--accent)}"
            "body #fremdmodell .dl8-question,body #fremdmodell #dl8-ablauf,"
            "body #fremdmodell .dl8-overview,body #fremdmodell .dl8-person-card,"
            "body #fremdmodell #reproduktion label.answer,"
            "body #fremdmodell #fremdtest .protokoll-block{border-color:var(--line)}"
            "body #fremdmodell .dl8-question{background:var(--soft)}"
            "body #fremdmodell .dl8-step-time,body #fremdmodell .dl8-next,"
            "body #fremdmodell .dl8-explainer,body #fremdmodell .dl8-person-card{background:var(--paper)}"
            "body .concept,body .concept div{border-color:var(--course-light);background:var(--soft)}"
            "body .concept div{background:color-mix(in srgb,var(--accent) 15%,white)}"
            "body .concept div div{background:color-mix(in srgb,var(--accent) 25%,white)}"
            "body .group-box.train{background:var(--soft)}"
            "body .lab-loading-spinner{border-color:var(--line);border-top-color:var(--accent)}"
            "body input[type=checkbox],body input[type=radio],body progress{accent-color:var(--accent)}")


def course_tab_title(course: dict) -> str:
    """Uniform browser tab title, independent of the visible course name."""
    return f'{course["name"]} · {course["teacher"]} · {course["grade"]}. Klasse'


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
            description = ("" if c["status"] == "published" else
                           "<p>Dieser Kursbereich ist eingerichtet. Die Inhalte folgen.</p>")
            cards.append(
                f'<a class="choice{" planned-card" if c["status"] == "planned" else ""}"'
                f' href="{escape(c["slug"])}/" style="--course-accent:{accent}">' +
                f'<span class="tag">{heading} · {c["grade"]}. Klasse · {status}</span>'
                f'<h3>{escape(c["name"])}</h3>{description}'
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


def copy_course_assets(course: dict, target: Path) -> None:
    from build_materials import FILES

    base = ROOT / course["courseRoot"]
    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / "shared/portal", target, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns("admin", "*.template.html", "README.md"))
    shutil.copytree(base / "assets", target, dirs_exist_ok=True)
    entries = load_experiments(course, ROOT)
    (target / "experiments.json").write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if course["grade"] == 1:
        shutil.copytree(ROOT / "shared/basis", target, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns("*.template.html"))
        template = (ROOT / "shared/portal/index.template.html").read_text(encoding="utf-8")
        style = re.search(r"<style>(.*?)</style>", template, re.S)
        if not style:
            raise ValueError("Gemeinsame CSS-Basis fehlt")
        (target / "theme.css").write_text(style.group(1) + "\n", encoding="utf-8")
    svg = (base / "assets/grafiken/netz_hintergrund.svg").read_text(encoding="utf-8")
    (target / "grafiken/netz_hintergrund_kurs.svg").write_text(
        course_artwork(course, svg), encoding="utf-8")
    favicon = (ROOT / "shared/portal/favicon.svg").read_text(encoding="utf-8")
    (target / "favicon.svg").write_text(course_artwork(course, favicon), encoding="utf-8")
    studio = target / "studio"
    studio.mkdir(exist_ok=True)
    for source, name in (("fotostudio.html", "index.html"),
                         ("fotostudio_core.js", "fotostudio_core.js"),
                         ("fotostudio_storage.js", "fotostudio_storage.js")):
        shutil.copy2(base / "content/ki_projekt" / source, studio / name)
    runtime = target / "runtime"
    runtime.mkdir(exist_ok=True)
    for name in ("ki_foto_tools.py", "ki_projekt_tools.py", "foto_uebungsdaten.json"):
        shutil.copy2(base / "content/ki_projekt" / name, runtime / name)
    shutil.copy2(base / "content/unterricht_tools.py", runtime / "unterricht_tools.py")
    downloads = target / "materialien/downloads"
    downloads.mkdir(parents=True, exist_ok=True)
    for name, relative in FILES.items():
        shutil.copy2(base / relative, downloads / name)
    for entry in entries:
        shutil.copy2(base / "content" / entry["source"], downloads / Path(entry["source"]).name)


def build(out: Path, courses: list[dict] | None = None) -> None:
    out = Path(out)
    courses = load_registry(ROOT) if courses is None else courses
    out.mkdir(parents=True, exist_ok=True)
    for legacy in ("projekt", "basis"):
        folder = out / legacy
        if folder.exists():
            shutil.rmtree(folder)
    shutil.copytree(ROOT / "shared/portal", out / "projekt", dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns("*.template.html", "README.md"))
    for path in (ROOT / "shared").glob("*"):
        if path.is_file():
            shutil.copy2(path, out / "projekt/admin" / path.name)
    for course in courses:
        slug, source = course["slug"], course["source"]
        target = out / slug
        if target.exists():
            shutil.rmtree(target)
        target.parent.mkdir(parents=True, exist_ok=True)
        if course["status"] == "published":
            copy_course_assets(course, target)
            from build_teacher_clone import render_clone
            render_clone(course, target)
            label = f'{course["teacher"]} · {course["grade"]}. Klasse'
            for file in target.rglob("*"):
                if not file.is_file() or file.suffix not in {".html", ".css", ".js"}:
                    continue
                content = add_path_depth(file.read_text(encoding="utf-8"))
                if file.suffix == ".html":
                    if file.parent == target / "studio":
                        content = content.replace("<body>", '<body class="studio-page">', 1)
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
        print(f"Course route: /{slug}/ ({course['status']})")
    (out / "kurse.html").write_text(overview(courses), encoding="utf-8")
    shutil.copyfile(ROOT / "portal-index.html", out / "index.html")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("out", nargs="?", type=Path, default=ROOT / "dist")
    parser.add_argument("--course", help="Nur diesen Kurs bauen, z. B. irn/1-klasse")
    args = parser.parse_args()
    courses = None
    if args.course:
        selected = [c for c in load_registry(ROOT, check_files=False) if c["slug"] == args.course]
        if not selected:
            parser.error(f"Unbekannter Kurs: {args.course}")
        courses = validate_registry(selected, ROOT)
    build(args.out, courses)
