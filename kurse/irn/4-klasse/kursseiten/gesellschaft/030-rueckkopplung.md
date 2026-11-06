<details class="kapitel" id="rueckkopplung" data-kurz="Entscheidungen verändern die Realität, erzeugen neue Daten und bestätigen das Modell." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Rückkopplung: Das Modell bestätigt sich selbst</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein besonders tückisches Muster ist die <strong>Rückkopplung (Feedback Loop)</strong>: Entscheidungen des Modells verändern die Realität. Daraus entstehen neue Daten. Diese Daten «bestätigen» das Modell, und die Ungleichheit kann verstärkt werden.</p>
    <figure class="concept-figure">
      <img alt="Gedankenexperiment als Kreis aus vier Kästen: 1 Das Modell entscheidet, 2 Die Realität verändert sich, 3 Neue Daten entstehen, 4 Das Modell bestätigt sich, danach wieder zu 1." loading="lazy" src="grafiken/rueckkopplung.svg"/>
      <figcaption>Gedankenexperiment mit vereinfachten Annahmen, kein gemessener Fall: Das Modell lehnt Anträge aus einem Quartier ab. Dort fehlt dann Geld, es gibt mehr Zahlungsprobleme, und das Modell sieht sich bestätigt.</figcaption>
    </figure>
    <p><strong>Warum das so schwer zu erkennen ist:</strong> Das Modell erfährt nie, was aus den abgelehnten Personen geworden wäre. Es sieht nur die Folgen seiner eigenen Entscheidungen. Von aussen sieht es deshalb aus, als hätte es recht. Solche Schleifen wurden zum Beispiel für Vorhersagesysteme der Polizei modelliert (Ensign et al. 2018: «Runaway Feedback Loops in Predictive Policing»); die Kette oben ist ein vereinfachtes Beispiel.</p>
    <label class="field answer"><span>Erzählen Sie die Schleife an Ihrem Fall in vier Sätzen: Das Modell entscheidet …, dadurch verändert sich …, neue Daten zeigen …, das Modell bestätigt sich, weil …</span><textarea data-answer="loop_text" maxlength="10000" placeholder="Das Modell entscheidet … Dadurch … Neue Daten … Darum …" rows="4"></textarea></label>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Frage</th>
            <th>Ihre Antwort</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Wo können Sie die Schleife unterbrechen?</th>
            <td><select data-answer="loop_bruch" aria-label="Wo unterbrechen"><option value="">–</option><option value="daten">Mit Gegenproben auch bei abgelehnten Fällen Daten sammeln</option><option value="mensch">Bei Zweifel entscheidet ein Mensch</option><option value="pruefen">Das Modell regelmässig an neuen Gruppen prüfen</option><option value="einspruch">Betroffenen einen Einspruch ermöglichen</option></select></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</details>