"""Vorbereitete Werkzeuge für Lernlabor und Projektjournal (CPython / Pyodide).

Lernende bearbeiten Einstellungen und Interpretationen in den Notebooks.
Keine Datenübertragung; Netztraining vollständig auf dem jeweiligen Gerät.
"""
import base64
import copy
import hashlib
import html
import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import sklearn
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from IPython.display import HTML, display
import ipywidgets as widgets

VERSION = '3.0'


def pruefe(bedingung, meldung):
    if not bedingung:
        raise ValueError(meldung)


def download(text, name, mime='application/json'):
    payload = base64.b64encode(text.encode('utf-8')).decode('ascii')
    display(HTML(f'<a download="{html.escape(name)}" href="data:{mime};base64,{payload}">{html.escape(name)} herunterladen</a>'))


def symbolstudio():
    path = Path(__file__).with_name('symbolstudio.html')
    if path.exists():
        download(path.read_text(encoding='utf-8'), 'symbolstudio.html', 'text/html')
    else:
        print('symbolstudio.html aus dem Repository herunterladen und lokal im Browser öffnen.')


def daten_upload():
    uploader = widgets.FileUpload(accept='.json', multiple=True, description='JSON wählen')
    display(uploader)
    return uploader


def dateien_lesen(dateien=(), upload=None):
    docs = [json.loads(Path(p).read_text(encoding='utf-8')) for p in dateien]
    if upload is not None:
        values = upload.value.values() if isinstance(upload.value, dict) else upload.value
        docs += [json.loads(bytes(f['content']).decode('utf-8')) for f in values]
    pruefe(bool(docs), 'JSON-Dateien im Widget wählen oder ihre Namen in DATEIEN eintragen.')
    by_id = {}
    for doc in docs:
        pruefe(doc.get('schema') == 'symbolstudio-v1' and doc.get('size') == 16,
               'Bitte JSON-Dateien aus dem Symbolstudio verwenden.')
        for rec in doc.get('records', []):
            pruefe(all(k in rec for k in ['id', 'person', 'label', 'pixels']), 'Unvollständiger Zeichnungsdatensatz.')
            pruefe(all(isinstance(rec[k], str) and rec[k].strip() for k in ['id', 'person', 'label']),
                   'IDs, Personencodes und Klassen müssen nichtleere Texte sein.')
            if rec['id'] in by_id:
                pruefe(rec == by_id[rec['id']], 'Widersprüchliche Daten mit gleicher Zeichnungs-ID.')
            by_id[rec['id']] = rec
    return list(by_id.values())


@dataclass
class Daten:
    X: np.ndarray
    y: np.ndarray
    personen: np.ndarray
    ids: list
    klassen: list
    train_personen: tuple
    val_personen: tuple
    test_personen: tuple
    val: np.ndarray
    test: np.ndarray
    modus: str
    checksum: str
    test_verwendet: bool = False


def daten_laden(modus='DEMO', klassen=('Pfeil', 'Herz', 'Stern'),
                train=('P01', 'P02', 'P03', 'P04'), val=('P05', 'P06'),
                test=('P07', 'P08'), dateien=(), upload=None):
    pruefe(modus in ('DEMO', 'EIGENE_DATEN'), 'MODUS: DEMO oder EIGENE_DATEN.')
    records = demo_daten() if modus == 'DEMO' else dateien_lesen(dateien, upload)
    pruefe(2 <= len(klassen) <= 4 and len(set(klassen)) == len(klassen), '2–4 eindeutige Klassen wählen.')
    ausgewaehlt = [r for r in records if r['label'] in klassen]
    pruefe(bool(ausgewaehlt), 'Keine Zeichnungen für diese Klassen gefunden.')
    if len(ausgewaehlt) != len(records):
        print(len(records)-len(ausgewaehlt), 'Bilder anderer Klassen nicht verwendet.')
    records = sorted(ausgewaehlt, key=lambda r: r['id'])
    X = np.array([r['pixels'] for r in records], dtype=float)
    y = np.array([klassen.index(r['label']) for r in records])
    personen = np.array([r['person'] for r in records])
    pruefe(X.shape == (len(records), 256), 'Jedes Bild braucht 256 Pixelwerte.')
    pruefe(np.isfinite(X).all() and X.min() >= 0 and X.max() <= 1, 'Pixelwerte müssen zwischen 0 und 1 liegen.')
    pruefe(np.all(X.sum(axis=1) > 1), 'Leere Zeichnung gefunden.')
    hashes = [hashlib.sha256(row.tobytes()).hexdigest() for row in X]
    pruefe(len(set(hashes)) == len(hashes), 'Identische Bilder gefunden. Kopien vor der Untersuchung entfernen.')
    for gruppe in [train, val, test]:
        pruefe(len(gruppe) >= 2 and len(set(gruppe)) == len(gruppe), 'Je Gruppe mindestens zwei verschiedene Personen eintragen.')
        for p in gruppe:
            pruefe(set(y[personen == p]) == set(range(len(klassen))), f'{p}: Bilder für mindestens eine Klasse fehlen.')
    pruefe(set(train).isdisjoint(val) and set(train).isdisjoint(test) and set(val).isdisjoint(test),
           'Training, Validierung und Test müssen verschiedene Personen enthalten.')
    pruefe(len(train) >= 4, 'Für die drei Untersuchungswege mindestens vier Trainingspersonen verwenden.')
    checksum = hashlib.sha256(json.dumps(records, sort_keys=True).encode()).hexdigest()
    # Die eingelesenen Arrays bleiben innerhalb des Versuchs unverändert.
    for a in [X, y, personen]:
        a.flags.writeable = False
    d = Daten(X, y, personen, [r['id'] for r in records], list(klassen), tuple(train), tuple(val), tuple(test),
              np.flatnonzero(np.isin(personen, val)), np.flatnonzero(np.isin(personen, test)), modus, checksum)
    print(f'{modus}: {len(X)} Bilder; {len(klassen)} Klassen. Testvorhersagen noch nicht berechnet.')
    print('Person | ' + ' | '.join(klassen))
    for p in list(train)+list(val):
        print(p, '|', ' | '.join(str(int(np.sum((personen == p) & (y == c)))) for c in range(len(klassen))))
    return d


def daten_ansehen(d):
    fig, axes = plt.subplots(len(d.klassen), 5, figsize=(9, 2*len(d.klassen)), squeeze=False)
    for c, label in enumerate(d.klassen):
        pool = np.flatnonzero((d.y == c) & np.isin(d.personen, d.train_personen))
        ids = np.random.default_rng(4).choice(pool, min(5, len(pool)), replace=False)
        for ax in axes[c]:
            ax.axis('off')
        for ax, i in zip(axes[c], ids):
            _bild_zeigen(ax, d, i)
            ax.set_title(f'{label} · {d.personen[i]}', fontsize=9)
    fig.suptitle('Trainingsdaten' + (' · künstliche DEMO' if d.modus == 'DEMO' else ''))
    plt.tight_layout(); plt.show()


def _bild_zeigen(ax, d, i):
    if hasattr(d, 'bilder'):
        ax.imshow(d.bilder[i])
    else:
        ax.imshow(d.X[i].reshape(16, 16), cmap='gray_r', vmin=0, vmax=1)


def netz_zeigen(neuronen, klassen, eingaben=256):
    fig, ax = plt.subplots(figsize=(8, 2.5))
    for x, title, text in [(0.15, 'Eingabe', f'{eingaben} Eingabewerte'), (.5, 'Versteckte Schicht', f'{neuronen} Neuronen · ReLU'), (.85, 'Ausgabe', f'{len(klassen)} Klassen')]:
        ax.text(x, .65, title, ha='center', weight='bold', transform=ax.transAxes)
        ax.text(x, .4, text, ha='center', transform=ax.transAxes,
                bbox=dict(boxstyle='round,pad=.7', facecolor='#eaf1f8', edgecolor='#30628c'))
    for a,b in [(.28,.36),(.65,.73)]:
        ax.annotate('', xy=(b,.42), xytext=(a,.42), xycoords='axes fraction',
                    arrowprops=dict(arrowstyle='->', color='#30628c', lw=2))
    ax.axis('off');plt.tight_layout();plt.show()
    print((eingaben+1)*neuronen+(neuronen+1)*(1 if len(klassen)==2 else len(klassen)), 'trainierbare Gewichte und Biaswerte.')


def _auswahl(d, personen, anzahl, seed):
    pruefe(anzahl > 0 and anzahl % len(personen) == 0, 'Bildanzahl pro Klasse muss durch die Gruppenzahl teilbar sein.')
    rng = np.random.default_rng(seed)
    ids = []
    for p in personen:
        for c, label in enumerate(d.klassen):
            pool = np.flatnonzero((d.personen == p) & (d.y == c))
            n = anzahl // len(personen)
            pruefe(len(pool) >= n, f'{p}/{label}: {n} Bilder erforderlich, {len(pool)} vorhanden.')
            # Ein identischer Seed liefert für kleinere Mengen eine Teilmenge derselben Permutation.
            ids.extend(rng.permutation(pool)[:n])
    return np.array(ids)


def _trainieren(d, ids, neuronen, epochen, lernrate, seed):
    netz = MLPClassifier(hidden_layer_sizes=(neuronen,), activation='relu', solver='adam',
                         batch_size=min(24, len(ids)), learning_rate_init=lernrate,
                         alpha=.0001, random_state=seed)
    history = []
    for e in range(1, epochen+1):
        netz.partial_fit(d.X[ids], d.y[ids], classes=np.arange(len(d.klassen)))
        if e == 1 or e % 5 == 0 or e == epochen:
            history.append([e, netz.loss_, netz.score(d.X[ids], d.y[ids]), netz.score(d.X[d.val], d.y[d.val])])
    return netz, np.array(history)


def experiment_starten(d, weg='vielfalt', bilder_pro_klasse=24, neuronen=24,
                       mengen=(12,48), netzgroessen=(8,48), wenige_personen=None,
                       epochen=60, lernrate=.003, seeds=(11,22,33), daten_seed=2026):
    """Vorab definierte A/B-Vergleiche; keine Testauswertung oder automatische Auswahl."""
    pruefe(not d.test_verwendet, 'Abschlusstest bereits angesehen. Nicht mit denselben Testdaten weiter optimieren.')
    pruefe(weg in ['menge', 'vielfalt', 'netz', 'ausgang'], 'Weg: menge, vielfalt oder netz.')
    pruefe(1 <= neuronen <= 128 and 5 <= epochen <= 300 and 0 < lernrate <= .1, 'Netz-/Trainingseinstellungen ausserhalb des vorgesehenen Bereichs.')
    pruefe(len(seeds) >= (1 if weg == 'ausgang' else 3) and len(set(seeds)) == len(seeds), 'Mindestens drei verschiedene, vorher festgelegte Seeds verwenden.')
    few = tuple(wenige_personen or d.train_personen[:2])
    if weg == 'vielfalt':
        pruefe(len(set(few)) == len(few) and len(few) >= 2 and set(few) < set(d.train_personen), 'Wenige Datengruppen: mindestens zwei, echte Teilmenge der Trainingsgruppen.')
    if weg == 'menge':
        pruefe(len(mengen) == 2 and 0 < mengen[0] < mengen[1], 'Zwei aufsteigende Bildmengen wählen.')
        variants = [('A', d.train_personen, mengen[0], neuronen), ('B', d.train_personen, mengen[1], neuronen)]
    elif weg == 'netz':
        pruefe(len(netzgroessen) == 2 and 1 <= netzgroessen[0] < netzgroessen[1] <= 128, 'Zwei aufsteigende Netzgrössen (1–128) wählen.')
        variants = [('A', d.train_personen, bilder_pro_klasse, netzgroessen[0]), ('B', d.train_personen, bilder_pro_klasse, netzgroessen[1])]
    elif weg == 'vielfalt':
        variants = [('A', few, bilder_pro_klasse, neuronen), ('B', d.train_personen, bilder_pro_klasse, neuronen)]
    else:
        variants = [('A', d.train_personen, bilder_pro_klasse, neuronen)]
    settings = dict(weg=weg, epochen=epochen, lernrate=lernrate, seeds=list(seeds), daten_seed=daten_seed,
                    varianten=[dict(name=n, personen=list(p), bilder_pro_klasse=b, neuronen=h) for n,p,b,h in variants])
    result = dict(daten=d, einstellungen=copy.deepcopy(settings), laeufe=[], test=None)
    for seed in seeds:
        for name, personen, anzahl, h in variants:
            ids = _auswahl(d, personen, anzahl, daten_seed+seed)
            model, history = _trainieren(d, ids, h, epochen, lernrate, seed)
            majority = Counter(d.y[ids]).most_common(1)[0][0]
            result['laeufe'].append(dict(variante=name, seed=seed, ids=ids, netz=model, verlauf=history,
                                        train=float(model.score(d.X[ids],d.y[ids])),
                                        val=float(model.score(d.X[d.val],d.y[d.val])),
                                        baseline=float(np.mean(d.y[d.val] == majority))))
    return result


def ausgangsmodell(d):
    return experiment_starten(d, weg='ausgang', seeds=(11,))


def ergebnisse_zeigen(exp):
    d = exp['daten'];runs=exp['laeufe']
    names = list(dict.fromkeys(r['variante'] for r in runs))
    print(d.modus, '·', exp['einstellungen']['weg'], '· Validierung:', len(d.val), 'Bilder /', len(d.val_personen), 'Datengruppen')
    print('Variante | Lauf | Trainingsbilder | Training | Validierung')
    for r in runs:
        print(f'{r["variante"]} | {r["seed"]} | {len(r["ids"])} | {r["train"]:.1%} | {r["val"]:.1%}')
    fig,axes=plt.subplots(1,2,figsize=(11,4))
    for pos,name in enumerate(names):
        color=['#2563a6','#bd5e20'][pos]
        selected=[r for r in runs if r['variante']==name]
        v=selected[0]['verlauf']
        axes[0].plot(v[:,0],v[:,2]*100,'--',color=color,label=f'{name} Training')
        axes[0].plot(v[:,0],v[:,3]*100,'-',color=color,label=f'{name} Validierung')
        vals=np.array([r['val'] for r in selected])*100
        axes[1].bar(pos, vals.mean(),width=.5,color=color,alpha=.55)
        axes[1].scatter(pos+np.linspace(-.1,.1,len(vals)),vals,color=color,edgecolor='black',zorder=3)
        axes[1].text(pos,vals.mean()+3,f'{vals.mean():.1f} %',ha='center')
    axes[0].set(xlabel='Epoche',ylabel='Richtige Vorhersagen (%)',ylim=(0,110),title='Lernverlauf · erster festgelegter Lauf')
    axes[0].legend(fontsize=9)
    axes[1].axhline(runs[0]['baseline']*100,ls=':',color='#444',label=f'Mehrheitsklasse: {runs[0]["baseline"]:.1%}')
    axes[1].set(xticks=range(len(names)),xticklabels=names,ylabel='Validierungsgenauigkeit (%)',ylim=(0,110),title='Mittelwert und einzelne Läufe')
    axes[1].legend(fontsize=9)
    plt.tight_layout();plt.show()
    if len(names)==2:
        for seed in exp['einstellungen']['seeds']:
            vals={r['variante']:r['val'] for r in runs if r['seed']==seed}
            print(f'Lauf {seed}: B minus A = {(vals["B"]-vals["A"])*100:+.1f} Prozentpunkte')


def fehler_zeigen(exp, variante='A'):
    d=exp['daten']
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    pruefe(bool(runs), 'Variante A oder B wählen.')
    model=runs[0]['netz'];pred=model.predict(d.X[d.val])
    fig,ax=plt.subplots(figsize=(6,5))
    ConfusionMatrixDisplay(confusion_matrix(d.y[d.val],pred,labels=np.arange(len(d.klassen))),display_labels=d.klassen).plot(ax=ax,cmap='Blues',colorbar=False)
    ax.set(xlabel='Vorhergesagt',ylabel='Tatsächlich',title=f'Validierung · {variante} · erster Lauf')
    plt.tight_layout();plt.show()
    wrong=d.val[pred!=d.y[d.val]][:6]
    if not len(wrong):
        print('Keine Validierungsfehler in diesem Lauf. Kein Beweis allgemeiner Fehlerfreiheit.');return
    fig,axes=plt.subplots(1,len(wrong),figsize=(2.4*len(wrong),2.8),squeeze=False)
    for ax,i in zip(axes[0],wrong):
        probs=model.predict_proba(d.X[i:i+1])[0];guess=int(np.argmax(probs))
        _bild_zeigen(ax, d, i)
        ax.set_title(f'Wahr: {d.klassen[d.y[i]]}\nNetz: {d.klassen[guess]}\nModellwert: {probs[guess]:.0%}',fontsize=9);ax.axis('off')
    plt.tight_layout();plt.show()


def abschlusstest(exp, variante='B', begruendung='', freigabe=False):
    if not freigabe:
        print('Abschlusstest bleibt gesperrt. Erst auswählen und begründen.');return None
    pruefe(exp['einstellungen']['weg'] != 'ausgang', 'Zuerst eine Untersuchung durchführen.')
    pruefe(len(begruendung.strip()) >= 30, 'Auswahl mit den Validierungsergebnissen begründen.')
    runs=[r for r in exp['laeufe'] if r['variante']==variante]
    pruefe(bool(runs), 'Variante A oder B auswählen.')
    d=exp['daten']
    if exp['test'] is not None:
        pruefe(exp['test']['variante']==variante and exp['test']['begruendung']==begruendung,
               'Auswahl nach Testeinsicht nicht ändern.')
        print('Bereits gespeichertes Testergebnis:',exp['test']);return exp['test']
    pruefe(not d.test_verwendet, 'Dieser Datensatz wurde bereits in einem anderen Abschlusstest verwendet.')
    scores=[float(r['netz'].score(d.X[d.test],d.y[d.test])) for r in runs]
    result=dict(variante=variante, begruendung=begruendung, scores=scores, mittelwert=float(np.mean(scores)),
                n_bilder=len(d.test), personen=list(d.test_personen))
    exp['test']=result;d.test_verwendet=True
    print(d.modus,'· Abschlusstest:',len(d.test),'Bilder von',len(d.test_personen),'Datengruppen')
    for r,s in zip(runs,scores):print(f'Lauf {r["seed"]}: {s:.1%}')
    print(f'Mittelwert: {np.mean(scores):.1%}; Spanne: {min(scores):.1%}–{max(scores):.1%}')
    fig,ax=plt.subplots(figsize=(6,5))
    pred=runs[0]['netz'].predict(d.X[d.test])
    ConfusionMatrixDisplay(confusion_matrix(d.y[d.test],pred,labels=np.arange(len(d.klassen))),display_labels=d.klassen).plot(ax=ax,cmap='Blues',colorbar=False)
    ax.set(xlabel='Vorhergesagt',ylabel='Tatsächlich',title='Abschlusstest · erster festgelegter Lauf')
    plt.tight_layout();plt.show()
    return result


def protokoll(exp, export=True):
    d=exp['daten']
    result=dict(tool_version=VERSION, numpy=np.__version__, sklearn=sklearn.__version__,
                modus=d.modus, klassen=d.klassen, daten_sha256=d.checksum,
                vorverarbeitung=copy.deepcopy(getattr(d, 'provenienz', {'pipeline':'symbolstudio-v1'})),
                einstellungen=copy.deepcopy(exp['einstellungen']),
                gruppen=dict(train=list(d.train_personen),val=list(d.val_personen),test=list(d.test_personen)),
                validierung_ids=[d.ids[i] for i in d.val], test_ids=[d.ids[i] for i in d.test],
                laeufe=[dict(variante=r['variante'],seed=r['seed'],train=r['train'],val=r['val'],
                             baseline=r['baseline'],training_ids=[d.ids[i] for i in r['ids']]) for r in exp['laeufe']],
                abschlusstest=copy.deepcopy(exp['test']))
    if export:download(json.dumps(result,ensure_ascii=False,indent=2),'Versuchsprotokoll.json')
    return result


def demo_daten():
    # Künstliche Symbolzeichnungen mit personenspezifischen Drehungen/Positionen.
    # Keine echten Personen, keine empirische Aussage über Handschriften.
    rng = np.random.default_rng(42)
    t = np.linspace(0, 2*np.pi, 100)
    herz = np.c_[16*np.sin(t)**3, -(13*np.cos(t)-5*np.cos(2*t)-2*np.cos(3*t)-np.cos(4*t))]/20
    a = np.arange(11)*np.pi/5 - np.pi/2
    r = np.where(np.arange(11)%2 == 0, .9, .4)
    stern = np.c_[r*np.cos(a), r*np.sin(a)]
    pfeil = np.array([[-.8,.3],[.2,.3],[.2,.7],[.9,0],[.2,-.7],[.2,-.3],[-.8,-.3],[-.8,.3]])
    formen = {'Pfeil':pfeil, 'Herz':herz, 'Stern':stern}
    yy,xx = np.mgrid[-1.3:1.3:16j,-1.3:1.3:16j]
    records=[]
    for person in range(8):
        for label, points in formen.items():
            for k in range(15):
                winkel = (person-3.5)*.07 + rng.normal(0,.06)
                rot = np.array([[np.cos(winkel),-np.sin(winkel)],[np.sin(winkel),np.cos(winkel)]])
                pts = points @ rot * rng.uniform(.8,1.0) + rng.normal(0,.07,2)
                dist = np.full((16,16), np.inf)
                for start,end in zip(pts[:-1],pts[1:]):
                    for u in np.linspace(0,1,15):
                        q = start*(1-u)+end*u
                        dist = np.minimum(dist, (xx-q[0])**2+(yy-q[1])**2)
                pixels=np.exp(-dist/(2*(.06+person*.006)**2)).ravel()
                records.append(dict(id=f'demo-{person}-{label}-{k}', person=f'P{person+1:02}',label=label,pixels=pixels.tolist()))
    return records
