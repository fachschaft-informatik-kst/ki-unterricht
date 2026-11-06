<details class="kapitel" id="sprache-3" data-kurz="Mit Soekia Kontext und Wortwahl verändern und Texte vergleichen." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Übertragen: Soekia</h2>
  </summary>
  <div class="kapitel-body">
    <div class="lesson-steps single">
      <article>
        <b>3 · Übertragen</b>
        <!-- MD:START -->
Untersuchen Sie mit Soekia, einem didaktischen Sprachmodell der PH Schwyz, den Einfluss von Kontext und Trainingstext. Halten Sie einen gelungenen und einen selbst erzeugten problematischen Text fest.
<!-- MD:END -->
        <ol>
          <li><b>Starten:</b> Öffnen Sie <a href="https://www.soekia.ch/gpt.html" target="_blank" rel="noopener noreferrer">soekia.ch/gpt.html</a>, geben Sie einen Satzanfang ein (zum Beispiel «Es war einmal») und starten Sie das Modell. Mit «Schau hinein» sehen Sie die Trainingstexte (Dokumente), die N-Gramme, die Wortvorschläge und den entstehenden Text.</li>
          <li><b>Vergleichen:</b> Verändern Sie pro Versuch nur eine Einstellung: N-Gramm-Länge 2 gegen 5 mit demselben Satzanfang, danach niedrige gegen hohe Temperatur.</li>
          <li><b>Problem selbst erzeugen:</b> Fügen Sie bei den Dokumenten einen eigenen kurzen Text mit einer falschen Aussage hinzu (zum Beispiel «Die Hauptstadt der Schweiz ist Zürich.», mehrmals) und lassen Sie das Modell den Satz fortsetzen. Was übernimmt es aus dem Trainingstext, und prüft es, ob das stimmt?</li>
        </ol>
      </article>
    </div>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll: Soekia
<!-- MD:END -->
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Frage</th>
              <th>Ihre Antwort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Meine Erwartung vor dem Versuch (allein): Wie verändert N = 5 statt N = 2 die nächste Wortvorhersage, und was passiert bei einem Trainingstext mit einer falschen Aussage?</th>
              <td><textarea data-answer="soe_erwartung" aria-label="Meine Erwartung vor dem Versuch" maxlength="10000" placeholder="Ich erwarte, dass …, weil …" rows="3"></textarea></td>
            </tr>
            <tr>
              <th>Was haben Sie pro Versuch verändert?</th>
              <td><select data-answer="soe_variable" aria-label="Was verändert?"><option value="">–</option><option value="n">Nur die N-Gramm-Länge</option><option value="temperatur">Nur die Temperatur</option><option value="trainingstext">Nur den Trainingstext</option><option value="kontext">Nur den Kontext (Satzanfang)</option><option value="wortwahl">Nur die Wortwahl</option><option value="beides">Mehreres abwechselnd</option></select></td>
            </tr>
            <tr>
              <th>Gelungener Text (Ausschnitt)</th>
              <td><textarea data-answer="soe_gut_text" aria-label="Gelungener Text" maxlength="10000" placeholder="Der Text lautete …" rows="3"></textarea></td>
            </tr>
            <tr>
              <th>Warum gelungen? Beleg</th>
              <td><textarea data-answer="soe_gut_beleg" aria-label="Beleg für den gelungenen Text" maxlength="10000" placeholder="Gelungen, weil …" rows="2"></textarea></td>
            </tr>
            <tr>
              <th>Was ist am problematischen Text das Problem?</th>
              <td><select data-answer="soe_problem_art" aria-label="Art des Problems"><option value="">–</option><option value="trainingstext">Falsche Aussage aus dem Trainingstext übernommen</option><option value="erfunden">Erfundene Fakten</option><option value="widerspruch">Widerspruch im Text</option><option value="wiederholung">Wiederholungen</option><option value="ton">Unpassender Ton oder Stil</option><option value="anderes">Anderes</option></select></td>
            </tr>
            <tr>
              <th>Problematischer Text (Ausschnitt)</th>
              <td><textarea data-answer="soe_problem_text" aria-label="Problematischer Text" maxlength="10000" placeholder="Der Text lautete …" rows="3"></textarea></td>
            </tr>
            <tr>
              <th>Beleg für das Problem</th>
              <td><textarea data-answer="soe_problem_beleg" aria-label="Beleg für den problematischen Text" maxlength="10000" placeholder="Problematisch, weil …" rows="2"></textarea></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</details>