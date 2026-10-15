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
          <li>Im <a href="#journal">Journal</a> das eingebettete Fotostudio öffnen.</li>
          <li>Klasse, Gruppe und Quelle eintragen; JPG/PNG auswählen. HEIC vorher als JPG exportieren.</li>
          <li>Vorschauen prüfen, Bilder verarbeiten und Sammlung regelmässig als JSON herunterladen.</li>
          <li>Im Versuch <code>EIGENE_DATEN</code> und die zwei Klassen eintragen. Konfigurationszelle ausführen, JSON hochladen, dann die nächste Zelle zum Laden ausführen.</li>
          <li>Originalfotos und JSON zusätzlich unter <a href="#sicherung">Notizen &amp; Projekt</a> hinzufügen. Am Ende der Arbeitsphase ZIP herunterladen.</li>
        </ol>
        <p class="small">Bilder werden lokal verarbeitet. Bibliotheken und Modellgewichte benötigen Internet. Eine Sammlung im Fotostudio regelmässig herunterladen.</p>
      </div>
    </details>
  </div>
</details>