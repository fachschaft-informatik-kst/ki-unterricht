# 4. Klasse · Feldgenaue Musterlösungen

**Nur für Lehrpersonen.** Zu jedem in der Kursseite gespeicherten Antwortfeld steht unten eine mögliche Antwort. Die Kennung in der linken Spalte ist die technische Journal-/Antwortkennung und erleichtert den Abgleich mit ZIP-Dateien. **Alle Zahlen, Namen, Filmfortsetzungen und Beobachtungen ohne Originalnachweis sind frei erfundene didaktische Beispiele**, keine tatsächlich ausgeführten Notebooks und keine echten Projektmessungen. Bei offenen Fragen gelten andere fachlich begründete Antworten ebenso. Bei Videoaufgaben müssen Lernende den tatsächlichen Film und die echte Zeitmarke belegen. Versteckte Alt-Felder und optionale Übungen sind nur der Vollständigkeit halber dokumentiert.

## DL 1 · KI, Beispiele und Grenzfälle

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `dl1_regeln_automat` | Regelbasiert: Ein fest programmiertes Guthaben und ein Knopfdruck steuern die Ausgabe; keine Anpassung aus Daten. |
| `dl1_regeln_uebersetzung` | Lernt aus Daten: Das beschriebene Übersetzungsmodell wurde mit Satzpaaren trainiert. |
| `dl1_regeln_ampel` | Regelbasiert: Sie wiederholt einen festen Zeitplan und lernt nicht. |
| `dl1_regeln_gesicht` | Lernt aus Daten: Das Bildmodell wurde anhand von Beispielen trainiert. |
| `dl1_begriffe_ampel` | Keine KI. |
| `dl1_begriffe_schach` | Regelbasierte KI. |
| `dl1_begriffe_spam` | Maschinelles Lernen (hier ausdrücklich ohne tiefes Netz). |
| `dl1_begriffe_bilder` | Deep Learning. |
| `dl1_begriffe_text` | Generative KI. |
| `regeln_oder_daten` | Auch ein einfaches Programm arbeitet automatisch, ohne zu lernen oder komplexe Entscheidungen zu treffen: eine Zeitschaltuhr befolgt nur feste Regeln. Automatisierung allein ist kein Beleg für KI. |
| `begriff_bsp_1` | Spamfilter mit gelerntem Entscheidungsbaum – maschinelles Lernen. |
| `begriff_bsp_2` | Handgeschriebene Ziffern erkennen mit tiefem Netz – Deep Learning. |
| `begriff_bsp_3` | Schachprogramm mit Suchbaum – regelbasierte KI. |
| `begriff_bsp_4` | Sprachmodell, das einen Text verfasst – generative KI. |
| `ki_zeitstrahl` | Frühe symbolische Systeme nutzten handformulierte Regeln; tiefe neuronale Netze lernen viele Merkmale aus Beispieldaten. Regeln bleiben etwa bei Sicherheitsprüfungen wichtig. Die Meilensteine zeigen keinen vollständigen Ersatz von Regeln durch Lernen. |
| `ki_ordnung` | 1. Regelbasiertes Schachprogramm: Regeln, regelbasierte KI, schwache KI. 2. Bilderkennung: aus Bilddaten trainiertes tiefes Netz, Deep Learning, schwache KI. 3. Allgemein intelligente Filmfigur: hypothetische starke KI, ihre technische Umsetzung ist unbekannt. Ein Chatbot kann sprachlich überzeugend wirken, ohne verlässlich allgemeine Aufgaben lösen zu können. |
| `typ_bsp_1` | Früheres optionales Feld: regelbasiertes Schachprogramm. |
| `typ_1` | Frühere Kategorie: regelbasierte KI. |
| `typ_bsp_2` | Früheres optionales Feld: trainierter Spamfilter. |
| `typ_2` | Frühere Kategorie: maschinelles Lernen. |
| `typ_bsp_3` | Früheres optionales Feld: Tierbildklassifikator. |
| `typ_3` | Frühere Kategorie: Deep Learning. |
| `typ_bsp_4` | Früheres optionales Feld: textgenerierendes Sprachmodell. |
| `typ_4` | Frühere Kategorie: generative KI. |
| `gesetze` | 1. Bremsen kann Verletzungen vermindern, doch ein Restschaden ist nicht vermeidbar. 2. Asimovs erstes Gesetz entscheidet nicht, wessen Risiko bei konfligierenden Optionen Vorrang haben soll; dafür braucht es Verantwortung, Regeln und gesellschaftliche Abwägung. |
| `begriffe_saetze` | KI ist der Oberbegriff für Systeme, die Aufgaben intelligent bearbeiten. Maschinelles Lernen bestimmt Muster aus Beispieldaten. Deep Learning ist ML mit mehrschichtigen neuronalen Netzen. Generative KI erzeugt neue Inhalte, zum Beispiel Texte. |
| `begriffe` | Kriterium (Beispiel): Ein System ist intelligent, wenn es eine Aufgabe löst, für die ein Mensch Intelligenz einsetzen müsste, und mit Neuem zurechtkommt. Eine zeitgesteuerte Ampel führt feste Regeln aus und lernt nicht, sie ist keine KI. Ein Schachprogramm mit festen Regeln kann regelbasierte KI sein, lernt aber nicht aus Daten; ein Spamfilter mit gelerntem Entscheidungsbaum passt sein Modell anhand von Beispielen an. Nicht jedes automatisch arbeitende Programm ist also eine KI. Offen bleibt, wie man bei Grenzfällen KI sinnvoll abgrenzt. |

## DL 2 · Lernen aus Daten

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `eva_erklaerung` | Spamfilter: Eingabe neue E-Mail; Erfahrungsschatz gelernte Parameter aus beschrifteten Trainingsmails; Ausgabe Spam oder kein Spam. Eine einzelne Benutzung ändert die Parameter nicht automatisch. Das Schachprogramm folgt hier festen Suchregeln. |
| `wissen_fragen` | «Ist die Figur erfunden?» → ja → «Kommt sie in einem Film vor?» → ja → «Hat sie besondere Kräfte?»; jede Antwort schränkt die Kandidaten ein. |
| `wissen_unbekannt` | Das System kann die Figur verfehlen oder nach einer neuen Figur fragen; daraus allein lässt sich nicht schliessen, ob es später selbst lernt. |
| `wissen_regeln` | Entwickler haben Fragekatalog und Entscheidungslogik vorgegeben. Das reine Fragenstellen belegt kein selbstständiges Lernen. |
| `lernend_nachbarn` | In meinem Beispiel lagen mehrere ähnliche Animationsfilme nahe beieinander; Gemeinsamkeiten waren Genre und ähnliche Bewertungsmuster. Tatsächliche Filmtitel aus dem eigenen Versuch einsetzen. |
| `lernend_aendert` | Bei Genre werden Genregruppen sichtbar; bei vorhergesagter Bewertung ändern sich die Farben je Nutzer. Ein anderer User Index kann andere Prognosen ergeben. |
| `lernend_daten` | Vermutlich aus Filmmerkmalen, Nutzendenbewertungen und ihren Mustern; die genaue Implementierung bleibt ohne Dokumentation offen. |
| `memory-supervised` | Mit gelabelten Beispielen werden Regeln für die beiden Klassen gelernt. Bei ähnlichen Bildern kann das Modell auch falsch zuordnen; das am eigenen Versuch prüfen. |
| `memory-unsupervised` | Ohne Labels lassen sich beispielsweise Karten nach Farbe oder Form clustern. Je nach Merkmal sind mehrere sinnvolle Gruppierungen möglich. |
| `memory-reinforcement` | Beim NIM-Spiel wird eine erfolgreiche Zugfolge belohnt bzw. die Rückmeldung verstärkt künftige Entscheidungen; das ist verstärkendes Lernen. |
| `memory` | Überwacht: Lernen mit richtigen Labels. Unüberwacht: ähnliche Fälle gruppieren. Verstärkend: Belohnung nach Handlungen. NIM ist verstärkend, das Bildprojekt nutzt überwachtes Lernen. |
| `lernart_sicherung` | Beispiel: Ein Musikdienst empfiehlt Lieder. Lernsignal: Rückmeldung (angehört, übersprungen, «Gefällt mir») oder Ähnlichkeit (Menschen mit ähnlichem Geschmack). Erkennbar daran, dass die Empfehlung aus früheren Daten entsteht und nicht aus einer festgelegten Regel. Labels nur, wenn die Lieder vorher beschriftet wurden. Mehrere Antworten sind richtig, wenn das Lernsignal begründet ist; bewertet wird die Begründung, nicht der Name der Lernart. |

## DL 3 · Neuron und Protokoll

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `neuron_wozu` | Positive Gewichte für Sonne und Freund:innen erhöhen die Schwimmneigung, das negative Prüfungsgewicht senkt sie; Bias legt die Schwelle fest. Bei Prüfungsgewicht 0 hätte die Prüfung keinen Einfluss mehr. |
| `neuron_gelernt` | Beim überwachten Lernen werden Gewichte und Bias geändert, nicht die Grundform der Rechnung. Im AND-Versuch ist die Zielausgabe (1,1) → 1, sonst 0. |
| `sw_gs` | +2 |
| `sw_gf` | +2 |
| `sw_gp` | −1 |
| `sw_bias` | −1 |
| `sw_treffer` | 5 von 8 (Startwerte; die Regel «nie vor einer Prüfung» wird teils verletzt). |
| `sw2_gs` | +2 |
| `sw2_gf` | +2 |
| `sw2_gp` | −4 |
| `sw2_bias` | −1 |
| `sw2_gefunden` | Ja, 8 von 8; auch andere Gewichtskombinationen sind möglich. |
| `hand_and_w1` | 1 |
| `hand_and_w2` | 1 |
| `hand_and_b` | −1,5 |
| `hand_and_ok` | Ja, 4 von 4. |
| `hand_or_w1` | 1 |
| `hand_or_w2` | 1 |
| `hand_or_b` | −0,5 |
| `hand_or_ok` | Ja, 4 von 4. |
| `hand_nand_w1` | −1 |
| `hand_nand_w2` | −1 |
| `hand_nand_b` | 1,5 |
| `hand_nand_ok` | Ja, 4 von 4. |
| `lr_005` | Beispielwert für NOR (Start 0,2/0,2/−0,5): 18 Runden bis alle vier Zeilen stimmen (Runde ohne Korrektur mitgezählt, sonst 17); echte Notebook-Ausgabe prüfen. |
| `lr_02` | Beispielwert für NOR: 7 Runden (sonst 6); echte Notebook-Ausgabe prüfen. |
| `lr_05` | Beispielwert für NOR: 4 Runden (sonst 3); echte Notebook-Ausgabe prüfen. |
| `lr_10` | Beispielwert für NOR: 4 Runden (sonst 3); echte Notebook-Ausgabe prüfen. |
| `lr_beob` | Eine sehr kleine Lernrate verändert die Parameter langsamer, hier braucht sie viele Runden; mittlere und grosse Lernraten führen schneller ans Ziel. Aus einem Lauf allein lässt sich keine grundsätzlich beste Lernrate bestimmen. |
| `iris_richtig` | Beispielwert: 27 von 30; echte Notebook-Ausgabe übernehmen. |
| `iris_gewicht` | Abhängig vom trainierten Versuch; das Merkmal mit dem grösseren Betrag des gelernten Gewichts eintragen und die Ausgabe nennen. |
| `perzeptron` | Beim Fehler Ziel 1, Vorhersage 0 werden bei aktiven Eingaben die Gewichte erhöht; bei Ziel 0, Vorhersage 1 gesenkt. Das Modell speichert Gelerntes in Gewichten und Bias. |

## DL 4 · XOR und Ziffern

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `hand_xor_max` | Höchstens 3 von 4 Fällen; keine einzelne Gerade trennt alle XOR-Eingaben. |
| `xor_warum` | Geometrisch: Die beiden 1-Punkte (0,1) und (1,0) liegen diagonal gegenüber der beiden 0-Punkte (0,0) und (1,1); keine einzelne Gerade trennt sie. Rechnerisch: Die Bedingungen b < 0, w₂ + b ≥ 0, w₁ + b ≥ 0 und w₁ + w₂ + b < 0 widersprechen sich. Die Lernrate verändert nur die Schritte, nicht die Modellgrenze. |
| `netze_zwischenschicht` | Für (1,0) liefert ODER = 1 und NAND = 1; das nachfolgende UND gibt 1. Die Zwischenschicht erzeugt Merkmale, die gemeinsam XOR lösen. |
| `xornetz_1` | Beispiel: 3 von 4; der konkrete Notebooklauf zählt. |
| `xornetz_2` | Beispiel: 4 von 4; der konkrete Notebooklauf zählt. |
| `xornetz_4` | Beispiel: 4 von 4; der konkrete Notebooklauf zählt. |
| `xornetz_start` | Nein; das Ergebnis kann mit anderen Startwerten variieren. |
| `xornetz_beob` | Beispielsweise genügten 2 versteckte Neuronen bei einem Startwert; bei einem anderen scheiterte das Training. Ergebnisse nur als Beobachtung eines konkreten Laufs deuten. |
| `netze` | Ein einzelnes Neuron hat nur eine lineare Grenze; die XOR-Punkte liegen diagonal. Eine Zwischenschicht kombiniert mehrere Teilentscheidungen, etwa OR und NAND; der Ausgang verbindet beide mit AND. Für (1,1): OR = 1, NAND = 0, AND(1, 0) = 0, also XOR = 0. |
| `projekt_bereit_check` | Brücke: MobileNet bleibt fest und liefert 1280 Zahlen je Foto; nur das kleine Netz lernt (Gewichte und Bias), Eingaben und Ausgabeklassen bleiben. Vorschau (Raten erlaubt): Die Testbilder müssen bis zum Schluss ungeöffnet bleiben, sonst sind sie keine neuen Daten. Das wird in DL 5 genau geklärt. Offene Frage zum Beispiel: Wie erkennt man ein Datenleck bei fast gleichen Bildern? |
| `zif_2` | Beispiel: 55 %; Notebookwert einsetzen. |
| `zif_4` | Beispiel: 69 %; Notebookwert einsetzen. |
| `zif_8` | Beispiel: 77 %; Notebookwert einsetzen. |
| `zif_16` | Beispiel: 88 %; Notebookwert einsetzen. |
| `zif_32` | Beispiel: 91 %; Notebookwert einsetzen. |
| `zif_brauchbar` | In diesem frei erfundenen Zahlenbeispiel 16 Neuronen (erstmals mindestens 80 %); im eigenen Lauf kann die Grenze anders liegen. |
| `zif_verw_a` | Beispiel: tatsächliche Ziffer 8. |
| `zif_verw_b` | Beispiel: vorhergesagte Ziffer 3. |
| `zif_beob` | Die handschriftliche 8 könnte wegen einer offenen Schlaufe ähnlich wie eine 3 wirken. Nur auf eine tatsächlich angezeigte Verwechslung beziehen. |
| `netze_ziffern` | Das 8×8-Bild liefert 64 Eingaben, die verborgene Schicht umfasst z. B. 16 Neuronen, der Ausgang 10 Ziffern. Gewichte wurden aus Trainingsbeispielen gelernt; unbekannte Testbilder prüfen die Übertragung. |

## DL 5–8 · Datenlernen, eigenes Tandemjournal und Fremdprüfung

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `projekt_datencheck` | 1. V1 für den A/B-Vergleich. 2. P1 und P2 für den unabhängigen Abschlusstest nach der Wahl. 3. Nein: Dieselbe Person in T2 und P2 wäre ein Datenleck; neue Personen verwenden. |
| `names` | Beispiel: Mia Muster · Luca Beispiel (fiktive Namen). |
| `class` | Beispiel: 4a · Apfel oder Birne? |
| `purpose` | Wir unterscheiden Äpfel und Birnen auf Fotos. Nützlich etwa als Demonstration einer Sortierhilfe; bei ungewöhnlichen Sorten kann sie irren. |
| `hypothesis` | Wir vermuten, dass B mit zwei Fruchtexemplaren je Klasse besser generalisiert. DL5: Datenplan, Abnahme der Exemplarliste, erste Fotos; DL6: Import und A/B; DL7: Auswertung, Test, ZIP. Mia sammelt und dokumentiert, Luca prüft Daten/Notebook; beide kontrollieren gemeinsam. Reserve für fehlerhafte Aufnahmen. |
| `groups` | Apfel/Birne je 8 Fotos: T1 Apfel A1/Birne B1; T2 A2/B2; V1 A3/B3; P1 A4/B4; P2 A5/B5. Insgesamt 2×5×8=80 Bilder: 32 Trainingspool, 16 V1, 32 P1/P2; kein Exemplar doppelt in zwei Gruppen. |
| `sources` | 80 selbst fotografierte Fotos mit Zustimmung der Eigentümer. Je 8 Ansichten pro Frucht, vergleichbares Licht, gleicher Tisch und wechselnde Perspektiven. Pro Gruppe anderes Fruchtexemplar; Bildnamen und Quellen in der JSON vermerkt. |
| `data_limits` | Nur fünf Exemplare je Klasse, möglicherweise ähnlicher Hintergrund oder ähnliche Sorten. Das Netz kann Farbe oder Beleuchtung statt Fruchtform nutzen. |
| `comparison` | REINES ZAHLENBEISPIEL: A 11 von 16 (68,75 %), B 14 von 16 (87,5 %) auf V1; Unterschied 3 Bilder. Ein V1-Bild der Birne B3 wurde von A als Apfel und von B als Birne vorhergesagt. Gleich blieben Bildzahl, Netz, Epochen, Startwert und V1; sonst wäre unklar, ob die Vielfalt oder etwas anderes den Unterschied macht. V1 ist nur ein Exemplar je Klasse: Licht, Zufall oder genau diese Exemplare können die Differenz ebenfalls erklären. |
| `selection` | Vor Einsicht in P1/P2 wählen wir B wegen 14 statt 11 korrekten V1-Bildern (3 Bilder Unterschied, mehr als die Faustregel von zwei). Das beweist nicht, dass B bei beliebigen Früchten besser ist; V1 hat nur ein Exemplar je Klasse, und Zufall bleibt eine andere Erklärung. Bei Gleichstand oder höchstens zwei Bildern Unterschied: Wir wählen B, weil B die beiden Grenzbilder im Einzelfall richtig vorhersagt; der V1-Wert allein unterscheidet die Varianten nicht. |
| `test` | Erst nach dokumentierter Wahl TEST_FREIGEBEN = True; REINES ZAHLENBEISPIEL: B 26 von 32 Testbildern richtig = 81,25 % (P1 und P2 zusammen). P1/P2 erst jetzt, weil ein Test, der die Auswahl beeinflusst hätte, kein unabhängiger Test mehr wäre. Keine Änderung am Modell nach dem Test. |
| `examples` | REINE BEISPIELE: P1/Apfel A4 Bild 02: Apfel → Apfel (richtig); P1/Birne B4 Bild 05: Birne → Apfel (Fehler); P2/Birne B5 Bild 07: Birne → Birne (richtig). Tatsächliche Bild-IDs und Ausgaben ersetzen. |
| `limits` | Hilfreich als Lernbeispiel bei bekannten Früchtearten; nicht verlässlich für beliebige Sorten, schlechte Beleuchtung oder verdeckte Objekte. Eine einzelne Teststichprobe ersetzt keine breit angelegte Prüfung. Unterschieden hat das kleine Netz auf den festen MobileNet-Merkmalen, nicht MobileNet selbst. Hintergrund oder Licht könnten mitgeholfen haben; ein Stresstest mit P2 an einem anderen Ort oder weitere neue Exemplare würden das prüfen. |
| `conclusion` | Im Beispiel spricht V1 für die vielfältigere Trainingsauswahl B, doch der Test beweist keine allgemeine Regel. Nächster Versuch: mehr unabhängige Exemplare und mehrere vorab festgelegte Startwerte, ohne P1/P2 nachträglich zum Optimieren zu benutzen. |
| `contribution` | Mia und Luca wechseln die Rollen: In DL5 sammelt Mia Fotos und Quellenliste, Luca prüft Daten; in DL6 importiert Luca und Mia prüft den Vergleich; in DL7 schreiben beide Reflexion 4–5 und erklären sich gegenseitig das Projekt. Wir mussten zwei unscharfe Fotos neu aufnehmen und eine halbe Etappe verschieben. |
| `ki_nutzung` | Kursnotebook und Glossar als Nachschlagehilfe; eine KI nur, um zwei Sätze der Zusammenfassung sprachlich zu glätten. Alle Zahlen, Beobachtungen und Deutungen stammen aus unserem Versuch; keine generierten Messergebnisse übernommen. |
| `reproduktion` | FREMDES TANDEM – Gabel/Löffel (andere Klassen als unsere Äpfel/Birnen). 1 T1/T2: Klassen Gabel/Löffel; je Gruppe andere Exemplare, 8 Bilder je Klasse und Gruppe, 80 insgesamt. 2 V1: anderes Exemplar als T1/T2. 3 P1/P2: andere Exemplare als T1/T2 und V1; auf möglichen gleichen Tischhintergrund achten; P1/P2 gehört nicht ins Training, sonst wäre das Testresultat kein unabhängiger Test. 4 Originalbeispiel A auf V1 11/16, B 13/16, Wahl B vor dem Test; Nachlauf mit Startwert 11: B 13/16. 5 Originaltest P1/P2 25/32, Nachlauf 25/32. Rückfragen: Sind Beleuchtung und Abstand beider Klassen vergleichbar? Der V1-Unterschied beträgt nur 2 Bilder (nach der Faustregel kein Beleg): Mit welchem Argument wurde B gewählt? Alle Zahlen illustrativ, keine fremden Originalwerte. |
| `fremd_erwartung` | «Es rät nur» oder «teilweise» – Vermutung vor dem Versuch; jede begründete Erwartung zulässig. |
| `fremd_c_1` | 23 (eigene Apfel-Fotos vom fremden Modell als Gabel klassifiziert, Beispiel). |
| `fremd_c_2` | 17 (eigene Apfel-Fotos als Löffel, Beispiel). |
| `fremd_d_1` | 19 (eigene Birnen-Fotos als Gabel, Beispiel). |
| `fremd_d_2` | 21 (eigene Birnen-Fotos als Löffel, Beispiel). |
| `fremd_trenn` | 55 % = (23 + 21) / 80 bei der besseren Zuordnung; ausdrücklich KEINE Trefferquote für Apfel/Birne. |
| `fremd_wert` | Beispiel: 64 % mittlerer Modellwert; in der Realität Notebookwert einsetzen. |
| `fremd_zuordnung` | C (Apfel) → ursprüngliche Klasse 1 Gabel; D (Birne) → ursprüngliche Klasse 2 Löffel. Nur eine rechnerische Ausgabenzuordnung, keine neue Klassifikation. |
| `fremd_trennt` | Unklar; Form, Farbe, Hintergrund und Beleuchtung sind Hypothesen. |
| `fremd_warum` | Beispiel: Ein heller Apfel wurde als Löffel ausgegeben. Vermutung: heller Hintergrund; Test: dieselbe Frucht bei konstantem Motiv vor zwei Hintergründen fotografieren, ohne das Modell neu zu trainieren. |
| `fremd_grenze` | P1/P2 enthält neue Exemplare der gelernten Klassen Gabel/Löffel und erlaubt dafür eine Trefferquote. Äpfel/Birnen kommen in den trainierten Ausgaben nicht vor; 55 % Trennschärfe und 64 % Modellwert belegen keine richtige Apfel-/Birnenerkennung. |
| `fremd_rueckmeldung` | Die fünf Gruppen enthalten im Beispiel voneinander unabhängige Gabeln/Löffel; bei P1/P2 fällt jedoch der gleiche helle Hintergrund auf. Prüft als Nächstes neue Gegenstände vor wechselnden Hintergründen, um Hintergrundeffekte abzuschätzen. |
| `fremd_name_1` | Mia Muster (fiktiv). |
| `fremd_reflexion_1_test` | Beim fremden Gabel/Löffel-Modell wurden P1/P2 beispielhaft zu 25/32 korrekt erkannt; mit unseren Äpfeln/Birnen ergab sich eine Trennschärfe von 55 %, aber keine Apfel-/Birnen-Trefferquote. |
| `fremd_reflexion_1_grenzen` | Neue Gabeln/Löffel auf P1/P2 testen die Generalisierung derselben gelernten Klassen. Bei Apfel/Birne erzwingt das Modell Gabel oder Löffel. Möglicher Einfluss: Hintergrund. Folgetest: dieselbe Frucht vor zwei Hintergründen, Modell unverändert. |
| `fremd_reflexion_1_repro` | Optional: Original V1/B 13/16 und P1/P2 25/32; eigener Nachlauf mit gleichem Startwert ebenfalls 13/16 und 25/32 (nur Beispiel). |
| `fremd_reflexion_1_transfer` | Optional: Kontrolliertes Gegenlicht bei beiden ursprünglichen Klassen Gabel/Löffel mit neuen Exemplaren erproben. |
| `fremd_name_2` | Luca Beispiel (fiktiv). |
| `fremd_reflexion_2_test` | Der Originaltest auf ungesehenen Gabeln/Löffeln hatte im Beispiel 25/32 richtige Ergebnisse. Für Äpfel/Birnen lieferte das fremde Netz 23/17 bzw. 19/21 Vorhersagen; es kennt diese Klassen nicht. |
| `fremd_reflexion_2_grenzen` | P1/P2 ist ein unabhängiger Test für Gabel/Löffel; bei Äpfeln/Birnen gibt es kein korrektes Label unter den Ausgaben. Die Trennung kann durch Farben oder Licht entstehen. Folgetest: gleiche Objekte mit kontrolliert wechselnder Beleuchtung fotografieren. |
| `fremd_reflexion_2_repro` | Optional: Nachlauf mit Startwert 11 reproduziert beispielsweise die V1-Wahl B und 25/32 im Test; bei Abweichungen exakte Zahlen notieren. |
| `fremd_reflexion_2_transfer` | Optional: Beide ursprünglichen Klassen auf einer zweiten Kamera mit neuen Exemplaren testen. |

## DL 9 · Sprachmodelle

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `pap_text_a` | Erfundenes Protokoll: «Der kleine Hund rennt und der …» – ab hier wird es widersprüchlich. |
| `pap_text_b` | Erfundenes Protokoll: «Der kleine Hund rennt durch den Garten und …» – der Sinn bleibt länger erkennbar. |
| `pap_besser` | Im Beispiel Text B; tatsächliche Notebookausgabe entscheidet. |
| `pap_bruch_a` | Beispiel: nach 5 Wörtern. |
| `pap_bruch_b` | Beispiel: nach 9 Wörtern. |
| `pap_kontext` | Mit mehr sichtbarem Kontext können Fortsetzungen passender wirken; sie sind nicht automatisch wahr. |
| `pst_1_anfang` | Beispiel: «Der Mond besteht aus». |
| `pst_1_kontext` | 2 Wörter (Beispiel). |
| `pst_1_wort` | «Käse» (fiktive Vorhersage). |
| `pst_1_plausibel` | Nein. |
| `pst_1_wahr` | Nein. |
| `pst_2_anfang` | Beispiel: «Die Schweiz hat die Hauptstadt». |
| `pst_2_kontext` | 4 Wörter (Beispiel). |
| `pst_2_wort` | «Bern» (fiktive Vorhersage). |
| `pst_2_plausibel` | Ja (sprachlich verständlich). |
| `pst_2_wahr` | Ja, im üblichen Schulkontext; amtlich ist Bern Bundesstadt. |
| `pst_3_anfang` | Beispiel: «Im Jahr 2030 fliegen alle». |
| `pst_3_kontext` | 5 Wörter (Beispiel). |
| `pst_3_wort` | «Autos» (fiktive Vorhersage). |
| `pst_3_plausibel` | Grammatikalisch möglich, sachlich nicht belegt. |
| `pst_3_wahr` | Nicht prüfbar als Zukunftsaussage; die pauschale Behauptung ist unbegründet. |
| `pst_beob` | Mit mehr Kontext passt die Fortsetzung möglicherweise besser; «Der Mond besteht aus Käse» kann sprachlich plausibel wirken und ist trotzdem falsch. |
| `soe_erwartung` | Ich erwarte, dass N = 5 die Sätze flüssiger und grammatisch korrekter macht, weil das Modell mehr Wörter als Kontext sieht, dass es aber öfter ganze Textstücke aus den Trainingstexten wiederholt. Bei einem Trainingstext mit falscher Aussage erwarte ich, dass das Modell sie wiedergibt, weil es nur zählt, was im Text steht. (Beispiel; jede begründete Prognose ist zulässig.) |
| `soe_variable` | Beispiel: einmal nur die N-Gramm-Länge (2 gegen 5), danach nur die Temperatur, zuletzt nur den Trainingstext – nur eine Bedingung pro Vergleich. |
| `soe_gut_text` | Erfundenes Textbeispiel: «Die Schülerin öffnete das Buch und las die erste Seite.» |
| `soe_gut_beleg` | Die Handlung ist zusammenhängend, die Personen- und Zeitbezüge widersprechen sich nicht. |
| `soe_problem_art` | Falsche Aussage aus dem Trainingstext übernommen (bei selbst erzeugtem Beispiel); sonst Widerspruch. |
| `soe_problem_text` | Beispiel, wie es mit einer eigenen Kollektion entsteht (echte Ausgabe im Protokoll festhalten, nicht dieses Beispiel abschreiben): Trainingstext «Die Hauptstadt der Schweiz ist Zürich. Die Hauptstadt von Frankreich ist Paris. Die Hauptstadt der Schweiz ist Zürich.» → Soekia schreibt «Die Hauptstadt der Schweiz ist Zürich. Die Hauptstadt von Frankreich ist Paris …». Oder: «Heute ist die Figur zwölf Jahre alt. Gestern feierte sie ihren achtzigsten Geburtstag.» |
| `soe_problem_beleg` | Das Modell gibt wieder, was in seinen Trainingstexten steht; es prüft nicht, ob es stimmt (die Hauptstadt ist Bern). Ein grammatikalisch korrekter, plausibel klingender Satz kann inhaltlich falsch sein. |
| `turing_eindruck` | Beispiel: Ich vermutete einen Chatbot. |
| `turing_richtig` | Beispiel: «Ja»; erst nach der Auflösung eintragen. |
| `turing_hinweise` | Wiederholte allgemeine Aussagen und fehlender Bezug auf Rückfragen; echte Chatbelege verwenden. |
| `netz_kennt` | Nein, wenn die betreffende Wortfolge nie in der kleinen Papagei-Tabelle vorkam. |
| `netz_warum` | Ein neuronales Netz kann aus gelernten Gewichten Muster auf neue Wortfolgen übertragen. |
| `netz_wahr` | Nein; Wortvorhersage ist keine unabhängige Faktenprüfung. |
| `sprache_pruefen` | Ich prüfe KI-Aussagen, indem ich eine unabhängige zweite Quelle (Fachseite, Behörde, Lexikon) suche und die Aussage mit eigenem Wissen oder Daten vergleiche. Ein Sprachmodell kann das nicht leisten, weil es nur das wahrscheinlichste nächste Wort berechnet und nicht prüft, ob die Aussage stimmt; ein sicherer Ton oder ein hoher Prozentwert ist kein Beleg. |
| `sprache_netz` | Neuronale Sprachmodelle lernen Parameter in vielen Schichten und arbeiten mit Tokens, statt nur kurze Häufigkeitstabellen abzulesen. Die Vorhersage garantiert dennoch keine Wahrheit. |
| `sprache` | Ein längerer Kontext hilft oft beim Zusammenhang, garantiert aber weder logische Konsistenz noch Fakten. Der Papagei hat eine kurze, lückenhafte Tabelle und kennt viele Wortfolgen nicht. |

## DL 10 · KI und Gesellschaft

| Antwortfeld | Beispielantwort / Erwartungshorizont |
|---|---|
| `video_beispiel` | Nur ein wirklich im angesehenen Video genanntes Beispiel eintragen, z. B. Bewerbungsverfahren, FALLS dort gezeigt. |
| `video_zeit` | Original-Zeitmarke beim Ansehen notieren (z. B. mm:ss), keine Zeitmarke erfinden. |
| `video` | Falls im Video belegt: Auswahlverfahren benachteiligt Menschen → verzerrte historische Daten → unabhängige Überprüfung, Einspruch und Wirkungskontrolle. |
| `wmd_video_o` | Videoabhängig: «hoch», falls Entscheidungsweg nicht nachvollziehbar; mit Filmbeleg. |
| `wmd_video_s` | Videoabhängig: «hoch» bei grosser Reichweite; mit Beleg. |
| `wmd_video_d` | Videoabhängig: «hoch» bei konkreten Schäden; mit Beleg. |
| `wmd_video_u` | Videoabhängig: «WMD» nur wenn Opazität, Reichweite und Schäden belegt sind; sonst «unklar». |
| `wmd_fall_wahl` | Kreditentscheidungen (selbst erdachter Musterfall). |
| `wmd_fall_o` | Hoch: Betroffene sehen die Gewichtung nicht. |
| `wmd_fall_s` | Hoch: Viele Kreditanträge werden automatisiert beurteilt. |
| `wmd_fall_d` | Hoch: ungerechte Ablehnungen können Schaden verursachen. |
| `wmd_fall_u` | Im entworfenen Fall eine WMD, sofern alle drei Kriterien nachgewiesen werden. |
| `wmd_bild_o` | Niedrig: unser kleines Schulprojekt ist transparent dokumentiert. |
| `wmd_bild_s` | Niedrig: keine massenhafte Anwendung. |
| `wmd_bild_d` | Niedrig: beim Schulversuch keine kredit- oder berufsrelevanten Folgen. |
| `wmd_bild_u` | Keine WMD im beschriebenen, nicht öffentlich eingesetzten Schulversuch. |
| `wmd_begruendung` | Unser Bildprojekt betrifft nur einen kleinen, kontrollierten Versuch, ohne massenhafte schädliche Entscheidungen. Für das Video fehlen ohne konkrete Beobachtung gegebenenfalls Angaben zu Reichweite und Schäden. |
| `loop_text` | Kreditmodell lehnt ein Quartier ab → weniger Finanzierung → spätere Daten zeigen Nachteile → das Modell deutet diese Daten erneut als Risiko. |
| `loop_bruch` | Einspruch erlauben, Daten und Zielgrösse unabhängig prüfen, Entscheidungen stichprobenweise auditieren und Folgen über Zeit messen. |
| `crit_seite` | Pro O’Neils Kritik. |
| `crit_gegner` | Gut geprüfte Modelle können in manchen Situationen konsistentere Entscheidungen als einzelne Menschen treffen. |
| `crit_urteil` | Die Kritik ist plausibel, wenn Modelle intransparent, weit verbreitet und schädlich sind; es braucht Einzelfallbelege statt pauschaler Verurteilung. |
| `these_vorher` | Eher Zustimmung (Beispielposition). |
| `these_nachher` | Stimme nicht zu: gleiche Regeln garantieren bei ungleichen Ausgangsdaten keine Fairness. |
| `these_begruendung` | Gleiche Regeln sind nicht automatisch fair: Historisch verzerrte Trainingsdaten können durch identische Modellregeln Benachteiligung fortschreiben; im Kreditfall erhalten Personen aus einem Quartier schlechtere Konditionen, nur weil das Wohngebiet als Stellvertreter dient. |
| `urteil_massnahme` | Beim Kreditfall: Einspruch und unabhängige Fairnessprüfungen einführen; unterschiedliche Ablehnungsraten und begründete Beschwerden vergleichen. Zielkonflikt: Transparenz vs. Datenschutz. |
| `rueck_synthese` | Eine Vorhersage kann falsch sein, (1) wenn die Regeln nicht alle Fälle abdecken (Schulweg: wer legt fest, was Schaden heisst), (2) wenn das Modell Hintergrund oder Licht statt des Gegenstands gelernt hat (Bildprojekt), (3) wenn es für ganz andere Klassen trotzdem antwortet (DL 8) oder (4) wenn ein Text plausibel klingt, aber nicht wahr ist (Sprachmodell, DL 9). Beispiele sind individuell; entscheidend sind drei verschiedene Lektionen und je ein konkreter Fall. |
| `rueck_erkenntnis` | Ein präzises Modell kann trotzdem unfair sein, wenn Daten und Entscheidungen gesellschaftliche Nachteile verstärken. |
| `rueck_frage` | Wie kann man Fairness prüfen, ohne persönliche Daten unnötig offenzulegen? |
| `rueck_best` | Der Rückkopplungskreislauf half mir, Ursache und Wirkung zu unterscheiden. |
| `rueck_wunsch` | Noch einen kurzen, überprüfbaren Praxisfall mit Einspruchsmöglichkeiten besprechen. |

