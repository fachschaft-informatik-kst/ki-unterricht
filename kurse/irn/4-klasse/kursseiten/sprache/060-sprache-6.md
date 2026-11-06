<details class="kapitel" id="sprache-6" data-kurz="Vom Zählen zum Rechnen: Warum ein neuronales Netz mehr ist als eine Häufigkeitstabelle." open>
  <summary><span class="kapitel-nr">6</span>
    <h2 class="kapitel-titel">Vom Papagei zum neuronalen Netz</h2>
  </summary>
  <div class="kapitel-body">
    <p>Das Papagei-Modell zählt Wortfolgen. Heutige Sprachmodelle wie ChatGPT sagen ebenfalls das nächste Wort voraus, aber sie zählen nicht nur: Dahinter steckt ein <strong>neuronales Netz</strong>. Es nutzt dieselben Grundideen, die Sie schon kennen (Gewichte, Summen, Schichten), ist aber viel grösser, anders aufgebaut (Transformer-Architektur) und hat Milliarden von Gewichten.</p>
    <div class="callout">
      <strong>Vier Sätze zum Mitnehmen</strong>
      <ol>
        <li>Wie im Bildprojekt gibt es zwei Phasen: ein grosses Vortraining und danach eine Feinabstimmung für eine Aufgabe (Transfer Learning). Das Vortraining besteht darin, das nächste <a href="#glossar-token">Token</a> vorherzusagen.</li>
        <li>Wörter werden in Zahlen umgewandelt, ähnlich wie MobileNet Bilder in 1280 Merkmale umwandelt; ähnliche Wörter erhalten ähnliche Zahlen.</li>
        <li>Der Text liefert seine «Labels» selbst: Das tatsächlich folgende Wort ist die richtige Antwort. Darum braucht das Vortraining keine von Hand beschrifteten Daten.</li>
        <li>Ein Prozentwert beim nächsten Wort sagt, wie gut es nach dem Training in diesen Kontext passt, nicht, ob die Aussage wahr ist.</li>
      </ol>
    </div>
    <figure class="concept-figure">
      <img alt="Vergleich: Das Papagei-Modell schlägt in einer Häufigkeitstabelle nach und kennt «Das Kätzchen verfolgt die» nicht. Das neuronale Sprachmodell wandelt Wörter in Zahlen um, rechnet in Schichten aus Neuronen und gibt Wahrscheinlichkeiten für das nächste Wort aus." loading="lazy" src="grafiken/papagei_vs_netz.svg"/>
      <figcaption>Gleiches Ziel, anderes Verfahren: Die Tabelle merkt sich Gesehenes, das Netz lernt, was ähnlich ist.</figcaption>
    </figure>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th></th>
            <th>Papagei-Modell</th>
            <th>Neuronales Sprachmodell</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Wissen steckt in</th>
            <td>einer Tabelle mit Häufigkeiten</td>
            <td>Gewichten in vielen Schichten, durch Training angepasst wie beim Neuron in Doppellektion 3</td>
          </tr>
          <tr>
            <th>Unbekannte Wortfolge</th>
            <td>keine Vorhersage, nur Raten</td>
            <td>ähnliche Wörter haben ähnliche Zahlen, deshalb passt die Vorhersage oft trotzdem</td>
          </tr>
          <tr>
            <th>Kontext</th>
            <td>die letzten zwei bis vier Wörter</td>
            <td>ganze Seiten; das Netz gewichtet, welche Wörter gerade wichtig sind</td>
          </tr>
          <tr>
            <th>Was bleibt gleich</th>
            <td colspan="2">Das Vortraining zielt weiterhin darauf, das nächste Token vorherzusagen (Chat-Produkte werden danach zusätzlich feinabgestimmt). Das Modell prüft nicht, ob eine Aussage wahr ist.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="small">Um das nächste Wort gut vorherzusagen, muss das Netz Grammatik, Zusammenhänge und Muster in seinen Gewichten speichern. Das ist mehr als Zählen. Ob man das «Verstehen» nennen soll, ist unter Fachleuten umstritten.</p>
    <p class="task"><b>Aufgabe (Tandem, 2 Min.):</b> Die Tabelle des Papagei-Modells kennt nur «Die Katze jagt die Maus». Was sagt sie zu «Das Kätzchen verfolgt die …»? Was kann ein neuronales Netz tun, in dem «Katze» und «Kätzchen» ähnliche Zahlen haben? Begründen Sie, warum ein neuronales Sprachmodell mehr ist als eine Häufigkeitstabelle, und nennen Sie eine Grenze, die bleibt.</p>
    <div class="protokoll-block">
      <!-- MD:START -->
### Mein Protokoll: Papagei und Netz
<!-- MD:END -->
      <div class="table-scroll">
        <table class="typen protokoll">
          <thead>
            <tr>
              <th>Frage</th>
              <th>Antwort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Kennt die Papagei-Tabelle den Satz «Das Kätzchen verfolgt die …»?</th>
              <td><select data-answer="netz_kennt" aria-label="Kennt die Tabelle den Satz?"><option value="">–</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>
            </tr>
            <tr>
              <th>Warum kann ein neuronales Netz trotzdem eine Vorhersage machen?</th>
              <td><select data-answer="netz_warum" aria-label="Warum kann das Netz vorhersagen?"><option value="">–</option><option value="aehnlich">Ähnliche Wörter haben ähnliche Zahlen</option><option value="auswendig">Es hat genau diesen Satz auswendig gelernt</option><option value="tabelle">Es schlägt in einer Häufigkeitstabelle nach</option><option value="internet">Es sucht die Antwort im Internet</option></select></td>
            </tr>
            <tr>
              <th>Prüft das Modell, ob die Vorhersage wahr ist?</th>
              <td><select data-answer="netz_wahr" aria-label="Prüft das Modell die Wahrheit?"><option value="">–</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <label class="field answer"><span>Warum ist ein neuronales Sprachmodell mehr als reine Statistik? Welche Grenze bleibt?</span><textarea data-answer="sprache_netz" maxlength="10000" placeholder="Unsere Begründung …" rows="4"></textarea></label>
  </div>
</details>