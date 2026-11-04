"""Prüft die Beispielbilder in testbilder/: Import, Gruppen, A/B-Vergleich und Abschlusstest.

Die JSON stammt aus tests/generate_testbilder_json.cjs (echte MobileNet-Merkmale der Bilder).
Aufruf im Projektordner: python tests/check_testbilder.py
"""
import hashlib
import json
import sys
from pathlib import Path
import matplotlib
matplotlib.use('Agg')

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'kurse/bok/4-klasse/content/ki_projekt'))
import ki_foto_tools as foto  # noqa: E402

JSON_PFAD = ROOT / 'kurse/bok/4-klasse/testbilder/beispielbilder_fotostudio.json'
doc = json.loads(JSON_PFAD.read_text(encoding='utf-8'))
assert doc['schema'] == 'fotostudio-v1' and doc['pipeline'] == foto.PIPELINE and not doc.get('synthetic')
assert len(doc['records']) == 80

for folder in sorted((ROOT / 'kurse').glob('*/*-klasse/testbilder')):
    collection = json.loads((folder / 'beispielbilder_fotostudio.json').read_text(encoding='utf-8'))
    sources = json.loads((folder / 'quellen.json').read_text(encoding='utf-8'))
    assert sources['license'] == 'CC BY-SA 4.0'
    assert len(sources['revision']) == 40
    assert len(collection['records']) == len(sources['records']) == 80
    assert len({r['id'] for r in collection['records']}) == 80, 'Bild-IDs müssen eindeutig sein'
    assert len(list(folder.rglob('*.jpg'))) == 80
    by_path = {r['path']: r for r in sources['records']}
    owners = {}
    for r in collection['records']:
        relative = f"{r['label']}/{r['group']}/{r['filename']}"
        source = by_path[relative]
        assert hashlib.sha256((folder / relative).read_bytes()).hexdigest() == source['sha256']
        assert sources['revision'] in source['url']
        assert source['url'] in r['source'] and sources['licenseUrl'] in r['source']
        assert len(r['features']) == 1280 and r['preview'].startswith('data:image/png;base64,')
        key = (r['label'], source['collection'])
        assert owners.setdefault(key, r['group']) == r['group'], 'Quellsammlung über Datengruppen verteilt'

daten = foto.projekt_laden('EIGENE_DATEN', ['Apfel', 'Banane'], dateien=[JSON_PFAD])
exp = foto.vergleichen(daten, wiederholen=True)
for lauf in exp['laeufe']:
    assert lauf['val'] >= .75, ('Validierung zu schwach', lauf['variante'], lauf['seed'], lauf['val'])
test = foto.projekt_test(exp, 'B', 'B nutzt zwei Quellsammlungen je Klasse; V1 bleibt getrennt.', True)
assert test['mittelwert'] >= .75, test
print('PASS testbilder: 80 Bilder, 2 Klassen, A/B-Vergleich und Abschlusstest laufen mit den Beispielbildern')
