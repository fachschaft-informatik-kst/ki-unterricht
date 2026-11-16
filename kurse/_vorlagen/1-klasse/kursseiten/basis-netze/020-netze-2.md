<details class="kapitel" id="basis-netze-2" data-kurz="Zwei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Die versteckte Schicht (Hidden Layer) unterscheidet mit <strong>OR</strong> («mindestens eine Bedingung») und <strong>NAND</strong> («nicht beide»), ob genau eine der Eingaben Sonne und Freund:innen zutrifft. Das Ausgabeneuron erhält <strong>drei Zahlen</strong>: die beiden Zwischenresultate und <strong>Prüfung morgen (P)</strong>. Die Prüfung hat dort ein <strong>hemmendes Gewicht von −2</strong> – sie ist nicht mehr bloss ausgeblendet.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-net">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Netz: Sonne 1 und Freund:innen 0 speisen OR und NAND in der versteckten Schicht. Prüfung morgen = 1 führt mit Gewicht −2 direkt zum Ausgabeneuron und verhindert das Schwimmen. OR und NAND liefern bei Sonne 1 und Freund:innen 0 beide 1; wegen Prüfung 1 wird die Endsumme jedoch −1,5 und die Ausgabe Nein 0. Alle drei Bias-Werte und die Berechnungen sind eingezeichnet." loading="lazy" src="grafiken/schwimmbad_xor_netz.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Netzwerkansicht mit versteckter Schicht: Sonne und Freund:innen führen zu OR und NAND, deren Ergebnisse zum AND-Neuron und zur Schwimmbad-Ausgabe. Prüfung wirkt mit Gewicht −2 am Ausgang." loading="lazy" src="grafiken/schwimmbad_xor_netz_mobil.svg"/>
      <figcaption>Das erweiterte Schwimmbad-Netz mit Hidden Layer: <strong>Sonne und Freund:innen → OR und NAND → Ausgang</strong>; die Prüfung führt ebenfalls zum Ausgang. Das Bild zeigt (S = 1, F = 0, P = 1): Trotz OR = NAND = 1 lautet die Ausgabe Nein. Die Tabelle darunter zeigt alle acht Schwimmbadfälle.</figcaption>
    </figure>
    <div class="table-scroll">
      <table class="typen">
        <thead><tr><th>Sonne S</th><th>Freund:innen F</th><th>Prüfung P</th><th>OR</th><th>NAND</th><th>Schwimmen?</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
          <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
          <tr><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
        </tbody>
      </table>
    </div>
    <p><strong>Rechenweg im Bild (S = 1, F = 0, P = 1):</strong> OR = 1, NAND = 1. Das Ausgabeneuron berechnet <strong>1·1 + 1·1 − 2·1 − 1,5 = −1,5 → Nein (0)</strong>. Ohne Prüfung wäre es <strong>1·1 + 1·1 − 2·0 − 1,5 = +0,5 → Ja (1)</strong>. Die zwei Zwischenneuronen lösen weiterhin XOR, und die Prüfung kann am Ausgang die Entscheidung verhindern. Das Notebook untersucht zuerst die vier XOR-Fälle mit P = 0.</p>
    <label class="field answer"><span>Unser Verständnischeck: Was liefern OR und NAND für Sonne = 1, Freund:innen = 0? Vergleichen Sie die Ausgabe bei Prüfung = 0 und Prüfung = 1 und erklären Sie die Rolle der versteckten Schicht.</span><textarea data-basis-answer="basis-netze-netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …; bei P = 0: …, bei P = 1: … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>