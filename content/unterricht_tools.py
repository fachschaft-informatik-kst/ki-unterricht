"""Darstellungen für den Pflichtweg. CPython und JupyterLite/Pyodide.
Der Code ist für Interessierte einsehbar; Lernende ändern nur die Notebook-Einstellungen.
"""
import numpy as np
import matplotlib.pyplot as plt
import ipywidgets as widgets
from IPython.display import display

FARBEN = ['#176c63', '#be572b']

def _punkte(ax, X, y):
    for c, (farbe, marker) in enumerate(zip(FARBEN, ['o', '^'])):
        ax.scatter(X[y == c, 0], X[y == c, 1], c=farbe, marker=marker,
                   s=110, edgecolors='white', label=f'Klasse {c}')
    ax.set(xlim=(-.4, 1.4), ylim=(-.4, 1.4), xlabel='Eingang 1', ylabel='Eingang 2')
    ax.legend(loc='upper left'); ax.grid(alpha=.15)


def perzeptron(w1=1., w2=1., bias=-1.5, aufgabe='AND'):
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([0, 0, 0, 1]) if aufgabe == 'AND' else np.array([0, 1, 1, 0])
    z = X @ [w1, w2] + bias
    fig, ax = plt.subplots(figsize=(6, 4)); _punkte(ax, X, y)
    if abs(w2) > 1e-10:
        x = np.array([-.4, 1.4]); ax.plot(x, -(w1*x+bias)/w2, color='#263b43')
    elif abs(w1) > 1e-10:
        ax.axvline(-bias/w1, color='#263b43')
    pred = (z >= 0).astype(int)
    ax.set_title(f'{aufgabe}: {np.sum(pred == y)} von 4 richtig · Ausgabe 1 bei Summe ≥ 0')
    plt.tight_layout(); plt.show()
    print('Eingaben → gewichtete Summe → Ausgabe (Ziel)')
    for x, s, p, target in zip(X, z, pred, y):
        print(f'{tuple(x)} → {s:.1f} → {p} ({target})')
    return pred


def regler_perzeptron():
    return widgets.interact(perzeptron,
        w1=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 1'),
        w2=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 2'),
        bias=widgets.FloatSlider(value=-1.5, min=-3, max=2, step=.5, description='Bias'),
        aufgabe=widgets.Dropdown(options=['AND', 'XOR'], description='Aufgabe'))


def lernschritt():
    x=np.array([1.,1.]); w=np.array([.2,.2]); b=-.5; ziel=1; rate=.2
    vorher=int(w@x+b>=0); fehler=ziel-vorher
    neu=w+rate*fehler*x; neuer_bias=b+rate*fehler
    print('Eingabe (1, 1), Ziel 1. Start: Gewichte 0.2 / 0.2, Bias −0.5.')
    print(f'Vorher: Summe {w@x+b:.1f} → Ausgabe {vorher}.')
    print('Korrektur: 0.2 × (Ziel − Ausgabe) × Eingang. Bias-Eingang ist 1.')
    print(f'Nachher: Gewichte {neu[0]:.1f} / {neu[1]:.1f}, Bias {neuer_bias:.1f}.')
    print(f'Neue Summe {neu@x+neuer_bias:.1f} → Ausgabe {int(neu@x+neuer_bias>=0)}.')
    print('Ein korrigiertes Beispiel bedeutet noch nicht, dass alle Beispiele richtig sind.')


def xor_netz():
    X=np.array([[0,0],[0,1],[1,0],[1,1]])
    h1=(X.sum(axis=1)-.5>=0).astype(int)   # OR
    h2=(-X.sum(axis=1)+1.5>=0).astype(int) # NAND
    y=(h1+h2-1.5>=0).astype(int)           # AND
    fig,axes=plt.subplots(1,2,figsize=(9,3.6))
    _punkte(axes[0],X,y)
    xx=np.array([-.4,1.4]);axes[0].plot(xx,.5-xx,color='#526fa0');axes[0].plot(xx,1.5-xx,color='#526fa0')
    axes[0].set_title('Zwei Zwischenergebnisse statt einer Linie')
    axes[1].axis('off')
    for pos,title in [(.1,'2 Eingaben'),(.5,'OR + NAND'),(.9,'AND')]:
        axes[1].text(pos,.55,title,ha='center',bbox=dict(boxstyle='round,pad=.5',fc='#e7f1eb'))
    for a,b in [(.22,.35),(.67,.81)]:axes[1].annotate('',xy=(b,.57),xytext=(a,.57),arrowprops=dict(arrowstyle='->'))
    axes[1].set_title('Kleines, von uns konstruiertes Netz')
    plt.tight_layout();plt.show()
    print('Eingabe | OR | NAND | Ausgabe XOR')
    for x,a,b,c in zip(X,h1,h2,y): print(tuple(x),'|',a,'|',b,'|',c)
    return y


def logik_ausgaben(regel='XOR'):
    X=np.array([[0,0],[0,1],[1,0],[1,1]])
    anzahl=X.sum(axis=1)
    regeln={
        'UND (AND)': anzahl==2,
        'ODER (OR)': anzahl>=1,
        'NAND': anzahl<2,
        'XOR': anzahl==1,
    }
    if regel not in regeln:
        raise ValueError(f'Unbekannte Regel: {regel}')
    return regeln[regel].astype(int)


def logik_gatter(regel='XOR'):
    X=np.array([[0,0],[0,1],[1,0],[1,1]])
    y=logik_ausgaben(regel)
    fig,ax=plt.subplots(figsize=(5,4))
    _punkte(ax,X,y)
    for (x1,x2),ausgabe in zip(X,y):
        ax.annotate(str(ausgabe),(x1,x2),xytext=(7,7),textcoords='offset points',weight='bold')
    ax.set(xticks=[0,1],yticks=[0,1],title=f'{regel}: Ausgabe für jede Eingabe')
    plt.tight_layout();plt.show()
    print('Eingabe 1 | Eingang 2 | Ausgabe')
    for (x1,x2),ausgabe in zip(X,y): print(f'{x1}         | {x2}         | {ausgabe}')
    return y


def regler_logik():
    return widgets.interact(logik_gatter,
        regel=widgets.Dropdown(options=['UND (AND)','ODER (OR)','NAND','XOR'],description='Regel'))


def datenplan(leck=False):
    fig,ax=plt.subplots(figsize=(9,3));ax.axis('off')
    for x,title,gruppen,color in [(0,'TRAINING\nGewichte lernen','T1 + T2','#e7f1eb'),(1,'VALIDIERUNG\nVariante auswählen','V1','#e6edf9'),(2,'TEST\neinmal, am Ende','P1 + P2','#fff0e7')]:
        ax.text(x,.72,title,ha='center',fontsize=11,weight='bold')
        ax.text(x,.4,gruppen,ha='center',fontsize=22,bbox=dict(boxstyle='round,pad=.6',fc=color))
    ax.set(xlim=(-.55,2.55),ylim=(0,1))
    if leck:ax.annotate('Dasselbe Objekt erneut fotografiert: Datenleck!',xy=(2,.25),xytext=(0,.05),arrowprops=dict(arrowstyle='->',color='#b84d27'),color='#b84d27')
    plt.tight_layout();plt.show()
    print('Jede Gruppe enthält ein anderes Exemplar jeder Klasse; bei Gesten eine andere Person.')
    print('Ein neues Foto desselben Gegenstands ist kein neues Exemplar.')


def _ziffern_daten():
    from sklearn.datasets import load_digits
    from sklearn.model_selection import train_test_split
    X, y = load_digits(return_X_y=True)
    X = X / 16  # feste Skalierung, nichts wird an Validierungsdaten angepasst
    train, val = train_test_split(np.arange(len(y)), test_size=.3, stratify=y, random_state=11)
    return X, y, train, val


def _ziffern_netz(X, y, ids, neuronen, max_iter=100):
    import warnings
    from sklearn.exceptions import ConvergenceWarning
    from sklearn.neural_network import MLPClassifier
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', ConvergenceWarning)
        return MLPClassifier(hidden_layer_sizes=(neuronen,), max_iter=max_iter, random_state=11).fit(X[ids], y[ids])


def _ziffer_titel(ax, X, y, i, guess, sicherheit):
    ax.imshow(X[i].reshape(8, 8), cmap='gray_r'); ax.axis('off')
    ok = guess == y[i]
    ax.set_title(f"{'✓' if ok else '✗'} Bild: {y[i]}\nNetz: {guess} ({sicherheit:.0%})", fontsize=9, color='#176c63' if ok else '#b84d27')


def ziffern(neuronen=16):
    """Netz mit einer versteckten Schicht erkennt handgeschriebene Ziffern (8 × 8 Pixel)."""
    X, y, train, val = _ziffern_daten()
    netz = _ziffern_netz(X, y, train, neuronen)
    probs = netz.predict_proba(X[val]); pred = netz.classes_[probs.argmax(axis=1)]; sicher = probs.max(axis=1)
    fig, axes = plt.subplots(2, 10, figsize=(14, 4.4), squeeze=False)
    for ax in axes.ravel(): ax.axis('off')
    for d in range(10):
        ok = np.flatnonzero((y[val] == d) & (pred == d))
        if len(ok): _ziffer_titel(axes[0][d], X, y, val[ok[0]], d, sicher[ok[0]])
    wrong = np.flatnonzero(pred != y[val])
    for ax, j in zip(axes[1], wrong[:10]): _ziffer_titel(ax, X, y, val[j], pred[j], sicher[j])
    richtig = int(np.sum(pred == y[val]))
    fig.suptitle(f'{neuronen} Neuronen · Validierung: {richtig / len(val):.0%} richtig ({richtig} von {len(val)} neuen Bildern)')
    fig.text(.005, .72, 'richtige Beispiele', rotation=90, va='center', fontsize=9)
    fig.text(.005, .27, 'Fehler' if len(wrong) else 'keine Fehler', rotation=90, va='center', fontsize=9)
    plt.tight_layout(rect=(.02, 0, 1, .93)); plt.show()
    print(f'Oben je Ziffer ein richtig erkanntes Bild (Zahl in Klammern: Modellwert). Unten die ersten Fehler von {len(wrong)}.')
    print('Die Validierungsbilder dienen zum Vergleichen; sie sind kein unabhängiger Abschlusstest.')
    return netz


def ziffer_durchs_netz(netz, nr=0):
    """Ein Validierungsbild: 64 Eingaben, Neuronen der versteckten Schicht, Modellwert je Ziffer."""
    X, y, train, val = _ziffern_daten()
    if not 0 <= nr < len(val): raise ValueError(f'nr: Zahl von 0 bis {len(val) - 1}.')
    i = val[nr]
    versteckt = np.maximum(0, X[i] @ netz.coefs_[0] + netz.intercepts_[0])  # ReLU
    probs = netz.predict_proba(X[i:i + 1])[0]; guess = int(netz.classes_[probs.argmax()])
    fig, axes = plt.subplots(1, 3, figsize=(12, 3.2), gridspec_kw=dict(width_ratios=[1, 2, 2]))
    axes[0].imshow(X[i].reshape(8, 8), cmap='gray_r'); axes[0].axis('off')
    axes[0].set_title('1 · Eingabe: 64 Pixelwerte', fontsize=10)
    axes[1].bar(range(len(versteckt)), versteckt, color='#526fa0')
    axes[1].set(xlabel='Neuron', ylabel='Ausgabe', title=f'2 · Versteckte Schicht: {len(versteckt)} Neuronen')
    axes[2].bar(netz.classes_, probs * 100, color=['#176c63' if c == guess else '#c9d3d6' for c in netz.classes_])
    axes[2].set(xticks=range(10), xlabel='Ziffer', ylabel='Modellwert (%)', ylim=(0, 105), title='3 · Ausgabe: Wert je Ziffer')
    plt.tight_layout(); plt.show()
    print(f'Bild {nr}: tatsächlich {y[i]} · Netz: {guess} ({probs.max():.0%}) · ' + ('richtig' if guess == y[i] else 'Fehler'))
    print('Neuronen mit Wert 0 sind für dieses Bild «still». Jedes Neuron reagiert auf ein anderes Muster.')


def neuron_ziffern(ziffer_a=0, ziffer_b=1):
    """Ein einziges Perzeptron trennt zwei Ziffern; die 64 Gewichte werden als Bild gezeigt."""
    from sklearn.linear_model import Perceptron
    if ziffer_a == ziffer_b or not all(z in range(10) for z in (ziffer_a, ziffer_b)):
        raise ValueError('Zwei verschiedene Ziffern von 0 bis 9 wählen.')
    X, y, train, val = _ziffern_daten()
    m = np.isin(y, [ziffer_a, ziffer_b]); t = train[m[train]]; v = val[m[val]]
    ziel = y == ziffer_b
    neuron = Perceptron(max_iter=100, tol=None, random_state=11).fit(X[t], ziel[t])
    w = neuron.coef_[0]; b = float(neuron.intercept_[0])
    summe = X[v] @ w + b; pred = summe >= 0
    fig = plt.figure(figsize=(12, 4.2)); gs = fig.add_gridspec(2, 6)
    ax = fig.add_subplot(gs[:, 0:2]); grenze = np.abs(w).max()
    ax.imshow(w.reshape(8, 8), cmap='coolwarm', vmin=-grenze, vmax=grenze); ax.axis('off')
    ax.set_title(f'64 Gewichte\nrot: spricht für {ziffer_b} · blau: für {ziffer_a}', fontsize=10)
    for r, ziffer in enumerate((ziffer_a, ziffer_b)):
        for c, k in enumerate(np.flatnonzero(y[v] == ziffer)[:4]):
            ax = fig.add_subplot(gs[r, 2 + c]); guess = ziffer_b if pred[k] else ziffer_a
            ax.imshow(X[v[k]].reshape(8, 8), cmap='gray_r'); ax.axis('off')
            ax.set_title(f"{'✓' if guess == ziffer else '✗'} Summe {summe[k]:+.1f}\n→ {guess}", fontsize=9, color='#176c63' if guess == ziffer else '#b84d27')
    fig.suptitle(f'Ein Neuron: {ziffer_a} oder {ziffer_b}? Summe ≥ 0 bedeutet {ziffer_b}')
    plt.tight_layout(); plt.show()
    print(f'Training: {neuron.score(X[t], ziel[t]):.0%} richtig · neue Bilder: {np.mean(pred == ziel[v]):.0%} richtig ({len(v)} Bilder).')
    print('Summe = Σ Pixel × Gewicht + Bias, wie bei AND und OR, nur mit 64 statt 2 Eingaben.')


def drei_rollen(trainingsbilder=100, neuronen=16):
    """Dasselbe Netz auf Trainings-, Validierungs- und Testbildern (Ziffern)."""
    X, y, pool, test = _ziffern_daten()
    if not 20 <= trainingsbilder <= 600: raise ValueError('trainingsbilder: Zahl von 20 bis 600.')
    p = np.random.default_rng(1).permutation(pool)
    t, v = p[:trainingsbilder], p[-100:]  # Validierung: 100 Bilder, nie im Training
    netz = _ziffern_netz(X, y, t, neuronen, max_iter=300)
    werte = [netz.score(X[t], y[t]), netz.score(X[v], y[v]), netz.score(X[test], y[test])]
    probs = netz.predict_proba(X[test]); pred = netz.classes_[probs.argmax(axis=1)]; sicher = probs.max(axis=1)
    wrong = np.flatnonzero(pred != y[test]); right = np.flatnonzero(pred == y[test])
    zeigen = np.r_[wrong[:4], right[:8 - min(4, len(wrong))]]
    fig = plt.figure(figsize=(12, 4.2)); gs = fig.add_gridspec(2, 6)
    ax = fig.add_subplot(gs[:, 0:2])
    ax.bar(range(3), np.array(werte) * 100, color=['#9aa9ad', '#526fa0', '#176c63'], width=.6)
    for k, w in enumerate(werte): ax.text(k, w * 100 + 2, f'{w:.0%}', ha='center')
    ax.set(xticks=range(3), xticklabels=['Training\n(bekannt)', 'Validierung\n(zum Wählen)', 'Test\n(einmal, am Ende)'],
           ylim=(0, 110), ylabel='Richtig (%)')
    for k, j in enumerate(zeigen):
        a = fig.add_subplot(gs[k // 4, 2 + k % 4]); _ziffer_titel(a, X, y, test[j], pred[j], sicher[j])
    fig.suptitle(f'Training mit {trainingsbilder} Bildern · Beispiele aus dem Test (Fehler zuerst, sonst richtig)')
    plt.tight_layout(); plt.show()
    print(f'Training {werte[0]:.0%} · Validierung {werte[1]:.0%} (100 Bilder) · Test {werte[2]:.0%} ({len(test)} Bilder, {len(wrong)} Fehler).')
    print('Training ist fast immer hoch: Diese Bilder kennt das Netz. Nur Validierung und Test sind neue Bilder.')
    print('Achtung: Auch die neuen Bilder stammen von denselben Schreibern. Bei Fotos wäre das ein Datenleck, hier ein leichter Test.')
