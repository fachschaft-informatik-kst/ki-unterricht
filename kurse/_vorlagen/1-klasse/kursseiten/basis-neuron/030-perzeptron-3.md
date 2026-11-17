<details class="kapitel" id="perzeptron-3" data-kurz="Sonne und Freund:innen: mit Gewichten und Bias vier Situationen berechnen." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Das künstliche Neuron</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
### Drei Schwimmbad-Regeln ausprobieren

Für diese vereinfachten Regeln gilt **P = 0** (keine Prüfung). Nur **Sonne (S = x₁)** und **Freund:innen (F = x₂)** entscheiden, jeweils mit 0 oder 1. Wir testen andere Regeln als beim ursprünglichen Schwimmbad-Neuron.

| S | F | Nur beide (AND) | Mindestens eine (OR) | Nicht beide (NAND) |
|:--:|:--:|:--:|:--:|:--:|
| 0 | 0 | 0 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | **1** | 1 | **0** |

**AND:** beide Bedingungen müssen erfüllt sein. **OR:** mindestens eine genügt. **NAND:** nicht beide zugleich – später eine Zwischenentscheidung im Netz.

### Wie rechnet das Neuron?

Das Neuron multipliziert Eingaben mit ihren **Gewichten** und addiert den **Bias**. Ab Summe 0 gibt es **Ja (1)** aus, sonst **Nein (0)**.
<!-- MD:END -->
    <div class="process">
      <span>Eingaben × Gewichte</span><b>+</b><span>Bias</span><b>→</b><span>Summe ≥ 0? <strong>Ja / Nein</strong></span>
    </div>
    <p><strong>Beispiel AND:</strong> w₁ = 1, w₂ = 1, b = −1.5 – für alle vier Fälle gleich.</p>
    <!-- MD:START -->
| Sonne / Freund:innen | Summe | Neuron / Ziel |
|:---:|:---|:---:|
| (0, 0) | 0 + 0 − 1.5 = **−1.5** | 0 / 0 ✓ |
| (0, 1) | 0 + 1 − 1.5 = **−0.5** | 0 / 0 ✓ |
| (1, 0) | 1 + 0 − 1.5 = **−0.5** | 0 / 0 ✓ |
| (1, 1) | 1 + 1 − 1.5 = **+0.5** | 1 / 1 ✓ |

Beim **Prüfen** bleiben Gewichte und Bias gleich; beim **Lernen** ändern sie sich (Kapitel 4).
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/perzeptron_und_neuronale_netze.ipynb" data-title="Neuron-Labor · Doppellektion 2">
      <!-- MD:START -->
### Jupyter-Notebook · Neuron-Labor · Doppellektion 2
<!-- MD:END -->
      <!-- MD:START -->
Öffnen Sie das Notebook, passen Sie Werte an und führen Sie Python-Zellen mit Shift + Enter aus.
<!-- MD:END -->
      <a class="ki-notebook-direct" href="https://fachschaft-informatik-kst.github.io/ki-unterricht/lab/index.html?path=portal/perzeptron_und_neuronale_netze.ipynb" target="_blank" rel="noopener noreferrer">Notebook in JupyterLite öffnen ↗</a>
    </div>
  </div>
</details>