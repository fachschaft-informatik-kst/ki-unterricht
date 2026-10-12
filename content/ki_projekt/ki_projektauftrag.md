# KI-Tandemprojekt: Was hat unser Netz gelernt?

**Informatik · 4. Gymiklasse · Tandemarbeit · Abgabe und individuelles Fachgespräch**

## Ziel und Produkt

Entwickeln Sie im Tandem eine Bildklassifikation für einen selbst gewählten Anwendungsfall. Wählen Sie zwei bis vier Klassen aus dem [Ideenpool mit zwölf Themen](ki_ideenpool.md) oder schlagen Sie ein eigenes Thema vor. Sammeln Sie eigene Fotos, trainieren Sie ein kleines neuronales Netz und untersuchen Sie eine Veränderung kontrolliert. Beurteilen Sie die Erkennung neuer Gegenstände oder Personen.

Die Bildaufbereitung ist vorbereitet: Ein eingefrorenes, vortrainiertes MobileNet liefert 1280 Bildmerkmale. Darauf trainieren Sie Ihr eigenes kleines Netz. Ihre Eigenleistung besteht aus Fragestellung, Datenplan, begründetem Versuch, Auswertung und kritischem Urteil. Eine hohe Trefferquote allein führt nicht zu einer besseren Bewertung.

## Materialien und Reihenfolge

1. **[Lernlabor](ki_lernlabor.ipynb):** Im Unterricht den Ablauf an ausdrücklich synthetischen Demodaten kennenlernen (ca. 20–30 Minuten).
2. **Fotostudio:** Über die Downloadzelle im Projektjournal herunterladen, lokal öffnen und eigene JPG/PNG-Bilder verarbeiten. [Anleitung zur Datensammlung](ki_fotodaten.md).
3. **[Projektjournal](ki_tandemprojekt.ipynb):** Während der Arbeit ausfüllen; es ist Ihre Dokumentation und Abgabe.

Die Dateien `ki_projekt_tools.py`, `ki_foto_tools.py`, `fotostudio.html`, `fotostudio_core.js` und `foto_uebungsdaten.json` bleiben neben dem Fotojournal. In der JupyterLite-Umgebung werden sie zusammen mit den Materialien bereitgestellt. Eingeklappte Startzellen laden die vorhandenen Pyodide-Pakete. Kein zusätzlicher Server oder ML-Account nötig.

## Sechs Projektphasen

| Phase | Ihre Aufgabe | Kontrollpunkt |
|---|---|---|
| 1. Anwendung | Klassen, Einsatz und Fragestellung wählen | Ist die Frage konkret und prüfbar? |
| 2. Daten | Aufnahmeregeln festhalten, Daten prüfen, Objekt-/Personengruppen vorab aufteilen | Lehrperson prüft Datenplan und Aufteilung |
| 3. Ausgangsmodell | Vorgegebenes Netz trainieren, Vorhersagen und Fehler untersuchen | Mindestens zwei konkrete Beobachtungen |
| 4. Untersuchung | Einen Weg wählen, Vermutung festhalten und A/B vergleichen | Versuchsplan **vor** dem Training festhalten |
| 5. Abschlusstest | Modellwahl anhand der Validierung begründen, dann Test freigeben | Lehrperson bestätigt die Auswahl |
| 6. Urteil | Frage beantworten, Grenzen und nächste Schritte benennen | Aussagen mit Ergebnissen belegen |

Jede Phase folgt dem Muster **Frage → Vermutung → Experiment → Beleg → Schlussfolgerung**. Füllen Sie die Felder vor beziehungsweise nach dem jeweiligen Versuch aus, nicht erst rückblickend am Ende.

## Wählen Sie eine Untersuchung

| Weg | Frage | Unterschied zwischen A und B | Konstant halten |
|---|---|---|---|
| `menge` | Helfen mehr Trainingsbilder? | 12 bzw. 48 Bilder pro Klasse | Gruppenpool, Netz, Trainingseinstellungen, Validierungsbilder |
| `vielfalt` | Helfen mehr verschiedene Exemplare / Personen? | Zwei bzw. vier Trainingsgruppen | 24 Bilder pro Klasse, Netz, Trainingseinstellungen, Validierungsbilder |
| `netz` | Hilft ein grösseres Netz? | 8 bzw. 48 versteckte Neuronen | Exakt gleiche Trainingsbilder, Trainingseinstellungen, Validierungsbilder |

Ein sauber dokumentierter Weg ist Pflicht. Die Einstellungen sind Ausgangswerte und dürfen **vor dem Vergleich** begründet angepasst werden. Drei vorher festgelegte Läufe zeigen Schwankungen; berichten Sie alle, nicht nur den besten. Ein optionaler weiterer Versuch muss getrennt dokumentiert und vor dem Abschlusstest durchgeführt werden.

## Datensammlung vor Projektbeginn

Reichen Sie vor der Sammlung einen kurzen Steckbrief mit Anwendung, Klassen, Forschungsfrage und Probebildern ein. Standard sind eigene Fotos. Internetbilder sind eine begründete Ausnahme; Quellen und Nutzungsbedingungen dokumentieren, Duplikate vermeiden.

Planen Sie acht Datengruppen mit je zwölf Bildern pro Klasse (192–384 Bilder). Bei Gegenständen bezeichnet eine Gruppe je ein eigenständiges Exemplar pro Klasse, bei Gesten eine Person. Vier Gruppen trainieren, zwei validieren, zwei testen. Ein Gegenstand oder eine Person darf nicht mehreren Gruppen zugeordnet werden. Mehrere Fotos derselben Flasche ersetzen keine unterschiedlichen Flaschen.

[Die Datenanleitung](ki_fotodaten.md) erklärt Gruppen, Bildimport, Speicherung und typische Fehler. Das Fotostudio vereinheitlicht die Bildgrösse automatisch. Kontrollieren Sie die Vorschau. Originalfotos und JSON-Dateien regelmässig sichern.

**Übung und Ersatz:** `UEBUNG` im Journal lädt synthetische geometrische Formen mit echten MobileNet-Merkmalen. Bei vereinbarten Ersatzprojekten `ERSATZ` verwenden, die Frage auf diese Formen begrenzen und die Herkunft offenlegen. Das ist keine empirische Untersuchung echter Fotos. Die Lehrperson bewertet die Datenkritik anstelle einer nicht erbrachten Fotosammlung anhand derselben transparenten Kriterien.

## Zeitplan

| Termin | Schwerpunkt | Ergebnis |
|---|---|---|
| 08.12.2026 | Klassen und Aufnahmeregeln festlegen; Sammlung organisieren | Eigene Sammlung bis 15.12. |
| 15.12.2026 | Anwendung, Datenprüfung, Ausgangsmodell | Funktionierender erster Versuch |
| 05.01.2027 | Kontrollierter Vergleich | Ergebnisse und Interpretation |
| 12.01.2027 | Abschlusstest, Urteil, Abgabe vorbereiten | Vollständiges Journal und gesicherte Dateien |
| 19.01.2027 | Abgabe und Fachgespräch laut Terminplan der Lehrperson | Individuelles Verständnis zeigen |

Für grössere Klassen müssen Fachgespräche über mehrere Termine verteilt werden. Die Lehrperson legt einen für alle gleichen Abgabestand vor Beginn der bewerteten Gespräche fest.

## Abgabe und Bewertung

Abzugeben sind das **ausgefüllte Projektjournal mit Ausgaben**, die Originalfotos, eine Gruppenliste mit Quellen, die Fotostudio-JSON-Daten und das exportierte Versuchsprotokoll. Keine zusätzliche lange Dokumentation erforderlich. Beide Personen sollen das ganze Projekt erklären können. Verwendete Quellen, KI-Hilfen und die Aufgabenteilung im Journal angeben.

| Bereich | Anteil | Gute Leistung zeigt sich durch … |
|---|---:|---|
| Fragestellung und Daten | 15 % | klare Anwendung, sinnvolle Klassen, begründete Datenwahl und saubere Aufteilung |
| Experiment | 20 % | prüfbare Vermutung, kontrollierter Vergleich, nachvollziehbare Einstellungen und alle Läufe |
| Auswertung und Reflexion | 25 % | korrekte Interpretation, konkrete Fehleranalyse und ehrliche Grenzen |
| Individuelles Fachgespräch | 40 % | eigene Erklärungen und Übertragung auf neue Beispiele |

Die ersten drei Bereiche sind Tandemleistungen. Im Gespräch werden beide individuell beurteilt. Auch eine nicht bestätigte Vermutung oder ein schwaches Modell kann bei sorgfältiger Untersuchung eine gute Leistung sein. Kleine Stichproben und wenige Objekt-/Personengruppen begrenzen Ihre Schlussfolgerungen. Nach dem Abschlusstest nicht weiter optimieren und denselben Test erneut als unabhängig ausgeben.
