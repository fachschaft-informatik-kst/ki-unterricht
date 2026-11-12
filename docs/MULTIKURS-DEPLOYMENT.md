# Mehrkurs-Architektur, Deployment und Sicherheit

Das öffentliche GitHub-Repository betreibt **eine technische Plattform** für vier eigenständige Fachkurse. Unter `kurse/_vorlagen/1-klasse/` und `kurse/_vorlagen/4-klasse/` liegen die vollständigen Ursprungsdateien zum Kopieren für neue Kurse. Jeder Kurs besitzt eine unabhängige Kopie der passenden Klassenstufe.

| Kurs | Öffentliche URL | Kanonische Quellwurzel |
| --- | --- | --- |
| BOK · 1. Klasse | `/bok/1-klasse/` | `kurse/bok/1-klasse/` |
| BOK · 4. Klasse | `/bok/4-klasse/` | `kurse/bok/4-klasse/` |
| IRN · 1. Klasse | `/irn/1-klasse/` | `kurse/irn/1-klasse/` |
| IRN · 4. Klasse | `/irn/4-klasse/` | `kurse/irn/4-klasse/` |

Jede Wurzel enthält alle Kapitel und AVIVA-Pläne (`kursseiten/`), den Materialkoffer, ein eigenes JSON-Glossar, eigene Musterlösungen (`lehrperson/`) sowie Notebook- und Pythonquellen (`content/`). Die Templates sind **nur Ausgangsvorlagen**, sie sind keine gemeinsame Quelle für die Inhalte laufender Kurse. Eigene Änderungen von BOK und IRN dürfen einander nicht überschreiben.

## Registry und Editor

`shared/course-sites.json` verwaltet `courseRoot`, `manifest`, `teacherFiles`, Veröffentlichungsstatus und Farbthema. Der geschützte Lehrpersonen-Editor liest die Registry und arbeitet mit den jeweiligen Kursquellen. AVIVA, Materialkoffer, Glossar, Musterlösungen und Kurskapitel werden durch den Worker unter der gewählten Kurswurzel gelesen; der Worker validiert den Pfad jedes PR und verweigert gemischte Lehrpersonenänderungen. Die Dateizugriffe auf GitHub bleiben trotzdem technisch von der allgemeinen Repository-Schreibberechtigung abhängig, nicht von isolierten GitHub-Unterordnerrechten.

Die authentifizierten Unterrichtsunterlagen werden über `/teacher/<lehrperson>/<klasse>/{planung,materialien,musterloesungen,dokumente}` ausgeliefert. «Alle Dokumente» (`dokumente`) listet die generierten Word-Dokumente für Lernende aus `kurse/<kurs>/lehrperson/dokumente/dokumente.json`; Die Dokumente erscheinen zudem in jeder Phase des Materialkoffers (1. Klasse: Leiste oben rechts) und der AVIVA-Planung. Downloads laufen über `/teacher/dokumente/<datei>?course=<kurs>` und sind auf die im Verzeichnis aufgeführten `.docx`- und `.zip`-Dateien beschränkt. Das öffentliche Repository kann die Quelllösungen jedoch weiterhin offenlegen; OAuth schützt nur die gerenderte Lehreroberfläche, nicht GitHub-Quellen.

## Gemeinsame Infrastruktur

`shared/portal/`, `shared/basis/`, `admin-worker/`, `scripts/`, die gemeinsamen Stilvorlagen und die JupyterLite/Pyodide-Laufzeit bleiben **zentral**. Root-Spiegel und `sync_course_sources.py` sind entfernt. Auch Projektgrafiken, Bild-Uploads, Experimentregistrierung, Arbeitsblätter und Testbilder liegen vollständig unter der jeweiligen Kurswurzel. Die vollständige Ordnerentscheidung steht in [Architektur](ARCHITEKTUR.md).

BOK-Kurse werden nur noch unter `/bok/1-klasse/` und `/bok/4-klasse/` veröffentlicht. Die früheren Einstiegsseiten `/basis/` und `/projekt/` entfallen. Alle Kurse erhalten eigene Notebookdokumentpfade und Hilfsdateien unter `portal/<lehrperson>/<klasse>/`. Alte BOK-Notebookadressen bleiben zusätzlich als Kompatibilitätskopien erhalten; bestehende BOK-Browser-/ZIP-Speicherschlüssel bleiben unverändert. Ein gemeinsamer JupyterLite-Build reicht für die unterschiedlichen Notebookkopien.

Neue Lehrpersonen lassen sich mit `python scripts/add_teacher_course.py MAI 1 "Künstliche Intelligenz"` als vollständige Kopie der passenden Vorlage anlegen. Sie stehen zunächst auf `planned`; nach Freigabe wird `status` auf `published` und `source` auf `generated` gesetzt. Auch neue Lehrpersonen verwenden den vollständigen Renderer ihrer Klassenstufe und eigene Browser-/ZIP-Namensräume.

## Tests und Deployment

`python scripts/export_course_templates.py --check` prüft die bytegenaue erste Kopie, ohne jemals Kursdaten zu verändern. Die weitere Prüfung erfolgt über `python scripts/course_registry.py`, `node tests/check_admin.mjs`, `node tests/check_teacher_view.mjs`, die Editor-Browserprüfungen und `make test`. GitHub Actions baut alle Kursrouten und die gemeinsame JupyterLite-Laufzeit; ein fehlerhafter gemeinsamer Build blockiert das neue Deployment aller Kurse. Bei Änderungen der Worker-Schnittstelle werden die Worker-Tests ebenfalls ausgeführt. Push und Pull Request laufen mit den schnellen Prüfungen; die langsamen Notebook-Browsertests und einige Inhaltsprüfungen laufen täglich nachts auf `main` sowie manuell über «Run workflow» (siehe README, Abschnitt 6).
