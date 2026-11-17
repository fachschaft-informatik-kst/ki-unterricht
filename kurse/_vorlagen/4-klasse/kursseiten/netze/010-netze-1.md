<details class="kapitel" id="netze-1" data-kurz="XOR verstehen: Wahrheitstabelle, Rätsel im Notebook, Trennlinie und die Rechnung dazu." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Das XOR-Problem: Warum reicht ein Neuron nicht?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Neue Schwimmbadregel:</strong> Schwimmen, wenn <strong>genau eine</strong> Bedingung erfüllt ist – Sonne (S) oder Freund:innen (F) – <strong>und keine Prüfung (P)</strong> ansteht. Bei <strong>P = 0</strong> heisst das <strong>XOR</strong>. Erst prüfen wir vier S/F-Fälle, dann ergänzen wir P.</p>
    <!-- MD:START -->
### 1 · XOR kennenlernen: eine neue Regel
<!-- MD:END -->
    <div class="table-scroll">
      <table class="typen">
        <thead><tr><th>Sonne (S)</th><th>Freund:innen (F)</th><th>Schwimmen? (XOR)</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>0</td><td>1</td><td>1</td></tr>
          <tr><td>1</td><td>0</td><td>1</td></tr>
          <tr><td>1</td><td>1</td><td>0</td></tr>
        </tbody>
      </table>
    </div>
    <!-- MD:START -->
Nur Sonne oder nur Freund:innen führt zu Ja; anders als bei OR gilt für (1, 1) **Nein**.
<!-- MD:END -->
    <!-- MD:START -->
### 2 · Das Rätsel: Schafft ein Neuron alle vier Fälle?
<!-- MD:END -->
    <!-- MD:START -->
**Notebook-Rätsel:** Schätzen Sie, wie viele XOR-Fälle ein Neuron löst. Testen Sie Gewichte und Bias an den vier Grafiken und notieren Sie Ihr bestes Ergebnis.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/xor_einzelne_neuronen.ipynb" data-title="XOR mit einem Neuron">
      <!-- MD:START -->
### Jupyter-Notebook · XOR mit einem Neuron
<!-- MD:END -->
      <!-- MD:START -->
Öffnen Sie das Notebook und führen Sie Zellen mit Shift + Enter aus.
<!-- MD:END -->
      <button type="button" class="ki-notebook-launch" data-lab="xor_einzelne_neuronen.ipynb">Notebook hier öffnen</button>
    </div>
    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-answer="hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>
    <p><strong>Versuch:</strong> S und F erhalten je +1, P erhält −2, der Bias −0,5. Damit stimmt OR, aber nicht XOR: Bei (1, 1) sagt das Neuron Ja statt Nein. Die Grafik zeigt diesen Fehler, noch keinen allgemeinen Beweis.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-xor">
      <img class="neuron-graphic-desktop" alt="Drei Eingaben wie in der Repetition: Sonne 1, Freund:innen 1 und Prüfung morgen 0. Die Gewichte sind +1, +1 und −2; für P = 0 fällt der Prüfungsterm weg, bei P = 1 wirkt die negative Verbindung. Der Bias ist −0,5. Die Ausgabe für Sonne 1 und Freund:innen 1 ist Ja, die künstliche XOR-Zielregel verlangt aber Nein. Diese Einstellung liefert drei korrekte und einen falschen Fall." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron.svg"/>
      <img class="neuron-graphic-mobile" alt="Kompakte Netzwerkansicht wie beim Schwimmbad-Neuron: Sonne 1, Freund:innen 1, Prüfung 0, Gewichte und Bias. Die Ausgabe Ja ist beim XOR-Ziel Nein falsch; bei P = 1 würde das Prüfungsgewicht −2 die Ausgabe hemmen." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron_mobil.svg"/>
      <figcaption>Bei P = 0 erfüllt diese Einstellung drei von vier XOR-Fällen; die Punktgrafik erklärt die Grenze.</figcaption>
    </figure>
    <!-- MD:START -->
### 3 · Das Bild: die vier Fälle als Punkte
<!-- MD:END -->
    <figure class="concept-figure neuron-detail-figure neuron-detail-separation">
      <img class="neuron-graphic-desktop" alt="Links die Wahrheitstabelle von XOR, rechts die vier Fälle als Punkte in einem Quadrat. Die beiden Punkte mit Ausgabe 1 liegen diagonal gegenüber, die beiden mit Ausgabe 0 auf der anderen Diagonale. Senkrechte, waagrechte und schräge gestrichelte Linien trennen die Farben nicht." loading="lazy" src="grafiken/xor_gerade.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile XOR-Tabelle und Punktegrafik: Die beiden Ja-Fälle liegen diagonal und können nicht mit einer einzelnen geraden Linie von den Nein-Fällen getrennt werden." loading="lazy" src="grafiken/xor_gerade_mobil.svg"/>
      <figcaption>Egal ob senkrecht, waagrecht oder schräg: Keine gerade Linie trennt die roten von den blauen Punkten.</figcaption>
    </figure>
    <p>Die Entscheidungsgrenze eines Neurons ist <strong>w₁·x₁ + w₂·x₂ + b = 0</strong> – eine Gerade. Gewichte drehen, der Bias verschiebt sie. Für AND ist der einzelne Ja-Punkt abtrennbar, die diagonalen XOR-Ja-Punkte jedoch nicht.</p>
    <!-- MD:START -->
**Fazit:** Kein einzelnes Neuron kann alle vier XOR-Fälle lösen: Keine Gerade trennt die Ja- von den Nein-Punkten. Mehr Lernrunden oder eine andere Lernrate helfen nicht. P ändert daran nichts, denn bei P = 0 bleibt XOR unlösbar.
<!-- MD:END -->
    <details>
      <summary>Die Rechnung dazu: vier Bedingungen, die sich widersprechen</summary>
      <div class="detail-body">
    <!-- MD:START -->
Stellen Sie für jede Tabellenzeile die Bedingung auf: Ausgabe 1 verlangt Summe ≥ 0, Ausgabe 0 Summe &lt; 0.
<!-- MD:END -->
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Eingabe</th>
            <th>Ziel</th>
            <th>Bedingung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>(0, 0)</th>
            <td>0</td>
            <td>b &lt; 0</td>
          </tr>
          <tr>
            <th>(0, 1)</th>
            <td>1</td>
            <td>w₂ + b ≥ 0</td>
          </tr>
          <tr>
            <th>(1, 0)</th>
            <td>1</td>
            <td>w₁ + b ≥ 0</td>
          </tr>
          <tr>
            <th>(1, 1)</th>
            <td>0</td>
            <td>w₁ + w₂ + b &lt; 0</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ol>
      <li>Zählen Sie die beiden mittleren Bedingungen zusammen: (w₂ + b) + (w₁ + b) ≥ 0, also <strong>w₁ + w₂ + 2b ≥ 0</strong>.</li>
      <li>Das heisst: w₁ + w₂ + b ≥ −b.</li>
      <li>Aus der ersten Bedingung wissen wir b &lt; 0, also ist −b positiv. Daraus folgt <strong>w₁ + w₂ + b &gt; 0</strong>.</li>
      <li>Die vierte Bedingung verlangt aber <strong>w₁ + w₂ + b &lt; 0</strong>. Das ist ein Widerspruch.</li>
    </ol>
      </div>
    </details>
    <!-- MD:START -->
Kapitel 2 zeigt die Lösung mit mehreren Neuronen.
<!-- MD:END -->
    <label class="field answer"><span>Warum kann keine Einstellung alle vier Schwimmbadfälle der XOR-Regel schaffen? Begründen Sie mit den Punkten (Gerade) und mit den vier Bedingungen. Weshalb löst eine andere Lernrate das Problem nicht?</span><textarea data-answer="xor_warum" maxlength="10000" placeholder="Die beiden 1-Punkte liegen diagonal gegenüber, deshalb …" rows="4"></textarea></label>
  </div>
</details>