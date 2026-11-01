<details class="kapitel" id="projekt-3" data-kurz="Fünf Gruppen, 80 Fotos: so planen und sammeln Sie gute Daten.">
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Datenplan · 80 Fotos</h2>
  </summary>
  <div class="kapitel-body detail-body" id="daten">
    <!-- MD:START -->
## Gute Daten beginnen mit einem Plan.
<!-- MD:END -->
    <p class="section-intro">Eigene Fotos · klare Klassen · unabhängige Exemplare.</p>
    <div class="card">
      <!-- MD:START -->
### Selbstlernauftrag · Daten fair aufteilen (ca. 20–30 Minuten)

**Das lernen Sie hier ohne Einführung der Lehrperson:** Sie können die drei Datenrollen unterscheiden, ein Datenleck erkennen und Ihre eigenen Fotos so auf fünf Gruppen verteilen, dass das Ergebnis aussagekräftig bleibt.

**Arbeitsweg:** (1) Erklärungen lesen → (2) Fälle selbst lösen → (3) mit der Lösung vergleichen → (4) Notebook ausprobieren → (5) eigene fünf Gruppen planen. Arbeiten Sie zu zweit, halten Sie die erste Vermutung aber jeweils allein fest. Bei Fehlern: Erklärung nochmals lesen und die Lösung verbessern.
<!-- MD:END -->
      <div class="lesson-steps">
        <article>
          <b>1 · Training: Gewichte lernen</b>
          <!-- MD:START -->
Mit den **Trainingsbildern** passt das Netz seine Gewichte an. Beispiele aus T1 und T2 dürfen beim Lernen verwendet werden. Dass das Netz diese Bilder erkennt, sagt allein noch nicht, ob es neue Bilder erkennt.
<!-- MD:END -->
        </article>
        <article>
          <b>2 · Validierung: Variante auswählen</b>
          <!-- MD:START -->
**V1** enthält neue Exemplare, deren Bilder nicht im Training waren. Mit diesen Ergebnissen vergleichen Sie Modell A und B und entscheiden **vor** dem Abschlusstest, welche Variante Sie behalten.
<!-- MD:END -->
        </article>
        <article>
          <b>3 · Test: unabhängig prüfen</b>
          <!-- MD:START -->
**P1 und P2** bleiben bis nach der Auswahl unbenutzt. Sie zeigen, wie die **festgelegte** Variante mit bisher unbekannten Exemplaren zurechtkommt. Nach dem Test werden weder die Gewichte noch die Modellwahl nachträglich angepasst.
<!-- MD:END -->
        </article>
      </div>
      <!-- MD:START -->
### Fallbeispiel · Zwei Äpfel

Ein Tandem fotografiert einen roten Apfel **achtmal** mit verschiedenen Hintergründen. Vier Fotos legt es nach T1, vier nach P1. Der Test ergibt eine sehr hohe Trefferquote.

**Überlegen Sie ohne Lösung:** Kann das ein überzeugender unabhängiger Test sein? Entscheidend ist nicht nur, ob zwei Bilddateien verschieden sind, sondern **ob derselbe reale Gegenstand** schon beim Training vorkam.
<!-- MD:END -->
      <details>
        <summary>Lösung zum Apfelbeispiel prüfen</summary>
        <div class="detail-body">
          <!-- MD:START -->
**Nein: Datenleck.** Das Netz könnte Merkmale genau dieses Apfels wiedererkennen. Andere Perspektive und anderer Hintergrund machen aus demselben Apfel **kein neues Exemplar**. Alle acht Bilder dieses Apfels gehören in dieselbe Gruppe. Für P1 benötigen Sie einen **anderen Apfel**, der im Training nicht vorkam.
<!-- MD:END -->
        </div>
      </details>
      <!-- MD:START -->
### Selbstcheck · Drei Entscheidungen

Ordnen Sie zunächst ohne Hilfe zu und begründen Sie kurz:

1. Sie probieren zwei Netzwerkvarianten aus. Mit welchen Bildern entscheiden Sie, welche besser geeignet ist: T1, V1 oder P1?
2. Nach der Modellwahl fotografieren Sie einen bisher unbekannten Gegenstand. In welchen Bereich gehört der unabhängige Abschlusstest?
3. Eine Person wurde für T2 fotografiert und zeigt dieselbe Geste nochmals für P2. Darf das als unabhängiger Test verwendet werden?

Vergleichen Sie Ihre Antworten erst, wenn Sie alle drei gelöst haben.
<!-- MD:END -->
      <label class="field answer"><span>Selbstcheck: Notieren Sie Ihre drei Entscheidungen zu V1/P1, unabhängigem Abschlusstest und Datenleck – jeweils mit kurzer Begründung.</span><textarea data-answer="projekt_datencheck" rows="4" maxlength="10000" placeholder="1. Zur Modellwahl … / 2. Der Abschlusstest … / 3. Dieselbe Person …"></textarea></label>
      <details>
        <summary>Musterlösung und Begründungen anzeigen</summary>
        <div class="detail-body">
          <!-- MD:START -->
1. **V1 (Validierung):** Mit V1 vergleichen Sie A und B, ohne den Abschlusstest zu verbrauchen.
2. **P1/P2 (Test):** Die ausgewählte Variante wird mit neuen, bislang ungesehenen Exemplaren geprüft.
3. **Nein:** Dieselbe Person in T2 und P2 ist ein Datenleck. Für die Testgruppen braucht es andere Personen. Bei Gesten sind fünf unterschiedliche Personen nötig, die jeweils beide Gesten zeigen.

**Merksatz:** Trainingsdaten helfen beim Lernen, Validierungsdaten bei der Auswahl und Testdaten prüfen am Schluss unabhängig.
<!-- MD:END -->
        </div>
      </details>
      <!-- MD:START -->
### Interaktiver Versuch · Datenleck erkennen

Öffnen Sie das Notebook, bearbeiten Sie zuerst **«Drei Aufgaben für Daten»**, danach **«Ein Datenleck»**. Lesen Sie jeweils die Frage, treffen Sie eine Vermutung und verändern Sie **eine Einstellung**. Vergleichen Sie Ihre Beobachtung mit dem Merksatz. Die dritte Vertiefung ist freiwillig.
<!-- MD:END -->
      <div class="ki-notebook-block" data-notebook="content/daten_training.ipynb" data-title="Daten fair aufteilen">
        <!-- MD:START -->
### Jupyter-Notebook · Daten fair aufteilen
<!-- MD:END -->
        <!-- MD:START -->
Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.
<!-- MD:END -->
        <button type="button" class="ki-notebook-launch" data-lab="daten_training.ipynb">Notebook hier öffnen</button>
      </div>
    </div>
    <div class="card">
      <!-- MD:START -->
### Fünf Gruppen. 80 Fotos.
<!-- MD:END -->
      <!-- MD:START -->
Pro Gruppe ein anderes Exemplar jeder Klasse, davon je acht Fotos. Bei Gesten: fünf verschiedene Personen, die beide Gesten zeigen.
<!-- MD:END -->
      <div class="groups">
        <div class="group-box train">
          <strong>T1</strong>Training
        </div>
        <div class="group-box train">
          <strong>T2</strong>Training
        </div>
        <div class="group-box val">
          <strong>V1</strong>Auswählen
        </div>
        <div class="group-box test">
          <strong>P1</strong>Test
        </div>
        <div class="group-box test">
          <strong>P2</strong>Test
        </div>
      </div>
      <div class="legend">
        <span><i class="dot" style="background:#557567"></i>Training: Gewichte lernen</span><span><i class="dot" style="background:#526fa0"></i>Validierung: Varianten auswählen</span><span><i class="dot" style="background:#b84d27"></i>Test: Auswahl abschliessend prüfen</span>
      </div>
      <div class="js-only" style="margin-top:23px">
        <p id="image-total">2 Klassen × 5 Gruppen × 8 Fotos = <strong>80 Bilder</strong><br/>32 im Trainingspool · 16 zur Validierung · 32 zum Abschlusstest</p>
      </div>
      <p class="print-note">80 Bilder: 32 im Trainingspool, 16 zur Validierung, 32 zum Test.</p>
    </div>
    <div class="callout warn">
      <strong>Acht Fotos desselben Objekts sind ein Exemplar.</strong>
      <!-- MD:START -->
Derselbe Gegenstand oder dieselbe Person bleibt immer in derselben Gruppe – auch bei anderem Hintergrund.
<!-- MD:END -->
    </div>
    <div class="card">
      <!-- MD:START -->
### Transfer · Ihr eigener Datenplan

Tragen Sie für **beide Klassen** je fünf voneinander unabhängige Exemplare ein: T1, T2, V1, P1 und P2. Planen Sie **acht Fotos pro Exemplar**. Wenn Sie die Exemplare noch nicht haben, beschreiben Sie eindeutig, welche Sie sammeln möchten. Bei Gesten brauchen Sie fünf unterschiedliche Personen; jede zeigt beide Gesten.

Rechnen Sie nach: **2 Klassen × 5 Gruppen × 8 Fotos = 80 Bilder**. Insgesamt sind **32 Trainings-, 16 Validierungs- und 32 Testbilder** vorgesehen. Die beiden Klassen sollen unter vergleichbaren Aufnahmebedingungen fotografiert werden.

**Abschlusskontrolle:**
1. Steht kein realer Gegenstand oder keine Person in mehr als einer Gruppe?
2. Sind V1, P1 und P2 unabhängig von T1 und T2?
3. Wird V1 zur Entscheidung verwendet und P1/P2 erst für den Abschlusstest?
4. Sind beide Klassen mit je 40 Fotos vertreten und die Quellen dokumentiert?
5. Können Sie in einem Satz erklären, warum eine hohe Trefferquote auf bekannten Bildern kein unabhängiger Test ist?

Wenn etwas noch nicht stimmt, korrigieren Sie zuerst Ihren Plan. Halten Sie das Ergebnis in **Reflexion 2 des bestehenden Journals** fest – kein neues Formular und keine zusätzliche Abgabe. Sichern Sie Ihre Arbeit unter «Notizen &amp; Projekt» als ZIP. Bei offenen Fragen benutzen Sie zuerst die Musterlösung oben und die Notebook-Erklärungen.
<!-- MD:END -->
      <p><a href="#journal">Zur Reflexion im Journal →</a> · <a href="#sicherung">Stand als ZIP sichern →</a></p>
    </div>
    <details>
      <summary>Fotos aufnehmen &amp; Bildformat verstehen</summary>
      <div class="detail-body">
        <div class="grid two">
          <article class="card">
            <!-- MD:START -->
### So sammeln Sie
<!-- MD:END -->
            <ul>
              <li>Gruppen und Rollen vor dem Training festlegen.</li>
              <li>Abstand, Perspektive und Licht sinnvoll variieren.</li>
              <li>Aufnahmebedingungen zwischen Klassen vergleichbar halten.</li>
              <li>Kopien und fast identische Serien vermeiden.</li>
              <li>Gruppencodes, Quellen und Originalbilder sichern.</li>
            </ul>
          </article>
          <article class="card">
            <!-- MD:START -->
### So werden Bilder einheitlich
<!-- MD:END -->
            <p>Das Fotostudio passt jedes Bild proportional in eine weisse Fläche mit <strong>224 × 224 Pixeln</strong> ein. Es erhält das Seitenverhältnis und verarbeitet drei Farbkanäle.</p>
            <!-- MD:START -->
MobileNet liefert 1280 Merkmale; das Notebook normiert sie je Bild. Die kleinen 64 × 64-Vorschauen dienen nur der Anzeige. Prüfen Sie Motiv und Ausrichtung vor dem Export.
<!-- MD:END -->
          </article>
        </div>
        <p class="small">Internetbilder nur nach Absprache: Quellen und Nutzungsbedingungen dokumentieren. Gruppennamen prüft der Code; die tatsächliche Trennung prüfen Sie.</p>
      </div>
    </details>
    <details>
      <summary>Fotostudio: vom Handybild zum Versuch</summary>
      <div class="detail-body">
        <ol>
          <li>Das <a href="#projekt-fotostudio">Fotostudio direkt hier im Datenplan</a> öffnen.</li>
          <li>Klasse, Gruppe und Quelle eintragen; JPG/PNG auswählen. HEIC vorher als JPG exportieren.</li>
          <li>Vorschauen prüfen, Bilder verarbeiten und Sammlung regelmässig als JSON herunterladen.</li>
          <li>Im Versuch <code>EIGENE_DATEN</code> und die zwei Klassen eintragen. Konfigurationszelle ausführen, JSON hochladen, dann die nächste Zelle zum Laden ausführen.</li>
          <li>Originalfotos und JSON zusätzlich unter <a href="#sicherung">Notizen &amp; Projekt</a> hinzufügen. Am Ende der Arbeitsphase ZIP herunterladen.</li>
        </ol>
        <p class="small">Bilder werden lokal verarbeitet. Bibliotheken und Modellgewichte benötigen Internet. Eine Sammlung im Fotostudio regelmässig herunterladen.</p>
      </div>
    </details>
    <div class="card project-photo-step" id="projekt-fotostudio">
      <span class="project-photo-step-label">Schritt 2 · Thema und Bilder vorbereiten</span>
      <h3>Fotostudio · Ihre Bilder aufbereiten</h3>
      <p>Erst die fünf unabhängigen Gruppen T1, T2, V1, P1 und P2 planen, dann die Fotos aufnehmen. Im Fotostudio ordnen Sie Bilder den beiden Klassen und den Gruppen zu, prüfen die Vorschau und exportieren Ihre Sammlung als JSON.</p>
      <div class="actions">
        <button class="btn primary" id="start-studio" type="button">Fotostudio öffnen</button>
        <a class="btn" href="#projekt-reflexionen">Datenplan im Journal festhalten</a>
      </div>
      <p class="small muted">Speichern Sie die JSON-Datei regelmässig. Die Originalfotos später zusätzlich unter <a href="#sicherung">Notizen &amp; Projekt</a> sichern.</p>
      <details hidden="" id="studio-panel" open="">
        <summary>Fotostudio · eigene Bilder vorbereiten</summary>
        <iframe class="studio-frame" id="studio-frame" title="Fotostudio – Bilder vorbereiten"></iframe>
      </details>
    </div>
  </div>
</details>