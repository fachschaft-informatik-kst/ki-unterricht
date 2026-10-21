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

### Eigenes Notebook: Neuronale Netze

[**Notebook «Neuronale Netze» starten ↗**](../lab/index.html?path=basis_netze.ipynb)

1. Vergleicht die vier XOR-Zielwerte mit den Ausgaben eines einzelnen Neurons.
2. Führt danach das Netz aus OR, NAND und AND aus.
3. Erklärt anhand einer Eingabe, wie die Zwischenschicht zur Ausgabe beiträgt.

Haltet eure Erkenntnisse auf dieser Kursseite fest.
