# Musterlösungen und Erwartungshorizont

**Für die Lehrperson.** Die Antworten sind Beispiele, keine einzig zulässigen Formulierungen. Bei eigenen Bildern, Lernstrecken und Notebook-Experimenten zählen tatsächliche Beobachtungen und Belege. **Illustrative Zahlen sind ausdrücklich keine gemessenen Ergebnisse.**

## 3 · Perzeptron (Doppellektion 3)

### Wie entscheidet ein Neuron?

Es bildet die **gewichtete Summe plus Bias** und gibt ab Summe 0 die Ausgabe 1 aus, sonst 0. Gewichte verändern den Einfluss der Eingaben; der Bias verschiebt die Schwelle.

**UND-Beispiel:** Gewichte 1 und 1, Bias −1,5:

| Eingabe | Summe | Ausgabe |
|---|---:|---:|
| (0,0) | −1,5 | 0 |
| (0,1) | −0,5 | 0 |
| (1,0) | −0,5 | 0 |
| (1,1) | +0,5 | 1 |

### Was wird gelernt?

**Gewichte und Bias** werden beim überwachten Lernen anhand bekannter Trainingsziele (Labels) schrittweise korrigiert; die Grundrechnung und die Schwelle ändern sich nicht. Eine höhere Lernrate kann schneller korrigieren, aber auch überschiessen. Beobachtete Gewichtsänderungen müssen aus dem eigenen Notebook stammen.

## 4 · XOR und künstliche neuronale Netze (Doppellektion 4)

### Warum XOR ein einzelnes Neuron überfordert

**XOR:** Nur (0,1) und (1,0) ergeben 1, die beiden anderen Fälle 0. Eine einzige Gerade kann die Punkte nicht korrekt trennen. Deshalb scheitert ein einzelnes Perzeptron an XOR, egal welche Gewichte es lernt.

### Ein mehrschichtiges künstliches neuronales Netz löst XOR

Eine mögliche Zusammensetzung: Zwischenschicht mit **ODER** und **NAND**, danach **UND**:

| Eingabe | ODER | NAND | Ergebnis |
|---|---:|---:|---:|
| (0,0) | 0 | 1 | 0 |
| (0,1) | 1 | 1 | 1 |
| (1,0) | 1 | 1 | 1 |
| (1,1) | 1 | 0 | 0 |

Mit einer Zwischenschicht sind auch nichtlinear trennbare Muster möglich. Beim selbst trainierten Netz variiert das Ergebnis unter Umständen mit dem Startwert.

### Ziffernerkennung

Ein handgeschriebenes Ziffernbild hat **64 Pixelwerte** (8 × 8), die versteckte Schicht **16 Neuronen** und der Ausgang **10 Werte** für 0 bis 9. Der höchste Wert bestimmt die Vorhersage, garantiert aber keine Korrektheit. Eine echte Verwechslung muss anhand des gezeigten Bilds erläutert werden. Das Netz lernt überwacht: Zu jedem der 1257 Trainingsbilder ist die richtige Ziffer als Label bekannt, und das Netz vergleicht seine Vorhersage damit. Nur die Ausgabe wird mit dem Label verglichen; die versteckten Neuronen bekommen keine eigenen Labels. Auch die 540 Prüfbilder haben Labels, das Netz lernt aber nicht an ihnen.

### Brücke zum Bildprojekt

«Im Bildprojekt arbeitet ein Netz wie hier, aber mit 1280 statt 2 Eingaben. Die Zahlen berechnet MobileNet, ein fertiges Netz, das sich nicht verändert. Nur das kleine Netz dahinter lernt unsere zwei Klassen, wieder überwacht: vorhersagen, Fehler gegen das Label bewerten, Gewichte anpassen.» Entscheidend ist die Trennung zwischen **fest** (MobileNet) und **lernend** (kleines Netz).

## 5–8 · Tandemprojekt: beispielhafte Musterlösung

### Datenaufteilung selbstständig erarbeiten (Doppellektion 5)

### Warum Gruppen trennen?

- **Training:** Gewichte werden gelernt.
- **Validierung:** A und B werden verglichen und vor der Testeinsicht ausgewählt.
- **Abschlusstest:** Die festgelegte Variante wird auf neuen Exemplaren überprüft.

Fotos derselben Person oder desselben Gegenstands müssen in **derselben Gruppe** bleiben. Sonst entsteht ein Datenleck, das eine zu hohe Leistung vortäuschen kann.

**Beispielthema:** Apfel/Birne. Alle nachfolgenden Prozentzahlen sind **rein fiktive Rechenbeispiele**, **keine tatsächlich gemessenen Modellwerte**. Für das echte Journal müssen die Resultate aus dem ausgeführten Notebook und eigene Bilder verwendet werden.

### Reflexion 1 – Anwendung, Vermutung, Planung

«Unser Modell soll zwei Fruchtarten auf Fotos unterscheiden. Wir vermuten, dass Variante B auf neuen Exemplaren besser arbeitet, weil sie zwei Exemplare jeder Klasse kennenlernt. Wir planen Datenerhebung, Prüfung, A/B-Vergleich, Auswahl, Test und Fazit. Wir teilen die Arbeit auf, prüfen alle Ergebnisse gemeinsam und reservieren Zeit für Probleme und Sicherung.»

### Reflexion 2 – 80 Bilder und mögliche Probleme

- **T1:** Apfel 1 und Birne 1, je acht Fotos; Training beider Varianten.
- **T2:** Apfel 2 und Birne 2, je acht Fotos; zusätzliche Vielfalt bei B.
- **V1:** Apfel 3 und Birne 3, je acht Fotos; Validierung.
- **P1:** Apfel 4 und Birne 4, je acht Fotos; Test.
- **P2:** Apfel 5 und Birne 5, je acht Fotos; Test.

Insgesamt **80 Bilder**, davon **32 im Trainingspool**, **16 in der Validierung**, **32 im Test**. **Pro Modellvariante werden nur 16 Bilder trainiert**: acht pro Klasse.

«Unsere eigenen Fotos zeigen verschiedene Perspektiven. Eine mögliche Schwäche ist unterschiedliches Licht oder ein klassenspezifischer Hintergrund: Das Netz könnte sich daran statt am Objekt orientieren.»

### Was wird technisch tatsächlich trainiert?

**MobileNet V2 ist vortrainiert und bleibt eingefroren.** Es liefert **1280 Bildmerkmale**. Nur das **nachgeschaltete Netz mit 16 Neuronen** lernt anhand der Trainingsbilder: **60 Epochen**, Startwert **11**, Adam-Optimierung. Das Training ist überwachtes Lernen: Jedes Foto trägt seine Klasse als Label, und das kleine Netz vergleicht seine Vorhersage damit. V1 und P1/P2 haben ebenfalls Labels, dienen aber nur zum Vergleichen.

- **A:** acht Fotos eines Exemplars aus T1 je Klasse.
- **B:** je vier Fotos aus T1 und T2 je Klasse.
- Beide verwenden **dieselbe Gesamtzahl Trainingsbilder**, Architektur, Trainingsdauer, Startwert und V1-Bilder.

**Wer weiss was?** (Box auf der Seite «A/B-Versuch», unter «Hintergrund»)

- **MobileNet** kennt Formen, Texturen und Muster aus über einer Million fremder Fotos, lernt im Projekt nichts und kennt unsere zwei Klassen nicht. Es wurde überwacht vortrainiert (Fotos mit 1000 Klassennamen als Labels); dieser Ausgang wird nicht benutzt.
- **Das kleine Netz** lernt, welche Zahlenmuster aus den 1280 Merkmalen zu Klasse A und welche zu Klasse B gehören, überwacht mit unseren Klassen als Labels. Es weiss nicht, was ein «Apfel» ist; Hintergrund und Licht zählen als Merkmale mit.

**Häufige Fehlvorstellungen:** «MobileNet kennt Apfel und Birne schon.» Nein, es liefert nur Merkmale. «Das kleine Netz erkennt den Apfel.» Es ordnet Zahlenmuster zu, notfalls anhand von Hintergrund oder Licht. Darum zählen nur neue Exemplare als Beleg.

### Reflexion 3 – A/B-Vergleich und Auswahl

**Fiktives Zahlenbeispiel:** A erkennt **12/16 = 75 %** von V1 richtig; B erkennt **14/16 = 87,5 %**. Unterschied **12,5 Prozentpunkte**.

«Wir würden B auswählen, weil die Validierungsgenauigkeit im Beispiel höher ist. Ein konkretes Bild, bei dem die Vorhersage abweicht, muss zusätzlich untersucht werden. Licht, Bildauswahl und Zufall können ebenfalls zum Unterschied beigetragen haben. Ein Lauf mit einer Validierungsgruppe beweist nicht, dass B allgemein überlegen ist.»

**B muss nicht besser sein.** Bei Gleichstand kann eine Variante nachvollziehbar begründet gewählt werden. Die Auswahl erfolgt **vor** dem Abschlusstest.

### Reflexion 4 – Abschlusstest und Grenzen

**Testfreigabe:** Variante und Begründung zuerst im Journal und Notebook eintragen, danach die Testfreigabe-Variable auf **True** setzen. Der Test verwendet **32 Bilder aus P1 und P2**; nach Einsicht nicht weiter optimieren.

**Fiktives Zahlenbeispiel:** 26 von 32 korrekt = **81,25 %**. Drei konkrete Vorhersagen müssen wirklich beobachtet und erklärt werden; **keine Fehler erfinden**, wenn alle richtig sind.

«Unser Modell wurde nur an wenigen neuen Fruchtexemplaren geprüft. Es ist nicht belegt, dass es bei allen Sorten, Lichtsituationen oder Kameras zuverlässig ist.»

**Ergänzte Frage in Reflexion 4:** «Welcher Teil hat unsere zwei Klassen unterscheiden gelernt?» Erwartung: das kleine Netz auf den festen MobileNet-Merkmalen, nicht MobileNet selbst. Gute Antworten nennen mögliche Abkürzungen: «Hintergrund oder Licht könnten mitgeholfen haben; ein Stresstest mit P2 an einem anderen Ort oder weitere neue Exemplare würden das prüfen.»

### Reflexion 5 – Fazit, Zusammenarbeit, nächster Versuch

«Die Ergebnisse sprechen im Beispiel für B, beweisen aber nicht, dass ausschliesslich die Datenvielfalt die Ursache war. Ein sinnvoller nächster Versuch wären mehr unabhängige Exemplare und mehrere vorab festgelegte Startwerte. Wir haben unseren Plan angepasst, die Aufgaben verteilt und die Datenquellen sowie eingesetzten KI-Hilfen dokumentiert.»

**Abgabe:** Journal, Notebook mit Ausgaben, Versuchsprotokoll, Fotostudio-JSON und Originaldateien in die ZIP-Sicherung übernehmen und über den Abgabekanal einreichen. Beide können Trainingsgruppen, eingefrorenes MobileNet, eigenes trainiertes Netz, Modellauswahl und Grenzen erklären.

### Fremdauswertung (Doppellektion 8)

Trainingsbilder T1/T2, Validierungsbilder V1 und die unabhängigen Testbilder P1/P2 des fremden Modells anhand konkreter Exemplare, Quellen und Originalresultate prüfen. Ein Nachlauf mit Startwert **11** liefert einen weiteren Beleg. Danach die eigenen, völlig anderen Bildklassen ausprobieren. **Ungelesene Testbilder derselben Klassen** sind erwünscht; **ganz andere Klassen** hat das Modell nie gelernt. Eine scheinbar gute Trennschärfe ist deshalb keine Klassifikationsgenauigkeit. Das fremde Modell hat überwacht nur die ursprünglichen zwei Klassen (seine Labels) gelernt; **eine Umbenennung seiner Ausgänge ist kein neues Training**. Entscheidend sind die begründete Prüfung und die Grenzen, nicht eine bestimmte Erfolgsquote.

## 9 · Sprachmodelle (Doppellektion 9)

### Papierexperiment, Papagei und Soekia

**Mögliche Beobachtung:** Vier sichtbare Wörter ergeben oft einen nachvollziehbareren Satz als zwei, aber selbst längerer Kontext verhindert Widersprüche nicht.

**Beispiel für eine problematische Fortsetzung (mit einer eigenen Kollektion am 6.11.2026 so beobachtet; die echten Texte der Lernenden gehören ins Protokoll):** Mit dem Trainingstext «Die Hauptstadt der Schweiz ist Zürich. Die Hauptstadt von Frankreich ist Paris. …» schreibt Soekia genau diese Aussagen. Das Modell gibt wieder, was in seinen Trainingstexten steht, und prüft nicht, ob es stimmt (die Bundesstadt ist Bern). Oder: «Eine Person ist zuerst 20 und später 80 Jahre alt.» Grammatik und Plausibilität beweisen keine Faktentreue.

**Grenzen des vereinfachten Papageis:** sehr kurzer Kontext; seltene oder ungesehene Wortfolgen sind kaum abgedeckt. Er zählt Häufigkeiten, während heutige neuronale Sprachmodelle die Vorhersage aus **gelernten Gewichten und vielen Schichten** berechnen und typischerweise mit **Tokens** arbeiten.

**Turing-Test:** Ein menschlich wirkender Chat ist kein Beweis für menschliches Denken oder Bewusstsein. Hinweise müssen aus dem tatsächlichen Gespräch stammen.

**Festhalten:** «Mehr Kontext kann Texte verständlicher machen, garantiert aber keine korrekten Tatsachen. Wichtige Behauptungen brauchen eine unabhängige Prüfung.» Dazu: «Ich prüfe KI-Aussagen, indem ich eine zweite, unabhängige Quelle suche und die Aussage mit eigenem Wissen oder Daten vergleiche; ein Sprachmodell prüft das nicht.»

## 10 · KI und Gesellschaft (Doppellektion 10)

### O'Neil, WMD und Video

Bei der Videoauswertung müssen **tatsächlich erwähnter Fall und Zeitmarke** eingetragen werden; diese Seite erfindet dafür keinen Beleg. Als eigenständiger Musterfall eignet sich eine algorithmische Kreditentscheidung.

Die drei Kriterien einer «Weapon of Math Destruction» nach **Cathy O'Neil** sind:

1. **Opacity:** Entscheidungen sind für Betroffene schwer nachvollziehbar oder anfechtbar.
2. **Scale:** Das Modell beeinflusst sehr viele Menschen.
3. **Damage:** Die Folgen schädigen Menschen konkret, etwa durch Kredit- oder Stellenausschluss.

Nicht jede ungenaue KI erfüllt automatisch alle drei Kriterien.

### Rückkopplung

«Ein Kreditmodell lehnt in einem Quartier häufig ab. Dadurch fehlen Finanzierungsmöglichkeiten. Spätere Daten spiegeln diese Verschlechterung wider. Das Modell nimmt dies als Bestätigung und lehnt erneut häufiger ab.»

**Verbesserung:** unabhängige Daten, Einspruchsmöglichkeit, Kontrollen und Tests auf diskriminierende Auswirkungen; den Effekt dieser Massnahmen überprüfen.

### Debatte und Schlussurteil

**Pro O'Neil:** Intransparente Modelle können bestehende Nachteile massenhaft verstärken. **Gegenargument:** Ein überprüftes Modell kann in manchen Situationen konsistenter sein als Menschen; Transparenz allein schützt nicht vor unfairen Daten.

**Zur These «Gleiche Regeln sind automatisch fair»:** «Nein, gleiche Regeln können Menschen bei historisch verzerrten Daten unterschiedlich treffen. Fairness braucht überprüfte Ziele, Daten, Einspruchswege und laufende Kontrollen.»

**Zielkonflikt:** Transparenz versus Datenschutz oder einheitliche Regeln versus Korrektur historischer Benachteiligung.

## Erwartungshorizont statt Musterwortlaut

Wichtiger als die genaue Formulierung sind **Fachrichtigkeit, selbst beobachtete Belege, alternative Erklärungen, Grenzen und nachvollziehbare Arbeitsprozesse**. Bewertet werden **18 gemeinsame Punkte** für die eigene Abgabe (K1–K6), **12 individuelle Punkte** im Fachgespräch (K7–K10) und **3 individuelle Punkte** für die Fremdreflexion (K12): zusammen **33 Punkte**. Der gemeinsame Daten-/Ergebnischeck K11 und der Versuch mit den eigenen Klassen sind unbenotet.
