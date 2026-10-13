"""Render one dated AVIVA plan into both the website and teacher planning notes."""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PHASES = ['Ankommen', 'Vorwissen aktivieren', 'Informieren', 'Verarbeiten', 'Auswerten']

def render(lesson):
    rows = []
    for phase in lesson['phases']:
        rows.append(f'<li><span class="phase-time">{phase["minutes"]} Min.</span><div><strong>{html.escape(phase["phase"])}</strong><p>{html.escape(phase["task"])}</p></div></li>')
    return (f'<details class="lesson-plan" data-lesson="{lesson["id"]}"><summary>'
            f'<span class="phase-num">{lesson["id"]}</span><span>{lesson["date"]} · {html.escape(lesson["title"])}</span>'
            '<small>90 Min.</small></summary><div class="detail-body">'
            f'<p><strong>Heute können Sie:</strong> {html.escape(lesson["goal"])}</p>'
            f'<p class="lesson-question">{html.escape(lesson["question"])}</p>'
            '<p class="small muted">Unser Ablauf · AVIVA</p><ol class="lesson-phases">'+''.join(rows)+'</ol>'
            f'<p class="lesson-product"><strong>Am Ende sichtbar:</strong> {html.escape(lesson["product"])}</p></div></details>')

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
    page.write_text(text.rstrip()+"\n")
    rows = []
    for l in lessons:
        rows.extend([f'### {l["id"]} · {l["date"]} · {l["title"]}', '', f'**Lernziel:** {l["goal"]}', '', f'**Leitfrage:** {l["question"]}', '', '| AVIVA-Phase | Min. | Tätigkeit / Auftrag |', '|---|---:|---|'])
        rows += [f'| {p["phase"]} | {p["minutes"]} | {p["task"]} |' for p in l['phases']]
        rows += ['', f'**Lernprodukt:** {l["product"]}', '']
    plan = ROOT/'worksheets/md/KI_Planung.md'
    text = plan.read_text()
    text, count = re.subn(r'<!-- KURSPLAN -->.*?<!-- /KURSPLAN -->', '<!-- KURSPLAN -->\n'+'\n'.join(rows)+'\n<!-- /KURSPLAN -->', text, flags=re.S)
    assert count == 1
    plan.write_text(text)
    print('Generated 10 consistent AVIVA plans, each 90 minutes')

if __name__ == '__main__':
    build()
