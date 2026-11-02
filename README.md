# KI-Unterricht

Ein kompakter KI-Block: erleben, gezielt experimentieren und erklären.

- **[Kursportal öffnen](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/)**
- **[Lehrpersonen: vollständiger Ablauf](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/unterrichtsplan.html)** und [didaktische Hinweise](worksheets/md/KI_Planung.md)

## Lehrpersonen-Editor (GitHub)

Ein integrierter [Lehrpersonen-Editor](projekt/admin/) ermöglicht neue und bestehende
Unterkapitel, Bilder, Antwortfelder, Vorschau und versionierte Pull Requests direkt
über die Weboberfläche. Die bereits vorhandene GitHub Action prüft alle Änderungen
und veröffentlicht sie erst nach einem Merge auf `main`. Für den **geschützten
GitHub-Login** muss einmalig eine GitHub App plus Cloudflare Worker eingerichtet
werden; die reine GitHub-Pages-Seite kann keine Schreib-Tokens verwalten.
Siehe [Einrichtung und Sicherheit](docs/ADMIN-EDITOR.md).

## Inhalte einfach bearbeiten

**Single Source of Truth:** Texte, AVIVA-Planung und Lehrpersonenmaterial liegen gemeinsam unter `kursseiten/<thema>/`: nummerierte Kapitel, `planung.json` und `materialien.md`. Das Manifest definiert Bereiche und Navigation. `projekt/` enthält nur App-Quellen; die generierten Seiten liegen unter `_build/site/projekt/`, die veröffentlichte Website unter `dist/`. `make preview` und GitHub Actions bauen sie automatisch.

Ein neues Unterkapitel kannst du direkt erstellen und anschliessend als Markdown bearbeiten:

```sh
python scripts/new_chapter.py einstieg --after 030 --nummer 3a --title "Ein neuer Blick auf KI"
make preview
```

Der Generator prüft Sortierung, gültigen Bereich und eindeutige IDs; bestehende Kapitel werden nicht verändert. **Neue Doppellektionen** können bereits im [Admin-Editor](projekt/admin/) inklusive AVIVA-Plan und Materialanhang erstellt werden. Alternativ funktioniert dies direkt im geklonten Repository, ohne GitHub-App-Anmeldung:

```sh
python scripts/new_lesson.py "KI im Alltag" --chapter "Anwendungen entdecken"
make preview
```

Der Generator erstellt `kursseiten/ki-im-alltag/` mit AVIVA-Plan, erstem Kapitel und Lehrpersonenmaterial und ergänzt das Manifest. Ein bestehendes Thema kann mehrere Doppellektionen enthalten:

```sh
python scripts/new_lesson.py "Weitere Lernarten" --section lernarten --after 02
```

`--after` verwendet eine stabile Lektions-ID. Die sichtbaren Nummern werden neu berechnet; IDs, vorhandene Kapitel und gespeicherte Schülerdaten bleiben unverändert. Didaktische Nummernverweise in freien Texten nach Einfügungen prüfen. Mit `--dry-run` zeigt das Werkzeug die geplanten Dateien ohne Änderungen. Die AVIVA-Platzhalter müssen anschliessend ausgearbeitet werden. Details: [Architektur und Redaktionskonzept](docs/ARCHITEKTUR.md).

Die Doppellektionen liegen kapitelweise unter [`kursseiten/`](kursseiten).
Absätze und Zwischenüberschriften in den Markdown-Bereichen sind direkt
lesbar und editierbar; nur Formulare, Tabellen und interaktive Teile enthalten
noch sauber eingerücktes HTML. Die Markierungen `<!-- MD:START -->` und
`<!-- MD:END -->` kennzeichnen Markdown-Blöcke in bestehenden Kapiteln.
Details: [Anleitung zum Bearbeiten](kursseiten/README.md).

## Lokal starten – mit Makefile

Voraussetzungen: **Python 3.12**, **make**, und für die vollständige Version
**Node.js 22 mit npm** (Linux, macOS oder WSL). Im geklonten Repository
genügt **ein einziger Befehl**, ohne manuelle `pip`-/`npm`-Installation oder
Aktivierung einer virtuellen Umgebung:

```sh
make
```

Das Makefile legt bei Bedarf `.venv/` an, installiert Python- und npm-Pakete,
baut die eingebetteten Jupyter-Notebooks und JupyterLite vollständig nach
`dist/` und startet einen lokalen HTTP-Server. Anschliessend
**[http://localhost:8000/projekt/](http://localhost:8000/projekt/)** öffnen.
Auch der ZIP-Download, das Importieren von Sicherungen und die Python-Notebooks
sind in diesem Modus verfügbar. Beim ersten Notebookstart lädt der Browser
gegebenenfalls zusätzliche Laufzeitdateien. Mit `Ctrl+C` den Server beenden.

### Kurze Vorschau beim Bearbeiten

```sh
make preview
```

Diese Variante benötigt nur wenige kleine Python-Pakete. Sie zeigt Texte, Bilder,
Navigation und Formulare sofort, überwacht die Dateien unter `kursseiten/`
und erstellt die HTML-Seite beim Speichern automatisch neu (Browser aktualisieren).
Die Notebooks und der vollständige ZIP-Laufzeitexport benötigen dagegen
`make` bzw. `make local`.

### Weitere Befehle

| Befehl | Zweck |
|---|---|
| `make` oder `make local` | Vollständige App bauen und lokal starten |
| `make preview` | Schnelle Kursvorschau mit automatischem Neuaufbau |
| `make build` | Komplette Seite nach `dist/` bauen, ohne Server |
| `make serve` | Vorhandenen Build aus `dist/` direkt ansehen |
| `make test` | Build und lokale Struktur-/Funktionstests ausführen |
| `make install` | Alle Abhängigkeiten installieren |
| `make clean` | Generierte lokale Umgebung und Build-Dateien entfernen |
| `make help` | Kurzübersicht der Befehle anzeigen |

Port ändern: `make PORT=8080` (oder `make preview PORT=8080`).
Standardmässig lauscht der Server **nur auf 127.0.0.1**, nicht im Schulnetz.
Nach Änderungen, die auch die Notebooks betreffen, die vollständige Version
mit `make` erneut bauen; `make serve` verwendet nur den zuletzt gebauten Stand.
Die umfassenden Browser-Regressionstests für JupyterLite, ZIP und Layout
laufen weiterhin automatisch in GitHub Actions.

### Inhalt, View und Controller (MVC-Prinzip)

- **Model/Inhalt:** `kursseiten/` (Kapitel, Themenpläne und Materialien),
  `experimente/registry.json` (Notebookregistrierung), `shared/course-rules.json` (AVIVA-Regeln).
- **View:** `projekt/index.template.html`, `projekt/portal.css` und die
  Python-Generatoren `scripts/build_portal.py`, `scripts/build_course.py`.
- **Controller:** `projekt/portal.js`, `projekt/progress.js` (Notebook-Events,
  Browserpersistenz, ZIP, Navigation, Memory-Interaktion). Keine Lehrtexte
  werden mehr nach dem Seitenladen per `createElement` hineingeschrieben.
  Temporäre UI-Elemente wie Navigation und Memory-Karten dürfen aus
  den bereits gerenderten Inhalten oder aus Nutzereingaben erzeugt werden.

---

## Ein Einstieg für die ganze Klasse

Das Kursportal bündelt Aufgaben, kurze Erklärungen, eingebettete Python-Experimente, Fotostudio, Journal und Bewertung. Lernende benötigen keine Dateinavigation. Die folgenden Originalnotebooks bleiben als bearbeitbare Quellen für die Lehrperson erhalten; `scripts/build_portal_notebooks.py` erzeugt daraus die eingebetteten Fassungen mit allen Erklärungen und Grafik-Anhängen.

Journal und Unterrichtsantworten werden auf der Webseite geschrieben und lokal gespeichert. Unter **Sichern & abgeben** entsteht eine ZIP-Datei mit lesbarem `Journal.html`, Versuchscode samt gespeicherten Ausgaben, verfügbarem Versuchsprotokoll und hinzugefügten Datendateien. Ein Zwischenstand lässt sich wieder importieren. Der Download reicht nichts automatisch ein.

Ein Tandem arbeitet gemeinsam an einem Gerät; es gibt keine gleichzeitige Online-Zusammenarbeit. Beim Gerätewechsel eine ZIP-Sicherung mitnehmen. Foto-Upload im Notebook und Datendateien der Abgabeliste sind getrennt: die Fotostudio-JSON zusätzlich in die Abgabeliste aufnehmen. Nach einem Reload oder Import müssen Daten erneut ins laufende Python geladen werden. Training und Abschlusstest bleiben bewusst manuell.

## Materialien und Arbeitswege

Die Planung benennt je Doppellektion den Pflichtkern. Die folgenden Materialien sind kein vollständig abzuarbeitender Parcours.

| Notebook | Zweck |
|---|---|
| Kursseite «Wie lernt KI?» | Memory-Aufträge und Link zur NIM-Lernstrecke bei inf-schule.de |
| `perzeptron_und_neuronale_netze.ipynb` | Gewicht, Bias, ein Lernschritt, Grenze bei XOR |
| `mehrschichtige_netze.ipynb` | XOR-Zwischenschicht, Lernen qualitativ, Brücke zu Bildmerkmalen |
| `daten_training.ipynb` | Hilfe zu Gruppentrennung, Datenlecks und eigenem Datenplan; kein zweiter vollständiger Pflichtdurchlauf in Doppellektion 4 |
| `ki_projekt/ki_lernlabor.ipynb` | Orientierung nach Bedarf: 15 Minuten Probelauf, optionaler Zusatz; keine Pflichtwiederholung |
| `ki_projekt/ki_tandemprojekt.ipynb` | Eigenes Projekt mit Anleitungen zu den fünf Webjournal-Reflexionen |

Das Notebookprinzip ist immer: Vermutung → Experiment → Beobachtung → Erklärung. Codezellen enthalten wenige Aufrufe; nachvollziehbarer Hilfscode liegt in `unterricht_tools.py` und `ki_projekt/*_tools.py`.

## Einfaches Tandemprojekt

**Zwei Klassen, 80 Fotos, ein Vergleich zur Datenvielfalt, ein Startwert.**

Fünf Gruppen mit jeweils einem anderen Exemplar jeder Klasse: T1/T2 trainieren, V1 dient der Auswahl, P1/P2 dem Abschlusstest. Acht Fotos je Klasse/Gruppe. Bei Gesten entspricht eine Gruppe einer Person mit beiden Gesten.

A erhält acht Bilder je Klasse aus T1, B je vier aus T1/T2. Gleich bleiben Bildzahl, Netz und Trainingseinstellungen. Ein festgelegter Startwert (11), 16 Neuronen und 60 Epochen. Auswahl anhand der Validierung begründen, erst danach Test freigeben. Wenige Gruppen und ein Lauf sind ausdrücklich eine Grenze.

Bilder werden im Fotostudio einheitlich als 224 × 224 RGB verarbeitet. Das eingefrorene MobileNet liefert 1280 Merkmale; das eigene Netz wird lokal in Python/Pyodide trainiert. `UEBUNG` nimmt 80 Formen aus dem mitgelieferten synthetischen Datensatz. `ERSATZ` nach Absprache, mit offener Herkunft.

Abgabe des Journals mit Ausgaben, Fotos/JSON und Protokoll vor Beginn von Doppellektion 8. Alle Fachgespräche finden in Doppellektion 8 statt. 20 Einzelgespräche mit einer Lehrperson: je 4 Minuten plus 1 Minute Bewertung/Wechsel, 100 Minuten total (90 Minuten Doppellektion + 10 Minuten direkt im Anschluss), ohne Zeitreserve. Die Aufträge und Gesprächsfenster sind vorab geklärt; keine Folgetermine. Der [Gesprächsplan](worksheets/md/KI_Planung.md#gesprächsplan--doppellektion-8) rechnet Wechsel und Puffer mit ein. Zehn Kompetenzen mit je 0–3 Punkten: 18 gemeinsame Punkte für die Projektabgabe, 12 individuell bewertete Punkte für das Einzelgespräch sowie 3 gemeinsame Punkte für die Fremdmodell-Reproduktion (K11) und 3 individuelle Punkte für die Reflexion (K12). Die Gesamtnote ist pro Person individuell. Note = 1 + 5 × Punkte / 36, auf Viertelnoten gerundet. [Vollständiges Bewertungsraster](worksheets/md/KI_Bewertungsraster.md). Die eigene Seite «Lernziele» zeigt die Ziele aller Unterrichtsblöcke.

## Didaktischer Aufbau

Alle Doppellektionen haben einen AVIVA-Ablauf mit 90 Minuten, Leitfrage und Lernprodukt. Die Themenpläne unter `kursseiten/<thema>/planung.json` sind die gemeinsame Quelle für Kursseite und Lehrpersonenplanung. Die Notebooks folgen PADUA: Problem, erklärtes Beispiel, Durcharbeiten, Üben und Übertragen. Vor Codezellen stehen Zweck, Beobachtungsauftrag und eine Hilfe zur Interpretation.

Vorhandene Grafiken zu Perzeptron und mehrschichtigem Netz sind auf der Seite und als portable Notebook-Anhänge eingebaut. Sieben nicht mehr benötigte Notebooks wurden entfernt: beide Startnotebooks, NIM, Ziffern, Symbolprojekt sowie lineare und logistische Regression. Alte Prüfungs- und Regressionsblätter liegen gekennzeichnet in `worksheets/archiv/`.

Doppellektionen **5–8 sind als SOL-Phase** organisiert: In 5–7 planen die Tandems Tagesziele, Rollen, Tempo und Hilfen selbst. Die Etappen Datencheck → Vergleich → Auswahl → Test → Fazit sind keine festen Lektionstermine. Etappenplan und kurze Fortschrittsreflexion stehen im bestehenden Journal; kein zusätzliches Lerntagebuch. In Doppellektion 8 werten die übrigen Tandems parallel zu den Fachgesprächen ein fremdes Modell aus: ein Reproduktionslauf mit Startwert 11, Fremdtest und begründete Rückmeldung. Diese Fremdauswertung wird mit K11 (gemeinsamer Reproduktionscheck) und K12 (individuelle Reflexion) bewertet; die eigene Abgabe bleibt unverändert.

Drei Startwerte sind eine optionale Erweiterung **vor** Testeinsicht, auch bei der Fremdauswertung keine Pflicht. Die Grundlagen- und Transferlektionen haben klare Pflichtkerne, weniger Tool-/Sozialformwechsel. Nicht jedes Kurskapitel oder Antwortfeld ist eine zusätzliche Pflichtaufgabe.

## Schneller Einstieg

Die Kursseite zeigt vorberechnete Beispielgrafiken sofort. Python startet erst beim Öffnen eines Notebooks. **Ein fester Frame zeigt genau ein aktives Notebook.** Vor einem Wechsel speichert Jupyter das Dokument; Projektausgaben und Protokoll werden zusätzlich für die Abgabe übernommen. Danach lädt der Frame das nächste Notebook mit einer frischen Standard-Jupyter-Sitzung. Der Standardparameter `reset` verwirft nur die bisherige Fensteranordnung, damit keine weiteren Notebook-Tabs wieder geöffnet werden; gespeicherte Dokumente bleiben erhalten. Die Bibliotheksdateien können aus dem Browsercache kommen, Python muss sich aber erneut initialisieren. Zum Weiterrechnen im Projekt Daten neu laden und die benötigten Schritte bewusst ausführen; gespeicherte Ergebnisse bleiben sichtbar.

Es gibt keinen gemeinsamen Kernel, kein Umschalten von Python-Namensräumen und kein internes Workspace-Notebook. JupyterLite speichert Notebook-Dokumente. Die Kursseite speichert Journal, Dateianhänge und eine Kopie der Projektausgaben für den Download; laufende Python-Objekte werden nicht gespeichert oder rekonstruiert.

Eine ZIP-Sicherung importiert nur Dokumente und Ergebnisse. Bei einem bereits geöffneten Projekt wird der Standard-Kernel neu gestartet; **kein importierter Code wird ausgeführt**. Danach erste Codezelle und Datenimport bewusst erneut ausführen. Gespeicherte Ausgaben bleiben sichtbar, stehen aber nicht für einen noch laufenden Versuch.

## Technik und Prüfung

Für einen vollständigen lokalen Build genügt `make build`, zum
Anschauen `make`. Das Makefile führt dieselben Schritte aus wie GitHub
Actions: npm-Extension, Kursportal, AVIVA-Pläne, eingebettete Notebooks,
JupyterLite, Runtime-Dateien und die Vorschaugrafiken.

Der Pages-Workflow verwendet dieselbe Reihenfolge. Die Startseite leitet ins Kursportal; `/lab/` bleibt für Lehrpersonen erreichbar. Die Kopie enthält Fotostudio und Hilfsdateien für vollständige Abgabepakete. Generierte Portalnotebooks werden nicht separat gepflegt.

Prüfungen: `python tests/check_course.py`, `python tests/check_ki_basis.py`, `python tests/check_ki_fotos.py`, `python tests/check_ki_projekt.py`, `node tests/check_autostart.cjs` und `node tests/check_archive.cjs`. Browserprüfung: `PORTAL_SITE=dist CHROMIUM_PATH=/pfad/zu/chromium node tests/check_portal.cjs` mit installiertem `playwright-core`; `CHECK_NOTEBOOK=1` prüft zusätzlich Start, Export und Wiederherstellung eines echten Pyodide-Notebooks. `CHECK_TRAINING=1` ergänzt einen echten Trainingslauf samt manueller Testfreigabe und einen Wechsel zum Perzeptron-Experiment. `CHROMIUM_ARGS` nimmt bei Bedarf eine JSON-Liste an.

Pyodide-Prüfung: `node tests/check_pyodide.cjs` (Pyodide 0.27.0; siehe Testskript). Diese führt Originale und eingebettete Fassungen aus. Regelmässig Zwischenstände ausserhalb des Browsers herunterladen: Browserdaten sind keine dauerhafte Sicherung.

### Automatischer Notebookstart

Falls JupyterLite nach einem Seiten-Reload nur den Launcher wiederherstellt, öffnet die Erweiterung das zuletzt geöffnete Kursnotebook im selben Browser-Tab erneut. Explizite Notebook-Links und bereits wiederhergestellte Tabs haben Vorrang.

Beim Öffnen und nach einem Seiten-Reload vergleicht die Erweiterung die Startzellen mit der veröffentlichten Vorlage: Zell-ID und Quelltext müssen unverändert sein. Nur diese bekannten Startzellen werden ausgeführt; zusätzliche Startmarkierungen aus importierten Dokumenten werden ignoriert. Ist eine Startzelle verändert oder entfernt, bleibt die gesamte Startfolge manuell. Oben steht zuerst «Lernumgebung startet …», danach «Bereit» oder ein Hinweis zur manuellen Vorbereitung. Änderungen an Einstellungen benötigen weiterhin Shift + Enter. Ein manueller Kernel-Neustart allein führt keine Zellen aus.

Im Projektjournal startet **nur die Vorbereitung**. Foto-Upload, Datenimport, Training, Testfreigabe und Export bleiben manuell. Ein Reload erhält gespeicherte Eingaben und Ausgaben, stellt aber keine Python-Variablen oder hochgeladenen Dateien wieder her: Daten erneut laden und die benötigten Schritte gezielt ausführen. Vor einem Reload Journal und Ergebnisse herunterladen.

Die Erweiterung startet ausschliesslich die aufgeführten Kursdateien, keine hochgeladenen Fremdnotebooks oder Vertiefungen. Ältere oder veränderte Startzellen bleiben manuell; lokale Arbeiten werden nicht überschrieben. Nach Sicherung der eigenen Arbeit kann die aktuelle Vorlage verwendet werden. Umbenannte Journale bleiben manuell ausführbar. Prüfung: `node tests/check_autostart.cjs`.

## Quellen und Lizenz

Der Lernweg zu Neuron, Lernregel und Trennlinie in den Notebooks «Ein Neuron entscheidet» und «Mehrere Neuronen kombinieren» wurde durch die Lernstrecken «Logische Gatter mit künstl. Neuronen» und «Einzelne Neuronen» von [inf-schule.de](https://inf-schule.de) angeregt (CC BY-SA 4.0; Hürden- und Zaun-Bild, Lernregel in Worten, Trennlinie). Texte, Diagramme und Programme sind eigene Fassungen. Die Grafiken «Programmierung durch Menschen und datengetriebene Programmierung» und «Einteilung der Begriffe» in Doppellektion 1 sind Ausschnitte aus der [KI-Landkarte von inf-schule.de](https://inf-schule.de/ki/menueansicht) (CC BY-SA 4.0). Die Einteilung in vier KI-Typen folgt [robominds](https://www.robominds.de/en/blog/das-sind-die-vier-typen-von-kunstlicher-intelligenz) (eigene Zusammenfassung). Die Pflanzendaten stammen aus dem Datensatz *Iris* (R. A. Fisher, 1936), die Ziffernbilder aus dem scikit-learn-Datensatz `digits`.
