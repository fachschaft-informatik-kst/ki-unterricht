# KI-Unterricht

Ein kompakter KI-Block für die 4. Gymiklasse: erleben, gezielt experimentieren und erklären.

- **[Kursportal öffnen](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/)**
- **[Lehrpersonen: Ablauf und didaktische Hinweise](worksheets/md/KI_Planung.md)**

## Ein Einstieg für die ganze Klasse

Das Kursportal bündelt Aufgaben, kurze Erklärungen, eingebettete Python-Experimente, Fotostudio, Journal und Bewertung. Lernende benötigen keine Dateinavigation. Die folgenden Originalnotebooks bleiben als bearbeitbare Quellen für die Lehrperson erhalten; `scripts/build_portal_notebooks.py` erzeugt daraus die eingebetteten Fassungen mit allen Erklärungen und Grafik-Anhängen.

Journal und Unterrichtsantworten werden auf der Webseite geschrieben und lokal gespeichert. Unter **Sichern & abgeben** entsteht eine ZIP-Datei mit lesbarem `Journal.html`, Versuchscode samt gespeicherten Ausgaben, verfügbarem Versuchsprotokoll und hinzugefügten Datendateien. Ein Zwischenstand lässt sich wieder importieren. Der Download reicht nichts automatisch ein.

Ein Tandem arbeitet gemeinsam an einem Gerät; es gibt keine gleichzeitige Online-Zusammenarbeit. Beim Gerätewechsel eine ZIP-Sicherung mitnehmen. Foto-Upload im Notebook und Datendateien der Abgabeliste sind getrennt: die Fotostudio-JSON zusätzlich in die Abgabeliste aufnehmen. Nach einem Reload oder Import müssen Daten erneut ins laufende Python geladen werden. Training und Abschlusstest bleiben bewusst manuell.

## Pflichtweg

| Notebook | Zweck |
|---|---|
| Kursseite «Wie lernt KI?» | Memory-Aufträge und Link zur NIM-Lernstrecke bei inf-schule.de |
| `perzeptron_und_neuronale_netze.ipynb` | Gewicht, Bias, ein Lernschritt, Grenze bei XOR |
| `mehrschichtige_netze.ipynb` | XOR-Zwischenschicht, Lernen qualitativ, Brücke zu Bildmerkmalen |
| `daten_training.ipynb` | Gruppentrennung, Datenlecks und vorsichtige Interpretation |
| `ki_projekt/ki_lernlabor.ipynb` | 15 Minuten gemeinsamer Probelauf |
| `ki_projekt/ki_tandemprojekt.ipynb` | Eigenes Projekt mit Anleitungen zu den fünf Webjournal-Reflexionen |

Das Notebookprinzip ist immer: Vermutung → Experiment → Beobachtung → Erklärung. Codezellen enthalten wenige Aufrufe; nachvollziehbarer Hilfscode liegt in `unterricht_tools.py` und `ki_projekt/*_tools.py`.

## Einfaches Tandemprojekt

**Zwei Klassen, 80 Fotos, ein Vergleich zur Datenvielfalt, ein Startwert.**

Fünf Gruppen mit jeweils einem anderen Exemplar jeder Klasse: T1/T2 trainieren, V1 dient der Auswahl, P1/P2 dem Abschlusstest. Acht Fotos je Klasse/Gruppe. Bei Gesten entspricht eine Gruppe einer Person mit beiden Gesten.

A erhält acht Bilder je Klasse aus T1, B je vier aus T1/T2. Gleich bleiben Bildzahl, Netz und Trainingseinstellungen. Ein festgelegter Startwert (11), 16 Neuronen und 60 Epochen. Auswahl anhand der Validierung begründen, erst danach Test freigeben. Wenige Gruppen und ein Lauf sind ausdrücklich eine Grenze.

Bilder werden im Fotostudio einheitlich als 224 × 224 RGB verarbeitet. Das eingefrorene MobileNet liefert 1280 Merkmale; das eigene Netz wird lokal in Python/Pyodide trainiert. `UEBUNG` nimmt 80 Formen aus dem mitgelieferten synthetischen Datensatz. `ERSATZ` nach Absprache, mit offener Herkunft.

Abgabe des Journals mit Ausgaben, Fotos/JSON und Protokoll vor Beginn von Doppellektion 8. Alle Fachgespräche finden in Doppellektion 8 statt. Richtwert 5 Minuten pro Tandem, je nach Tandemzahl einheitlich kürzer; keine Folgetermine. Der [Gesprächsplan](worksheets/md/KI_Planung.md#gesprächsplan--doppellektion-8) rechnet Wechsel und Puffer mit ein. Zehn Kompetenzen mit je 0–3 Punkten: 18 Punkte für die Abgabe, 12 für das Gespräch. Note = 1 + 5 × Punkte / 30, auf Viertelnoten gerundet. [Vollständiges Bewertungsraster](worksheets/md/KI_Bewertungsraster.md). Die eigene Seite «Lernziele» zeigt die Ziele aller Unterrichtsblöcke.

## Didaktischer Aufbau

Alle zehn Doppellektionen haben einen AVIVA-Ablauf mit 90 Minuten, Leitfrage und Lernprodukt. `projekt/kurs.json` ist die gemeinsame Quelle für Kursseite und Lehrpersonenplanung. Die Notebooks folgen PADUA: Problem, erklärtes Beispiel, Durcharbeiten, Üben und Übertragen. Vor Codezellen stehen Zweck, Beobachtungsauftrag und eine Hilfe zur Interpretation.

Vorhandene Grafiken zu Perzeptron und mehrschichtigem Netz sind auf der Seite und als portable Notebook-Anhänge eingebaut. Sieben nicht mehr benötigte Notebooks wurden entfernt: beide Startnotebooks, NIM, Ziffern, Symbolprojekt sowie lineare und logistische Regression. Alte Prüfungs- und Regressionsblätter liegen gekennzeichnet in `worksheets/archiv/`.

Drei Startwerte sind eine optionale Erweiterung **vor** Testeinsicht, keine Voraussetzung für eine gute Note.

## Schneller Einstieg

Die Kursseite zeigt vorberechnete Beispielgrafiken sofort. Python startet erst beim Öffnen eines Notebooks. **Ein fester Frame zeigt genau ein aktives Notebook.** Vor einem Wechsel speichert Jupyter das Dokument; Projektausgaben und Protokoll werden zusätzlich für die Abgabe übernommen. Danach lädt der Frame das nächste Notebook mit einer frischen Standard-Jupyter-Sitzung. Der Standardparameter `reset` verwirft nur die bisherige Fensteranordnung, damit keine weiteren Notebook-Tabs wieder geöffnet werden; gespeicherte Dokumente bleiben erhalten. Die Bibliotheksdateien können aus dem Browsercache kommen, Python muss sich aber erneut initialisieren. Zum Weiterrechnen im Projekt Daten neu laden und die benötigten Schritte bewusst ausführen; gespeicherte Ergebnisse bleiben sichtbar.

Es gibt keinen gemeinsamen Kernel, kein Umschalten von Python-Namensräumen und kein internes Workspace-Notebook. JupyterLite speichert Notebook-Dokumente. Die Kursseite speichert Journal, Dateianhänge und eine Kopie der Projektausgaben für den Download; laufende Python-Objekte werden nicht gespeichert oder rekonstruiert.

Eine ZIP-Sicherung importiert nur Dokumente und Ergebnisse. Bei einem bereits geöffneten Projekt wird der Standard-Kernel neu gestartet; **kein importierter Code wird ausgeführt**. Danach erste Codezelle und Datenimport bewusst erneut ausführen. Gespeicherte Ausgaben bleiben sichtbar, stehen aber nicht für einen noch laufenden Versuch.

## Technik und Prüfung

```sh
npm ci --prefix extensions/ki-autostart
npm run build --prefix extensions/ki-autostart
python scripts/build_course.py
python scripts/build_portal_notebooks.py
jupyter lite build --contents content --output-dir dist
python scripts/copy_portal.py dist
```

Der Pages-Workflow verwendet dieselbe Reihenfolge. Die Startseite leitet ins Kursportal; `/lab/` bleibt für Lehrpersonen erreichbar. Die Kopie enthält Fotostudio und Hilfsdateien für vollständige Abgabepakete. Generierte Portalnotebooks werden nicht separat gepflegt.

Prüfungen: `python tests/check_course.py`, `python tests/check_ki_basis.py`, `python tests/check_ki_fotos.py`, `python tests/check_ki_projekt.py`, `node tests/check_autostart.cjs` und `node tests/check_archive.cjs`. Browserprüfung: `PORTAL_SITE=dist CHROMIUM_PATH=/pfad/zu/chromium node tests/check_portal.cjs` mit installiertem `playwright-core`; `CHECK_NOTEBOOK=1` prüft zusätzlich Start, Export und Wiederherstellung eines echten Pyodide-Notebooks. `CHECK_TRAINING=1` ergänzt einen echten Trainingslauf samt manueller Testfreigabe und einen Wechsel zum Perzeptron-Experiment. `CHROMIUM_ARGS` nimmt bei Bedarf eine JSON-Liste an.

Pyodide-Prüfung: `node tests/check_pyodide.cjs` (Pyodide 0.27.0; siehe Testskript). Diese führt Originale und eingebettete Fassungen aus. Regelmässig Zwischenstände ausserhalb des Browsers herunterladen: Browserdaten sind keine dauerhafte Sicherung.

### Automatischer Notebookstart

Falls JupyterLite nach einem Seiten-Reload nur den Launcher wiederherstellt, öffnet die Erweiterung das zuletzt geöffnete Kursnotebook im selben Browser-Tab erneut. Explizite Notebook-Links und bereits wiederhergestellte Tabs haben Vorrang.

Beim Öffnen und nach einem Seiten-Reload vergleicht die Erweiterung die Startzellen mit der veröffentlichten Vorlage: Zell-ID und Quelltext müssen unverändert sein. Nur diese bekannten Startzellen werden ausgeführt; zusätzliche Startmarkierungen aus importierten Dokumenten werden ignoriert. Ist eine Startzelle verändert oder entfernt, bleibt die gesamte Startfolge manuell. Oben steht zuerst «Lernumgebung startet …», danach «Bereit» oder ein Hinweis zur manuellen Vorbereitung. Änderungen an Einstellungen benötigen weiterhin Shift + Enter. Ein manueller Kernel-Neustart allein führt keine Zellen aus.

Im Projektjournal startet **nur die Vorbereitung**. Foto-Upload, Datenimport, Training, Testfreigabe und Export bleiben manuell. Ein Reload erhält gespeicherte Eingaben und Ausgaben, stellt aber keine Python-Variablen oder hochgeladenen Dateien wieder her: Daten erneut laden und die benötigten Schritte gezielt ausführen. Vor einem Reload Journal und Ergebnisse herunterladen.

Die Erweiterung startet ausschliesslich die aufgeführten Kursdateien, keine hochgeladenen Fremdnotebooks oder Vertiefungen. Ältere oder veränderte Startzellen bleiben manuell; lokale Arbeiten werden nicht überschrieben. Nach Sicherung der eigenen Arbeit kann die aktuelle Vorlage verwendet werden. Umbenannte Journale bleiben manuell ausführbar. Prüfung: `node tests/check_autostart.cjs`.
