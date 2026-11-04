## Doppellektion 04

**Bereitlegen:** Papier oder [XOR-Gitter](materialien/downloads/koordinatengitter_xor_einfach.svg); die zwei Pflichtnotebooks getrennt öffnen: [XOR: Ein Neuron](materialien/downloads/xor_einzelne_neuronen.ipynb) und [Neuronale Netze](materialien/downloads/mehrschichtige_netze.ipynb).

### Ankommen · 5 Min. · Genau eine Taste

**Tandem · 5 Min.**

Das Signal geht an, wenn **genau eine** von zwei Tasten aktiv ist. Ergänzen Sie die Zielwerte für 00, 01, 10 und 11. Vermuten Sie, ob das Neuron aus DL3 diese XOR-Regel darstellen kann.

![Leeres Koordinatengitter mit XOR-Eingaben](materialien/downloads/koordinatengitter_xor_einfach.svg "Ankommen | Tandem")

### Vorwissen aktivieren · 5 Min. · Ein Parametersatz für alle Fälle

**Tandem · 5 Min.**

Rechnen Sie für AND die Eingabe (1,1) mit w₁ = w₂ = 1 und b = −1.5. Warum dürfen Sie Gewichte und Bias nicht nach jeder Eingabe passend neu wählen?

**Merksatzanfang:** «Eine gelernte Entscheidungsfunktion muss …».

### Informieren · 15 Min. · Warum ein Neuron nicht reicht

**Lehrperson · 15 Min.**

#### Tafelkarte · Vier Bedingungen für XOR

Bei Ausgabe 1 ab Summe 0 müssten gleichzeitig gelten:

| Eingabe | Ziel | Bedingung |
|---|---:|---|
| (0,0) | 0 | b < 0 |
| (0,1) | 1 | w₂ + b ≥ 0 |
| (1,0) | 1 | w₁ + b ≥ 0 |
| (1,1) | 0 | w₁ + w₂ + b < 0 |

Aus den mittleren Zeilen folgt w₁ + w₂ + b ≥ −b > 0. Das widerspricht der letzten Zeile. Eine Gerade trennt die diagonal gegenüberliegenden Klassen nicht. Das [einzelne XOR-Neuron](index.html#netze-1) kann mit einem festen Parametersatz höchstens drei der vier Fälle richtig entscheiden.

#### Tafelkarte · OR und NAND als neue Merkmale

| Neuron | Gewichte | Bias | Bedeutung |
|---|---|---:|---|
| h₁ | 1 / 1 | −0.5 | OR der Eingaben |
| h₂ | −1 / −1 | 1.5 | NAND der Eingaben |
| Ausgang | 1 / 1 | −1.5 | AND von h₁ und h₂ |

![OR- und NAND-Entscheidungsgrenzen bei XOR](materialien/downloads/koordinatengitter_or_nand_xor.svg "Informieren | Lehrperson")

### Verarbeiten · 55 Min. · Vom Versuch zum Signalweg

**Tandem → Einzeln → Tandem · 35 / 5 / 15 Min.**

1. Prüfen Sie im XOR-Notebook alle vier Fälle mit demselben Parametersatz.
2. Öffnen Sie danach das [Netzwerk-Kapitel](index.html#netze-2). Verfolgen Sie OR → NAND → AND und die Lernversuche mit 1, 2 und 4 versteckten Neuronen. Mehr Neuronen garantieren in einem einzelnen Trainingslauf keinen Erfolg.
3. Zeichnen Sie **allein** die vier XOR-Punkte und die beiden Klassen. Begründen Sie, weshalb eine Gerade nicht genügt.
4. Rechnen Sie im Tandem einen zusätzlichen Eingabefall vollständig durch.

| Eingabe | OR: Summe / h₁ | NAND: Summe / h₂ | Ausgang: Summe / y | XOR-Ziel |
|---|---|---|---|---|
| (0,0) | ____________________ | ____________________ | ____________________ | 0 |
| (0,1) | ____________________ | ____________________ | ____________________ | 1 |
| (1,0) | ____________________ | ____________________ | ____________________ | 1 |
| (1,1) | ____________________ | ____________________ | ____________________ | 0 |

![Leeres Gitter für die eigene Skizze der Zwischenschicht](materialien/downloads/koordinatengitter_or_nand_xor_leer.svg "Verarbeiten | Einzeln")

> **Kontrolle für (0,1):** OR-Summe 0.5 → 1; NAND-Summe 0.5 → 1; Ausgangssumme 0.5 → 1. Die Zwischenschicht berechnet neue Merkmale; sie ist nicht nur «mehr Rechenleistung».

**Nur freiwillig:** [Ziffernerkennung](index.html#netze-5) · [eigenständiges Ziffern-Notebook](materialien/downloads/ziffernerkennung.ipynb). Kein drittes Pflichtnotebook.

### Auswerten · 10 Min. · Kurzcheck vor dem Projekt

**Tandem → Klasse → Lehrperson → Einzeln · 2 / 4 / 2 / 2 Min.**

Erklären Sie einander die XOR-Grenze und prüfen Sie einen Signalweg gemeinsam. Beantworten Sie allein in zwei Minuten:

1. Was bewirken Gewichte und Bias?
2. Warum benötigt XOR eine Zwischenschicht?
3. Welche Unsicherheit möchten Sie vor der Projektarbeit klären?

**Ausblick, kein neuer Fachinput:** Der selbstständige Lernpfad zur Datenaufteilung beginnt erst in DL5.
