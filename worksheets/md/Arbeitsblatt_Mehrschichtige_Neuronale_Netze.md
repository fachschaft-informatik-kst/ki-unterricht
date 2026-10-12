---
title: "KI-Unterricht"
author: "Kantonsschule Stadelhofen"
lang: de-CH
---

# Mehrschichtige Netze · Pflichtteil

**Ziel:** erklären, was eine Zwischenschicht ermöglicht.

## 1 · XOR in zwei Zwischenschritten
Neuron h1 bildet OR (mindestens ein Eingang 1).
Neuron h2 bildet NAND (nicht beide Eingänge 1).
Die Ausgabe bildet AND aus h1 und h2.

| Eingabe | h1: OR | h2: NAND | Ausgabe |
|---|---|---|---|
| 0,0 | … | … | … |
| 0,1 | … | … | … |
| 1,0 | … | … | … |
| 1,1 | … | … | … |

Erklären Sie eine Zeile in eigenen Worten. Warum reicht ein einzelnes Neuron nicht?

## 2 · Konstruieren und Lernen unterscheiden
Im Beispiel geben wir die Gewichte selbst vor. Beim Training werden sie verändert.
Bringen Sie in die richtige Reihenfolge: Gewichte verändern; Vorhersage berechnen; Fehler bewerten; wiederholen.

Backpropagation berechnet den Einfluss der Gewichte auf den Fehler. Ein Optimierungsverfahren verändert die Gewichte. Keine Rechnungen dazu nötig.

## 3 · Unser Bildprojekt
Foto → vortrainiertes Bildmodell → feste Merkmale → eigenes kleines Netz → Klasse.
Welcher Teil wird mit unseren Fotos trainiert? Warum brauchen wir zusätzlich neue Bilder zur Prüfung?
