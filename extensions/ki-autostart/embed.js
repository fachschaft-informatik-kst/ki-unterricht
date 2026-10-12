// Same-origin bridge between the course website and its notebook iframe.
export function setupEmbed(app, tracker, allowed) {
  const query = new URLSearchParams(location.search);
  if (query.get('ki-embed') !== '1' || window.parent === window) return null;
  const path = query.get('ki-path') || query.get('path');
  if (!allowed.has(path) || !path.startsWith('portal/')) return null;
  const origin = location.origin;
  const style = document.createElement('style');
  style.textContent = `#jp-top-panel,#jp-menu-panel,#jp-bottom-panel,#jp-left-stack,#jp-right-stack,.jp-SideBar,.jp-StatusBar,.lm-DockPanel-tabBar{display:none!important}
    #jp-main-dock-panel,#jp-main-split-panel,#jp-main-vsplit-panel,#jp-main-content-panel{contain:none!important}.jp-NotebookPanel{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-width:0!important}.jp-NotebookPanel-toolbar{min-height:36px;width:100%!important;height:36px!important}.jp-NotebookPanel-notebook{width:100%!important;height:calc(100vh - 36px)!important;top:36px!important}.jp-Notebook{background:#fff}.ki-autostart-status{font-size:11px!important}`;
  document.head.append(style);
  const send = data => window.parent.postMessage({channel:'ki-portal-v1',path,...data},origin);
  let panel, ready = false, timer;
  const attach = async p => {
    if (p.context.path !== path) return;
    panel=p;
    // Small teaching notebooks: render every cell, including after importing a backup.
    p.content.notebookConfig={...p.content.notebookConfig,windowingMode:'none'};
    await p.context.ready;
    await app.restored;
    app.shell.mode='single-document';
    app.shell.collapseLeft();app.shell.collapseRight();
    app.shell.activateById(p.id);
    p.context.model.contentChanged.connect(() => {
      clearTimeout(timer);
      timer=setTimeout(()=>{if(!p.isDisposed && ready)send({type:'changed',notebook:p.context.model.toJSON()});},600);
    });
    window.dispatchEvent(new Event('resize'));
  };
  tracker.widgetAdded.connect((_,p)=>{void attach(p);});
  tracker.forEach(p=>{void attach(p);});
  const checkedNotebook = nb => {
    if (!nb || nb.nbformat!==4 || !Array.isArray(nb.cells) || nb.cells.length>100 || JSON.stringify(nb).length>20000000) throw Error('Ungültiges Versuchsnotebook.');
    if (nb.cells.some(c=>!['code','markdown','raw'].includes(c.cell_type))) throw Error('Unbekannter Zelltyp.');
    return nb;
  };
  async function waitIdle() {
    const kernel=panel.sessionContext.session?.kernel;
    const end=Date.now()+25000;
    while(Date.now()<end){
      if(kernel?.status==='idle'){
        await new Promise(resolve=>setTimeout(resolve,250));
        if(kernel.status==='idle')return;
      }else await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw Error('Der Versuch läuft noch. Bitte warten und erneut versuchen.');
  }
  window.addEventListener('message',async event=>{
    if(event.origin!==origin || event.source!==window.parent || event.data?.channel!=='ki-portal-v1')return;
    const {type,id,notebook}=event.data;
    if(!panel || panel.isDisposed)return;
    if(type==='hello'){send({type:'ready',ready});return;}
    if(!ready){send({type:'error',id,error:'Die Lernumgebung startet noch.'});return;}
    try {
      if(type==='snapshot'){
        await waitIdle();
        await panel.context.save();
        let protocol=null;
        if(path.endsWith('ki_tandemprojekt.ipynb') && panel.sessionContext.session?.kernel){
          const future=panel.sessionContext.session.kernel.requestExecute({code:"import json as _portal_json\nprint(_portal_json.dumps(ki.protokoll(experiment, export=False) if 'experiment' in globals() else None, ensure_ascii=False))",silent:true,store_history:false,stop_on_error:true});
          let stdout='';
          future.onIOPub=message=>{if(message.header.msg_type==='stream' && message.content.name==='stdout')stdout+=message.content.text;};
          const reply=await future.done;
          if(reply.content.status!=='ok')throw Error('Das Versuchsprotokoll konnte nicht gelesen werden.');
          protocol=JSON.parse(stdout.trim()||'null');
        }
        send({type:'snapshot',id,notebook:panel.context.model.toJSON(),protocol});
      }else if(type==='restore'){
        const nb=checkedNotebook(notebook);
        await waitIdle();
        // A restored document must never keep the previous experiment in memory.
        const setup = panel.content.widgets.find(c=>c.model.type==='code')?.model.sharedModel.getSource();
        await panel.sessionContext.restartKernel();
        panel.context.model.fromJSON(nb);
        if(setup){
          const reply=await panel.sessionContext.session.kernel.requestExecute({code:setup,silent:true,store_history:false,stop_on_error:true}).done;
          if(reply.content.status!=='ok')throw Error('Sicherung geladen, Vorbereitung bitte nochmals ausführen.');
        }
        await panel.context.save();
        await waitIdle();
        send({type:'restored',id,notebook:panel.context.model.toJSON()});
      }
    }catch(error){send({type:'error',id,error:String(error.message||error)});}
  });
  return {
    path,
    async initialized(p, success){
      if(p.context.path!==path)return;
      if(success){
        const kernel=p.sessionContext.session?.kernel;
        if(kernel && kernel.status!=='idle'){
          try{await new Promise((resolve,reject)=>{
            const changed=(_,status)=>{if(status==='idle'){clearTimeout(timeout);kernel.statusChanged.disconnect(changed);resolve();}};
            const timeout=setTimeout(()=>{kernel.statusChanged.disconnect(changed);reject(Error('Kernel not idle'));},30000);
            kernel.statusChanged.connect(changed);
          });}catch{success=false;}
        }
      }
      ready=success;
      send({type:'ready',ready,error:success?null:'Start fehlgeschlagen. Die erste Zelle nochmals ausführen.'});
    }
  };
}
