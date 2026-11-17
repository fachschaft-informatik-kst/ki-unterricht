<details class="kapitel" id="netze-3" data-kurz="XOR mit mehreren Neuronen berechnen und das Lernen des Netzes untersuchen." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Mit dem Netzwerk experimentieren</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
**Experiment 1 · Schwimmbadnetz:** Wählen Sie nacheinander die vier S/F-Fälle. Schalten Sie P zwischen 0 und 1 um und verfolgen Sie **OR, NAND, «Keine Prüfung» und AND** in derselben Netzgrafik wie in Kapitel 2. Die Tabelle und die farbigen Entscheidungsgebiete ändern sich direkt.

**Experiment 2 · Gewichte verstehen:** Wählen Sie OR oder NAND und verändern Sie **nur ein Gewicht oder den Bias**. Beobachten Sie: Welche Grenze dreht oder verschiebt sich, und welche Fälle werden falsch? Stellen Sie danach die Startgewichte wieder her.

**Experiment 3 · Lernen:** Vergleichen Sie das **trainierte XOR-Netz** bei P = 0 mit 1, 2 und 4 versteckten Neuronen und mehreren Startwerten. Tragen Sie unten Ihre Resultate ein.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/mehrschichtige_netze.ipynb" data-title="Neuronale Netze">
      <!-- MD:START -->
### Jupyter-Notebook · Neuronale Netze
<!-- MD:END -->
      <!-- MD:START -->
Öffnen Sie das Notebook und führen Sie Zellen mit Shift + Enter aus.
<!-- MD:END -->
      <button type="button" class="ki-notebook-launch" data-lab="mehrschichtige_netze.ipynb">Notebook hier öffnen</button>
    </div>
    <label class="field answer"><span>Versuch: Was ändert sich an der Entscheidungsgrenze und den vier Ergebnissen, wenn Sie bei OR oder NAND ein Gewicht bzw. den Bias verändern? Wie wirkt P = 1?</span><textarea data-answer="netz_schwimmbad_grenzen" maxlength="4000" placeholder="Bei einer Gewichtsänderung … / Beim Bias … / Bei P = 1 …" rows="3"></textarea></label>
    <p><strong>Danach:</strong> Im zweiten Notebook-Experiment lernt ein kleines Netz XOR aus Beispielen; die Gewichte sind dort nicht vorgegeben. Halten Sie die Trefferzahlen und Startwerte im folgenden Protokoll fest.</p>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll: Lernen mit mehreren Neuronen
<!-- MD:END -->
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Versteckte Neuronen (Startwert 1)</th>
              <th>Zeilen richtig (von 4)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td><select data-answer="xornetz_1" aria-label="1 verstecktes Neuron: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>2</th>
              <td><select data-answer="xornetz_2" aria-label="2 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>4</th>
              <td><select data-answer="xornetz_4" aria-label="4 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Bei 2 versteckten Neuronen: Startwerte 0 bis 5</th>
              <th>Ihre Beobachtung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Gelingt es immer?</th>
              <td><select data-answer="xornetz_start" aria-label="Gelingt es bei jedem Startwert?"><option value="">–</option><option value="immer">Ja, immer</option><option value="manchmal">Nur bei manchen Startwerten</option><option value="nie">Nie</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <label class="field answer"><span>Wie viele versteckte Neuronen benötigt dieses Netzwerk mindestens, um XOR in Ihren Versuchen vollständig zu lösen? Was beobachten Sie bei verschiedenen Startwerten?</span><textarea data-answer="xornetz_beob" maxlength="10000" placeholder="Mindestens … Der Startwert …" rows="3"></textarea></label>
    </div>
  </div>
</details>