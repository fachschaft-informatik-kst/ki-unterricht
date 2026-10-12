# Eigene Bilder sammeln und vorbereiten

## 1. Kleine, klare Aufgabe wählen

Zwei bis vier Klassen, ein Hauptmotiv pro Bild. Legen Sie Grenzfälle fest: Ist eine zerdrückte Dose noch eine Dose? Verwenden Sie eigene JPG/PNG-Fotos. HEIC vorher exportieren. Originale separat aufbewahren, nicht nur die verkleinerten Vorschauen.

## 2. Erst Gruppen planen, dann fotografieren

Planen Sie acht unabhängige Datengruppen. Bei zwei Obstklassen etwa:

| Gruppe | Apfel | Birne | Rolle |
|---|---|---|---|
| G01–G04 | je ein anderer Apfel | je eine andere Birne | Training |
| G05–G06 | je ein weiterer Apfel | je eine weitere Birne | Validierung |
| G07–G08 | je ein zurückgehaltener Apfel | je eine zurückgehaltene Birne | Abschlusstest |

Je Exemplar zwölf eigenständige Aufnahmen: insgesamt 192 Bilder für zwei Klassen. Die Gruppencodes bündeln hier mehrere Objekte (eines je Klasse). Bei Gesten ist jede Gruppe eine Person, die alle Gesten zeigt. Bei Symbolen eine zeichnende Person. Dokumentieren Sie, was jeder Code bedeutet.

**Ein Objekt / eine Person behält immer denselben Gruppencode.** Fotos derselben Flasche mit anderem Hintergrund dürfen nicht in den Test wandern. Software kann prüfen, ob Codes getrennt sind; sie kann nicht feststellen, ob Sie demselben Gegenstand zwei Codes gegeben haben.

Variieren Sie Abstand, Perspektive und Licht innerhalb sinnvoller Grenzen, möglichst vergleichbar für alle Klassen. Vermeiden Sie eine Klasse ausschliesslich vor rotem und eine andere vor blauem Hintergrund. Keine Serien fast identischer Bilder als Ersatz für Vielfalt. Niemand muss auf dem Foto identifizierbar sein; bei Gesten genügt die Hand.

## 3. Fotostudio verwenden

1. Im Projektjournal die Zelle `foto.fotostudio()` ausführen. Den angebotenen HTML-Download speichern und lokal in einem aktuellen Browser öffnen. Der Download enthält den benötigten Hilfscode.
2. Klasse, Gruppe und Quelle eintragen. Bilder dieser Klasse und Gruppe auswählen. Links erscheint das Original, rechts die standardisierte Fassung. Prüfen Sie auch die Orientierung.
3. **Auswahl verarbeiten** anklicken. Der erste Durchlauf lädt TensorFlow.js 4.22.0, MobileNet 2.1.1 und die Gewichte von MobileNet V2 alpha=0.5. Internetzugriff auf jsDelivr und Google ist dafür erforderlich. Schulnetz vorab ausprobieren.
4. Wiederholen, bis alle Gruppen und Klassen vorliegen. Die Zähler kontrollieren. Duplikate desselben standardisierten Bildes werden übersprungen; widersprüchliche Zuordnungen melden einen Fehler.
5. **Sammlung herunterladen**. JSON regelmässig sichern. Zum Fortsetzen eine gesicherte Sammlung importieren. Mehrere JSON-Dateien können im Notebook gemeinsam importiert werden; identische IDs werden zusammengeführt.

Keine Bildübertragung an einen Server durch das Fotostudio. Browser und Notebook verarbeiten lokal. Die exportierte JSON-Datei enthält Klassen, Quellen, Dateinamen, Gruppencodes, Merkmale und kleine Bildvorschauen; behandeln Sie sie wie Ihren Bilddatensatz.

## 4. Was passiert mit der Matrix?

- Der Browser dekodiert das JPG/PNG einschliesslich seiner Orientierung; Vorschau kontrollieren.
- Das Bild wird proportional in eine **224 × 224** grosse, weisse Fläche eingepasst. Transparenz erhält ebenfalls einen weissen Hintergrund. Kein Abschneiden, kein Strecken.
- Drei Farbkanäle ergeben **224 × 224 × 3** Werte. MobileNet übernimmt intern die Skalierung von 0–255 auf 0–1. Nicht zusätzlich durch 255 teilen.
- Das eingefrorene Modell liefert **1280 Merkmale**. Diese sind gelernte Bildbeschreibungen, keine von uns einzeln benannten Eigenschaften.
- Im Notebook wird jeder Merkmalsvektor auf Länge 1 normiert. Dafür werden keine Statistiken aus anderen Bildern benötigt. Das kleine eigene Netz verarbeitet diese 1280 Werte.
- Die **64 × 64** Vorschauen dienen nur zur Anzeige und Fehleranalyse; sie sind nicht die Eingabe des Bildmodells.

Alle Rollen durchlaufen genau dieselbe feste Vorverarbeitung. Das bereits anderweitig trainierte Bildmodell wird weder mit Ihren Trainings- noch mit Ihren Testbildern verändert. Seine Vortrainingsdaten beeinflussen trotzdem, welche Merkmale verfügbar sind.

## 5. Im Notebook arbeiten und sichern

`MODUS = 'EIGENE_DATEN'` wählen, Klassennamen exakt übernehmen und Gruppen zuordnen. Kernel neu starten, bis zur Uploadzelle ausführen, JSON wählen, danach weiterarbeiten. Alternativ JSON in den JupyterLite-Dateibrowser laden und Dateinamen in `DATEIEN` eintragen.

Vor dem Abschlusstest Variante anhand der Validierung auswählen und begründen. Danach nicht mit denselben Testbildern weiter optimieren. Die Testsperre ist eine Arbeitsregel, kein Zugriffsschutz.

Abgabe: Notebook mit Ausgaben, Fotostudio-JSONs, Originalbilder, Quellen-/Gruppenliste und Versuchsprotokoll. Zusätzlich ausserhalb des Browsers sichern.

## Übungs- und Ersatzdaten

`foto_uebungsdaten.json` enthält 192 synthetisch erzeugte Bilder der Klassen Kreis und Dreieck, acht simulierte Gruppen, zwölf Bilder je Klasse und Gruppe. Ihre Merkmale wurden mit demselben echten MobileNet berechnet. Keine realen Personen oder aufgenommenen Alltagsgegenstände. Quelle: prozedurale Zeichnungen dieses Projekts, keine fremden Fotos.

`UEBUNG` benötigt keinen erneuten Modelldownload. `ERSATZ` verwendet nach Absprache denselben Datensatz; die Fragestellung muss auf synthetische Formen begrenzt sein. Die Ergebnisse lassen sich nicht auf freie Fotoanwendungen übertragen. Eigene Bildbeschaffung darf damit nicht behauptet werden.

Technische Referenz: [TensorFlow.js MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet).
