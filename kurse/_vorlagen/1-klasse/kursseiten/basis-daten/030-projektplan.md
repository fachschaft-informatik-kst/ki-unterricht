---
type: chapter
id: basis-daten-projektplan
nummer: 3
titel: Unsere Untersuchung vorbereiten
kurz: Gleicher Versuchsplan wie in der 4. Klasse · stärker geführt
---

### Etappe 1 · Thema wählen und Vermutung formulieren

**Forschungsfrage:** Helfen vielfältigere Trainingsbilder, unbekannte Beispiele besser zu erkennen?

Wählt im Tandem zwei Gegenstandsklassen, für die ihr je fünf verschiedene Exemplare findet.

| Thema | Zwei mögliche Klassen |
|---|---|
| Recycling | PET-Flaschen / Dosen |
| Schreibmaterial | Kugelschreiber / Bleistifte |
| Besteck | Löffel / Gabeln |
| Früchte | Äpfel / Birnen |
| Kleidung | Handschuhe / Socken |
| Geometrische Körper | Würfel / Kugeln |
| Gezeichnete Symbole | Sterne / Herzen |
| Arbeitsplatz | Hefte / Bücher |

Keine Personenfotos. Besprecht mit der Lehrperson, ob ihr genügend unterschiedliche Gegenstände beschaffen könnt. Falls eigene Fotos nicht rechtzeitig möglich sind, verwendet ihr nach Absprache die vorbereiteten synthetischen Daten `UEBUNG` (Kreis/Dreieck). Beide Datenwege werden gleich bewertet.

<div class="basis-answer"><label for="basis-projekt-frage">Reflexion 1 · Thema, Klassen und Vermutung</label><textarea id="basis-projekt-frage" data-basis-answer="basis-projekt-frage" rows="4" placeholder="Thema … / Klassen … / Datenweg … / Wir vermuten, dass …, weil …"></textarea></div>

### Etappe 2 · Fünf Gruppen, 80 Fotos

Pro Gruppe benötigt ihr **ein anderes Exemplar jeder Klasse**, davon je acht Aufnahmen. Acht Fotos eines Apfels zählen nicht als acht verschiedene Äpfel.

| Gruppe | Klasse 1 (Apfel) | Klasse 2 (Birne) | Rolle |
|---|---|---|---|
| T1 | Apfel 1 | Birne 1 | Training |
| T2 | Apfel 2 | Birne 2 | Training |
| V1 | Apfel 3 | Birne 3 | Validierung |
| P1 | Apfel 4 | Birne 4 | Abschlusstest |
| P2 | Apfel 5 | Birne 5 | Abschlusstest, anderer Hintergrund |

2 Klassen × 5 Gruppen × 8 Fotos = **80 Bilder** (32 im Trainingspool, 16 zur Validierung, 32 zum Abschlusstest). Im A/B-Versuch werden daraus je 16 Trainingsbilder verwendet. Fotografiert P2 für beide Klassen an einem anderen Ort oder vor einem anderen Hintergrund. So prüft ihr, ob das Netz auch bei veränderten Bedingungen funktioniert.

<div class="basis-answer"><label for="basis-projekt-datenplan">Reflexion 2 · Euer Gruppenplan, Quellen und Aufnahmebedingungen</label><textarea id="basis-projekt-datenplan" data-basis-answer="basis-projekt-datenplan" rows="8" placeholder="Klasse 1 / Klasse 2&#10;T1: … / …&#10;T2: … / …&#10;V1: … / …&#10;P1: … / …&#10;P2: … / …&#10;Hintergrund P2, Quellen und mögliche Datenfalle: …"></textarea></div>

**Kontrollpunkt vor dem Fotografieren:** Zeigt der Lehrperson den Plan. Prüft, dass kein Gegenstand in mehreren Gruppen vorkommt, beide Klassen gleich häufig vertreten sind und P1/P2 nicht zur Modellwahl dienen.

### Fotos aufnehmen und im Fotostudio vorbereiten

- Variiert Abstand, Perspektive und Licht; vermeidet nahezu identische Serien. Haltet die Aufnahmebedingungen für beide Klassen vergleichbar.
- Testet die Übertragung vom Handy zum Laptop mit einem Foto. Verwendet JPG oder PNG (HEIC vorher umwandeln).
- Öffnet das [Fotostudio](studio/), benennt die Klassen exakt, ordnet jedes Bild seiner Gruppe und Quelle zu und prüft die Vorschau.
- Das Studio bringt Bilder proportional auf 224 × 224 Pixel mit drei Farbkanälen. MobileNet berechnet daraus 1280 Merkmale; die kleinen Vorschauen dienen nur der Anzeige.
- Exportiert die Sammlung als JSON. Sichert die Originalfotos separat und bringt beides zur nächsten Doppellektion mit.

**Meilenstein bis DL 5:** Reflexionen 1 und 2, abgenommener Gruppenplan und Fotostudio-JSON liegen vor. Nutzt bei fehlenden Bildern den vereinbarten Ersatzdatensatz.

<a class="btn primary" href="#basis-training">Weiter: DL 5 · Modelle vergleichen →</a>
