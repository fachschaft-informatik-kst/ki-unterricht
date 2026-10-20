<details class="kapitel" id="netze-1" data-kurz="XOR verstehen: Wahrheitstabelle, Trennlinie, widersprüchliche Bedingungen und eigenes Experiment." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Das XOR-Problem: Warum reicht ein Neuron nicht?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Neue Herausforderung:</strong> In Doppellektion 3 konnten Sie AND und OR mit einem einzelnen Neuron einstellen. Gelingt das bei der folgenden Regel auch? Notieren Sie zuerst Ihre Vermutung. Untersuchen Sie danach das XOR-Problem und anschliessend das mehrschichtige Netz.</p>
    <p><strong>XOR</strong> (exklusives Oder) gibt 1, wenn <strong>genau eine</strong> der beiden Eingaben 1 ist. Beispiel: Ein Modus startet, wenn genau eine von zwei Tasten gedrückt ist. Wir prüfen, ob sich auch diese Regel mit Gewichten und Bias eines einzelnen Neurons darstellen lässt.</p>
    <!-- MD:START -->
### 1 · XOR kennenlernen: eine neue Regel
<!-- MD:END -->
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Eingabe 1</th>
            <th>Eingabe 2</th>
            <th>AND</th>
            <th>OR</th>
            <th>XOR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>0</th>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <th>0</th>
            <td>1</td>
            <td>0</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>1</th>
            <td>0</td>
            <td>0</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>1</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td><strong>0</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- MD:START -->
Vergleichen Sie die vier Eingaben: XOR und OR unterscheiden sich nur in der letzten Zeile. Bei (1, 1) soll XOR 0 ausgeben.
<!-- MD:END -->
    <!-- MD:START -->
### 2 · Das Bild: die vier Fälle als Punkte
<!-- MD:END -->
    <figure class="concept-figure">
      <img alt="Links die Wahrheitstabelle von XOR, rechts die vier Fälle als Punkte in einem Quadrat. Die beiden Punkte mit Ausgabe 1 liegen diagonal gegenüber, die beiden mit Ausgabe 0 auf der anderen Diagonale. Senkrechte, waagrechte und schräge gestrichelte Linien trennen die Farben nicht." loading="lazy" src="grafiken/xor_gerade.svg"/>
      <figcaption>Egal ob senkrecht, waagrecht oder schräg: Keine gerade Linie trennt die roten von den blauen Punkten.</figcaption>
    </figure>
    <p>Warum eine <em>Gerade</em>? Die Grenze zwischen «feuert» und «feuert nicht» liegt dort, wo Summe + Bias genau 0 ist: w₁·x₁ + w₂·x₂ + b = 0. Das ist die Gleichung einer geraden Linie. Gewichte drehen sie, der Bias verschiebt sie. Auf der einen Seite feuert das Neuron, auf der anderen nicht. Bei AND liegt der einzige 1-Punkt (1, 1) allein in einer Ecke: Eine Linie kann ihn abtrennen. Bei XOR liegen die 1-Punkte diagonal gegenüber.</p>
    <!-- MD:START -->
### 3 · Die Rechnung: vier Bedingungen, die sich widersprechen
<!-- MD:END -->
    <!-- MD:START -->
Jede Zeile ist eine Bedingung an w₁, w₂ und b (Ausgabe 1 heisst Summe ≥ 0, Ausgabe 0 heisst Summe &lt; 0):
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
    <!-- MD:START -->
**Fazit:** Für das einzelne Neuron gibt es **keine Kombination aus Gewichten und Bias**, die alle vier XOR-Fälle korrekt unterscheidet. Die vier Bedingungen widersprechen sich. Eine andere Lernrate oder mehr Trainingsrunden können diese grundsätzliche Grenze nicht aufheben.

**Jetzt selbst überprüfen:** Öffnen Sie das eigenständige XOR-Notebook. Ändern Sie Gewichte und Bias und vergleichen Sie die **vier Neuron-Grafiken**. Halten Sie fest, wie viele Fälle Ihre beste Einstellung richtig löst. Danach geht es im nächsten Kapitel um einen Lösungsweg mit mehreren Neuronen.
<!-- MD:END -->
    <button class="btn primary" data-lab="xor_einzelne_neuronen.ipynb">XOR mit einem Neuron ausprobieren ▶</button>
    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-answer="hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>
    <label class="field answer"><span>Welche Bedingungen lassen sich nicht gleichzeitig erfüllen? Weshalb löst eine andere Lernrate das Problem nicht?</span><textarea data-answer="xor_warum" maxlength="10000" placeholder="Die Bedingungen für (0, 1), (1, 0) und (1, 1) …" rows="4"></textarea></label>
  </div>
</details>