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
const rememberedPathKey = 'kst-ki-last-notebook';

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
      try { sessionStorage.setItem(rememberedPathKey, panel.context.path); } catch {}
      panel.disposed.connect(() => {
        try {
          if (sessionStorage.getItem(rememberedPathKey) === panel.context.path) {
            sessionStorage.removeItem(rememberedPathKey);
          }
        } catch {}
      });
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
    // Lite may restore only the launcher after refresh. Reopen within this tab,
    // after normal workspace restoration; explicit links always take priority.
    void app.restored.then(async () => {
      try {
        if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') return;
        if (tracker.size || new URLSearchParams(location.search).has('path')) return;
        const path = sessionStorage.getItem(rememberedPathKey);
        if (allowed.has(path)) {
          await app.commands.execute('docmanager:open', {path, factory: 'Notebook'});
        }
      } catch (error) { console.warn('KI notebook restoration:', error); }
    });
  }
};
