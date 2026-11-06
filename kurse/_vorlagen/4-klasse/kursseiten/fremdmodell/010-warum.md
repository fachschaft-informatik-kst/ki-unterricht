---
type: chapter
id: dl8-warum
nummer: "0"
titel: "Warum prüfen?"
kurz: "Was Sie aus dem eigenen Projekt mitbringen und welche zwei Prüfungen Sie unterscheiden."
open: false
---

<p class="page-crumb"><a href="#fremdmodell">‹ Fahrplan</a><span>Start · ca. 5 Min.</span></p>

## Was kann ein Modell nachweislich – und was nicht?

<p class="section-intro">Dieselben Regeln wie in Ihrem Projekt, jetzt als Prüfende: erst die Daten und Ergebnisse des fremden Tandems, dann Ihre eigenen Klassen.</p>

Das andere Tandem hat ein Bildmodell mit **zwei festgelegten Klassen** trainiert. Sie untersuchen zuerst seine **Trainings-, Validierungs- und Testdaten** und die protokollierten Ergebnisse. Danach führen Sie einen kleinen Versuch mit Ihren eigenen Bildern durch. **Erst danach** ziehen Sie Schlussfolgerungen und geben Rückmeldung.

<div class="dl8-section-head"><h3>Vom eigenen zum fremden Projekt</h3><span class="dl8-meta">Dieselben Regeln</span></div>
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th scope="col">In Ihrem Projekt haben Sie …</th>
        <th scope="col">Beim fremden Projekt prüfen Sie …</th>
        <th scope="col">Wo?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Training, Validierung und Test in T1/T2, V1 und P1/P2 getrennt.</td>
        <td>ob diese Gruppen wirklich verschiedene Gegenstände oder Personen enthalten.</td>
        <td><a href="#reproduktion">Etappe 2</a></td>
      </tr>
      <tr>
        <td>Variante A oder B anhand von V1 gewählt, bevor Sie den Test kannten.</td>
        <td>ob die Werte auf V1 zur ursprünglichen Modellwahl passen.</td>
        <td><a href="#reproduktion">Etappe 2</a></td>
      </tr>
      <tr>
        <td>den Abschlusstest auf P1/P2 gemacht und danach nichts mehr optimiert.</td>
        <td>ob das Testresultat stimmt; ein Nachlauf mit Startwert 11 prüft es.</td>
        <td><a href="#reproduktion">Etappe 2</a></td>
      </tr>
      <tr>
        <td>die Grenzen Ihres Modells benannt.</td>
        <td>wo das fremde Modell mit Ihren eigenen Klassen an Grenzen stösst.</td>
        <td><a href="#fremdtest">Etappe 3</a> · <a href="#dl8-abschluss">Etappe 4</a></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="dl8-section-head"><h3>Zwei verschiedene Prüfungen</h3><span class="dl8-meta">Nicht verwechseln</span></div>
<div class="dl8-compare">
  <article class="dl8-compare-card">
    <span class="dl8-eyebrow">Prüfung 1 · Etappe 2</span>
    <h3>Gleiche Klassen, neue Testbilder</h3>
    <p>Das fremde Modell wurde zum Beispiel mit Äpfeln und Birnen trainiert. Es erkennt später einen <strong>anderen, zuvor nie gesehenen Apfel</strong> aus P1/P2. Das ist der Sinn eines unabhängigen Tests: Die Testbilder dürfen vorher <strong>nicht</strong> zum Training verwendet werden.</p>
    <p><strong>Prüffrage:</strong> Sind T1/T2, V1 und P1/P2 wirklich getrennte Exemplare? Wie gut ist das Resultat auf den passenden, ungesehenen Testbildern?</p>
  </article>
  <article class="dl8-compare-card">
    <span class="dl8-eyebrow">Prüfung 2 · Etappe 3</span>
    <h3>Ganz andere Klassen</h3>
    <p>Jetzt zeigen Sie demselben Modell <strong>Tassen und Flaschen</strong> aus Ihrem eigenen Projekt. Es hat dafür keine Ausgänge gelernt und sagt trotzdem «Apfel» oder «Birne».</p>
    <p><strong>Prüffrage:</strong> Welche Vorhersagen entstehen, und warum beweist eine hohe Trennschärfe dabei keine korrekte Erkennung von Tassen und Flaschen?</p>
  </article>
</div>

<aside class="dl8-note">
  <span class="dl8-eyebrow">Merksatz</span>
  <p>Ein schlechter Fremdtest auf <strong>anderen Klassen</strong> beweist nicht, dass das Tandem schlecht gearbeitet hat. Auch ein scheinbar gutes Resultat beweist nicht, dass das Modell die neuen Klassen gelernt hat. <strong>Neue Bilder bekannter Klassen</strong> und <strong>völlig neue Klassen</strong> sind zwei unterschiedliche Prüfungen.</p>
</aside>

<nav class="page-next" aria-label="Weiter in Doppellektion 8">
  <a class="btn" href="#fremdmodell">‹ Fahrplan</a>
  <a class="btn primary" href="#dl8-vorbereiten">Weiter: Dateien vorbereiten →</a>
</nav>
