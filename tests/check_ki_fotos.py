"""Run from repo root. Real MobileNet features, local fixture, no network."""
import copy
import json
import sys
from pathlib import Path
from types import SimpleNamespace
import numpy as np
import matplotlib
matplotlib.use('Agg')
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'content'/'ki_projekt'))
import ki_foto_tools as foto
import ki_projekt_tools as ki


def rejected(fn):
    try:fn()
    except ValueError:return
    raise AssertionError('Invalid input accepted')


def main():
    d=foto.daten_laden()
    assert d.X.shape==(192,1280) and d.bilder.shape==(192,64,64,3)
    np.testing.assert_allclose(np.linalg.norm(d.X,axis=1),1,atol=1e-6)
    path=Path(foto.__file__).with_name('foto_uebungsdaten.json')
    doc=json.loads(path.read_text())
    def load(document):
        payload=json.dumps(document).encode()
        return foto.daten_laden(modus='EIGENE_DATEN',upload=SimpleNamespace(value=({'content':memoryview(payload)},)))
    rejected(lambda:load(doc)) # Synthetic data may not be labelled own photos.
    # Test own-photo schema separately; this modified copy is test-only.
    own=copy.deepcopy(doc);own.pop('synthetic')
    imported=load(own);np.testing.assert_array_equal(imported.X,d.X)
    bad=copy.deepcopy(own);bad['pipeline']='other';rejected(lambda:load(bad))
    bad=copy.deepcopy(own);bad['records'][0]['features']=[0]*1280;rejected(lambda:load(bad))
    bad=copy.deepcopy(own);bad['records'][1]['features']=bad['records'][0]['features'];rejected(lambda:load(bad))
    rejected(lambda:foto.daten_laden(val=('G01','G06')))
    rejected(lambda:foto.daten_laden(train=('G01','G02','G03','G04','G99')))
    for weg in ['menge','vielfalt','netz']:
        exp=ki.experiment_starten(d,weg=weg,epochen=5)
        for seed in (11,22,33):
            a,b=[r for r in exp['laeufe'] if r['seed']==seed]
            for r in (a,b):
                assert set(r['ids']).isdisjoint(d.val) and set(r['ids']).isdisjoint(d.test)
                assert len(set(np.bincount(d.y[r['ids']])))==1
            if weg=='menge':assert set(a['ids'])<set(b['ids'])
            if weg=='vielfalt':assert len(a['ids'])==len(b['ids']) and len(set(d.personen[a['ids']]))==2
            if weg=='netz':np.testing.assert_array_equal(a['ids'],b['ids'])
        report=ki.protokoll(exp,export=False)
        assert report['vorverarbeitung']['pipeline']==foto.PIPELINE
        assert len(report['vorverarbeitung']['bilder'])==192
    ki.daten_ansehen(d);ki.fehler_zeigen(exp)
    result=ki.abschlusstest(exp,freigabe=True,begruendung='Vorab begründete Wahl anhand aller Validierungsläufe.')
    assert result['n_bilder']==48
    rejected(lambda:ki.experiment_starten(d))
    print('PASS photo import, provenance, grouping, all comparisons and final gate')

if __name__=='__main__':main()
