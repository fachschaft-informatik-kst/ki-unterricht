---
type: chapter
id: basis-plan-experiment
nummer: 1
titel: Ein vortrainiertes Netz anpassen
kurz: Neue Ausgabeklassen für A und B
---

Ein Netz kann nicht automatisch neue Bildklassen erkennen. In dieser Doppellektion passt ihr es **gemeinsam mit der Lehrperson** an. Wir übernehmen die bereits gelernten Gewichte der ersten Schicht und trainieren einen **neuen Ausgabekopf** für die Buchstaben A und B.

[**Notebook «Bildmodell» öffnen ↗**](../lab/index.html?path=portal/basis_bildmodell.ipynb)

1. Öffnet den Abschnitt **DL 6** und schaut euch die neuen Trainings- und Testbilder an.
2. Führt das Training des A/B-Kopfs aus. Die erste Schicht bleibt unverändert.
3. Testet das angepasste Modell mit **neuen** Buchstabenbildern.
4. Erklärt: Welche Schicht wurde übernommen, welche wurde neu trainiert?

**Achtung:** Die Ziffernvorhersagen von vorher und die A/B-Trefferquote nachher haben unterschiedliche Zielklassen und dürfen nicht als zwei direkt vergleichbare Genauigkeiten behandelt werden.

<div class="basis-answer"><label for="basis-plan-a">Unsere Erklärung zum Transfer Learning</label><textarea id="basis-plan-a" data-basis-answer="basis-plan-a" rows="5" placeholder="Übernommen wurde … / Neu trainiert wurde … / Die Testbilder …"></textarea></div>
