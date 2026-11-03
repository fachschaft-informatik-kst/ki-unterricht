# 1. Klasse · Feldgenaue Musterlösungen

**Nur für Lehrpersonen.** Die Antworten sind altersgerechte Beispiele und keine einzig richtigen Wortlaute. Die Kennung pro Tabellenzeile entspricht dem im Lernjournal gespeicherten Feld. **Zahlen, Namen, Texte, Filmausschnitte und Notebook-Beobachtungen sind illustrative Beispiele**, wenn nicht ausdrücklich ein mathematisch bestimmtes Ergebnis genannt wird. Das echte Unterrichtsprotokoll muss die eigenen Messwerte, Textausgaben und tatsächlichen Filmbelege zeigen. Versteckte Altfelder und freiwillige Vertiefungen sind der Vollständigkeit halber enthalten.

## DL 1 · Was ist KI?

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `dl1_regeln_automat` | Feste Regeln: Guthaben und Taste bestimmen, ob das Getränk ausgegeben wird. |
| `dl1_regeln_uebersetzung` | Lernen aus Daten: Die Übersetzungsapp wurde mit Satzpaaren trainiert. |
| `dl1_regeln_ampel` | Feste Regeln: Die Ampel folgt einem Zeitplan. |
| `dl1_regeln_gesicht` | Lernen aus Daten: Das Bilderkennungsmodell hat Merkmale aus Trainingsbildern gelernt. |
| `dl1_begriffe_ampel` | Keine KI. |
| `dl1_begriffe_schach` | Regelbasierte KI. |
| `dl1_begriffe_spam` | Maschinelles Lernen. |
| `dl1_begriffe_bilder` | Deep Learning. |
| `dl1_begriffe_text` | Generative KI. |
| `regeln_oder_daten` | Ein Getränkeautomat arbeitet selbstständig, befolgt aber nur vorgegebene Regeln. Er lernt nicht aus Beispielen. Automatisch bedeutet nicht automatisch KI. |
| `begriff_bsp_1` | Optional: Schachcomputer – regelbasierte KI. |
| `begriff_bsp_2` | Optional: Spamfilter mit Trainingsdaten – maschinelles Lernen. |
| `begriff_bsp_3` | Optional: Tierbilder mit tiefem Netz erkennen – Deep Learning. |
| `begriff_bsp_4` | Optional: KI schreibt eine Geschichte – generative KI. |
| `basis-ki-zeitstrahl` | Frühe KI-Systeme folgten oft von Menschen festgelegten Regeln. Später wurden viele Modelle mit Daten trainiert, etwa tiefe neuronale Netze. Heute sind Regeln weiterhin wichtig, beispielsweise für Sicherheit und Kontrolle. |
| `ki_ordnung` | Schachcomputer: feste Regeln, schwache KI. Spamfilter: lernt aus Daten, ML und schwache KI. Fiktive allgemein intelligente Filmfigur: hypothetische starke KI. Ein Chatbot ist nicht automatisch allgemein intelligent. |
| `typ_bsp_1` | Altes freiwilliges Feld: Schachprogramm. |
| `typ_1` | Alte Kategorie: regelbasierte KI. |
| `typ_bsp_2` | Altes freiwilliges Feld: Spamfilter. |
| `typ_2` | Alte Kategorie: maschinelles Lernen. |
| `typ_bsp_3` | Altes freiwilliges Feld: Tierbilderkennung. |
| `typ_3` | Alte Kategorie: Deep Learning. |
| `typ_bsp_4` | Altes freiwilliges Feld: Textgenerator. |
| `typ_4` | Alte Kategorie: generative KI. |
| `gesetze` | 1. Das Bremsen ist naheliegend, weil es Verletzungen verringern könnte. 2. Das Gesetz schützt nicht automatisch alle gleichzeitig; bei möglichen Schäden braucht es menschliche Regeln und Verantwortung. |
| `begriffe_saetze` | KI ist ein Oberbegriff für Systeme, die anspruchsvolle Aufgaben bearbeiten. ML lernt aus Daten. Deep Learning benutzt tiefe neuronale Netze. Generative KI erzeugt neue Inhalte. |
| `begriffe` | Der Getränkeautomat folgt festen Regeln; der trainierte Spamfilter hat aus Beispielen gelernt. Offen bleibt für mich, wann eine Regelmaschine als KI gilt. |

## DL 2 · Wie lernt KI?

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `eva_erklaerung` | Eingabe: neue E-Mail. Erfahrungsschatz: beim Training gelernte Merkmale und Gewichte aus gelabelten Beispielen. Ausgabe: Spam oder nicht. Eine neue Mail verändert das Modell nicht automatisch; das regelbasierte Schachprogramm lernt in diesem Beispiel nicht. |
| `wissen_fragen` | «Ist die Figur erfunden?» – ja; «Kommt sie in einem Film vor?» – ja; «Hat sie Superkräfte?» – nein. Mit jeder Antwort werden Möglichkeiten ausgeschlossen. |
| `wissen_unbekannt` | Das System kann falsch raten oder fragen, wer gemeint war. Das allein zeigt noch nicht, wie es intern lernt. |
| `wissen_regeln` | Entwicklerinnen und Entwickler haben Fragen und Regeln vorgegeben; wir wissen ohne Einsicht nicht, ob und wann der Dienst zusätzliche Daten auswertet. |
| `lernend_nachbarn` | Bei unserem Beispiel lagen ähnliche Animationsfilme beieinander, etwa weil die Genres oder Bewertungen ähnlich sind. Echte Titel aus dem Experiment nennen. |
| `lernend_aendert` | Genre-Färbung zeigt Genres; bei Nutzerbewertungen ändern sich Farben und bei einem neuen User Index die erwarteten Bewertungen. |
| `lernend_daten` | Aus Eigenschaften von Filmen und vergangenen Nutzerbewertungen; die genaue Datenquelle ist im Versuch nicht vollständig belegt. |
| `memory-supervised` | Das Modell hat die richtigen Labels gesehen; es erkennt manche neue Bilder, verwechselt aber manchmal ähnliche Klassen. |
| `memory-unsupervised` | Ich gruppierte nach Farbe. Andere hätten nach Form sortieren können; beides kann sinnvoll sein. |
| `memory-reinforcement` | Im NIM-Spiel wird eine erfolgreiche Entscheidung belohnt und künftig häufiger gewählt. |
| `memory` | Überwacht: richtige Labels. Unüberwacht: Ähnlichkeiten. Verstärkend: Belohnung. NIM ist verstärkendes Lernen; die Bildklassifikation ist überwachtes Lernen. |

## DL 3 · Ein Neuron und dessen Lernregel

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `basis-neuron-neuron_wozu` | Sonne und Freund:innen geben positive Beiträge, die Prüfung einen negativen. Der Bias legt die Schwelle fest. Gewicht Prüfung = 0 würde die Prüfung völlig ignorieren. |
| `basis-neuron-neuron_gelernt` | Gewichte und Bias werden korrigiert, wenn eine Vorhersage falsch ist. Die Eingaben und das Rechenverfahren bleiben gleich; gelernt ist in den Parametern gespeichert. |
| `basis-neuron-sw_gs` | +2 |
| `basis-neuron-sw_gf` | +2 |
| `basis-neuron-sw_gp` | −1 |
| `basis-neuron-sw_bias` | −1 |
| `basis-neuron-sw_treffer` | 5 von 8: In drei Prüfungssituationen liegt das Startneuron falsch. |
| `basis-neuron-sw2_gs` | +2 |
| `basis-neuron-sw2_gf` | +2 |
| `basis-neuron-sw2_gp` | −4 |
| `basis-neuron-sw2_bias` | −1 |
| `basis-neuron-sw2_gefunden` | Ja: 8 von 8. Es sind auch andere richtige Einstellungen möglich. |
| `basis-neuron-hand_and_w1` | 1 |
| `basis-neuron-hand_and_w2` | 1 |
| `basis-neuron-hand_and_b` | −1,5 |
| `basis-neuron-hand_and_ok` | Ja, vier richtige Fälle. |
| `basis-neuron-hand_or_w1` | 1 |
| `basis-neuron-hand_or_w2` | 1 |
| `basis-neuron-hand_or_b` | −0,5 |
| `basis-neuron-hand_or_ok` | Ja, vier richtige Fälle. |
| `basis-neuron-hand_nand_w1` | −1 |
| `basis-neuron-hand_nand_w2` | −1 |
| `basis-neuron-hand_nand_b` | 1,5 |
| `basis-neuron-hand_nand_ok` | Ja, vier richtige Fälle. |
| `basis-neuron-lr_005` | Beispiel: 36 Lernrunden, nicht gemessen. |
| `basis-neuron-lr_02` | Beispiel: 13 Lernrunden, nicht gemessen. |
| `basis-neuron-lr_05` | Beispiel: 7 Lernrunden, nicht gemessen. |
| `basis-neuron-lr_10` | Beispiel: 12 Lernrunden, nicht gemessen. |
| `basis-neuron-lr_beob` | Kleine Lernrate: kleinere Schritte; grosse Lernrate: unter Umständen schneller, aber unruhig. Das Ergebnis hängt vom Versuch ab. |
| `basis-neuron-iris_richtig` | Beispiel: 27 von 30 neue Pflanzen richtig (nicht gemessen). |
| `basis-neuron-iris_gewicht` | Abhängig vom echten Notebooklauf: die Eingabe mit dem betragsmässig grösseren gelernten Gewicht benennen. |
| `basis-neuron-perzeptron` | Ein Neuron bildet die gewichtete Summe plus Bias. Bei einem Fehler wird das Gewicht passender Eingaben verändert, damit die Ausgabe künftig näher am Ziel liegt. |

## DL 4 · Neuronale Netze

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `basis-netze-hand_xor_max` | Höchstens 3 von 4 korrekt; ein einzelnes Neuron hat nur eine lineare Entscheidungsgrenze. |
| `basis-netze-xor_warum` | Bei XOR sind (0,1) und (1,0) positiv, aber (0,0) und (1,1) negativ. Eine Gerade kann das nicht trennen. Andere Lernraten ändern daran nichts. |
| `basis-netze-netze_zwischenschicht` | (1,0) → ODER 1, NAND 1 → UND 1. Zwei Zwischenmerkmale zusammen erlauben die XOR-Entscheidung. |
| `basis-netze-xornetz_1` | Beispiel: 3 richtige Zeilen (Notebookwert ersetzen). |
| `basis-netze-xornetz_2` | Beispiel: 4 richtige Zeilen (Notebookwert ersetzen). |
| `basis-netze-xornetz_4` | Beispiel: 4 richtige Zeilen (Notebookwert ersetzen). |
| `basis-netze-xornetz_start` | Nein, Startwerte können das Ergebnis verändern. |
| `basis-netze-xornetz_beob` | Bei einem Beispielstart gelangen 2 versteckte Neuronen zu 4/4. Ein anderer Start kann scheitern; tatsächlichen Lauf dokumentieren. |
| `basis-netze-netze` | Ein einzelnes Neuron trennt nur linear. Die Zwischenschicht kombiniert Teilentscheidungen (z. B. ODER und NAND) zu XOR. |

## DL 5–8 · Ziffern, Transfer, Fotoklassen und Gespräch

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `basis-daten-a` | Vermutung: Das Ziffernnetz gibt für A und B ebenfalls Ziffern 0–9 aus, weil es keine Buchstabenklasse kennt. Beobachtung: Beispiel A → 4 und B → 8 (reine Beispielwerte); das ist keine korrekte Buchstabenerkennung. Bei Tassen/Büchern wäre der Hintergrund eine Datenfalle. |
| `basis-daten-b` | Das alte Ziffernnetz kann nicht einfach Buchstaben A/B korrekt benennen. Dafür braucht es neue Trainingsbeispiele und passende Ausgabeklassen. |
| `basis-plan-a` | Die erste Merkmalschicht bleibt erhalten und eingefroren. Der neue A/B-Ausgabekopf lernt aus beschrifteten Buchstabenbildern. Neue Testbilder zeigen, ob die Buchstaben auch ausserhalb des Trainings funktionieren. |
| `basis-plan-b` | Beispiel: Auf neuen A/B-Bildern ist die Vorhersage besser als das unveränderte Ziffernnetz (keine direkt vergleichbaren Genauigkeiten). Neue unbekannte Gegenstände sind damit noch nicht gelernt. |
| `basis-training-a` | Standardweg: synthetische Klassen Kreis und Dreieck. Beispiel V1: A 12/16, B 14/16, Wahl B vor Test; diese Zahlen sind keine echten Notebookwerte. Alternativ eigene Gegenstandsfotos mit dokumentierten Klassen/Quellen. |
| `basis-training-b` | Beispiel: A 12/16=75 %, B 14/16=87,5 % auf denselben V1-Bildern; B vor dem Test gewählt. Eine andere Erklärung für den Unterschied sind zufällige Startbedingungen oder leichterer Bildhintergrund. Synthetische Übungsdaten belegen keine zuverlässige Erkennung echter Fotos. |
| `basis-training-test` | Beispiel: Nach dokumentierter Entscheidung für B und Freigabe durch die Lehrperson P1/P2 26/32=81,25 %. Ein unbekanntes Dreieck könnte falsch als Kreis ausgegeben werden. Nach dem Test nicht neu optimieren; echte Werte aus dem Notebook eintragen. |
| `basis-abschluss-a` | Wir fragten, ob mehr verschiedene Trainingsbeispiele helfen. Beide Varianten hatten gleich viele Trainingsbilder; auf V1 im Beispiel A 12/16, B 14/16. B wurde vorher gewählt; der unabhängige Test ergab beispielhaft 26/32. Das gilt nur für unsere kleinen bzw. synthetischen Daten. |
| `basis-abschluss-b` | Ich habe gelernt, wie wichtig neue Testdaten sind. Offen bleibt, wie gut das Modell mit anderen Kameras und neuen echten Gegenständen funktioniert. |

## DL 9 · Sprachmodelle

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `basis-sprache-pap_text_a` | Erfundenes Beispiel: «Der Hund rennt und morgen wird …» – der Text verliert früh seinen Zusammenhang. |
| `basis-sprache-pap_text_b` | Erfundenes Beispiel: «Der Hund rennt durch den Garten und findet …» – länger verständlich. |
| `basis-sprache-pap_besser` | Im Beispiel B; echten Notebooktext beurteilen. |
| `basis-sprache-pap_bruch_a` | Beispiel: nach 5 Wörtern. |
| `basis-sprache-pap_bruch_b` | Beispiel: nach 9 Wörtern. |
| `basis-sprache-pap_kontext` | Mit mehr sichtbarem Kontext werden Sätze oft zusammenhängender, aber nicht automatisch wahr. |
| `basis-sprache-pst_1_anfang` | «Der Mond besteht aus» (Beispielsatz). |
| `basis-sprache-pst_1_kontext` | 2 Wörter (Beispiel). |
| `basis-sprache-pst_1_wort` | «Käse» (frei erfundene Fortsetzung). |
| `basis-sprache-pst_1_plausibel` | Nein. |
| `basis-sprache-pst_1_wahr` | Nein. |
| `basis-sprache-pst_2_anfang` | «In der Schweiz heisst die Bundesstadt» (Beispielsatz). |
| `basis-sprache-pst_2_kontext` | 4 Wörter (Beispiel). |
| `basis-sprache-pst_2_wort` | «Bern» (frei erfundene Fortsetzung). |
| `basis-sprache-pst_2_plausibel` | Ja. |
| `basis-sprache-pst_2_wahr` | Ja, im Kontext der Bundesstadt. |
| `basis-sprache-pst_3_anfang` | «Im Jahr 2030 fliegen alle» (Beispielsatz). |
| `basis-sprache-pst_3_kontext` | 5 Wörter (Beispiel). |
| `basis-sprache-pst_3_wort` | «Autos» (frei erfundene Fortsetzung). |
| `basis-sprache-pst_3_plausibel` | Grammatikalisch möglich, sachlich unbegründet. |
| `basis-sprache-pst_3_wahr` | Nicht prüfbar als Zukunftsbehauptung; «alle» ist unbelegt. |
| `basis-sprache-pst_beob` | Mehr Kontext kann helfen, aber ein Satz wie «Der Mond besteht aus Käse» bleibt falsch, auch wenn er grammatikalisch passt. |
| `basis-sprache-netz_kennt` | Nein, wenn die Wortfolge in der kleinen Papagei-Tabelle nicht vorkommt. |
| `basis-sprache-netz_warum` | Ein neuronales Netz kann mithilfe gelernter Gewichte Muster auf neue Eingaben übertragen. |
| `basis-sprache-netz_wahr` | Nein. Ein Sprachmodell prüft nicht automatisch Tatsachen. |
| `basis-sprache-sprache_netz` | Es berechnet die Vorhersage mit vielen gelernten Gewichten statt einer kleinen Häufigkeitstabelle. Seine Ausgabe kann trotzdem falsch sein. |
| `basis-sprache-a` | Beispielbeobachtung: Mit längerem Kontext wirkt der Satz verständlicher. Das bedeutet nicht, dass eine Aussage richtig ist. |
| `basis-sprache-b` | Verbesserter Prompt: «Nenne eine Quelle und kennzeichne Unsicherheit; erfinde keine Fakten.» Faktencheck: Behauptung über Datum in zwei zuverlässigen Quellen nachprüfen. |
| `basis-sprache-soe_variable` | Beispiel: Ich habe die Kontextlänge verändert, während die übrigen Einstellungen gleich blieben. |
| `basis-sprache-soe_gut_text` | Erfundenes Beispiel: «Die Katze liegt auf dem Sofa und schläft.» |
| `basis-sprache-soe_gut_beleg` | Der Text enthält eine stimmige Handlung und keine inneren Widersprüche. |
| `basis-sprache-soe_problem_art` | Widerspruch. |
| `basis-sprache-soe_problem_text` | Erfundenes Beispiel: «Das Kind ist zwölf. Gestern wurde es achtzig.» |
| `basis-sprache-soe_problem_beleg` | Die Altersangaben widersprechen einander. |
| `basis-sprache-turing_eindruck` | Beispiel: Ich vermutete eine Maschine. |
| `basis-sprache-turing_richtig` | Beispiel: «Ich war unsicher»; nach der Auflösung eintragen. |
| `basis-sprache-turing_hinweise` | Wiederholung von Floskeln und Ausweichen bei konkreten Nachfragen; echte Gesprächszitate müssen aus dem eigenen Versuch kommen. |

## DL 10 · KI und Gesellschaft

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `video_beispiel` | Hier ausschliesslich einen tatsächlich im betrachteten Quarks-Film gezeigten Punkt notieren, z. B. einen im Film belegten Fall unfairer Modellentscheidung. |
| `video_zeit` | Zeitmarke während des Films ermitteln (mm:ss); nicht erfinden. |
| `video` | Musterstruktur, falls der Film das belegt: Chance = schnellere Prüfung; Risiko = verzerrte Daten; Beispiel = konkret beobachteter Filmfall. |
| `basis-gesellschaft-fall` | Beispiel-Streitfrage: «Soll eine KI allein entscheiden, wer einen Kredit erhält?» (Filmbeispiel nur nach echtem Beleg). |
| `basis-gesellschaft-pro` | 1. Ein System kann Anträge schnell und nach gleichen Kriterien bearbeiten. 2. Eine dokumentierte Prüfung kann menschliche Willkür begrenzen. |
| `basis-gesellschaft-contra` | 1. Verzerrte Daten können Gruppen benachteiligen. 2. Betroffene verstehen eine Ablehnung ohne Erklärung oft nicht. |
| `basis-gesellschaft-urteil` | KI darf unterstützen, sollte bei wichtigen Krediten aber nicht allein entscheiden. Unabhängige Kontrollen und Einspruch einführen; Beschwerden und Fehlerquoten regelmässig vergleichen. Gegenargument: Menschen sind ebenfalls fehleranfällig. |
| `basis-gesellschaft-reflexion` | Ich sehe Chancen bei klar begrenzter Nutzung, aber nach der Debatte ist mir die Einspruchsmöglichkeit wichtiger geworden. |
| `rueck_erkenntnis` | Gleiche Regeln können trotz ihrer Gleichheit unfair sein, wenn Daten ungleich sind. |
| `rueck_frage` | Wie lässt sich überprüfen, ob ein Modell verschiedene Gruppen gleich fair behandelt? |
| `rueck_best` | Mir half der Fall mit unterschiedlichen Perspektiven, Folgen zu erkennen. |
| `rueck_wunsch` | Ich würde noch einen konkreten, kurzen Faktencheck mit Quellen einbauen. |

## Sicherung und Abgabe

| Antwortfeld | Mögliche Musterantwort |
|---|---|
| `basis-journal-namen` | Beispiel: Mia Muster · Luca Beispiel (fiktive Namen; bei echten Abgaben reale Namen verwenden). |
| `basis-journal-klasse` | Beispiel: 1a. |

