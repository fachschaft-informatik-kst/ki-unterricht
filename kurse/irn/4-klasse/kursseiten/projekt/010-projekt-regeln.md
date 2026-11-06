<details class="kapitel" id="projekt-regeln" data-kurz="Training, Validierung und Test unterscheiden: der Lernpfad zur fairen Datenaufteilung.">
  <summary><span class="kapitel-nr">0</span>
    <h2 class="kapitel-titel">Datenregeln lernen</h2>
  </summary>
  <div class="kapitel-body detail-body" id="daten">
    <p class="page-crumb"><a href="#projekt">‹ Fahrplan</a><span>Start · Richtwert DL 5</span></p>
    <!-- MD:START -->
## Daten fair aufteilen.
<!-- MD:END -->
    <p class="section-intro">Drei Datenrollen · Datenlecks erkennen · fünf Gruppen planen.</p>
    <div class="card">
      <!-- MD:START -->
### Selbstlernauftrag · Daten fair aufteilen (ca. 20–30 Minuten)

**Das lernen Sie hier ohne Einführung der Lehrperson:** Sie können die drei Datenrollen unterscheiden, ein Datenleck erkennen und Ihre eigenen Fotos so auf fünf Gruppen verteilen, dass das Ergebnis aussagekräftig bleibt.

**Arbeitsweg:** (1) Erklärungen lesen → (2) Fälle selbst lösen → (3) mit der Lösung vergleichen → (4) Notebook ausprobieren → (5) eigene fünf Gruppen planen (auf der Seite [«Daten &amp; Fotos»](#projekt-3)). Arbeiten Sie zu zweit, halten Sie die erste Vermutung aber jeweils allein fest. Bei Fehlern: Erklärung nochmals lesen und die Lösung verbessern.

**Die fünf Gruppen:** Ihre Fotos werden in fünf Gruppen sortiert, benannt mit Anfangsbuchstabe und Nummer: **T1 und T2** (T = Training), **V1** (V = Validierung) und **P1 und P2** (P = Prüfung, der Abschlusstest). Jede Gruppe enthält pro Klasse ein anderes Exemplar mit acht Fotos; die Übersicht steht auf der Seite [«Daten &amp; Fotos»](#projekt-3). Welche Aufgabe jede Gruppe hat, zeigen die drei folgenden Karten.

**Überwachtes Lernen braucht Labels:** Ihr Bildmodell lernt überwacht, wie das Neuron in Doppellektion 3 und das Ziffernnetz in Doppellektion 4. Jedes Foto trägt als **Label** seine Klasse (zum Beispiel «Apfel»), die Sie beim Sortieren im Fotostudio festlegen. Training, Validierung und Test nutzen dieselben Labels, aber verschieden: Das Training lernt daran. Validierung und Test vergleichen nur die Vorhersage mit dem Label, ohne danach zu lernen.
<!-- MD:END -->
      <div class="lesson-steps">
        <article>
          <b>1 · Training: Gewichte lernen</b>
          <!-- MD:START -->
Mit den **Trainingsbildern** passt unser **kleines Netz** seine Gewichte an: Es vergleicht seine Vorhersage mit dem Label jedes Bildes. Das MobileNet davor bleibt unverändert ([Wer weiss was?](#projekt-wer-weiss-was)). Beispiele aus T1 und T2 dürfen beim Lernen verwendet werden. Dass das Netz diese Bilder erkennt, sagt allein noch nicht, ob es neue Bilder erkennt.
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

Öffnen Sie das Notebook und bearbeiten Sie der Reihe nach **«Drei Aufgaben für Daten»**, **«Ein Datenleck entdecken»** und **«Vergleich · Drei Werte»**. Notieren Sie jeweils zuerst eine Vermutung und führen Sie dann die Zelle aus. Beim Datenleck-Versuch ändern Sie danach `TRAININGSBILDER` auf 40 und auf 400. Vergleichen Sie Ihre Beobachtung mit dem Merksatz.
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
      <label class="field answer"><span>Datenleck-Versuch: Wie viel Prozent erreichte das Netz mit Kopien der Trainingsbilder, wie viel mit wirklich neuen Bildern? Was änderte sich bei 40 und bei 400 Trainingsbildern, und warum sagt der Wert mit Kopien nichts über neue Bilder aus?</span><textarea data-answer="datenleck_versuch" rows="4" maxlength="10000" placeholder="Mit Kopien … %, mit neuen Bildern … %. Bei 40 Bildern …, bei 400 …. Der Wert mit Kopien sagt nichts aus, weil …"></textarea></label>
      <label class="field answer"><span>Drei Werte: Welcher Wert (Training, Validierung oder Test) beschreibt die endgültig gewählte Variante am besten, und warum nicht die beiden anderen?</span><textarea data-answer="drei_werte" rows="3" maxlength="10000" placeholder="Am besten beschreibt der … Wert die Variante, weil … Der Trainingswert ist hoch, weil …"></textarea></label>
      <details>
        <summary>Selbstkontrolle zum Versuch</summary>
        <div class="detail-body">
          <!-- MD:START -->
**Datenleck:** Mit Kopien der Trainingsbilder schneidet das Netz deutlich besser ab als mit wirklich neuen Bildern (Beispielwerte: bei 100 Trainingsbildern etwa 96 % gegen 84 %, bei 40 Bildern etwa 100 % gegen 67 %, bei 400 Bildern nur noch etwa 96 % gegen 94 %). Der Wert mit Kopien zeigt nur, dass das Netz Bekanntes wiedererkennt. Je weniger Trainingsbilder, desto stärker täuscht ein Leck. Ihre Zahlen können abweichen, die Richtung bleibt.

**Drei Werte:** Der Trainingswert ist fast immer am höchsten, weil das Netz diese Bilder kennt. Die Validierung hilft bei der Auswahl, ihr Wert ist dadurch schon etwas beschönigt. Der Test, einmal und erst nach der Auswahl mit neuen Exemplaren, beschreibt die gewählte Variante am ehrlichsten.
<!-- MD:END -->
        </div>
      </details>
    </div>
    <nav class="page-next" aria-label="Weiter im Projekt">
      <a class="btn" href="#projekt">‹ Fahrplan</a>
      <a class="btn primary" href="#projekt-2">Weiter: Thema wählen →</a>
    </nav>
  </div>
</details>
