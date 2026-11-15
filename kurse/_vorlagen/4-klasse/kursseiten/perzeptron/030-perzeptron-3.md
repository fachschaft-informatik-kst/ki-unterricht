<details class="kapitel" id="perzeptron-3" data-kurz="Sonne und Freund:innen: mit Gewichten und Bias vier Situationen berechnen." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Das künstliche Neuron</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
### Drei Schwimmbad-Regeln ausprobieren

Wir bleiben beim Schwimmbad. Für vier übersichtliche Fälle nehmen wir an: **Morgen ist keine Prüfung (P = 0)**. Wir betrachten nur **Sonne (S = x₁)** und **Freund:innen (F = x₂)**. 1 bedeutet Ja, 0 bedeutet Nein. Wir testen bewusst **neue, vereinfachte Entscheidungsregeln** – nicht die ursprüngliche Einstellung mit drei Eingaben.

| S | F | Nur beide (AND) | Mindestens eine (OR) | Nicht beide (NAND) |
|:--:|:--:|:--:|:--:|:--:|
| 0 | 0 | 0 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | **1** | 1 | **0** |

**AND** bedeutet: Schwimmen nur bei Sonne **und** Freund:innen. **OR**: Sonne **oder** Freund:innen genügt. **NAND** ist die umgekehrte AND-Antwort; wir brauchen sie später als Zwischenentscheidung.

### Wie rechnet das Neuron?

Jede Eingabe wird mit ihrem **Gewicht** multipliziert, dann wird der **Bias** addiert. Ist die Summe **mindestens 0**, antwortet das Neuron mit **1 (Ja)**, sonst mit **0 (Nein)**.
<!-- MD:END -->
    <div class="process">
      <span>Eingaben × Gewichte</span><b>+</b><span>Bias</span><b>→</b><span>Summe ≥ 0? <strong>Ja / Nein</strong></span>
    </div>
    <p><strong>Beispiel: nur bei beiden schwimmen (AND).</strong> Wir wählen w₁ = 1, w₂ = 1 und b = −1.5. Diese Werte gelten für alle vier Situationen:</p>
    <!-- MD:START -->
| Sonne / Freund:innen | Summe | Neuron / Ziel |
|:---:|:---|:---:|
| (0, 0) | 0 + 0 − 1.5 = **−1.5** | 0 / 0 ✓ |
| (0, 1) | 0 + 1 − 1.5 = **−0.5** | 0 / 0 ✓ |
| (1, 0) | 1 + 0 − 1.5 = **−0.5** | 0 / 0 ✓ |
| (1, 1) | 1 + 1 − 1.5 = **+0.5** | 1 / 1 ✓ |

Die Gewichte und der Bias bleiben beim **Prüfen** der vier Fälle gleich. Beim **Lernen** dürfen sie sich ändern – das zeigt Kapitel 4.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/perzeptron_und_neuronale_netze.ipynb" data-title="Neuron-Labor · Doppellektion 3">
      <!-- MD:START -->
### Jupyter-Notebook · Neuron-Labor · Doppellektion 3
<!-- MD:END -->
      <!-- MD:START -->
Probieren Sie die Werte nun selbst aus. Öffnen Sie das Notebook direkt hier, bearbeiten Sie Python-Zellen und führen Sie diese mit Shift + Enter aus.
<!-- MD:END -->
      <a class="ki-notebook-direct" href="https://fachschaft-informatik-kst.github.io/ki-unterricht/lab/index.html?path=portal/perzeptron_und_neuronale_netze.ipynb" target="_blank" rel="noopener noreferrer">Notebook in JupyterLite öffnen ↗</a>
    </div>
  </div>
</details>