# Word-Dokumente für Lernende

Ein `.docx` je Doppellektion und AVIVA-Phase (`DLxx_<phase>_<Name>.docx`), dazu
`IRN_4-Klasse_Alle_Dokumente.zip` und das Verzeichnis `dokumente.json`.

**Nicht von Hand bearbeiten.** Die Dateien werden aus den Materialkoffer-Texten
`kursseiten/<bereich>/materialien.md` erzeugt:

```sh
make dokumente
```

Lehrpersonenhinweise (abgesetzte Kästen), Selbstkontrollen und Lösungen werden
dabei weggelassen; weitere kursspezifische Anpassungen stehen in
`scripts/build_student_documents.py` (`EDITS`). Im geschützten Lehrpersonenbereich
erscheinen die Dokumente oben rechts in jeder Phase des Materialkoffers und
gesammelt unter «Alle Dokumente».
