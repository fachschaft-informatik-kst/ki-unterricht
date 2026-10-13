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
    for x,title,gruppen,color in [(0,'TRAINIEREN','T1 + T2','#e7f1eb'),(1,'AUSWÄHLEN','V1','#e6edf9'),(2,'ABSCHLIESSEND PRÜFEN','P1 + P2','#fff0e7')]:
        ax.text(x,.75,title,ha='center',fontsize=11,weight='bold')
        ax.text(x,.4,gruppen,ha='center',fontsize=22,bbox=dict(boxstyle='round,pad=.6',fc=color))
    ax.set(xlim=(-.55,2.55),ylim=(0,1))
    if leck:ax.annotate('Dasselbe Objekt erneut fotografiert: Datenleck!',xy=(2,.25),xytext=(0,.05),arrowprops=dict(arrowstyle='->',color='#b84d27'),color='#b84d27')
    plt.tight_layout();plt.show()
    print('Jede Gruppe enthält ein anderes Exemplar jeder Klasse; bei Gesten eine andere Person.')
    print('Ein neues Foto desselben Gegenstands ist kein neues Exemplar.')
