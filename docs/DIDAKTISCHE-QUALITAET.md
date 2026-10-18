# Redaktionsprüfung für KI-erzeugte Unterrichtsinhalte

Die automatischen Prüfungen kontrollieren Dateiformat, Zeitbudget, eindeutige IDs,
Pflichtfelder, Ergebnisse und sichtbare individuelle Sicherung. **Ein grüner
Build ist kein Nachweis fachlicher oder didaktischer Qualität.**

## Prüfraster vor Merge

1. **Lernziel und Ausrichtung:** Ist das Lernziel beobachtbar? Erzeugen die
   Pflichtaufgaben tatsächlich Evidenz für dieses Lernziel?
2. **Fachliche Korrektheit:** Stimmen Beispiele, Rechnungen und Begriffe?
   Wurde insbesondere zwischen Modellvorhersage und Wahrheit unterschieden?
3. **Kognitive Belastung und Zeit:** Lassen sich die Pflichtaufgaben mit einer
   durchschnittlichen Klasse in 90 Minuten ausführen? Gibt es klare Pflicht-
   und Vertiefungsaufgaben sowie Puffer für Notebook-Starts?
4. **Vorwissen und Lernweg:** Baut die Lektion auf tatsächlich eingeführten
   Begriffen auf? Sind Instruktion, Anwendung und Sicherung verständlich?
5. **Ergebnissicherung:** Formuliert jede Person (ausser SOL DL 5–8) am Ende
   eine eigene Antwort zur Leitfrage, die Lehrperson überprüfen kann?
6. **Differenzierung:** Gibt es bei technischen Hindernissen einen analogen
   Ersatzweg und für schnelle Gruppen eine freiwillige Vertiefung?
7. **Bestandsdaten:** Bleiben Kapitel-IDs, Antwort-Schlüssel, Notebook-Pfade
   und ZIP-Schema erhalten? Sind Änderungen an diesen Verträgen explizit geprüft?
8. **Schülersicht und Zugänglichkeit:** Ist die Aufgabe aus Sicht der Lernenden
   eindeutig, lesbar und ohne Lehrpersonenerklärungen ausführbar?

Die prüfende Person dokumentiert unklare Punkte im Pull Request.
KI kann dieses Raster als Zweitmeinung verwenden, aber weder die fachliche
Freigabe noch den Praxistest ersetzen.

## Regelfall bei KI-Erweiterungen

Erst Quellen und die bereits vorhandenen Unterrichtsziele lesen, dann nur
betroffene Lektionen/Unterkapitel ändern. Einen PR erstellen, CI vollständig
abwarten, Diff von Aufgaben, Formularschlüsseln, CSS und Bibliotheken prüfen
und bei grösseren Änderungen eine Unterrichtsvorschau im Browser durchführen.
