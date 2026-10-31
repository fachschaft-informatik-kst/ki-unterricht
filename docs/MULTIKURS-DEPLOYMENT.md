# Mehrkurs-URLs und voneinander unabhängige Deployments

## Aktueller Schritt

Im Quellrepository `fachschaft-informatik-kst/ki-unterricht` gibt es zwei
redaktionell gefüllte Kurse von BOK und zwei **leere, klar gekennzeichnete**
Kursplätze für IRN. `shared/course-sites.json` definiert eindeutige Kurs-IDs
und die öffentlichen Pfade. `scripts/build_course_routes.py` baut die vier
Kursadressen aus den vorhandenen Build-Ausgaben:

| Kurs | Öffentlicher Pfad | Inhalt |
| --- | --- | --- |
| BOK, 1. Klasse | `/bok/1-klasse/` | Bisheriger Basiskurs |
| BOK, 4. Klasse | `/bok/4-klasse/` | Bisheriger vertiefter Kurs |
| IRN, 1. Klasse | `/irn/1-klasse/` | Platzhalter, **kein** Kursinhalt |
| IRN, 4. Klasse | `/irn/4-klasse/` | Platzhalter, **kein** Kursinhalt |

Die vollständigen öffentlich erreichbaren URLs enthalten bei GitHub Pages den
Repository-Prefix `/ki-unterricht/`. Die alten Pfade `/basis/` und
`/projekt/` bleiben vollständig erreichbar. Es wird **keine** Browser-Migration
vorgenommen: bestehende LocalStorage-Schlüssel, JupyterLite-Lab-URLs und
ZIP-Formate bleiben erhalten. `/kurse.html` ist die Kursübersicht, die
Repository-Startadresse führt dorthin.

**Aktuell werden trotz der vier Adressen weiterhin alle Kurse gemeinsam durch
`.github/workflows/deploy.yml` als ein GitHub-Pages-Deployment veröffentlicht.**
URL-Trennung ist nicht Deployment-Trennung.

## Geplantes unabhängiges Deployment (nächste Phase)

Für wirklich unabhängige Veröffentlichungen sollte das gemeinsame Monorepo
einen parametrisierten Build `--course bok-1-klasse` usw. erhalten, der
ausschliesslich die für diesen Kurs benötigten Inhalte, den Kurs-Editor-Zugang
und eine funktionsfähige, kursisolierte JupyterLite-Laufzeit paketiert. Das
erfordert insbesondere eine Prüfung der in Notebooks gespeicherten Browserdaten
und absoluter/relativer Lab-URLs. Bei IRN müssen zuerst eigene Inhalte,
Manifeste, Notebooks und eindeutige Browser-Speicherschlüssel entstehen.

Danach können **vier Cloudflare-Pages-Projekte** aus demselben Repository
publiziert werden, z. B. `ki-bok-1`, `ki-bok-4`, `ki-irn-1`, `ki-irn-4`.
Jedes Projekt erhält ein eigenes GitHub-Actions-Deployment mit eigenem
`concurrency`-Schlüssel, einer eigenen Produktionsumgebung und einem eigenen
Build-Artefakt; Änderungen an `kurse/bok-1-klasse/` lösen nur BOK 1 aus,
Änderungen an der gemeinsamen Plattform alle vier relevanten Builds.
Die zentrale Übersicht kann über GitHub Pages oder ein fünftes Projekt laufen.

Einzelne Pages-Projekte haben zunächst **verschiedene Hostnamen**. Soll die
einheitliche URL-Struktur `/ki-unterricht/bok/1-klasse/` auch bei unabhängigen
Deployments erhalten bleiben, ist zusätzlich ein Domain-/Routing-Gateway
(z. B. Cloudflare Worker unter einer eigenen Schul-Domain) nötig, der die
voneinander unabhängig veröffentlichten Kursprojekte unter diesen Pfaden
zusammenführt. **GitHub Pages allein bietet kein unabhängiges Deployment
verschiedener Unterverzeichnisse desselben Projekts.**

Voraussetzungen für die Produktionsumstellung:
1. Redaktionelle Daten und Editor-/Worker-Berechtigungen pro Kurs isolieren.
2. Echte Kursprofile und parametrisierten Build mit getrennten JupyterLite-Daten einführen.
3. Vier Deployment-Ziele, nötige Credentials und ggf. Domain/Worker-Routing einrichten.
4. Browserbasierte Ende-zu-Ende-Tests für alle vier Kurse und ZIP-Import/Export durchführen.
5. Erst nach grünen Tests neue Domains/Produktionsrouten umschalten; Legacy-URLs behalten.

**Weder Cloudflare-Projekte noch deren Secrets/DNS werden in diesem Schritt
automatisch angelegt.**
