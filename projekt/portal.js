import {makeZip,readZip,escapeHTML as esc} from './archive.js';
const $=id=>document.getElementById(id),all=s=>[...document.querySelectorAll(s)];
const SCHEMA='ki-kursportal-v1',KEY='kst-ki-kursportal-v1';
const journalFields=all('[data-journal]'),answerFields=all('[data-answer]');
let state={schema:SCHEMA,journal:{},answers:{},files:[]},notebook=null,protocol=null,protocolSignature='',restorePending=false,files=new Map(),db=null;
let filesStored=true,artifactStored=true;
let saving=Promise.resolve(),snapshotTimer,lessonName='',projectStarted=false,projectReady=false;
const pending=new Map();
const status=(message,error=false)=>{$('portal-save-status').textContent=message;$('portal-save-status').classList.toggle('save-error',error);};
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
 try{localStorage.setItem(KEY,JSON.stringify(state));status(filesStored&&artifactStored?'Journal in diesem Browser gespeichert.':'Text gespeichert; Dateien / Versuch jetzt als Sicherung herunterladen.',!(filesStored&&artifactStored));}
 catch{status('Speichern nicht möglich – Zwischenstand herunterladen.',true);}
 updateChecks();
}
function transaction(store,mode,action){
 if(!db)return Promise.reject(Error('Browserspeicher nicht verfügbar'));
 return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);action(tx.objectStore(store));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Speichern abgebrochen'));});
}
function read(store,key){return new Promise((resolve,reject)=>{const q=db.transaction(store).objectStore(store).get(key);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});}
function persistArtifacts(){
 clearTimeout(snapshotTimer);snapshotTimer=setTimeout(()=>{
  saving=transaction('artifacts','readwrite',s=>s.put({notebook,protocol,protocolSignature,restorePending},'project')).catch(()=>{artifactStored=false;status('Versuch nur vorübergehend verfügbar – Sicherung herunterladen.',true);});
 },400);
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
function render(){
 journalFields.forEach(e=>e.value=state.journal[e.dataset.journal]||'');
 answerFields.forEach(e=>e.value=state.answers[e.dataset.answer]||'');
 renderFiles();updateChecks();
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
 try{const raw=localStorage.getItem(KEY);if(raw)state=cleanState(JSON.parse(raw));else{const old=window.KIProgress?.get();if(old){state.journal.purpose=old.notes?.topic||old.topic||'';state.journal.groups=old.notes?.data||'';state.journal.hypothesis=old.notes?.question||'';}}}catch{status('Gespeicherter Text konnte nicht geladen werden. Sicherung importieren.',true);}
 try{
  db=await new Promise((resolve,reject)=>{const q=indexedDB.open('kst-ki-kursportal',1);q.onupgradeneeded=()=>{q.result.createObjectStore('files');q.result.createObjectStore('artifacts');};q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);q.onblocked=()=>reject(Error('Browserspeicher blockiert'));});
  const artifact=await read('artifacts','project');if(artifact){notebook=artifact.notebook;protocol=artifact.protocol;protocolSignature=artifact.protocolSignature||'';restorePending=!!artifact.restorePending;}
  for(const f of state.files){const b=await read('files',f.id);if(b)files.set(f.id,b);}
 }catch{filesStored=false;status('Dateien werden nicht dauerhaft gespeichert. Sicherung herunterladen.',true);}
 render();
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
  for(const f of selected){const id=crypto.randomUUID();files.set(id,f);state.files.push({id,name:f.name,type:f.type});await transaction('files','readwrite',s=>s.put(f,id)).catch(()=>{filesStored=false;status('Dateien nur vorübergehend verfügbar – Sicherung herunterladen.',true);});}
  saveText();renderFiles();
 }catch(error){$('download-status').textContent=error.message;}finally{e.target.value='';}
});
// Keep the project iframe alive during navigation. At most one additional lesson iframe.
const names={'lernarten.ipynb':'NIM','perzeptron_und_neuronale_netze.ipynb':'Ein Neuron','mehrschichtige_netze.ipynb':'XOR-Netz','daten_training.ipynb':'Datenaufteilung','klassifikation_ziffern.ipynb':'Ziffern','ki_lernlabor.ipynb':'Projekt-Lernlabor'};
function frameURL(name){return '../lab/index.html?path='+encodeURIComponent('portal/'+name)+'&ki-embed=1&ki-path='+encodeURIComponent('portal/'+name);}
function connectFrame(frame,kind){
 let attempts=0;const timer=setInterval(()=>{if(frame.dataset.ready==='yes'||++attempts>120){clearInterval(timer);if(frame.dataset.ready!=='yes')$(kind+'-lab-status').textContent='Start dauert länger. Internetverbindung prüfen.';return;}frame.contentWindow?.postMessage({channel:'ki-portal-v1',type:'hello'},location.origin);},1000);
}
function request(frame,type,extra={}){return new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Notebook antwortet noch nicht. Warten und erneut versuchen.'));},type==='restore'?120000:30000);pending.set(id,{resolve,reject,timer,source:frame.contentWindow});frame.contentWindow.postMessage({channel:'ki-portal-v1',type,id,...extra},location.origin);});}
function showProject(){
 $('project-lab').hidden=false;
 if(!projectStarted){projectStarted=true;$('project-frame').src=frameURL('ki_tandemprojekt.ipynb');connectFrame($('project-frame'),'project');}
}
$('start-project').addEventListener('click',()=>{showProject();$('project-lab').scrollIntoView({block:'start',behavior:'smooth'});});
$('start-studio').addEventListener('click',()=>{const frame=$('studio-frame');$('studio-panel').hidden=false;if(!frame.getAttribute('src'))frame.src='studio/index.html';$('studio-panel').scrollIntoView({block:'start',behavior:'smooth'});});
all('[data-lab]').forEach(b=>b.addEventListener('click',async()=>{
 const name=b.dataset.lab;if(!names[name])return;
 if(lessonName&&lessonName!==name){try{await request($('lesson-frame'),'snapshot');}catch{if(!confirm('Der laufende Lernversuch antwortet noch nicht. Trotzdem wechseln?'))return;}}
 $('lesson-lab').hidden=false;$('lesson-lab').dataset.owner=b.closest('main > section')?.id||'projekt';$('lesson-lab-title').textContent=names[name];
 if(name!==lessonName){lessonName=name;$('lesson-frame').dataset.ready='no';$('lesson-lab-status').textContent='Startet …';$('lesson-frame').src=frameURL(name);connectFrame($('lesson-frame'),'lesson');}
 $('lesson-lab').scrollIntoView({block:'start',behavior:'smooth'});
}));
window.addEventListener('hashchange',()=>{const owner=$('lesson-lab').dataset.owner;$('lesson-lab').hidden=!owner||document.getElementById(owner).classList.contains('view-hidden');});
all('[data-fullscreen]').forEach(b=>b.addEventListener('click',()=>{const node=$(b.dataset.fullscreen).closest('.lab-panel');if(node.requestFullscreen)node.requestFullscreen();}));
window.addEventListener('message',async event=>{
 if(event.origin!==location.origin||event.data?.channel!=='ki-portal-v1')return;
 const project=event.source===$('project-frame').contentWindow,lesson=event.source===$('lesson-frame').contentWindow;
 if(!project&&!lesson)return;
 const data=event.data,frame=project?$('project-frame'):$('lesson-frame');
 if(data.path!==('portal/'+(project?'ki_tandemprojekt.ipynb':lessonName)))return;
 if(data.id && pending.has(data.id)){const p=pending.get(data.id);if(p.source!==event.source)return;clearTimeout(p.timer);pending.delete(data.id);data.type==='error'?p.reject(Error(data.error)):p.resolve(data);}
 if(data.type==='ready'){
  frame.dataset.ready=data.ready?'yes':'no';if(!project||!projectReady)$(project?'project-lab-status':'lesson-lab-status').textContent=data.ready?'Bereit · Shift + Enter führt eine Zelle aus':(data.error||'Startet …');
  if(project && data.ready && !projectReady){
   projectReady=true;await initialization;
   try{
    if(restorePending && notebook){await request(frame,'restore',{notebook});restorePending=false;persistArtifacts();$('project-lab-status').textContent='Sicherung geladen. Daten erneut auswählen; Zellen schrittweise ausführen.';}
    const result=await request(frame,'snapshot');capture(result.notebook,result.protocol);
   }catch(error){$('project-lab-status').textContent=error.message;}
  }
 }
 if(project && data.type==='changed' && !restorePending)capture(data.notebook);
});
function notebookForExport(){
 if(!notebook)return null;
 const nb=structuredClone(notebook);nb.cells=nb.cells.filter(c=>!c.metadata?.['ki-journal-export']);
 const add=source=>({id:crypto.randomUUID(),cell_type:'markdown',metadata:{'ki-journal-export':true},source:source.split(/(?<=\n)/)});
 nb.cells.unshift(add('# Projektjournal\n\n'+state.journal.names+' · '+state.journal.class+'\n\nDie folgenden Antworten wurden auf der Kurswebseite verfasst.\n'));
 for(const e of journalFields)nb.cells.push(add('## '+e.previousElementSibling.textContent+'\n\n'+(state.journal[e.dataset.journal]||'Noch offen.')));
 return nb;
}
function journalHTML(){
 const sections=journalFields.map(e=>'<section><h2>'+esc(e.previousElementSibling.textContent)+'</h2><p>'+esc(state.journal[e.dataset.journal]||'Noch offen.').replace(/\n/g,'<br>')+'</p></section>').join('');
 const outputs=(notebook?.cells||[]).filter(c=>c.cell_type==='code').map(c=>{
  const body=(c.outputs||[]).map(o=>{if(o.data?.['image/png']){const png=Array.isArray(o.data['image/png'])?o.data['image/png'].join(''):o.data['image/png'];if(/^[A-Za-z0-9+/=\s]+$/.test(png))return '<img alt="Versuchsausgabe" src="data:image/png;base64,'+png+'">';}const value=o.text||o.data?.['text/plain']||o.evalue||'';return value?'<pre>'+esc(Array.isArray(value)?value.join(''):value)+'</pre>':'';}).join('');
  return body?'<section><details><summary>Ausgeführter Code</summary><pre>'+esc(Array.isArray(c.source)?c.source.join(''):c.source)+'</pre></details>'+body+'</section>':'';
 }).join('');
 return '<!doctype html><html lang="de-CH"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KI-Projektjournal</title><style>body{max-width:900px;margin:45px auto;padding:0 24px;color:#182b31;font:16px/1.6 system-ui}h1,h2{line-height:1.2}h2{font-size:20px}section{margin:24px 0;padding-bottom:18px;border-bottom:1px solid #ddd}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f1f5f2;padding:15px;font-size:12px}img{max-width:100%;height:auto}.meta{color:#52656a}@media print{details{display:none}section{break-inside:avoid}}</style><h1>Unser KI-Projekt</h1><p class="meta">'+esc(state.journal.names)+' · '+esc(state.journal.class)+'<br>Exportiert: '+esc(new Date().toLocaleString('de-CH'))+'</p>'+sections+'<h1>Versuchsausgaben</h1>'+(outputs||'<p>Noch keine Ausgaben gesichert.</p>')+'<h2>Versuchsprotokoll</h2><pre>'+esc(protocol?JSON.stringify(protocol,null,2):'Noch kein Protokoll verfügbar.')+'</pre><h2>Datendateien</h2><ul>'+state.files.map(f=>'<li>'+esc(f.name)+'</li>').join('')+'</ul></html>';
}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function pack(submission){
 await initialization;
 const button=$(submission?'download-submission':'download-backup');button.disabled=true;$('download-status').textContent='Paket wird vorbereitet …';
 try{
  if(projectStarted){if(restorePending)throw Error('Die Sicherung wird noch geladen. Bitte warten.');if(!projectReady)throw Error('Der Versuch startet noch. Bitte warten.');const result=await request($('project-frame'),'snapshot');capture(result.notebook,result.protocol);}
  if(state.files.some(f=>!files.has(f.id)))throw Error('Einige Datendateien fehlen. Bitte erneut hinzufügen.');
  const absent=missing();if(submission&&absent.length&&!confirm('Noch unvollständig: '+absent.join(', ')+'. Trotzdem diesen Stand herunterladen?'))return;
  const snapshot={...state,exported:new Date().toISOString(),progress:window.KIProgress?.get(),protocol,protocolSignature};
  const entries=[{name:'kursstand.json',data:JSON.stringify(snapshot,null,2)},{name:'Journal.html',data:journalHTML()},{name:'LESEN.txt',data:'Journal.html im Browser öffnen: Antworten und Versuchsausgaben.\nversuch.ipynb enthält den Code und die Ausgaben.\nDie ZIP-Datei kann auf der Kursseite als Sicherung importiert werden.\nOriginale und Fotostudio-JSON liegen im Ordner daten.\nFür eine lokale Wiederholung: Python 3.12, numpy, scipy, scikit-learn, matplotlib, pillow, ipywidgets; Notebook-Zellen der Reihe nach ausführen und Fotostudio-JSON auswählen.\nDer Download ist keine automatische Einreichung.\n'}];
  const nb=notebookForExport();if(nb)entries.push({name:'versuch.ipynb',data:JSON.stringify(nb,null,1)});
  if(protocol)entries.push({name:'Versuchsprotokoll.json',data:JSON.stringify(protocol,null,2)});
  for(const f of state.files)entries.push({name:'daten/'+f.id+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'_'),data:files.get(f.id)});
  if(nb){for(const file of ['ki_foto_tools.py','ki_projekt_tools.py','foto_uebungsdaten.json']){const r=await fetch('runtime/'+file);if(!r.ok)throw Error('Hilfsdateien konnten nicht geladen werden. Internetverbindung prüfen.');entries.push({name:'ki_projekt/'+file,data:await r.blob()});}}
  const blob=await makeZip(entries);download(blob,(submission?'KI-Abgabe':'KI-Zwischenstand')+'-'+new Date().toISOString().slice(0,10)+'.zip');$('download-status').textContent='Download erstellt. '+(absent.length?'Noch offen: '+absent.join(' · '):'Vor dem Einreichen das Journal kurz prüfen.');
 }catch(error){$('download-status').textContent='Download nicht erstellt: '+error.message;}finally{button.disabled=false;}
}
$('download-submission').addEventListener('click',()=>pack(true));$('download-backup').addEventListener('click',()=>pack(false));
$('restore-package').addEventListener('change',async e=>{
 await initialization;const file=e.target.files[0];if(!file)return;
 try{
  const unpacked=await readZip(file),raw=JSON.parse(await unpacked.get('kursstand.json').text()),next=cleanState(raw),nextFiles=new Map();
  if(raw.progress && raw.progress.schema!=='ki-projekt-seitenstand-v1')throw Error('Ungültiger Projekt-Seitenstand.');
  let nextNotebook=null;
  if(unpacked.has('versuch.ipynb')){nextNotebook=JSON.parse(await unpacked.get('versuch.ipynb').text());if(nextNotebook.nbformat!==4||!Array.isArray(nextNotebook.cells)||nextNotebook.cells.length>100)throw Error('Ungültiges Notebook.');nextNotebook.cells=nextNotebook.cells.filter(c=>!c.metadata?.['ki-journal-export']);}
  for(const f of next.files){const name='daten/'+f.id+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'_');if(!unpacked.has(name))throw Error('Datendatei fehlt: '+f.name);nextFiles.set(f.id,unpacked.get(name));}
  if(!confirm('Journal, Versuch und Abgabeliste durch diese Sicherung ersetzen? Eigene aktuelle Arbeit vorher herunterladen.'))return;
  if(projectStarted && nextNotebook){if(!projectReady)throw Error('Bitte warten, bis der Versuch gestartet ist.');await request($('project-frame'),'restore',{notebook:nextNotebook});}
  await transaction('files','readwrite',s=>{s.clear();for(const [id,blob] of nextFiles)s.put(blob,id);}).catch(()=>{filesStored=false;status('Import nur für diese Sitzung. Zwischenstand herunterladen.',true);});
  state=next;files=nextFiles;notebook=nextNotebook;protocol=raw.protocol||null;protocolSignature=raw.protocolSignature||'';restorePending=!!nextNotebook&&!projectStarted;
  if(raw.progress)window.KIProgress?.restore(raw.progress);
  render();saveText();persistArtifacts();$('download-status').textContent='Sicherung geladen. Beim Weiterarbeiten Daten im Versuch erneut auswählen. Es wurde kein Training oder Abschlusstest gestartet.';
 }catch(error){$('download-status').textContent='Import fehlgeschlagen: '+error.message;}finally{e.target.value='';}
});
// A small matching activity, deliberately separate from the assessed project.
const pairs=[['Überwachtes Lernen','Beispiele mit richtiger Antwort'],['Unüberwachtes Lernen','Gruppen ohne vorgegebene Antworten'],['Verstärkendes Lernen','Erfolg oder Misserfolg nach Handlungen']];
let flipped=[],locked=false,matches=0,memoryTimer;
function memory(){clearTimeout(memoryTimer);flipped=[];locked=false;matches=0;const cards=pairs.flatMap((p,i)=>p.map(text=>({text,pair:i})));for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}$('memory-board').replaceChildren();$('memory-status').textContent='Drehen Sie zwei Karten um.';for(const card of cards){const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.setAttribute('aria-label','Verdeckte Karte');b.addEventListener('click',()=>{if(locked||b.classList.contains('revealed')||b.classList.contains('matched'))return;b.classList.add('revealed');b.textContent=card.text;b.setAttribute('aria-label',card.text);flipped.push({b,pair:card.pair});if(flipped.length===2){if(flipped[0].pair===flipped[1].pair){flipped.forEach(x=>{x.b.classList.add('matched');x.b.disabled=true;});flipped=[];matches++;$('memory-status').textContent=matches===3?'Alle Paare gefunden. Erklären Sie zu jeder Lernart ein eigenes Beispiel.':matches+' von 3 Paaren gefunden.';}else{locked=true;$('memory-status').textContent='Dieses Paar passt noch nicht zusammen.';memoryTimer=setTimeout(()=>{flipped.forEach(x=>{x.b.classList.remove('revealed');x.b.textContent='?';x.b.setAttribute('aria-label','Verdeckte Karte');});flipped=[];locked=false;},1000);}}});$('memory-board').append(b);}}
$('memory-reset').addEventListener('click',memory);memory();
// Transparent word-pair model: no API, no text transmission.
let transitions=new Map(),words=['Die'];
function languageRender(){const next=transitions.get(words.at(-1))||[];$('language-output').textContent=words.join(' ').replace(/ ([.!?])/g,'$1');const counts=new Map();next.forEach(w=>counts.set(w,(counts.get(w)||0)+1));$('language-options').textContent=next.length?'Mögliche Fortsetzungen: '+[...counts].map(([w,n])=>w+' ('+n+'/'+next.length+')').join(' · '):'Keine Fortsetzung in den Beispieltexten. Beginnen Sie neu oder ergänzen Sie Texte.';$('language-next').disabled=!next.length||words.length>=40;}
$('language-train').addEventListener('click',()=>{transitions=new Map();const tokens=$('language-corpus').value.match(/[\p{L}\p{N}]+|[.!?]/gu)||[];for(let i=0;i<tokens.length-1;i++){if(/[.!?]/.test(tokens[i]))continue;const a=transitions.get(tokens[i])||[];a.push(tokens[i+1]);transitions.set(tokens[i],a);}words=[tokens[0]||'Die'];languageRender();});
$('language-next').addEventListener('click',()=>{const next=transitions.get(words.at(-1))||[];if(next.length)words.push(next[Math.floor(Math.random()*next.length)]);languageRender();});
$('language-reset').addEventListener('click',()=>{words=[$('language-corpus').value.match(/[\p{L}\p{N}]+/u)?.[0]||'Die'];languageRender();});
