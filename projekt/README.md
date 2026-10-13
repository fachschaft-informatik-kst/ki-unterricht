# Kursportal

Statische Kursseite unter https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/ mit einer gemeinsamen eingebetteten Python-Umgebung. Keine Dateinavigation für Lernende. Journal, Versuch und hinzugefügte Datendateien werden unter «Sichern & abgeben» als ZIP gesichert. Der Download ist noch keine Einreichung.

## Inhalt pflegen

- `kurs.json`: zehn datierte AVIVA-Abläufe à 90 Minuten; `python scripts/build_course.py` aktualisiert die markierten Bereiche in `index.html` und `worksheets/md/KI_Planung.md`.
- `content/*.ipynb` und `content/ki_projekt/*.ipynb`: fünf didaktische Originale. Der Notebook-Build bewahrt Markdown und eingebettete Grafiken. Generierte Fassungen nicht von Hand pflegen.
- Bewertung: zehn Kompetenzen à 0–3 Punkte, maximal 30. K1–K6 Abgabe (18), K7–K10 Tandemgespräch (12). Note = 1 + 5 × Punkte / 30, auf Viertelnoten. Raster auf der Seite und in `worksheets/md/KI_Bewertungsraster.md` synchron halten.
- Projektprofil: zwei Klassen, 80 Fotos, fünf Gruppen. A und B erhalten je 16 Trainingsbilder; 16 Validierungsbilder und 32 Testbilder. Ein Startwert 11, 16 Neuronen, 60 Epochen.

## Laufzeit und Sicherung

Der Build kopiert die Seite, das Fotostudio, Hilfsdateien und vorberechnete Beispielgrafiken nach `dist/projekt/`. Python wird beim Seitenaufruf im Hintergrund vorbereitet. Notebookwechsel verwenden denselben Kernel mit getrennten Variablenbereichen. Nach vollständigem Reload oder Import müssen Daten erneut geladen werden; Training und Abschlusstest starten weiterhin manuell.

Journal und Unterrichtsantworten werden lokal gespeichert. Beim Gerätewechsel ZIP mitnehmen. Ein Tandem arbeitet gemeinsam an einem Gerät; es gibt keine Live-Zusammenarbeit. Im Notebook hochgeladene Daten zusätzlich in die Abgabeliste aufnehmen.

`python tests/check_course.py` prüft Pläne, Notebooks, Grafiken, interne Verweise und entfernte Inhalte. `PORTAL_SITE=dist CHECK_NOTEBOOK=1 CHECK_TRAINING=1 node tests/check_portal.cjs` prüft den echten Browserweg (Playwright und Chromium erforderlich). Die Prüfung benötigt einen vollständigen JupyterLite-Build; eine reine HTML-Vorschau enthält keine Python-Laufzeit.

Ohne JavaScript sind Informationen lesbar, Experimente und lokale Sicherung benötigen JavaScript. Beim Drucken werden alle Inhaltsbereiche angezeigt.
