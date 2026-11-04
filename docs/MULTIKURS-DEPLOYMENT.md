# Mehrkurs-Architektur, Deployment und Sicherheit

Das öffentliche GitHub-Repository betreibt **eine technische Plattform** für vier eigenständige Fachkurse. Die fachlichen Ausgangsquellen sind die vollständigen BOK-Kurse 1 und 4 in `templates/1-klasse/` und `templates/4-klasse/`. Daraus wurden zwei eigene BOK- und zwei eigene IRN-Kopien angelegt.

| Kurs | Öffentliche URL | Kanonische Quellwurzel |
| --- | --- | --- |
| BOK · 1. Klasse | `/bok/1-klasse/` | `kurse/bok/1-klasse/` |
| BOK · 4. Klasse | `/bok/4-klasse/` | `kurse/bok/4-klasse/` |
| IRN · 1. Klasse | `/irn/1-klasse/` | `kurse/irn/1-klasse/` |
| IRN · 4. Klasse | `/irn/4-klasse/` | `kurse/irn/4-klasse/` |

Jede Wurzel enthält alle Kapitel und AVIVA-Pläne (`kursseiten/`), den Materialkoffer, ein eigenes JSON-Glossar, eigene Musterlösungen (`lehrperson/`) sowie Notebook- und Pythonquellen (`content/`). Die Templates sind **nur Ausgangsvorlagen**, sie sind keine gemeinsame Quelle für die Inhalte laufender Kurse. Eigene Änderungen von BOK und IRN dürfen einander nicht überschreiben.

## Registry und Editor

`shared/course-sites.json` verwaltet `courseRoot`, `manifest`, `teacherFiles`, Veröffentlichungsstatus und Farbthema. Der geschützte Lehrpersonen-Editor liest die Registry und arbeitet mit den jeweiligen Kursquellen. AVIVA, Materialkoffer, Glossar, Musterlösungen und Kurskapitel werden durch den Worker unter der gewählten Kurswurzel gelesen; der Worker validiert den Pfad jedes PR und verweigert gemischte Lehrpersonenänderungen. Die Dateizugriffe auf GitHub bleiben trotzdem technisch von der allgemeinen Repository-Schreibberechtigung abhängig, nicht von isolierten GitHub-Unterordnerrechten.

Die authentifizierten Unterrichtsunterlagen werden über `/teacher/<lehrperson>/<klasse>/{planung,materialien,musterloesungen}` ausgeliefert. Das öffentliche Repository kann die Quelllösungen jedoch weiterhin offenlegen; OAuth schützt nur die gerenderte Lehreroberfläche, nicht GitHub-Quellen.

## Gemeinsame Infrastruktur

`basis/`, `projekt/`, `shared/`, `admin-worker/`, `scripts/`, die gemeinsamen Stilvorlagen und die JupyterLite/Pyodide-Laufzeit bleiben **zentral**. `scripts/sync_course_sources.py` erzeugt die historischen BOK-Quellen unter `kursseiten/` bzw. `lehrperson/` aus ihren eigenen `kurse/bok/`-Quellen als Kompatibilitätsschicht; diese Spiegel nicht direkt editieren.

Die ursprünglichen BOK-Adressen `/basis/` und `/projekt/`, gespeicherte Antworten und die alten Notebookpfade bleiben erhalten. IRN erhält eigene HTML-Seiten, Browser-/ZIP-Speicherschlüssel und Notebookdokumentpfade unter `portal/irn/<klasse>/`. Ein gemeinsamer JupyterLite-Build reicht für die unterschiedlichen Notebookkopien.

Neue Lehrpersonen lassen sich mit `python scripts/add_teacher_course.py MAI 1 "KI entdecken"` als vollständige Kopie der passenden Vorlage anlegen. Sie stehen zunächst auf `planned`; nach Freigabe wird `status` auf `published` und `source` auf `generated` gesetzt. Die Standardrenderingroute für zusätzliche Lehrpersonen ist generisch; spezialisierte Projekt-Journal- oder ZIP-Abläufe erfordern für neue Kurse eine separate Integration.

## Tests und Deployment

`python scripts/export_course_templates.py --check` prüft die bytegenaue erste Kopie, ohne jemals Kursdaten zu verändern. Die weitere Prüfung erfolgt über `python scripts/course_registry.py`, `node tests/check_admin.mjs`, `node tests/check_teacher_view.mjs`, die Editor-Browserprüfungen und `make test`. GitHub Actions baut alle Kursrouten und die gemeinsame JupyterLite-Laufzeit; ein fehlerhafter gemeinsamer Build blockiert das neue Deployment aller Kurse. Bei Änderungen der Worker-Schnittstelle werden die Worker-Tests ebenfalls ausgeführt.
