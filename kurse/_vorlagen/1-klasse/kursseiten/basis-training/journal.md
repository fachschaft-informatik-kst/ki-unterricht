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
  <p class="small">Eigene Fotostudio-JSON auswählen und die Zellen der Reihe nach ausführen. Den Abschlusstest erst nach Ihrer begründeten Auswahl freigeben. Vor der Abgabe die Fotostudio-JSON unter <a href="#basis-sicherung">Notizen &amp; Projekt</a> hinzufügen und das ZIP sichern.</p>
  
</div>
<div id="projekt-reflexionen">
  <!-- MD:START -->
## 2 · Ergebnisse im Journal festhalten
<!-- MD:END -->
  <p>Füllen Sie die fünf Reflexionen passend zu Ihren Projektetappen aus. Das Journal ist Teil des <a href="#basis-sicherung">Abgabepakets</a>; ein zusätzliches Lerntagebuch ist nicht nötig.</p>
  <details class="journal-step" open="">
    <summary>1 · Anwendung &amp; Vermutung<span class="completion" data-completion="0"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Was soll Ihr Modell unterscheiden? Wofür könnte es nützlich sein?</span><textarea data-basis-answer="purpose" maxlength="20000" placeholder="Unsere zwei Klassen …; nützlich für …" rows="3"></textarea></label>
      <label class="field"><span>Welche Variante wird vermutlich besser funktionieren? Warum?</span><textarea data-basis-answer="hypothesis" maxlength="20000" placeholder="Wir vermuten …, weil …" rows="3"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>2 · Datenplan &amp; Quellen<span class="completion" data-completion="1"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Welche Exemplare gehören zu den fünf Datengruppen? Woher stammen Ihre Fotos?</span><textarea data-basis-answer="groups" maxlength="20000" placeholder="T1 …, T2 …, V1 …, P1 …, P2 …; Quelle …" rows="3"></textarea></label>
      
      <label class="field"><span>Welches Problem könnte bei Ihren Bildern auftreten?</span><textarea data-basis-answer="data_limits" maxlength="20000" placeholder="Zum Beispiel Licht, Hintergrund oder ähnliche Exemplare …" rows="3"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>3 · Vergleich &amp; Auswahl – vor dem Test<span class="completion" data-completion="2"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Wie schneiden A und B auf V1 ab? Was blieb beim Vergleich gleich?</span><textarea data-basis-answer="comparison" maxlength="20000" placeholder="A: … von 16; B: … von 16; gleich blieb …" rows="3"></textarea></label>
      <label class="field"><span>Welche Variante wählen Sie? Begründen Sie vor dem Abschlusstest.</span><textarea data-basis-answer="selection" maxlength="20000" placeholder="Wir wählen …, weil …" rows="3"></textarea></label>
    </div>
  </details>
  <details class="journal-step">
    <summary>4 · Abschlusstest &amp; Grenzen<span class="completion" data-completion="3"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Wie gut funktioniert Ihr Modell auf P1/P2? Warum erst jetzt testen?</span><textarea data-basis-answer="test" maxlength="20000" placeholder="… von … richtig; erst jetzt, weil …" rows="3"></textarea></label>
      <label class="field"><span>Untersuchen Sie zwei konkrete Vorhersagen. Wo liegen die Grenzen Ihres Modells?</span><textarea data-basis-answer="examples" maxlength="20000" placeholder="Bild 1: Label …, Vorhersage …; Bild 2: …; Grenze …" rows="3"></textarea></label>
      
    </div>
  </details>
  <details class="journal-step">
    <summary>5 · Fazit<span class="completion" data-completion="4"></span></summary>
    <div class="detail-body">
      <label class="field"><span>Was haben Sie über den Einfluss der Bildvielfalt gelernt?</span><textarea data-basis-answer="conclusion" maxlength="20000" placeholder="Wir haben beobachtet …" rows="3"></textarea></label>
      <label class="field"><span>Was würden Sie beim nächsten Versuch verbessern?</span><textarea data-basis-answer="contribution" maxlength="20000" placeholder="Beim nächsten Versuch würden wir …" rows="3"></textarea></label>
      <details><summary>Verwendete Hilfen dokumentieren</summary><label class="field"><span>Welche Hilfen (auch KI) haben Sie benutzt? (Nur falls verwendet.)</span><textarea data-basis-answer="ki_nutzung" maxlength="20000" placeholder="Hilfe … wofür … ; keine Zahlen oder Deutungen aus einer KI-Ausgabe übernommen." rows="3"></textarea></label></details>
    </div>
  </details>
</div>
