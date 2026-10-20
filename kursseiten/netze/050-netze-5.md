<details class="kapitel" id="netze-5" data-kurz="Ziffern erkennen: 64 Pixel, 16 versteckte Neuronen, 10 Ausgaben. Alle Gewichte lernt das Netz selbst." open>
  <summary><span class="kapitel-nr">5</span>
    <h2 class="kapitel-titel">Ein Netz erkennt Ziffern</h2>
  </summary>
  <div class="kapitel-body">
    <p><strong>Freiwilliger Transfer:</strong> Beim XOR-Beispiel gab es zwei Eingaben. Jetzt betrachten Sie ein grösseres Problem: Ein Netz soll <strong>handgeschriebene Ziffern</strong> lesen. Jedes Bild hat 8 × 8 Pixel, also <strong>64 Helligkeitswerte</strong>. Auch hier gibt es eine Eingabe-, eine versteckte und eine Ausgabeschicht:</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Schicht</th>
            <th>Anzahl Neuronen</th>
            <th>Aufgabe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Eingabe</th>
            <td>64</td>
            <td>Ein Eingang pro Pixel: Wie dunkel ist dieser Bildpunkt?</td>
          </tr>
          <tr>
            <th>Versteckte Schicht</th>
            <td>16</td>
            <td>Zwischenergebnisse: Jedes Neuron reagiert auf ein anderes Muster im Bild.</td>
          </tr>
          <tr>
            <th>Ausgabe</th>
            <td>10</td>
            <td>Ein Neuron pro Ziffer 0 bis 9. Der höchste Wert (Modellwert) ist die Antwort.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <figure class="concept-figure">
      <img alt="Ein Ziffernbild geht durch das Netz: links die 64 Pixelwerte der Ziffer 6, in der Mitte die Ausgaben der 16 versteckten Neuronen, rechts der Modellwert je Ziffer mit dem höchsten Wert bei 6." loading="lazy" src="grafiken/ziffern_netz.png"/>
      <figcaption>Ein Bild durch das Netz: 64 Pixelwerte → 16 versteckte Neuronen (manche bleiben still) → 10 Werte. Die Ziffer mit dem höchsten Wert gewinnt.</figcaption>
    </figure>
    <!-- MD:START -->
### Was wurde hier gelernt?
<!-- MD:END -->
    <p>Niemand hat die Gewichte vorgegeben. Das Netz sah <strong>1257 Trainingsbilder</strong> mit der richtigen Ziffer und hat daraus alle seine Gewichte gefunden, nach demselben Prinzip wie das einzelne Neuron in Doppellektion 3: vorhersagen, Fehler bewerten, Gewichte anpassen, wiederholen. Bei 16 versteckten Neuronen sind das 64·16 + 16 + 16·10 + 10 = <strong>1210 Zahlen</strong>. Geprüft wird es an <strong>540 weiteren Bildern</strong>, die es beim Training nie gesehen hat.</p>
    <!-- MD:START -->
### Wie viele versteckte Neuronen braucht es? Ihre Messung
<!-- MD:END -->
    <div class="table-scroll">
      <table class="typen protokoll">
        <thead>
          <tr>
            <th>Versteckte Neuronen</th>
            <th>Gewichte und Bias</th>
            <th>Richtig auf den 540 neuen Bildern (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>2</th>
            <td>160</td>
            <td><input type="text" inputmode="decimal" maxlength="40" data-answer="zif_2" aria-label="Trefferquote bei 2 versteckten Neuronen in Prozent" placeholder=""></td>
          </tr>
          <tr>
            <th>4</th>
            <td>310</td>
            <td><input type="text" inputmode="decimal" maxlength="40" data-answer="zif_4" aria-label="Trefferquote bei 4 versteckten Neuronen in Prozent" placeholder=""></td>
          </tr>
          <tr>
            <th>8</th>
            <td>610</td>
            <td><input type="text" inputmode="decimal" maxlength="40" data-answer="zif_8" aria-label="Trefferquote bei 8 versteckten Neuronen in Prozent" placeholder=""></td>
          </tr>
          <tr>
            <th>16</th>
            <td>1210</td>
            <td><input type="text" inputmode="decimal" maxlength="40" data-answer="zif_16" aria-label="Trefferquote bei 16 versteckten Neuronen in Prozent" placeholder=""></td>
          </tr>
          <tr>
            <th>32</th>
            <td>2410</td>
            <td><input type="text" inputmode="decimal" maxlength="40" data-answer="zif_32" aria-label="Trefferquote bei 32 versteckten Neuronen in Prozent" placeholder=""></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- MD:START -->
Das Notebook «Ziffernerkennung» ist eine **freiwillige Vertiefung**. Öffnen Sie es über die Schaltfläche unten, testen Sie verschiedene Zahlen versteckter Neuronen und tragen Sie die Trefferquoten oben ein. Falls keine Verwechslung vorkommt, wählen Sie «Keine Verwechslung beobachtet» und lassen das zweite Ziffernfeld leer.
<!-- MD:END -->
    <button class="btn primary" data-lab="ziffernerkennung.ipynb">Ziffernerkennung starten ▶</button>
    <div class="table-scroll">
      <table class="typen protokoll">
        <thead>
          <tr>
            <th>Frage</th>
            <th>Ihre Antwort</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Ab welcher getesteten Anzahl versteckter Neuronen erreicht das Netz erstmals mindestens 80&nbsp;% richtige Vorhersagen?</th>
            <td><select data-answer="zif_brauchbar" aria-label="Erstmals mindestens 80 Prozent richtige Vorhersagen"><option value="">–</option><option value="2">ab 2</option><option value="4">ab 4</option><option value="8">ab 8</option><option value="16">ab 16</option><option value="32">ab 32</option><option value="keine">Keine erreicht 80 %</option></select></td>
          </tr>
          <tr>
            <th>Welche Verwechslung beobachten Sie bei 16 versteckten Neuronen?</th>
            <td><select data-answer="zif_verw_a" aria-label="Tatsächliche Ziffer"><option value="">–</option><option value="keine">Keine Verwechslung beobachtet</option><option value="0">die Ziffer 0</option><option value="1">die Ziffer 1</option><option value="2">die Ziffer 2</option><option value="3">die Ziffer 3</option><option value="4">die Ziffer 4</option><option value="5">die Ziffer 5</option><option value="6">die Ziffer 6</option><option value="7">die Ziffer 7</option><option value="8">die Ziffer 8</option><option value="9">die Ziffer 9</option></select> <span class="select-connector">mit</span> <select data-answer="zif_verw_b" aria-label="Verwechselte Ziffer, vom Netz erkannt als"><option value="">–</option><option value="0">der Ziffer 0</option><option value="1">der Ziffer 1</option><option value="2">der Ziffer 2</option><option value="3">der Ziffer 3</option><option value="4">der Ziffer 4</option><option value="5">der Ziffer 5</option><option value="6">der Ziffer 6</option><option value="7">der Ziffer 7</option><option value="8">der Ziffer 8</option><option value="9">der Ziffer 9</option></select></td>
          </tr>
        </tbody>
      </table>
    </div>
    <label class="field answer"><span>Warum verbessert eine grössere Zahl versteckter Neuronen die Trefferquote nicht unbedingt? Falls Sie eine Verwechslung gefunden haben: Warum könnten diese beiden Ziffern ähnlich aussehen?</span><textarea data-answer="zif_beob" maxlength="10000" placeholder="Ab einer gewissen Zahl …" rows="3"></textarea></label>
    <p><strong>Brücke zum Bildprojekt:</strong> Ihr Projekt funktioniert genauso. Ein Foto wird von einem bereits trainierten Netz (MobileNet) in 1280 Zahlen beschrieben. Ein kleines Netz mit 16 versteckten Neuronen lernt daraus die Zuordnung zu Ihren zwei Klassen und wird an Fotos geprüft, die es nie gesehen hat. Der vorgeschaltete Bildmerkmalsextraktor bleibt unverändert.</p>
    <label class="field answer"><span>Aufgabe: Beschreiben Sie in drei Sätzen den Weg eines Ziffernbildes durch das Netz (64 → 16 → 10). Was wurde beim Training gelernt, und warum prüft man an Bildern, die das Netz nie gesehen hat?</span><textarea data-answer="netze_ziffern" maxlength="10000" placeholder="Das Bild geht … Gelernt wurden … Geprüft wird an neuen Bildern, weil …" rows="4"></textarea></label>
  </div>
</details>