---
type: chapter
id: dl8-warum
nummer: "1"
titel: "Warum zwei Prüfungen?"
kurz: "Erst die Ergebnisse nachprüfen, dann Grenzen auf neuen Bildern erkennen."
open: true
---

**Leitfrage:** Wann darf man dem Ergebnis eines KI-Modells trauen?

Ein Modell kann auf den Bildern seines eigenen Projekts gut abschneiden – aber das beweist noch nicht, dass es allgemein zuverlässig ist. Deshalb prüfen Sie **zwei unterschiedliche Dinge**:

<div class="grid two">
  <article class="card">
    <h3>Prüfung 1 · Reproduzieren</h3>
    <p><strong>Gleiche Bilder + gleiche Einstellungen:</strong> Bekommen Sie dieselben Zahlen wie das andere Tandem?</p>
    <p><strong>Weshalb?</strong> Nur nachvollziehbare Ergebnisse lassen sich ernsthaft beurteilen.</p>
    <p><a href="#reproduktion">Zum Reproduktionsauftrag →</a></p>
  </article>
  <article class="card">
    <h3>Prüfung 2 · Fremdtest</h3>
    <p><strong>Gleiches Modell + Ihre Bilder:</strong> Was sagt es über Bildklassen, die es nie gelernt hat?</p>
    <p><strong>Weshalb?</strong> Eine überzeugende Vorhersage kann auch ausserhalb des Gelernten entstehen.</p>
    <p><a href="#fremdtest">Zum Fremdtest →</a></p>
  </article>
</div>

### Ein konkretes Beispiel

Das fremde Modell wurde für **Apfel oder Birne** trainiert. Sie zeigen ihm **Tassen oder Flaschen**. Es muss weiterhin «Apfel» oder «Birne» ausgeben – selbst wenn keine Antwort passt.

**Wichtig:** Wenn es Tassen und Flaschen gut *auseinanderhält*, ist das noch keine **Trefferquote** für diese neuen Klassen. Die <a href="#fremdtest">Trennschärfe im Fremdtest</a> misst lediglich, wie deutlich die beiden neuen Bildgruppen den ursprünglichen Ausgaben zugeordnet werden.

**Ihr Ziel:** Nicht die höchste Zahl erzielen, sondern zeigen, **was die Ergebnisse belegen und wo ihre Aussage endet**. Die <a href="#bewertung">Kriterien K11 und K12</a> bewerten genau das.
