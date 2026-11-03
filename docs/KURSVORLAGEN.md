# Kursvorlagen und getrennte Lehrpersonen-Kopien

## Zielstruktur

```text
templates/
  1-klasse/             # Referenz: vollständige BOK-1-Quellen
  4-klasse/             # Referenz: vollständige BOK-4-Quellen
kurse/
  bok/
    1-klasse/           # eigene Kopie von templates/1-klasse
    4-klasse/           # eigene Kopie von templates/4-klasse
  irn/
    1-klasse/           # eigene Kopie von templates/1-klasse
    4-klasse/           # eigene Kopie von templates/4-klasse
```

Jede Kopie enthält ein `kursseiten/manifest.json`, die zugehörigen Kapitelordner, AVIVA-`planung.json`, `materialien.md`, die im Kursregister zugeordneten Lehrpersonen-Unterlagen und die direkt aus Kapiteln referenzierten Notebookdateien unter `content/`. Ein `snapshot.json` benennt Herkunft und kopierte Bereiche.

Vorlagen werden **nicht** direkt redigiert; Kursänderungen gehören ausschliesslich zur jeweiligen Lehrperson und Klasse. Es werden echte Dateien statt Symlinks verwendet. Gemeinsame Laufzeit- und Designtechnik (`projekt/`, `basis/`, `shared/`, `admin-worker/`, JupyterLite, Build-Skripte) wird nicht kopiert.

## Snapshots erzeugen und prüfen

```sh
python scripts/export_course_templates.py
python scripts/export_course_templates.py --check
```

Beide Befehle sind deterministisch. Der zweite prüft die Kopien bytegenau. **Achtung:** Ein erneuter Export überschreibt Kopien; spätere Bearbeitungen der Lehrperson dürfen deshalb nicht durch den Export ersetzt werden.

## Kompatibilitäts- und Migrationsstand

Die Snapshots bilden zunächst die BOK-Inhalte als unveränderte Vorlage ab, ausdrücklich **auch für IRN**. Die aktuellen IRN-Quellen unter `kursseiten/irn-*-kurs/` werden dadurch nicht gelöscht oder stillschweigend überschrieben. Da identische Ausgangskapitel noch dieselben `id`- und `data-answer`-Werte haben, dürfen Snapshots nicht ohne Namensraum-Migration gleichzeitig als Live-Kurse im gemeinsamen Portal registriert werden.

Der produktive Editor, Kursrenderer und Worker verwenden derzeit weiterhin die bestehenden Pfade unter `kursseiten/` und `lehrperson/`, wie sie in `shared/course-sites.json` definiert sind. Die Ordnerstruktur hier ist ein **vorbereitender Migrationsschritt** und **noch keine abgeschlossene Laufzeitumstellung**. Für den produktiven Wechsel müssen Kursregister, Manifestauflösung, Editor-Dateipfade, Worker-Schreibvalidierung, Build, Notebook-Verlinkung und Tests in einem abgestimmten Schritt umgestellt werden. Bis dahin bleiben bestehende Kurs-URLs, Antworten und Downloads unangetastet.
