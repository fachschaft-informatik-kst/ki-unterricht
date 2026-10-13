# Eigene Fotos: der einfache Datenplan

**Zwei Klassen × fünf Gruppen × acht Fotos = 80 Bilder.**

| Gruppe | Inhalt am Beispiel Apfel/Birne | Rolle |
|---|---|---|
| T1 | Apfel 1, Birne 1 | Training A und B |
| T2 | Apfel 2, Birne 2 | zusätzlich Training B |
| V1 | Apfel 3, Birne 3 | A und B vergleichen |
| P1 | Apfel 4, Birne 4 | Abschlusstest |
| P2 | Apfel 5, Birne 5 | Abschlusstest |

Jeder Gegenstand bleibt in genau einer Gruppe. Ein anderer Hintergrund erzeugt kein neues Testobjekt. Bei Gesten: eine andere Person pro Gruppe, jeweils beide Gesten. Bei Symbolen: verschiedene zeichnende Personen. Bei Spielkarten: verschiedene Kartendesigns/Decks. Diese Spezialfälle vorher besprechen.

## Sammeln

1. Zwei eindeutige Klassen und fünf unabhängige Gruppen mit der Lehrperson festlegen.
2. Je Klasse/Gruppe acht unterschiedliche JPG/PNG-Fotos aufnehmen. Perspektive, Abstand und Licht variieren. Ähnliche Bedingungen für beide Klassen und alle Gruppen schaffen.
3. Quellen und Aufnahmebedingungen notieren. Eigene Fotos verwenden; Internetbilder nur nach Absprache mit Quellen und Nutzungsbedingungen.
4. Fotos vor dem 15.12. bereithalten. Originale ausserhalb des Browsers sichern.

## Fotostudio

Auf der Kursseite im Journal das eingebettete Fotostudio öffnen. Beim Arbeiten mit einem eigenständigen Notebook alternativ `foto.fotostudio()` ausführen und die angebotene HTML-Datei im Browser öffnen.
Klasse, Gruppe (T1/T2/V1/P1/P2), Quelle und Fotos eintragen. Vorschau prüfen, verarbeiten, JSON herunterladen. Zum Fortsetzen gesicherte JSON importieren. HEIC vorher als JPG exportieren.

Unter «Sichern & abgeben» Originalfotos und die heruntergeladene JSON zusätzlich hinzufügen.

Das Studio verarbeitet lokal; Bibliotheken und Modell werden aus dem Internet geladen. Ohne Download gehen Sammlungen beim Schliessen verloren.

## Import und einheitliche Matrix

Im Versuchsnotebook `EIGENE_DATEN` und die zwei Klassennamen eintragen. JSON auswählen, danach die nächste Zelle starten. Die Gruppenrollen sind vorbereitet. Der Import verlangt genau acht Bilder pro Klasse/Gruppe und prüft Kopien; falsch vergebene Gruppen kann er nicht erkennen.

Jedes Bild wird proportional in **224 × 224 RGB-Pixel** eingepasst, mit weissem Rand. MobileNet V2 (alpha 0.5) liefert **1280 feste Merkmale**; das Notebook normiert sie je Bild. Nur das nachgeschaltete kleine Netz wird trainiert. 64 × 64-Vorschauen dienen der Anzeige.

## Vergleich

A: acht Fotos aus T1 pro Klasse. B: vier aus T1 und vier aus T2 pro Klasse. Auswahl, Netz, Epochen und Startwert sind vorbereitet. V1 hilft auswählen. P1/P2 erst nach der begründeten Auswahl prüfen.

Ein Lauf, eine Validierungsgruppe und zwei Testgruppen erlauben nur vorsichtige Aussagen. Auch die konkreten Bilder ändern sich; ein Unterschied ist kein isolierter Beweis für den Einfluss der Vielfalt.

## Übung oder Ersatz

`UEBUNG` verwendet 80 ausgewählte künstliche Formen aus dem mitgelieferten Datensatz mit echten MobileNet-Merkmalen. `ERSATZ` verwendet nach Absprache dieselben Daten; die Frage muss sich auf diese Formen beziehen. Keine eigene Fotosammlung oder Übertragbarkeit auf echte Fotos behaupten.
