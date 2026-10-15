"""Curriculum invariants: one current route, matching plans, portable teaching notebooks."""
from pathlib import Path
import base64
import json
import re
import sys
import xml.etree.ElementTree as ET
import nbformat
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'scripts'))
from build_portal_notebooks import ITEMS
from build_course import PHASES, update_sol_material

lessons=json.loads((root/'projekt/kurs.json').read_text())['lessons']
assert [l['id'] for l in lessons]==[f'{i:02d}' for i in range(1,11)]
soup=BeautifulSoup((root/'projekt/index.html').read_text(),'html.parser')
rules=soup.select_one('#einstieg-1')
assert rules.select_one('textarea[data-answer="regeln_oder_daten"][aria-label]')
task=rules.select_one('.task').get_text()
assert 'Getränkeautomat' in task and 'Übersetzungsapp' in task
assert 'Taschenrechner' not in task and 'Spamfilter' not in task
intro=soup.select_one('#einstieg > .section-intro')
conclusion=soup.select_one('#einstieg-9')
assert conclusion.select_one('.kapitel-nr').get_text()=='9'
assert 'Welche Frage bleibt offen?' in conclusion.get_text()
for answer in ['begriffe_saetze','begriffe']:
    fields=soup.select(f'textarea[data-answer="{answer}"]')
    assert len(fields)==1 and fields[0] in conclusion.select('textarea')
assert 'in je einem eigenen Satz' in conclusion.select_one('.task').get_text()
assert not re.search(r'\bSOL\b',soup.get_text()), 'Use concrete student-facing language instead of SOL'
page=(root/'projekt/index.html').read_text()
assert update_sol_material(page)==page, 'Repeated builds must not duplicate or change SOL guidance'
# Ablauftabellen stehen nur auf der Lehrpersonen-Seite, nicht auf der Kursseite.
plans=BeautifulSoup((root/'projekt/unterrichtsplan.html').read_text(),'html.parser')
assert not soup.select('.phase-table') and 'Unser Ablauf' not in soup.get_text() and 'Am Ende sichtbar' not in soup.get_text()
assert soup.select_one('a[href="unterrichtsplan.html"]')
ids=[x['id'] for x in soup.select('[id]')]
assert len(ids)==len(set(ids)), 'Duplicate HTML IDs'
for lesson in lessons:
    assert sum(p['minutes'] for p in lesson['phases'])==90
    assert [p['phase'] for p in lesson['phases']]==PHASES
    intro=soup.select_one('[data-lesson="'+lesson['id']+'"]')
    plan=plans.select_one('[data-lesson="'+lesson['id']+'"]')
    lesson_label=f'Doppellektion {int(lesson["id"])}'
    assert intro and lesson_label in intro.get_text() and lesson['goal'] in intro.get_text() and lesson['question'] in intro.get_text()
    assert plan and lesson_label in plan.get_text() and lesson['product'] in plan.get_text()
    for phase in lesson['phases']:
        assert phase['schritte'] and phase['schritte'][-1]['art']=='Ergebnis'
        assert sum(step.get('min',0) for step in phase['schritte'])==phase['minutes']
        for step in phase['schritte']:
            assert step['text'] in plan.get_text(), step['text'][:40]
            assert step['text'] in (root/'worksheets/md/KI_Planung.md').read_text(), step['text'][:40]
for a in soup.select('a[href^="#"]'):
    assert a['href'][1:] in ids, a['href']
for img in soup.select('img'):
    assert img.get('alt'), img
    src=img['src']
    assert (root/'projekt'/src).is_file() or src in ['previews/perzeptron.png','previews/xor.png','previews/datenplan.png'], src
assert {p.name for p in (root/'content/portal').glob('*.ipynb')}=={Path(p).name for p in ITEMS}
originals={str(p.relative_to(root/'content')) for p in (root/'content').rglob('*.ipynb') if 'portal' not in p.parts and '.ipynb_checkpoints' not in p.parts}
assert originals==set(ITEMS), originals
for name in ITEMS:
    src=nbformat.read(root/'content'/name,4)
    embedded=nbformat.read(root/'content/portal'/Path(name).name,4)
    for nb in [src,embedded]:
        nbformat.validate(nb)
        assert sum(len(c.source) for c in nb.cells if c.cell_type=='markdown')>1200, name
        for i,c in enumerate(nb.cells):
            if c.cell_type=='code':
                assert i>0 and any(x.cell_type=='markdown' for x in nb.cells[:i]), name
            if c.cell_type=='markdown':
                for file,data in c.get('attachments',{}).items():
                    assert 'attachment:'+file in c.source
                    assert base64.b64decode(data['image/png']).startswith(b'\x89PNG\r\n\x1a\n')
        if name.endswith('ki_tandemprojekt.ipynb'):
            starts=[c for c in nb.cells if 'ki-autostart' in c.metadata.get('tags',[])]
            assert len(starts)==1
            assert not re.search(r'projekt_test|vergleichen|daten_upload|fotostudio\(',starts[0].source)
            assert any('TEST_FREIGEBEN = False' in c.source for c in nb.cells)
    original_md=[c for c in src.cells if c.cell_type=='markdown' and 'ki-standalone-only' not in c.metadata.get('tags',[])]
    embedded_md=[c for c in embedded.cells if c.cell_type=='markdown']
    assert len(original_md)==len(embedded_md), name
    for a,b in zip(original_md,embedded_md):
        assert len(b.source)>=len(a.source)-40, 'Explanations removed: '+name
        assert a.get('attachments')==b.get('attachments')
    for nb,base in [(src,(root/'content'/name).parent),(embedded,root/'content/portal')]:
        for c in nb.cells:
            if c.cell_type=='markdown':
                for link in re.findall(r'\]\(([^)]+\.ipynb)\)',c.source):
                    assert (base/link).is_file(), (name,link)
# Exams in lesson 8 must fit the stated 80-minute parallel work window.
oral=next(l for l in lessons if l['id']=='08')
assert sum(p['minutes'] for p in oral['phases'][1:-1])==80
planning=(root/'worksheets/md/KI_Planung.md').read_text()
rows=re.findall(r'^\| (10|12|14) \| ([\d,]+) Min\. \| ([\d,]+) Min\. \| (\d+) Min\. \| (\d+) Min\. \|$',planning,re.M)
assert len(rows)==3
for n,talk,switch,total,reserve in rows:
    assert int(n)*(float(talk.replace(',','.'))+float(switch.replace(',','.')))==int(total)
    assert int(total)+int(reserve)==80
    assert int(reserve)>=8, 'Conversation window needs a real reserve'
assert 'Alle Fachgespräche finden in Doppellektion 8 statt.' in soup.get_text()
repro=soup.select_one('details#reproduktion')
assert repro and repro.select_one('textarea[data-journal="reproduktion"][data-optional]')
assert 'privaten Fenster' in repro.get_text() and 'daten_sha256' in repro.get_text() and 'wiederholen=True' in repro.get_text()
lesson8=plans.select_one('[data-lesson="08"]')
assert sum(int(x.get_text()) for x in lesson8.select('.min') if x.get_text().strip().isdigit())>=70
assert 'Reproduktionsprüfung' in lesson8.get_text() and 'Reproduktionsprüfung' in planning
assert 'Fremdtest und Rückmeldung' in lesson8.get_text()
assert '15 Minuten Puffer' in planning
sol=soup.select_one('#sol-rahmen')
assert sol and 'keine festen Lektionstermine' in sol.get_text()
assert 'unbenotet' in repro.get_text()
assert 'Freiwillige Vertiefung, kein Pflichtteil' in repro.get_text()
assert 'Etappenplan' in soup.select_one('textarea[data-journal="contribution"]').parent.get_text()
assert 'Ihr Arbeitsweg:' not in soup.get_text()
assert 'Ihr Arbeitsweg:' not in plans.get_text()
assert 'Garry Kasparov' in soup.get_text()
for lesson in lessons:
    work=lesson['phases'][3]
    reserve=[s for s in work['schritte'] if 'Puffer' in s['text']]
    assert sum(s['min'] for s in reserve)>=10, lesson['id']
for lid in ['06','07']:
    lesson=next(l for l in lessons if l['id']==lid)
    assert lesson['phases'][3]['minutes']==70
    assert all(s['wer']!='Lehrperson' for p in lesson['phases'] for s in p['schritte'])
project_nb=nbformat.read(root/'content/ki_projekt/ki_tandemprojekt.ipynb',4)
intro=project_nb.cells[0].source
assert 'keine festen Lektionstermine' in intro and 'Etappenplan' in intro
assert not any(f'| Doppellektion {n} |' in intro for n in [5,6,7])
assert not re.search(r'\b\d{1,2}\.\d{1,2}\.20\d{2}\b',soup.get_text())
for document in [soup.get_text(),planning,(root/'content/ki_projekt/ki_projektauftrag.md').read_text()]:
    assert not any(old in document for old in ['über mehrere Termine','auf weitere Termine','zusätzliche Gesprächszeiten'])
for sid,minimum in {'einstieg':5,'lernarten':4,'perzeptron':4,'netze':4,'sprache':7,'gesellschaft':5,'projekt':4}.items():
    chapters=soup.select(f'#{sid} details.kapitel')
    assert len(chapters)>=minimum and all(c.select_one('.kapitel-nr') and c.select_one('h2.kapitel-titel') for c in chapters) and all(c.get('data-kurz') for c in chapters), sid
assert len(soup.select('[data-score]'))==10
assert len(soup.select('[data-lab="lernarten.ipynb"]'))==0
for name in ['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_lernlabor.ipynb']:
    assert soup.select_one('[data-lab="'+name+'"]'), name
print('PASS 10 numbered 90-minute plans, date-free lessons, anchors, graphics, five descriptive notebooks, portable attachments, manual project gates, rubric and final-lesson exam timing')
