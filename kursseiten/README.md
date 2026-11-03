# Unterrichtsinhalte bearbeiten

## Verzeichnisstruktur: Vorlage und eigenständige Kurse

```text
kursseiten/
├── template/
│   ├── 1-klasse/       # BOK 1 als unveränderte Ausgangsvorlage
│   └── 4-klasse/       # BOK 4 als unveränderte Ausgangsvorlage
├── bok/
│   ├── 1-klasse/       # eigene bearbeitbare Kopie der Vorlage 1
│   └── 4-klasse/       # eigene bearbeitbare Kopie der Vorlage 4
└── irn/
    ├── 1-klasse/       # eigenständige 1:1-Kopie der Vorlage 1
    └── 4-klasse/       # eigenständige 1:1-Kopie der Vorlage 4
```

Jeder Klassenordner enthält `manifest.json`, sämtliche Themenordner mit nummerierten Kapiteln, `planung.json` und `materialien.md`, ausserdem `glossar.json` und `lehrperson/` mit Musterlösungen und weiteren Lehrpersonenmaterialien. **BOK und IRN sind initial inhaltlich identische, aber unabhängig bearbeitbare Kopien der jeweiligen Vorlage.** Die Vorlagen unter `template/` sind keine aktiven Kurse und werden beim Build nicht als Unterrichtsseiten veröffentlicht. Änderungen an BOK ändern IRN oder die Vorlage nicht und umgekehrt.

Die öffentlichen BOK-URLs und bisherigen Notebook-/Antwort-IDs bleiben erhalten. Die spezialisierten Notebook- und ZIP-Laufzeiten liegen weiterhin in gemeinsam genutzten technischen Verzeichnissen (`content/`, `basis/`, `projekt/`); eine Kopie der Kursquellen dupliziert nicht automatisch die Python-Laufzeit. IRN ist im Kursregister derzeit noch als *in Vorbereitung* markiert, verfügt im Editor aber über die vollständigen Vorlageninhalte. Historische flache Quellpfade unter `kursseiten/` bleiben vorerst aus Migrations- und Vergleichsgründen erhalten; verbindliche Quellen sind ausschliesslich die im Register angegebenen Kursordner.


Massgeblich sind die Quellen in den im Kursregister angegebenen Kursordnern. Die alten flachen Quellen unter `kursseiten/` dienen nur noch als Migrationsreferenz. HTML und der vollständige Markdown-Unterrichtsplan werden je nach Kurs unter `_build/site/projekt/` oder `_build/site/basis/` erzeugt und **nicht** in Git versioniert.

Pro Thema liegen hier `planung.json` (eine oder mehrere Doppellektionen),
`materialien.md` (Abschnitte mit `## Doppellektion <stabile-id>`) und nummerierte
Kapiteldateien. `manifest.json` enthält Bereichsmetadaten und Navigation.
Alle Themen verwenden denselben Build, unabhängig vom Erstellungszeitpunkt.

```sh
python scripts/new_lesson.py "KI im Alltag"
python scripts/new_lesson.py "Weitere Lernarten" --section lernarten --after 02
make preview
```

Der Generator erstellt AVIVA-Platzhalter, ein erstes Kapitel und Materialien.
`--after` bezeichnet die stabile Lektions-ID, `order` bestimmt die Reihenfolge.
Sichtbare Nummern entstehen erst beim Build; IDs niemals zum Umsortieren ändern.
Bei Einfügungen Nummernverweise in frei geschriebenen Texten redaktionell prüfen.

Die Bereiche einstieg, lernarten, perzeptron, netze, projekt, sprache und gesellschaft
entsprechen den Doppellektionen 1–10; projekt umfasst Doppellektionen 5–7; fremdmodell ist die eigene Doppellektion 8.
start, lernziele, journal, bewertung und sicherung sind übergreifende Bereiche.

Dateien beginnen mit 000 (Einleitung), dann 010, 020 usw. (Kapitel), und 999 (Abschluss).
Bestehende Textpassagen können direkt in der jeweiligen Kapiteldatei geändert oder
entfernt werden. Die ursprünglichen HTML-Elemente bleiben zur Kompatibilität erhalten.

## Lesefreundliche Quelldateien

Die Kapiteldateien sind für die direkte Bearbeitung im GitHub-Editor aufbereitet:
klare HTML-Einrückungen, getrennte Aufgabenblöcke und einfache Absätze bzw.
Zwischenüberschriften als **Markdown**. Komplexe Tabellen, Notebook-Schalter,
Grafiken und Eingabefelder bleiben als strukturiertes HTML, damit sämtliche
`id`- und `data-...`-Schlüssel unverändert bleiben.

`<!-- MD:START -->` und `<!-- MD:END -->` begrenzen gewöhnlichen Markdown-
Text innerhalb der bestehenden HTML-Kapitel. Zwischen diesen Markierungen
lassen sich Absätze, **Fettdruck**, Listen, Bilder und Unterüberschriften
ohne HTML bearbeiten. Den Rest des Formular-HTML nicht unbeabsichtigt ändern.

Neue oder stark veränderte HTML-Abschnitte können mit folgendem Befehl
automatisch lesbar formatiert werden:

```sh
python scripts/format_course_sources.py
```

Mit `--check` prüft GitHub Actions, dass die Formatierung konsistent ist.
Reine Markdown-Kapitel mit YAML-Kopf und Materialdateien bleiben unverändert.
Der Formatter wandelt nur unkomplizierte Textabsätze und Überschriften in
Markdown um; interaktives HTML bleibt intakt.

## Neue Texte, Unterkapitel und Bilder

In einer bestehenden Kapiteldatei innerhalb von div class=kapitel-body einfügen:

    <!-- MD:START -->
    ## Eine neue Zwischenüberschrift

    Ein neuer Absatz mit **Fettdruck** und [einem Link](https://example.org).

    ![Beschreibung des Bildes](grafiken/perzeptron.svg)
    <!-- MD:END -->

Die Bilddatei gehört nach projekt/grafiken. Die Bildpfade sind relativ zur
generierten Projektseite. ### erzeugt eine untergeordnete Überschrift.

## Ein ganz neues Kapitel

Ohne HTML- oder Python-Programmierung ein neues Unterkapitel einfügen:

```sh
python scripts/new_chapter.py einstieg --after 030 --nummer 3a --title "Neue Perspektiven" --short "Ein Beispiel genauer betrachten"
make preview
```

Das erzeugt `kursseiten/bok/4-klasse/einstieg/035-neue-perspektiven.md` mit dem passenden YAML-Kopf. Neue Kapitel erscheinen automatisch in der bestehenden Kapitel-Navigation. Mit `--after 030` kommt das Kapitel zwischen die Dateien 030 und 040; ohne `--after` landet es am Ende, vor `999-abschluss.md`. `--nummer` und `--title` sind erforderlich. Bestehende Dateien und stabile Schülerantwort-IDs werden nicht angefasst. Weitere Optionen: `python scripts/new_chapter.py --help`.

Alternativ eine Kapiteldatei von Hand anlegen:

Eine neue Datei z. B. kursseiten/bok/4-klasse/perzeptron/035-vertiefung.md erstellen:

    ---
    type: chapter
    id: perzeptron-vertiefung
    nummer: 3a
    titel: Weitere Beispiele
    kurz: Eine zusätzliche Vertiefung
    open: true
    ---

    Hier steht ein **Absatz** in Markdown.

    ## Unterkapitel

    ![Neuron](grafiken/perzeptron.svg)

Die Kapitelübersicht entsteht automatisch aus allen details.kapitel.

## Wichtige Kompatibilitätsregeln

Bestehende IDs und Datenattribute niemals unbeabsichtigt ändern:
id, data-answer, data-journal, data-check, data-score, data-lab, data-topic,
data-choose usw. Sie verknüpfen Schülerantworten mit der ZIP-Sicherung und
Notebook-Buttons mit den unveränderten Originalnotebooks.
Neue interaktive Formulare brauchen neue eindeutige data-answer-IDs.

Bestehende HTML-Fragmente sind bewusst nicht automatisch in Markdown umformatiert.
Das ist ein verlustfreier erster Migrationsschritt, damit auch Tabellen,
Texteingaben, JavaScript-Interaktionen und heruntergeladene Sicherungen
weiterhin funktionieren. Neue Blöcke und neue Kapitel sind Markdown-fähig.

## Build

    python scripts/build_portal.py
    python scripts/build_course.py
    python tests/check_course.py
    python tests/check_portal_content.py

GitHub Actions baut die Seite beim Push automatisch.

## MVC und lokale Vorschau

Fachliche Texte, Aufgaben und Links werden in `kursseiten/` gepflegt; `projekt/portal.js` enthält nur noch Controller-Logik. Für eine schnelle lokale Vorschau `python scripts/preview.py` ausführen; `--full` baut und startet zusätzlich JupyterLite. Siehe Haupt-README.

## Kursregister, Editor und zusätzliche Lehrpersonen

Im zentralen Register `shared/course-sites.json` verweist `manifest` für jeden Kurs auf den eigenen Pfad `kursseiten/<kürzel>/<stufe>-klasse/manifest.json`. Die Kapiteldateien werden relativ dazu gelesen. Die Lehrpersonenunterlagen (`teacherFiles`) und das Glossar sind im selben Kursordner. Die Einträge in `template/` besitzen keinen Kursregister-Eintrag und sind nicht im Editor auswählbar.

Beim ersten Anlegen wurden die zwei BOK-Kurse sowie IRN 1 und IRN 4 jeweils **1:1 aus den entsprechenden Vorlagen** übernommen. Für neue Lehrpersonen ist der einfache CLI-Einstieg ein eigener leerer Kurs:

```sh
python scripts/add_teacher_course.py MAI 1 "KI entdecken" --accent "#684e9b"
python scripts/course_registry.py
make preview
```

Die Dateien entstehen unter `kursseiten/mai/1-klasse/`. Für eine komplette inhaltliche Vorlagenkopie statt eines leeren Entwurfs ist vor der Veröffentlichung ein separates Kopieren und die Anpassung der Kursregister-Metadaten erforderlich; Vorlagen sollten nicht direkt bearbeitet werden. Ohne Freigabe bleibt die Schülerseite eine Vorbereitungsseite. Der Editor bearbeitet die Dateien des ausgewählten Kurses; weitere Lehrpersonen benötigen weder einen eigenen Worker noch ein zweites Repository.

Die lokalen Generatoren `new_lesson.py` und `new_chapter.py` bearbeiten standardmässig **BOK 4**, alle weiteren Kursvarianten über den Editor. Kapitel-IDs können zwischen verschiedenen Kurskopien gleich sein, dürfen sich **innerhalb eines Kurses** aber nicht überschneiden. Für vorhandene gespeicherte Antworten die IDs nicht ändern.

[Mehrkurs-Architektur und Sicherheitsgrenzen](../docs/MULTIKURS-DEPLOYMENT.md)
