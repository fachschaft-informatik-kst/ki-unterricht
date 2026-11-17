<details class="kapitel" id="perzeptron-4" data-kurz="Überwachtes Lernen: Gewichte und Bias werden nach Fehlern korrigiert." open>
  <summary><span class="kapitel-nr">4</span>
    <h2 class="kapitel-titel">Was lernt ein Neuron genau?</h2>
  </summary>
  <div class="kapitel-body">
    <p>Beim <strong>überwachten Lernen</strong> kennt das Neuron für jedes Trainingsbeispiel das richtige <strong>Ziel (Label)</strong>. Bei Fehlern korrigiert es <strong>Gewichte und Bias</strong>, nicht die Eingaben oder die Regel (Summe ≥ 0 → Ja).</p>
    <figure class="concept-figure neuron-detail-figure neuron-detail-learning">
      <img class="neuron-graphic-desktop" alt="Schwimmbad-Neuron beim Lernen: Bei Sonne 1, Freund:innen 0 und Prüfung 0 sagt es zuerst fälschlich Nein. Sonnengewicht und Bias werden korrigiert, danach sagt es Ja. Die Eingaben bleiben gleich." loading="lazy" src="grafiken/schwimmbad_lernschritt.svg"/>
      <img class="neuron-graphic-mobile" alt="Mobile Netzwerkansicht mit Sonne, Freund:innen und Prüfung: zuerst falsche Ausgabe, danach dieselbe Eingabe mit korrigiertem Sonnengewicht und Bias." loading="lazy" src="grafiken/schwimmbad_lernschritt_mobil.svg"/>
      <figcaption>Gleiche Eingaben, neue Ausgabe: Nur Sonnengewicht und Bias ändern sich.</figcaption>
    </figure>
    <p><strong>Lernschritt:</strong> S = 1, F = 0, P = 0; Ziel Ja (1), Ausgabe zuerst Nein (0). Bei Lernrate 1 steigen Sonnengewicht (0 → 1) und Bias (−1,5 → −0,5). Andere Gewichte bleiben gleich, da ihre Eingaben 0 sind. Danach stimmt die Ausgabe.</p>
    <p class="small"><strong>Hinweis:</strong> Das Notebook erlaubt andere Startwerte und Aufgaben; die Lernregel ist dieselbe.</p>
    <!-- MD:START -->
### So funktioniert die Lernregel

1. Das Neuron vergleicht seine Ausgabe mit dem bekannten Ziel.
2. Bei Fehlern korrigiert es Gewichte aktiver Eingaben und Bias; sonst bleibt alles gleich.
3. Es wiederholt dies für die Trainingsbeispiele über mehrere **Runden**.

<!-- MD:END -->
    <p class="process"><span>neues Gewicht</span><b>=</b><span>altes Gewicht</span><b>+</b><span>Lernrate × (Ziel − Ausgabe) × Eingang</span></p>
    <p>Für den Bias gilt Eingang 1. Die <strong>Lernrate</strong> bestimmt die Schrittgrösse. Gelernt werden passende Gewichte und Bias, keine fertigen Wenn-dann-Regeln.</p>
    <label class="field answer"><span>Aufgabe: Erklären Sie am Schwimmbad-Neuron den Lernschritt und die Rolle des bekannten Ziels (überwachtes Lernen). Welche Werte ändern sich, was bleibt gleich und wo steckt das Gelernte?</span><textarea data-answer="neuron_gelernt" maxlength="10000" placeholder="Lernart: … Verändert haben sich … Unverändert blieb … Das Gelernte steckt in …" rows="4"></textarea></label>
  </div>
</details>