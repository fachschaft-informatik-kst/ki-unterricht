# KI-Unterricht

Ein kompakter KI-Block für die 4. Gymiklasse: erleben, gezielt experimentieren und erklären.

- **[JupyterLite starten](https://fachschaft-informatik-kst.github.io/ki-unterricht/lab/index.html?path=00_Start.ipynb)**
- **[Projektseite](https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/)**
- **[Lehrpersonen: Ablauf und didaktische Hinweise](worksheets/md/KI_Planung.md)**

## Pflichtweg

| Notebook | Zweck |
|---|---|
| `lernarten.ipynb` | Memory-Aufträge und spielbares NIM; Belohnungslernen ohne Banditen |
| `perzeptron_und_neuronale_netze.ipynb` | Gewicht, Bias, ein Lernschritt, Grenze bei XOR |
| `mehrschichtige_netze.ipynb` | XOR-Zwischenschicht, Lernen qualitativ, Brücke zu Bildmerkmalen |
| `daten_training.ipynb` | Gruppentrennung, Datenlecks und vorsichtige Interpretation |
| `ki_projekt/ki_lernlabor.ipynb` | 15 Minuten gemeinsamer Probelauf |
| `ki_projekt/ki_tandemprojekt.ipynb` | Eigenes Projekt mit fünf Reflexionsfeldern |

Das Notebookprinzip ist immer: Vermutung → Experiment → Beobachtung → Erklärung. Codezellen enthalten wenige Aufrufe; nachvollziehbarer Hilfscode liegt in `unterricht_tools.py` und `ki_projekt/*_tools.py`.

## Einfaches Tandemprojekt

**Zwei Klassen, 80 Fotos, ein Vergleich zur Datenvielfalt, ein Startwert.**

Fünf Gruppen mit jeweils einem anderen Exemplar jeder Klasse: T1/T2 trainieren, V1 dient der Auswahl, P1/P2 dem Abschlusstest. Acht Fotos je Klasse/Gruppe. Bei Gesten entspricht eine Gruppe einer Person mit beiden Gesten.

A erhält acht Bilder je Klasse aus T1, B je vier aus T1/T2. Gleich bleiben Bildzahl, Netz und Trainingseinstellungen. Ein festgelegter Startwert (11), 16 Neuronen und 60 Epochen. Auswahl anhand der Validierung begründen, erst danach Test freigeben. Wenige Gruppen und ein Lauf sind ausdrücklich eine Grenze.

Bilder werden im Fotostudio einheitlich als 224 × 224 RGB verarbeitet. Das eingefrorene MobileNet liefert 1280 Merkmale; das eigene Netz wird lokal in Python/Pyodide trainiert. `UEBUNG` nimmt 80 Formen aus dem mitgelieferten synthetischen Datensatz. `ERSATZ` nach Absprache, mit offener Herkunft.

Abgabe vor Unterrichtsbeginn am 19.01.2027: Journal mit Ausgaben, Fotos/JSON und Protokoll. Fachgespräch gemeinsam im Tandem. Gewichtung: 15 % Daten, 20 % Experiment, 25 % Auswertung, 40 % Gespräch.

## Vertiefung

`klassifikation_ziffern.ipynb` nutzt jetzt ein neuronales Netz. Regression wurde nach `content/vertiefung/` verschoben und ist kein Pflichtstoff. `ki_symbolprojekt.ipynb` ist eine gesonderte anspruchsvollere Zusatzroute nach Absprache; ihre drei Versuchswege bleiben verfügbar. Im einfachen Foto-Projekt sind drei Startwerte eine optionale Erweiterung **vor** Testeinsicht, keine Voraussetzung für eine gute Note.

## Technik und Prüfung

`jupyter lite build --contents content --output-dir dist` baut den Browserunterricht. Der Pages-Workflow kopiert zusätzlich `projekt/index.html` nach `dist/projekt/`. Dateien in ihren Ordnern zusammen belassen. Fotostudio als vollständige HTML-Datei über das Journal herunterladen; bei direktem Download gehört `fotostudio_core.js` daneben.

Prüfungen: `python tests/check_ki_basis.py`, `python tests/check_ki_fotos.py`, `python tests/check_ki_projekt.py`; Website: `node tests/check_projekt_page.cjs` (Playwright). Pyodide-Prüfung: `node tests/check_pyodide.cjs` (Pyodide 0.27.0; siehe Testskript). Notebooks lassen sich mit `python tests/execute_notebooks.py` ausführen; Ausgabeordner wird im Skript beschrieben.

Persönliche Seitenstände, Fotostudio-Sammlungen und JupyterLite-Dateien sind getrennt. Regelmässig ausserhalb des Browsers herunterladen. Es gibt keine automatische Abgabe.
