<details class="kapitel" id="basis-netze-2" data-kurz="Drei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Die <strong>Zwischenschicht</strong> beantwortet drei Teilfragen: Aus <strong>Sonne (S)</strong> und <strong>Freund:innen (F)</strong> entstehen <strong>OR</strong> («mindestens eine») und <strong>NAND</strong> («nicht beide»). Aus <strong>Prüfung (P)</strong> wird <strong>«Keine Prüfung»</strong> (1 bei P = 0, sonst 0). Der Ausgang gibt nur dann <strong>Ja</strong> aus, wenn <strong>alle drei Zwischenwerte 1</strong> sind. So entsteht XOR mit Prüfungsregel – ohne Sonderverbindung zum Ausgang.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-net">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Netz: Sonne 1, Freund:innen 0 und Prüfung 0 ergeben in der Zwischenschicht OR 1, NAND 1 und Keine Prüfung 1. Das AND-Ausgabeneuron verknüpft die drei Zwischenwerte und liefert mit Bias minus 2,5 die Summe plus 0,5: Ja. Die Zahlen auf den Pfeilen sind Gewichte, die Bias-Werte stehen unter den Neuronen." loading="lazy" src="grafiken/schwimmbad_xor_netz.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Schwimmbad-Netzgrafik: Sonne 1, Freund:innen 0, Prüfung 0. OR, NAND und Keine Prüfung liefern je 1. Das AND-Ausgabeneuron ergibt Ja; bei Prüfung 1 wäre es Nein." loading="lazy" src="grafiken/schwimmbad_xor_netz_mobil.svg"/>
      <figcaption>Beispiel S = 1, F = 0, P = 0: OR = 1, NAND = 1 und «Keine Prüfung» = 1 → Ja. Bei P = 1 ergibt sich Nein. Die Tabelle zeigt alle acht Fälle.</figcaption>
    </figure>
    <div class="table-scroll">
      <table class="typen">
        <thead><tr><th>Sonne S</th><th>Freund:innen F</th><th>Prüfung P</th><th>OR</th><th>NAND</th><th>Keine Prüfung</th><th>Schwimmen?</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
          <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td><strong>1</strong></td></tr>
          <tr><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
          <tr><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
          <tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td><strong>0</strong></td></tr>
          <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td><strong>0</strong></td></tr>
        </tbody>
      </table>
    </div>
    <p><strong>Rechenbeispiel (S = 1, F = 0):</strong> OR = 1 und NAND = 1. Ohne Prüfung (<strong>P = 0</strong>) ist «Keine Prüfung» = 1: <strong>1 + 1 + 1 − 2,5 = +0,5 → Ja</strong>. Mit Prüfung (<strong>P = 1</strong>) wird dieser Zwischenwert 0: <strong>1 + 1 + 0 − 2,5 = −0,5 → Nein</strong>. <strong>Unterschied zum Notebook:</strong> Die Grafik zeigt fest vorgegebene Gewichte und Bias-Werte. Im Notebook trainieren Sie ein XOR-Netz mit Sonne und Freund:innen bei P = 0.</p>
    <label class="field answer"><span>Verständnischeck: Welche Werte liefern OR, NAND und «Keine Prüfung» für S = 1, F = 0 bei P = 0 und P = 1? Berechnen Sie jeweils den Ausgang und erklären Sie die Zwischenschicht.</span><textarea data-basis-answer="basis-netze-netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …; bei P = 0: …, bei P = 1: … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>