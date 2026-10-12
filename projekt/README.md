# Projektseite

`index.html` ist die statische Übersicht für Lernende. Keine externen Bibliotheken, Fonts, Cookies oder Analysewerkzeuge. Persönlicher Seitenstand liegt in `localStorage` und lässt sich als JSON exportieren/importieren; er ist unabhängig von Notebook und Fotostudio.

Der bestehende GitHub-Pages-Workflow baut JupyterLite und kopiert diese Seite nach `dist/projekt/index.html`. URL nach Merge/Deployment:
https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/

Die Notebooklinks sind relativ (`../lab/index.html?path=ki_projekt/...`). Auf einer lokalen Vorschau ohne JupyterLite-Build sind die Zielnotebooks nicht verfügbar.

Inhalte basieren auf den drei Markdown-Unterlagen unter `content/ki_projekt/`. Termine, Klassenanzahl, Versuchsparameter und die Gewichtung 15/20/25/40 müssen bei Änderungen in beiden Darstellungen konsistent gehalten werden. Das neue Kompetenzraster konkretisiert die vorhandenen Lernziele; es führt keine eigene Notenformel ein.

Browserprüfung: `npm install --no-save playwright`, `npx playwright install chromium`, danach `node tests/check_projekt_page.cjs`. Alternativ mit installiertem `playwright-core` und `CHROMIUM_PATH` auf eine lokale Chromium-Datei. Der Test verwendet einen lokalen HTTP-Server, prüft Navigation, Filter, Fortschritt, Export/Import, Mobilansicht und Darstellung ohne JavaScript. Screenshots liegen im temporären Verzeichnis, das der Test ausgibt.
