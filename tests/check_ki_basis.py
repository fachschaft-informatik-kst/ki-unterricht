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
    # Fremdtest: Modell eines anderen Tandems beurteilt die eigenen Klassen C und D.
    umbenannt=dict(doc,records=[dict(r,label={'Kreis':'Hund','Dreieck':'Katze'}[r['label']]) for r in records])
    eigene=foto.projekt_laden('EIGENE_DATEN',['Hund','Katze'],upload=SimpleNamespace(value=({'content':json.dumps(umbenannt).encode()},)))
    ft=foto.fremdtest(exp,eigene);assert ft['matrix'].shape==(2,2) and ft['matrix'].sum()==80 and 0.5<=ft['trennschaerfe']<=1
    rejects(lambda:foto.fremdtest(exp,eigene,variante='Z'))
    # Ziffernbeispiele: trainierte Netze müssen auf neuen Bildern deutlich besser als Raten sein.
    X,y,_,val=u._ziffern_daten();netz=u.ziffern(16);assert netz.score(X[val],y[val])>.9
    u.ziffer_durchs_netz(netz,0);rejects(lambda:u.ziffer_durchs_netz(netz,10**6))
    u.neuron_ziffern(0,1);rejects(lambda:u.neuron_ziffern(3,3))
    u.drei_rollen(100);rejects(lambda:u.drei_rollen(5))
    for regler in (u.ziffern_regler,u.ziffer_regler,u.xor_lernen_regler):regler()
    u.ziffern_vorschau()
    # Lernweg Neuron: Gatter konvergieren, XOR nie; ein Neuron löst XOR höchstens 3 von 4, vier versteckte Neuronen vollständig.
    for aufgabe in ('AND','OR','NAND','NOR'):
        w,b=u.perzeptron_lernen(aufgabe);assert np.all((u._EINGABEN@w+b>=0)==np.array(u._ZIELE[aufgabe]))
    w,b=u.perzeptron_lernen('XOR',runden=8);assert np.sum((u._EINGABEN@w+b>=0)==np.array(u._ZIELE['XOR']))<4
    rejects(lambda:u.perzeptron_lernen('XYZ'));rejects(lambda:u.perzeptron(aufgabe='XYZ'))
    u.neuron_vergleich();assert u.neuron_zeigen(1,1,1,1,-1.5)==1 and u.neuron_zeigen(1,0,1,1,-1.5)==0
    w,b=u.iris_neuron();assert w.shape==(2,)
    assert u.xor_lernen(1).score(u._EINGABEN,u._ZIELE['XOR'])<1 and u.xor_lernen(4).score(u._EINGABEN,u._ZIELE['XOR'])==1
    rejects(lambda:u.xor_lernen(0))
    # Gleiches Schaubild wie in der Doppellektion: drei veränderbare Eingaben,
    # Gewichte, Summe + Bias und Output. Ohne externe SVG-Datei / JS lauffähig.
    import base64, re
    import xml.etree.ElementTree as ET
    aufgezeichnet=[]
    original_display=u.display
    try:
        u.display=lambda widget: aufgezeichnet.append(widget)
        sliders,tabelle=u.live_alltag()
    finally:
        u.display=original_display
    assert len(aufgezeichnet)==1
    controls=aufgezeichnet[0].children
    checks=next(c for c in controls if isinstance(c,u.widgets.HBox)).children
    schaubild=next(c for c in controls if isinstance(c,u.widgets.HTML)
                   and 'data:image/svg+xml;base64,' in c.value)
    def grafikwerte():
        match=re.search(r'data:image/svg\+xml;base64,([^"]+)',schaubild.value)
        assert match, 'Das Schwimmbad-Schaubild fehlt'
        svg=base64.b64decode(match.group(1))
        xml=ET.fromstring(svg)
        assert xml.attrib['viewBox']=='0 0 760 330'
        return [node.text for node in xml.iter() if node.tag.endswith('text')]
    ursprung=schaubild.value
    assert '5/8 richtig' in tabelle.value
    assert all(w.value==v for w,v in zip(sliders,[2.,2.,-1.,-1.]))
    assert [c.value for c in checks]==[True,False,True]
    assert 'Ja' in grafikwerte() and '= +0' in grafikwerte()
    sliders[2].value=-4.
    assert '8/8 richtig' in tabelle.value
    assert schaubild.value!=ursprung
    assert 'Nein' in grafikwerte() and '= −3' in grafikwerte()
    assert any('−4'==value for value in grafikwerte())
    checks[2].value=False
    assert 'Ja' in grafikwerte() and '= +1' in grafikwerte()
    checks[0].value=False
    assert 'Nein' in grafikwerte() and '= −1' in grafikwerte()
    assert tabelle.value.count('<tr>')==9  # Kopfzeile + acht Situationen

    # Experimente 2 und 4: dieselben Parameter für vier einzeln gezeichnete
    # Neuronen (00, 01, 10, 11), inklusive Ausgabe und Ziel.
    shown=[]
    original_display=u.display
    try:
        u.display=lambda widget: shown.append(widget)
        gate,w1,w2,b,table=u.live_gatter('AND')
    finally:
        u.display=original_display
    assert len(shown)==1 and len(shown[0].children)==4
    cards=shown[0].children[2]
    assert cards.value.count('data:image/svg+xml;base64,')==4
    assert cards.value.count('Fall ') == 4
    assert 'Gatter: AND' in cards.value and '4/4 richtig' in cards.value
    assert table.value.count('<tr>')==5  # Kopfzeile und vier Fälle.
    def minineuronen():
        matches=re.findall(r'data:image/svg\+xml;base64,([^"]+)',cards.value)
        assert len(matches)==4
        xmls=[ET.fromstring(base64.b64decode(encoded)) for encoded in matches]
        assert all(xml.attrib['viewBox']=='0 0 470 242' for xml in xmls)
        return [[node.text for node in xml.iter() if node.tag.endswith('text')]
                for xml in xmls]
    assert ['y = 0','Ziel 0 ✓'] == [
        value for value in minineuronen()[0] if value in ('y = 0','Ziel 0 ✓')]
    old_cards=cards.value
    w1.value=0.
    assert cards.value!=old_cards and '3/4 richtig' in cards.value
    assert 'y = 0' in minineuronen()[3]
    gate.value='XOR'
    assert 'Gatter: XOR' in cards.value and '4/4 richtig' not in cards.value
    assert 'Ziel 1 ✗' in minineuronen()[1]
    w1.value=3.
    assert cards.value.count('data:image/svg+xml;base64,')==4
    assert 'Gatter: XOR' in cards.value

    # Experiment 3: Auch der Lernschritt zeigt das bearbeitete Neuron;
    # nach dem Klick dieselbe Eingabe mit alten und neuen Gewichten.
    shown=[]
    original_display=u.display
    try:
        u.display=lambda widget: shown.append(widget)
        learner=u.lernen_klick('AND', .2)
    finally:
        u.display=original_display
    assert len(shown)==1
    learning_view=shown[0].children[2]
    assert learning_view.value.count('data:image/svg+xml;base64,')==1
    shown[0].children[1].children[1].click()  # Ganze Runde: vier Beispiele
    assert learning_view.value.count('data:image/svg+xml;base64,')==2
    assert 'Vorher · Entscheidung' in learning_view.value
    assert 'Nachher · neue Gewichte' in learning_view.value
    assert abs(learner.w[0]-.4)<1e-9 and abs(learner.b+.3)<1e-9
    shown[0].children[1].children[2].click()  # Zurücksetzen
    assert learning_view.value.count('data:image/svg+xml;base64,')==1

    # Neuron-Doppellektion: Alltagsneuron, Lernen per Klick, XOR-Widerspruch.
    ziel=[u._alltag_ziel(s,f,p) for s in (0,1) for f in (0,1) for p in (0,1)]
    assert list(u.alltagsneuron(1,1,-3,-.5))==ziel and list(u.alltagsneuron())!=ziel
    for aufgabe in ('AND','OR','NAND','NOR'):
        l=u._Lerner(aufgabe)
        while l.schritt():pass
        assert l.fertig and np.all((u._EINGABEN@l.w+l.b>=0)==np.array(u._ZIELE[aufgabe]))
    l=u._Lerner('XOR')
    while l.schritt():pass
    assert l.abgebrochen and not l.fertig
    l=u._Lerner('AND',.2);erste=[l.schritt() for _ in range(4)][3]
    assert erste['fehler']==1 and np.allclose(erste['w_neu'],[.4,.4]) and abs(erste['b_neu']+.3)<1e-9
    assert isinstance(u.lernen_klick(),u._Lerner);u.xor_problem();assert u.xor_versuch(1,1,-.5)<4
    z=u.xor_suche();assert z['AND'][4]>0 and z['XOR'][4]==0 and z['XOR'][3]>0
    # Freiwillige Ziffernexperimente müssen beim Öffnen nur Regler anzeigen.
    # Weder die Datensätze noch ein rechenintensives Modell dürfen vor dem
    # bewussten Klick auf «Modell berechnen» geladen / trainiert werden.
    def nicht_beim_start(*args, **kwargs):
        raise AssertionError('Teures Ziffernmodell beim Notebookstart berechnet')
    ziffern_alt, daten_alt, netz_alt = u.ziffern, u._ziffern_daten, u._netz_fuer
    try:
        u.ziffern = nicht_beim_start
        u._ziffern_daten = nicht_beim_start
        u._netz_fuer = nicht_beim_start
        u.ziffern_regler()
        u.ziffer_regler()
    finally:
        u.ziffern, u._ziffern_daten, u._netz_fuer = ziffern_alt, daten_alt, netz_alt
    for regler in (u.regler_alltag,u.neuron_rechner,u.lernen_regler,u.iris_regler,u.regler_xor):regler()
    u.frage('Test',['a','b'],0,'ok');rejects(lambda:u.frage('Test',['a'],2,'x'))
    foto.gruppen_zeigen(d);foto.bild_durchs_netz(exp,'B',0);foto.vorhersagen_zeigen(exp,'A')
    rejects(lambda:foto.bild_durchs_netz(exp,'B',99))
    print('PASS basis: XOR, 80-photo import, equal samples, group separation, final gate and optional repeats')

if __name__=='__main__':main()
