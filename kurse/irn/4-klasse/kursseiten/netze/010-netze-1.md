<details class="kapitel" id="netze-1" data-kurz="XOR verstehen: Wahrheitstabelle, Rätsel im Notebook, Trennlinie und die Rechnung dazu." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Das XOR-Problem: Warum reicht ein Neuron nicht?</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Neue Schwimmbadregel:</strong> Die drei Eingaben bleiben Sonne (S), Freund:innen (F) und Prüfung morgen (P). Unsere neue Schwimmbadregel lautet: <strong>Schwimmen, wenn genau eine der Bedingungen Sonne oder Freund:innen erfüllt ist und morgen keine Prüfung stattfindet.</strong> Das Teilproblem bei <strong>P = 0</strong> heisst <strong>XOR</strong> (exklusives Oder). Zuerst untersuchen wir dafür die vier Kombinationen von S und F; im nächsten Kapitel ergänzen wir die Prüfung als echte Entscheidungseingabe.</p>
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
Nur Sonne oder nur Freund:innen führt hier zu Ja. Bei beiden zusammen (1, 1) lautet die bewusst neue Regel Nein – anders als bei OR.
<!-- MD:END -->
    <!-- MD:START -->
### 2 · Das Rätsel: Schafft ein Neuron alle vier Fälle?
<!-- MD:END -->
    <!-- MD:START -->
**Erst vermuten, dann prüfen:** Wie viele der vier XOR-Fälle schafft Ihrer Meinung nach ein einzelnes Neuron mit der besten Einstellung? Notieren Sie Ihre Vermutung. Öffnen Sie dann das eigenständige XOR-Notebook, ändern Sie Gewichte und Bias und vergleichen Sie die **vier Neuron-Grafiken**. Halten Sie fest, wie viele Fälle Ihre beste Einstellung richtig löst.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/xor_einzelne_neuronen.ipynb" data-title="XOR mit einem Neuron">
      <!-- MD:START -->
### Jupyter-Notebook · XOR mit einem Neuron
<!-- MD:END -->
      <!-- MD:START -->
Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.
<!-- MD:END -->
      <button type="button" class="ki-notebook-launch" data-lab="xor_einzelne_neuronen.ipynb">Notebook hier öffnen</button>
    </div>
    <label class="field answer"><span>Protokoll: Wie viele der vier XOR-Fälle schafft Ihr einzelnes Neuron mit der besten Einstellung?</span><select data-answer="hand_xor_max" aria-label="XOR: höchste Zahl richtiger Zeilen"><option value="">–</option><option value="0">höchstens 0 von 4</option><option value="1">höchstens 1 von 4</option><option value="2">höchstens 2 von 4</option><option value="3">höchstens 3 von 4</option><option value="4">höchstens 4 von 4</option></select></label>
    <p><strong>Ein Versuch mit nur einem Neuron:</strong> Wir wählen für Sonne und Freund:innen je das Gewicht +1, für Prüfung −2 und einen Bias von −0,5. Damit gelingt die OR-Regel – aber bei XOR ist der Fall «beide sind 1» falsch. Die Zeichnung zeigt diese konkrete Fehlentscheidung, noch nicht den Beweis, dass keine andere Einstellung funktioniert.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-xor">
      <img class="neuron-graphic-desktop" alt="Drei Eingaben wie in der Repetition: Sonne 1, Freund:innen 1 und Prüfung morgen 0. Die Gewichte sind +1, +1 und −2; für P = 0 fällt der Prüfungsterm weg, bei P = 1 wirkt die negative Verbindung. Der Bias ist −0,5. Die Ausgabe für Sonne 1 und Freund:innen 1 ist Ja, die künstliche XOR-Zielregel verlangt aber Nein. Diese Einstellung liefert drei korrekte und einen falschen Fall." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron.svg"/>
      <img class="neuron-graphic-mobile" alt="Kompakte Netzwerkansicht wie beim Schwimmbad-Neuron: Sonne 1, Freund:innen 1, Prüfung 0, Gewichte und Bias. Die Ausgabe Ja ist beim XOR-Ziel Nein falsch; bei P = 1 würde das Prüfungsgewicht −2 die Ausgabe hemmen." loading="lazy" src="grafiken/schwimmbad_xor_einzelne_neuron_mobil.svg"/>
      <figcaption>Das bekannte Schwimmbad-Neuron: Prüfung steht in diesem Teilversuch auf 0; diese Einstellung löst drei der vier XOR-Fälle. Warum es mit keiner Einstellung alle vier schafft, zeigt die Punktgrafik im nächsten Abschnitt.</figcaption>
    </figure>
    <!-- MD:START -->
### 3 · Das Bild: die vier Fälle als Punkte
<!-- MD:END -->
    <figure class="concept-figure neuron-detail-figure neuron-detail-separation">
      <img class="neuron-graphic-desktop" alt="Links die Wahrheitstabelle von XOR, rechts die vier Fälle als Punkte in einem Quadrat. Die beiden Punkte mit Ausgabe 1 liegen diagonal gegenüber, die beiden mit Ausgabe 0 auf der anderen Diagonale. Senkrechte, waagrechte und schräge gestrichelte Linien trennen die Farben nicht." loading="lazy" src="grafiken/xor_gerade.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile XOR-Tabelle und Punktegrafik: Die beiden Ja-Fälle liegen diagonal und können nicht mit einer einzelnen geraden Linie von den Nein-Fällen getrennt werden." loading="lazy" src="grafiken/xor_gerade_mobil.svg"/>
      <figcaption>Egal ob senkrecht, waagrecht oder schräg: Keine gerade Linie trennt die roten von den blauen Punkten.</figcaption>
    </figure>
    <p>Warum eine <em>Gerade</em>? Die Grenze zwischen «feuert» und «feuert nicht» liegt dort, wo Summe + Bias genau 0 ist: w₁·x₁ + w₂·x₂ + b = 0. Das ist die Gleichung einer geraden Linie. Gewichte drehen sie, der Bias verschiebt sie. Auf der einen Seite feuert das Neuron, auf der anderen nicht. Bei der Schwimmbadregel AND («nur bei Sonne und Freund:innen») liegt der einzige Ja-Punkt in einer Ecke: Eine Linie kann ihn abtrennen. Bei XOR liegen die 1-Punkte diagonal gegenüber.</p>
    <!-- MD:START -->
**Fazit:** Für das einzelne Neuron gibt es **keine Kombination aus Gewichten und Bias**, die alle vier XOR-Fälle korrekt unterscheidet: Keine Gerade trennt die diagonal liegenden Punkte. Eine andere Lernrate oder mehr Trainingsrunden können diese grundsätzliche Grenze nicht aufheben.
<!-- MD:END -->
    <details>
      <summary>Die Rechnung dazu: vier Bedingungen, die sich widersprechen</summary>
      <div class="detail-body">
    <!-- MD:START -->
Schreiben Sie zuerst für jede Zeile selbst die Bedingung an w₁, w₂ und b auf, bevor Sie die Tabelle ansehen. Jede Zeile ist eine Bedingung (Ausgabe 1 heisst Summe ≥ 0, Ausgabe 0 heisst Summe &lt; 0):
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
Danach geht es im nächsten Kapitel um einen Lösungsweg mit mehreren Neuronen.
<!-- MD:END -->
    <label class="field answer"><span>Warum kann keine Einstellung alle vier Schwimmbadfälle der XOR-Regel schaffen? Begründen Sie mit den Punkten (Gerade) und mit den vier Bedingungen. Weshalb löst eine andere Lernrate das Problem nicht?</span><textarea data-answer="xor_warum" maxlength="10000" placeholder="Die beiden 1-Punkte liegen diagonal gegenüber, deshalb …" rows="4"></textarea></label>
  </div>
</details>