---
type: chapter
id: basis-abschluss-experiment
nummer: 1
titel: Ein fremdes Projekt kritisch prüfen
kurz: T1/T2, V1 und P1/P2 · Ergebnisse · Grenzen
---

**Auftrag während der Einzelgespräche (unbenotet):** Ihr untersucht ein zugeteiltes, anonymisiertes Projekt. Ziel ist nicht, andere Tandems zu benoten, sondern zu verstehen, welche Aussagen die fremden Daten und Ergebnisse erlauben.

### 1 · Daten und Originalergebnisse prüfen

Öffnet das fremde ZIP in einer getrennten privaten Browsersitzung, damit euer eigener Kursstand unverändert bleibt. Lest Journal und Notebookausgaben. Vergleicht die zwei Bildklassen, T1/T2, V1 und P1/P2. Betrachtet ein Trainings- und ein Testbild; sind verschiedene Exemplare und vergleichbare Bedingungen erkennbar? Notiert A/B auf V1, die begründete Modellwahl und das ursprüngliche P1/P2-Ergebnis.

### 2 · Das fremde Modell wiederherstellen

Python-Modelle sind nach dem Öffnen eines gesicherten Notebooks nicht im Speicher. Führt im fremden Notebook Start, Datenimport und den ursprünglichen A/B-Vergleich mit denselben Einstellungen erneut aus. Vergleicht V1 mit der dokumentierten Abgabe. Verwendet die **damals gewählte** Variante; keine neue Modellwahl und kein Optimieren am Abschlusstest. Die Lehrperson stellt bei Bedarf ein lauffähiges Referenzprojekt bereit.

### 3 · Eigene Bilder am fremden Modell ausprobieren

Vermutet zuerst, was das Modell mit zwei anderen Bildklassen tun wird. Öffnet im fremden Notebook den Abschnitt «Fremdmodell prüfen», tragt die eigenen Klassennamen und die ursprüngliche fremde Modellwahl ein und ladet eure eigene Fotostudio-JSON. Führt die Fremdtestzelle aus, ohne das Netz weiter zu trainieren. Vergleicht je ein Bild aus beiden eigenen Klassen und die vier Zahlen der Vorhersagetabelle. Falls ihr keine eigenen Fotos habt, nutzt einen von der Lehrperson bereitgestellten Datensatz mit zwei anderen Klassen oder ein dokumentiertes Referenzergebnis.

| | Fremdes Label 1 | Fremdes Label 2 |
|---|---:|---:|
| Unsere Klasse C | … | … |
| Unsere Klasse D | … | … |

**Einordnung:** Im regulären Abschlusstest P1/P2 sind die Bilder neu, die Klassen aber bekannt. Im Fremdversuch sind auch die Klassen neu. Das Modell besitzt keine Ausgabe für sie und muss eines seiner alten Labels auswählen. Auch eine deutliche Trennung ist deshalb keine Trefferquote für eure eigenen Klassen.

<div class="basis-answer"><label for="basis-abschluss-a">Fremdcheck: Daten, Originalergebnisse, Erwartung, Beobachtung und Rückfrage</label><textarea id="basis-abschluss-a" data-basis-answer="basis-abschluss-a" rows="9" placeholder="Fremde Klassen … / T1/T2 vs. P1/P2 … / V1 A/B … / ursprüngliche Wahl und Test … / Nachlauf … / Erwartung … / Tabelle C/D … / zwei Beispiele … / mögliche Ursache und Rückfrage …"></textarea></div>

### 4 · Grenzen erklären

Nennt eine plausible Ursache (z. B. Form, Farbe oder Hintergrund) und einen nächsten Versuch, der sie prüfen könnte. Bei technischen Problemen verwendet ihr dokumentierte Originalwerte und Referenzbeispiele. Kennzeichnet, welche Schritte ihr nicht selbst durchführen konntet; erfindet keine Messwerte. Sichert eure Rückmeldung getrennt vom fremden Projekt.
