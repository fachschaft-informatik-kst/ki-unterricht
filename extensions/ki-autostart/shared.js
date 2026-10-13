import { CodeCell } from '@jupyterlab/cells';

// One persistent workspace document/kernel; course documents keep their own
// saved content and Python namespaces. No extra sessions or WebSockets.
export function setupShared(app, tracker, allowed) {
  const query=new URLSearchParams(location.search);
  if(query.get('ki-shared')!=='1'||window.parent===window)return false;
  const project='portal/ki_tandemprojekt.ipynb',workspace='portal/ki_workspace.ipynb',origin=location.origin;
  let kernel,panel,trustedSetup,active=project,ready=false,changing=false,timer,queue=Promise.resolve();
  const books=new Map(),started=new Set();
  const send=data=>window.parent.postMessage({channel:'ki-portal-v1',path:active,kernelId:kernel?.id,...data},origin);
  const style=document.createElement('style');
  style.textContent=`#jp-top-panel,#jp-menu-panel,#jp-bottom-panel,#jp-left-stack,#jp-right-stack,.jp-SideBar,.jp-StatusBar,.lm-DockPanel-tabBar{display:none!important}
  #jp-main-dock-panel,#jp-main-split-panel,#jp-main-vsplit-panel,#jp-main-content-panel{contain:none!important}
  .jp-NotebookPanel:not(.lm-mod-hidden){position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-width:0!important}
  .jp-NotebookPanel-toolbar{min-height:36px;width:100%!important;height:36px!important}.jp-NotebookPanel-notebook{width:100%!important;height:calc(100vh - 36px)!important;top:36px!important}
  .jp-MarkdownOutput img{display:block;max-height:365px;max-width:100%;width:auto;height:auto;margin:16px auto;object-fit:contain}`;
  document.head.append(style);
  const serial=task=>{const next=queue.then(task);queue=next.catch(()=>{});return next;};
  const valid=path=>allowed.has(path)&&path.startsWith('portal/');
  async function idle(){
    const end=Date.now()+120000;
    while(Date.now()<end){
      if(kernel?.status==='idle'){await new Promise(r=>setTimeout(r,100));if(kernel.status==='idle')return;}
      else await new Promise(r=>setTimeout(r,100));
    }
    throw Error('Python arbeitet noch. Bitte warten und erneut versuchen.');
  }
  async function execute(code){
    await idle();let stdout='';
    const future=kernel.requestExecute({code,silent:true,store_history:false,stop_on_error:true});
    future.onIOPub=m=>{if(m.header.msg_type==='stream'&&m.content.name==='stdout')stdout+=m.content.text;};
    const result=await future.done;await idle();
    if(result.content.status!=='ok')throw Error(result.content.evalue||'Python-Vorbereitung fehlgeschlagen.');
    return stdout;
  }
  async function namespace(path,reset=false){await execute(`import ki_portal_runtime as _ki_runtime\n_ki_runtime.activate(${JSON.stringify(path)}, reset=${reset?'True':'False'})`);}
  function capture(){const nb=panel.context.model.toJSON();books.set(active,nb);send({type:'changed',path:active,notebook:nb});return nb;}
  async function save(path){const nb=path===active?capture():books.get(path);if(nb)await app.serviceManager.contents.save(path,{type:'notebook',format:'json',content:nb});}
  async function display(nb){
    panel.context.model.fromJSON(structuredClone(nb));panel.content.update();
    // Widgets are populated on the next rendering turn, even when the document is ready.
    await new Promise(resolve=>setTimeout(resolve,100));
    if(panel.content.widgets.length!==nb.cells.length)throw Error('Notebookansicht ist noch nicht bereit. Bitte erneut öffnen.');
    window.dispatchEvent(new Event('resize'));
  }
  async function start(){
    if(started.has(active))return;
    // A restored project can contain arbitrary tags and edited setup cells.
    // Only the published preparation may ever run without a pupil's action.
    if(active===project){await execute(trustedSetup);started.add(active);return;}
    for(const cell of panel.content.widgets){
      if(cell.model.type!=='code'||!(cell.model.getMetadata('tags')||[]).includes('ki-autostart'))continue;
      const reply=await CodeCell.execute(cell,panel.sessionContext);
      if(reply?.content.status!=='ok')throw Error('Vorbereitung fehlgeschlagen. Fehlermeldung in der Codezelle prüfen.');
      await idle();
    }
    started.add(active);
  }
  async function open(path){
    if(!valid(path))throw Error('Unbekanntes Kursnotebook.');
    changing=true;panel.node.inert=true;
    try{
      await idle();await save(active);
      if(path!==active){
        const nb=books.get(path)||(await app.serviceManager.contents.get(path,{content:true,type:'notebook',format:'json'})).content;
        await namespace(path);active=path;await display(nb);
      }
      await start();capture();send({type:'ready',ready:true,path});
    }finally{changing=false;panel.node.inert=false;}
  }
  async function boot(p){
    panel=p;await panel.context.ready;
    panel.content.notebookConfig={...panel.content.notebookConfig,windowingMode:'none'};
    await panel.sessionContext.ready;kernel=panel.sessionContext.session?.kernel;
    if(!kernel)throw Error('Python konnte nicht gestartet werden.');
    const response=await fetch(new URL('../files/'+project,location.href));
    if(!response.ok)throw Error('Die Projektvorlage konnte nicht geladen werden.');
    const template=await response.json(),setup=template.cells.find(c=>c.cell_type==='code');
    trustedSetup=Array.isArray(setup.source)?setup.source.join(''):setup.source;
    await execute("from pathlib import Path\nimport sys\n_basis = Path.cwd().parent if Path.cwd().name == 'portal' else Path.cwd()\nsys.path[:0] = [str(_basis), str(_basis / 'ki_projekt')]");
    await namespace(project);await display((await app.serviceManager.contents.get(project,{content:true,type:'notebook',format:'json'})).content);await start();
    await app.restored;app.shell.mode='single-document';app.shell.activateById(panel.id);app.shell.collapseLeft();app.shell.collapseRight();
    panel.context.model.contentChanged.connect(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(ready&&!changing){capture();void serial(()=>save(active)).catch(error=>send({type:'error',error:error.message}));}},600);});
    ready=true;capture();send({type:'ready',ready:true,path:project});
  }
  let booting=false;
  const attach=p=>{if(p.context.path===workspace&&!booting){booting=true;void serial(()=>boot(p)).catch(error=>send({type:'ready',ready:false,error:error.message}));}};
  tracker.widgetAdded.connect((_,p)=>attach(p));tracker.forEach(attach);
  window.addEventListener('message',event=>{
    if(event.origin!==origin||event.source!==window.parent||event.data?.channel!=='ki-portal-v1')return;
    const {type,id,notebook}=event.data,path=event.data.path||project;
    if(type==='hello'){send({type:'ready',ready});return;}
    if(!ready){send({type:'error',id,error:'Python wird im Hintergrund vorbereitet.'});return;}
    void serial(async()=>{
      if(type==='open'){await open(path);send({type:'opened',id,path});return;}
      await idle();
      if(type==='snapshot'){
        await save(project);
        const text=await execute(`import json as _ki_json\nimport ki_portal_runtime as _ki_runtime\nprint(_ki_json.dumps(_ki_runtime.protocol(${JSON.stringify(project)}),ensure_ascii=False))`);
        send({type:'snapshot',id,path:project,notebook:books.get(project),protocol:JSON.parse(text.trim()||'null')});
      }else if(type==='restore'){
        if(!notebook||notebook.nbformat!==4||!Array.isArray(notebook.cells)||notebook.cells.length>100||JSON.stringify(notebook).length>20000000||notebook.cells.some(c=>!['code','markdown','raw'].includes(c.cell_type)))throw Error('Ungültiges Versuchsnotebook.');
        changing=true;panel.node.inert=true;
        try{
          await namespace(project,true);await execute(trustedSetup);await namespace(active);
          books.set(project,structuredClone(notebook));if(active===project)await display(notebook);
          await save(project);send({type:'restored',id,path:project,notebook:books.get(project)});
        }finally{changing=false;panel.node.inert=false;}
      }
    }).catch(error=>send({type:'error',id,error:error.message}));
  });
  return true;
}
