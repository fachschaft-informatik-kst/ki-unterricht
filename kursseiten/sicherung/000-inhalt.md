<span class="section-label">Notizen &amp; Projekt</span>
<h1>Alles herunterladen. Später weiterarbeiten.</h1>
<p class="section-intro">Ein ZIP enthält <strong>Journal.html</strong> mit dem Projektjournal und allen ausgefüllten Unterrichtsantworten (auch Auswahlaufgaben), das Projekt-Notebook mit Ausgaben, Protokoll, Ihre Eingaben in den Übungsnotebooks und hinzugefügte Dateien. Auf einem anderen Gerät laden Sie das ZIP hier wieder hoch.</p>
<div class="card">
  <!-- MD:START -->
### Dateien zum Projekt hinzufügen
<!-- MD:END -->
  <label class="field"><span>Fotostudio-JSON und Originalfotos (oder Foto-ZIP) hinzufügen</span><input accept=".json,.zip,.jpg,.jpeg,.png,.webp" id="attachments" multiple="" type="file"/></label>
  <ul class="attachment-list" id="attachment-list">
  </ul>
  <p class="small">Im Notebook ausgewählte Dateien werden mitgesichert. Originalfotos und weitere Dateien hier hinzufügen. Eine Sammlung im Fotostudio zuerst herunterladen und hier hinzufügen.</p>
</div>
<div class="callout" id="submission-check" role="status">
</div>
<div class="actions project-transfer-actions">
  <div class="project-transfer-primary">
    <button class="btn primary" id="download-backup">Notizen &amp; Projekt herunterladen ↓</button>
    <label class="btn" for="restore-package">Notizen &amp; Projekt wiederherstellen ↑</label>
  </div>
  <div class="project-submission-action">
    <p class="small">Für die formelle Abgabe:</p>
    <button class="btn" id="download-submission">Abgabepaket herunterladen ↓</button>
  </div>
  <input accept=".zip" hidden="" id="restore-package" type="file"/>
</div>
<p class="status" id="download-status" role="status"></p>
<p class="small">Für die Einreichung: Namen, Klasse und Journalfelder prüfen, «Abgabepaket herunterladen» wählen und die Datei <strong>Journal.html</strong> im ZIP kurz öffnen. Der Download ist noch keine Abgabe.</p>
<p class="small">Der Download übermittelt nichts automatisch. Das Hochladen ersetzt den aktuellen Browserstand. Laden Sie nach jeder Arbeitsphase eine ZIP herunter und bewahren Sie sie ausserhalb des Browsers auf.</p>
<div class="card"><h2>Nach der Projektabgabe · Doppellektion 8</h2><p>Die benotete Fremdauswertung ist jetzt ein <a href="#fremdmodell">eigener Unterrichtsabschnitt</a>. Öffnen Sie dort das fremde Projekt in einem privaten Browserfenster. Hier bleibt der Export Ihres <strong>eigenen</strong> Projektstands verfügbar.</p><p><a class="btn" href="#fremdmodell">Zum Auftrag der Doppellektion 8 →</a></p></div>
<details class="js-only">
  <summary>Älteren Projekt-Seitenstand importieren / exportieren</summary>
  <div class="detail-body">
    <div class="card js-only" style="margin-top:26px">
      <!-- MD:START -->
### Ihren Seitenstand mitnehmen
<!-- MD:END -->
      <p class="small muted">Exportieren Sie Checkliste, Notizen und Selbsteinschätzung als JSON. Sie können die Datei auf einem anderen Gerät importieren. Das ersetzt keine Projektabgabe.</p>
      <div class="actions">
        <button class="btn primary" id="export-state">Stand herunterladen</button>
        <label class="btn" for="import-state">Stand importieren</label>
        <input accept=".json,application/json" id="import-state" style="max-width:100%;font-size:12px" type="file"/><button class="btn" id="reset-state">Lokalen Stand zurücksetzen</button>
      </div>
      <p class="status" id="save-status" role="status">Bereit.</p>
    </div>
  </div>
</details>