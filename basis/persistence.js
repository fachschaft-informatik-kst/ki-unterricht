import {makeZip,readZip} from '../projekt/archive.js';
import {bindLabFullscreen,bindNotebookDialog} from '../projekt/lab-fullscreen.js';

// The basic course has its own backup schema and does not alter the fourth-year portal.
const KEY='kst-ki-basis-v1', NBKEY='kst-ki-basis-notebooks-v1', SCHEMA='ki-basis-zip-v1';
const notebookNames=['basis_neuron.ipynb','xor_einzelne_neuronen.ipynb','basis_netze.ipynb','basis_bildmodell.ipynb','basis_fotoprojekt.ipynb'];
// The fourth-year course uses the same fixed lab panel and direct JupyterLite path.
const notebookTitles={
 'basis_neuron.ipynb':'Ein Neuron',
 'xor_einzelne_neuronen.ipynb':'XOR: Ein Neuron',
 'basis_netze.ipynb':'Neuronale Netze',
 'basis_bildmodell.ipynb':'Ziffern und Buchstaben',
 'basis_fotoprojekt.ipynb':'Eigene Fotos erkennen'
};
const panel=document.createElement('dialog');panel.id='basis-notebook-panel';panel.className='lab-panel';panel.hidden=true;
panel.innerHTML=`<div class="lab-head">
  <b id="basis-lab-title">Experiment</b>
  <span id="basis-lab-status" role="status">Noch kein Notebook geöffnet.</span>
  <button type="button" class="lab-fullscreen-toggle" id="basis-lab-fullscreen" aria-label="Notebook vergrössern" aria-pressed="false" title="Notebook vergrössern"></button>
</div>
<p class="small">Codezelle anklicken, ändern und mit Shift + Enter ausführen. Die Vorbereitung startet automatisch.</p>
<div class="lab-frame-shell">
  <div class="lab-loading" id="basis-lab-loading" data-state="loading" role="status" hidden>
    <div class="lab-loading-spinner" aria-hidden="true"></div>
    <p id="basis-lab-loading-text">Notebook wird vorbereitet …</p>
    <button type="button" class="btn compact" id="basis-lab-retry" hidden>Erneut öffnen</button>
  </div>
  <iframe id="basis-lab-frame" title="Jupyter Notebook" allow="clipboard-read; clipboard-write"></iframe>
</div>`;
const frame=panel.querySelector('iframe'),status=panel.querySelector('#basis-lab-status'),heading=panel.querySelector('#basis-lab-title');
const loader=panel.querySelector('#basis-lab-loading'),loaderText=panel.querySelector('#basis-lab-loading-text'),loaderRetry=panel.querySelector('#basis-lab-retry');
let loaderTimeout;
function notebookLoading(state,message=''){
 clearTimeout(loaderTimeout);loader.dataset.state=state;loader.hidden=state==='ready';
 frame.inert=state!=='ready';loaderRetry.hidden=state!=='error';
 if(message)loaderText.textContent=message;
 if(state==='loading'){
  const expected=current;
  loaderTimeout=setTimeout(()=>{
   if(current!==expected||ready)return;
   status.textContent='Notebook-Start dauert zu lange.';
   notebookLoading('error','Notebook reagiert nicht. Erneut öffnen oder die Kursseite neu laden.');
  },180000);
 }
}
bindLabFullscreen(panel.querySelector('#basis-lab-fullscreen'), panel);
const overlay=bindNotebookDialog(panel);
loaderRetry.addEventListener('click',()=>{if(current)void openNotebook(current,owner,true);});
let current=null,owner=null,ready=false,revision=0,restoring=false,changed=false;
let saved={},legacyNotebooks={},notebookUploads={},photoJSON=null;try{saved=JSON.parse(localStorage.getItem(NBKEY)||'{}')||{};}catch{}
const pending=new Map();
const storeReady=new Promise(resolve=>{
 if(!('indexedDB' in window)){resolve(null);return;}
 const req=indexedDB.open('kst-ki-basis-notebooks',1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('notebooks'))req.result.createObjectStore('notebooks');};
 req.onsuccess=()=>resolve(req.result);
 req.onerror=()=>resolve(null);
});
const loaded=(async()=>{const db=await storeReady;if(!db)return;
 try{const result=await new Promise((resolve,reject)=>{const tx=db.transaction('notebooks','readonly'),store=tx.objectStore('notebooks');let remaining=4;const values={};for(const name of ['all','uploads','photo','legacy']){const r=store.get(name);r.onsuccess=()=>{values[name]=r.result;if(!--remaining)resolve(values);};r.onerror=()=>reject(r.error);}});
 if(result.all&&typeof result.all==='object')saved={...saved,...result.all};
 if(result.uploads&&typeof result.uploads==='object')notebookUploads=result.uploads;
 if(result.photo?.content)photoJSON=result.photo;
 if(result.legacy&&typeof result.legacy==='object')legacyNotebooks=result.legacy;
 }catch(e){status.textContent='Gesicherte Notebooks konnten nicht gelesen werden: '+e.message;}
})();
async function persistDB(){const db=await storeReady;if(!db)return false;await new Promise((resolve,reject)=>{const tx=db.transaction('notebooks','readwrite');const store=tx.objectStore('notebooks');store.put(saved,'all');store.put(notebookUploads,'uploads');store.put(photoJSON,'photo');store.put(legacyNotebooks,'legacy');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});return true;}
// Older first-year notebook snapshots must not replace the new fourth-year-aligned lessons.
const mirroredFrom={'basis_neuron.ipynb':'content/perzeptron_und_neuronale_netze.ipynb','basis_netze.ipynb':'content/mehrschichtige_netze.ipynb'};
function matchesCurrentLesson(name,nb){return !mirroredFrom[name]||nb?.metadata?.ki_didaktik?.ursprung===mirroredFrom[name];}
function validate(nb){if(!nb||nb.nbformat!==4||!Array.isArray(nb.cells)||nb.cells.length>200||JSON.stringify(nb).length>50000000)throw Error('Ungültiges Notebook.');return nb;}
function request(type,extra={}){return new Promise((resolve,reject)=>{if(!frame.contentWindow)return reject(Error('Notebook nicht geladen'));const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Notebook antwortet nicht.'));},type==='restore'?120000:60000);pending.set(id,{resolve,reject,timer});frame.contentWindow.postMessage({channel:'ki-portal-v1',type,id,...extra},location.origin);});}
async function persist(){try{const durable=await persistDB();try{localStorage.setItem(NBKEY,JSON.stringify(saved));}catch{}if(!durable&&!localStorage.getItem(NBKEY))throw Error('Kein verfügbarer Speicher');status.textContent='Notebook im Browser gespeichert. Für eine vollständige Sicherung ZIP herunterladen.';}catch(e){changed=true;status.textContent='Notebook konnte nicht dauerhaft gespeichert werden: '+e.message+'. Bitte ZIP herunterladen.';}}
async function snapshot(){if(!current)return;if(!ready)throw Error('Notebook noch nicht bereit.');const result=await request('snapshot');saved[current]=validate(result.notebook);if(Array.isArray(result.files)&&result.files.length){notebookUploads[current]=result.files.filter(f=>f&&typeof f.name==='string'&&typeof f.content==='string'&&f.content.length<50000000).map(f=>({name:f.name,type:f.type||'application/octet-stream',content:f.content}));}await persist();}
// Never move a running JupyterLite iframe between lesson sections: moving it
// destroys the browser kernel and may discard in-flight student edits.
function mount(){
 if(!panel.isConnected)document.getElementById('basis-sicherung').before(panel);
 const hash=decodeURIComponent((location.hash||'').slice(1));
 const active=document.getElementById(hash)?.closest('main > section')?.id||hash;
 panel.hidden=!overlay.isOpen||!current||(active!==owner&&hash!=='basis-sicherung');
}
async function openNotebook(name,view,force=false,host=null){
 await loaded;
 if(!notebookNames.includes(name))throw Error('Unbekanntes Notebook.');
 if(saved[name]&&!matchesCurrentLesson(name,saved[name])){
  legacyNotebooks[name]=saved[name];delete saved[name];await persist();
  document.getElementById('basis-backup-status').textContent='Älteres Notebook archiviert. Die neue Version wird geöffnet. Den alten Stand könnt ihr als ZIP herunterladen.';
 }
 if(current!==name&&ready)await snapshot();
 // Keep the ZIP/IndexedDB notebook bridge, but display it inside its chapter card.
 // Capture the active notebook before relocating an iframe (which restarts its kernel).
 if(host&&panel.parentElement!==host){
  if(current===name&&ready)await snapshot();
  host.append(panel);
  if(current===name)force=true;
 }
 owner=view||owner;heading.textContent=notebookTitles[name]||'Experiment';
 if(current===name&&ready&&!force){overlay.open(host?.querySelector('.ki-notebook-launch')||document.activeElement);mount();return;}
 current=name;ready=false;changed=false;overlay.open(host?.querySelector('.ki-notebook-launch')||document.activeElement);mount();
 status.textContent='Notebook wird geladen …';
 notebookLoading('loading',saved[name]?'Gesichertes Notebook wird geöffnet …':'Notebook wird gestartet. Python wird vorbereitet …');
 // Open the actual notebook, not JupyterLite's file browser (same as the fourth year).
 frame.src='../lab/index.html?path='+encodeURIComponent('portal/'+name)+'&ki-embed=1&reset'+(saved[name]?'&ki-restore=1':'');
 // The dialog overlays the course; moving the iframe during opening is avoided.
}
document.querySelectorAll('a[href*="../lab/index.html?path="]').forEach(a=>{const url=new URL(a.href);const name=url.searchParams.get('path')?.split('/').pop();if(!notebookNames.includes(name))return;a.addEventListener('click',event=>{event.preventDefault();openNotebook(name,a.closest('main > section')?.id,false,a.closest('.ki-notebook-block')).catch(e=>status.textContent=e.message);});});
window.addEventListener('message',async event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.channel!=='ki-portal-v1'||!current)return;const d=event.data;if(d.path!=='portal/'+current)return;
if(d.id&&pending.has(d.id)){const p=pending.get(d.id);clearTimeout(p.timer);pending.delete(d.id);d.type==='error'?p.reject(Error(d.error)):p.resolve(d);return;}
if(d.type==='ready'&&d.error){status.textContent=d.error;notebookLoading('error',d.error);return;}
if(d.type==='ready'&&d.ready&&!ready&&!restoring){
 restoring=true;
 try{
  await loaded;
  const restored=saved[current] ? await request('restore',{notebook:validate(saved[current]),keepKernel:true}) : null;
  ready=true;await snapshot();
  status.textContent=restored?.widgets?.activated
    ? 'Gesicherter Stand geladen · interaktive Widgets wieder aktiv.'
    : restored ? 'Gesicherter Stand geladen · geänderte Startzellen bitte manuell ausführen.'
      : 'Notebook bereit; Eingaben und Ergebnisse gesichert.';
  notebookLoading('ready');
 }catch(e){
  status.textContent='Wiederherstellung fehlgeschlagen: '+e.message;
  notebookLoading('error','Notebook konnte nicht wiederhergestellt werden. Erneut öffnen.');
 }finally{restoring=false;}
}
if(d.type==='dirty')changed=true;
if(d.type==='changed'&&ready&&!restoring){try{saved[current]=validate(d.notebook);if(Array.isArray(d.files)&&d.files.length)notebookUploads[current]=d.files.filter(f=>f&&typeof f.name==='string'&&typeof f.content==='string'&&f.content.length<50000000).map(f=>({name:f.name,type:f.type||'application/octet-stream',content:f.content}));await persist();if(status.textContent.startsWith('Notebook im Browser'))changed=false;}catch(e){status.textContent='Notebook konnte nicht gesichert werden: '+e.message;}}
});
window.addEventListener('hashchange',()=>{if(current)mount();});
const backupControls=document.getElementById('basis-backup-controls');
const backupStatus=document.getElementById('basis-backup-status');
const backup=document.createElement('button');backup.className='btn compact';backup.textContent='Gesamten Kursstand als ZIP sichern';backup.type='button';backup.classList.add('primary');
const restore=document.createElement('input');restore.type='file';restore.accept='.zip';restore.style.display='block';restore.setAttribute('aria-label','ZIP-Kursstand wiederherstellen');const restoreLabel=document.createElement('label');restoreLabel.textContent='Gesicherten Kursstand (ZIP) laden';restoreLabel.append(restore);
const photoInput=document.createElement('input');photoInput.type='file';photoInput.accept='.json';photoInput.setAttribute('aria-label','Fotostudio-JSON zur ZIP-Sicherung hinzufügen');const photoLabel=document.createElement('label');photoLabel.textContent='Fotostudio-JSON in die ZIP-Sicherung aufnehmen';photoLabel.append(photoInput);photoInput.style.display='block';
photoInput.addEventListener('change',async()=>{const file=photoInput.files?.[0];if(!file)return;try{const content=await file.text(),obj=JSON.parse(content);if(obj.schema!=='fotostudio-v1')throw Error('Keine Fotostudio-JSON');photoJSON={name:file.name,content};await persist();renderRecoveredFiles();document.getElementById('basis-save-status').textContent='Fotostudio-JSON für ZIP vorgemerkt.';backupStatus.textContent='Fotostudio-JSON hinzugefügt. Nun Kursstand als ZIP sichern.';}catch(e){alert(e.message);}});
const recovered=document.createElement('div');recovered.id='basis-restored-files';
function downloadBytes(data,name,type='application/octet-stream'){
 const blob=data instanceof Blob?data:new Blob([data],{type});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function renderRecoveredFiles(){
 recovered.replaceChildren();
 const files=Object.entries(notebookUploads).flatMap(([notebook,items])=>(items||[]).map(item=>({notebook,...item})));
 if(photoJSON?.content)files.unshift({name:photoJSON.name||'fotostudio.json',type:'application/json',content:btoa(unescape(encodeURIComponent(photoJSON.content))),notebook:'Fotostudio'});
 if(!files.length)return;
 const heading=document.createElement('p');heading.textContent='Wiederhergestellte Fotodaten und Notebook-Uploads (für erneuten Import herunterladen):';recovered.append(heading);
 for(const file of files){
  const b=document.createElement('button');b.type='button';b.className='btn compact';b.textContent=file.notebook+': '+file.name;
  b.addEventListener('click',()=>downloadBytes(Uint8Array.from(atob(file.content),c=>c.charCodeAt(0)),file.name,file.type));
  recovered.append(b);
 }
}
backupControls.append(backup,restoreLabel,photoLabel,recovered);
loaded.then(renderRecoveredFiles);
function answers(){return Object.fromEntries([...document.querySelectorAll('[data-basis-answer]')].map(f=>[f.dataset.basisAnswer,f.value]));}
backup.addEventListener('click',async()=>{backup.disabled=true;try{await loaded;if(current)await snapshot();const data={schema:SCHEMA,answers:answers(),notebooks:notebookNames.filter(n=>saved[n]),archived:notebookNames.filter(n=>legacyNotebooks[n]),uploads:[]};
const entries=[{name:'kursstand.json',data:''},{name:'Reflexionen.txt',data:Object.entries(data.answers).map(([k,v])=>k+'\n'+v).join('\n\n')},
 {name:'LESEN.txt',data:'Reflexionen.txt enthält Textantworten. notebooks/ enthält bearbeitete Jupyter-Notebooks mit Ausgaben. notebooks/archiv/ enthält die frühere DL3/4-Version, falls sie ersetzt wurde. daten/ enthält Fotostudio-JSON und im Notebook ausgewählte Uploads. Nach ZIP-Import sind Notebook-Ausgaben sichtbar; Python-Variablen und das trainierte Netz müssen durch erneutes Ausführen der Zellen erstellt werden. Fotostudio-JSON vor dem Training erneut im Notebook auswählen. Originalfotos separat sichern.\n'},
 ...data.notebooks.map(n=>({name:'notebooks/'+n,data:JSON.stringify(saved[n])})),
 ...data.archived.map(n=>({name:'notebooks/archiv/'+n,data:JSON.stringify(legacyNotebooks[n])}))];
if(photoJSON)entries.push({name:'fotodaten/fotostudio.json',data:photoJSON.content});
for(const [n,files] of Object.entries(notebookUploads))if(notebookNames.includes(n))for(const [i,f] of (files||[]).entries()){
 if(!f.name||!f.content||i>=100)continue;
 const safe=f.name.replace(/[^a-zA-Z0-9._-]/g,'_').replace(/\.\.+/g,'_').slice(0,200);
 const path='daten/notebook-uploads/'+n+'/'+i+'_'+safe;
 const bytes=Uint8Array.from(atob(f.content),c=>c.charCodeAt(0));
 entries.push({name:path,data:bytes});
 data.uploads.push({notebook:n,path,name:f.name,type:f.type});
}
entries[0].data=JSON.stringify(data,null,2);
const zip=await makeZip(entries);const url=URL.createObjectURL(zip),a=document.createElement('a');a.href=url;a.download='KI-1-Klasse-Kursstand.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);status.textContent='ZIP mit Reflexionen und Notebook-Ständen erstellt.';backupStatus.textContent='ZIP mit Reflexionen, Notebooks und angehängten Daten erstellt.';}catch(e){status.textContent='ZIP nicht erstellt: '+e.message;backupStatus.textContent='ZIP nicht erstellt: '+e.message;}finally{backup.disabled=false;}});
restore.addEventListener('change',async()=>{const file=restore.files?.[0];if(!file)return;try{await loaded;const files=await readZip(file);if(!files.has('kursstand.json'))throw Error('kursstand.json fehlt.');const raw=JSON.parse(await files.get('kursstand.json').text());if(raw.schema!==SCHEMA||!raw.answers||!Array.isArray(raw.notebooks)||raw.notebooks.some(n=>!notebookNames.includes(n)))throw Error('Ungültiger Kursstand.');const next={};for(const n of raw.notebooks){const blob=files.get('notebooks/'+n);if(!blob)throw Error('Notebook fehlt: '+n);next[n]=validate(JSON.parse(await blob.text()));}
if(raw.archived!==undefined&&(!Array.isArray(raw.archived)||raw.archived.some(n=>!notebookNames.includes(n))))throw Error('Ungültiges Notebook-Archiv.');
const nextLegacy={};for(const n of raw.archived||[]){const blob=files.get('notebooks/archiv/'+n);if(!blob)throw Error('Archiviertes Notebook fehlt: '+n);nextLegacy[n]=validate(JSON.parse(await blob.text()));}
const nextUploads={};
if(raw.uploads!==undefined&&!Array.isArray(raw.uploads))throw Error('Ungültige Liste der Notebook-Dateien.');
for(const f of raw.uploads||[]){
 if(!notebookNames.includes(f.notebook)||typeof f.path!=='string'||!f.path.startsWith('daten/notebook-uploads/')||
    typeof f.name!=='string'||f.name.length>300||!files.has(f.path))throw Error('Ungültige oder fehlende Notebook-Upload-Datei.');
 const bytes=new Uint8Array(await files.get(f.path).arrayBuffer());
 let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));
 (nextUploads[f.notebook]??=[]).push({name:f.name,type:f.type||'application/octet-stream',content:btoa(binary)});
}
if(current&&ready)await snapshot();
saved=next;legacyNotebooks=nextLegacy;notebookUploads=nextUploads;if(files.has('fotodaten/fotostudio.json')){const content=await files.get('fotodaten/fotostudio.json').text();if(JSON.parse(content).schema!=='fotostudio-v1')throw Error('Ungültige Fotostudio-JSON');photoJSON={name:'fotostudio.json',content};}else photoJSON=null;await persist();renderRecoveredFiles();for(const f of document.querySelectorAll('[data-basis-answer]')){f.value=typeof raw.answers[f.dataset.basisAnswer]==='string'?raw.answers[f.dataset.basisAnswer]:'';f.dispatchEvent(new Event('input',{bubbles:true}));}current=null;owner=null;ready=false;if(overlay.isOpen)await overlay.close();frame.removeAttribute('src');panel.hidden=true;status.textContent='ZIP geladen. Öffnet ein Notebook, um die gesicherten Zellen wiederherzustellen.';backupStatus.textContent='ZIP geladen: Textfelder und Notebook-Zellen wiederhergestellt. Notebook bei Bedarf neu öffnen und Codezellen ausführen.';if(photoJSON){const blob=new Blob([photoJSON.content],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fotostudio-wiederhergestellt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}document.getElementById('basis-save-status').textContent='Reflexionen aus ZIP wiederhergestellt.';}catch(e){backupStatus.textContent='Wiederherstellung fehlgeschlagen: '+e.message;alert('Wiederherstellung fehlgeschlagen: '+e.message);}finally{restore.value='';}});
window.addEventListener('beforeunload',event=>{if(changed){event.preventDefault();event.returnValue='Notebook-Änderungen werden noch gespeichert.';}});
