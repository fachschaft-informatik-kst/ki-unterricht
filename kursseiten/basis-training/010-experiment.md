---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Trainieren und echte Tests durchführen
kurz: Ohne Schritt-für-Schritt-Rezept selbst arbeiten
---
**Geführte Arbeitsphase:** Folgt dem geprüften Versuchsplan. Trainiert zwei Varianten mit genau einer Änderung und verwendet dieselben unabhängigen Testbilder.

1. Erstellt euer Modell mit zwei Klassen, z. B. in [Teachable Machine](https://teachablemachine.withgoogle.com/train/image). Nur ein **schulisch freigegebenes Werkzeug** verwenden; keine personenbezogenen Daten hochladen.
2. Testet es ausschliesslich mit Bildern, die **nicht beim Training verwendet** wurden.
3. Notiert für jede Klasse die Anzahl **richtiger / getesteter** Vorhersagen. Haltet **mindestens einen Fehler** fest.
4. Verändert genau einen Einflussfaktor und trainiert eine zweite Modellvariante. Vergleicht beide mit denselben zurückgehaltenen Testbildern.

| Testklasse | Richtig | Insgesamt |
|---|:---:|:---:|
| Klasse A | … | … |
| Klasse B | … | … |

<div class="basis-answer"><label for="basis-training-a">Meilenstein 2: Erstes Testergebnis und auffälliger Fehler</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="6" placeholder="Klasse A … / Klasse B … / Das Modell verwechselte … / Unsere Erklärung …"></textarea></div>
<details class="basis-hint"><summary>Hilfe bei Problemen</summary><div class="detail-body"><p>Überprüft zunächst, ob beide Klassen ähnlich viele verschiedene Beispiele enthalten und ob die Bilder gut sichtbar sind. Prüft danach, ob ihr unabsichtlich denselben Hintergrund pro Klasse verwendet. Dokumentiert Fehlversuche, statt sie zu löschen.</p></div></details>
