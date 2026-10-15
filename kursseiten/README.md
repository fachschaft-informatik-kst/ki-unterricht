# Unterrichtsinhalte bearbeiten

Diese Dateien sind die Quellen der Kursseite. projekt/index.html wird beim Build erzeugt.

Die Bereiche einstieg, lernarten, perzeptron, netze, projekt, sprache und gesellschaft
entsprechen den Doppellektionen 1–10; projekt umfasst Doppellektionen 5–8.
start, lernziele, journal, bewertung und sicherung sind übergreifende Bereiche.

Dateien beginnen mit 000 (Einleitung), dann 010, 020 usw. (Kapitel), und 999 (Abschluss).
Bestehende Textpassagen können direkt in der jeweiligen Kapiteldatei geändert oder
entfernt werden. Die ursprünglichen HTML-Elemente bleiben zur Kompatibilität erhalten.

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
