<details class="kapitel" id="projekt-4" data-kurz="A gegen B: Helfen vielfältigere Bilder? Ein fairer Vergleich.">
  <summary><span class="kapitel-nr">3–4</span>
    <h2 class="kapitel-titel">A/B-Versuch</h2>
  </summary>
  <div class="kapitel-body detail-body" id="versuch">
    <p class="page-crumb"><a href="#projekt">‹ Fahrplan</a><span>Etappen 3–4 · Richtwert DL 6</span></p>
    <!-- MD:START -->
## Helfen vielfältigere Bilder?
<!-- MD:END -->
    <p class="section-intro">Gleiche Bildzahl. Gleiches Netz. Unterschiedliche Exemplare.</p>
    <article class="experiment" data-experiment="vielfalt">
      <div class="versus">
        <div class="variant">
          A · weniger Vielfalt<strong>1 Exemplar</strong>
          <!-- MD:START -->
8 Fotos aus T1 pro Klasse
<!-- MD:END -->
        </div>
        <div class="variant">
          B · mehr Vielfalt<strong>2 Exemplare</strong>
          <!-- MD:START -->
4 Fotos aus T1 + 4 aus T2 pro Klasse
<!-- MD:END -->
        </div>
      </div>
      <!-- MD:START -->
Beide: 16 Neuronen, 60 Epochen, Startwert 11 und dieselben Validierungsbilder.
<!-- MD:END -->
    </article>
    <p class="project-workplace"><strong>Durchgeführt wird der Versuch im Journal:</strong> <a href="#projekt-werkbank">Notebook «Unser Versuch» öffnen</a> · <a href="#projekt-reflexionen">Reflexion 3 festhalten</a></p>
    <details class="project-background">
      <summary>Hintergrund: Was wird trainiert – und wer weiss was?</summary>
      <div class="detail-body">
        <!-- Klarer Überblick vor dem ersten Training: nur das zweite Netz lernt. -->
        <div class="project-train-overview" aria-labelledby="projekt-training-titel">
          <h2 id="projekt-training-titel">Was wird hier eigentlich trainiert?</h2>
          <ol class="project-train-flow">
            <li><strong>1 · Unsere Bilder</strong><span>80 Bilder aus zwei Klassen, z. B. Apfel und Birne.</span></li>
            <li class="model-fixed"><strong>2 · MobileNet</strong><span>Liefert 1280 Merkmale pro Bild.</span><em>Vortrainiert · bleibt unverändert</em></li>
            <li class="model-trained"><strong>3 · Unser kleines Netz</strong><span>16 Neuronen · lernt mit 16 Trainingsbildern pro Variante in 60 Epochen.</span><em>Hier wird wirklich trainiert!</em></li>
            <li><strong>4 · Vorhersage &amp; Test</strong><span>Welche Klasse ist es? Funktioniert das auch mit neuen Bildern?</span></li>
          </ol>
          <p class="project-train-note"><strong>Merken Sie sich:</strong> Die Merkmale kommen aus einem fertigen Modell. <strong>Trainiert wird nur unser nachgeschaltetes kleines Netz.</strong></p>
        </div>
        <div class="project-who-knows" id="projekt-wer-weiss-was" aria-labelledby="projekt-wer-weiss-titel">
          <h2 id="projekt-wer-weiss-titel">Wer weiss was?</h2>
          <div class="who-grid">
            <article class="who-card model-fixed">
              <strong>MobileNet <em>vortrainiert · bleibt unverändert</em></strong>
              <p><b>Kennt:</b> Formen, Texturen und Muster aus über einer Million fremder Fotos mit vielen Alltagsgegenständen.</p>
              <p><b>Kennt nicht:</b> Ihre zwei Klassen. Sein Ausgang mit 1000 Klassennamen wird hier nicht benutzt.</p>
            </article>
            <article class="who-card model-trained">
              <strong>Unser kleines Netz <em>lernt aus Ihren Fotos</em></strong>
              <p><b>Lernt:</b> Welche Zahlenmuster aus den 1280 Merkmalen zu Klasse A und welche zu Klasse B gehören.</p>
              <p><b>Kennt nicht:</b> Was ein «Apfel» ist. Es sieht nur Zahlen und Ihre Beispiele, also auch Hintergrund und Licht.</p>
            </article>
          </div>
          <p class="project-train-note"><strong>Darum zählt der Test mit neuen Exemplaren:</strong> Ob das Netz Ihre Klassen oder nur Hintergrund und Licht unterscheidet, zeigt sich erst bei Bildern, die es nie gesehen hat.</p>
        </div>
      </div>
    </details>
    <div class="ki-notebook-block" data-notebook="content/ki_projekt/ki_lernlabor.ipynb" data-title="Projekt-Lernlabor">
      <!-- MD:START -->
### Bei Bedarf: Projekt-Lernlabor
<!-- MD:END -->
      <!-- MD:START -->
Zum Ausprobieren und Wiederholen: Python-Zellen öffnen, bearbeiten und mit Shift + Enter ausführen. Für den eigentlichen A/B-Vergleich verwenden Sie später «Unser Versuch» im Journal.
<!-- MD:END -->
      <button type="button" class="ki-notebook-launch" data-lab="ki_lernlabor.ipynb">Notebook hier öffnen</button>
    </div>
    <div class="callout">
      <strong>Ein Lauf ist eine Beobachtung, kein Beweis.</strong>
      <!-- MD:START -->
Wenige Exemplare und ein Startwert begrenzen die Aussage. B muss nicht besser sein. **V1 sind 16 Bilder, aber nur ein Exemplar je Klasse:** 16 Bilder sind nicht 16 unabhängige Tests, und ein Bild entspricht 6,25 Prozentpunkten. Faustregel (Richtwert, kein statistisches Kriterium): Ein Unterschied von höchstens zwei Bildern ist kein Beleg. Bei Gleichstand begründen Sie Ihre Wahl mit einem anderen Argument, zum Beispiel mit einzelnen Vorhersagen.
<!-- MD:END -->
    </div>
    <details>
      <summary>Was halten wir fest?</summary>
      <div class="detail-body">
        <!-- MD:START -->
Vorher: Vermutung. Nachher: richtig/gesamt auf V1 (zum Beispiel 11 von 16), Unterschied in Bildern und konkrete Beispiele. Modellwahl vor dem Abschlusstest begründen.
<!-- MD:END -->
        <!-- MD:START -->
Die Bilder von A und B unterscheiden sich. Ähnliche Aufnahmebedingungen verwenden; mögliche Einflüsse von Hintergrund und Licht offen benennen. Gleich bleiben bei A und B: Bildzahl, Netz, Epochen, Startwert und Validierungsbilder. Nur so lässt sich ein Unterschied der Vielfalt zuschreiben.
<!-- MD:END -->
      </div>
    </details>
    <details>
      <summary>Wie stabil ist das Ergebnis?</summary>
      <div class="detail-body">
        <p>Wiederholen Sie den Vergleich vor der Auswahl mit den drei vorab festgelegten Startwerten 11, 22 und 33 (eigene Zelle im Versuchsnotebook, ca. 5 Minuten). Berichten Sie alle Ergebnisse und prüfen Sie, ob A und B in jedem Lauf gleich abschneiden. Nach Testeinsicht sind keine weiteren Startwerte erlaubt.</p>
      </div>
    </details>
    <nav class="page-next" aria-label="Weiter im Projekt">
      <a class="btn" href="#projekt-3">‹ Daten &amp; Fotos</a>
      <a class="btn primary" href="#projekt-abschluss">Weiter: Abschluss &amp; Abgabe →</a>
    </nav>
  </div>
</details>