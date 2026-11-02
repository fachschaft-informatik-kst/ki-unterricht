---
type: chapter
id: reproduktion
nummer: "3"
titel: "Ergebnisse reproduzieren · 30 Min."
kurz: "Gleiche Daten und Einstellungen – gleiche Resultate?"
open: false
---

**Prüffrage (K11):** Kommen Sie mit dem Originaldatensatz und **Startwert 11** zum gleichen Ergebnis?

Bleiben Sie im <strong>privaten Fenster</strong> mit dem importierten Projekt. Bearbeiten Sie die fünf Schritte im <a href="#projekt-werkbank">importierten Projekt-Notebook</a>. Die Originalwerte finden Sie in `Versuchsprotokoll.json` des fremden ZIPs.

1. **5 Min. · Daten laden:** Führen Sie die Vorbereitungszellen aus. Lassen Sie `MODUS` und `KLASSEN` wie beim Original. Laden Sie im Datenimport **die fremde Fotostudio-JSON**. Prüfen Sie zwei Klassen, fünf Gruppen und je acht Fotos pro Klasse und Gruppe.
2. **5 Min. · Daten beurteilen:** Vergleichen Sie Klassenregel, Exemplare und Quellen mit dem <a href="#journal">importierten Journal</a>. Notieren Sie **zwei konkrete** Beobachtungen zur Datenqualität (z. B. Licht, Hintergrund oder Verwechslungen).
3. **10 Min. · A/B trainieren:** Führen Sie die Zelle `foto.vergleichen(daten)` mit dem unveränderten Startwert **11** aus. Vergleichen Sie die Trefferquoten von **A auf V1** und **B auf V1** mit `laeufe` im Originalprotokoll.
4. **5 Min. · Abschlusstest wiederholen:** Übernehmen Sie die **ursprünglich gewählte Variante und Begründung**. Setzen Sie nur zur Wiederholung `TEST_FREIGEBEN = True`, führen Sie die Testzelle aus und vergleichen Sie das Testergebnis. **Keine nachträgliche Modellwahl oder Optimierung.**
5. **5 Min. · Ergebnisse prüfen:** Führen Sie die Protokollzelle aus und vergleichen Sie `daten_sha256`, beide V1-Werte und das Abschlusstestergebnis mit dem Original. Ist etwas anders, dokumentieren Sie die Abweichung statt sie zu verschweigen.

<label class="field answer"><span>Reproduktionsbericht (gemeinsam): geprüfte Namen/Projekt · daten_sha256 gleich? · A/V1 und B/V1 «Original → eigener Lauf» · Abschlusstest «Original → eigener Lauf» · zwei Datenbeobachtungen · bei Abweichung mögliche Ursache · eine konkrete Empfehlung</span><textarea data-journal="reproduktion" data-optional="" maxlength="20000" rows="8" placeholder="Geprüftes Tandem und Thema: …
Prüfsumme gleich? …
A/V1: … → …; B/V1: … → …; Test: … → …
Zwei Datenbeobachtungen: …
Deutung bei Abweichung: …
Empfehlung: …"></textarea></label>

<p><strong>Ergebnis für K11:</strong> Ein überprüfbarer Bericht mit Originalwerten, Ihren Werten und einer begründeten Aussage zur Übereinstimmung. Die Zahlen müssen nicht besser werden.</p>

<details>
  <summary>Freiwillige Vertiefung, kein Pflichtteil · drei Startwerte</summary>
  <div class="detail-body">
    <p>Nur bei Zeitreserve und <strong>vor</strong> der Abschlusstest-Zelle: In einer neuen Notebookzelle `wiederholung = foto.vergleichen(daten, wiederholen=True)` und danach `foto.vergleich_zeigen(wiederholung)` ausführen. Untersuchen Sie die Startwerte 11, 22 und 33. Die Ergebnisse gehören nur dann in Ihren Bericht, wenn Sie die Vertiefung gemacht haben.</p>
  </div>
</details>

<div class="actions">
  <a class="btn" href="#projekt-werkbank">Zum Notebook →</a>
  <a class="btn primary" href="#fremdtest">Weiter: Fremdtest →</a>
</div>
