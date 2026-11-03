---
type: chapter
id: fremdtest
nummer: "4"
titel: "Eigene Bilder ausprobieren · ca. 15 Min."
kurz: "Pflichtversuch vor der Reflexion: Vorhersagen auf anderen Klassen untersuchen."
open: false
---

<div class="dl8-question" aria-labelledby="dl8-question-4">
  <div class="dl8-question-meta"><span class="dl8-eyebrow">Prüffrage</span><span class="dl8-meta">Pflichtversuch · unbenotet</span></div>
  <h3 id="dl8-question-4">Was sagt ein Modell über <em>andere Klassen</em>, für die es nie trainiert wurde?</h3>
</div>

<div class="dl8-section-head"><h3>Ihr Auftrag in 4 Schritten</h3><span class="dl8-meta">Im Tandem</span></div>
<ol class="dl8-steps">
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">01</span><span class="dl8-step-time">2 Min.</span></div>
    <h4>Vermuten</h4>
    <div class="dl8-step-copy"><p>Lesen Sie die zwei <strong>ursprünglichen Klassen</strong> des fremden Modells im <a href="#reproduktion">Prüfbericht</a> nochmals. Wählen Sie unten Ihre Erwartung, bevor Sie eigene Fotos testen.</p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">02</span><span class="dl8-step-time">5 Min.</span></div>
    <h4>Selbst ausprobieren</h4>
    <div class="dl8-step-copy"><p>Öffnen Sie im privaten Fenster das <a href="#projekt-werkbank">nachtrainierte fremde Notebook</a> aus Kapitel 3 und gehen Sie zu <strong>«6 · Fremdauswertung»</strong>. Tragen Sie bei <code>EIGENE_KLASSEN = ['C', 'D']</code> die <strong>zwei echten Klassen Ihres Projekts</strong> ein, laden Sie die <strong>eigene Fotostudio-JSON</strong> (nicht das eigene ZIP wiederherstellen!) und führen Sie die Fremdtest-Zelle aus. <strong>Nicht neu trainieren.</strong></p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">03</span><span class="dl8-step-time">5 Min.</span></div>
    <h4>Zwei Beispiele untersuchen</h4>
    <div class="dl8-step-copy"><p>Lesen Sie die Ausgabe: In den Zeilen stehen Ihre Klassen, in den Spalten die <strong>ursprünglichen fremden Klassen</strong>. Vergleichen Sie mindestens <strong>ein Bild aus jeder eigenen Klasse</strong> und tragen Sie die vier Zahlen der Vorhersagetabelle sowie die Trennschärfe ein. Ist das Ergebnis überraschend?</p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">04</span><span class="dl8-step-time">3 Min.</span></div>
    <h4>Erklären</h4>
    <div class="dl8-step-copy"><p>Nennen Sie <strong>eine plausible Vermutung</strong> (z. B. Farbe, Form, Licht oder Hintergrund) und <strong>einen prüfbaren nächsten Versuch</strong>. Schreiben Sie dazu, weshalb dies <strong>keine Trefferquote für die neuen Klassen</strong> ist.</p></div>
  </li>
</ol>

<aside class="dl8-explainer" aria-labelledby="dl8-explainer-title">
  <span class="dl8-eyebrow">Ergebnisse richtig einordnen</span>
  <h3 id="dl8-explainer-title">Warum kann ein Modell scheinbar gut oder schlecht abschneiden?</h3>
  <div class="dl8-compare">
    <div class="dl8-compare-card">
      <span class="dl8-eyebrow">Regulärer Test · P1/P2</span>
      <h4>Neue Bilder, bekannte Klassen</h4>
      <p>Das Modell erkennt neue Exemplare <strong>seiner zwei trainierten Klassen</strong>. Diese Testbilder waren absichtlich <strong>nicht im Training</strong>. So lässt sich die Trefferquote unabhängig prüfen.</p>
    </div>
    <div class="dl8-compare-card">
      <span class="dl8-eyebrow">Ihr Fremdversuch</span>
      <h4>Neue Bilder, andere Klassen</h4>
      <p>Das Modell wurde <strong>nicht für Ihre beiden Klassen trainiert</strong>. Trotzdem muss es eine seiner ursprünglichen Klassen ausgeben, selbst wenn keine davon passt.</p>
    </div>
  </div>
  <div class="dl8-note"><span class="dl8-eyebrow">Merksatz</span><p><strong>Trennschärfe ist keine Trefferquote</strong> für völlig neue Klassen. Auch ein hoher Modellwert beweist nicht, dass das Modell Ihr Motiv korrekt erkannt hat. Prüfen Sie mögliche Einflüsse wie Farbe, Form, Licht oder Hintergrund.</p></div>
</aside>

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
