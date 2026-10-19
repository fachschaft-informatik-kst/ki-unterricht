<details class="kapitel" id="perzeptron-3" data-kurz="Eingaben, Gewichte, Bias, Summe, Ausgabe: das künstliche Neuron im Überblick." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Das künstliche Neuron</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
### Zuerst die Eingaben verstehen

Ein logisches Gatter erhält **zwei Eingaben**: `x₁` und `x₂`. **0** bedeutet «nein / aus», **1** bedeutet «ja / ein». Für zwei Eingaben gibt es genau **vier mögliche Kombinationen**. Die Spalten AND, OR, NAND und XOR zeigen die **gewünschte Ausgabe** – noch keine Rechnung des Neurons.

| x₁ | x₂ | AND | OR | NAND | XOR |
|:--:|:--:|:---:|:--:|:----:|:---:|
| 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 | 1 |
| 1 | 1 | **1** | 1 | **0** | **0** |

**AND:** beide aktiv · **OR:** mindestens eine aktiv · **NAND:** Gegenteil von AND · **XOR:** genau eine aktiv.

Für den ersten Versuch verwenden wir **AND** als Ziel: Ein Warnsignal soll **nur dann** leuchten, wenn beide Sensoren aktiv sind. Das Perzeptron soll diese vier Ausgaben durch eine Rechnung erzeugen.

### Was rechnet das Perzeptron?

Die Eingaben werden nicht einfach addiert: Jede wird mit ihrem **Gewicht** multipliziert; anschliessend kommt der **Bias** dazu. Die Summe `s` entscheidet: **s ≥ 0 → Ausgabe 1**, sonst **Ausgabe 0**.
<!-- MD:END -->
    <figure class="concept-figure">
      <img alt="Eingaben, Gewichte und Bias führen über Summe und Step-Funktion zur Ausgabe." loading="lazy" src="grafiken/perzeptron.svg"/>
      <figcaption>Von links nach rechts: Eingaben gewichten, Bias addieren, Ausgabe bestimmen. Die feste Eingabe 1 trägt den Bias bei.</figcaption>
    </figure>
    <div class="process">
      <span>Eingaben × Gewichte</span><b>+</b><span>Bias</span><b>→</b><span>Summe ≥ 0?<br/><strong>Ausgabe 1 oder 0</strong></span>
    </div>
    <p><strong>Konkrete Einstellung für AND:</strong> Gewicht w₁ = 1, Gewicht w₂ = 1, Bias b = −1.5. So lässt sich überprüfen, ob die Ausgaben tatsächlich der AND-Spalte oben entsprechen.</p>
    <!-- MD:START -->
| Eingaben (x₁, x₂) | Rechnung → Summe s | Neuron / AND-Ziel |
|:---:|:---|:---:|
| (0, 0) · aus/aus | 0 + 0 − 1.5 = **−1.5** | **0 / 0 ✓** |
| (0, 1) · aus/ein | 0 + 1 − 1.5 = **−0.5** | **0 / 0 ✓** |
| (1, 0) · ein/aus | 1 + 0 − 1.5 = **−0.5** | **0 / 0 ✓** |
| (1, 1) · ein/ein | 1 + 1 − 1.5 = **+0.5** | **1 / 1 ✓** |
<!-- MD:END -->
    <!-- MD:START -->
**So lesen Sie die drei Spalten:** links stehen die beiden Sensor-Eingaben (0 = aus, 1 = ein), in der Mitte die Rechnung inklusive Bias. Rechts steht **Ausgabe des Neurons / gewünschtes AND-Ziel**; ✓ bedeutet Übereinstimmung. Was würde sich ändern, wenn der Bias −0.5 wäre? Probieren Sie das später im Notebook aus.
<!-- MD:END -->
  </div>
</details>