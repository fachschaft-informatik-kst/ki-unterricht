# Testbilder: Apfel und Banane

80 **echte Fotografien** aus Fruits-360 zum Ausprobieren des Bildprojekts:

```
testbilder/
  Apfel/   T1/ T2/ V1/ P1/ P2/    je 8 Fotos
  Banane/  T1/ T2/ V1/ P1/ P2/    je 8 Fotos
  beispielbilder_fotostudio.json  fertige Fotostudio-Sammlung
  quellen.json                   Quelle und SHA-256 jedes Fotos
```

Die Fotos zeigen echte Früchte vor weissem Hintergrund. Fruits-360 hat den
Hintergrund freigestellt und die Aufnahmen auf **100 × 100 Pixel** verkleinert.
Hier sind die JPEG-Dateien unverändert übernommen, nur ausgewählt und umbenannt.

## Quelle und Lizenz

**Mihai Oltean, Fruits-360 dataset, 2017–.**
[Datensatz](https://github.com/fruits-360/fruits-360-100x100) ·
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Die Fotos und daraus erzeugten Vorschauen stehen unter dieser Lizenz.
Einzelquellen, festgelegter Repository-Stand und Prüfsummen stehen in
`quellen.json`; die Fotostudio-Sammlung enthält die Bildnachweise ebenfalls.

## Schnell testen

Im Versuchsnotebook `MODUS = 'EIGENE_DATEN'` und
`KLASSEN = ['Apfel', 'Banane']` setzen, `beispielbilder_fotostudio.json` hochladen
und die Zellen der Reihe nach ausführen.

Alternativ jede der zehn Mappen im Fotostudio verarbeiten: Klasse, Datengruppe
und als Quelle «Mihai Oltean · Fruits-360 · CC BY-SA 4.0» mit dem jeweiligen
Quelllink aus `quellen.json` eintragen. Danach die Sammlung herunterladen.

## Grenzen des Beispiels

- Jede Datengruppe verwendet eine andere Quellsammlung; mehrere Ansichten
  derselben Sammlung werden nicht zwischen Training, Validierung und Test verteilt.
- Die Aufnahmen einer Sammlung sind ähnlich. Die Metadaten belegen nicht für
  jedes Bild ein eigenes physisches Exemplar. Das Material ist daher **eine
  Ablaufdemo, kein Nachweis exemplarunabhängiger Generalisierung**.
- Der einheitliche Hintergrund und die kleine Auswahl sind nicht repräsentativ
  für Alltagsfotos. Hohe Trefferquoten beweisen keine Alltagstauglichkeit.
- Für das eigene Projekt selbst fotografierte, getrennte Exemplare gemäss
  Datenplan in `content/ki_projekt/ki_fotodaten.md` verwenden.

## Reproduzieren

Vom Repository-Root aus:

```
python tests/generate_testbilder.py --course bok/4-klasse
node tests/generate_testbilder_json.cjs bok/4-klasse
python tests/check_testbilder.py
```

Der Import benötigt Netzwerkzugriff und Pillow. Für die Merkmalsberechnung
werden `@tensorflow/tfjs` 4.22.0, `@tensorflow-models/mobilenet` 2.1.1 und
`@napi-rs/canvas` benötigt (gegebenenfalls über `NODE_PATH`).
Für andere Kurse die Kurskennung ersetzen; jeder Kurs besitzt eigene Dateien.
