---
type: chapter
id: basis-daten-experiment
nummer: 1
titel: Ziffern und Buchstaben kurz untersuchen
kurz: Ausgabeklassen verstehen · ca. 20 Minuten
---

**Einstieg (ca. 20 Min.):** Ein bereits trainiertes Ziffernnetz erhält 8×8-Pixelbilder und hat zehn Ausgabeklassen (0–9). Vermutet zuerst, was es zu A und B ausgibt. Probiert im Notebook zwei Ziffern und die beiden Buchstaben aus. **Eine Ziffernvorhersage für A ist keine Buchstabenerkennung:** Das Modell besitzt noch keine Ausgabe «A».

<div class="ki-notebook-block" data-notebook="content/basis_bildmodell.ipynb" data-title="Ziffern und Buchstaben – kurzer Einstieg">
  <h3>Jupyter-Notebook · Ziffern und Buchstaben</h3>
  <p>Nur den kurzen Ziffern-/Buchstabentest bearbeiten. Ein zusätzliches Buchstaben-Fine-Tuning ist in diesem Kurs nicht Pflicht.</p>
  <button type="button" class="ki-notebook-launch" data-lab="basis_bildmodell.ipynb">Notebook hier öffnen</button>
</div>

<div class="basis-answer"><label for="basis-daten-a">Unsere Vermutung und Beobachtung</label><textarea id="basis-daten-a" data-basis-answer="basis-daten-a" rows="3" placeholder="Das Modell gab für A … und für B … aus. Das bedeutet nicht, dass …"></textarea></div>

**Brücke zum Projekt:** Auch ein vortrainiertes Bildnetz kann nur die Ausgabeklassen vorhersagen, auf die sein Kopf trainiert wurde. In DL 5 verwenden wir **MobileNet V2 als festes Merkmalsnetz** und trainieren einen neuen kleinen Kopf für unsere **zwei** Klassen. Das ist die gleiche Idee des Transfer Learnings, aber ohne einen zweiten Buchstaben-Trainingsdurchlauf.
