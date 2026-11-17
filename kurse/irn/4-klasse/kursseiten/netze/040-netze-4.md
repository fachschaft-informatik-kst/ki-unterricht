<details class="kapitel" id="netze-4" data-kurz="Die Rolle der Zwischenschicht im neuronalen Netz mit eigenen Worten sichern." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was wir über neuronale Netze gelernt haben</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
**Sicherung (einzeln, unbenotet, ca. 5 Minuten):** Schreiben Sie zuerst, vergleichen Sie danach mit der Selbstkontrolle. Zwei Fragen genügen; die Vorschaufrage unten dürfen Sie raten. Die Planung und Datenaufteilung folgen selbstständig in Doppellektion 5.
<!-- MD:END -->
    <label class="field answer"><span>1 · Netz: Warum kann ein einzelnes Neuron XOR nicht lösen, und wie hilft die Zwischenschicht? Erklären Sie dazu die Ausgaben von OR, NAND und AND für die Eingabe (1,1). Prüfen Sie Ihre Rechnung an der Netzgrafik.</span><textarea data-answer="netze" maxlength="10000" placeholder="Ein einzelnes Neuron kann XOR nicht lösen, weil … Für (1,1) liefert OR …, NAND … und AND …" rows="4"></textarea></label>
    <div class="callout" id="netze-bruecke">
      <!-- MD:START -->
**Ausblick auf das Bildprojekt:** Dort arbeitet ein Netz wie dieses, aber mit 1280 statt 2 Eingaben. Die Zahlen liefert MobileNet, ein fertiges Netz, das unverändert bleibt. Nur das kleine Netz dahinter lernt Ihre zwei Klassen, nach denselben Schritten wie hier: vorhersagen, Fehler bewerten (gegen das Label), Gewichte anpassen. Es ist wieder **überwachtes Lernen**: Ihre zwei Klassen sind die Labels. [Wer weiss was? →](#projekt-wer-weiss-was)
<!-- MD:END -->
      <figure class="concept-figure">
        <img alt="Ablauf im Bildprojekt: Ein Foto geht in MobileNet, das vorab trainiert wurde und fest bleibt. MobileNet liefert 1280 Zahlen je Foto. Ein kleines Netz lernt aus diesen Zahlen Gewichte und Bias und gibt eine Vorhersage für Klasse A oder B aus. Beim Training bekommt es zu jedem Foto das Label, also die Klasse, die Sie dem Foto gegeben haben (überwachtes Lernen)." loading="lazy" src="grafiken/mobilenet_bruecke.svg"/>
        <figcaption>Der Weg eines Fotos im Projekt: MobileNet bleibt fest, nur das kleine Netz lernt, überwacht mit Ihrer Klasse als Label.</figcaption>
      </figure>
      <!-- MD:START -->
**Brückenkarte: Vom Neuron zum Bildprojekt**

| Hier (DL 3–4) | Im Projekt (DL 5–8) |
|---|---|
| 2 Eingaben | 1280 Zahlen je Foto («Merkmale»), berechnet vom fertigen MobileNet |
| Überwachtes Lernen: Zu jedem Beispiel gibt es ein Ziel (XOR: 0 oder 1) | Überwachtes Lernen: Zu jedem Foto gibt es ein Label, Ihre Klasse (A oder B) |
| Gewichte und Bias werden angepasst | Gewichte und Bias des kleinen Netzes werden angepasst; MobileNet bleibt unverändert |
| Eine Runde = alle 4 Beispiele einmal | Eine «Epoche» = alle Trainingsbilder einmal |
| Der Startwert bestimmt die Anfangsgewichte (probiert: Startwert 0 bis 5) | Der «Startwert» ist im Projekt festgelegt; ein anderer Startwert kann ein anderes Ergebnis geben |
| Ziel: alle 4 Fälle stimmen | Ziel: auch bei Fotos stimmen, die das Netz nie gesehen hat; darum gibt es ungesehene Testbilder (DL 5) |
<!-- MD:END -->
    </div>
    <div class="callout" id="projekt-bereit-check" data-p1-diagnostic>
      <!-- MD:START -->
### Lernstandscheck vor DL 5: Brücke und Vorschau (unbenotet, 2 Minuten)
<!-- MD:END -->
      <ol>
        <li><strong>Brücke:</strong> Im Projekt liefert ein fertiges Netz 1280 Zahlen je Foto. Welcher Teil lernt, welcher bleibt fest? Was ändert sich beim Lernen: die Eingaben, die Gewichte oder die Ausgabeklassen? Woher kennt der lernende Teil die richtige Antwort?</li>
        <li><strong>Vorschau (Raten erlaubt):</strong> Welche Bilder sollten erst ganz am Schluss für eine unabhängige Prüfung geöffnet werden, und warum? Das erarbeiten Sie in Doppellektion 5.</li>
      </ol>
      <label class="field answer"><span>Meine Kurzantworten und eine offene Frage (nicht benotet)</span><textarea data-answer="projekt_bereit_check" maxlength="2000" rows="3" placeholder="1 … / 2 (Vorschau) … / Ich brauche noch Hilfe bei …"></textarea></label>
      <details class="basis-hint">
        <summary>Selbstkontrolle und Hilfe</summary>
        <div class="detail-body">
          <!-- MD:START -->
**Zur Frage «Netz» oben:** Ein einzelnes Neuron hat nur eine gerade Grenze, die vier XOR-Fälle liegen aber diagonal. Die Zwischenschicht bildet zuerst OR und NAND, der Ausgang verbindet beide mit AND. Für (1,1): OR = 1, NAND = 0, AND(1, 0) = 0, also XOR = 0.

1. **Brücke:** Fest bleibt MobileNet, es liefert die 1280 Zahlen. Es lernt nur das kleine Netz dahinter: seine Gewichte und sein Bias. Eingaben und Ausgabeklassen ändern sich beim Lernen nicht. Die richtige Antwort steckt im Label: In Ihrem Projekt ist es die Klasse, die Sie jedem Foto geben (überwachtes Lernen, wie bei den XOR-Zielwerten).
2. **Vorschau:** Mögliche Antwort: Bilder für den unabhängigen Test müssen bis zum Schluss ungeöffnet bleiben, sonst sind sie keine neuen Daten mehr und der Test sagt nichts über neue Fotos aus. Das wird in DL 5 genau geklärt; hier darf man raten.

Wenn eine Antwort zu Netz oder Brücke unklar ist, wiederholt die entsprechende Aufgabe oder nutzt das Lernlabor vor dem selbstständigen Projekt.
<!-- MD:END -->
        </div>
      </details>
    </div>
  </div>
</details>