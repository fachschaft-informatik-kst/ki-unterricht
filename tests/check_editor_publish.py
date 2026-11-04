"""Blocking, content-agnostic smoke checks for editor-created lessons and pages.

Checks genuine publishing contracts without assuming ten lessons, exact
chapter counts, teacher wording or manually curated example answers.
"""
from pathlib import Path
import json
import sys

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course

from course_registry import load_registry
MANIFESTS = tuple(course["manifest"] for course in load_registry(ROOT))


def ids_are_unique(soup, attr, selector=None):
    elements = soup.select(selector or f"[{attr}]")
    values = [tag[attr] for tag in elements if tag.has_attr(attr)]
    assert len(values) == len(set(values)), f"Duplicate {attr}: {values}"


def verify_course(manifest_path):
    model = load_course(ROOT, manifest_path)
    lessons = model["lessons"]
    assert lessons, manifest_path
    assert [lesson["number"] for lesson in lessons] == list(range(1, len(lessons) + 1))
    assert len({lesson["id"] for lesson in lessons}) == len(lessons)
    manifest = json.loads((ROOT / manifest_path).read_text(encoding="utf-8"))
    teaching = {section["id"] for section in manifest["sections"] if section.get("teaching")}
    for view in teaching:
        folder = (ROOT / manifest_path).parent / view
        assert (folder / "materialien.md").is_file(), f"Missing materials for {view}"
        assert list(folder.glob("[0-9][0-9][0-9]-*.md")), f"Missing chapters for {view}"
    assert all(lesson["view"] in teaching for lesson in lessons)
    return manifest, lessons


models = {path: verify_course(path) for path in MANIFESTS}

for kind, manifest_path in (("projekt", "kurse/bok/4-klasse/kursseiten/manifest.json"), ("basis", "kurse/bok/1-klasse/kursseiten/manifest.json")):
    manifest, lessons = models[manifest_path]
    directory = ROOT / "_build" / "site" / kind
    index = directory / "index.html"
    plan = directory / "unterrichtsplan.html"
    materials = directory / "materialien.html"
    listing = directory / "kurs.json"
    assert all(path.is_file() for path in (index, plan, materials, listing)), kind
    page = BeautifulSoup(index.read_text(encoding="utf-8"), "html.parser")
    teacher = BeautifulSoup(plan.read_text(encoding="utf-8"), "html.parser")
    resources = BeautifulSoup(materials.read_text(encoding="utf-8"), "html.parser")

    ids_are_unique(page, "id")
    ids_are_unique(page, "data-answer")
    ids_are_unique(page, "data-journal")
    ids_are_unique(page, "data-basis-answer")

    for section in manifest["sections"]:
        assert page.select_one("main > section#" + section["id"]), (
            kind, "missing section", section["id"]
        )

    built = json.loads(listing.read_text(encoding="utf-8"))["lessons"]
    assert [(lesson["id"], lesson["view"], lesson["number"]) for lesson in built] == [
        (lesson["id"], lesson["view"], lesson["number"]) for lesson in lessons
    ], f"{kind}: generated manifest differs from source"

    expected = [lesson["id"] for lesson in lessons]
    actual = [item["data-lesson"] for item in page.select("details.lesson-plan[data-lesson]")]
    # The 4th-year page groups the project first in the DOM; actual lesson
    # order is defined by kurs.json, not by the position of its topic section.
    assert len(actual) == len(expected) and set(actual) == set(expected), (
        kind, "missing or duplicate lesson plans", actual
    )

    if kind == "basis":
        assert len(teacher.select("h2")) == len(lessons), "Basis teacher plan is incomplete"
        resource_ids = [section["id"] for section in resources.select("section.basis-resource[id]")]
    else:
        teacher_ids = [item["data-lesson"] for item in teacher.select("details.lesson-plan[data-lesson]")]
        assert teacher_ids == expected, "Projekt teacher plans differ from student lesson IDs"
        resource_ids = [section["id"] for section in resources.select("section.lesson-resources[id]")]
    assert resource_ids == ["dl-" + ident for ident in expected], (
        kind, "teacher resources do not cover the current lessons", resource_ids
    )

    for link in page.select(".sidebar nav a[href^='#'], .nav a[href^='#']"):
        target = link["href"][1:]
        assert not target or page.find(id=target), f"{kind}: broken course navigation #{target}"

    assert "musterloesungen" not in index.read_text(encoding="utf-8").casefold(), (
        kind, "student pages must not link to teacher solutions"
    )
    print(f"PASS {kind}: {len(lessons)} lessons, matching student/teacher pages and unique saved keys")

print(f"PASS {len(models)} editable course models and both legacy published portals")
