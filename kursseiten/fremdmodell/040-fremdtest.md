---
type: chapter
id: fremdtest
nummer: "4"
titel: "Fremdtest mit eigenen Bildern · 25 Min."
kurz: "Ein Modell auf zwei nie gelernten Klassen ausprobieren."
open: false
---

**Prüffrage:** Was sagt das fremde Modell über Ihre zwei Bildklassen, obwohl es nur die Klassen des anderen Tandems kennt?

1. **3 Min. · Bereitstellen:** Bleiben Sie im **privaten Fenster** und im <a href="#projekt-werkbank">nachtrainierten fremden Notebook</a>. `experiment` muss aus <a href="#reproduktion">Schritt 3</a> vorhanden sein. Legen Sie Ihre **eigene Fotostudio-JSON** bereit (aus Ihrem eigenen ZIP, Ordner `daten/`). **Nicht Ihr eigenes ZIP wiederherstellen!**
2. **2 Min. · Erwartung:** Wählen Sie unten Ihre Vermutung, **bevor** Sie Bilder testen.
3. **5 Min. · Test ausführen:** Gehen Sie ans Ende des <a href="#projekt-werkbank">Notebooks</a> zum Abschnitt **«6 · Fremdauswertung»**. Ersetzen Sie `EIGENE_KLASSEN = ['C', 'D']` durch **Ihre tatsächlichen Klassennamen**. Führen Sie die Upload-Zelle aus, wählen Sie **Ihre eigene JSON** und starten Sie die nächste Fremdtest-Zelle. Trainieren oder optimieren Sie das Modell dabei nicht nochmals.
4. **15 Min. · Auswerten:** Übertragen Sie die vier Anzahlen aus der Tabelle, **Trennschärfe** und **mittleren Modellwert** in das Protokoll. Beschreiben Sie einen konkreten Bildfall. Nennen Sie **zwei mögliche Ursachen**, aber unterscheiden Sie Beobachtung von Vermutung. Eine Ursache soll sich mit einem nächsten Versuch prüfen lassen.

<p class="small"><strong>Leseregel:</strong> In der Tabelle stehen Ihre zwei Klassen in den Zeilen; die Spalten sind die beiden **ursprünglichen** Klassen des fremden Modells. «C» und «D» sind hier Platzhalter für Ihre Klassennamen. Eine hohe Trennschärfe oder ein hoher Modellwert beweist <strong>nicht</strong>, dass das Modell Ihre neuen Klassen korrekt erkennt.</p>

<div class="protokoll-block">
      <h3>Gemeinsames Messprotokoll</h3>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Frage</th>
              <th>Antwort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Meine Erwartung vor dem Test</th>
              <td><select data-answer="fremd_erwartung" aria-label="Erwartung"><option value="">–</option><option value="gut">Das Modell trennt C und D gut</option><option value="teils">Es trennt sie teilweise</option><option value="raten">Es rät nur</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Ihre Klasse</th>
              <th>sagt Klasse 1 des fremden Modells</th>
              <th>sagt Klasse 2 des fremden Modells</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Klasse C</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_c_1" aria-label="Klasse C sagt Klasse 1" placeholder="Anzahl"></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_c_2" aria-label="Klasse C sagt Klasse 2" placeholder="Anzahl"></td>
            </tr>
            <tr>
              <th>Klasse D</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_d_1" aria-label="Klasse D sagt Klasse 1" placeholder="Anzahl"></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_d_2" aria-label="Klasse D sagt Klasse 2" placeholder="Anzahl"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Messung</th>
              <th>Ihr Ergebnis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Trennschärfe (Raten ergäbe etwa 50 %)</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_trenn" aria-label="Trennschärfe in Prozent" placeholder="in %"></td>
            </tr>
            <tr>
              <th>Mittlerer Modellwert</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-answer="fremd_wert" aria-label="Mittlerer Modellwert in Prozent" placeholder="in %"></td>
            </tr>
            <tr>
              <th>Zuordnung</th>
              <td><select data-answer="fremd_zuordnung" aria-label="Zuordnung"><option value="">–</option><option value="c1">C → Klasse 1, D → Klasse 2</option><option value="c2">C → Klasse 2, D → Klasse 1</option><option value="keine">Keine klare Zuordnung</option></select></td>
            </tr>
            <tr>
              <th>Was hat das Modell wohl getrennt?</th>
              <td><select data-answer="fremd_trennt" aria-label="Was getrennt?"><option value="">–</option><option value="gegenstand">Den Gegenstand (Form, Farbe)</option><option value="hintergrund">Hintergrund oder Licht</option><option value="bildqualitaet">Bildqualität, Abstand, Perspektive</option><option value="unklar">Das weiss ich nicht</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <label class="field answer"><span>Wie gut sind die Ergebnisse, und warum? Nennen Sie mindestens zwei mögliche Gründe und sagen Sie, woran Sie einen davon prüfen könnten.</span><textarea data-answer="fremd_warum" aria-label="Wie gut und warum" maxlength="10000" placeholder="Das Modell trennt C und D … weil … Prüfen könnten wir das, indem wir …" rows="5"></textarea></label>
      <label class="field answer"><span>Was bedeutet das für Trefferquoten? Wann darf man einem Modell trauen, und wann nicht?</span><textarea data-answer="fremd_grenze" aria-label="Bedeutung für Trefferquoten" maxlength="10000" placeholder="Eine Trefferquote gilt nur für …" rows="3"></textarea></label>
    </div>

<div class="actions">
  <a class="btn" href="#projekt-werkbank">Zum Notebook · Abschnitt 6 →</a>
  <a class="btn primary" href="#fremd-reflexion">Weiter: Reflexion →</a>
</div>
<details>
  <summary>Hilfe: Upload, Klassennamen und unerwartete Vorhersagen</summary>
  <div class="detail-body">
    <p>Wenn `projekt_laden` meldet, dass die Klassenliste nicht stimmt: `EIGENE_KLASSEN` exakt wie in Ihrer Fotostudio-JSON schreiben, Upload abschliessen und die zweite Zelle erneut ausführen. Das fremde Netz hat keine Ausgabe «weder noch». Ein hoher Modellwert ist keine Garantie, dass es das Motiv verstanden hat.</p>
    <p><a href="#dl8-warum">Beispiel und Erklärung aus Kapitel 1 ansehen →</a></p>
  </div>
</details>
