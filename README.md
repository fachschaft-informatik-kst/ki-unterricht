# Interactive ML Notebooks for School

This repository contains interactive Jupyter notebooks used to teach machine learning concepts in a school setting. It focuses on approachable, visual explanations and hands‑on widgets for exploration.

We use a JupyterLite template only as a lightweight scaffold to host notebooks in the browser. The emphasis here is on the teaching materials, not on JupyterLite itself. See dokumentation at <https://jupyterlite.readthedocs.io/> for more about JupyterLite.

Noteooks are accessible both locally (with a standard Jupyter installation) and in the browser via JupyterLite Github Pages at: <https://fachschaft-informatik-kst.github.io/ml-interactive-notebooks>

The advantage of the browser version is that no local setup is required. However, some interactive features may be limited compared to a full local installation. The ultimate advantage with jupiterlite is that students can explore the notebooks directly in the browser without installing anything. Everything runs client-side and no server is needed. In every case, the notebooks are designed to be self-contained and easy to follow.


## Contents

- `content/lineare_regression.ipynb`: Einführung in lineare Regression mit interaktiven Slidern.
- `content/logistic_regression.ipynb`: Logistische Regression zur Klassifikation mit interaktiven Grafiken.
- `content/lernarten.ipynb`: Supervised, Unsupervised und Reinforcement Learning – kompakt und interaktiv.
- `content/klassifikation_ziffern.ipynb`: Klassifikation von handgeschriebenen Ziffern mit Visualisierungen.
- `content/daten_training.ipynb`: Datenaufbereitung und Trainingsprozess mit interaktiven Elementen.

## Tandemprojekt: Was hat unser Netz gelernt?

**[Zur interaktiven Projektseite](https://fachschaft-informatik-kst.github.io/ml-interactive-notebooks/projekt/)** – Ablauf, Themenwahl, Bewertung, Kompetenzraster und Abgabecheckliste.

Tandems wählen eine Fotoanwendung mit zwei bis vier Klassen, sammeln eigene Bilder und trainieren ein kleines neuronales Netz auf festen MobileNet-Merkmalen. Abgabe: ausgefülltes Journal mit Ausgaben, Daten und individuelles Fachgespräch.

| Material | Zweck |
|---|---|
| [Projektauftrag](content/ki_projekt/ki_projektauftrag.md) | Sechs Phasen, Zeitplan, Bewertung |
| [Ideenpool](content/ki_projekt/ki_ideenpool.md) | Zwölf Themen und Projektsteckbrief |
| [Datensammlung](content/ki_projekt/ki_fotodaten.md) | Gruppenplanung, Import, Vorverarbeitung und Sicherung |
| [Lernlabor](content/ki_projekt/ki_lernlabor.ipynb) | 20–30 Minuten Grundlagen anhand synthetischer Symbole |
| [Foto-Projektjournal](content/ki_projekt/ki_tandemprojekt.ipynb) | Eigene Untersuchung; vorbereitetes UEBUNG-Beispiel |
| [Fotostudio](content/ki_projekt/fotostudio.html) | Browseroberfläche zur Merkmalsextraktion; über Notebook als vollständige HTML-Datei herunterladen |
| [Übungs-/Ersatzdaten](content/ki_projekt/foto_uebungsdaten.json) | 192 synthetische Formen mit echten MobileNet-Merkmalen |
| [Symbolprojekt](content/ki_projekt/ki_symbolprojekt.ipynb) | Optionale ursprüngliche Route: eigenes Netz auf gezeichneten Pixelbildern |

**Einstieg:** Im JupyterLite-Dateibrowser den Ordner `ki_projekt` und darin `00_Start.ipynb` öffnen.

### Ablauf in JupyterLite / Pyodide

Nach Merge und Deployment: [Lernlabor](https://fachschaft-informatik-kst.github.io/ml-interactive-notebooks/lab/index.html?path=ki_projekt/ki_lernlabor.ipynb), danach [Projektjournal](https://fachschaft-informatik-kst.github.io/ml-interactive-notebooks/lab/index.html?path=ki_projekt/ki_tandemprojekt.ipynb).

1. Projektdateien in `content/ki_projekt/` zusammen belassen; der bestehende Build übernimmt sie.
2. Journal in `UEBUNG` von oben nach unten ausführen. Die künstlichen Formen belegen keine Erkennungsleistung auf Alltagsfotos.
3. Thema, Klassen und acht unabhängige Gruppen planen, Steckbrief mit Probebildern besprechen. Pro Gruppe und Klasse zwölf Bilder sammeln. Vier Gruppen trainieren, zwei validieren, zwei testen. Dieselben Gegenstände / Personen niemals auf Rollen verteilen.
4. Im Journal Fotostudio herunterladen und lokal öffnen. Eigene JPG/PNG-Bilder übernehmen, Vorschau kontrollieren, JSON sichern. Das Notebook bettet den Hilfscode beim HTML-Download ein. Bei direktem Download aus GitHub müssen HTML und `fotostudio_core.js` nebeneinander liegen.
5. `EIGENE_DATEN`, Klassen und Gruppen einstellen, Kernel neu starten. JSON im Widget wählen, danach die Datenzelle ausführen. Alternativ Dateinamen in `DATEIEN` eintragen.
6. Ausgangsmodell auswerten. Einen A/B-Vergleich vorab planen: **Menge** (12/48 Bilder), **Vielfalt** (2/4 Gruppen bei je 24 Bildern) oder **Netzgrösse** (8/48 Neuronen bei identischen Bildern). Alle drei festgelegten Läufe berichten.
7. Auswahl mit Validierung begründen, Abschlusstest freigeben, Ergebnis kritisch beurteilen. Die Testsperre unterstützt eine Arbeitsregel; sie ist kein Zugriffsschutz.
8. Notebook mit Ausgaben, JSONs, Originalfotos, Gruppen-/Quellenliste und Protokoll ausserhalb des Browsers sichern.

### Technische Trennung

Das Fotostudio verwendet TensorFlow.js **4.22.0** und MobileNet **2.1.1**, Modell V2 alpha=0.5. Bilder werden proportional auf eine weisse 224×224-Fläche gebracht. MobileNet skaliert RGB intern auf 0–1 und liefert 1280 feste Merkmale. Bibliotheken kommen von jsDelivr, Modellgewichte von Google; Schulnetz vorab prüfen. Die Seite lädt keine Bilder hoch. CPU ist möglich, GPU nicht erforderlich; Geschwindigkeit ist geräteabhängig.

Das Notebook lädt NumPy, SciPy, scikit-learn, Matplotlib und Pillow unter Pyodide. Es normiert Merkmale je Bild auf Länge 1 und trainiert ausschliesslich den kleinen MLPClassifier. Kein Python-TensorFlow nötig. Vorschauen haben 64×64 Pixel und dienen nur der Darstellung. Quellen und Bild-IDs werden im Protokoll erfasst. Gleiche Browser-Vorverarbeitung kann zwischen Rendering-Engines geringfügige Rundungsunterschiede aufweisen; deshalb dieselben exportierten JSONs für den Vergleich verwenden.

Die Symbolroute bleibt für ein vollständig selbst trainiertes Netz auf 16×16-Pixeln verfügbar. Das gemeinsame Lernlabor verwendet diese anschauliche Route und erklärt den Übergang zu Bildmerkmalen.

### Für die Lehrperson

Ab 08.12. Sammlung organisieren, am 15.12. Ausgangsmodell, am 05.01. Vergleich, am 12.01. Abschlusstest und Urteil, ab 19.01. individuelle Fachgespräche. Gleicher Abgabestand vor allen Gesprächen. Bewertet werden Fragestellung/Daten (15 %), Experiment (20 %), Auswertung (25 %) und individuelles Verständnis (40 %).

`ERSATZ` im Journal nutzt nach Absprache dieselben synthetischen Übungsdaten. Herkunft und eingeschränkte Frage müssen sichtbar bleiben. Ein Ersatzdatensatz ist kein Beleg eigener Fotosammlung.

### Überprüfung

- `python tests/check_ki_projekt.py`: Vergleichsbedingungen, Symbolimport und Testsperre.
- `python tests/check_ki_fotos.py`: Fotodaten, Dimensionen, Quellen, getrennte Gruppen, alle drei Vergleichswege und finaler Test.
- `node tests/check_fotostudio.cjs`: gleiche Bildaufbereitung und echte MobileNet-Merkmale; benötigt `npm install --no-save @tensorflow/tfjs@4.22.0 @tensorflow-models/mobilenet@2.1.1 @napi-rs/canvas` und Netzwerk für das Modell.

Die Python-Prüfungen und die Notebook-Ausführung werden zusätzlich unter Pyodide 0.27.0 geprüft. Ein vollständiger JupyterLite-Klicktest auf Schulgeräten ist damit nicht ersetzt.

## Worksheets (PDF)

```bash
cd worksheets
./generate_pdfs.sh
```

## Run Locally

Prerequisite: Python 3.12

- Check your version:

```shell
python --version
```

1. Install dependencies:

```shell
pip install -r requirements.txt
```

2. Start Jupyter (Notebook or Lab):

```shell
jupyter notebook
# or
jupyter lab
```

Then open the notebooks in the `content/` folder.

## Notes

- The project structure and basic config are derived from a JupyterLite template to enable easy in‑browser use if desired.
- Teaching goal: provide clear, interactive materials for ML basics (regression, clustering, simple RL) suitable for classroom exploration.
- Notebooks are designed to be self-contained and easy to follow for students with minimal prior experience in machine learning.