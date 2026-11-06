<span class="section-label">Sichern · Wiederherstellen · Abgeben</span>
<h1>Antworten sichern und weiterarbeiten</h1>
<p class="section-intro">Textfelder, Auswahlaufgaben, Journalantworten und Selbsteinschätzungen lassen sich unkompliziert als <strong>JSON-Datei</strong> herunterladen und auf einem anderen Gerät wieder hochladen. Notebooks und Fotos werden weiterhin separat im vollständigen Projekt-ZIP gesichert.</p>

<div class="transfer-flow" aria-label="Antworten und Kursstand sichern">
  <section class="card transfer-step transfer-answers-step">
    <div class="transfer-step-heading"><span class="transfer-step-number" aria-hidden="true">1</span><div><h2>Antworten herunterladen oder hochladen</h2><p>Für das Weiterarbeiten auf einem anderen Gerät – ohne ZIP.</p></div></div>
    <div class="project-transfer-primary">
      <button class="btn primary" id="download-answers" type="button">Antworten herunterladen ↓</button>
      <label class="btn" for="restore-answers">Antworten hochladen ↑</label>
      <input accept=".json,application/json" hidden="" id="restore-answers" type="file"/>
    </div>
    <p id="answers-transfer-status" class="status" role="status" aria-live="polite"></p>
    <p class="small muted">Enthält Textfelder, Auswahlantworten, Projektjournal, Checkliste und Selbsteinschätzungen. Das Hochladen ersetzt nur diese Angaben, <strong>nicht</strong> die Notebooks oder Fotodateien.</p>
  </section>
  <section class="card transfer-step">
    <div class="transfer-step-heading"><span class="transfer-step-number" aria-hidden="true">2</span><div><h2>Dateien ergänzen</h2><p>Nur nötig, wenn Sie eigene Fotos oder eine Fotostudio-Sammlung verwenden.</p></div></div>
    <label class="field"><span>Fotostudio-JSON, Originalfotos oder Foto-ZIP auswählen</span><input accept=".json,.zip,.jpg,.jpeg,.png,.webp" id="attachments" multiple="" type="file"/></label>
    <ul class="attachment-list" id="attachment-list" aria-label="Hinzugefügte Projektdateien"></ul>
    <p class="small muted">Dateien, die Sie direkt im Notebook hochgeladen haben, werden automatisch mitgesichert. Eine Fotostudio-Sammlung zuerst dort als JSON herunterladen und bei Bedarf hier hinzufügen.</p>
  </section>

  <section class="card transfer-step">
    <div class="transfer-step-heading"><span class="transfer-step-number" aria-hidden="true">3</span><div><h2>Ganzes Projekt als ZIP sichern</h2><p>Zusätzlich für Notebooks, Fotos und den vollständigen Projektstand.</p></div></div>
    <div class="project-transfer-primary">
      <button class="btn primary" id="download-backup" type="button">Arbeitsstand als ZIP sichern ↓</button>
      <label class="btn" for="restore-package">ZIP wiederherstellen ↑</label>
      <input accept=".zip" hidden="" id="restore-package" type="file"/>
    </div>
    <p class="small muted">Beim Wiederherstellen werden die aktuellen Antworten, Notebooks und Projektdateien auf diesem Gerät durch den Inhalt der gewählten ZIP ersetzt. Laden Sie vorher bei Bedarf einen Arbeitsstand herunter.</p>
  </section>

  <section class="card transfer-step transfer-step-submission">
    <div class="transfer-step-heading"><span class="transfer-step-number" aria-hidden="true">4</span><div><h2>Projekt zur Abgabe vorbereiten</h2><p>Am Projektende prüfen, ob alle Nachweise vorhanden sind.</p></div></div>
    <div id="submission-check" class="transfer-check" role="status" aria-live="polite"></div>
    <div class="project-submission-action">
      <button class="btn" id="download-submission" type="button">Abgabepaket als ZIP erstellen ↓</button>
    </div>
    <p class="small muted">Die ZIP enthält auch <strong>Journal.html</strong> zum Nachlesen. Öffnen Sie diese Datei vor der Einreichung kurz. <strong>Herunterladen ist noch keine Abgabe:</strong> Reichen Sie die ZIP anschliessend über den vereinbarten Abgabekanal ein.</p>
  </section>
</div>
<p class="status transfer-download-status" id="download-status" role="status" aria-live="polite"></p>

<details class="transfer-help">
  <summary>Was befindet sich in der ZIP-Datei?</summary>
  <div class="detail-body">
    <ul>
      <li><strong>Journal.html:</strong> alle ausgefüllten Journal- und Unterrichtsantworten, auch Auswahlfelder, sowie gespeicherte Versuchsausgaben.</li>
      <li><strong>kursstand.json:</strong> Angaben, Häkchen, Selbsteinschätzungen und Wiederherstellungsdaten.</li>
      <li><strong>Notebooks:</strong> gespeicherter Code, Texte und Ausgaben des Projekt- und der Übungsnotebooks.</li>
      <li><strong>Dateien:</strong> hinzugefügte Originalfotos, Foto-ZIPs, Fotostudio-JSONs und Notebook-Uploads.</li>
    </ul>
    <p class="small muted">Python-Variablen im Arbeitsspeicher und bereits trainierte Modelle werden nicht als laufende Python-Umgebung gesichert. Nach dem Wiederherstellen müssen nötige Zellen erneut ausgeführt werden.</p>
  </div>
</details>

<details class="transfer-help">
  <summary>Nach der Projektabgabe: Fremdauswertung in Doppellektion 8</summary>
  <div class="detail-body">
    <p>Die Fremdauswertung hat einen <a href="#fremdmodell">eigenen Unterrichtsabschnitt</a> und ein separates Abgabepaket. Öffnen Sie das fremde Projekt in einem privaten Browserfenster. Stellen Sie hier kein fremdes Projekt über die Wiederherstellung des eigenen Arbeitsstands her.</p>
    <p><a class="btn" href="#fremdmodell">Zum Fahrplan der Doppellektion 8 →</a></p>
  </div>
</details>

<details class="transfer-help js-only">
  <summary>Ältere JSON-Seitenstände (nur bei Bedarf)</summary>
  <div class="detail-body">
    <p class="small muted">Diese alte Funktion sichert nur Checkliste, Notizen und Selbsteinschätzung – <strong>nicht</strong> die Notebooks, Unterrichtsantworten oder Fotos. Verwenden Sie normalerweise die ZIP-Sicherung oben. Bereits vorhandene JSON-Dateien können hier weiterhin importiert werden.</p>
    <div class="actions">
      <button class="btn" id="export-state" type="button">Alten Seitenstand als JSON herunterladen</button>
      <label class="btn" for="import-state">Alte JSON importieren</label>
      <input accept=".json,application/json" id="import-state" type="file"/>
    </div>
    <details>
      <summary>Nur Seitenstand zurücksetzen</summary>
      <div class="detail-body"><p class="small muted">Setzt Häkchen, Notizen, Themenwahl und Selbsteinschätzung auf diesem Gerät zurück; Notebooks und Fotos bleiben erhalten.</p><button class="btn" id="reset-state" type="button">Seitenstand zurücksetzen</button></div>
    </details>
    <p class="status" id="save-status" role="status">Bereit.</p>
  </div>
</details>
