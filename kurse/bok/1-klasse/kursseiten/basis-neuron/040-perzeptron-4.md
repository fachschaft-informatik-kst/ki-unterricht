<details class="kapitel" id="basis-neuron-4" data-kurz="Ein Fehler verändert Gewichte und Bias, nicht die Eingaben oder die Rechenregel." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was lernt ein Neuron genau?</h2>
  </summary>
  <div class="kapitel-body">
    <p>Ein Neuron lernt aus <strong>Trainingsbeispielen mit bekanntem Ziel</strong>: Bei Fehlern korrigiert es <strong>Gewichte und Bias</strong>. Eingaben und Entscheidungsregel (Summe ≥ 0 → Ja) bleiben gleich.</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-learning">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Neuron beim Lernen: Bei Sonne 1, Freund:innen 0 und Prüfung 0 sagt es zuerst fälschlich Nein. Sonnengewicht und Bias werden korrigiert, danach sagt es Ja. Die Eingaben bleiben gleich." loading="lazy" src="grafiken/schwimmbad_lernschritt.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Netzwerkansicht mit Sonne, Freund:innen und Prüfung: zuerst falsche Ausgabe, danach dieselbe Eingabe mit korrigiertem Sonnengewicht und Bias." loading="lazy" src="grafiken/schwimmbad_lernschritt_mobil.svg"/>
      <figcaption>Gleiche Eingaben, neue Ausgabe: Nur Sonnengewicht und Bias ändern sich.</figcaption>
    </figure>
    <p><strong>Lernschritt:</strong> Bei S = 1, F = 0, P = 0 lautet das Ziel Ja (1), die Ausgabe zunächst Nein (0). Mit Lernrate 1 steigen Sonnengewicht und Bias um 1; die Gewichte der Eingaben mit Wert 0 bleiben gleich. Danach antwortet das Neuron Ja.</p>
    <p class="small"><strong>Hinweis:</strong> Das Notebook erlaubt andere Startwerte und Trainingsaufgaben; die Lernregel bleibt gleich.</p>
    <!-- MD:START -->
### So funktioniert die Lernregel

1. Das Neuron gibt für ein Trainingsbeispiel Ja oder Nein aus.
2. Es vergleicht Ausgabe und **Ziel** und korrigiert bei Fehlern Gewichte aktiver Eingaben und Bias.
3. Es wiederholt dies für die Trainingsbeispiele über mehrere **Runden**.

<!-- MD:END -->
    <p class="process"><span>neues Gewicht</span><b>=</b><span>altes Gewicht</span><b>+</b><span>Lernrate × (Ziel − Ausgabe) × Eingang</span></p>
    <p>Beim Bias ist der Eingang immer 1. Eine kleinere <strong>Lernrate</strong> führt zu kleineren Korrekturen. Gelernt werden Zahlen, keine fertigen Regeln.</p>
    <label class="field answer"><span>Aufgabe: Was ändert sich beim Schwimmbad-Neuron zwischen Vorher und Nachher? Was bleibt gleich, und wo steckt das Gelernte?</span><textarea data-basis-answer="basis-neuron-neuron_gelernt" maxlength="10000" placeholder="Verändert haben sich … Unverändert blieb … Das Gelernte steckt in …" rows="4"></textarea></label>
  </div>
</details>