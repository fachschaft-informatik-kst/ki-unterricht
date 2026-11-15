<details class="kapitel" id="netze-2" data-kurz="Zwei Zwischenentscheidungen lösen die neue Schwimmbadregel." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Warum mehrere Neuronen helfen</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein einzelnes Neuron kann die XOR-Schwimmbadfälle nicht trennen. Zwei <strong>Zwischenneuronen</strong> berechnen deshalb <strong>OR</strong> («mindestens eine Bedingung») und <strong>NAND</strong> («nicht beide»). Ein drittes Neuron verbindet beide Ergebnisse mit <strong>AND</strong>. So lässt sich die neue Regel darstellen.</p>
    <div class="process">
      <span>Sonne und Freund:innen</span><b>→</b><span>OR und NAND<br/><strong>Zwischenschicht</strong></span><b>→</b><span>AND<br/><strong>Schwimmen?</strong></span>
    </div>
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
    <p><strong>Prüfen Sie Sonne = 1, Freund:innen = 0:</strong> OR gibt 1 und NAND gibt 1. Das letzte Neuron verbindet beides mit AND und antwortet Ja (1). Für (1, 1) gibt NAND dagegen 0 – das Netz antwortet Nein. Im Notebook verfolgen Sie den Signalweg selbst.</p>
    <label class="field answer"><span>Unser Verständnischeck: Was liefern OR und NAND für Sonne = 1, Freund:innen = 0, und was macht das Ausgabeneuron daraus und welche Aufgabe hat die versteckte Schicht?</span><textarea data-answer="netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …, AND = … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>