# Notebookregistrierung

`registry.json` ist die gemeinsame Liste für Notebook-Build und Portal-Controller.
Jeder Eintrag enthält `source` (Pfad relativ zu `content/`) und `title`.
Genau ein Eintrag markiert das Projekt mit `project: true`.

Für ein zusätzliches Experiment:

1. Originalnotebook unter `content/` anlegen.
2. In der Registrierung eintragen; der Dateiname muss global eindeutig sein.
3. Im gewünschten Unterkapitel den **gemeinsamen Notebook-Baustein** ergänzen,
   nicht mehr einen alleinstehenden `data-lab`-Button oder JupyterLite-Link:

   ```html
   <div class="ki-notebook-block" data-notebook="content/beispiel.ipynb" data-title="Mein Python-Labor">
     <h3>Jupyter-Notebook · Mein Python-Labor</h3>
     <p>Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.</p>
     <button type="button" class="ki-notebook-launch" data-lab="beispiel.ipynb">Notebook hier öffnen</button>
   </div>
   ```

   Im Lehrpersonen-Editor wird dieser Baustein beim Hinzufügen automatisch erstellt.
   Für den Basiskurs verwendet der Editor die passende `basis_*.ipynb`-Vorlage;
   bei registrierten Kursnotebooks übernimmt der vorhandene Controller weiterhin
   die Browser- und ZIP-Speicherung.
4. `make build` ausführen und Notebook sowie ZIP-Sicherung prüfen.

Die eingebetteten Fassungen entstehen ausschliesslich unter `_build/content/portal/`.
Bestehende Dateinamen nicht ändern: Sie sind Schlüssel gespeicherter Notebookstände.
