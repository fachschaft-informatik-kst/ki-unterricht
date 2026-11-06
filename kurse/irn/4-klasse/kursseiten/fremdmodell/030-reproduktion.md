---
type: chapter
id: reproduktion
nummer: "2"
titel: "Daten & Ergebnisse prüfen"
kurz: "Trainingsgruppen, unabhängige Testbilder und Resultate untersuchen."
open: false
---

<p class="page-crumb"><a href="#fremdmodell">‹ Fahrplan</a><span>Etappe 2 · Tandem · ca. 20 Min. · Pflichtcheck, unbenotet (K11)</span></p>

## Wie verlässlich sind die Datenaufteilung und die Ergebnisse des fremden Projekts?

<p class="section-intro">Arbeiten Sie im <strong>privaten Fenster</strong> mit dem <a href="#projekt-werkbank">importierten Notebook</a> und dem fremden <code>Versuchsprotokoll.json</code>. Sie müssen <strong>keinen neuen Modellvergleich planen</strong>. Ein Durchlauf genügt; zusätzliche Startwerte sind freiwillig.</p>

<p class="project-workplace"><strong>Durchgeführt wird der Nachlauf im Notebook:</strong> <a href="#projekt-werkbank">Journal &amp; Notebook öffnen</a>. Zurück zu dieser Doppellektion führt die Navigation: «Fremdmodell prüfen».</p>

<div class="dl8-section-head"><h3>Ihr Auftrag in 4 Schritten</h3><span class="dl8-meta">Im Tandem</span></div>
<ol class="dl8-steps">
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">01</span><span class="dl8-step-time">5 Min.</span></div>
    <h4>Daten ansehen</h4>
    <div class="dl8-step-copy"><p>Notieren Sie die <strong>beiden Klassen</strong> des fremden Projekts. Prüfen Sie in seiner Fotostudio-JSON und im <a href="#journal">Journal</a> die Gruppen <strong>T1/T2 (Training), V1 (Validierung) und P1/P2 (Test)</strong>: je Klasse und Gruppe acht Fotos. Vergleichen Sie mindestens <strong>ein Trainings- und ein Testexemplar</strong>: Sind es wirklich verschiedene Gegenstände oder Personen? Ist ein Hintergrund, eine Beleuchtung oder Quelle auffällig? Schreiben Sie eine konkrete Beobachtung auf.</p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">02</span><span class="dl8-step-time">5 Min.</span></div>
    <h4>Originalergebnisse verstehen</h4>
    <div class="dl8-step-copy"><p>Lesen Sie im Protokoll die <strong>A/B-Werte auf V1</strong>, die <strong>ursprüngliche Modellwahl</strong> und das <strong>Abschlusstestergebnis auf P1/P2</strong>. Wo liegt eine Differenz? Begründen Sie in einem Satz, warum P1/P2 nicht schon zum Trainieren benutzt werden durfte.</p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">03</span><span class="dl8-step-time">7 Min.</span></div>
    <h4>Selbst ausprobieren (Pflicht)</h4>
    <div class="dl8-step-copy"><p>Führen Sie im <a href="#projekt-werkbank">Notebook</a> mit der <strong>fremden Fotostudio-JSON</strong> die Zellen zum Datenimport und <code>foto.vergleichen(daten)</code> aus; behalten Sie die ursprünglichen Klassen, Einstellungen und den Startwert <strong>11</strong> bei. Übernehmen Sie die <strong>ursprünglich gewählte Variante</strong>, setzen Sie <code>TEST_FREIGEBEN = True</code> und wiederholen Sie den Abschlusstest. Vergleichen Sie <strong>einen V1-Wert und das Testergebnis</strong> mit dem Protokoll. Nicht nachträglich optimieren.</p></div>
  </li>
  <li>
    <div class="dl8-step-top"><span class="dl8-step-num" aria-hidden="true">04</span><span class="dl8-step-time">3 Min.</span></div>
    <h4>Beurteilen</h4>
    <div class="dl8-step-copy"><p>Schreiben Sie die wichtigste Beobachtung zur Datenqualität, die beiden Originalergebnisse, Ihren Vergleich und <strong>eine faire Rückfrage</strong> an das Tandem auf. Wenn Zahlen abweichen, nennen Sie die Abweichung; Sie müssen sie nicht schönrechnen.</p></div>
  </li>
</ol>

<label class="field answer"><span>Gemeinsamer Prüfbericht (Pflicht, unbenotet): Fremde Klassen · T1/T2 vs. P1/P2 (konkrete Exemplare/Quellen) · Original A/B auf V1 und Test P1/P2 · ein eigener Vergleichswert · eine Rückfrage</span><textarea data-journal="reproduktion" data-optional="" maxlength="20000" rows="6" placeholder="Klassen des fremden Modells: … / Trainings- und Testexemplare: … / Möglicher Datenleck- oder Hintergrundeffekt: …&#10;Original: A/V1 …, B/V1 …, Abschlusstest …; unser Nachlauf: V1 …, Test …&#10;Warum P1/P2 nicht ins Training gehören: … / Unsere Rückfrage: …"></textarea></label>

<p class="small"><strong>Technischer Hinweis:</strong> Stimmen Ergebnisse nicht genau überein, dokumentieren Sie dies. Eine identische <code>daten_sha256</code>-Prüfsumme kann zusätzlich helfen, ist aber <strong>kein Pflichtfeld</strong>. Falls das Notebook nicht startet, verwenden Sie die von der Lehrperson bereitgelegten Originalergebnisse und kennzeichnen den fehlenden eigenen Versuch ausdrücklich.</p>

<details>
  <summary>Freiwillige Vertiefung, kein Pflichtteil · drei Startwerte</summary>
  <div class="detail-body">
    <p>Nur bei Zeitreserve und vor dem Abschlusstest: <code>wiederholung = foto.vergleichen(daten, wiederholen=True)</code> und danach <code>foto.vergleich_zeigen(wiederholung)</code>. Vergleichen Sie die Startwerte 11, 22 und 33. Eine zusätzliche hohe Trefferquote ist kein Bewertungsvorteil.</p>
  </div>
</details>

<nav class="page-next" aria-label="Weiter in Doppellektion 8">
  <a class="btn" href="#dl8-vorbereiten">‹ Dateien vorbereiten</a>
  <a class="btn primary" href="#fremdtest">Weiter: Eigene Bilder testen →</a>
</nav>
