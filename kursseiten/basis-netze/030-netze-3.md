<details class="kapitel" id="basis-netze-3" data-kurz="XOR mit mehreren Neuronen berechnen und das Lernen des Netzes untersuchen." open>
  <summary><span class="kapitel-nr">3</span>
    <h2 class="kapitel-titel">Mit dem Netzwerk experimentieren</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
**Jetzt geht es vom Aufbau zum Experiment:** Öffnen Sie das Notebook «Neuronale Netze». Verfolgen Sie die XOR-Ausgaben im Netz aus OR, NAND und AND. Danach untersuchen Sie, wie ein Netz mit 1, 2 und 4 versteckten Neuronen lernt und ob es alle vier Fälle löst.

**Auftrag:** Beschreiben Sie für eine Eingabe den vollständigen Weg bis zur Ausgabe. Verändern Sie bei der Lernsimulation jeweils nur eine Einstellung und halten Sie Ihre Beobachtung im Protokoll fest.
<!-- MD:END -->
    <div class="ki-notebook-block" data-notebook="content/basis_netze.ipynb" data-title="Neuronale Netze">
  <h3>Jupyter-Notebook · Neuronale Netze</h3>
  <p>Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.</p>
  <a class="ki-notebook-launch" href="../lab/index.html?path=portal/basis_netze.ipynb">Notebook hier öffnen</a>
</div>
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
              <td><select data-basis-answer="basis-netze-xornetz_1" aria-label="1 verstecktes Neuron: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>2</th>
              <td><select data-basis-answer="basis-netze-xornetz_2" aria-label="2 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
            </tr>
            <tr>
              <th>4</th>
              <td><select data-basis-answer="basis-netze-xornetz_4" aria-label="4 versteckte Neuronen: Zeilen richtig"><option value="">–</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></td>
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
              <td><select data-basis-answer="basis-netze-xornetz_start" aria-label="Gelingt es bei jedem Startwert?"><option value="">–</option><option value="immer">Ja, immer</option><option value="manchmal">Nur bei manchen Startwerten</option><option value="nie">Nie</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
      <label class="field answer"><span>Wie viele versteckte Neuronen benötigt dieses Netzwerk mindestens, um XOR in Ihren Versuchen vollständig zu lösen? Was beobachten Sie bei verschiedenen Startwerten?</span><textarea data-basis-answer="basis-netze-xornetz_beob" maxlength="10000" placeholder="Mindestens … Der Startwert …" rows="3"></textarea></label>
    </div>
  </div>
</details>