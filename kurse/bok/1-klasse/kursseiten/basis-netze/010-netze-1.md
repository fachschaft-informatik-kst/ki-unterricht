<details class="kapitel" id="basis-netze-1" data-kurz="XOR verstehen: Wahrheitstabelle, Trennlinie, widersprüchliche Bedingungen und eigenes Experiment." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Das XOR-Problem: Warum reicht ein Neuron nicht?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Neue Schwimmbadregel:</strong> Wir schwimmen nur, wenn <strong>genau eine</strong> Bedingung erfüllt ist – Sonne (S) oder Freund:innen (F) – <strong>und keine Prüfung (P)</strong> ansteht. Bei <strong>P = 0</strong> heisst die Regel <strong>XOR</strong>. Zuerst untersuchen wir vier S/F-Fälle, danach die Prüfungsbremse.</p>
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
XOR unterscheidet sich von OR nur bei (S, F) = (1, 1): Hier gilt **Nein (0)**.
<!-- MD:END -->
    <p><strong>Versuch:</strong> S und F erhalten je +1, P erhält −2, der Bias −0,5. Damit stimmt OR, aber nicht XOR: Bei (1, 1) sagt das Neuron Ja statt Nein. Die Grafik zeigt diesen Fehler, noch keinen allgemeinen Beweis.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-xor">
      <img class="neuron-graphic-desktop" alt="Drei Eingaben wie in der Repetition: Sonne 1, Freund:innen 1 und Prüfung morgen 0. Die Gewichte sind +1, +1 und −2; für P = 0 fällt der Prüfungsterm weg, bei P = 1 wirkt die negative Verbindung. Der Bias ist −0,5. Die Ausgabe für Sonne 1 und Freund:innen 1 ist Ja, die künstliche XOR-Zielregel verlangt aber Nein. Diese Einstellung liefert drei korrekte und einen falschen Fall." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron.svg"/>
      <img class="neuron-graphic-mobile" alt="Kompakte Netzwerkansicht wie beim Schwimmbad-Neuron: Sonne 1, Freund:innen 1, Prüfung 0, Gewichte und Bias. Die Ausgabe Ja ist beim XOR-Ziel Nein falsch; bei P = 1 würde das Prüfungsgewicht −2 die Ausgabe hemmen." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron_mobil.svg"/>
      <figcaption>Bei P = 0 erfüllt diese Einstellung drei von vier XOR-Fällen; die Punktgrafik erklärt die Grenze.</figcaption>
    </figure>
    <!-- MD:START -->
### 2 · Das Bild: die vier Fälle als Punkte
<!-- MD:END -->
    <figure class="concept-figure neuron-detail-figure neuron-detail-separation">
      <img class="neuron-graphic-desktop" alt="Links die Wahrheitstabelle von XOR, rechts die vier Fälle als Punkte in einem Quadrat. Die beiden Punkte mit Ausgabe 1 liegen diagonal gegenüber, die beiden mit Ausgabe 0 auf der anderen Diagonale. Senkrechte, waagrechte und schräge gestrichelte Linien trennen die Farben nicht." loading="lazy" src="grafiken/xor_gerade.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile XOR-Tabelle und Punktegrafik: Die beiden Ja-Fälle liegen diagonal und können nicht mit einer einzelnen geraden Linie von den Nein-Fällen getrennt werden." loading="lazy" src="grafiken/xor_gerade_mobil.svg"/>
      <figcaption>Egal ob senkrecht, waagrecht oder schräg: Keine gerade Linie trennt die roten von den blauen Punkten.</figcaption>
    </figure>
    <p>Die Entscheidungsgrenze eines Neurons ist <strong>w₁·x₁ + w₂·x₂ + b = 0</strong> – eine Gerade. Gewichte drehen, der Bias verschiebt sie. Für AND ist der einzelne Ja-Punkt abtrennbar, die beiden diagonalen XOR-Ja-Punkte jedoch nicht.</p>
    <details class="basis-hint">
      <summary>Wahlvertiefung: die vier Bedingungen nachrechnen</summary>
      <div class="detail-body">
    <!-- MD:START -->
### Wahlvertiefung: Warum widersprechen sich die vier Bedingungen?
<!-- MD:END -->
    <!-- MD:START -->
Jede Zeile fordert für Ausgabe 1 eine Summe ≥ 0 und für Ausgabe 0 eine Summe &lt; 0:
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
**Fazit:** Kein einzelnes Neuron kann alle vier XOR-Fälle lösen: Die Bedingungen widersprechen sich. Mehr Lernrunden oder eine andere Lernrate helfen nicht. Auch P ändert das nicht, denn bei P = 0 bleibt XOR unlösbar.

**Notebook:** Ändern Sie Gewichte und Bias, vergleichen Sie die vier Fälle und notieren Sie die beste Trefferzahl. In Kapitel 2 kombinieren wir mehrere Neuronen.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/xor_einzelne_neuronen.ipynb" data-title="XOR mit einem Neuron">
      <!-- MD:START -->
### Jupyter-Notebook · XOR mit einem Neuron
<!-- MD:END -->
      <!-- MD:START -->
Öffnen Sie das Notebook und führen Sie Zellen mit Shift + Enter aus.
<!-- MD:END -->
      <a class="ki-notebook-launch" href="../lab/index.html?path=portal/xor_einzelne_neuronen.ipynb">Notebook hier öffnen</a>
    </div>
    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-basis-answer="basis-netze-hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>
    <label class="field answer"><span>Welche Bedingungen lassen sich nicht gleichzeitig erfüllen? Weshalb löst eine andere Lernrate das Problem nicht?</span><textarea data-basis-answer="basis-netze-xor_warum" maxlength="10000" placeholder="Die Bedingungen für (0, 1), (1, 0) und (1, 1) …" rows="4"></textarea></label>
  </div>
</details>