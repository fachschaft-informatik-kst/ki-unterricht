## Doppellektion 04

**Bereitlegen:** Papier oder [XOR-Gitter](materialien/downloads/koordinatengitter_xor_einfach.svg); Beamer für das XOR-Rätsel; die Lernenden arbeiten im Notebook [Neuronale Netze](materialien/downloads/mehrschichtige_netze.ipynb), das [XOR: Ein Neuron](materialien/downloads/xor_einzelne_neuronen.ipynb) zeigt die Lehrperson am Beamer.

### Ankommen · 5 Min. · Genau eine Taste

**Tandem · 5 Min.**

Das Signal geht an, wenn **genau eine** von zwei Tasten aktiv ist. Ergänzen Sie die Zielwerte für 00, 01, 10 und 11. Vermuten Sie, ob das Neuron aus DL3 diese XOR-Regel darstellen kann. Öffnen Sie zudem das Notebook «Neuronale Netze», damit Python im Hintergrund startet.

![Leeres Koordinatengitter mit XOR-Eingaben](materialien/downloads/koordinatengitter_xor_einfach.svg "Ankommen | Tandem")

### Vorwissen aktivieren · 3 Min. · Ein Parametersatz für alle Fälle

**Klasse · 3 Min.**

Rechnen Sie gemeinsam für AND die Eingabe (1,1) mit w₁ = w₂ = 1 und b = −1.5. Warum dürfen Sie Gewichte und Bias nicht nach jeder Eingabe passend neu wählen?

**Merksatzanfang:** «Eine gelernte Entscheidungsfunktion muss …».

### Informieren · 22 Min. · Warum ein Neuron nicht reicht

**Klasse → Lehrperson → Tandem → Lehrperson · 5 / 5 / 5 / 7 Min.**

**Klasse · XOR-Rätsel am Beamer (zuerst vermuten):** Im Notebook «XOR: Ein Neuron» sagt die Klasse zuerst vorher, wie viele der vier Fälle ein Neuron schaffen kann. Dann schlägt sie Gewichte und Bias vor, die Lehrperson prüft alle vier Fälle. Gemeinsam feststellen: höchstens 3 von 4.

**Tafelskizze (Lehrperson · 5 Min.):** Die vier XOR-Punkte mit der Klasse einzeichnen. Die Klasse versucht, eine Gerade einzuzeichnen, und begründet, warum keine einzelne Gerade die beiden Klassen trennt. Die algebraischen Bedingungen nur nennen und nicht vorführen: Das Tandem schreibt sie im Anschluss selbst auf.

**Tandem · 5 Min. · Bedingungstabelle selbst ausfüllen:** Schreiben Sie für jede der vier Zeilen die Bedingung an w₁, w₂ und b auf (Ausgabe 1 heisst Summe ≥ 0, Ausgabe 0 heisst Summe < 0) und markieren Sie, welche Bedingungen sich widersprechen. Vergleichen Sie danach mit der Tafelkarte und dem Kurskapitel.

#### Tafelkarte · Vier Bedingungen für XOR (Lösung zum Vergleichen)

Bei Ausgabe 1 ab Summe 0 müssten gleichzeitig gelten:

| Eingabe | Ziel | Bedingung |
|---|---:|---|
| (0,0) | 0 | b < 0 |
| (0,1) | 1 | w₂ + b ≥ 0 |
| (1,0) | 1 | w₁ + b ≥ 0 |
| (1,1) | 0 | w₁ + w₂ + b < 0 |

Aus den mittleren Zeilen folgt w₁ + w₂ + b ≥ −b > 0. Das widerspricht der letzten Zeile. Eine Gerade trennt die diagonal gegenüberliegenden Klassen nicht. Das [einzelne XOR-Neuron](index.html#netze-1) kann mit einem festen Parametersatz höchstens drei der vier Fälle richtig entscheiden.

#### Tafelkarte · OR und NAND als neue Merkmale (Lehrperson · 7 Min.)

| Neuron | Gewichte | Bias | Bedeutung |
|---|---|---:|---|
| h₁ | 1 / 1 | −0.5 | OR der Eingaben |
| h₂ | −1 / −1 | 1.5 | NAND der Eingaben |
| Ausgang | 1 / 1 | −1.5 | AND von h₁ und h₂ |

![OR- und NAND-Entscheidungsgrenzen bei XOR](materialien/downloads/koordinatengitter_or_nand_xor.svg "Informieren | Lehrperson")

### Verarbeiten · 47 Min. · Vom Versuch zum Signalweg

**Tandem → Tandem → Klasse · 27 / 15 / 5 Min.**

1. Öffnen Sie das [Netzwerk-Kapitel](index.html#netze-2) und arbeiten Sie im Notebook «Neuronale Netze». Verfolgen Sie OR → NAND → AND und lösen Sie die vier XOR-Fälle mit dem Netz. Der Abschnitt «Selbstcheck · Ein anderer Fall» entfällt, dafür folgt die Papieraufgabe.
2. Rechnen Sie im Tandem einen zusätzlichen Eingabefall vollständig durch (Tabelle unten).
3. **Klasse · Demo am Beamer:** Die Lehrperson lässt das Netz mit 1, 2 und 4 versteckten Neuronen lernen. Mehr Neuronen garantieren in einem einzelnen Trainingslauf keinen Erfolg.

| Eingabe | OR: Summe / h₁ | NAND: Summe / h₂ | Ausgang: Summe / y | XOR-Ziel |
|---|---|---|---|---|
| (0,0) | ____________________ | ____________________ | ____________________ | 0 |
| (0,1) | ____________________ | ____________________ | ____________________ | 1 |
| (1,0) | ____________________ | ____________________ | ____________________ | 1 |
| (1,1) | ____________________ | ____________________ | ____________________ | 0 |

![Leeres Gitter für die Skizze der Zwischenschicht](materialien/downloads/koordinatengitter_or_nand_xor_leer.svg "Verarbeiten | Tandem")

> **Kontrolle für (0,1):** OR-Summe 0.5 → 1; NAND-Summe 0.5 → 1; Ausgangssumme 0.5 → 1. Die Zwischenschicht berechnet neue Merkmale; sie ist nicht nur «mehr Rechenleistung».

Kein drittes Notebook in dieser Lektion: [Ziffernerkennung](index.html#netze-5) · [eigenständiges Ziffern-Notebook](materialien/downloads/ziffernerkennung.ipynb).

### Auswerten · 13 Min. · Sicherung vor dem Projekt

**Tandem → Einzeln → Klasse → Lehrperson · 2 / 5 / 4 / 2 Min.**

Erklären Sie einander mündlich die XOR-Grenze und den Signalweg. Schreiben Sie danach allein auf der Kursseite (Kapitel 4, unbenotet):

1. **Netz:** Warum scheitert ein einzelnes Neuron bei XOR, und wie löst die Zwischenschicht das Problem? Erklären Sie die Ausgaben von OR, NAND und AND für (1,1).
2. **Brücke:** Im Projekt liefert ein fertiges Netz 1280 Zahlen je Foto. Welcher Teil lernt, welcher bleibt fest?
3. **Vorschau (Raten erlaubt):** Welche Bilder sollten erst ganz am Schluss für eine unabhängige Prüfung geöffnet werden, und warum?

Danach vergleichen die Lernenden mit der Selbstkontrolle; die Lehrperson liest zwei bis drei Antworten an und sammelt offene Fragen für den Start in DL 5.

**Ausblick, kein neuer Fachinput:** Der selbstständige Lernpfad zur Datenaufteilung beginnt erst in DL5. Ein Satz zur Brücke: Im Bildprojekt liefert das fertige MobileNet 1280 Zahlen je Foto, nur das kleine Netz dahinter lernt (Skizze und Brückenkarte am Ende der Kursseite).

**Vorbereitungsauftrag bis DL 5:** Thema und zwei Klassen aus der [Themenliste](index.html#projekt-2) wählen, die kein anderes Tandem verwendet (Eintrag in die Klassenliste; Vorlage in den Materialien zu DL 5 im Projektteil; wer zuerst einträgt, behält die Klasse), und passende Gegenstände besorgen (zehn verschiedene Exemplare, fünf je Klasse). Noch nicht fotografieren: Fotografiert wird in DL 5 erst nach dem Lernpfad und der Abnahme der Exemplarliste. Die Lehrperson gibt Thema und Klassen am Anfang von DL 5 frei, wenn beide Klassen noch frei sind (etwa eine Minute je Tandem, während die Tandems den Lernpfad lesen).
