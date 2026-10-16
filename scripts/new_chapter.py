"""Create a new Markdown subchapter in a course section without editing HTML.

Examples:
    python scripts/new_chapter.py einstieg --after 030 --nummer 3a --title "Neue Perspektiven"
    python scripts/new_chapter.py sprache --nummer 8 --title "Transfer"
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]


def slugify(title: str) -> str:
    title = (title.lower().replace("ä", "ae").replace("ö", "oe")
             .replace("ü", "ue").replace("ß", "ss"))
    title = unicodedata.normalize("NFKD", title)
    ascii_text = title.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text).strip("-")
    if not slug:
        raise ValueError("Der Titel muss mindestens einen Buchstaben oder eine Zahl enthalten.")
    return slug


def create_chapter(
    root: Path, section: str, title: str, number: str, *,
    short: str | None = None, after: str | None = None,
    slug: str | None = None, dry_run: bool = False,
) -> Path:
    manifest = json.loads((root / "kursseiten/manifest.json").read_text(encoding="utf-8"))
    is_extra = re.fullmatch(r"lektion-[0-9]{2}", section) is not None
    if is_extra:
        number_id = section.removeprefix("lektion-")
        if not (root / "unterricht" / "lektionen" / (number_id + ".json")).is_file():
            raise ValueError(f"Doppellektion {number_id} existiert noch nicht")
        folder = root / "kursseiten" / "lektionen" / number_id
    elif section in manifest["sections"]:
        folder = root / "kursseiten" / section
    else:
        raise ValueError(f"Unbekannter Bereich: {section}. Verfügbar: {', '.join(manifest['sections'])}")
    if not folder.is_dir():
        raise ValueError(f"Bereichsordner fehlt: {folder}")
    if not any(
        'class="kapitel"' in p.read_text(encoding="utf-8") or "type: chapter" in p.read_text(encoding="utf-8")
        for p in folder.glob("*.md")
    ):
        raise ValueError("Dieser Bereich enthält keine Kapitel; verwenden Sie einen Unterrichtsbereich.")
    if not re.fullmatch(r"[0-9]+[a-z]?", number):
        raise ValueError("Die sichtbare Kapitelnummer muss wie 3, 3a oder 10 aussehen.")
    if not title.strip():
        raise ValueError("Der Titel darf nicht leer sein.")
    slug = slugify(slug or title)
    chapter_id = f"{section}-{slug}"

    # IDs refer to students' saved answers and are therefore never replaced.
    for file in (root / "kursseiten").rglob("*.md"):
        source = file.read_text(encoding="utf-8")
        if re.search(r"\bid\s*=\s*['\"]" + re.escape(chapter_id) + r"['\"]", source):
            raise ValueError(f"Kapitel-ID ist schon vorhanden: {chapter_id}")
        if re.search(r"(?m)^id:\s*['\"]?" + re.escape(chapter_id) + r"['\"]?\s*$", source):
            raise ValueError(f"Kapitel-ID ist schon vorhanden: {chapter_id}")

    files = sorted(
        ((int(p.name[:3]), p) for p in folder.glob("[0-9][0-9][0-9]-*.md")),
        key=lambda pair: pair[0]
    )
    if not files:
        raise ValueError("Keine numerisch sortierten Kapiteldateien vorhanden.")
    content_orders = [n for n, _ in files if n != 999]
    if after is None:
        last = max(content_orders, default=0)
        order = last + 10
        if order >= 999:
            raise ValueError("Keine freie Position am Ende: Kapitel-Reihenfolge anpassen.")
    else:
        if not re.fullmatch(r"[0-9]{1,3}", after):
            raise ValueError("--after erwartet eine Dateinummer wie 030.")
        position = int(after)
        if position not in content_orders:
            raise ValueError(f"Es gibt keine Kapiteldatei mit dem Präfix {position:03d}.")
        upper = min([n for n, _ in files if n > position], default=999)
        order = (position + upper) // 2
        if order <= position:
            raise ValueError("Keine freie Nummer zwischen den Kapiteldateien. Präfixe neu ordnen.")
    path = folder / f"{order:03d}-{slug}.md"
    if path.exists():
        raise ValueError(f"Datei besteht bereits: {path}")
    if any(n == order for n, _ in files):
        raise ValueError(f"Sortiernummer {order:03d} wird bereits verwendet.")

    yaml_quoted = lambda value: json.dumps(value, ensure_ascii=False)
    output = (
        "---\n"
        "type: chapter\n"
        f"id: {chapter_id}\n"
        f"nummer: {yaml_quoted(number)}\n"
        f"titel: {yaml_quoted(title.strip())}\n"
        f"kurz: {yaml_quoted((short or title).strip())}\n"
        "open: true\n"
        "---\n\n"
        "Hier den neuen Unterrichtsinhalt in Markdown schreiben.\n\n"
        "## Auftrag\n\n"
        "Hier die Aufgabe beschreiben.\n"
    )
    if not dry_run:
        path.write_text(output, encoding="utf-8")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("section", help="Bestehender Unterrichtsbereich, z. B. einstieg")
    parser.add_argument("--title", required=True, help="Titel des neuen Kapitels")
    parser.add_argument("--nummer", required=True, help="Sichtbare Kapitelnummer, z. B. 3a")
    parser.add_argument("--short", help="Kurzbeschreibung für die Navigation")
    parser.add_argument("--after", help="Dateipräfix, nach dem das Kapitel erscheinen soll, z. B. 030")
    parser.add_argument("--slug", help="Optionaler URL-Slug (sonst vom Titel abgeleitet)")
    parser.add_argument("--dry-run", action="store_true", help="Nur Pfad anzeigen, noch nicht schreiben")
    args = parser.parse_args()
    try:
        path = create_chapter(
            ROOT, args.section, args.title, args.nummer,
            short=args.short, after=args.after, slug=args.slug, dry_run=args.dry_run
        )
    except (ValueError, OSError) as exc:
        parser.error(str(exc))
    print(f"{'Vorschau: ' if args.dry_run else 'Kapitel erstellt: '}{path.relative_to(ROOT)}")
    if not args.dry_run:
        print("Jetzt Markdown bearbeiten, danach 'make preview' starten.")


if __name__ == "__main__":
    main()
