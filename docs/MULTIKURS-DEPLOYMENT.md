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

## Farbthemen im Editor

Unter **Farbthemen der Kursseiten** lassen sich unabhängig von den BOK-Inhaltskursen
alle vier Kursplätze auswählen. Über den Farbwähler wird die Akzentfarbe eingestellt;
helle Hintergründe und Linien werden daraus automatisch abgeleitet. So bleiben
Lesbarkeit und Gestaltung einheitlich. Die Änderungen werden über **Farbänderung
vormerken** und danach **Pull Request erstellen** eingereicht. Sie betreffen
`shared/course-sites.json`; der bestehende Worker erlaubt ausdrücklich nur diese
validierte Konfigurationsdatei und prüft die Farbkontraste.

Die beiden IRN-Kursplätze sind eigene Vorbereitungsseiten mit eigenen Farben,
**noch keine vollständigen Inhaltseditoren**. Sie erhalten keine Kopien der BOK-
Unterrichtsinhalte. Erst eine spätere Kursquell-Migration schafft getrennte
Kapitel- und Notebook-Bearbeitung für IRN.

## GitHub-Anmeldung für Lehrpersonenmaterial

**Die Schüler-Kursseiten bleiben öffentlich** und benötigen keinen GitHub-Login.
Musterlösungen, AVIVA-Planung und Materialkoffer sind dagegen nur unter den
geschützten Worker-Adressen `/teacher/bok/1-klasse/{planung,materialien,musterloesungen}`
und `/teacher/bok/4-klasse/{planung,materialien,musterloesungen}` erreichbar.
Ohne gültige Sitzung erfolgt eine Weiterleitung zur GitHub-Anmeldung.
Der Worker verlangt eine bestehende Schreibberechtigung für das Repository.
Die fachlichen Daten liefert er aus explizit zugelassenen Quelldateien,
nicht aus einer öffentlich erreichbaren GitHub-Pages-Kopie.

`scripts/protect_teacher_pages.py` entfernt aus der Pages-Veröffentlichung
`unterrichtsplan.html`, `materialien.html`, `musterloesungen/`,
`KI_Planung.md`, den vollständigen AVIVA-Gesamtexport `kurs.json` und gekennzeichnete Lösungs-/Bewertungsdateien. Die Links
der Schüler-Kursseiten werden auf den Worker umgestellt. Diese Bereinigung
erfolgt **erst nach den Inhaltstests**, damit die bestehenden Prüfungen der
generierten AVIVA- und Materialseiten weiterhin möglich bleiben.

**Sicherheitsgrenze:** Das GitHub-Repository ist weiterhin öffentlich.
Die Originaldateien in `lehrperson/`, `kursseiten/*/planung.json`,
`kursseiten/*/materialien.md` sowie ältere Commits können deshalb über
GitHub direkt gelesen werden. Die Worker-Anmeldung schützt damit den
**Zugriff auf die Kurswebsite**, nicht die Vertraulichkeit der Quellinhalte.
Für einen tatsächlichen Geheimhaltungsschutz müssen die Lehrpersonenquellen
in ein privates Repository oder einen privaten Speicher umziehen und die
öffentliche Git-Historie geprüft werden. Allein `noindex`, fehlende Links
oder GitHub OAuth am Worker reichen dafür nicht aus.


## Kursauswahl in den geschützten Lehrpersonenansichten

AVIVA-Planung, Materialkoffer und Musterlösungen bieten oben eine gemeinsame
**Kursauswahl**. Das Dropdown zeigt alle vier registrierten Kurse mit Lehrperson,
Klasse und Kurstitel. BOK 1. Klasse und BOK 4. Klasse sind wählbar und beziehen
ihre Materialien getrennt aus den jeweiligen Quellen. Die beiden IRN-Kursplätze
stehen sichtbar als **«in Vorbereitung»**, sind aber deaktiviert: Sie besitzen
noch keine eigenen AVIVA-Quellen, Kapitel oder Musterlösungen und dürfen nicht
versehentlich BOK-Inhalte übernehmen.

Beim Kurswechsel bleibt die gewählte Materialart (AVIVA / Materialkoffer /
Musterlösungen) erhalten, die Doppellektion wird bewusst auf **DL 01** gesetzt.
Beim Wechsel zwischen diesen Materialarten innerhalb desselben Kurses bleibt
dagegen die ausgewählte Doppellektion bestehen. Der aktuelle Kurs wird im
Kopfbereich und der seitlichen Unterrichtsübersicht genannt. Das Akzentfarbthema
kommt aus \`shared/course-sites.json\` und wird auch im geschützten Bereich
verwendet. Der GitHub-Login und die Berechtigungsprüfung erfolgen weiterhin
im bestehenden Cloudflare Worker.
