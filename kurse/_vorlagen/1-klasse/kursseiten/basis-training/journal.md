<span class="section-label">Eigenes Bildprojekt · Arbeitsplatz</span>
<h1>Unser Projekt: Versuch und Journal</h1>
<div class="subnav" aria-label="Projektbereiche">
  <a class="btn" href="#basis-daten">Fahrplan</a><a class="btn" href="#projekt-fotostudio">Fotostudio</a><a class="btn" href="#projekt-werkbank">Versuch</a><a class="btn" href="#projekt-reflexionen">Reflexionen</a><a class="btn" href="#basis-bewertung">Bewertung &amp; Abgabe</a><a class="btn primary" href="#basis-sicherung">Sichern</a>
</div>
<p class="small">Ein gemeinsamer Stand auf einem Gerät. Für Gerätewechsel Notizen und Projekt herunterladen und später unter «Notizen &amp; Projekt» wiederherstellen.</p>
<div class="grid two">
  <label class="field"><span>Namen des Tandems</span><textarea data-basis-answer="basis-journal-namen" maxlength="200" placeholder="Vorname Nachname · Vorname Nachname" rows="2"></textarea></label>
  <label class="field"><span>Klasse und Projekttitel</span><textarea data-basis-answer="basis-journal-klasse" maxlength="100" placeholder="1… · Unser Projekt" rows="2"></textarea></label>
</div>
<div id="projekt-werkbank">
  <!-- MD:START -->
## 1 · Fotos und Versuch
<!-- MD:END -->
  <p>Die Bilder bereiten Sie vorher in <a href="#projekt-fotostudio">Etappe 2 im Fotostudio</a> auf. Hier führen Sie den A/B-Vergleich im Projekt-Notebook durch. <strong>Wichtig:</strong> Modellwahl vor Testeinsicht begründen; nach dem Abschlusstest nichts mehr optimieren.</p>
  <div class="ki-notebook-block" data-notebook="content/ki_projekt/ki_tandemprojekt.ipynb" data-title="Unser Versuch">
    <!-- MD:START -->
### Jupyter-Notebook · Unser Versuch
<!-- MD:END -->
    <!-- MD:START -->
Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.
<!-- MD:END -->
    <button type="button" class="ki-notebook-launch" id="start-project" data-lab="ki_tandemprojekt.ipynb">Notebook hier öffnen</button>
  </div>
  <p class="small">Zuerst mit Übungsdaten arbeiten. Danach eigene Fotostudio-JSON auswählen und die folgenden Zellen schrittweise ausführen. Den Abschlusstest erst nach Ihrer begründeten Auswahl freigeben. Vor der Abgabe die Fotostudio-JSON unter <a href="#basis-sicherung">Notizen &amp; Projekt</a> hinzufügen und das ZIP sichern.</p>
  
</div>
<div id="projekt-reflexionen">
  <!-- MD:START -->
## 2 · Ergebnisse im Journal festhalten
<!-- MD:END -->
  <p>Füllen Sie die fünf Reflexionen passend zu Ihren Projektetappen aus. Halten Sie am Ende jeder Arbeitsphase Ihren nächsten Schritt fest. Das Journal ist Teil des <a href="#basis-sicherung">Abgabepakets</a>; ein zusätzliches Lerntagebuch ist nicht nötig.</p>
  <details class="journal-step" open="">
    <summary>1 · Anwendung &amp; Vermutung<span class="completion" data-completion="0"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Was soll Ihr Modell unterscheiden – und für wen ist das nützlich?</span><textarea data-basis-answer="purpose" maxlength="20000" placeholder="Zwei Klassen (Ihre Labels), Zuordnungsregel und ein Grenzfall …" rows="4"></textarea></label>
      <label class="field"><span>Was vermuten Sie: Hilft mehr Bildvielfalt? Warum? Notieren Sie auch kurz Ihren Etappenplan (wer macht was, bis wann, mit Reserve).</span><textarea data-basis-answer="hypothesis" maxlength="20000" placeholder="Wir vermuten …, weil …" rows="4"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>2 · Datenplan &amp; Quellen<span class="completion" data-completion="1"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Welche Exemplare oder Personen gehören zu T1, T2, V1, P1 und P2?</span><textarea data-basis-answer="groups" maxlength="20000" placeholder="Pro Gruppe: anderes Exemplar jeder Klasse · je 8 Fotos" rows="4"></textarea></label>
      <label class="field"><span>Woher stammen die Bilder? Unter welchen Bedingungen wurden sie aufgenommen?</span><textarea data-basis-answer="sources" maxlength="20000" placeholder="Quellen, Einverständnis bei Personen, Licht, Hintergrund …" rows="4"></textarea></label>
      <label class="field"><span>Welches Problem könnten Ihre Daten haben?</span><textarea data-basis-answer="data_limits" maxlength="20000" placeholder="Was ist wenig vielfältig oder schwer eindeutig zuzuordnen?" rows="4"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>3 · Vergleich &amp; Auswahl – vor dem Test<span class="completion" data-completion="2"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Wie haben A und B auf V1 abgeschnitten, und wie im Training (gestrichelte Linie)? Was sagt der Abstand zwischen Training und V1? Beschreiben Sie eine konkrete Vorhersage. Was könnte den Unterschied zwischen A und B erklären? Was blieb bei A und B gleich, und warum ist das für einen fairen Vergleich nötig? (V1 sind 16 Bilder von nur einem Exemplar je Klasse: Ein Bild sind 6,25 Prozentpunkte, ein Unterschied von höchstens zwei Bildern ist kein Beleg.)</span><textarea data-basis-answer="comparison" maxlength="20000" placeholder="A: … von 16 richtig · B: … von 16 richtig · Unterschied: … Bilder. Training: … % · Abstand zu V1: … Konkrete Beobachtung … Gleich geblieben: …, weil …" rows="4"></textarea></label>
      <label class="field"><span>Wählen Sie A oder B. Welches Ergebnis auf V1 spricht dafür, und blieb die Reihenfolge bei den drei Startwerten gleich? Entscheiden Sie unbedingt vor dem Abschlusstest. Bei Gleichstand: Mit welchem anderen Argument wählen Sie?</span><textarea data-basis-answer="selection" maxlength="20000" placeholder="Wir wählen …, weil …; bei den Startwerten 11 / 22 / 33 …; eine andere Erklärung wäre … Bei Gleichstand: …" rows="4"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>4 · Abschlusstest &amp; Grenzen<span class="completion" data-completion="3"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Wie lautet das Testergebnis (P1 und P2 zusammen)? Warum durften P1 und P2 erst jetzt benutzt werden?</span><textarea data-basis-answer="test" maxlength="20000" placeholder="… von … Testbildern richtig (… %); zwei neue Gruppen. P1/P2 erst jetzt, weil …" rows="4"></textarea></label>
      <label class="field"><span>Wählen Sie drei Testbilder: Was war die richtige Klasse, was sagte das Modell voraus? Was fällt Ihnen auf? Auch richtige Vorhersagen zählen.</span><textarea data-basis-answer="examples" maxlength="20000" placeholder="Was gelingt oder misslingt? Wenn fehlerfrei: Was wurde nicht geprüft?" rows="4"></textarea></label>
      <label class="field"><span>Wo könnte das Modell helfen? Wann sollten wir seiner Vorhersage nicht vertrauen? Welcher Teil hat Ihre zwei Klassen unterscheiden gelernt, und könnten Hintergrund oder Licht mitgeholfen haben?</span><textarea data-basis-answer="limits" maxlength="20000" placeholder="Grenzen der Daten, des Versuchs und der Anwendung. Gelernt hat …; mitgeholfen haben könnte …" rows="4"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>5 · Fazit &amp; Zusammenarbeit<span class="completion" data-completion="4"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Was haben Sie über Bildvielfalt gelernt? Was würden Sie als Nächstes ausprobieren?</span><textarea data-basis-answer="conclusion" maxlength="20000" placeholder="Unsere Beobachtungen sprechen dafür, dass …" rows="4"></textarea></label>
      <label class="field"><span>Wer hat welche Aufgaben übernommen, und wie haben Sie die Rollen gewechselt? Was haben Sie an Ihrem Etappenplan geändert?</span><textarea data-basis-answer="contribution" maxlength="20000" placeholder="Bereiten Sie sich beide auf das jeweilige Einzelgespräch vor. Wer machte was, wann haben Sie gewechselt? …" rows="4"></textarea></label>
      <label class="field"><span>Welche Hilfen (auch KI) haben Sie wofür benutzt? Regel: KI nur als Sprachhilfe; Zahlen, Beobachtungen und Deutungen stammen von Ihnen.</span><textarea data-basis-answer="ki_nutzung" maxlength="20000" placeholder="Hilfe … wofür … ; keine Zahlen oder Deutungen aus einer KI-Ausgabe übernommen." rows="3"></textarea></label>
    </div>
  </details>
</div>
