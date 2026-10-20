'use strict';
(()=>{
const sections=[...document.querySelectorAll('main > section')];
const links=[...document.querySelectorAll('.nav > a')];
const key='kst-ki-basis-v1';
document.documentElement.classList.add('has-js');
function show(){
  const id=decodeURIComponent((location.hash||'#basis-start').slice(1));
  const chapter=document.getElementById(id);
  const parent=sections.find(s=>s.id===id||s.contains(chapter));
  const active=parent||sections[0];
  for(const s of sections)s.classList.toggle('basis-view-hidden',s!==active);
  for(const a of [...document.querySelectorAll('.nav a')])a.removeAttribute('aria-current');
  const current=links.find(a=>a.hash==='#'+active.id);
  if(current)current.setAttribute('aria-current','page');
  if(chapter?.matches('details.kapitel'))chapter.open=true;
  if(id!==active.id&&chapter)requestAnimationFrame(()=>chapter.scrollIntoView({block:'start'}));
  else window.scrollTo({top:0,left:0});
}
for(const section of sections){
 const chapters=[...section.querySelectorAll('details.kapitel')];
 if(!chapters.length)continue;
 const link=links.find(a=>a.hash==='#'+section.id);
 if(!link)continue;
 const submenu=document.createElement('div');submenu.className='nav-sub';
 for(const chapter of chapters){
   const a=document.createElement('a');a.href='#'+chapter.id;
   a.textContent=chapter.querySelector('.kapitel-titel')?.textContent||chapter.id;
   submenu.append(a);
 }
 link.after(submenu);
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
})();
