---
type: chapter
id: dl8-warum
nummer: "1"
titel: "Warum prüfen wir ein fremdes Modell?"
kurz: "Ergebnisse belegen, Grenzen entdecken und konstruktiv rückmelden."
open: true
---

<div class="dl8-question" aria-labelledby="dl8-question-1">
  <div class="dl8-question-meta"><span class="dl8-eyebrow">Leitfrage</span><span class="dl8-meta">1 · Verstehen</span></div>
  <h3 id="dl8-question-1">Was kann ein Modell nachweislich – und was nicht?</h3>
</div>

Das andere Tandem hat ein Bildmodell mit **zwei festgelegten Klassen** trainiert. Sie untersuchen zuerst seine **Trainings-, Validierungs- und Testdaten** und die protokollierten Ergebnisse. Danach führen Sie einen kleinen Versuch mit Ihren eigenen Bildern durch. **Erst danach** ziehen Sie Schlussfolgerungen und geben Rückmeldung.

<div class="dl8-compare">
  <article class="dl8-compare-card">
    <span class="dl8-eyebrow">Test A · Bekannte Klassen</span>
    <h3>Prüfung 1 · Gleiche Klassen, neue Testbilder</h3>
    <p>Das fremde Modell wurde zum Beispiel mit Äpfeln und Birnen trainiert. Es erkennt später einen <strong>anderen, zuvor nie gesehenen Apfel</strong> aus P1/P2. Das ist der Sinn eines unabhängigen Tests: Die Testbilder dürfen vorher <strong>nicht</strong> zum Training verwendet werden.</p>
    <p><strong>Prüffrage:</strong> Sind T1/T2, V1 und P1/P2 wirklich getrennte Exemplare? Wie gut ist das Resultat auf den passenden, ungesehenen Testbildern?</p>
  </article>
  <article class="dl8-compare-card">
    <span class="dl8-eyebrow">Test B · Andere Klassen</span>
    <h3>Prüfung 2 · Ganz andere Klassen</h3>
    <p>Jetzt zeigen Sie demselben Modell <strong>Tassen und Flaschen</strong> aus Ihrem eigenen Projekt. Es hat dafür keine Ausgänge gelernt und sagt trotzdem «Apfel» oder «Birne».</p>
    <p><strong>Prüffrage:</strong> Welche Vorhersagen entstehen, und warum beweist eine hohe Trennschärfe dabei keine korrekte Erkennung von Tassen und Flaschen?</p>
  </article>
</div>

<aside class="dl8-note">
  <span class="dl8-eyebrow">Merksatz</span>
  <p>Ein schlechter Fremdtest auf <strong>anderen Klassen</strong> beweist nicht, dass das Tandem schlecht gearbeitet hat. Auch ein scheinbar gutes Resultat beweist nicht, dass das Modell die neuen Klassen gelernt hat. <strong>Neue Bilder bekannter Klassen</strong> und <strong>völlig neue Klassen</strong> sind zwei unterschiedliche Prüfungen.</p>
</aside>

<div class="dl8-next">
  <span class="dl8-eyebrow">So geht es weiter</span>
  <p><a href="#reproduktion">Daten und Ergebnisse prüfen</a> → <a href="#fremdtest">Eigene Bilder ausprobieren</a> → <a href="#fremd-reflexion">Begründet reflektieren</a>.</p>
  <p class="small">Die gemeinsame Prüfung ist Pflicht, aber unbenotet. Nur die persönliche Reflexion zählt als <a href="#bewertung">K12 (maximal 3 Punkte)</a>.</p>
</div>
