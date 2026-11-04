# Gemeinsame Portaltechnik

Dieser Ordner enthält nur die gemeinsame HTML-Schablone, CSS, Browsercontroller
und den Lehrpersonen-Editor. Die Grundlagenvariante liegt in `../basis/`.

Kapitel, Planungen, Glossare, Notebooks, Python-Hilfen, Fotostudio, Bilddaten,
Arbeitsblätter und Projektgrafiken gehören ausschliesslich in die jeweilige
Kurswurzel unter `../../kurse/`. Der Build kopiert die Technik und ergänzt die
Quellen des gewählten Kurses; keine Kursausgabe dient als Quelle eines anderen
Kurses.

Nach Änderungen an CSS oder HTML-Schablonen:

```sh
python scripts/sync_editor_preview.py
```

Den Befehl aus dem Repository-Root ausführen. Die eingebettete Editorvorschau
muss dieselben Stile und dieselbe Seitenstruktur wie die Kursseiten verwenden.

Siehe [Architektur](../../docs/ARCHITEKTUR.md) und
[Lehrpersonen-Editor](../../docs/ADMIN-EDITOR.md).
