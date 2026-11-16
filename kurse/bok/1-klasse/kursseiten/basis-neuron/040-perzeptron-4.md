<details class="kapitel" id="basis-neuron-4" data-kurz="Ein Fehler verändert Gewichte und Bias, nicht die Eingaben oder die Rechenregel." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was lernt ein Neuron genau?</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein Neuron kann seine Gewichte und den <strong>Bias</strong> aus Beispielen mit bekannter richtiger Antwort (<strong>Trainingsdaten</strong>) lernen. Die Eingaben und die Regel «Summe bilden, ab 0 Ja» bleiben unverändert. <strong>Das Gelernte steckt in den Gewichten und im Bias.</strong></p>
    <figure class="concept-figure">
      <img alt="Schwimmbad-Neuron beim Lernen: Bei Sonne 1, Freund:innen 0 und Prüfung 0 sagt es zuerst fälschlich Nein. Sonnengewicht und Bias werden korrigiert, danach sagt es Ja. Die Eingaben bleiben gleich." loading="lazy" src="grafiken/schwimmbad_lernschritt.svg"/>
      <figcaption>Vorher und nachher: Dieselben drei Eingaben laufen durch dasselbe Neuron. Grün markiert die korrigierten Werte an Sonnenverbindung und Bias; die anderen Gewichte bleiben gleich.</figcaption>
    </figure>
    <p><strong>Warum ändert sich gerade die Sonnenverbindung?</strong> Sonne = 1, Freund:innen = 0, Prüfung = 0. Die richtige Antwort ist <strong>Ja (1)</strong>, das Neuron sagt zuerst <strong>Nein (0)</strong>. Weil nur Sonne den Eingabewert 1 hat, steigt bei Lernrate 1 ihr Gewicht um 1; der Bias steigt ebenfalls um 1. Die anderen Gewichte bleiben wegen Eingang 0 gleich. Bei unveränderten Eingaben lautet die neue Ausgabe Ja.</p>
    <p class="small"><strong>Beachten Sie:</strong> Die Grafik zeigt einen beispielhaften Korrekturschritt nach derselben Lernregel wie im Notebook. Dort können andere Startgewichte und Trainingsaufgaben eingestellt werden.</p>
    <!-- MD:START -->
### So funktioniert die Lernregel

1. Ein Beispiel wird eingegeben; das Neuron gibt Ja oder Nein aus.
2. Das **Ziel** wird mit der Ausgabe verglichen. Bei einem Fehler werden die Gewichte aktiver Eingaben und der Bias korrigiert.
3. Das wiederholt sich für die Trainingsbeispiele, bei Bedarf über mehrere **Runden**.

<!-- MD:END -->
    <p class="process"><span>neues Gewicht</span><b>=</b><span>altes Gewicht</span><b>+</b><span>Lernrate × (Ziel − Ausgabe) × Eingang</span></p>
    <p>Für den Bias rechnet man mit Eingang 1. Eine kleinere <strong>Lernrate</strong> bewirkt kleinere Änderungen. Das Neuron speichert keine fertige Schwimmbadregel – es passt Zahlen an, bis die Antworten zu den Beispielen passen.</p>
    <label class="field answer"><span>Aufgabe: Was ändert sich beim Schwimmbad-Neuron zwischen Vorher und Nachher? Was bleibt gleich, und wo steckt das Gelernte?</span><textarea data-basis-answer="basis-neuron-neuron_gelernt" maxlength="10000" placeholder="Verändert haben sich … Unverändert blieb … Das Gelernte steckt in …" rows="4"></textarea></label>
  </div>
</details>