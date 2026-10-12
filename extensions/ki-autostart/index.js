import { INotebookTracker } from '@jupyterlab/notebook';
import { CodeCell } from '@jupyterlab/cells';
import { Widget } from '@lumino/widgets';

// Deliberately limited to the course notebooks. Never execute arbitrary uploads.
const allowed = new Set([
  'lernarten.ipynb', 'perzeptron_und_neuronale_netze.ipynb',
  'mehrschichtige_netze.ipynb', 'daten_training.ipynb',
  'klassifikation_ziffern.ipynb', 'ki_projekt/ki_lernlabor.ipynb',
  'ki_projekt/ki_tandemprojekt.ipynb'
]);
const tag = 'ki-autostart';

export default {
  id: '@kst/ki-autostart:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app, tracker) => {
    const seen = new WeakSet();
    const initialize = async panel => {
      if (seen.has(panel)) return;
      seen.add(panel);
      await panel.context.ready;
      if (panel.isDisposed || !allowed.has(panel.context.path)) return;
      const cells = panel.content.widgets.filter(cell =>
        cell.model.type === 'code' &&
        (cell.model.getMetadata('tags') || []).includes(tag)
      );
      if (!cells.length) return;
      const status = new Widget();
      status.node.className = 'ki-autostart-status';
      status.node.style.cssText = 'padding:4px 10px;font-size:12px;white-space:nowrap';
      status.node.setAttribute('role', 'status');
      status.node.textContent = '⏳ Lernumgebung startet …';
      panel.toolbar.addItem('ki-autostart-status', status);
      try {
        await panel.sessionContext.ready;
        if (!panel.sessionContext.session?.kernel) {
          throw new Error('Kein Python-Kernel verfügbar');
        }
        for (const cell of cells) {
          if (panel.isDisposed) return;
          const reply = await CodeCell.execute(cell, panel.sessionContext);
          if (!reply || reply.content.status !== 'ok') {
            throw new Error('Eine Startzelle konnte nicht ausgeführt werden');
          }
        }
        status.node.textContent = '✓ Bereit';
        status.node.title = 'Startzellen ausgeführt. Nach einem manuellen Kernel-Neustart die Zellen erneut ausführen.';
      } catch (error) {
        if (panel.isDisposed) return;
        status.node.textContent = '⚠ Start fehlgeschlagen – erste Codezelle ausführen';
        status.node.title = String(error);
        console.error('KI notebook initialization:', error);
      }
    };
    tracker.widgetAdded.connect((_, panel) => { void initialize(panel); });
    tracker.forEach(panel => { void initialize(panel); });
  }
};
