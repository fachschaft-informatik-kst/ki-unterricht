<details class="kapitel" id="basis-netze-1" data-kurz="XOR verstehen: Wahrheitstabelle, Trennlinie, widersprüchliche Bedingungen und eigenes Experiment." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Das XOR-Problem: Warum reicht ein Neuron nicht?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Zurück ins Schwimmbad:</strong> Wir lassen «Prüfung morgen» auf 0 und betrachten Sonne (S = x₁) und Freund:innen (F = x₂). Die neue, bewusst ungewohnte Regel lautet: <strong>Schwimmen genau dann, wenn nur eines von beiden zutrifft.</strong> Das nennt man <strong>XOR</strong> (exklusives Oder). Gelingt es einem einzelnen Neuron, diese vier Fälle richtig zu entscheiden?</p>
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
Vergleichen Sie die vier Eingaben: XOR und OR unterscheiden sich nur in der letzten Zeile. Bei (1, 1) soll XOR 0 ausgeben.
<!-- MD:END -->
    <p><strong>Ein Versuch mit nur einem Neuron:</strong> Wir wählen für Sonne und Freund:innen je das Gewicht +1 und einen Bias von −0,5. Damit gelingt die OR-Regel – aber bei XOR ist der Fall «beide sind 1» falsch. Die Zeichnung zeigt diese konkrete Fehlentscheidung, noch nicht den Beweis, dass keine andere Einstellung funktioniert.</p>
    <figure class="concept-figure neuron-detail-figure" tabindex="0" aria-label="Beschriftetes Neuronendiagramm; auf schmalen Bildschirmen horizontal scrollen">
      <img alt="Zwei Eingaben Sonne und Freund:innen gehen mit den Gewichten +1 und +1 zum einzelnen Neuron; der Bias ist −0,5. Die Ausgabe für Sonne 1 und Freund:innen 1 ist Ja, die künstliche XOR-Zielregel verlangt aber Nein. Diese Einstellung liefert drei korrekte und einen falschen Fall." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron.svg"/>
      <figcaption>Ein einzelnes Neuron mit zwei Schwimmbad-Eingaben: Diese Einstellung löst drei der vier XOR-Fälle. Warum es mit keiner Einstellung alle vier schafft, zeigt die Punktgrafik weiter unten.</figcaption>
    </figure>
    <!-- MD:START -->
### 2 · Das Bild: die vier Fälle als Punkte
<!-- MD:END -->
    <figure class="concept-figure">
      <img alt="Links die Wahrheitstabelle von XOR, rechts die vier Fälle als Punkte in einem Quadrat. Die beiden Punkte mit Ausgabe 1 liegen diagonal gegenüber, die beiden mit Ausgabe 0 auf der anderen Diagonale. Senkrechte, waagrechte und schräge gestrichelte Linien trennen die Farben nicht." loading="lazy" src="grafiken/xor_gerade.svg"/>
      <figcaption>Egal ob senkrecht, waagrecht oder schräg: Keine gerade Linie trennt die roten von den blauen Punkten.</figcaption>
    </figure>
    <p>Warum eine <em>Gerade</em>? Die Grenze zwischen «feuert» und «feuert nicht» liegt dort, wo Summe + Bias genau 0 ist: w₁·x₁ + w₂·x₂ + b = 0. Das ist die Gleichung einer geraden Linie. Gewichte drehen sie, der Bias verschiebt sie. Auf der einen Seite feuert das Neuron, auf der anderen nicht. Bei der Schwimmbadregel AND («nur bei Sonne und Freund:innen») liegt der einzige Ja-Punkt in einer Ecke: Eine Linie kann ihn abtrennen. Bei XOR liegen die 1-Punkte diagonal gegenüber.</p>
    <details class="basis-hint">
      <summary>Wahlvertiefung: die vier Bedingungen nachrechnen</summary>
      <div class="detail-body">
    <!-- MD:START -->
### Wahlvertiefung: Warum widersprechen sich die vier Bedingungen?
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
      </div>
    </details>
    <!-- MD:START -->
**Fazit:** Für das einzelne Neuron gibt es **keine Kombination aus Gewichten und Bias**, die alle vier XOR-Fälle korrekt unterscheidet. Die vier XOR-Bedingungen widersprechen sich. Eine andere Lernrate oder mehr Trainingsrunden können diese grundsätzliche Grenze nicht aufheben.

**Jetzt selbst überprüfen:** Öffnen Sie das eigenständige XOR-Notebook. Ändern Sie Gewichte und Bias und vergleichen Sie die **vier Neuron-Grafiken**. Halten Sie fest, wie viele Fälle Ihre beste Einstellung richtig löst. Danach geht es im nächsten Kapitel um einen Lösungsweg mit mehreren Neuronen.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/xor_einzelne_neuronen.ipynb" data-title="XOR mit einem Neuron">
      <!-- MD:START -->
### Jupyter-Notebook · XOR mit einem Neuron
<!-- MD:END -->
      <!-- MD:START -->
Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.
<!-- MD:END -->
      <a class="ki-notebook-launch" href="../lab/index.html?path=portal/xor_einzelne_neuronen.ipynb">Notebook hier öffnen</a>
    </div>
    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-basis-answer="basis-netze-hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>
    <label class="field answer"><span>Welche Bedingungen lassen sich nicht gleichzeitig erfüllen? Weshalb löst eine andere Lernrate das Problem nicht?</span><textarea data-basis-answer="basis-netze-xor_warum" maxlength="10000" placeholder="Die Bedingungen für (0, 1), (1, 0) und (1, 1) …" rows="4"></textarea></label>
  </div>
</details>