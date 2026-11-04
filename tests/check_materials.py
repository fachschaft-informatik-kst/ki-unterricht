"""Editable material titles, stable grouped IDs and strict image attribution."""
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import shutil
import sys

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import build_materials
import build_teacher_clone
from course_model import load_course


with TemporaryDirectory() as temporary:
    root = Path(temporary)
    base = root / "kurse/bok/4-klasse"
    shutil.copytree(ROOT / "kurse/bok/4-klasse", base)
    lessons = load_course(base)["lessons"]
    intro = base / "lehrperson/materialien.md"
    intro.write_text("# Eigener Materialkoffer\n\nFreie Einleitung.\n", encoding="utf-8")
    neuron = base / "kursseiten/perzeptron/materialien.md"
    neuron.write_text(neuron.read_text().replace("## Doppellektion 03", "## Frei gewählter Titel")
                      + "\nBegleittext ![Skizze](bild.svg \"Informieren | Lehrperson\") bleibt erhalten.\n",
                      encoding="utf-8")
    project = base / "kursseiten/projekt/materialien.md"
    project.write_text("\n".join(
        f"<!-- lesson:{identifier} -->\n## Titel ohne Lektionsnummer\n\nNUR-{identifier}\n"
        for identifier in ("07", "05", "06")
    ), encoding="utf-8")
    target = root / "output"
    with patch.multiple(build_materials, ROOT=root, SOURCE=intro,
                        OUTPUT=target / "materialien.html",
                        DOWNLOADS=target / "materialien/downloads"):
        build_materials.build(lessons)
    internal = BeautifulSoup((target / "materialien.html").read_text(), "html.parser")
    assert internal.h1.get_text() == "Eigener Materialkoffer"
    assert "Begleittext" in internal.select_one("#dl-03").get_text()
    assert "bleibt erhalten." in internal.select_one("#dl-03").get_text()
    assert [section["id"] for section in internal.select(".lesson-resources")] == [
        "dl-" + lesson["id"] for lesson in lessons
    ]
    with patch.object(build_teacher_clone, "ROOT", root):
        public = BeautifulSoup(build_teacher_clone.render_teacher_materials(
            {"courseRoot": "kurse/bok/4-klasse"}, lessons), "html.parser")
    assert public.select_one("#dl-3"), "Existing numeric bookmarks remain valid"
    for document in (internal, public):
        for identifier in ("05", "06", "07"):
            text = document.select_one("#dl-" + identifier).get_text()
            assert "NUR-" + identifier in text
            assert all("NUR-" + other not in text for other in ("05", "06", "07")
                       if other != identifier), "Grouped materials must not leak between lessons"

    lesson = next(lesson for lesson in lessons if lesson["id"] == "03")
    for source, message in (
        ('![](bild.svg "Informieren | Lehrperson")', "description"),
        ('![Bild](bild.svg)', "assignment"),
        ('![Bild](bild.svg "Unbekannt | Lehrperson")', "phase"),
        ('![Bild](bild.svg "Informieren | Nicht geplant")', "role"),
        ('<img src="bild.svg" alt=" "> ', "description"),
    ):
        try:
            build_materials.material_fragment(source, lesson, allow_html=True)
        except ValueError as error:
            assert message in str(error), error
        else:
            raise AssertionError("Invalid image accepted: " + source)
    for invalid in (
        "<!-- lesson:05 -->\nA\n<!-- lesson:05 -->\nB",
        "<!-- lesson:unbekannt -->\nA",
        "## Freier Titel\nOhne Zuordnung",
        "Verlorene Einleitung\n<!-- lesson:05 -->\nA",
    ):
        project.write_text(invalid, encoding="utf-8")
        try:
            build_materials.lesson_materials(base, lessons)
        except ValueError:
            pass
        else:
            raise AssertionError("Invalid material mapping accepted")
    project.unlink()
    try:
        build_materials.lesson_materials(base, lessons)
    except FileNotFoundError:
        pass
    else:
        raise AssertionError("Missing material file accepted")

print("PASS editable titles, grouped material IDs, legacy anchors, image validation and preserved prose")
