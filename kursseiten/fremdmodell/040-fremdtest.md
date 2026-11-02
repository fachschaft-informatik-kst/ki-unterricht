---
type: chapter
id: fremdtest
nummer: "4"
titel: "Eigene Bilder ausprobieren · ca. 15 Min."
kurz: "Pflichtversuch vor der Reflexion: Vorhersagen auf anderen Klassen untersuchen."
open: false
---

**Prüffrage (Pflichtversuch, unbenotet):** Was sagt ein Modell über **andere Klassen**, für die es nie trainiert wurde?

1. **2 Min. · Vermuten:** Lesen Sie die zwei **ursprünglichen Klassen** des fremden Modells im <a href="#reproduktion">Prüfbericht</a> nochmals. Wählen Sie unten Ihre Erwartung, bevor Sie eigene Fotos testen.
2. **5 Min. · Selbst ausprobieren:** Öffnen Sie im privaten Fenster das <a href="#projekt-werkbank">nachtrainierte fremde Notebook</a> aus Kapitel 3 und gehen Sie zu **«6 · Fremdauswertung»**. Tragen Sie bei `EIGENE_KLASSEN = ['C', 'D']` die **zwei echten Klassen Ihres Projekts** ein, laden Sie die **eigene Fotostudio-JSON** (nicht das eigene ZIP wiederherstellen!) und führen Sie die Fremdtest-Zelle aus. <strong>Nicht neu trainieren.</strong>
3. **5 Min. · Zwei Beispiele untersuchen:** Lesen Sie die Ausgabe: In den Zeilen stehen Ihre Klassen, in den Spalten die **ursprünglichen fremden Klassen**. Vergleichen Sie mindestens **ein Bild aus jeder eigenen Klasse** und tragen Sie die vier Zahlen der Vorhersagetabelle sowie die Trennschärfe ein. Ist das Ergebnis überraschend?
4. **3 Min. · Erklären:** Nennen Sie <strong>eine plausible Vermutung</strong> (z. B. Farbe, Form, Licht oder Hintergrund) und <strong>einen prüfbaren nächsten Versuch</strong>. Schreiben Sie dazu, weshalb dies **keine Trefferquote für die neuen Klassen** ist.

<p class="small"><strong>Warum kann das Ergebnis schwach oder scheinbar stark sein?</strong> Das Netz kennt nur seine ursprünglichen beiden Klassen und muss auch bei Ihren völlig anderen Motiven eine davon ausgeben. Es wurde <strong>nicht für Ihre neuen Klassen trainiert</strong>. Das ist etwas anderes als ein regulärer Test auf zuvor unbekannten <strong>Bildern derselben Klassen</strong> (P1/P2). Auch dort wurde bewusst nicht mit den Testbildern trainiert – das ist korrekt und nötig. Die <strong>Trennschärfe</strong> beschreibt hier nur eine nachträglich gewählte Trennung, nicht die Klassifikationsgenauigkeit.</p>

<div class="protokoll-block">
      <h3>Gemeinsames Versuchsprotokoll (unbenotet)</h3>
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
              <th>Trennschärfe bei fremden Klassen (keine Trefferquote)</th>
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
      <label class="field answer"><span>Welche unerwartete Vorhersage haben Sie beobachtet? Nennen Sie eine mögliche Ursache und einen Versuch, mit dem Sie diese prüfen könnten.</span><textarea data-answer="fremd_warum" aria-label="Wie gut und warum" maxlength="10000" placeholder="Das Modell trennt C und D … weil … Prüfen könnten wir das, indem wir …" rows="5"></textarea></label>
      <label class="field answer"><span>Warum ist die Vorhersage auf anderen Klassen keine Trefferquote? Vergleichen Sie mit P1/P2 des ursprünglichen Projekts.</span><textarea data-answer="fremd_grenze" aria-label="Bedeutung für Trefferquoten" maxlength="10000" placeholder="Eine Trefferquote gilt nur für …" rows="3"></textarea></label>
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
