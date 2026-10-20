<details class="kapitel" id="netze-1" data-kurz="XOR neu entdecken, die Grenze eines Neurons prüfen und die Zwischenschicht als Lösung verstehen." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Warum brauchen wir mehrere Neuronen? Das XOR-Problem</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Neue Herausforderung:</strong> In Doppellektion 3 konnten Sie AND und OR mit einem einzelnen Neuron einstellen. Gelingt das bei der folgenden Regel auch? Prüfen Sie zuerst Ihre Vermutung, bevor Sie die Erklärung und das mehrschichtige Netz untersuchen.</p>

    <p><strong>XOR</strong> (exklusives Oder) gibt 1, wenn <strong>genau eine</strong> der beiden Eingaben 1 ist. Beispiel: Ein Modus startet, wenn genau eine von zwei Tasten gedrückt ist. Das Neuron lernt auch hier nach derselben Regel wie bei AND, und trotzdem kommt es nie ans Ziel.</p>
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
    <p>Es gibt also <strong>keine</strong> Gewichte und keinen Bias, die alle vier Zeilen erfüllen. Das liegt nicht an der Lernregel und auch nicht an der Lernrate: Keine Lernregel der Welt kann Zahlen finden, die es nicht gibt. Im Notebook probieren Sie Gewichte und Bias mit vier sichtbaren Einzelneuronen aus.</p>
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
Überprüfen Sie diese Lösung jetzt im Notebook «Mehrere Neuronen kombinieren».
<!-- MD:END -->
    <label class="field answer"><span>Aufgabe: Welche der vier Bedingungen widersprechen sich, und was bedeutet das für die Lernregel? Erklären Sie es mit Ihren eigenen Worten.</span><textarea data-answer="xor_warum" maxlength="10000" placeholder="Die Bedingungen für (0, 1), (1, 0) und (1, 1) …" rows="4"></textarea></label>

    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-answer="hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>

    <h3>5 · Das mehrschichtige Netz nachvollziehen</h3>

    <figure class="concept-figure">
      <img alt="Zwei Eingaben, zwei Zwischenneuronen und ein Ausgabeneuron mit Gewichten und Bias." loading="lazy" src="grafiken/merhschichtiges_netzwerk.svg"/>
      <figcaption>Die versteckte Schicht bildet Zwischenergebnisse. Im Notebook verfolgen Sie damit die XOR-Entscheidung.</figcaption>
    </figure>
    <div class="process">
      <span>Eingabe</span><b>→</b><span>Versteckte Schicht</span><b>→</b><span>Ausgabe</span>
    </div>
    <!-- MD:START -->
Prüfen Sie für (1, 0): Was antworten OR und NAND? Was entsteht, wenn der Ausgang beide Antworten mit AND kombiniert?
<!-- MD:END -->
    <details>
      <summary>Beispielgrafik – sofort verfügbar</summary>
      <div class="detail-body">
        <!-- MD:START -->
Vorberechnetes Beispiel mit den Grundeinstellungen. Ihr interaktiver Versuch kann andere Ergebnisse zeigen.
<!-- MD:END -->
        <img alt="Beispielausgabe: xor" loading="lazy" src="previews/xor.png" style="max-width:100%;height:auto"/>
      </div>
    </details>
    <button class="btn primary" data-lab="mehrschichtige_netze.ipynb">XOR-Netz starten ▶</button>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll: XOR-Netz lernen
<!-- MD:END -->
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Versteckte Neuronen (Startwert 1)</th>
              <th>Zeilen richtig (von 4)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td><select data-answer="xornetz_1" aria-label="1 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>2</th>
              <td><select data-answer="xornetz_2" aria-label="2 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>4</th>
              <td><select data-answer="xornetz_4" aria-label="4 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Bei 2 Neuronen, Startwerte 0 bis 5</th>
              <th>Ihre Beobachtung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Gelingt es immer?</th>
              <td><select data-answer="xornetz_start" aria-label="Gelingt es bei jedem Startwert?"><option value="">–</option><option value="immer">Ja, immer</option><option value="manchmal">Nur bei manchen Startwerten</option><option value="nie">Nie</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <label class="field answer"><span>Wie viele versteckte Neuronen braucht ein Netz für XOR mindestens? Was verändert der Startwert?</span><textarea data-answer="xornetz_beob" maxlength="10000" placeholder="Mindestens … Der Startwert …" rows="3"></textarea></label>
    </div>
  </div>
</details>