# Mehrere Lehrpersonen und Kursseiten

## Architektur und Grenzen

Das Repository `fachschaft-informatik-kst/ki-unterricht` betreibt **einen gemeinsamen
Build, ein gemeinsames GitHub-Pages-Deployment und einen Cloudflare Worker**.
Die fachlichen Quellen werden nach Lehrperson und Klassenstufe getrennt.
Ein Kurs wird nicht dadurch unabhängig deployt, dass er eine eigene URL hat:
Ein fehlgeschlagener Build blockiert das gesamte neue Deployment.

Die [Kursübersicht](https://fachschaft-informatik-kst.github.io/ki-unterricht/kurse.html)
wird vollständig aus `shared/course-sites.json` erzeugt.

| Kurs | URL | Aktiver Quellordner | Status |
| --- | --- | --- | --- |
| BOK 1 | `/bok/1-klasse/` | `kursseiten/bok/1-klasse/` | veröffentlicht |
| BOK 4 | `/bok/4-klasse/` | `kursseiten/bok/4-klasse/` | veröffentlicht |
| IRN 1 | `/irn/1-klasse/` | `kursseiten/irn/1-klasse/` | Entwurf, vollständige Kopie von Vorlage 1 |
| IRN 4 | `/irn/4-klasse/` | `kursseiten/irn/4-klasse/` | Entwurf, vollständige Kopie von Vorlage 4 |

Die initialen Inhalte aller vier Kurse wurden jeweils 1:1 aus den Vorlagen `kursseiten/template/1-klasse/` und `kursseiten/template/4-klasse/` kopiert; bei späteren Bearbeitungen entwickeln sie sich unabhängig. Jeder Ordner besitzt Manifest, sämtliche Kapitel, AVIVA-Pläne, Materialkoffer, Glossar und Musterlösungen. Gleichnamige Kapitel oder Abschnitts-IDs in verschiedenen Kursordnern sind erlaubt, aber kein Kurs darf Dateien eines anderen Kurses als Quellen verwenden.

Die öffentlichen IRN-Schülerseiten sind vorerst noch in Vorbereitung, ihre vollständigen Unterrichtsinhalte können aber bereits über den geschützten Editor bearbeitet werden. Historische BOK-Adressen `/basis/` und `/projekt/` sowie gespeicherte Antwort-IDs, Notebookpfade und ZIP-Formate bleiben bestehen. Flache alte Quellen unter `kursseiten/` bleiben nur noch für Migration und Vergleich; die produktiven BOK-Portale lesen die neuen Ordner.

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

`scripts/course_registry.py` prüft, dass jede Lehrperson und Klassenstufe nur Dateien im eigenen Kursordner referenziert. Gleichnamige Unterrichtsbereiche der BOK- und IRN-Kopie sind zulässig. Der Worker validiert die Eigentümergrenzen bei der PR-Einreichung und stellt nur zugehörige Pläne, Kapitel und Lehrpersonendateien bereit. Das strukturierte Glossar sowie Musterlösungen sind **je Kurs physisch separat vorhanden**, auch wenn der initiale Inhalt identisch ist.

## Zusätzliche Lehrperson oder neue Klassenstufe anlegen

Beispiel mit Kürzel MAI:

```sh
python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#684e9b" --dry-run
python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#684e9b"
python scripts/course_registry.py
make preview
```

Der Generator erstellt, ohne andere Kursdateien zu verändern (minimaler leerer Kursentwurf):

```text
shared/course-sites.json
kursseiten/mai/1-klasse/
  manifest.json
  mai-1-kurs/
    010-start.md
    planung.json
    materialien.md
  lehrperson/
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
