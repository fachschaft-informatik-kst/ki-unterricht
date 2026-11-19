<details class="kapitel" id="lernarten-arten" data-kurz="Lernende Systeme lernen überwacht, unüberwacht oder verstärkend; entscheidend ist das Lernsignal." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Die drei Lernarten</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein <strong>lernendes System</strong> baut seinen Erfahrungsschatz aus Beispielen auf. Je nachdem, welche Information es dabei erhält, unterscheidet man drei <strong>Lernarten</strong>: <strong>überwachtes</strong>, <strong>unüberwachtes</strong> und <strong>verstärkendes Lernen</strong>. Entscheidend ist das <strong>Lernsignal</strong>, also woraus das System lernt: aus Beispielen mit richtiger Antwort, nur aus den Daten selbst oder aus Rückmeldungen auf seine Handlungen.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Überwachtes Lernen</strong><span>Lernsignal: Labels (richtige Antworten)</span></p>
      <img src="grafiken/lernart_ueberwacht.png" alt="Überwachtes Lernen in drei Schritten: 1. beschriftete Eingaben erhalten, 2. Regeln finden, die bekannte Eingaben richtig beschriften, 3. neue Eingaben entsprechend der gefundenen Regeln beschriften." loading="lazy"/>
    </figure>
    <p>Das System erhält Trainingsdaten, die bereits richtig <strong>beschriftet</strong> sind. Diese Beschriftungen heissen <strong>Labels</strong>, zum Beispiel E-Mails mit dem Label «Spam» oder «kein Spam». Es sucht Regeln, mit denen es die bekannten Beispiele richtig zuordnet, und wendet diese Regeln danach auf neue, unbeschriftete Eingaben an. Mit Testdaten lässt sich überprüfen, wie gut das gelingt. Wie gut das System wird, hängt stark von den Beispielen ab: Gibt es für jede Kategorie genügend, möglichst unterschiedliche Beispiele? <em>Beispiele:</em> Spamfilter, Bilderkennung, Ihr Bildprojekt.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Unüberwachtes Lernen</strong><span>Lernsignal: Ähnlichkeit in den Daten</span></p>
      <img src="grafiken/lernart_unueberwacht.png" alt="Unüberwachtes Lernen in drei Schritten: 1. unbeschriftete Eingaben erhalten, 2. Ähnlichkeiten in den Eingaben erkennen und Muster finden, 3. in der Eingabe Gruppen und Ausreisser identifizieren." loading="lazy"/>
    </figure>
    <p>Das System erhält Daten <strong>ohne Labels</strong>. Niemand sagt ihm, welche Gruppen es gibt. Es sucht selbstständig nach <strong>Ähnlichkeiten und Mustern</strong> und bildet daraus Gruppen; Daten, die zu keiner Gruppe passen, fallen als <strong>Ausreisser</strong> auf. So können auch Zusammenhänge entdeckt werden, die bisher niemandem aufgefallen sind. <em>Beispiele:</em> Kundinnen und Kunden eines Streamingdienstes nach ähnlichem Verhalten gruppieren, auffällige Buchungen in einem Unternehmen erkennen.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Verstärkendes Lernen</strong><span>Lernsignal: Rückmeldung (Belohnung oder Bestrafung)</span></p>
      <img src="grafiken/lernart_verstaerkend.png" alt="Verstärkendes Lernen als Kreislauf: 1. Zustand erfassen, 2. Aktion wählen und durchführen, 3. Belohnung oder Bestrafung erhalten, 4. Strategie anpassen, dann wieder von vorn." loading="lazy"/>
    </figure>
    <p>Das System <strong>handelt</strong> und erhält danach eine <strong>Rückmeldung</strong>: eine Belohnung, wenn die Handlung gut war, oder eine Bestrafung (eine negative Belohnung), wenn nicht. Es erfasst den Zustand, wählt eine Aktion, bewertet das Ergebnis und passt seine <strong>Strategie</strong> an, damit es möglichst viele Belohnungen erhält. Dieser Kreislauf wiederholt sich viele Male. Die Lernart eignet sich, wenn sich automatisch prüfen lässt, ob eine Entscheidung gut war. <em>Beispiele:</em> Strategiespiele wie NIM, eine Ampelsteuerung, die Wartezeiten verringern soll.</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Lernart</th>
            <th>Woraus lernt das System?</th>
            <th>Beispiel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Überwacht</th>
            <td>Aus Beispielen mit richtiger Antwort (Labels).</td>
            <td>Spamfilter, Bilderkennung</td>
          </tr>
          <tr>
            <th>Unüberwacht</th>
            <td>Aus Ähnlichkeiten in Daten ohne Labels.</td>
            <td>Kundengruppen, auffällige Buchungen</td>
          </tr>
          <tr>
            <th>Verstärkend</th>
            <td>Aus Belohnung oder Bestrafung nach eigenen Handlungen.</td>
            <td>Strategiespiele, Ampelsteuerung</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="small muted">Grafiken: Stefan Seegerer, Tilman Michaeli, Sven Jatzlau, <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>, über <a href="https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/lernarten" target="_blank" rel="noopener noreferrer">inf-schule.de</a>.</p>
  </div>
</details>
