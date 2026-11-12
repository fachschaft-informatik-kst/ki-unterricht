"""Erzeugt Word-Dokumente (.docx) für Schülerinnen und Schüler, eines je AVIVA-Phase.

Quelle sind die Materialkoffer-Texte ``kursseiten/<bereich>/materialien.md`` eines
Kurses. Pro Doppellektion und Phase (Ankommen, Vorwissen aktivieren, Informieren,
Verarbeiten, Auswerten) entsteht ein Dokument mit den Aufträgen, Tabellen und
Grafiken dieser Phase. Lehrpersonenhinweise, Selbstkontrollen und Lösungen
(abgesetzte Kästen, Lösungskarten, geschützte Lösungsdateien) werden nicht
übernommen.

Ausgabe in ``kurse/<kurs>/lehrperson/dokumente/``:

* ``DLxx_y_<Phase>.docx``  – ein Dokument je Phase
* ``dokumente.json``       – Verzeichnis für den Lehrpersonenbereich
* ``<Kurs>_Alle_Dokumente.zip`` – alle Dokumente, nach Doppellektion geordnet

Benutzung::

    make dokumente                       # Standard: irn/4-klasse
    .venv/bin/python scripts/build_student_documents.py --course irn/4-klasse

Benötigt python-docx und markdown-it-py (``requirements-docs.txt``) sowie für
SVG-Grafiken Node.js mit Playwright (``npm ci``).
"""
from __future__ import annotations

import argparse
import io
import json
import re
import subprocess
import tempfile
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.image.image import Image as DocxImage
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ROW_HEIGHT_RULE
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.opc.constants import RELATIONSHIP_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://fachschaft-informatik-kst.github.io/ki-unterricht/"
PHASES = ("Ankommen", "Vorwissen aktivieren", "Informieren", "Verarbeiten", "Auswerten")
PHASE_FILE = {"Ankommen": "Ankommen", "Vorwissen aktivieren": "Vorwissen_aktivieren",
              "Informieren": "Informieren", "Verarbeiten": "Verarbeiten", "Auswerten": "Auswerten"}
PHASE_RE = re.compile(r"^(%s) · (\d+) Min\. · (.+)$" % "|".join(PHASES))
BLANK_RE = re.compile(r"_{4,}")
# Lösungen und Bewertungsunterlagen bleiben im geschützten Lehrpersonenbereich.
PROTECTED = re.compile(r"(_lsg|_loesung|koordinatengitter_or_nand_xor\.svg$|KI_Bewertungsraster)", re.I)
FIXED_DATE = (2026, 1, 1, 0, 0, 0)

# Sätze und Absätze, die sich an die Lehrperson richten oder Lösungen verraten.
# Jede Regel muss genau einmal greifen; so fällt eine geänderte Vorlage sofort auf.
EDITS: dict[str, list[tuple[str, str]]] = {
    "irn/4-klasse": [
        ("Der Input ist in zwei Blöcke geteilt. Block 1 (7 Min.): Regeln von Menschen oder Lernen "
         "aus Daten, mit Bilderkennung und Schachprogramm. Dann der Abrufauftrag (2 Min.): Ohne "
         "Unterlagen erklären die Tandems einander in zwei Sätzen, wer bei einem Schachprogramm "
         "und wer bei einem lernenden Bilderkenner festlegt, wie entschieden wird. Block 2 "
         "(6 Min.): die Begriffe der Inputkarte, schwache und starke KI, Meilensteine.",
         "**Abrufauftrag (Tandem, 2 Min., ohne Unterlagen):** Erklären Sie einander in zwei "
         "Sätzen, wer bei einem Schachprogramm und wer bei einem lernenden Bilderkenner festlegt, "
         "wie entschieden wird."),
        ("**Antwortort:** [Fall «Schulweg» auf der Kursseite](index.html#einstieg-5). Einzelne "
         "Gruppen teilen ihre Argumente nur sehr kurz; kein zusätzliches Präsentationsfenster.",
         "**Antwortort:** [Fall «Schulweg» auf der Kursseite](index.html#einstieg-5)."),
        ("Kein Wechsel zu weiteren Werkzeugen wie Akinator oder Filmempfehlungen.\n", ""),
        ("**Lehrperson:** Zeigt den Schritt im Neuron-Labor; die Klasse sagt vorher, was sich ändert.",
         "Die Lehrperson zeigt den Schritt im Neuron-Labor. Sagen Sie vorher, was sich ändert."),
        ("Die algebraischen Bedingungen nur nennen und nicht vorführen: Das Tandem schreibt sie im "
         "Anschluss selbst auf.", ""),
        ("#### Tafelkarte · OR und NAND als neue Merkmale (Lehrperson · 7 Min.)",
         "#### Tafelkarte · OR und NAND als neue Merkmale"),
        ("Danach vergleichen die Lernenden mit der Selbstkontrolle; die Lehrperson liest zwei bis "
         "drei Antworten an und sammelt offene Fragen für den Start in DL 5.",
         "Vergleichen Sie danach mit der Selbstkontrolle auf der Kursseite."),
        ("**Ausblick, kein neuer Fachinput:** Der selbstständige Lernpfad zur Datenaufteilung "
         "beginnt erst in DL5. Ein Satz zur Brücke:", "**Ausblick:**"),
        (" Die Lehrperson gibt Thema und Klassen am Anfang von DL 5 frei, wenn beide Klassen noch "
         "frei sind (etwa eine Minute je Tandem, während die Tandems den Lernpfad lesen).",
         " Die Lehrperson gibt Thema und Klassen am Anfang von DL 5 frei, wenn beide Klassen noch "
         "frei sind."),
        ("Klärt Etappenplan, fünf Reflexionen, Raster, Abgabekanal, Frist **vor DL8** und "
         "ZIP-Sicherung. Die folgenden Fachkarten sind zum **selbstständigen Lesen**, nicht als "
         "zusätzlicher Vortrag gedacht. Hilfe auf konkrete Fragen.",
         "Die Lehrperson klärt Etappenplan, fünf Reflexionen, Raster, Abgabekanal, Frist "
         "**vor DL8** und ZIP-Sicherung. Die folgenden Fachkarten sind zum **selbstständigen "
         "Lesen**. Hilfe gibt es auf konkrete Fragen."),
        ("Vergleichen Sie danach mit der Tafelkarte und dem Kurskapitel.",
         "Vergleichen Sie danach mit der Tafelkarte und dem Kurskapitel.\n\n"
         "| Eingabe | Ziel | Bedingung an w₁, w₂ und b | Widerspruch zu Zeile … |\n"
         "|---|---:|---|---|\n"
         "| (0,0) | 0 | ____________________ | ______ |\n"
         "| (0,1) | 1 | ____________________ | ______ |\n"
         "| (1,0) | 1 | ____________________ | ______ |\n"
         "| (1,1) | 0 | ____________________ | ______ |"),
        (" Die Lehrperson erkennt bei Rundgängen, wer Unterstützung braucht.", ""),
        (" Die Lehrperson sammelt sie ein und gibt sie in DL 9 aus.", ""),
        (" Human or Not ist ein Live-Chat mit Fremden und wird nur nach schulischer Freigabe "
         "innerhalb desselben Zeitbudgets eingesetzt.", ""),
        ("| 1 · Landessprachen inklusive Englisch | stimmt nicht | Landessprachen: Deutsch, "
         "Französisch, Italienisch, Rätoromanisch (Bundesverfassung Art. 4) |",
         "| 1 · Landessprachen inklusive Englisch | ____________________ | ____________________ |"),
        ("| 2 · Bundesrat mit sieben Mitgliedern | stimmt | admin.ch |",
         "| 2 · Bundesrat mit sieben Mitgliedern | ____________________ | ____________________ |"),
        ("| 3 · rund 12 Millionen Einwohner | stimmt nicht | rund 9 Millionen (bfs.admin.ch) |",
         "| 3 · rund 12 Millionen Einwohner | ____________________ | ____________________ |"),
        ("| 4 · 90 % sprechen mindestens zwei Landessprachen, «Bundesamt für Sprachforschung» | "
         "nicht belegbar | Das Bundesamt gibt es nicht; die Quelle ist erfunden |",
         "| 4 · 90 % sprechen mindestens zwei Landessprachen, «Bundesamt für Sprachforschung» | "
         "____________________ | ____________________ |"),
        ("Die Tandems teilen die Aussagen auf, prüfen sie",
         "Teilen Sie die Aussagen im Tandem auf, prüfen Sie sie"),
        (" und notieren «stimmt», «stimmt nicht» oder «nicht belegbar» samt Quelle.",
         " und notieren Sie «stimmt», «stimmt nicht» oder «nicht belegbar» samt Quelle."),
        (" Die Bundesstadt ist Bern.", ""),
        (" Die Lehrperson liest ein bis zwei Transferfragen aus DL 8 vor («Wenn ein System immer "
         "antwortet, auch wenn keine Antwort passt, dann …»).",
         " Lesen Sie Ihre Transferfrage aus DL 8 nochmals: «Wenn ein System immer antwortet, auch "
         "wenn keine Antwort passt, dann …»."),
    ],
}


# --------------------------------------------------------------------------- Modell

@dataclass
class Run:
    text: str
    bold: bool = False
    italic: bool = False
    code: bool = False
    href: str | None = None


@dataclass
class Block:
    kind: str                      # heading, paragraph, list, table, image, meta
    runs: list[Run] = field(default_factory=list)
    items: list[list[Run]] = field(default_factory=list)
    ordered: bool = False
    rows: list[list[list[Run]]] = field(default_factory=list)
    src: str = ""
    alt: str = ""


@dataclass
class Phase:
    dl: int
    lesson: str
    index: int
    name: str
    minutes: int
    title: str
    blocks: list[Block] = field(default_factory=list)

    @property
    def file(self) -> str:
        return f"DL{self.dl:02d}_{self.index}_{PHASE_FILE[self.name]}.docx"


# --------------------------------------------------------------------------- Quellen

def lessons_of(base: Path) -> list[dict]:
    manifest = json.loads((base / "kursseiten/manifest.json").read_text(encoding="utf-8"))
    lessons = []
    for section in manifest["sections"]:
        if section.get("teaching"):
            plan = json.loads((base / "kursseiten" / section["id"] / "planung.json").read_text(encoding="utf-8"))
            lessons += plan.get("lessons", [])
    lessons.sort(key=lambda lesson: lesson.get("order", 0))
    return [{**lesson, "number": i + 1} for i, lesson in enumerate(lessons)]


def material_sources(base: Path, lessons: list[dict]) -> str:
    seen, parts = set(), []
    for lesson in lessons:
        if lesson["view"] not in seen:
            seen.add(lesson["view"])
            parts.append((base / "kursseiten" / lesson["view"] / "materialien.md").read_text(encoding="utf-8"))
    return "\n\n".join(parts)


def apply_edits(source: str, course: str) -> str:
    for old, new in EDITS.get(course, []):
        count = source.count(old)
        if count != 1:
            raise SystemExit(f"Bearbeitungsregel greift {count}× statt genau einmal:\n  {old[:90]}…")
        source = source.replace(old, new)
    return source


def download_sources() -> dict[str, str]:
    import sys
    sys.path.insert(0, str(ROOT / "scripts"))
    from build_materials import FILES  # noqa: E402  (gemeinsame Zuordnung der Downloads)
    return dict(FILES)


# --------------------------------------------------------------------------- Markdown

def inline_runs(token, course: str) -> list[Run]:
    runs: list[Run] = []
    bold = italic = 0
    href: str | None = None
    for child in token.children or []:
        t = child.type
        if t == "strong_open":
            bold += 1
        elif t == "strong_close":
            bold -= 1
        elif t == "em_open":
            italic += 1
        elif t == "em_close":
            italic -= 1
        elif t == "link_open":
            href = public_url(child.attrGet("href") or "", course)
        elif t == "link_close":
            href = None
        elif t in ("text", "html_inline"):
            text = child.content.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
            if t == "html_inline":
                continue
            runs.append(Run(text, bool(bold), bool(italic), False, href))
        elif t == "code_inline":
            runs.append(Run(child.content, bool(bold), bool(italic), True, href))
        elif t in ("softbreak", "hardbreak"):
            runs.append(Run(" ", bool(bold), bool(italic), False, href))
    return merge_runs(runs)


def merge_runs(runs: list[Run]) -> list[Run]:
    merged: list[Run] = []
    for run in runs:
        if merged and (merged[-1].bold, merged[-1].italic, merged[-1].code, merged[-1].href) == \
                (run.bold, run.italic, run.code, run.href):
            merged[-1].text += run.text
        else:
            merged.append(Run(run.text, run.bold, run.italic, run.code, run.href))
    return merged


def public_url(raw: str, course: str) -> str | None:
    if re.match(r"^(https?:|mailto:)", raw):
        return raw
    raw = raw.removeprefix("./")
    if raw.startswith("materialien/downloads/"):
        if PROTECTED.search(raw):
            return None
        return SITE + course + "/" + raw
    match = re.match(r"^(?:\.\./)*index\.html(#.*)?$", raw)
    if match:
        return SITE + course + "/" + (match.group(1) or "")
    if raw.startswith("#"):
        return SITE + course + "/" + raw
    return SITE + course + "/" + raw


def text_of(runs: list[Run]) -> str:
    return "".join(run.text for run in runs).strip()


def parse(source: str, course: str, lessons: list[dict]) -> list[Phase]:
    md = MarkdownIt("commonmark").enable("table")
    tokens = md.parse(source)
    titles = {lesson["number"]: lesson["title"] for lesson in lessons}
    phases: list[Phase] = []
    current: Phase | None = None
    dl = 0
    skip_heading_level: int | None = None   # Lösungsabschnitt bis zur nächsten Überschrift
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if tok.type == "heading_open":
            level = int(tok.tag[1])
            title = tokens[i + 1].content.strip()
            if skip_heading_level is not None and level <= skip_heading_level:
                skip_heading_level = None
            if level == 2:
                match = re.match(r"^Doppellektion\s+(\d+)", title)
                dl = int(match.group(1)) if match else 0
                current = None
            elif level == 3:
                match = PHASE_RE.match(title)
                current = None
                if match and dl:
                    name = match.group(1)
                    current = Phase(dl, titles.get(dl, ""), PHASES.index(name) + 1, name,
                                    int(match.group(2)), match.group(3))
                    phases.append(current)
            elif current is not None and skip_heading_level is None:
                if re.search(r"Lösung", title):
                    skip_heading_level = level
                else:
                    current.blocks.append(Block("heading", inline_runs(tokens[i + 1], course)))
            i += 3
            continue
        if current is None or skip_heading_level is not None:
            i += 1
            continue
        if tok.type == "blockquote_open":
            # Lehrpersonenhinweise, Selbstkontrollen und Erwartungen bleiben weg.
            depth = 1
            i += 1
            while depth:
                depth += {"blockquote_open": 1, "blockquote_close": -1}.get(tokens[i].type, 0)
                i += 1
            continue
        if tok.type == "paragraph_open" and tok.level == 0:
            inline = tokens[i + 1]
            images = [c for c in inline.children or [] if c.type == "image"]
            if images and not text_of(inline_runs(inline, course)):
                for image in images:
                    src = image.attrGet("src") or ""
                    if not PROTECTED.search(src):
                        current.blocks.append(Block("image", src=src, alt=image.content))
            else:
                runs = inline_runs(inline, course)
                if text_of(runs):
                    first = not current.blocks
                    meta = first and all(r.bold for r in runs if r.text.strip()) and "Min" in text_of(runs)
                    current.blocks.append(Block("meta" if meta else "paragraph", runs))
            i += 3
            continue
        if tok.type in ("bullet_list_open", "ordered_list_open"):
            ordered = tok.type == "ordered_list_open"
            close = tok.type.replace("_open", "_close")
            depth, items = 1, []
            i += 1
            while depth:
                t = tokens[i]
                if t.type == tok.type:
                    depth += 1
                elif t.type == close:
                    depth -= 1
                elif t.type == "inline":
                    items.append(inline_runs(t, course))
                i += 1
            current.blocks.append(Block("list", items=items, ordered=ordered))
            continue
        if tok.type == "table_open":
            rows: list[list[list[Run]]] = []
            row: list[list[Run]] = []
            i += 1
            while tokens[i].type != "table_close":
                t = tokens[i]
                if t.type == "tr_open":
                    row = []
                elif t.type == "tr_close":
                    rows.append(row)
                elif t.type == "inline":
                    row.append(inline_runs(t, course))
                i += 1
            current.blocks.append(Block("table", rows=rows))
            i += 1
            continue
        i += 1
    return phases


# --------------------------------------------------------------------------- Grafiken

def image_files(phases: list[Phase], base: Path, work: Path) -> dict[str, Path]:
    downloads = download_sources()
    resolved: dict[str, Path] = {}
    svgs: list[tuple[Path, Path]] = []
    for phase in phases:
        for block in phase.blocks:
            if block.kind != "image" or block.src in resolved:
                continue
            src = block.src.removeprefix("./")
            if src.startswith("grafiken/"):
                path = base / "assets" / src
            elif src.startswith("materialien/downloads/"):
                path = base / downloads[src.split("/")[-1]]
            else:
                raise SystemExit(f"Unbekannte Grafikquelle: {src}")
            if not path.is_file():
                raise SystemExit(f"Grafik fehlt: {path}")
            if path.suffix.lower() == ".svg":
                png = work / (path.stem + ".png")
                svgs.append((path, png))
                path = png
            resolved[block.src] = path
    if svgs:
        render_svgs(svgs)
    return resolved


def render_svgs(pairs: list[tuple[Path, Path]]) -> None:
    """SVG mit dem vorinstallierten Chromium (Playwright) als PNG rastern."""
    script = r"""
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const pairs=JSON.parse(process.argv[1]);
const browser=await chromium.launch();const page=await browser.newPage({deviceScaleFactor:2});
for(const [src,out] of pairs){
  const svg=fs.readFileSync(src,'utf8');
  await page.setContent('<html><body style="margin:0;background:#fff">'+svg+'</body></html>');
  const el=await page.$('svg');
  const box=await el.evaluate(e=>{const r=e.getBoundingClientRect();
    if(r.width<2||r.height<2){const v=e.viewBox.baseVal;e.setAttribute('width',v.width);e.setAttribute('height',v.height);}
    return true;});
  await el.screenshot({path:out,omitBackground:false});
}
await browser.close();})().catch(e=>{console.error(e);process.exit(1);});
"""
    subprocess.run(["node", "-e", script, json.dumps([[str(a), str(b)] for a, b in pairs])],
                   check=True, cwd=ROOT)


# --------------------------------------------------------------------------- Word

def hex_color(value: str) -> RGBColor:
    return RGBColor.from_string(value.lstrip("#").upper())


def add_hyperlink(paragraph, url: str, run: Run, accent: str) -> None:
    part = paragraph.part
    rid = part.relate_to(url, RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), rid)
    r = OxmlElement("w:r")
    props = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), accent.lstrip("#"))
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    props.append(color)
    props.append(underline)
    if run.bold:
        props.append(OxmlElement("w:b"))
    if run.italic:
        props.append(OxmlElement("w:i"))
    r.append(props)
    text = OxmlElement("w:t")
    text.text = run.text
    text.set(qn("xml:space"), "preserve")
    r.append(text)
    link.append(r)
    paragraph._p.append(link)


def write_runs(paragraph, runs: list[Run], accent: str, *, blanks: bool = True) -> None:
    for run in runs:
        text = run.text if blanks else BLANK_RE.sub("", run.text)
        if not text:
            continue
        if run.href:
            add_hyperlink(paragraph, run.href, Run(text, run.bold, run.italic), accent)
            continue
        r = paragraph.add_run(text)
        r.bold = run.bold or None
        r.italic = run.italic or None
        if run.code:
            r.font.name = "Consolas"


def shade(cell, fill: str) -> None:
    props = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill.lstrip("#"))
    props.append(shd)


def repeat_header(row) -> None:
    props = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    props.append(header)


def light(accent: str, amount: float) -> str:
    rgb = [int(accent.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)]
    return "".join(f"{round(c + (255 - c) * amount):02X}" for c in rgb)


def field_run(paragraph, instruction: str) -> None:
    for kind, text in (("begin", None), (None, instruction), ("separate", None), (None, "1"), ("end", None)):
        run = paragraph.add_run()
        if kind:
            char = OxmlElement("w:fldChar")
            char.set(qn("w:fldCharType"), kind)
            run._r.append(char)
        elif text == instruction:
            instr = OxmlElement("w:instrText")
            instr.set(qn("xml:space"), "preserve")
            instr.text = instruction
            run._r.append(instr)
        else:
            run.add_text(text)


def build_document(phase: Phase, label: str, accent: str, images: dict[str, Path]) -> bytes:
    doc = Document()
    section = doc.sections[0]
    section.orientation = WD_ORIENT.PORTRAIT
    section.page_width, section.page_height = Cm(21), Cm(29.7)
    section.left_margin = section.right_margin = Cm(2)
    section.top_margin, section.bottom_margin = Cm(1.8), Cm(1.8)
    width = section.page_width - section.left_margin - section.right_margin

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.15
    for name, size in (("Title", 20), ("Heading 1", 15), ("Heading 2", 13)):
        style = doc.styles[name]
        style.font.name = "Calibri"
        style.font.size = Pt(size)
        style.font.color.rgb = hex_color(accent)
        style.font.bold = True
    doc.styles["Title"].paragraph_format.space_after = Pt(2)

    core = doc.core_properties
    core.title = f"DL {phase.dl:02d} · {phase.name} · {phase.title}"
    core.subject = f"{label} · Doppellektion {phase.dl}: {phase.lesson}"
    core.author = "Fachschaft Informatik · Kantonsschule Stadelhofen"
    core.last_modified_by = core.author
    core.keywords = "KI-Unterricht; AVIVA; Arbeitsblatt"
    core.comments = "Automatisch erzeugt aus dem Materialkoffer (scripts/build_student_documents.py)."
    from datetime import datetime
    core.created = core.modified = datetime(*FIXED_DATE)
    core.revision = 1

    for name in ("Header", "Footer"):
        doc.styles[name].paragraph_format.tab_stops.clear_all()
    header = section.header.paragraphs[0]
    header.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
    run = header.add_run(f"{label} · Künstliche Intelligenz\tDoppellektion {phase.dl:02d} · Phase {phase.index}/5")
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x55, 0x65, 0x6A)
    footer = section.footer.paragraphs[0]
    footer.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
    run = footer.add_run("Kantonsschule Stadelhofen · Material für Schülerinnen und Schüler\tSeite ")
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x55, 0x65, 0x6A)
    field_run(footer, "PAGE")
    for r in footer.runs[1:]:
        r.font.size = Pt(9)

    kicker = doc.add_paragraph()
    run = kicker.add_run(f"Doppellektion {phase.dl:02d} · {phase.lesson}".upper())
    run.font.size = Pt(9)
    run.bold = True
    run.font.color.rgb = hex_color(accent)
    kicker.paragraph_format.space_after = Pt(0)
    doc.add_paragraph(f"{phase.name}: {phase.title}", style="Title")

    meta = next((b for b in phase.blocks if b.kind == "meta"), None)
    info = doc.add_paragraph()
    run = info.add_run(f"Phase {phase.index} von 5 · {phase.minutes} Minuten")
    run.bold = True
    if meta:
        social = text_of(meta.runs).rstrip(".")
        run = info.add_run(f" · Sozialform: {social}")
    for r in info.runs:
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0x37, 0x47, 0x4F)

    names = doc.add_table(rows=1, cols=3)
    names.alignment = WD_TABLE_ALIGNMENT.CENTER
    for cell, text in zip(names.rows[0].cells, ("Name:", "Klasse:", "Datum:")):
        p = cell.paragraphs[0]
        p.add_run(text).font.size = Pt(10)
        shade(cell, light(accent, 0.9))
    names.rows[0].height = Cm(0.9)
    names.rows[0].height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

    blocks = [b for b in phase.blocks if b.kind != "meta"]
    i = 0
    while i < len(blocks):
        block = blocks[i]
        if block.kind == "image":
            group = [block]
            while i + 1 < len(blocks) and blocks[i + 1].kind == "image":
                i += 1
                group.append(blocks[i])
            add_images(doc, group, [images[b.src] for b in group], width)
            i += 1
            continue
        i += 1
        if block.kind == "heading":
            write_runs(doc.add_paragraph(style="Heading 2"), block.runs, accent)
        elif block.kind == "paragraph":
            write_runs(doc.add_paragraph(), block.runs, accent)
        elif block.kind == "list":
            style = "List Number" if block.ordered else "List Bullet"
            for item in block.items:
                write_runs(doc.add_paragraph(style=style), item, accent)
            if block.ordered:
                restart_numbering(doc, block)
        elif block.kind == "table":
            add_table(doc, block, accent, width)
    buffer = io.BytesIO()
    doc.save(buffer)
    return normalize_zip(buffer.getvalue())


def picture_width(path: Path, max_width, max_height):
    picture = DocxImage.from_file(str(path))
    w, h = picture.px_width, picture.px_height
    return int(min(max_width, max_height * w / h))


def caption(paragraph, text: str) -> None:
    run = paragraph.add_run(text)
    run.italic = True
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x55, 0x65, 0x6A)


def add_images(doc, blocks: list[Block], paths: list[Path], width) -> None:
    """Fotos nebeneinander und kompakt, Gitter und Diagramme gross genug zum Arbeiten."""
    photo = all(p.suffix.lower() in (".jpg", ".jpeg", ".png") and "grafiken" in p.parts for p in paths)
    if len(blocks) > 1:
        table = doc.add_table(rows=2, cols=len(blocks))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        column = int(width / len(blocks)) - Cm(0.4)
        for col, (block, path) in enumerate(zip(blocks, paths)):
            top = table.cell(0, col).paragraphs[0]
            top.alignment = WD_ALIGN_PARAGRAPH.CENTER
            top.add_run().add_picture(str(path), width=picture_width(path, column, Cm(7 if photo else 10)))
            bottom = table.cell(1, col).paragraphs[0]
            bottom.alignment = WD_ALIGN_PARAGRAPH.CENTER
            caption(bottom, block.alt)
        doc.add_paragraph().paragraph_format.space_after = Pt(0)
        return
    block, path = blocks[0], paths[0]
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    limit = (Cm(10), Cm(7)) if photo else (Cm(15), Cm(17))
    p.add_run().add_picture(str(path), width=picture_width(path, min(width, limit[0]), limit[1]))
    if block.alt:
        cap = doc.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        caption(cap, block.alt)




def restart_numbering(doc, block: Block) -> None:
    """Jede nummerierte Liste beginnt wieder bei 1."""
    paragraphs = doc.paragraphs[-len(block.items):]
    numbering = doc.part.numbering_part.numbering_definitions._numbering
    style_num = doc.styles["List Number"].element.pPr.numPr.numId.val
    abstract = numbering.num_having_numId(style_num).abstractNumId.val
    num = numbering.add_num(abstract)
    override = num.add_lvlOverride(ilvl=0)
    override.add_startOverride(1)
    for paragraph in paragraphs:
        props = paragraph._p.get_or_add_pPr()
        numpr = props.get_or_add_numPr()
        numpr.get_or_add_ilvl().val = 0
        numpr.get_or_add_numId().val = num.numId


def add_table(doc, block: Block, accent: str, width) -> None:
    cols = max(len(row) for row in block.rows)
    table = doc.add_table(rows=0, cols=cols)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for index, cells in enumerate(block.rows):
        row = table.add_row()
        writing = any(BLANK_RE.search(text_of(c)) for c in cells)
        for cell, runs in zip(row.cells, cells + [[]] * (cols - len(cells))):
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            if index == 0:
                write_runs(p, [Run(r.text, True, r.italic, r.code, r.href) for r in runs], accent)
                shade(cell, light(accent, 0.82))
            else:
                write_runs(p, runs, accent, blanks=False)
            for r in p.runs:
                r.font.size = Pt(10)
        if index == 0:
            repeat_header(row)
        if writing:
            row.height = Cm(1.3)
            row.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def normalize_zip(data: bytes) -> bytes:
    """Feste Zeitstempel, damit ein Neuaufbau ohne Inhaltsänderung keinen Git-Diff erzeugt."""
    source = zipfile.ZipFile(io.BytesIO(data))
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as target:
        for info in source.infolist():
            item = zipfile.ZipInfo(info.filename, FIXED_DATE)
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o644 << 16
            target.writestr(item, source.read(info.filename))
    return out.getvalue()


def slug(text: str) -> str:
    text = text.translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "Ä": "Ae", "Ö": "Oe", "Ü": "Ue", "ß": "ss"}))
    return re.sub(r"[^A-Za-z0-9]+", "_", text).strip("_")


# --------------------------------------------------------------------------- Ablauf

def build(course: str) -> Path:
    base = ROOT / "kurse" / course
    registry = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))
    profile = next(c for c in registry["courses"] if c["slug"] == course)
    label = f"{profile['teacher']} · {profile['grade']}. Klasse"
    accent = profile["theme"]["accent"]
    lessons = lessons_of(base)
    source = apply_edits(material_sources(base, lessons), course)
    phases = parse(source, course, lessons)
    expected = {(lesson["number"], i) for lesson in lessons for i in range(1, 6)}
    found = {(p.dl, p.index) for p in phases}
    if found != expected:
        raise SystemExit(f"Phasen fehlen oder sind doppelt: {sorted(expected ^ found)}")

    target = base / "lehrperson/dokumente"
    target.mkdir(parents=True, exist_ok=True)
    for old in target.glob("*.docx"):
        old.unlink()
    for old in target.glob("*.zip"):
        old.unlink()
    zip_name = f"{profile['teacher']}_{profile['grade']}-Klasse_Alle_Dokumente.zip"
    entries = []
    with tempfile.TemporaryDirectory() as tmp:
        images = image_files(phases, base, Path(tmp))
        archive = io.BytesIO()
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
            for phase in sorted(phases, key=lambda p: (p.dl, p.index)):
                data = build_document(phase, label, accent, images)
                (target / phase.file).write_bytes(data)
                folder = f"DL{phase.dl:02d}_{slug(phase.lesson)}"
                item = zipfile.ZipInfo(f"{folder}/{phase.file}", FIXED_DATE)
                item.compress_type = zipfile.ZIP_DEFLATED
                item.external_attr = 0o644 << 16
                bundle.writestr(item, data)
                entries.append({"dl": phase.dl, "lesson": phase.lesson, "phase": phase.index,
                                "phaseName": phase.name, "minutes": phase.minutes,
                                "title": phase.title, "file": phase.file, "bytes": len(data)})
        (target / zip_name).write_bytes(archive.getvalue())
    index = {"version": 1, "course": course,
             "generator": "scripts/build_student_documents.py",
             "zip": {"file": zip_name, "bytes": (target / zip_name).stat().st_size},
             "documents": entries}
    (target / "dokumente.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(entries)} Dokumente und {zip_name} in {target.relative_to(ROOT)}")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--course", default="irn/4-klasse")
    build(parser.parse_args().course)


if __name__ == "__main__":
    main()
