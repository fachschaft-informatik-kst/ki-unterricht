## Doppellektion 03

**Bereitlegen:** Papier für die Handrechnung und [Neuron-Labor auf der Kursseite](index.html#perzeptron-5). [Notebook herunterladen](materialien/downloads/perzeptron_und_neuronale_netze.ipynb) · [Perzeptron-Arbeitsblatt](materialien/downloads/Arbeitsblatt_Perzeptron.md) · [Lösung](materialien/downloads/Arbeitsblatt_Perzeptron_Lsg.md).

### Ankommen · 5 Min. · Wann geht das Signal an?

**Tandem · 5 Min.**

Ein Warnsignal soll nur angehen, wenn **beide** Sensoren aktiv sind. Ergänzen Sie:

| Sensor x₁ | Sensor x₂ | Gewünschtes Signal |
|---:|---:|---|
| 0 | 0 | ______ |
| 0 | 1 | ______ |
| 1 | 0 | ______ |
| 1 | 1 | ______ |

### Vorwissen aktivieren · 5 Min. · Eingaben und Labels

**Tandem · 5 Min.**

Ergänzen Sie neben der Tabelle die OR-Zielwerte. Markieren Sie: Was sind die **Eingaben**, was die **gewünschten Ausgaben / Labels**? Beschreiben Sie in einem Satz, wann sich AND und OR unterscheiden.

### Informieren · 15 Min. · Rechenkarte für ein Neuron

**Lehrperson → Tandem · 12 / 3 Min.**

#### Modell · Summe, Schwelle und Ausgabe

**s = x₁ · w₁ + x₂ · w₂ + b.** Ausgabe y = 1 bei s ≥ 0, sonst y = 0.

Beim Schwimmbad-Beispiel stehen zwei Ja/Nein-Eingaben für günstige Bedingungen. Ein Gewicht bestimmt den Einfluss einer Eingabe; der Bias verschiebt die Entscheidung unabhängig von der Eingabe.

| Eingabe | w₁ / w₂ | Bias | Summe s | Ausgabe |
|---|---|---:|---|---:|
| (1,1) | 1 / 1 | −1.5 | 1 + 1 − 1.5 = 0.5 | 1 |
| (1,0) | 1 / 1 | −1.5 | 1 + 0 − 1.5 = −0.5 | 0 |
| (0,1), selbst rechnen | 1 / 1 | −1.5 | ____________________ | ______ |

![AND-Entscheidungsgrenze mit Lösung](materialien/downloads/koordinatengitter_perzeptron_and_loesung.svg "Informieren | Lehrperson")

#### Ein Lernschritt zum Nachrechnen

Start: w₁ = w₂ = 0.2, b = −0.5, Lernrate η = 0.2. Beispiel (1,1), Ziel t = 1. Zunächst s = −0.1 und y = 0; Fehler e = t − y = 1.

**Korrektur:** wᵢ neu = wᵢ alt + η · e · xᵢ; b neu = b alt + η · e.

| Parameter | Vorher | Änderung | Nachher |
|---|---:|---:|---:|
| w₁ | 0.2 | +0.2 | 0.4 |
| w₂ | 0.2 | +0.2 | 0.4 |
| b | −0.5 | +0.2 | −0.3 |

Danach ergibt dieselbe Eingabe s = 0.5, also y = 1. Eingaben, Label und Schwellenregel bleiben unverändert.

![Lernregel eines Perzeptrons als Flussdiagramm](materialien/downloads/perzeptron_lernregel_flussdiagramm.svg "Informieren | Lehrperson")

### Verarbeiten · 55 Min. · Drei Experimente, ein Rechenprotokoll

**Tandem → Einzeln · 45 / 10 Min.**

1. **Schwimmbad:** Verändern Sie zunächst nur ein Gewicht, dann nur den Bias. Notieren Sie eine Eingabe, bei der sich die Ausgabe ändert.
2. **AND / OR:** Finden Sie für jede Funktion eine Einstellung. Prüfen Sie mit **denselben Parametern alle vier Eingaben**.
3. **Lernen:** Verfolgen Sie den oben beschriebenen Schritt im Neuron-Labor. Vergleichen Sie Vorher und Nachher.

| Experiment / Eingabe | w₁ / w₂ / b vorher | Summe / Ausgabe vorher | Änderung | Summe / Ausgabe nachher |
|---|---|---|---|---|
| ____________________ | ____________________ | ____________________ | ____________________ | ____________________ |

![Verschiebung der Entscheidungsgrenze durch den Bias](materialien/downloads/perzeptron_bias_shift.svg "Verarbeiten | Tandem")

**Allein:** Wählen Sie eine AND- oder OR-Zeile und rechnen Sie die Summe aus. Welche Parameteränderung würde die Ausgabe umkehren? [Leeres Koordinatengitter](materialien/downloads/koordinatengitter_perzeptron.svg).

> **Kontrollbeispiele:** AND gelingt mit 1 / 1 / −1.5, OR mit 1 / 1 / −0.5. Ein einzelner korrekt berechneter Fall genügt nicht als Nachweis für die ganze Funktion. XOR folgt erst in DL4.

### Auswerten · 10 Min. · Zwei eigene Merksätze

**Einzeln → Klasse → Lehrperson → Einzeln · 2 / 4 / 2 / 2 Min.**

Erklären Sie eine eigene Rechnung und prüfen Sie zwei Lernprotokolle gemeinsam. Schreiben Sie zum Abschluss:

- **Entscheiden:** «Ein Neuron berechnet …; das Gewicht …; der Bias …».
- **Lernen:** «Bei einem Fehler werden … angepasst; unverändert bleiben …».
