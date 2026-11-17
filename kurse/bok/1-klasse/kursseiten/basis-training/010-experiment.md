---
type: chapter
id: basis-training-experiment
nummer: 1
titel: Ein fairer A/B-Versuch
kurz: Daten prüfen · Modellvarianten vergleichen · Test erst zum Schluss
---

**Unsere Untersuchung entspricht dem Kernprojekt der 4. Klasse:** MobileNet V2 liefert aus jedem Bild feste Merkmale. Ein kleiner nachgeschalteter Klassifikationskopf lernt überwacht anhand der beiden Klassenlabels. **A und B erhalten gleich viele Bilder und dieselben Netzparameter**; nur die Vielfalt der Trainingsbeispiele unterscheidet sich.

**Datenweg wählen:** `UEBUNG` mit vorbereiteten synthetischen Kreis-/Dreieck-Bildern ist der Standard, ohne Foto-Hausaufgabe. Wer bereits eine eigene Fotostudio-JSON mit zwei personenfreien Klassen und getrennten T1/T2/V1/P1/P2-Gruppen hat, kann `EIGENE_DATEN` nutzen. Beide Wege werden gleich bewertet. Für synthetische Daten gibt es **keinen Nachweis der Erkennung neuer Alltagsfotos**.

<div class="ki-notebook-block" data-notebook="content/basis_fotoprojekt.ipynb" data-title="Bildprojekt · Geführter A/B-Vergleich">
  <h3>Jupyter-Notebook · Bildprojekt</h3>
  <p>Datenweg laden, zwei Varianten trainieren, auf V1 vergleichen, eine Variante begründet wählen und erst danach P1/P2 testen.</p>
  <button type="button" class="ki-notebook-launch" data-lab="basis_fotoprojekt.ipynb">Notebook hier öffnen</button>
</div>

### Eure verbindlichen Etappen

1. **Daten prüfen:** Stimmen Klassenlabels und Gruppen T1/T2/V1/P1/P2? P1/P2 bleibt bis zum Schluss ungeöffnet.
2. **A/B trainieren:** A nutzt acht Bilder aus T1 je Klasse; B je vier aus T1 und T2. Bildzahl, Netz, Epochen und Startwert sind identisch.
3. **Validieren:** A und B auf denselben V1-Bildern vergleichen; eine konkrete Vorhersage ansehen. Notiert auch eine mögliche andere Erklärung für einen Unterschied.
4. **Vor dem Test entscheiden:** Modellwahl und V1-Beleg auf der Kursseite aufschreiben, von der Lehrperson bestätigen lassen.
5. **Einmalig testen:** Nur die gewählte Variante auf P1/P2 prüfen, danach **nichts mehr optimieren**.
6. **Sichern:** Die fünf kurzen Reflexionen abschliessen, Notebook mit Ausgaben und Kursantworten als ZIP sichern und einreichen.

<div class="basis-answer"><label for="basis-training-a">Etappe 1–2 · Welche Daten und Modelle verwenden wir?</label><textarea id="basis-training-a" data-basis-answer="basis-training-a" rows="4" placeholder="Datenweg und Klassen … / A nutzt … / B nutzt … / Gleich bleibt …"></textarea></div>

<details><summary>Hilfe: Warum sind A und B fair vergleichbar?</summary><div class="detail-body"><p>Beide erhalten gleich viele Trainingsbilder. Lediglich die Zahl der unterschiedlichen Exemplare unterscheidet sich. Auf V1 werden die Vorhersagen mit denselben unbekannten Beispielen geprüft. Auch ein schlechteres Ergebnis ist eine wertvolle Beobachtung.</p></div></details>
