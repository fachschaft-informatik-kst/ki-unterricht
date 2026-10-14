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
                test=('G07', 'G08'), dateien=(), upload=None, profil='vertiefung'):
    ki.pruefe(modus in ('UEBUNG', 'EIGENE_DATEN', 'ERSATZ'), 'Modus: UEBUNG, EIGENE_DATEN oder ERSATZ.')
    if modus in ('UEBUNG', 'ERSATZ'):
        dateien = [Path(__file__).with_name('foto_uebungsdaten.json')]
        upload = None
    docs = [json.loads(Path(p).read_text(encoding='utf-8')) for p in dateien]
    if upload is not None:
        values = upload.value.values() if isinstance(upload.value, dict) else upload.value
        docs += [json.loads(bytes(f['content']).decode('utf-8')) for f in values]
    ki.pruefe(bool(docs), 'JSON-Dateien aus dem Fotostudio auswählen.')
    ki.pruefe(profil in ('basis', 'vertiefung'), 'Profil: basis oder vertiefung.')
    if profil == 'basis' and modus in ('UEBUNG', 'ERSATZ'):
        mapping = dict(G01='T1', G02='T2', G05='V1', G07='P1', G08='P2')
        chosen=[]
        for g, new in mapping.items():
            for label in ('Kreis', 'Dreieck'):
                rows=sorted([r for r in docs[0]['records'] if r['group']==g and r['label']==label],key=lambda r:r['id'])[:8]
                chosen += [dict(r, group=new) for r in rows]
        docs=[dict(docs[0], records=chosen)]
    if profil == 'basis':
        ki.pruefe(len(klassen)==2, 'Im Pflichtprojekt genau zwei Klassen wählen.')
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
        ki.pruefe(len(role)>=(1 if profil=='basis' else 2) and len(set(role))==len(role), 'Datengruppen fehlen oder sind doppelt; Datenplan prüfen.')
        for g in role:
            ki.pruefe(set(y[gruppen==g])==set(range(len(klassen))), f'{g}: mindestens eine Klasse fehlt.')
    ki.pruefe(len(train)>=(2 if profil=='basis' else 4), 'Zu wenige Trainingsgruppen für dieses Profil.')
    ki.pruefe(set(train).isdisjoint(val) and set(train).isdisjoint(test) and set(val).isdisjoint(test), 'Datengruppen müssen getrennt sein.')
    ki.pruefe(set(gruppen)==set(train)|set(val)|set(test), 'Jede Datengruppe genau einer Rolle zuordnen.')
    if profil == 'basis':
        for g in list(train)+list(val)+list(test):
            for c in range(2):
                ki.pruefe(np.sum((gruppen==g)&(y==c)) == 8,
                          f'{g}/{klassen[c]}: im Pflichtprojekt genau 8 verschiedene Fotos verwenden.')
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


def projekt_laden(modus='UEBUNG', klassen=('Kreis','Dreieck'), dateien=(), upload=None):
    """80 Fotos: zwei Klassen, fünf unabhängige Gruppen, acht Bilder je Klasse/Gruppe."""
    return daten_laden(modus,klassen,train=('T1','T2'),val=('V1',),test=('P1','P2'),
                       dateien=dateien,upload=upload,profil='basis')


def gruppen_zeigen(daten, je=3):
    """Je Klasse und Trainings-/Validierungsgruppe einige Vorschauen; Testgruppen bleiben verdeckt."""
    import matplotlib.pyplot as plt
    gruppen=list(daten.train_personen)+list(daten.val_personen)
    fig,axes=plt.subplots(len(daten.klassen),len(gruppen)*je,figsize=(1.5*len(gruppen)*je,1.9*len(daten.klassen)),squeeze=False)
    for c,label in enumerate(daten.klassen):
        for g,gruppe in enumerate(gruppen):
            ids=np.flatnonzero((daten.y==c)&(daten.personen==gruppe))[:je]
            for k,i in enumerate(ids):
                ax=axes[c][g*je+k];ki._bild_zeigen(ax,daten,i);ax.axis('off')
                ax.set_title(f'{label}\n{gruppe}',fontsize=9)
    fig.suptitle('Jede Gruppe zeigt ein anderes Exemplar: Training T1/T2, Validierung V1')
    plt.tight_layout();plt.show()
    print('Gleiche Gruppe = dasselbe Exemplar in verschiedenen Fotos. Andere Gruppe = anderes Exemplar.')
    print('P1/P2 bleiben bis zum Abschlusstest ungezeigt.')


def bild_durchs_netz(exp, variante='B', nr=0):
    """Ein Validierungsbild von der Vorschau über die 1280 Merkmale bis zum Modellwert."""
    import matplotlib.pyplot as plt
    d=exp['daten']
    ki.pruefe(0<=nr<len(d.val), f'nr: Zahl von 0 bis {len(d.val)-1}.')
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    ki.pruefe(bool(runs),'Variante A oder B wählen.')
    i=d.val[nr];netz=runs[0]['netz'];probs=netz.predict_proba(d.X[i:i+1])[0]
    guess=int(np.argmax(probs));ok=guess==d.y[i]
    fig,axes=plt.subplots(1,3,figsize=(12,3.4),gridspec_kw=dict(width_ratios=[1,2.6,1.6]))
    ki._bild_zeigen(axes[0],d,i);axes[0].axis('off')
    axes[0].set_title('1 · Foto\n224 × 224 RGB (hier 64 × 64)',fontsize=10)
    axes[1].bar(np.arange(1280),d.X[i],width=1,color='#52656a')
    axes[1].set(title='2 · MobileNet (eingefroren): 1280 Merkmale',xlabel='Merkmal Nr.',ylabel='Wert (normiert)')
    axes[2].barh(d.klassen,probs*100,color=['#176c63' if j==guess else '#c9d3d6' for j in range(len(d.klassen))])
    axes[2].set(xlim=(0,100),xlabel='Modellwert (%)',title=f'3 · Unser Netz ({netz.hidden_layer_sizes[0]} Neuronen)')
    plt.tight_layout();plt.show()
    print(f'Bild {nr} aus V1 · tatsächlich: {d.klassen[d.y[i]]} · Netz: {d.klassen[guess]} ({probs[guess]:.0%}) · '+('richtig' if ok else 'Fehler'))
    print('Der Modellwert zeigt die Sicherheit des Netzes, nicht die Wahrscheinlichkeit, richtig zu liegen.')


def vorhersagen_zeigen(exp, variante='B'):
    """Alle Validierungsbilder mit Klasse, Vorhersage und Modellwert."""
    import matplotlib.pyplot as plt
    d=exp['daten']
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    ki.pruefe(bool(runs),'Variante A oder B wählen.')
    probs=runs[0]['netz'].predict_proba(d.X[d.val]);pred=probs.argmax(axis=1);sure=probs.max(axis=1)
    spalten=8;zeilen=-(-len(d.val)//spalten)
    fig,axes=plt.subplots(zeilen,spalten,figsize=(1.9*spalten,2.4*zeilen),squeeze=False)
    for ax in axes.ravel():ax.axis('off')
    for ax,j,i in zip(axes.ravel(),range(len(d.val)),d.val):
        ki._bild_zeigen(ax,d,i)
        ok=pred[j]==d.y[i]
        ax.set_title(f"{'✓' if ok else '✗'} {d.klassen[d.y[i]]}\nNetz: {d.klassen[pred[j]]} ({sure[j]:.0%})",fontsize=9,color='#176c63' if ok else '#b84d27')
    fig.suptitle(f'Alle {len(d.val)} Validierungsbilder · Variante {variante} · ✓ richtig, ✗ Fehler')
    plt.tight_layout();plt.show()
    unsicher=int(np.argmin(sure))
    print(f'{int(np.sum(pred==d.y[d.val]))} von {len(d.val)} richtig. Unsicherstes Bild: Nr. {unsicher} ({d.klassen[d.y[d.val[unsicher]]]}, Modellwert {sure[unsicher]:.0%}).')
    print('Keine Fehler: nicht erfinden. Auch dann Grenzen der Daten benennen.')


def vergleichen(daten, wiederholen=False):
    """Gleiche Bildzahl: A ein Exemplar, B zwei Exemplare pro Klasse."""
    ki.pruefe(len(daten.klassen)==2, 'Pflichtvergleich mit genau zwei Klassen.')
    return ki.experiment_starten(daten,weg='vielfalt',bilder_pro_klasse=8,
        wenige_personen=daten.train_personen[:1],neuronen=16,epochen=60,
        seeds=(11,22,33) if wiederholen else (11,))


def vergleich_zeigen(exp):
    import matplotlib.pyplot as plt
    runs=exp['laeufe'];n=len(exp['einstellungen']['seeds'])
    fig,ax=plt.subplots(figsize=(7,4))
    for i,name in enumerate(('A','B')):
        vals=[r['val']*100 for r in runs if r['variante']==name]
        ax.bar(i,np.mean(vals),color=('#176c63','#be572b')[i],width=.55)
        if n>1:ax.scatter(np.full(n,i),vals,c='black',zorder=3)
        ax.text(i,np.mean(vals)+3,f'{np.mean(vals):.1f} %',ha='center')
    ax.set(xticks=[0,1],xticklabels=['A: ein Exemplar','B: zwei Exemplare'],ylim=(0,110),
           ylabel='Richtige Vorhersagen (%)',title=f'Validierung · {len(exp["daten"].val)} Bilder · '+('ein Lauf' if n==1 else 'Mittelwert und einzelne Läufe'))
    ax.axhline(50,ls=':',c='#52656a');ax.text(.5,52,'Immer dieselbe Klasse: 50 %',ha='center',fontsize=9)
    plt.tight_layout();plt.show()
    print('Beide Varianten: 8 Trainingsbilder pro Klasse, dasselbe Netz und dieselben Einstellungen.')
    print('A: 8 Fotos aus T1. B: je 4 aus T1 und T2. Validierung: nur V1.')
    print('Ein Lauf und eine Validierungsgruppe: eine Beobachtung, kein Beweis allgemeiner Überlegenheit.')


def beispiele(exp, variante='B', test=False):
    """Maximal drei Fehler, ansonsten richtige Beispiele ausdrücklich als solche."""
    import matplotlib.pyplot as plt
    d=exp['daten']
    if test:
        ki.pruefe(exp['test'] is not None, 'Zuerst die Auswahl begründen und den Abschlusstest freigeben.')
        ki.pruefe(variante==exp['test']['variante'], 'Nach Testeinsicht nur die festgelegte Variante betrachten.')
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    ki.pruefe(bool(runs),'Variante A oder B wählen.')
    ids=d.test if test else d.val;pred=runs[0]['netz'].predict(d.X[ids])
    wrong=np.flatnonzero(pred!=d.y[ids]);right=np.flatnonzero(pred==d.y[ids])
    chosen=np.r_[wrong[:3],right[:max(0,3-len(wrong))]]
    fig,axes=plt.subplots(1,len(chosen),figsize=(8,3),squeeze=False)
    for ax,j in zip(axes[0],chosen):
        ki._bild_zeigen(ax,d,ids[j]);ax.axis('off')
        ax.set_title(f'{"✗ Fehler" if pred[j]!=d.y[ids[j]] else "✓ Richtig"}\nBild: {d.klassen[d.y[ids[j]]]}\nNetz: {d.klassen[pred[j]]}',fontsize=10)
    fig.suptitle(('Abschlusstest' if test else 'Validierung')+f' · Variante {variante} · erster festgelegter Lauf')
    plt.tight_layout();plt.show()
    print(f'{len(wrong)} Fehlvorhersagen von {len(ids)} Bildern. Gezeigt: zuerst Fehler, sonst richtige Beispiele.')
    print('Falls keine Fehler auftreten: Grenzen benennen, keine Fehler erfinden.')


def projekt_test(exp, variante='B', begruendung='', freigabe=False):
    result=ki.abschlusstest(exp,variante,begruendung,freigabe)
    if result is not None:beispiele(exp,variante,test=True)
    return result


def fremdtest(exp, eigene, variante=None):
    """Das nachtrainierte Modell eines anderen Tandems beurteilt die eigenen Klassen (C und D)."""
    import matplotlib.pyplot as plt
    fremd=exp['daten']
    ki.pruefe(len(eigene.klassen)==2 and len(fremd.klassen)==2,'Fremdtest mit je genau zwei Klassen.')
    if variante is None:variante=exp['test']['variante'] if exp.get('test') else 'B'
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    ki.pruefe(bool(runs),'Variante A oder B wählen.')
    netz=runs[0]['netz']
    probs=netz.predict_proba(eigene.X);pred=probs.argmax(axis=1);sicher=probs.max(axis=1)
    n=len(pred);M=np.array([[int(np.sum((eigene.y==c)&(pred==k))) for k in range(2)] for c in range(2)])
    gerade=M[0,0]+M[1,1];gekreuzt=M[0,1]+M[1,0]
    trenn=max(gerade,gekreuzt)/n;best=(0,1) if gerade>=gekreuzt else (1,0)
    farben=['#176c63','#be572b']
    fig,axes=plt.subplots(1,2,figsize=(13,3.8),gridspec_kw=dict(width_ratios=[1,1.7]))
    ax=axes[0]
    for c in range(2):
        anteil=M[c]/M[c].sum()*100
        ax.barh(c,anteil[0],color=farben[0]);ax.barh(c,anteil[1],left=anteil[0],color=farben[1])
        for k in range(2):
            if anteil[k]>=8:ax.text(anteil[:k].sum()+anteil[k]/2,c,f'{anteil[k]:.0f} %',ha='center',va='center',color='white',weight='bold')
    ax.set(yticks=[0,1],yticklabels=[f'Ihre Klasse\n{k}' for k in eigene.klassen],xlim=(0,100),xlabel='Vorhersage des fremden Modells (%)',
           title=f'{n} eigene Bilder · Modell «{variante}» des anderen Tandems')
    ax.invert_yaxis()
    ax.legend(handles=[plt.Rectangle((0,0),1,1,color=farben[k]) for k in range(2)],labels=[f'sagt «{k}»' for k in fremd.klassen],loc='lower center',bbox_to_anchor=(.5,-.5),ncol=2,fontsize=9)
    axes[1].axis('off');sub=axes[1].get_subplotspec().subgridspec(2,4,wspace=.05,hspace=.55)
    for c in range(2):
        ids=np.flatnonzero(eigene.y==c)[:4]
        for j,i in enumerate(ids):
            a=fig.add_subplot(sub[c,j]);a.imshow(eigene.bilder[i]);a.axis('off')
            a.set_title(f'{eigene.klassen[c]}\nModell: {fremd.klassen[pred[i]]} ({sicher[i]:.0%})',fontsize=8,color=farben[pred[i]])
    plt.tight_layout();plt.show()
    print(f'Fremdes Modell: {fremd.klassen[0]} oder {fremd.klassen[1]}. Ihre Klassen: {eigene.klassen[0]} und {eigene.klassen[1]}.')
    print('Zeile = Ihre Klasse, Spalte = Vorhersage des fremden Modells:')
    print(f'{"":14s}'+''.join(f'{"sagt "+k:>16s}' for k in fremd.klassen))
    for c in range(2):print(f'{eigene.klassen[c]:14s}'+''.join(f'{M[c,k]:16d}' for k in range(2)))
    print(f'Trennschärfe: {trenn:.0%} (Zuordnung {eigene.klassen[0]} → {fremd.klassen[best[0]]}, {eigene.klassen[1]} → {fremd.klassen[best[1]]}); Raten ergäbe etwa 50 %.')
    print(f'Mittlerer Modellwert: {sicher.mean():.0%}; {int(np.sum(sicher>=.9))} von {n} Bildern mit mindestens 90 %.')
    if trenn>=.9:print('Das fremde Modell trennt Ihre Klassen fast vollständig, obwohl es sie nie gelernt hat. Prüfen Sie, woran: Gegenstand, Form, Farbe, Hintergrund oder Licht?')
    elif trenn>=.65:print('Das fremde Modell trennt Ihre Klassen teilweise. Welche Bilder gehen schief, und was haben sie gemeinsam?')
    else:print('Das fremde Modell trennt Ihre Klassen kaum besser als Raten. Seine Merkmale taugen für Ihre Aufgabe nicht.')
    print('Das Modell kann nur zwischen seinen zwei Klassen wählen; «weder noch» kennt es nicht. Ein hoher Modellwert heisst nicht, dass es sich auskennt.')
    return dict(variante=variante,matrix=M,trennschaerfe=float(trenn),zuordnung=best,mittlerer_modellwert=float(sicher.mean()))
