import {makeZip,readZip,escapeHTML as esc} from './archive.js';
const $=id=>document.getElementById(id),all=s=>[...document.querySelectorAll(s)];
const SCHEMA='ki-kursportal-v1',KEY='kst-ki-kursportal-v1';
const journalFields=all('[data-journal]'),answerFields=all('[data-answer]');
let state={schema:SCHEMA,journal:{},answers:{},files:[]},notebook=null,protocol=null,protocolSignature='',restorePending=false,files=new Map(),db=null;
let filesStored=true,artifactStored=true;
let saving=Promise.resolve(),snapshotTimer,projectStarted=false,projectReady=false;
const pending=new Map();
const saveSection=$('sicherung');
saveSection.classList.add('project-transfer');
saveSection.querySelector('.section-label').textContent='Notizen & Projekt';
saveSection.querySelector('h1').textContent='Alles herunterladen. Später weiterarbeiten.';
saveSection.querySelector('.section-intro').textContent='Ein ZIP enthält Journal, Antworten, Projekt-Notebook mit Ausgaben, Protokoll und hinzugefügte Dateien. Auf einem anderen Gerät laden Sie das ZIP hier wieder hoch.';
saveSection.querySelector('.card h3').textContent='Dateien zum Projekt hinzufügen';
saveSection.querySelector('.card .small').textContent='Fotostudio-JSON und Originalfotos hier hinzufügen, damit sie im gemeinsamen Projekt-Download enthalten sind.';
$('download-submission').textContent='Abgabepaket herunterladen ↓';
$('download-backup').textContent='Notizen & Projekt herunterladen ↓';
saveSection.querySelector('label[for="restore-package"]').textContent='Notizen & Projekt wiederherstellen ↑';
const transferActions=saveSection.querySelector('.actions');transferActions.classList.add('project-transfer-actions');
const transferPrimary=document.createElement('div');transferPrimary.className='project-transfer-primary';
const submissionAction=document.createElement('div');submissionAction.className='project-submission-action';
const submissionLabel=document.createElement('p');submissionLabel.className='small';submissionLabel.textContent='Für die formelle Abgabe:';
const projectDownload=$('download-backup'),projectRestore=saveSection.querySelector('label[for="restore-package"]'),restoreInput=$('restore-package'),submissionDownload=$('download-submission');
projectDownload.className='btn primary';projectRestore.className='btn';submissionDownload.className='btn';
transferPrimary.append(projectDownload,projectRestore);submissionAction.append(submissionLabel,submissionDownload);transferActions.replaceChildren(transferPrimary,submissionAction,restoreInput);
saveSection.querySelector('.actions').nextElementSibling.nextElementSibling.textContent='Der Download übermittelt nichts automatisch. Das Hochladen ersetzt den aktuellen Browserstand. Laden Sie nach jeder Arbeitsphase eine ZIP herunter und bewahren Sie sie ausserhalb des Browsers auf.';
all('a[href="#sicherung"]').forEach(link=>link.textContent='Notizen & Projekt');
const projectTransferNote=all('#journal p').find(paragraph=>paragraph.textContent.includes('Ein gemeinsamer Stand auf einem Gerät'));
if(projectTransferNote)projectTransferNote.textContent='Ein gemeinsamer Stand auf einem Gerät. Für Gerätewechsel Notizen und Projekt herunterladen und später unter «Notizen & Projekt» wiederherstellen.';
function embeddedLearningPath(url,title,linkText){
 const figure=document.createElement('figure');figure.className='external-map';
 const frame=document.createElement('iframe');frame.src=url;frame.title=title;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
 const caption=document.createElement('figcaption');caption.append(title+' · ');
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=linkText;
 caption.append(link);figure.append(frame,caption);return figure;
}
const intro=document.getElementById('einstieg');
 intro.querySelector('.concept')?.closest('details')?.remove();
intro.querySelector('[data-answer="begriffe"]').previousElementSibling.textContent='Welche Beispiele aus der KI-Landkarte waren neu für Sie? Woran erkennen Sie, ob ein System aus Daten lernt?';
intro.querySelector('.lesson-steps').after(embeddedLearningPath('https://inf-schule.de/ki/menueansicht','Interaktive KI-Landkarte von inf-schule.de','in neuem Tab öffnen'));
const language=document.getElementById('sprache');
const learningExamples=[
 {title:'Überwacht · mit Labels',description:'Das System lernt mit Beispielen und den richtigen Kategorien. Danach ordnet es neue Beispiele zu.',links:[
  {href:'https://inf-schule.de/kids/computerinalltag/lernende-systeme/schritt2',text:'Smiley-Spiel: fröhlich oder traurig? · inf-schule'},
  {href:'https://quickdraw.withgoogle.com/',text:'Quick, Draw! Zeichnungen erkennen lassen'}
 ],note:'Quick, Draw! kann Zeichnungen zum öffentlichen Datensatz beitragen. Keine Namen oder persönlichen Motive zeichnen.'},
 {title:'Unüberwacht · ohne Labels',description:'Ohne vorgegebene Kategorien gruppiert das System ähnliche Punkte. Farben und Mittelpunkte zeigen, wie sich die Gruppen verändern.',links:[
  {href:'https://www.naftaliharris.com/blog/visualizing-k-means-clustering/',text:'K-Means-Visualisierung öffnen'}
 ],note:'Zum Einstieg «Gaussian Mixture» wählen und beobachten, wie die Punkte den Mittelpunkten zugeordnet werden.'},
 {title:'Verstärkend · mit Rückmeldung',description:'Auf eine Handlung folgt eine Rückmeldung. Im NIM-Spiel verändert sie, welche Züge das System später wählt.',links:[
  {href:'#nim-example',text:'NIM-Lernstrecke ansehen ↓'}
 ]}
];
const learningCards=language.querySelectorAll('.lesson-steps article');
learningCards.forEach((card,index)=>{
 const example=learningExamples[index];
 card.querySelector('b').textContent=example.title;
 card.querySelector('p').textContent=example.description;
 const links=document.createElement('div');links.className='learning-example-links';
 for(const item of example.links){const link=document.createElement('a');link.href=item.href;link.textContent=item.text;if(item.href.startsWith('https:')){link.target='_blank';link.rel='noopener noreferrer';}links.append(link);}
 card.append(links);
 if(example.note){const note=document.createElement('p');note.className='learning-example-note';note.textContent=example.note;card.append(note);}
});
const nimLink=language.querySelector('a[href="https://inf-schule.de/ki/menueansicht/ki_erkunden/nim-spiel/lernstrecke"]');
if(nimLink)nimLink.id='nim-example';
const miniModel=$('language-corpus');
const papageiPath=embeddedLearningPath('https://inf-schule.de/ki/menueansicht/ki_erkunden/papagei/lernstrecke','Papagei-Lernstrecke von inf-schule.de','Lernstrecke in neuem Tab öffnen');
const pathIntro=document.createElement('div');pathIntro.className='learning-path-intro';
const pathHeading=document.createElement('h2');pathHeading.textContent='Wie entsteht ein Text?';
const pathDescription=document.createElement('p');pathDescription.textContent='Die Lernstrecke führt vom Papagei-Prinzip zur Vorhersage von Wortfolgen. Vergleichen Sie die Beispiele mit dem Papierexperiment oben.';
pathIntro.append(pathHeading,pathDescription);papageiPath.prepend(pathIntro);
miniModel.closest('.card').replaceWith(papageiPath);
language.querySelector('.lesson-steps article:nth-child(2) p').textContent='Bearbeiten Sie die eingebettete Lernstrecke. Variieren Sie Kontext oder Wortwahl und halten Sie Beobachtungen fest.';
const turing=document.createElement('aside');turing.className='turing-activity';
const turingHeading=document.createElement('h2');turingHeading.textContent='Turing-Test: Mensch oder KI?';
const turingDescription=document.createElement('p');turingDescription.textContent='Human or Not ist ein kurzes Live-Chat-Spiel: Entscheiden Sie nach dem Gespräch, ob Sie mit einem Menschen oder einem KI-Bot geschrieben haben. Ein einzelner Versuch ist kein Beweis dafür, dass eine KI menschlich denkt.';
const privacyNote=document.createElement('p');privacyNote.className='small';privacyNote.textContent='Sie chatten mit fremden Teilnehmenden. Keine persönlichen Angaben teilen; nur nach Freigabe der Lehrperson spielen.';
const turingLink=document.createElement('a');turingLink.className='btn primary';turingLink.href='https://humanornot.so/start-search';turingLink.target='_blank';turingLink.rel='noopener noreferrer';turingLink.textContent='Human or Not extern öffnen';
turing.append(turingHeading,turingDescription,privacyNote,turingLink);papageiPath.after(turing);
language.querySelector('[data-answer="sprache"]').previousElementSibling.textContent='Welche Hinweise halfen Ihnen beim Turing-Test? Was verrät ein plausibler Text über die Grenzen eines Sprachmodells?';
const papageiLink=language.querySelector('details a[href="https://inf-schule.de/ki/menueansicht/ki_erkunden/papagei/lernstrecke"]');
if(papageiLink){const materials=papageiLink.closest('details');papageiLink.remove();materials.querySelector('summary').textContent='Papierexperiment von inf-schule';}
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
 clearTimeout(snapshotTimer);snapshotTimer=setTimeout(()=>{
    saving=transaction('artifacts','readwrite',s=>s.put({notebook,protocol,protocolSignature,restorePending},'project')).catch(()=>{artifactStored=false;status('Versuch nur vorübergehend verfügbar – Notizen & Projekt herunterladen.',true);});
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
 try{const raw=localStorage.getItem(KEY);if(raw)state=cleanState(JSON.parse(raw));else{const old=window.KIProgress?.get();if(old){state.journal.purpose=old.notes?.topic||old.topic||'';state.journal.groups=old.notes?.data||'';state.journal.hypothesis=old.notes?.question||'';}}}catch{status('Gespeicherter Text konnte nicht geladen werden. Projektstand hochladen.',true);}
 try{
  db=await new Promise((resolve,reject)=>{const q=indexedDB.open('kst-ki-kursportal',1);q.onupgradeneeded=()=>{q.result.createObjectStore('files');q.result.createObjectStore('artifacts');};q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);q.onblocked=()=>reject(Error('Browserspeicher blockiert'));});
  const artifact=await read('artifacts','project');if(artifact){notebook=artifact.notebook;protocol=artifact.protocol;protocolSignature=artifact.protocolSignature||'';restorePending=!!artifact.restorePending;}
  for(const f of state.files){const b=await read('files',f.id);if(b)files.set(f.id,b);}
 }catch{filesStored=false;status('Dateien werden nicht dauerhaft gespeichert. Notizen & Projekt herunterladen.',true);}
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
    for(const f of selected){const id=crypto.randomUUID();files.set(id,f);state.files.push({id,name:f.name,type:f.type});await transaction('files','readwrite',s=>s.put(f,id)).catch(()=>{filesStored=false;status('Dateien nur vorübergehend verfügbar – Notizen & Projekt herunterladen.',true);});}
  saveText();renderFiles();
 }catch(error){$('download-status').textContent=error.message;}finally{e.target.value='';}
});
// One fixed iframe, one standard Jupyter session at a time. No live state is moved.
const names={'perzeptron_und_neuronale_netze.ipynb':'Ein Neuron','mehrschichtige_netze.ipynb':'XOR-Netz','daten_training.ipynb':'Datenaufteilung','ki_lernlabor.ipynb':'Projekt-Lernlabor','ki_tandemprojekt.ipynb':'Unser Versuch'};
const frame=$('project-frame'),lab=$('project-lab'),projectName='ki_tandemprojekt.ipynb';
let activeName='',activeOwner='',switching=false;
// Never move an already loaded iframe: navigation only changes visibility or its URL.
document.querySelector('main > .footer').before(lab);$('lesson-lab').remove();
function request(frame,type,extra={}){return new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('Notebook antwortet noch nicht. Warten und erneut versuchen.'));},type==='restore'?120000:30000);pending.set(id,{resolve,reject,timer,source:frame.contentWindow});frame.contentWindow.postMessage({channel:'ki-portal-v1',type,id,...extra},location.origin);});}
function visibility(){const view=document.getElementById(activeOwner);lab.hidden=!activeName||!view||view.classList.contains('view-hidden');}
async function showNotebook(name,owner,scroll=true){
 if(!names[name]||switching)return;
 switching=true;
 try{
  if(name!==activeName||frame.dataset.ready==='error'){
   if(activeName&&frame.dataset.ready!=='error'){
    if(frame.dataset.ready!=='yes')throw Error('Der aktuelle Versuch startet noch. Danach erneut öffnen.');
    const saved=await request(frame,'snapshot');
    if(activeName===projectName)capture(saved.notebook,saved.protocol);
   }
   activeName=name;projectStarted=name===projectName;projectReady=false;
   frame.dataset.ready='no';delete frame.dataset.restored;
   $('project-lab-status').textContent='Python startet …';
   frame.src='../lab/index.html?path='+encodeURIComponent('portal/'+name)+'&ki-embed=1&reset';
  }
  activeOwner=owner;visibility();$('project-lab-title').textContent=names[name];
  lab.querySelector('details').hidden=name!==projectName;
  lab.querySelector('a[href="#journal"]').hidden=name!==projectName;
  if(scroll)lab.scrollIntoView({block:'start',behavior:'smooth'});
 }catch(error){$('project-lab-status').textContent=error.message;}
 finally{switching=false;}
}
$('start-project').addEventListener('click',()=>showNotebook(projectName,'journal'));
$('start-studio').addEventListener('click',()=>{const frame=$('studio-frame');$('studio-panel').hidden=false;if(!frame.getAttribute('src'))frame.src='studio/index.html';$('studio-panel').scrollIntoView({block:'start',behavior:'smooth'});});
all('[data-lab]').forEach(b=>b.addEventListener('click',()=>showNotebook(b.dataset.lab,b.closest('main > section')?.id||'projekt')));
window.addEventListener('hashchange',()=>{visibility();if(location.hash==='#journal'&&activeName)void showNotebook(projectName,'journal',false);});
all('[data-fullscreen]').forEach(b=>b.addEventListener('click',()=>{const node=$(b.dataset.fullscreen).closest('.lab-panel');if(node.requestFullscreen)node.requestFullscreen();}));
window.addEventListener('message',async event=>{
 if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.channel!=='ki-portal-v1')return;
 const data=event.data;
 if(data.path!=='portal/'+activeName)return;
 if(data.id&&pending.has(data.id)){const p=pending.get(data.id);clearTimeout(p.timer);pending.delete(data.id);data.type==='error'?p.reject(Error(data.error)):p.resolve(data);}
 if(data.type==='ready'){
  frame.dataset.ready=data.error?'error':(data.ready?'yes':'no');frame.dataset.path=data.path;frame.dataset.kernelId=data.kernelId||'';
  $('project-lab-status').textContent=data.error||(data.ready?'Bereit · gespeicherte Ausgaben bleiben sichtbar; Daten bei Bedarf erneut laden.':'Python startet …');
  if(projectStarted&&data.ready&&!projectReady){
   projectReady=true;await initialization;
   try{
    if(restorePending&&notebook){await request(frame,'restore',{notebook});restorePending=false;frame.dataset.restored='yes';persistArtifacts();$('project-lab-status').textContent='Projektstand geladen. Erste Codezelle und Datenimport erneut ausführen.';}
    else capture(data.notebook);
   }catch(error){frame.dataset.ready='error';projectReady=false;$('project-lab-status').textContent=error.message+' Versuch erneut öffnen.';}
  }
 }
 if(projectStarted&&data.type==='changed'&&!restorePending)capture(data.notebook);
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
  if(projectStarted){if(restorePending)throw Error('Der Projektstand wird noch geladen. Bitte warten.');if(!projectReady)throw Error('Der Versuch startet noch. Bitte warten.');const result=await request($('project-frame'),'snapshot');capture(result.notebook,result.protocol);}
  if(state.files.some(f=>!files.has(f.id)))throw Error('Einige Datendateien fehlen. Bitte erneut hinzufügen.');
  const absent=missing();if(submission&&absent.length&&!confirm('Noch unvollständig: '+absent.join(', ')+'. Trotzdem diesen Stand herunterladen?'))return;
  const snapshot={...state,exported:new Date().toISOString(),progress:window.KIProgress?.get(),protocol,protocolSignature};
    const entries=[{name:'kursstand.json',data:JSON.stringify(snapshot,null,2)},{name:'Journal.html',data:journalHTML()},{name:'LESEN.txt',data:'Journal.html im Browser öffnen: Antworten und Versuchsausgaben.\nversuch.ipynb enthält den Code und die Ausgaben.\nDie ZIP-Datei kann auf der Kursseite als Projektstand wiederhergestellt werden.\nOriginale und Fotostudio-JSON liegen im Ordner daten.\nFür eine lokale Wiederholung: Python 3.12, numpy, scipy, scikit-learn, matplotlib, pillow, ipywidgets; Notebook-Zellen der Reihe nach ausführen und Fotostudio-JSON auswählen.\nDer Download ist keine automatische Einreichung.\n'}];
  const nb=notebookForExport();if(nb)entries.push({name:'versuch.ipynb',data:JSON.stringify(nb,null,1)});
  if(protocol)entries.push({name:'Versuchsprotokoll.json',data:JSON.stringify(protocol,null,2)});
  for(const f of state.files)entries.push({name:'daten/'+f.id+'_'+f.name.replace(/[^a-zA-Z0-9._-]/g,'_'),data:files.get(f.id)});
  if(nb){for(const file of ['ki_foto_tools.py','ki_projekt_tools.py','foto_uebungsdaten.json']){const r=await fetch('runtime/'+file);if(!r.ok)throw Error('Hilfsdateien konnten nicht geladen werden. Internetverbindung prüfen.');entries.push({name:'ki_projekt/'+file,data:await r.blob()});}}
    const blob=await makeZip(entries);download(blob,(submission?'KI-Abgabe':'KI-Projektstand')+'-'+new Date().toISOString().slice(0,10)+'.zip');$('download-status').textContent=submission?'Abgabepaket heruntergeladen. '+(absent.length?'Noch offen: '+absent.join(' · '):'Vor dem Einreichen das Journal kurz prüfen.'):'Notizen und Projekt heruntergeladen. Das ZIP enthält Ihren vollständigen Projektstand.';
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
    if(!confirm('Aktuelle Notizen, Versuch und Dateien durch diesen Projektstand ersetzen? Ungesicherte Änderungen gehen verloren.'))return;
  if(projectStarted && nextNotebook){if(!projectReady)throw Error('Bitte warten, bis der Versuch gestartet ist.');await request($('project-frame'),'restore',{notebook:nextNotebook});$('project-frame').dataset.restored='yes';}
  await transaction('files','readwrite',s=>{s.clear();for(const [id,blob] of nextFiles)s.put(blob,id);}).catch(()=>{filesStored=false;status('Import nur für diese Sitzung. Notizen & Projekt herunterladen.',true);});
  state=next;files=nextFiles;notebook=nextNotebook;protocol=raw.protocol||null;protocolSignature=raw.protocolSignature||'';restorePending=!!nextNotebook&&!projectStarted;
  if(raw.progress)window.KIProgress?.restore(raw.progress);
    render();saveText();persistArtifacts();$('download-status').textContent='Projektstand wiederhergestellt. Erste Codezelle und Datenimport erneut ausführen. Gespeicherte Ausgaben bleiben sichtbar; kein Code wurde automatisch ausgeführt.';
 }catch(error){$('download-status').textContent='Import fehlgeschlagen: '+error.message;}finally{e.target.value='';}
});
// A small matching activity, deliberately separate from the assessed project.
const pairs=[['Überwachtes Lernen','Beispiele mit richtiger Antwort'],['Unüberwachtes Lernen','Gruppen ohne vorgegebene Antworten'],['Verstärkendes Lernen','Erfolg oder Misserfolg nach Handlungen']];
let flipped=[],locked=false,matches=0,memoryTimer;
function memory(){clearTimeout(memoryTimer);flipped=[];locked=false;matches=0;const cards=pairs.flatMap((p,i)=>p.map(text=>({text,pair:i})));for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}$('memory-board').replaceChildren();$('memory-status').textContent='Drehen Sie zwei Karten um.';for(const card of cards){const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.setAttribute('aria-label','Verdeckte Karte');b.addEventListener('click',()=>{if(locked||b.classList.contains('revealed')||b.classList.contains('matched'))return;b.classList.add('revealed');b.textContent=card.text;b.setAttribute('aria-label',card.text);flipped.push({b,pair:card.pair});if(flipped.length===2){if(flipped[0].pair===flipped[1].pair){flipped.forEach(x=>{x.b.classList.add('matched');x.b.disabled=true;});flipped=[];matches++;$('memory-status').textContent=matches===3?'Alle Paare gefunden. Erklären Sie zu jeder Lernart ein eigenes Beispiel.':matches+' von 3 Paaren gefunden.';}else{locked=true;$('memory-status').textContent='Dieses Paar passt noch nicht zusammen.';memoryTimer=setTimeout(()=>{flipped.forEach(x=>{x.b.classList.remove('revealed');x.b.textContent='?';x.b.setAttribute('aria-label','Verdeckte Karte');});flipped=[];locked=false;},1000);}}});$('memory-board').append(b);}}
$('memory-reset').addEventListener('click',memory);memory();
