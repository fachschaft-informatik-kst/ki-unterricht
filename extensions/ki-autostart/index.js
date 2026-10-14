import { setupEmbed } from './embed';
import { INotebookTracker } from '@jupyterlab/notebook';
import { CodeCell } from '@jupyterlab/cells';
import { Widget } from '@lumino/widgets';

// Deliberately limited to the course notebooks. Never execute arbitrary uploads.
const allowed = new Set([
  'perzeptron_und_neuronale_netze.ipynb',
  'mehrschichtige_netze.ipynb', 'daten_training.ipynb',
  'ki_projekt/ki_lernlabor.ipynb',
  'ki_projekt/ki_tandemprojekt.ipynb'
]);
for (const path of [...allowed]) allowed.add('portal/' + path.split('/').pop());
const tag = 'ki-autostart';
const rememberedPathKey = 'kst-ki-last-notebook';

export default {
  id: '@kst/ki-autostart:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app, tracker) => {
    const embed = typeof window !== 'undefined' ? setupEmbed(app, tracker, allowed) : null;
    const seen = new WeakSet();
    const initialize = async panel => {
      if (seen.has(panel)) return;
      seen.add(panel);
      await panel.context.ready;
      if (panel.isDisposed || !allowed.has(panel.context.path)) return;
      if (embed && panel.context.path !== embed.path) return;
      try { if (!embed) sessionStorage.setItem(rememberedPathKey, panel.context.path); } catch {}
      panel.disposed.connect(() => {
        try {
          if (sessionStorage.getItem(rememberedPathKey) === panel.context.path) {
            sessionStorage.removeItem(rememberedPathKey);
          }
        } catch {}
      });
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
        if (embed?.restoreOnly) {
          status.node.textContent = 'Gesicherter Stand · Zellen bei Bedarf erneut ausführen';
          await embed.initialized(panel, true);
          return;
        }
        const response = await fetch(new URL('../files/' + panel.context.path, location.href));
        if (!response.ok) throw new Error('Die veröffentlichte Vorlage ist nicht erreichbar');
        const template = await response.json();
        // In the portal, its saved document is authoritative. If none exists,
        // start from the published template, never a different tandem's Lite cache.
        if (embed) panel.context.model.fromJSON(template);
        const starts = template.cells.filter(c => c.cell_type === 'code' && (c.metadata?.tags || []).includes(tag));
        const cells = starts.map(c => panel.content.widgets.find(w => w.model.id === c.id));
        const source = c => Array.isArray(c.source) ? c.source.join('') : c.source;
        // Stop the entire automatic sequence if a start cell was changed or removed.
        // Custom cells, imported tags and project training are always manual.
        const unchanged = starts.length && cells.every((c, i) => c?.model.type === 'code' && c.model.sharedModel.getSource() === source(starts[i]));
        if (unchanged) {
          for (const cell of cells) {
            if (panel.isDisposed) return;
            const reply = await CodeCell.execute(cell, panel.sessionContext);
            if (!reply || reply.content.status !== 'ok') {
              throw new Error('Eine Startzelle konnte nicht ausgeführt werden');
            }
          }
        }
        status.node.textContent = unchanged ? '✓ Bereit' : 'Geänderte Vorbereitung: Zellen selbst ausführen';
        embed?.initialized(panel, true);
        status.node.title = unchanged ? 'Startzellen ausgeführt. Nach einem manuellen Kernel-Neustart die Zellen erneut ausführen.' : 'Die gespeicherte Vorbereitung weicht von der Vorlage ab. Keine Zelle wurde automatisch ausgeführt.';
      } catch (error) {
        if (panel.isDisposed) return;
        status.node.textContent = '⚠ Start fehlgeschlagen – Versuch erneut öffnen';
        status.node.title = String(error);
        console.error('KI notebook initialization:', error);
        embed?.initialized(panel, false);
      }
    };
    tracker.widgetAdded.connect((_, panel) => { void initialize(panel); });
    tracker.forEach(panel => { void initialize(panel); });
    // Lite may restore only the launcher after refresh. Reopen within this tab,
    // after normal workspace restoration; explicit links always take priority.
    void app.restored.then(async () => {
      try {
        if (embed || performance.getEntriesByType('navigation')[0]?.type !== 'reload') return;
        if (tracker.size || new URLSearchParams(location.search).has('path')) return;
        const path = sessionStorage.getItem(rememberedPathKey);
        if (allowed.has(path)) {
          await app.commands.execute('docmanager:open', {path, factory: 'Notebook'});
        }
      } catch (error) { console.warn('KI notebook restoration:', error); }
    });
  }
};
