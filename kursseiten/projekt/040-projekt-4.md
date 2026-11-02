<details class="kapitel" id="projekt-4" data-kurz="A gegen B: Helfen vielfältigere Bilder? Ein fairer Vergleich.">
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Unser A/B-Vergleich</h2>
  </summary>
  <div class="kapitel-body detail-body" id="versuch">
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
    <details class="project-background">
      <summary>Hintergrund: Was wird bei unserem Modell trainiert?</summary>
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
Wenige Exemplare und ein Startwert begrenzen die Aussage. B muss nicht besser sein.
<!-- MD:END -->
    </div>
    <details>
      <summary>Was halten wir fest?</summary>
      <div class="detail-body">
        <!-- MD:START -->
Vorher: Vermutung. Nachher: Trefferquoten, Unterschied in Prozentpunkten und konkrete Beispiele. Modellwahl vor dem Abschlusstest begründen.
<!-- MD:END -->
        <!-- MD:START -->
Die Bilder von A und B unterscheiden sich. Ähnliche Aufnahmebedingungen verwenden; mögliche Einflüsse von Hintergrund und Licht offen benennen.
<!-- MD:END -->
      </div>
    </details>
    <details>
      <summary>Freiwillig: Wie stabil ist das Ergebnis?</summary>
      <div class="detail-body">
        <p>Nach Absprache und vor Testeinsicht: drei vorab festgelegte Startwerte 11, 22 und 33. Alle Ergebnisse berichten. Keine Voraussetzung für eine gute Note.</p>
      </div>
    </details>
  </div>
</details>