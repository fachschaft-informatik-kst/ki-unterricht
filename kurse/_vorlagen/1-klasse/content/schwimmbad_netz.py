"""Interaktives Schwimmbadnetz der DL4-Kursseite: OR, NAND, Keine Prüfung und AND."""
from pathlib import Path

def schwimmbad_labor():
    """Drei Eingabeslider, Gewichte/Bias und Live-Grafik mit Entscheidungsgrenzen."""
    NETZ_VORLAGE = (Path(__file__).resolve().parent / "img" / "schwimmbad_xor_netz.svg").read_text(encoding="utf-8")

    from xml.etree import ElementTree as ET
    import ipywidgets as widgets
    from IPython.display import display

    # Genau die Startgewichte aus der Schwimmbad-Grafik der Kursseite.
    START = {
        'or': [1.0, 1.0, -0.5],
        'nand': [-1.0, -1.0, 1.5],
        'no_exam': [-1.0, 0.5],
        'out': [1.0, 1.0, 1.0, -2.5],
    }
    gew = {name: werte.copy() for name, werte in START.items()}
    ET.register_namespace('', 'http://www.w3.org/2000/svg')

    def schritt(s, f, p):
        summen = {
            'or': gew['or'][0]*s + gew['or'][1]*f + gew['or'][2],
            'nand': gew['nand'][0]*s + gew['nand'][1]*f + gew['nand'][2],
            'no_exam': gew['no_exam'][0]*p + gew['no_exam'][1],
        }
        zwischen = {n: int(z >= 0) for n, z in summen.items()}
        summen['out'] = sum(gew['out'][i]*zwischen[n]
                            for i, n in enumerate(('or', 'nand', 'no_exam'))) + gew['out'][3]
        zwischen['out'] = int(summen['out'] >= 0)
        return zwischen, summen

    def zahl(z, zeichen=False):
        return (f'{z:+g}' if zeichen else f'{z:g}').replace('-', '−').replace('.', ',')

    def netzbild(s, f, p):
        zwischen, summen = schritt(s, f, p)
        wurzel = ET.fromstring(NETZ_VORLAGE)
        wurzel.set('style', 'display:block;width:100%;min-width:830px;height:auto')
        wurzel.attrib.pop('width', None)
        wurzel.attrib.pop('height', None)
        kanten = {
            's-or': gew['or'][0], 'f-or': gew['or'][1],
            's-nand': gew['nand'][0], 'f-nand': gew['nand'][1],
            'p-no_exam': gew['no_exam'][0],
            'or-out': gew['out'][0], 'nand-out': gew['out'][1],
            'no_exam-out': gew['out'][2],
        }
        beschriftung = {
            ('126', '205'): str(s), ('126', '345'): str(f), ('126', '501'): str(p),
            ('513', '220'): str(zwischen['or']),
            ('513', '360'): str(zwischen['nand']),
            ('513', '523'): str(zwischen['no_exam']),
            ('966', '367'): zahl(summen['out'], True),
            ('1158', '332'): 'Ja' if zwischen['out'] else 'Nein',
            ('1158', '357'): 'y = ' + str(zwischen['out']),
            ('36', '625'): 'Jedes Neuron rechnet mit den gerade eingestellten Gewichten und seinem Bias.',
            ('36', '652'): ('S=' + str(s) + ' · F=' + str(f) + ' · P=' + str(p)
                            + '  |  OR=' + str(zwischen['or'])
                            + ' · NAND=' + str(zwischen['nand'])
                            + ' · Keine Prüfung=' + str(zwischen['no_exam'])
                            + '  →  ' + ('Ja' if zwischen['out'] else 'Nein')),
        }
        for element in wurzel.iter():
            typ = element.tag.rsplit('}', 1)[-1]
            if typ == 'text':
                ort = (element.get('x'), element.get('y'))
                if ort in beschriftung:
                    element.text = beschriftung[ort]
                elif element.get('class') == 'line-weight':
                    element.text = zahl(kanten[element.get('data-edge')], True)
                    element.set('fill', '#be572b' if kanten[element.get('data-edge')] < 0 else '#176c63')
                elif element.get('class') == 'neuron-bias':
                    element.text = 'b = ' + zahl(gew[element.get('data-node')][-1], True)
            elif typ == 'line' and element.get('data-edge') in kanten:
                w = kanten[element.get('data-edge')]
                element.set('stroke', '#be572b' if w < 0 else '#176c63' if w > 0 else '#52656a')
                element.set('marker-end', 'url(#arrNeg)' if w < 0 else 'url(#arrPos)' if w > 0 else 'url(#arrResult)')
            elif typ == 'circle' and element.get('data-node') in zwischen:
                active = zwischen[element.get('data-node')]
                element.set('fill', '#d8f1e6' if active else '#fff0e9')
            elif typ == 'rect' and element.get('x') == '1100' and element.get('y') == '303':
                element.set('fill', '#e0f3e9' if zwischen['out'] else '#fff0e9')
            elif typ == 'desc':
                element.text = ('Schwimmbad mit Sonne ' + str(s) + ', Freund:innen ' + str(f)
                                + ', Prüfung ' + str(p) + '; Ausgang '
                                + ('Ja' if zwischen['out'] else 'Nein') + '.')
        return ET.tostring(wurzel, encoding='unicode')

    def schneiden(ecken, a, b, c, positiv):
        # Ein Halbebenen-Schnitt; die grünen Flächen haben dadurch exakte gerade Kanten.
        def wert(punkt):
            z = a*punkt[0] + b*punkt[1] + c
            return z if positiv else -z
        neu = []
        for vorher, nachher in zip(ecken, ecken[1:] + ecken[:1]):
            u, v = wert(vorher), wert(nachher)
            if (u >= 0) != (v >= 0):
                t = u/(u-v)
                neu.append((vorher[0] + t*(nachher[0]-vorher[0]),
                            vorher[1] + t*(nachher[1]-vorher[1])))
            if v >= 0:
                neu.append(nachher)
        return neu

    def grenze(w):
        a, b, c = w
        lo, hi = -0.25, 1.25
        punkte = []
        if abs(b) > 1e-10:
            for x in (lo, hi):
                y = -(a*x+c)/b
                if lo <= y <= hi: punkte.append((x, y))
        if abs(a) > 1e-10:
            for y in (lo, hi):
                x = -(b*y+c)/a
                if lo <= x <= hi and not any(abs(x-u)+abs(y-v) < 1e-7 for u,v in punkte):
                    punkte.append((x, y))
        return punkte[:2]

    def punktebild(p):
        lo, hi = -0.25, 1.25
        links, oben, breite = 80, 37, 330
        xpx = lambda x: links + (x-lo)/(hi-lo)*breite
        ypx = lambda y: oben + (hi-y)/(hi-lo)*breite
        teile = [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 465 433" '
            'role="img" aria-label="Entscheidungsgebiete für Sonne und Freund:innen">',
            '<rect width="465" height="433" rx="12" fill="#fff"/>',
            '<text x="231" y="22" text-anchor="middle" font-size="16" font-weight="700" fill="#263b43">'
            + 'Entscheidungsgrenzen bei P = ' + str(p) + '</text>',
            f'<rect x="{links}" y="{oben}" width="{breite}" height="{breite}" fill="#fff0e9" stroke="#a9b8c5"/>',
        ]
        # Alle Kombinationen von OR und NAND, deren Ausgabeneuron Ja sagt, werden grün.
        keine_pruefung = int(gew['no_exam'][0]*p + gew['no_exam'][1] >= 0)
        grund = [(lo,lo),(hi,lo),(hi,hi),(lo,hi)]
        for o in (0,1):
            for n in (0,1):
                ja = int(gew['out'][0]*o + gew['out'][1]*n
                         + gew['out'][2]*keine_pruefung + gew['out'][3] >= 0)
                if not ja:
                    continue
                poly = schneiden(grund, *gew['or'], bool(o))
                if poly:
                    poly = schneiden(poly, *gew['nand'], bool(n))
                if poly:
                    coord = ' '.join(f'{xpx(x):.1f},{ypx(y):.1f}' for x,y in poly)
                    teile.append(f'<polygon points="{coord}" fill="#d8f1e6"/>')
        for t in (0,1):
            xx, yy = xpx(t), ypx(t)
            teile.extend([
                f'<line x1="{xx:.1f}" y1="{oben}" x2="{xx:.1f}" y2="{oben+breite}" stroke="#c9d7dc" stroke-dasharray="2 5"/>',
                f'<line x1="{links}" y1="{yy:.1f}" x2="{links+breite}" y2="{yy:.1f}" stroke="#c9d7dc" stroke-dasharray="2 5"/>',
                f'<text x="{xx:.1f}" y="387" font-size="14" text-anchor="middle">{t}</text>',
                f'<text x="63" y="{yy+5:.1f}" font-size="14" text-anchor="end">{t}</text>',
            ])
        for name, farbe in (('or','#176c63'),('nand','#be572b')):
            g = grenze(gew[name])
            if len(g) == 2:
                (x1,y1),(x2,y2) = g
                teile.append(f'<line x1="{xpx(x1):.1f}" y1="{ypx(y1):.1f}" '
                             f'x2="{xpx(x2):.1f}" y2="{ypx(y2):.1f}" '
                             f'stroke="{farbe}" stroke-width="2.5" stroke-dasharray="7 5"/>')
        for s in (0,1):
            for f in (0,1):
                ziel = int(bool(s) != bool(f) and p == 0)
                ist = schritt(s,f,p)[0]['out']
                xx, yy = xpx(s), ypx(f)
                teile.extend([
                    f'<circle cx="{xx:.1f}" cy="{yy:.1f}" r="13" fill="{"#176c63" if ziel else "#be572b"}" '
                    f'stroke="{"#263b43" if ist == ziel else "#f5c542"}" stroke-width="{"2" if ist == ziel else "5"}"/>',
                    f'<text x="{xx:.1f}" y="{yy+5:.1f}" font-size="15" font-weight="700" '
                    f'text-anchor="middle" fill="white">{ziel}</text>',
                ])
        teile.extend([
            '<text x="245" y="420" font-size="15" text-anchor="middle" fill="#263b43">Sonne (S) →</text>',
            '<text x="20" y="219" font-size="14" text-anchor="middle" fill="#263b43" transform="rotate(-90 20 219)">Freund:innen (F) →</text>',
            '</svg>'
        ])
        return ''.join(teile)

    def aktualisieren():
        s, f, p = sonne.value, freunde.value, pruefung.value
        zwischen, summen = schritt(s,f,p)
        ergebnis = 'Ja' if zwischen['out'] else 'Nein'
        ziel = int(s != f and p == 0)
        richtig = sum(schritt(a,b,p)[0]['out'] == int(a != b and p == 0)
                      for a in (0,1) for b in (0,1))
        zeilen = []
        for a,b in ((0,0),(0,1),(1,0),(1,1)):
            werte, _ = schritt(a,b,p)
            soll = int(a != b and p == 0)
            ok = werte['out'] == soll
            hintergrund = '#eaf7ef' if ok else '#fff0e9'
            zeilen.append(
                f'<tr style="background:{hintergrund}"><td>{a}</td><td>{b}</td>'
                f'<td>{werte["or"]}</td><td>{werte["nand"]}</td><td>{werte["no_exam"]}</td>'
                f'<td><strong>{werte["out"]}</strong></td><td>{soll}</td>'
                f'<td>{"✓" if ok else "✗"}</td></tr>')
        oben = ('<p style="margin:7px 0"><strong>Ausgewählter Fall: '
                + f'S={s}, F={f}, P={p} → {ergebnis} (y={zwischen["out"]})</strong>'
                + f' · Ausgangssumme: {zahl(summen["out"], True)}'
                + (' · ✓ Ziel erreicht' if zwischen['out'] == ziel else ' · ✗ Ziel verfehlt')
                + '</p>')
        notiz = ('<p style="margin:6px 0;font-size:13px;color:#52656a">'
                 'Grün = Ja-Gebiet, Hellorange = Nein-Gebiet. Gestrichelt: OR-Grenze (grün) '
                 'und NAND-Grenze (orange). Die Punkte zeigen die Zielwerte (1/0); '
                 'ein gelber Rand kennzeichnet eine falsche Vorhersage.</p>')
        tabelle = (
            f'<strong>Vier Fälle bei P={p}: {richtig}/4 richtig</strong>'
            '<div style="overflow-x:auto"><table style="border-collapse:collapse;'
            'width:100%;text-align:center;font-size:13px;margin-top:7px">'
            '<thead><tr style="background:#eaf2f4">'
            '<th>S</th><th>F</th><th>OR</th><th>NAND</th><th>Keine P</th>'
            '<th>Netz</th><th>Ziel</th><th>✓/✗</th></tr></thead>'
            '<tbody>' + ''.join(zeilen) + '</tbody></table></div>'
            '<p style="font-size:13px;color:#52656a">Ausgabe 1, wenn die gewichtete Summe '
            'der drei Zwischenwerte mit Bias mindestens 0 ist.</p>'
        )
        netz.value = oben + '<div style="overflow-x:auto;width:100%">' + netzbild(s,f,p) + '</div>'
        details.value = ('<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">'
                         '<div style="flex:1 1 340px;max-width:465px">' + punktebild(p) + notiz + '</div>'
                         '<div style="flex:1 1 330px">' + tabelle + '</div></div>')

    def eingabe(name, value):
        return widgets.IntSlider(value=value, min=0, max=1, step=1,
            description=name, continuous_update=False,
            style={'description_width':'125px'},
            layout=widgets.Layout(width='min(100%, 440px)'))

    sonne = eingabe('Sonne (S)', 1)
    freunde = eingabe('Freund:innen (F)', 0)
    pruefung = eingabe('Prüfung morgen (P)', 0)
    auswahl = widgets.Dropdown(options=[('OR','or'),('NAND','nand'),
                                       ('Keine Prüfung','no_exam'),('AND / Ausgabe','out')],
                                value='or', description='Neuron:',
                                style={'description_width':'100px'})
    def regler():
        return widgets.FloatSlider(min=-4, max=4, step=0.5, continuous_update=False,
                                   style={'description_width':'150px'},
                                   layout=widgets.Layout(width='min(100%, 430px)'))
    w1,w2,w3,bias = (regler() for _ in range(4))
    regler_liste = (w1,w2,w3)
    block = [False]
    namen = {
        'or': ['Sonne','Freund:innen'],
        'nand': ['Sonne','Freund:innen'],
        'no_exam': ['Prüfung'],
        'out': ['OR','NAND','Keine Prüfung'],
    }
    def setze_regler():
        block[0] = True
        key = auswahl.value
        werte = gew[key]
        for i, r in enumerate(regler_liste):
            sichtbar = i < len(werte) - 1
            r.layout.display = '' if sichtbar else 'none'
            if sichtbar:
                r.description = 'Gewicht ' + namen[key][i]
                r.value = werte[i]
        bias.description = 'Bias b'
        bias.value = werte[-1]
        block[0] = False
        aktualisieren()

    def wert_geaendert(change):
        if block[0]:
            return
        key = auswahl.value
        for i in range(len(gew[key])-1):
            gew[key][i] = regler_liste[i].value
        gew[key][-1] = bias.value
        aktualisieren()

    for r in (*regler_liste, bias):
        r.observe(wert_geaendert, names='value')
    auswahl.observe(lambda change: setze_regler(), names='value')
    sonne.observe(lambda change: aktualisieren(), names='value')
    freunde.observe(lambda change: aktualisieren(), names='value')
    pruefung.observe(lambda change: aktualisieren(), names='value')
    reset = widgets.Button(description='Startgewichte wiederherstellen ↺')
    def reset_klick(button):
        for name in gew:
            gew[name][:] = START[name]
        setze_regler()
    reset.on_click(reset_klick)
    netz = widgets.HTML(layout=widgets.Layout(width='100%'))
    details = widgets.HTML(layout=widgets.Layout(width='100%'))
    setze_regler()
    display(widgets.VBox([
        widgets.HTML('<strong>1 · Eingaben ändern (0 = Nein, 1 = Ja)</strong>'),
        sonne, freunde, pruefung,
        widgets.HTML('<strong>2 · Gewichte und Bias eines Neurons verändern</strong>'),
        auswahl, w1, w2, w3, bias, reset,
        widgets.HTML('<strong>3 · Netz, Entscheidungsgrenzen und vier Fälle vergleichen</strong>'),
        netz, details,
    ], layout=widgets.Layout(width='100%')))
