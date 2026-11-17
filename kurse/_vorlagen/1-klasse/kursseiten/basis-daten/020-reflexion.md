---
type: chapter
id: basis-daten-reflexion
nummer: 2
titel: Daten fair aufteilen
kurz: Den Lernpfad der 4. Klasse geführt anwenden
---

### Drei Datenrollen verstehen

Im Bildprojekt verwenden wir die Aufteilung der 4. Klasse: **T1 und T2** sind Training (hier lernt der Kopf aus Labels), **V1** ist Validierung (hier entscheiden wir zwischen A und B), **P1 und P2** sind unabhängige Testdaten (erst **nach** der Modellwahl). Das vortrainierte MobileNet bleibt fest.

**Datenleck-Beispiel:** Acht Fotos desselben Apfels in T1 und P1 sind kein unabhängiger Test. Auch andere Perspektiven bleiben Fotos desselben Exemplars. In eigene Fotogruppen gehören verschiedene Exemplare; mit dem vorbereiteten Übungsdatensatz sind die Gruppen schon getrennt.

**Geführter Lernpfad (ca. 25 Minuten):** Beantwortet erst die drei Datenrollen, besprecht den Apfel-Fall und probiert den Datenleck-Versuch aus der 4. Klasse im Notebook «Daten fair aufteilen». Bei Zeitknappheit genügen der Apfel-Fall und ein Vergleich von bekannten und neuen Beispielen.

<div class="ki-notebook-block" data-notebook="content/daten_training.ipynb" data-title="Daten fair aufteilen">
  <h3>Jupyter-Notebook · Daten fair aufteilen</h3>
  <p>Trainings-, Validierungs- und Testdaten sowie ein Datenleck selbst untersuchen.</p>
  <button type="button" class="ki-notebook-launch" data-lab="daten_training.ipynb">Notebook hier öffnen</button>
</div>

<div class="basis-answer"><label for="basis-daten-b">Datenregeln: unsere Erklärung</label><textarea id="basis-daten-b" data-basis-answer="basis-daten-b" rows="4" placeholder="Training … / V1 … / P1/P2 … / Ein Datenleck entsteht, wenn …"></textarea></div>

<details><summary>Selbstkontrolle: Warum ist der Test unabhängig?</summary><div class="detail-body"><p>Die Modellwahl geschieht nur mithilfe von V1. Erst danach wird die festgelegte Variante auf bisher ungenutzten P1/P2-Bildern getestet. Gleiche reale Gegenstände dürfen nicht auf Trainings- und Testgruppen verteilt werden.</p></div></details>
