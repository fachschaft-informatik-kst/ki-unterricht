# Word-Dokumente für Lernende

Ein `.docx` je Doppellektion und AVIVA-Phase (`DLxx_<phase>_<Name>.docx`), dazu
`IRN_1-Klasse_Alle_Dokumente.zip` und das Verzeichnis `dokumente.json`.

**Nicht von Hand bearbeiten.** Neu erzeugen mit:

```sh
make dokumente DOKUMENTE_KURS=irn/1-klasse
```

Quelle in der 4. Klasse sind die Materialkoffer-Texte `kursseiten/<bereich>/materialien.md`,
in der 1. Klasse die Schüleraufträge der AVIVA-Pläne `kursseiten/<bereich>/planung.json`
(mit den Grafiken aus dem Materialkoffer). Lehrpersonenhinweise, Selbstkontrollen und Lösungen
werden weggelassen. Im geschützten Lehrpersonenbereich erscheinen die Dokumente im
Materialkoffer, in der AVIVA-Planung und gesammelt unter «Alle Dokumente».
