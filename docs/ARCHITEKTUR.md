# Architektur und Redaktionskonzept

## Was es bereits gibt

Das Repository umfasst **eine statische Unterrichtsanwendung plus fünf originale Jupyter-Notebooks und ergänzende Arbeitsblätter**. Die Web-App bleibt bewusst ohne Backend: Antworten werden im Browser gehalten und über ein ZIP gesichert. Das ist kein Lernmanagementsystem mit Nutzerkonten oder serverseitiger Speicherung.

| Bereich | Derzeitige Quelle | Erzeugt / verwendet |
|---|---|---|
| Lerntexte, Aufgaben, Formulare | \`kursseiten/<bereich>/*.md\` | \`scripts/build_portal.py\` |
| Kursgerüst | \`projekt/index.template.html\` | \`projekt/index.html\` |
| Unterrichtsplanung (AVIVA) | \`projekt/kurs.json\` | \`projekt/unterrichtsplan.html\`; AVIVA-Teile in \`projekt/index.html\` und \`worksheets/md/KI_Planung.md\` |
| Lehrpersonenmaterial | \`lehrperson/*.md\` | \`projekt/materialien.html\`, \`projekt/musterloesungen/index.html\` |
| Laufzeit-App / ZIP-Sicherung | \`projekt/*.js\`, \`projekt/*.css\`, \`extensions/\` | GitHub Pages \`dist/projekt/\` |
| Notebook-Quellen | \`content/*.ipynb\`, \`content/ki_projekt/\` | Generierte JupyterLite-Fassungen unter \`content/portal/\` |
| Arbeitsblätter | \`worksheets/md/\`, \`worksheets/archiv/\` | PDF nur bei Bedarf; separate Fachinhalte |

**Neu:** \`projekt/index.html\` und \`projekt/unterrichtsplan.html\` sind ausschliesslich Build-Ergebnisse. Der Code und die Eingabedaten bleiben in Git; die generierte Website wird aus \`dist/\` über Actions veröffentlicht. \`portal-index.html\` ist weiterhin eine **Quellvorlage** für die Weiterleitung.

## Schon heute: neues Unterkapitel

\`\`\`sh
python scripts/new_chapter.py einstieg --after 030 --nummer 3a --title "Neue Perspektiven"
make preview
\`\`\`

Dabei entsteht eine neue \`kursseiten/einstieg/035-neue-perspektiven.md\`. Sie enthält YAML-Metadaten und einfachen Markdown-Text. Beim Build wird sie nach Dateinummer einsortiert, das Kapitel und die Navigationsstruktur entstehen automatisch. Es sind keine Änderungen an JavaScript oder am Seiten-Template nötig. Die bestehenden \`id\`- und \`data-answer\`-Schlüssel bleiben unverändert.

## Warum eine neue ganze Doppellektion noch nicht so einfach ist

Derzeit bestehen mindestens vier Kopplungen:

1. **Zehn feste Einträge:** \`projekt/kurs.json\` und \`scripts/build_course.py\` validieren zehn Doppellektionen, die Tests prüfen exakt die IDs 01–10. Für ein weiteres Kapitel in einer bisherigen Lektion genügt Markdown; für eine neue Lektion noch nicht.
2. **Unterrichtsbereich ≠ Doppellektion:** \`kursseiten/manifest.json\` definiert Abschnitte wie \`perzeptron\` oder \`projekt\`; die SOL-Phase umfasst gleich vier Doppellektionen. Die Navigation darf nicht einfach jede neue Lektion als neue Abschnitts-ID voraussetzen.
3. **Notebooks und Interaktionen:** Die Notebook-Liste in \`scripts/build_portal_notebooks.py\` ist fest; die App referenziert Notebook-Dateien und Antwort-IDs. Erweiterungen müssen dies explizit berücksichtigen.
4. **Generierter Text in einer Quelldatei:** \`worksheets/md/KI_Planung.md\` enthält einen überschriebenen Bereich zwischen \`<!-- KURSPLAN -->\` und \`<!-- /KURSPLAN -->\`. Auch diese Ausgabe sollte später als eigenes Artefakt erzeugt werden, ohne die Handtexte zu verlieren.

## Ziel: ein Git-basiertes Headless-CMS ohne Server

Für die nächste Phase ist eine **aus Metadaten generierte Unterrichtsstruktur** sinnvoll. Zielbild, noch nicht vollständig umgesetzt:

\`\`\`text
unterricht/
  kurs.yml                # Reihenfolge, Bereichsgruppen, globale Einstellungen
  lektionen/
    01-was-ist-ki/
      lektion.yml          # Ziele, AVIVA-Phasen, Dauer, Materialien
      kapitel/
        010-regeln.md      # Markdown-Inhalt
        020-ki-begriffe.md
      materialien.yml      # Referenzen auf vorhandene Grafiken / Dateien
    02-lernen/
      lektion.yml
      kapitel/
        010-lernarten.md
  gemeinsam/
    journal.md
    bewertung.md
app/
  templates/              # HTML-Seitenlayouts
  assets/                 # gemeinsame Styles, JS und Bilder
notebooks/
  original/               # original bearbeitbare Notebooks
arbeitsblaetter/
  original/
scripts/                  # Renderer, Validierung, Notebook-Generator
dist/                     # nie in Git, nur GitHub Pages
\`\`\`

**Beispiel \`lektion.yml\` (Zielarchitektur, noch kein unterstütztes Schema):**

\`\`\`yaml
id: "11"
titel: "KI sicher beurteilen"
bereich: gesellschaft
dauer_minuten: 90
ziel: "Behauptungen, Belege und Risiken unterscheiden"
kapitel:
  - 010-beispiele.md
  - 020-einordnen.md
ablauf:
  - phase: Ankommen
    minuten: 5
    schritte: ["Beispiel diskutieren"]
  - phase: Vorwissen aktivieren
    minuten: 10
    schritte: ["Kriterien sammeln"]
  # Weitere drei AVIVA-Phasen bis total 90 Minuten.
\`\`\`

Dann soll **eine neue Doppellektion** aus einem neuen Ordner mit \`lektion.yml\` und Markdown-Dateien entstehen – ohne eigene HTML-, JavaScript- oder Python-Anpassung. Der Renderer erzeugt Kapitelnavigation, Unterrichtsplan, Lehrpersonenmaterial und die benötigten Seiten automatisch. Ein Schema prüft eindeutige IDs, 90 Minuten AVIVA, gültige Bilddateien und Notebook-Verweise.

## Empfohlene weitere Etappen

**Etappe A – abgeschlossen in diesem PR:** Generierte HTML-Seiten von Git entkoppeln, die vorhandene Build-Reihenfolge beibehalten und ein sicheres Werkzeug zum Hinzufügen neuer Unterkapitel bereitstellen.

**Etappe B:** Planung aus der 60-KB-Datei \`projekt/kurs.json\` in je eine \`lektion.yml\` auslagern, ohne die inhaltlichen IDs oder die bisherige Ausgabe zu verändern. Zusätzlich \`worksheets/md/KI_Planung.md\` in manuell gepflegte Einleitung und generierten Plan aufteilen. Alte Links zunächst über stabile Anker erhalten.

**Etappe C:** Navigation, Lektionenanzahl und Notebook-Registrierung aus einem gemeinsamen Manifest ableiten. Keine harten zehn Lektionen in Tests, Python oder JS; stattdessen strukturierte, datengetriebene Kontrollen.

**Etappe D:** Erst nach bestandenen Browser- und ZIP-Tests Ordner schrittweise umbenennen, veraltete Hilfsskripte entfernen und optional eine Formularoberfläche zur Bearbeitung von \`.yml\` und \`.md\` über Git integrieren. Dafür ist **kein Backend** nötig; man kann zunächst den GitHub-Webeditor verwenden.

**Nicht anfassen ohne Migration:** \`data-answer\`, \`data-journal\`, \`data-check\`, \`data-score\`, Notebooknamen und ZIP-Pfade. Sie gehören zum gespeicherten Schülerstand. Ein Umbau, der die alten IDs verändert, braucht eine explizite und getestete Versionierung/Migration des ZIP-Formats.
