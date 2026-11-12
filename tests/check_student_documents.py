"""Prüft die generierten Word-Dokumente für Lernende (scripts/build_student_documents.py).

* Je Doppellektion und AVIVA-Phase genau ein .docx, passend zu den aktuellen
  Phasenüberschriften im Materialkoffer (sonst: ``make dokumente`` ausführen).
* Keine Lehrpersonenhinweise, Selbstkontrollen oder Lösungen in den Dokumenten.
* Das ZIP enthält genau dieselben Dateien.

Nur Standardbibliothek, damit die Prüfung ohne python-docx läuft.
"""
from __future__ import annotations

import io
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES = tuple(sorted(str(p.parent.parent.parent.relative_to(ROOT / "kurse"))
                       for p in (ROOT / "kurse").glob("*/*-klasse/lehrperson/dokumente/dokumente.json")))
PHASE = re.compile(r"^### (Ankommen|Vorwissen aktivieren|Informieren|Verarbeiten|Auswerten) · (\d+) Min\. · (.+)$", re.M)
TEACHER_ONLY = re.compile(
    r"Lehrpersonenhinweis|Hinweis für die Lehrperson|Selbstkontrolle:|Kontrollbeispiele|Kontrolle für \(|"
    r"Erwartung zum Lernschritt|Beratungskarte|Orientierung für die Sicherung|Fachliche Grenze:|"
    r"Lösung zum Vergleichen|Bereitlegen:|Plan B:|_Lsg|_loesung|Bundesstadt ist Bern")


def lessons(base: Path) -> list[dict]:
    manifest = json.loads((base / "kursseiten/manifest.json").read_text(encoding="utf-8"))
    found = []
    for section in manifest["sections"]:
        if section.get("teaching"):
            found += json.loads((base / "kursseiten" / section["id"] / "planung.json").read_text(encoding="utf-8"))["lessons"]
    return sorted(found, key=lambda lesson: lesson["order"])


def text_of(data: bytes) -> str:
    with zipfile.ZipFile(io.BytesIO(data)) as doc:
        xml = doc.read("word/document.xml").decode("utf-8")
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", xml))


def check(course: str) -> int:
    base = ROOT / "kurse" / course
    folder = base / "lehrperson/dokumente"
    index = json.loads((folder / "dokumente.json").read_text(encoding="utf-8"))
    grade = course.split("/")[-1]
    # Copies of a template keep the template index until `make dokumente` runs.
    assert index["version"] == 1 and index["course"] in (course, "_vorlagen/" + grade), course
    docs = index["documents"]
    plan = lessons(base)
    # Every DL needs its five phases exactly once.
    assert sorted((d["dl"], d["phase"]) for d in docs) == \
        [(dl, phase) for dl in range(1, len(plan) + 1) for phase in range(1, 6)], f"{course}: Phasen fehlen"
    expected = []
    for number, lesson in enumerate(plan, 1):
        if grade == "1-klasse":
            # 1st grade: tasks come from the AVIVA plan.
            expected += [(number, i, p["phase"], int(p["minutes"]), p["titel"].strip())
                         for i, p in enumerate(lesson["phases"], 1)]
            continue
        source = (base / "kursseiten" / lesson["view"] / "materialien.md").read_text(encoding="utf-8")
        blocks = re.split(r"^## ", source, flags=re.M)
        block = next((b for b in blocks if re.match(rf"Doppellektion 0?{number}\b", b)), "")
        expected += [(number, i, name, int(minutes), title.strip())
                     for i, (name, minutes, title) in enumerate(PHASE.findall(block), 1)]
    actual = [(d["dl"], d["phase"], d["phaseName"], d["minutes"], d["title"]) for d in docs]
    if actual != expected:
        # Material edits via the browser editor must not block unrelated PRs;
        # the documents are regenerated locally with `make dokumente`.
        print(f"WARNUNG {course}: Word-Dokumente sind älter als der Materialkoffer. "
              f"Bitte 'make dokumente' ausführen. Abweichungen: {sorted(set(actual) ^ set(expected))[:4]}",
              file=sys.stderr)
    files = {d["file"] for d in docs}
    on_disk = {p.name for p in folder.glob("*.docx")}
    assert files == on_disk, f"{course}: verwaiste oder fehlende .docx: {sorted(files ^ on_disk)}"
    for doc in docs:
        data = (folder / doc["file"]).read_bytes()
        assert doc["bytes"] == len(data), f"{doc['file']}: Grösse im Verzeichnis veraltet"
        text = text_of(data)
        assert doc["title"] in text, f"{doc['file']}: Titel fehlt"
        leak = TEACHER_ONLY.search(text)
        assert not leak, f"{doc['file']}: Lehrpersonen- oder Lösungsinhalt «{leak.group(0)}»"
    archive = folder / index["zip"]["file"]
    assert archive.stat().st_size == index["zip"]["bytes"]
    with zipfile.ZipFile(archive) as bundle:
        names = bundle.namelist()
        assert sorted(Path(n).name for n in names) == sorted(files), "ZIP enthält nicht alle Dokumente"
        for name in names:
            assert re.match(r"^DL\d{2}_[A-Za-z0-9_]+/DL\d{2}_[1-5]_[A-Za-z_]+\.docx$", name), name
            assert bundle.read(name) == (folder / Path(name).name).read_bytes(), f"ZIP veraltet: {name}"
    return len(docs)


def main() -> None:
    required = {"bok/1-klasse", "bok/4-klasse", "irn/1-klasse", "irn/4-klasse",
                "_vorlagen/1-klasse", "_vorlagen/4-klasse"}
    assert required <= set(COURSES), f"Dokumente fehlen für {sorted(required - set(COURSES))}"
    total = sum(check(course) for course in COURSES)
    print(f"PASS student documents: {total} Word-Dokumente in {len(COURSES)} Kursen/Vorlagen, Verzeichnis und ZIP aktuell, ohne Lehrpersonenhinweise")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as error:
        print(f"FAIL student documents: {error}", file=sys.stderr)
        sys.exit(1)
