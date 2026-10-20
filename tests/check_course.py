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
from build_course import PHASES

lessons=json.loads((root/'_build/site/projekt/kurs.json').read_text())['lessons']
assert len(lessons)>=10
assert len({l['id'] for l in lessons})==len(lessons), 'Lesson IDs must be stable and unique'
assert [l['number'] for l in lessons]==list(range(1,len(lessons)+1))
assert all(l['view'] and l['order'] is not None for l in lessons)
assert [l['order'] for l in lessons]==sorted(l['order'] for l in lessons)
# Historical IDs are durable storage and deep-link contracts, not a numbering scheme.
assert {f'{i:02d}' for i in range(1,11)}.issubset({l['id'] for l in lessons})
planned_minutes={
    role: sum(step.get('min',0) for lesson in lessons for phase in lesson['phases'] for step in phase['schritte'] if step['wer']==role)
    for role in ['Einzeln','Klasse']
}
assert planned_minutes['Einzeln']>=100
assert planned_minutes['Klasse']>=50
for lesson in lessons:
    if lesson['id'] in ['05','06','07','08']:
        assert any(step['wer']=='Einzeln' for phase in lesson['phases'] for step in phase['schritte'])
soup=BeautifulSoup((root/'_build/site/projekt/index.html').read_text(),'html.parser')
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
page=(root/'_build/site/projekt/index.html').read_text()
assert len([d for d in soup.select('#projekt details') if d.find('summary', recursive=False) and d.find('summary', recursive=False).get_text(strip=True)=='Termine ansehen']) == 1, 'There must be exactly one project schedule'
# Ablauftabellen stehen nur auf der Lehrpersonen-Seite, nicht auf der Kursseite.
plans=BeautifulSoup((root/'_build/site/projekt/unterrichtsplan.html').read_text(),'html.parser')
assert not soup.select('.phase-table') and 'Unser Ablauf' not in soup.get_text() and 'Am Ende sichtbar' not in soup.get_text()
assert soup.select_one('a[href="unterrichtsplan.html"]')
ids=[x['id'] for x in soup.select('[id]')]
assert len(ids)==len(set(ids)), 'Duplicate HTML IDs'
for lesson in lessons:
    assert sum(p['minutes'] for p in lesson['phases'])==90
    assert [p['phase'] for p in lesson['phases']]==PHASES
    intro=soup.select_one('[data-lesson="'+lesson['id']+'"]')
    plan=plans.select_one('[data-lesson="'+lesson['id']+'"]')
    lesson_label=f'Doppellektion {lesson["number"]}'
    assert intro and lesson_label in intro.get_text() and lesson['goal'] in intro.get_text() and lesson['question'] in intro.get_text()
    assert plan and lesson_label in plan.get_text() and lesson['product'] in plan.get_text()
    for phase in lesson['phases']:
        assert phase['schritte'] and phase['schritte'][-1]['art']=='Ergebnis'
        assert sum(step.get('min',0) for step in phase['schritte'])==phase['minutes']
        for step in phase['schritte']:
            assert step['text'] in plan.get_text(), step['text'][:40]
            assert step['text'] in (root/'_build/site/projekt/KI_Planung.md').read_text(), step['text'][:40]
for a in soup.select('a[href^="#"]'):
    assert a['href'][1:] in ids, a['href']
for img in soup.select('img'):
    assert img.get('alt'), img
    src=img['src']
    assert (root/'_build/site/projekt'/src).is_file() or src in ['previews/perzeptron.png','previews/xor.png','previews/datenplan.png','https://inf-schule.de/content/5_ki/1_menueansicht/1_basiswissen_ki/2_lernarten/2_erkundung_LernendeSysteme/evas.png'], src
# XOR is a *new* problem in Doppellektion 4; DL3 contains only single
# neuron calculations and trainable AND/OR examples. Keep historic form IDs
# in the new chapter so previously saved answers remain available.
dl3=soup.select_one('#perzeptron')
dl4=soup.select_one('#netze')
assert dl3 and dl4 and soup.select_one('#perzeptron-6'), 'Historic DL3 chapter anchor must survive'
assert 'XOR' not in dl3.get_text(), 'DL3 must not reveal XOR before the network lesson'
assert dl4.select_one('[data-answer="hand_xor_max"]'), 'Historic XOR result must move intact into DL4'
assert dl4.select_one('[data-answer="xor_warum"]'), 'Historic XOR explanation must move intact into DL4'
assert not dl3.select_one('[data-answer="hand_xor_max"],[data-answer="xor_warum"]')
assert 'Vier mögliche' not in soup.select_one('#perzeptron-5').get_text()
single=nbformat.read(root/'content/perzeptron_und_neuronale_netze.ipynb',4)
multi=nbformat.read(root/'content/mehrschichtige_netze.ipynb',4)
assert sum('ki-autostart' in c.metadata.get('tags',[]) for c in single.cells)==4
assert not any('XOR' in c.source for c in single.cells), 'XOR experiment must not remain in DL3'
first_code=[c.source for c in multi.cells if c.cell_type=='code']
assert 'u.live_gatter(' in first_code[1] and "'XOR'" in first_code[1], 'DL4 must introduce XOR before the network solution'
assert any('u.xor_netz()' in source for source in first_code[2:]), 'DL4 multi-neuron solution must remain'

# DL4 only covers XOR and neural networks; DL5 guides data-split self-study.
dl4plan=next(l for l in lessons if l['id']=='04')
dl5plan=next(l for l in lessons if l['id']=='05')
assert 'Datenaufteilung' not in dl4plan['goal'] and 'Validierung' not in dl4plan['goal']
assert all('Datenleck' not in step['text'] and 'T1/T2' not in step['text']
           for phase in dl4plan['phases'] for step in phase['schritte'])
assert 'Datenlecks' in dl5plan['goal']
assert all(step['wer']!='Lehrperson' for step in dl5plan['phases'][3]['schritte'])
sol_data=soup.select_one('#projekt-3')
assert sol_data and sol_data.select_one('[data-lab="daten_training.ipynb"]')
assert 'Training:' in sol_data.get_text() and 'Validierung:' in sol_data.get_text()
assert 'Musterlösung' in sol_data.get_text() and 'Datenleck' in sol_data.get_text()
assert 'Reflexion 2' in sol_data.get_text() and '80 Bilder' in sol_data.get_text()
assert not soup.select_one('#netze [data-lab="daten_training.ipynb"]')
data_nb=nbformat.read(root/'content/daten_training.ipynb',4)
assert 'Doppellektion 5' in data_nb.cells[0].source
assert 'selbstständig' in data_nb.cells[0].source


assert {p.name for p in (root/'_build/content/portal').glob('*.ipynb')}=={Path(p).name for p in ITEMS}
originals={str(p.relative_to(root/'content')) for p in (root/'content').rglob('*.ipynb') if 'portal' not in p.parts and '.ipynb_checkpoints' not in p.parts}
assert originals==set(ITEMS), originals
for name in ITEMS:
    src=nbformat.read(root/'content'/name,4)
    embedded=nbformat.read(root/'_build/content/portal'/Path(name).name,4)
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
    for nb,base in [(src,(root/'content'/name).parent),(embedded,root/'_build/content/portal')]:
        for c in nb.cells:
            if c.cell_type=='markdown':
                for link in re.findall(r'\]\(([^)]+\.ipynb)\)',c.source):
                    assert (base/link).is_file(), (name,link)
# Exactly 20 individual oral interviews by ONE examiner fit 90 + 10 minutes.
oral=next(l for l in lessons if l['id']=='08')
assert sum(p['minutes'] for p in oral['phases'])==90  # AVIVA class plan
assert oral['phases'][0]['schritte'][0]['wer']=='Einzeln', 'No whole-class introduction while examinations are running'
planning=(root/'_build/site/projekt/KI_Planung.md').read_text()
assert '20 × (4 + 1) = 100 Minuten' in planning
assert '90 Minuten Unterricht plus 10 Minuten unmittelbar anschliessend' in planning
assert 'eine Lehrperson' in planning
assert 'Minute **0**' in planning and 'Minute **100**' in planning
assert 'keine Zeitreserve' in planning
assert 'Personen 19 und 20' in planning
assert len(re.findall(r'^\| (?:1–4|5–8|9–12|13–16|17–18|19–20) \| Minute ',planning,re.M))==6
assert 'zweite prüfende Lehrperson' not in planning
assert '20 Einzelgespräche bei einer Lehrperson' in soup.get_text()
assert 'Ein gemeinsames Journal. Zwei getrennte Einzelgespräche.' in soup.get_text()
assert 'vierminütige' in planning or 'Vier Minuten Einzelgespräch' in planning
assert '100 Minuten' in oral['zeit'] and 'eine Lehrperson' in oral['zeit']
assert 'individuelle Gesprächspunkte' in planning
assert 'K10 · Individuelles Verständnis' in soup.get_text()
assert len(soup.select('#einstieg-4 .typen tbody tr')) == 2
assert 'Schwache und starke KI' in soup.select_one('#einstieg-4 summary').get_text()
assert 'Theory of Mind' not in soup.select_one('#einstieg-4').get_text()
assert 'vier KI-Typen' not in plans.get_text()
assert 'Typ 1–4' not in planning
assert len(soup.select('#einstieg-4 textarea[data-answer="ki_ordnung"]')) == 1
# Keep historical answer IDs present to avoid dropping previously saved entries.
assert all(len(soup.select(f'#einstieg-4 [data-answer="typ_{n}"]')) == 1 for n in range(1,5))
assert all(len(soup.select(f'#einstieg-4 [data-answer="typ_bsp_{n}"]')) == 1 for n in range(1,5))

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
    if lesson['id'] not in ['05','06','07','08']: continue
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
print(f'PASS {len(lessons)} numbered 90-minute plans, date-free lessons, anchors, graphics, five descriptive notebooks, portable attachments, manual project gates, rubric and final-lesson exam timing')
