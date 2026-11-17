<details class="kapitel" id="netze-2" data-kurz="Zwei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Die <strong>Zwischenschicht (Hidden Layer)</strong> berechnet aus S und F zuerst <strong>OR</strong> und <strong>NAND</strong>. Das Ausgabeneuron verknüpft beide bei <strong>P = 0 wie AND</strong> – zusammen ergibt das XOR. <strong>Prüfung (P)</strong> hemmt mit Gewicht <strong>−2</strong> den Ausgang: Bei P = 1 folgt immer Nein.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-net">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Netz: Sonne 1 und Freund:innen 0 speisen OR und NAND in der versteckten Schicht. Prüfung morgen = 1 führt mit Gewicht −2 direkt zum Ausgabeneuron und verhindert das Schwimmen. OR und NAND liefern bei Sonne 1 und Freund:innen 0 beide 1; wegen Prüfung 1 wird die Endsumme jedoch −1,5 und die Ausgabe Nein 0. Alle drei Bias-Werte und die Berechnungen sind eingezeichnet." loading="lazy" src="grafiken/schwimmbad_xor_netz.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Netzwerkansicht mit versteckter Schicht: Sonne und Freund:innen führen zu OR und NAND, deren Ergebnisse zum Ausgabeneuron führen. Prüfung wirkt dort mit Gewicht −2 und macht aus dem Ja ein Nein." loading="lazy" src="grafiken/schwimmbad_xor_netz_mobil.svg"/>
      <figcaption>Beispiel S = 1, F = 0, P = 1: OR = NAND = 1, doch die Prüfung führt zu Nein. Die Tabelle zeigt alle acht Fälle.</figcaption>
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
    <p><strong>Beispiel (S = 1, F = 0):</strong> OR = NAND = 1. Mit P = 1 ergibt <strong>1 + 1 − 2 − 1,5 = −1,5 → Nein</strong>; mit P = 0 <strong>1 + 1 − 0 − 1,5 = +0,5 → Ja</strong>. Im Notebook wird nur XOR bei P = 0 trainiert; das Prüfungsgewicht −2 ist für das Schwimmbad-Beispiel bewusst vorgegeben.</p>
    <label class="field answer"><span>Unser Verständnischeck: Was liefern OR und NAND für Sonne = 1, Freund:innen = 0? Vergleichen Sie Prüfung = 0 mit Prüfung = 1 und erklären Sie die Rolle der versteckten Schicht.</span><textarea data-answer="netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …; bei P = 0: …, bei P = 1: … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>