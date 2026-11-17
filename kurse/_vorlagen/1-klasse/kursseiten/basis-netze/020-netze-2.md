<details class="kapitel" id="basis-netze-2" data-kurz="Zwei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Die <strong>Zwischenschicht</strong> beantwortet drei Teilfragen: Aus <strong>Sonne (S)</strong> und <strong>Freund:innen (F)</strong> entstehen <strong>OR</strong> («mindestens eine») und <strong>NAND</strong> («nicht beide»). Aus <strong>Prüfung (P)</strong> wird <strong>«Keine Prüfung»</strong> (1 bei P = 0, sonst 0). Der Ausgang gibt nur dann <strong>Ja</strong> aus, wenn <strong>alle drei Zwischenwerte 1</strong> sind. So entsteht XOR mit Prüfungsregel – ohne Sonderverbindung zum Ausgang.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-net">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Netz: Sonne 1 und Freund:innen 0 gehen in OR und NAND; Prüfung morgen 1 geht in ein drittes Neuron Keine Prüfung. Die Zwischenwerte sind OR 1, NAND 1 und Keine Prüfung 0. Das Ausgabeneuron kombiniert alle drei mit Gewichten plus 1 und Bias minus 2,5. Das Ergebnis ist minus 0,5, also Nein. Alle Gewichte stehen direkt auf den Verbindungen, alle Bias-Werte mittig unter den Neuronen." loading="lazy" src="grafiken/schwimmbad_xor_netz.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Ansicht des Schwimmbad-Netzes: Sonne und Freund:innen werden zu OR und NAND, Prüfung zu Keine Prüfung. Alle drei Zwischenwerte gehen zum Ausgabeneuron. Bei Prüfung 1 lautet die Ausgabe Nein." loading="lazy" src="grafiken/schwimmbad_xor_netz_mobil.svg"/>
      <figcaption>Beispiel (S = 1, F = 0, P = 1): OR = 1, NAND = 1, «Keine Prüfung» = 0. Deshalb lautet die Ausgabe Nein. Die Tabelle zeigt alle acht Fälle.</figcaption>
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
    <p><strong>Rechenbeispiel (S = 1, F = 0):</strong> OR = 1 und NAND = 1. Bei <strong>P = 1</strong> ist «Keine Prüfung» = 0: <strong>1 + 1 + 0 − 2,5 = −0,5 → Nein</strong>. Bei <strong>P = 0</strong> ist der dritte Wert 1: <strong>1 + 1 + 1 − 2,5 = +0,5 → Ja</strong>. Das XOR-Notebook trainiert nur S und F bei P = 0; das zusätzliche Neuron für «Keine Prüfung» wird hier als feste Regel gezeigt.</p>
    <label class="field answer"><span>Verständnischeck: Welche Werte liefern OR, NAND und «Keine Prüfung» für S = 1, F = 0 bei P = 0 und P = 1? Berechnen Sie jeweils den Ausgang und erklären Sie die Zwischenschicht.</span><textarea data-basis-answer="basis-netze-netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …; bei P = 0: …, bei P = 1: … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>