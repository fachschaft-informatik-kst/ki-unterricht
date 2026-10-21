'use strict';
(()=>{
const sections=[...document.querySelectorAll('main > section')];
const links=[...document.querySelectorAll('.nav > a')];
const submenus=new Map();
const key='kst-ki-basis-v1';
document.documentElement.classList.add('has-js');
function show(){
  const id=decodeURIComponent((location.hash||'#basis-start').slice(1));
  if(id==='basis-sicherung'){
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
    return;
  }
  const chapter=document.getElementById(id);
  const parent=sections.find(s=>s.id===id||s.contains(chapter));
  const active=parent||sections[0];
  for(const s of sections)s.classList.toggle('basis-view-hidden',s!==active);
  for(const a of [...document.querySelectorAll('.nav a')])a.removeAttribute('aria-current');
  const current=links.find(a=>a.hash==='#'+active.id);
  if(current)current.setAttribute('aria-current','page');
  // Only expand subchapters for the current double lesson. Keep all lesson
  // links visible so students can always switch lessons.
  for(const [lessonId,menu] of submenus){
    const expanded=lessonId===active.id;
    menu.hidden=!expanded;
    const lessonLink=links.find(a=>a.hash==='#'+lessonId);
    if(lessonLink)lessonLink.setAttribute('aria-expanded',String(expanded));
  }
  if(chapter?.matches('details.kapitel'))chapter.open=true;
  if(id!==active.id&&chapter)requestAnimationFrame(()=>chapter.scrollIntoView({block:'start'}));
  else window.scrollTo({top:0,left:0});
}
for(const section of sections){
 const chapters=[...section.querySelectorAll('details.kapitel')];
 if(!chapters.length)continue;
 const link=links.find(a=>a.hash==='#'+section.id);
 if(!link)continue;
 const submenu=document.createElement('div');submenu.className='nav-sub';submenu.hidden=true;
 submenu.setAttribute('role','group');submenu.setAttribute('aria-label','Unterkapitel zu '+(link.textContent||section.id).trim());
 for(const chapter of chapters){
   const a=document.createElement('a');a.href='#'+chapter.id;
   a.textContent=chapter.querySelector('.kapitel-titel')?.textContent||chapter.id;
   submenu.append(a);
 }
 link.after(submenu);
 submenus.set(section.id,submenu);
 link.setAttribute('aria-expanded','false');
}
window.addEventListener('hashchange',show);
show();
const fields=[...document.querySelectorAll('[data-basis-answer]')];
let data={};
try{const x=JSON.parse(localStorage.getItem(key)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))data=x;}catch{}
for(const field of fields){
 const name=field.dataset.basisAnswer;
 if(typeof data[name]==='string')field.value=data[name];
 field.addEventListener('input',()=>{
   data[name]=field.value;
   try{localStorage.setItem(key,JSON.stringify(data));document.getElementById('basis-save-status').textContent='Notizen in diesem Browser gespeichert.';}
   catch{document.getElementById('basis-save-status').textContent='Speichern nicht möglich – bitte Notizen herunterladen.';}
 });
}
document.getElementById('basis-download').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify({schema:key,answers:data},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ki-basis-notizen.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
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
