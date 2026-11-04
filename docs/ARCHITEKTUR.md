# Architektur und Kursisolation

## Grundregel

Eine gemeinsame statische Plattform betreibt unabhängige Kurse. Fachliche Daten
und kursveränderbare Ressourcen gehören unter `kurse/<lehrperson>/<klasse>/`.
Der Build liest sie direkt. Root-Spiegel, Symlinks zwischen Kursen und eine
nachträgliche Template-Synchronisation gibt es nicht.

## Entscheidung für alle Root-Ordner

| Ordner | Entscheidung und Begründung |
| --- | --- |
| `kurse/` | Eigenständige Kursquellen; ein Kurs benötigt keine andere Kurswurzel. |
| ehemaliges `templates/` | Nach `kurse/_vorlagen/` verschoben: vollständige fachliche Ausgangskopien pro Klassenstufe, nicht Quelle laufender Kurse. |
| `shared/` | Gemeinsame Technik: Kursregister, Validierungsmodelle, Layout, Browserlogik, Editor und PDF-Satzvorlage. |
| `admin-worker/` | Gemeinsame Authentifizierung, kursbezogene GitHub-Zugriffe und PR-Erstellung. |
| `extensions/` | Gemeinsame JupyterLite-Erweiterung für Start, Sicherung und Wiederherstellung. |
| `labextensions/` | Generierte Notebook-Erweiterung; kein redaktioneller Inhalt. |
| `repl/` | Gemeinsame technische JupyterLite-Konfiguration. |
| `scripts/` | Gemeinsame Generatoren, Redaktion, Vorschau und Prüfwerkzeuge. |
| `tests/` | Gemeinsame technische Tests und Fixtures; Kursinhalte werden über ihre Kurswurzel geladen. |
| `docs/` | Gemeinsame Plattform- und Entwicklungsdokumentation, keine Unterrichtsquelle. |
| `.github/` | Gemeinsame CI und Deployment. |
| `_build/`, `dist/` | Generierte Dateien; keine Quellen. |
| `.venv/`, `.cache/`, `.wrangler/` | Lokale technische Umgebungen und Caches; keine Kursquellen. |
| `.git/` | Versionsverwaltung. |
| ehemaliges `basis/` | Layout und Controller nach `shared/basis/`; Grundlageninhalte bleiben kurslokal. |
| ehemaliges `projekt/` | Vorlagen, CSS, Controller und Editor nach `shared/portal/`; Grafiken und Uploads nach `<kurs>/projekt/grafiken/`. |
| ehemaliges `content/` | Notebooks, Python-Hilfen, Fotostudio und Datensätze nach `<kurs>/content/`. Generierte `portal/`-Notebooks nur im Build. |
| ehemaliges `kursseiten/` | Kapitel, Manifest, AVIVA und Glossar ausschliesslich unter `<kurs>/kursseiten/`; alte Spiegel entfernt. |
| ehemaliges `lehrperson/` | Lösungen und Materialien ausschliesslich unter `<kurs>/lehrperson/`. |
| ehemaliges `experimente/` | Notebooktitel und Projektzuordnung unter `<kurs>/experimente/registry.json`. |
| ehemaliges `worksheets/` | Arbeitsblätter, SVGs und Archive unter `<kurs>/worksheets/`; PDF-/SVG-Generatoren unter `scripts/`, Satzvorlage unter `shared/worksheet-pdf/`. |
| ehemaliges `testbilder/` | Unterrichtsbilddaten unter `<kurs>/testbilder/`. |

Makefile, Python-Abhängigkeiten, JupyterLite-Konfiguration und die beiden
plattformweiten Einstiegsseiten bleiben im Root.

## Vollständiger Kurs

```text
kurse/<lehrperson>/<klasse>/
  kursseiten/
    manifest.json
    glossar.json
    <thema>/
      000-*.md
      planung.json
      materialien.md
  lehrperson/
  content/
    *.ipynb
    unterricht_tools.py
    img/
    ki_projekt/
  projekt/grafiken/          # einschliesslich kurslokaler uploads/
  experimente/registry.json
  worksheets/
  testbilder/
  snapshot.json             # Herkunft der ursprünglichen Kopie
```

Unter `kurse/_vorlagen/` liegen die vollständigen Ursprungsdateien zum Kopieren
für neue Kurse, einschliesslich Notebooks und aller fachlichen Ressourcen.
Nach dem Kopieren sind die Kurse unabhängig; spätere Änderungen werden nicht
zwischen Vorlagen und Kursen übertragen.

## Build und Veröffentlichung

`shared/course-sites.json` bestimmt Quellwurzel, Manifest, Klasse, Namen,
Farbthema und Lehrpersonenmaterial. Alle veröffentlichten Kurse verwenden den
vollständigen Renderer ihrer Klassenstufe, nicht die HTML-Ausgabe eines anderen
Kurses. `build_course_routes.py` kopiert gemeinsame Technik und die Ressourcen
der jeweiligen Kurswurzel und rendert deren Kapitel, AVIVA und Glossar.

```sh
python scripts/build_course_routes.py _build/einzelkurs --course irn/1-klasse
python scripts/new_chapter.py basis-neuron --course irn/1-klasse --nummer 9 --title "Transfer"
python scripts/new_lesson.py "KI im Alltag" --course bok/4-klasse --dry-run
bash scripts/generate_worksheet_pdfs.sh --course irn/4-klasse
```

Der Einzelkursbuild ist eine Inhaltsvorschau ohne Notebooklaufzeit. `make build`
paketiert zusätzlich eine gemeinsame JupyterLite-/Pyodide-Laufzeit. Die internen
BOK-Ausgaben unter `_build/site/{basis,projekt}/` dienen bestehenden technischen
Prüfungen; sie werden nicht als Quellen anderer Kurse verwendet.

`build_portal_notebooks.py` schreibt für jeden Kurs eigene Notebookdokumente und
Python-Hilfen nach `_build/content/portal/<lehrperson>/<klasse>/`. Auch BOK
verwendet diese Pfade, damit etwa das gleichnamige XOR-Notebook der 1. Klasse
nicht die Hilfen der 4. Klasse importiert. Alte BOK-Dokumentadressen bleiben
zusätzlich verfügbar. Antwortschlüssel, Browser-Speicher und ZIP-Schemata von
BOK bleiben erhalten; andere Kurse haben eigene Namensräume.

Auch die Fotostudio-Sammlungen sind kursgetrennt. Der bisher gemeinsame
Fotostudio-Speicher bleibt bei BOK 4 erhalten; die anderen Kurse beginnen mit
eigenen Sammlungen und können vorhandene JSON-Exporte importieren.

Die öffentlichen Kursadressen bleiben `/<lehrperson>/<klasse>/`. `/projekt/admin/`
und gemeinsame technische Assets bleiben für den Worker erreichbar; `/basis/`
und `/projekt/` enthalten keine öffentliche Kursstartseite.

## Redaktion und Schutz

Der Editor liest und schreibt nur registrierte Kursquellen. Bild-Uploads liegen
unter `<kurs>/projekt/grafiken/uploads/` und zählen zur gleichen Kursgrenze wie
Kapitel und Notebooks. Vorschau, Grafiken und Downloads verwenden den gewählten
Kurs. Gemischte Kursänderungen in einem Editor-PR werden abgewiesen.

Lehrpersonenansichten bleiben OAuth-geschützt; Kursausgaben enthalten keine
öffentlichen AVIVA-Gesamtexporte oder Lösungen. Das GitHub-Repository selbst ist
öffentlich: Der Oberflächenschutz ist kein Schutz der Quelldateien.

### Materialzuordnung

Materialseiten verwenden dieselbe ID-basierte Aufteilung in internen und
veröffentlichten Kursausgaben. Bei genau einer Lektion pro Themenordner gehört
die gesamte `materialien.md` zu dieser Lektion; Überschriften sind frei editierbar.
Bei mehreren Lektionen im gleichen Ordner beginnen die Abschnitte mit
`<!-- lesson:05 -->` (jeweils die stabile ID aus `planung.json`). Jede geplante
ID muss genau einmal vorkommen. Editor und CLI erzeugen diese Markierungen bei
neuen Lektionen und ergänzen sie auch für den bisherigen Einzelabschnitt.
Markierungen nicht umbenennen oder löschen; die folgende Markdown-Überschrift
darf geändert werden. Die sichtbaren Lektionsnummern stammen aus dem Kursmodell.

Fehlende Materialdateien, falsche oder doppelte Zuordnungen sowie fehlende
Bildbeschreibungen oder ungültige AVIVA-Phasen und Sozialformen brechen den Build
ab. Diese Prüfungen gelten auch für Bilder in den veröffentlichten Materialseiten.
Materialanker verwenden stabile Lektions-IDs; bisherige numerische Anker bleiben
zusätzlich verfügbar, sofern sie nicht mit stabilen IDs kollidieren.

`make test` prüft Build, Links und technische Verträge.
`tests/check_course_isolation.py` baut jeden Kurs in einer temporären Umgebung,
in der **keine anderen Kursquellen** vorhanden sind, und prüft die eigenen
Grafiken, Experimentregistrierung, Fotostudio- und Pythondateien.
`tests/check_notebook_isolation.py` prüft die getrennten Notebook-Arbeitsbereiche.
Die Browserprüfung `tests/check_course_runtime_browser.cjs` startet echte
Python-Widgets in allen vier Kursen; die Fotostudio-Prüfung kontrolliert zusätzlich,
dass Fotos eines Kurses in den anderen Kursen nicht erscheinen.

`make test-all` bündelt den vollständigen Build, die technischen Tests, alle
Notebookausführungen und zehn nacheinander ausgeführte Browsersuiten inklusive
Training und ZIP-Wiederherstellung. `make test-browser` führt nach dem Build nur
die Browsersuiten aus. Playwright ist über das Root-`package-lock.json` für lokale
Prüfungen und CI auf dieselbe Version festgelegt.

### Notebookstart und IndexedDB

Im gebündelten localForage kann ein IndexedDB-Reconnect auf eine andere, noch
nicht initialisierte Speicherinstanz treffen. Der Zugriff auf deren leere
`_dbInfo` brach den Start vor der Kernelinitialisierung ab. Beim Paketieren setzt
`scripts/patch_browser_storage.py` eng begrenzte Nullprüfungen in der festgelegten
Bundleversion ein. Bestehende Datenbanken und Speicherformate bleiben unverändert;
noch initialisierende Instanzen bleiben für ihren eigenen Verbindungsaufbau
verantwortlich. Unbekannte Bundlelayouts führen zu einem Buildfehler statt zu
einer stillschweigend ausgelassenen Korrektur. Bei einem JupyterLite-Update muss
geprüft werden, ob die Korrektur upstream enthalten ist und entfernt werden kann.

`tests/check_browser_storage.cjs` reproduziert den alten Fehler und prüft das
Reconnect-Verhalten mit fertigen und noch initialisierenden Instanzen.
`KI_RUNTIME_REPEATS=3 node tests/check_course_runtime_browser.cjs` wiederholt
die echten Kursstarts ohne automatische Fehler-Retries. Bei Fehlern gibt der
Test Startphasen, Browserwarnungen und fehlgeschlagene/offene Netzwerkanfragen aus.
