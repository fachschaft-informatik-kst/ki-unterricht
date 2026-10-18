# KI-Projekt im Tandem

**Zwei Bildklassen · ein Vergleich · fünf Reflexionen · individuelles Fachgespräch**

> Helfen vielfältigere Trainingsbilder beim Erkennen neuer Gegenstände oder Personen?

## Auftrag

Wählen Sie eine Anwendung aus dem Ideenpool und genau zwei Klassen. Sammeln Sie 80 Fotos gemäss Datenplan: fünf unabhängige Gruppen, acht Fotos je Klasse und Gruppe. Beide Klassen werden unter gleichen Bedingungen fotografiert; Personen nur mit Einverständnis (Details in `ki_fotodaten.md`).

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

Ein einziger Lauf und wenige Exemplare sind eine begrenzte Untersuchung. Eine hohe Trefferquote oder eine bestätigte Vermutung ist keine Voraussetzung für eine gute Note. Wiederholungen mit drei festgelegten Startwerten sind freiwillige Vertiefung vor Testeinsicht; alle Ergebnisse berichten.

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

- **Sie entscheiden:** Thema im genehmigten Rahmen, Tagesziele, Zeitverteilung, Rollen und benötigte Hilfen. Nutzen Sie das Lernlabor einmal als Orientierung, falls Sie den Ablauf noch nicht kennen; keine Pflichtwiederholung.
- **Verbindlich bleiben:** Datenplan, fairer Vergleich, fünf Reflexionen, Auswahl vor Testeinsicht, keine Optimierung danach und die Abgabefrist.
- **Planen:** Ergänzen Sie in Reflexion 1 einen kurzen Etappenplan mit Zuständigkeiten, Zeitbedarf und Reserve. Beide übernehmen praktische und erklärende Aufgaben; wechseln Sie die Rollen.
- **Steuern:** Am Ende jeder Arbeitsphase im bestehenden Journal kurz ergänzen: erreicht, offen, nächster Schritt, benötigte Hilfe. Passen Sie den Plan bei Bedarf an; kein zusätzliches Lerntagebuch.
- **Prüfen:** Nutzen Sie das Raster für fehlende Belege und erklären Sie sich gegenseitig das ganze Projekt. In Reflexion 5 beurteilen Sie auch, was an Ihrem Plan funktionierte und was Sie änderten. Diese Hinweise sind keine zusätzlichen Bewertungskompetenzen.

Die Lehrperson bietet kurze Beratungen zu Ihren Fragen an, statt die Klasse bei jeder Etappe anzuhalten. Melden Sie frühzeitig, wenn Daten oder Technik den Abschluss gefährden.

## Zeitrahmen und Termine

| Zeitpunkt | Rahmen |
|---|---|
| Doppellektion 4 | Thema und zwei Klassen freigeben lassen; fünf unabhängige Gruppen skizzieren |
| bis Doppellektion 5 | Datenplan prüfen und möglichst die Fotos sammeln; fehlende Fotos während der Projektarbeit gezielt ergänzen |
| Doppellektionen 5–7 | Eigener Etappenplan, selbstständige Arbeit, Beratung und laufende Sicherung; Etappen frei auf die Zeit verteilen |
| vor Beginn der Doppellektion 8 | Vollständiges ZIP über den Abgabekanal einreichen |
| Doppellektion 8 | Fachgespräch; parallel selbstständige Fremdauswertung mit Rückmeldung |

Die **20 Einzelgespräche** finden mit **einer Lehrperson** direkt ab Beginn der **Doppellektion 8** statt: **4 Minuten pro Person** plus **1 Minute für Bewertung, Notizen und Wechsel**. Das ergibt **100 Minuten**: 90 Minuten Unterricht und **10 Minuten im unmittelbaren Anschluss** für die letzten zwei Personen. Es gibt keinen Zeitpuffer. Die Lehrperson teilt die festen Gesprächsfenster, Austauschprojekte und den Abgabekanal spätestens vor der Doppellektion mit. Alle anderen beginnen sofort selbstständig mit der Fremdauswertung; es gibt keine zusätzliche Einführung oder gemeinsame Schlussbesprechung und keine Ersatztermine.

### Während der Fachgespräche: ein fremdes Modell auswerten

Arbeiten Sie im Tandem selbstständig und pausieren Sie jeweils nur für Ihr persönliches Einzelgespräch; die andere Person kann weiterarbeiten. Die Fremdauswertung ist **verbindlich, aber unbenotet**; die bewertete eigene Abgabe bleibt unverändert.

1. Übernehmen Sie das zugeteilte Projekt in einem **privaten Browserfenster**, damit Sie Ihren eigenen Stand nicht ersetzen. Weitergabe nur mit geklärter Berechtigung; auch die Fotostudio-JSON enthält Vorschaubilder.
2. **Reproduktionscheck, ca. 30 Minuten:** Prüfen Sie Daten und Einstellungen, trainieren Sie A/B einmal mit Startwert 11 nach und prüfen Sie die ursprünglich gewählte Variante. Vergleichen Sie Prüfsumme und Ergebnisse; dokumentieren Sie Abweichungen. Drei Startwerte sind freiwillige Vertiefung, kein Pflichtteil.
3. **Fremdtest und Rückmeldung, ca. 25 Minuten:** Lassen Sie das fremde Modell Ihre eigenen Klassen beurteilen. Halten Sie vorher eine Erwartung fest und werten Sie danach Tabelle, Trennschärfe und Beispiele aus. Begründen Sie das Ergebnis, nennen Sie eine Grenze und geben Sie dem anderen Tandem eine konkrete Rückmeldung.
4. Sichern und reichen Sie die kurze Fremdauswertung separat im bestehenden Reproduktions- und Fremdtest-Protokoll ein. Kein zusätzlicher langer Bericht.

Für Gespräch, Wiedereinstieg und Technik bleibt Reserve. Bei einem nicht lösbaren Trainingsproblem werten Sie die gespeicherten fremden Ausgaben aus und dokumentieren ausdrücklich, welcher Versuch nicht möglich war. Die Auswertung entfällt nicht, aber Sie behaupten keinen erfolgreichen Test. Erhaltene Fotos nur für diesen Auftrag verwenden und nach der vereinbarten Aufbewahrungsregel löschen.

## Bewertung

Zehn Kompetenzen mit je **0–3 Punkten**, maximal **30 Punkte**. K1–K6 bewerten die Abgabe (18 Punkte), K7–K10 das individuelle vierminütige Fachgespräch (12 Punkte pro Person). Jede Kompetenz zählt gleich; keine zusätzliche Gewichtung.

**Note = 1 + 5 × Punktesumme / 30**, auf Viertelnoten gerundet. Beispiele: 18 Punkte → 4,0; 24 → 5,0; 30 → 6,0. Für die gemeinsame Projektabgabe erhalten beide dieselben K1–K6-Punkte (18); die K7–K10-Punkte aus den Einzelgesprächen (12) werden für jede Person separat ermittelt. Daraus entsteht je eine individuelle Note.

Die einzelnen Leistungsstufen stehen im [Bewertungsraster](../../worksheets/md/KI_Bewertungsraster.md) und auf der [Kursseite](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/#bewertung). Die dortige Punkteauswahl dient nur der Selbsteinschätzung.

## Abgabe

- Webjournal mit fünf ausgefüllten Reflexionen und Versuchsnotebook mit Ausgaben. Download als ZIP-Datei.
- Originalfotos, Fotostudio-JSON, Gruppen-/Quellenangaben.

Unter «Sichern & abgeben» Originalfotos und Fotostudio-JSON hinzufügen und das ZIP-Paket herunterladen. Der Download reicht nichts automatisch ein; ZIP über den genannten Abgabekanal einreichen. Kein zusätzlicher langer Bericht. Bei vereinbarten Ersatzdaten Herkunft und Einschränkungen offenlegen; die Lehrperson legt den passenden Nachweis zur Datenarbeit fest.
