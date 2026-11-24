---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Ein fairer A/B-Versuch
kurz: Daten prüfen · Modellvarianten vergleichen · Test erst zum Schluss
---

### Was wird hier eigentlich trainiert?

| Schritt | Aufgabe |
|---|---|
| 1 · Unsere Bilder | Jedes Bild hat ein [Label](#basis-glossar-label): seine tatsächliche Klasse. |
| 2 · MobileNet V2 | Das vortrainierte Netz liefert pro Bild 1280 Merkmale. Seine Gewichte bleiben unverändert. |
| 3 · Unser kleines Netz | 16 Neuronen lernen überwacht aus diesen Merkmalen und den zwei Klassenlabels. |
| 4 · Vorhersage | Das Netz gibt eine der beiden Klassen aus. Neue Exemplare zeigen, ob es mehr als Hintergrund oder Licht gelernt hat. |

MobileNet wurde mit vielen fremden Fotos vortrainiert. Seine ursprünglichen 1000 Ausgabeklassen verwenden wir nicht. Unser kleines Netz lernt, welche Merkmalsmuster zu unseren zwei Klassen gehören. Das ist Transfer Learning.

### Etappe 3 · Der faire A/B-Versuch

| | A · weniger Vielfalt | B · mehr Vielfalt |
|---|---|---|
| Exemplare je Klasse | 1 (T1) | 2 (T1 und T2) |
| Fotos je Klasse | 8 aus T1 | 4 aus T1 + 4 aus T2 |
| Gesamtzahl | 16 Bilder | 16 Bilder |

Gleich bleiben: 16 Neuronen, 60 Epochen, Startwert 11 und dieselben 16 V1-Bilder. Nur die Vielfalt der Trainingsbeispiele soll sich unterscheiden.

<div class="ki-notebook-block" data-notebook="content/basis_fotoprojekt.ipynb" data-title="Bildprojekt · Geführter A/B-Vergleich">
  <h3>Jupyter-Notebook · Bildprojekt</h3>
  <p>Daten importieren, zwei Varianten trainieren, Vorhersagen vergleichen und erst nach begründeter Modellwahl testen.</p>
  <button type="button" class="ki-notebook-launch" data-lab="basis_fotoprojekt.ipynb">Notebook hier öffnen</button>
</div>

1. **Start:** Führt die Startzelle aus. Wählt `EIGENE_DATEN`, tragt die exakten Klassennamen ein und ladet die Fotostudio-JSON. Beim vereinbarten Ersatzdatensatz lasst ihr `UEBUNG` und Kreis/Dreieck stehen.
2. **Daten prüfen:** Vergleicht T1, T2 und V1 in der Vorschau. Bei Fehlern korrigiert ihr die Sammlung im Fotostudio. P1/P2 bleiben verdeckt.
3. **Trainieren:** Lest die V1-Balken. 50 % entsprechen bei diesen ausgeglichenen Klassen der Strategie, immer dieselbe Klasse auszugeben.
4. **Vorhersagen untersuchen:** Verfolgt ein Bild durch das Netz und vergleicht A und B anhand konkreter V1-Beispiele. Beschreibt Label, Vorhersage und Modellwert.
5. **Vor dem Test:** Haltet die V1-Zahlen fest und begründet die Wahl einer Variante im nächsten Kapitel.

<div class="basis-answer"><label for="basis-training-a">Etappe 3 · Datencheck und fairer Vergleich</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="5" placeholder="Klassen und Datenquelle … / A … / B … / Gleich bleibt … / Beobachtung zur Bildvorschau …"></textarea></div>

### Warum ein Lauf noch kein Beweis ist

V1 enthält 16 Bilder, aber nur ein unabhängiges Exemplar je Klasse. Ein Bild entspricht 6,25 Prozentpunkten. Ein Unterschied von höchstens zwei Bildern ist nach der Faustregel der 4. Klasse kein belastbarer Beleg. Führt nach Anleitung der Lehrperson auch den Vergleich mit den Startwerten 11, 22 und 33 durch, bevor ihr P1/P2 öffnet. Bleibt der Unterschied bestehen? B muss nicht besser sein.
