<details class="kapitel" id="basis-netze-2" data-kurz="Die Zwischenschicht aus OR und NAND als Lösung des XOR-Problems verstehen." open>
  <summary><span class="kapitel-nr">2</span>
    <h2 class="kapitel-titel">Ein mehrschichtiges neuronales Netz</h2>
  </summary>
  <div class="kapitel-body">
    <!-- MD:START -->
Ein einzelnes Neuron kann bei XOR nur eine Entscheidungsgrenze bilden. **Mehrere Neuronen** können Zwischenergebnisse berechnen und miteinander kombinieren. So lässt sich eine Aufgabe lösen, die für ein einzelnes Neuron unmöglich ist.
<!-- MD:END -->
    <p>Ein einzelnes Neuron kann nur eine Gerade ziehen. Mit <strong>zwei Neuronen</strong> in einer Zwischenschicht, eines für OR und eines für NAND, und einem dritten, das beide mit AND verbindet, entsteht aus der einen Geraden ein Streifen. Dann gelingt XOR:</p>
    <div class="table-scroll">
      <table class="typen">
        <thead>
          <tr>
            <th>Eingabe</th>
            <th>OR</th>
            <th>NAND</th>
            <th>AND von beiden = XOR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>(0, 0)</th>
            <td>0</td>
            <td>1</td>
            <td>0</td>
          </tr>
          <tr>
            <th>(0, 1)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 0)</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <th>(1, 1)</th>
            <td>1</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- MD:START -->
Die beiden Zwischenneuronen berechnen OR und NAND. Das Ausgabeneuron verknüpft diese Zwischenergebnisse mit AND. So entstehen genau die vier XOR-Zielwerte. Im nächsten Kapitel «Mit dem Netzwerk experimentieren» testen Sie die vier Fälle selbst.
<!-- MD:END -->
    <!-- MD:START -->
### Eine versteckte Schicht zwischen Ein- und Ausgabe
<!-- MD:END -->
    <figure class="concept-figure">
      <img alt="Zwei Eingaben, zwei Zwischenneuronen und ein Ausgabeneuron mit Gewichten und Bias." loading="lazy" src="grafiken/merhschichtiges_netzwerk.svg"/>
      <figcaption>Die versteckte Schicht berechnet Zwischenergebnisse. Im anschliessenden Netzwerk-Notebook verfolgen Sie damit die XOR-Entscheidung.</figcaption>
    </figure>
    <div class="process">
      <span>Eingabe</span><b>→</b><span>Versteckte Schicht</span><b>→</b><span>Ausgabe</span>
    </div>
    <!-- MD:START -->
Prüfen Sie für (1, 0): Was antworten OR und NAND? Was entsteht, wenn der Ausgang beide Antworten mit AND kombiniert?
<!-- MD:END -->
    <!-- MD:START -->
**Überprüfen Sie den Aufbau:** Was berechnen die beiden Neuronen der versteckten Schicht? Wie verbindet das Ausgabeneuron ihre Antworten? Anschliessend öffnen Sie «Mit dem Netzwerk experimentieren».
<!-- MD:END -->
    <label class="field answer"><span>Unser Verständnischeck: Was liefern OR und NAND für (1, 0), was macht das Ausgabeneuron daraus und welche Aufgabe hat die versteckte Schicht?</span><textarea data-basis-answer="basis-netze-netze_zwischenschicht" rows="3" maxlength="10000" placeholder="OR = …, NAND = …, AND = … / Die versteckte Schicht …"></textarea></label>
  </div>
</details>