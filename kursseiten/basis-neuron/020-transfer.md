---
type: chapter
id: basis-neuron-2
nummer: 2
titel: Einfache Logik selbst entdecken
kurz: AND und OR durch Gewichte erklären
---
Die Tabelle oben kann zwei unterschiedliche Ziele zeigen:

| Sonne | Freund:innen | AND: Beide | OR: Mindestens eine |
|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

**Forscherauftrag (Tandem):** Stellen Sie die Regler zunächst so ein, dass die **AND-Spalte** entsteht. Notieren Sie die drei Werte. Anschliessend versuchen Sie **OR**. Was mussten Sie verändern?

**Vertiefung nach Wahl:** Finden Sie eine Einstellung, bei der eine Eingabe die Entscheidung verhindert. Beschreiben Sie den Grund in Alltagssprache.

<div class="basis-answer"><label for="basis-neuron-b">AND/OR-Einstellung und Erklärung</label><textarea id="basis-neuron-b" data-basis-answer="basis-neuron-b" rows="4" placeholder="AND: Sonne …, Freund:innen …, Bias … / OR … / Warum?"></textarea></div>
<details><summary>Hilfestellung (nur wenn nötig)</summary><div class="detail-body"><p>Versuchen Sie zuerst beide Gewichte auf 1 zu stellen. Für AND ist der Bias −1.5 geeignet. Für OR funktioniert ein Bias von −0.5. Beobachten Sie insbesondere die Fälle (0,1) und (1,0).</p></div></details>
