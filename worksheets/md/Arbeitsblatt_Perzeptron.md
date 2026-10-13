---
title: "KI-Unterricht"
author: "Kantonsschule Stadelhofen"
lang: de-CH
---

# Ein Perzeptron · Pflichtteil

**Ziel:** Eingabe, Gewicht, Bias und Ausgabe erklären.

## 1 · Eine Entscheidung rechnen
Summe = Eingang 1 × Gewicht 1 + Eingang 2 × Gewicht 2 + Bias.
Ausgabe 1 bei Summe ≥ 0, sonst 0.
Der Bias ist die negative Schwelle: Schwelle s = −Bias. Das Neuron «feuert», wenn die gewichtete Summe die Schwelle erreicht.
Gewichte: 1 und 1, Bias: −1.5.

| Eingabe | Summe | Ausgabe |
|---|---|---|
| 0, 0 | … | … |
| 0, 1 | … | … |
| 1, 0 | … | … |
| 1, 1 | … | … |

Welche AND-Regel erkennen Sie? …

## 2 · Ein Lernschritt
Neue Startsituation: Gewichte 0.2 / 0.2, Bias −0.5; Eingabe (1,1), Ziel 1.
1. Summe und Ausgabe berechnen.
2. Muss die Summe steigen oder sinken?
3. Lernrate 0.2: Änderung = Lernrate × (Ziel − Ausgabe) × Eingang. Für den Bias gilt Eingang 1. Neue Gewichte und Bias berechnen.
4. Erneut prüfen. Sind dadurch automatisch alle Eingaben richtig? Begründen.

## 3 · Eine Grenze entdecken
XOR: (0,0) und (1,1) gehören zu Klasse 0, (0,1) und (1,0) zu Klasse 1.
Zeichnen Sie die vier Punkte. Kann eine Gerade die Klassen trennen?

Danach im Notebook die Gewichte und den Bias mit Reglern verändern.
