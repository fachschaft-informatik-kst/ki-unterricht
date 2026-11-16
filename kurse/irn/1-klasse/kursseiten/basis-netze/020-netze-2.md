<details class="kapitel" id="basis-netze-2" data-kurz="Zwei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein einzelnes Neuron kann die vier XOR-Schwimmbadfälle nicht trennen. Zwei <strong>Zwischenneuronen</strong> berechnen deshalb unterschiedliche Antworten: <strong>OR</strong> («mindestens eine Bedingung») und <strong>NAND</strong> («nicht beide»). Ein drittes Neuron verbindet sie mit <strong>AND</strong>. Das Bild zeigt nun dieselben Eingaben als Netz mit <strong>Hidden Layer</strong> – auch <em>versteckte Schicht</em> genannt. So wird die neue Schwimmbadregel möglich.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-net">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-XOR-Netz: Sonne 1 und Freund:innen 0 speisen zwei Neuronen der versteckten Schicht. Prüfung morgen ist auf 0 gesetzt und deshalb hier nicht verbunden. OR liefert 1, NAND liefert 1. Beide führen mit Gewichten +1 zum Ausgabeneuron AND, das Ja 1 ausgibt. Alle drei Bias-Werte und die Berechnungen sind eingezeichnet." loading="lazy" src="grafiken/schwimmbad_xor_netz.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Netzwerkansicht mit versteckter Schicht: Sonne und Freund:innen führen zu OR und NAND, deren Ergebnisse zum AND-Neuron und zur Schwimmbad-Ausgabe. Prüfung bleibt 0." loading="lazy" src="grafiken/schwimmbad_xor_netz_mobil.svg"/>
      <figcaption>Das erweiterte Schwimmbad-Netz mit Hidden Layer: <strong>Sonne und Freund:innen → OR und NAND → AND → Schwimmen?</strong> Prüfung morgen bleibt 0; die Zahlen zeigen den Fall (1, 0), die Tabelle darunter alle vier Fälle.</figcaption>
    </figure>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Eingabe</th>
            <th>OR</th>
            <th>NAND</th>
            <th>AND von beiden = XOR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>(0, 0)</th>
            <td>0</td>
            <td>1</td>
            <td>0</td>
          </tr>
          <tr>
            <th>(0, 1)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 0)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 1)</th>
            <td>1</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p><strong>Prüfen Sie (S = 1, F = 0):</strong> OR gibt 1, NAND gibt 1 und das Ausgabeneuron AND gibt 1. Für (1, 1) gibt NAND dagegen 0 – das Netz antwortet Nein. Die Tabelle zeigt alle vier Fälle; das Notebook macht den Signalweg sichtbar.</p>
    <label class="field answer"><span>Unser Verständnischeck: Was liefern OR und NAND bei Sonne = 1, Freund:innen = 0; was macht das Ausgabeneuron daraus und welche Aufgabe hat die versteckte Schicht?</span><textarea data-basis-answer="basis-netze-netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …, AND = … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>