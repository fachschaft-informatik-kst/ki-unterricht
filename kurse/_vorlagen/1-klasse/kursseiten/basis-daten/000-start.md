<div class="eyebrow">
  Doppellektionen 4–5 · Das eigene Bildprojekt
</div>
<h1>Was hat unser<br/>Netz <em>gelernt?</em></h1>
<p class="lead">Eigene Bilder, ein neuronales Netz und ein fairer Vergleich im Tandem. Sie wählen Ihr Thema, untersuchen zwei Varianten und begründen, was Ihr Modell wirklich gelernt hat.</p>
<div class="project-roadmap" id="ablauf">
  <!-- MD:START -->
## Ihr Fahrplan
<!-- MD:END -->
  <p class="section-intro">Die Lehrperson führt in die Datenregeln ein. Arbeiten Sie anschliessend die sechs Etappen der Reihe nach durch. Ihre Ergebnisse halten Sie in fünf <a href="#projekt-reflexionen">Journal-Reflexionen</a> fest.</p>
  <div class="progress-card js-only">
    <div class="progress-title">
      <strong>Ihr persönlicher Projektstand</strong><span aria-live="polite" id="progress-text">0 von 6 Schritten</span>
    </div>
    <progress aria-label="Erledigte Projekt- und Abgabeschritte" id="progress" max="6" value="0"></progress>
    <!-- MD:START -->
Die Häkchen werden nur in diesem Browser gespeichert. Sie sind keine Abgabe an die Lehrperson.
<!-- MD:END -->
  </div>
  <ol class="roadmap">
    <li class="roadmap-step roadmap-start" id="projekt-start">
      <span class="roadmap-nr" aria-hidden="true">0</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>Start: Datenregeln lernen</strong><span class="roadmap-meta">DL 4 · 20–30 Min.</span></div>
        <!-- MD:START -->
Lernpfad zur fairen Datenaufteilung mit Fallbeispiel, Selbstcheck und Übungsnotebook. Hilfreich vorab: der [kurze Ziffern-/Buchstabentest](#basis-daten-experiment).
<!-- MD:END -->
      </div>
      <a class="btn primary roadmap-go" href="#projekt-regeln">Lernpfad öffnen →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-1">
      <span class="roadmap-nr" aria-hidden="true">01</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>Anwendung und Vermutung</strong><span class="roadmap-meta">DL 4 · Reflexion 1</span></div>
        <!-- MD:START -->
Wählen Sie zwei Klassen, die kein anderes Tandem verwendet, und tragen Sie sie in die Klassenliste ein (Vorbereitungsauftrag). Formulieren Sie einen Nutzen und vermuten Sie: Helfen vielfältigere Trainingsbilder? Die Lehrperson gibt Thema und Klassen zu Beginn von DL 4 frei, wenn beide Klassen noch frei sind.
<!-- MD:END -->
        <label class="check"><input data-check="phase-1" type="checkbox"/><span>Thema und zwei eigene Klassen sind in der Klassenliste eingetragen und von der Lehrperson freigegeben.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-2">Thema wählen →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-2">
      <span class="roadmap-nr" aria-hidden="true">02</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>80 Fotos vorbereiten</strong><span class="roadmap-meta">DL 4–5 · Reflexion 2 (darf in DL 5 enden)</span></div>
        <!-- MD:START -->
Fünf unabhängige Gruppen, zwei Klassen, je acht Fotos; jedes Foto bekommt seine Klasse als Label (überwachtes Lernen). Dieselben Objekte bleiben immer in derselben Gruppe. Erst die Exemplarliste abnehmen lassen, dann fotografieren: Ende DL 4 Liste abgenommen, zu Beginn DL 5 Fotos importiert. Beide Klassen unter gleichen Bedingungen fotografieren (Hintergrund, Licht); Personen nur mit Einverständnis.
<!-- MD:END -->
        <label class="check"><input data-check="phase-2" type="checkbox"/><span>Unsere Daten sind geprüft und sauber aufgeteilt.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-3">Daten &amp; Fotos →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-3">
      <span class="roadmap-nr" aria-hidden="true">03</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>A und B trainieren</strong><span class="roadmap-meta">DL 5</span></div>
        <!-- MD:START -->
Importieren Sie Ihre vorbereitete Fotostudio-JSON. A lernt aus einem Exemplar je Klasse, B aus zwei. Beide erhalten acht Bilder je Klasse. Das Netz lernt überwacht: Es vergleicht seine Vorhersage mit dem Label (der Klasse) jedes Trainingsbildes. Der Vergleich läuft einmal mit dem festen Startwert 11.
<!-- MD:END -->
        <label class="check"><input data-check="phase-3" type="checkbox"/><span>Unser A/B-Vergleich läuft; wir verstehen die beiden Varianten.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-4">A/B-Versuch →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-4">
      <span class="roadmap-nr" aria-hidden="true">04</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>Vergleichen und auswählen</strong><span class="roadmap-meta">DL 5 · Reflexion 3</span></div>
        <!-- MD:START -->
Vergleichen Sie die Validierungswerte und konkrete Vorhersagen. Wählen Sie A oder B und begründen Sie dies vor Testeinsicht.
<!-- MD:END -->
        <label class="check"><input data-check="phase-4" type="checkbox"/><span>Wir haben A und B verglichen und eine Variante begründet gewählt.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-4">A/B-Versuch →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-5">
      <span class="roadmap-nr" aria-hidden="true">05</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>Abschliessend prüfen</strong><span class="roadmap-meta">DL 5 · Reflexion 4</span></div>
        <!-- MD:START -->
Prüfen Sie nur die gewählte Variante an den unabhängigen Testbildern (Gruppen P1 und P2). Danach nichts mehr optimieren.
<!-- MD:END -->
        <label class="check"><input data-check="phase-5" type="checkbox"/><span>Unsere Auswahl war vor Testeinsicht begründet; der Abschlusstest ist ausgewertet.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-abschluss">Abschluss &amp; Abgabe →</a>
    </li>
    <li class="roadmap-step" id="projekt-etappe-6">
      <span class="roadmap-nr" aria-hidden="true">06</span>
      <div class="roadmap-body">
        <div class="roadmap-head"><strong>Fazit und Abgabe</strong><span class="roadmap-meta">DL 5 · Reflexion 5</span></div>
        <!-- MD:START -->
Halten Sie Fazit, Grenzen und den nächsten Versuch fest. Sichern Sie Journal, Fotos/JSON und Protokoll. Beide bereiten sich auf ihr vierminütiges Einzelgespräch vor.
<!-- MD:END -->
        <label class="check"><input data-check="phase-6" type="checkbox"/><span>Unser Fazit ist belegt und wir können das ganze Projekt erklären.</span></label>
      </div>
      <a class="btn roadmap-go" href="#projekt-abschluss">Abschluss &amp; Abgabe →</a>
    </li>
  </ol>
</div>
<div class="callout" id="sol-rahmen">
  <!-- MD:START -->
### Gemeinsam starten, im Tandem untersuchen
<!-- MD:END -->
  <!-- MD:START -->
**DL 4:** Datenregeln, Thema und Datenplan erarbeiten; die Lehrperson nimmt die Exemplarliste ab. Fotografieren und JSON bis DL 5 vorbereiten.

**DL 5:** Daten prüfen, A/B vergleichen, Modellwahl mit der Lehrperson kontrollieren, Abschlusstest und Journal fertigstellen.
<!-- MD:END -->
  <p><strong>Verbindlich:</strong> Fünf unabhängige Datengruppen, fairer A/B-Vergleich, fünf Reflexionen und eine begründete Modellwahl <strong>vor</strong> dem Abschlusstest. Danach keine Optimierung. <strong>Abgabe vor Beginn der Doppellektion 6.</strong></p>
  <p>Weitere <a href="materialien/downloads/ki_projektauftrag.md">Etappen-Checks im Projektauftrag</a> dienen der Orientierung.</p>
</div>
<div class="facts">
  <div class="fact">
    <strong>2 Personen</strong><small>gemeinsam untersuchen</small>
  </div>
  <div class="fact">
    <strong>2 Klassen</strong><small>auf Bildern unterscheiden</small>
  </div>
  <div class="fact">
    <strong>1 Vergleich</strong><small>gezielt eine Grösse verändern</small>
  </div>
  <div class="fact">
    <strong>Vor DL 6</strong><small>Eigenes Projekt einreichen</small>
  </div>
</div>
<p class="overview-note">Bewertet wird Ihre Untersuchung – nicht die höchste Trefferquote.</p>
<details class="project-lessons" id="projekt-doppellektionen">
  <summary>Doppellektionen 4–5 · Ziele und Leitfragen</summary>
  <div class="detail-body">
<p class="small muted">Die Doppellektionsziele helfen bei der Orientierung. In Doppellektion 4 lernen Sie die Datenaufteilung und planen das Projekt; in Doppellektion 5 folgt der Versuch.</p>
<!-- LESSONS:basis-daten -->
<!-- /LESSONS:basis-daten -->
  </div>
</details>
<p class="glossary-related"><strong>Zum Nachschlagen:</strong> <a href="#basis-glossar-ueberwachtes-lernen">überwachtes Lernen</a> · <a href="#basis-glossar-label">Label</a> · <a href="#basis-glossar-transfer-learning">Transfer Learning</a> · <a href="#basis-glossar-validierung">Validierung</a> · <a href="#basis-glossar-testdaten">Testdaten</a> · <a href="#basis-glossar-epoche">Epoche</a> · <a href="#basis-glossar-startwert">Startwert</a></p>
