<details class="kapitel" id="netze-4" data-kurz="Die Rolle der Zwischenschicht im neuronalen Netz mit eigenen Worten sichern." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was wir über neuronale Netze gelernt haben</h2>
  </summary>
  <div class="kapitel-body">
    <label class="field answer"><span>Warum kann ein einzelnes Neuron XOR nicht lösen und wie hilft die Zwischenschicht?</span><textarea data-answer="netze" maxlength="10000" placeholder="Ihre Beobachtung …" rows="3"></textarea></label>
    <!-- MD:START -->
**Sicherung (einzeln):** Erklären Sie die Ausgaben der beiden Zwischenneuronen OR und NAND und des Ausgangsneurons AND für die Eingabe `(1,1)`. Prüfen Sie Ihre Rechnung an der Netzgrafik. Die Planung und Datenaufteilung folgen selbstständig in Doppellektion 5.
<!-- MD:END -->
    <div class="callout" id="netze-bruecke">
      <!-- MD:START -->
**Ausblick auf das Bildprojekt:** Dort arbeitet ein Netz wie dieses, aber mit 1280 statt 2 Eingaben. Die Zahlen liefert MobileNet, ein fertiges Netz, das unverändert bleibt. Nur das kleine Netz dahinter lernt Ihre zwei Klassen, nach denselben Schritten wie hier: vorhersagen, Fehler bewerten, Gewichte anpassen. [Wer weiss was? →](#projekt-wer-weiss-was)
<!-- MD:END -->
    </div>
    <div class="callout" id="projekt-bereit-check" data-p1-diagnostic>
      <!-- MD:START -->
### Unbenoteter Lernstandscheck vor DL 5 (2 Minuten)
<!-- MD:END -->
      <ol>
        <li><strong>Neuron:</strong> Was ändert sich beim Lernen: die Eingaben, die Gewichte oder die Ausgabeklassen?</li>
        <li><strong>Netz:</strong> Warum kann eine Zwischenschicht XOR lösen?</li>
        <li><strong>Daten:</strong> Welche Bilder dürfen erst ganz am Schluss für eine unabhängige Prüfung geöffnet werden?</li>
      </ol>
      <label class="field answer"><span>Meine Kurzantwort und eine offene Frage (nicht benotet)</span><textarea data-answer="projekt_bereit_check" maxlength="2000" rows="3" placeholder="1 … / 2 … / 3 … / Ich brauche noch Hilfe bei …"></textarea></label>
      <details class="basis-hint">
        <summary>Selbstkontrolle und Hilfe</summary>
        <div class="detail-body">
          <!-- MD:START -->
1. **Neuron:** Die Gewichte und der Bias werden angepasst.
2. **Netz:** Mehrere Neuronen verbinden OR, NAND und AND zu XOR.
3. **Daten:** Unabhängige Testbilder bleiben zurückgehalten; Training, Validierung und Test werden im Lernpfad von DL 5 vertieft.

Wenn eine Antwort unklar ist, wiederholt die entsprechende Aufgabe oder nutzt das Lernlabor vor dem selbstständigen Projekt.
<!-- MD:END -->
        </div>
      </details>
    </div>
  </div>
</details>