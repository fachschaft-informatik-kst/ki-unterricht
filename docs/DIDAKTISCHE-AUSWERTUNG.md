# Didaktische Auswertung: DL 1–10 und Projekt (4. Klasse)

> Stand: 6. November 2026 · Kursstand: `main` @ `e2ddddf` · Referenzkurs: BOK 4. Klasse
> (IRN und Vorlage: Anhang B) · Status: Entwurf zur Diskussion in der Fachschaft.
> Umsetzungsstand der Wellen 1 und 2 (Branch `feat/didaktik-welle-1`): Abschnitt 9. Die Befunde
> in den Abschnitten 0–8 beschreiben weiterhin den Stand vor dieser Umsetzung.
> Zeilenangaben («Z.») beziehen sich auf diesen Stand.

Diese Auswertung ergänzt die [Redaktionsprüfung](./DIDAKTISCHE-QUALITAET.md), die vor
jedem Merge prüft, ob eine einzelne Änderung didaktisch vertretbar ist. Hier geht es um
das Ganze: Fluss und Inhalt aller Doppellektionen (DL), eingeordnet in aktuelle Literatur.
Sie ist KI-gestützt entstanden und ersetzt weder die fachliche Freigabe noch den
Praxistest (siehe Abschnitt 1, «Grenzen»).

**Lesehilfe:** Abschnitt 0 genügt für einen Überblick. Abschnitt 2 beschreibt den Fluss
des Kurses, Abschnitt 3 ist zum Nachschlagen je Lektion, Abschnitt 7 enthält die
priorisierten Massnahmen, Abschnitt 9 den Umsetzungsstand.

## 0. Auf einen Blick

**Gesamtbild.** Der Kurs folgt einer in der Literatur gut gestützten Architektur:
explizite Einführung (DL 1–4), gerüstetes selbstorganisiertes Arbeiten (DL 5–8),
Transfer und Einordnung (DL 9–10). Er ist fachlich sorgfältig, benennt die Grenzen von
KI-Modellen konsequent und denkt Ausfallwege mit. Die Schwächen liegen weniger in
einzelnen Lektionen als in der **Steuerung und an den Nahtstellen**: Planungs-, Seiten-
und Musterlösungsdokumente widersprechen sich, Pflicht und Wahl sind für Lernende
unsichtbar, die individuelle Sicherung erzeugt keine Rückmeldung, die 270 Minuten
selbstorganisiertes Arbeiten laufen ohne sichtbaren Lernstand, und die Übergänge
DL 4→5 sowie DL 8→9 tragen zu wenig. Das Beurteilungssystem stützt 36 % der Note auf ein
vierminütiges Gespräch ohne einheitlichen Leitfaden.

Insgesamt wurden 99 Einzelbefunde festgehalten, 26 davon mit Schweregrad «hoch» (vergeben
vom jeweiligen Analyse-Agenten, über Lektionen hinweg nicht kalibriert; nicht als
Rangliste lesen).

**Was bleibt, wie es ist (Stärken)**

1. **Lernarchitektur:** erst explizite Instruktion, dann gerüstetes Entdecken. Meta-Analysen
   stützen genau dieses Muster (Alfieri et al. 2011; Lazonder & Harmsen 2016).
2. **Fachliche Ehrlichkeit:** «Das Neuron weiss nicht, was AND bedeutet», «Ein Lauf ist eine
   Beobachtung, kein Beweis», «Der Modellwert ist nicht die Wahrscheinlichkeit, richtig
   zu liegen», «Das Etikett WMD ist eine Einschätzung, kein Beweis», «keine Fehler erfinden».
3. **Roter Faden «Vorhersage ≠ Garantie» / «plausibel ≠ wahr»** in DL 1, 3, 5–10, auch
   wenn er nirgends ausdrücklich als Faden benannt wird.
4. **Aktivierende Muster:** Vermutung vor Beobachtung (DL 3–5, 8, 9), Worked Example →
   Completion (DL 3, 10), Kontrastfälle (DL 1, 2, 8, 10), Peer-Review (DL 1, 8),
   Vorher-/Nachher-These (DL 10).
5. **Authentische Methodik im Projekt:** Trennregeln, Testsperre mit Begründung, Journal,
   ZIP-Sicherung und die Fremdprüfung in DL 8 entsprechen der Praxis gegen Datenlecks
   (Kapoor & Narayanan 2023).
6. **Robustheit:** Ersatz- und Übungsdaten, Papier- und Beamerersatz, Startpuffer für
   Notebooks, Alt-Texte, Datenschutzhinweise bei Akinator, Quick, Draw! und Fotos.
7. **Handwerk:** In allen zehn DL summieren sich die AVIVA-Phasen auf 90 Minuten [G].

**Zentrale Befunde** (Kennzeichnung: [G] von mir an der Quelle geprüft oder nachgerechnet,
[A] Befund des Analyse-Agenten, nicht einzeln nachgeprüft, [H] Hypothese oder Schätzung,
nur im Unterricht klärbar)

1. **Steuerungsdokumente widersprechen sich** [G]. `KI_Planung.md` (KP) verlangt XOR als
   Pflicht in DL 3 (Z. 68), der Plan führt es erst in DL 4 ein. KP legt für DL 4
   «Datenrollen mit fünf Gruppenkarten», Freigabe pro Tandem und einen Fotoauftrag fest
   (Z. 74–76), der DL-4-Plan schliesst die Datenaufteilung aus. KP will in DL 10 nur
   «Debattenfragen als Hilfe» (Z. 108), die Seite enthält ein 20-Minuten-Debattenskript.
   Im Bewertungsraster stehen ein unmögliches Rechenbeispiel («24,75 Punkte → 4,75») und
   «33,3 %» statt 36,4 %.
2. **Pflicht/Wahl unsichtbar, Zeit knapp** [A, H]. In DL 1, 2, 3, 9 und 10 sehen Lernende
   keine Trennung von Pflicht und Wahl (sie steht nur auf der Lehrpersonenseite; die
   Lehrperson hat am 6. November 2026 entschieden, dass Pflicht und Wahl nicht in den
   Kursunterlagen stehen, siehe Abschnitt 7).
   Schätzungen: DL 1 ≈ 35–40 Min. Pflicht bei 30 Min. Tandemzeit, DL 2 ≥ 100 statt
   90 Min., DL 6 65–85 Min. in 70, DL 7 55–75 Min. in 65, DL 8 Etappe 1 ohne Budget.
   Die «Entlastung» vom 4.11. (`ce8ff95`) hat DL 3/4 nicht kleiner gemacht, sondern Zeit
   von der Tandemarbeit zur Lehrperson verschoben (gelenkte Zeit DL 3: 18→27 Min.,
   DL 4: 21→36 Min.; Einzelzeit DL 4: 7→2 Min.) [G].
3. **Individuelle Sicherung formal vorhanden, ohne Rückmeldung** [G, A]. DL 2 hat kein
   Feld für die Leitfrage, DL 4 gibt 2 Min. für drei Fragen plus Bereit-Check, DL 9 und 10
   je 2 Min. Antworten bleiben im Browser; die Lehrperson sieht nur, was Lernende
   herunterladen oder abgeben. Punkt 5 der Redaktionsprüfung («die Lehrperson überprüfen
   kann») ist damit nur formal erfüllt.
4. **Selbstorganisiertes Arbeiten ohne sichtbaren Lernstand** [G, A]. DL 6–8 sind 270 Min.
   ohne Plenum. Fortschritt und Verständnis sind Selbstberichte (Häkchen lokal; das
   Attribut `data-p1-diagnostic` im Bereit-Check hat keine Funktion [G]). Die Beratung
   ist widersprüchlich beschrieben (reaktiv «Hilfe nur auf Fragen» vs. proaktiv «bei
   jedem Tandem»), Tagesziele haben keinen Ort im Journal.
5. **Nahtstellen tragen zu wenig:** DL 4→5 (Methodenwechsel und Selbstorganisation
   gleichzeitig; «ungesehene Daten», Epoche, Startwert und Merkmal nicht eingeführt;
   Bereit-Check Frage 3 prüft Ungelehrtes [G]), DL 8→9 (kein Anker, Transferfrage fehlt
   im Plan [A]), DL 9→10 (alle Fälle sind Scoring-Systeme [A]); der Kursabschluss ist
   eine Evaluation statt einer Synthese [G].
6. **Das Versuchsdesign verspricht mehr, als es trägt** [G]. V1 enthält je Klasse ein
   Exemplar mit 8 Fotos, also 16 Bilder von 2 Gegenständen; ein Bild entspricht 6,25
   Prozentpunkten. Das Journal fragt trotzdem nach «Unterschied: … Prozentpunkte» und
   nach «… von 32 Bildern» (tatsächlich 4 Gegenstände). In DL 8 liegt die «Trennschärfe»
   per Konstruktion bei ≥ 50 %, und die Schwelle «trennt teilweise» (≥ 65 %) ist bei nur
   5 Exemplaren je Klasse ein schwaches Kriterium: Zufall erreicht sie je nach Zusammenhang
   der Vorhersagen innerhalb eines Exemplars mit unter 1 % bis 34 % Wahrscheinlichkeit.
7. **Beurteilung:** 12 von 33 Punkten (36,4 %) hängen an 4 Min. Gespräch je Person ohne
   einheitlichen Leitfaden, Fragenpool oder Bogen (drei Fragenlisten liegen nebeneinander) [A]. 60 % der Kurszeit (540 von 900 Min.) erzeugen
   keine beurteilte Evidenz [G]. Für die Rückmeldung an das geprüfte Tandem ist auf der
   Seite kein Zustellweg beschrieben [G].
8. **Generative KI:** Das Journal fragt nach KI-Hilfen, aber es gibt keine Regel dazu [A];
   DL 9/10 greifen die eigene Nutzung nicht auf [A]. Die Evidenz spricht für Leitplanken
   statt freiem Zugriff (Bastani et al. 2025).

**Prioritäre Massnahmen** (Details in Abschnitt 7; Aufwand S = Stunden, M = Tage)

| # | Massnahme | Betrifft | Aufwand |
|---|-----------|----------|---------|
| R1 | Steuerungsdokumente angleichen: eine Wahrheit je Entscheidung | KP, `planung.json`, Seiten, Musterlösungen, Bewertung | S |
| R2 | Fachliche Kurzkorrekturen (13 Stellen) | DL 1, 2, 3, 4, 8, Bewertung, Glossar | S |
| R3 | Pflicht/Wahl sichtbar machen, Pflichtweg zeigen (zurückgenommen, siehe Abschnitt 7) | DL 1, 2, 3, 9, 10; Minuten in DL 8 | S |
| R4 | Individuelle Sicherung wirksam machen (Feld, Lösung, Zeit, Einsammeln) | DL 2, 4, 9, 10 | S–M |
| R5 | Brücke DL 4→5 | DL 4, 5 | S–M |
| R6 | Brücke DL 8→9→10, Abschluss als Synthese | DL 8, 9, 10 | S |
| R7 | SOL-Steuerung sichtbar machen (Zeitleiste, Fortschrittstafel, Pflichtkontakt) | DL 5–8 | S–M |
| R8 | Versuchsdesign ehrlicher darstellen | DL 6, 7, Journal, `ki_foto_tools.py` | S |
| R9 | DL 8 robust und geschlossen machen (Zuteilung, Rückmeldung, Etappe 1, Austauschpaket) | DL 8 | M |
| R10 | Beurteilung stützen (Leitfaden, Indikatoren, KI-Regel, individuelle Spur) | Bewertung, Journal | M |

**Wie belastbar ist das?** Über 20 Kernbefunde habe ich an den Quellen nachgelesen oder
nachgerechnet [G], darunter die Widersprüche in Abschnitt 0, Punkt 1. Die Zeitschätzungen
([H]) sind Hypothesen: Sie sagen, wo der Unterricht wahrscheinlich eng wird, nicht wie eng
er ist. Abschnitt 8 enthält einen Beobachtungsplan, mit dem die Fachschaft die wichtigsten
Hypothesen im nächsten Durchgang prüfen kann.

## 1. Gegenstand, Vorgehen, Grenzen

**Gegenstand.** BOK 4. Klasse: DL 1–10 (DL 5–7 = Projekt), Journal, Sicherung, Lernziele,
Bewertung sowie die Lehrpersonenmaterialien, die die Lektionen steuern (`planung.json`,
`materialien.md`, Musterlösungen, `KI_Planung.md`). Nicht untersucht: die 1. Klasse
(Basis-Kurs) und die Technik, soweit sie nicht Lerninhalt bestimmt.

**Pfadkürzel.** `ks/` = `kurse/bok/4-klasse/kursseiten/`, `lp/` = `…/lehrperson/`,
`ws/` = `…/worksheets/md/`, `nb/` = `…/content/`. KP = `ws/KI_Planung.md`,
MLF = `lp/musterloesungen-felder.md`, PJ = `ks/projekt/planung.json`.

**Raster D1–D10.** Es erweitert die acht Punkte der Redaktionsprüfung um Beurteilung,
Motivation und Reflexion:

| Dim. | Frage | Bezug Redaktionsprüfung |
|------|-------|-------------------------|
| D1 | Ziele und Passung (Constructive Alignment) | Punkt 1 |
| D2 | Sequenz und Fluss, Begriffskonsistenz, Spirale | Punkt 4 |
| D3 | Kognitive Belastung und Zeitrealismus | Punkt 3 |
| D4 | Aktivierung und Lernstrategien (Abruf, Vermutung, Selbsterklärung) | Punkt 4 |
| D5 | Führung, Gerüste, Fading, Selbstkontrolle | Punkte 4, 5 |
| D6 | Fachliche Korrektheit und Konzeptqualität | Punkt 2 |
| D7 | Beurteilung und Feedback, individuelle Verantwortung | Punkte 1, 5 |
| D8 | Differenzierung und Zugänglichkeit, Ausfallwege | Punkte 6, 8 |
| D9 | Motivation, Relevanz, Autonomie, Fairness im Tandem | – |
| D10 | Reflexion, Ethik, Umgang mit generativer KI, Transfer | – |

Punkt 7 der Redaktionsprüfung (Bestandsdaten) ist eine Merge-Prüfung und nicht Teil dieser
Auswertung.

**Vorgehen.**

1. Lesende Analyse je Lektion durch fünf Agenten mit gemeinsamem Briefing (DL 1–2, DL 3–4,
   Projekt DL 5–7, DL 8 mit Beurteilungssystem, DL 9–10).
2. Drei Literaturrecherchen (Lernforschung; KI-/ML-Bildung; Sprachmodelle, generative KI,
   Beurteilung). Zugelassen sind nur Quellen, die tatsächlich geöffnet wurden; Korrekturen
   gegenüber verbreiteten Zitierfehlern stehen in Anhang C.
3. Eigene Messungen: AVIVA-Minuten je Sozialform aus `planung.json`, Textmenge,
   Eingabefelder und Lesbarkeit (LIX, Wiener Sachtextformel) im gebauten HTML, eine
   Begriffsmatrix über die Lernendenseiten, ein Vergleich der DL-8-Textmenge vor und nach
   der Umgestaltung.
4. Stichprobenprüfung: Die folgenreichsten Behauptungen der Agenten habe ich an der Quelle
   nachgelesen. Zwei Rechnungen habe ich unabhängig reproduziert (Lernraten-Versuch,
   Zufallsniveau der Trennschärfe).

**Kennzeichnung.** [G] geprüft, [A] Agentenbefund, [H] Hypothese/Schätzung.

**Grenzen.**

- Es gibt keine Unterrichtsdaten. Alle Zeitangaben mit [H] sind Schätzungen.
- Die Schweregrade stammen von je einem Agenten und sind nicht kalibriert.
- Effektstärken in der Literatur stammen aus anderen Kontexten und Altersstufen; sie
  stützen eine Richtung, beweisen aber nichts für diesen Kurs.
- Die Einordnung der Lernziele nach kognitiver Anforderung (Abschnitt 2.5) ist meine
  Einschätzung.

## 2. Der Kurs als Ganzes: Fluss

### 2.1 Architektur und Zeitprofil

| DL | Thema | A/V/I/Ver/Aus (Min.) | LP | Klasse | Einzeln | Tandem | gelenkt* | Wörter | Felder | LIX |
|----|-------|----------------------|----|--------|---------|--------|----------|--------|--------|-----|
| 1 | Was ist KI? | 5/10/20/45/10 | 23 | 5 | 12 | 50 | 31 % | 1447 | 27 | 48,5 |
| 2 | Wie lernt KI? | 5/5/15/55/10 | 15 | 25 | 7 | 43 | 44 % | 1026 | 11 | 40,6 |
| 3 | Wie entscheidet ein Neuron? | 6/2/22/50/10 | 15 | 12 | 12 | 51 | 30 % | 1337 | 32 | 42,4 |
| 4 | Warum mehrere Neuronen? | 5/3/22/50/10 | 19 | 17 | 2 | 52 | 40 % | 1384 | 20 | 44,0 |
| 5 | Projekt starten | 5/5/10/60/10 | 10 | 0 | 10 | 70 | 11 % | 2612** | 1 (+14***) | 47,8 |
| 6 | Untersuchen, begründen | 5/3/2/70/10 | 0 | 0 | 10 | 80 | 0 % | – | – | – |
| 7 | Abschliessen, prüfen | 5/3/2/70/10 | 0 | 0 | 10 | 80 | 0 % | – | – | – |
| 8 | Fremdmodell prüfen | 5/5/5/70/5 | 0 | 0 | 22 | 68 | 0 % | 2158 | 23 | 51,5 |
| 9 | Sprachmodelle | 5/10/15/50/10 | 17 | 4 | 14 | 55 | 23 % | 836 | 36 | 45,3 |
| 10 | Wer trägt die Folgen? | 5/5/20/45/15 | 20 | 12 | 21 | 37 | 36 % | 1072 | 30 | 42,5 |

\* gelenkt = Lehrperson plus Plenum, in Prozent der 90 Minuten. \*\* DL 5–7 zusammen
(plus Journal 434 Wörter). \*\*\* Journalfelder. Wörter = sichtbarer Text im gebauten HTML
ohne AVIVA-Boxen und Navigation. LIX: < 40 leicht, 40–50 mittel, 50–60 schwer, > 60 sehr
schwer. Zum Vergleich: Bewertung 842 Wörter (LIX 62,3), Lernziele 873 (62,5), Sicherung
373 (59,8).

Was die Tabelle zeigt:

- **Die Führung fällt als Klippe, nicht als Rampe.** Gelenkte Zeit: 40–44 % in DL 2 und 4,
  11 % in DL 5, 0 % in DL 6–8, dann 23 % und 36 % in DL 9/10 [G]. Zwischen DL 4
  (36 Min. gelenkt, Algebra-Beweis) und DL 6 (0 Min.) liegt eine einzige Lektion mit
  10 Min. Lehrpersoneninput, in der zugleich neue Methodenbegriffe (Train/Validierung/Test,
  Datenleck) selbstorganisiert erarbeitet werden.
- **Individuelle Zeit ist knapp, wo sie gebraucht würde:** DL 2: 7 Min., DL 4: 2 Min.
  (vor der Entlastung vom 4.11.: 7) [G]. In DL 5–7 stehen je 10 Min. «Einzeln», aber ohne
  Feld oder Spur [A].
- **Die Last verteilt sich ungleich.** DL 8 hat den längsten und am schwersten lesbaren
  Lernendentext (2158 Wörter, LIX 51,5); die Beurteilungstexte sind mit LIX > 60 «sehr
  schwer». DL 8 ist durch meine Umgestaltung am 5.11. um 28 % gewachsen (Abschnitt 6).
- **Die Interaktionsdichte wechselt stark:** 0,5 Felder je Selbsttätigkeitsminute in
  DL 9/10 und 0,5 in DL 3, aber nur 0,06 im Projekt (15 Felder in 260 Min.). Das ist
  teils ein Formatunterschied (Notebook, Journal), bedeutet aber: Im Projekt gibt es
  wenige Punkte, an denen Verständnis sichtbar wird.

### 2.2 Roter Faden und Nahtstellen

| Übergang | Was trägt | Was fehlt | Urteil |
|----------|-----------|-----------|--------|
| DL 1→2 | Rückblick, Abruf (Tabelle Schach/Spamfilter) | Drei Leitfragen in DL 1; das Anfangskriterium «Wann ist ein System intelligent?» wird nie geprüft [G] | tragfähig, mit Bruch |
| DL 2→3 | Bild EVA/Erfahrungsschatz, «drei Lernsignale» | «Label» und «überwacht» werden am Neuron nie benannt (Begriffsmatrix: «Label» in DL 3 = 0×) [G]; Rückblick ist Aussage statt Abruf | dünn |
| DL 3→4 | Hook «Neue Herausforderung: XOR», Vermutung | XOR schon in KP für DL 3 [G]; NAND wird gebraucht, ist aber ungeplant [A] | stark, Quellen widersprüchlich |
| DL 4→5 | Callout «Ausblick auf das Bildprojekt», Bereit-Check | Methodenwechsel und Selbstorganisation auf einmal; Frage 3 prüft Ungelehrtes [G]; Sprung 2→1280 Eingaben nur behauptet [A]; Epoche, Merkmal und eine Erklärung des Startwerts fehlen im Pflichtweg [G, A] | **dünn (grösste Lücke)** |
| DL 5→6→7 | Fahrplan mit Etappen, Richtwerte statt Termine | Zeitleiste Foto/Thema widersprüchlich [G]; DL 6 Engpass, Fading-Klippe [A, H]; Rückstau in DL 7 [H] | tragfähig, risikoreich |
| DL 7→8 | «Ausblick auf DL 8», Rückblick «mit denselben Regeln», Transfer-Tabelle mit Spalte «Wo?» | Etappe 1 (Dateilogistik) ohne Zeitbudget [G]; für die Rückmeldung kein Zustellweg beschrieben [G] | tragfähig |
| DL 8→9 | – | Rückblick generisch; «Transferfrage für DL 10» steht nur in KP; der Anker «ein Modell antwortet immer» bleibt ungenutzt [A] | **Bruch** |
| DL 9→10 | Leitfrage «Wer trägt die Folgen?» | Alle drei Fälle sind Scoring-Systeme; eigene KI-Nutzung bleibt unthematisiert [A] | rhetorisch |
| DL 10→Ende | Vorher-/Nachher-These | Abschluss fragt nach Zufriedenheit statt nach Synthese; keine Rückbindung an die Leitfragen; Antworten bleiben im Browser [G] | schwach |

### 2.3 Begriffsfluss

Vorkommen zentraler Begriffe auf den Lernendenseiten (Stichwort-Proxy; Notebooks und
Materialien sind nicht erfasst, Synonyme werden nicht erkannt):

| Begriff | DL 1 | DL 2 | DL 3 | DL 4 | DL 5–7 | DL 8 | DL 9 | DL 10 | in n DL |
|---------|-----:|-----:|-----:|-----:|-------:|-----:|-----:|------:|--------:|
| Wenn-dann-Regeln | 15 | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 3 |
| Trainingsdaten/-beispiele | 1 | 0 | 2 | 1 | 5 | 0 | 0 | 0 | 4 |
| Label/Zielwert | 0 | 12 | 0 | 1 | 0 | 0 | 0 | 0 | 2 |
| überwacht/unüberwacht/Belohnung | 0 | 18 | 0 | 0 | 0 | 0 | 0 | 1 | 2 |
| Gewicht | 0 | 0 | 31 | 11 | 5 | 0 | 5 | 0 | 4 |
| Bias (Neuron) | 0 | 0 | 26 | 7 | 0 | 0 | 0 | 0 | 2 |
| Schwelle/Aktivierung | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 2 |
| Lernregel/Lernrate/Korrektur | 0 | 0 | 13 | 2 | 0 | 0 | 0 | 0 | 2 |
| XOR/Trennbarkeit | 0 | 0 | 0 | 24 | 1 | 0 | 0 | 0 | 2 |
| Zwischenschicht/versteckt | 0 | 0 | 0 | 24 | 1 | 0 | 0 | 0 | 2 |
| Validierung | 0 | 0 | 0 | 1 | 12 | 4 | 0 | 0 | 3 |
| Testdaten/Abschlusstest | 0 | 0 | 0 | 1 | 23 | 13 | 0 | 0 | 3 |
| Datenleck | 0 | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 1 |
| Startwert | 0 | 0 | 1 | 4 | 4 | 6 | 0 | 0 | 4 |
| Merkmale/MobileNet/Transfer | 1 | 1 | 3 | 4 | 13 | 3 | 0 | 0 | 6 |
| Epoche | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 1 |
| Modellwert/Wahrscheinlichkeit | 3 | 0 | 0 | 1 | 0 | 4 | 0 | 0 | 3 |
| Grenzen/Unsicherheit | 0 | 0 | 0 | 3 | 6 | 4 | 3 | 0 | 4 |
| Sprachmodell/Token/Einbettung | 3 | 0 | 0 | 0 | 0 | 0 | 6 | 2 | 3 |
| nächstes Wort/Wortfolge | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 0 | 1 |
| Halluzination/erfunden | 0 | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 2 |
| Verzerrung/Fairness | 0 | 0 | 0 | 0 | 4 | 1 | 0 | 4 | 3 |
| Rückkopplung/Teufelskreis | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 1 |
| Verantwortung/Folgen/Schaden | 3 | 0 | 0 | 4 | 2 | 0 | 2 | 12 | 5 |

Fünf Beobachtungen:

1. **Das Neuron-Vokabular endet nach DL 4.** Gewicht, Bias, Schwelle und Lernregel
   kommen in DL 5–8 kaum noch vor (Bias 0×, Lernregel 0×). Im Projekt heissen die Dinge
   «Neuronen», «Epochen», «Startwert», «Merkmale». Die Verbindung zwischen beiden
   Vokabularen wird nirgends ausgesprochen; die Brücke «2 → 1280 Eingaben» ist nur ein
   Satz plus Callout [G, A].
2. **Das Projekt benennt seine Lernart nie.** «Label» und «überwacht» kommen nur in DL 2
   vor, die Projektseiten sprechen von «Klassen» [G]. Die Lernziele-Seite verlangt jedoch
   «Ich erkläre Labels, Gewichte, Vorhersage und Epoche».
3. **Verlangt, aber nicht eingeführt:** *Epoche* (Lernziel; auf den Seiten nur als
   Parameter; kein Glossareintrag) [G], *Überanpassung* (Lernziel und Glossar, aber keine
   Aufgabe in DL 5–7) [G], *Verwechslungsmatrix* und *Bildmatrix* (Lernziele, Bewertung)
   [G], *Startwert*, *Modellwert*, *Trennschärfe*, *Lernrate* (nicht im Glossar mit
   29 Einträgen) [G], *Token* und *Einbettung* (DL 9) sowie *Fairness* und *Stellvertreter*
   (DL 10) [A].
4. **Die Datenregel läuft als Spirale, aber nicht bis zum Ende.** DL 5 führt sie ein, DL 8
   wendet sie an (Transfer-Tabelle). «Datenleck» fällt im DL-8-Lesetext jedoch nicht
   (nur im Platzhalter des Prüfberichts) [G]. In DL 10 kehrt weder die Datenregel noch
   «Hintergrund und Licht» als Stellvertreter-Beispiel wieder [A].
5. **Der rote Faden bleibt implizit.** «Vorhersage ≠ Garantie» trägt DL 1, 3, 5–10, wird
   aber nie als Faden benannt und nie über mehrere DL hinweg abgerufen.

### 2.4 Führung, Gerüste und Fading

Die Architektur «erst Instruktion, dann gerüstetes Entdecken» ist gut begründet
(Alfieri et al. 2011: unassistiertes Entdecken unterlegen, angereichertes überlegen;
Hmelo-Silver et al. 2007: Problem- und Inquiry-Formate arbeiten mit starkem Scaffolding).
Offen ist, ob die Gerüste im Projekt dieses Etikett verdienen.

*Vorhanden:* enger fachlicher Rahmen (Frage, Design, Parameter und Reihenfolge fix),
Lernpfad mit eingeklappter Lösung (Predict-then-check), Übungsmodus und Ersatzdaten,
Beratungskarte, Satzgerüst für Reflexion 3, Importcheck, Testsperre.

*Fehlend oder unsichtbar:*

- Ein kommentiertes **Deutungsbeispiel mit Zahlen** vor dem eigenen A/B-Vergleich (DL 6);
  die einzige Pipeline-Grafik liegt im optionalen Lernlabor [A].
- Ein **Ort für die Rückmeldeschleife:** Es gibt keine Fortschrittsansicht für die
  Lehrperson, kein Peer-Zwischenfeedback auf Reflexionstexte, keinen Plan-B-Auslöser [A].
- Eine **zweite, kleinere Klippe in DL 8**: Die Lehrperson ist 100 Min. an Einzelgespräche
  gebunden, ausgerechnet beim technisch fragilsten Teil ist Beratung ausgeschlossen [A].
- **Use–Modify–Create** in den Notebooks: DL 3 (Experiment 2 startet mit der Lösung), DL 4
  (Pflichtnotebook zeigt Zielmuster, rechnet fest verdrahtet) und DL 5 (Leck-Notebook
  zeichnet nur, rechnet kein Leck) lassen kaum Modify-Aufgaben zu [A].

### 2.5 Lernziele, Anspruchsniveau, Beurteilung

Kernverben der Lernziele (`planung.json`, Feld `goal`) und die kognitive Anforderung
(eigene Einordnung in Anlehnung an die revidierte Bloom-Taxonomie von Anderson &
Krathwohl 2001; in dieser Recherche nicht neu verifiziert):

| DL | Kernverben | Anforderung |
|----|-----------|-------------|
| 1 | unterscheiden, zuordnen, begründen | Verstehen, Analysieren |
| 2 | unterscheiden (an Beispielen) | Analysieren |
| 3 | erklären, berechnen, nachvollziehen | Verstehen, Anwenden |
| 4 | begründen, zeigen | Verstehen, Bewerten |
| 5 | unterscheiden, erkennen, erstellen, planen | Analysieren, Erschaffen |
| 6 | steuern, auswerten | Anwenden, Bewerten |
| 7 | abschliessen, belegen, reflektieren | Bewerten |
| 8 | erklären, untersuchen, experimentieren, begründen | Analysieren, Bewerten |
| 9 | untersuchen, unterscheiden | Analysieren |
| 10 | prüfen, erklären, begründen | Bewerten |

- **Der Anspruch steigt stimmig:** Verstehen/Anwenden (DL 1–4), Analysieren/Bewerten/
  Erschaffen (DL 5–8), Analysieren/Bewerten (DL 9–10).
- **Beurteilt wird nur DL 5–8.** DL 1–4 bleiben formativ im Browser, DL 9–10 «zählen nicht
  nachträglich zur Projektnote». Das sind 540 von 900 Minuten (60 %) [G]. Das ist ein
  bewusster Entscheid mit einem Washback-Risiko ([H]: DL 1–4 gelten als «Vorspann», DL 9–10
  nach der Prüfung als «Ausklang»). Grundlagenwissen kommt im Gespräch nur über K7 Stufe 3
  («Gewichte, Training und Vorhersage») vor.
- **Ziele und Evidenz passen nicht überall:** «Erkläre, warum der Abschlusstest erst danach
  erfolgt» verweist auf Reflexion 4, die danach nicht fragt; die konstanten Bedingungen
  (K3 Stufe 3) haben keinen Prompt; DL 9 hat drei Zielversionen (Plan, Lernziele-Seite,
  `KI_Lernziele.md`) [A].

## 3. Lektion für Lektion

Je Lektion: Ziel und Zeit, Stärken, Risiken (nach Wirkung geordnet), Anpassungen. Dateien
liegen unter `ks/`, sofern nichts anderes steht. Kennzeichnung wie in Abschnitt 0.

*Hinweis zu den Anpassungen:* Vorschläge, Pflicht und Wahl in den Kursunterlagen zu
kennzeichnen (Badges, Pflichtweg, «Niveau B», «Vertiefung»), sind durch den Entscheid der
Lehrperson vom 6. November 2026 hinfällig (Abschnitt 7, R3). Die Zeitbefunde bleiben
gültig; welche Inhalte zum Unterricht gehören, zeigt die AVIVA-Planung.

### DL 1 · Was ist KI? (`einstieg`)

*Ziel und Zeit.* Feste Regeln und Lernen aus Daten unterscheiden, fünf Fälle der
spezifischsten Kategorie zuordnen, zwei Grenzfälle begründen, die Leitfrage mit einem
eigenen Beispiel beantworten. Lehrperson 23 · Plenum 5 · einzeln 12 · Tandem 50 Min.;
keine Notebooks.

*Stärken.*

- Bedarf vor Instruktion: Die Lernenden schreiben mindestens fünf Wenn-dann-Regeln für
  Katze/Hund, eine andere Gruppe sucht Gegenbeispiele. Das ist nah an Productive Failure
  mit Peer-Feedback [A].
- Think-pair-share, Kontrastpaare (Ampel/Schach, Baum/tiefes Netz), Karten-Feedback.
- Gegen Anthropomorphismus: Eliza «verstand die Aussagen nicht wie ein Mensch»,
  «Bewusstsein ist nicht dasselbe wie allgemeine Intelligenz».

*Risiken.*

1. **Drei Leitfragen.** Lektionskarte («Wann ist ein System intelligent, und worin
   unterscheiden sich feste Regeln vom Lernen aus Daten?»), Kapitel 9 («Ist jedes
   automatisch arbeitende Programm eine KI?») und `materialien.md` («Mein Kriterium für
   Intelligenz …»). Die Musterlösung beantwortet nur die Kapitel-9-Variante; das
   Anfangskriterium wird nie geprüft [G].
2. **Pflichtkern nicht benannt.** KP: Meilensteine und Asimov sind Wahl, drei statt vier
   eigene Beispiele. Plan: Asimov/Schulweg 15 Min. Pflicht. Seite: sechs Kapitel offen,
   nur vier Altfelder als «Wahlvertiefung»; Kapitel 3 und 4 ohne Zeitrahmen. Ergibt
   ≈ 35–40 Min. Pflicht bei 30 Min. Tandemzeit [A, H].
3. **Falsch verallgemeinerter Satz** (`einstieg/020` Z. 97): «Ein Entscheidungsbaum ist
   maschinelles Lernen ohne tiefes Netz.» DL 2 nutzt einen handgebauten Baum als Beispiel
   für regelbasierte Systeme [G]. Risiko: Fehlvorstellung «Baum = ML».
4. **15 Min. Input ohne Zwischenauftrag** für fünf Blöcke (≈ 10 Begriffe), danach 5 Min.
   Tandem ohne Reserve [A].
5. **KI/Nicht-KI ohne Abgrenzungskriterium** («regelbasierte KI» vs. Automatisierung);
   Sortierkarten tragen Signalwörter («trainiertes Bildmodell»); «zwei Grenzfälle
   begründen» hat kein Feld [A].
6. **Textgleich mit der 1. Klasse** (`basis-ki`, bis auf 7 Zeilen der Startseite) [G].
   Zu klären: Wiederholen die Lernenden den Stoff? Falls ja, ist es eine Chance für Abruf
   über Jahre, aber nicht für Wiederholung; falls nein, ist das Niveau für 17–18-Jährige
   zu prüfen. *Entscheid 6.11.2026:* Die 4. Klasse hatte noch kein KI-Thema, es ist keine
   Wiederholung.
7. «Deep Blue lernt nicht aus Daten» und «Selbstfahrende Autos stehen vor derselben Art
   von Frage» sind vereinfacht bzw. umstritten und gehören in die Fachprüfung [A, H].

*Anpassungen.* Eine Leitfrage; 2–3 Kriterien an die Tafel und am Ende aufgreifen.
Pflicht/Wahl-Badge und Pflichtweg 1→2→5→9 in der Lektionskarte. Input 2 × 7 Min. mit
Abruffrage («Ampel – KI? Warum?»). Entscheidungsbaum-Satz korrigieren («gelernter Baum =
ML, handgebauter = regelbasiert»). Drei Prüffragen für KI/Nicht-KI (Braucht ein Mensch
dafür Intelligenz? Flexibel bei Neuem? Regel gegeben oder gelernt?). Zwei Karten ohne
Signalwort und Felder für die Grenzfälle.

### DL 2 · Wie lernt KI? (`lernarten`)

*Ziel und Zeit.* Wissensbasierte und lernende Systeme sowie drei Lernarten an Beispielen
unterscheiden. Lehrperson 15 · Plenum 25 · einzeln 7 · Tandem 43 Min.; keine Notebooks,
sechs externe Tools plus physisches Memory.

*Stärken.*

- Kontrastdesign: gleiches Material, drei Informationsarten (Memory-Runden).
- Abruf und Selbsterklärung (EVA-Erklärung «für jemanden, der noch nie von KI gehört hat»).
- Analogiegrenze im Material: «Hier lernen Menschen. Das Memory trainiert kein KI-Modell.»
- Label-Qualität («Waren die Labels eindeutig und konsistent?») als Vorgriff auf DL 5;
  Datenschutzhinweise bei Akinator und Quick, Draw!.

*Risiken.*

1. **Pflicht/Wahl unsichtbar** [A]: Der Plan nennt Smiley, K-Means, Akinator, Filmlandkarte
   und Begriffscheck «Wahlvertiefung», die Seite zeigt alles gleichrangig (6 von 11 Feldern
   sind Wahl). Wer der Seite folgt, braucht ≥ 100 statt 90 Min. [H].
2. **Individuelle Sicherung ohne Feld** [A]: Der Plan verlangt die Leitfrage «Wie lernt
   KI?» in 2–3 Sätzen einzeln, die Seite hat nur das kollektive Feld `memory`. Die
   Lehrperson «hält fest: Das Bildprojekt lernt überwacht», bevor die Lernenden antworten.
3. **Akinator widerspricht der Kategorie** [G]: `lernarten/020` führt ihn als wissensbasiert
   («lernt aber nicht selbst aus Beispielen», Z. 12), im selben Kapitel steht «Akinator
   nutzt im Hintergrund auch frühere Antworten» (Z. 27).
4. **Memory Runde 3** [G, H]: «Ein Treffer gibt +1 Punkt, ein Fehlversuch 0»
   (`lernarten/070`). Aufgedeckte Karten zeigen das Ergebnis ohnehin; man wird durch
   Merken besser, nicht durch Belohnung. Die Runde illustriert Gedächtnis, nicht
   Belohnungslernen.
5. **«Erfahrungsschatz» ist vierfach definiert** (gespeichertes Wissen, beschriftete
   Trainingsbeispiele, Parameter, gelernte Gewichte). Dazu «neue Erfahrungen können ihn
   verändern» ohne Unterscheidung von Training und Anwendung. Das begünstigt die
   dokumentierte Fehlvorstellung «KI lernt bei jeder Nutzung weiter» (Marx et al. 2024)
   [A].
6. **Die Spirale fehlt:** «überwacht» wird am Neuron nie benannt (Begriffsmatrix) [G]; die
   Lernart des Bildprojekts steht nur in DL 2.
7. NIM: 25 Min. Plenum am Beamer, die Seite hat nur einen Link und kein Feld (Zuschauen
   statt Handeln); Memory mit 5 Rollen in 3 Runden bedeutet, dass mindestens 2 Personen
   nie «Agent» sind [A, H].
8. **Textgleich mit der 1. Klasse** (`basis-lernen`) [G]; Memory könnte auf 17–18-Jährige
   zu spielerisch wirken [H].

*Anpassungen.* Exit-Ticket-Feld mit einem ungesehenen Beispiel (z. B. Empfehlungsdienst):
erst schreiben, dann klären. «Wahl»-Badges auf Kapitel 2, 3, 9. Definitionskasten
«Erfahrungsschatz = Parameter nach dem Training». Akinator durch ein eindeutig
regelbasiertes Beispiel ersetzen. «Grenze der Analogie» auf die Seite. Ein Satz «Das
Neuron lernt überwacht» in DL 3 und «Welche Lernart? Woran erkennen Sie das?» in DL 5.

### DL 3 · Wie entscheidet ein Neuron? (`perzeptron`)

*Ziel und Zeit.* Gewicht und Bias erklären, die Ausgabe eines Neurons berechnen, einen
Lernschritt nachvollziehen. Lehrperson 15 · Plenum 12 · einzeln 12 · Tandem 51 Min.;
ein Notebook mit drei Experimenten.

*Stärken.*

- Worked Example → Completion: Die Lehrperson rechnet zwei Fälle vor, das Tandem den
  dritten [A].
- Vorhersage vor Beobachtung; Fehlvorstellungsabwehr («weiss nicht, was AND oder «Spam»
  bedeutet»); Sofort-Feedback im Notebook (✓/✗, «x/4 richtig»).
- Wirksame technische Entlastung (Notebook beim Ankommen gestartet, 10 Min. Puffer,
  Papierersatz). Rechnungen stimmen [A].

*Risiken.*

1. **XOR-Widerspruch** [G]: KP (Z. 68) nennt «XOR-Grenze» als Pflicht in DL 3, der Plan
   führt XOR erst in DL 4 ein. Wer KP folgt, unterrichtet XOR doppelt; der DL-4-Hook
   («Neue Herausforderung») verpufft.
2. **Pflichtkern unsichtbar** [A]: Die Seite `050` hat 29 Felder ohne Pflicht-Label, der
   Plan verlangt nur Experiment 2 (AND/OR). Nur etwa 9 der 25 Nicht-Optional-Felder haben
   einen Zeitslot.
3. **Experiment 2 bietet kaum Entdeckung** [A]: `live_gatter('AND')` startet mit der
   Lösung (1/1/−1,5), OR ist nur ein Bias-Wechsel, die Lernregel entsteht ohne erlebtes
   Problem.
4. **Lernraten-Versuch zeigt nicht, was er soll** [G]: Mit der Lernregel aus
   `unterricht_tools.py` (AND, Start 0,2/0,2/−0,5) braucht das Neuron bei Lernrate
   0,05/0,2/0,5/1,0 nur 2/3/6/6 Runden; «kleine Rate = langsam» wird nicht sichtbar. Die
   Beispielwerte in MLF (36/13/7/12 Runden) stimmen nicht. Mit NOR wäre der Effekt
   sichtbar (18 vs. 4 Runden). Der Versuch ist optional («Frühere Zusatzversuche»).
5. **Vorwissen = Wiedererkennen:** Die 2 Min. wiederholen die Ankommen-Tabelle; «Label»
   und «überwacht» fehlen im Seitentext [G, A].
6. Die Lernregel rechnet nie jede Person selbst: Lehrperson-Demo 6 Min., Experiment 3
   freiwillig; die passende Übung (Arbeitsblatt Aufgabe 2) ist nur verlinkt [A].
7. Zwei verschiedene «Schwimmbad»-Beispiele (zwei Eingaben vs. S/F/P) und uneinheitliche
   Notation (Summe/Schwelle/`s`/`b`/`w₀`; `y` vs. `ŷ`) erzeugen extrinsische Last [A].
8. Die «Entlastung» vom 4.11. erhöhte die gelenkte Zeit von 18 auf 27 Min. [G].

*Anpassungen.* KP und Arbeitsblatt §3 angleichen. Pflicht/Wahl-Marker in `050`.
Experiment 2 mit 0/0/0 starten lassen, die Lösung in die Selbstkontrolle verlegen,
NAND/NOR als Fading-Aufgabe (Tandemzeit 32→20 Min.). Lernraten-Versuch mit NOR und
korrigierte Musterwerte. «Lernschritt selbst rechnen» für alle (5 Min. aus dem Puffer).
Eine Notationskarte. Zu Beginn 3 Min. Freitext-Abruf aus DL 2.

### DL 4 · Warum mehrere Neuronen? (`netze`)

*Ziel und Zeit.* Die XOR-Grenze eines einzelnen Neurons begründen, zeigen, wie eine
Zwischenschicht das Problem löst. Lehrperson 19 · Plenum 17 · einzeln 2 · Tandem 52 Min.;
drei Notebooks (XOR einzeln = Demo, Netze = Pflicht, Ziffern = freiwillig).

*Stärken.*

- Hook und Kontrast («Neue Herausforderung: XOR … Vermuten Sie», «XOR und OR
  unterscheiden sich nur in der letzten Zeile»).
- Mathematik korrekt (Widerspruchsbeweis, Parameterzahlen 160/310/610/1210/2410) [A].
- Fehlvorstellungen adressiert («Mehr Neuronen garantieren keinen Erfolg», Konstruktion
  vs. Training).
- Technik entschärft: Training erst per Klick, scikit-learn nicht im Autostart.

*Risiken.*

1. **Grösster Sprung im Kurs** [A]: 25 Min. am Stück lehrpersonengeführt (Min. 5–30), davon
   10 Min. Algebra-Beweis vor dem 5-Min.-Rätsel. Erstmals gilt eine Aussage über *alle*
   Parameter statt Rechnen mit Zahlen; das Rätsel bestätigt nur noch.
2. **Schluss überfrachtet** [G, A]: Einzelzeit 2 Min. (vor der Entlastung 7) für drei
   Fragen, die «(1,1)»-Erklärung und den Bereit-Check. Plan und Seite fragen Verschiedenes.
   Es gibt keine Auswertung in DL 5; Antworten bleiben im Browser.
3. **KP verlangt Zusatzlast** [G]: «Datenrollen mit Kursgrafik und fünf Gruppenkarten»,
   Freigabe pro Tandem, Fotoauftrag (Z. 74–76) gegen den Plan, der die Datenaufteilung
   ausschliesst und bei 90/90 Min. keinen Puffer hat.
4. **Frage 3 des Bereit-Checks prüft Ungelehrtes** [G]: «Welche Bilder dürfen erst ganz
   am Schluss … geöffnet werden?» (`netze/040` Z. 22). Der Gedanke «Fotos, die es nie
   gesehen hat» kommt im Pflichtweg DL 3–4 nirgends vor, nur im freiwilligen Kapitel 5
   (`netze/050` Z. 117–118) [G]. Die Hilfe lautet «Wenn eine Antwort unklar ist,
   wiederholt die entsprechende Aufgabe …» (Z. 33) und verweist auf keine bestimmte
   Aufgabe [G].
5. **Pflichtnotebook kaum interaktiv** [A]: Zielmuster werden gezeigt, das XOR-Netz ist
   fest verdrahtet; die OR/NAND/AND-Gewichte stehen nur auf der Tafelkarte der
   Lehrperson. Nur «Use», kein «Modify».
6. **Brücke 2 → 1280 Eingaben nur behauptet** [A]; Aktivierungsfunktion, Epoche und
   Startwert werden nicht eingeführt; «darstellen» (existiert ein Parametersatz?) und
   «lernen» (findet das Training ihn?) werden vermischt.

*Anpassungen.* Rätsel (3 Min., mit Vorhersage) vor dem Beweis; Bedingungstabelle im
Tandem ausfüllen statt vortragen; Algebra als Niveau B. Schluss auf 4–5 Min. mit zwei
Fragen (Netz und Brücke), sofortiger Lösung und Stichprobe der Lehrperson. Frage 3 als
«Vorschau, Raten erlaubt» kennzeichnen oder durch eine Brückenfrage ersetzen. Brückenkarte
(R5). Eine Modify-Aufgabe («NAND-Bias 0,5: welche Zeile kippt?»).

### DL 5 · Projekt starten und Arbeit planen (`projekt`)

*Ziel und Zeit.* Training, Validierung und Test unterscheiden, Datenlecks erkennen,
Fünf-Gruppen-Plan erstellen, Arbeit planen. Lehrperson 10 · einzeln 10 · Tandem 70 Min.

*Stärken.*

- Vermutung vor Instruktion; Lernpfad kompakt (≈ 640 Wörter) mit Predict-then-check
  (Apfelfall, Lösung eingeklappt, Merksatz) [A].
- Konsistente Zahlen (2 × 5 × 8 = 80 Bilder; 32/16/32) in Lernpfad, `ki_fotodaten`,
  Musterlösung; Rechenbeispiele als «rein fiktiv» markiert [A].
- Lehrpersoneninput nur 10 von 90 Min.

*Risiken.*

1. **Foto-/Themen-Zeitleiste widerspricht sich** [G, A]: KP (Z. 74/76) gegen den DL-4-Plan
   [G]; Projektauftrag
   («Doppellektion 4: Thema und zwei Klassen freigeben»), `ki_fotodaten` («Fotos möglichst
   bis Doppellektion 5») gegen den DL-4-Plan («Datenaufteilung ausschliesslich DL 5») und
   `projekt/050` («noch keine Pflicht zur Datenplanung»). Folge: Fotos entstehen vor der
   gelernten Unabhängigkeitsregel oder belasten die Unterrichtszeit [H].
2. **Kein externes Verständnis-Gate** [A]: «Vergleichen Sie Ihre Antworten erst, wenn Sie
   alle drei gelöst haben» ist ehrenbasiert, die Lösung steht im selben Dokument, die
   Häkchen sind lokal («keine Abgabe an die Lehrperson»). Fehlvorstellungen (Zufallsaufteilung,
   Serienfotos) fallen erst nach 80 Fotos auf. `data-p1-diagnostic` hat keine Funktion [G].
3. **Das Leck-Notebook rechnet kein Leck** [A]: `u.datenplan(leck=True)` zeichnet Grafik
   und Pfeil; die einzige Einstellung zeigt Training/Validierung/Test bei jedem Lauf.
4. Übungsfälle 3–4 («Epochen erhöht und P1 erneut geprüft», Hintergrund-Fall) stehen nur
   in `materialien.md`, nicht auf der Lernseite [A].
5. Knapp: ≈ 60 Min. Pflicht bei 60 verfügbaren; Freigaben (10 Tandems × 1 Min.) ballen
   sich nach dem Lernpfad [A, H].

*Anpassungen.* Eine verbindliche Zeitleiste (z. B. DL 4: Thema und Klassen mündlich
freigeben, Liste der 10 Exemplare; Fotos erst nach dem Lernpfad) und Angleichung der vier
Dokumente. Exemplarliste vor dem Fotografieren in 2 Min. abnehmen (Lehrperson oder
Nachbartandem mit den fünf Abschlussfragen). Fälle 3–4 in `010` übernehmen. Mini-Experiment
(Bilder desselben Exemplars in Training und Test → Trefferquote steigt) oder Notebook
streichen. Reflexion 2 nach DL 6 verlegen.

### DL 6 · Untersuchen und Entscheidungen begründen (`projekt`)

*Ziel und Zeit.* Den eigenen Arbeitsplan steuern, einen fairen A/B-Vergleich mit Belegen und
alternativen Erklärungen auswerten. Einzeln 10 · Tandem 80 Min.

*Stärken.*

- Gutes Versuchsgerüst: Parameter fixiert («16 Neuronen, 60 Epochen, Startwert 11»), alle
  16 V1-Bilder mit ✓/✗ und Sicherheit, 50-%-Linie, «Keine Fehler: nicht erfinden» [A].
- Use-first: Der Modus `UEBUNG` erlaubt einen Probelauf ohne eigene Fotos; Beratungskarte
  und Satzgerüst für Reflexion 3.

*Risiken.*

1. **Engpass** [A, H]: Restfotos, Fotostudio, Import, A/B-Vergleich, Deutung und Reflexion 3
   ergeben 65–85 Min. in 70. Das Fotostudio nimmt nur JPG/PNG (HEIC), TensorFlow.js und
   MobileNet kommen per CDN, scipy/scikit-learn werden nachgeladen.
2. **Fading-Klippe** [A]: Es gibt kein Deutungsbeispiel mit Zahlen; die einzige
   Pipeline-Visualisierung (`bild_durchs_netz`, mit der Warnung «Modellwert … nicht die
   Wahrscheinlichkeit, richtig zu liegen») liegt im optionalen Lernlabor.
3. **Unsicherheit nur verbal, nicht quantitativ** [G]: siehe «Projekt als Ganzes», G3.
4. Training vs. Validierung wird an eigenen Daten nie erlebt: `vergleich_zeigen` zeigt nur
   V1, die Lernkurve wird nie aufgerufen; das Lernziel «Überanpassung» hat keine Aufgabe
   [A, G für das Glossar/Lernziel].
5. Gleichstand und Deckeneffekt sind nicht aufgabenseitig vorbereitet: Das Journal setzt
   einen Unterschied voraus, die Voreinstellung ist `AUSGEWAEHLT = 'B'`, die Begründung
   braucht nur ≥ 30 Zeichen [A].
6. Der Tagesziel-Zyklus hat keinen Ort (kein Feld; der Plan steckt im überschreibbaren
   Feld `hypothesis`) [A]; kein analoger Ausfallweg für den A/B-Vergleich [A].

*Anpassungen.* Fotos als Exemplar-Etappen schon in DL 5; Go/No-Go «Mitte DL 6 kein Import →
ERSATZ-Daten offen kennzeichnen»; Transferweg Handy→Laptop in den Fahrplan. `bild_durchs_netz`
ins Versuchsnotebook und ein fiktives, kommentiertes Deutungsbeispiel. Eine Zelle mit
Training/Validierung je Variante. Prompt «Bei Gleichstand: …», Voreinstellung leer. Additives
Feld «Tagesziele». Ausdruck eines Referenzlaufs als Deutungsaufgabe.

### DL 7 · Projekt abschliessen und Arbeit überprüfen (`projekt`)

*Ziel und Zeit.* Untersuchung selbstständig abschliessen, Grenzen belegen, Prozess
reflektieren. Einzeln 10 · Tandem 80 Min. (Puffer 15).

*Stärken.*

- Die Testsperre erzwingt Begründung und blockiert den Wechsel nach Einsicht, ehrlich als
  Arbeitsregel deklariert («kein Zugriffsschutz»).
- Reflexion 4 fragt nach Erklärung («Welcher Teil hat Ihre zwei Klassen unterscheiden
  gelernt, und könnten Hintergrund oder Licht mitgeholfen haben?»).
- Teach-back und 10-Min.-Einzelprüfung am Raster bereiten K7–K10 vor; der Übergang zu
  DL 8 ist stimmig.

*Risiken.*

1. **Evidenzlücken Lernziele ↔ Reflexionen** [A, G]: «Erkläre, warum der Abschlusstest erst
   danach erfolgt» (→ Reflexion 4) wird nicht gefragt; die konstanten Bedingungen (K3
   Stufe 3) haben keinen Prompt; «Epoche», «Überanpassung», «Verwechslungsmatrix» stehen in
   Lernzielen und Raster, werden aber nirgends erklärt oder abgefragt [G].
2. **Testausgabe ≠ Aufgabe** [G]: `materialien.md` verlangt «P1: richtig/gesamt» und «P2:
   richtig/gesamt», `abschlusstest()` meldet P1+P2 gemeinsam mit einer Matrix; der
   freiwillige Stresstest (P2 an anderem Ort) ist nicht ablesbar.
3. **Rückstau** [H]: 55–75 Min. Pflicht (offene Etappen, Test, Reflexion 4 und 5, Raster,
   Teach-back, Austauschdateien) bei 45 + 10 + 15.
4. **KI-Nutzung dokumentiert, nicht geregelt** [A]: «Welche Hilfen (auch KI) haben Sie
   benutzt?» steht im selben Feld wie Arbeitsteilung und Planänderung; K1–K6 (18 von 33
   Punkten) hängen an Journaltexten, Beispielantworten je Feld liegen im öffentlichen
   Repository.
5. Gesprächszeiten widersprüchlich (Plan: «bereits bekannt gegebene Zeiten», KP: «vor Ende
   DL 7 mitteilen»); das Musterbeispiel `contribution` modelliert feste Spezialisierung
   («Mia: Fotos; Luca: Import»), obwohl Rollenwechsel gefordert ist [A].

*Anpassungen.* Reflexion 3: «Was blieb konstant, warum?»; Reflexion 4: «Warum erst jetzt P1
und P2?». Testausgabe je Gruppe. Minuten je Pflichtaufgabe nennen, Reflexion 5 teils als
Hausaufgabe. Drei-Zeilen-KI-Regel mit eigenem Feld (R10). Beispiel mit Rollenwechsel.
Zeitpunkt der Gesprächszeiten festlegen.

### Projekt als Ganzes (DL 5–7)

*Zeit.* 270 Min.: Lehrperson 10 (3,7 %), einzeln 30 (11 %), Tandem 230 (85 %, davon 35 Min.
Puffer). Richtwerte statt Termine, je Etappe Link und Häkchen.

- **G1 Kritischer Pfad Foto → Test** [H]: ≈ 185–200 Min. Pflichtarbeit bei ≈ 225
  Nettominuten; die serielle Kette (10 Gegenstände beschaffen → fotografieren → Transfer →
  Studio → Import → A/B → Auswahl → Test) wird von Internet, HEIC und Notebook-Neustart
  verschoben. → Meilensteine («Ende DL 5: Exemplarliste und ≥ 40 Fotos; Mitte DL 6:
  Import»), Mitbring-Auftrag in DL 4/5.
- **G2 Redundanz und Namensdrift** [A]: Die A/B-Definition steht in ≥ 9 Dateien; 6 Etappen
  vs. 5 «Etappen-Checks» vs. 5 Reflexionen vs. 12 Fortschrittsschritte; der Lernpfad heisst
  «Daten fair aufteilen», «Datenregeln lernen» und «Lernstrecke»; «Klasse» meint Bildklasse
  und Schulklasse. → Single Source, Namen vereinheitlichen.
- **G3 Scheinpräzision durch Pseudoreplikation** [G]: V1 = ein Exemplar je Klasse mit 8
  Fotos (`projekt/030` Z. 19), also 16 Bilder von 2 Gegenständen; ein Bild = 6,25
  Prozentpunkte; der Test P1+P2 umfasst 4 Gegenstände. Das Journal fragt nach «A: … % · B: …
  % · Unterschied: … Prozentpunkte» und «… von 32 Bildern richtig»; das Musterbeispiel
  (12/16 vs. 14/16, «B um 12,5 Prozentpunkte besser») nennt immerhin «Licht oder Zufall».
  Das ist der Fehler, den der Lernpfad für Datenlecks lehrt (Fotos desselben Exemplars
  sind nicht unabhängig), nun auf die Auswertung angewendet. Weitere Störfaktoren: *welche*
  Exemplare, 8 vs. 4 Fotos je Exemplar, ein Lauf, Deckeneffekt. Verbal ist Unsicherheit
  gut vermittelt («Ein Lauf ist eine Beobachtung, kein Beweis»), quantitativ nicht. → Satz
  «V1 = 1 Gegenstand je Klasse: 16 Bilder ≠ 16 Tests», Journal-Platzhalter «richtig/gesamt»,
  Faustregel «Unterschied ≤ 2 Bilder = kein Beleg» (Heuristik; Fachperson prüft), Rückbezug
  auf DL 4 (Startwerte 0–5).
- **G4 Rahmen vs. Freiheit** [A]: inhaltlich eng (Frage, Design, Parameter, Reihenfolge fix),
  zeitlich offen: Autonomie bei Thema, Tempo, Rollen und Hilfen. Rückmeldeschleifen sind
  lokal (Häkchen, Balken); die Beratung ist widersprüchlich beschrieben; es gibt kein
  Peer-Feedback auf Reflexionstexte und keinen Plan-B-Auslöser. Schwächere Tandems werden
  nur über Rundgang oder Selbstmeldung erkannt (Hilfesuche ist bei Schwächeren selten, [H]).
- **G5 Individuelle Verantwortlichkeit im Tandem** [A]: «Ein gemeinsamer Stand auf einem
  Gerät», alle 12 Reflexionsfelder gemeinsam, «Einzeln»-Schritte ohne Spur; erste
  individuelle Evidenz erst in DL 8 (K7–K10 = 36 %), K1–K6 (54,5 %) sind gemeinsam.
- **G6 Differenzierung, Datenschutz** [A]: 12 Themen mit Filter, freiwillig Stresstest,
  Startwerte, Lernlabor. «Gut zugänglich» meint Logistik, nicht Schwierigkeit; «Handgesten»
  gilt als leicht, braucht aber fünf Personen und Einverständnis; die Einwilligung für die
  Weitergabe an andere Tandems (DL 8) steht erst im Projektauftrag. Für Schnelle fehlt eine
  Create-Aufgabe jenseits von «mehr desselben».
- **G7 Passung K1–K6** [A]: Reflexion 1→K1, 2→K2, 3→K3 (lückenhaft), 4→K4–K6, 5→K6;
  Pipeline- und Lernpfad-Verständnis (K7, K8) haben vor DL 8 keine schriftliche
  Pflichtevidenz.
- Positiv: Die Erklärung von Transfer Learning ist korrekt und verständlich («eingefroren»
  vs. «lernt»; «Es sieht nur Zahlen … auch Hintergrund und Licht»). Verbesserbar: Sie steht
  hinter einem `<details>`, wird nicht aktiv verarbeitet, und «Kennt nicht: Ihre zwei
  Klassen» ist verkürzt (MobileNet hat 1000 ImageNet-Klassen) [A].

### DL 8 · Fremdmodell prüfen (`fremdmodell`) und Beurteilungssystem

*Ziel und Zeit.* Daten und Ergebnisse eines fremden Tandems prüfen (K11, unbenotet), eigene
Klassen am fremden Modell erproben, Grenzen individuell begründen (K12); parallel laufen die
Einzelgespräche (K7–K10). Einzeln 22 · Tandem 68 Min.; die Lehrperson ist 20 × (4 + 1) = 100
Min. gebunden. 2158 Wörter (LIX 51,5), 23 Felder (19 Pflicht), ein Notebook.

*Stärken.*

- Die Transfer-Tabelle «Vom eigenen zum fremden Projekt» mit Spalte «Wo?» bindet die
  DL-5-Regeln an die DL-8-Aufgaben (Retrieval-Anker) [G, eigene Umgestaltung].
- Kontrastkarten und Merksatz («Ein schlechter Fremdtest … beweist nicht, dass das Tandem
  schlecht gearbeitet hat») schützen das geprüfte Tandem.
- Vermutung vor Beobachtung (`fremd_erwartung`), korrektes «weder noch» in `fremdtest()`,
  Low-Stakes («Bewertet wird Ihre Begründung – nicht ein perfekter Notebooklauf»), eigener
  Stand geschützt (privates Fenster, separates ZIP) [A].

*Risiken.*

1. **Etappe 1 (Dateilogistik) hat kein Zeitbudget** [G, A, H]: Auf der Seite stehen Minuten
   nur für Start (5), Etappe 2 (20) und Etappe 3 (15), also 40 von 90 [G]. Etappe 1
   (zwei ZIPs, privates Fenster, Restore, Notebook-Kaltstart) hängt am 20-Min.-Puffer, der
   zugleich Gesprächsunterbrechungen und Technik abdecken soll und laut KP (Z. 17) nicht
   mit Pflicht belegt sein soll. Realistisch 10–15 statt 1 Min. [H]. Fehlerquellen u. a.:
   Voll-ZIP mit Originalfotos (Limit 550 MB), beide JSON heissen `fotos_<Zeitstempel>.json`,
   Schliessen des privaten Fensters löscht alle Antworten (Seiten warnen nicht),
   `fremdtest()` fällt ohne Test still auf Variante «B» zurück [A].
2. **Das Datenaudit, die Kernfrage der Prüfung 1, hat kaum Werkzeug** [A]: `gruppen_zeigen()`
   zeigt P1/P2 nie, das Fotostudio zählt nur, das Protokoll ist rohes JSON mit 80
   Bildeinträgen; die 5-Zeilen-Prüftabelle (K11) steht nur in `materialien.md`.
3. **Rückmeldung ohne Adressat** [G, A]: «Schreiben Sie dem anderen Tandem zwei Sätze» (`050`)
   [G], aber `fremd_rueckmeldung` landet im eigenen ZIP für die Lehrperson [A]; ein
   Zustellweg ist auf der Seite nirgends beschrieben [G], K11 ist unbenotet.
   Pro-forma-Sätze sind wahrscheinlich [H].
4. **«Ganz andere Klassen» ist nicht garantiert** [G]: Die Themenwahl darf sich
   überschneiden (`ki_ideenpool.md` Z. 3), KP Z. 139 spricht von «zugeteilten fremden
   Projekten», nennt aber keine Zuteilungsregel (etwa disjunkte Klassen), und
   `fremdtest()` prüft nur «genau zwei Klassen». Bei gleichen Klassen stimmen Merksatz und
   Auswertung nicht mehr.
5. **Trennschärfe und Schwellen** [G]: `trenn = max(gerade, gekreuzt) / n` ist per
   Konstruktion ≥ 50 %, die Ausgabe sagt dennoch «Raten ergäbe etwa 50 %». Zufall liefert bei
   80 unabhängigen Bildern im Mittel ≈ 54,5 %; wenn alle Vorhersagen je Exemplar
   übereinstimmen (5 Exemplare je Klasse), sind es ≈ 62 %, und in ≈ 34 % der Fälle ≥ 70 %
   (eigene Nachrechnung, Anhang A). Bei unabhängigen Bildern wäre eine Trennschärfe ≥ 65 %
   durch Zufall dagegen fast ausgeschlossen (< 1 %). Die Wirklichkeit liegt dazwischen:
   Je stärker die acht Fotos eines Gegenstands gleich beurteilt werden, desto schwächer
   ist die Schwelle «trennt teilweise» (≥ 65 %) als Kriterium. Der Satz «Seine Merkmale taugen für Ihre Aufgabe nicht» (`ki_foto_tools.py`
   Z. 279) kollidiert mit der Kursterminologie: Alle Tandems nutzen dieselbe MobileNet-Basis,
   ungeeignet wäre der trainierte Kopf. «Trennschärfe» ist weder eingeführt noch im
   Glossar [G].
6. **Prüfung 1 ist Wiederholbarkeit, keine Replikation** [A]: Der Nachlauf nutzt dieselben
   P1/P2 und den Kurs-Startwert 11 und ist deterministisch; eine Abweichung deutet eher auf
   Dateiverwechslung als auf einen Fehler des Tandems. Das Etikett «neue Testbilder» passt
   nur teilweise.
7. **Predict–Observe–Explain wird vorweggenommen** [A]: Das Ergebnis steht schon in `010`
   («Es hat dafür keine Ausgänge gelernt und sagt trotzdem …»), der Explainer liegt vor
   `fremd_erwartung`, Pflichtfrage 2 enthält ihre Antwort.
8. **Austausch fremder Fotos** [A]: Getauscht wird das volle Abgabe-ZIP (Namen, Reflexion 5,
   Selbsteinschätzungen, Originalfotos); die «vereinbarte Aufbewahrungsregel» steht
   viermal und wird nie definiert. Ein personenfreies Austauschpaket (`testbilder/`:
   Apfel/Banane, 80 Fotos, CC BY-SA) liegt als Baustein vor, ist aber nicht eingebunden.
9. **Eingabelast** [A]: 19 Pflichtfelder (8 Freitext); der Prüfbericht hat 3 Min. für ≥ 7
   Angaben; die 11 Protokollfelder fehlen im Export-Check.
10. **DL 8 → 9 ohne Brücke** (Abschnitt 2.2).

*Anpassungen.* Etappe 1 mit Minuten und Notfallkarte; Probelauf in DL 7 (5 Min.) mit einem
Referenz-ZIP, das zugleich Plan B ist; «Fenster erst nach dem ZIP-Download schliessen».
Disjunkte Klassenmengen und zyklische Zuteilung (jedes Tandem prüft eines und wird einmal
geprüft). Rückmeldungen von der Lehrperson bündeln und in DL 9 «Ankommen» ausgeben
(«Was nehmen wir mit?»); K11 als Eintrittsbedingung für K12. Schlankes Austauschpaket
(JSON, Protokoll, `Journal.html`, ohne Namen, Originalfotos und Reflexion 5) plus Löschregel
mit Häkchen. Satz Z. 279 korrigieren, Schwellen als «Orientierung bei 5 Exemplaren»
relativieren, «Trennschärfe» ins Glossar, Zusatzfrage «Höchster Modellwert bei einem Bild
ausserhalb beider Klassen – was sagt das über Modellwerte?». Prüfbericht als 5-Zeilen-Tabelle;
Explainer erst nach dem Versuch (`<details>`), Erwartung einzeln notieren.

**Beurteilungssystem (kursweit).** 33 Punkte: K1–K6 Projekt (18, gemeinsam), K7–K10
Einzelgespräch (12), K11 unbenotet, K12 persönliche Reflexion zu DL 8 (3). Note =
1 + 5 × Punkte / 33, auf Viertel gerundet.

*Stärken:* transparentes Raster und Notenformel, Low-Stakes in DL 8, mündlicher Teil als
Gegengewicht zu gemeinsam erstellten Texten.

*Risiken:*

- **B1: 60 % der Kurszeit ohne beurteilte Evidenz** [G] (Abschnitt 2.5).
- **B2: 4 Min. Gespräch = 12 Punkte (36,4 %)** [A]. Eine Minute je Kriterium ergibt eine
  Beobachtung; ein Punkt entspricht 0,15 Notenpunkten, die Viertelnotenrundung wirkt
  scheingenau [H]. Im Repository gibt es keinen Leitfaden, Fragenpool oder Bogen; drei
  Fragenfassungen existieren nebeneinander (Notebook-Zelle 23, Bewertungsseite, Planungs-
  tabelle). Offen sind Fragenweitergabe über 100 Min., Ermüdung, Slot-Fairness und
  Absenzen (keine Ersatztermine) [H].
- **B3: Raster** [A]: Deskriptoren teils nicht beobachtbar («klar», «verständlich»); «höchste
  vollständig erfüllte Stufe» ergibt Hürdenlogik; K3 Stufe 0–1 ist kaum erreichbar (das
  Notebook fixiert die Einstellungen), K4 «einmaliger Abschlusstest» nicht prüfbar (die
  Sperre ist kein Zugriffsschutz) → Deckeneffekt, geringe Trennschärfe; keine
  Ankerbeispiele, ein Rater, Interrater-Reliabilität nicht prüfbar; K12 ist im Web
  (Stufe 3 «unterschieden … und Folgetest») und in `KI_Bewertungsraster.md` (Stufe 2
  «Unterschied … begründet») verschieden definiert.
- **B4: Gewichtung und Überlappung** [A]: Datentrennung zählt in K2, K4, K8 und K12 (12
  Punkte = 36 %), «nächster Versuch» in K6, K10, K12 (9 Punkte = 27 %); ein Verständnisfehler
  kostet mehrfach. K12 (3 Punkte = 9,1 %) bewertet unbeaufsichtigte Texte, deren Stufe 3 die
  Pflichtfrage vorgibt.
- **B5: Notenschlüssel** [G]: Alle Kriterien auf Stufe 2 («alle Anforderungen erfüllt») =
  22 Punkte = 4,33 → 4,25; 26 Punkte → 5,0; 32 Punkte → 5,75; 6,0 nur mit 33 Punkten. Das
  Beispiel «24,75 Punkte → 4,75» (`bewertung` Z. 143) ist bei ganzzahligen Stufen unmöglich;
  «Individuell · 33,3 %» (Z. 170) widerspricht 36,4 % (Z. 14, 26). Offen: Ist Stufe 2 die
  Sollstufe? *Entscheid 6.11.2026:* Ja (22 Punkte = 4,25).
- **B6: Individuelle Verantwortung und KI** [A]: Journal als gemeinsamer Stand ohne Autorenspur,
  Rollenwechsel nur Empfehlung, K12-Texte entstehen unbeaufsichtigt; zu KI gibt es nur eine
  Offenlegungsfrage, keine Nutzungsregel.
- **B7: Transparenz und formative Nutzung** [A]: Kriterien werden in DL 5 erklärt und in DL 7
  zur Selbstprüfung genutzt, nie in DL 1–4. Es gibt zwei Selbsteinschätzungssysteme (10
  Skills nur für DL 5–8, K1–K12-Selbstcheck mit Notenrechner) ohne Zuordnung und ohne
  Nutzung durch die Lehrperson. Vor der Note gibt es kein inhaltliches Feedback.
- **B8: Inkonsistenzen** [G, A]: K11-Lücke («K1–K10 und K12») in allen Dokumenten;
  `KI_Lernziele.md` ohne DL-8-Ziele; das DL-8-Lernziel mischt ein Beurteilungsformat
  («im vierminütigen Einzelgespräch … erkläre») mit Lernzielen.

*Anpassungen.* Siehe R10: Gesprächsleitfaden mit Pool (je Kriterium drei Varianten),
Indikatoren und Ankerantworten je Stufe, Ein-Seiten-Bogen, Fragenrotation, Absenzregel;
Überlappungen auflösen (K6 nur «Grenze», K10 nur «neuer Fall»); Sollstufe und
Notenschlüssel nennen; Spalte «Wo beurteilt?» je Lernziel mit einer Grundlagenfrage aus
DL 3/4 im Gespräch (30 s); Selbsteinschätzung in DL 7 (5 Min.) mit einem Abgleichspunkt im
Gespräch; Zweitbewertung von drei Proben.

### DL 9 · Wie entstehen Sprachmodelle? (`sprache`)

*Ziel und Zeit.* Den Einfluss von Kontext untersuchen, ein Wortfolgemodell von einem
neuronalen Sprachmodell unterscheiden. Leitfrage: «Warum ist eine plausible Fortsetzung
nicht automatisch wahr?» Lehrperson 17 · Plenum 4 · einzeln 14 · Tandem 55 Min.; 836
Wörter, 36 Felder (Pflicht ≈ 17 mit Soekia), keine Notebooks.

*Stärken.*

- Die Leitidee «plausibel ≠ wahr» zieht sich durch (Spalten «Plausibel?»/«Wahr?» mit
  Option «Nicht prüfbar», Offline-Beispiel «Die Hauptstadt der Schweiz ist …» → «Zürich.»).
- Ehrliche Grenzen: «Ob man das «Verstehen» nennen soll, ist unter Fachleuten umstritten»;
  die Variablenkontrolle «nur Kontext oder Wortwahl» knüpft an die A/B-Logik an; ehrlicher
  Ausfallweg («didaktisch konstruierte Beispiele, keine gemessenen Tool-Ausgaben») [A].

*Risiken.*

1. **Der Digitalkern verfehlt «Kontext untersuchen»** [G, A]: `sprache/030` verlangt «Untersuchen
   Sie mit Soekia den Einfluss von Kontext und Wortwahl» ohne Link und ohne Einstellungen
   (Soekia erlaubt n-Gramm-Längen bis 6 (Hielscher et al. 2025) und laut Agent eine Temperatur);
   «Wortwahl» ist undefiniert; das inf-schule-Tool arbeitet laut Agent immer mit
   Trigrammen, der Kontext ist dort also fix [A].
2. **Beide Digitalwege sind Häufigkeitsmodelle** [A]: Das neuronale Modell wird nur erzählt
   (Input 15 Min.), die Kapitel-6-Aufgabe hat keinen Zeitplatz. Ergebnis: ≈ 40 Min.
   Erfahrung mit Zählen, 2 Min. Korrektur; Risiko «ChatGPT ≈ Soekia» [H].
3. **Die Brücke zu echten Modellen ist dünn** [A]: Es fehlen u. a. Vortraining →
   Feinabstimmung (= Transfer Learning des Bildprojekts), «Wörter als Zahlen» (≈ «1280
   Merkmale»), Zufall/Temperatur und «antwortet immer» als Ursache von Halluzinationen.
4. **Zeit und Reihenfolge** [A, H]: «Einzeln 10 Min.: Erwartung» steht im Plan nach dem
   40-Min.-Tandem, obwohl sie «vor dem digitalen Arbeitsweg» gemeint ist; das Vorwissen
   (10 Min.) dauert eher 12–14 Min.; Informieren (15 Min.) ist ein Monolog.
5. **Sicherung diffus** [A]: Vier Freitexte mit ähnlichem Kern plus Erwartung; das Gerüst «Ob
   es wahr ist, prüfe ich durch …» hat kein Feld; 2 Min.
6. Drei Zielversionen; «Trainingsmaterial» wird nirgends untersucht; das «problematische
   Beispiel» ist mit kleinem Korpus kaum zu finden [A].
7. Das Turing-Kapitel (Live-Chat mit Fremden, «chatroulette game») liefert weder
   Kontextvergleich noch «plausibel/wahr» und ist ein Datenschutzthema [A].
8. **Eigene Nutzung und Quellenprüfung fehlen** [A]: kein echtes Sprachmodell im Unterricht,
   keine Frage «Wie prüfe ich Chatbot-Antworten?».
9. **Fachlich** [A]: «mit denselben Bausteinen … nur mit Milliarden von Gewichten» lässt die
   Architektur weg (Risiko «grosses XOR-Netz»); «das nächste Token vorhersagen» gilt fürs
   Vortraining, nicht pauschal fürs Chat-Produkt; «Wahr?» für ein einzelnes Wort ist ein
   Kategorienfehler; die Metapher «Papagei» kann «LLM wiederholt nur» nahelegen.

*Anpassungen.* Soekia als Pflichtweg mit Link und Drei-Zeilen-Anleitung (n von 2 auf 5,
Temperatur), den Papagei-Weg als Vertiefung. «Erwartung» in 2 Min. mit echter Prognose und
Feld, vor dem Digitalweg. Brücke in vier Sätzen (R6). Ein Sicherungsfeld «Ich prüfe
KI-Aussagen, indem …» (4 Min.). Das problematische Beispiel durch eine Änderung des
Trainingstextes selbst erzeugen lassen. Turing nur als Vertiefung oder mit drei
vorbereiteten Transkripten.

### DL 10 · Wer trägt die Folgen? (`gesellschaft`)

*Ziel und Zeit.* Ein Modell mit Opacity, Scale und Damage prüfen, eine Rückkopplung
erklären, eine überprüfbare Massnahme mit Zielkonflikt begründen. Leitfrage: «Sind gleiche
Regeln automatisch fair?» Lehrperson 20 · Plenum 12 · einzeln 21 · Gruppe 37 Min.; 1072
Wörter plus TED-Video (≈ 13 Min., englisch); 30 Felder (14 im WMD-Check).

*Stärken.*

- Vorher-/Nachher-These plus Schlussurteil: Belief-Revision-Evidenz und eine echte Leitfrage.
- Die WMD-Tabelle führt von «Beispiel aus dem Video» über «Unser Fall» zu «Unser
  Bildprojekt» (Worked Example → Completion → Kontrast); «Unklar» ist zulässig; «Das Etikett
  «WMD» ist eine Einschätzung, kein Beweis».
- Tragfähige Fälle («Das Modell erfährt nie, was aus den abgelehnten Personen geworden
  wäre»), ausgewogene Quellenkritik («Ein TED Talk ist eine zugespitzte Warnung, keine
  Studie»), verbindliche Massnahme («Wer ändert was? Woran erkennen wir die Verbesserung?
  Welcher Zielkonflikt bleibt?») [A].

*Risiken.*

1. **Der Abschluss ist Evaluation, keine Synthese** [G]: `gesellschaft/060` fragt nach
   «wichtigster Erkenntnis», offener Frage, «Am meisten gebracht hat mir», «Das würde ich im
   Themenblock ändern». Es gibt keine Rückbindung an die zehn Leitfragen, und die Antworten
   bleiben im Browser. Der rote Faden «Vorhersage ≠ Garantie» bleibt implizit.
2. **Sprachmodell-Folgen und eigene Nutzung fehlen** [A]: Die Fälle sind Bewerbung, Schule,
   Kredit; die DL-9-Frage «Wer trägt die Folgen falscher, aber überzeugender Ausgaben?» bleibt
   unbeantwortet, die KI-Hilfen-Frage des Journals wird nie reflektiert.
3. **Sicherung knapp** [A]: 2 Min. für vier Elemente (Schlussurteil, Begründung, Folge für
   Betroffene, überprüfbare Gegenmassnahme, ≈ 70 Wörter). `materialien.md` nennt als
   Antwortort das «Schlussurteil auf der Kursseite», die Seite hat aber nur
   `these_begruendung` und `urteil_massnahme`.
4. **Seite ≠ Plan** [G, A]: Das 20-Minuten-Debattenskript (1+5+10+4 Min.) samt `crit_seite`
   widerspricht KP («keine zusätzliche Pro/Contra-Aufstellung und keine zweite
   Fallrotation»); Gruppenarbeit 27–30 von 37 Min. ohne Debatte, mit Debatte nicht [H].
5. **Informieren 20 Min.** [A]: Das englische Video lässt kaum Platz für einen
   Beobachtungsauftrag, ohne Hinweis auf Untertitel/Transkript und ohne Ersatzweg (Punkt 6
   der Redaktionsprüfung).
6. **Die Projekterfahrung dient nur als Etikett** [A]: «Unser Bildprojekt» endet bei «Keine
   WMD»; «Hintergrund und Licht» als Stellvertreter und die Transparenz des Projekts als
   Gegenmodell zu Opacity bleiben ungenutzt.
7. **Die Massnahme ist dreifach vorgegeben** (Material, Option `einspruch`, Musterlösung):
   Ankereffekt; Betroffene bleiben abstrakt, der Seitenwechsel steckt nur im Debattenskript
   [A, H].
8. **«Fair» ist undefiniert** [G, A]: Das Glossar hat weder Opacity/Scale/Damage noch
   Rückkopplung [G]; «gleiche Regeln» (DL 1: Wenn-dann) ≠ gelernte Modelle; die
   WMD-Kriterien messen Gefährlichkeit, nicht Fairness; der Kernkonflikt «einheitliche
   Regeln vs. Korrektur historischer Benachteiligung» steht nur in der Musterlösung [A].
9. **Fachlich** [A]: Die Kausalkette «Geschäfte und Häuser gehen ein» (`rueckkopplung.svg`)
   steht als Tatsache statt als Modellannahme; im Fall «Schule» heisst es «Fördermassnahmen»
   (Seite) und «weniger anspruchsvolle Kurse» (Material), was verschiedene Damage-Urteile
   ergibt; `wmd_video_u` kennt «unklar», der Select nicht. Realitätsanker mit Kursbezug (zu
   prüfen): Alle drei Fälle liegen in Hochrisiko-Bereichen des EU-AI-Acts; Art. 21 nDSG
   (automatisierte Einzelentscheidung: Information, Anhörung, menschliche Überprüfung)
   entspricht der Massnahme «Einspruch».

*Anpassungen.* Debatte zur Vertiefung. Sicherung auf 5 Min. mit eigenem Feld und
Satzgerüst. Rückblick als 3-Min.-Synthese «Wo kann eine Vorhersage falsch sein? Ein
Beispiel je DL» mit Rückgriff auf den Schulweg (DL 1) und «Hintergrund/Licht». Chatbot als
Auskunftssystem statt der vorbestimmten Zeile «Bildprojekt» oder als Fallkarte D. Zwei
Minuten Rollenwechsel («ein Satz aus Sicht der abgelehnten Person»). Sechs Glossareinträge.
Untertitel oder Transkript bereithalten. Offene Fragen per Zettel oder Abgabekanal
einsammeln (*Entscheid 6.11.2026:* DL 9–10 sammeln nichts ein, dieser Vorschlag entfällt).

## 4. Querschnittsbefunde

Elf Muster treten in mehreren Lektionen oder in mehreren unabhängigen Analysen auf. Sie
sind wichtiger als jeder Einzelbefund, weil ihre Behebung an einer Stelle viele Lektionen
verbessert.

| Thema | Befund (Kurzfassung) | Betrifft | Evidenz (Abschnitt 5) | Massnahme |
|-------|----------------------|----------|------------------------|-----------|
| **T1 Steuerungs- und Quellenkonsistenz** | Vier Dokumentebenen (KP, `planung.json`, Seite, Musterlösung/Bewertung) steuern dieselbe Lektion und widersprechen sich: XOR (DL 3), Datenrollen/Fotoauftrag (DL 4/5), Debatte (DL 10), Asimov/Ethik (DL 1/10), Gesprächszeiten (DL 7), K12 (Web vs. Markdown), Prozentzahl und Notenbeispiel. Namensdrift: Der Datenregel-Lernpfad hat drei Namen; Etappen, Checks, Reflexionen und Fortschrittsschritte zählen verschieden. [G] | DL 1, 3, 4, 5, 7, 10, Bewertung | Konsistenzfrage, kein Literaturbeleg nötig | R1 |
| **T2 Pflicht/Wahl und Zeitbudget** | Lernende sehen nirgends, was Pflicht ist (DL 1, 2, 3, 9, 10); die Seiten verlangen teils mehr als der Plan; DL 8 Etappe 1 hat kein Budget; die «Entlastung» vom 4.11. verschob Last zur Lehrperson. [G, A, H] | DL 1, 2, 3, 6, 7, 8, 9, 10 | Kognitive Belastung (Sweller et al. 2019); UDL (CAST 2024); Differenzierung (Deunk et al. 2018) | R3 (zurückgenommen) |
| **T3 Individuelle Sicherung und Rückmeldung** | Sicherung ohne Feld (DL 2), 2 Min. (DL 4, 9, 10), Antworten bleiben im Browser; «Vorwissen» ist in DL 3, 4, 6 Wiedererkennen statt Abruf. [G, A] | DL 2, 3, 4, 6, 9, 10 | Abruf und Verteilung (Dunlosky 2013; Latimier 2021); Feedback (Hattie & Timperley 2007; Wisniewski 2020) | R4 |
| **T4 Steuerung des selbstorganisierten Arbeitens** | 270 Min. ohne Plenum, Lernstand nur als Selbstbericht, Beratung reaktiv und proaktiv zugleich, Tagesziele ohne Ort, ein Gerät und ein gemeinsamer Stand je Tandem, erste individuelle Evidenz erst in DL 8. [G, A] | DL 5–8 | Selbstregulation (Dignath & Büttner 2008; Panadero 2017; Elhusseini 2022); kooperatives Lernen (Johnson & Johnson 2018; Kirschner et al. 2018) | R7 |
| **T5 Nahtstellen und Begriffsbrücken** | DL 4→5, DL 8→9, DL 9→10; verlangte, aber nicht eingeführte Begriffe; das Neuron-Vokabular endet; «Datenleck» fehlt im DL-8-Lesetext. [G, A] | DL 4, 5, 8, 9, 10 | Verteilter Abruf (Cepeda 2006); schwer lehrbar sind Vergleichs- und Designentscheidungen (Sulmont et al. 2019) | R5, R6 |
| **T6 Notebooks mit wenig Interaktion** | DL 3 Experiment 2 startet mit der Lösung, DL 4 zeigt Zielmuster, DL 5 zeichnet das Leck nur; kaum «Modify»-Aufgaben. [A] | DL 3, 4, 5, 6 | Use–Modify–Create (Lee et al. 2011); Notebook-Risiken (Johnson 2020) | R11 |
| **T7 Versuchsdesign und Statistik** | V1 = 2 Gegenstände, aber Prozentpunkte und «32 Bilder»; Training vs. Validierung wird nie erlebt; Gleichstand nicht vorbereitet; Trennschärfe ≥ 50 % per Konstruktion. [G, A] | DL 6, 7, 8 | Datenlecks und Reproduzierbarkeit (Kapoor & Narayanan 2023); Dreiteilung (Raschka 2018); Fehlvorstellung «kleine Datensätze, hohe Genauigkeit» (Kanoh 2024) | R8 |
| **T8 Beurteilung und Peer-Feedback** | 12 von 33 Punkten aus 4 Min. ohne Leitfaden; Raster mit Überlappungen und nicht beobachtbaren Deskriptoren; Rückmeldung an das geprüfte Tandem ohne Zustellweg. [G, A] | Bewertung, DL 8 | Peer Assessment (Double et al. 2020; Li et al. 2020; Carless & Boud 2018); Rubrics und Halo (Panadero & Jonsson 2013; Schmidt et al. 2023); mündliche Formate (Perkins et al. 2024/25; Kofinas et al. 2025) | R9, R10 |
| **T9 Generative KI: eigene Nutzung** | Journal fragt nach KI-Hilfen, aber ohne Regel; Musterantworten je Feld im öffentlichen Repository; DL 9/10 reflektieren die eigene Nutzung nicht. [A] | DL 7, 9, 10, Journal | Bastani et al. 2025; OECD 2026; Kanton Zürich MBA; JAMES 2024 | R6, R10 |
| **T10 Fachliche Genauigkeit und Fehlvorstellungen** | Entscheidungsbaum-Satz, Akinator, Memory Runde 3, «Erfahrungsschatz», «das Neuron korrigiert sich selbst», «darstellen» vs. «lernen», Trennschärfe-Satz, «Papagei», Kausalkette «Geschäfte und Häuser gehen ein». [G, A] | DL 1, 2, 3, 4, 8, 9, 10 | Anthropomorphismus und Fehlvorstellungen (Bewersdorff et al. 2023; Marx et al. 2024; Mitchell & Krakauer 2023) | R2 |
| **T11 Lesbarkeit und Last** | Bewertung (LIX 62,3), Lernziele (62,5), Sicherung (59,8) sind sehr schwer lesbar; DL 8 hat den schwersten Lernendentext und ist gewachsen. [G] | Bewertung, Lernziele, DL 8 | Lesbarkeit (Björnsson 1968; Bamberger & Vanecek 1984); Redundanz (Mayer & Fiorella 2022) | R2, R9 |

## 5. Einordnung in die Literatur

Alle Quellen wurden von den Recherche-Agenten tatsächlich geöffnet; bei einigen lagen nur
Abstract oder Metadaten vor (Anhang C, †). Zahlen stammen aus den geöffneten Texten.
Effektstärken aus anderen Kontexten stützen eine Richtung, sie beweisen nichts für diesen
Kurs.

### 5.1 Lernforschung

| Thema | Quellen | Aussage | Konsequenz für den Kurs |
|-------|---------|---------|--------------------------|
| Führung vs. Entdecken | Alfieri et al. 2011; Lazonder & Harmsen 2016; Kirschner, Sweller & Clark 2006; Hmelo-Silver et al. 2007 | Unassistiertes Entdecken ist unterlegen (d = −0,38), angereichertes mit Feedback, Worked Examples und Scaffolding überlegen (d = 0,30). Anleitung steigert Lernaktivität, Leistung und Ergebnis (d = 0,66/0,71/0,50). | Die Architektur ist gestützt. Entscheidend ist die Qualität der Gerüste in DL 5–8 (Deutungsbeispiel, Rückmeldung). |
| Fading, Expertise-Reversal | Kalyuga 2022†; Belland et al. 2017 | Hilfen, die Novizen stützen, werden bei wachsender Expertise wirkungslos oder schädlich. Computerbasiertes Scaffolding wirkt in MINT (ĝ = 0,46), unabhängig von der Fading-Logik. | Hilfen an den Lernstand anpassen und sichtbar zurücknehmen (Klippe DL 4→6). Für Scaffolding insgesamt ist die Evidenz stark, für die genaue Form des Fadings schwächer. |
| Worked Examples | van Gog & Rummel 2010; Renkl 2022†; Sweller et al. 2019 | Vorgerechnete Beispiele senken die Last, besonders vor eigenständigem Problemlösen. | DL 3 und 10 modellhaft; DL 6 fehlt ein Deutungsbeispiel. |
| Productive Failure | Kapur 2016; Sinha & Kapur 2021; Loibl et al. 2017 | Problemlösen vor Instruktion übertrifft Instruktion vor Problemlösen moderat (g = 0,36). Es wirkt nur mit Contrasting Cases und einer Instruktion, die auf die Schülerlösungen aufbaut. | DL 1 ist nah dran. DL 5 könnte «Wie würden Sie Training und Test trennen?» vor den Lernpfad stellen, mit Leck-Fällen als Kontrast. |
| Abruf und Verteilung | Dunlosky et al. 2013; Adesope et al. 2017; Rowland 2014†; Cepeda et al. 2006; Latimier et al. 2021 | Practice Testing und verteiltes Üben sind hoch wirksam, Wiederlesen wenig. Verteilter Abruf übertrifft gehäuften (g = 0,74). | Vorwissen-Phasen als Freitext-Abruf; Datenregel und «Vorhersage ≠ Garantie» über DL 5→8→10 verteilt abrufen. |
| Aktives Lernen | Freeman et al. 2014 | Prüfungsleistung +0,47 SD bei aktivem Lernen; die Durchfallquote ist bei Frontalunterricht höher (OR 1,95). | Der Kurs ist aktivierend. Ausnahmen: lange Inputphasen (DL 1: 15 Min., DL 4: 25 Min.) und NIM als Zuschauen (25 Min.). |
| Kognitive Belastung | Sweller et al. 2019; Chen, Paas & Sweller 2023; Ayres & Sweller 2022†; Mayer & Fiorella 2022†; Mayer 2021 | Elementinteraktivität bestimmt die Aufgabenkomplexität; getrennte Informationsquellen (Split Attention) und lange Dauerdarbietung erhöhen die Last; Segmentierung hilft. | DL 4 (Algebra-Beweis), DL 3 (vier Kontextwechsel), DL 8 (Redundanz), DL 1 (Papier und digital doppelt), DL 9 (iframe plus Protokoll). |
| Feedback, formative Beurteilung | Hattie & Timperley 2007; Wisniewski et al. 2020; Black & Wiliam 1998 | Feedback gehört zu den stärksten Einflüssen (d = 0,48 in 435 Studien) und wirkt stärker auf kognitive als auf motivationale Ergebnisse. | SOL-Phase ohne Rückmeldeschleife; Sicherung ohne Rückmeldung. |
| Peer Assessment | Double et al. 2020; Li et al. 2020; Carless & Boud 2018 | Peer Assessment verbessert die Leistung (g = 0,31 gegenüber keiner Beurteilung, 0,28 gegenüber Lehrpersonenurteil). Rater-Training ist der stärkste Moderator; die Wirkung braucht Feedback-Literacy (wertschätzen, urteilen, handeln). | DL 8 ist gut gestützt, aber ohne Training und ohne Nutzung der Rückmeldung bleibt der Nutzen aus (R9). |
| Rubrics, Halo | Panadero & Jonsson 2013; Schmidt et al. 2023 | Rubrics können Leistung und Selbstregulation fördern, je nach Typ und Nutzung. Vorherige Bewertungen beeinflussen Folgebewertungen. | 4-Min.-Gespräch: Indikatoren, Ankerantworten, wechselnde Reihenfolge. |
| Kooperatives Lernen, Tandem | Johnson & Johnson 2018; Kyndt et al. 2013†; Kirschner et al. 2018; Umapathy & Ritzhaupt 2017; Zhong et al. 2017 | Individuelle Verantwortlichkeit ist ein Kernelement kooperativen Lernens; Kooperation verbessert die Leistung (Meta-Analyse, 59 Studien). Pair Programming wirkt auf Aufgaben, Prüfungen und Bestehensquote. Ein selbstgewählter, semi-freier Rollenwechsel schlug feste Intervalle (Primarschule). | Rollenwechsel ist nur Empfehlung, ein Gerät, ein gemeinsamer Stand: individuelle Spur schaffen (R7, R10). |
| Selbstreguliertes und selbstorganisiertes Lernen | Dignath & Büttner 2008; Panadero 2017; Donker et al. 2014; Elhusseini et al. 2022; Herold & Landherr 2003; Städeli et al. 2013 | Förderung von Selbstregulation wirkt (d = 0,69 im Mittel); Lernende mit Selbstregulationsdefiziten brauchen mehr Unterstützung. | Ziele, Monitoring und Reflexion sichtbar machen (Tagesziele, Fortschrittstafel, Pflichtkontakt). |
| Motivation, Autonomie | Ryan & Deci 2020†; Patall et al. 2008; Eccles & Wigfield 2020† | Autonomie, Kompetenz und Eingebundenheit; Wahlmöglichkeiten steigern intrinsische Motivation, Anstrengung und Leistung. | Die Themenwahl (12 Themen) ist gut; Autonomie braucht den engen fachlichen Rahmen. |
| Differenzierung | CAST 2024; Deunk et al. 2018 | UDL: Engagement, Repräsentation, Handeln und Ausdruck. Differenzierung hat kleine bis moderate Effekte; homogene Leistungsgruppierung allein wirkt bei Schwächeren leicht negativ. | Pflicht/Wahl sichtbar; Create-Aufgaben für Schnelle. |
| Informatikdidaktik | Lee et al. 2011†; Sorva 2013†; Johnson 2020† | Use–Modify–Create; «Notional Machines» explizit machen; Jupyter-Risiken (Ausführungsreihenfolge). | Notebooks mit Modify-Aufgaben; «Papagei» als Modell mit Grenzen benennen. |
| Lesbarkeit | Björnsson 1968; Bamberger & Vanecek 1984 | LIX und Wiener Sachtextformel bestimmen die Schwierigkeit deutscher Sachtexte. | Bewertung/Lernziele (LIX > 60) und DL 8 (51,5) vereinfachen. |

### 5.2 KI-Bildung, Kompetenzrahmen, Lehrpläne

**Kompetenzrahmen-Abgleich** (die Zuordnung zu Lektionen ist meine Einschätzung auf Basis
der geprüften Rahmenbeschreibungen):

| Rahmen | Abdeckung durch den Kurs | Lücke |
|--------|--------------------------|-------|
| AI4K12 «Five Big Ideas» (Touretzky et al. 2019) | Learning (DL 2–8, stark), Societal Impact (DL 10; Ethikblock DL 1), Representation & Reasoning (DL 1, 4), Perception indirekt (MobileNet-Merkmale, DL 5–8) | Natural Interaction nur am Rande (DL 9) |
| Ng et al. 2021 (4 Dimensionen) | Know & understand (DL 1–4), Use & apply (DL 5–7), Evaluate & create (DL 8–10), Ethical issues (DL 10) | «Create» im Sinn von Gestalten/Prompting kaum vertieft |
| UNESCO 2024 (Lernende; 4 Bereiche × 3 Stufen) | AI techniques and applications (DL 2–9), Ethics of AI (DL 10), AI system design teilweise (DL 5–8) | Human-centred mindset nur punktuell (DL 10, Datenschutz in DL 5–8) |
| OECD/EC 2026 (Engage, Create, Manage, Shape with AI; Endfassung seit 18.6.2026) | Vor allem Verstehen und Bewerten (Engage) | Manage (eigene Nutzung steuern, «wann KI nicht nutzen»), Create und Shape fehlen weitgehend (R6, R10) |

**Lehrpläne.** Der EDK-Rahmenlehrplan für die Maturitätsschulen (in Kraft seit 1.8.2024) nennt
im Grundlagenfach Informatik, Lerngebiet «Data Science», die Kompetenz «grundlegende
Konzepte der künstlichen Intelligenz erklären» und verankert KI auch in Deutsch und
Philosophie. Der Zürcher Lehrplan (Ergänzungsfach Informatik) verlangt, «die Konzepte und
Ideen des Machine Learnings» zu kennen, «eine einfache Anwendung (z. B. Schrifterkennung)»
zu implementieren sowie «Gefahren und Grenzen der KI» zu erkennen: Das MobileNet-Bildprojekt
deckt das nahezu 1:1 ab. Im Lehrplan 21 (Medien und Informatik) kommen KI und ML nicht vor,
ebenso nicht in den GI-Bildungsstandards Sek II (2016); die Grundlagen in DL 2–4 sind also
nötig und keine Wiederholung. Die GI-Papiere 2023/2024 kritisieren die Engführung des
KI-Begriffs auf generative Sprachmodelle; der breite KI-Begriff in DL 1/2 passt dazu.

**Fehlvorstellungen.** Bewersdorff et al. 2023 (Review, 25 Studien): eingeschränktes
technisches Verständnis, Anthropomorphismus, unscharfe Grenzen, binäre Gefahr/Nutzen-
Einschätzung. Marx et al. 2024† (5 Schüler:innen, 6 Fehlvorstellungen): u. a. «Data
Storage» (Trainingsdaten würden gespeichert) und «Continuous Learning» (KI lerne bei der
Nutzung weiter). Kanoh 2024 (8 Kategorien): u. a. «kleine Datensätze liefern hohe
Genauigkeit». Valdenegro-Toro & Sabatelli 2022‡ (Studierende): Overfitting wird binär statt
kontinuierlich verstanden. Abgleich mit dem Kurs: «Continuous Learning» ↔ DL 2
(«Erfahrungsschatz»); «kleine Datensätze» ↔ Projekt (der Deckeneffekt wird in
`projekt/020` benannt, bei 16 Bildern bleibt das Risiko); Anthropomorphismus ↔ DL 1 (gut
behandelt), DL 3 («korrigiert sich selbst»), DL 4 («Neuron fragt»), DL 9 («Papagei»).

**ML im Unterricht.** Marques et al. 2020 (30 Einheiten): häufig werden Teilprozesse wie
das Datenmanagement «black-boxed»; der Kurs macht es zum Kern. Tedre et al. 2021†:
Paradigmenwechsel von regelbasiertem zu datengetriebenem Denken, was DL 1/2 begründet.
Sulmont et al. 2019†: Nicht die Algorithmen, sondern Design- und Vergleichsentscheidungen
gelten als schwer lehrbar, genau das sind der A/B-Vergleich und die Fremdauswertung:
Deutungsbeispiele und Faustregeln lohnen sich dort besonders. Smilkov et al. 2017‡
(TensorFlow Playground, direkte Manipulation; ohne eigenen Lernerfolgstest) und
Müller-Unterweger et al. 2025 («Wollperzeptron», Unplugged ab Klasse 8) sind Anregungen für
DL 3/4.

**Datenleck.** Kapoor & Narayanan 2023: 22 Übersichtsarbeiten aus 17 Feldern erfassen
294 Arbeiten mit Datenleck; 8 Leckage-Typen; in einer Fallstudie verschwindet der
ML-Vorteil nach der Korrektur. Raschka 2018‡: Bei Hyperparameter-Tuning braucht es eine
Dreiteilung, sonst «leakt» das Testset. Das Projekt vermittelt also eine reale, aktuelle
Praxisfrage und begründet die Testsperre.

### 5.3 Sprachmodelle, generative KI, Beurteilung

| Thema | Quellen | Aussage | Konsequenz |
|-------|---------|---------|------------|
| Sprachmodelle erklären (DL 9) | Bender et al. 2021†; Mitchell & Krakauer 2023; Hielscher et al. 2025†; Fasiang & Long 2025 | «Stochastic Parrots» ist der Kritikrahmen hinter der Papagei-Metapher (der Wortlaut der Definition wurde im Volltext nicht geprüft). In einer Umfrage unter 480 NLP-Forschenden meinten 51 %, ein rein textbasiertes Modell könne Sprache nicht-trivial «verstehen», 49 % nicht. SoekiaGPT (Schweiz) und «Large Language MadLibs» (unplugged) stützen den n-Gramm-Weg. | «Umstritten» in DL 9 ist akkurat; den Papagei als Modell mit Grenzen benennen; Soekia mit Anleitung. |
| Fehlvorstellungen zu LLMs | Bråten et al. 2026† | 267 norwegische Oberstufenschüler:innen: Verwirrung über die Quellen von ChatGPT und unangemessenes Vertrauen. | Quellenprüfung in DL 9 einplanen. |
| Lerneffekte generativer KI | Bastani et al. 2025; OECD 2026†; Fan et al. 2025†; Lee et al. 2025†; Kosmyna et al. 2025‡; Kasneci et al. 2023† | Randomisierte Feldstudie mit rund 1000 Gymnasiast:innen: Freier GPT-4-Zugriff steigerte die Übungsleistung um 48 %, senkte sie aber um 17 % in der KI-freien Nachprüfung; ein Tutor mit Leitplanken steigerte sie um 127 % ohne Verlust. Der OECD-Bericht 2026 beschreibt dieselbe Umkehr. Fan et al. (Studierende), Lee et al. (Wissensarbeitende, korrelativ) und Kosmyna et al. (Preprint) sind nur vorsichtig übertragbar. | Regel für Journal und Reflexionen: Leitplanken, Dokumentation, Eigenleistung; Preprints als solche kennzeichnen. |
| Beurteilung im GenAI-Zeitalter | Perkins et al. 2024/2025; Corbin, Dawson & Liu 2025†; Kofinas, Tsay & Pike 2025; swissuniversities 2024; HRK KI-LOTSE 2026 | Mündliche Formen stehen in der AI Assessment Scale auf Stufe 1. Regeln allein («discursive changes») genügen nicht, es braucht strukturelle Änderungen («enforcement illusion»). Beurteilende konnten Arbeiten mit und ohne GenAI-Anteil nicht unterscheiden; empfohlen werden synchrone, interpersonelle Formate. Nachweise sollen «persönlich zurechenbar» sein; unreflektierte mündliche Prüfungen führen zu kurzen, ungleich geführten Gesprächen. | Das 4-Min.-Gespräch ist eine tragfähige Antwort, muss aber strukturell abgesichert sein: Leitfaden, Belegfrage, Rotation, Absenzregel (R10). |
| Rahmen und Recht | UNESCO 2023; EU AI Act Art. 4; OECD/EC 2026 | Seit 27.7.2026 ist die KI-Kompetenz in Art. 4 durch die Verordnung (EU) 2026/1744 von einer Ergebnis- zu einer Förderpflicht geworden. | Kontext, kein Unterrichtsinhalt. |
| Schweiz | Kanton Zürich MBA; JAMES 2024; LCH 2024; PHZH KI-Wiki; SKBF 2026 | Das MBA führt einen Leitfaden zur Bewertung von Maturitäts- und Projektarbeiten im KI-Zeitalter. 71 % von 1183 befragten Jugendlichen (12–19 Jahre) haben ChatGPT o. Ä. genutzt. Der LCH verlangt nicht, dass Lehrpersonen KI-Expert:innen werden. Im SKBF-Bericht 2026 findet sich keine belastbare PISA-vs.-ChatGPT-Zahl (eine kursierende «90 %» stammt nicht aus amtlicher Quelle). | Die Journal-Frage «auch KI» ist richtig, braucht aber eine Regel; keine unbelegten Einzelzahlen in den Unterricht. |
| Ethik, Bias, Rückkopplung | Ensign et al. 2018; O'Neil 2016; Louie et al. 2022†; Ma et al. 2025†; Pangrazio & Selwyn 2019† | Ensign et al. zeigen mit einem Pólya-Urnenmodell, wie Predictive-Policing-Systeme unabhängig von der wahren Rate dieselben Quartiere anvisieren. O'Neils Dreikriterienkonzept ist belegt, die Wort-Trias «Opacity, Scale, Damage» nur durch eine Rezension. Bias-Unterricht zeigt kleine bis moderate Effekte, gemessen wird uneinheitlich. | DL 10 ist fachlich gut gestützt. Die O'Neil-Kriterien als «gängige Zusammenfassung» kennzeichnen; Ensign et al. als Primärquelle für die Rückkopplung nennen. |

### 5.4 Wie belastbar ist die Evidenz?

- Meta-Analysen stützen Richtungen; die Populationen (Studierende, Primarschule, MINT-Klassen
  anderer Länder) sind nicht die 4. Klasse einer Kantonsschule.
- Bei den mit † markierten Quellen lagen nur Abstract oder Metadaten vor; ‡ sind Preprints.
- Die Studien zu Lerneffekten generativer KI sind jung, teils Preprints, teils nicht an
  Schüler:innen erhoben. Das Bastani-Ergebnis ist die einzige präregistrierte
  Feldstudie an Gymnasiast:innen unter den geprüften Quellen.
- Es wurde keine XOR-spezifische Fachdidaktikstudie und keine K-12-Studie zum
  Train/Test-Verständnis gefunden; «nicht gefunden» heisst nicht «widerlegt».

## 6. Selbstkritik zur DL-8-Umgestaltung (5.11.2026)

Die Analyse betraf den Stand nach meiner Umgestaltung von DL 8 in Fahrplan und Etappen-Seiten
(Commit `082adbd`). Die Befunde sind für diesen Eingriff selbst relevant:

- **Textmenge +28 %** [G]: 1732 → 2219 Wörter (Fahrplan 120 → 397, «Warum prüfen?» 242 →
  342 durch die Brückentabelle, übrige Seiten +11 bis +47). Gewonnen sind Wiedereinstieg
  und Gliederung, verloren ist Lesezeit. Der Merksatz «Trennschärfe ≠ Trefferquote» steht ≥ 5×
  vor der Anwendung (Fahrplan, `010` Karte und Merksatz, `040` Explainer, Merksatz und
  Hilfe, Pflichtfrage 2) [A].
- **Sichtbares Zeitbudget 40 von 90 Min.** [G]: Start 5, Etappe 2 20, Etappe 3 15; Etappe 1
  und 4 haben keine Minuten.
- **AVIVA-Phasen und Leitfrage** stehen nur im eingeklappten Bereich «Doppellektion» [G].
- **Brückentabelle, Zeile 4** [G]: «die Grenzen Ihres Modells benannt» ↔ «wo das fremde Modell
  mit Ihren eigenen Klassen an Grenzen stösst» vergleicht Verschiedenes. Das Etikett
  «Gleiche Klassen, neue Testbilder» passt nur teilweise: Die Prüfenden haben keine neuen
  Bilder, sie prüfen die ursprünglichen P1/P2 [A].
- **Fahrplan-Häkchen** leben im privaten Fenster; beim Wiederherstellen des Fremdstands werden
  sie vermutlich ersetzt [H].
- **Was die Gliederung nicht löst:** Etappe-1-Logistik, Datenaudit-Werkzeug,
  Klassenzuteilung, Zustellweg der Rückmeldung (Abschnitt 3, DL 8). Eine bessere Gliederung
  ersetzt keine Entlastung.

*Vorschlag:* Fahrplan kürzen (Rahmen-Callout und Fakten reduzieren), Minuten für Etappe 1
(≈ 10) und 4 anzeigen, Leitfrage sichtbar lassen, Brückentabelle auf drei Zeilen kürzen oder
Zeile 4 umformulieren, Notfallkarte und Referenz-ZIP verlinken. Das lässt sich auf Wunsch
in allen drei Kursen umsetzen.

## 7. Empfehlungen, priorisiert

Aufwand: S = Stunden, M = Tage. Reihenfolge: R1–R3 sind reine Text- und Konsistenzarbeit
und vor dem nächsten Durchgang erledigbar. R4–R8 sollten vor DL 5 stehen. R9–R12 sind
Arbeit für das Semester.

| # | Massnahme | Konkret | Betrifft | Aufwand |
|---|-----------|---------|----------|---------|
| R1 | **Steuerungsdokumente angleichen** | Je Entscheidung eine Quelle, die anderen verlinken. Zu klären: XOR (DL 3 oder 4?), Datenrollen/Freigabe/Fotoauftrag (DL 4 oder 5?), Zeitleiste Foto/Thema, Asimov/Ethik (DL 1 oder 10?), Debatte (DL 10), Gesprächszeiten (DL 7), K12-Definition (Web vs. Markdown), K11-Lücke, «33,3 %» → 36,4 %, Beispiel «24,75 Punkte». | KP, `planung.json`, Seiten, Musterlösungen, Bewertung | S |
| R2 | **Fachliche Kurzkorrekturen** (13 Stellen) | (1) `einstieg/020` Entscheidungsbaum-Satz; (2) `lernarten/020` Akinator ersetzen oder Frage öffnen; (3) `lernarten/070` Runde 3 und «Agent» statt «System»; (4) `perzeptron/050` Lernraten-Versuch mit NOR und korrigierte Musterwerte; (5) `netze/040` Frage 3 als Vorschau, totes Attribut `data-p1-diagnostic` entfernen oder nutzen; (6) `ki_foto_tools.py` Z. 279, Schwellen und Text «Raten ≈ 50 %»; (7) `bewertung` Z. 143 und 170; (8) Glossar: Epoche, Startwert, Modellwert, Trennschärfe, Lernrate/Lernregel, Rückkopplung, Opacity/Scale/Damage, Token/Einbettung, Erfahrungsschatz; (9) DL 3 «korrigiert sich selbst» → «Das Lernverfahren vergleicht Ausgabe und Ziel»; (10) DL 4 Darstellbarkeit und Lernbarkeit trennen; (11) DL 9 «nächstes Token» = Vortraining, «Wahr?» nur für Aussagen, Modell ≠ Produkt; (12) DL 10 Kausalkette als Modellannahme, Fall «Schule» angleichen; (13) O'Neil-Kriterien als «gängige Zusammenfassung» kennzeichnen. | DL 1–4, 8–10, Bewertung, Glossar | S |
| R3 | **Pflicht/Wahl sichtbar machen** (zurückgenommen, 6. November 2026) | Vorschlag war ein Badge «Pflicht»/«Wahl» je Kapitel und ein Pflichtweg in der Lektionskarte. Die Lehrperson lehnt das ab: Die AVIVA-Planung zeigt, was Teil des Unterrichts ist. Geblieben ist nur die Minutenzuteilung in DL 8 (Etappe 1 und 4). | DL 8 | S |
| R4 | **Individuelle Sicherung wirksam machen** | Je DL ein Feld mit Satzgerüst und Selbstkontrolle (Lösung erst nach dem Schreiben), 4–5 Min.; DL 2 Exit-Ticket mit ungesehenem Beispiel; DL 4 zwei Fragen (Netz, Brücke); DL 9/10 ein Feld; «Vorwissen» in DL 3, 4, 6 als Freitext-Abruf; Antworten einsammeln (Download) und zu drei typischen Antworten einen Satz Rückmeldung geben. | DL 2, 3, 4, 6, 9, 10 | S–M |
| R5 | **Brücke DL 4→5** | Brückenkarte (vier Sätze): «ungesehene Daten», Runde = Epoche, Stufe vs. Wert (Aktivierung), Startwert, Merkmal und «2 → 1280 Eingaben» mit Skizze MobileNet → 1280 → kleines Netz. Bereit-Check als Vorschau; DL 5 greift ihn auf. Hook in DL 5 mit Vermutung («Wie würden Sie Training und Test trennen?»). | DL 4, 5 | S–M |
| R6 | **Brücke DL 8→9→10, Abschluss als Synthese** | «Transferfrage für DL 10» in `planung.json`; Rückblick DL 9 mit dem Anker «ein Modell antwortet immer» (Gabel/Löffel-Modell sieht eine Tasse); Brücke in vier Sätzen (Vortraining → Feinabstimmung = Transfer Learning; Wörter als Zahlen; der Text liefert die Labels; Prozent ≠ Wahrheit); in DL 10 ein Chatbot-Fall und der Sicherungssatz «Ich prüfe KI-Aussagen, indem …»; Abschluss als 3-Min.-Synthese («Wo kann eine Vorhersage falsch sein? Ein Beispiel je DL»); DL-8-Rückmeldungen in DL 9 ausgeben. | DL 8, 9, 10 | S |
| R7 | **Steuerung des selbstorganisierten Arbeitens sichtbar machen** | Verbindliche Zeitleiste mit Meilensteinen («Ende DL 5: Exemplarliste und ≥ 40 Fotos; Mitte DL 6: Import»); Go/No-Go Mitte DL 6; Fortschrittstafel (analog, vom Tandem geführt); Pflichtkontakt je Tandem und DL mit Beratungskarte (Widerspruch reaktiv/proaktiv auflösen); Feld «Tagesziele»; 5-Min.-Peer-Tausch R1–R3 am Ende DL 6; Einzelnotiz im «Einzeln»-Schritt; drei benannte Rollen mit Wechsel; Absenz- und Konfliktregel. | DL 5–8 | S–M |
| R8 | **Versuchsdesign ehrlicher darstellen** | Satz «V1 = 1 Gegenstand je Klasse: 16 Bilder ≠ 16 Tests»; Journal-Platzhalter «richtig/gesamt»; Faustregel «Unterschied ≤ 2 Bilder = kein Beleg» (Heuristik, Fachperson prüft); Prompt «Bei Gleichstand: …» und Voreinstellung leer; Zelle Training vs. Validierung; `abschlusstest()` je Gruppe; Rückbezug auf DL 4 (Startwerte 0–5). | DL 6, 7, Journal, `ki_foto_tools.py` | S |
| R9 | **DL 8 robust und geschlossen machen** | Disjunkte Klassenmengen, zyklische Zuteilung; Rückmeldungen bündeln und ausgeben, K11 als Eintrittsbedingung für K12; Etappe 1 mit ≈ 10 Min. und Notfallkarte; Referenz-ZIP aus `testbilder/` und Probelauf in DL 7; schlankes Austauschpaket (JSON, Protokoll, `Journal.html`) und Löschregel mit Häkchen; Datenaudit-Werkzeug (`gruppen_zeigen(test=True)`, Tabelle Gruppe × Quelle mit Duplikat-Warnung); Prüfbericht als 5-Zeilen-Tabelle; Explainer erst nach dem Versuch; Einwilligungssatz für die Weitergabe. | DL 8 | M |
| R10 | **Beurteilung stützen** | Gesprächsleitfaden mit Pool (je Kriterium drei Varianten), Ein-Seiten-Bogen, wechselnde Reihenfolge, Absenzregel; Indikatoren und Ankerantworten je Stufe; Überlappungen auflösen (K6 nur «Grenze», K10 nur «neuer Fall»); Sollstufe und Notenschlüssel nennen; Spalte «Wo beurteilt?» mit einer Grundlagenfrage aus DL 3/4; Selbsteinschätzung in DL 7 nutzen; Drei-Zeilen-KI-Regel (erlaubt: Sprachhilfe; nicht: Zahlen und Deutung) mit eigenem Feld und «Belegfrage» im Gespräch («Wo steht das im Journal, welche Zahl?»); individuelle Spur im Tandem; Zweitbewertung von drei Proben; Musterantworten als «Erwartungshorizont» statt Musterwortlaut. | Bewertung, Journal, DL 5–8 | M |
| R11 | **Notebooks mit Use–Modify–Create** | DL 3 Experiment 2 mit 0/0/0 starten; DL 4 Gewichtetabelle und eine Modify-Aufgabe; DL 5 Mini-Experiment zum Leck; DL 6 Training/Validierung und `bild_durchs_netz` im Versuchsnotebook. | DL 3–6 | M |
| R12 | **DL 9/10 Feinschliff** | Soekia als einziger digitaler Arbeitsweg mit Link und Anleitung; Erwartung mit Prognose und Feld vor dem Digitalweg; problematisches Beispiel per Trainingstext erzeugen; Untertitel/Transkript; Realitätsanker (AI Act, nDSG Art. 21) fachlich prüfen; Rollenwechsel in DL 10. | DL 9, 10 | S–M |

**Entscheide der Lehrperson (6. November 2026):**

- **DL 9–10 sammeln nichts ein.** Die Sicherung bleibt Selbstkontrolle und Klassengespräch,
  beide Lektionen bleiben unbenotet. Der Vorschlag «Antworten einsammeln» entfällt für DL 9–10.
- **Stufe 2 ist die Sollstufe** und entspricht der Note 4,25 (22 Punkte = alle elf Kriterien
  auf Stufe 2). Noten ab 5 verlangen Stufe 3 in mehreren Kriterien (26 Punkte → 5,0).
- **DL 1–2 sind keine Wiederholung:** Die 4. Klasse hatte noch kein KI-Thema. Die Lektionen
  bleiben textgleich mit der 1. Klasse; ob Niveau und Stil für 17–18-Jährige passen, klärt das
  Feedback (Abschnitt 8, Nr. 12).
- **Die 1. Klasse bleibt unverändert** und wird vorerst nicht ausgewertet.
- **Keine Pflicht/Wahl-Kennzeichnung in den Kursunterlagen** (R3 zurückgenommen). Welche
  Inhalte Teil des Unterrichts sind, zeigt die AVIVA-Planung. Die in Welle 1 eingeführten
  Pflichtweg-Kästen, die «(Wahl)»-Titel und die eingeklappten Kapitel sind wieder entfernt;
  ebenso die schon vorher vorhandenen Formulierungen («Pflichtkern», «Pflichtversuch»,
  «freiwillig», «Wahlvertiefung») in Seiten, Plänen, Materialien, Notebooks, KP und
  Musterlösungen (Abschnitt 9, Welle 1c).
- **Jedes Tandem wählt zwei einzigartige Bildklassen**, die kein anderes Tandem verwendet
  (Voraussetzung für DL 8). Damit ist die Zuteilung in DL 8 einfach (zyklisch, ohne Kontrolle)
  und «ganz andere Klassen» garantiert.

**Weiterhin offen:**

- Absenzregel für die Gespräche (Vorschlag im KP).
- Soll in DL 9 ein echtes Sprachmodell live gezeigt werden (mit Quellenprüfung)? Bis auf Weiteres
  bleibt es bei Papagei und Soekia.
- Fotozeitleiste: umgesetzt wie vorgeschlagen (DL 4 Vorbereitungsauftrag, DL 5 Freigabe und
  Abnahme der Exemplarliste); Rückmeldung steht aus.

**Was ich nicht empfehle:** weitere Inhalte hinzufügen. Fast jede Lektion ist bereits an der
Grenze ihres Zeitbudgets. Jede Ergänzung braucht eine Streichung.

## 8. Beobachtungsplan für den nächsten Durchgang

Die wichtigsten Hypothesen lassen sich mit wenig Aufwand prüfen:

| # | Frage | Wie messen | Entscheidet über |
|---|-------|------------|------------------|
| 1 | Wie lange dauert DL 8 Etappe 1 (Kaltstart im privaten Fenster, Schul-WLAN, iPad/Chromebook)? | Stoppuhr bei drei Tandems; Abbrüche zählen | R9 |
| 2 | Wie viele Tandems haben am Ende DL 5 eine Exemplarliste, Mitte DL 6 den Import, am Ende DL 6 Etappe 5? | Fortschrittstafel | R7 |
| 3 | Wie lange dauert der Lernpfad in DL 5 inklusive Kaltstart bei 20 Geräten? | Stoppuhr | R7 |
| 4 | Wie lange dauert Experiment 2 in DL 3 (Hypothese 10–15 statt 32 Min.)? Wie viele Tandems rechnen Experiment 3 selbst? | Beobachtung | R11 |
| 5 | Wie viele Antworten der DL-4-Sicherung sind lesbar und inhaltlich korrekt? | Fünf Antworten einsammeln | R4 |
| 6 | Wie lange arbeiten Lernende in DL 1 an den Kapiteln 3 und 4 und in DL 2 an den Kapiteln 2 und 3? | Beobachtung | Zeitbudget DL 1–2 (R3 ist zurückgenommen) |
| 7 | Gespräche: Streuung der Punkte, Fragenweitergabe, Slot-Fairness (Minute 0 vs. 95–100) | Bogen; Zweitbewertung von drei Proben | R10 |
| 8 | Welche Fehler enthalten Datenpläne nach dem Lernpfad? | Drei Tandems stichprobenartig | R5, R8 |
| 9 | Verstehen Lernende «Trennschärfe»? | Think-aloud mit zwei Tandems | R2, R9 |
| 10 | Glauben Lernende nach DL 9, ChatGPT zähle Wörter? | Eine Frage vor und nach DL 9 | R6, R12 |
| 11 | DL 10: Verteilen sich die Gruppen auf die drei Fälle? Ändern Lernende ihre These? | Zählung `these_vorher`/`these_nachher` | R12 |
| 12 | Passen Niveau und Stil von DL 1–2 (textgleich mit der 1. Klasse) für 17–18-Jährige? Ist Memory zu spielerisch? | Kurzes Feedback | Feinschliff DL 1–2 (die 4. Klasse ist neu im Thema) |

## 9. Umsetzungsstand Welle 1 und 2 (7. November 2026)

Umgesetzt wurde, was auf **Kursseiten-Ebene** (Seiten, `planung.json`, `materialien.md`,
Musterlösungen, `KI_Planung.md`) möglich ist, im Branch `feat/didaktik-welle-1`. Die Änderungen
liegen in BOK, IRN und Vorlage (4. Klasse) identisch vor. Code, Notebooks, Glossar und
gemeinsames CSS sind bewusst ausgenommen (Welle 2). Gespeicherte Antwortschlüssel: **5 neu,
0 entfernt oder umbenannt** (`lernart_sicherung`, `soe_erwartung`, `sprache_pruefen`,
`rueck_synthese`, `ki_nutzung`); für alle neuen und geänderten Schlüssel stehen
Musterlösungszeilen bereit.

| # | Stand | Umgesetzt | Offen (Welle 2 oder Entscheid) |
|---|-------|-----------|--------------------------------|
| R1 | umgesetzt | XOR gehört in DL 4; Foto-/Themen-Zeitleiste in Projektauftrag, Fotoanleitung, Abschlussseite, Plänen und KP angeglichen; Debatte in DL 10 mit Leitfragen als Gesprächshilfe; Gesprächszeiten zu Beginn DL 7; K12 im Web und im Raster gleichlautend; K11-Lücke erklärt; 36,4 %; ganzzahlige Notenbeispiele; Raster-Tabelle (leere Zeile vor K12) repariert | Plan als Quelle der Wahrheit festgelegt; KP verweist nur noch |
| R2 | 5 von 13 | (1) Entscheidungsbaum; (4) Lernraten-Versuch mit NOR und Musterwerte; (5) Frage 3 als Vorschau; (7) Beispielzahlen und 36,4 %; (11) teilweise: «nächstes Token» = Vortraining, Transformer statt «dieselben Bausteine», Produkt ≠ Modell | (2) Akinator, (3) Memory Runde 3, (6) `ki_foto_tools.py`, (8) Glossar, (9) «korrigiert sich selbst», (10) Darstellbarkeit/Lernbarkeit, (11) «Wahr?» nur für Aussagen, (12), (13); `data-p1-diagnostic` |
| R3 | zurückgenommen (6.11.2026) | Keine Pflicht/Wahl-Kennzeichnung in den Kursunterlagen: Der AVIVA-Plan zeigt, was Teil des Unterrichts ist. Pflichtweg-Kästen, «(Wahl)»-Titel, «Wahl · » in den Kurzbeschreibungen und das Einklappen der Kapitel sind wieder entfernt, dazu die älteren Formulierungen «Pflichtkern», «Pflichtversuch», «freiwillig» und «Wahlvertiefung» (Welle 1c). Geblieben: DL 8 Etappe 1 (10 Min.) und 4 (15 Min.) mit Minuten | – |
| R4 | grossteils | DL 1 Kriterium an der Tafel und Rückgriff; DL 2 Sicherungsfeld mit ungesehenem Beispiel und Selbstkontrolle; DL 4 zwei Fragen vor Selbstkontrolle; DL 9 «Ich prüfe KI-Aussagen, indem …»; DL 10 Schlussurteil mit Selbstkontrolle | Freitext-Abruf in DL 3/4/6 (Vorwissen); Antworten einsammeln und rückmelden (für DL 9–10 entschieden: nein) |
| R5 | umgesetzt | Rätsel vor Algebra (das Tandem schreibt die vier Bedingungen selbst auf, die Vergleichstabelle ist aufklappbar); Brückenkarte in DL 4; Bereit-Check als Vorschau (Raten erlaubt); DL 5 greift ihn auf; Datenaufteilung nicht mehr in DL 4 | Skizze MobileNet → 1280 → kleines Netz |
| R6 | umgesetzt | Transferfrage DL 8; Anker «Ein Modell antwortet immer» in DL 8, 9, 10; Brücke in vier Sätzen; Rückmeldungen DL 8 in DL 9 «Ankommen»; Chatbot-Fall; Kurssynthese «Wo kann eine Vorhersage falsch sein?»; Rückgriff auf Schulweg (DL 1) | – |
| R7 | teilweise | Meilensteine, Go/No-Go (Foto-Check Mitte DL 6), Fortschrittstafel (analog), Peer-Tausch R1–R3, Rollenwechsel und Absenz in der Arbeitsvereinbarung, Abnahme der Exemplarliste | Feld «Tagesziele», Pflichtkontakt je Tandem, Konfliktregel |
| R8 | teilweise | «16 Bilder ≠ 16 Tests», 6,25 Prozentpunkte je Bild, Faustregel ≤ 2 Bilder, «Bei Gleichstand», richtig/gesamt, Rückbezug Startwerte, Musterbeispiel angepasst (11 gegen 14 von 16) | Zelle Training/Validierung, `abschlusstest()` je Gruppe, leere Voreinstellung (Code) |
| R9 | grossteils | Zuteilung zyklisch; dank Klassenliste (jede Bildklasse nur einmal, Entscheid 6.11.2026) sind die Klassen garantiert disjunkt; Referenzpaket und Notfallkarte, Probelauf DL 7, Rückmeldungen bündeln, K11 vor K12, Prüfbericht in fünf Zeilen, Explainer nach dem Versuch, Löschregel, Hinweis «Fenster erst nach dem Download schliessen», Einwilligungssatz | Schlankes Austauschpaket, Datenaudit-Werkzeug (Code); Referenzpaket muss die Lehrperson einmal erzeugen |
| R10 | teilweise | Gesprächsleitfaden mit Pool (drei Varianten je Kriterium), Orientierung je Stufe, Bogen, Rotation, Zweitbewertung als Stichprobe; «Wo beurteilt?» je Lernziel mit Grundlagenfrage (K7); KI-Regel mit eigenem Journalfeld; Stufe 2 als Sollstufe ausgewiesen (Entscheid 6.11.2026: 22 Punkte = 4,25) auf Kursseite, Raster, Projektauftrag und KP | Absenzregel (Entscheid Fachteam), Überlappungen auflösen, Ankerantworten, Selbsteinschätzung nutzen |
| R11 | offen | – (nur NOR-Variante in DL 3) | Notebooks |
| R12 | grossteils | Soekia als digitaler Arbeitsweg (Link, Drei-Zeilen-Anleitung, Erwartung vorab, selbst erzeugtes problematisches Beispiel über den Trainingstext); Anleitung am 6.11.2026 an der echten Oberfläche geprüft und korrigiert (der Prompt steuert den Text nicht; eigener Text über «Einstellungen» → «Neue Kollektion» → «Dokument hinzufügen» → «Modell aufbauen»; Regler «Temperatur» unter «Auswahl anpassen»); Untertitel/Transkript; DL-9-Zeit neu verteilt (5/10/12/53/10) | Realitätsanker (AI Act, nDSG Art. 21) fachlich prüfen |

Die Spalte «Offen» ist nach Welle 2 für R2, R5, R8, R10 und R11 überholt (Stand: siehe «Welle 2»
weiter unten).

**Annahmen, die ich getroffen habe (Lehrperson bitte bestätigen oder ändern):**

1. Der Plan (`planung.json`) gilt als Quelle der Wahrheit; `KI_Planung.md` wurde angepasst.
2. XOR in DL 4, Datenaufteilung erst in DL 5; Thema und Klassen werden in DL 4 als
   Vorbereitungsauftrag gewählt und zu Beginn DL 5 freigegeben; Fotografieren erst nach der
   Abnahme der Exemplarliste.
3. Der Schulweg-Fall bleibt eine kurze erste ethische Frage in DL 1 (15 Min.); die vertiefte
   Diskussion folgt in DL 10.
4. Zuteilung in DL 8 zyklisch; die Klassen sind dank Klassenliste garantiert disjunkt
   (Entscheid der Lehrperson, 6.11.2026). Rückmeldungen bündelt die Lehrperson und gibt sie
   in DL 9 aus.
5. K12-Stufen: Formulierung des Rasters (Markdown) übernommen. Stufe 3 verlangt Ursache und
   Folgetest.
6. KI-Regel: Sprachhilfe erlaubt; Zahlen, Beobachtungen und Deutung nicht.

**Welle 1b (6. November 2026): Entscheide umgesetzt.** Die Lehrperson hat die Fragen aus
Abschnitt 7 beantwortet (siehe dort). Umsetzung in BOK, IRN und Vorlage (4. Klasse):

- **Klassenliste:** Jedes Tandem wählt zwei Bildklassen, die kein anderes Tandem verwendet.
  Geändert: Hinweis-Kasten und Kurzbeschreibung auf der Seite «Thema wählen», Fahrplan
  (Etappe 1 mit angepasstem Häkchen), Abschlussseite, Pläne DL 4, 5 und 8, `materialien.md`
  (DL 4 und DL 5 mit Klassenliste-Vorlage, DL 8 ohne Klassenkontrolle), Ideenpool,
  Projektauftrag, Fotoanleitung und KP. Der Knopf «Als Thema vormerken» bleibt eine reine
  Browser-Notiz; verbindlich ist der Eintrag in der Klassenliste.
- **Themenliste:** Die Klasse «Herz» stand bei «Gezeichnete Symbole» und bei «Spielkarten».
  «Gezeichnete Symbole» heisst jetzt «Stern, Pfeil, Blitz», damit die Liste selbst keine
  Überschneidung enthält.
- **Sollstufe:** Stufe 2 ist auf der Bewertungsseite, im Raster, im Projektauftrag und im KP
  als Sollstufe ausgewiesen (22 Punkte = 4,25; 26 Punkte = 5,0).
- **DL 9–10:** KP hält fest, dass nichts eingesammelt wird.
- **1. Klasse:** nicht angefasst.

**Welle 1c (7. November 2026): Pflicht/Wahl entfernt.** Die Lehrperson will in den
Kursunterlagen keine Pflicht/Wahl-Kennzeichnung sehen; die AVIVA-Planung zeigt, was Teil des
Unterrichts ist (siehe Abschnitt 7). In BOK, IRN und Vorlage (4. Klasse) zuerst zurückgenommen,
was Welle 1 eingeführt hat, danach auch die schon vorher vorhandenen Formulierungen entfernt:

- **Kursseiten:** Die sechs Pflichtweg-Kästen (DL 1, 2, 3, 4, 9, 10) sind entfernt. Titel,
  Kurzbeschreibung und geöffneter Zustand der zwölf Kapitel, die ich als «Wahl» gekennzeichnet
  hatte, sind wieder wie vorher. In «Perzeptron 5» und «Netze 1» sind die Hinweise «Pflicht»,
  «Wahl» und «Niveau B» entfernt; die NOR-Korrektur beim Lernraten-Versuch und die Reihenfolge
  Rätsel vor Algebra bleiben.
- **Pläne und Materialien (alle Lektionen):** `zeit`, Schritte und `materialien.md` ohne
  «Pflichtweg», «Pflichtkern», «Pflichtnotebook», «Pflichtversuch», «freiwillig», «Wahlvertiefung»
  und «Vertiefung» als Kennzeichnung. Was nur dazu diente, etwas als freiwillig zu markieren, ist
  gestrichen (zum Beispiel «Eigene Beispiele sind freiwillig», Experiment 3 selbst durchführen,
  drei Startwerte). Leitplanken für die Lehrperson sind neutral formuliert (zum Beispiel «Kein
  Wechsel zu weiteren Werkzeugen», «Kein drittes Notebook in dieser Lektion»). Soekia heisst
  «digitaler Arbeitsweg»; zu Human or Not steht: Live-Chat mit Fremden, nur nach schulischer
  Freigabe, nie zusätzlich.
- **DL 8:** «Pflicht · unbenotet» heisst jetzt «unbenotet» (K11), «Pflichtversuch» heisst
  «Versuch», «Pflichtfrage» heisst «Frage», die bisherigen Antwortfelder tragen kein «Optional»
  mehr. «Unbenotet» bleibt, weil es eine Beurteilungsangabe ist. Auch die Datei `LESEN.txt` im
  DL-8-ZIP (gemeinsamer Portalcode `shared/portal/portal.js`, wird nur auf der DL-8-Seite der
  4. Klasse verwendet) spricht nicht mehr von «Pflicht» und «optional».
- **Notebooks und Werkzeug:** «Freiwilliger Zusatz», «Freiwilliger Transfer», «Pflichtkern» und
  ähnliche Kennzeichnungen sind aus Überschriften und Texten entfernt; die Fehlermeldungen in
  `ki_foto_tools.py` heissen «Im Projekt …» statt «Im Pflichtprojekt …», und zwei Docstrings in
  `unterricht_tools.py` (für Interessierte einsehbar) sind bereinigt. Logik und Schlüssel sind
  unverändert.
- **Arbeitsblätter, Raster, Lernziele, KP, Musterlösungen:** «Pflichtteil» im Titel, «Zusatz für
  Schnelle», «Pflicht» im Raster und in den Lernzielen sowie «Optional» in den Musterlösungen
  sind entfernt; der KP sagt: «Was zum Unterricht gehört, zeigt die AVIVA-Planung».
- **Tests:** `tests/check_portal.cjs` und `tests/check_admin_form.cjs` sind wieder wie auf
  `main`, weil alle Kapitel wieder offen sind.
- **Bewusst stehen geblieben:** «Wahl» im Sinn von Entscheidung (Modellwahl, «begründete Wahl»,
  `wmd_fall_wahl`), «verbindlich» in den Projektregeln (verbindlicher Rahmen gegenüber freien
  Entscheidungen im Tandem, «Verbindlicher Stand») und der technische Profilname `vertiefung`
  in `ki_foto_tools.py`. Die 1. Klasse ist nicht angefasst.

**Welle 2 (7. November 2026): fachliche Korrekturen, Erleben statt Erzählen, Beurteilung.**
Die Lehrperson hat «alles umsetzen» beauftragt, mit einer Ausnahme (Memory-Runde 3, siehe
unten). Umsetzung in BOK, IRN und Vorlage (4. Klasse) identisch; die 1. Klasse und die Datei
`basis_neuron.ipynb` (Variante der 1. Klasse im Ordner der 4. Klasse) sind nicht angefasst.
Gespeicherte Antwortschlüssel: **5 neu, 0 entfernt oder umbenannt** (`wissen_akinator`,
`lernschritt_selbst`, `datenleck_versuch`, `drei_werte`, `sprache_transkript`); die Journalfelder
`comparison` und `selection` sind im Wortlaut ergänzt, ihre Schlüssel bleiben. Für alle neuen und
geänderten Schlüssel stehen Musterlösungszeilen bereit.

*A · Fachliche Korrekturen (Rest von R2)*

| Stelle | Befund | Umsetzung |
|--------|--------|-----------|
| DL 2 Akinator | Die Frage «Warum lernt das System hier nicht selbst?» enthielt eine falsche Prämisse: Akinator lernt nach Angaben des Anbieters aus den Erfahrungen früherer Spieler, die Details sind nicht öffentlich. | Das Tandem baut zuerst einen Ratebaum auf Papier (fünf Tiere, Test mit einem unbekannten Tier) als wissensbasiertes Beispiel; Akinator ist der Kontrastfall (5 Min., Feld `wissen_akinator`). Plan, Materialien, KP, Musterlösungen angepasst. |
| «Erfahrungsschatz» | In DL 2 «Trainingsbeispiele», in DL 3 «Gewichte»: zwei Bedeutungen. | Einheitlich: Trainingsbeispiele = Erfahrungen (Daten); Erfahrungsschatz = das, was das Modell daraus behalten hat (beim Neuron Gewichte und Bias). Glossareintrag, Materialien, Plan. |
| DL 3 «korrigiert sich selbst» | Das Neuron korrigiert sich nicht selbst; die Lernregel ändert seine Werte. | Frage und Musterlösung (`perzeptron`) nennen die Lernregel: Änderung = Lernrate × (Ziel − Ausgabe) × Eingang. |
| DL 8 Trennschärfe | Der Wert liegt immer bei mindestens 50 %; «Raten ≈ 50 %» und «Merkmale taugen nicht» waren falsch. | `ki_foto_tools.py` berechnet die Zufallsbasis aus der Bildzahl (n = 16: etwa 60 %) und verzichtet auf die falsche Schlussfolgerung. |
| DL 10 Rückkopplung | Die Kette war als Tatsache formuliert. | Grafik und Seite sind als Gedankenexperiment mit vereinfachten Annahmen gekennzeichnet; als Beleg für reale Rückkopplung Ensign et al. 2018 («Runaway Feedback Loops in Predictive Policing»). |
| Glossar | Neun Begriffe fehlten. | Erfahrungsschatz, Lernrate, Epoche, Startwert, Modellwert, Trennschärfe, Einbettung, Rückkopplung, WMD (jetzt 38 Begriffe, «Zum Nachschlagen»-Links in den Abschnitten). |
| DL 2 Memory-Runde 3 | Ich hatte vorgeschlagen, die Runde zu streichen oder durch einen Mini-Bandit zu ersetzen, weil +1/0 das Vorgehen nicht ändert. | **Bleibt unverändert (Entscheid der Lehrperson).** Begründung: Beim normalen Memory-Spiel soll der Agent merken, dass eine Strategie besser ist als reiner Zufall; verstärkendes Lernen erleben die Lernenden erst bei NIM. |

*B · Erleben statt Erzählen*

| DL | Befund | Umsetzung (Minuten aus `planung.json`) |
|----|--------|----------------------------------------|
| 1 | Informieren: 15 Minuten Input am Stück. | 7 Min. Input (Regeln oder Daten) → 2 Min. Abruf ohne Unterlagen → 6 Min. Input (Begriffe, schwache/starke KI, Meilensteine) → 5 Min. Spamfilter zuerst ohne Unterlagen einordnen. Summe unverändert 20. |
| 3 | Lernschritt nur als Demo. | Verarbeiten 27 + 5 + 8 + 10 Min.: Tandem lässt in Experiment 3 den Lernschritt mit **OR** ablaufen (Vorhersage vor jedem Klick, erste Korrektur nachrechnen; bei OR bleibt w₁ unverändert, weil x₁ = 0), Feld `lernschritt_selbst`. Welle 1c hatte «Experiment 3 selbst durchführen» gestrichen, weil es als freiwillig markiert war; jetzt ist es ein fester Planschritt. |
| 4 | Die MobileNet-Skizze fehlte. | Neue Grafik `mobilenet_bruecke.svg` (Foto → MobileNet, bleibt fest → 1280 Zahlen → kleines Netz, lernt → Vorhersage) in der Brückenkarte. |
| 5 | Datenleck nur gezeichnet; «Vergleich · Drei Werte» stand in keinem Plan. | Neue Funktion `u.datenleck_versuch()`: dasselbe Netz, getestet mit leicht verrauschten Kopien der Trainingsbilder und mit neuen Bildern. Beispielwerte: 100 Trainingsbilder etwa 96 % gegen 84 %, 40 Bilder etwa 100 % gegen 67 %, 400 Bilder etwa 96 % gegen 94 %. Beides im Plan: Tandem 45 Min. (vorher 40), Einzeln 5 Min. (vorher 10), Puffer 10 Min.; Felder `datenleck_versuch`, `drei_werte`. |
| 6 | Keine Aktivität zum Lernziel «erkenne mögliche Überanpassung»; die Streuung über Startwerte entstand nur auf eigenen Wunsch. | `vergleich_zeigen` zeigt den Trainingswert als gestrichelte Linie und druckt den Abstand zu V1; die Journalfrage `comparison` fragt danach. Die Wiederholung mit den Startwerten 11, 22, 33 ist fester Teil der A/B-Etappe (eigene Zelle im Versuchsnotebook, ca. 5 Min., `selection` fragt nach der Reihenfolge); Projektauftrag und KP angepasst, «nach Absprache» und «keine Voraussetzung für eine gute Note» entfallen. |
| 9 | «Ich prüfe KI-Aussagen, indem …» wurde nie geübt. | Konstruierter Chat mit vier «gesicherten Fakten» (eine stimmt, zwei stimmen nicht, bei einer ist die Quelle erfunden), Prüfen mit admin.ch und bfs.admin.ch, 6 Min., Feld `sprache_transkript`. Soekia 37 statt 40 Min., Puffer 2 statt 5 Min. «Einbettung» als Fachwort markiert. |

*C · Beurteilung (Rest von R10)*

- **Überlappungen aufgelöst** (Raster und Bewertungsseite gleichlautend, KP angepasst): K6
  (schriftlich) bewertet Grenzen nach Ursache (Daten, Versuchsaufbau, Zufall) und die nächste
  Untersuchung; K9 (Gespräch) bewertet, was die Zahlen aussagen und was nicht, ohne «Grenzen» und
  «Beispiele» (K6, K5); K10 prüft das eigene Verständnis des ganzen Projekts (auch Teile des
  Partners) und die Übertragung, ohne «nächsten Versuch». K12 bleibt. Die Datentrennung zählt
  weiterhin in K2, K4, K8 und K12 (im KP vermerkt).
- **Ankerantworten K7–K10** (je Stufe 1 bis 3, am Beispiel Apfel/Birne mit Zahlenbeispiel) im KP.
  Die Datei `KI_Planung.md` wird nicht auf den Kursseiten veröffentlicht, steht aber im
  öffentlichen Repository.
- **Sollstufe kommunizieren:** Bewertungsseite, Raster und Projektauftrag sagen: alle elf Kriterien
  auf Stufe 2 = 22 Punkte = 4,25; für eine 5 sind vier Punkte mehr nötig (zum Beispiel Stufe 3 in
  vier Kriterien).
- **Absenzregel:** Der Vorschlag steht im KP jetzt als Arbeitsregel bis zum Entscheid des Fachteams
  (Ersatzgespräch mit anderer Fragenvariante innerhalb einer Woche, K12 wird nachgeholt). Die
  Kursseiten sagen weiterhin «keine Ersatztermine»; sie werden erst nach dem Entscheid angepasst.
- **Lesbarkeit:** nur gezielt (der längste Satz der Lernziele, die neuen Raster- und
  Sollstufen-Formulierungen). Die LIX-Werte von Bewertung, Lernziele, Sicherung und Glossar (56–59)
  sind durch Fachwörter und Kürzel (K1, T1/T2) geprägt; eine vollständige Überarbeitung steht aus.

*D · Messen*

Gemessen in echtem Pyodide 0.27 (WASM) unter Node auf dem Entwicklungsrechner, **nur Rechenzeit**
(kein Netzwerk, keine Browser-Oberfläche). Schüler-Geräte sind langsamer (Faktor 2–5 ist eine
Schätzung).

| Zelle | Zeit |
|-------|------|
| `import unterricht_tools` | 1,7 s |
| `datenleck_versuch(100)`, erster Lauf (inklusive scikit-learn-Import) | 3,4 s |
| `datenleck_versuch(40)` / `(400)` | 0,5 s / 0,8 s |
| `drei_rollen(100)` | 0,5 s |
| `vergleichen` mit einem / drei Startwerten und Diagramm (Übungsdaten) | 0,5 s / 1,2 s |
| dasselbe mit Apfel/Banane (Referenzdaten) | 0,4 s / 1,2 s |
| Pakete SciPy und scikit-learn aus dem lokalen Cache | 1,9 s |

Der Engpass ist der **Download**: Beim ersten Training lädt der Browser SciPy und scikit-learn
(zusammen etwa 70 MB je Gerät, danach im Browser-Cache). Im Schul-WLAN ist das nicht gemessen.
Die Materialien für DL 5 weisen darauf hin. Das **Referenzpaket** (Plan B in DL 8): Der Datenpfad
mit `testbilder/beispielbilder_fotostudio.json` läuft automatisch (`check_testbilder.py`,
einschliesslich drei Startwerten und Abschlusstest); das Journal-ZIP selbst entsteht im Browser
und wird nicht automatisch erzeugt. Die Lehrperson erzeugt es einmal im Probelauf (Notebook mit
`MODUS = 'EIGENE_DATEN'`, `KLASSEN = ['Apfel', 'Banane']`, Test einmal ausführen, ZIP sichern).

**Annahmen, die ich getroffen habe (Lehrperson bitte bestätigen oder ändern):**

1. Die Minutenverschiebungen in DL 1, 3, 5 und 9 sind Schätzungen und nicht im Unterricht
   erprobt (Beobachtungsplan Nr. 3, 4, 6).
2. Die Wiederholung mit drei Startwerten und der Vergleich der drei Werte gehören jetzt zum
   Unterricht (nicht mehr «freiwillig»). Dafür sind in DL 5 Einzeln 10 → 5 Min. und in DL 9
   Soekia 40 → 37 Min. gekürzt worden.
3. Die Absenzregel steht nur im KP (Arbeitsregel), nicht auf den Kursseiten.
4. Die Faktenbasis der DL-9-Übung: Landessprachen laut Bundesverfassung Art. 4, Bundesrat mit
   sieben Mitgliedern, Bevölkerung rund 9 Millionen (Bundesamt für Statistik); «Bundesamt für
   Sprachforschung» ist erfunden.
5. Der Leck-Versuch ist eine Vereinfachung (Ziffernbilder, verrauschte Kopien statt neu
   fotografierter Gegenstände). Auch die «neuen» Ziffernbilder stammen von denselben Schreibern;
   das steht in der Ausgabe.

**Weiterhin offen nach Welle 2:** R2 Nr. (10) Darstellbarkeit und Lernbarkeit in DL 4 trennen,
(11) «Wahr?» nur für Aussagen, (13) O'Neil-Kriterien als «gängige Zusammenfassung» kennzeichnen
und das tote Attribut `data-p1-diagnostic`; Freitext-Abruf («Vorwissen») in DL 3, 4 und 6;
Absenzregel (Entscheid Fachteam); Probelauf im Unterricht (Zeiten, Download im Schul-WLAN,
Referenzpaket); Rückmeldung zu Niveau und Stil von DL 1–2; Realitätsanker (AI Act, nDSG Art. 21)
fachlich prüfen.

**Verifikation Welle 2 (lokal, mit `.venv`: Python 3.14, numpy, scikit-learn, matplotlib, pillow):**
Stufe A (Builds, Modell-, Inhalts-, Materialien-, Lehrpersonen-, Editor- und Paritätstests),
die Routen-Tests und die Python-Tests `check_ki_fotos.py`, `check_ki_projekt.py`,
`check_ki_basis.py` (neu mit Prüfung des Leck-Versuchs: Kopien mindestens 15 Prozentpunkte über
neuen Bildern bei 40 Trainingsbildern) und `check_testbilder.py` bestehen, ebenso
`check_notebook_isolation.py`. Browser: `check_project_pages`, `check_portal` (auch mit
Notebook und Training), `check_course_theme`, `check_teacher_browser`,
`check_editor_course_matrix`, `check_admin_form`, `check_course_runtime_browser` und
`check_persistence`. Notebooks: `check_autostart`, `check_notebook_start_budget` (um
`datenleck_versuch` erweitert: schwere Zellen nie beim Start), `check_notebook_warmup`,
`check_notebook_snapshot`, `check_widget_rehydrate`, `check_notebook_performance`. In echtem
Pyodide laufen alle Notebooks der 4. Klasse in BOK, IRN und Vorlage (Quellen und gepackte
Kopien, 22 und 33 Läufe) sowie die Projekt-Gates fehlerfrei durch. Angepasst wurden zwei
Tests: `check_admin_form.cjs` liest die Zahl der Glossarbegriffe jetzt aus der Datei statt eine
feste Zahl zu erwarten (das Glossar wuchs von 29 auf 38), und `check_notebook_start_budget.cjs`
kennt die neue Zelle. `check_course_isolation.py` besteht, wenn das alte, ignorierte
Wurzelverzeichnis `content/` (lokales Überbleibsel, nicht im Repository) beiseitegelegt ist.
Nicht ausgeführt: `execute_notebooks.py` (Jupyter-Kernel; die Pyodide-Läufe decken dieselben
Notebooks ab) und alles, was ein Klassenzimmer braucht (Schul-WLAN, Schüler-Geräte, Zeiten).

**Verifikation Welle 1c (lokal):** Stufe A (Builds, Modell-, Inhalts-, Materialien-,
Lehrpersonen-, Editor- und Paritätstests) und die Routen-Tests bestehen; `check_portal.cjs`
(inklusive Notebook und Training), `check_project_pages.cjs`, `check_course_theme.cjs`,
`check_admin_form.cjs`, `check_teacher_browser.cjs`, `check_editor_course_matrix.cjs`,
`check_course_runtime_browser.cjs` und `check_persistence.cjs` bestehen, ebenso
`check_notebook_isolation.py` nach `build_portal_notebooks.py`. Nicht lokal ausführbar waren
`check_testbilder.py`, `check_ki_projekt.py`, `check_ki_fotos.py` und `check_ki_basis.py` (es
fehlen numpy und matplotlib) sowie `check_course_isolation.py` (wegen eines ignorierten
Verzeichnisses `content/`).

## Anhang A: Methodik der Messungen

- **Minuten:** aus `planung.json`, alle Schritte ausser «Ergebnis», nach Sozialform
  (Lehrperson, Klasse, Einzeln, Tandem/Gruppe). In allen DL ergibt die Summe 90.
- **Text und Felder:** gebautes HTML, je Bereich `main > section#<id>`, ohne
  `details.lesson-plan`, `details.project-lessons`, Navigation und Skripte. LIX =
  Wörter/Sätze + 100 × (Wörter mit > 6 Buchstaben)/Wörter; WSF = Wiener Sachtextformel 1.
  Silben- und Satzerkennung sind heuristisch. Felder = verschiedene `data-answer`,
  `data-journal` und `data-basis-answer`. Felder je Selbsttätigkeitsminute = Felder/(Einzeln +
  Tandem).
- **Begriffsmatrix:** Regex-Stämme je Begriff (z. B. `datenleck|durchgesickert`), Zählung
  im sichtbaren Text; DL 5–7 = Bereiche `projekt` und `journal`.
- **DL 8 vorher/nachher:** Vergleich des sichtbaren Textes der DL-8-Seiten bei `06ada39`
  und `e2ddddf`.
- **Lernraten-Versuch:** Handsimulation der Lernregel aus `unterricht_tools.py`
  (`_Lerner`, Lernregel `neu = alt + Lernrate × (Ziel − Ausgabe) × Eingang`, Eingaben in
  der Reihenfolge (0,0), (0,1), (1,0), (1,1), Start 0,2/0,2/−0,5, höchstens 30 Runden).
  Ergebnis AND: 2/3/6/6 Runden für Lernrate 0,05/0,2/0,5/1,0 (gezählt wird die Runde ohne
  Korrektur); NOR: 18/7/4/4.
- **Trennschärfe:** `trenn = max(gerade, gekreuzt)/n`. Bei n = 80 unabhängigen Bildern
  und zufälligen Vorhersagen ist E = 54,45 %, P(≥ 65 %) = 0,97 %. Bei vollständig
  einheitlichen Vorhersagen je Exemplar (10 Exemplare, k ~ Bin(10; ½)) ist E = 62,3 % und
  P(≥ 70 %) = 352/1024 = 34,4 %.
- **Notenschlüssel:** Note = 1 + 5 × P/33, auf Viertel gerundet: 22 P → 4,33 → 4,25; 26 P →
  4,94 → 5,0; 32 P → 5,85 → 5,75; 33 P → 6,0.
- **Vergleich der «Entlastung» (`ce8ff95`):** Summen der Schritte je Sozialform in
  `netze/planung.json` und `perzeptron/planung.json` vor und nach dem Commit.

## Anhang B: Abweichungen zwischen BOK, IRN und Vorlage

- Lernendenseiten: textgleich bis auf `perzeptron/030` (Fettdruck «**AND**» in BOK) und
  `perzeptron/040` (BOK «AND», IRN «UND»). `einstieg/030` unterscheidet sich nur im Markup.
- Dateien, die sich unterscheiden und nicht inhaltlich verglichen wurden:
  `lehrperson/materialien.md`, `content/README.md`, `worksheets/README.md`.
- Konsequenz: Die Befunde gelten für alle drei Kurse. Korrekturen gehören in alle drei Kurse
  und in die Vorlage (siehe [Kursvorlagen](./KURSVORLAGEN.md)).

## Anhang C: Verwendete Literatur

Alle Quellen wurden von den Recherche-Agenten geöffnet. Ohne Marke: Volltext oder
vollständiger Abstract gelesen. † = nur Metadaten, gekürzter Abstract oder Abstract hinter
Paywall (Volltext nicht gelesen). ‡ = Preprint oder nicht begutachtet. Die im Bericht
genannten Zahlen stammen aus den geöffneten Texten bzw. Abstracts; Effektstärken, die die
Agenten nur aus Sekundärquellen kannten (Adesope 2017, Rowland 2014, Kyndt 2013), werden
nicht verwendet. Namen und Titel stehen so, wie die Recherche sie belegt hat; wo sie nur als
«et al.» vorlagen, wurde nichts ergänzt.

**Lernforschung**

- Adesope, Trevisan & Sundararajan (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research, 87*(3), 659–701. doi:10.3102/0034654316689306 †
- Alfieri et al. (2011). Does discovery-based instruction enhance learning? *Journal of Educational Psychology, 103*(1), 1–18. doi:10.1037/a0021017
- Ayres, P., & Sweller, J. (2022). The split-attention principle. In *The Cambridge Handbook of Multimedia Learning* (3. Aufl., S. 199–211). doi:10.1017/9781108894333.020 †
- Bamberger, R., & Vanecek, E. (1984). *Lesen – Verstehen – Lernen – Schreiben.* Jugend und Volk/Diesterweg.
- Belland, Walker, Kim & Lefler (2017). Synthesizing results from empirical research on computer-based scaffolding in STEM education. *Review of Educational Research, 87*(2), 309–344. doi:10.3102/0034654316670999
- Björnsson, C.-H. (1968). *Läsbarhet.* Liber/Lärarbiblioteket.
- Black & Wiliam (1998). Assessment and classroom learning. *Assessment in Education, 5*(1), 7–74. doi:10.1080/0969595980050102
- CAST (2024). *Universal Design for Learning Guidelines*, Version 3.0. udlguidelines.cast.org
- Carless & Boud (2018). The development of student feedback literacy. *Assessment & Evaluation in Higher Education, 43*(8), 1315–1325. doi:10.1080/02602938.2018.1463354
- Cepeda et al. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin, 132*(3), 354–380. doi:10.1037/0033-2909.132.3.354
- Chen, O., Paas, F., & Sweller, J. (2023). A CLT approach to defining task complexity through element interactivity. *Educational Psychology Review, 35*(2), Art. 48. doi:10.1007/s10648-023-09782-w
- Deunk et al. (2018). Effective differentiation practices: A systematic review and meta-analysis. *Educational Research Review, 24*, 31–54. doi:10.1016/j.edurev.2018.02.002
- Dignath & Büttner (2008). Components of fostering self-regulated learning among students. *Metacognition and Learning, 3*(3), 231–264. doi:10.1007/s11409-008-9029-x
- Donker et al. (2014). Effectiveness of learning strategy instruction on academic performance. *Educational Research Review, 11*, 1–26. doi:10.1016/j.edurev.2013.11.002
- Double, McGrane & Hopfenbeck (2020). The impact of peer assessment on academic performance. *Educational Psychology Review, 32*(2), 481–509. doi:10.1007/s10648-019-09510-3
- Dunlosky et al. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest, 14*(1), 4–58. doi:10.1177/1529100612453266
- Eccles & Wigfield (2020). From expectancy-value theory to situated expectancy-value theory. *Contemporary Educational Psychology, 61*, 101859. doi:10.1016/j.cedpsych.2020.101859 †
- Elhusseini, S. A., Tischner, C. M., Aspiranti, K. B., & Fedewa, A. L. (2022). A quantitative review of the effects of self-regulation interventions. *Metacognition and Learning, 17*(3), 1117–1139. doi:10.1007/s11409-022-09311-0
- Freeman et al. (2014). Active learning increases student performance in science, engineering, and mathematics. *PNAS, 111*(23), 8410–8415. doi:10.1073/pnas.1319030111
- Hattie & Timperley (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112. doi:10.3102/003465430298487
- Herold, M., & Landherr, B. (2003). *Selbstorganisiertes Lernen: SOL – ein systemischer Ansatz für den Unterricht* (2. Aufl.). Schneider Verlag Hohengehren.
- Hmelo-Silver, Duncan & Chinn (2007). Scaffolding and achievement in problem-based and inquiry learning. *Educational Psychologist, 42*(2), 99–107. doi:10.1080/00461520701263368
- Johnson & Johnson (2018). Cooperative learning: The foundation for active learning. In *Active Learning – Beyond the Future.* IntechOpen. doi:10.5772/intechopen.81086
- Johnson, J. W. (2020). Benefits and pitfalls of Jupyter notebooks in the classroom. *SIGITE '20*, 32–37. doi:10.1145/3368308.3415397 †
- Kalyuga, S. (2022). The expertise reversal principle. In *The Cambridge Handbook of Multimedia Learning* (3. Aufl., S. 171–182). doi:10.1017/9781108894333.017 †
- Kapur (2016). Examining productive failure, productive success, unproductive failure, and unproductive success. *Educational Psychologist, 51*(2), 289–299. doi:10.1080/00461520.2016.1155457 †
- Kirschner, Sweller & Clark (2006). Why minimal guidance during instruction does not work. *Educational Psychologist, 41*(2), 75–86. doi:10.1207/s15326985ep4102_1
- Kirschner, P. A., Sweller, J., Kirschner, F., & Zambrano R., J. (2018). From cognitive load theory to collaborative cognitive load theory. *International Journal of Computer-Supported Collaborative Learning, 13*(2), 213–233. doi:10.1007/s11412-018-9277-y
- Kyndt et al. (2013). A meta-analysis of the effects of face-to-face cooperative learning. *Educational Research Review, 10*, 133–149. doi:10.1016/j.edurev.2013.02.002 †
- Latimier, Peyre & Ramus (2021). Benefit of spacing out retrieval practice episodes on retention. *Educational Psychology Review, 33*(3), 959–987. doi:10.1007/s10648-020-09572-8
- Lazonder & Harmsen (2016). Meta-analysis of inquiry-based learning: Effects of guidance. *Review of Educational Research, 86*(3), 681–718. doi:10.3102/0034654315627366
- Lee et al. (2011). Computational thinking for youth in practice. *ACM Inroads, 2*(1), 32–37. doi:10.1145/1929887.1929902 †
- Li, Xiong, Hunter, Guo & Tywoniw (2020). Does peer assessment promote student learning? *Assessment & Evaluation in Higher Education, 45*(2), 193–211. doi:10.1080/02602938.2019.1620679
- Loibl, Roll & Rummel (2017). Towards a theory of when and how problem solving followed by instruction supports learning. *Educational Psychology Review, 29*(4), 693–715. doi:10.1007/s10648-016-9379-x
- Mayer, R. E. (2021). *Multimedia Learning* (3. Aufl.). Cambridge University Press. ISBN 978-1-107-18750-4
- Mayer, R. E., & Fiorella, L. (2022). Segmenting, pre-training, and modality principles. In *The Cambridge Handbook of Multimedia Learning* (3. Aufl., S. 243–260). doi:10.1017/9781108894333.025 †
- Panadero (2017). A review of self-regulated learning: Six models and four directions for research. *Frontiers in Psychology, 8*, 422. doi:10.3389/fpsyg.2017.00422
- Panadero & Jonsson (2013). The use of scoring rubrics for formative assessment purposes revisited. *Educational Research Review, 9*, 129–144. doi:10.1016/j.edurev.2013.01.002
- Patall, Cooper & Robinson (2008). The effects of choice on intrinsic motivation and related outcomes. *Psychological Bulletin, 134*(2), 270–300. doi:10.1037/0033-2909.134.2.270
- Renkl, A. (2022). The worked example principle. In *The Cambridge Handbook of Multimedia Learning* (3. Aufl., S. 231–240). doi:10.1017/9781108894333.023 †
- Rowland (2014). The effect of testing versus restudy on retention. *Psychological Bulletin, 140*(6), 1432–1463. doi:10.1037/a0037559 †
- Ryan & Deci (2020). Intrinsic and extrinsic motivation from a self-determination theory perspective. *Contemporary Educational Psychology, 61*, 101860. doi:10.1016/j.cedpsych.2020.101860 †
- Schmidt, F. T. C., Kaiser, A., & Retelsdorf, J. (2023). Halo effects in grading: An experimental approach. *Educational Psychology, 43*(2–3), 246–262. doi:10.1080/01443410.2023.2194593
- Sinha & Kapur (2021). When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research, 91*(5), 761–798. doi:10.3102/00346543211019105
- Sorva, J. (2013). Notional machines and introductory programming education. *ACM Transactions on Computing Education, 13*(2), Art. 8. doi:10.1145/2483710.2483713 †
- Städeli, C., Grassi, A., Obrist, W., & Rhiner, K. (2013). *Kompetenzorientiert unterrichten – das AVIVA-Modell* (2. Aufl.). hep Verlag.
- Sweller, van Merriënboer & Paas (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review, 31*(2), 261–292. doi:10.1007/s10648-019-09465-5
- Umapathy & Ritzhaupt (2017). A meta-analysis of pair-programming in computer programming courses. *ACM Transactions on Computing Education, 17*(4), Art. 16. doi:10.1145/2996201
- van Gog, T., & Rummel, N. (2010). Example-based learning. *Educational Psychology Review, 22*(2), 155–174. doi:10.1007/s10648-010-9134-7
- Wisniewski, Zierer & Hattie (2020). The power of feedback revisited. *Frontiers in Psychology, 10*, 3087. doi:10.3389/fpsyg.2019.03087
- Zhong, B., Wang, Q., Chen, J., & Li, Y. (2017). Investigating the period of switching roles in pair programming in a primary school. *Educational Technology & Society, 20*(3), 220–233.

**KI-Bildung, Kompetenzrahmen, Lehrpläne**

- Bewersdorff, A., Zhai, X., Roberts, J., & Nerdel, C. (2023). Myths, mis- and preconceptions of artificial intelligence. *Computers and Education: AI, 4*, 100143. doi:10.1016/j.caeai.2023.100143 †
- Casal-Otero et al. (2023). AI literacy in K-12: a systematic literature review. *International Journal of STEM Education, 10*, 29. doi:10.1186/s40594-023-00418-7 †
- EDK (2024). *Rahmenlehrplan für die Maturitätsschulen.* edudoc.ch/record/232281
- GI (2016). *Bildungsstandards Informatik für die Sekundarstufe II.* Beilage LOG IN 36(1). GI (2023). *Künstliche Intelligenz in der Bildung* [Positionspapier]. GI (2024). Stellungnahme zu den KMK-Handlungsempfehlungen.
- Kanoh (2024). Studie zu Fehlvorstellungen bei Teachable Machine («Clarifying misconceptions …», Titel in der Recherche gekürzt). *JSSE Research Report, 39*(1), 59–64. doi:10.14935/jsser.39.1_59
- Kapoor & Narayanan (2023). Leakage and the reproducibility crisis in machine-learning-based science. *Patterns, 4*(9), 100804. doi:10.1016/j.patter.2023.100804
- Kanton Zürich (2018/2022). *Lehrplan für die Maturitätsschulen, Fach Informatik.* Bildungsrat.
- Long & Magerko (2020). What is AI literacy? *CHI 2020.* doi:10.1145/3313831.3376727 †
- Marques, von Wangenheim & Hauck (2020). Teaching machine learning in school. *Informatics in Education, 19*(2), 283–321. doi:10.15388/infedu.2020.14
- Marx, Witt & Leonhardt (2024). Identifying secondary school students' misconceptions about machine learning. *WiPSCE '24.* doi:10.1145/3677619.3678114 †
- Müller-Unterweger, Lindner, Löffler & Berges (2025). Das Wollperzeptron – eine Unplugged-Aktivität zum ML. *IBiS, 3*(2). doi:10.18420/ibis-03-02-07
- Ng, Leung, Chu & Qiao (2021). Conceptualizing AI literacy. *Computers and Education: AI, 2*, 100041. doi:10.1016/j.caeai.2021.100041
- OECD/Europäische Kommission (2026). *Empowering learners for the age of AI: An AI literacy framework for primary and secondary education.* doi:10.1787/65cd27d4-en
- Raschka (2018). Model evaluation, model selection, and algorithm selection in machine learning. arXiv:1811.12808 ‡
- Smilkov, Carter, Sculley, Viégas & Wattenberg (2017). Direct-manipulation visualization of deep networks. arXiv:1708.03788 ‡
- Sulmont, Patitsas & Cooperstock (2019). What is hard about teaching machine learning to non-majors? *ACM Transactions on Computing Education, 19*(4). doi:10.1145/3336124 †
- Tedre et al. (2021). Teaching machine learning in K–12 classroom. *IEEE Access, 9*, 110558–110572. doi:10.1109/ACCESS.2021.3097962 †
- Touretzky, Gardner-McCune, Martin & Seehorn (2019). Envisioning AI for K-12. *Proceedings of the AAAI Conference on Artificial Intelligence, 33*(1), 9795–9799. doi:10.1609/aaai.v33i01.33019795
- UNESCO (2024). *AI competency framework for students.* doi:10.54675/JKJB9835
- Valdenegro-Toro & Sabatelli (2022). ML students overfit to overfitting. arXiv:2209.03032 ‡

**Sprachmodelle, generative KI, Beurteilung, Ethik**

- Bastani, H., et al. (2025). Generative AI without guardrails can harm learning. *PNAS, 122*(26), e2422633122. doi:10.1073/pnas.2422633122
- Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots. *FAccT 2021*, 610–623. doi:10.1145/3442188.3445922 †
- Bråten, I., Latini, N., & Strømsø, H. I. (2026). Exploring students' (mis)conceptions about ChatGPT-generated text. *Education and Information Technologies, 31*(12), 4637–4658. doi:10.1007/s10639-026-13938-w †
- Corbin, T., Dawson & Liu (2025). Talk is cheap. *Assessment & Evaluation in Higher Education, 50*(7), 1087–1097. doi:10.1080/02602938.2025.2503964 †
- Ensign, D., Friedler, S. A., Neville, S., Scheidegger, C., & Venkatasubramanian, S. (2018). Runaway feedback loops. *PMLR, 81*, 160–171. proceedings.mlr.press/v81/ensign18a.html
- Fan, Y., et al. (2025). Beware of metacognitive laziness. *British Journal of Educational Technology, 56*(2), 489–530. doi:10.1111/bjet.13544 †
- Fasiang, K., & Long, D. (2025). *Large Language MadLibs.* Model AI Assignment, AAAI/EAAI-25. modelai.gettysburg.edu/2025/madlibs
- HRK KI-LOTSE (2026). Arbeitsgruppe «KI & Prüfen», Fallvignetten. ki-lotse.ai
- Hielscher, M., Döbeli Honegger, B., Steinbach, N., & Hartmann, W. (2025). Statistische Sprachmodelle selbst konstruieren und explorieren mit SoekiaGPT. *INFOS 2025*, 89–96. doi:10.18420/infos2025_pr_5 †
- Kasneci, E., et al. (2023). ChatGPT for good? *Learning and Individual Differences, 103*, 102274. doi:10.1016/j.lindif.2023.102274 †
- Kanton Zürich, Mittelschul- und Berufsbildungsamt: Projekt «Einführung KI an der Sek II». help.mba.zh.ch
- Kofinas, Tsay & Pike (2025). *British Journal of Educational Technology, 56*(6), 2522–2549. doi:10.1111/bjet.13585
- Kosmyna, N., et al. (2025). Your brain on ChatGPT. arXiv:2506.08872 ‡
- LCH (2024). *Künstliche Intelligenz in der Schule* [Positionspapier]. lch.ch
- Lee, H.-P., et al. (2025). The impact of generative AI on critical thinking. *CHI 2025.* doi:10.1145/3706598.3713778 †
- Louie, J., Stiles, J., Fagan, E., Chance, B., & Roy, S. (2022). *Educational Technology & Society, 25*(4), 142–163 †; Ma, M., Ng, D. T. K., Liu, Z., & Wong, G. K. W. (2025). *Computers and Education: AI, 8*, 100422. doi:10.1016/j.caeai.2025.100422 †
- Mitchell, M., & Krakauer, D. C. (2023). The debate over understanding in AI's large language models. *PNAS, 120*(13), e2215907120. doi:10.1073/pnas.2215907120
- OECD (2026). *Digital Education Outlook 2026: Exploring effective uses of generative AI in education.* doi:10.1787/062a7394-en †
- O'Neil, C. (2016). *Weapons of Math Destruction.* Crown. ISBN 978-0-553-41881-1
- Pangrazio, L., & Selwyn, N. (2019). 'Personal data literacies'. *New Media & Society, 21*(2), 419–437. doi:10.1177/1461444818799523 †
- Perkins, M., Furze, L., Roe, J., & MacVaugh, J. (2024). AI Assessment Scale (AIAS). *Journal of University Teaching and Learning Practice, 21*(6). doi:10.53761/q3azde36; revidiert: Perkins, M., Roe, J., & Furze, L. (2025). *JUTLP, 22*(7). doi:10.53761/rrm4y757
- swissuniversities (2024). *Die Schweizer Hochschulen und künstliche Intelligenz* [Positionspapier].
- UNESCO (2023). *Guidance for generative AI in education and research.* doi:10.54675/EWZM9535
- Verordnung (EU) 2024/1689, Art. 4; geändert durch Verordnung (EU) 2026/1744.
- ZHAW/Swisscom (2024). *JAMES-Studie 2024.* PH Zürich: KI-Wiki (tiny.phzh.ch/ki-wiki). SKBF (2026). *Bildungsbericht Schweiz 2026.*

**Zitierhinweise (Korrekturen gegenüber verbreiteten Angaben).** Kirschner et al. 2018: vierter
Autor ist Zambrano R. (nicht Paas). Segmentierungsprinzip in der 3. Auflage des Cambridge
Handbook: Mayer & Fiorella (nicht Mayer & Pilegard). Herold & **Landherr** (nicht Herold &
Herold). AVIVA: Reihenfolge Grassi vor Obrist; die Neuauflage 2024 hat andere Autor:innen.
Double, Mc**Grane** & Hop**fenbeck** (nicht McGrath/Tuck). Umapathy & Ritzhaupt erschien in
*ACM Transactions on Computing Education*. Corbin: Vorname Thomas. Fan et al. untersuchten
117 Studierende, Lee et al. 319 Wissensarbeitende. Kapoor & Narayanan: Die finalen Zahlen
(22 Übersichten, 17 Felder, 294 Arbeiten) weichen vom Preprint (20 und 329) ab. Das
OECD/EC-Rahmenwerk liegt seit 18.6.2026 in Endfassung vor, DigComp 3.0 seit 27.11.2025.

## Anhang D: Nicht verifiziert und Lücken

- Anderson & Krathwohl (2001), revidierte Bloom-Taxonomie: klassische Referenz, in dieser
  Recherche nicht neu geprüft (Abschnitt 2.5).
- Der Wortlaut der «Papagei»-Definition bei Bender et al. 2021 war im Volltext nicht
  zugänglich; die Wort-Trias «Opacity, Scale, Damage» bei O'Neil ist nur über eine Rezension
  belegt.
- Sorva (2018), «Misconceptions and the Beginner Programmer»: nur Metadaten, nicht
  bestätigt.
- Nicht gefunden: eine XOR-spezifische Fachdidaktikstudie, eine K-12-Studie zum
  Train/Test-Verständnis, ein EDK- oder uniko-Papier zu KI und Prüfungen, eine
  CS-Unplugged-Lektion zu n-Grammen, eine SIGCSE-Studie zu Bias-Einheiten.
- Das Verhalten externer Werkzeuge (inf-schule, Soekia) haben die Agenten am Analysetag
  abgerufen, aber nicht im Schulnetz getestet.
