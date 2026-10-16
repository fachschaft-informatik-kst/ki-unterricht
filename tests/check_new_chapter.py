"""New subchapters can be authored as Markdown without touching JS or HTML."""
import json
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from new_chapter import create_chapter, slugify
from build_portal import render_fragment

assert slugify("Künstliche Intelligenz & Übung") == "kuenstliche-intelligenz-uebung"
with TemporaryDirectory() as temp:
    root = Path(temp)
    folder = root / "kursseiten/einstieg"
    folder.mkdir(parents=True)
    (root / "kursseiten/manifest.json").write_text(
        json.dumps({"sections": ["einstieg", "start"]}), encoding="utf-8"
    )
    for n in (0, 30, 40, 999):
        (folder / f"{n:03d}-example.md").write_text(
            f'<details class="kapitel" id="old-{n}"><summary>'
            f'<span class="kapitel-nr">{n//10}</span></summary></details>\n',
            encoding="utf-8",
        )
    path = create_chapter(
        root, "einstieg", "Neue Perspektiven", "3a",
        short="Ein Beispiel", after="030",
    )
    assert path.name == "035-neue-perspektiven.md"
    content = path.read_text(encoding="utf-8")
    fragment = render_fragment(content, path)
    soup = BeautifulSoup(fragment, "html.parser")
    chapter = soup.select_one("details.kapitel#einstieg-neue-perspektiven")
    assert chapter
    assert chapter.select_one("h2.kapitel-titel").get_text() == "Neue Perspektiven"
    assert chapter["data-kurz"] == "Ein Beispiel"
    assert chapter.select_one(".kapitel-body h2").get_text() == "Auftrag"
    assert [p.name[:3] for p in sorted(folder.glob("*.md"))] == ["000", "030", "035", "040", "999"]
    try:
        create_chapter(root, "einstieg", "Neue Perspektiven", "3a", after="030")
        raise AssertionError("Would overwrite an existing chapter")
    except ValueError:
        pass
    try:
        create_chapter(root, "start", "Extra", "1")
        raise AssertionError("Would allow a non-chapter section")
    except ValueError:
        pass
    preview = create_chapter(root, "einstieg", "Zweiter Versuch", "5", dry_run=True)
    assert preview.name == "050-zweiter-versuch.md" and not preview.exists()
print("PASS new Markdown chapter with stable ID, ordering, YAML frontmatter and no overwrites")
