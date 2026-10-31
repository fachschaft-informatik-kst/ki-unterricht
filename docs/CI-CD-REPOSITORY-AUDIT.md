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
  vorher zusammengefasste Buildphase ist in Generierung (4 Minuten),
  Inhaltsprüfung (5 Minuten) und JupyterLite-Paketierung (8 Minuten)
  aufgeteilt. Der notebookbasierte Chromium-Test ist auf **12 Minuten**
  begrenzt. Aussergewöhnliche Hänger werden damit sichtbar statt
  still weiterzulaufen.
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

1. Die Grafiken unter `content/img/` und `projekt/grafiken/` enthalten
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
