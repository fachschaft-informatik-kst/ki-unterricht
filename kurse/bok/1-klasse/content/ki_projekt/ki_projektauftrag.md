# Geführtes KI-Bildprojekt · 1. Klasse

**DL 4–6 · Ein Projekt, zwei Bildklassen, ein A/B-Vergleich, fünf kurze Reflexionen, individuelles Fachgespräch.**

> Helfen vielfältigere Trainingsbilder einem Klassifikator, neue Beispiele richtig zu erkennen?

Der **wissenschaftliche Ablauf stammt aus dem Bildprojekt der 4. Klasse**. In der 1. Klasse sind Datenweg, Versuchsbedingungen, Arbeitsphasen und Reflexionsfragen stärker vorgegeben. Eigene Python-Programme oder ein langes Projektprotokoll sind nicht nötig.

## Zwei gleichwertige Datenwege

- **Ersatz `UEBUNG` (nach Absprache):** Mitgelieferte synthetische Kreis-/Dreieck-Bilder. Alle fünf Gruppen sind im Notebook vorbereitet; keine Fotos müssen zuhause gesammelt werden.
- **Angestrebter Projektweg `EIGENE_DATEN`:** Zwei personenfreie Gegenstandsklassen. Je Klasse fünf verschiedene Exemplare (T1, T2, V1, P1, P2), je acht Fotos; insgesamt 80. Fotostudio-JSON exportieren. Keine Exemplare gruppenübergreifend wiederverwenden.

Beide Wege werden gleich bewertet; die Datenquelle gibt keinen Bonus. Bei den synthetischen Daten kann man **nicht** behaupten, das Modell erkenne echte Alltagsfotos zuverlässig.

## Die fünf Datengruppen

| Gruppen | Rolle | Regel |
|---|---|---|
| T1 und T2 | **Training** | Der neue Klassifikationskopf lernt an beschrifteten Bildern. |
| V1 | **Validierung** | Auf denselben V1-Bildern A/B vergleichen und **vor** dem Test eine Variante auswählen. |
| P1 und P2 | **Unabhängiger Test** | Nur die gewählte Variante **einmal** prüfen. Danach nichts mehr optimieren. |

Das vortrainierte **MobileNet V2** bleibt unverändert und liefert feste Bildmerkmale. Nur das kleine Netz hinter den Merkmalen lernt mit den Klassenlabels. Es geht um den Vergleich der Trainingsdaten, nicht darum, MobileNet selbst zu programmieren.

## Fairer Versuch

| Variante A | Variante B | Gleich bleibt |
|---|---|---|
| Acht Trainingsbilder je Klasse aus T1 (ein Exemplar) | Je vier Trainingsbilder je Klasse aus T1 und T2 (zwei Exemplare) | Gesamtbildzahl, 16 Neuronen, 60 Epochen, Startwert 11, dieselben V1-Bilder |

**Vermutung:** Variante B profitiert möglicherweise von vielfältigeren Trainingsbeispielen. Ein anderes Ergebnis ist kein Fehler. Vergleicht nach Anleitung auch die drei Startwerte 11, 22 und 33, ausschliesslich **vor** der Testeinsicht.

## Drei Doppellektionen

- **DL 4 · Projektvorbereitung:** Ziffern-/Buchstabentest als kurzer Einstieg (ohne weiteres Buchstaben-Fine-Tuning); Lernpfad Datenaufteilung, Datenleck, Themenwahl, Gruppenplan, Abnahme und Reflexionen 1–2. Bis DL 5 eigene Fotos aufnehmen und JSON exportieren; P2 vor anderem Hintergrund.
- **DL 5 · Geführte Untersuchung:** Gruppen prüfen, A/B trainieren und auf V1 vergleichen, Modellwahl begründen, P1/P2 freigeben und einmal testen, Reflexionen 3–5, ZIP einreichen.
- **DL 6 · Prüfen und erklären:** Einzelgespräche; parallel unbenoteter Fremdcheck eines anderen Projekts: Daten und Originalwerte prüfen, ursprüngliche Variante wiederherstellen und eigene andere Klassen ohne weiteres Training ausprobieren. Bei technischen Problemen Referenzpaket verwenden. Andere Klassen im fremden Modell sind keine gültige Trefferquote für die eigenen Klassen.

## Fünf kurze Reflexionen im Kursjournal

1. **Frage und Vermutung:** Datenweg, zwei Klassen, erwarteter Vorteil vielfältigerer Beispiele.
2. **Daten:** T1/T2, V1, P1/P2 und mögliche Datenlecks.
3. **Vergleich:** V1-Werte von A/B, eine konkrete Vorhersage und **schriftlich begründete Wahl vor dem Test**.
4. **Abschlusstest:** P1/P2-Wert, drei konkrete Vorhersagen und nachvollziehbare Grenzen.
5. **Fazit:** Was können wir behaupten, was nicht? Nächster fairer Versuch und kurze Zusammenarbeit.

**Abgabe vor DL 6:** Kurs-ZIP mit Journal, bearbeitetem Notebook samt Ausgaben, Datenquelle und gegebenenfalls Fotostudio-JSON. ZIP herunterladen **und** über den vereinbarten Abgabekanal einreichen. Kein zusätzlicher Bericht und keine Präsentation.

## Bewertung

**Maximal 30 Punkte:** 12 gemeinsame Punkte für den dokumentierten Versuch, 18 persönliche Punkte im Fachgespräch. Der Fremdcheck in DL 6 ist unbenotet. Das Raster steht unter `kursseiten/basis-abschluss/bewertungsraster.md` bzw. `worksheets/md/KI_Bewertungsraster.md`. Bewertet werden faire Daten, Nachvollziehbarkeit und kritische Erklärungen – **nicht** die höchste Trefferquote.

**KI als Hilfe:** Sprach- und Begriffshilfe ist möglich; Zahlen, Ergebnisse, Belege und Deutungen müssen aus dem eigenen Versuch stammen. Verwendete Hilfen nennen. Daten und Fotos nur mit Einverständnis teilen; Personenfotos sind in der 1. Klasse nicht vorgesehen.
