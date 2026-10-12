"""Meaningful invariants for the three classroom experiments; no network needed.
Run from repository root: python tests/check_ki_projekt.py
"""
import json
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'content' / 'ki_projekt'))
import ki_projekt_tools as ki


def fails(call, text):
    try:
        call()
    except ValueError as exc:
        assert text in str(exc), str(exc)
    else:
        raise AssertionError('Expected rejection: ' + text)


def main():
    d = ki.daten_laden()
    fails(lambda: ki.daten_laden(val=('P01', 'P06')), 'verschiedene Personen')
    for weg in ['menge', 'vielfalt', 'netz']:
        exp = ki.experiment_starten(d, weg=weg, epochen=5)
        for seed in exp['einstellungen']['seeds']:
            a,b = [r for r in exp['laeufe'] if r['seed'] == seed]
            for r in [a,b]:
                assert set(r['ids']).isdisjoint(d.val)
                assert set(r['ids']).isdisjoint(d.test)
                assert set(d.personen[r['ids']]) <= set(d.train_personen)
                counts=np.bincount(d.y[r['ids']])
                assert len(set(counts)) == 1
            if weg == 'menge':
                assert len(a['ids']) == 36 and len(b['ids']) == 144
                assert set(a['ids']) < set(b['ids'])
                assert set(d.personen[a['ids']]) == set(d.personen[b['ids']])
                assert a['netz'].hidden_layer_sizes == b['netz'].hidden_layer_sizes
            elif weg == 'vielfalt':
                assert len(a['ids']) == len(b['ids']) == 72
                assert len(set(d.personen[a['ids']])) == 2
                assert len(set(d.personen[b['ids']])) == 4
                assert a['netz'].hidden_layer_sizes == b['netz'].hidden_layer_sizes
            else:
                np.testing.assert_array_equal(a['ids'], b['ids'])
                assert a['netz'].hidden_layer_sizes == (8,)
                assert b['netz'].hidden_layer_sizes == (48,)
        assert ki.abschlusstest(exp, freigabe=False) is None
        assert not d.test_verwendet
        report=ki.protokoll(exp, export=False)
        assert report['abschlusstest'] is None
        assert len(report['laeufe']) == 6
        assert report['daten_sha256'] == d.checksum
        print('PASS:', weg)
    # Verify immutability of captured settings and the selection gate.
    fails(lambda: ki.abschlusstest(exp, freigabe=True, begruendung=''), 'begründen')
    reason='Variante B nach Vergleich aller vorab festgelegten Validierungsläufe.'
    result=ki.abschlusstest(exp, freigabe=True, begruendung=reason)
    assert result['n_bilder'] == 90 and len(result['scores']) == 3
    assert ki.abschlusstest(exp, freigabe=True, begruendung=reason) == result
    fails(lambda: ki.abschlusstest(exp, variante='A', freigabe=True, begruendung=reason), 'nicht ändern')
    fails(lambda: ki.experiment_starten(d), 'bereits angesehen')
    plt.close('all')
    # Own-data path, duplicate downloads and ipywidgets 7/8 layouts.
    fixture=dict(schema='symbolstudio-v1',size=16,records=ki.demo_daten())
    payload=json.dumps(fixture).encode()
    for value in [({'content':memoryview(payload)},), {'file.json':{'content':payload}}]:
        records=ki.dateien_lesen(upload=SimpleNamespace(value=value))
        assert len(records) == 360
    with tempfile.TemporaryDirectory() as folder:
        path=Path(folder)/'drawings.json';path.write_bytes(payload)
        own=ki.daten_laden(modus='EIGENE_DATEN',dateien=[path,path])
        np.testing.assert_array_equal(own.X,d.X)
        assert own.checksum == d.checksum and own.modus == 'EIGENE_DATEN'
        fixture['records'][1]['pixels']=fixture['records'][0]['pixels']
        path.write_text(json.dumps(fixture))
        fails(lambda: ki.daten_laden(modus='EIGENE_DATEN',dateien=[path]), 'Identische Bilder')
    print('PASS: import, disjoint groups, held-out gate and experiment invariants')


if __name__ == '__main__':
    main()
