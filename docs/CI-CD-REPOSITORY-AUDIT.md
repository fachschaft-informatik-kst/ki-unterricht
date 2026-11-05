# CI/CD- und Repository-Audit (31.10.2026)

## Ausgangslage und Messwerte

Analysiert wurden die Dateien im `main`-Branch, die GitHub-Action
`.github/workflows/deploy.yml` und mehrere GitHub-Workflow-Läufe vom 31.10.2026.

**Geltungsbereich:** Ausschliesslich die auf `main` vorhandene Repository-Struktur.
Noch nicht gemergte Feature-Branches und Pull Requests sind bewusst nicht
Teil der Bestandsaufnahme oder der Struktur-Empfehlungen.

| Untersuchte Ausführung | Beobachtung |
| --- | --- |
| [Main-Deployment 41241037674](https://github.com/fachschaft-informatik-kst/ki-unterricht/actions/runs/41241037674) | Erfolgreich, etwa 9 min 17 s von Erstellung bis Abschluss |
| [PR-Run 41243779831](https://github.com/fachschaft-informatik-kst/ki-unterricht/actions/runs/41243779831) | Erfolgreich, etwa 6 min 59 s |
| [PR-Rerun 41244656060](https://github.com/fachschaft-informatik-kst/ki-unterricht/actions/runs/41244656060) | Erfolgreiche Ausführung ab Runner-Start etwa 4 min 25 s; davor Wartezeit in der Queue |
| [Main-Run 41245326272](https://github.com/fachschaft-informatik-kst/ki-unterricht/actions/runs/41245326272) | Bei der Prüfung ungewöhnlich lange in „Build the JupyterLite site“ aktiv; Ursache während des laufenden Jobs nicht aus verfügbaren Logs verifizierbar |

Im erfolgreichen Main-Run 41241037674 benötigte die Browser-Vorbereitung
(Playwright-Installation und Chromium/Systempakete) ca. **173 Sekunden**;
die parallelen Portal-/Persistenz-Browserchecks anschliessend ca.
**196 Sekunden**. Diese beiden Bereiche dominieren die CI-Laufzeit.
Die reine Python-Abhängigkeitsinstallation dauerte dort ca. 28 Sekunden.
Die tatsächliche Laufzeit schwankt mit Cachezustand, Runner und Netzzugriff.
Die angegebenen Messungen sind **keine garantierten künftigen Laufzeiten**.

## Änderungen an der GitHub Action

Die aktuelle Action erkennt Auswirkungen anhand aller geänderten Pfade:

| Änderungsbereich | Geprüft | GitHub Pages bei Push nach main | Cloudflare Worker bei Push nach main |
| --- | --- | --- | --- |
| Nur `README.md` oder `docs/` | Änderungserkennung; keine teure Runtime-CI | Nein | Nein |
| Nur `admin-worker/` | Syntax und Worker-Verträge | Nein | Ja |
| Nur Editoroberfläche unter `projekt/admin/` und zugehörige Editor-Tests | Seitenbuild, Content-Checks, Editor-Browsercheck | Ja | Nein |
| `shared/course-model.js` oder `shared/glossary-model.js` | Vollständiger Site-, Runtime- und Browsercheck | Ja | Ja |
| Alle übrigen Quell-, Test- oder Konfigurationsdateien | Vollständiger Site-, Runtime- und Browsercheck | Ja | Nein, sofern keine Worker-Dateien mitgeändert wurden |
| Unklarer Git-Diff, etwa bei nicht mehr verfügbarer Basis | Vorsichtshalber vollständige Tests | Ja | Ja |

Ein PR erzeugt **kein Deployment**. Die zugehörigen vollständigen
Website-Tests bleiben bei Unterrichtsinhalten, Notebooks, Assets,
allgemeiner JS-Logik, Kursmodellen und Build-Konfiguration erhalten.
Bereits vorhandenes `concurrency.cancel-in-progress` verhindert
überholte CI-Läufe im selben PR.

Weitere Massnahmen:

- Browserdateien liegen im GitHub-Cache, dessen Schlüssel die installierte
  Playwright-Version und die Runner-Plattform enthält. Fehlende
  Host-Bibliotheken werden bei Bedarf installiert und der Browserstart
  anschliessend erneut kontrolliert.
- Die `build`-Joblaufzeit ist auf **30 Minuten** begrenzt. Die
  zuvor zusammengefasste Buildphase ist in Kursgenerierung (4 Minuten),
  Inhaltsprüfung (5 Minuten), JupyterLite-Runtime-Build bei Cache-Miss
  (8 Minuten) und Packaging/Overlay (4 Minuten) aufgeteilt.
  Der notebookbasierte Chromium-Test ist auf **12 Minuten** begrenzt.
  Ein hängen gebliebener Build läuft damit nicht unbegrenzt weiter.
- **Rohes JupyterLite-Runtime-Verzeichnis als wiederverwendbarer Cache:**
  Der Schlüssel umfasst Python-/JupyterLite-Abhängigkeiten, JupyterLite-Konfiguration,
  alle Notebook-Inhalte, Experimentregister sowie Autostart-Erweiterung und
  Notebook-Generator. Die Website-Kursseiten/Editor-Dateien bleiben
  bewusst ausserhalb dieses Cache-Schlüssels. Nur bei Cache-Miss
  wird `jupyter lite build` ausgeführt. Der Cache wird **vor**
  `scripts/copy_portal.py` gespeichert; aktuelle Kursseiten, Materialien,
  CSS, Glossar und Editor werden in jedem Website-Build frisch auf
  den gecachten Kern kopiert und im Browser validiert.
  Ein Cache-Miss oder ein ungeeigneter/fehlender Cache führt zu einem
  normalen vollständigen JupyterLite-Build; die erste Ausführung
  muss deshalb nicht schneller sein.
- Cloudflare-Worker-Deployments starten nicht mehr nach reinen
  Änderungen an der CI-Workflowdatei. Sie bleiben weiterhin vom
  erfolgreichen Build-/Prüfjob abhängig.

## Bewertung der Repository-Struktur

**Beibehalten:**

- `kursseiten/`: redaktionelle Kursdaten; getrennte
  `manifest.json` und `basis-manifest.json` für die Klassen.
  Kapitel-IDs, Notebook-Zuordnungen und `data-*`-Attribute
  dürfen wegen Schülerständen nicht ungeplant verändert werden.
- `content/` und `experimente/registry.json`: originale
  Jupyter-Notebooks und ihr zentrales Register.
- `projekt/` und `basis/`: Websiteoberfläche, Stil und Browserlogik;
  `shared/`: gemeinsame Kurs-/Glossarmodelle für Editor und Worker.
- `scripts/`: Generatoren, Vorschau und Editor-Werkzeuge;
  `tests/`: dazugehörige Struktur- und End-to-End-Prüfungen.
- `admin-worker/`: serverseitiger Authentifizierungs-/PR-Dienst;
  separat von der statischen Unterrichtswebsite.
- `_build/` und `dist/`: generierte Ausgaben, bereits korrekt
  in `.gitignore` enthalten; sie gehören nicht in die Versionsverwaltung.

**Überprüfenswerte Stellen, ohne unkontrollierte Migration:**

1. Die Grafiken unter `content/img/` und `assets/grafiken/` enthalten
   teilweise fast gleich grosse Versionen derselben SVGs
   (`perzeptron.svg`, `merhschichtiges_netzwerk.svg`).
   Vor dem Zusammenführen müssen relative Links und Notebook-Assets
   vollständig abgeglichen werden.
2. `testbilder/` (ca. 6,9 MB) und `worksheets/` (ca. 4,5 MB)
   enthalten die grössten versionierten Bestände. Sie nicht ohne
   Verwendungsanalyse in einen externen Speicher verschieben: Tests
   und Unterrichtsmaterialien referenzieren diese Pfade.
3. Die Buildkette verteilt Logik auf `build_portal.py`,
   `build_course.py`, `build_basis.py`, `build_portal_notebooks.py`
   und `copy_portal.py`. Diese bewusst gekapselten Phasen sind
   verständlich; perspektivisch lohnt ein gemeinsames CLI mit
   expliziten Teil-Builds, **nicht** das Zusammenkopieren aller Scripts.
4. Python-Abhängigkeiten sind teils nur per `~=` oder `>=`
   begrenzt, und Playwright wird bei CI-Ausführung aus npm installiert.
   Ein getesteter Lockfile-/Versionspflegeprozess wäre ein eigener
   sinnvoller Folge-PR; pauschales Versions-Upgrade wäre riskant.
## Nachweis und nächste Schritte

Die Änderung liegt in
[PR #102](https://github.com/fachschaft-informatik-kst/ki-unterricht/pull/102).
Vor dem Merge die komplette Site-CI des PR prüfen, insbesondere
Chromium-Hostbibliotheken, Cache und Notebookstart. Danach auf
echten Worker-only- und Editor-only-Änderungen messen und die
GitHub-Actions-Zeiten gegen die Ausgangsläufe vergleichen.

Keine Aussagen über eine exakte Zeitersparnis treffen, bevor
mindestens ein frischer und ein cache-warmer Lauf abgeschlossen sind.


## Nachtrag 04.11.2026: entschlackte technische CI

Die obigen Messwerte beschreiben den historischen Stand vom 31.10.2026.
Seit der vollständigen Migration in eigene BOK-/IRN-Kursordner basiert die
Aktualitätsprüfung auf den kanonischen Quellen in `kurse/`.
Die CI verwendet für reine redaktionelle Änderungen nur Build-, Modell-
und Linkprüfungen. Historische Tests zu genauen Formulierungen,
Kapitelzahlen, Unterrichtsbeispielen und Screenshots wurden aus der
Pflicht-Pipeline entfernt. Bei Notebook-/Runtime-Änderungen bleiben
Ausführung und Browserprüfungen aktiviert. Für Codeänderungen sind
Editor-/Browser-Funktionstests vorgesehen.

## Nachtrag: PR-Laufzeiten optimiert (04.11.2026)

Messung PR #128: 358 Sekunden insgesamt, davon 174 Sekunden für den
ausführlichen Notebook-Chromium-Test. Bei Runtime-Änderungen bleiben
Notebookausführung, Runtime-/Pyodide-Prüfungen, Editor- und UI-Browsertests
sowie der Kaltstart-Browsertest weiterhin PR-Pflicht. Nur die vollständige
Notebook-ZIP-/Training-End-to-End-Strecke wird auf Main-Pushes und
manuelle Workflows verschoben. Dies spart bei entsprechenden PRs bis zu
knapp drei Minuten, ist aber **kein garantierter Wert**. Auf Main werden
die schweren Tests weiterhin ausgeführt, bevor Pages hochgeladen werden.

Reine Redaktion: keine lokalen Makefile-/Preview-Smoketests und keine
Chromium-Installation. Die Kursseiten, Schemata und lokalen Links werden
weiterhin geprüft. Der Runtime-Cache berücksichtigt jetzt auch alle
kurslokalen Notebooks/Assets. Auf Cache-Miss wird die Notebook-Erweiterung
aus den npm-Quellen gebaut, selbst wenn nur redaktionelle Texte geändert
wurden. Der Lauf kann jederzeit über workflow_dispatch vollständig
geprüft werden.

## Nachtrag 05.11.2026: täglicher Nachtlauf mit allen Prüfungen

`.github/workflows/deploy.yml` startet zusätzlich täglich um 01:15 UTC
(02:15 Schweizer Winterzeit, 03:15 im Sommer) auf `main` und führt **alle**
Prüfungen aus (`schedule`). Denselben Lauf startet der Knopf *Run workflow*
(`workflow_dispatch`). Der Schritt «Detect affected deployment targets»
setzt dafür die Ausgabe `full`; Pushes und PRs setzen sie nicht.

| Prüfung | Push / PR | Nachtlauf / manuell |
| --- | --- | --- |
| Build, Schemata, Editor- und Seiten-Browsertests, Notebook-Ausführung, Kernel-/Lock-Prüfungen, Kaltstart des Widgets | ja | ja |
| Echter Notebookstart in jedem Kurs (ca. 90 s) | nein (früher bei Runtime-Änderungen) | ja |
| Vollständiger Release-Test mit Training, ZIP und Persistenz (ca. 3,5 Min.) | nein (früher bei Push auf `main`) | ja |
| `check_portal_content.py`, `check_content_mvc.py`, `check_ki_projekt.py`, `check_ki_fotos.py`, `check_ki_basis.py` (vorher nirgends ausgeführt) | nein | ja |
| Alle Notebooks aller Kurse und Kursvorlagen im echten Pyodide 0.27.0 (Node, ca. 3 Min.): `check_pyodide.cjs` | nein | ja |
| `check_project_pages.cjs` (Seiten des Bildprojekts im Browser) | nein | ja |

GitHub Pages und der Worker werden weiterhin bei jedem Push auf `main`
aktualisiert; der Nachtlauf deployt nichts. Ein kaputter Notebookstart kann
deshalb bis zum nächsten Nachtlauf online sein. Die schnellen Notebook-Prüfungen
(Erweiterung, Ausführung aller Notebooks, Kernel, Kaltstart) bleiben in jedem
Push. Der Nachtlauf hat eine eigene Concurrency-Gruppe, damit ein Push in
der Nacht ihn nicht abbricht. Bei einem roten Nachtlauf sendet GitHub eine
E-Mail an die Person, die den Cron-Eintrag zuletzt geändert hat. Geplante
Läufe verwenden immer den Stand von `main`.

Bewusst nicht verdrahtet bleibt `execute_notebooks.py` (durch
`execute_all_notebooks.py` ersetzt). `check_pyodide.cjs` läuft im Nachtlauf
mit `npm install --no-save pyodide@0.27.0`; die Version muss zu
`jupyterlite-pyodide-kernel` in `requirements.txt` passen (0.5.0 bündelt
Pyodide 0.27.0). Der Test führt für jeden veröffentlichten Kurs (Register
`shared/course-sites.json`) und jede Kursvorlage unter `kurse/_vorlagen/`
alle Notebooks der Experimentregistrierung aus, bei Kursen als Quelle und als
paketierte Kopie unter `_build/content`, jeweils mit frischem Modulzustand,
dazu das Projekt-Gate `check_ki_basis.py` (Kurswahl über
`KI_COURSE_CONTENT`). Fehler werden gesammelt und am Ende aufgelistet. Er
lädt die Pyodide-Pakete von jsDelivr und `ipywidgets` von PyPI; bei einem
roten Lauf ohne Codeänderung zuerst Netzwerkfehler ausschliessen und den Lauf
wiederholen. Die nativen Tests `execute_all_notebooks.py`,
`check_ki_projekt.py` und `check_ki_fotos.py` sind weiterhin auf BOK 4
festgelegt.
