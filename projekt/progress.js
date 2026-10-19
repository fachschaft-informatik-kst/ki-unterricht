
'use strict';
(()=>{
const $=id=>document.getElementById(id),all=s=>Array.from(document.querySelectorAll(s));
const key='kst-ki-projekt-2026-v1',schema='ki-projekt-seitenstand-v1';
const checks=all('[data-check]'),skills=all('[data-skill]'),notes=all('[data-note]'),topics=all('[data-topic]'),scores=all('[data-score]');
const blank=()=>({schema,checks:{},skills:{},notes:{},scores:{},topic:''});let state=blank(),storageOK=true;
function valid(raw){
 if(!raw||raw.schema!==schema)throw Error('Bitte eine exportierte Datei mit dem Seitenstand auswählen.');
 const clean=blank();
 for(const x of checks)clean.checks[x.dataset.check]=raw.checks?.[x.dataset.check]===true;
 for(const x of skills){const v=raw.skills?.[x.dataset.skill];clean.skills[x.dataset.skill]=['offen','ueben','hilfe','sicher'].includes(v)?v:'offen';}
 for(const x of notes){const v=raw.notes?.[x.dataset.note];clean.notes[x.dataset.note]=typeof v==='string'?v.slice(0,20000):'';}
 for(const x of scores){const v=raw.scores?.[x.dataset.score];clean.scores[x.dataset.score]=['0','1','2','3'].includes(v)?v:'';}
 clean.topic=topics.some(t=>t.dataset.topic===raw.topic)?raw.topic:'';return clean;
}
try{const saved=localStorage.getItem(key);if(saved)state=valid(JSON.parse(saved));}catch(e){storageOK=false;}
function save(){
 try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;$('save-status').textContent='Stand in diesem Browser gespeichert. Keine automatische Abgabe.';}
 catch(e){storageOK=false;$('save-status').textContent='Lokales Speichern ist nicht verfügbar. Nutzen Sie «Stand herunterladen», bevor Sie die Seite schliessen.';}
}
function progress(){const n=checks.filter(x=>x.checked).length;$('progress').value=n;$('progress-text').textContent=n+' von '+checks.length+' Schritten';const safe=skills.filter(x=>x.value==='sicher').length;$('skill-summary').textContent=safe+' von '+skills.length+' Kompetenzen: «Sicher erklären». Eigene Einschätzung, keine Note.';}
function grade(){
 const answered=scores.filter(x=>x.value!=='');
 const points=answered.reduce((sum,x)=>sum+Number(x.value),0);
 const result=$('grade-result');
 if(answered.length!==scores.length){result.textContent=points+' Punkte bisher · '+answered.length+' / '+scores.length+' Kompetenzen eingeschätzt. Noch keine Gesamtnote.';return;}
 const raw=1+5*points/30,rounded=Math.round(raw*4)/4;
 result.textContent=points+' / 30 Punkte → Note '+rounded.toLocaleString('de-CH',{minimumFractionDigits:2,maximumFractionDigits:2})+' (ungerundet: '+raw.toLocaleString('de-CH',{maximumFractionDigits:3})+').';
}
function choose(){topics.forEach(t=>{const on=state.topic===t.dataset.topic;t.classList.toggle('is-chosen',on);const b=t.querySelector('[data-choose]');b.setAttribute('aria-pressed',String(on));b.textContent=on?'Vorgemerkt ✓':'Als Thema vormerken';});}
function render(){checks.forEach(x=>x.checked=state.checks[x.dataset.check]===true);skills.forEach(x=>x.value=state.skills[x.dataset.skill]||'offen');notes.forEach(x=>x.value=state.notes[x.dataset.note]||'');scores.forEach(x=>x.value=state.scores?.[x.dataset.score]??'');choose();progress();grade();}
checks.forEach(x=>x.addEventListener('change',()=>{state.checks[x.dataset.check]=x.checked;progress();save();}));
skills.forEach(x=>x.addEventListener('change',()=>{state.skills[x.dataset.skill]=x.value;progress();save();}));
scores.forEach(x=>x.addEventListener('change',()=>{state.scores[x.dataset.score]=x.value;grade();save();}));
notes.forEach(x=>{x.maxLength=20000;x.addEventListener('input',()=>{state.notes[x.dataset.note]=x.value;save();});});
all('[data-choose]').forEach(b=>b.addEventListener('click',()=>{state.topic=state.topic===b.dataset.choose?'':b.dataset.choose;choose();save();}));
function filter(){const q=$('topic-search').value.trim().toLocaleLowerCase('de'),kind=$('topic-filter').value;let n=0;topics.forEach(t=>{const visible=t.textContent.toLocaleLowerCase('de').includes(q)&&(kind==='all'||kind===t.dataset.kind);t.hidden=!visible;if(visible)n++;});$('topic-count').textContent=n+' von 12 Themen';$('topic-empty').hidden=n!==0;}
$('topic-search').addEventListener('input',filter);$('topic-filter').addEventListener('change',filter);
function experiment(name){all('[data-experiment]').forEach(x=>x.hidden=x.dataset.experiment!==name);all('[data-exp]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.exp===name)));}
all('[data-exp]').forEach(b=>b.addEventListener('click',()=>experiment(b.dataset.exp)));
$('export-state').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ki-projekt-seitenstand.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import-state').addEventListener('change',async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>250000)throw Error('Die Datei ist zu gross für einen Seitenstand.');const next=valid(JSON.parse(await f.text()));if(!confirm('Den aktuellen Seitenstand durch die importierte Datei ersetzen?'))return;state=next;render();save();}catch(err){$('save-status').textContent='Import fehlgeschlagen: '+err.message;}finally{e.target.value='';}});
$('reset-state').addEventListener('click',()=>{if(confirm('Häkchen, Notizen, Themenwahl und Selbsteinschätzung auf diesem Gerät zurücksetzen? Notebook und Fotos bleiben erhalten.')){state=blank();render();save();}});
let beforePrint=[];window.addEventListener('beforeprint',()=>{beforePrint=all('details').map(d=>[d,d.open]);all('details').forEach(d=>d.open=true);});window.addEventListener('afterprint',()=>beforePrint.forEach(([d,open])=>d.open=open));$('print-page').addEventListener('click',()=>window.print());
const links=all('.nav a'),views=all('main > section');
let chapterObserver=null;
// Kapitel der aktuellen Seite: Unterpunkte in der Navigation, Knopf «Alle ein-/aufklappen», aktuelle Leseposition.
function renderChapters(view){
 all('.nav-sub').forEach(e=>e.remove());
 if(chapterObserver){chapterObserver.disconnect();chapterObserver=null;}
 const chapters=Array.from(view.querySelectorAll('details.kapitel'));
 if(chapters.length<2)return;
 const navLink=links.find(a=>a.hash==='#'+(view.dataset.nav||view.id));
 const subLinks=new Map();
 if(navLink){
  const box=document.createElement('div');box.className='nav-sub';
  for(const k of chapters){
   const a=document.createElement('a'),nr=document.createElement('span');
   a.href='#'+k.id;nr.textContent=k.querySelector('.kapitel-nr').textContent;
   a.append(nr,k.querySelector('.kapitel-titel').textContent);box.append(a);subLinks.set(k,a);
  }
  navLink.after(box);
 }
 // Die Unterkapitel stehen bereits in der Seitennavigation und als aufklappbare Kapitel.
 // Keine zweite Kapitelübersicht über dem Inhalt erzeugen.
 view.querySelectorAll('.kapitel-uebersicht').forEach(e=>e.remove());
 if('IntersectionObserver' in window&&subLinks.size){
  chapterObserver=new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){subLinks.forEach((a,k)=>{if(k===e.target)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
  },{rootMargin:'-15% 0px -70% 0px'});
  chapters.forEach(k=>chapterObserver.observe(k));
 }
}
let currentView=null;
function route(){
 const id=decodeURIComponent(location.hash.slice(1)||'start');
 const target=$(id),view=target?.closest('main > section')||$('start');
 views.forEach(v=>v.classList.toggle('view-hidden',v!==view));
 links.forEach(a=>{if(a.hash==='#'+(view.dataset.nav||view.id))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(target&&target!==view){let p=target;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}}
 currentView=view;renderChapters(view);
 view.tabIndex=-1;
 requestAnimationFrame(()=>{if(target&&target!==view)target.scrollIntoView({block:'start'});else window.scrollTo({top:0,behavior:'instant'});view.focus({preventScroll:true});});
}
window.addEventListener('hashchange',route);
document.addEventListener('DOMContentLoaded',()=>{if(currentView)renderChapters(currentView);});
window.KIProgress={get:()=>structuredClone(state),restore:raw=>{state=valid(raw);render();save();}};
render();filter();experiment('vielfalt');document.documentElement.classList.add('has-js');route();
// Navigation einklappen (nur Desktop); der Zustand bleibt im Browser erhalten.
{const toggle=document.createElement('button'),navKey='kst-ki-nav-collapsed',sidebar=document.querySelector('.sidebar');let collapsed=false;
 try{collapsed=localStorage.getItem(navKey)==='1';}catch{}
 toggle.type='button';toggle.className='nav-toggle';
 const apply=()=>{document.body.classList.toggle('nav-collapsed',collapsed);sidebar.inert=collapsed&&matchMedia('(min-width:721px)').matches;toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Navigation einblenden':'Navigation einklappen');toggle.title=toggle.getAttribute('aria-label');toggle.textContent=collapsed?'›':'‹';};
 toggle.addEventListener('click',()=>{collapsed=!collapsed;try{localStorage.setItem(navKey,collapsed?'1':'0');}catch{}apply();});
 matchMedia('(min-width:721px)').addEventListener('change',apply);
 document.body.append(toggle);apply();}
if(!storageOK)$('save-status').textContent='Gespeicherter Stand konnte nicht geladen werden. Sichern Sie Ihre Arbeit über den Download.';
})();
