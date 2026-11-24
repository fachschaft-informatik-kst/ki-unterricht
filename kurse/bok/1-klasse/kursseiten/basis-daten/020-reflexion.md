---
type: chapter
id: basis-daten-reflexion
nummer: 2
titel: Daten fair aufteilen
kurz: Den Lernpfad der 4. Klasse geführt anwenden
---

### Drei Datenrollen verstehen

Ein Bildmodell lernt aus beschrifteten Bildern. Die Bilder, mit denen es lernt, dürfen nicht auch als unabhängige Prüfung dienen.

| Gruppen | Aufgabe | Bilder pro Klasse |
|---|---|---:|
| T1 und T2 – [Training](#basis-glossar-training) | Das Netz passt seine Gewichte an. | 16 im Trainingspool |
| V1 – [Validierung](#basis-glossar-validierung) | Zwei Varianten vergleichen und eine auswählen. | 8 |
| P1 und P2 – [Testdaten](#basis-glossar-testdaten) | Nur die gewählte Variante abschliessend prüfen. | 16 |

### Fallbeispiel · Zwei Äpfel

Ein Tandem fotografiert einen roten Apfel achtmal. Vier Fotos landen im Training, vier im Test. Ein anderes Tandem nimmt für den Test einen anderen Apfel. Welcher Versuch prüft besser, ob das Modell neue Äpfel erkennt? Warum reicht es nicht, denselben Apfel vor einem anderen Hintergrund zu fotografieren?

### Interaktiver Versuch · Datenleck erkennen

Vergleicht die Trefferquote mit Kopien der Trainingsbilder und mit wirklich neuen Bildern. Wiederholt den Vergleich mit 40 und 400 Trainingsbildern. Notiert die tatsächlichen Werte.

<div class="ki-notebook-block" data-notebook="content/daten_training.ipynb" data-title="Daten fair aufteilen">
  <h3>Jupyter-Notebook · Daten fair aufteilen</h3>
  <p>Trainings-, Validierungs- und Testdaten sowie ein Datenleck selbst untersuchen.</p>
  <button type="button" class="ki-notebook-launch" data-lab="daten_training.ipynb">Notebook hier öffnen</button>
</div>

<div class="basis-answer"><label for="basis-daten-b">Datencheck: Apfelbeispiel, Notebookwerte und drei Datenrollen</label><textarea id="basis-daten-b" data-basis-answer="basis-daten-b" rows="6" placeholder="Der faire Apfeltest … / Kopien … %, neue Bilder … % / 40 vs. 400 … / Training … / V1 … / P1/P2 …"></textarea></div>

<details><summary>Selbstkontrolle</summary><div class="detail-body"><p>Fotos desselben Exemplars bleiben in einer Gruppe. Nur V1 dient zur Auswahl. P1/P2 bleiben bis nach der Wahl ungenutzt. Eine hohe Trefferquote auf Kopien belegt keine Erkennung neuer Exemplare.</p></div></details>
