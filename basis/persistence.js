import {makeZip,readZip} from '../projekt/archive.js';

// The basic course has its own backup schema and does not alter the fourth-year portal.
const KEY='kst-ki-basis-v1', NBKEY='kst-ki-basis-notebooks-v1', SCHEMA='ki-basis-zip-v1';
const notebookNames=['basis_neuron.ipynb','basis_netze.ipynb','basis_bildmodell.ipynb','basis_fotoprojekt.ipynb'];
const panel=document.createElement('section');panel.id='basis-notebook-panel';panel.hidden=true;
panel.style.cssText='margin:24px 0;padding:18px;border:1px solid #a8b6d5;border-radius:12px;background:white';
panel.innerHTML='<h3>Notebook der 1. Klasse</h3><p id="basis-lab-status" role="status">Noch kein Notebook geöffnet.</p><iframe id="basis-lab-frame" title="Jupyter Notebook" style="width:100%;height:680px;border:1px solid #c9d4e5" allow="clipboard-read; clipboard-write"></iframe>';
const frame=panel.querySelector('iframe'),status=panel.querySelector('#basis-lab-status');
let current=null,owner=null,ready=false,revision=0,restoring=false,changed=false;
let saved={};try{saved=JSON.parse(localStorage.getItem(NBKEY)||'{}')||{};}catch{}
const pending=new Map();
const storeReady=new Promise(resolve=>{
 if(!('indexedDB' in window)){resolve(null);return;}
 const req=indexedDB.open('kst-ki-basis-notebooks',1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('notebooks'))req.result.createObjectStore('notebooks');};
 req.onsuccess=()=>resolve(req.result);
 req.onerror=()=>resolve(null);
});
const loaded=(async()=>{const db=await storeReady;if(!db)return;
 try{const result=await new Promise((resolve,reject)=>{const tx=db.transaction('notebooks','readonly'),r=tx.objectStore('notebooks').get('all');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 if(result&&typeof result==='object')saved={...saved,...result};
 }catch(e){status.textContent='Gesicherte Notebooks konnten nicht gelesen werden: '+e.message;}
})();
async function persistDB(){const db=await storeReady;if(!db)return false;await new Promise((resolve,reject)=>{const tx=db.transaction('notebooks','readwrite');tx.objectStore('notebooks').put(saved,'all');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});return true;}
function validate(nb){if(!nb||nb.nbformat!==4||!Array.isArray(nb.cells)||nb.cells.length>200||JSON.stringify(nb).length>50000000)throw Error('Ungültiges Notebook.');return nb;}
function request(type,extra={}){return new Promise((resolve,reject)=>{if(!frame.contentWindow)return reject(Error('Notebook nicht geladen'));const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Notebook antwortet nicht.'));},type==='restore'?120000:60000);pending.set(id,{resolve,reject,timer});frame.contentWindow.postMessage({channel:'ki-portal-v1',type,id,...extra},location.origin);});}
async function persist(){try{const durable=await persistDB();try{localStorage.setItem(NBKEY,JSON.stringify(saved));}catch{}if(!durable&&!localStorage.getItem(NBKEY))throw Error('Kein verfügbarer Speicher');status.textContent='Notebook im Browser gespeichert. Für eine vollständige Sicherung ZIP herunterladen.';}catch(e){changed=true;status.textContent='Notebook konnte nicht dauerhaft gespeichert werden: '+e.message+'. Bitte ZIP herunterladen.';}}
async function snapshot(){if(!current)return;if(!ready)throw Error('Notebook noch nicht bereit.');const result=await request('snapshot');saved[current]=validate(result.notebook);await persist();}
// Never move a running JupyterLite iframe between lesson sections: moving it
// destroys the browser kernel and may discard in-flight student edits.
function mount(){
 if(!panel.isConnected)document.getElementById('basis-sicherung').before(panel);
 const hash=decodeURIComponent((location.hash||'').slice(1));
 const active=document.getElementById(hash)?.closest('main > section')?.id||hash;
 panel.hidden=!current||(active!==owner&&hash!=='basis-sicherung');
}
async function openNotebook(name,view){await loaded;owner=view||owner;if(!notebookNames.includes(name))throw Error('Unbekanntes Notebook.');if(current===name&&ready){mount();panel.scrollIntoView({behavior:'smooth'});return;}if(current&&ready)await snapshot();current=name;ready=false;changed=false;mount();status.textContent='Notebook wird geladen …';frame.src='../lab/index.html?path='+encodeURIComponent('portal/'+name)+'&ki-embed=1&reset'+(saved[name]?'&ki-restore=1':'');panel.scrollIntoView({behavior:'smooth'});}
document.querySelectorAll('a[href*="../lab/index.html?path="]').forEach(a=>{const url=new URL(a.href);const name=url.searchParams.get('path')?.split('/').pop();if(!notebookNames.includes(name))return;a.addEventListener('click',event=>{event.preventDefault();openNotebook(name,a.closest('main > section')?.id).catch(e=>status.textContent=e.message);});});
window.addEventListener('message',async event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.channel!=='ki-portal-v1'||!current)return;const d=event.data;if(d.path!=='portal/'+current)return;
if(d.id&&pending.has(d.id)){const p=pending.get(d.id);clearTimeout(p.timer);pending.delete(d.id);d.type==='error'?p.reject(Error(d.error)):p.resolve(d);return;}
if(d.type==='ready'&&d.ready&&!ready&&!restoring){restoring=true;try{await loaded;if(saved[current])await request('restore',{notebook:validate(saved[current]),keepKernel:true});ready=true;await snapshot();status.textContent='Notebook bereit; gespeicherte Eingaben und Ergebnisse geladen.';}catch(e){status.textContent='Wiederherstellung fehlgeschlagen: '+e.message;}finally{restoring=false;}}
if(d.type==='dirty')changed=true;
if(d.type==='changed'&&ready&&!restoring){try{saved[current]=validate(d.notebook);await persist();if(status.textContent.startsWith('Notebook im Browser'))changed=false;}catch(e){status.textContent='Notebook konnte nicht gesichert werden: '+e.message;}}
});
window.addEventListener('hashchange',()=>{if(current)mount();});
const backupControls=document.getElementById('basis-backup-controls');
const backup=document.createElement('button');backup.className='btn compact';backup.textContent='Gesamten Kursstand als ZIP sichern';backup.type='button';backup.classList.add('primary');
const restore=document.createElement('input');restore.type='file';restore.accept='.zip';restore.style.display='block';restore.setAttribute('aria-label','ZIP-Kursstand wiederherstellen');const restoreLabel=document.createElement('label');restoreLabel.textContent='Gesicherten Kursstand (ZIP) laden';restoreLabel.append(restore);
const photoInput=document.createElement('input');photoInput.type='file';photoInput.accept='.json';photoInput.setAttribute('aria-label','Fotostudio-JSON zur ZIP-Sicherung hinzufügen');const photoLabel=document.createElement('label');photoLabel.textContent='Fotostudio-JSON in die ZIP-Sicherung aufnehmen';photoLabel.append(photoInput);photoInput.style.display='block';
let photoJSON=null;
photoInput.addEventListener('change',async()=>{const file=photoInput.files?.[0];if(!file)return;try{const content=await file.text(),obj=JSON.parse(content);if(obj.schema!=='fotostudio-v1')throw Error('Keine Fotostudio-JSON');photoJSON={name:file.name,content};document.getElementById('basis-save-status').textContent='Fotostudio-JSON für ZIP vorgemerkt.';}catch(e){alert(e.message);}});
backupControls.append(backup,restoreLabel,photoLabel);
function answers(){return Object.fromEntries([...document.querySelectorAll('[data-basis-answer]')].map(f=>[f.dataset.basisAnswer,f.value]));}
backup.addEventListener('click',async()=>{backup.disabled=true;try{await loaded;if(current)await snapshot();const data={schema:SCHEMA,answers:answers(),notebooks:notebookNames.filter(n=>saved[n])};const entries=[{name:'kursstand.json',data:JSON.stringify(data,null,2)},{name:'Reflexionen.txt',data:Object.entries(data.answers).map(([k,v])=>k+'\n'+v).join('\n\n')},...data.notebooks.map(n=>({name:'notebooks/'+n,data:JSON.stringify(saved[n])}))];if(photoJSON)entries.push({name:'fotodaten/fotostudio.json',data:photoJSON.content});const zip=await makeZip(entries);const url=URL.createObjectURL(zip),a=document.createElement('a');a.href=url;a.download='KI-1-Klasse-Kursstand.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);status.textContent='ZIP mit Reflexionen und Notebook-Ständen erstellt.';}catch(e){status.textContent='ZIP nicht erstellt: '+e.message;}finally{backup.disabled=false;}});
restore.addEventListener('change',async()=>{const file=restore.files?.[0];if(!file)return;try{await loaded;const files=await readZip(file);if(!files.has('kursstand.json'))throw Error('kursstand.json fehlt.');const raw=JSON.parse(await files.get('kursstand.json').text());if(raw.schema!==SCHEMA||!raw.answers||!Array.isArray(raw.notebooks)||raw.notebooks.some(n=>!notebookNames.includes(n)))throw Error('Ungültiger Kursstand.');const next={};for(const n of raw.notebooks){const blob=files.get('notebooks/'+n);if(!blob)throw Error('Notebook fehlt: '+n);next[n]=validate(JSON.parse(await blob.text()));}if(current&&ready)await snapshot();saved=next;if(files.has('fotodaten/fotostudio.json')){const content=await files.get('fotodaten/fotostudio.json').text();if(JSON.parse(content).schema!=='fotostudio-v1')throw Error('Ungültige Fotostudio-JSON');photoJSON={name:'fotostudio.json',content};}else photoJSON=null;await persist();for(const f of document.querySelectorAll('[data-basis-answer]')){f.value=typeof raw.answers[f.dataset.basisAnswer]==='string'?raw.answers[f.dataset.basisAnswer]:'';f.dispatchEvent(new Event('input',{bubbles:true}));}current=null;owner=null;ready=false;frame.removeAttribute('src');panel.hidden=true;status.textContent='ZIP geladen. Öffnet ein Notebook, um die gesicherten Zellen wiederherzustellen.';if(photoJSON){const blob=new Blob([photoJSON.content],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fotostudio-wiederhergestellt.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}document.getElementById('basis-save-status').textContent='Reflexionen aus ZIP wiederhergestellt.';}catch(e){alert('Wiederherstellung fehlgeschlagen: '+e.message);}finally{restore.value='';}});
window.addEventListener('beforeunload',event=>{if(changed){event.preventDefault();event.returnValue='Notebook-Änderungen werden noch gespeichert.';}});
