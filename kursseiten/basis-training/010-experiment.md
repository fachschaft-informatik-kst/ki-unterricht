---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Trainieren und echte Tests durchführen
kurz: Mit Leitfragen selbstständig vergleichen
---
**Geführte Arbeitsphase:** Folgt dem geprüften Versuchsplan. Trainiert zwei Varianten mit genau einer Änderung und verwendet dieselben zurückgehaltenen Vergleichsbilder. Verwendet dafür das bereits in DL 5 eingeführte Werkzeug.

1. Öffnet euer [**Bildmodell-Notebook**](../lab/index.html?path=basis_bildmodell.ipynb) und führt die Abschnitte DL 6 und DL 7 aus. Verwendet die im Notebook erzeugten Bilddaten und dieselben Testbilder für beide Varianten.
2. Testet es ausschliesslich mit Bildern, die **nicht beim Training verwendet** wurden.
3. Notiert für jede Klasse die Anzahl **richtiger / getesteter** Vorhersagen. Dokumentiert beobachtete Fehler; falls alle Beispiele richtig sind, beschreibt eine mögliche Grenze eures Tests.
4. Verändert genau einen Einflussfaktor und trainiert eine zweite Modellvariante. Vergleicht beide mit denselben zurückgehaltenen Testbildern.

| Testklasse | Richtig | Insgesamt |
|---|:---:|:---:|
| Klasse A | … | … |
| Klasse B | … | … |

<div class="basis-answer"><label for="basis-training-a">Meilenstein 2: Erstes Testergebnis und kritische Beobachtung</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="6" placeholder="Klasse A … / Klasse B … / Beobachteter Fehler oder mögliche Grenze … / Unsere Erklärung …"></textarea></div>
<details class="basis-hint"><summary>Hilfe bei Problemen</summary><div class="detail-body"><p>Überprüft zunächst, ob beide Klassen ähnlich viele verschiedene Beispiele enthalten und ob die Bilder gut sichtbar sind. Prüft danach, ob ihr unabsichtlich denselben Hintergrund pro Klasse verwendet. Dokumentiert Fehlversuche, statt sie zu löschen.</p></div></details>
