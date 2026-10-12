# KI-Block 2026/27 · Hinweise für Lehrpersonen

90 Minuten je Doppellektion. Kein Regressionsteil im Pflichtweg.

| Datum | Schwerpunkt | Material und Ziel |
|---|---|---|
| 03.11. | Begriffe und Alltag | Gruppenarbeit, gemeinsame Begriffskarte; Geschichte/Turing nur kurz, Asimov optional |
| 10.11. | Lernarten | Memory für überwacht/unüberwacht; NIM für verstärkend; kein zusätzlicher Bandit |
| 24.11. | Perzeptron | Gekürztes Blatt + Notebook: eine Rechnung, ein Update, XOR-Grenze |
| 08.12. | Mehrschichtige Netze | XOR mit Zwischenschicht, Training qualitativ; Datenheft; 20 Minuten Projektvorschau |
| 15.12. | Projektstart | 15 Minuten Auftrag, 15 Minuten Lernlabor, 50 Minuten Daten/Versuch, 10 Minuten Sicherung |
| 05.01. | Vergleich | 10 Minuten Einstieg, 65 Minuten Versuch/Auswertung, 15 Minuten Rückmeldung |
| 12.01. | Abschluss | Auswahl, Test, Journal und Gesprächsvorbereitung |
| 19.01. | Abgabe und Tandemgespräche | Abgabe vor Unterrichtsbeginn; restliche Klasse bearbeitet KI-Fallcheck |
| 26.01. | Sprachmodelle | Papierexperiment, ausgewählte Papagei-Stationen, Soekia als Teil der Lernstrecke |
| 02.02. | Gesellschaft | Cathy O’Neil, Fallanalyse, Abschlussfilm mit Reflexion |

17.11. Konvent, 01.12. Blockwoche, 22./29.12. Ferien.

## Didaktische Reduktion

- Ein klarer Pflichtweg. Ziffern und Regression als Zusatz, keine versteckte Voraussetzung.
- Pro Experiment erst Vermutung, dann Beobachtung, dann Erklärung. Keine vollständigen Codeimplementierungen verlangen.
- `unterricht_tools.py` kapselt Darstellung und Spielmechanik; Code bleibt für Interessierte lesbar.
- Perzeptron: Bias ist ein additiver Wert, nicht ohne Vorzeichenwechsel der Schwellenwert. Keine pauschale Behauptung zur Richtung der Linienverschiebung.
- Das konstruierte XOR-Netz mit Step-Aktivierung zeigt Darstellbarkeit. Es wird nicht mit Backpropagation trainiert. ReLU/Optimierung nur qualitativ erklären.
- Das Bildprojekt trainiert einen eigenen MLP auf eingefrorenen MobileNet-Merkmalen. Diese Trennung ausdrücklich zeigen.
- Das Pflichtprojekt nutzt fünf Gruppen und 80 Fotos. A und B haben beide acht Trainingsbilder pro Klasse. Ein Startwert, eine Validierungsgruppe und zwei Testgruppen begrenzen die Aussage stark. Nicht als belastbare allgemeine ML-Studie darstellen.
- Andere Bilder bedeuten mögliche Störeinflüsse durch Hintergrund, Licht und Exemplarbesonderheiten. Ein unerwartetes oder schlechtes Ergebnis ist didaktisch wertvoll.
- Keine künstliche Mindestzahl von Fehlern verlangen: drei Beispiele analysieren, bei fehlerfreier Stichprobe Grenzen benennen.

## Vorbereitung

Am 08.12. Thema und Datenplan freigeben. Fotos als kurze vorbereitende Sammlung bis 15.12. Bei Gesten fünf Personen organisieren; Gegenstände sind meist leichter. Ersatzdaten sind möglich, aber Herkunft und stark begrenzte Aussage müssen sichtbar bleiben. Den Datenteil dann anhand der vereinbarten Aufgabe bewerten.

`UEBUNG` kann komplett von oben nach unten laufen; der Abschlusstest bleibt absichtlich gesperrt. Eigene Daten benötigen eine Pause nach dem Upload. Nach Testfreigabe nicht erneut Varianten optimieren. Ein Kernel-Neustart kann die Arbeitsregel technisch umgehen; die Sperre ist kein Prüfungsmechanismus.

## NIM

10 Hölzer; abwechselnd 1–3 nehmen; wer das letzte nimmt, verliert. Die Tabelle bevorzugt Züge aus gewonnenen Partien und schwächt Züge aus verlorenen Partien ab (mindestens Gewicht 1). Kein Q-Learning und kein neuronales Netz. Der Trainingsgegner handelt zufällig. Der Vergleich prüft auf 400 separaten Partien mit abwechselndem Startrecht, ohne weitere Updates. Ein fester Seed macht den Vergleich wiederholbar, nicht allgemeingültig. Die menschliche Partie dient dem Erkunden, ihre Ergebnisse verändern die Tabelle nicht.

## Fachgespräch und paralleler Auftrag

Beide kommen gemeinsam, beide erklären das gesamte Projekt. 10 Tandems × (8 Minuten Gespräch + 2 Minuten Notizen/Wechsel) = 100 Minuten. Bei entsprechender Klassengrösse Gespräche auf weitere Termine verteilen; für alle gleiche Abgabe vor dem ersten Gespräch.

Parallel: unbenoteter KI-Fallcheck als eine Folie, jederzeit unterbrechbar. Fall aus Bewerbungsfilter, Gesichtserkennung oder Schulaufsatzbewertung wählen. Vier Fragen: Was wird entschieden? Welche Daten/Labels braucht es? Wem schaden Fehler? Welche Massnahme hilft und welche Grenze bleibt? Kurze vorbereitete Falltexte statt betreuungsintensiver freier Recherche.

## Quellen

- https://inf-schule.de/ki/menueansicht/ki_erkunden/nim-spiel/lernstrecke
- https://inf-schule.de/ki/menueansicht/ki_erkunden/papagei/lernstrecke

Das NIM-Modell im Notebook ist eine eigene einfache Umsetzung mit denselben Spielregeln, keine Übernahme des inf-schule-Programmcodes.
