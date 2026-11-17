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

### Schwache und starke KI

- **Schwache KI:** für bestimmte Aufgaben oder Aufgabenbereiche entwickelt; Beispiele sind Schachcomputer, Bilderkennung und heutige Chatbots. Viele Fähigkeiten bedeuten nicht automatisch allgemeine Intelligenz.
- **Starke KI:** hypothetische allgemeine, menschenähnliche Intelligenz; bisher kein allgemein anerkanntes nachgewiesenes Beispiel. Bewusstsein ist nicht mit allgemeiner Intelligenz gleichzusetzen und keine Voraussetzung dieser Einordnung.
- **Begründete Beispiele:** Ein regelbasierter Schachcomputer ist schwache KI ohne maschinelles Lernen; ein trainierter Spamfilter nutzt ML und ist ebenfalls schwache KI. Eine fiktionale Figur kann als starke KI gedacht sein, ohne dass dadurch ihre Existenz belegt wäre.

Die Begriffe «KI/ML/Deep Learning/generativ» beschreiben technische Verfahren beziehungsweise Aufgaben, «schwach/stark» den Grad allgemeiner Fähigkeiten. Sie sind keine austauschbaren Kategorien.

### Asimovs Gesetze: Fall «Schulweg»

**Argument 1:** Starkes Bremsen ist plausibel, aber bei jeder der drei beschriebenen Optionen droht Verletzung. Keine Möglichkeit ist eindeutig sicher.

**Argument 2:** Asimovs erstes Gesetz verbietet Schädigung, löst jedoch nicht den Konflikt, **wessen Schaden zu vermeiden ist**. Entwickler, Gesellschaft und Recht müssen Entscheidungen und Verantwortlichkeiten klären.

Eine andere gut begründete Wahl ist ebenfalls richtig. Bewertet werden zwei nachvollziehbare Argumente, nicht eine bestimmte Fahrtrichtung.

**Leitfrage** («Wann ist ein System intelligent, und worin unterscheiden sich feste Regeln vom Lernen aus Daten?»): «Ein System wirkt intelligent, wenn es eine Aufgabe löst, für die ein Mensch Intelligenz bräuchte, und mit Neuem zurechtkommt. Ein Getränkeautomat führt feste Regeln aus, während ein trainierter Spamfilter Modellparameter aus Beispielen anpasst. Es gibt dennoch auch regelbasierte KI; 'automatisch' ist nicht gleich 'KI'.» Wer sein Kriterium vom Anfang ändert oder präzisiert, hat die Frage gut genutzt.

## 1 · Lernarten (integriert; frühere DL 2 als Wahlvertiefung)

### EVA und Wissen

Beim **Spamfilter** ist die Eingabe eine E-Mail. Beim Training sieht das Modell Beispiele mit richtigen Labels und passt Parameter an. Diese Parameter bilden den «Erfahrungsschatz». Bei einer neuen E-Mail entsteht daraus eine Vorhersage; nicht jede Benutzung trainiert das Modell erneut.

**Wissensbasiert (Ratebaum auf Papier):** Fragen wie «Lebt es im Wasser?» oder «Hat es Federn?» schränken die Möglichkeiten ein. Ein Tier, das nicht im Baum steht, kann der Baum nicht erkennen; er endet ohne Ergebnis oder bei einem falschen Tier. Fragen und Reihenfolge sind hinterlegtes Wissen, das nur Menschen ändern.

**Akinator (Kontrastfall):** Er stellt ebenfalls Ja-Nein-Fragen, nutzt aber Erfahrungen früherer Spielender; bei mehrfach falschem Raten fragt er nach dem Namen der Figur und erweitert seine Datenbank. Er ist deshalb kein Beispiel für ein System, das nicht lernt. Wie er genau arbeitet, ist nicht öffentlich.

**Filmlandkarte:** Nahe Filme können Gemeinsamkeiten bei Genre oder Nutzerbewertungen haben. Beim Wechsel des Nutzers können sich prognostizierte Bewertungen ändern. **Konkrete Filmtitel und Beobachtungen müssen aus dem eigenen Versuch stammen.**

### Drei Lernarten – Memory und NIM

- **Überwachtes Lernen:** Beispiele mit korrektem Label, z. B. «das Bild zeigt eine Katze». Dieselbe Lernart begegnet den Lernenden später im Neuron (DL 3), im Ziffernnetz (DL 4) und im Bildprojekt.
- **Unüberwachtes Lernen:** Muster und Gruppen ohne vorgegebene Labels, z. B. nach Farbe oder Form.
- **Verstärkendes Lernen:** Rückmeldung über Erfolg/Misserfolg nach Handlungen; beim NIM-Spiel können erfolgreiche Züge verstärkt werden.

**Zuordnung:** richtige Antworten ↔ überwacht; Ähnlichkeiten ↔ unüberwacht; Belohnung ↔ verstärkend. Verschiedene plausible Gruppierungen sind beim unüberwachten Beispiel zulässig.

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

## DL 4–6 · Geführtes Bildprojekt: Erwartungshorizont

Die Projektmethodik entspricht der 4. Klasse: **Daten prüfen → A/B fair vergleichen → V1-Auswahl begründen → P1/P2 einmalig testen → Grenzen reflektieren**. In der 1. Klasse erhalten die Tandems vorbereitete Schritte und standardmässig synthetische Kreis-/Dreieck-Daten, die **keine** Aussage über neue echte Fotos erlauben. Eigene personenfreie Gegenstandsfotos sind freiwillig, nicht besser bewertet. Ein Buchstaben-Fine-Tuning ist nicht mehr Pflicht.

### DL 4 · Kurzer Ziffern-/Buchstabentest und Datenplan

Das Ziffernnetz liefert für A/B weiterhin eine Ziffer, weil seine Ausgaben nur 0–9 abdecken. Für neue Klassen benötigt es einen neuen trainierbaren Ausgabekopf. Beim folgenden Fotoprojekt verwendet MobileNet feste Merkmale, nur der kleine Kopf lernt mit Labels.

- **T1/T2:** Gewichte anhand der Klassenlabels lernen.
- **V1:** A und B auf denselben Bildern vergleichen und eine Variante auswählen.
- **P1/P2:** Erst nach der Auswahl einmal unabhängig prüfen, danach nicht optimieren.
- **Datenleck:** Derselbe Apfel aus zwei Perspektiven ist nicht plötzlich ein unabhängiges Testexemplar.

Musterreflexion 1: «Wir untersuchen, ob ein Modell mit vielfältigeren Trainingsbeispielen besser auf neuen Beispielen abschneidet. Wir nutzen die bereitgestellten Kreis-/Dreieck-Daten.» Musterreflexion 2: «V1 und P1/P2 bleiben getrennt; den Test schauen wir erst nach der Modellwahl an.» Bei freiwilligen Fotos gelten fünf Exemplare pro Klasse mit je acht Bildern (=80).

### DL 5 · Fairer A/B-Versuch mit unabhängiger Prüfung

**MobileNet V2 liefert 1280 Merkmale und bleibt eingefroren.** Ein kleiner Kopf mit 16 Neuronen lernt 60 Epochen mit Startwert 11. Modell A nutzt acht Bilder aus T1 je Klasse, B je vier aus T1/T2; alle übrigen Bedingungen bleiben gleich.

**Nur fiktive Rechenwerte, keine tatsächlich gemessenen Modellwerte:** A = 12/16 (75 %), B = 14/16 (87,5 %) auf V1; B wird **vor** der Testeinsicht begründet ausgewählt. Auf P1/P2 werden beispielsweise 26/32 (81,25 %) korrekt. Die Lernenden müssen die **eigenen** Notebookzahlen, drei tatsächliche Vorhersagen und eine plausible alternative Erklärung eintragen. Auch ohne beobachteten Fehler einen realistischen Grenzfall erklären, **keine Fehler erfinden**.

Musterreflexion 5: «Die Ergebnisse reichen nur für diese vorbereiteten Übungsdaten. Für echte Alltagsfotos müsste ein neues Experiment mit unabhängigen echten Fotos durchgeführt werden.» Die ZIP-Sicherung muss **eingereicht**, nicht nur heruntergeladen werden.

### DL 6 · Fachgespräch und vereinfachter Fremdcheck

Jede Person erklärt **Bild → feste Merkmale → trainierter Kopf → Label → Vorhersage**, die unveränderten Bedingungen im A/B-Vergleich, die Rolle von V1 und P1/P2 sowie mindestens einen tatsächlich belegten Ergebniswert. Ein fremdes Projekt wird parallel **unbenotet** auf Gruppen, Originalzahlen, Modellauswahl und eine Grenze geprüft. Ein vollständiger Modellnachlauf oder der Einsatz fremder Bildklassen ist nur freiwillig. Neue Testbilder derselben Klassen sind anders zu beurteilen als völlig andere Klassen, für die das Modell keinen passenden Ausgang gelernt hat.

**Bewertung:** 12 gemeinsame Projektpunkte und 18 individuelle Gesprächspunkte = **30 Punkte**. Der Fremdcheck gibt keinen Bonus. Selbstständige, sachlich korrekte Erklärungen sind wichtiger als hohe Trefferquoten.

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
