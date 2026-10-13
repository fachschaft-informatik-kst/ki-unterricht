"""Curriculum invariants: one current route, matching plans, portable teaching notebooks."""
from pathlib import Path
import base64
import datetime
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
assert len(lessons)==10 and len({l['date'] for l in lessons})==10
soup=BeautifulSoup((root/'projekt/index.html').read_text(),'html.parser')
ids=[x['id'] for x in soup.select('[id]')]
assert len(ids)==len(set(ids)), 'Duplicate HTML IDs'
for lesson in lessons:
    assert datetime.datetime.strptime(lesson['date'],'%d.%m.%Y').weekday()==1
    assert sum(p['minutes'] for p in lesson['phases'])==90
    assert [p['phase'] for p in lesson['phases']]==PHASES
    plan=soup.select_one('[data-lesson="'+lesson['id']+'"]')
    assert plan and lesson['date'] in plan.get_text()
    for phase in lesson['phases']:
        assert phase['task'] in plan.get_text()
        assert phase['task'] in (root/'worksheets/md/KI_Planung.md').read_text()
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
# Same-day exams must fit the stated 80-minute parallel work window.
oral=next(l for l in lessons if l['id']=='08')
assert oral['date']=='19.01.2027'
assert sum(p['minutes'] for p in oral['phases'][1:-1])==80
planning=(root/'worksheets/md/KI_Planung.md').read_text()
rows=re.findall(r'^\| (10|12|14) \| ([\d,]+) Min\. \| ([\d,]+) Min\. \| (\d+) Min\. \| (\d+) Min\. \|$',planning,re.M)
assert len(rows)==3
for n,talk,switch,total,reserve in rows:
    assert int(n)*(float(talk.replace(',','.'))+float(switch.replace(',','.')))==int(total)
    assert int(total)+int(reserve)==80
assert 'Alle Fachgespräche finden am 19.01.2027 statt.' in soup.get_text()
for document in [soup.get_text(),planning,(root/'content/ki_projekt/ki_projektauftrag.md').read_text()]:
    assert not any(old in document for old in ['über mehrere Termine','auf weitere Termine','zusätzliche Gesprächszeiten'])
assert len(soup.select('[data-score]'))==10
assert len(soup.select('[data-lab="lernarten.ipynb"]'))==0
for name in ['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_lernlabor.ipynb']:
    assert soup.select_one('[data-lab="'+name+'"]'), name
print('PASS 10 matching 90-minute plans, dates, anchors, graphics, five descriptive notebooks, portable attachments, manual project gates, rubric and same-day exam timing')
