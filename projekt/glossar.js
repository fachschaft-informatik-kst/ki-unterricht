/* Shared progressive enhancement: static glossary stays readable without JS. */
'use strict';
(()=>{
  const root=document.querySelector('[data-glossary]');
  if(!root)return;
  const search=root.querySelector('[data-glossary-search]');
  const count=root.querySelector('[data-glossary-count]');
  const empty=root.querySelector('[data-glossary-empty]');
  const groups=[...root.querySelectorAll('.glossary-group')];
  const entries=[...root.querySelectorAll('.glossary-entry')];
  const normalize=value=>value.toLocaleLowerCase('de-CH').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
  const filter=()=>{
    const query=normalize(search.value.trim());
    let visible=0;
    for(const entry of entries){
      const match=normalize(entry.textContent).includes(query);
      entry.hidden=!match;
      if(match)visible++;
    }
    for(const group of groups)group.hidden=![...group.querySelectorAll('.glossary-entry')].some(entry=>!entry.hidden);
    count.textContent=query?visible+' von '+entries.length+' Begriffen gefunden':entries.length+' Begriffe · nach Themen geordnet';
    empty.hidden=visible!==0;
  };
  search.addEventListener('input',filter);
  filter();
  if(typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');
  dialog.className='glossary-dialog';
  dialog.setAttribute('aria-label','Begriffserklärung');
  const close=document.createElement('button');
  close.type='button';close.className='glossary-close';close.textContent='×';close.setAttribute('aria-label','Begriffserklärung schliessen');
  close.addEventListener('click',()=>dialog.close());
  dialog.append(close);
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  document.body.append(dialog);
  document.querySelectorAll('a[href^="#glossar-"], a[href^="#basis-glossar-"]').forEach(link=>{
    const href=link.getAttribute('href');
    const entry=document.getElementById(href.slice(1));
    if(!entry?.matches('.glossary-entry'))return;
    link.setAttribute('title','Begriffserklärung öffnen: '+entry.querySelector('h3').textContent);
    link.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
      if(typeof dialog.showModal!=='function')return;
      event.preventDefault();
      dialog.querySelector('.glossary-entry')?.remove();
      const copy=entry.cloneNode(true);
      copy.removeAttribute('id');copy.hidden=false;
      dialog.append(copy);
      dialog.showModal();
    });
  });
})();


/* Shared DL1 history popups for both courses, with static templates in the
   editable chapter sources. Native dialog supplies Escape and focus trapping. */
(()=>{
  const triggers=[...document.querySelectorAll('.timeline [data-milestone-open]')];
  if(!triggers.length || typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');
  dialog.className='milestone-dialog';
  dialog.setAttribute('aria-label','KI-Meilenstein: Bild und Erklärung');
  const close=document.createElement('button');
  close.type='button';
  close.className='milestone-close';
  close.textContent='×';
  close.setAttribute('aria-label','Meilenstein schliessen');
  close.addEventListener('click',()=>dialog.close());
  dialog.append(close);
  let lastTrigger=null;
  // Focusing a trigger in a hidden/offscreen lesson can otherwise scroll the
  // underlying course page back to the top (especially in the basis course).
  dialog.addEventListener('close',()=>lastTrigger?.focus({preventScroll:true}));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  document.body.append(dialog);
  for(const trigger of triggers){
    const template=trigger.closest('li')?.querySelector('template[data-milestone-detail]');
    if(!template || template.dataset.milestoneDetail!==trigger.dataset.milestoneOpen)continue;
    trigger.addEventListener('click',()=>{
      if(typeof dialog.showModal!=='function')return;
      dialog.querySelector('.milestone-detail')?.remove();
      dialog.append(template.content.cloneNode(true));
      lastTrigger=trigger;
      // Keep the document at exactly the same reading position while the
      // fixed top-layer dialog opens. Modal focus must not scroll the page.
      const x=window.scrollX, y=window.scrollY;
      dialog.showModal();
      close.focus({preventScroll:true});
      if(window.scrollX!==x || window.scrollY!==y)window.scrollTo({left:x,top:y,behavior:'instant'});
    });
  }
})();
