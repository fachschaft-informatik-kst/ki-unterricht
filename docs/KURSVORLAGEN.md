# Kursvorlagen, unabhängige Lehrpersonenordner und Build

## Die Quellenhierarchie

Die vorhandene, didaktisch ausgearbeitete **BOK 1. Klasse** und **BOK 4. Klasse** bilden die unveränderten Ausgangsstände `templates/1-klasse/` und `templates/4-klasse/`. Beide wurden vollständig kopiert nach `kurse/bok/<klasse>/` und `kurse/irn/<klasse>/`.

```text
templates/{1-klasse,4-klasse}/
kurse/
  bok/{1-klasse,4-klasse}/
  irn/{1-klasse,4-klasse}/
shared/  basis/  projekt/  admin-worker/  scripts/
```

Jedes Kursverzeichnis hat dieselben internen Unterordner: `kursseiten/manifest.json`, `kursseiten/glossar.json`, `kursseiten/<kapitel>/` inklusive AVIVA-`planung.json` und `materialien.md`, `lehrperson/` mit Musterlösungen und bei Klasse 4 Einleitung zum Materialkoffer, `content/` mit Notebook- und weiteren Hilfsdateien, sowie `snapshot.json` zur Herkunftsbestimmung. Dateien sind eigene Git-Objekte im jeweiligen Namensraum; keine Symlinks.

## Welche Pfade bearbeitet werden

`shared/course-sites.json` enthält für jeden Kurs die exakten `courseRoot`-, `manifest`- und `teacherFiles`-Pfade. Der Editor liest die Registry aus dem Cloudflare Worker und verwendet sie beim Kapitelwechsel, beim AVIVA-Formular, beim Materialkoffer, bei Glossar/Musterlösungen und beim Erstellen neuer Kapitel und Notebooks. Der Worker prüft alle vorgeschlagenen Pfade gegen das ausgewählte registrierte Verzeichnis. Ein PR kann nicht versehentlich Änderungen an zwei Lehrpersonen-Kursen enthalten.

**Keine nachträgliche Template-Synchronisation:** Nach dem anfänglichen Kopieren sind BOK und IRN unabhängig; Änderungen an Templates werden nicht in laufende Kurse übertragen. Das Prüfskript `python scripts/export_course_templates.py` ist absichtlich ausschliesslich lesend. Mit `--check` verifiziert es die anfängliche Bytegleichheit, ohne diese je wiederherzustellen. Nach inhaltlichen Bearbeitungen Unterschiede statt einer erneuten Kopie prüfen.

## Öffentliche Seiten und Altkompatibilität

BOK 1/4 werden aus ihren neuen kanonischen Quellen gebaut. `scripts/sync_course_sources.py` erzeugt die historischen BOK-Verzeichnisse `kursseiten/` und `lehrperson/` als Kompatibilitätsspiegel, damit ältere Parser, Testdaten und die alten Routen `/basis/`, `/projekt/` weiterlaufen. Diese Spiegel nicht direkt bearbeiten.

Die IRN-Kursseiten werden ebenfalls aus den eigenen Quellkopien und derselben Basisgestaltung erzeugt; eigene Browserzustände und JupyterLite-Dokumentpfade wie `portal/irn/1-klasse/` vermeiden Datenvermischung. Die Python-Laufzeit und Frontend-Runtime bleiben gemeinsam. Notebookquellen innerhalb der Kursordner sind eigene Dateien; der Notebook-Builder veröffentlicht kursbezogene JupyterLite-Dokumente. BOK behält bestehende JupyterLite-Dateipfade.

Lehrpersonen-AVIVA und Materialkoffer sowie Glossar und Musterlösungen liegen in den getrennten Kursverzeichnissen; die geschützten Lehreransichten lesen diese Dateien über den Worker. Öffentliche, von GitHub gehostete Quellen sind trotz Zugangsschutz zur Lehreransicht im GitHub-Repository grundsätzlich einsehbar.

## Vollständige Prüfungen

```sh
python scripts/course_registry.py
python scripts/export_course_templates.py --check
python tests/check_course_registry.py
python tests/check_course_snapshots.py
node tests/check_teacher_view.mjs
node tests/check_admin.mjs
make test
```

Beim Deployment müssen sowohl Site-Build als auch Worker-Checks bestehen. Die Tests der Browseroberfläche prüfen Kursauswahl, Live-Vorschau, AVIVA, Materialkoffer, Glossar und PR-Workflow.
