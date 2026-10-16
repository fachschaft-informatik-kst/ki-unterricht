/* Structured AVIVA editor. Preserve existing IDs, metadata and all unedited keys. */
const PHASES=["Ankommen","Vorwissen aktivieren","Informieren","Verarbeiten","Auswerten"];
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
export function createPlanner(panel,onChange){
  const picker=panel.querySelector("#planLesson"),fields=panel.querySelector("#planFields"),
    phases=panel.querySelector("#planPhases"),total=panel.querySelector("#planTotal");
  let draft=null,selected=0;
  function totalMinutes(){
    const sum=draft.lessons[selected].phases.reduce((n,p)=>n+Number(p.minutes||0),0);
    total.textContent="Geplant: "+sum+" von 90 Minuten";
    total.classList.toggle("invalid",sum!==90);
  }
  function commit(){onChange(JSON.stringify(draft,null,2)+"\n");totalMinutes();}
  function input(parent,title,value,options,change){
    const label=el("label",title,"plan-field"),item=el(options.multiline?"textarea":"input");
    if(!options.multiline)item.type=options.number?"number":"text";
    if(options.number){item.min=String(options.min??0);item.step="1";}
    if(options.multiline)item.rows=options.rows||2;
    item.value=value??"";
    item.addEventListener("input",()=>{change(options.number?(item.value===""?0:Number(item.value)):item.value);commit();});
    label.append(item);parent.append(label);return item;
  }
  function render(){
    const lesson=draft.lessons[selected];picker.replaceChildren();
    draft.lessons.forEach((l,i)=>{const o=el("option",Number(l.id)+" · "+l.title);o.value=String(i);picker.append(o);});
    picker.value=String(selected);fields.replaceChildren();phases.replaceChildren();
    const overview=el("div",undefined,"plan-overview");
    for(const [key,title,multiline] of [
      ["title","Titel",false],["goal","Lernziele",true],["question","Leitfrage",true],
      ["motivation","Motivation",true],["product","Erwartetes Lernergebnis",true],
      ["zeit","Zeitliche Hinweise (optional)",true]
    ])input(overview,title,lesson[key]||"",{multiline},v=>{lesson[key]=v;});
    fields.append(overview);
    lesson.phases.forEach((p,pi)=>{
      const card=el("fieldset",undefined,"plan-phase");
      card.append(el("legend",(pi+1)+" · "+PHASES[pi]));
      const meta=el("div",undefined,"plan-phase-meta");
      input(meta,"Untertitel",p.titel,{},v=>{p.titel=v;});
      input(meta,"Minuten",p.minutes,{number:true,min:1},v=>{p.minutes=v;});
      card.append(meta);
      const rows=el("div",undefined,"plan-steps");
      p.schritte.forEach((s,si)=>{
        const row=el("div",undefined,"plan-step");
        row.append(el("strong","Arbeitsschritt "+(si+1)));
        const grid=el("div",undefined,"plan-step-grid");
        input(grid,"Sozialform / Wer",s.wer,{},v=>{s.wer=v;});
        input(grid,"Art",s.art||"",{},v=>{s.art=v;});
        input(grid,"Minuten (optional)",s.min??"",{number:true},v=>{s.min=v;});
        row.append(grid);
        input(row,"Auftrag und erwartetes Ergebnis",s.text,{multiline:true,rows:3},v=>{s.text=v;});
        const remove=el("button","Schritt entfernen","button light danger");
        remove.type="button";remove.disabled=p.schritte.length<=1;
        remove.addEventListener("click",()=>{if(p.schritte.length<=1)return;p.schritte.splice(si,1);commit();render();});
        row.append(remove);rows.append(row);
      });
      card.append(rows);
      const add=el("button","+ Arbeitsschritt","button light");add.type="button";
      add.addEventListener("click",()=>{
        p.schritte.push({art:"Auftrag",wer:"Tandem",min:0,text:"Neuen Arbeitsschritt formulieren."});
        commit();render();
      });
      card.append(add);phases.append(card);
    });
    totalMinutes();
  }
  picker.addEventListener("change",()=>{selected=Number(picker.value);render();});
  return {
    open(source,view){
      draft=JSON.parse(source);
      if(!Array.isArray(draft.lessons))throw Error("Unterrichtsplan ohne Doppellektionen.");
      selected=Math.max(0,draft.lessons.findIndex(l=>l.view===view));
      panel.hidden=false;render();
    },
    close(){panel.hidden=true;draft=null;},
    validate(source){
      const plan=JSON.parse(source);
      if(!Array.isArray(plan.lessons)||plan.lessons.length<10)throw Error("Mindestens zehn Doppellektionen erwartet.");
      plan.lessons.forEach((l,i)=>{
        if(l.id!==String(i+1).padStart(2,"0")||!l.title?.trim()||!l.goal?.trim()||!l.question?.trim()||!l.product?.trim())
          throw Error("Doppellektion "+(i+1)+": Titel, Lernziele, Leitfrage oder Ergebnis fehlt.");
        if(!Array.isArray(l.phases)||l.phases.length!==5||
          l.phases.some((p,j)=>p.phase!==PHASES[j]||!Number.isInteger(p.minutes)||p.minutes<1||
            !p.titel?.trim()||!Array.isArray(p.schritte)||!p.schritte.length||
            p.schritte.some(s=>!s.wer?.trim()||!s.text?.trim()||
              (s.min!==undefined&&(!Number.isInteger(s.min)||s.min<0)))))
          throw Error("Doppellektion "+(i+1)+": AVIVA-Phasen oder Arbeitsschritte unvollständig.");
        if(l.phases.reduce((sum,p)=>sum+p.minutes,0)!==90)
          throw Error("Doppellektion "+(i+1)+": Die AVIVA-Phasen müssen 90 Minuten ergeben.");
      });
      return true;
    }
  };
}
