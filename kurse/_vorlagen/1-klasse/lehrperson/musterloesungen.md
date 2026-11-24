# Musterlösungen und Erwartungshorizont

**Für die Lehrperson.** Die Antworten sind Beispiele, keine einzig zulässigen Formulierungen. Bei eigenen Bildern, Lernstrecken und Notebook-Experimenten zählen tatsächliche Beobachtungen und Belege. **Illustrative Zahlen sind ausdrücklich keine gemessenen Ergebnisse.**

## 1 · Was ist KI? (Doppellektion 1)

### Regeln von Menschen oder Lernen aus Daten?

- **Getränkeautomat:** Feste Regeln (Guthaben vorhanden, Taste gewählt → Getränk ausgeben), kein Lernen.
- **Übersetzungsapp:** Nutzt heute üblicherweise ein anhand vieler Texte trainiertes Modell.
- **Ampel mit festem Zeitplan:** Befolgt Regeln und lernt nicht.
- **Gesichtserkennung:** Nutzt typischerweise gelernte Merkmale aus Beispieldaten.

Eine Katze lässt sich nicht durch wenige handprogrammierte Merkmale erkennen: Posen, Licht, Perspektiven, Hintergründe und Fellfarben variieren. **Nicht jedes automatische System ist KI, aber es gibt auch regelbasierte KI.**

### KI, ML, Deep Learning und generative KI

- **KI:** Oberbegriff, etwa auch für ein regelbasiertes Schachprogramm.
- **Maschinelles Lernen:** Lernparameter werden aus Daten bestimmt, z. B. Spamfilter.
- **Deep Learning:** Teilgebiet des ML mit mehrschichtigen neuronalen Netzen, etwa MobileNet.
- **Generative KI:** Erzeugt neue Inhalte; heutige Systeme nutzen dafür meist Deep Learning.

**Zusammenhang:** Deep Learning ist Teil von ML, ML Teil von KI. «Generativ» beschreibt die Aufgabe, nicht eine vierte gleichrangige technische Schublade. Historisch führen Meilensteine von symbolischen Programmen über Expertensysteme und datengetriebenes Lernen zu tiefen und grossen generativen Modellen.

**Zuordnungsaktivität DL 1 (spezifischste Kategorie):** Ampel mit festem Zeitplan = keine KI; regelbasiertes Schach-Suchprogramm = regelbasierte KI; Spamfilter mit gelerntem Entscheidungsbaum = maschinelles Lernen ohne Deep Learning; Bildklassifikator mit tiefem neuronalem Netz = Deep Learning; Text erzeugendes Sprachmodell = generative KI. Ein tiefes Sprachmodell gehört gleichzeitig zu Deep Learning, ML und KI; die Zuordnung ist deshalb nicht als gegenseitiger Ausschluss zu verstehen. Auf die **konkrete Systembeschreibung** kommt es an.

**Didaktik:** In der 1. Klasse sind vier plus fünf eindeutige Beispiele und eine kurze Reflexion vorgesehen. In der 4. Klasse begründen die Lernenden zusätzlich zwei Grenzfälle. Tastatur-/Touch-Auswahl ist gleichwertig mit Drag-and-drop. Die automatische Selbstkontrolle gibt erst nach vollständiger Einordnung Rückmeldung.

**Leitfrage** («Wann ist ein System intelligent, und worin unterscheiden sich feste Regeln vom Lernen aus Daten?»): «Ein System wirkt intelligent, wenn es eine Aufgabe löst, für die ein Mensch Intelligenz bräuchte, und mit Neuem zurechtkommt. Ein Getränkeautomat führt feste Regeln aus, während ein trainierter Spamfilter Modellparameter aus Beispielen anpasst. Es gibt dennoch auch regelbasierte KI; 'automatisch' ist nicht gleich 'KI'.» Wer sein Kriterium vom Anfang ändert oder präzisiert, hat die Frage gut genutzt.

## 1 · Drei Lernarten anhand von Links erkunden (Doppellektion 1)

Beim **überwachten Lernen** trainiert ein Modell mit Beispielen, zu denen die richtige Antwort (das Label) bekannt ist. **Im Smiley-Spiel** sind das «fröhlich» und «traurig»; das System wurde bereits mit Beispielen trainiert. Eine falsche Vorhersage zeigt, dass neue Zeichnungen von den Trainingsbeispielen abweichen können. Die SuS trainieren das Modell durch das Zeichnen nicht selbst.

Beim **unüberwachten Lernen** sucht das System Gruppen oder Muster ohne vorgegebene Klassenlabels. **K-Means** ordnet Punkte dem jeweils nahen Mittelpunkt zu und verschiebt diese Mittelpunkte in den folgenden Schritten. Die Gruppierung hängt auch von der Startkonfiguration ab.

Beim **verstärkenden Lernen** werden Handlungen anhand ihrer Folgen bewertet. **NIM** veranschaulicht, wie Gewinn oder Verlust und die daraus folgende Rückmeldung die Wahl späterer Züge beeinflussen können. Nicht behaupten, die KI habe sich verbessert, ohne eine beobachtete Veränderung zu beschreiben.

**Vergleich im Antwortfeld:** Smiley-Spiel → beschriftete Trainingsbeispiele (überwacht); K-Means → Ähnlichkeit ohne Zielklassen (unüberwacht); NIM → Rückmeldung zu Spielzügen (verstärkend). Entscheidend ist die Art der Information, die beim Lernen zur Verfügung steht.

## 2 · Perzeptron (Doppellektion 2)

### Wie entscheidet ein Neuron?

Es bildet die **gewichtete Summe plus Bias** und gibt ab Summe 0 die Ausgabe 1 aus, sonst 0. Gewichte verändern den Einfluss der Eingaben; der Bias verschiebt die Schwelle.

**Schwimmbadregel AND** (nur bei Sonne und Freund:innen, Prüfung = 0): Gewichte 1 und 1, Bias −1,5:

| Eingabe | Summe | Ausgabe |
|---|---:|---:|
| (0,0) | −1,5 | 0 |
| (0,1) | −0,5 | 0 |
| (1,0) | −0,5 | 0 |
| (1,1) | +0,5 | 1 |

### Was wird gelernt?

**Gewichte und Bias** werden beim überwachten Lernen anhand bekannter Trainingsziele (Labels) schrittweise korrigiert; die Grundrechnung und die Schwelle ändern sich nicht. Eine höhere Lernrate kann schneller korrigieren, aber auch überschiessen. Beobachtete Gewichtsänderungen müssen aus dem eigenen Notebook stammen.

## 3 · XOR und neuronale Netze (Doppellektion 3)

### Warum XOR ein einzelnes Neuron überfordert

**XOR als neue Schwimmbadregel** (genau eine der Bedingungen Sonne oder Freund:innen trifft zu, Prüfung = 0): Nur (0,1) und (1,0) ergeben 1, die beiden anderen Fälle 0. Eine einzige Gerade kann die Punkte nicht korrekt trennen. Deshalb scheitert ein einzelnes Perzeptron an XOR, egal welche Gewichte es lernt.

### Ein mehrschichtiges Netz berücksichtigt auch die Prüfung

Die Zwischenschicht berechnet **OR** und **NAND** aus Sonne und Freund:innen sowie **«Keine Prüfung»** aus P (Gewicht −1, Bias +0,5). Alle drei Werte gehen mit Gewicht +1 zum Ausgabeneuron (Bias −2,5). Nur drei Einsen ergeben **Ja**:

| Sonne | Freund:innen | Prüfung | OR | NAND | Keine Prüfung | Schwimmen? |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

**Vergleich:** Bei Sonne = 1 und Freund:innen = 0 liefern OR und NAND beide 1. Ohne Prüfung (P = 0) gilt «Keine Prüfung» = 1, somit 1 + 1 + 1 − 2,5 = +0,5 → **Ja**. Mit Prüfung (P = 1) ist der dritte Zwischenwert 0: 1 + 1 + 0 − 2,5 = −0,5 → **Nein**. Das Notebook trainiert nur die vier XOR-Fälle bei P = 0; das zusätzliche «Keine Prüfung»-Neuron ist eine von uns festgelegte Erweiterung.

Mit einer Zwischenschicht sind auch nichtlinear trennbare Muster möglich. Beim selbst trainierten Netz variiert das Ergebnis unter Umständen mit dem Startwert.

### Ziffernerkennung

Ein handgeschriebenes Ziffernbild hat **64 Pixelwerte** (8 × 8), die versteckte Schicht **16 Neuronen** und der Ausgang **10 Werte** für 0 bis 9. Der höchste Wert bestimmt die Vorhersage, garantiert aber keine Korrektheit. Eine echte Verwechslung muss anhand des gezeigten Bilds erläutert werden. Das Netz lernt überwacht: Zu jedem der 1257 Trainingsbilder ist die richtige Ziffer als Label bekannt, und das Netz vergleicht seine Vorhersage damit. Nur die Ausgabe wird mit dem Label verglichen; die versteckten Neuronen bekommen keine eigenen Labels. Auch die 540 Prüfbilder haben Labels, das Netz lernt aber nicht an ihnen.

### Brücke zum Bildprojekt

«Im Bildprojekt arbeitet ein Netz wie hier, aber mit 1280 statt 2 Eingaben. Die Zahlen berechnet MobileNet, ein fertiges Netz, das sich nicht verändert. Nur das kleine Netz dahinter lernt unsere zwei Klassen, wieder überwacht: vorhersagen, Fehler gegen das Label bewerten, Gewichte anpassen.» Entscheidend ist die Trennung zwischen **fest** (MobileNet) und **lernend** (kleines Netz).

## DL 4–6 · Geführtes Tandemprojekt: Erwartungshorizont

Alle Zahlen sind fiktive Beispiele; im Unterricht müssen eigene Messwerte verwendet werden.

### DL 4 · Datenregeln und Planung

Ein Ziffernnetz hat keine Buchstaben-Ausgabe. Training passt Gewichte an, V1 dient der Auswahl, P1/P2 dem unabhängigen Abschlusstest. Dasselbe Exemplar in T1 und P1 wäre ein Datenleck; beim Daten-Notebook ist der Wert mit Kopien daher zu optimistisch.

Reflexion 1: «Wir unterscheiden Äpfel und Birnen für eine Sortierhilfe. B könnte besser sein, weil es mehr verschiedene Exemplare kennt.»

Reflexion 2: Je Gruppe ein anderer Apfel und eine andere Birne, je acht Fotos (80 insgesamt). Eigene Fotos bei ähnlichem Licht und Hintergrund. Mögliche Grenze: alle Äpfel sind rot, alle Birnen grün.

### DL 5 · A/B, Test und Fazit

MobileNet bleibt unverändert und liefert Merkmale; nur das kleine Netz lernt anhand der Labels. Beide Varianten erhalten gleich viele Bilder, dieselben Einstellungen und dieselbe Validierung. Nur die Vielfalt der Exemplare unterscheidet sich.

Reflexion 3: A 11/16, B 14/16 auf V1. Wir wählen B vor Testeinsicht. Das Ergebnis ist eine Beobachtung, kein allgemeiner Beweis.

Reflexion 4: B 26/32 auf P1/P2. Ein Apfel wird richtig erkannt, eine Birne als Apfel ausgegeben. Hintergrund oder Farbe könnten eine Rolle spielen. P1/P2 wurden vorher nicht zur Auswahl genutzt.

Reflexion 5: B war hier besser; nächstes Mal mehr unabhängige Exemplare bei vergleichbaren Bedingungen prüfen.

### DL 6 · Fachgespräch und Fremdmodell

Leitfragen: Was lernt? Warum ist der Vergleich fair? Was zeigen V1 und P1/P2? Was bedeuten die eigenen Vorhersagen und Grenzen?

Beispiel: Das fremde Modell kennt Gabel und Löffel. T1/T2, V1 und P1/P2 enthalten unterschiedliche Exemplare; V1 A 11/16, B 13/16; Wahl B, Test 25/32. Ursprüngliches Modell mit Startwert 11 wiederherstellen, nicht neu auswählen. Es gibt bei Äpfeln und Birnen weiterhin nur Gabel oder Löffel aus. Auch eine gute Trennung der neuen Klassen belegt keine richtige Erkennung. Je eine persönliche Antwort mit konkreter Beobachtung und Erklärung genügt. Fremdauswertung unbenotet.

## 7 · Sprachmodelle (Doppellektion 7)

### Papierexperiment, Papagei und Soekia

**Mögliche Beobachtung:** Vier sichtbare Wörter ergeben oft einen nachvollziehbareren Satz als zwei, aber selbst längerer Kontext verhindert Widersprüche nicht.

**Beispiel für eine problematische Fortsetzung, nicht als echtes Soekia-Ergebnis ausgeben:** «Eine Person ist zuerst 20 und später 80 Jahre alt.» Grammatik und Plausibilität beweisen keine Faktentreue. Die echten Texte aus den Versuchen sind im Protokoll zu dokumentieren.

**Grenzen des vereinfachten Papageis:** sehr kurzer Kontext; seltene oder ungesehene Wortfolgen sind kaum abgedeckt. Er zählt Häufigkeiten, während heutige neuronale Sprachmodelle die Vorhersage aus **gelernten Gewichten und vielen Schichten** berechnen und typischerweise mit **Tokens** arbeiten.

**Turing-Test:** Ein menschlich wirkender Chat ist kein Beweis für menschliches Denken oder Bewusstsein. Hinweise müssen aus dem tatsächlichen Gespräch stammen.

**Festhalten:** «Mehr Kontext kann Texte verständlicher machen, garantiert aber keine korrekten Tatsachen. Wichtige Behauptungen brauchen eine unabhängige Prüfung.»

## 8 · KI und Gesellschaft (Doppellektion 8)

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

Wichtiger als der genaue Wortlaut sind **Fachrichtigkeit, eigene Belege, alternative Erklärungen und ehrliche Grenzen**. Die 1. Klasse erhält maximal **30 Punkte** (12 gemeinsam, 18 individuell); die Fremdmodellprüfung ist unbenotet.
