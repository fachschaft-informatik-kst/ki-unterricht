---
type: chapter
id: basis-neuron-vorbild
nummer: 1
titel: Von der Nervenzelle zum neuronalen Netz
kurz: Biologisches Vorbild, künstliches Neuron und mehrere Schichten
---

Das menschliche Gehirn besteht aus vielen miteinander verbundenen Nervenzellen. Sie nehmen Signale auf und geben sie weiter. Ein künstliches Neuron ist **kein Nachbau einer Nervenzelle**, sondern ein mathematisches Modell, das die Grundidee des Verknüpfens und Gewichtens von Eingaben verwendet.

<figure class="concept-figure neuron-figure">
<img src="grafiken/neuron_biologisch.svg" loading="lazy" alt="Biologische Nervenzelle mit Dendriten, Synapsen, Zellkörper, Axonhügel und Axon; Zuordnung zu den Eingaben, Gewichten, Summe, Schwelle und Ausgabe eines künstlichen Neurons."/>
<figcaption>Das biologische Vorbild: Signale werden aufgenommen, beeinflussen die Aktivierung und können an weitere Nervenzellen weitergegeben werden.</figcaption>
</figure>

| Biologische Nervenzelle | Künstliches Neuron |
|---|---|
| Dendriten empfangen Signale | Eingaben x₁, x₂, … |
| Synapsen beeinflussen die Stärke eines Signals | Gewichte w₁, w₂, … |
| Zellkörper verrechnet eingehende Signale | Gewichtete Summe |
| Axonhügel entscheidet über das Auslösen eines Signals | Aktivierungsfunktion mit Schwelle und Bias |
| Axon leitet Signale weiter | Ausgabe y an weitere Neuronen |

**Ein Netz entsteht**, wenn Ausgaben von Neuronen zur Eingabe weiterer Neuronen werden: Eingabeschicht → eine oder mehrere **versteckte Schichten** → Ausgabeschicht. Im nächsten Experiment untersuchen wir zunächst **einen Baustein** dieses Netzes. Danach setzen wir mehrere Bausteine zusammen.

<figure class="concept-figure">
<svg class="basis-network-diagram" viewBox="0 0 720 220" role="img" aria-label="Neuronales Netz mit zwei Eingaben links, drei Neuronen in einer versteckten Schicht in der Mitte und einem Ausgabeneuron rechts. Verbindungslinien zeigen den Signalfluss.">
<title>Eingabeschicht – versteckte Schicht – Ausgabeschicht</title>
<g fill="none" stroke="currentColor" stroke-width="2.5" opacity=".55"><path d="M125 65L327 45 M125 65L327 108 M125 65L327 172 M125 158L327 45 M125 158L327 108 M125 158L327 172 M377 45L570 108 M377 108L570 108 M377 172L570 108"/></g>
<g fill="#e2e9fa" stroke="#3653a3" stroke-width="3"><circle cx="100" cy="65" r="25"/><circle cx="100" cy="158" r="25"/><circle cx="350" cy="45" r="24"/><circle cx="350" cy="108" r="24"/><circle cx="350" cy="172" r="24"/><circle cx="595" cy="108" r="25"/></g>
<g fill="#223454" font-family="system-ui" font-size="16" text-anchor="middle"><text x="100" y="71">x₁</text><text x="100" y="164">x₂</text><text x="595" y="114">y</text></g>
<g fill="currentColor" font-family="system-ui" font-size="15" text-anchor="middle"><text x="105" y="213">Eingaben</text><text x="350" y="213">Versteckte Schicht</text><text x="600" y="171">Ausgabe</text></g>
</svg>
<figcaption>Ein stark vereinfachtes neuronales Netz. Die Verbindungen besitzen Gewichte; die Kreise repräsentieren Rechenschritte.</figcaption>
</figure>

**Denkt zu zweit nach:** Was wird bei einem künstlichen Neuron gelernt? Weshalb braucht ein Netz mehrere Neuronen? In welcher Hinsicht ist der Vergleich mit einem Gehirn hilfreich, und wo ist er irreführend?

<div class="basis-answer"><label for="basis-neuron-vorbild-a">Unsere Hypothese zum Netz und zum biologischen Vergleich</label><textarea id="basis-neuron-vorbild-a" data-basis-answer="basis-neuron-vorbild-a" rows="3" placeholder="Ein Neuron kann … / Mehrere Neuronen … / Die Analogie endet …"></textarea></div>
