# Testbilder: Apfel und Banane

80 Beispielbilder zum Ausprobieren des Bildprojekts, nach Klassen getrennt:

```
testbilder/
  Apfel/   T1/ T2/ V1/ P1/ P2/    je 8 Bilder (ein anderer Apfel pro Gruppe)
  Banane/  T1/ T2/ V1/ P1/ P2/    je 8 Bilder (eine andere Banane pro Gruppe)
  beispielbilder_fotostudio.json  fertige Fotostudio-Sammlung dieser 80 Bilder
```

Die Bilder sind **gezeichnete Illustrationen, keine Fotos**. Lage, Drehung, Grösse, Licht und
Hintergrund variieren; beide Klassen verwenden dieselben Hintergründe.

## Schnell testen (fertige JSON)

Im Versuchsnotebook `MODUS = 'EIGENE_DATEN'` und `KLASSEN = ['Apfel', 'Banane']` setzen,
`beispielbilder_fotostudio.json` im Upload wählen und die Zellen der Reihe nach ausführen.

## Mit dem Fotostudio selbst verarbeiten

Für jede der zehn Mappen (zwei Klassen × fünf Gruppen): Klasse und Datengruppe eintragen, eine Quelle
angeben (zum Beispiel «Illustration»), die 8 Bilder der Mappe wählen und «Auswahl verarbeiten» drücken.
Am Ende «Sammlung herunterladen» und die JSON wie oben im Notebook verwenden.

## Hinweise

- Die beiden Klassen unterscheiden sich stark in Farbe und Form. Hohe Trefferquoten (hier oft 100 %)
  sind daher kein Beweis für ein gutes Modell, sondern zeigen nur, dass der Ablauf funktioniert.
- Für aussagekräftigere Versuche eigene Fotos nach dem Datenplan in `content/ki_projekt/ki_fotodaten.md`
  aufnehmen.

## Neu erzeugen

```
python tests/generate_testbilder.py                               # Bilder
node tests/generate_testbilder_json.cjs                           # JSON (tfjs, mobilenet, @napi-rs/canvas)
python tests/check_testbilder.py                                  # Prüfung
```
