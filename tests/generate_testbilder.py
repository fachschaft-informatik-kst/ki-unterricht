"""Erzeugt die Beispielbilder in testbilder/ (Apfel und Banane, je 5 Gruppen x 8 Bilder).

Die Bilder sind gezeichnete Illustrationen, keine Fotos. Jede Gruppe zeigt ein eigenes
Exemplar (Farbe, Form); die Ansichten variieren Lage, Drehung, Grösse, Licht und Hintergrund.
Beide Klassen verwenden dieselben Hintergründe. Aufruf im Projektordner:
    python tests/generate_testbilder.py
"""
import math
import random
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'testbilder'
GRUPPEN = ['T1', 'T2', 'V1', 'P1', 'P2']
W, H, SS = 640, 480, 2  # Bildgrösse, Supersampling der Objekte

HINTERGRUENDE = [  # (oben, unten): gleich für beide Klassen
    ((236, 236, 232), (214, 214, 208)),
    ((226, 214, 192), (205, 190, 164)),
    ((244, 244, 244), (228, 230, 234)),
    ((206, 214, 222), (186, 196, 208)),
]

# Ein Exemplar je Gruppe: unterschiedliche Farben und Formen, damit nicht ein Gegenstand "auswendig" gelernt wird.
APFEL = [
    dict(farbe=(196, 30, 38), breite=1.00, hoehe=0.94),
    dict(farbe=(132, 176, 52), breite=1.06, hoehe=0.92),
    dict(farbe=(226, 198, 74), breite=0.96, hoehe=0.98),
    dict(farbe=(150, 22, 52), breite=1.03, hoehe=0.90),
    dict(farbe=(214, 70, 84), breite=0.98, hoehe=1.00),
]
BANANE = [
    dict(farbe=(240, 204, 46), spanne=118, breite=0.40, flecken=0),
    dict(farbe=(206, 208, 62), spanne=104, breite=0.44, flecken=0),
    dict(farbe=(232, 182, 48), spanne=132, breite=0.38, flecken=14),
    dict(farbe=(244, 214, 70), spanne=96, breite=0.42, flecken=3),
    dict(farbe=(226, 172, 44), spanne=124, breite=0.41, flecken=8),
]


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def shade(farbe, f):
    return tuple(max(0, min(255, int(c * f))) for c in farbe)


def apfel_objekt(p, rng):
    n = 560 * SS
    ebene = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(ebene)
    cx, cy = n // 2, int(n * .54)
    rx, ry = int(n * .30 * p['breite']), int(n * .30 * p['hoehe'])
    for i in range(24):  # Verlauf: dunkel am Rand, hell links oben
        t = i / 23
        gx, gy = int(-rx * .22 * t), int(-ry * .26 * t)
        k = 1 - t * .86
        d.ellipse((cx - rx * k + gx, cy - ry * k + gy, cx + rx * k + gx, cy + ry * k + gy),
                  fill=mix(shade(p['farbe'], .62), shade(p['farbe'], 1.14), t) + (255,))
    d.ellipse((cx - rx * .30, cy - ry * 1.04, cx + rx * .30, cy - ry * .78), fill=shade(p['farbe'], .5) + (255,))
    ebene = ebene.filter(ImageFilter.GaussianBlur(1.2 * SS))
    d = ImageDraw.Draw(ebene)
    d.ellipse((cx - rx * .62, cy - ry * .62, cx - rx * .22, cy - ry * .28), fill=(255, 255, 255, 120))
    ebene = ebene.filter(ImageFilter.GaussianBlur(2 * SS))
    d = ImageDraw.Draw(ebene)
    d.line([(cx, cy - ry * .88), (cx + rx * .06, cy - ry * 1.22), (cx + rx * .20, cy - ry * 1.36)], fill=(96, 64, 36, 255), width=int(9 * SS))
    blatt = [(cx + rx * .12, cy - ry * 1.12), (cx + rx * .55, cy - ry * 1.38), (cx + rx * .85, cy - ry * 1.18), (cx + rx * .40, cy - ry * 1.02)]
    d.polygon(blatt, fill=(70, 134, 52, 255))
    return ebene


def banane_objekt(p, rng):
    n = 640 * SS
    ebene = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(ebene)
    mx, my, radius = n // 2, int(n * .38), n * .30
    start = 90 - p['spanne'] / 2
    pts_l, pts_r, mitte = [], [], []
    schritte = 80
    for i in range(schritte + 1):
        t = i / schritte
        w = n * p['breite'] * .20 * (math.sin(math.pi * t) ** .55) + 3 * SS
        a = math.radians(start + p['spanne'] * t)
        x, y = mx + radius * math.cos(a), my + radius * math.sin(a)
        nx, ny = math.cos(a), math.sin(a)
        pts_l.append((x + nx * w / 2, y + ny * w / 2))
        pts_r.append((x - nx * w / 2, y - ny * w / 2))
        mitte.append((x, y))
    koerper = pts_l + pts_r[::-1]
    d.polygon(koerper, fill=shade(p['farbe'], .86) + (255,))
    for f, versatz in ((1.0, .22), (1.1, .42)):  # Lichtstreifen, nach aussen versetzt
        innen = []
        for (xl, yl), (xm, ym) in zip(pts_l, mitte):
            innen.append((xm + (xl - xm) * versatz, ym + (yl - ym) * versatz))
        for (xr, yr), (xm, ym) in zip(pts_r[::-1], mitte[::-1]):
            innen.append((xm + (xr - xm) * (versatz - .55), ym + (yr - ym) * (versatz - .55)))
        d.polygon(innen, fill=shade(p['farbe'], f) + (255,))
    d.line(pts_r, fill=shade(p['farbe'], .7) + (255,), width=int(3 * SS))
    for _ in range(p['flecken']):
        i = rng.randint(8, schritte - 8)
        x, y = mitte[i]
        x += rng.uniform(-.05, .05) * n * p['breite']
        y += rng.uniform(-.05, .05) * n * p['breite']
        r = rng.uniform(2, 5) * SS
        d.ellipse((x - r, y - r, x + r, y + r), fill=(120, 76, 30, 255))
    x0, y0 = mitte[0]
    x1, y1 = mitte[-1]
    d.ellipse((x0 - 9 * SS, y0 - 9 * SS, x0 + 9 * SS, y0 + 9 * SS), fill=(96, 70, 36, 255))
    d.ellipse((x1 - 7 * SS, y1 - 7 * SS, x1 + 7 * SS, y1 + 7 * SS), fill=(48, 36, 26, 255))
    return ebene.filter(ImageFilter.GaussianBlur(.9 * SS))


def hintergrund(idx, rng):
    oben, unten = HINTERGRUENDE[idx]
    z = Image.new('RGB', (1, H))
    z.putdata([mix(oben, unten, y / (H - 1)) for y in range(H)])
    bild = z.resize((W, H))
    rauschen = Image.effect_noise((W, H), 6).convert('RGB')
    return ImageChops.add(bild, rauschen, scale=1, offset=-128)


def ansicht(objekt, rng, klasse):
    idx = rng.randrange(len(HINTERGRUENDE))
    bild = hintergrund(idx, rng).convert('RGBA')
    winkel = rng.uniform(-45, 45) if klasse == 'Apfel' else rng.uniform(-35, 35) + rng.choice([0, 180])
    if klasse == 'Apfel':
        winkel = rng.uniform(-25, 25)
    skala = rng.uniform(.70, 1.0) * (H / (objekt.height / SS)) * (.95 if klasse == 'Apfel' else 1.25)
    gedreht = objekt.rotate(winkel, resample=Image.BICUBIC, expand=True)
    gross = gedreht.resize((int(gedreht.width * skala / SS), int(gedreht.height * skala / SS)), Image.LANCZOS)
    bbox = gross.getbbox()
    gross = gross.crop(bbox)
    gross.thumbnail((W - 60, H - 60), Image.LANCZOS)
    x = rng.randint(30, max(31, W - gross.width - 30))
    y = rng.randint(24, max(25, H - gross.height - 24))
    schatten = Image.new('RGBA', bild.size, (0, 0, 0, 0))
    ImageDraw.Draw(schatten).ellipse((x + 6, y + gross.height * .78, x + gross.width - 2, y + gross.height * 1.04), fill=(0, 0, 0, 70))
    bild = Image.alpha_composite(bild, schatten.filter(ImageFilter.GaussianBlur(9)))
    bild.alpha_composite(gross, (x, y))
    bild = bild.convert('RGB')
    licht = rng.uniform(.86, 1.08)
    bild = bild.point(lambda v: max(0, min(255, int(v * licht))))
    if rng.random() < .4:
        bild = bild.filter(ImageFilter.GaussianBlur(rng.uniform(.4, 1.1)))
    return bild


def main():
    for klasse, exemplare, maler in (('Apfel', APFEL, apfel_objekt), ('Banane', BANANE, banane_objekt)):
        for g, params in zip(GRUPPEN, exemplare):
            ordner = OUT / klasse / g
            ordner.mkdir(parents=True, exist_ok=True)
            for alt in ordner.glob('*.jpg'):
                alt.unlink()
            rng = random.Random(f'{klasse}-{g}')
            objekt = maler(params, rng)
            for k in range(1, 9):
                ansicht(objekt, rng, klasse).save(ordner / f'{klasse.lower()}_{g}_{k}.jpg', quality=92)
    print('Bilder:', len(list(OUT.rglob('*.jpg'))))


if __name__ == '__main__':
    main()
