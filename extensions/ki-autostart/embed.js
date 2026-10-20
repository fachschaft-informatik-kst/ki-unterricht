import {portableNotebook, uploadedFiles} from './snapshot';

// Same-origin bridge between the course website and its one notebook iframe.
export function setupEmbed(app, tracker, allowed) {
  const query = new URLSearchParams(location.search);
  if (query.get('ki-embed') !== '1' || window.parent === window) return null;
  const path = query.get('ki-path') || query.get('path');
  if (!allowed.has(path) || !path.startsWith('portal/')) return null;
  const origin = location.origin;
  const style = document.createElement('style');
  style.textContent = `#jp-top-panel,#jp-menu-panel,#jp-bottom-panel,#jp-left-stack,#jp-right-stack,.jp-SideBar,.jp-StatusBar,.lm-DockPanel-tabBar{display:none!important}
    #jp-main-dock-panel,#jp-main-split-panel,#jp-main-vsplit-panel,#jp-main-content-panel{contain:none!important}.jp-NotebookPanel{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-width:0!important}.jp-NotebookPanel-toolbar{min-height:36px;width:100%!important;height:36px!important}.jp-NotebookPanel-notebook{width:100%!important;height:calc(100vh - 36px)!important;top:36px!important}.jp-Notebook{background:#fff}.jp-MarkdownCell img{max-width:100%;max-height:365px;object-fit:contain}.jp-OutputArea .jp-RenderedSVG svg,.jp-OutputArea .jp-RenderedHTMLCommon svg{max-width:100%!important;height:auto!important;display:block}.jp-OutputArea .jp-RenderedImage img{max-width:100%;height:auto}.jp-OutputArea .widget-box{max-width:100%;min-width:0}.ki-autostart-status{font-size:11px!important}`;
  document.head.append(style);
  const send = data => window.parent.postMessage({channel:'ki-portal-v1',path,revision,kernelId:panel?.sessionContext.session?.kernel?.id,...data},origin);
  let panel, ready = false, busy = false, restoring = false, error = null, timer, dirty = false, revision = 0;
  const announce = () => send({type:'ready',ready,error});
  const changed = () => {
    if (!ready || restoring) return;
    revision++;
    dirty = true;
    send({type:'dirty'});
    clearTimeout(timer);
    timer = setTimeout(autoSave,600);
  };
  const attach = async p => {
    if (p.context.path !== path) return;
    panel = p;
    p.content.notebookConfig = {...p.content.notebookConfig,windowingMode:'none'};
    await p.context.ready;
    await app.restored;
    app.shell.mode = 'single-document';
    app.shell.collapseLeft(); app.shell.collapseRight(); app.shell.activateById(p.id);
    p.context.model.contentChanged.connect(changed);
    await p.sessionContext.ready;
    // Sliders, uploads and Output widgets can change without a notebook-cell edit.
    p.sessionContext.session?.kernel?.iopubMessage.connect((_,message) => {
      if (message.header.msg_type === 'comm_msg') changed();
    });
    window.dispatchEvent(new Event('resize'));
  };
  tracker.widgetAdded.connect((_,p) => { void attach(p); });
  tracker.forEach(p => { void attach(p); });
  const checkedNotebook = nb => {
    if (!nb || nb.nbformat!==4 || !Array.isArray(nb.cells) || nb.cells.length>200 || JSON.stringify(nb).length>50000000) throw Error('Ungültiges oder zu grosses Notebook.');
    if (nb.cells.some(c=>!['code','markdown','raw'].includes(c.cell_type))) throw Error('Unbekannter Zelltyp.');
    return nb;
  };
  async function waitIdle() {
    const kernel = panel.sessionContext.session?.kernel, end = Date.now()+25000;
    while (Date.now()<end) {
      if (kernel?.status==='idle') {
        await new Promise(resolve=>setTimeout(resolve,250));
        if (kernel.status==='idle') return;
      } else await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw Error('Der Versuch läuft noch. Bitte warten und erneut versuchen.');
  }
  async function snapshot() {
    const savedRevision=revision;
    await waitIdle();
    const kernel = panel.sessionContext.session.kernel;
    // Export only document data, widget values/outputs and uploaded file bytes.
    // Do not pickle Python objects or retain/restore a live namespace.
    const code = `import json as _portal_json
import sys as _portal_sys
_portal_widgets = _portal_sys.modules.get('ipywidgets')
_portal_protocol = None
_portal_error = None
try:
    if 'experiment' in globals() and 'ki' in globals():
        _portal_protocol = ki.protokoll(experiment, export=False)
except Exception as _portal_exc:
    _portal_error = str(_portal_exc)
print(_portal_json.dumps({'widgets': _portal_widgets.Widget.get_manager_state() if _portal_widgets else {}, 'protocol': _portal_protocol, 'protocolError': _portal_error}, ensure_ascii=False))`;
    const future = kernel.requestExecute({code,silent:true,store_history:false,stop_on_error:true});
    let stdout = '';
    future.onIOPub = message => { if(message.header.msg_type==='stream' && message.content.name==='stdout') stdout+=message.content.text; };
    const reply = await future.done;
    if (reply.content.status!=='ok') throw Error('Notebook-Daten konnten nicht vollständig gelesen werden. Bitte erneut sichern.');
    const data = JSON.parse(stdout);
    const notebook = portableNotebook(panel.context.model.toJSON(),data.widgets);
    return {notebook,revision:savedRevision,protocol:data.protocol,protocolError:data.protocolError,files:uploadedFiles(data.widgets)};
  }
  async function autoSave() {
    if (!ready || !dirty || !panel || panel.isDisposed) return;
    if (busy) { timer=setTimeout(autoSave,600); return; }
    busy = true;
    // Keep editing available during background saves. Edits while the snapshot
    // runs are detected by the model's revision below and get another save.
    const before = revision;
    try {
      send({type:'changed',...await snapshot()});
      dirty = revision!==before;
      if (dirty) send({type:'dirty'});
    } catch (err) {
      send({type:'save-error',error:String(err.message||err)});
      dirty = true;
    } finally {
      busy = false;
      if (dirty) timer=setTimeout(autoSave,1500);
    }
  }
  window.addEventListener('message',async event => {
    if (event.origin!==origin || event.source!==window.parent || event.data?.channel!=='ki-portal-v1') return;
    const {type,id,notebook,keepKernel} = event.data;
    if (!panel || panel.isDisposed) return;
    if (type==='hello') { announce(); return; }
    if (!['snapshot','restore'].includes(type)) return;
    // A background save must not turn a user's download into a spurious error.
    const until=Date.now()+28000;
    while(busy && Date.now()<until) await new Promise(resolve=>setTimeout(resolve,50));
    if (busy) { send({type:'error',id,error:'Sicherung läuft. Bitte kurz warten.'}); return; }
    if (!ready) { send({type:'error',id,error:'Die Lernumgebung startet noch.'}); return; }
    busy=true; restoring=type==='restore'; panel.node.inert=true; clearTimeout(timer);
    try {
      if (type==='snapshot') {
        send({type:'snapshot',id,...await snapshot()});
      } else {
        const nb = portableNotebook(checkedNotebook(notebook));
        for (const cell of nb.cells) if (cell.metadata) delete cell.metadata.trusted;
        await waitIdle();
        if (!keepKernel) { await panel.sessionContext.session.kernel.restart(); await waitIdle(); }
        const preparation = nb.cells.find(c=>c.cell_type==='code');
        if (preparation) preparation.metadata={...preparation.metadata,jupyter:{...preparation.metadata?.jupyter,source_hidden:false}};
        panel.context.model.fromJSON(nb);
        await panel.context.save();
        send({type:'restored',id,notebook:nb});
      }
      dirty=false;
    } catch (err) { send({type:'error',id,error:String(err.message||err)}); }
    finally { busy=false; restoring=false; panel.node.inert=false; }
  });
  return {
    path,
    restoreOnly: query.get('ki-restore')==='1',
    async initialized(p,success) {
      if (p.context.path!==path) return;
      panel=p;
      if (success) { try { await waitIdle(); } catch { success=false; } }
      ready=success;
      error=success?null:'Start fehlgeschlagen. Auf der Kursseite den Versuch erneut öffnen.';
      announce();
    }
  };
}
