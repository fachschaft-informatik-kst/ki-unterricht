# Notebookregistrierung

`registry.json` ist die gemeinsame Liste für Notebook-Build und Portal-Controller.
Jeder Eintrag enthält `source` (Pfad relativ zu `content/`) und `title`.
Genau ein Eintrag markiert das Projekt mit `project: true`.

Für ein zusätzliches Experiment:

1. Originalnotebook unter `content/` anlegen.
2. In der Registrierung eintragen; der Dateiname muss global eindeutig sein.
3. Im gewünschten Kapitel einen Notebook-Schalter nach vorhandenem Muster mit
   `data-lab="<dateiname>.ipynb"` ergänzen.
4. `make build` ausführen und Notebook sowie ZIP-Sicherung prüfen.

Die eingebetteten Fassungen entstehen ausschliesslich unter `_build/content/portal/`.
Bestehende Dateinamen nicht ändern: Sie sind Schlüssel gespeicherter Notebookstände.
