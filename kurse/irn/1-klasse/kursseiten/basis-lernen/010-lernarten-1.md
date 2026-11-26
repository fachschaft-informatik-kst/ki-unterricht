<details class="kapitel" id="lernarten-1" data-kurz="EVA-Modell ohne und mit Erfahrungsschatz: feste Regeln oder gelerntes Wissen.">
  <summary><span class="kapitel-nr">1</span>
    <h2 class="kapitel-titel">EVA-Modell ohne und mit Erfahrungsschatz</h2>
  </summary>
  <div class="kapitel-body">
    <p>Jedes Programm arbeitet nach dem <strong>EVA-Prinzip</strong>: Es erhält eine <strong>E</strong>ingabe, <strong>V</strong>erarbeitet sie und liefert eine <strong>A</strong>usgabe. Im Kapitel <a href="#basis-ki">«Was ist KI?»</a> haben Sie zwei Wege kennengelernt, wie ein System zu seinen Regeln kommt: Menschen schreiben sie auf, oder das System lernt sie aus Daten. Diese beiden Wege lassen sich mit zwei Varianten des EVA-Modells darstellen: Ein <strong>wissensbasiertes System</strong> arbeitet nach dem EVA-Modell <em>ohne</em> Erfahrungsschatz, ein <strong>lernendes System</strong> nach dem EVA-Modell <em>mit</em> Erfahrungsschatz.</p>
    <div id="lernarten-intro" class="eva-compare">
      <figure class="concept-figure learning-system-figure">
        <p class="eva-label"><strong>Wissensbasiertes System</strong><span>EVA-Modell ohne Erfahrungsschatz</span></p>
        <img src="grafiken/eva_ohne_erfahrungsschatz.svg" alt="EVA-Modell ohne Erfahrungsschatz: Eine Eingabe wird verarbeitet und ergibt eine Ausgabe." loading="lazy"/>
        <figcaption>Die Verarbeitung folgt fest programmierten Regeln:<img class="eva-programmierung" src="grafiken/ki_programmierung_menschen.png" alt="Programmierung durch Menschen: Eine Eingabe wird mit definierten Regeln zu einer Ausgabe verarbeitet. Der Mensch definiert Regeln für das gewünschte Systemverhalten." loading="lazy"/></figcaption>
      </figure>
      <figure class="concept-figure learning-system-figure">
        <p class="eva-label"><strong>Lernendes System</strong><span>EVA-Modell mit Erfahrungsschatz</span></p>
        <img src="grafiken/eva_mit_erfahrungsschatz.svg" alt="EVA-Modell mit Erfahrungsschatz: Die Verarbeitung nutzt den Erfahrungsschatz und kann ihn verändern." loading="lazy"/>
        <figcaption>Die Verarbeitung nutzt gelerntes Wissen:<img class="eva-programmierung" src="grafiken/ki_programmierung_daten.png" alt="Datengetriebene Programmierung: Aus Daten erzeugt maschinelles Lernen Regeln. Der Mensch stellt Daten bereit, aus denen Regeln erzeugt werden." loading="lazy"/></figcaption>
      </figure>
    </div>
    <p><strong>Wissensbasiertes System · EVA-Modell ohne Erfahrungsschatz:</strong> Menschen haben vorher festgelegt, wie die Eingabe verarbeitet wird. Das Wissen des Systems besteht aus diesen Fakten und Regeln; deshalb heisst es <strong>wissensbasiert</strong>. Das Programm wendet diese Regeln immer gleich an: Dieselbe Eingabe führt immer zur selben Ausgabe. Das Programm verändert sich durch seinen Gebrauch nicht. So arbeiten ein Taschenrechner, ein Getränkeautomat oder ein Schachprogramm mit festen Bewertungsregeln.</p>
    <p><strong>Lernendes System · EVA-Modell mit Erfahrungsschatz:</strong> Hier kommt ein <strong>Erfahrungsschatz</strong> dazu, das gespeicherte Wissen des Systems. Er entsteht beim Lernen aus vielen Beispielen, zum Beispiel als Gewichte von künstlichen neuronalen Netzen. Weil das System seinen Erfahrungsschatz so selbst aufbaut, heisst es <strong>lernend</strong>. Die Verarbeitung greift darauf zurück, um zu entscheiden; die Ausgabe hängt also von der Eingabe <em>und</em> vom Erfahrungsschatz ab. Neue Erfahrungen können den Erfahrungsschatz verändern. Deshalb kann dieselbe Eingabe zu zwei verschiedenen Zeitpunkten zu zwei unterschiedlichen Ausgaben führen. Ein Beispiel ist ein Spamfilter, der aus markierten E-Mails gelernt hat, woran man Spam erkennt.</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Unterscheidung</th>
            <th>Wissensbasiertes System<br/><small>ohne Erfahrungsschatz</small></th>
            <th>Lernendes System<br/><small>mit Erfahrungsschatz</small></th>
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
    <p class="small muted">In der Praxis werden feste Regeln und Lernen aus Daten oft kombiniert. Die EVA-Grafiken sind eigene Nachzeichnungen nach der <a href="https://inf-schule.de/ki/menueansicht" target="_blank" rel="noopener noreferrer">KI-Landkarte von inf-schule.de</a> (CC BY-SA 4.0); «Programmierung durch Menschen» und «Datengetriebene Programmierung» sind Ausschnitte daraus.</p>
  </div>
</details>
