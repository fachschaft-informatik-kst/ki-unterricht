/* DL1 drag/drop sorter. The native select stays usable with mouse, touch and keyboard. */
'use strict';
(()=>{
 for(const task of document.querySelectorAll('[data-ki-sort-task]')){
  const cards=[...task.querySelectorAll('[data-ki-sort-card]')],pool=task.querySelector('[data-ki-sort-pool]'),
    bins=[...task.querySelectorAll('[data-ki-sort-bin]')],status=task.querySelector('[data-ki-sort-status]'),
    check=task.querySelector('[data-ki-sort-check]'),
    targets=new Map(bins.map(b=>[b.dataset.kiSortBin,b.querySelector('[data-ki-sort-target]')]));
  let dragged=null;
  const selected=card=>card.querySelector('select');
  const forget=()=>{
   for(const card of cards){card.removeAttribute('data-ki-sort-result');card.querySelector('.ki-sort-card-result').textContent='';}
   status.textContent='Noch nicht geprüft.';
  };
  const render=()=>{
   for(const card of cards){const value=selected(card).value,destination=targets.get(value)||pool;if(card.parentElement!==destination)destination.append(card);card.dataset.kiSortAssigned=value?'true':'false';}
   check.disabled=cards.some(c=>!selected(c).value);
  };
  const assign=(card,value)=>{
   const input=selected(card);
   if(input.value===value)return;
   input.value=value;
   input.dispatchEvent(new Event('input',{bubbles:true}));
   forget();render();
  };
  for(const card of cards){
   const input=selected(card),result=document.createElement('span');
   result.className='ki-sort-card-result';result.setAttribute('aria-live','polite');card.append(result);
   input.addEventListener('input',()=>{forget();render();});
   input.addEventListener('change',()=>{forget();render();});
   card.addEventListener('dragstart',e=>{
    if(e.target!==card)return;
    dragged=card;card.classList.add('ki-sort-dragging');
    e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',card.dataset.kiSortCard);
   });
   card.addEventListener('dragend',()=>{
    card.classList.remove('ki-sort-dragging');dragged=null;
    task.querySelectorAll('.ki-sort-drop-active').forEach(el=>el.classList.remove('ki-sort-drop-active'));
   });
  }
  for(const [area,value] of [[pool,''],...bins.map(b=>[b,b.dataset.kiSortBin])]){
   area.addEventListener('dragover',e=>{if(!dragged)return;e.preventDefault();e.dataTransfer.dropEffect='move';area.classList.add('ki-sort-drop-active');});
   area.addEventListener('dragleave',e=>{if(!area.contains(e.relatedTarget))area.classList.remove('ki-sort-drop-active');});
   area.addEventListener('drop',e=>{if(!dragged)return;e.preventDefault();area.classList.remove('ki-sort-drop-active');assign(dragged,value);});
  }
  check.addEventListener('click',()=>{
   if(cards.some(c=>!selected(c).value)){status.textContent='Bitte zuerst alle Beispiele zuordnen.';return;}
   let correct=0;
   for(const card of cards){
    const good=selected(card).value===card.dataset.kiSortCorrect;
    if(good)correct++;
    card.dataset.kiSortResult=good?'correct':'incorrect';
    card.querySelector('.ki-sort-card-result').textContent=good?'Richtig zugeordnet':'Noch nicht richtig – überlege nochmals';
   }
   status.textContent=correct===cards.length?'Alle '+cards.length+' Beispiele richtig! Begründe die Unterschiede.':correct+' von '+cards.length+' richtig. Prüfe die markierten Karten und versuche es erneut.';
  });
  task.querySelector('[data-ki-sort-reset]').addEventListener('click',()=>{
   for(const card of cards)assign(card,'');
   forget();render();status.textContent='Alle Zuordnungen zurückgesetzt.';
  });
  task.classList.add('ki-sort-ready');render();
  document.addEventListener('ki-answers-rendered',()=>{forget();render();});
 }
})();
