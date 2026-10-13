"""Checks the teaching claims: XOR, fair A/B, held-out gate."""
import copy
import json
import sys
from pathlib import Path
from types import SimpleNamespace
import numpy as np
import matplotlib
matplotlib.use('Agg')
root=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(root/'content'),str(root/'content/ki_projekt')]
import unterricht_tools as u
import ki_foto_tools as foto
import ki_projekt_tools as ki

def rejects(fn):
    try:fn()
    except ValueError:return
    raise AssertionError('Invalid input accepted')

def main():
    np.testing.assert_array_equal(u.xor_netz(),[0,1,1,0])
    regeln={
        'UND (AND)': [0,0,0,1],
        'ODER (OR)': [0,1,1,1],
        'NAND': [1,1,1,0],
        'XOR': [0,1,1,0],
    }
    for regel,erwartet in regeln.items():
        np.testing.assert_array_equal(u.logik_ausgaben(regel),erwartet)
    rejects(lambda:u.logik_ausgaben('unbekannt'))
    d=foto.projekt_laden();assert d.X.shape==(80,1280)
    assert len(d.val)==16 and len(d.test)==32
    exp=foto.vergleichen(d)
    a,b=exp['laeufe'];assert a['seed']==b['seed']==11
    assert len(a['ids'])==len(b['ids'])==16
    assert set(d.personen[a['ids']])=={'T1'}
    assert set(d.personen[b['ids']])=={'T1','T2'}
    for x in (a,b):
        assert set(x['ids']).isdisjoint(d.val) and set(x['ids']).isdisjoint(d.test)
        assert np.bincount(d.y[x['ids']]).tolist()==[8,8]
        assert x['netz'].hidden_layer_sizes==(16,)
    assert set(b['ids'][d.personen[b['ids']]=='T1'])<=set(a['ids'])
    rejects(lambda:foto.beispiele(exp,test=True))
    assert foto.projekt_test(exp,freigabe=False) is None
    result=foto.projekt_test(exp,begruendung='B wurde vor Testeinsicht anhand der Validierung gewählt.',freigabe=True)
    assert result['n_bilder']==32 and len(result['scores'])==1
    rejects(lambda:foto.vergleichen(d))
    rejects(lambda:foto.beispiele(exp,variante='A',test=True))
    # Imported own-photo path using a schema fixture, not a claim these are real photos.
    source=json.loads((root/'content/ki_projekt/foto_uebungsdaten.json').read_text())
    by_id={x['id']:x for x in source['records']}
    records=[dict(by_id[id],group=str(group)) for id,group in zip(d.ids,d.personen)]
    doc=dict(source,synthetic=False,records=records)
    def load(doc):return foto.projekt_laden('EIGENE_DATEN',upload=SimpleNamespace(value=({'content':json.dumps(doc).encode()},)))
    own=load(doc);np.testing.assert_array_equal(own.X,d.X)
    rejects(lambda:load(dict(doc,synthetic=True)))
    rejects(lambda:load(dict(doc,records=records[:-1])))
    bad=copy.deepcopy(doc);bad['records'][0]['group']='V1';rejects(lambda:load(bad))
    repeated=foto.vergleichen(own,wiederholen=True);assert len(repeated['laeufe'])==6
    # Ziffernbeispiele: trainierte Netze müssen auf neuen Bildern deutlich besser als Raten sein.
    X,y,_,val=u._ziffern_daten();netz=u.ziffern(16);assert netz.score(X[val],y[val])>.9
    u.ziffer_durchs_netz(netz,0);rejects(lambda:u.ziffer_durchs_netz(netz,10**6))
    u.neuron_ziffern(0,1);rejects(lambda:u.neuron_ziffern(3,3))
    u.drei_rollen(100);rejects(lambda:u.drei_rollen(5))
    foto.gruppen_zeigen(d);foto.bild_durchs_netz(exp,'B',0);foto.vorhersagen_zeigen(exp,'A')
    rejects(lambda:foto.bild_durchs_netz(exp,'B',99))
    print('PASS basis: XOR, 80-photo import, equal samples, group separation, final gate and optional repeats')

if __name__=='__main__':main()
