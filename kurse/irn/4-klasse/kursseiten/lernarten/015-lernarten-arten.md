<details class="kapitel" id="lernarten-arten" data-kurz="Lernende Systeme lernen überwacht, unüberwacht oder verstärkend; entscheidend ist das Lernsignal.">
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Die drei Lernarten</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein <strong>lernendes System</strong> baut seinen Erfahrungsschatz aus Beispielen auf. Je nachdem, welche Information es dabei erhält, unterscheidet man drei <strong>Lernarten</strong>: <strong>überwachtes</strong>, <strong>unüberwachtes</strong> und <strong>verstärkendes Lernen</strong>. Entscheidend ist das <strong>Lernsignal</strong>, also woraus das System lernt: aus Beispielen mit richtiger Antwort, nur aus den Daten selbst oder aus Rückmeldungen auf seine Handlungen.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Überwachtes Lernen</strong><span>Lernsignal: Labels (richtige Antworten)</span></p>
      <div class="lernart-scroll"><img class="lernart-img lernart-img-ue" src="grafiken/lernart_ueberwacht.png" alt="Ablauf des überwachten Lernens: Daten sammeln, Daten labeln, Daten aufteilen in Training und Test, Training, Test mit Testdaten, Anwendung auf neue Daten. Rückpfeile: Verfahren ändern, Aufteilung ändern, Datenbasis ändern. Sprechblasen: Bias durch alte, fehlerhafte oder nicht repräsentative Daten; Datenbeschaffung legal?; Verfahren wählen und anpassen; Qualitätsermittlung; Fehlfunktion und Diskriminierung aufgrund Bias, Ergebnisse nachvollziehbar?" loading="lazy"/></div>
    </figure>
    <p>Zuerst werden <strong>Daten gesammelt</strong> und <strong>gelabelt</strong>: Jedes Beispiel erhält die richtige Antwort, das <strong>Label</strong>, zum Beispiel E-Mails mit «Spam» oder «kein Spam». Dann werden die Daten zufällig in <strong>Trainings- und Testdaten aufgeteilt</strong>. Im <strong>Training</strong> sucht das System Regeln, mit denen es die Trainingsdaten richtig zuordnet. Mit den <strong>Testdaten</strong>, die es beim Training nicht gesehen hat, wird geprüft, wie gut es ist. Genügt das Ergebnis nicht, ändert man das Verfahren, die Aufteilung oder die Datenbasis. Erst danach wird es auf <strong>neue Daten angewendet</strong>. Wichtig sind gute Daten: Alte, fehlerhafte oder nicht repräsentative Daten führen zu <strong>Bias</strong> und im schlimmsten Fall zu Fehlfunktionen oder Diskriminierung. <em>Beispiele:</em> Spamfilter, Bilderkennung, Ihr Bildprojekt.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Unüberwachtes Lernen</strong><span>Lernsignal: Ähnlichkeit in den Daten</span></p>
      <div class="lernart-scroll"><img class="lernart-img lernart-img-un" src="grafiken/lernart_unueberwacht.png" alt="Ablauf des unüberwachten Lernens: Daten sammeln, Training (Kategorien finden und Daten zuordnen), Anwendung (neue Daten zuordnen). Sprechblase beim Training: Ausreisser?" loading="lazy"/></div>
    </figure>
    <p>Das System erhält gesammelte Daten <strong>ohne Labels</strong>. Niemand sagt ihm, welche Gruppen es gibt. Im <strong>Training</strong> findet es selbstständig <strong>Kategorien</strong>, indem es nach Ähnlichkeiten und Mustern sucht, und ordnet die Daten diesen Kategorien zu. Daten, die zu keiner Kategorie passen, fallen als <strong>Ausreisser</strong> auf. In der <strong>Anwendung</strong> ordnet es neue Daten den gefundenen Kategorien zu. So können auch Zusammenhänge entdeckt werden, die bisher niemandem aufgefallen sind. <em>Beispiele:</em> Kundinnen und Kunden eines Streamingdienstes nach ähnlichem Verhalten gruppieren, auffällige Buchungen in einem Unternehmen erkennen.</p>
    <figure class="concept-figure lernart-figure">
      <p class="eva-label"><strong>Verstärkendes Lernen</strong><span>Lernsignal: Rückmeldung (Belohnung oder Bestrafung)</span></p>
      <div class="lernart-scroll"><img class="lernart-img lernart-img-ve" src="grafiken/lernart_verstaerkend.png" alt="Kreislauf des verstärkenden Lernens: Zustand erfassen, beste Aktion durchführen, Folgezustand bewerten, Güte der Aktion anpassen, dann wieder Zustand erfassen." loading="lazy"/></div>
    </figure>
    <p>Das System lernt durch <strong>Handeln</strong> in einem Kreislauf: Es <strong>erfasst den Zustand</strong>, zum Beispiel die aktuelle Spielsituation, und <strong>führt die Aktion durch</strong>, die es für die beste hält. Danach <strong>bewertet es den Folgezustand</strong>: War die Aktion gut, gibt es eine Belohnung, sonst eine Bestrafung. Damit <strong>passt es die Güte der Aktion an</strong>, also wie gut es diese Aktion in diesem Zustand künftig einschätzt. Dieser Kreislauf wiederholt sich viele Male, und so entsteht nach und nach eine gute <strong>Strategie</strong>. Die Lernart eignet sich, wenn sich automatisch prüfen lässt, ob eine Entscheidung gut war. <em>Beispiele:</em> Strategiespiele wie NIM, ein Roboter, der durch Ausprobieren laufen lernt.</p>
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
            <td>Strategiespiele, laufender Roboter</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="small muted">Grafiken: Ausschnitte aus der <a href="https://inf-schule.de/ki/menueansicht" target="_blank" rel="noopener noreferrer">KI-Landkarte von inf-schule.de</a> (CC BY-SA 4.0).</p>
  </div>
</details>
