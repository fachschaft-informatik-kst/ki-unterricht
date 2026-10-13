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
                zelle = f'<th class="phase" rowspan="{len(phase["schritte"])}" scope="rowgroup">{html.escape(phase["phase"])}<small>{phase["minutes"]} Min.</small></th>'
            minuten = f'{step["min"]}' if step.get('min') else ''
            zeilen.append(f'<tr class="{wer_klasse(step["wer"])}">{zelle}<td class="wer">{html.escape(step["wer"])}</td>'
                          f'<td class="was">{html.escape(step["text"])}</td><td class="min">{minuten}</td></tr>')
    return f'<div class="phase-table-wrap"><table class="phase-table">{kopf}<tbody>{"".join(zeilen)}</tbody></table></div>'


def render(lesson):
    return (f'<details class="lesson-plan" data-lesson="{lesson["id"]}"><summary>'
            f'<span class="phase-num">{lesson["id"]}</span><span>Doppellektion {int(lesson["id"])} · {html.escape(lesson["title"])}</span>'
            '<small>90 Min.</small></summary><div class="detail-body">'
            f'<p><strong>Heute können Sie:</strong> {html.escape(lesson["goal"])}</p>'
            f'<p class="lesson-question">{html.escape(lesson["question"])}</p>'
            + (f'<p class="lesson-motivation"><strong>Warum das wichtig ist:</strong> {html.escape(lesson["motivation"])}</p>' if lesson.get('motivation') else '')
            +
            '<p class="small muted">Unser Ablauf · AVIVA</p>'+LEGENDE+tabelle(lesson)
            + f'<p class="lesson-product"><strong>Am Ende sichtbar:</strong> {html.escape(lesson["product"])}</p>'
            + (f'<p class="small muted"><strong>Zeit:</strong> {html.escape(lesson["zeit"])}</p>' if lesson.get('zeit') else '')
            + '</div></details>')

def remove_calendar_dates(text):
    text, _ = re.subn(r'<details><summary>Unterrichtspausen &amp; Termine</summary>.*?</details>', '', text, count=1, flags=re.S)

    def course_card(match):
        number = match.group(1)
        label = 'Doppellektionen 5–8' if number == '05–08' else f'{int(number)}. Doppellektion'
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
    text = text.replace('Alle Fachgespräche finden am 8. Doppellektion statt', 'Alle Fachgespräche finden in Doppellektion 8 statt')
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

def build():
    lessons = json.loads((ROOT/'projekt/kurs.json').read_text())['lessons']
    assert len(lessons) == 10
    for lesson in lessons:
        assert [p['phase'] for p in lesson['phases']] == PHASES
        assert sum(p['minutes'] for p in lesson['phases']) == 90
    page = ROOT/'projekt/index.html'
    text = page.read_text()
    for view in dict.fromkeys(l['view'] for l in lessons):
        body = '\n'.join(render(l) for l in lessons if l['view'] == view)
        pattern = rf'<!--\s*LESSONS:{view}\s*-->.*?<!--\s*/LESSONS:{view}\s*-->'
        text, count = re.subn(pattern, f'<!-- LESSONS:{view} -->\n{body}\n<!-- /LESSONS:{view} -->', text, flags=re.S)
        assert count == 1, view
    text = update_language_lesson(text)
    text = remove_calendar_dates(text)
    page.write_text(text.rstrip()+"\n")
    rows = []
    for l in lessons:
        rows.extend([f'### Doppellektion {int(l["id"])} · {l["title"]}', '', f'**Lernziel:** {l["goal"]}', '', f'**Leitfrage:** {l["question"]}', ''] + ([f'**Motivation:** {l["motivation"]}', ''] if l.get('motivation') else []) + ['**Ablauf (AVIVA):** In der Spalte «Wer» steht, ob die Lehrperson Input gibt oder ob einzeln, im Tandem, in der Gruppe oder in der Klasse gearbeitet wird.', ''])
        rows += ['| Phase | Min. | Wer | Was |', '|---|---:|---|---|']
        for p in l['phases']:
            for i, st in enumerate(p['schritte']):
                rows.append(f'| {p["phase"] if i == 0 else ""} | {p["minutes"] if i == 0 else ""} | {st["wer"]} | {st["text"]} |')
        rows.append('')
        rows += ['', f'**Lernprodukt:** {l["product"]}', '']
        if l.get('zeit'): rows += [f'**Zeit:** {l["zeit"]}', '']
    plan = ROOT/'worksheets/md/KI_Planung.md'
    text = plan.read_text()
    text, count = re.subn(r'<!-- KURSPLAN -->.*?<!-- /KURSPLAN -->', '<!-- KURSPLAN -->\n'+'\n'.join(rows)+'\n<!-- /KURSPLAN -->', text, flags=re.S)
    assert count == 1
    plan.write_text(text)
    print('Generated 10 consistent AVIVA plans, each 90 minutes')

if __name__ == '__main__':
    build()
