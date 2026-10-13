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

lessons=json.loads((root/'projekt/kurs.json').read_text())['lessons']
assert [l['id'] for l in lessons]==[f'{i:02d}' for i in range(1,11)]
soup=BeautifulSoup((root/'projekt/index.html').read_text(),'html.parser')
ids=[x['id'] for x in soup.select('[id]')]
assert len(ids)==len(set(ids)), 'Duplicate HTML IDs'
for lesson in lessons:
    assert sum(p['minutes'] for p in lesson['phases'])==90
    assert [p['phase'] for p in lesson['phases']]==PHASES
    plan=soup.select_one('[data-lesson="'+lesson['id']+'"]')
    lesson_label=f'Doppellektion {int(lesson["id"])}'
    assert plan and lesson_label in plan.get_text()
    for phase in lesson['phases']:
        assert phase['schritte'] and phase['schritte'][-1]['art']=='Ergebnis'
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
assert 'Alle Fachgespräche finden in Doppellektion 8 statt.' in soup.get_text()
repro=soup.select_one('details#reproduktion')
assert repro and repro.select_one('textarea[data-journal="reproduktion"][data-optional]')
assert 'privaten Fenster' in repro.get_text() and 'daten_sha256' in repro.get_text() and 'wiederholen=True' in repro.get_text()
lesson8=soup.select_one('[data-lesson="08"]')
assert sum(int(x.get_text()) for x in lesson8.select('.min') if x.get_text().strip().isdigit())>=70
assert 'Reproduktionsprüfung' in lesson8.get_text() and 'Reproduktionsprüfung' in planning
assert not re.search(r'\b\d{1,2}\.\d{1,2}\.20\d{2}\b',soup.get_text())
for document in [soup.get_text(),planning,(root/'content/ki_projekt/ki_projektauftrag.md').read_text()]:
    assert not any(old in document for old in ['über mehrere Termine','auf weitere Termine','zusätzliche Gesprächszeiten'])
assert len(soup.select('[data-score]'))==10
assert len(soup.select('[data-lab="lernarten.ipynb"]'))==0
for name in ['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_lernlabor.ipynb']:
    assert soup.select_one('[data-lab="'+name+'"]'), name
print('PASS 10 numbered 90-minute plans, date-free lessons, anchors, graphics, five descriptive notebooks, portable attachments, manual project gates, rubric and final-lesson exam timing')
