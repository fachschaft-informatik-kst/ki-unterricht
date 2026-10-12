---
title: "KI-Unterricht"
author: "Kantonsschule Stadelhofen"
lang: de-CH
---

# Lösungen · Perzeptron

1. Summen: −1.5, −0.5, −0.5, 0.5. Ausgaben: 0,0,0,1. AND.
2. Startsumme −0.1, Ausgabe 0, Fehler 1. Jede Änderung +0.2. Neue Gewichte 0.4 / 0.4, Bias −0.3. Neue Summe 0.5, Ausgabe 1. Andere Beispiele müssen erneut geprüft werden; z.B. (0,1) würde jetzt ebenfalls 1 ergeben.
3. XOR ist nicht linear trennbar. Mehr Rechenzeit für ein einzelnes Perzeptron behebt diese Grenze nicht.

Bias ist ein additiver Wert. Die geometrische Verschieberichtung hängt auch von den Gewichten ab. Die Lernrate ist die Schrittweite; hier keine allgemeine Konvergenzbehauptung aus einer Update-Übung ableiten.
