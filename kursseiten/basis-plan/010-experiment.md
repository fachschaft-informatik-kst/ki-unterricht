---
type: chapter
id: basis-plan-experiment
nummer: 1
titel: Forscherfrage selbst wählen
kurz: Eigene Idee, Hypothese und Erfolgskriterium
---
Ihr arbeitet zu zweit mit einem vorbereiteten Bilddatensatz und einem angeleiteten Modell. Die Lehrperson prüft euren Versuchsplan vor dem Experiment.

**Euer Forschungsauftrag:** Untersucht eine selbst gewählte Frage dazu, **wann** ein Bildmodell zuverlässig klassifiziert und **wann** es Fehler macht. Nicht die höchste Genauigkeit gewinnt, sondern eine nachvollziehbare Untersuchung.

<ol>
<li>Wählt zwei unterscheidbare Klassen (z. B. <em>Becher/Buch</em>, <em>Stift/Radiergummi</em>, <em>Blatt/Papier</em>). Eigene Themen sind nur nach Rücksprache mit der Lehrperson möglich.</li>
<li>Formuliert eine <strong>prüfbare Frage</strong>, z. B. «Erkennt die KI den Gegenstand auch vor einem neuen Hintergrund?»</li>
<li>Schreibt eine <strong>Hypothese</strong>, die sich als falsch herausstellen könnte.</li>
<li>Legt fest, welche <strong>Testbedingungen</strong> ihr später verändert.</li>
</ol>

<div class="basis-answer"><label for="basis-plan-a">Unsere Forschungsfrage, Klassen und Hypothese</label><textarea id="basis-plan-a" data-basis-answer="basis-plan-a" rows="5" placeholder="Unsere Klassen … / Wir untersuchen … / Wir vermuten, dass …"></textarea></div>

<details class="basis-hint"><summary>Ideenhilfe (nur wenn ihr keine eigene Idee findet)</summary><div class="detail-body"><p>Hintergrund wechseln, Beleuchtung verändern, Abstand vergrössern oder Gegenstände aus einer anderen Perspektive zeigen. Untersucht nach Möglichkeit <strong>nur einen Einflussfaktor</strong>.</p></div></details>

### Ein Ziffernnetz für Buchstaben anpassen

[**Notebook «Bildmodell» öffnen ↗**](../lab/index.html?path=basis_bildmodell.ipynb)

Öffnet den Abschnitt **DL 6**. Trainiert unter Anleitung einen neuen Klassifikationskopf für A und B. Die erste Schicht des Ziffernnetzes bleibt eingefroren. Vergleicht, **welche Ausgaben** vor und nach der Anpassung möglich sind. Notiert, weshalb eine Ziffernausgabe nicht direkt mit der Trefferquote des Buchstabenmodells verglichen werden darf.
