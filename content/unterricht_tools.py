"""Darstellungen für den Pflichtweg. CPython und JupyterLite/Pyodide.
Der Code ist für Interessierte einsehbar; Lernende ändern nur die Notebook-Einstellungen.
"""
import numpy as np
import matplotlib.pyplot as plt
import ipywidgets as widgets
from IPython.display import display, HTML

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


def ziffern(neuronen=16):
    from sklearn.datasets import load_digits
    from sklearn.model_selection import train_test_split
    from sklearn.neural_network import MLPClassifier
    from sklearn.metrics import accuracy_score
    import warnings
    from sklearn.exceptions import ConvergenceWarning
    X,y=load_digits(return_X_y=True);X=X/16 # fixed scale, no fitting on held-out data
    train,val=train_test_split(np.arange(len(y)),test_size=.3,stratify=y,random_state=11)
    with warnings.catch_warnings():
        warnings.simplefilter('ignore',ConvergenceWarning)
        netz=MLPClassifier(hidden_layer_sizes=(neuronen,),max_iter=100,random_state=11).fit(X[train],y[train])
    pred=netz.predict(X[val]);wrong=np.flatnonzero(pred!=y[val])
    chosen=np.r_[wrong[:3],np.flatnonzero(pred==y[val])[:3]]
    fig,axes=plt.subplots(1,len(chosen),figsize=(10,2.6),squeeze=False)
    for ax,j in zip(axes[0],chosen):
        ax.imshow(X[val[j]].reshape(8,8),cmap='gray_r');ax.axis('off')
        ax.set_title(f'Bild: {y[val[j]]}\nNetz: {pred[j]}',fontsize=11)
    fig.suptitle(f'Validierung: {accuracy_score(y[val],pred):.0%} richtig · {len(val)} neue Bilder')
    plt.tight_layout();plt.show()
    print('Erste Fehlvorhersagen und richtige Beispiele. Keine zufällige Stichprobe der Ergebnisse.')
    print('Diese Validierungsdaten dürfen zum Vergleichen dienen; sie sind kein unabhängiger Abschlusstest.')
    return netz


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


class Nim:
    """Einfaches Belohnungslernen: Zuggewichte pro Restmenge, kein neuronales Netz.
    Nach Gewinn +1, nach Verlust −1 (mindestens 1) für die eigenen gewählten Züge.
    Trainingsgegner: Zufall. Wer das letzte Holz nimmt, verliert.
    """
    def __init__(self, seed=11):
        self.rng=np.random.default_rng(seed)
        self.gewichte={n:np.ones(min(3,n),dtype=float) for n in range(1,11)}
        self.partien=0

    def zug(self,n,rng=None):
        rng=self.rng if rng is None else rng
        p=self.gewichte[n];return int(rng.choice(np.arange(1,len(p)+1),p=p/p.sum()))

    def lernen(self,anzahl=200):
        if not isinstance(anzahl,int) or not 0<=anzahl<=10000:raise ValueError('0–10000 Trainingspartien wählen.')
        for _ in range(anzahl):
            rest=10;dran=int(self.rng.integers(2));weg=[]
            while rest:
                nehmen=self.zug(rest) if dran==0 else int(self.rng.integers(1,min(3,rest)+1))
                if dran==0:weg.append((rest,nehmen))
                rest-=nehmen
                if rest==0:
                    gewonnen=dran!=0;break
                dran=1-dran
            for n,z in weg:self.gewichte[n][z-1]=max(1,self.gewichte[n][z-1]+(1 if gewonnen else -1))
            self.partien+=1
        return self

    def pruefen(self,anzahl=400,seed=902):
        # Evaluation uses separate random state and never updates the policy.
        rng=np.random.default_rng(seed);wins=0
        for i in range(anzahl):
            rest=10;dran=i%2
            while rest:
                z=self.zug(rest,rng) if dran==0 else int(rng.integers(1,min(3,rest)+1))
                rest-=z
                if not rest:wins+=int(dran!=0);break
                dran=1-dran
        return wins/anzahl


def nim_vergleich(partien=500):
    vorher=Nim();nachher=Nim().lernen(partien)
    werte=[vorher.pruefen(),nachher.pruefen()]
    fig,ax=plt.subplots(figsize=(6,3.5));ax.bar(['Ohne Training',f'Nach {partien} Partien'],np.array(werte)*100,color=FARBEN)
    ax.set(ylim=(0,110),ylabel='Gewonnene Partien (%)',title='400 Prüfpartien gegen einen Zufallsgegner')
    for i,v in enumerate(werte):ax.text(i,v*100+3,f'{v:.0%}',ha='center')
    plt.tight_layout();plt.show()
    print('Startrecht abwechselnd. Beim Prüfen wird nicht weitergelernt. Eine feste Zufallsfolge, kein allgemeiner Beweis.')
    return nachher


def nim_spielen(ki):
    out=widgets.Output();buttons=[widgets.Button(description=f'{i} nehmen') for i in (1,2,3)]
    neu=widgets.Button(description='Neue Partie');zustand={'rest':10,'fertig':False}
    def anzeigen(text='Sie beginnen. Während dieser Partie lernt die KI nicht.'):
        with out:
            out.clear_output(wait=True)
            print('│ '*zustand['rest'], f"({zustand['rest']} Hölzer)")
            print(text)
        for i,b in enumerate(buttons,1):b.disabled=zustand['fertig'] or i>zustand['rest']
    def spielen(n):
        if zustand['fertig'] or n>zustand['rest']:return
        zustand['rest']-=n
        if not zustand['rest']:
            zustand['fertig']=True;anzeigen('Sie haben das letzte Holz genommen: verloren.');return
        z=ki.zug(zustand['rest']);zustand['rest']-=z
        if not zustand['rest']:
            zustand['fertig']=True;anzeigen(f'KI nimmt {z}, darunter das letzte Holz: Sie gewinnen.');return
        anzeigen(f'KI nimmt {z}. Sie sind dran.')
    for i,b in enumerate(buttons,1):b.on_click(lambda _,n=i:spielen(n))
    def reset(_):zustand.update(rest=10,fertig=False);anzeigen()
    neu.on_click(reset);display(widgets.VBox([out,widgets.HBox(buttons),neu]));anzeigen()
    return zustand
