---
type: chapter
id: basis-daten-experiment
nummer: 1
titel: Entdecken und ausprobieren
kurz: Mit einer Vermutung ins Experiment starten
---

### Der erste Versuch mit einem Ziffernnetz

**Pflichtkern:** Öffnet das vorbereitete Notebook und startet den Abschnitt **DL 5**. Das Ziffernnetz wurde bereits mit Ziffernbildern trainiert: **Ihr trainiert in dieser Lektion noch kein eigenes Modell.** Prüft zuerst mindestens zwei Ziffernbilder und notiert jeweils die tatsächliche Ziffer und die Vorhersage. Testet anschliessend die Buchstaben **A und B**. Notiert, welche Ziffer (0–9) das Netz jeweils ausgibt. Eine Ziffernausgabe für A oder B ist **kein** Beleg für eine korrekte Buchstabenerkennung, weil es keine Buchstaben-Ausgabeklassen gibt.

**Leitfrage:** Warum gibt ein Ziffernnetz auch bei unbekannten Buchstaben eine Ziffer aus?

Begriffe zum Nachschlagen: [Modell](#basis-glossar-modell), [Label / Klasse](#basis-glossar-label) und [Training](#basis-glossar-training).

### Gedankenexperiment: die Datenfalle

Stellt euch vor, Tassen sind auf Trainingsfotos immer vor einem weissen Hintergrund zu sehen, Bücher immer vor einem schwarzen. Was könnte das Modell irrtümlich lernen? Das ist ein Gedankenexperiment für die späteren Fotolektionen – **kein zweiter Trainingsauftrag in DL 5**.

<div class="basis-answer"><label for="basis-daten-a">Unsere Vermutung und Beobachtung</label><textarea id="basis-daten-a" data-basis-answer="basis-daten-a" rows="3" placeholder="Wir vermuten … / Wir sehen …"></textarea></div>


### Ziffernnetz und unbekannte Buchstaben


<div class="ki-notebook-block" data-notebook="content/basis_bildmodell.ipynb" data-title="Ziffern und Buchstaben">
  <h3>Jupyter-Notebook · Ziffern und Buchstaben</h3>
  <p>Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.</p>
  <a class="ki-notebook-launch" href="../lab/index.html?path=portal/basis_bildmodell.ipynb">Notebook hier öffnen</a>
</div>


Führt im Notebook den Abschnitt **DL 5** aus: Prüft zunächst Ziffernvorhersagen und testet dann die Buchstaben A und B. Notiert, welche **Ziffern** das Modell für die Buchstaben ausgibt. Das Modell kennt keine Buchstabenklasse: Die Vorhersage ist deshalb keine gültige Buchstabenerkennung. Die Bilder werden lokal erzeugt.
