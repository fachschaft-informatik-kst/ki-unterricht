# Kursvorlagen, unabhängige Lehrpersonenordner und Build

## Die Quellenhierarchie

Unter `kurse/_vorlagen/1-klasse/` und `kurse/_vorlagen/4-klasse/` liegen die vollständigen Ursprungsdateien zum Kopieren für neue Kurse. Jeder Kurs erhält eine eigenständige Kopie der passenden Klassenstufe unter `kurse/<lehrperson>/<klasse>/`.

```text
kurse/
  _vorlagen/{1-klasse,4-klasse}/
  bok/{1-klasse,4-klasse}/
  irn/{1-klasse,4-klasse}/
shared/{basis,portal,worksheet-pdf}/  admin-worker/  scripts/
```

Jedes Kursverzeichnis hat dieselben internen Unterordner: `kursseiten/manifest.json`, `kursseiten/glossar.json`, `kursseiten/<kapitel>/` inklusive AVIVA-`planung.json` und `materialien.md`, `lehrperson/` mit Musterlösungen, bei Klasse 4 Einleitung zum Materialkoffer und `lehrperson/dokumente/` mit generierten Word-Dokumenten für Lernende (je AVIVA-Phase, nach dem Kopieren mit `make dokumente DOKUMENTE_KURS=<kurs>` neu erzeugen), `content/` mit Notebook- und weiteren Hilfsdateien, `assets/grafiken/`, `experimente/registry.json`, `worksheets/`, `testbilder/` sowie `snapshot.json` zur Herkunftsbestimmung. Dateien sind unabhängige Kopien, keine Symlinks. Der Snapshot beschreibt den ursprünglichen Kopierzeitpunkt, nicht einen laufend synchronisierten Stand.

## Welche Pfade bearbeitet werden

`shared/course-sites.json` enthält für jeden Kurs die exakten `courseRoot`-, `manifest`- und `teacherFiles`-Pfade. Der Editor liest die Registry aus dem Cloudflare Worker und verwendet sie beim Kapitelwechsel, beim AVIVA-Formular, beim Materialkoffer, bei Glossar/Musterlösungen und beim Erstellen neuer Kapitel und Notebooks. Der Worker prüft alle vorgeschlagenen Pfade gegen das ausgewählte registrierte Verzeichnis. Ein PR kann nicht versehentlich Änderungen an zwei Lehrpersonen-Kursen enthalten.

**Keine nachträgliche Template-Synchronisation:** Nach dem anfänglichen Kopieren sind BOK und IRN unabhängig; Änderungen an Templates werden nicht in laufende Kurse übertragen. Das Prüfskript `python scripts/export_course_templates.py` ist absichtlich ausschliesslich lesend. Mit `--check` verifiziert es die anfängliche Bytegleichheit, ohne diese je wiederherzustellen. Nach inhaltlichen Bearbeitungen Unterschiede statt einer erneuten Kopie prüfen.

## Öffentliche Seiten und Altkompatibilität

BOK 1/4 werden direkt aus ihren kanonischen Kursquellen gebaut. Historische Root-Spiegel und das Synchronisationsskript sind entfernt. Die alten öffentlichen Kurseinstiege `/basis/` und `/projekt/` werden nicht mehr veröffentlicht.

Alle Kurse werden aus ihren eigenen Quellkopien und derselben Basisgestaltung erzeugt; eigene Browserzustände und JupyterLite-Dokumentpfade wie `portal/irn/1-klasse/` vermeiden Datenvermischung. Die Python-Laufzeit und Frontend-Runtime bleiben gemeinsam. Auch BOK verwendet kursbezogene Notebookpfade; alte BOK-Adressen bleiben zusätzlich verfügbar.

Lehrpersonen-AVIVA und Materialkoffer sowie Glossar und Musterlösungen liegen in den getrennten Kursverzeichnissen; die geschützten Lehreransichten lesen diese Dateien über den Worker. Öffentliche, von GitHub gehostete Quellen sind trotz Zugangsschutz zur Lehreransicht im GitHub-Repository grundsätzlich einsehbar.

## Vollständige Prüfungen

```sh
python scripts/course_registry.py
python scripts/export_course_templates.py
python tests/check_course_registry.py
python tests/check_course_isolation.py
python tests/check_notebook_isolation.py
node tests/check_teacher_view.mjs
node tests/check_admin.mjs
make test
```

Beim Deployment müssen sowohl Site-Build als auch Worker-Checks bestehen. Die Tests der Browseroberfläche prüfen Kursauswahl, Live-Vorschau, AVIVA, Materialkoffer, Glossar und PR-Workflow.
