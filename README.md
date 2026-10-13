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

Abgabe vor Unterrichtsbeginn am 19.01.2027: Journal mit Ausgaben, Fotos/JSON und Protokoll. Fachgespräch gemeinsam im Tandem. Zehn Kompetenzen mit je 0–3 Punkten: 18 Punkte für die Abgabe, 12 für das Gespräch. Note = 1 + 5 × Punkte / 30, auf Viertelnoten gerundet. [Vollständiges Bewertungsraster](worksheets/md/KI_Bewertungsraster.md). Die eigene Seite «Lernziele» zeigt die Ziele aller Unterrichtsblöcke.

## Didaktischer Aufbau

Alle zehn Doppellektionen haben einen AVIVA-Ablauf mit 90 Minuten, Leitfrage und Lernprodukt. `projekt/kurs.json` ist die gemeinsame Quelle für Kursseite und Lehrpersonenplanung. Die Notebooks folgen PADUA: Problem, erklärtes Beispiel, Durcharbeiten, Üben und Übertragen. Vor Codezellen stehen Zweck, Beobachtungsauftrag und eine Hilfe zur Interpretation.

Vorhandene Grafiken zu Perzeptron und mehrschichtigem Netz sind auf der Seite und als portable Notebook-Anhänge eingebaut. Sieben nicht mehr benötigte Notebooks wurden entfernt: beide Startnotebooks, NIM, Ziffern, Symbolprojekt sowie lineare und logistische Regression. Alte Prüfungs- und Regressionsblätter liegen gekennzeichnet in `worksheets/archiv/`.

Drei Startwerte sind eine optionale Erweiterung **vor** Testeinsicht, keine Voraussetzung für eine gute Note.

## Schneller Einstieg

Die Kursseite startet nach dem Anzeigen des Texts im Hintergrund **eine gemeinsame Python-Umgebung**. Bibliotheken werden einmal pro Seitenaufruf initialisiert. Beim Wechsel zwischen Lernversuchen bleibt derselbe Kernel erhalten; jedes Notebook hat eigene Variablen, sodass das Tandemprojekt und seine Ergebnisse erhalten bleiben. Der Status steht in der Seitenleiste.

Perzeptron und XOR haben zusätzlich vorberechnete Beispielgrafiken, die ohne Python sichtbar sind. Lernversuche initialisieren sich beim ersten Öffnen; Projekttraining und Abschlusstest bleiben manuell. Ein kompletter Reload startet Python erneut, nutzt aber den Browsercache. Ein Notebookwechsel benötigt keinen erneuten Bibliotheksstart.

Der interne `ki_workspace.ipynb` ist nur die gemeinsame Arbeitsansicht. Die eigentlichen Kursnotebooks und Abgabedateien bleiben getrennt gespeichert. `ki_portal_runtime.py` trennt ihre Python-Namensräume; der Import einer Projektsicherung setzt nur den Projektbereich zurück.

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

Die vier Lernnotebooks führen beim Öffnen und nach einem Seiten-Reload ihre mit `ki-autostart` markierten Codezellen der Reihe nach aus. Oben steht zuerst «Lernumgebung startet …», danach «Bereit». Änderungen an Einstellungen benötigen weiterhin Shift + Enter. Ein manueller Kernel-Neustart allein führt keine Zellen aus.

Im Projektjournal startet **nur die Vorbereitung**. Foto-Upload, Datenimport, Training, Testfreigabe und Export bleiben manuell. Ein Reload erhält gespeicherte Eingaben und Ausgaben, stellt aber keine Python-Variablen oder hochgeladenen Dateien wieder her: Daten erneut laden und die benötigten Schritte gezielt ausführen. Vor einem Reload Journal und Ergebnisse herunterladen.

Die Erweiterung startet ausschliesslich die aufgeführten Kursdateien, keine hochgeladenen Fremdnotebooks oder Vertiefungen. Bereits früher im Browser gespeicherte Versionen ohne Startmarkierungen müssen nach Sicherung der eigenen Arbeit durch die aktuelle Vorlage ersetzt werden; lokale Arbeiten werden nicht überschrieben. Umbenannte Journale bleiben manuell ausführbar. Prüfung: `node tests/check_autostart.cjs`.
