<span class="section-label">05 · Unser gemeinsames Projekt</span>
<h1>Versuchen. Beobachten. Festhalten.</h1>
<div class="subnav">
  <a class="btn" href="#projekt">Auftrag</a><a class="btn" href="#bewertung">Bewertung &amp; Abgabe</a><a class="btn primary" href="#sicherung">Notizen &amp; Projekt</a>
</div>
<p class="small">Ein gemeinsamer Stand auf einem Gerät. Für Gerätewechsel Notizen und Projekt herunterladen und später unter «Notizen &amp; Projekt» wiederherstellen.</p>
<div class="grid two">
  <label class="field"><span>Namen des Tandems</span><textarea data-journal="names" maxlength="20000" placeholder="Vorname Nachname · Vorname Nachname" rows="2"></textarea></label>
  <label class="field"><span>Klasse und Projekttitel</span><textarea data-journal="class" maxlength="20000" placeholder="4… · Unser Projekt" rows="2"></textarea></label>
</div>
<details class="journal-step" open="">
  <summary>1 · Anwendung &amp; Vermutung<span class="completion" data-completion="0"></span></summary>
  <div class="detail-body">
    <label class="field"><span>Was soll Ihr Modell unterscheiden – und für wen ist das nützlich?</span><textarea data-journal="purpose" maxlength="20000" placeholder="Zwei Klassen, Zuordnungsregel und ein Grenzfall …" rows="4"></textarea></label>
    <label class="field"><span>Was erwarten Sie vom Vergleich A/B? Planen Sie darunter Ihre Etappen, Zuständigkeiten und Zeitreserve. Aktualisieren Sie kurz: erreicht, offen, nächster Schritt, Hilfe.</span><textarea data-journal="hypothesis" maxlength="20000" placeholder="Wir vermuten …, weil …" rows="4"></textarea></label>
  </div>
</details>
<details class="journal-step">
  <summary>2 · Datenplan &amp; Quellen<span class="completion" data-completion="1"></span></summary>
  <div class="detail-body">
    <label class="field"><span>Welche Exemplare oder Personen gehören zu T1, T2, V1, P1 und P2?</span><textarea data-journal="groups" maxlength="20000" placeholder="Pro Gruppe: anderes Exemplar jeder Klasse · je 8 Fotos" rows="4"></textarea></label>
    <label class="field"><span>Woher stammen die Bilder? Unter welchen Bedingungen wurden sie aufgenommen?</span><textarea data-journal="sources" maxlength="20000" placeholder="Quellen, Einverständnis bei Personen, Licht, Hintergrund …" rows="4"></textarea></label>
    <label class="field"><span>Welches Problem könnten Ihre Daten haben?</span><textarea data-journal="data_limits" maxlength="20000" placeholder="Was ist wenig vielfältig oder schwer eindeutig zuzuordnen?" rows="4"></textarea></label>
  </div>
</details>
<details class="journal-step">
  <summary>3 · Vergleich &amp; Auswahl – vor dem Test<span class="completion" data-completion="2"></span></summary>
  <div class="detail-body">
    <label class="field"><span>Welche Validierungswerte haben A und B? Was erklärt den Unterschied?</span><textarea data-journal="comparison" maxlength="20000" placeholder="A: … % · B: … % · Unterschied: … Prozentpunkte. Konkrete Beobachtung …" rows="4"></textarea></label>
    <label class="field"><span>Welche Variante wählen Sie? Begründen Sie mit der Validierung.</span><textarea data-journal="selection" maxlength="20000" placeholder="Wir wählen …, weil …; eine andere Erklärung wäre …" rows="4"></textarea></label>
  </div>
</details>
<details class="journal-step">
  <summary>4 · Abschlusstest &amp; Grenzen<span class="completion" data-completion="3"></span></summary>
  <div class="detail-body">
    <label class="field"><span>Wie lautet das Testergebnis?</span><textarea data-journal="test" maxlength="20000" placeholder="… von 32 Bildern richtig; … %; zwei neue Gruppen" rows="4"></textarea></label>
    <label class="field"><span>Erklären Sie drei konkrete Vorhersagen.</span><textarea data-journal="examples" maxlength="20000" placeholder="Was gelingt oder misslingt? Wenn fehlerfrei: Was wurde nicht geprüft?" rows="4"></textarea></label>
    <label class="field"><span>Wofür wäre das Modell brauchbar – und wofür nicht?</span><textarea data-journal="limits" maxlength="20000" placeholder="Grenzen der Daten, des Versuchs und der Anwendung …" rows="4"></textarea></label>
  </div>
</details>
<details class="journal-step">
  <summary>5 · Fazit &amp; Zusammenarbeit<span class="completion" data-completion="4"></span></summary>
  <div class="detail-body">
    <label class="field"><span>Wie beantworten Sie Ihre Forschungsfrage? Was wäre ein sinnvoller nächster Versuch?</span><textarea data-journal="conclusion" maxlength="20000" placeholder="Unsere Beobachtungen sprechen dafür, dass …" rows="4"></textarea></label>
    <label class="field"><span>Wie haben Sie die Arbeit gesteuert? Was gelang an Ihrem Etappenplan, was haben Sie angepasst? Welche Quellen und KI-Hilfen haben Sie verwendet?</span><textarea data-journal="contribution" maxlength="20000" placeholder="Beide erklären das ganze Projekt. Hilfsmittel konkret nennen …" rows="4"></textarea></label>
  </div>
</details>
<div class="actions">
  <button class="btn primary" id="start-project">Versuch öffnen ▶</button><button class="btn" id="start-studio">Fotostudio öffnen</button>
</div>
<p class="small">Zuerst mit Übungsdaten arbeiten. Danach eigene Fotostudio-JSON auswählen und die folgenden Zellen schrittweise ausführen. Den Abschlusstest erst nach Ihrer begründeten Auswahl freigeben.</p>
<div class="lab-panel" hidden="" id="project-lab">
  <div class="lab-head">
    <b id="project-lab-title">Unser Versuch</b><a class="btn compact" href="#journal">Zur Reflexion ↑</a><span id="project-lab-status" role="status">Startet …</span><button class="btn compact" data-fullscreen="project-frame">Vergrössern</button>
  </div>
  <details>
    <summary>Die vier Schritte im Versuch</summary>
    <ol>
      <li>Daten: Für eigene Bilder MODUS auf EIGENE_DATEN stellen, Klassennamen anpassen und Fotostudio-JSON auswählen.</li>
      <li>Vergleichen: Zellen der Reihe nach mit Shift + Enter ausführen. A und B erhalten gleich viele Bilder.</li>
      <li>Entscheiden: Variante anhand der Validierung wählen. Im Journal begründen und die Begründung auch bei BEGRUENDUNG im Code eintragen.</li>
      <li>Prüfen: Erst dann TEST_FREIGEBEN auf True setzen. Test ausführen und Fehler im Journal untersuchen.</li>
    </ol>
  </details>
  <p class="small">Beim Notebookwechsel werden die Ergebnisse gesichert und Python startet neu. Zum Weiterrechnen Daten erneut laden; gespeicherte Ausgaben bleiben sichtbar.</p>
  <iframe allow="fullscreen" id="project-frame" title="Projektversuch – Python-Notebook"></iframe>
</div>
<details hidden="" id="studio-panel" open="">
  <summary>Fotostudio · eigene Bilder vorbereiten</summary>
  <p class="small">Die exportierte JSON im Versuch hochladen und unten ins Abgabepaket aufnehmen.</p>
  <iframe class="studio-frame" id="studio-frame" title="Fotostudio – Bilder vorbereiten"></iframe>
</details>