"""Build the two glossary views from one reviewed set of definitions."""
from __future__ import annotations
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def render_glossary(course: str) -> str:
    if course not in {"basis", "vertieft"}:
        raise ValueError("Unbekanntes Glossarniveau")
    data = json.loads((ROOT / "kursseiten/glossar.json").read_text(encoding="utf-8"))
    terms = data["begriffe"]
    ids = [term["id"] for term in terms]
    if len(ids) != len(set(ids)):
        raise ValueError("Doppelte Glossar-IDs")
    prefix = "basis-glossar" if course == "basis" else "glossar"
    parts = ['<div class="glossary" data-glossary>',
             '<label class="glossary-search-label" for="glossary-search">Begriff suchen</label>',
             '<input id="glossary-search" data-glossary-search type="search" placeholder="z. B. Validierung, Bias, Token" autocomplete="off">',
             '<p class="small muted" data-glossary-count role="status" aria-live="polite">Alle Begriffe nach Themen geordnet.</p>']
    for group in data["gruppen"]:
        subset = sorted((t for t in terms if t["gruppe"] == group), key=lambda t: t["begriff"].casefold())
        if not subset:
            continue
        parts.append(f'<div class="glossary-group"><h2>{html.escape(group)}</h2><div class="glossary-grid">')
        for term in subset:
            def esc(key):
                return html.escape(term[key], quote=True)
            parts.append(f'<article class="glossary-entry" id="{prefix}-{esc("id")}" data-glossary-id="{esc("id")}">'
                         f'<h3>{esc("begriff")}</h3><p>{esc("basis" if course == "basis" else "vertieft")}</p>'
                         f'<p class="glossary-example"><strong>Beispiel:</strong> {esc("beispiel")}</p>'
                         f'<div class="glossary-selfcheck">'
                         f'<p class="glossary-question"><strong>Leitfrage</strong>{esc("frage")}</p>'
                         f'<details class="glossary-answer"><summary>'
                         f'<span class="glossary-answer-show">Antwort anzeigen</span>'
                         f'<span class="glossary-answer-hide">Antwort verbergen</span></summary>'
                         f'<div class="glossary-answer-body"><p>{esc("antwort")}</p></div>'
                         f'</details></div></article>')
        parts.append('</div></div>')
    parts.append('<p class="glossary-empty" data-glossary-empty hidden>Kein Begriff gefunden. Probiere ein anderes Suchwort.</p></div>')
    return "\n".join(parts)
