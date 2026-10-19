<details class="kapitel" id="perzeptron-6" data-kurz="Wahrheitstabelle, Punkte, Gerade und vier Bedingungen: Warum ein einzelnes Neuron XOR nie löst." open>
  <summary><span class="kapitel-nr">6</span>
    <h2 class="kapitel-titel">Warum scheitert XOR?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>XOR</strong> (exklusives Oder) gibt 1, wenn <strong>genau eine</strong> der beiden Eingaben 1 ist. Beispiel: Ein Modus startet, wenn genau eine von zwei Tasten gedrückt ist. Das Neuron lernt auch hier nach derselben Regel wie bei AND, und trotzdem kommt es nie ans Ziel.</p>
    <!-- MD:START -->
### 1 · Zur Wahrheitstabelle aus Kapitel 3 zurückkehren
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
Vergleichen Sie mit der vollständigen Gattertabelle in Kapitel 3: XOR und OR unterscheiden sich nur in der letzten Zeile: Bei (1, 1) soll XOR 0 ausgeben.
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
    <p>Es gibt also <strong>keine</strong> Gewichte und keinen Bias, die alle vier Zeilen erfüllen. Das liegt nicht an der Lernregel und auch nicht an der Lernrate: Keine Lernregel der Welt kann Zahlen finden, die es nicht gibt. Im Notebook probieren Sie es von Hand und mit einem ganzen Raster von Einstellungen aus.</p>
    <!-- MD:START -->
### 4 · Der Ausweg: mehrere Neuronen
<!-- MD:END -->
    <p>Ein einzelnes Neuron kann nur eine Gerade ziehen. Mit <strong>zwei Neuronen</strong> in einer Zwischenschicht, eines für OR und eines für NAND, und einem dritten, das beide mit AND verbindet, entsteht aus der einen Geraden ein Streifen. Dann gelingt XOR:</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Eingabe</th>
            <th>OR</th>
            <th>NAND</th>
            <th>AND von beiden = XOR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>(0, 0)</th>
            <td>0</td>
            <td>1</td>
            <td>0</td>
          </tr>
          <tr>
            <th>(0, 1)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 0)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 1)</th>
            <td>1</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- MD:START -->
Das untersuchen Sie in der nächsten Doppellektion.
<!-- MD:END -->
    <label class="field answer"><span>Aufgabe: Welche der vier Bedingungen widersprechen sich, und was bedeutet das für die Lernregel? Erklären Sie es mit Ihren eigenen Worten.</span><textarea data-answer="xor_warum" maxlength="10000" placeholder="Die Bedingungen für (0, 1), (1, 0) und (1, 1) …" rows="4"></textarea></label>
  </div>
</details>