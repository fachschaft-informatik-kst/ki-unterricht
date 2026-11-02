# Unterrichtsinhalte bearbeiten

Diese Dateien sind die Quellen der Kursseite. HTML und der vollständige Markdown-Unterrichtsplan werden unter `_build/site/projekt/` erzeugt und **nicht** in Git versioniert.

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

Das erzeugt `kursseiten/einstieg/035-neue-perspektiven.md` mit dem passenden YAML-Kopf. Neue Kapitel erscheinen automatisch in der bestehenden Kapitel-Navigation. Mit `--after 030` kommt das Kapitel zwischen die Dateien 030 und 040; ohne `--after` landet es am Ende, vor `999-abschluss.md`. `--nummer` und `--title` sind erforderlich. Bestehende Dateien und stabile Schülerantwort-IDs werden nicht angefasst. Weitere Optionen: `python scripts/new_chapter.py --help`.

Alternativ eine Kapiteldatei von Hand anlegen:

Eine neue Datei z. B. kursseiten/perzeptron/035-vertiefung.md erstellen:

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

## Zwei Kurse aus einer Codebasis

- **4. Kurzgymnasium (Vertiefung):** `kursseiten/manifest.json`, Kursseite `/projekt/` (historischer Speicher- und Notebook-Stand bleibt erhalten).
- **1. Kurzgymnasium (Basis):** `kursseiten/basis-manifest.json`, zehn Doppellektionen in `kursseiten/basis-*/`, Kursseite `/basis/`.
- **Kursauswahl:** `/kurse.html`; die ursprüngliche Start-URL führt weiterhin zum vertieften Kurs, um bestehende Links nicht zu brechen.
- **Editor:** Gemeinsamer GitHub-Editor unter `/projekt/admin/`; dort vor dem Bearbeiten den Kurs auswählen. Neue Bereiche des Basiskurses erhalten den Präfix `basis-`.
- **Gemeinsam:** CSS, Grafiken, Kapitelrenderer und AVIVA-Validierung. Separate Notizen des Basiskurses nutzen `kst-ki-basis-v1`; der bisherige Portal-, Journal- und Notebook-Speicher bleibt unangetastet.

Build und Vorschau erzeugen beide Seiten: `python scripts/build_portal.py && python scripts/build_course.py && python scripts/build_basis.py` bzw. `make preview`.
Für einen lokalen Volltest: `make test`. Der CI-Browsercheck testet zusätzlich Kurswahl, Regler sowie Notizen beim erneuten Öffnen.

**Didaktische Trennung:** Der Basiskurs ist eine angeleitete Bildklassifikation mit unkritischen Gegenständen und Testbildern; die 4. Klasse arbeitet weiterhin mit selbstständiger Evaluation, Notebook-Projekt und Fachgespräch. Teachable Machine ist ein externer Dienst: vor der Verwendung schulische Datenschutzregeln beachten; keine Gesichter oder persönlichen Daten hochladen.
