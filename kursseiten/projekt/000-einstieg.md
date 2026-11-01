<div class="eyebrow">
  Doppellektion 5–8 · Von eigenen Bildern zum eigenen Urteil
</div>
<h1>Was hat unser<br/>Netz <em>gelernt?</em></h1>
<p class="small" id="projekt-vorabcheck-hinweis"><strong>Vor dem Projektstart:</strong> Der unbenotete <a href="#projekt-bereit-check">Lernstandscheck aus DL 4</a> hilft, offene Fragen zu Neuron und Netz zu erkennen. Die faire Datenaufteilung lernt ihr selbstständig im Lernpfad von DL 5.</p>
<p class="lead">Eigene Bilder. Ein neuronales Netz. Ein fairer Vergleich – zu zweit. In Doppellektion 5 lernen Sie zunächst selbstständig, wie man Daten fair aufteilt.</p>
<p class="glossary-related"><strong>Zum Nachschlagen:</strong> <a href="#glossar-transfer-learning">Transfer Learning</a> · <a href="#glossar-validierung">Validierung V1</a> · <a href="#glossar-testdaten">Testdaten P1/P2</a></p>
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
<div class="actions">
  <a class="btn primary" href="#journal">Versuch &amp; Journal →</a><a class="btn" href="#bewertung">Bewertung &amp; Abgabe</a>
</div>
<div class="ki-notebook-block" data-notebook="content/ki_projekt/ki_lernlabor.ipynb" data-title="Projekt-Lernlabor">
  <h3>Jupyter-Notebook · Projekt-Lernlabor</h3>
  <p>Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.</p>
  <button type="button" class="ki-notebook-launch" data-lab="ki_lernlabor.ipynb">Notebook hier öffnen</button>
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
    <strong>8. Doppellektion</strong><small>Abgabe &amp; Einzelgespräche</small>
  </div>
</div>
<p class="overview-note">Bewertet wird Ihre Untersuchung – nicht die höchste Trefferquote.</p>