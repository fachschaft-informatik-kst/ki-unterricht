<details class="kapitel" id="perzeptron-4" data-kurz="Überwachtes Lernen: Gewichte und Bias werden nach Fehlern korrigiert." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was lernt ein Neuron genau?</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein Neuron lernt aus <strong>Trainingsdaten</strong> mit bekannter richtiger Antwort – dem <strong>Ziel</strong> oder <strong>Label</strong>. Das heisst <strong>überwachtes Lernen</strong>. Bei Fehlern werden <strong>Gewichte und Bias</strong> korrigiert; Eingaben und Rechenregel «Summe bilden, ab 0 Ja» bleiben unverändert. Das Gelernte steckt in den eingestellten Zahlen.</p>
    <figure class="concept-figure">
      <img alt="Schwimmbad-Neuron beim Lernen: Bei Sonne 1, Freund:innen 0 und Prüfung 0 sagt es zuerst fälschlich Nein. Sonnengewicht und Bias werden korrigiert, danach sagt es Ja. Die Eingaben bleiben gleich." loading="lazy" src="grafiken/schwimmbad_lernschritt.svg"/>
      <figcaption>Vorher und nachher: Dieselben drei Eingaben laufen durch dasselbe Neuron. Grün markiert die korrigierten Werte an Sonnenverbindung und Bias; die anderen Gewichte bleiben gleich.</figcaption>
    </figure>
    <p><strong>Warum ändert sich gerade die Sonnenverbindung?</strong> Sonne = 1, Freund:innen = 0, Prüfung = 0. Ziel <strong>Ja (1)</strong>, bisherige Ausgabe <strong>Nein (0)</strong>. Nur Sonne hat den Eingangswert 1. Deshalb steigen Sonnengewicht (0 → 1) und Bias (−1,5 → −0,5) bei Lernrate 1, die beiden übrigen Gewichte bleiben gleich. Mit denselben Eingaben antwortet das Neuron danach richtig.</p>
    <p class="small"><strong>Beachten Sie:</strong> Die Grafik zeigt einen beispielhaften Korrekturschritt nach derselben Lernregel wie im Notebook. Dort können andere Startgewichte und Trainingsaufgaben eingestellt werden.</p>
    <!-- MD:START -->
### So funktioniert die Lernregel

1. Das Neuron antwortet auf ein Beispiel und vergleicht die Ausgabe mit dem bekannten Ziel.
2. Bei einem Fehler werden die Gewichte der aktiven Eingaben und der Bias angepasst; bei einer richtigen Antwort geschieht nichts.
3. Das wird für die Trainingsbeispiele wiederholt, falls nötig über mehrere **Runden**.

<!-- MD:END -->
    <p class="process"><span>neues Gewicht</span><b>=</b><span>altes Gewicht</span><b>+</b><span>Lernrate × (Ziel − Ausgabe) × Eingang</span></p>
    <p>Für den Bias gilt Eingang 1. Die <strong>Lernrate</strong> legt die Grösse des Korrekturschritts fest. Das Neuron kennt keine fertige Wenn-dann-Regel und merkt sich die einzelnen Beispiele nicht als Regeln: Es findet Gewichte und Bias, die zu den Zielen passen.</p>
    <label class="field answer"><span>Aufgabe: Erklären Sie am Schwimmbad-Neuron den Lernschritt und die Rolle des bekannten Ziels (überwachtes Lernen). Welche Werte ändern sich, was bleibt gleich und wo steckt das Gelernte?</span><textarea data-answer="neuron_gelernt" maxlength="10000" placeholder="Lernart: … Verändert haben sich … Unverändert blieb … Das Gelernte steckt in …" rows="4"></textarea></label>
  </div>
</details>