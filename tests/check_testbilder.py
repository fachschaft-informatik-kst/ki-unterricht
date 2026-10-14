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
sys.path.insert(0, str(ROOT / 'content/ki_projekt'))
import ki_foto_tools as foto  # noqa: E402

JSON_PFAD = ROOT / 'testbilder/beispielbilder_fotostudio.json'
doc = json.loads(JSON_PFAD.read_text(encoding='utf-8'))
assert doc['schema'] == 'fotostudio-v1' and doc['pipeline'] == foto.PIPELINE and not doc.get('synthetic')
assert len(doc['records']) == 80

# Jede Zeile der JSON gehört zu genau einem Bild im Ordner und trägt dessen Klasse und Gruppe.
for r in doc['records']:
    datei = ROOT / 'testbilder' / r['label'] / r['group'] / r['filename']
    assert datei.is_file(), datei
assert len({r['id'] for r in doc['records']}) == 80, 'Bild-IDs müssen eindeutig sein'
assert len(list((ROOT / 'testbilder').rglob('*.jpg'))) == 80

daten = foto.projekt_laden('EIGENE_DATEN', ['Apfel', 'Banane'], dateien=[JSON_PFAD])
exp = foto.vergleichen(daten, wiederholen=True)
for lauf in exp['laeufe']:
    assert lauf['val'] >= .75, ('Validierung zu schwach', lauf['variante'], lauf['seed'], lauf['val'])
test = foto.projekt_test(exp, 'B', 'B erreicht auf V1 mindestens so viel wie A und nutzt zwei Exemplare je Klasse.', True)
assert test['mittelwert'] >= .75, test
print('PASS testbilder: 80 Bilder, 2 Klassen, A/B-Vergleich und Abschlusstest laufen mit den Beispielbildern')
