---
type: chapter
id: basis-netze-2
nummer: 2
titel: XOR im Netz ausprobieren
kurz: Alle vier Fälle selbst untersuchen
---
Ändern Sie im Versuch die beiden Eingaben. Beobachten Sie, was die Neuronen **OR** und **NAND** in der Zwischenschicht berechnen und wie daraus **XOR** entsteht.

<div class="basis-network-lab" data-basis-network>
  <div class="basis-network-controls"><label><input type="checkbox" data-network-input="a"> Eingabe x₁ = <output data-network-value="a">0</output></label><label><input type="checkbox" data-network-input="b"> Eingabe x₂ = <output data-network-value="b">0</output></label></div>
  <div class="table-scroll"><table><thead><tr><th>x₁</th><th>x₂</th><th>OR</th><th>NAND</th><th>XOR = AND von OR/NAND</th></tr></thead><tbody data-network-rows></tbody></table></div>
  <p class="basis-language-result" data-network-result role="status">Probieren Sie eine Eingabe aus.</p>
</div>

**Auftrag:** Sagt vor dem Klicken voraus, welche Ausgabe bei (1,1) entsteht. Testet danach **alle vier** Eingabekombinationen. Wo entsteht die Entscheidung, dass (1,1) zu 0 wird?

<div class="basis-answer"><label for="basis-netze-a">Unsere Vorhersage und Erklärung</label><textarea id="basis-netze-a" data-basis-answer="basis-netze-a" rows="4" placeholder="Wir erwarteten … / XOR funktioniert durch …"></textarea></div>

### Weiterforschen mit den Notebooks der 4. Klasse

Öffnet im [Kurs der 4. Klasse die Netzwerk-Experimente](../projekt/#netze-3) und startet dort das Notebook «Neuronale Netze». Vergleicht zunächst das feste XOR-Netz aus OR, NAND und AND mit dem Labor oben.

1. Sucht eine Eingabe, bei der ein einzelnes Neuron die XOR-Regel nicht vollständig erfüllen kann.
2. Vergleicht beim trainierbaren Netzwerk **1, 2 und 4 versteckte Neuronen**. Haltet jeweils die Anzahl richtiger XOR-Fälle fest.
3. Formuliert einen Merksatz: Was ermöglicht die zusätzliche Schicht? Warum garantiert eine grössere Anzahl Neuronen allein noch kein gutes Ergebnis?

**Pflicht:** XOR-Tabelle und Vergleich von zwei Netzgrössen. Unterschiedliche Zufallsstarts und Lernraten sind freiwillig.
