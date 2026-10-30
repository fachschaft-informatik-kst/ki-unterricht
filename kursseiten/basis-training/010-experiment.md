---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Zwei eigene Fotoklassen trainieren
kurz: MobileNet-Merkmale · eigenes Klassifikationsnetz
---

**Projektauftrag (zwei gleichwertige Wege):** Trainiert einen Bildklassifikator – entweder mit **bereitgestellten synthetischen Übungsdaten (Standard)** oder mit **freiwillig vorbereiteten eigenen Gegenstandsfotos**. Beide Wege erfüllen den Pflichtkern und werden gleich bewertet. Anders als beim Ziffernnetz verwenden wir jetzt **MobileNet V2**, das für echte Fotos geeignete Merkmale liefert. Das vortrainierte Bildnetz bleibt eingefroren; ihr trainiert nur das nachgeschaltete Netz.

[**Fotostudio öffnen ↗**](../projekt/studio/)

[**Notebook «Eigene Fotos» starten ↗**](../lab/index.html?path=portal/basis_fotoprojekt.ipynb)

1. **Wählt euren Datenweg:** Standard = im Notebook die mitgelieferten Übungsdaten «Kreis/Dreieck» verwenden; freiwillig = im Fotostudio zwei Gegenstandsklassen mit je acht Fotos pro Gruppe T1/T2/V1/P1/P2 vorbereiten (unterschiedliche Exemplare pro Gruppe, keine Personen).
2. Nur bei eigenen Fotos: Exportiert die JSON-Datei und ladet sie im Notebook hoch. Prüft bei **beiden Wegen** Gruppen und Klassen. Die Übungsdaten sind synthetisch und keine realistische Genauigkeitsmessung für neue Fotos.
3. Trainiert Modell A und B und vergleicht ihre Vorhersagen auf den Validierungsbildern **V1**.
4. Wählt **vor dem Abschlusstest** eine Variante mit schriftlicher Begründung auf Basis von V1.
5. Lasst eure Entscheidung kurz von der Lehrperson bestätigen. Erst jetzt setzt ihr im Notebook `TEST_FREIGEBEN = True` und prüft die gewählte Variante **einmal** auf P1/P2. Notiert das endgültige Testergebnis; optimiert danach nicht erneut auf diesen Daten.

<div class="basis-answer"><label for="basis-training-a">Unsere Fotoklassen und erste Ergebnisse</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="6" placeholder="Klasse 1 … / Klasse 2 … / Validierung A … / B … / Unsere Wahl …"></textarea></div>
