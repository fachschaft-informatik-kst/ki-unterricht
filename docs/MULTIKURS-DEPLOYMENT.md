# Mehrere Lehrpersonen und Kursseiten

## Architektur und Grenzen

Das Repository `fachschaft-informatik-kst/ki-unterricht` betreibt **einen gemeinsamen
Build, ein gemeinsames GitHub-Pages-Deployment und einen Cloudflare Worker**.
Die fachlichen Quellen werden nach Lehrperson und Klassenstufe getrennt.
Ein Kurs wird nicht dadurch unabhängig deployt, dass er eine eigene URL hat:
Ein fehlgeschlagener Build blockiert das gesamte neue Deployment.

Die [Kursübersicht](https://fachschaft-informatik-kst.github.io/ki-unterricht/kurse.html)
wird vollständig aus `shared/course-sites.json` erzeugt.

| Kurs | URL | Manifest | Unterrichtsbereiche | Lehrpersonenunterlagen |
| --- | --- | --- | --- | --- |
| BOK 1 | `/bok/1-klasse/` | `kursseiten/basis-manifest.json` | `basis-*` | zentrale BOK-Lösungen plus eigene Feldantworten |
| BOK 4 | `/bok/4-klasse/` | `kursseiten/manifest.json` | über Manifest eindeutig zugeordnet | zentrale BOK-Lösungen plus eigene Feldantworten |
| IRN 1 | `/irn/1-klasse/` | `kursseiten/irn-1-manifest.json` | `irn-1-*` | `lehrperson/irn-1/` |
| IRN 4 | `/irn/4-klasse/` | `kursseiten/irn-4-manifest.json` | `irn-4-*` | `lehrperson/irn-4/` |

BOK ist öffentlich veröffentlicht, IRN verfügt über unabhängige bearbeitbare
Entwürfe und geschützte Lehrpersonenansichten. Die öffentlichen IRN-Schülerseiten
bleiben in Vorbereitung. **IRN erhält keine Kopien der BOK-Unterlagen.**

Historische BOK-Adressen `/basis/` und `/projekt/` bleiben bestehen;
ebenso die vorhandenen Antwort-IDs, lokalen Speicherschlüssel, Notebook-Pfade
und ZIP-Formate. Eine Verschiebung dieser Quellen würde gespeicherte Schülerstände
und Lesezeichen gefährden. Deshalb erfolgt die Trennung über **explizite
Eigentümerschaft**, nicht über ein massenhaftes Verschieben bestehender Dateien.

## Zentrales Kursregister

Jeder Eintrag in `shared/course-sites.json` enthält:

- `id`, `teacher`, `grade`, `slug`: unverwechselbare Identität und URL.
- `editorKey`, `manifest`: Auswahlwert und Quellmanifest für den Editor.
- `sectionPrefix`: zugelassener Namensraum für Kapitel und AVIVA-Bereiche.
- `notebookPrefix`: reservierter Namensraum neuer Notebooks.
- `teacherFiles`: explizite Pfade für `solutions`, `fields`, `glossary` und
  optional `materialsIntro`.
- `source`, `status`: `basis`/`projekt` für die bestehenden BOK-Portale,
  `null` + `planned` für unveröffentlichte Entwürfe oder `generated` +
  `published` für einen neuen generischen Schülerkurs.
- `name`, `theme.accent`: sichtbarer Kurstitel und Kursfarbe.

`scripts/course_registry.py` prüft das Kursregister und alle vorhandenen
Manifeste vor dem Build. Eine Bereichs-ID darf **nur einem Kurs** zugeordnet
sein; neue Kurse müssen ihren eigenen Lehrpersonen- und Notebook-Namensraum
verwenden. Der Worker prüft bei der PR-Einreichung dieselben Eigentümergrenzen
und verbietet es beispielsweise, ein neues Notebook der einen Lehrperson an
ein Kapitel einer anderen Lehrperson anzuhängen.

Die beiden BOK-Kurse verwenden bewusst ein gemeinsames strukturiertes Glossar
(`kursseiten/glossar.json`) und allgemeine BOK-Musterlösungen;
die feldbezogenen Antworten werden nach Klassenstufe getrennt.
Das ist eine dokumentierte historische Ausnahme und **kein Fallback für
neue Lehrpersonen**. IRN und alle neuen Kurse erhalten eigene Dateien.

## Zusätzliche Lehrperson oder neue Klassenstufe anlegen

Beispiel mit Kürzel MAI:

```sh
python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#684e9b" --dry-run
python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#684e9b"
python scripts/course_registry.py
make preview
```

Der Generator erstellt, ohne andere Kursdateien zu verändern:

```text
shared/course-sites.json
kursseiten/mai-1-manifest.json
kursseiten/mai-1-kurs/
  010-start.md
  planung.json
  materialien.md
lehrperson/mai-1/
  musterloesungen.md
  musterloesungen-felder.md
  glossar.md
```

Die URL ist `/mai/1-klasse/`. Bis zur Veröffentlichung wird dort eine
Vorbereitungsseite angezeigt. Der geschützte Editor und die Lehrpersonen-
ansichten erhalten den neuen Kurs durch das Register automatisch.
Es werden weder ein weiteres Repository noch ein weiterer Worker benötigt.

Für die Veröffentlichung nach fachlicher Freigabe im Kursregister
`"status": "published"` und `"source": "generated"` setzen; dann
baut `scripts/generic_course.py` aus **diesem Manifest und den eigenen
Kapiteldateien** eine Schülerseite mit Navigation, Aufgaben und
kursisoliertem Antwortspeicher samt JSON-Import/-Export. Mit `--publish`
kann der Generator diesen Zustand alternativ direkt erzeugen. Das ist
ein **schlichter Ausgangspunkt**: Die spezialisierten BOK-Fotostudio-,
Notebook-/ZIP- und Projektjournal-Funktionen sind nicht automatisch
Bestandteil neuer Kurse und müssen bei Bedarf bewusst integriert werden.

Die Kurse sollen vor der Veröffentlichung redaktionell geprüft werden;
die generierten AVIVA-/Musterlösungs-Dateien sind zunächst Platzhalter.
`python tests/check_course_registry.py` prüft eine Beispielanlage,
Isolation und Veröffentlichung mit einem temporären Testverzeichnis.

## Zugriffsrechte und Lehrpersonen-Editor

Die Kursauswahl im [Editor](https://kst-ki-admin.kevin-bohn.workers.dev/)
und in den geschützten AVIVA-/Materialkoffer-/Musterlösungsansichten folgt
dem Register. Die API liest die explizit zugelassenen Quellen aus GitHub.
Der Worker verwendet das bestehende GitHub-OAuth-Verfahren; nur
Repository-Mitglieder mit Schreibberechtigung dürfen Inhalte ändern.
Pull Requests bleiben der Freigabeweg. Kursbearbeitung ist **nicht**
dasselbe wie unabhängige GitHub-Dateiberechtigungen: Schreibberechtigte
können technisch auf alle Dateien des gemeinsamen Repositories zugreifen.
Bei Bedarf können CODEOWNERS und Review-Regeln organisatorisch helfen.

**Wichtig zur Vertraulichkeit:** Das GitHub-Repository ist öffentlich.
Musterlösungen, AVIVA-Quelldateien und Git-Historie sind über GitHub
öffentlich einsehbar. Das OAuth-Gateway schützt nur die gerenderte
Lehrpersonenansicht auf der Website, **nicht** den Repository-Quellcode.
Für tatsächlich vertrauliche Lösungen wäre ein privates Repository
oder ein separater privater Speicher notwendig.

## CI, Preview und Deployment

`make preview` bzw. `scripts/preview.py` baut BOK und alle registrierten
Kursrouten. Die vollständige Laufzeit entsteht über `make build`.
`scripts/build_course_routes.py` übernimmt registrierte veröffentlichte
Bestandskurse an ihre URLs, erzeugt Entwurfsseiten und rendert neue
veröffentlichte generische Kurse. Die bewährten `/projekt/`- und
`/basis/`-Portale bleiben parallel erhalten.

`.github/workflows/deploy.yml` validiert die Quellzuordnung,
führt Struktur-, Browser- und Notebook-Tests aus und veröffentlicht auf
`main` die Website. Änderungen am Kursregister werden auch bei der
Worker-Deployment-Auswahl berücksichtigt. `scripts/protect_teacher_pages.py`
entfernt die bisherigen BOK-Lehrpersonen-HTML-Dateien und Lösungsdownloads
aus dem öffentlichen Artefakt; neue generische Seiten enthalten von
vornherein keine Lehrerdateien.

Die gemeinsame Plattform bedeutet: Änderungen an allgemeinen CSS-/JS-
Bausteinen oder der Notebook-Laufzeit können alle veröffentlichten
Kurse betreffen und werden entsprechend breit geprüft. Änderungen an
reinen Kursquellen bleiben organisatorisch und durch Quellvalidierung
getrennt.
