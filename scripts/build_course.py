"""Render numbered AVIVA plans into both the website and teacher planning notes."""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PHASES = ['Ankommen', 'Vorwissen aktivieren', 'Informieren', 'Verarbeiten', 'Auswerten']

def wer_klasse(wer):
    if wer == 'Lehrperson': return 'wer-l'
    if wer == 'Ergebnis': return 'wer-r'
    if wer.startswith('Klasse'): return 'wer-k'
    return 'wer-e' if wer.startswith('Einzeln') else 'wer-t'


LEGENDE = ('<p class="wer-legende"><span class="wer-l">Lehrperson: Input</span><span class="wer-e">Einzelarbeit</span>'
           '<span class="wer-t">Tandem oder Gruppe</span><span class="wer-k">Klasse gemeinsam</span><span class="wer-r">Ergebnis</span></p>')


def tabelle(lesson):
    kopf = '<thead><tr><th>Phase</th><th>Wer</th><th>Was</th><th>Min.</th></tr></thead>'
    zeilen = []
    for phase in lesson['phases']:
        for i, step in enumerate(phase['schritte']):
            zelle = ''
            if i == 0:
                zelle = f'<th class="phase" rowspan="{len(phase["schritte"])}" scope="rowgroup"><strong>{html.escape(phase["phase"])}</strong><span class="phase-titel">{html.escape(phase["titel"])}</span><small>{phase["minutes"]} Min.</small></th>'
            minuten = f'{step["min"]}' if step.get('min') else ''
            zeilen.append(f'<tr class="{wer_klasse(step["wer"])}">{zelle}<td class="wer">{html.escape(step["wer"])}</td>'
                          f'<td class="was">{html.escape(step["text"])}</td><td class="min">{minuten}</td></tr>')
    return f'<div class="phase-table-wrap"><table class="phase-table">{kopf}<tbody>{"".join(zeilen)}</tbody></table></div>'


def verlinke(text):
    """Jede genannte «Doppellektion N» wird zum Link auf den Plan dieser Doppellektion."""
    return re.sub(r'Doppellektion (\d+)', lambda m: f'<a href="#doppellektion-{int(m.group(1)):02d}">{m.group(0)}</a>', text)


def figur(f):
    return (f'<figure class="concept-figure"><img alt="{html.escape(f["alt"])}" loading="lazy" src="{html.escape(f["src"])}"/>'
            f'<figcaption>{html.escape(f["caption"])}</figcaption></figure>')


def render(lesson, voll=False):
    """Kursseite: nur Ziel, Leitfrage und Motivation. Mit voll=True zusätzlich Ablauftabelle (Lehrperson)."""
    return (f'<details class="lesson-plan" id="doppellektion-{lesson["id"]}" data-lesson="{lesson["id"]}" open><summary>'
            f'<span class="phase-num">{lesson["id"]}</span><span>Doppellektion {int(lesson["id"])} · {html.escape(lesson["title"])}</span>'
            '<small>90 Min.</small></summary><div class="detail-body">'
            + (f'<p class="lesson-recap"><strong>Rückblick:</strong> {verlinke(html.escape(lesson["rueckblick"]))}</p>' if lesson.get('rueckblick') else '')
            + (figur(lesson['rueckblick_figur']) if lesson.get('rueckblick_figur') else '')
            + f'<p><strong>Heute können Sie:</strong> {html.escape(lesson["goal"])}</p>'
            f'<p class="lesson-question">{html.escape(lesson["question"])}</p>'
            + (f'<p class="lesson-motivation"><strong>Warum das wichtig ist:</strong> {html.escape(lesson["motivation"])}</p>' if lesson.get('motivation') else '')
            + ((LEGENDE + tabelle(lesson)
            + f'<p class="lesson-product"><strong>Am Ende sichtbar:</strong> {html.escape(lesson["product"])}</p>'
            + (f'<p class="small muted"><strong>Zeit:</strong> {html.escape(lesson["zeit"])}</p>' if lesson.get('zeit') else '')) if voll else '')
            + '</div></details>')

def lehrpersonen_seite(lessons, kursseite):
    """Eigenständige Seite mit allen Ablauftabellen; nicht in der Navigation der Kursseite verlinkt."""
    stil = re.search(r'<style>.*?</style>', kursseite, re.S).group(0)
    plaene = '\n'.join(render(l, voll=True) for l in lessons)
    return ('<!doctype html><html lang="de-CH"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<meta name="robots" content="noindex"><title>Unterrichtsplan · Lehrperson</title>'
            '<link href="favicon.svg" rel="icon" type="image/svg+xml">'+stil+'<link href="portal.css" rel="stylesheet">'
            '<body class="lehrpersonen-seite"><main><div class="crumb"><span>Nur für die Lehrperson</span></div>'
            f'<h1>Unterrichtsplan</h1><p class="section-intro">Ablauf aller {len(lessons)} Doppellektionen nach AVIVA (Ankommen, Vorwissen aktivieren, Informieren, Verarbeiten, Auswerten). '
            'In Doppellektion 5–8 dient AVIVA nur als äusserer Rahmen der SOL-Arbeit, nicht als gemeinsamer Takt für die Projektetappen. '
            'Gleiche Fassung wie in <code>worksheets/md/KI_Planung.md</code>.</p>'
            '<p><a href="index.html">← Zur Kursseite</a></p>\n'+plaene+'\n<p><a href="index.html">← Zur Kursseite</a></p></main></body></html>\n')

def remove_calendar_dates(text):
    text, _ = re.subn(r'<details><summary>Unterrichtspausen &amp; Termine</summary>.*?</details>', '', text, count=1, flags=re.S)

    def course_card(match):
        number = match.group(1)
        label = '5.–8. Doppellektion' if number == '05–08' else f'{int(number)}. Doppellektion'
        return f'<span class="tag">{label}</span>'

    text = re.sub(r'<span class="tag">[^<]*</span><b>(01|02|03|04|05–08|09|10)</b>', course_card, text)

    full_date = re.compile(r'(?<!\d)(?:0[1-9]|[12]\d|3[01])\.(?:0[1-9]|1[0-2])\.20\d{2}(?!\d)')
    dates = sorted(set(full_date.findall(text)), key=lambda value: tuple(map(int, reversed(value.split('.')))))
    full_labels = {value: f'{index}. Doppellektion' for index, value in enumerate(dates, 1)}
    short_labels = {'.'.join(value.split('.')[:2])+'.': index for index, value in enumerate(dates, 1)}

    def date_range(match):
        first, second = match.groups()
        if first in short_labels and second in short_labels:
            return f'Doppellektionen {short_labels[first]}–{short_labels[second]}'
        return match.group(0)

    text = re.sub(r'(?<!\d)(\d{1,2}\.\d{1,2}\.)[–-](\d{1,2}\.\d{1,2}\.)(?!\d)', date_range, text)
    text = full_date.sub(lambda match: full_labels[match.group(0)], text)
    short_date = re.compile(r'(?<!\d)(\d{1,2}\.\d{1,2}\.)(?!\d)')
    text = short_date.sub(lambda match: f'{short_labels[match.group(1)]}. Doppellektion' if match.group(1) in short_labels else match.group(0), text)
    text = re.sub(r'<span class="section-label">0?(\d{1,2}) · \d{1,2}\. Doppellektion · Doppelstunde</span>', lambda match: f'<span class="section-label">Doppellektion {int(match.group(1))}</span>', text)
    text = text.replace('Vor Unterrichtsbeginn am 8. Doppellektion', 'Vor Beginn der Doppellektion 8')
    text = text.replace('Alle Fachgespräche finden am 8. Doppellektion statt', 'Alle Einzelgespräche finden in Doppellektion 8 statt')
    text = re.sub(r' · Schuljahr \d{4}/\d{2}', '', text)
    text = text.replace('class="date"', 'class="lesson-reference"')
    return text

def update_language_lesson(text):
    mini_model = r'<div class="card"><h3>Unser Mini-Sprachmodell</h3>.*?</div><label class="field answer"><span>Wie verändern Beispieltexte die Ausgabe\? Was erklärt das Modell – und was fehlt gegenüber heutigen Sprachmodellen\?</span>'
    papagei_mount = '<div id="papagei-placeholder"></div><label class="field answer"><span>Welche Hinweise halfen beim Turing-Test? Was verrät ein plausibler Text über die Grenzen eines Sprachmodells?</span>'
    text, count = re.subn(mini_model, papagei_mount, text, count=1, flags=re.S)
    if not count:
        assert '<div id="papagei-placeholder"></div>' in text, 'Expected mini language model or Papagei mount'

    nim_block = r'<div class="card"><h2>Verstärkendes Lernen erkunden</h2>.*?</div><label class="field answer"><span>Wie lernt das System aus Rückmeldungen\? Nennen Sie eine Grenze\.</span><textarea data-answer="nim".*?</label>'
    text, count = re.subn(nim_block, '', text, count=1, flags=re.S)
    if not count:
        assert 'Verstärkendes Lernen erkunden' not in text, 'Expected NIM block to be removed or already absent'

    old_step = '<article><b>2 · Mit Beispielen</b><p>Trainieren Sie unten ein kleines Wortfolgemodell. Welche Fortsetzungen sind möglich, welche fehlen?</p></article>'
    new_step = '<article><b>2 · Mit der Lernstrecke</b><p>Bearbeiten Sie die Papagei-Lernstrecke unten. Vergleichen Sie eine wahrscheinliche Wortfolge mit der Frage, ob sie auch wahr ist.</p></article>'
    if old_step in text:
        text = text.replace(old_step, new_step, 1)
    else:
        assert new_step in text, 'Expected mini-model task or Papagei learning-path task'
    return text

def update_sol_material(text):
    """Keep project guidance aligned with the SOL frame without changing saved fields."""
    sol = (
        '<div class="callout" id="sol-rahmen"><h3>Ihr Projekt: Arbeit planen, durchführen und überprüfen</h3>'
        '<p>In Doppellektion 5–7 planen und steuern Sie Ihre Arbeit im Tandem selbst. '
        'Die Etappen sind keine festen Lektionstermine. In Doppellektion 8 folgen individuelle Einzelgespräche und die Fremdauswertung.</p>'
        '<p><strong>Verbindlich:</strong> fünf Datengruppen, fairer A/B-Vergleich, fünf Reflexionen, '
        'Auswahl vor Testeinsicht und danach keine Optimierung. Abgabe vor Beginn der Doppellektion 8.</p>'
        '<p><strong>Sie entscheiden:</strong> Thema im genehmigten Rahmen, Tagesziele, Zeitverteilung, Rollen und Hilfen. '
        'Planen Sie in Reflexion 1 die Etappen, Zuständigkeiten und Reserve. Halten Sie am Ende jeder Arbeitsphase '
        'kurz fest: erreicht, offen, nächster Schritt, benötigte Hilfe. Reflektieren Sie Ihren Plan in Reflexion 5. '
        'Kein zusätzliches Lerntagebuch. Beratung und Lernlabor nutzen Sie nach Bedarf.</p>'
        '<p><strong>Reihenfolge aus fachlichen Gründen:</strong> Daten prüfen → A/B vergleichen → Auswahl begründen '
        '→ Abschlusstest → Fazit und Abgabe. Wie Sie diese Etappen auf die Arbeitszeit verteilen, planen Sie selbst.</p></div>'
    )
    text = re.sub(r'<div class="callout" id="sol-rahmen">.*?</div>', '', text, flags=re.S)
    text = text.replace('<!-- /LESSONS:projekt -->', '<!-- /LESSONS:projekt -->'+sol, 1)
    schedule = (
        '<details><summary>Termine ansehen</summary><div class="detail-body"><div class="table-wrap"><table>'
        '<thead><tr><th scope="col">Termin</th><th scope="col">Rahmen</th><th scope="col">Verbindlicher Stand</th></tr></thead><tbody>'
        '<tr><td>4. Doppellektion</td><td>Thema freigeben; Datenplan und Fotos vorbereiten</td>'
        '<td>Zwei Klassen und fünf unabhängige Gruppen planen</td></tr>'
        '<tr><td>Doppellektionen 5–7</td><td>Sie legen Tagesziele fest, teilen die Arbeit auf und holen bei Bedarf Hilfe</td>'
        '<td>Datencheck → Vergleich → begründete Auswahl → Test → Fazit; Etappen frei auf die Zeit verteilen</td></tr>'
        '<tr><td>Vor Beginn der Doppellektion 8</td><td>ZIP über den Abgabekanal einreichen</td>'
        '<td>Vollständiges Journal, Versuch mit Ausgaben, Daten und Protokoll</td></tr>'
        '<tr><td>8. Doppellektion</td><td>Vierminütige Einzelgespräche; parallel selbstständige Fremdauswertung</td>'
        '<td>Ein Reproduktionslauf, Fremdtest und kurze Rückmeldung; unbenotet, eigene Abgabe unverändert</td></tr>'
        '</tbody></table></div><p class="small muted">20 Einzelgespräche bei einer Lehrperson: je 4 Minuten Gespräch plus 1 Minute Wechsel/Notizen ab Minute 0. '
        'Die letzten 10 Minuten schliessen unmittelbar an die 90-minütige Doppellektion an. '
        'Gesprächsreihenfolge vorab bekannt, die übrigen arbeiten selbstständig; keine Zeitreserve oder weiteren Termine.</p></div></details>'
    )
    text, count = re.subn(r'<details><summary>Termine ansehen</summary>.*?</details>', schedule, text, count=1, flags=re.S)
    assert count == 1, 'Expected project schedule'
    replacements = {
        'Reproduktionsprüfung (abgabepflichtig)': 'Reproduktionscheck (Teil der unbenoteten Fremdauswertung)',
        'unbenoteter Fremdtest →': 'Fremdtest und Rückmeldung →',
        'Reproduktionsprüfung · 45 Minuten · wird abgegeben': 'Reproduktionsprüfung · ca. 30 Minuten · unbenotet',
        'Fremdtest · 20 Minuten · unbenotet': 'Fremdtest &amp; Rückmeldung · ca. 25 Minuten · unbenotet',
        '<strong>Daten prüfen (10 Min.).</strong>': '<strong>Daten prüfen (5 Min.).</strong>',
        '<strong>Nachtrainieren (15 Min.).</strong>': '<strong>Nachtrainieren (10 Min.).</strong>',
        '<strong>Vergleichen und berichten (10 Min.).</strong>': '<strong>Vergleichen und berichten (5 Min.).</strong>',
        '<strong>Auswerten (10 Min.).</strong>': '<strong>Auswerten und rückmelden (15 Min.).</strong>',
        'Starten Sie danach in einer neuen Zelle': '<strong>Freiwillige Vertiefung, kein Pflichtteil:</strong> Starten Sie bei Zeitreserve vor dem Test in einer neuen Zelle',
        '<li>Ergebnis bei drei Startwerten: Trägt die Aussage des Originals noch?</li>':
            '<li>Nur bei freiwilliger Vertiefung: Ergebnis bei drei Startwerten. Sonst entfällt dieser Punkt.</li>',
        'Wie haben Sie die Arbeit aufgeteilt? Welche Quellen und KI-Hilfen haben Sie verwendet?':
            'Wie haben Sie die Arbeit gesteuert? Was gelang an Ihrem Etappenplan, was haben Sie angepasst? Welche Quellen und KI-Hilfen haben Sie verwendet?',
        '<span>Was erwarten Sie vom Vergleich A/B?</span>':
            '<span>Was erwarten Sie vom Vergleich A/B? Planen Sie darunter Ihre Etappen, Zuständigkeiten und Zeitreserve. Aktualisieren Sie kurz: erreicht, offen, nächster Schritt, Hilfe.</span>',
        'Gemeinsamer Probelauf ▶': 'Lernlabor bei Bedarf ▶',
        '<strong>Abgabe:</strong> Laden Sie im privaten Fenster':
            '<strong>Separate unbenotete Fremdauswertung:</strong> Schliessen Sie zuerst den Fremdtest samt Rückmeldung ab. Laden Sie danach im privaten Fenster',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = text.replace(
        'Lesen Sie Grafik und Tabelle und füllen Sie das Protokoll aus. Beantworten Sie dann die Fragen «Wie gut?» und «Warum?».',
        'Lesen Sie Grafik, Tabelle und konkrete Beispiele. Füllen Sie das Protokoll aus: «Wie gut?» und «Warum?». '
        'Formulieren Sie im Begründungsfeld auch eine konkrete Rückmeldung an das andere Tandem.'
    )
    return text

def build():
    lessons = json.loads((ROOT/'projekt/kurs.json').read_text())['lessons']
    if len(lessons) < 10 or [l["id"] for l in lessons[:10]] != [f"{i:02d}" for i in range(1, 11)]:
        raise ValueError("Core lessons 01–10 must be preserved")
    additional = lessons[10:]
    if [l["id"] for l in additional] != [f"{i:02d}" for i in range(11, 11+len(additional))]:
        raise ValueError("Additional lessons must be consecutively numbered")
    if any(l.get("view") != f'dl-{l["id"]}' for l in additional):
        raise ValueError("Each added lesson needs its own dl-NN view")
    for lesson in lessons:
        assert [p['phase'] for p in lesson['phases']] == PHASES
        assert sum(p['minutes'] for p in lesson['phases']) == 90
        assert all(p.get('titel') and '|' not in p['titel'] for p in lesson['phases'])
        for phase in lesson['phases']:
            assert sum(step.get('min', 0) for step in phase['schritte']) == phase['minutes']
    page = ROOT/'projekt/index.html'
    text = page.read_text()
    for view in dict.fromkeys(l['view'] for l in lessons):
        body = '\n'.join(render(l) for l in lessons if l['view'] == view)
        pattern = rf'<!--\s*LESSONS:{view}\s*-->.*?<!--\s*/LESSONS:{view}\s*-->'
        text, count = re.subn(pattern, f'<!-- LESSONS:{view} -->\n{body}\n<!-- /LESSONS:{view} -->', text, flags=re.S)
        assert count == 1, view
    # All published teaching copy already comes from kursseiten/*.md.
    # Only the AVIVA overviews and teacher plans are generated here.
    page.write_text(text.rstrip()+"\n")
    (ROOT/'projekt/unterrichtsplan.html').write_text(lehrpersonen_seite(lessons, text))
    rows = []
    for l in lessons:
        rows.extend([f'### Doppellektion {int(l["id"])} · {l["title"]}', ''] + ([f'**Rückblick:** {l["rueckblick"]}', ''] + ([f'*{l["rueckblick_figur"]["caption"]}*', ''] if l.get('rueckblick_figur') else []) if l.get('rueckblick') else []) + [f'**Lernziel:** {l["goal"]}', '', f'**Leitfrage:** {l["question"].removeprefix("Leitfrage:").strip()}', ''] + ([f'**Motivation:** {l["motivation"]}', ''] if l.get('motivation') else []) + ['**Ablauf (AVIVA):** In der Spalte «Wer» steht, ob die Lehrperson Input gibt oder ob einzeln, im Tandem, in der Gruppe oder in der Klasse gearbeitet wird.', ''])
        rows += ['| Phase | Min. | Wer | Was |', '|---|---:|---|---|']
        for p in l['phases']:
            for i, st in enumerate(p['schritte']):
                rows.append(f'| {p["phase"]+" – "+p["titel"] if i == 0 else ""} | {p["minutes"] if i == 0 else ""} | {st["wer"]} | {st["text"]} |')
        rows.append('')
        rows += ['', f'**Lernprodukt:** {l["product"]}', '']
        if l.get('zeit'): rows += [f'**Zeit:** {l["zeit"]}', '']
    plan = ROOT/'worksheets/md/KI_Planung.md'
    text = plan.read_text()
    text, count = re.subn(r'<!-- KURSPLAN -->.*?<!-- /KURSPLAN -->', '<!-- KURSPLAN -->\n'+'\n'.join(rows)+'\n<!-- /KURSPLAN -->', text, flags=re.S)
    assert count == 1
    plan.write_text(text)
    from build_materials import build as build_materials
    build_materials(lessons)
    print(f'Generated {len(lessons)} consistent AVIVA plans, each 90 minutes')

if __name__ == '__main__':
    build()
