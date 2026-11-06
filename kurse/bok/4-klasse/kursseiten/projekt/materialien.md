<!-- lesson:05 -->
## Doppellektion 05

**Arbeitsplatz:** [SOL-Lernpfad «Daten fair aufteilen»](index.html#projekt-regeln) · [Daten-Notebook](materialien/downloads/daten_training.ipynb) · [Daten &amp; Fotos](index.html#projekt-3) · [Journal](index.html#journal) · [Fotoanleitung](materialien/downloads/ki_fotodaten.md) · [Bewertungsraster](index.html#bewertung).

### Ankommen · 5 Min. · Wie prüfen wir neue Bilder?

**Tandem · 5 Min.**

Öffnen Sie den SOL-Lernpfad und lesen Sie das Ziel. Notieren Sie vorab: «Ein fairer Test müsste …» und greifen Sie dazu Ihre Vorschau-Antwort aus DL 4 auf. Behalten Sie diese Vermutung für die spätere Selbstkontrolle. Halten Sie Thema und zwei Klassen aus dem Vorbereitungsauftrag bereit: Die Lehrperson gibt sie in den ersten zehn Minuten frei (ca. eine Minute je Tandem), wenn kein anderes Tandem eine Ihrer Klassen verwendet.

### Vorwissen aktivieren · 5 Min. · Bekannt oder neu?

**Tandem · 5 Min., zunächst allein überlegen.**

Ein Netz erkennt ein Bild, das es schon beim Training gesehen hat. Was ist damit belegt – und was nicht? Vergleichen Sie Ihre Antworten zu zweit.

> **Selbstkontrolle:** Eine richtige Trainingsvorhersage belegt nicht, dass andere Exemplare erkannt werden. Neue Aufnahmewinkel desselben Gegenstands sind nicht automatisch unabhängige Testobjekte.

Lesen Sie danach [«Wer weiss was?»](index.html#projekt-wer-weiss-was) und notieren Sie je einen Satz: Welches Netz **lernt** in unserem Projekt, welches **bleibt unverändert**?

> **Selbstkontrolle:** MobileNet bleibt unverändert und liefert nur die 1280 Zahlen je Foto. Das kleine Netz dahinter lernt Ihre zwei Klassen. MobileNet kennt Ihre Klassen nicht, denn sein Ausgang mit 1000 Klassennamen wird nicht benutzt.

### Informieren · 10 Min. · Nur der organisatorische Rahmen

**Lehrperson · 10 Min.**

Klärt Etappenplan, fünf Reflexionen, Raster, Abgabekanal, Frist **vor DL8** und ZIP-Sicherung. Die folgenden Fachkarten sind zum **selbstständigen Lesen**, nicht als zusätzlicher Vortrag gedacht. Hilfe auf konkrete Fragen.

**Foto-Fahrplan:** erst Lernpfad und Exemplarliste, dann **Abnahme der Liste** (Lehrperson oder Nachbartandem, ca. 2 Min.), **erst danach fotografieren**. Richtwerte: Ende DL 5 Liste abgenommen und Fotos begonnen, Mitte DL 6 Fotos importiert.

**Arbeitsvereinbarung:** Name A / Name B: ____________________ · Tagesziel: ____________________ · Rollen heute (wechseln Sie sie in jeder Lektion): ____________________ · Bei Absenz einer Person: ____________________ · Abgabekanal und Frist: ____________________.

**Fortschrittstafel:** Auf einem Plakat oder an der Tafel tragen die Tandems selbst ihre Meilensteine ein (Liste abgenommen · Fotos importiert · A/B-Vergleich · Test · ZIP). Die Lehrperson erkennt bei Rundgängen, wer Unterstützung braucht.

**Klassenliste (Voraussetzung für DL 8):** Jedes Tandem wählt zwei Bildklassen, die kein anderes Tandem verwendet. Führen Sie die Liste ab DL 4 (Plakat im Zimmer oder gemeinsames Dokument): Wer zuerst einträgt, behält die Klasse; bei Überschneidung wählt das spätere Tandem eine andere Klasse oder ein anderes Thema. Freigabe in DL 5 nur, wenn beide Klassen frei sind. Dasselbe Thema ist möglich, wenn die Klassen verschieden sind. Eigene Themen als neue Zeile ergänzen.

| Thema | Klassen zur Auswahl | Vergeben an (Tandem · gewählte Klassen) |
|---|---|---|
| Recyclinghilfe | PET-Flasche, Dose, Karton | ____________________ |
| Schreibmaterial | Stift, Radiergummi, Lineal | ____________________ |
| Besteck | Gabel, Messer, Löffel | ____________________ |
| Handgesten | Faust, offene Hand, Peace | ____________________ |
| Früchte | Apfel, Birne, Banane | ____________________ |
| Blätter | zwei bis drei Baumarten | ____________________ |
| Kleidungsstücke | Schuh, Mütze, Handschuh | ____________________ |
| Werkzeuge | Hammer, Zange, Schraubenzieher | ____________________ |
| Geometrische Körper | Würfel, Kugel, Zylinder | ____________________ |
| Gezeichnete Symbole | Stern, Pfeil, Blitz | ____________________ |
| Spielkarten | Herz, Karo, Pik, Kreuz | ____________________ |
| Arbeitsplatz | frei, teilweise belegt, voll | ____________________ |
| Eigenes Thema: ____________________ | ____________________ | ____________________ |

### Verarbeiten · 60 Min. · Datenplan selbst erarbeiten

**Tandem / Einzeln / Puffer · 45 / 5 / 10 Min.**

#### Lesekarte · Drei Datenrollen, fünf unabhängige Gruppen

| Gruppe | Beispiel bei Apfel / Birne | Zweck | Fotos |
|---|---|---|---|
| T1 | Exemplar 1 jeder Klasse | Training A und B | 8 pro Klasse |
| T2 | Exemplar 2 jeder Klasse | zusätzliches Training B | 8 pro Klasse |
| V1 | Exemplar 3 jeder Klasse | A/B vergleichen und auswählen | 8 pro Klasse |
| P1 | Exemplar 4 jeder Klasse | unabhängiger Abschlusstest | 8 pro Klasse |
| P2 | Exemplar 5 jeder Klasse | unabhängiger Abschlusstest | 8 pro Klasse |

**Rechnung:** 2 Klassen × 5 Gruppen × 8 Fotos = **80 Bilder**. Jedes Exemplar gehört genau einer Gruppe. Ein neuer Hintergrund macht keinen neuen Gegenstand. Bei Gesten sind es getrennte Personen pro Gruppe, jeweils mit beiden Gesten; Spezialfälle vorher klären.

**Training** passt Gewichte an. **Validierung** hilft bei der Auswahl. **Test** prüft die zuvor festgelegte Auswahl; nach Testeinsicht wird nicht weiter optimiert.

#### Übungsfälle · Wo steckt ein Datenleck?

| Fall | Fair oder problematisch? Begründen und korrigieren. |
|---|---|
| Derselbe Apfel liegt in T1 und P1, nur das Licht ist anders. | ____________________ |
| Beide Klassen werden auf gleichen Hintergründen fotografiert; jedes Exemplar bleibt in einer Gruppe. | ____________________ |
| Nach einem schlechten P1-Ergebnis werden die Epochen erhöht und P1 erneut geprüft. | ____________________ |
| Alle Äpfel liegen auf Holz, alle Birnen auf Weiss. | ____________________ |

> **Selbstkontrolle:** Fall 1: Exemplar-Leck; vor dem Training gruppenrein korrigieren. Fall 2: grundsätzlich passend, weitere Datenchecks bleiben nötig. Fall 3: Test beeinflusst die Auswahl; kein unabhängiger Abschlusstest mehr. Fall 4: Hintergrund kann die Klasse verraten; beide Klassen unter vergleichbaren Bedingungen sammeln.

Führen Sie im Daten-Notebook den **Datenleck-Versuch** aus: Das Netz wird einmal mit leicht veränderten Kopien der Trainingsbilder und einmal mit wirklich neuen Bildern getestet (mit 40, 100 und 400 Trainingsbildern, Vermutung zuerst). Danach folgt der **Vergleich der drei Werte** (Training, Validierung, Test). Beide Antworten stehen im Protokoll der Seite «Datenregeln lernen». Vergleichen Sie mit den dortigen Selbstkontrollen und übertragen Sie die Regeln auf Ihre eigenen Fotos.

> **Hinweis für die Lehrperson:** Der Versuch ist eine Vereinfachung mit Ziffernbildern (Bilder von 8 × 8 Pixeln); die «Kopie» ist das Trainingsbild mit leichtem Rauschen und steht für denselben Gegenstand mit anderem Hintergrund. Beispielwerte: 100 Trainingsbilder etwa 96 % mit Kopien gegen 84 % mit neuen Bildern, 40 Bilder etwa 100 % gegen 67 %, 400 Bilder etwa 96 % gegen 94 %. Auch die neuen Bilder stammen von denselben Schreibern; der Wert für neue Bilder ist deshalb noch etwas zu optimistisch. Beim ersten Ausführen lädt der Browser SciPy und scikit-learn nach (ca. 70 MB je Gerät, danach im Browser-Cache); die Rechenzeit liegt im Entwicklungssystem unter 5 Sekunden. Schulnetz und Geräte vorab einmal testen.

#### Eigener Fünf-Gruppen-Plan

Unsere zwei Klassen: ____________________ / ____________________.

| Gruppe | Exemplar / Person / Herkunft Klasse 1 | Exemplar / Person / Herkunft Klasse 2 | Je 8 Fotos vorhanden? |
|---|---|---|---|
| T1 | ____________________ | ____________________ | ______ |
| T2 | ____________________ | ____________________ | ______ |
| V1 | ____________________ | ____________________ | ______ |
| P1 | ____________________ | ____________________ | ______ |
| P2 | ____________________ | ____________________ | ______ |

**Stresstest:** Nehmen Sie P2 für **beide Klassen** an einem anderen Ort oder vor einem anderen Hintergrund auf als T1, T2, V1 und P1. Innerhalb von P2 bleiben die Bedingungen für beide Klassen gleich. Halten Sie den Ort in Reflexion 2 fest.

**Allein, 5 Min.:** Prüfen Sie ein eigenes P1-Beispiel. Ist es wirklich unabhängig? Notieren Sie einen möglichen Fehler und die Korrektur.

**Abnahme vor dem Fotografieren (ca. 2 Min.):** Lassen Sie die Liste anhand der fünf Abschlussfragen auf [Daten &amp; Fotos](index.html#projekt-3) von der Lehrperson oder einem Nachbartandem prüfen. Testen Sie vorab den Weg Handy → Laptop mit einem Foto.

**Etappenplan im Journal:** Daten vervollständigen → A/B vergleichen → Auswahl vor Test dokumentieren → einmaliger Abschlusstest → Reflexion und ZIP. Halten Sie Vermutung, Tagesziel, Rollen und Reflexion 1 fest; Reflexion 2 darf in DL 6 abgeschlossen werden. Wer die Abnahme hat, beginnt mit dem Fotografieren; heute muss noch niemand ein Modell trainieren. Zehn Minuten bleiben Puffer.

### Auswerten · 10 Min. · Selbstcheck und Sicherung

**Tandem · 10 Min.**

- Können wir Training, Validierung und Test unterscheiden?
- Ist jedes Exemplar genau einer Gruppe zugeordnet? Sind es 80 Bilder?
- Haben beide Klassen vergleichbare Aufnahmebedingungen und erlaubte Bildquellen?
- Ist die Exemplarliste abgenommen? Welche Fotos fehlen noch bis Mitte DL 6?
- Haben wir Datenplan und Reflexionen korrigiert, den Stand als ZIP gesichert und einen nächsten Schritt notiert?

**Weiterarbeiten:** [Projekt-Notebook](materialien/downloads/ki_tandemprojekt.ipynb) · [Lernlabor als Hilfe](materialien/downloads/ki_lernlabor.ipynb). Tandems müssen nicht denselben Stand erreichen.

<!-- lesson:06 -->
## Doppellektion 06

**Arbeitsplatz:** [Journal und Projektversuch](index.html#journal) · [A/B-Vergleich](index.html#projekt-4) · [Projekt-Notebook](materialien/downloads/ki_tandemprojekt.ipynb). Kein neuer gemeinsamer Vortrag.

### Ankommen · 5 Min. · Arbeitsstand öffnen

**Tandem · 5 Min.**

Öffnen Sie den letzten Stand. Nach Import oder Neuladen Vorbereitung und Datenimport bewusst erneut ausführen. Lesen Sie den zuletzt notierten nächsten Schritt; ein gespeicherter Notebook-Text ist noch kein laufender Kernelzustand.

### Vorwissen aktivieren · 3 Min. · Ein realistisches Tagesziel

**Tandem · 3 Min.**

Unsere Etappe: ____________________ · Heute erreichbarer Beleg: ____________________ · Noch fehlende Voraussetzung: ____________________ · Rollen neu verteilt: ____________________.

### Informieren · 2 Min. · Hilfe gezielt auswählen

**Tandem · 2 Min.**

Wählen Sie nur die Hilfe für Ihr aktuelles Problem: [Datenplan](index.html#projekt-3), Notebook-Hinweis oder konkrete Beratungsfrage. «Wir wollen …, beobachten … und haben bereits … geprüft.» Bei klarem Vorgehen direkt weiterarbeiten.

### Verarbeiten · 70 Min. · Einen fairen Vergleich belegen

**Tandem → Einzeln → Tandem · 50 / 10 / 10 Min. Puffer**

#### Versuchsplan · A und B vergleichen

| Bedingung | Variante A | Variante B |
|---|---|---|
| Trainingsbilder je Klasse | 8 aus T1 | 4 aus T1 und 4 aus T2 |
| Gesamtzahl je Klasse | 8 | 8 |
| Netz, Epochen, Startwert | gleich halten | gleich halten |
| Vergleichsgrundlage | V1 | dieselbe V1-Gruppe |
| P1 / P2 | bis zur Auswahl geschlossen | bis zur Auswahl geschlossen |

Prüfen Sie **vor jedem Lauf** Datenrollen, Exemplare und Labels. Fehlende Daten zuerst ergänzen. Ein Vergleich bei zusätzlich geänderter Bildzahl oder anderem Netz isoliert nicht die Datenvielfalt. Notieren Sie, **was bei A und B gleich bleibt** (Bildzahl, Netz, Epochen, Startwert, Validierungsbilder) und warum das für einen fairen Vergleich nötig ist.

**Foto-Check Mitte DL 6:** Die Lehrperson geht einmal durch die Reihen. Ohne importierte Fotos: sofort mit der Lehrperson klären, ob gezielt nachfotografiert oder offen gekennzeichnet mit dem Modus `ERSATZ` (Übungsformen, keine echten Fotos) weitergearbeitet wird. Im Journal und im Protokoll steht dann, dass es Ersatzdaten sind.

#### Ergebnisprotokoll · Beobachtung vor Erklärung

| Lauf / Startwert | A auf V1: richtig / gesamt | B auf V1: richtig / gesamt | Konkretes Vorhersagebeispiel | Mögliche alternative Erklärung |
|---|---|---|---|---|
| ____________________ | ____________________ | ____________________ | ____________________ | ____________________ |

**Was V1 aussagen kann:** V1 sind 16 Bilder, aber nur **ein Exemplar je Klasse** (acht Fotos desselben Gegenstands). 16 Bilder sind darum nicht 16 unabhängige Tests. Ein Bild entspricht 6,25 Prozentpunkten. **Faustregel (Richtwert, kein statistisches Kriterium):** Ein Unterschied von höchstens zwei Bildern ist kein Beleg. In DL 4 haben Sie gesehen, dass schon ein anderer Startwert ein anderes Ergebnis geben kann.

Übernehmen Sie **tatsächliche** Ausgaben. Wiederholen Sie den Vergleich **vor der Auswahl** mit den drei Startwerten 11, 22 und 33 (ca. 5 Min., eigene Zelle im Versuchsnotebook) und tragen Sie jeden Lauf in die Tabelle ein: Bleibt die Reihenfolge von A und B in allen Läufen gleich? Begründen Sie die Auswahl in **Reflexion 3 vor Testeinsicht**:

«Wir wählen …, weil auf V1 … . Das Beispiel … zeigt … . Eine andere Erklärung wäre … . Der Vergleich belegt noch nicht …». **Bei Gleichstand:** «Beide Varianten sind auf V1 gleichwertig; wir wählen …, weil …» (anderes Argument, etwa konkrete Vorhersagen).

**Allein, 10 Min.:** Bearbeiten Sie einen abgegrenzten Teil Ihrer Etappe und sichern Sie einen Beleg, etwa eine überprüfte Gruppenzuordnung oder eine erklärte Vorhersage. Danach zusammenführen. Zehn Minuten bleiben Puffer.

> **Beratungskarte für die Lehrperson:** «Was ist euer Ziel? Welchen Beleg habt ihr? Was bleibt konstant? Welche alternative Erklärung passt? Was ist der nächste Schritt?» Keine Synchronisierung aller Tandems. Zusätzliche Startwerte sind nur vor Testeinsicht sinnvoll; ein Lauf beweist keinen allgemeinen Vielfaltseffekt.

### Auswerten · 10 Min. · Fortschritt und Abschlussplan

**Tandem · 10 Min.**

| Tagesziel erreicht? Mit welchem Beleg? | Nächster Schritt / Zuständigkeit | Zeit bis zur Abgabe | ZIP gesichert? |
|---|---|---|---|
| ____________________ | ____________________ | ____________________ | ______ |

Aktualisieren Sie den Etappenplan im Journal. **Peer-Tausch (ca. 4 Min.):** Tauschen Sie Reflexion 1–3 mit einem Nachbartandem; je eine belegte Stärke und eine Rückfrage. Bei gefährdeter Abgabe jetzt eine realistische Lösung innerhalb der Projektregeln vereinbaren. [Bewertungsraster](index.html#bewertung).

<!-- lesson:07 -->
## Doppellektion 07

**Arbeitsplatz:** [Journal](index.html#journal) · [Raster](index.html#bewertung) · [Projektauftrag](materialien/downloads/ki_projektauftrag.md) · [ZIP-Sicherung](index.html#sicherung). Kein zusätzlicher Bericht und keine vorbereitete Präsentation.

### Ankommen · 5 Min. · Eigene Abschlussliste

**Tandem · 5 Min.**

Öffnen Sie Ihren Stand. Was fehlt für eine nachvollziehbare Abgabe? Ordnen Sie die offenen Punkte: **zuerst Daten / Untersuchung, dann Begründung, zuletzt Export**.

### Vorwissen aktivieren · 3 Min. · Freigabe vor dem Test

**Tandem · 3 Min.**

- Ist die Auswahl von A oder B mit V1-Beleg schriftlich festgehalten?
- Waren P1 und P2 bis jetzt unangetastet?
- Ist klar, dass nach Testeinsicht weder Auswahl noch Training optimiert werden?

Wenn eine Voraussetzung fehlt, zuerst diese Lücke bearbeiten. Ein bereits mehrfach zur Optimierung genutzter Test muss als Grenze offengelegt werden.

### Informieren · 2 Min. · Abgabehilfen nach Bedarf

**Tandem · 2 Min.**

Gleichen Sie offene Belege mit dem Raster ab. Lesen Sie die Gesprächszeiten, den Austauschpartner und die Austauschregeln für DL8, die die Lehrperson zu Beginn der Lektion mitgeteilt hat. Fragen Sie gezielt nach; es gibt keinen neuen gemeinsamen Versuch.

### Verarbeiten · 70 Min. · Test, Grenzen und Reflexion

**Tandem → Einzeln → Tandem · 45 / 10 / 15 Min. Puffer**

#### Abschlusstest · Auswahl einfrieren

Testen Sie die begründet ausgewählte Variante **einmal auf P1/P2**. Das Notebook meldet beide Testgruppen zusammen. Notieren Sie:

| Gewählte Variante / dokumentierte Auswahl | Testergebnis P1 + P2 zusammen: richtig / gesamt | Warum erst jetzt P1/P2? | Gesamtresultat und Grenze |
|---|---|---|---|
| ____________________ | ____________________ | ____________________ | ____________________ |

#### Drei konkrete Beispiele statt pauschaler Behauptungen

| Bild / Gruppe / tatsächliche Klasse | Vorhersage | Passend oder nicht? | Vorsichtige Erklärung / offene Frage |
|---|---|---|---|
| 1: ____________________ | ______ | ______ | ____________________ |
| 2: ____________________ | ______ | ______ | ____________________ |
| 3: ____________________ | ______ | ______ | ____________________ |

Falls keine Fehler auftreten, untersuchen Sie drei richtige Beispiele und die Grenzen des kleinen Tests. **Keine Fehler oder Ergebnisse erfinden.** Achten Sie darauf, ob Fehler vor allem Bilder mit anderem Hintergrund oder Ort betreffen (zum Beispiel ein Stresstest mit P2).

**Reflexion 4–5 im bestehenden Journal:** In Reflexion 4 beantworten Sie auch: Welcher Teil hat unsere zwei Klassen unterscheiden gelernt (MobileNet oder das kleine Netz), und könnten Hintergrund oder Licht mitgeholfen haben? Welche Aussage stützen die Daten? Was bleibt ungesichert? Was wäre ein nächster Versuch? Wie waren Arbeitsteilung, Hilfen und Etappenplan? Erklären Sie sich gegenseitig das ganze Projekt.

**Allein, 10 Min.:** Prüfen Sie einen persönlichen Anteil Ihrer Abschlussliste mit dem Raster. Notieren Sie einen fehlenden Beleg oder eine offene Frage. Fünfzehn Minuten bleiben für Abschluss, Technik und Beratung.

### Auswerten · 10 Min. · Abgabe und Austausch vorbereiten

**Tandem · 10 Min.**

| Im Abgabepaket prüfen | Erledigt? |
|---|---|
| Journal mit fünf Reflexionen und Auswahl vor Testeinsicht | ______ |
| Notebook mit sichtbaren Ausgaben und Versuchsprotokoll | ______ |
| Eigene Daten / Fotostudio-JSON gemäss Abgabeauftrag | ______ |
| Finales ZIP heruntergeladen, in einem privaten Fenster probeweise wiederhergestellt (Journal, Notebook, Fotostudio-JSON vorhanden) | ______ |
| Über vereinbarten Kanal **vor Beginn DL8 eingereicht** | ______ |
| Erlaubte Austauschdateien und eigene JSON getrennt bereit | ______ |

**Wichtig:** Ein Download ist keine Einreichung. Das eigene Projekt bleibt danach eingefroren. Keine zusätzliche Präsentation vorbereiten.
