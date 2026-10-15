# Unterrichtsinhalte bearbeiten

Diese Dateien sind die Quellen der Kursseite. projekt/index.html wird beim Build erzeugt.

Die Bereiche einstieg, lernarten, perzeptron, netze, projekt, sprache und gesellschaft
entsprechen den Doppellektionen 1–10; projekt umfasst Doppellektionen 5–8.
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
