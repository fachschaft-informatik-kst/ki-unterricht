<span class="section-label">Doppellektion 8 · Nach der Projektabgabe</span>
<h1>Fremdmodell auf dem Prüfstand</h1>
<p class="section-intro">Sie haben Ihr eigenes Bildprojekt bereits eingereicht. Jetzt überprüfen Sie ein fremdes Modell unabhängig: Lassen sich seine Ergebnisse wiederholen – und was passiert mit Ihren eigenen Bildern?</p>
<div class="card">
  <!-- MD:START -->
## So arbeiten Sie heute
<!-- MD:END -->
  <p><strong>Parallel zu den Einzelgesprächen:</strong> Reproduktionscheck und Fremdtest im Tandem durchführen. Jede Person pausiert nur für ihr individuelles vierminütiges Fachgespräch. Danach reflektiert jede Person die Ergebnisse selbstständig. Die Gesprächsreihenfolge ist vorab bekannt.</p>
  <p><strong>Bewertung:</strong> K11 (Reproduktionscheck, 3 gemeinsame Punkte) und K12 (kritische Reflexion, 3 individuelle Punkte). Zusammen maximal 6 Punkte. Die bewertete ursprüngliche Projektabgabe wird nicht verändert.</p>
  <p><strong>Datenschutz:</strong> Das zugeteilte fremde ZIP nur mit Erlaubnis in einem privaten Browserfenster oder anderen Browserprofil öffnen. Empfangene Daten nur zur Prüfung verwenden und nach Vorgabe löschen. Keine Fotos anderer Tandems im Reflexionstext weitergeben.</p>
</div>
<!-- LESSONS:fremdmodell -->
<!-- /LESSONS:fremdmodell -->
<details id="reproduktion" open="">
  <summary>Reproduktionsprüfung · ca. 30 Minuten · benotet</summary>
  <div class="detail-body">
    <p>Ein Ergebnis zählt erst, wenn andere es nachvollziehen können. Während der Einzelgespräche prüfen Sie das Projekt eines anderen Tandems: <strong>Kommen Sie mit denselben Daten und Einstellungen zum gleichen Ergebnis?</strong> Die Lehrperson teilt Ihnen das Abgabe-ZIP zu. Die Fotos und Daten verwenden Sie nur für diese Prüfung, geben sie nicht weiter und löschen sie danach.</p>
    <ol>
      <li><strong>Vorbereiten (5 Min.).</strong> Öffnen Sie diese Kursseite in einem <strong>privaten Fenster</strong>, damit Ihr eigener Stand unberührt bleibt (alternativ ein anderes Browserprofil). Importieren Sie das zugeteilte ZIP mit «Notizen &amp; Projekt wiederherstellen ↑»; das ersetzt den Stand in diesem Fenster. Entpacken Sie das ZIP zusätzlich auf Ihrem Gerät: Im Ordner <code>daten</code> liegt die Fotostudio-JSON, <code>Versuchsprotokoll.json</code> enthält die Originalwerte.</li>
      <li><strong>Daten prüfen (5 Min.).</strong> Öffnen Sie den Versuch, führen Sie die erste Codezelle aus und laden Sie im Datenimport die JSON aus dem Ordner <code>daten</code>. <code>MODUS</code> und <code>KLASSEN</code> stehen bereits im Notebook des anderen Tandems. Prüfen Sie Tabelle und Gruppenbild: Sind es je Klasse und Gruppe acht Bilder? Passen Exemplare, Quellen und Klassenregel zum Datenplan im Journal? Notieren Sie zwei Beobachtungen zur Datenqualität, zum Beispiel Hintergrund, Licht oder Verwechslungsgefahr.</li>
      <li><strong>Nachtrainieren (10 Min.).</strong> Führen Sie den A/B-Vergleich unverändert aus (Startwert 11) und notieren Sie die Trefferquoten von A und B auf V1. Vergleichen Sie diese mit den Originalwerten (<code>laeufe</code> im Protokoll). <strong>Freiwillige Vertiefung, kein Pflichtteil:</strong> Starten Sie bei Zeitreserve vor dem Test in einer neuen Zelle <code>wiederholung = foto.vergleichen(daten, wiederholen=True)</code> und <code>foto.vergleich_zeigen(wiederholung)</code>: Wie stabil ist der Unterschied bei drei Startwerten? Das geht nur <strong>vor</strong> dem Abschlusstest.</li>
      <li><strong>Abschlusstest (5 Min.).</strong> Prüfen Sie in der Testzelle, dass Variante und Begründung die des Originals sind und <code>TEST_FREIGEBEN = True</code> gilt. Führen Sie die Zelle mit dem Vergleich <code>experiment</code> aus: Ist das Testergebnis dasselbe? Danach nichts mehr ändern.</li>
      <li><strong>Vergleichen und berichten (5 Min.).</strong> Führen Sie die letzte Codezelle aus und vergleichen Sie <code>daten_sha256</code>, Trefferquoten und Testergebnis mit <code>Versuchsprotokoll.json</code> des Originals. Schreiben Sie den Reproduktionsbericht.</li>
    </ol>
    <label class="field answer"><span>Reproduktionsbericht</span><textarea data-journal="reproduktion" data-optional="" maxlength="20000" placeholder="1. Geprüft von … / geprüftes Tandem (Thema, Klassen) …" rows="12"></textarea></label>
    <p><strong>Der Bericht enthält:</strong></p>
    <ol>
      <li>Wer prüft welches Tandem (Namen, Thema, Klassen)?</li>
      <li>Ist <code>daten_sha256</code> gleich wie im Originalprotokoll (ja oder nein)?</li>
      <li>Werte «Original → eigener Lauf» für A auf V1, B auf V1 und den Abschlusstest. Gleiches Ergebnis?</li>
      <li>Nur bei freiwilliger Vertiefung: Ergebnis bei drei Startwerten. Sonst entfällt dieser Punkt.</li>
      <li>Bei Abweichung: wahrscheinlichste Ursache und woran Sie sie erkennen (andere Daten, andere Klassennamen oder Einstellungen, anderer Startwert, andere Softwareversion).</li>
      <li>Zwei Beobachtungen zur Datenqualität des Originals.</li>
      <li>Eine konkrete Empfehlung an das andere Tandem.</li>
    </ol>
    <p><strong>Separate benotete Fremdauswertung:</strong> Füllen Sie anschliessend Ihre persönliche Reflexion aus und laden Sie <a href="#fremd-reflexion">unten das separate Auswertungs-ZIP</a> herunter. Reichen Sie es bis zum Ende der Doppellektion ein. Das eigene Projekt-ZIP bleibt unverändert. Die empfangenen Fotos dürfen nicht weitergegeben werden.</p>
  </div>
</details>
<details id="fremdtest" open>
  <summary>Fremdtest &amp; Rückmeldung · ca. 25 Minuten · benotet</summary>
  <div class="detail-body">
    <p>Sie haben das Modell des anderen Tandems nachtrainiert. Es kennt genau seine zwei Klassen, zum Beispiel <strong>A</strong> und <strong>B</strong>. Jetzt stellen Sie ihm <strong>Ihre eigenen Klassen C und D</strong> vor, die es nie gesehen hat: <strong>Wie gut trennt es diese beiden Klassen, und warum?</strong> Die Fotos des anderen Tandems verwenden Sie nur für diese Prüfung und löschen sie danach.</p>
    <ol>
      <li><strong>Vorbereiten (3 Min.).</strong> Bleiben Sie im privaten Fenster, in dem Sie die Reproduktionsprüfung gemacht haben. Das nachtrainierte Modell steckt in der Variable <code>experiment</code>. Halten Sie Ihre <strong>eigene</strong> Fotostudio-JSON (Ihr Abgabe-ZIP, Ordner <code>daten</code>) und die genauen Namen Ihrer zwei Klassen bereit.</li>
      <li><strong>Vermuten (2 Min.).</strong> Tragen Sie Ihre Erwartung ein, bevor Sie testen.</li>
      <li><strong>Testen (5 Min.).</strong> Führen Sie am Ende des Notebooks die zwei Zellen im Abschnitt «6 · Fremdtest» aus. Oder schreiben Sie neue Zellen:<pre><code>EIGENE_KLASSEN = ['C', 'D']  # exakt wie in Ihrem Fotostudio
upload_eigen = ki.daten_upload()   # Zelle ausführen, dann Ihre eigene JSON wählen</code></pre><pre><code>eigene = foto.projekt_laden('EIGENE_DATEN', EIGENE_KLASSEN, upload=upload_eigen)
fremd = foto.fremdtest(experiment, eigene)</code></pre></li>
      <li><strong>Auswerten und rückmelden (15 Min.).</strong> Lesen Sie Grafik, Tabelle und konkrete Beispiele. Füllen Sie das Protokoll aus: «Wie gut?» und «Warum?». Formulieren Sie im Begründungsfeld auch eine konkrete Rückmeldung an das andere Tandem.</li>
    </ol>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll: Fremdtest
<!-- MD:END -->
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
    <p class="small">Hilfe: Meldet <code>projekt_laden</code> «Klassenliste muss genau den Klassen …», stimmen die Namen in <code>EIGENE_KLASSEN</code> nicht mit Ihrem Fotostudio überein. Das fremde Modell kann nur zwischen seinen zwei Klassen wählen und kennt kein «weder noch». Ein hoher Modellwert heisst deshalb nicht, dass es sich auskennt.</p>
  </div>
</details>
<div class="card" id="fremd-reflexion">
  <!-- MD:START -->
## Reflexion und Auswertung einreichen
<!-- MD:END -->
  <p>Notieren Sie zunächst eine begründete Rückmeldung an das andere Tandem. Danach beantwortet <strong>jede Person ihre eigene Reflexion</strong>. K11 wird gemeinsam und K12 persönlich bewertet. Eine hohe Trennschärfe für neue Klassen C/D ist <strong>keine Trefferquote auf denselben Klassen</strong>: Das fremde Modell kann nur zwischen seinen ursprünglichen zwei Klassen wählen, nicht «keine davon».</p>
  <label class="field answer"><span>Gemeinsame Rückmeldung: Was ist gelungen, was sollte das andere Tandem als Nächstes prüfen?</span><textarea data-answer="fremd_rueckmeldung" maxlength="10000" rows="3" placeholder="Stark war …; unser konkreter Verbesserungsvorschlag …"></textarea></label>
  <div class="card fremd-person" data-person="1">
    <!-- MD:START -->
### Persönliche Reflexion · Person 1
<!-- MD:END -->
    <label class="field answer"><span>Mein Name (Person 1)</span><input type="text" data-answer="fremd_name_1" maxlength="10000" placeholder="Vor- und Nachname"></label>
    <label class="field answer"><span>1. Reproduzierbarkeit: Welche Originalwerte konnten Sie nachvollziehen? Belegen Sie eine Übereinstimmung oder Abweichung.</span><textarea data-answer="fremd_reflexion_1_repro" maxlength="10000" rows="3" placeholder="Originalwert …, eigener Lauf …; daraus schliesse ich …"></textarea></label>
    <label class="field answer"><span>2. Fremdtest: Wie reagierte das Modell auf Ihre eigenen Bilder? Beschreiben Sie eine konkrete Beobachtung samt Messwert oder Beispiel.</span><textarea data-answer="fremd_reflexion_1_test" maxlength="10000" rows="3" placeholder="Bei unseren Bildern der Klasse … sagte das Modell …"></textarea></label>
    <label class="field answer"><span>3. Erklärung und Grenzen: Nennen Sie zwei mögliche Ursachen. Welche davon können Sie mit den vorhandenen Daten belegen, welche nicht?</span><textarea data-answer="fremd_reflexion_1_grenzen" maxlength="10000" rows="3" placeholder="Eine mögliche Erklärung …; alternativ …; prüfen könnte man …"></textarea></label>
    <label class="field answer"><span>4. Transfer: Was bedeutet das für die Zuverlässigkeit von Bild-KI? Schlagen Sie einen konkreten neuen Test oder eine Verbesserung vor.</span><textarea data-answer="fremd_reflexion_1_transfer" maxlength="10000" rows="3" placeholder="Das fremde Modell kennt nur …; als Nächstes würde ich …"></textarea></label>
  </div>
  <div class="card fremd-person" data-person="2">
    <!-- MD:START -->
### Persönliche Reflexion · Person 2
<!-- MD:END -->
    <label class="field answer"><span>Mein Name (Person 2)</span><input type="text" data-answer="fremd_name_2" maxlength="10000" placeholder="Vor- und Nachname"></label>
    <label class="field answer"><span>1. Reproduzierbarkeit: Welche Originalwerte konnten Sie nachvollziehen? Belegen Sie eine Übereinstimmung oder Abweichung.</span><textarea data-answer="fremd_reflexion_2_repro" maxlength="10000" rows="3" placeholder="Originalwert …, eigener Lauf …; daraus schliesse ich …"></textarea></label>
    <label class="field answer"><span>2. Fremdtest: Wie reagierte das Modell auf Ihre eigenen Bilder? Beschreiben Sie eine konkrete Beobachtung samt Messwert oder Beispiel.</span><textarea data-answer="fremd_reflexion_2_test" maxlength="10000" rows="3" placeholder="Bei unseren Bildern der Klasse … sagte das Modell …"></textarea></label>
    <label class="field answer"><span>3. Erklärung und Grenzen: Nennen Sie zwei mögliche Ursachen. Welche davon können Sie mit den vorhandenen Daten belegen, welche nicht?</span><textarea data-answer="fremd_reflexion_2_grenzen" maxlength="10000" rows="3" placeholder="Eine mögliche Erklärung …; alternativ …; prüfen könnte man …"></textarea></label>
    <label class="field answer"><span>4. Transfer: Was bedeutet das für die Zuverlässigkeit von Bild-KI? Schlagen Sie einen konkreten neuen Test oder eine Verbesserung vor.</span><textarea data-answer="fremd_reflexion_2_transfer" maxlength="10000" rows="3" placeholder="Das fremde Modell kennt nur …; als Nächstes würde ich …"></textarea></label>
  </div>
  <p><strong>Abgabe 2 (nach DL 8):</strong> Laden Sie hier ein <strong>separates Auswertungs-ZIP</strong> mit Reproduktionsbericht, Fremdtest-Protokoll und persönlichen Reflexionen herunter und reichen Sie es im mitgeteilten Abgabekanal ein. Es enthält keine separat importierten Originalfotos. Die eigene Projektabgabe aus DL 5–7 bleibt unberührt.</p>
  <div class="actions">
    <button type="button" class="btn primary" id="download-fremdmodell">Fremdauswertung als ZIP herunterladen ↓</button>
  </div>
  <p class="status" id="fremd-download-status" role="status" aria-live="polite"></p>
</div>
