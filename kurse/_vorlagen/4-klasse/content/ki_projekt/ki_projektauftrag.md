# KI-Projekt im Tandem

**Zwei Bildklassen · ein Vergleich · fünf Reflexionen · individuelles Fachgespräch**

> Helfen vielfältigere Trainingsbilder beim Erkennen neuer Gegenstände oder Personen?

## Auftrag

Wählen Sie eine Anwendung aus dem Ideenpool und genau zwei Klassen, die kein anderes Tandem verwendet (Eintrag in die Klassenliste der Lehrperson). Sammeln Sie 80 Fotos gemäss Datenplan: fünf unabhängige Gruppen, acht Fotos je Klasse und Gruppe. Beide Klassen werden unter gleichen Bedingungen fotografiert; Personen nur mit Einverständnis (Details in `ki_fotodaten.md`).

Das vortrainierte Bildmodell liefert feste Merkmale. Sie trainieren darauf ein eigenes kleines neuronales Netz. Sie untersuchen Daten und Ergebnisse; Sie müssen den Hilfscode nicht selbst programmieren.

| Variante A | Variante B | Gleich bleibt |
|---|---|---|
| Ein Exemplar je Klasse, acht Fotos aus T1 | Zwei Exemplare je Klasse, je vier Fotos aus T1 und T2 | Acht Bilder je Klasse, 16 Neuronen, 60 Epochen, Startwert 11, Validierungsbilder |

V1 dient der Auswahl. Erst nach der begründeten Wahl wird auf P1/P2 getestet. Danach nichts mehr optimieren. Die technische Sperre unterstützt diese Arbeitsregel; sie ist kein Zugriffsschutz.

## Fünf Reflexionen im Journal

1. **Was möchten wir erkennen?** Zwei Klassen, ein möglicher Grenzfall und unsere Vermutung zu mehr Bildvielfalt. Kurzer Etappenplan.
2. **Sind unsere Bilder geeignet?** Fünf Gruppen, Herkunft und Aufnahmebedingungen sowie ein mögliches Datenproblem.
3. **Was unterscheidet A und B?** Ergebnisse auf V1 und eine konkrete Vorhersage; mögliche Erklärung. **Vor dem Test** die Modellwahl begründen.
4. **Was passiert mit neuen Bildern?** Testergebnis und drei konkrete Vorhersagen beschreiben; Nutzen und Grenzen nennen. Auch richtige Beispiele sind interessant – keine Fehler erfinden.
5. **Was haben wir gelernt?** Fazit, nächster Versuch, Arbeitsteilung und verwendete Hilfen (einschliesslich KI).

Ein einziger Lauf und wenige Exemplare sind eine begrenzte Untersuchung. Eine hohe Trefferquote oder eine bestätigte Vermutung ist keine Voraussetzung für eine gute Note. Wiederholungen mit drei festgelegten Startwerten sind vor Testeinsicht möglich; alle Ergebnisse berichten.

## Etappen-Check: Bereit für den nächsten Schritt?

Die fünf Checks helfen Ihnen, den eigenen Fortschritt einzuschätzen. Sie sind **keine zusätzlichen Abgaben und keine zusätzlichen Bewertungskriterien**. Arbeiten Sie die Etappen in der angegebenen Reihenfolge durch, teilen Sie Ihre Zeit in Doppellektion 5–7 aber selbst ein. Falls etwas fehlt, klären Sie es im Tandem oder holen Sie gezielt Hilfe.

### 1. Anwendung und Plan
- [ ] Wir haben zwei klar unterscheidbare Klassen und ein freigegebenes Thema.
- [ ] Wir können in einem Satz sagen, was wir mit A und B untersuchen.
- [ ] Wir haben eine Vermutung und einen realistischen Etappenplan mit wechselnden Rollen.

**Weiter, wenn:** Wir wissen, was wir testen und welche Bilder wir benötigen.

### 2. Bilder und Gruppen
- [ ] Wir haben je Klasse acht Bilder in jeder der fünf Gruppen T1, T2, V1, P1 und P2.
- [ ] Bilder desselben Exemplars bzw. derselben Person sind nicht auf mehrere Gruppen verteilt.
- [ ] Beide Klassen wurden vergleichbar aufgenommen; Quellen und Besonderheiten stehen in Reflexion 2.
- [ ] Unsere Fotos und die Fotostudio-JSON sind separat gesichert.

**Weiter, wenn:** Der Datenimport funktioniert und wir erklären können, weshalb Trainings- und Prüfbilder getrennt sind.

### 3. Modelle A und B vergleichen
- [ ] Wir haben A und B mit den vorgegebenen gleichen Einstellungen trainiert.
- [ ] Wir kennen den Unterschied zwischen den Trainingsbildern von A und B.
- [ ] Wir haben die Resultate auf V1 und mindestens eine konkrete Vorhersage angesehen.
- [ ] Wir haben **vor Einsicht in P1/P2** in Reflexion 3 begründet, welches Modell wir auswählen.

**Weiter, wenn:** Unsere Modellwahl feststeht. Eine hohe Trefferquote ist nicht nötig.

### 4. Abschlusstest verstehen
- [ ] Wir haben nur die ausgewählte Variante auf P1/P2 getestet und danach nichts mehr optimiert.
- [ ] Wir können drei konkrete Vorhersagen erklären, auch wenn alle richtig sind.
- [ ] Wir unterscheiden, was unsere Ergebnisse zeigen und was wir damit noch nicht wissen.

**Weiter, wenn:** Testausgaben und Reflexion 4 gesichert sind.

### 5. Abgabe und Fachgespräch vorbereiten
- [ ] Alle fünf Reflexionen sind verständlich und mit eigenen Resultaten verbunden.
- [ ] Wir haben das Notebook mit Ausgaben, Originalbilder, JSON und Journal im ZIP überprüft.
- [ ] Beide können die Datentrennung, den A/B-Vergleich und mindestens ein eigenes Ergebnis ohne Ablesen erklären.
- [ ] Wir haben die ZIP-Datei **über den Abgabekanal eingereicht**; ein Download allein reicht nicht.

**Fertig, wenn:** Abgabe eingereicht und beide auf das individuelle Fachgespräch vorbereitet sind.

## So planen und steuern Sie Ihre Projektarbeit

In **Doppellektion 5–7** steuern Sie Ihre Arbeit im Tandem selbst. Es gibt keine gemeinsame Vorgabe «heute alle trainieren». Die fachliche Reihenfolge bleibt verbindlich:

**Daten prüfen → A/B vergleichen → Auswahl begründen → Abschlusstest → Fazit und Abgabe.**

- **Sie entscheiden:** Thema im genehmigten Rahmen, Tagesziele, Zeitverteilung, Rollen und benötigte Hilfen. Nutzen Sie das Lernlabor einmal als Orientierung, falls Sie den Ablauf noch nicht kennen.
- **Verbindlich bleiben:** Datenplan, fairer Vergleich, fünf Reflexionen, Auswahl vor Testeinsicht, keine Optimierung danach und die Abgabefrist.
- **Planen:** Ergänzen Sie in Reflexion 1 einen kurzen Etappenplan mit Zuständigkeiten, Zeitbedarf und Reserve. Beide übernehmen praktische und erklärende Aufgaben; wechseln Sie die Rollen.
- **Steuern:** Am Ende jeder Arbeitsphase im bestehenden Journal kurz ergänzen: erreicht, offen, nächster Schritt, benötigte Hilfe. Passen Sie den Plan bei Bedarf an; kein zusätzliches Lerntagebuch.
- **Prüfen:** Nutzen Sie das Raster für fehlende Belege und erklären Sie sich gegenseitig das ganze Projekt. In Reflexion 5 beurteilen Sie auch, was an Ihrem Plan funktionierte und was Sie änderten. Diese Hinweise sind keine zusätzlichen Bewertungskompetenzen.

Die Lehrperson bietet kurze Beratungen zu Ihren Fragen an, statt die Klasse bei jeder Etappe anzuhalten. Melden Sie frühzeitig, wenn Daten oder Technik den Abschluss gefährden.

## Zeitrahmen und Termine

| Zeitpunkt | Rahmen |
|---|---|
| Doppellektion 4 | Vorbereitungsauftrag: Thema und zwei Klassen aus der Themenliste wählen, die kein anderes Tandem verwendet (Eintrag in die Klassenliste), und zehn verschiedene Exemplare besorgen (fünf je Klasse); noch nicht fotografieren, keine Datenplanung |
| Anfang Doppellektion 5 | Lehrperson gibt Thema und zwei Klassen frei, wenn die Klassen in der Klassenliste noch frei sind, während die Tandems den Lernpfad zur Datenaufteilung lesen |
| Doppellektion 5 | Lernpfad, dann Exemplarliste (fünf unabhängige Gruppen) planen und abnehmen lassen; erst danach fotografieren |
| Mitte Doppellektion 6 | Fotos importiert; fehlen sie noch, sofort mit der Lehrperson klären: gezielt nachfotografieren oder Modus `ERSATZ` (Übungsformen, offen als Ersatzdaten gekennzeichnet) |
| Doppellektionen 5–7 | Eigener Etappenplan, selbstständige Arbeit, Beratung und laufende Sicherung; Etappen frei auf die Zeit verteilen |
| vor Beginn der Doppellektion 8 | Vollständiges ZIP über den Abgabekanal einreichen |
| Doppellektion 8 | Fachgespräch; parallel selbstständige Fremdauswertung mit Rückmeldung |

Die **20 Einzelgespräche** finden mit **einer Lehrperson** direkt ab Beginn der **Doppellektion 8** statt: **4 Minuten pro Person** plus **1 Minute für Bewertung, Notizen und Wechsel**. Das ergibt **100 Minuten**: 90 Minuten Unterricht und **10 Minuten im unmittelbaren Anschluss** für die letzten zwei Personen. Es gibt keinen Zeitpuffer. Die Lehrperson teilt die festen Gesprächsfenster, Austauschprojekte und den Abgabekanal spätestens vor der Doppellektion mit. Alle anderen beginnen sofort selbstständig mit der Fremdauswertung; es gibt keine zusätzliche Einführung oder gemeinsame Schlussbesprechung und keine Ersatztermine.

### Während der Fachgespräche: ein fremdes Modell auswerten (DL 8)

Arbeiten Sie im Tandem selbstständig und pausieren Sie jeweils nur für Ihr persönliches Einzelgespräch; die andere Person kann weiterarbeiten. Die gemeinsame Fremdauswertung ist **unbenotet (K11)**; nur die persönliche Reflexion K12 zählt 3 Punkte; die bewertete eigene Abgabe bleibt unverändert.

1. **Dateien vorbereiten, ca. 10 Minuten:** Öffnen Sie das zugeteilte fremde Projekt im **privaten Browserfenster**. Die Lehrperson teilt Ihnen ein Projekt mit anderen Klassen als Ihren zu. Legen Sie Ihre eigene Fotostudio-JSON separat bereit; stellen Sie das eigene ZIP dort nicht wieder her. Datenrechte und Bildfreigaben beachten. Läuft nichts, hilft die Notfallkarte auf der Seite «Dateien vorbereiten» (Referenzpaket der Lehrperson).
2. **Daten und Ergebnisse untersuchen, ca. 20 Minuten:** Vergleichen Sie T1/T2 (Training), V1 (Validierung) und P1/P2 (unabhängiger Abschlusstest) im fremden Projekt. Prüfen Sie mindestens ein konkretes Trainings- und Testexemplar und lesen Sie Originalwerte A/B sowie das Testergebnis. Lassen Sie das fremde Notebook einmal mit Startwert 11 nachlaufen und vergleichen Sie einen Wert.
3. **Versuch mit den eigenen Klassen, ca. 15 Minuten:** Lassen Sie dasselbe Modell eigene Bilder aus Ihren **zwei anderen Klassen** vorhersagen. Protokollieren Sie die Vorhersagen und untersuchen Sie Beispiele. Die Vorhersagen sind **keine Trefferquote für diese Klassen**: Das fremde Modell kennt nur seine ursprünglichen zwei Klassen. Seine P1/P2-Bilder sind dagegen neue Exemplare **derselben** Klassen und gehören gerade nicht ins Training.
4. **Erst danach reflektieren:** Gemeinsam zwei Sätze als Rückmeldung für das geprüfte Tandem formulieren (die Lehrperson gibt sie in Doppellektion 9 aus); jede Person beantwortet **zwei kurze Fragen** zu Originalergebnissen, Experiment, Datenrollen, Grenzen und nächstem Test. Separates ZIP herunterladen und einreichen, danach fremdes ZIP und entpackten Ordner löschen; das private Fenster erst nach dem Download schliessen.

Für Gespräch, Wiedereinstieg und Technik bleibt Reserve. Bei einem nicht lösbaren Trainingsproblem werten Sie die gespeicherten fremden Ausgaben aus und dokumentieren ausdrücklich, welcher Versuch nicht möglich war. Die Auswertung entfällt nicht, aber Sie behaupten keinen erfolgreichen Test. Erhaltene Fotos nur für diesen Auftrag verwenden und nach der vereinbarten Aufbewahrungsregel löschen.

## Bewertung

Elf benotete Kriterien mit je **0–3 Punkten**, maximal **33 Punkte**. K1–K6: gemeinsame Projektabgabe (18); K7–K10: individuelles Fachgespräch (12); K12: persönliche Fremdreflexion (3). K11 ist der **unbenotete** Daten- und Ergebnischeck.

**Note = 1 + 5 × Punktesumme / 33**, auf Viertelnoten gerundet. 16 Punkte → 3,5; 22 (Sollstufe: alle elf Kriterien auf Stufe 2) → 4,25; 25 → 4,75; 26 → 5,0; 33 → 6,0. K1–K6 gelten gemeinsam, K7–K10 und K12 individuell.

## Hilfsmittel und KI

Erlaubt ist KI als **Sprachhilfe** (Formulieren, Korrigieren, Begriffe erklären). **Zahlen, Beobachtungen und Deutungen** stammen von Ihnen und aus Ihrem Versuch, nicht aus einer KI-Ausgabe. Geben Sie im Journal an, welche Hilfen Sie wofür benutzt haben; im Gespräch müssen Sie jede Zahl und jede Aussage am Journal belegen können («Wo steht das im Journal, welche Zahl?»).

Die Leistungsstufen stehen im [Bewertungsraster](../../worksheets/md/KI_Bewertungsraster.md) und auf der [Kursseite](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/#bewertung). Die Punkteauswahl dient nur der Selbsteinschätzung.

## Zwei getrennte Abgaben

- **Vor DL 8:** Webjournal mit fünf ausgefüllten Reflexionen und Versuchsnotebook mit Ausgaben als ursprüngliches Projekt-ZIP.
- Originalfotos, Fotostudio-JSON, Gruppen-/Quellenangaben.

Für das eigene Projekt unter «Sichern & abgeben» Originalfotos und Fotostudio-JSON hinzufügen und das ZIP-Paket herunterladen. Der Download reicht nichts automatisch ein; ZIP über den genannten Abgabekanal einreichen. Kein zusätzlicher langer Bericht. Bei vereinbarten Ersatzdaten Herkunft und Einschränkungen offenlegen; die Lehrperson legt den passenden Nachweis zur Datenarbeit fest.

**Nach DL 8:** Eigenständige Fremdauswertung mit Daten-/Ergebnischeck, Versuch mit eigenen Klassen und je zwei individuellen Reflexionsantworten als separates ZIP einreichen. Keine Änderungen an der ursprünglichen Projektabgabe.
