<details class="kapitel" id="basis-neuron-1" data-kurz="Ein Neuron macht aus mehreren Zahlen eine Ja/Nein-Entscheidung. Beispiel: Gehe ich schwimmen?" open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">Wozu ein Neuron? Ein kleiner Entscheider</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Ein Neuron verarbeitet Zahlen (Eingaben)</strong> und antwortet mit <strong>1 (Ja) oder 0 (Nein)</strong>.</p>
    <p><strong>Schwimmbad-Beispiel:</strong> <strong>S</strong> = Sonne, <strong>F</strong> = Freund:innen, <strong>P</strong> = Prüfung morgen (je 1 oder 0). Sonne und Freund:innen sprechen dafür, die Prüfung dagegen. Wie stark jeder Grund zählt, bestimmen die Gewichte.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-recap">
      <img class="neuron-graphic-desktop" alt="Ein Neuron als Entscheider: Die Eingaben Sonne 1, Freund:innen 0 und Prüfung 1 werden mit den Gewichten plus 2, plus 2 und minus 4 multipliziert, summiert und mit dem Bias minus 1 verrechnet. Das Ergebnis minus 3 liegt unter 0, die Ausgabe ist Nein." loading="lazy" src="grafiken/neuron_entscheider.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Darstellung des Schwimmbad-Neurons mit Sonne 1, Freund:innen 0, Prüfung morgen 1, Gewichten plus 2, plus 2 und minus 4, Bias minus 1 und Ausgabe Nein." loading="lazy" src="grafiken/neuron_entscheider_mobil.svg"/>
      <figcaption>Beispiel: 1·2 + 0·2 + 1·(−4) − 1 = −3. Da −3 &lt; 0, lautet die Antwort <strong>Nein (0)</strong>.</figcaption>
    </figure>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Baustein</th>
            <th>Im Beispiel</th>
            <th>Bedeutung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Eingaben</th>
            <td>S, F, P (je 1 oder 0)</td>
            <td>Die Fakten der Situation</td>
          </tr>
          <tr>
            <th>Gewichte</th>
            <td>+2, +2, −4</td>
            <td>Stärke und Richtung des Einflusses; negativ wirkt dagegen.</td>
          </tr>
          <tr>
            <th>Summe</th>
            <td>S·2 + F·2 + P·(−4)</td>
            <td>Alle Gründe, gewichtet und zusammengezählt</td>
          </tr>
          <tr>
            <th>Bias</th>
            <td>−1</td>
            <td>Grundeinstellung: Ein negativer Bias verlangt stärkere Gründe für Ja.</td>
          </tr>
          <tr>
            <th>Ausgabe</th>
            <td>Ja (1) oder Nein (0)</td>
            <td>Ab Summe + Bias ≥ 0 lautet die Antwort Ja</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p><strong>In der KI</strong> können Neuronen viele Eingaben verarbeiten. Ihre Gewichte werden aus Beispielen gelernt statt von Hand festgelegt (Kapitel 4).</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Anwendung</th>
            <th>Die Ja/Nein-Frage</th>
            <th>Eingaben (Beispiele)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Spamfilter</th>
            <td>Ist diese Mail Spam?</td>
            <td>Vorkommen verdächtiger Wörter</td>
          </tr>
          <tr>
            <th>Gesichtsentsperrung</th>
            <td>Ist das die richtige Person?</td>
            <td>Helligkeitswerte der Bildpunkte</td>
          </tr>
          <tr>
            <th>Pflanzen-App</th>
            <td>Ist das Art A?</td>
            <td>Länge und Breite des Kronblatts</td>
          </tr>
          <tr>
            <th>Ihr Bildprojekt</th>
            <td>Gehört das Foto zu Klasse A?</td>
            <td>1280 Merkmale aus dem Bild</td>
          </tr>
        </tbody>
      </table>
    </div>
    <label class="field answer"><span>Aufgabe: Erklären Sie in zwei bis drei Sätzen, wofür ein Neuron da ist und was Gewichte und Bias im Schwimmbad-Beispiel bedeuten. Was geschieht, wenn das Gewicht der Prüfung auf 0 gesetzt wird?</span><textarea data-basis-answer="basis-neuron-neuron_wozu" maxlength="10000" placeholder="Ein Neuron ist dafür da, … Die Gewichte … Der Bias …" rows="4"></textarea></label>
  </div>
</details>