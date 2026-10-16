# Lehrpersonen-Editor für den KI-Unterricht

## Was jetzt umgesetzt ist

Die statische Website enthält unter \`/projekt/admin/\` einen Editor für vorhandene
Kapitel und neue Unterkapitel in den bestehenden Unterrichtsbereichen. Er kann:

- bestehende Markdown-/HTML-Kapitel **lesen und bearbeiten** (unveränderte IDs beibehalten),
- neue Unterkapitel mit YAML-Kopf **ohne HTML-Code** anlegen,
- Unterkapitel durch Dateiumbenennung verschieben oder **archivieren** statt unwiederbringlich löschen,
- neue Antwortfelder mit eindeutigen \`data-answer\`-Schlüsseln einfügen,
- **PNG/JPEG/WebP** bis 3 MB zusammen mit der zugehörigen Markdown-Datei einreichen,
- Inhalte in einem **skriptgesperrten Vorschau-iframe** ansehen,
- alles als **einen atomaren Commit auf einem neuen Branch und Pull Request** einreichen.

Der Pull Request startet die **bestehende GitHub-Action**. Erst ein erfolgreicher
Merge nach \`main\` löst die Veröffentlichung über GitHub Pages aus. Es gibt
**keine automatische Veröffentlichung unmittelbar nach dem Bearbeiten**.

Die bisherige Kursseite ist weiter rein statisch; es gibt kein Backend für
Schülerdaten und keine Cloud-Speicherung von Schülerantworten.

## Einmalige Einrichtung des GitHub-Logins (erforderlich)

**WICHTIG:** Die Anwendung ist zwar im Repository eingebaut, die Anmeldung kann
erst funktionieren, wenn eine GitHub App installiert und ein Worker bereitgestellt
wurde. Weder Cloudflare noch GitHub-App-Zugangsdaten werden hier im Repository
angelegt, und GitHub-Pages-Seiten können keine geheimen OAuth-Schlüssel speichern.

1. Bei Cloudflare anmelden und **Workers** aktivieren. Im geklonten Repository:

   \`\`\`sh
   cd admin-worker
   npx wrangler login
   npx wrangler deploy
   \`\`\`

   Die CLI zeigt die Admin-URL an, etwa
   \`https://kst-ki-admin.<konto>.workers.dev/\`. Ein anderes, sicher per HTTPS
   erreichbares Worker-Hostname ist ebenfalls möglich. Die Worker-Konfiguration
   liegt in \`admin-worker/wrangler.jsonc\`.

2. Bei GitHub unter **Settings → Developer settings → GitHub Apps → New GitHub App**
   eine App für diesen Editor anlegen.

   - **Homepage URL:** \`https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/\`
   - **Callback URL:** \`https://<worker-host>/auth/callback\`
   - **Webhook:** deaktivieren, sofern nicht anderweitig benötigt
   - **Repository permissions:** \`Contents: Read and write\`,
     \`Pull requests: Read and write\`, \`Metadata: Read\`.
   - Die App auf **nur** \`fachschaft-informatik-kst/ki-unterricht\` installieren
     (nicht auf alle Repositories).
   - GitHub-App-Client-ID und einen neu generierten Client-Secret bereithalten.

3. Im Verzeichnis \`admin-worker\` die Secrets **per CLI-Eingabe** hinterlegen,
   niemals in Git, in einer Markdown-Datei oder in der Browser-Konsole:

   \`\`\`sh
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   \`\`\`

   Für die Cookie-Verschlüsselung einen **zufälligen Schlüssel mit 32 Bytes**
   erzeugen und als base64url kodieren. Beispiel auf einem vertrauenswürdigen
   Rechner (Ausgabe **nicht** veröffentlichen):

   \`\`\`sh
   python -c 'import base64,secrets; print(base64.urlsafe_b64encode(secrets.token_bytes(32)).decode().rstrip("="))'
   npx wrangler secret put SESSION_KEY
   \`\`\`

   Den ausgegebenen Wert bei \`SESSION_KEY\` einfügen.

4. **Admin-Worker-URL direkt im Browser öffnen**, dann **«Mit GitHub anmelden»**.
   Nur GitHub-Nutzende mit Repository-Schreibberechtigung können Inhalte speichern.
   Die App legt ihre kurzlebige Sitzung in einem verschlüsselten
   \`HttpOnly; Secure; SameSite=Lax\`-Cookie ab und sendet das GitHub-Token
   **niemals** an das Browser-JavaScript.

   Der öffentliche Link \`/projekt/admin/\` zeigt den Editor und diese
   Einrichtungsanleitung, aber auf der GitHub-Pages-Origin ist der Schreibzugriff
   absichtlich **nicht** aktiv. Die sichere, angemeldete Ansicht befindet sich
   auf der Worker-Origin, wo auch der Login-Cookie gültig ist.

5. Änderung auf dem Worker nach späteren Code-Updates:

   \`\`\`sh
   cd admin-worker
   npx wrangler deploy
   \`\`\`

   Die normale GitHub-Pages-Action veröffentlicht **nur die statische Website**.
   Der Worker wird absichtlich nicht mit ungeschützten CI-Zugangsdaten deployed.

## Redaktionsablauf

1. Im Admin-Worker via GitHub anmelden.
2. Links einen Bereich und ein Kapitel auswählen, Text im Quellfeld ändern.
3. Bei Bedarf **Überschrift**, **Antwortfeld** oder **Bild** am Cursor einfügen.
   Bei älteren Dateien auf die bestehende HTML-Struktur achten.
4. **Vorschau** betrachten (vereinfachte Darstellung; Notebooks werden nicht ausgeführt).
5. **«Änderung vormerken»**, ggf. mehrere Kapitel bearbeiten.
6. Unten **«Pull Request erstellen»**, GitHub-Link öffnen, CI abwarten und
   den PR nach Review in \`main\` mergen. Die bestehende GitHub Action baut neu.

GitHub bleibt die **einzige Quelle**. Konflikte werden vor dem Schreiben gegen
den aktuellen \`main\`-Commit geprüft. Bei parallelen Änderungen erscheint
eine Fehlermeldung statt eines stillen Überschreibens.

## Einschränkungen und Sicherheit

- Aktuell nur Unterkapitel in bestehenden Bereichen. **Eine ganz neue
  Doppellektion** ist noch nicht als Ein-Klick-Vorgang verfügbar: dafür müssen
  zuerst die festen Lektionszahlen aus \`projekt/kurs.json\` und den Generatoren
  entfernt werden. Siehe \`docs/ARCHITEKTUR.md\`.
- Alte Unterkapitel enthalten teilweise echtes HTML und interaktive Elemente.
  Der Editor ist deshalb ein **Quelltexteditor mit vereinfachter Vorschau**,
  noch kein vollständig visueller WYSIWYG-Editor.
- Die Vorschau wird in einem \`sandbox=""\`-iframe dargestellt: kein JavaScript,
  keine Formularsendung und kein Zugriff auf das GitHub-Login.
- Keine SVG-Uploads, weil fremde SVGs aktive Inhalte enthalten können.
  Bestehende gepflegte SVGs bleiben weiterhin nutzbar.
- Archivierung entfernt ein Kapitel aus der veröffentlichten Navigation,
  bewahrt den Text aber unter \`kursseiten/_archiv/\` und in der Git-Historie.
  Alte Links zum Kapitel sind nach der Archivierung vorübergehend ungültig.
- Bereits bestehende \`data-answer\`, \`data-journal\`, Notebook- und
  Beurteilungs-IDs **nicht ändern oder löschen**. Der Editor warnt beim
  Entfernen, die CI prüft die Verträge mit gespeicherten Schülerdaten.
- Max. 12 Dateien pro PR. Es sind nur Kapiteldateien, die Archivablage
  und neue Bilddateien unter \`projekt/grafiken/uploads/\` schreibbar.
  JS, GitHub-Workflows, Metadaten und Administrationscode sind gesperrt.
- HTML in bearbeiteten Kapiteln kann auf der veröffentlichten öffentlichen
  Website ausgeführt werden. Deshalb gehören auch Editor-Pull-Requests
  in ein **Code-Review**; GitHub App nur an vertrauenswürdige Maintainer geben.
- Es gibt keine Persistenz unfertiger Änderungen über das Schliessen des Tabs
  hinaus. Vor dem Schliessen Änderungen vormerken **und** PR erstellen.
- Browserzustand und ZIP-Format der Lernenden werden nicht umgestellt.

## Technischer Aufbau

- \`projekt/admin/index.html\` – Oberfläche
- \`projekt/admin/admin.css\` – Gestaltung
- \`projekt/admin/admin.js\` – Editor, Vorschau, Upload
- \`admin-worker/src/index.mjs\` – OAuth, Berechtigungskontrolle, atomische Commits und PR
- \`admin-worker/wrangler.jsonc\` – Deploykonfiguration (ohne Secrets)
- \`tests/check_admin.mjs\` – nicht authentifizierte API / OAuth Sicherheitschecks
- \`tests/check_admin.py\` – Content und Einbindung

Der Worker proxyt die statischen Editor-Assets auf seine **eigene Origin**. Das
vermeidet Drittanbieter-Cookies und hält das GitHub-Token ausschliesslich auf
der Serverseite. OAuth nutzt PKCE (S256) und \`state\`; Sitzungsdaten werden
mit AES-GCM verschlüsselt und nach spätestens einer Stunde ungültig.
