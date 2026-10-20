---
type: chapter
id: basis-netze-1
nummer: 1
titel: Vom einzelnen Neuron zum Netz
kurz: Mehrere einfache Entscheidungen kombinieren
---
Ein Neuron kann mit zwei Eingaben **AND** oder **OR** darstellen. Bei **XOR** ist es schwieriger: Genau eine Eingabe soll 1 sein, aber nicht beide. Dafür lassen sich mehrere Neuronen kombinieren.

<figure class="concept-figure">
  <svg class="basis-network-diagram" viewBox="0 0 760 270" role="img" aria-label="Einfaches Netz: zwei Eingaben werden von zwei Neuronen in der Zwischenschicht verarbeitet. Das OR-Neuron und das NAND-Neuron führen zu einem dritten AND-Neuron und zur XOR-Ausgabe.">
    <title>Ein kleines neuronales Netz mit Zwischenschicht</title>
    <g fill="none" stroke="currentColor" stroke-width="3" opacity=".52"><path d="M120 78 L320 75 M120 78 L320 194 M120 194 L320 75 M120 194 L320 194 M407 75 L560 132 M407 194 L560 132"/></g>
    <g fill="#e2e9fa" stroke="#385dab" stroke-width="3"><circle cx="100" cy="78" r="39"/><circle cx="100" cy="194" r="39"/><circle cx="363" cy="75" r="45"/><circle cx="363" cy="194" r="45"/><circle cx="602" cy="132" r="50"/></g>
    <g fill="#223454" font-size="21" font-family="system-ui" font-weight="600" text-anchor="middle"><text x="100" y="85">x₁</text><text x="100" y="201">x₂</text><text x="363" y="83">OR</text><text x="363" y="202">NAND</text><text x="602" y="140">AND</text></g>
    <g fill="currentColor" font-size="17" font-family="system-ui" text-anchor="middle"><text x="102" y="265">Eingaben</text><text x="364" y="265">Zwischenschicht</text><text x="611" y="208">XOR-Ausgabe</text></g>
  </svg>
  <figcaption>Ein anschauliches Beispiel: Zwei Neuronen bereiten Zwischenergebnisse vor, ein drittes kombiniert sie. So lässt sich XOR bilden.</figcaption>
</figure>
**Merksatz:** Eine Zwischenschicht verarbeitet die Eingaben weiter. Die Ausgabe entsteht nicht einfach durch eine einzige Entscheidung. Das Beispiel zeigt die logische Kombination; das tatsächliche Trainieren eines Netzes ist komplexer.
