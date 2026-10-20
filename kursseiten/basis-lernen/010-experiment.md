---
type: chapter
id: basis-lernen-experiment
nummer: 1
titel: Entdecken und ausprobieren
kurz: Mit einer Vermutung ins Experiment starten
---

### Regler und Eingaben

Verändert die Gewichte für Sonne, Freund:innen und den Bias. Beobachtet, wann das Neuron 0 oder 1 ausgibt.

<div class="basis-answer"><label for="basis-lernen-a">Unsere Vermutung und Beobachtung</label><textarea id="basis-lernen-a" data-basis-answer="basis-lernen-a" rows="3" placeholder="Wir vermuten … / Wir sehen …"></textarea></div>
<div class="basis-neuron" data-basis-neuron><h3>Neuron-Labor: Wann gehen wir schwimmen?</h3>
<label>Gewicht Sonne <input type="range" data-weight="sun" min="-2" max="2" step="0.5" value="1"><output data-value="sun">1</output></label>
<label>Gewicht Freund:innen <input type="range" data-weight="friend" min="-2" max="2" step="0.5" value="1"><output data-value="friend">1</output></label>
<label>Bias <input type="range" data-weight="bias" min="-3" max="2" step="0.5" value="-1.5"><output data-value="bias">−1.5</output></label>
<div class="table-scroll"><table><thead><tr><th>Sonne</th><th>Freund:innen</th><th>Summe</th><th>Ausgabe</th></tr></thead><tbody data-live-output></tbody></table></div></div>
