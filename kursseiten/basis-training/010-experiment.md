---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Zwei eigene Fotoklassen trainieren
kurz: MobileNet-Merkmale · eigenes Klassifikationsnetz
---

**Projektauftrag:** Trainiert einen Bildklassifikator für zwei eigene Gegenstandsklassen. Anders als beim Ziffernnetz verwenden wir jetzt **MobileNet V2**, das für echte Fotos geeignete Merkmale liefert. Das vortrainierte Bildnetz bleibt eingefroren; ihr trainiert nur das nachgeschaltete Netz.

[**Fotostudio öffnen ↗**](../projekt/studio/)

[**Notebook «Eigene Fotos» starten ↗**](../lab/index.html?path=portal/basis_fotoprojekt.ipynb)

1. Wählt zwei Gegenstandsklassen und erstellt im Fotostudio je Klasse **acht Fotos pro Gruppe** für T1, T2, V1, P1 und P2. Verwendet unterschiedliche Exemplare in unterschiedlichen Gruppen.
2. Exportiert die JSON-Datei und ladet sie im Notebook hoch. Prüft die Gruppen und Klassen.
3. Trainiert Modell A und B und vergleicht ihre Vorhersagen auf den Validierungsbildern **V1**.
4. Wählt **vor dem Abschlusstest** eine Variante mit schriftlicher Begründung auf Basis von V1.
5. Lasst eure Entscheidung kurz von der Lehrperson bestätigen. Erst jetzt setzt ihr im Notebook `TEST_FREIGEBEN = True` und prüft die gewählte Variante **einmal** auf P1/P2. Notiert das endgültige Testergebnis; optimiert danach nicht erneut auf diesen Daten.

<div class="basis-answer"><label for="basis-training-a">Unsere Fotoklassen und erste Ergebnisse</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="6" placeholder="Klasse 1 … / Klasse 2 … / Validierung A … / B … / Unsere Wahl …"></textarea></div>
