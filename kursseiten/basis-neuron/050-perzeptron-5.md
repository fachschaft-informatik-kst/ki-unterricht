<details class="kapitel" id="basis-neuron-5" data-kurz="Drei interaktive Versuche zu Entscheidung, Gewichten und Lernen (ca. 30 Minuten)." open>
  <summary><span class="kapitel-nr">5</span>
    <h2 class="kapitel-titel">Im Notebook: entscheiden, einstellen, lernen lassen</h2>
  </summary>
  <div class="kapitel-body">
    <div class="lesson-steps">
      <article>
        <b>1 · Alltag: Schwimmen?</b>
        <!-- MD:START -->
Ändern Sie die Gewichte des Schwimmbad-Neurons. Vergleichen Sie in der **Live-Tabelle** die acht Eingaben mit den berechneten Ausgaben und Zielen. Erreichen Sie 8 von 8?
<!-- MD:END -->
      </article>
      <article>
        <b>2 · Logische Gatter einstellen</b>
        <!-- MD:START -->
Verändern Sie die Gewichte und den Bias für **AND**, anschliessend **OR** oder **NAND**. **Alle vier Eingabefälle** werden als einzelne Neuronen dargestellt; die darunterliegende Tabelle fasst die Ergebnisse zusammen.
<!-- MD:END -->
      </article>
      <article>
        <b>3 · Lernen beobachten</b>
        <!-- MD:START -->
Lassen Sie das Neuron einzelne Beispiele bearbeiten. Beobachten Sie **eine Korrektur** und vergleichen Sie die Parameter vor und nach diesem Schritt.
<!-- MD:END -->
      </article>
    </div>
    <div class="ki-notebook-block" data-notebook="content/basis_neuron.ipynb" data-title="Ein Neuron entscheidet">
  <h3>Jupyter-Notebook · Ein Neuron entscheidet</h3>
  <p>Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.</p>
  <a class="ki-notebook-launch" href="../lab/index.html?path=portal/basis_neuron.ipynb">Notebook hier öffnen</a>
</div>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll
<!-- MD:END -->
      <p class="small">Tragen Sie während der Notebookarbeit Ihre Einstellungen und Ergebnisse ein. Die Einträge werden im Browser gespeichert und im ZIP gesichert.</p>
      <h4>1 · Schwimmbad-Neuron</h4>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th></th>
              <th>Gewicht Sonne</th>
              <th>Gewicht Freund:innen</th>
              <th>Gewicht Prüfung</th>
              <th>Bias</th>
              <th>Treffer (von 8)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Meine Einstellung</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw_gs" aria-label="Gewicht Sonne" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw_gf" aria-label="Gewicht Freund:innen" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw_gp" aria-label="Gewicht Prüfung" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw_bias" aria-label="Bias" placeholder=""></td>
              <td><select data-basis-answer="basis-neuron-sw_treffer" aria-label="Treffer von 8"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></td>
            </tr>
            <tr>
              <th>Zweite Einstellung mit 8 von 8</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw2_gs" aria-label="Zweite Einstellung Gewicht Sonne" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw2_gf" aria-label="Zweite Einstellung Gewicht Freund:innen" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw2_gp" aria-label="Zweite Einstellung Gewicht Prüfung" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-sw2_bias" aria-label="Zweite Einstellung Bias" placeholder=""></td>
              <td><select data-basis-answer="basis-neuron-sw2_gefunden" aria-label="Zweite Einstellung gefunden?"><option value="">–</option><option value="ja">Ja, gefunden</option><option value="nein">Nein</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4>2 · Von Hand eingestellt</h4>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Aufgabe</th>
              <th>Gewicht 1</th>
              <th>Gewicht 2</th>
              <th>Bias</th>
              <th>Alle vier Zeilen ✓?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>AND</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_and_w1" aria-label="AND Gewicht 1" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_and_w2" aria-label="AND Gewicht 2" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_and_b" aria-label="AND Bias" placeholder=""></td>
              <td><select data-basis-answer="basis-neuron-hand_and_ok" aria-label="AND gelöst?"><option value="">–</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>
            </tr>
            <tr>
              <th>OR</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_or_w1" aria-label="OR Gewicht 1" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_or_w2" aria-label="OR Gewicht 2" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_or_b" aria-label="OR Bias" placeholder=""></td>
              <td><select data-basis-answer="basis-neuron-hand_or_ok" aria-label="OR gelöst?"><option value="">–</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>
            </tr>
            <tr>
              <th>NAND</th>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_nand_w1" aria-label="NAND Gewicht 1" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_nand_w2" aria-label="NAND Gewicht 2" placeholder=""></td>
              <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-hand_nand_b" aria-label="NAND Bias" placeholder=""></td>
              <td><select data-basis-answer="basis-neuron-hand_nand_ok" aria-label="NAND gelöst?"><option value="">–</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <details>
        <summary>Frühere Zusatzversuche – optional (gespeicherte Einträge bleiben erhalten)</summary>
        <div class="detail-body">
          <h4>3 · Lernrate ändern (AND)</h4>
          <div class="table-scroll">
            <table class="typen protokoll">
              <thead>
                <tr>
                  <th>Lernrate</th>
                  <th>Runden, bis alle vier Zeilen stimmen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>0.05</th>
                  <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-lr_005" aria-label="Runden bei Lernrate 0.05" placeholder=""></td>
                </tr>
                <tr>
                  <th>0.2</th>
                  <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-lr_02" aria-label="Runden bei Lernrate 0.2" placeholder=""></td>
                </tr>
                <tr>
                  <th>0.5</th>
                  <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-lr_05" aria-label="Runden bei Lernrate 0.5" placeholder=""></td>
                </tr>
                <tr>
                  <th>1.0</th>
                  <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-lr_10" aria-label="Runden bei Lernrate 1.0" placeholder=""></td>
                </tr>
              </tbody>
            </table>
          </div>
          <label class="field answer"><span>Was fällt auf, wenn die Lernrate kleiner oder grösser wird? Gibt es eine Lernrate, die schlecht ist?</span><textarea data-basis-answer="basis-neuron-lr_beob" maxlength="10000" placeholder="Bei kleiner Lernrate …" rows="3"></textarea></label>
          <h4>4 · Pflanzen bestimmen</h4>
          <div class="table-scroll">
            <table class="typen protokoll">
              <thead>
                <tr>
                  <th>Messung</th>
                  <th>Ihr Ergebnis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Neue Pflanzen richtig erkannt (von 30)</th>
                  <td><input type="text" inputmode="decimal" maxlength="40" data-basis-answer="basis-neuron-iris_richtig" aria-label="Neue Pflanzen richtig erkannt" placeholder=""></td>
                </tr>
                <tr>
                  <th>Welcher Eingang hat das grössere Gewicht?</th>
                  <td><select data-basis-answer="basis-neuron-iris_gewicht" aria-label="Grösseres Gewicht"><option value="">–</option><option value="laenge">Länge des Kronblatts</option><option value="breite">Breite des Kronblatts</option></select></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>
  </div>
</details>