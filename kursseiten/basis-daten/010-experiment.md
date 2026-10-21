---
type: chapter
id: basis-daten-experiment
nummer: 1
titel: Entdecken und ausprobieren
kurz: Mit einer Vermutung ins Experiment starten
---

### Die Datenfalle und der erste Modellversuch

**Pflichtkern:** Prüft zuerst mit der Lehrperson die zwei Bildklassen, die Herkunft und die Trennung von Trainings- und Testbildern. Öffnet anschliessend das vorbereitete Bildklassifikationswerkzeug, trainiert ein erstes Modell und notiert mindestens zwei Vorhersagen samt tatsächlicher Klasse. Falls kein Fehler auftritt, beschreibt eine mögliche Schwachstelle statt einen Fehler zu erfinden. Die unabhängigen Testbilder dürfen nicht ins Training gelangen.

**Leitfrage:** Was lernt das Modell wirklich – den Gegenstand oder einen zufälligen Bildhintergrund?

### Die Datenfalle

Stellt euch vor, Tassen sind auf Trainingsfotos immer vor einem weissen Hintergrund zu sehen, Bücher immer vor einem schwarzen. Was könnte das Modell irrtümlich lernen?

<div class="basis-answer"><label for="basis-daten-a">Unsere Vermutung und Beobachtung</label><textarea id="basis-daten-a" data-basis-answer="basis-daten-a" rows="3" placeholder="Wir vermuten … / Wir sehen …"></textarea></div>


### Eigenes Bildmodell trainieren

[**Notebook «Bildmodell» starten ↗**](../lab/index.html?path=basis_bildmodell.ipynb)

Im Notebook erzeugt ihr einfache 8×8-Pixelbilder mit zwei unterschiedlichen Mustern und trainiert damit einen echten Klassifikator. Führt in dieser Doppellektion die Abschnitte **DL 5** aus. Das Notebook verwendet nur lokal erzeugte Bilddaten; es werden keine persönlichen Fotos benötigt.
