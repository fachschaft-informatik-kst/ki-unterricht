<details class="kapitel" id="netze-5" data-kurz="Kurze Brücke: Vom Schwimmbadnetz zum Bildnetz.">
  <summary><span class="kapitel-nr">5</span><h2 class="kapitel-titel">Vom Schwimmbad zum Bildnetz</h2></summary>
  <div class="kapitel-body">
    <p>Ein einfaches Ziffernnetz erhält <strong>64 Pixelwerte</strong> aus einem 8×8-Bild, verarbeitet sie über eine Zwischenschicht und liefert Werte für <strong>zehn Ziffernklassen (0–9)</strong>. Im Projekt verwenden wir dieselbe Grundidee, aber andere Bilder, feste Merkmale aus MobileNet und nur zwei Ausgabeklassen.</p>
    <figure class="concept-figure"><img src="grafiken/ziffern_netz.png" loading="lazy" alt="Ziffernnetz: 64 Pixelwerte, 16 versteckte Neuronen und zehn mögliche Ziffernausgaben."/><figcaption>64 Eingaben → Zwischenschicht → zehn Ziffernausgaben.</figcaption></figure>
    <p><strong>Merksatz:</strong> Die Ausgabeklassen sind nicht beliebig. In DL 4 testet ihr das Ziffernnetz kurz mit Buchstaben und lernt danach, wie man Daten für ein eigenes Bildprojekt fair aufteilt. Der zusätzliche Versuch mit unterschiedlich vielen Ziffernneuronen entfällt.</p>
    <a class="btn primary" href="#basis-daten">Weiter: DL 4 · Bildprojekt starten →</a>
  </div>
</details>
