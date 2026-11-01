import {bindLabFullscreen,bindNotebookDialog} from './lab-fullscreen.js';
import {makeZip,readZip,escapeHTML as esc} from './archive.js';
import experiments from './experiments.json' with {type:'json'};
const $=id=>document.getElementById(id),all=s=>[...document.querySelectorAll(s)];
const SCHEMA='ki-kursportal-v1',KEY='kst-ki-kursportal-v1';
// Content and permanent markup are authored only in kursseiten/.
// Controller code below handles persistence, notebooks, ZIP and ephemeral widgets.
const journalFields=all('[data-journal]'),answerFields=all('[data-answer]');
let state={schema:SCHEMA,journal:{},answers:{},files:[]},notebook=null,protocol=null,protocolSignature='',files=new Map(),db=null;
let others={},filesStored=true,artifactStored=true,notebookDirty=false,notebookRevision=0;
let saving=Promise.resolve(),notebookUpdates=Promise.resolve(),fileUpdates=Promise.resolve(),artifactVersion=0,transferring=false;
const pending=new Map();
const status=(message,error=false)=>{$('portal-save-status').textContent=message;$('portal-save-status').classList.toggle('save-error',error);};
function checkNotebook(nb){
 if(nb?.nbformat!==4||!Array.isArray(nb.cells)||nb.cells.filter(c=>!c.metadata?.['ki-journal-export']).length>200||JSON.stringify(nb).length>50000000||nb.cells.some(c=>!['code','markdown','raw'].includes(c.cell_type)))throw Error('Ungültiges oder zu grosses Notebook.');
 return nb;
}
const cleanState=raw=>{
 if(raw?.schema!==SCHEMA)throw Error('Keine gültige Kurssicherung.');
 const result={schema:SCHEMA,journal:{},answers:{},files:[]};
 for(const e of journalFields)result.journal[e.dataset.journal]=typeof raw.journal?.[e.dataset.journal]==='string'?raw.journal[e.dataset.journal].slice(0,20000):'';
 for(const e of answerFields)result.answers[e.dataset.answer]=typeof raw.answers?.[e.dataset.answer]==='string'?raw.answers[e.dataset.answer].slice(0,10000):'';
 if(!Array.isArray(raw.files)||raw.files.length>200)throw Error('Ungültige Dateiliste.');
 result.files=raw.files.map(f=>{if(!f || !/^[a-zA-Z0-9_-]{1,80}$/.test(f.id) || typeof f.name!=='string' || f.name.length>300)throw Error('Ungültiger Dateieintrag.');return{id:f.id,name:f.name,type:typeof f.type==='string'?f.type:'application/octet-stream'};});
 if(new Set(result.files.map(f=>f.id)).size!==result.files.length)throw Error('Doppelte Datei-ID.');
 return result;
};
function saveText(){
 try{localStorage.setItem(KEY,JSON.stringify(state));status(filesStored&&artifactStored?'Journal in diesem Browser gespeichert.':'Text gespeichert; Dateien / Versuch jetzt Notizen & Projekt herunterladen.',!(filesStored&&artifactStored));}
 catch{status('Speichern nicht möglich – Notizen & Projekt herunterladen.',true);}
 updateChecks();
}
function transaction(store,mode,action){
 if(!db)return Promise.reject(Error('Browserspeicher nicht verfügbar'));
 return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);action(tx.objectStore(store));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Speichern abgebrochen'));});
}
function read(store,key){return new Promise((resolve,reject)=>{const q=db.transaction(store).objectStore(store).get(key);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});}
function persistArtifacts(){
 const version=++artifactVersion,payload={notebook,protocol,protocolSignature,others};artifactStored=false;
 saving=saving.then(()=>transaction('artifacts','readwrite',s=>s.put(payload,'project'))).then(()=>{
  if(version===artifactVersion){artifactStored=true;status(notebookDirty?'Notebook wird gesichert …':'Notizen und Notebooks in diesem Browser gespeichert.');}
 }).catch(()=>{artifactStored=false;status('Notebook nur vorübergehend verfügbar – Notizen & Projekt herunterladen.',true);});
 return saving;
}
function signature(nb){return JSON.stringify(nb?.cells?.filter(c=>c.cell_type==='code').slice(1).map(c=>({source:c.source,outputs:c.outputs}))||[]);}
function capture(nb,newProtocol=undefined){
 if(!nb||nb.nbformat!==4||!Array.isArray(nb.cells))return;
 const nextSignature=signature(nb);
 if(nextSignature!==protocolSignature){protocol=null;protocolSignature='';}
 notebook=nb;
 if(newProtocol){protocol=newProtocol;protocolSignature=nextSignature;}
 persistArtifacts();updateChecks();
}
function captureOther(name,nb){
 if(!names[name]||name===projectName||!nb||nb.nbformat!==4||!Array.isArray(nb.cells))return;
 others[name]=nb;persistArtifacts();
}
function archiveName(f){return 'daten/'+f.id+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'_').replace(/\.{2,}/g,'_');}
async function rememberFiles(selected){
 for(const f of selected){
  if(!f.name||f.name.length>300)throw Error('Ungültiger Dateiname.');
  const bytes=await f.arrayBuffer(),hash=await crypto.subtle.digest('SHA-256',await new Blob([f.name,'\0',bytes]).arrayBuffer());
  const id=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
  if(files.has(id))continue;
  if([...files.values()].reduce((s,b)=>s+b.size,0)+f.size>500*1024*1024||state.files.length>=200)throw Error('Maximal 500 MB und 200 Dateien pro Paket.');
  files.set(id,f);state.files.push({id,name:f.name,type:f.type});
  await transaction('files','readwrite',s=>s.put(f,id)).catch(()=>{filesStored=false;});
 }
 saveText();renderFiles();
}
async function captureSnapshot(name,data){
 if(data.files?.length){
  const selected=data.files.map(f=>new File([Uint8Array.from(atob(f.content),c=>c.charCodeAt(0))],f.name,{type:f.type}));
  fileUpdates=fileUpdates.catch(()=>{}).then(()=>rememberFiles(selected));await fileUpdates;
 }
 if((data.revision||0)>=notebookRevision)notebookDirty=false;
 if(name===projectName)capture(data.notebook,data.protocol);else captureOther(name,data.notebook);
 if(data.protocolError)status('Notebook gespeichert; Protokoll noch unvollständig: '+data.protocolError,true);
 await saving;
}
function render(){
 journalFields.forEach(e=>e.value=state.journal[e.dataset.journal]||'');
 answerFields.forEach(e=>e.value=state.answers[e.dataset.answer]||'');
 renderFiles();updateChecks();
 document.dispatchEvent(new Event('ki-answers-rendered'));
}
function renderFiles(){
 $('attachment-list').replaceChildren();
 for(const f of state.files){const li=document.createElement('li'),text=document.createElement('span'),button=document.createElement('button');text.textContent=f.name+(files.has(f.id)?' · '+Math.ceil(files.get(f.id).size/1024)+' KB':' · Datei fehlt – erneut hinzufügen');button.className='btn compact';button.textContent='Entfernen';button.setAttribute('aria-label',f.name+' entfernen');button.addEventListener('click',async()=>{files.delete(f.id);state.files=state.files.filter(x=>x.id!==f.id);await transaction('files','readwrite',s=>s.delete(f.id)).catch(()=>{});saveText();renderFiles();});li.append(text,button);$('attachment-list').append(li);}
}
function missing(){
 const items=[];
 if(!state.journal.names?.trim())items.push('Namen');
 if(!state.journal.class?.trim())items.push('Klasse / Projekttitel');
 const required=['purpose','hypothesis','groups','sources','data_limits','comparison','selection','test','examples','limits','conclusion','contribution'];
 const absent=required.filter(k=>!state.journal[k]?.trim()).length;if(absent)items.push(absent+' Journalfelder');
 if(!notebook)items.push('Versuchsnotebook');
 if(!protocol?.abschlusstest)items.push('Protokoll mit Abschlusstest');
 if(!state.files.some(f=>/\.json$/i.test(f.name)))items.push('Fotostudio-JSON');
 if(!state.files.some(f=>/\.(zip|jpe?g|png|webp)$/i.test(f.name)))items.push('Originalfotos / Foto-ZIP');
 if(state.files.some(f=>!files.has(f.id)))items.push('fehlende Datendateien');
 return items;
}
function updateChecks(){
 all('.journal-step').forEach(d=>{const inputs=[...d.querySelectorAll('[data-journal]')];d.querySelector('.completion').textContent=inputs.filter(e=>e.value.trim()).length+' / '+inputs.length;});
 const absent=missing();$('submission-check').textContent=absent.length?'Noch prüfen: '+absent.join(' · '):'Alle Bestandteile vorhanden. Inhalt und Ergebnisse vor der Abgabe nochmals prüfen.';
}
const initialization=(async()=>{
 try{const raw=localStorage.getItem(KEY);if(raw)state=cleanState(JSON.parse(raw));else{const old=window.KIProgress?.get();if(old){state.journal.purpose=old.notes?.topic||old.topic||'';state.journal.groups=old.notes?.data||'';state.journal.hypothesis=old.notes?.question||'';}}}catch{status('Gespeicherter Text konnte nicht geladen werden. Projektstand hochladen.',true);}
 render();
 try{
  db=await new Promise((resolve,reject)=>{const q=indexedDB.open('kst-ki-kursportal',1);q.onupgradeneeded=()=>{q.result.createObjectStore('files');q.result.createObjectStore('artifacts');};q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);q.onblocked=()=>reject(Error('Browserspeicher blockiert'));});
  const artifact=await read('artifacts','project');if(artifact){notebook=artifact.notebook;protocol=artifact.protocol;protocolSignature=artifact.protocolSignature||'';if(artifact.others&&typeof artifact.others==='object')others=artifact.others;}
  for(const f of state.files){const b=await read('files',f.id);if(b)files.set(f.id,b);}
 }catch{filesStored=false;status('Dateien werden nicht dauerhaft gespeichert. Notizen & Projekt herunterladen.',true);}
 renderFiles();updateChecks();
})();
for(const e of journalFields)e.addEventListener('input',()=>{state.journal[e.dataset.journal]=e.value;saveText();});
for(const e of answerFields)e.addEventListener('input',()=>{state.answers[e.dataset.answer]=e.value;saveText();});
all('[data-choose]').forEach(b=>b.addEventListener('click',()=>{if(!state.journal.purpose?.trim()){state.journal.purpose=b.dataset.choose;render();saveText();}}));
$('attachments').addEventListener('change',async e=>{
 await initialization;
 const selected=[...e.target.files];let total=[...files.values()].reduce((s,f)=>s+f.size,0);
 try{
    for(const f of selected){if(!/\.(json|zip|jpe?g|png|webp)$/i.test(f.name))throw Error('Bitte nur Fotodaten oder Foto-ZIP hinzufügen.');total+=f.size;}
  if(total>500*1024*1024 || state.files.length+selected.length>200)throw Error('Maximal 500 MB und 200 Dateien pro Paket. Fotos bei Bedarf vorher verkleinern.');
  fileUpdates=fileUpdates.catch(()=>{}).then(()=>rememberFiles(selected));await fileUpdates;
 }catch(error){$('download-status').textContent=error.message;}finally{e.target.value='';}
});
// One fixed iframe, one standard Jupyter session at a time. No live state is moved.
const names=Object.fromEntries(experiments.map(e=>[e.source.split('/').pop(),e.title]));
const frame=$('project-frame'),lab=$('project-lab'),projectName=experiments.find(e=>e.project).source.split('/').pop();
let activeName='',activeOwner='',switching=false,initializingFrame=false;
function startNotebookFrame(name,saved,kind){
 frame.dataset.ready='no';delete frame.dataset.restored;
 frame.dataset.startKind=kind;frame.dataset.startMs=String(performance.now());
 notebookLoading('loading',saved?'Gesicherten Notebook-Stand laden …':'Python und interaktive Übungen werden vorbereitet …');
 frame.src='../lab/index.html?path='+encodeURIComponent('portal/'+name)+'&ki-embed=1&reset'+(saved?'&ki-restore=1':'');
}
function trackNotebookReady(name){
 const milliseconds=Math.round(performance.now()-Number(frame.dataset.startMs||performance.now()));
 (window.KINotebookTimings ||= []).push({name,kind:frame.dataset.startKind||'open',milliseconds});
 frame.dataset.loadMs=String(milliseconds);
}
function refreshNotebookFrame(){
 requestAnimationFrame(()=>{try{frame.contentWindow?.dispatchEvent(new Event('resize'));}catch{}});
}
const loader=$('project-lab-loading'),loaderText=$('project-lab-loading-text'),loaderRetry=$('project-lab-retry');
let loaderTimeout;
function notebookLoading(phase,message='') {
 clearTimeout(loaderTimeout);
 loader.dataset.state=phase;
 loader.hidden=phase==='ready';
 frame.inert=phase!=='ready';
 loaderRetry.hidden=phase!=='error';
 if(message)loaderText.textContent=message;
 if(phase==='loading'){
  const expected=activeName;
  loaderTimeout=setTimeout(()=>{
   if(activeName!==expected||frame.dataset.ready==='yes'||frame.dataset.ready==='error')return;
   frame.dataset.ready='error';
   const error='Der Notebook-Start dauert zu lange. Bitte erneut versuchen.';
   $('project-lab-status').textContent=error;
   notebookLoading('error',error);
  },180000);
 }
}
loaderRetry.addEventListener('click',()=>{if(activeName)void showNotebook(activeName,activeOwner,false);});
window.addEventListener('ki-notebook-warmup',event=>{
 const name=event.detail?.name;
 if(!names[name]||activeName||switching||transferring)return;
 void (async()=>{
  await initialization;
  if(activeName||switching||transferring||document.visibilityState!=='visible')return;
  activeName=name;activeOwner='';initializingFrame=false;notebookRevision=0;notebookDirty=false;
  const saved=name===projectName?notebook:others[name];
  $('project-lab-status').textContent='Python wird im Hintergrund vorbereitet …';
  startNotebookFrame(name,saved,'warmup');
 })().catch(error=>console.warn('Notebook-Vorbereitung:',error));
});
// Never move an already loaded iframe. Saved documents are the source of truth;
// every new frame has a fresh Python kernel, including after a page reload.
document.querySelector('main > .footer').before(lab);$('lesson-lab').remove();
const overlay=bindNotebookDialog(lab);
function request(frame,type,extra={}){return new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Notebook antwortet noch nicht. Warten und erneut versuchen.'));},type==='restore'?120000:60000);pending.set(id,{resolve,reject,timer,source:frame.contentWindow});frame.contentWindow.postMessage({channel:'ki-portal-v1',type,id,...extra},location.origin);});}
function visibility(){const view=document.getElementById(activeOwner);lab.hidden=!overlay.isOpen||!activeName||!view||view.classList.contains('view-hidden');}
async function snapshotCurrent(){
 await notebookUpdates;
 if(!activeName)return;
 if(frame.dataset.ready!=='yes')throw Error('Das Notebook ist noch nicht bereit. Bitte warten oder erneut öffnen.');
 await captureSnapshot(activeName,await request(frame,'snapshot'));
}
async function showNotebook(name,owner,scroll=true,trigger=null){
 if(!names[name]||switching||transferring)return;
 switching=true;
 try{
  await initialization;
  // Keep the dialog attached to the page rather than reparenting its iframe
  // into each lesson card: a DOM move can restart the entire Python runtime.
  if(name!==activeName||frame.dataset.ready==='error'){
   if(activeName&&frame.dataset.ready==='yes')await snapshotCurrent();
   activeName=name;initializingFrame=false;notebookRevision=0;notebookDirty=false;
   // Switching notebooks requires a fresh kernel. Reopening the SAME one
   // preserves the warmed iframe, including clicks during its startup.
   const saved=name===projectName?notebook:others[name];
   $('project-lab-status').textContent=saved?'Gesichertes Notebook wird geöffnet …':'Python startet …';
   startNotebookFrame(name,saved,'open');
  }
  activeOwner=owner;$('project-lab-title').textContent=names[name];
  overlay.open(trigger || document.activeElement);visibility();refreshNotebookFrame();
  lab.querySelector('details').hidden=name!==projectName;
  lab.querySelector('a[href="#journal"]').hidden=name!==projectName;
  // Dialog focus replaces scrolling a large inline notebook into the lesson.
 }catch(error){$('project-lab-status').textContent=error.message;notebookLoading('error',error.message+' Bitte erneut versuchen.');}
 finally{switching=false;}
}
$('start-project').addEventListener('click',()=>showNotebook(projectName,'journal',true,$('start-project')));
// The same-origin Fotostudio grows with its content, avoiding a second scrollbar.
let studioHeightObserver=null;
$('studio-frame').addEventListener('load',()=>{
 studioHeightObserver?.disconnect();
 const frame=$('studio-frame'),body=frame.contentDocument?.body;
 if(!body)return;
 const adjust=()=>{frame.style.height=Math.max(760,body.scrollHeight+28)+'px';};
 adjust();
 if('ResizeObserver' in window){studioHeightObserver=new ResizeObserver(adjust);studioHeightObserver.observe(body);}
});
$('start-studio').addEventListener('click',()=>{const frame=$('studio-frame');$('studio-panel').hidden=false;if(!frame.getAttribute('src'))frame.src='studio/index.html';$('studio-panel').scrollIntoView({block:'start',behavior:'smooth'});});
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-lab]');
 if(!button||!button.closest('main'))return;
 void showNotebook(button.dataset.lab,button.closest('main > section')?.id||'projekt',true,button);
});
window.addEventListener('hashchange',()=>{visibility();if(location.hash==='#journal'&&activeName)void showNotebook(projectName,'journal',false,$('start-project'));});
// Match the teacher editor: expand/collapse is one persistent icon button,
// kept in sync with the browser's fullscreen state (including Escape).
all('[data-fullscreen]').forEach(button=>{
 const frame=$(button.dataset.fullscreen);
 if(frame)bindLabFullscreen(button,frame.closest('.lab-panel'));
});
window.addEventListener('beforeunload',event=>{
 if(notebookDirty||!artifactStored||!filesStored||transferring){event.preventDefault();event.returnValue='Änderungen sind noch nicht vollständig gesichert.';}
});
window.addEventListener('message',async event=>{
 if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.channel!=='ki-portal-v1')return;
 const data=event.data,name=activeName;
 if(data.path!=='portal/'+name)return;
 if(data.id&&pending.has(data.id)){const p=pending.get(data.id);clearTimeout(p.timer);pending.delete(data.id);data.type==='error'?p.reject(Error(data.error)):p.resolve(data);return;}
 if(data.type==='ready'&&!initializingFrame&&frame.dataset.ready!=='yes'){
  if(data.error){frame.dataset.ready='error';$('project-lab-status').textContent=data.error;notebookLoading('error',data.error);return;}
  if(!data.ready)return;
  initializingFrame=true;
  try{
   await initialization;
   if(activeName!==name)return; // Another notebook superseded this startup.
   const saved=name===projectName?notebook:others[name];
   notebookLoading('loading',saved?'Gespeicherte Eingaben und Ergebnisse werden wiederhergestellt …':'Start abgeschlossen. Ergebnisse werden gesichert …');
   let restored=null;
   if(saved){restored=await request(frame,'restore',{notebook:saved,keepKernel:true});frame.dataset.restored='yes';}
   else await captureSnapshot(name,await request(frame,'snapshot'));
   if(activeName!==name)return; // An older warmup was superseded.
   frame.dataset.path=data.path;frame.dataset.kernelId=data.kernelId||'';frame.dataset.ready='yes';
   trackNotebookReady(name);
   notebookLoading('ready');
   $('project-lab-status').textContent=saved
     ? restored?.widgets?.activated
       ? 'Gesicherter Stand geladen · interaktive Widgets wieder aktiv.'
       : 'Gesicherter Stand geladen · veränderte Startzellen bitte manuell ausführen.'
     : 'Bereit · Eingaben und Ergebnisse werden in diesem Browser gesichert.';
  }catch(error){
   if(activeName===name){frame.dataset.ready='error';$('project-lab-status').textContent=error.message+' Versuch erneut öffnen.';notebookLoading('error',error.message+' Bitte erneut versuchen.');}
  }finally{if(activeName===name)initializingFrame=false;}
 }
 if(data.type==='dirty'){notebookRevision=Math.max(notebookRevision,data.revision||0);notebookDirty=true;status('Notebook wird gesichert …');}
 if(data.type==='save-error'){notebookDirty=true;status('Notebook noch nicht gesichert: '+data.error,true);}
 if(data.type==='changed'&&frame.dataset.ready==='yes'&&!transferring){
  notebookUpdates=notebookUpdates.then(()=>captureSnapshot(name,data)).catch(error=>{notebookDirty=true;status('Notebook noch nicht vollständig gesichert: '+error.message,true);});
 }
});
// All saved classroom answers also belong in the human-readable journal, not only kursstand.json.
function courseAnswers(){
 return answerFields.filter(e=>String(state.answers[e.dataset.answer]||'').trim()).map(e=>{
  const label=e.closest('label');
  const question=label?.querySelector('span')?.textContent?.trim()||
   [...document.querySelectorAll('label[for]')].find(l=>l.htmlFor===e.id)?.textContent?.trim()||
   e.getAttribute('aria-label')||e.closest('tr')?.querySelector('th')?.textContent?.trim()||e.dataset.answer;
  const chapter=e.closest('.kapitel')?.querySelector('.kapitel-titel')?.textContent?.trim()||
   e.closest('.protokoll-block')?.querySelector('h3')?.textContent?.trim()||'Weitere Unterrichtsaufgaben';
  const value=state.answers[e.dataset.answer];
  const answer=e.tagName==='SELECT'?(Array.from(e.options).find(o=>o.value===value)?.textContent?.trim()||value):value;
  return {chapter,question,answer};
 });
}
function notebookForExport(){
 if(!notebook)return null;
 const nb=structuredClone(notebook);nb.cells=nb.cells.filter(c=>!c.metadata?.['ki-journal-export']);
 const add=source=>({id:crypto.randomUUID(),cell_type:'markdown',metadata:{'ki-journal-export':true},source:source.split(/(?<=\n)/)});
 nb.cells.unshift(add('# Projektjournal\n\n'+state.journal.names+' · '+state.journal.class+'\n\nDie folgenden Antworten wurden auf der Kurswebseite verfasst.\n'));
 for(const e of exportFields())nb.cells.push(add('## '+e.previousElementSibling.textContent+'\n\n'+(state.journal[e.dataset.journal]||'Noch offen.')));
 const lessons=courseAnswers();
 if(lessons.length)nb.cells.push(add('## Antworten aus den Unterrichtsaufgaben\n\n'+lessons.map(e=>'### '+e.chapter+' – '+e.question+'\n\n'+e.answer).join('\n\n')));
 return nb;
}
function exportFields(){return journalFields.filter(e=>e.dataset.optional===undefined||state.journal[e.dataset.journal]?.trim());}
function journalHTML(){
 const sections=exportFields().map(e=>'<section><h2>'+esc(e.previousElementSibling.textContent)+'</h2><p>'+esc(state.journal[e.dataset.journal]||'Noch offen.').replace(/\n/g,'<br>')+'</p></section>').join('');
 const lessonSections=courseAnswers().map(e=>'<section><h3>'+esc(e.chapter+' · '+e.question)+'</h3><p>'+esc(e.answer).replace(/\n/g,'<br>')+'</p></section>').join('');
 const outputs=(notebook?.cells||[]).filter(c=>c.cell_type==='code').map(c=>{
  const body=(c.outputs||[]).map(o=>{if(o.data?.['image/png']){const png=Array.isArray(o.data['image/png'])?o.data['image/png'].join(''):o.data['image/png'];if(/^[A-Za-z0-9+/=\s]+$/.test(png))return '<img alt="Versuchsausgabe" src="data:image/png;base64,'+png+'">';}const value=o.text||o.data?.['text/plain']||o.evalue||'';return value?'<pre>'+esc(Array.isArray(value)?value.join(''):value)+'</pre>':'';}).join('');
  return body?'<section><details><summary>Ausgeführter Code</summary><pre>'+esc(Array.isArray(c.source)?c.source.join(''):c.source)+'</pre></details>'+body+'</section>':'';
 }).join('');
 return '<!doctype html><html lang="de-CH"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KI-Projektjournal</title><style>body{max-width:900px;margin:45px auto;padding:0 24px;color:#182b31;font:16px/1.6 system-ui}h1,h2{line-height:1.2}h2{font-size:20px}section{margin:24px 0;padding-bottom:18px;border-bottom:1px solid #ddd}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f1f5f2;padding:15px;font-size:12px}img{max-width:100%;height:auto}.meta{color:#52656a}@media print{details{display:none}section{break-inside:avoid}}</style><h1>Unser KI-Projekt</h1><p class="meta">'+esc(state.journal.names)+' · '+esc(state.journal.class)+'<br>Exportiert: '+esc(new Date().toLocaleString('de-CH'))+'</p>'+sections+'<h1>Unterrichtsantworten</h1>'+(lessonSections||'<p>Noch keine Antworten zu Unterrichtsaufgaben eingetragen.</p>')+'<h1>Versuchsausgaben</h1>'+(outputs||'<p>Noch keine Ausgaben gesichert.</p>')+'<h2>Versuchsprotokoll</h2><pre>'+esc(protocol?JSON.stringify(protocol,null,2):'Noch kein Protokoll verfügbar.')+'</pre><h2>Datendateien</h2><ul>'+state.files.map(f=>'<li>'+esc(f.name)+'</li>').join('')+'</ul></html>';
}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function pack(submission){
 await initialization;
 if(transferring||switching)return;
 transferring=true;
 const button=$(submission?'download-submission':'download-backup');button.disabled=true;$('download-status').textContent='Paket wird vorbereitet …';
 try{
  await snapshotCurrent();await fileUpdates;await saving;
  if(state.files.some(f=>!files.has(f.id)))throw Error('Einige Datendateien fehlen. Bitte erneut hinzufügen.');
  const absent=missing();if(submission&&absent.length&&!confirm('Noch unvollständig: '+absent.join(', ')+'. Trotzdem diesen Stand herunterladen?'))return;
  const savedNames=Object.keys(others).filter(name=>names[name]&&name!==projectName);
  const snapshot={...state,exported:new Date().toISOString(),progress:window.KIProgress?.get(),protocol,protocolSignature,notebooks:[...(notebook?['versuch.ipynb']:[]),...savedNames.map(name=>'notebooks/'+name)]};
    const entries=[{name:'kursstand.json',data:JSON.stringify(snapshot,null,2)},{name:'Journal.html',data:journalHTML()},{name:'LESEN.txt',data:'Journal.html enthält das Projektjournal, die Unterrichtsantworten (auch Auswahlfelder) und Versuchsausgaben.\nkursstand.json enthält auch Unterrichtsantworten, Häkchen und Selbsteinschätzungen.\nversuch.ipynb und notebooks/ enthalten bearbeitete Notebooks mit Code, Markdown, eingebetteten Bildern und Ausgaben. Widget-Werte und Diagramme sind als lesbarer Stand gesichert.\nDie ZIP-Datei kann auf der Kursseite als Projektstand wiederhergestellt werden.\nHinzugefügte Dateien und im Notebook ausgewählte Uploads liegen unter daten/.\nOriginalfotos und eine noch offene Fotostudio-Sammlung müssen zusätzlich unter «Notizen & Projekt» hinzugefügt werden.\nPython-Variablen und trainierte Modelle im Arbeitsspeicher sind nicht gespeichert. Nach Wiederherstellung Vorbereitung, Datenimport und benötigte Berechnungen erneut ausführen.\nFür eine lokale Wiederholung: Python 3.12, numpy, scipy, scikit-learn, matplotlib, pillow, ipywidgets; Notebook-Zellen der Reihe nach ausführen und Fotostudio-JSON aus daten/ auswählen.\nDer Download ist keine automatische Einreichung.\n'}];
  const nb=notebookForExport();if(nb)entries.push({name:'versuch.ipynb',data:JSON.stringify(checkNotebook(nb),null,1)});
  if(protocol)entries.push({name:'Versuchsprotokoll.json',data:JSON.stringify(protocol,null,2)});
  for(const name of savedNames)entries.push({name:'notebooks/'+name,data:JSON.stringify(checkNotebook(others[name]),null,1)});
  for(const f of state.files)entries.push({name:archiveName(f),data:files.get(f.id)});
  if(nb||savedNames.length){for(const file of ['ki_foto_tools.py','ki_projekt_tools.py','foto_uebungsdaten.json','unterricht_tools.py']){
   const r=await fetch('runtime/'+file);if(!r.ok)throw Error('Hilfsdateien konnten nicht geladen werden. Internetverbindung prüfen.');
   const data=await r.blob(),name=file==='unterricht_tools.py'?file:'ki_projekt/'+file;
   entries.push({name,data});if(savedNames.length)entries.push({name:'notebooks/'+name,data});
  }}
  const blob=await makeZip(entries);if(blob.size>550*1024*1024)throw Error('Das ZIP ist zu gross zum Wiederherstellen (maximal 550 MB).');
  download(blob,(submission?'KI-Abgabe':'KI-Projektstand')+'-'+new Date().toISOString().slice(0,10)+'.zip');$('download-status').textContent=submission?'Abgabepaket heruntergeladen. '+(absent.length?'Noch offen: '+absent.join(' · '):'Vor dem Einreichen das Journal kurz prüfen.'):'Notizen, gespeicherte Notebooks und hinzugefügte Dateien heruntergeladen.';
 }catch(error){$('download-status').textContent='Download nicht erstellt: '+error.message;}finally{button.disabled=false;transferring=false;}
}
$('download-submission').addEventListener('click',()=>pack(true));$('download-backup').addEventListener('click',()=>pack(false));
$('restore-package').addEventListener('change',async e=>{
 await initialization;const file=e.target.files[0];if(!file)return;
 if(transferring||switching){e.target.value='';return;}transferring=true;
 try{
  await notebookUpdates;await saving;await fileUpdates;
  const unpacked=await readZip(file),raw=JSON.parse(await unpacked.get('kursstand.json').text()),next=cleanState(raw),nextFiles=new Map();
  if(raw.progress && raw.progress.schema!=='ki-projekt-seitenstand-v1')throw Error('Ungültiger Projekt-Seitenstand.');
  if(raw.notebooks!==undefined&&(!Array.isArray(raw.notebooks)||raw.notebooks.some(name=>typeof name!=='string'||!unpacked.has(name))))throw Error('Ein gesichertes Notebook fehlt im ZIP.');
  let nextNotebook=null;
  if(unpacked.has('versuch.ipynb')){nextNotebook=checkNotebook(JSON.parse(await unpacked.get('versuch.ipynb').text()));nextNotebook.cells=nextNotebook.cells.filter(c=>!c.metadata?.['ki-journal-export']);}
  const nextOthers={};
  for(const name of Object.keys(names)){
   if(name===projectName||!unpacked.has('notebooks/'+name))continue;
   const nb=JSON.parse(await unpacked.get('notebooks/'+name).text());
   nextOthers[name]=checkNotebook(nb);
  }
  for(const f of next.files){const name=archiveName(f);if(!unpacked.has(name))throw Error('Datendatei fehlt: '+f.name);nextFiles.set(f.id,new Blob([unpacked.get(name)],{type:f.type}));}
    if(!confirm('Aktuelle Notizen, Versuch und Dateien durch diesen Projektstand ersetzen? Ungesicherte Änderungen gehen verloren.'))return;
  // Close the old document first, even if the imported ZIP contains no notebook.
  // Its late events must never resurrect a previous tandem's work.
  frame.src='about:blank';activeName='';activeOwner='';initializingFrame=false;frame.dataset.ready='no';notebookDirty=false;notebookLoading('ready');visibility();
  const nextArtifact={notebook:nextNotebook,others:nextOthers,protocol:raw.protocol||null,protocolSignature:raw.protocolSignature||''};
  try{
   if(!db)throw Error('Browserspeicher nicht verfügbar');
   await new Promise((resolve,reject)=>{
    const tx=db.transaction(['files','artifacts'],'readwrite'),store=tx.objectStore('files');
    store.clear();for(const [id,blob] of nextFiles)store.put(blob,id);
    tx.objectStore('artifacts').put(nextArtifact,'project');
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
   });filesStored=true;artifactStored=true;
  }catch{filesStored=false;artifactStored=false;}
  state=next;files=nextFiles;notebook=nextNotebook;others=nextOthers;protocol=nextArtifact.protocol;protocolSignature=nextArtifact.protocolSignature;
  window.KIProgress?.restore(raw.progress||{schema:'ki-projekt-seitenstand-v1'});
    render();saveText();$('download-status').textContent=filesStored&&artifactStored?'Projektstand wiederhergestellt. Notebook über die Kursseite öffnen; Vorbereitung und Datenimport erneut ausführen. Gespeicherte Ausgaben bleiben sichtbar; kein Code wurde automatisch ausgeführt.':'Projektstand wiederhergestellt, aber nur für diese Sitzung. Browserspeicher nicht verfügbar; ZIP ausserhalb des Browsers aufbewahren.';
 }catch(error){$('download-status').textContent='Import fehlgeschlagen: '+error.message;}finally{e.target.value='';transferring=false;}
});
// A small matching activity, deliberately separate from the assessed project.
const pairs=JSON.parse($('memory-pairs').textContent);
let flipped=[],locked=false,matches=0,memoryTimer;
function memory(){clearTimeout(memoryTimer);flipped=[];locked=false;matches=0;const cards=pairs.flatMap((p,i)=>p.map(text=>({text,pair:i})));for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}$('memory-board').replaceChildren();$('memory-status').textContent='Drehen Sie zwei Karten um.';for(const card of cards){const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.setAttribute('aria-label','Verdeckte Karte');b.addEventListener('click',()=>{if(locked||b.classList.contains('revealed')||b.classList.contains('matched'))return;b.classList.add('revealed');b.textContent=card.text;b.setAttribute('aria-label',card.text);flipped.push({b,pair:card.pair});if(flipped.length===2){if(flipped[0].pair===flipped[1].pair){flipped.forEach(x=>{x.b.classList.add('matched');x.b.disabled=true;});flipped=[];matches++;$('memory-status').textContent=matches===3?'Alle Paare gefunden. Begründen Sie die Zuordnung.':matches+' von 3 Paaren gefunden.';}else{locked=true;$('memory-status').textContent='Dieses Paar passt noch nicht zusammen.';memoryTimer=setTimeout(()=>{flipped.forEach(x=>{x.b.classList.remove('revealed');x.b.textContent='?';x.b.setAttribute('aria-label','Verdeckte Karte');});flipped=[];locked=false;},1000);}}});$('memory-board').append(b);}}
$('memory-reset').addEventListener('click',memory);memory();
