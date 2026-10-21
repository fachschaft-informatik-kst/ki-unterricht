---
type: chapter
id: basis-neuron-1
nummer: 1
titel: Vermuten und entscheiden
kurz: Zwei Eingaben, verschiedene Entscheidungen
---
Im Alltag treffen wir Entscheidungen anhand von mehreren Hinweisen. Ein künstliches **Neuron** verknüpft Eingaben mit **Gewichten** und einer **Schwelle (Bias)**. Daraus entsteht eine Ausgabe: **0 = nein** oder **1 = ja**.

**Beispiel:** Sonne (0 oder 1) und Freund:innen (0 oder 1) sollen entscheiden, ob wir schwimmen gehen. Welche Einstellung könnte bewirken, dass wir **nur bei beiden Ja** schwimmen gehen?

**Vor dem Experiment:** Stellen Sie eine Vermutung auf: Wenn das Sonnengewicht negativ wird, was könnte passieren? Testen Sie danach.

<div class="basis-neuron" data-basis-neuron>
<h3>Neuron-Labor: Schwimmen gehen?</h3>
<label>Gewicht Sonne <input type="range" data-weight="sun" min="-2" max="2" step="0.5" value="1"><output data-value="sun">1</output></label>
<label>Gewicht Freund:innen <input type="range" data-weight="friend" min="-2" max="2" step="0.5" value="1"><output data-value="friend">1</output></label>
<label>Bias (Schwelle) <input type="range" data-weight="bias" min="-3" max="2" step="0.5" value="-1.5"><output data-value="bias">−1.5</output></label>
<div class="table-scroll"><table><thead><tr><th>Sonne</th><th>Freund:innen</th><th>Summe</th><th>Ausgabe</th></tr></thead><tbody data-live-output></tbody></table></div>
<p class="small">Regel: Ist die gewichtete Summe inklusive Bias mindestens 0, lautet die Ausgabe 1; sonst 0. Verändern Sie die Regler und beobachten Sie die vier Zeilen.</p>
</div>
<div class="basis-answer"><label for="basis-neuron-a">Vorhersage und tatsächliche Beobachtung</label><textarea id="basis-neuron-a" data-basis-answer="basis-neuron-a" rows="4" placeholder="Meine Vorhersage … / Beim Verändern von … passiert …"></textarea></div>

### Vertiefung aus dem Kurs der 4. Klasse: Ein Perzeptron untersuchen

Im interaktiven Labor oben habt ihr Gewichte und Bias verändert. Im [Notebook «Ein Neuron entscheidet»](../projekt/#perzeptron-5) könnt ihr dieselbe Entscheidung mit Python untersuchen. Öffnet das Notebook über die Kursseite der 4. Klasse; die **Aufgaben hier** sind für die 1. Klasse vereinfacht.

1. Stellt zuerst die AND-Regel ein: Ausgabe 1 nur bei (1, 1). Haltet Gewichte und Bias fest.
2. Verändert **nur den Bias**. Welche der vier Eingaben wechseln ihre Ausgabe?
3. Erklärt in eigenen Worten, warum ein Neuron eine gewichtete Summe und eine Schwelle benötigt.

**Pflicht:** ein Experiment und eine Erklärung. Die mathematische Herleitung des Lernalgorithmus ist eine freiwillige Vertiefung.
