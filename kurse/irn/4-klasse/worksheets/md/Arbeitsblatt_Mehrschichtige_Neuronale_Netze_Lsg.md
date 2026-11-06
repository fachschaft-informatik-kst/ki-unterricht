---
title: "KI-Unterricht"
author: "Kantonsschule Stadelhofen"
lang: de-CH
---

# Lösungen · Mehrschichtige Netze

| Eingabe | OR | NAND | Ausgabe |
|---|---|---|---|
| 0,0 | 0 | 1 | 0 |
| 0,1 | 1 | 1 | 1 |
| 1,0 | 1 | 1 | 1 |
| 1,1 | 1 | 0 | 0 |

Ein einzelnes Perzeptron kann XOR nicht durch eine Gerade trennen; die Kombination zweier Zwischenergebnisse kann es.

Vorhersage → Fehler bewerten (gegen das Label) → Gewichte verändern → wiederholen. Das ist überwachtes Lernen. Ein manuell konstruiertes Step-Netz zeigt Darstellbarkeit, nicht Backpropagation. Dafür verwendet man passende Aktivierungen und ein Optimierungsverfahren.

Im Foto-Projekt wird der kleine nachgeschaltete MLP trainiert, überwacht mit den Klassen der Fotos als Labels. MobileNet bleibt eingefroren. Neue Exemplare prüfen, ob die Zuordnung über die bekannten Gegenstände hinaus funktioniert. Eine hohe Trainingsgenauigkeit genügt nicht.
