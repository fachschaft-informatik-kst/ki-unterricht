# KI-Unterricht

Webbasierte Unterrichtsplattform für KI an der Kantonsschule Stadelhofen. Sie enthält Kursseiten, AVIVA-Unterrichtsplanung, Materialien, interaktive Python-Notebooks und einen Lehrpersonen-Editor. Die Kurse sind inhaltlich getrennt und nutzen dieselbe technische Plattform.

**Direkt öffnen:** [Kursübersicht](https://fachschaft-informatik-kst.github.io/ki-unterricht/kurse.html) · [Lehrpersonen-Editor](https://kst-ki-admin.kevin-bohn.workers.dev/)

## 1. Überblick

| Kurs | Kursseite | Bearbeitbare Quellen |
| --- | --- | --- |
| BOK · 1. Klasse | [Künstliche Intelligenz](https://fachschaft-informatik-kst.github.io/ki-unterricht/bok/1-klasse/) | `kurse/bok/1-klasse/` |
| BOK · 4. Klasse | [Künstliche Intelligenz](https://fachschaft-informatik-kst.github.io/ki-unterricht/bok/4-klasse/) | `kurse/bok/4-klasse/` |
| IRN · 1. Klasse | [Künstliche Intelligenz](https://fachschaft-informatik-kst.github.io/ki-unterricht/irn/1-klasse/) | `kurse/irn/1-klasse/` |
| IRN · 4. Klasse | [Künstliche Intelligenz](https://fachschaft-informatik-kst.github.io/ki-unterricht/irn/4-klasse/) | `kurse/irn/4-klasse/` |

Jeder Kurs hat eigene Kapitel, Unterrichtspläne, Materialien, Glossare, Musterlösungen und Notebookquellen. Änderungen an einem Kurs verändern die anderen Kurse nicht. Die bisherigen Adressen `/basis/` und `/projekt/` werden nicht mehr als Kursseiten veröffentlicht.

**Notebooks erneut öffnen:** Bereits gestartete Notebooks bleiben auf der geöffneten Kursseite im Arbeitsspeicher, auch beim Schliessen des Notebookfensters oder beim Wechsel zu einem anderen Notebook. Beim erneuten Öffnen wird dieselbe Python-Sitzung angezeigt; Variablen, trainierte Modelle und Uploads bleiben erhalten. Nur der erste Start benötigt die vollständige Vorbereitung. Viele geöffnete Notebooks benötigen entsprechend mehr Arbeitsspeicher. Beim Neuladen oder Verlassen der Kursseite enden diese Sitzungen: Gesicherte Notebookstände bleiben erhalten, Python-Variablen und Modelle müssen danach neu berechnet werden. ZIP-Sicherungen erfassen alle gestarteten, bereiten Kursnotebooks; eine ZIP-Wiederherstellung verwirft die bisherigen laufenden Sitzungen.

## 2. Inhalte im Browser bearbeiten

Für Unterrichtstexte ist keine lokale Entwicklungsumgebung nötig.

1. [Lehrpersonen-Editor öffnen](https://kst-ki-admin.kevin-bohn.workers.dev/) und mit GitHub anmelden. Voraussetzung ist Schreibberechtigung für dieses Repository.
2. Oben **Lehrperson und Klassenstufe** auswählen.
3. Kapitel, AVIVA-Plan, Materialien, Glossar oder Musterlösungen bearbeiten und die Vorschau prüfen.
4. Änderungen als **Pull Request** einreichen. Nach Prüfung und Merge in `main` werden die Kursseiten über GitHub Actions veröffentlicht.

Der Editor bearbeitet ausschliesslich die Quellen des ausgewählten Kurses. Er ist keine Live-Veröffentlichung: Speichern beziehungsweise Einreichen allein aktualisiert die öffentliche Seite noch nicht. Weitere Funktionen und Zugriffsregeln: [Lehrpersonen-Editor](docs/ADMIN-EDITOR.md).

**Wichtig:** Das GitHub-Repository ist öffentlich. Musterlösungen sind über die angemeldete Lehrpersonenoberfläche geschützt, ihre Quelldateien im Repository sind jedoch öffentlich einsehbar. Keine Zugangsdaten oder vertraulichen Schülerdaten einchecken.

## 3. Lokal starten

**Voraussetzungen:** Python 3.12, `make`; für die vollständige Notebookumgebung zusätzlich Node.js 22 und npm. Unterstützt werden Linux, macOS und WSL.

```sh
git clone https://github.com/fachschaft-informatik-kst/ki-unterricht.git
cd ki-unterricht
make preview
```

Danach **http://127.0.0.1:8000/kurse.html** öffnen. Die Vorschau zeigt Kursseiten und Navigation, **ohne ausführbare Python-Notebooks**. Bei Änderungen an Kursquellen wird die HTML-Vorschau automatisch neu erzeugt; im Browser die Seite aktualisieren.

Für die vollständige Anwendung mit JupyterLite, Python-Notebooks und ZIP-Sicherung:

```sh
make
```

Das Makefile richtet `.venv/` und die benötigten Pakete bei Bedarf selbst ein. Der erste vollständige Build kann länger dauern. `Ctrl+C` beendet den lokalen Server.

| Befehl | Wirkung |
| --- | --- |
| `make preview` | Schnelle Vorschau mit automatischem Neuaufbau, ohne Notebooklaufzeit |
| `make` / `make local` | Vollständig bauen und lokal starten |
| `make build` | Vollständige Anwendung nach `dist/` bauen |
| `make serve` | Vorhandenen Build in `dist/` anzeigen |
| `make test` | Vollständigen Build und lokale technische Tests ausführen |
| `make test-browser` | Build und sämtliche Browserprüfungen inklusive Python, Training und ZIP |
| `make test-all` | Technische Tests, alle Notebookausführungen und sämtliche Browserprüfungen |
| `make help` | Alle Makefile-Befehle anzeigen |
| `make clean` | Lokale Builddateien und Umgebung entfernen |

Anderen Port verwenden: `make preview PORT=8080` beziehungsweise `make PORT=8080`. Der Server ist standardmässig nur auf `127.0.0.1` erreichbar.

## 4. Wo liegt was?

```text
kurse/
  bok/1-klasse/             # BOK-Kurs für die 1. Klasse
  bok/4-klasse/             # BOK-Kurs für die 4. Klasse
  irn/1-klasse/             # IRN-Kurs für die 1. Klasse
  irn/4-klasse/             # IRN-Kurs für die 4. Klasse
kurse/_vorlagen/{1,4}-klasse/ # Vorlagen für neue, eigenständige Kurse
shared/course-sites.json   # Kursregister: Pfade, Namen, Status, Farben
shared/basis/              # Gemeinsame Darstellung des Grundlagenkurses
shared/portal/             # Gemeinsame Vorlagen, CSS, Browserlogik und Editor
shared/worksheet-pdf/      # Gemeinsame technische PDF-Vorlage
admin-worker/              # GitHub-Login, geschützter Editor und PR-Erstellung
extensions/ki-autostart/   # Erweiterung für den Notebookstart
scripts/                   # Generatoren, Prüf- und Hilfsskripte
tests/                     # Technische Tests
.github/workflows/         # CI, GitHub-Pages- und Worker-Deployment
```

### Aufbau eines Kurses

Beispiel: `kurse/bok/4-klasse/` – derselbe Aufbau gilt für die anderen Kurse.

```text
kursseiten/
  manifest.json            # Unterrichtsbereiche, Reihenfolge und Navigation
  glossar.json             # Begriffe, Beispiele und Erklärungen
  <bereich>/
    000-*.md               # Kurskapitel (Markdown, bei Bedarf HTML)
    010-*.md               # Weitere Unterkapitel
    planung.json           # Unterrichtslektionen und AVIVA-Phasen
    materialien.md         # Materialien zum Unterrichtsbereich
lehrperson/
  musterloesungen.md       # Lehrpersonenlösungen
  musterloesungen-felder.md
  materialien.md           # Zusätzliche Materialien (4. Klasse)
content/
  *.ipynb                  # Jupyter-Notebooks
  *.py                     # Python-Hilfsprogramme
  img/                     # Abbildungen
  ki_projekt/              # Projektdateien, Fotostudio und Hilfscode
projekt/
  grafiken/                # Eigene Kursgrafiken und Bild-Uploads
experimente/
  registry.json            # Eigene Notebooktitel und Projektzuordnung
worksheets/                # Eigene Arbeitsblattquellen und archivierte Materialien
testbilder/                # Eigene Bilddaten für die Fotoübungen
```

**Kursinhalte nur unter `kurse/<lehrperson>/<klasse>/` bearbeiten.** Es gibt keine Root-Kopien und keine Rücksynchronisation mehr. Unter `kurse/_vorlagen/` liegen die vollständigen Ursprungsdateien zum Kopieren für neue Kurse. Alle Kurse besitzen dieselbe vollständige Ordnerstruktur; spätere Änderungen bleiben kurslokal. Dateien in `_build/` oder `dist/` sind generiert und dürfen nicht manuell bearbeitet werden.

Für Änderungen an Darstellung oder Notebook-Steuerung sind `shared/`, `extensions/` und die zugehörigen Skripte relevant. Die Entscheidung für jeden Root-Ordner ist in [Architektur](docs/ARCHITEKTUR.md) dokumentiert.

Einzelnen Kurs ohne die Quellen anderer Kurse bauen:

```sh
.venv/bin/python scripts/build_course_routes.py _build/einzelkurs --course irn/1-klasse
```

Diese Inhaltsvorschau enthält keine ausführbare JupyterLite-Laufzeit. Der vollständige Build bleibt `make build`. Notebooks und Python-Hilfen werden für **alle** Kurse nach `portal/<lehrperson>/<klasse>/` paketiert. Alte BOK-Notebookadressen bleiben zusätzlich als Kompatibilitätskopien erhalten; Browser-Speicherschlüssel und ZIP-Formate bleiben unverändert.

## 5. Typische Arbeiten

| Ich möchte … | Dort anfangen |
| --- | --- |
| Einen Text oder eine Aufgabe ändern | Editor oder `kurse/<kurs>/kursseiten/<bereich>/*.md` |
| Die Reihenfolge der Unterrichtsbereiche ändern | `kurse/<kurs>/kursseiten/manifest.json` |
| Eine AVIVA-Lektion bearbeiten | Editor oder `kurse/<kurs>/kursseiten/<bereich>/planung.json` |
| Materialien oder Musterlösungen anpassen | Editor oder `kurse/<kurs>/lehrperson/` und `.../kursseiten/<bereich>/materialien.md` |
| Einen Glossarbegriff ändern | Editor oder `kurse/<kurs>/kursseiten/glossar.json` |
| Ein Python-Notebook ändern | `kurse/<kurs>/content/` |
| Layout oder interaktive Funktionen ändern | `shared/portal/`, `shared/basis/` |
| Kursgrafiken oder Bilddaten ändern | `kurse/<kurs>/assets/grafiken/`, `.../testbilder/` |
| Neue Kapitel/Lektionen lokal anlegen | `scripts/new_chapter.py` / `scripts/new_lesson.py`, jeweils mit `--course irn/1-klasse` |
| Einen neuen Kurs anlegen | `scripts/add_teacher_course.py` |

Bestehende Kapitel-IDs, Lektions-IDs und Antwortschlüssel möglichst beibehalten: daran hängen Navigation und gespeicherte Lernendenantworten.

### Neuen Kurs hinzufügen

Eine neue Lehrperson erhält eine eigene Kopie der Vorlage für die entsprechende Klassenstufe:

```sh
python scripts/add_teacher_course.py MAI 1 "Künstliche Intelligenz" --dry-run
python scripts/add_teacher_course.py MAI 1 "Künstliche Intelligenz"
make preview
```

Der neue Kurs wird im Register `shared/course-sites.json` mit dem Status `planned` angelegt. Nach fachlicher Freigabe `status` auf `published` und `source` auf `generated` setzen; alternativ den Kurs direkt mit `--publish` erzeugen. Auch neue Lehrpersonen verwenden den vollständigen Renderer der jeweiligen Klassenstufe mit eigenen Notebookpfaden und Browser-/ZIP-Namensräumen.

## 6. Prüfen und veröffentlichen

**Arbeitsablauf:** Quelltext ändern → Vorschau prüfen → Pull Request erstellen → CI prüfen → nach `main` mergen → GitHub Pages aktualisiert die Website.

- Bei reinen Text-, Planungs- und Glossaränderungen prüft CI insbesondere Kursstruktur, erzeugte Seiten und interne Links; Formulierungen werden nicht mit starren Snapshots verglichen.
- Bei Änderungen am JavaScript, Editor oder der Notebooklaufzeit kommen technische und browserbasierte Prüfungen hinzu.
- Der umfassende JupyterLite-Browsertest mit Training und ZIP-Wiederherstellung läuft bei entsprechenden Runtime-Änderungen nach dem Merge auf `main` oder manuell über **GitHub Actions → Build and Deploy → Run workflow**.
- Der Cloudflare Worker wird separat aktualisiert, wenn seine relevanten Dateien geändert wurden.

Lokal: `make test` für die technischen Prüfungen, `make test-all` für die vollständige Prüfung inklusive aller Notebookausführungen und Browserabläufe. Playwright und Chromium werden beim ersten Browserlauf installiert. Unter Linux können zusätzliche Chromium-Systembibliotheken nötig sein (`npx playwright install-deps chromium`). Die Browserprüfungen laufen bewusst nacheinander, damit sich Python-Kernel und lokale Testserver nicht gegenseitig belasten. Netzwerkzugriff für die Python-Pakete ist erforderlich; ein fehlgeschlagener Test bricht den Lauf mit Fehlerstatus ab.

Die Pipeline liegt in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml); Details zur Architektur stehen in [Mehrkurs-Architektur und Deployment](docs/MULTIKURS-DEPLOYMENT.md).

## 7. Daten der Lernenden

Die Kurswebsite läuft statisch im Browser. Journal, Antworten und Notebookstände werden lokal im verwendeten Browser beziehungsweise in JupyterLite gespeichert. Unter **Notizen & Projekt** können Lernende ihren Stand als ZIP sichern und später wieder importieren. Ein Download ist **keine automatische Abgabe**.

Nach einem Notebookwechsel oder Import werden Python-Variablen und trainierte Modelle im Arbeitsspeicher nicht wiederhergestellt; nötige Codezellen müssen erneut ausgeführt werden. Für die Arbeit an verschiedenen Geräten regelmässig eine ZIP-Sicherung herunterladen.

## Weitere Dokumentation

- [Lehrpersonen-Editor und Anmeldung](docs/ADMIN-EDITOR.md)
- [Kursverwaltung und Veröffentlichung](docs/MULTIKURS-DEPLOYMENT.md)
- [Kursquellen und Vorlagen](docs/KURSVORLAGEN.md)
- [Redaktions- und Datenmodell](docs/ARCHITEKTUR.md)
- [Notebookquellen – Beispiel BOK 4](kurse/bok/4-klasse/content/README.md)
- [Unterrichtsmaterialien – Beispiel BOK 4](kurse/bok/4-klasse/worksheets/README.md)

## Quellenhinweise

Der Lernweg zu Neuron, Lernregel und Trennlinie in den Notebooks «Ein Neuron entscheidet» und «Mehrere Neuronen kombinieren» wurde durch die Lernstrecken «Logische Gatter mit künstl. Neuronen» und «Einzelne Neuronen» von [inf-schule.de](https://inf-schule.de) angeregt (CC BY-SA 4.0; Hürden- und Zaun-Bild, Lernregel in Worten, Trennlinie). Texte, Diagramme und Programme sind eigene Fassungen. Die Grafiken «Programmierung durch Menschen und datengetriebene Programmierung» und «Einteilung der Begriffe» in Doppellektion 1 sind Ausschnitte aus der [KI-Landkarte von inf-schule.de](https://inf-schule.de/ki/menueansicht) (CC BY-SA 4.0). Die Einteilung in vier KI-Typen folgt [robominds](https://www.robominds.de/en/blog/das-sind-die-vier-typen-von-kunstlicher-intelligenz) (eigene Zusammenfassung). Die Pflanzendaten stammen aus dem Datensatz *Iris* (R. A. Fisher, 1936), die Ziffernbilder aus dem scikit-learn-Datensatz `digits`.
