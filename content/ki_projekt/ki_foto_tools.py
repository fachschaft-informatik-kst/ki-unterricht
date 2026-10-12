"""Fotoimport für CPython und Pyodide. Training erfolgt in ki_projekt_tools.
Das Fotostudio extrahiert Merkmale, dieses Modul prüft und normiert sie.
"""
import base64
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image
import ki_projekt_tools as ki

PIPELINE = 'mobilenet-v2-050-224-rgb-whitepad-v1'


def fotostudio():
    folder = Path(__file__).parent
    page = (folder / 'fotostudio.html').read_text(encoding='utf-8')
    core = (folder / 'fotostudio_core.js').read_text(encoding='utf-8')
    page = page.replace('<script src="fotostudio_core.js"></script>', '<script>' + core + '</script>')
    ki.download(page, 'fotostudio.html', 'text/html')


def daten_laden(modus='UEBUNG', klassen=('Kreis', 'Dreieck'),
                train=('G01', 'G02', 'G03', 'G04'), val=('G05', 'G06'),
                test=('G07', 'G08'), dateien=(), upload=None):
    ki.pruefe(modus in ('UEBUNG', 'EIGENE_DATEN', 'ERSATZ'), 'Modus: UEBUNG, EIGENE_DATEN oder ERSATZ.')
    if modus in ('UEBUNG', 'ERSATZ'):
        dateien = [Path(__file__).with_name('foto_uebungsdaten.json')]
        upload = None
    docs = [json.loads(Path(p).read_text(encoding='utf-8')) for p in dateien]
    if upload is not None:
        values = upload.value.values() if isinstance(upload.value, dict) else upload.value
        docs += [json.loads(bytes(f['content']).decode('utf-8')) for f in values]
    ki.pruefe(bool(docs), 'JSON-Dateien aus dem Fotostudio auswählen.')
    by_id = {}
    for doc in docs:
        ki.pruefe(doc.get('schema') == 'fotostudio-v1' and doc.get('pipeline') == PIPELINE,
                  'Nur Dateien derselben Fotostudio-Pipeline kombinieren.')
        if modus == 'EIGENE_DATEN':
            ki.pruefe(not doc.get('synthetic', False), 'Übungsdaten sind keine eigenen Fotos. UEBUNG oder ERSATZ verwenden.')
        for r in doc.get('records', []):
            ki.pruefe(all(isinstance(r.get(k), str) and r[k].strip() for k in ['id','group','label','source','filename']),
                      'Bild-ID, Gruppe, Klasse, Quelle oder Dateiname fehlt.')
            if r['id'] in by_id:
                ki.pruefe(r == by_id[r['id']], 'Widersprüchliche Bild-ID.')
            by_id[r['id']] = r
    ki.pruefe(2 <= len(klassen) <= 4 and len(set(klassen)) == len(klassen), '2–4 eindeutige Klassen wählen.')
    records = sorted(by_id.values(), key=lambda r:r['id'])
    ki.pruefe(bool(records) and set(r['label'] for r in records) == set(klassen),
              'Klassenliste muss genau den Klassen der importierten Sammlung entsprechen.')
    X = np.asarray([r.get('features', []) for r in records], dtype=np.float32)
    ki.pruefe(X.shape == (len(records),1280) and np.isfinite(X).all(), 'Je Bild 1280 endliche Merkmale erforderlich.')
    norms = np.linalg.norm(X,axis=1,keepdims=True)
    ki.pruefe(np.all(norms>0), 'Leerer Merkmalsvektor.')
    ki.pruefe(len({hashlib.sha256(row.tobytes()).hexdigest() for row in X}) == len(X),
              'Identische Bildmerkmale: Kopien entfernen und Gruppenzuordnung prüfen.')
    X = X / norms  # per-image L2 normalization; no fit on validation or test
    previews=[]
    for r in records:
        value=r.get('preview','')
        ki.pruefe(value.startswith('data:image/png;base64,') and len(value)<100000, 'PNG-Vorschau fehlt oder ist zu gross.')
        with Image.open(io.BytesIO(base64.b64decode(value.split(',',1)[1],validate=True))) as im:
            ki.pruefe(im.size == (64,64), 'Vorschau muss 64 × 64 Pixel haben.')
            previews.append(np.asarray(im.convert('RGB')))
    y=np.array([klassen.index(r['label']) for r in records]);gruppen=np.array([r['group'] for r in records])
    for role in [train,val,test]:
        ki.pruefe(len(role)>=2 and len(set(role))==len(role), 'Je Rolle mindestens zwei verschiedene Datengruppen.')
        for g in role:
            ki.pruefe(set(y[gruppen==g])==set(range(len(klassen))), f'{g}: mindestens eine Klasse fehlt.')
    ki.pruefe(len(train)>=4, 'Mindestens vier Trainingsgruppen verwenden.')
    ki.pruefe(set(train).isdisjoint(val) and set(train).isdisjoint(test) and set(val).isdisjoint(test), 'Datengruppen müssen getrennt sein.')
    ki.pruefe(set(gruppen)==set(train)|set(val)|set(test), 'Jede Datengruppe genau einer Rolle zuordnen.')
    checksum=hashlib.sha256(json.dumps(records,sort_keys=True).encode()).hexdigest()
    for a in [X,y,gruppen]:a.flags.writeable=False
    d=ki.Daten(X,y,gruppen,[r['id'] for r in records],list(klassen),tuple(train),tuple(val),tuple(test),
               np.flatnonzero(np.isin(gruppen,val)),np.flatnonzero(np.isin(gruppen,test)),modus,checksum)
    d.bilder=np.array(previews)
    d.provenienz=dict(pipeline=PIPELINE,normalisierung='L2 je Bild',vortrainiert='MobileNet V2 alpha=0.5; eingefroren',
                     tfjs='4.22.0',mobilenet='2.1.1',
                     bilder=[{k:r[k] for k in ['id','group','label','source','filename']} for r in records])
    print(f'{modus}: {len(X)} Bilder, {len(klassen)} Klassen, 1280 feste Merkmale pro Bild.')
    if modus != 'EIGENE_DATEN':print('Synthetische geometrische Formen; keine Aussage über echte Fotoanwendungen.')
    print('Gruppe | '+' | '.join(klassen))
    for g in list(train)+list(val):print(g,'|',' | '.join(str(int(np.sum((gruppen==g)&(y==c)))) for c in range(len(klassen))))
    return d
