# Kursportal

Statische Kursseite unter https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/ mit eingebetteten Notebooks in jeweils einer frischen Jupyter-Sitzung. Keine Dateinavigation für Lernende. Unter «Notizen & Projekt» laden Lernende Journal, Versuch und hinzugefügte Datendateien gemeinsam als ZIP herunter und stellen diesen Projektstand später wieder her. Der Download ist noch keine Einreichung.

## Inhalt pflegen

- `kurs.json`: zehn nummerierte AVIVA-Abläufe à 90 Minuten; `python scripts/build_course.py` aktualisiert die markierten Bereiche in `index.html` und `worksheets/md/KI_Planung.md`.
- `content/*.ipynb` und `content/ki_projekt/*.ipynb`: fünf didaktische Originale. Der Notebook-Build bewahrt Markdown und eingebettete Grafiken. Generierte Fassungen nicht von Hand pflegen.
- Bewertung: zehn Kompetenzen à 0–3 Punkte, maximal 30. K1–K6 Abgabe (18), K7–K10 Tandemgespräch (12). Note = 1 + 5 × Punkte / 30, auf Viertelnoten. Raster auf der Seite und in `worksheets/md/KI_Bewertungsraster.md` synchron halten.
- Projektprofil: zwei Klassen, 80 Fotos, fünf Gruppen. A und B erhalten je 16 Trainingsbilder; 16 Validierungsbilder und 32 Testbilder. Ein Startwert 11, 16 Neuronen, 60 Epochen.

## Laufzeit und Projektstand

Der Build kopiert die Seite, das Fotostudio, Hilfsdateien und vorberechnete Beispielgrafiken nach `dist/projekt/`. Python startet erst beim Öffnen eines Notebooks. Ein fester Frame zeigt genau ein aktives Notebook. Vor einem Wechsel werden das Dokument und die Projektergebnisse gesichert; anschliessend lädt der Frame neu. Es gibt keine parallelen Notebook-Sitzungen, keine gemeinsame Laufzeit und keine eigene Namespace-Verwaltung. Beim Import wird das aktive Notebook geschlossen. Beim nächsten Öffnen werden das gesicherte Dokument und seine Ausgaben in einer frischen Sitzung geladen; importierte Zellen werden nicht automatisch ausgeführt. Danach Vorbereitung und Datenimport erneut ausführen; Training und Abschlusstest bleiben manuell. Nach einem Notebookwechsel oder vollständigen Reload ebenfalls Daten erneut laden.

Journal und Unterrichtsantworten werden lokal gespeichert. Alle fünf geöffneten Notebooks werden nach Änderungen im Browserspeicher gesichert. Gesichert werden Code, Markdown, eingebettete Bilder, Zell-Ausgaben und Widget-Werte samt Diagrammen. Widget-Ergebnisse werden als statischer Stand angezeigt; für neue Berechnungen die jeweilige Zelle erneut ausführen. Ein ZIP sichert keine Python-Variablen oder trainierten Modelle im Arbeitsspeicher. Nach dem Wiederöffnen müssen Vorbereitung, Datenimport und benötigte Berechnungen erneut ausgeführt werden. Unter «Notizen & Projekt» laden Lernende den kompletten Stand als ZIP herunter und stellen ihn beim Gerätewechsel mit «Notizen & Projekt wiederherstellen» wieder her. Ein Tandem arbeitet gemeinsam an einem Gerät; es gibt keine Live-Zusammenarbeit. Dateien, die mit dem Notebook-Upload ausgewählt wurden, werden automatisch in die Dateiliste und das ZIP aufgenommen. Originalfotos und eine noch nicht hinzugefügte Fotostudio-Sammlung weiterhin unter «Notizen & Projekt» hinzufügen.

`node tests/check_notebook_snapshot.cjs` prüft die verlustfreie Übernahme der Notebook-Inhalte. `PORTAL_SITE=dist node tests/check_persistence.cjs` prüft alle fünf Notebooks, Uploads, Widget-Ergebnisse, Neuladen, ZIP-Import in einen frischen Browser und das vollständige Ersetzen eines Projektstands.

`python tests/check_course.py` prüft Pläne, Notebooks, Grafiken, interne Verweise und entfernte Inhalte. `PORTAL_SITE=dist CHECK_NOTEBOOK=1 CHECK_TRAINING=1 node tests/check_portal.cjs` prüft den echten Browserweg (Playwright und Chromium erforderlich). Die Prüfung benötigt einen vollständigen JupyterLite-Build; eine reine HTML-Vorschau enthält keine Python-Laufzeit.

Ohne JavaScript sind Informationen lesbar, Experimente sowie Download und Wiederherstellung des Projektstands benötigen JavaScript. Beim Drucken werden alle Inhaltsbereiche angezeigt.
