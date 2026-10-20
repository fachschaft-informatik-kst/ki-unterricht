---
type: chapter
id: basis-sprache-wortlabor
nummer: 4
titel: Kurzexperiment mit Satzkontext
kurz: Wie der Zusammenhang die Fortsetzung beeinflusst
---

**Experiment:** Ein Sprachmodell verarbeitet Text in kleinen Bausteinen, sogenannten **Tokens**. Es berechnet, welche Fortsetzung zum bisherigen Text passt. Je nach Kontext sind andere Fortsetzungen wahrscheinlich.

**Wahlvertiefung:** Das kleine Wortlabor ist eine *vereinfachte Simulation*, kein trainiertes Sprachmodell. Die Prozentzahlen sind nur veranschaulichende Beispiele.

<div class="basis-language-lab" data-basis-language>
  <label for="basis-language-context">Satzanfang auswählen</label>
  <select id="basis-language-context" data-language-context>
    <option value="garten">Im Garten jagt der Hund den …</option>
    <option value="sport">Auf dem Fussballplatz jagt der Hund den …</option>
    <option value="maerchen">Im Märchen wohnt der König im …</option>
  </select>
  <p class="basis-language-prompt" data-language-prompt>Im Garten jagt der Hund den …</p>
  <div class="basis-language-options" data-language-options aria-live="polite"></div>
  <p class="basis-language-result" data-language-result>Wähle eine Fortsetzung und beobachte die Vorschläge.</p>
</div>

**Beobachtet:** Vergleicht die beiden Sätze mit dem Hund. Welches Wort wird am häufigsten vorgeschlagen? Warum verändert sich die Auswahl? Was bedeutet «wahrscheinlicher» – und was bedeutet es **nicht**?

<div class="basis-answer"><label for="basis-sprache-a">Unsere Beobachtung zum Kontext</label><textarea id="basis-sprache-a" data-basis-answer="basis-sprache-a" rows="3" placeholder="Wenn sich der Kontext ändert, …"></textarea></div>
