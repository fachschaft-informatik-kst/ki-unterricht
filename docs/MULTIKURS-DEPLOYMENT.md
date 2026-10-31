# Mehrkurs-Website: gemeinsame Veröffentlichung

## Architekturentscheidung

**Ein Repository, ein GitHub-Pages-Deployment und ein bestehender Cloudflare Worker
für den geschützten Lehrpersonen-Editor.** Es werden ausdrücklich **keine**
zusätzlichen Workers, Cloudflare-Pages-Projekte oder DNS-Router benötigt.

Der vollständige statische Build wird nach erfolgreichen Tests als **ein einziges
GitHub-Pages-Artefakt** veröffentlicht. Vier eindeutige Kurs-URLs bleiben
unabhängig voneinander navigierbar; ihre Bereitstellung ist jedoch gemeinsam.
Kurs-URL-Trennung ist **keine** separate Deployment- oder Berechtigungstrennung.

| Lehrperson | Klassenstufe | URL nach `/ki-unterricht/` | Stand |
| --- | --- | --- | --- |
| BOK | 1. Klasse | `bok/1-klasse/` | Bisheriger Basiskurs |
| BOK | 4. Klasse | `bok/4-klasse/` | Bisheriger vertiefter Kurs |
| IRN | 1. Klasse | `irn/1-klasse/` | Platzhalter ohne Unterrichtsinhalte |
| IRN | 4. Klasse | `irn/4-klasse/` | Platzhalter ohne Unterrichtsinhalte |

Die Kursauswahl unter `/ki-unterricht/kurse.html` zeigt alle vier Kursplätze
und kennzeichnet IRN ausdrücklich als **in Vorbereitung**. Die Repository-
Startadresse führt zur Kursauswahl. Der bisherige Kurs unter `/basis/` und
`/projekt/` bleibt weiterhin erreichbar, auch für direkte Lesezeichen.

## Wie der aktuelle Feature-Branch funktioniert

1. `shared/course-sites.json` registriert vier eindeutige Kurs-IDs und Pfade.
2. Die unveränderten BOK-Quellen werden zunächst wie bisher für `/basis/` und
   `/projekt/` gebaut; `scripts/build_course_routes.py` ergänzt die neuen
   URLs im **selben** Build-Artefakt.
3. Relative Links werden für die zusätzliche URL-Ebene angepasst, insbesondere
   für die gemeinsam genutzte JupyterLite-Laufzeit unter `/lab/`.
4. IRN erhält eigene Platzhalterseiten **ohne** kopierte BOK-Inhalte.
5. GitHub Actions validiert beide vorhandenen Unterrichtskurse und alle vier
   Kurs-URLs; erst ein Merge nach `main` würde das reguläre gemeinsame
   GitHub-Pages-Deployment auslösen.

Die Aliase sind eine **vorsichtige Übergangslösung**, keine vollständige
Migration der Inhaltsdateien. Es werden keine bestehenden Browser-Speicher-
schlüssel, Notebook-IDs oder ZIP-Dateiformate umbenannt, damit die vorhandenen
Schülerstände weiter zugänglich bleiben.

## Wie künftige Kurse getrennt werden

Sobald IRN eigene Inhalte bearbeitet, braucht jeder der vier Kurse einen
eigenen Quellordner, ein eigenes Manifest, AVIVA-Pläne, Bilder und Notebooks.
Build-Skripte müssen dann die explizite Kurs-ID nutzen und Dateien nur aus
dem jeweiligen Quellbereich lesen. IDs, Browser-Speicherschlüssel und
Notebook-Namensräume neuer Kurse müssen eindeutig sein. **Gemeinsame**
Komponenten (Renderer, Bausteine, JupyterLite-Engine) werden zentral gepflegt.

Für den bestehenden **einen** Cloudflare Worker sind eine Kursauswahl,
serverseitig geprüfte erlaubte Quellpfade und kursbezogene Pull Requests
vorzusehen. Die aktuelle Editor-Anmeldung kennt bislang nur Basis/Vertiefung,
noch keine vier unabhängigen Lehrpersonen-Kurse; die IRN-Platzhalter sind
deshalb noch nicht bearbeitbare vollständige Kurse. CODEOWNERS/Reviews
verbessern die Zusammenarbeit, sind aber keine strikte GitHub-
Ordnerberechtigung. Eine solche lässt sich mit einem gemeinsamen Repository
nicht vollständig erzwingen.

## Deployment und Tests

`.github/workflows/deploy.yml` bleibt der **einzige** Website-Deploy-Workflow:
ein Build, Tests und ein Pages-Upload. Ein fehlgeschlagener Test blockiert die
neue **gesamte** Veröffentlichung; die zuletzt erfolgreich veröffentlichte
Version bleibt erreichbar. Bei Änderungen an gemeinsamen Bausteinen werden
beide bestehenden BOK-Kurse und künftig alle vier echten Kurse getestet.

Die Nutzung separater GitHub-Pages-/Cloudflare-Projekte ist **nicht**
Bestandteil der empfohlenen Architektur. Eine echte unabhängige Veröffentlichung
wäre eine neue, ausdrücklich zu entscheidende Anforderung, nicht ein
versteckter Nebeneffekt der vier URLs.

**Status:** Dies ist ein Feature-Branch für die URL- und Übersichtsgrundlage.
Keine Änderungen sind durch diesen PR bereits auf `main` veröffentlicht.
