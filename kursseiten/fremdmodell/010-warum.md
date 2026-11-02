---
type: chapter
id: dl8-warum
nummer: "1"
titel: "Warum prüfen wir ein fremdes Modell?"
kurz: "Ergebnisse belegen, Grenzen entdecken und konstruktiv rückmelden."
open: true
---

**Leitfrage:** Was kann ein Modell nachweislich – und was nicht?

Das andere Tandem hat ein Bildmodell mit **zwei festgelegten Klassen** trainiert. Sie untersuchen zuerst seine **Trainings-, Validierungs- und Testdaten** und die protokollierten Ergebnisse. Danach führen Sie einen kleinen Versuch mit Ihren eigenen Bildern durch. **Erst danach** ziehen Sie Schlussfolgerungen und geben Rückmeldung.

<div class="grid two">
  <article class="card">
    <h3>Prüfung 1 · Gleiche Klassen, neue Testbilder</h3>
    <p>Das fremde Modell wurde zum Beispiel mit Äpfeln und Birnen trainiert. Es erkennt später einen <strong>anderen, zuvor nie gesehenen Apfel</strong> aus P1/P2. Das ist der Sinn eines unabhängigen Tests: Die Testbilder dürfen vorher <strong>nicht</strong> zum Training verwendet werden.</p>
    <p><strong>Prüffrage:</strong> Sind T1/T2, V1 und P1/P2 wirklich getrennte Exemplare? Wie gut ist das Resultat auf den passenden, ungesehenen Testbildern?</p>
  </article>
  <article class="card">
    <h3>Prüfung 2 · Ganz andere Klassen</h3>
    <p>Jetzt zeigen Sie demselben Modell <strong>Tassen und Flaschen</strong> aus Ihrem eigenen Projekt. Es hat dafür keine Ausgänge gelernt und sagt trotzdem «Apfel» oder «Birne».</p>
    <p><strong>Prüffrage:</strong> Welche Vorhersagen entstehen, und warum beweist eine hohe Trennschärfe dabei keine korrekte Erkennung von Tassen und Flaschen?</p>
  </article>
</div>

**Wichtig:** Ein schlechter Fremdtest auf *anderen Klassen* beweist nicht, dass das andere Tandem schlecht gearbeitet hat. Und ein guter Fremdtest beweist nicht, dass das Modell die neuen Klassen gelernt hat. <strong>Unbekannte Bilder derselben Klassen</strong> und <strong>unbekannte Klassen</strong> sind zwei unterschiedliche Prüfungen.

**Ihr Auftrag:** <a href="#reproduktion">Daten und ursprüngliche Testergebnisse prüfen</a> → <a href="#fremdtest">eigene Bilder ausprobieren</a> → <a href="#fremd-reflexion">begründet reflektieren</a>. Die gemeinsame Datenprüfung und Rückmeldung sind <strong>Pflicht, aber unbenotet</strong>. Nur die persönliche Reflexion zählt als <a href="#bewertung">K12 (maximal 3 Punkte)</a>.
