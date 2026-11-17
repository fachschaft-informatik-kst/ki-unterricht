<details class="kapitel" id="netze-4" data-kurz="Die Rolle der Zwischenschicht im neuronalen Netz mit eigenen Worten sichern." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was wir über neuronale Netze gelernt haben</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
**Sicherung (unbenotet, ca. 5 Minuten):** Beantworten Sie zuerst die Netzfrage, vergleichen Sie dann mit der Selbstkontrolle. Die Vorschau auf DL 4 dürfen Sie raten.
<!-- MD:END -->
    <label class="field answer"><span>1 · Netz: Warum scheitert ein einzelnes Neuron an XOR? Berechnen Sie mit OR, NAND und «Keine Prüfung» die Ausgaben für (S, F, P) = (1,1,0) und (1,0,1). Nutzen Sie die Grafik aus Kapitel 2.</span><textarea data-answer="netze" maxlength="10000" placeholder="Bei P = 0 ergibt XOR …, OR …, NAND …; bei P = 1 wirkt der Prüfungswert …" rows="4"></textarea></label>
    <div class="callout" id="netze-bruecke">
      <!-- MD:START -->
**Bildprojekt:** Statt S, F und P liefert das feste **MobileNet** für jedes Foto **1280 Merkmale**. Nur das kleine Netz dahinter lernt die zwei Klassen: vorhersagen, mit dem **Label** vergleichen und Gewichte korrigieren – wieder **überwachtes Lernen**. [Wer weiss was? →](#basis-training)
<!-- MD:END -->
      <figure class="concept-figure">
        <img alt="Ablauf im Bildprojekt: Ein Foto geht in MobileNet, das vorab trainiert wurde und fest bleibt. MobileNet liefert 1280 Zahlen je Foto. Ein kleines Netz lernt aus diesen Zahlen Gewichte und Bias und gibt eine Vorhersage für Klasse A oder B aus. Beim Training bekommt es zu jedem Foto das Label, also die Klasse, die Sie dem Foto gegeben haben (überwachtes Lernen)." loading="lazy" src="grafiken/mobilenet_bruecke.svg"/>
        <figcaption>MobileNet bleibt fest; das kleine Netz lernt aus den Klassenlabels.</figcaption>
      </figure>
      <!-- MD:START -->
**Brückenkarte: Vom Neuron zum Bildprojekt**

| Hier (DL 2–3) | Im Projekt (DL 4–6) |
|---|---|
| 3 Schwimmbad-Eingaben (für XOR erst 2 bei P = 0) | 1280 Zahlen je Foto («Merkmale»), berechnet vom fertigen MobileNet |
| Überwachtes Lernen: Zu jedem Beispiel gibt es ein Ziel (XOR: 0 oder 1) | Überwachtes Lernen: Zu jedem Foto gibt es ein Label, Ihre Klasse (A oder B) |
| Gewichte und Bias werden angepasst | Gewichte und Bias des kleinen Netzes werden angepasst; MobileNet bleibt unverändert |
| Eine Runde = alle 4 Beispiele einmal | Eine «Epoche» = alle Trainingsbilder einmal |
| Der Startwert bestimmt die Anfangsgewichte (probiert: Startwert 0 bis 5) | Der «Startwert» ist im Projekt festgelegt; ein anderer Startwert kann ein anderes Ergebnis geben |
| Ziel: alle 4 Fälle stimmen | Ziel: auch bei Fotos stimmen, die das Netz nie gesehen hat; darum gibt es ungesehene Testbilder (DL 4) |
<!-- MD:END -->
    </div>
    <div class="callout" id="projekt-bereit-check" data-p1-diagnostic>
      <!-- MD:START -->
### Lernstandscheck vor DL 4: Brücke und Vorschau (unbenotet, 2 Minuten)
<!-- MD:END -->
      <ol>
        <li><strong>Brücke:</strong> Welcher Teil lernt, wenn MobileNet 1280 Zahlen pro Foto liefert? Was wird angepasst, und woher kommt das richtige Ziel?</li>
        <li><strong>Vorschau (Raten erlaubt):</strong> Welche Bilder sollte man für einen unabhängigen Test bis zum Schluss zurückhalten – und warum?</li>
      </ol>
      <label class="field answer"><span>Meine Kurzantworten und eine offene Frage (nicht benotet)</span><textarea data-answer="projekt_bereit_check" maxlength="2000" rows="3" placeholder="1 … / 2 (Vorschau) … / Ich brauche noch Hilfe bei …"></textarea></label>
      <details class="basis-hint">
        <summary>Selbstkontrolle und Hilfe</summary>
        <div class="detail-body">
          <!-- MD:START -->
**Netz:** XOR kann ein Neuron wegen seiner geraden Entscheidungsgrenze nicht lösen. Die Zwischenschicht berechnet OR, NAND und «Keine Prüfung»; nur drei Einsen ergeben Ja. Für (1,1,0): OR = 1, NAND = 0, «Keine Prüfung» = 1 → 1 + 0 + 1 − 2,5 = −0,5 → Nein. Für (1,0,1): OR = 1, NAND = 1, «Keine Prüfung» = 0 → 1 + 1 + 0 − 2,5 = −0,5 → Nein. Ohne Prüfung wäre (1,0,0) → Ja.

1. **Brücke:** MobileNet liefert feste 1280 Merkmale; nur das kleine Netz lernt Gewichte und Bias. Eingaben und Ausgabeklassen bleiben gleich. Das richtige Ziel ist das Klassenlabel des Fotos.
2. **Vorschau:** Testbilder bleiben bis zum Schluss ungesehen, damit die Prüfung auf neuen Daten unabhängig ist. Das folgt in DL 4.

Falls etwas unklar ist, wiederholen Sie die passende Aufgabe oder nutzen Sie das Lernlabor.
<!-- MD:END -->
        </div>
      </details>
    </div>
  </div>
</details>