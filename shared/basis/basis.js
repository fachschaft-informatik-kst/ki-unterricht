'use strict';
(()=>{
const sections=[...document.querySelectorAll('main > section')];
const links=[...document.querySelectorAll('.nav > a')];
const submenus=new Map();
const key='kst-ki-basis-v1';
document.documentElement.classList.add('has-js');
// #feld-<name> jumps to the student field with that data-answer/-basis-answer/-journal name.
function byHash(id){
  if(!id.startsWith('feld-'))return document.getElementById(id);
  const name=id.slice(5);
  return [...document.querySelectorAll('[data-answer],[data-basis-answer],[data-journal]')]
    .find(e=>e.dataset.answer===name||e.dataset.basisAnswer===name||e.dataset.journal===name)||null;
}
// Lazy images above the field change the layout while it loads, so keep the
// field centered until the page settles or the reader scrolls on their own.
function jumpToField(target){
 const spot=target.closest('label,.ki-sort-card')||target;
 const go=()=>spot.scrollIntoView({block:'center',behavior:'instant'});
 const stop=()=>{document.removeEventListener('load',go,true);for(const t of ['wheel','touchstart','keydown','mousedown'])window.removeEventListener(t,stop,true);};
 go();document.addEventListener('load',go,true);
 for(const t of ['wheel','touchstart','keydown','mousedown'])window.addEventListener(t,stop,{capture:true,once:true});
 spot.classList.add('field-jump');
 setTimeout(()=>{stop();spot.classList.remove('field-jump');},3500);
}
function show(){
  const id=decodeURIComponent((location.hash||'#basis-start').slice(1));
  const chapter=byHash(id);
  const parent=sections.find(s=>s.id===id||s.contains(chapter));
  const active=parent||sections[0];
  for(const s of sections){
    s.classList.toggle('basis-view-hidden',s!==active);
    if(s.hasAttribute('data-pages')){
      const page=s===active?chapter?.closest('details.kapitel,#basis-bewertung'):null;
      const selected=page?.parentElement===s?page:null;
      s.classList.toggle('has-page',!!selected);
      for(const child of s.children)child.classList.toggle('is-page',child===selected);
      if(selected)selected.open=true;
    }
  }
  for(const a of [...document.querySelectorAll('.nav a')])a.removeAttribute('aria-current');
  const navId=active.dataset.navParent||active.id;
  const current=links.find(a=>a.hash==='#'+navId);
  if(current)current.setAttribute('aria-current','page');
  const chapterId=chapter?.closest('details.kapitel,#basis-bewertung')?.id||active.id;
  const chapterLink=[...document.querySelectorAll('.nav-sub a')].find(a=>a.hash==='#'+chapterId);
  if(chapterLink)chapterLink.setAttribute('aria-current','page');
  // Only expand subchapters for the current double lesson. Keep all lesson
  // links visible so students can always switch lessons.
  for(const [lessonId,menu] of submenus){
    const expanded=lessonId===navId;
    menu.hidden=!expanded;
    const lessonLink=links.find(a=>a.hash==='#'+lessonId);
    if(lessonLink)lessonLink.setAttribute('aria-expanded',String(expanded));
  }
  for(let p=chapter;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
  if(id.startsWith('feld-')&&chapter)requestAnimationFrame(()=>jumpToField(chapter));
  else if(id!==active.id&&chapter)requestAnimationFrame(()=>chapter.scrollIntoView({block:'start'}));
  else window.scrollTo({top:0,left:0});
}
for(const section of sections){
 const chapters=[...section.querySelectorAll('details.kapitel')];
 if(!chapters.length)continue;
 const link=links.find(a=>a.hash==='#'+section.id);
 if(!link)continue;
 const submenu=document.createElement('div');submenu.className='nav-sub';submenu.hidden=true;
 submenu.setAttribute('role','group');submenu.setAttribute('aria-label','Unterkapitel zu '+(link.textContent||section.id).trim());
 if(section.hasAttribute('data-pages')){
   const home=document.createElement('a');home.href='#'+section.id;home.textContent='Fahrplan';submenu.append(home);
   for(const chapter of chapters){const summary=chapter.querySelector(':scope > summary');if(summary){summary.tabIndex=-1;summary.addEventListener('click',e=>e.preventDefault());}}
 }
 for(const chapter of chapters){
   const a=document.createElement('a');a.href='#'+chapter.id;
   a.textContent=chapter.querySelector('.kapitel-titel')?.textContent||chapter.id;
   submenu.append(a);
 }
 if(section.id==='basis-daten'&&section.querySelector('#projekt-4')){
   const journal=document.getElementById('basis-journal');
   if(journal){journal.dataset.navParent=section.id;const a=document.createElement('a');a.href='#basis-journal';a.textContent='Journal & Notebook';submenu.append(a);}
   if(section.querySelector('#basis-bewertung')){const a=document.createElement('a');a.href='#basis-bewertung';a.textContent='Bewertung';submenu.append(a);}
 }
 link.after(submenu);
 submenus.set(section.id,submenu);
 link.setAttribute('aria-expanded','false');
}
window.addEventListener('hashchange',show);
show();
// Project checkboxes and the topic selection travel with the normal JSON/ZIP.
const checks=[...document.querySelectorAll('.roadmap [data-check]')];
for(const field of checks)field.dataset.basisAnswer='project-check-'+field.dataset.check;
const topics=[...document.querySelectorAll('[data-topic]')];
let topicField=null;
if(topics.length){
 topicField=document.createElement('input');topicField.type='hidden';topicField.dataset.basisAnswer='project-topic';
 topics[0].parentElement.before(topicField);
}
const fieldValue=f=>f.type==='checkbox'?(f.checked?'true':''):f.value;
const setField=(f,value)=>{if(f.type==='checkbox')f.checked=value==='true';else f.value=value;};
const fields=[...document.querySelectorAll('[data-basis-answer]')];
let data={};
try{const x=JSON.parse(localStorage.getItem(key)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))data=x;}catch{}
for(const field of fields){
 const name=field.dataset.basisAnswer;
 if(typeof data[name]==='string')setField(field,data[name]);
 field.addEventListener('input',()=>{
   data[name]=fieldValue(field);
   try{localStorage.setItem(key,JSON.stringify(data));document.getElementById('basis-save-status').textContent='Notizen in diesem Browser gespeichert.';}
   catch{document.getElementById('basis-save-status').textContent='Speichern nicht möglich – bitte Notizen herunterladen.';}
 });
}
function renderProject(){
 const projectChecks=checks.filter(c=>c.dataset.check.startsWith('phase-'));
 const progress=document.getElementById('progress'),progressText=document.getElementById('progress-text');
 if(progress&&progressText){progress.max=projectChecks.length;progress.value=projectChecks.filter(c=>c.checked).length;progressText.textContent=progress.value+' von '+progress.max+' Schritten';}
 for(const list of document.querySelectorAll('.roadmap')){
  let next=false;
  for(const step of list.querySelectorAll('.roadmap-step')){
   const c=step.querySelector('[data-check]');step.classList.toggle('is-done',!!c?.checked);
   step.classList.toggle('is-next',!!c&&!c.checked&&!next);if(c&&!c.checked)next=true;
  }
 }
 for(const topic of topics){const selected=topic.dataset.topic===topicField?.value;topic.classList.toggle('is-chosen',selected);const b=topic.querySelector('[data-choose]');if(b){b.setAttribute('aria-pressed',String(selected));b.textContent=selected?'Vorgemerkt ✓':'Als Thema vormerken';}}
 for(const step of document.querySelectorAll('.journal-step')){const inputs=[...step.querySelectorAll('[data-basis-answer]:not([data-optional])')],label=step.querySelector('.completion');if(label)label.textContent=inputs.filter(f=>f.value.trim()).length+' / '+inputs.length;}
}
for(const topic of topics)topic.querySelector('[data-choose]')?.addEventListener('click',()=>{topicField.value=topicField.value===topic.dataset.topic?'':topic.dataset.topic;topicField.dispatchEvent(new Event('input',{bubbles:true}));});
function filterTopics(){const q=document.getElementById('topic-search')?.value.trim().toLocaleLowerCase('de')||'',kind=document.getElementById('topic-filter')?.value||'all';let count=0;for(const topic of topics){topic.hidden=!(topic.textContent.toLocaleLowerCase('de').includes(q)&&(kind==='all'||kind===topic.dataset.kind));if(!topic.hidden)count++;}const out=document.getElementById('topic-count'),empty=document.getElementById('topic-empty');if(out)out.textContent=count+' von '+topics.length+' Themen';if(empty)empty.hidden=count!==0;}
document.getElementById('topic-search')?.addEventListener('input',filterTopics);
document.getElementById('topic-filter')?.addEventListener('change',filterTopics);
document.addEventListener('input',renderProject);
renderProject();if(topics.length)filterTopics();
document.getElementById('start-studio')?.addEventListener('click',()=>{
 const panel=document.getElementById('studio-panel'),frame=document.getElementById('studio-frame');
 if(!panel||!frame)return;panel.hidden=false;panel.open=true;if(!frame.getAttribute('src'))frame.src='studio/index.html';panel.scrollIntoView({block:'start'});
});
const transferStatus=document.getElementById('basis-answer-transfer-status');
document.getElementById('basis-download').addEventListener('click',()=>{
 // Read every current field (including selects), not just keys seen during this session.
 const answers=Object.fromEntries(fields.map(field=>[field.dataset.basisAnswer,fieldValue(field)]));
 const blob=new Blob([JSON.stringify({schema:key,answers},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='KI-1-Klasse-Antworten.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
 transferStatus.textContent='Antworten heruntergeladen. Die JSON-Datei auf einem anderen Gerät hier wieder hochladen.';
});
document.getElementById('basis-import').addEventListener('change',async event=>{
 const input=event.target,file=input.files?.[0];if(!file)return;
 try{
  if(file.size>1024*1024)throw Error('Die Antwortdatei ist zu gross (maximal 1 MB).');
  const raw=JSON.parse(await file.text());
  if(raw?.schema!==key||!raw.answers||typeof raw.answers!=='object'||Array.isArray(raw.answers))
   throw Error('Keine gültige Antwortdatei der 1. Klasse.');
  if(Object.keys(raw.answers).length>500)throw Error('Zu viele Antwortfelder in der Datei.');
  for(const value of Object.values(raw.answers))
   if(typeof value!=='string'||value.length>20000)throw Error('Ungültiger oder zu langer Antworttext.');
  if(!confirm('Aktuelle Antworten durch die ausgewählte Datei ersetzen? Notebooks und Fotodaten bleiben erhalten.'))return;
  for(const field of fields){
   const value=raw.answers[field.dataset.basisAnswer]??'';
   setField(field,field.tagName==='SELECT'&&![...field.options].some(option=>option.value===value)?'':value);
   field.dispatchEvent(new Event('input',{bubbles:true}));
  }
  transferStatus.textContent='Antworten wiederhergestellt – auch die Auswahlaufgaben. Notebooks und Fotos wurden nicht verändert.';
 }catch(error){transferStatus.textContent='Antworten nicht geladen: '+error.message;}
 finally{input.value='';}
});
for(const lab of document.querySelectorAll('[data-basis-neuron]')){
 const sliders=[...lab.querySelectorAll('[data-weight]')],out=lab.querySelector('[data-live-output]');
 function render(){
  const w=Object.fromEntries(sliders.map(s=>[s.dataset.weight,Number(s.value)]));
  for(const s of sliders)lab.querySelector('[data-value="'+s.dataset.weight+'"]').textContent=s.value;
  out.replaceChildren();
  for(const sun of [0,1])for(const friend of [0,1]){
   const sum=sun*w.sun+friend*w.friend+w.bias,answer=sum>=0?1:0;
   const tr=document.createElement('tr');
   for(const value of [sun,friend,Number(sum.toFixed(2)),answer]){
    const td=document.createElement('td');td.textContent=String(value);if(value===answer&&tr.children.length===3)td.dataset.on=String(answer);tr.append(td);
   }
   out.append(tr);
  }
 }
 for(const slider of sliders)slider.addEventListener('input',render);
 render();
}
// Lokale und bewusst vereinfachte Wortvorhersage (kein Chatbot und kein ML-Modell).
// Feste Beispielwerte illustrieren den Einfluss des Kontexts auf Wortvorschläge.
for(const lab of document.querySelectorAll('[data-basis-language]')){
 const context=lab.querySelector('[data-language-context]'),
  prompt=lab.querySelector('[data-language-prompt]'),
  options=lab.querySelector('[data-language-options]'),
  result=lab.querySelector('[data-language-result]');
 const examples={
  garten:{text:'Im Garten jagt der Hund den …',words:[['Ball',50],['Schmetterling',35],['Fussball',15]]},
  sport:{text:'Auf dem Fussballplatz jagt der Hund den …',words:[['Fussball',75],['Ball',20],['Schmetterling',5]]},
  maerchen:{text:'Im Märchen wohnt der König im …',words:[['Schloss',80],['Haus',15],['Zelt',5]]}
 };
 const redraw=()=>{
  const example=examples[context.value];if(!example)return;
  prompt.textContent=example.text;
  result.textContent='Wähle eine der möglichen Fortsetzungen. Eine hohe Beispiel-Wahrscheinlichkeit beweist keine Wahrheit.';
  options.replaceChildren();
  for(const [word,weight] of example.words){
   const button=document.createElement('button');
   button.type='button';button.className='basis-language-option';
   button.setAttribute('aria-label',word+', Beispiel-Wahrscheinlichkeit '+weight+' Prozent');
   const wordLabel=document.createElement('span');wordLabel.textContent=word;
   const percentage=document.createElement('strong');percentage.textContent=weight+' %';
   const bar=document.createElement('span');bar.className='basis-language-bar';
   const fill=document.createElement('span');fill.style.width=weight+'%';
   bar.append(fill);button.append(wordLabel,percentage,bar);
   button.addEventListener('click',()=>{
    result.textContent=example.text.replace('…',word+'.')+' Das ist nur eine mögliche Fortsetzung.';
   });
   options.append(button);
  }
 };
 context.addEventListener('change',redraw);
 redraw();
}

// Zwei-Schicht-XOR ist als logisches Modell vollständig lokal ausführbar.
for(const lab of document.querySelectorAll('[data-basis-network]')){
 const a=lab.querySelector('[data-network-input="a"]'),b=lab.querySelector('[data-network-input="b"]');
 const rows=lab.querySelector('[data-network-rows]'),result=lab.querySelector('[data-network-result]');
 const calc=(x,y)=>{const or=Number(Boolean(x||y)),nand=Number(!(x&&y));return [or,nand,Number(Boolean(or&&nand))]};
 const render=()=>{
  const x=Number(a.checked),y=Number(b.checked);
  lab.querySelector('[data-network-value="a"]').textContent=x;
  lab.querySelector('[data-network-value="b"]').textContent=y;
  rows.replaceChildren();
  for(const i of [0,1])for(const j of [0,1]){
   const tr=document.createElement('tr'),vals=[i,j,...calc(i,j)];
   if(i===x&&j===y)tr.dataset.selected='true';
   for(const v of vals){const td=document.createElement('td');td.textContent=String(v);tr.append(td);}
   rows.append(tr);
  }
  const [or,nand,xor]=calc(x,y);
  result.textContent='OR = '+or+', NAND = '+nand+' → XOR = '+xor+' (genau eine Eingabe aktiv).';
 };
 a.addEventListener('change',render);b.addEventListener('change',render);render();
}
// Die drei Lernarten aus der 4. Klasse behalten ihr Memory als selbstständige Sicherung.
const memory=document.querySelector('#memory-board');
const cardsData=document.querySelector('#memory-pairs');
if(memory&&cardsData){
 const pairs=JSON.parse(cardsData.textContent),status=document.querySelector('#memory-status');
 let first=null,matched=new Set();
 const deck=pairs.flatMap(([left,right],i)=>[{value:left,pair:i},{value:right,pair:i}]);
 const buttons=[];
 const hideUnmatched=()=>{buttons.forEach((button,index)=>{if(!matched.has(index)&&index!==first){button.textContent='?';button.setAttribute('aria-label','Verdeckte Memory-Karte');}});};
 const shuffle=()=>{
  matched=new Set();first=null;buttons.length=0;memory.replaceChildren();
  const cards=[...deck].sort(()=>Math.random()-.5);
  const grid=document.createElement('div');grid.className='basis-memory-grid';
  cards.forEach(({value,pair},index)=>{
    const button=document.createElement('button');button.type='button';button.textContent='?';button.dataset.matched='false';
    button.setAttribute('aria-label','Verdeckte Memory-Karte');
    button.addEventListener('click',()=>{
      if(matched.has(index)||button===buttons[first])return;
      button.textContent=value;button.setAttribute('aria-label',value);
      if(first===null){first=index;status.textContent='Welche passende Karte gehört dazu?';return;}
      const start=first;first=null;
      if(cards[start].pair===pair){
        matched.add(start);matched.add(index);
        buttons[start].dataset.matched='true';button.dataset.matched='true';
        status.textContent=matched.size===cards.length?'Alle drei Lernarten richtig zugeordnet!':'Richtig – das Paar gehört zusammen.';
      }else{
        status.textContent='Noch kein Paar: überlegen und erneut versuchen.';
        setTimeout(()=>{if(!matched.has(start)&&!matched.has(index)){buttons[start].textContent='?';button.textContent='?';}},800);
      }
    });
    buttons.push(button);grid.append(button);
  });
  memory.append(grid);status.textContent='Drehen Sie zwei Karten um.';
 };
 document.querySelector('#memory-reset')?.addEventListener('click',shuffle);
 shuffle();
}
// Keep the desktop navigation collapsible like the fourth-year course.
// Persist this independently so both courses can use different preferences.
{
 const sidebar=document.querySelector('.sidebar'),navKey='kst-ki-basis-nav-collapsed';
 const toggle=document.createElement('button');
 let collapsed=false;
 try{collapsed=localStorage.getItem(navKey)==='1';}catch{}
 toggle.type='button';toggle.className='nav-toggle';
 const media=matchMedia('(min-width:721px)');
 const apply=()=>{
   document.body.classList.toggle('nav-collapsed',collapsed);
   sidebar.inert=collapsed&&media.matches;
   toggle.setAttribute('aria-expanded',String(!collapsed));
   toggle.setAttribute('aria-label',collapsed?'Navigation einblenden':'Navigation einklappen');
   toggle.title=toggle.getAttribute('aria-label');
   toggle.textContent=collapsed?'›':'‹';
 };
 toggle.addEventListener('click',()=>{collapsed=!collapsed;try{localStorage.setItem(navKey,collapsed?'1':'0');}catch{}apply();});
 media.addEventListener('change',apply);
 document.body.append(toggle);apply();
}
document.getElementById('print-page')?.addEventListener('click',()=>window.print());
})();
