<details class="kapitel" id="lernarten-1" data-kurz="EVA-Modell ohne und mit Erfahrungsschatz: feste Regeln oder gelerntes Wissen." open>
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">EVA-Modell ohne und mit Erfahrungsschatz</h2>
  </summary>
  <div class="kapitel-body">
    <p>Jedes Programm arbeitet nach dem <strong>EVA-Prinzip</strong>: Es erhält eine <strong>E</strong>ingabe, <strong>V</strong>erarbeitet sie und liefert eine <strong>A</strong>usgabe. Im Kapitel <a href="#einstieg">«Was ist KI?»</a> haben Sie zwei Wege kennengelernt, wie ein System zu seinen Regeln kommt: Menschen schreiben sie auf, oder das System lernt sie aus Daten. Diese beiden Wege lassen sich mit zwei Varianten des EVA-Modells darstellen.</p>
    <div id="lernarten-intro" class="eva-compare">
      <figure class="concept-figure learning-system-figure">
        <img src="grafiken/eva_ohne_erfahrungsschatz.svg" alt="EVA-Modell ohne Erfahrungsschatz: Eine Eingabe wird verarbeitet und ergibt eine Ausgabe." loading="lazy"/>
        <figcaption><strong>Ohne Erfahrungsschatz:</strong> Die Verarbeitung folgt fest programmierten Regeln.</figcaption>
      </figure>
      <figure class="concept-figure learning-system-figure">
        <img src="grafiken/eva_mit_erfahrungsschatz.svg" alt="EVA-Modell mit Erfahrungsschatz: Die Verarbeitung nutzt den Erfahrungsschatz und kann ihn verändern." loading="lazy"/>
        <figcaption><strong>Mit Erfahrungsschatz:</strong> Die Verarbeitung nutzt gespeichertes, gelerntes Wissen.</figcaption>
      </figure>
    </div>
    <p><strong>EVA-Modell ohne Erfahrungsschatz:</strong> Menschen haben vorher festgelegt, wie die Eingabe verarbeitet wird. Das Programm wendet diese Regeln immer gleich an: Dieselbe Eingabe führt immer zur selben Ausgabe. Das Programm verändert sich durch seinen Gebrauch nicht. So arbeiten ein Taschenrechner, ein Getränkeautomat oder ein Schachprogramm mit festen Bewertungsregeln.</p>
    <p><strong>EVA-Modell mit Erfahrungsschatz:</strong> Hier kommt ein <strong>Erfahrungsschatz</strong> dazu, das gespeicherte Wissen des Systems. Er entsteht beim Lernen aus vielen Beispielen, zum Beispiel als Gewichte von künstlichen neuronalen Netzen. Die Verarbeitung greift darauf zurück, um zu entscheiden; die Ausgabe hängt also von der Eingabe <em>und</em> vom Erfahrungsschatz ab. Neue Erfahrungen können den Erfahrungsschatz verändern. Deshalb kann dieselbe Eingabe zu zwei verschiedenen Zeitpunkten zu zwei unterschiedlichen Ausgaben führen. Ein Beispiel ist ein Spamfilter, der aus markierten E-Mails gelernt hat, woran man Spam erkennt.</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Unterscheidung</th>
            <th>Ohne Erfahrungsschatz</th>
            <th>Mit Erfahrungsschatz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Woher kommen die Regeln?</th>
            <td>Von Menschen programmiert.</td>
            <td>Aus Beispielen gelernt und im Erfahrungsschatz gespeichert.</td>
          </tr>
          <tr>
            <th>Verändert sich das System?</th>
            <td>Nein, gleiche Eingabe ergibt immer gleiche Ausgabe.</td>
            <td>Ja, neue Erfahrungen können den Erfahrungsschatz verändern.</td>
          </tr>
          <tr>
            <th>Beispiele</th>
            <td>Taschenrechner, Getränkeautomat, Schachprogramm mit festen Regeln.</td>
            <td>Spamfilter, Gesichtserkennung, Übersetzungsapp.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="small muted">In der Praxis werden feste Regeln und Lernen aus Daten oft kombiniert. Die Grafiken sind eigene Nachzeichnungen nach der <a href="https://inf-schule.de/ki/menueansicht" target="_blank" rel="noopener noreferrer">KI-Landkarte von inf-schule.de</a> (CC BY-SA 4.0).</p>
  </div>
</details>
