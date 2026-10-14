"""Darstellungen für den Pflichtweg. CPython und JupyterLite/Pyodide.
Der Code ist für Interessierte einsehbar; Lernende ändern nur die Notebook-Einstellungen.
"""
import numpy as np
import matplotlib.pyplot as plt
import ipywidgets as widgets
from IPython.display import display

FARBEN = ['#176c63', '#be572b']
FARBEN_HELL = ['#d7ebe3', '#f3dfd3']

def _punkte(ax, X, y):
    for c, (farbe, marker) in enumerate(zip(FARBEN, ['o', '^'])):
        ax.scatter(X[y == c, 0], X[y == c, 1], c=farbe, marker=marker,
                   s=110, edgecolors='white', label=f'Klasse {c}')
    ax.set(xlim=(-.4, 1.4), ylim=(-.4, 1.4), xlabel='Eingang 1', ylabel='Eingang 2')
    ax.legend(loc='upper left'); ax.grid(alpha=.15)


_EINGABEN = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
_ZIELE = {'AND': [0, 0, 0, 1], 'OR': [0, 1, 1, 1], 'NAND': [1, 1, 1, 0], 'NOR': [1, 0, 0, 0], 'XOR': [0, 1, 1, 0]}


def _t(x):
    return tuple(int(v) for v in x)


def _grenze(ax, w1, w2, bias, **stil):
    if abs(w2) > 1e-10:
        x = np.array([-.4, 1.4]); ax.plot(x, -(w1 * x + bias) / w2, **stil)
    elif abs(w1) > 1e-10:
        ax.axvline(-bias / w1, **stil)


def neuron_zeigen(x1=1, x2=1, w1=1., w2=1., bias=-1.5):
    """Ein künstliches Neuron mit konkreten Zahlen: Eingaben, Gewichte, Summe, Bias, Ausgabe."""
    summe = x1 * w1 + x2 * w2; gesamt = summe + bias; feuert = gesamt >= 0
    fig, ax = plt.subplots(figsize=(9, 3.8)); ax.axis('off'); ax.set(xlim=(0, 10), ylim=(0, 5))
    for y, name, x, w in [(3.7, 'x₁', x1, w1), (1.3, 'x₂', x2, w2)]:
        ax.add_patch(plt.Circle((.9, y), .6, fc='#eaf1f8', ec='#30628c'))
        ax.text(.9, y, f'{name}\n{x:g}', ha='center', va='center', fontsize=10)
        ende = 2.5 + (y - 2.5) * .3
        ax.annotate('', xy=(5.3, ende), xytext=(1.5, y), arrowprops=dict(arrowstyle='->', lw=1 + abs(w), color='#be572b' if w < 0 else '#176c63'))
        ax.text(3.4, (y + ende) / 2 + (.3 if y > 2.5 else -.3), f'Gewicht {w:g}', ha='center', fontsize=9)
    ax.add_patch(plt.Circle((6.2, 2.5), .9, fc='#cfe8dc' if feuert else '#e3e6e8', ec='#263b43', lw=2))
    ax.text(6.2, 2.5, f'Σ + b\n{gesamt:g}', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(6.2, 4.0, f'Bias b = {bias:g}', ha='center', fontsize=10, color='#52656a')
    ax.annotate('', xy=(9.0, 2.5), xytext=(7.1, 2.5), arrowprops=dict(arrowstyle='->', lw=2))
    ax.text(9.5, 2.5, f'y = {int(feuert)}', ha='center', va='center', fontsize=13, weight='bold', color='#176c63' if feuert else '#52656a')
    ax.text(5, .35, f'Σ = {x1:g}·{w1:g} + {x2:g}·{w2:g} = {summe:g}   ·   {summe:g} + ({bias:g}) = {gesamt:g}   ·   '
            + (f'{gesamt:g} ≥ 0: das Neuron «feuert»' if feuert else f'{gesamt:g} < 0: das Neuron feuert nicht'), ha='center', fontsize=9.5)
    plt.tight_layout(); plt.show()
    print(f'Schwelle s = −Bias = {-bias:g}: Das Neuron feuert, wenn die gewichtete Summe Σ = {summe:g} mindestens {-bias:g} erreicht.')
    return int(feuert)


def neuron_vergleich():
    """Nervenzelle und künstliches Neuron nebeneinander; gleiche Nummern bezeichnen gleiche Aufgaben."""
    farben = ['#526fa0', '#be572b', '#176c63', '#8a6bb0', '#52656a']
    def marke(ax, x, y, n):
        ax.text(x, y, str(n), ha='center', va='center', fontsize=10, color='white', weight='bold',
                bbox=dict(boxstyle='circle,pad=.25', fc=farben[n - 1], ec='none'))
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.4))
    for ax in axes:
        ax.axis('off'); ax.set(xlim=(0, 10), ylim=(0, 6.4))
    ys = (5, 3, 1)
    ax = axes[0]; ax.set_title('Nervenzelle (stark vereinfacht)')
    for y, groesse in zip(ys, (9, 17, 5)):
        ende = 3 + (y - 3) * .2
        ax.plot([.3, 3.7], [y, ende], color='#8d9aa0', lw=1.5)
        ax.plot([.3 + .25 * 3.4], [y + .25 * (ende - y)], 'o', color='#be572b', ms=groesse)
    ax.add_patch(plt.Circle((4.5, 3), .85, fc='#e3e6e8', ec='#263b43', lw=2))
    ax.plot([5.35, 8.6], [3, 3], color='#263b43', lw=3)
    for dy in (-.9, 0, .9):
        ax.plot([8.6, 9.5], [3, 3 + dy], color='#263b43', lw=1.5); ax.plot([9.5], [3 + dy], 'o', color='#263b43', ms=5)
    ax.text(4.5, 3, 'Zellkörper', ha='center', va='center', fontsize=8)
    ax.text(5.0, 6.0, 'Impuls ganz oder gar nicht', ha='center', fontsize=8, color='#52656a')
    ax.text(1.2, 6.0, 'Reize anderer Zellen', ha='center', fontsize=8, color='#52656a')
    for n, (x, y) in {1: (.3, 5.7), 2: (1.15, 4.5), 3: (4.5, 4.2), 4: (4.5, 1.7), 5: (7, 3.6)}.items(): marke(ax, x, y, n)
    ax = axes[1]; ax.set_title('Künstliches Neuron')
    for y, nr, lw in zip(ys, ('x₁', 'x₂', 'x₃'), (1.5, 4, .8)):
        ende = 3 + (y - 3) * .2
        ax.add_patch(plt.Circle((.5, y), .4, fc='#eaf1f8', ec='#30628c')); ax.text(.5, y, nr, ha='center', va='center', fontsize=9)
        ax.annotate('', xy=(3.7, ende), xytext=(.9, y), arrowprops=dict(arrowstyle='->', lw=lw, color='#be572b'))
    ax.text(1.9, 3.95, 'w₁', fontsize=9, color='#be572b'); ax.text(1.9, 3.2, 'w₂', fontsize=9, color='#be572b'); ax.text(1.9, 1.95, 'w₃', fontsize=9, color='#be572b')
    ax.add_patch(plt.Circle((4.5, 3), .85, fc='#cfe8dc', ec='#263b43', lw=2))
    ax.text(4.5, 3, 'Σ', ha='center', va='center', fontsize=14, weight='bold')
    ax.annotate('', xy=(8.6, 3), xytext=(5.4, 3), arrowprops=dict(arrowstyle='->', lw=2))
    ax.text(9.2, 3, 'y', fontsize=13, ha='center', va='center')
    ax.text(5.0, 6.0, 'Ausgabe 1 oder 0', ha='center', fontsize=8, color='#52656a')
    ax.text(4.5, 1.0, 'Schwelle s\n(Bias b = −s)', ha='center', fontsize=8, color='#52656a')
    ax.text(1.2, 6.0, 'Eingaben (Zahlen)', ha='center', fontsize=8, color='#52656a')
    for n, (x, y) in {1: (.5, 5.7), 2: (2.4, 4.5), 3: (4.5, 4.2), 4: (4.5, 1.7), 5: (7, 3.6)}.items(): marke(ax, x, y, n)
    fig.text(.5, .02, '1 Reize aufnehmen · 2 Verbindungsstärke · 3 Summieren · 4 Schwelle · 5 Weiterleiten (ganz oder gar nicht)', ha='center', fontsize=9)
    plt.tight_layout(rect=(0, .05, 1, 1)); plt.show()
    print('Gleiche Nummer = gleiche Aufgabe. Die Dicke der Verbindung in beiden Bildern steht für ihre Stärke (Gewicht).')


def perzeptron(w1=1., w2=1., bias=-1.5, aufgabe='AND'):
    if aufgabe not in _ZIELE: raise ValueError(f'Aufgabe: {", ".join(_ZIELE)}.')
    X = _EINGABEN; y = np.array(_ZIELE[aufgabe])
    z = X @ [w1, w2] + bias
    fig, ax = plt.subplots(figsize=(6, 4)); _punkte(ax, X, y)
    _grenze(ax, w1, w2, bias, color='#263b43')
    pred = (z >= 0).astype(int)
    ax.set_title(f'{aufgabe}: {np.sum(pred == y)} von 4 richtig · Ausgabe 1 bei Summe ≥ 0')
    plt.tight_layout(); plt.show()
    print('Eingaben → Summe (mit Bias) → Ausgabe (Ziel)')
    for x, s, p, target in zip(X, z, pred, y):
        print(f'{_t(x)} → {s:.1f} → {p} ({target}) ' + ('✓' if p == target else '✗'))
    for x, p, target in zip(X, pred, y):
        if p == target: continue
        if x.sum() == 0: hinweis = 'Hier ist kein Eingang aktiv: Nur der Bias kann die Summe ändern.'
        elif target == 1: hinweis = 'Neuron soll feuern, tut es aber nicht: Gewichte der aktiven Eingänge erhöhen oder Bias erhöhen.'
        else: hinweis = 'Neuron feuert, soll aber nicht: Gewichte der aktiven Eingänge verringern oder Bias verringern.'
        print(f'{_t(x)}: {hinweis}')
    if np.all(pred == y): print('Alle vier Zeilen stimmen. Dieses Neuron löst die Aufgabe.')
    return pred


def regler_perzeptron():
    return widgets.interact(perzeptron,
        w1=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 1'),
        w2=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 2'),
        bias=widgets.FloatSlider(value=-1.5, min=-3, max=2, step=.5, description='Bias'),
        aufgabe=widgets.Dropdown(options=list(_ZIELE), description='Aufgabe'))


def perzeptron_lernen(aufgabe='AND', lernrate=.2, runden=10, start=(.2, .2, -.5)):
    """Das Neuron korrigiert sich Zeile für Zeile selbst; gezeigt werden Runden, Fehler und Grenzgeraden."""
    if aufgabe not in _ZIELE: raise ValueError(f'Aufgabe: {", ".join(_ZIELE)}.')
    if not 0 < lernrate <= 2 or not 1 <= runden <= 30: raise ValueError('lernrate: 0 bis 2, runden: 1 bis 30.')
    X = _EINGABEN; y = np.array(_ZIELE[aufgabe])
    w = np.array(start[:2], float); b = float(start[2]); staende = [(w.copy(), b)]; fehler = []
    print(f'{aufgabe} · Start: Gewichte {w[0]:g} / {w[1]:g}, Bias {b:g} · Lernrate {lernrate:g}')
    print('Runde 1, Korrekturen: neues Gewicht = altes + Lernrate × (Ziel − Ausgabe) × Eingang; Bias: Eingang 1')
    for runde in range(1, runden + 1):
        n = 0
        for x, t in zip(X, y):
            f = t - int(x @ w + b >= 0)
            if not f: continue
            n += 1; alt = (w.copy(), b)
            w = w + lernrate * f * x; b = b + lernrate * f
            if runde == 1:
                print(f'  {_t(x)} Ziel {t}, Ausgabe {t - f}: w₁ {alt[0][0]:g}→{w[0]:g}, w₂ {alt[0][1]:g}→{w[1]:g}, b {alt[1]:g}→{b:g}')
        fehler.append(n); staende.append((w.copy(), b))
        if n == 0: break
    fig, axes = plt.subplots(1, 2, figsize=(11, 4))
    _punkte(axes[0], X, y)
    farben = plt.cm.Blues(np.linspace(.3, 1, len(staende)))
    for k, ((wk, bk), farbe) in enumerate(zip(staende, farben)):
        _grenze(axes[0], wk[0], wk[1], bk, color=farbe, lw=3 if k == len(staende) - 1 else 1.2)
    axes[0].set_title('Grenzgerade: heller = früher, dunkel = zuletzt')
    axes[1].bar(range(1, len(fehler) + 1), fehler, color=['#be572b' if f else '#176c63' for f in fehler])
    for k, f in enumerate(fehler, 1): axes[1].text(k, f + .08, str(f) if f else '0 ✓', ha='center')
    axes[1].set(xlabel='Runde', ylabel='Korrekturen in dieser Runde', title='Wie viele Zeilen mussten korrigiert werden?',
                xticks=range(1, len(fehler) + 1), ylim=(0, 4.5))
    plt.tight_layout(); plt.show()
    if fehler[-1] == 0:
        print(f'Nach {len(fehler) - 1} Korrekturrunde(n) stimmen alle vier Zeilen. Endwerte: Gewichte {w[0]:g} / {w[1]:g}, Bias {b:g}.')
        print(f'Gelernt hat das Neuron nur diese drei Zahlen: w₁ {start[0]:g} → {w[0]:g}, w₂ {start[1]:g} → {w[1]:g}, b {start[2]:g} → {b:g}.')
        print('So entscheidet es jetzt: Summe = x₁·w₁ + x₂·w₂ + b, ab Summe 0 ist die Ausgabe 1.')
        for x, t in zip(X, y):
            summe = float(x @ w + b)
            print(f'  {_t(x)} → {summe:+.2f} → Ausgabe {int(summe >= 0)} (Ziel {t})')
    else:
        print(f'Auch nach {runden} Runden sind noch Zeilen falsch. Das Neuron korrigiert immer weiter, ohne anzukommen:')
        print('Für diese Aufgabe gibt es keine Gerade, die die Klassen trennt.' if aufgabe == 'XOR' else 'Mehr Runden oder eine andere Lernrate probieren.')
    return w, b


def iris_neuron(lernrate=.1, runden=15):
    """Ein Neuron lernt, zwei Pflanzenarten an Länge und Breite des Kronblatts zu unterscheiden (echte Messdaten)."""
    from sklearn.datasets import load_iris
    d = load_iris(); m = d.target < 2
    X = d.data[m][:, [2, 3]]; y = d.target[m]; namen = ['Iris setosa', 'Iris versicolor']
    rng = np.random.default_rng(3); p = rng.permutation(len(y)); train, neu = p[:70], p[70:]
    w = rng.uniform(-1, 1, 2); b = 0.; staende = [(w.copy(), b)]; fehler = []
    for _ in range(runden):
        n = 0
        for i in rng.permutation(train):
            f = y[i] - int(X[i] @ w + b >= 0)
            if f: w = w + lernrate * f * X[i]; b += lernrate * f; n += 1
        fehler.append(n); staende.append((w.copy(), b))
        if n == 0: break
    fig, axes = plt.subplots(1, 2, figsize=(11, 4))
    for c, (farbe, marker) in enumerate(zip(FARBEN, ['o', '^'])):
        axes[0].scatter(X[train][y[train] == c, 0], X[train][y[train] == c, 1], c=farbe, marker=marker, s=40, label=f'{namen[c]} (Training)')
        axes[0].scatter(X[neu][y[neu] == c, 0], X[neu][y[neu] == c, 1], facecolors='none', edgecolors=farbe, marker=marker, s=60, label=f'{namen[c]} (neu)')
    xs = np.array([0.5, 5.5])
    for k, (wk, bk) in enumerate(staende):
        if abs(wk[1]) > 1e-10: axes[0].plot(xs, -(wk[0] * xs + bk) / wk[1], color=plt.cm.Blues(.3 + .7 * k / max(1, len(staende) - 1)), lw=3 if k == len(staende) - 1 else 1)
    axes[0].set(xlim=(0.5, 5.5), ylim=(0, 2.2), xlabel='Länge des Kronblatts (cm)', ylabel='Breite des Kronblatts (cm)', title='Messdaten und gelernte Grenze')
    axes[0].legend(fontsize=8, loc='upper left')
    axes[1].bar(range(1, len(fehler) + 1), fehler, color=['#be572b' if f else '#176c63' for f in fehler])
    for k, f in enumerate(fehler, 1): axes[1].text(k, f + .08, str(f) if f else '0 ✓', ha='center')
    axes[1].set(xlabel='Runde', ylabel='Korrekturen in dieser Runde', title='Das Neuron lernt von Runde zu Runde', xticks=range(1, len(fehler) + 1))
    plt.tight_layout(); plt.show()
    pred = (X[neu] @ w + b >= 0).astype(int)
    print(f'Training: 70 von 100 Pflanzen, {len(fehler)} Runde(n). Gelernt: Gewichte {w[0]:.2f} / {w[1]:.2f}, Bias {b:.2f}.')
    print(f'Neue, nie gesehene Pflanzen: {int(np.sum(pred == y[neu]))} von {len(neu)} richtig.')
    print('Drei neue Messungen (Länge cm, Breite cm) → Summe → Antwort:')
    for laenge, breite in [(1.4, .2), (4.5, 1.4), (2.9, .9)]:
        s = laenge * w[0] + breite * w[1] + b
        print(f'  ({laenge}, {breite}) → {s:+.2f} → {namen[int(s >= 0)]}')
    print('Das Neuron kennt nur eine Gerade. Die dritte Messung liegt zwischen den Gruppen: Hier ist die Antwort unsicher.')
    return w, b


def xor_lernen(neuronen=2, startwert=1):
    """Ein Netz mit versteckter Schicht lernt XOR aus den vier Beispielen selbst."""
    import warnings
    from sklearn.neural_network import MLPClassifier
    if not 1 <= neuronen <= 8: raise ValueError('neuronen: 1 bis 8.')
    y = np.array(_ZIELE['XOR'])
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        netz = MLPClassifier(hidden_layer_sizes=(neuronen,), activation='tanh', solver='lbfgs', max_iter=3000, random_state=startwert).fit(_EINGABEN, y)
    gx, gy = np.meshgrid(np.linspace(-.4, 1.4, 120), np.linspace(-.4, 1.4, 120))
    z = netz.predict_proba(np.c_[gx.ravel(), gy.ravel()])[:, 1].reshape(gx.shape)
    fig, ax = plt.subplots(figsize=(6, 4.5))
    ax.contourf(gx, gy, z, levels=[0, .5, 1], colors=['#d7ebe3', '#f3dfd3'], alpha=.9)
    xs = np.array([-.4, 1.4])
    for j in range(neuronen):
        wj = netz.coefs_[0][:, j]; bj = netz.intercepts_[0][j]
        if abs(wj[1]) > 1e-6: ax.plot(xs, -(wj[0] * xs + bj) / wj[1], '--', color='#526fa0', lw=1)
    _punkte(ax, _EINGABEN, y)
    ax.set(xlim=(-.4, 1.4), ylim=(-.4, 1.4))
    richtig = int(np.sum(netz.predict(_EINGABEN) == y))
    ax.set_title(f'{neuronen} versteckte Neuronen: {richtig} von 4 richtig')
    plt.tight_layout(); plt.show()
    print('Grün: Ausgabe 0, Orange: Ausgabe 1. Gestrichelte Linien: Was jedes versteckte Neuron «fragt».')
    if richtig == 4: print('Das Netz hat XOR aus den vier Beispielen selbst gelernt. Wir haben keine Gewichte vorgegeben.')
    elif neuronen == 1: print('Ein einziges Neuron ist eine einzige Gerade: Mehr als 3 von 4 sind nicht möglich.')
    else: print('Das Training ist hängen geblieben. Anderen Startwert oder mehr Neuronen probieren.')
    return netz


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


_ALLTAG = ['Sonne scheint', 'Freund:innen gehen mit', 'Prüfung morgen']


def _alltag_ziel(s, f, p):
    return int((s or f) and not p)


def alltagsneuron(sonne=1., freunde=1., pruefung=-1., bias=-1.5):
    """Ein Neuron als Entscheider: Gehe ich schwimmen? Die Gewichte sagen, wie wichtig jeder Faktor ist."""
    zeilen = [(s, f, p) for s in (0, 1) for f in (0, 1) for p in (0, 1)]
    summen = [s * sonne + f * freunde + p * pruefung + bias for s, f, p in zeilen]
    pred = [int(v >= 0) for v in summen]; ziel = [_alltag_ziel(*z) for z in zeilen]
    fig, ax = plt.subplots(figsize=(9, 3.6))
    farben = [('#176c63' if p else '#8d9aa0') for p in pred]
    ax.bar(range(8), summen, color=farben, edgecolor=['#263b43' if p == t else '#be572b' for p, t in zip(pred, ziel)], linewidth=[1 if p == t else 3 for p, t in zip(pred, ziel)])
    ax.axhline(0, color='#263b43', lw=1.5)
    ax.set_xticks(range(8)); ax.set_xticklabels([f'S={s} F={f} P={p}' for s, f, p in zeilen], fontsize=8)
    ax.set(ylabel='Summe inkl. Bias', title='Grün: Neuron sagt «Ja, schwimmen». Roter Rand: weicht von Ihrer Regel ab.')
    plt.tight_layout(); plt.show()
    print('Regel (Ziel): Ich gehe schwimmen, wenn die Sonne scheint oder Freund:innen mitkommen, aber nie am Tag vor einer Prüfung.')
    print('S = Sonne, F = Freund:innen, P = Prüfung (1 = ja, 0 = nein)  ·  Summe = S·w_S + F·w_F + P·w_P + Bias, ab 0: Ja')
    for (s, f, p), v, a_, t in zip(zeilen, summen, pred, ziel):
        print(f'S={s} F={f} P={p} → {v:+.1f} → {"Ja" if a_ else "Nein"} (Ziel: {"Ja" if t else "Nein"}) ' + ('✓' if a_ == t else '✗'))
    richtig = sum(a_ == t for a_, t in zip(pred, ziel))
    print(f'{richtig} von 8 Situationen stimmen.' + (' Das Neuron trifft Ihre Entscheidung in jeder Situation.' if richtig == 8 else ''))
    return pred


def regler_alltag():
    gewicht = lambda name, wert: widgets.FloatSlider(value=wert, min=-5, max=5, step=.5, description=name, style={'description_width': '120px'}, layout=widgets.Layout(width='420px'))
    return widgets.interact(alltagsneuron, sonne=gewicht('Gewicht Sonne', 1), freunde=gewicht('Gewicht Freund:innen', 1),
                            pruefung=gewicht('Gewicht Prüfung', -1), bias=gewicht('Bias', -1.5))


def neuron_rechner():
    def lauf(x1, x2, w1, w2, bias):
        neuron_zeigen(x1, x2, w1, w2, bias)
        perzeptron(w1, w2, bias)
    return widgets.interact(lauf,
        x1=widgets.Dropdown(options=[0, 1], value=1, description='Eingabe 1'),
        x2=widgets.Dropdown(options=[0, 1], value=0, description='Eingabe 2'),
        w1=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 1'),
        w2=widgets.FloatSlider(value=1, min=-2, max=2, step=.5, description='Gewicht 2'),
        bias=widgets.FloatSlider(value=-1.5, min=-3, max=2, step=.5, description='Bias'))


def frage(text, optionen, richtig, erklaerung):
    """Selbstcheck mit sofortiger Rückmeldung: Antwort anklicken."""
    import html
    optionen = list(optionen)
    if not 0 <= richtig < len(optionen): raise ValueError('richtig: Index einer Antwortmöglichkeit.')
    auswahl = widgets.RadioButtons(options=optionen, value=None, description='')
    ausgabe = widgets.Output()
    def pruefen(change):
        if change['new'] is None: return
        with ausgabe:
            ausgabe.clear_output()
            if optionen.index(change['new']) == richtig: print('✓ Richtig. ' + erklaerung)
            else: print('✗ Noch nicht. Lesen Sie den Abschnitt noch einmal und wählen Sie eine andere Antwort.')
    auswahl.observe(pruefen, names='value')
    display(widgets.HTML('<b>Selbstcheck:</b> ' + html.escape(text)), auswahl, ausgabe)
    return auswahl, ausgabe


def _zahl(v):
    return f'{round(float(v), 6):g}'


class _Lerner:
    """Das Neuron lernt ein Beispiel nach dem anderen. Der Zustand ist von der Anzeige getrennt."""
    MAX_RUNDEN = 30

    def __init__(self, aufgabe='AND', lernrate=.2, start=(.2, .2, -.5)):
        if aufgabe not in _ZIELE: raise ValueError(f'Aufgabe: {", ".join(_ZIELE)}.')
        if not 0 < lernrate <= 2: raise ValueError('lernrate: 0 bis 2.')
        self.aufgabe, self.rate, self.start = aufgabe, lernrate, start
        self.y = np.array(_ZIELE[aufgabe]); self.zuruecksetzen()

    def zuruecksetzen(self):
        self.w = np.array(self.start[:2], float); self.b = float(self.start[2])
        self.i = 0; self.runde = 1; self.korr = 0; self.fertig = False; self.abgebrochen = False
        self.staende = [(self.w.copy(), self.b)]; self.fehler = []

    def schritt(self):
        if self.fertig or self.abgebrochen: return None
        x = _EINGABEN[self.i]; t = int(self.y[self.i]); summe = float(x @ self.w + self.b)
        ausgabe = int(summe >= 0); f = t - ausgabe
        info = dict(runde=self.runde, x=x, ziel=t, summe=summe, ausgabe=ausgabe, w_alt=self.w.copy(), b_alt=self.b, fehler=f)
        if f:
            self.w = self.w + self.rate * f * x; self.b += self.rate * f; self.korr += 1
            self.staende.append((self.w.copy(), self.b))
        info.update(w_neu=self.w.copy(), b_neu=self.b, beispiel=self.i)
        self.i += 1
        if self.i == len(_EINGABEN):
            info['runde_ende'] = self.korr; self.fehler.append(self.korr)
            if self.korr == 0: self.fertig = True
            elif self.runde >= self.MAX_RUNDEN: self.abgebrochen = True
            self.i = 0; self.runde += 1; self.korr = 0
        return info


def _schritt_text(info):
    x = info['x']; z = f'{_t(x)}'
    zeilen = [f'Runde {info["runde"]} · Beispiel {z}, Ziel {info["ziel"]}',
              f'  Summe = {x[0]}·{_zahl(info["w_alt"][0])} + {x[1]}·{_zahl(info["w_alt"][1])} + ({_zahl(info["b_alt"])}) = {_zahl(info["summe"])} → Ausgabe {info["ausgabe"]} '
              + ('✓ stimmt, nichts ändert sich.' if not info['fehler'] else '✗ ' + ('Das Neuron feuert zu wenig.' if info['fehler'] > 0 else 'Das Neuron feuert zu viel.'))]
    if info['fehler']:
        zeilen.append(f'  Korrektur: neu = alt + Lernrate × (Ziel − Ausgabe) × Eingang, also (Lernrate × {info["fehler"]:+d})')
        zeilen.append(f'    w₁: {_zahl(info["w_alt"][0])} → {_zahl(info["w_neu"][0])}   w₂: {_zahl(info["w_alt"][1])} → {_zahl(info["w_neu"][1])}   b: {_zahl(info["b_alt"])} → {_zahl(info["b_neu"])}')
    return '\n'.join(zeilen)


def _lern_bild(l, aktuell=None):
    fig, ax = plt.subplots(figsize=(5.4, 4))
    _punkte(ax, _EINGABEN, l.y)
    for k, (wk, bk) in enumerate(l.staende):
        letzte = k == len(l.staende) - 1
        _grenze(ax, wk[0], wk[1], bk, color='#263b43' if letzte else plt.cm.Blues(.3 + .5 * k / max(1, len(l.staende))), lw=3 if letzte else 1.2)
    if aktuell is not None:
        ax.scatter(*aktuell['x'], s=420, facecolors='none', edgecolors='#be572b', linewidths=2.5)
    ax.set_title(f'{l.aufgabe}: Grenze nach {len(l.staende) - 1} Korrektur(en)')
    plt.tight_layout(); plt.show()


def lernen_klick(aufgabe='AND', lernrate=.2):
    """Das Neuron lernt per Klick: ein Beispiel nach dem anderen, mit Rechnung und wandernder Grenze."""
    from IPython.display import clear_output
    l = _Lerner(aufgabe, lernrate)
    wahl = widgets.Dropdown(options=list(_ZIELE), value=aufgabe, description='Aufgabe')
    rate = widgets.FloatSlider(value=lernrate, min=.05, max=1, step=.05, description='Lernrate')
    weiter = widgets.Button(description='Nächstes Beispiel ▶', button_style='primary')
    runde = widgets.Button(description='Ganze Runde ▶▶')
    neu = widgets.Button(description='Zurücksetzen')
    ausgabe = widgets.Output()

    def zeigen(infos):
        with ausgabe:
            clear_output(wait=True)
            if not infos:
                print('Fertig. Mit «Zurücksetzen» oder einer anderen Einstellung beginnen Sie neu.')
            else:
                for info in infos:
                    print(_schritt_text(info))
                    if 'runde_ende' in info:
                        print(f'  → Runde {info["runde"]} abgeschlossen: {info["runde_ende"]} Korrektur(en).')
                _lern_bild(l, infos[-1])
                if l.fertig: print(f'Alle vier Zeilen stimmen: Das Neuron hat gelernt. Gewichte {_zahl(l.w[0])} / {_zahl(l.w[1])}, Bias {_zahl(l.b)}.')
                elif l.abgebrochen: print(f'Nach {l.MAX_RUNDEN} Runden stimmen noch nicht alle Zeilen: Hier hilft keine Lernrate. Eine Gerade reicht für {l.aufgabe} nicht.')
                else: print(f'Aktuell: Gewichte {_zahl(l.w[0])} / {_zahl(l.w[1])}, Bias {_zahl(l.b)}. Das ist alles, was das Neuron «weiss».')
    def klick_weiter(_=None):
        info = l.schritt(); zeigen([info] if info else [])
    def klick_runde(_=None):
        infos = []
        while True:
            info = l.schritt()
            if not info: break
            infos.append(info)
            if 'runde_ende' in info: break
        zeigen(infos)
    def neu_starten(_=None):
        l.aufgabe, l.rate = wahl.value, rate.value; l.y = np.array(_ZIELE[l.aufgabe]); l.zuruecksetzen()
        with ausgabe:
            clear_output(wait=True)
            print(f'Neu gestartet: {l.aufgabe}, Gewichte {_zahl(l.w[0])} / {_zahl(l.w[1])}, Bias {_zahl(l.b)}, Lernrate {_zahl(l.rate)}. Klicken Sie auf «Nächstes Beispiel».')
    weiter.on_click(klick_weiter); runde.on_click(klick_runde); neu.on_click(neu_starten)
    wahl.observe(lambda c: neu_starten(), names='value'); rate.observe(lambda c: neu_starten(), names='value')
    display(widgets.VBox([widgets.HBox([wahl, rate]), widgets.HBox([weiter, runde, neu]), ausgabe]))
    neu_starten()
    return l


def lernen_regler():
    def lauf(aufgabe, lernrate):
        perzeptron_lernen(aufgabe, lernrate=lernrate)
    return widgets.interact(lauf,
        aufgabe=widgets.Dropdown(options=['AND', 'OR', 'NAND', 'NOR'], value='AND', description='Aufgabe'),
        lernrate=widgets.FloatSlider(value=.2, min=.05, max=1, step=.05, description='Lernrate'))


def iris_regler():
    def lauf(lernrate, runden):
        iris_neuron(lernrate=lernrate, runden=runden)
    return widgets.interact(lauf,
        lernrate=widgets.FloatSlider(value=.1, min=.01, max=1, step=.01, description='Lernrate'),
        runden=widgets.IntSlider(value=15, min=1, max=30, description='Runden'))


def xor_problem():
    """XOR: Wahrheitstabelle, die vier Punkte und drei Versuche mit einer Geraden."""
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.2), gridspec_kw=dict(width_ratios=[1, 1.15]))
    axes[0].axis('off')
    tabelle = axes[0].table(cellText=[[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]], colLabels=['Eingabe 1', 'Eingabe 2', 'XOR'],
                            cellLoc='center', loc='center', cellColours=[['white', 'white', FARBEN_HELL[t]] for t in (0, 1, 1, 0)])
    tabelle.scale(1, 2.2); tabelle.set_fontsize(12)
    axes[0].set_title('Wahrheitstabelle: 1, wenn die Eingaben verschieden sind')
    _punkte(axes[1], _EINGABEN, np.array(_ZIELE['XOR']))
    x = np.array([-.4, 1.4])
    axes[1].plot(x, [.5, .5], '--', color='#8d9aa0'); axes[1].axvline(.5, ls='--', color='#8d9aa0'); axes[1].plot(x, .3 - x + .2, '--', color='#8d9aa0')
    axes[1].set_title('Die vier Fälle als Punkte. Gestrichelt: drei Versuche mit einer Geraden')
    plt.tight_layout(); plt.show()
    print('Die beiden Punkte der Klasse 1 liegen diagonal gegenüber. Jede der drei Geraden lässt auf mindestens einer Seite beide Klassen zurück.')



def xor_versuch(w1=1., w2=1., bias=-.5):
    """XOR mit einem Neuron: Jede Zeile wird zu einer Bedingung an Gewichte und Bias."""
    y = np.array(_ZIELE['XOR']); z = _EINGABEN @ [w1, w2] + bias; pred = (z >= 0).astype(int)
    fig, ax = plt.subplots(figsize=(5.4, 4)); _punkte(ax, _EINGABEN, y); _grenze(ax, w1, w2, bias, color='#263b43')
    ax.set_title(f'XOR: {int(np.sum(pred == y))} von 4 richtig'); plt.tight_layout(); plt.show()
    bed = {(0, 0): 'b < 0', (0, 1): 'w₂ + b ≥ 0', (1, 0): 'w₁ + b ≥ 0', (1, 1): 'w₁ + w₂ + b < 0'}
    for x, v, p, t in zip(_EINGABEN, z, pred, y):
        print(f'{_t(x)} Ziel {t}: Bedingung «{bed[_t(x)]}» → Summe {v:+.1f} → Ausgabe {p} ' + ('✓' if p == t else '✗'))
    if np.all(pred == y): print('Alle vier stimmen. (Das lässt sich nach der Rechnung unten nie erreichen.)')
    else: print('Mindestens eine Bedingung verletzt. Bessern Sie eine Zeile aus: Dann kippt eine andere.')
    return int(np.sum(pred == y))


def regler_xor():
    return widgets.interact(xor_versuch,
        w1=widgets.FloatSlider(value=1, min=-3, max=3, step=.5, description='Gewicht 1'),
        w2=widgets.FloatSlider(value=1, min=-3, max=3, step=.5, description='Gewicht 2'),
        bias=widgets.FloatSlider(value=-.5, min=-3, max=3, step=.5, description='Bias'))


def xor_suche():
    """Alle Einstellungen in einem Raster ausprobieren: AND hat Treffer mit 4 von 4, XOR nie."""
    werte = np.arange(-3, 3.01, .5)
    w1, w2, b = np.meshgrid(werte, werte, werte, indexing='ij')
    z = _EINGABEN[:, 0, None] * w1.ravel() + _EINGABEN[:, 1, None] * w2.ravel() + b.ravel()
    pred = (z >= 0).astype(int)
    zaehler = {}
    for aufgabe in ('AND', 'XOR'):
        richtig = (pred == np.array(_ZIELE[aufgabe])[:, None]).sum(axis=0)
        zaehler[aufgabe] = np.bincount(richtig, minlength=5)
    fig, ax = plt.subplots(figsize=(8, 3.6)); breite = .38
    ax.bar(np.arange(5) - breite / 2, zaehler['AND'], breite, color='#176c63', label='AND')
    ax.bar(np.arange(5) + breite / 2, zaehler['XOR'], breite, color='#be572b', label='XOR')
    for k in range(5):
        ax.text(k - breite / 2, zaehler['AND'][k], str(zaehler['AND'][k]), ha='center', va='bottom', fontsize=8)
        ax.text(k + breite / 2, zaehler['XOR'][k], str(zaehler['XOR'][k]), ha='center', va='bottom', fontsize=8)
    ax.set(xlabel='Richtige Zeilen (von 4)', ylabel='Anzahl Einstellungen', title=f'Alle {len(werte) ** 3} Einstellungen von Gewicht 1, Gewicht 2 und Bias im Raster', xticks=range(5))
    ax.legend(); plt.tight_layout(); plt.show()
    print(f'AND: {zaehler["AND"][4]} Einstellungen lösen alle 4 Zeilen. XOR: {zaehler["XOR"][4]}. Mehr als 3 von 4 erreicht bei XOR keine einzige.')
    print('Das ist kein Zufall: Die vier Bedingungen von XOR widersprechen sich (siehe Rechnung oben).')
    return zaehler


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
    for x,a,b,c in zip(X,h1,h2,y): print(_t(x),'|',a,'|',b,'|',c)
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
