/* Structured AVIVA editor. Preserve existing IDs, metadata and all unedited keys. */
import {rules,validatePlan} from "./course-model.js";
const PHASES=rules.phases;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
export function createPlanner(panel,onChange,onSelect=()=>{}){
  const picker=panel.querySelector("#planLesson"),fields=panel.querySelector("#planFields"),
    phases=panel.querySelector("#planPhases"),total=panel.querySelector("#planTotal");
  let draft=null,selected=0;
  function totalMinutes(){
    const sum=draft.lessons[selected].phases.reduce((n,p)=>n+Number(p.minutes||0),0);
    total.textContent="Geplant: "+sum+" von "+rules.duration+" Minuten";
    total.classList.toggle("invalid",sum!==rules.duration);
    phases.querySelectorAll(".plan-step-total").forEach((hint,i)=>{
      const p=draft.lessons[selected].phases[i];
      const used=p.schritte.reduce((n,s)=>n+Number(s.min||0),0);
      hint.textContent="Arbeitsschritte: "+used+" von "+p.minutes+" Minuten";
      hint.classList.toggle("invalid",used!==p.minutes);
    });
  }
  function commit(){onChange(JSON.stringify(draft,null,2)+"\n");totalMinutes();}
  function input(parent,title,value,options,change){
    const label=el("label",title,"plan-field"),item=el(options.multiline?"textarea":"input");
    if(!options.multiline)item.type=options.number?"number":"text";
    if(options.number){item.min=String(options.min??0);item.step=options.step||"1";}
    if(options.multiline)item.rows=options.rows||2;
    item.value=value??"";
    item.addEventListener("input",()=>{change(options.number?(item.value===""?0:Number(item.value)):item.value);commit();});
    label.append(item);parent.append(label);return item;
  }
  function render(){
    const lesson=draft.lessons[selected];picker.replaceChildren();
    draft.lessons.forEach((l,i)=>{const o=el("option",l.title);o.value=String(i);picker.append(o);});
    picker.value=String(selected);fields.replaceChildren();phases.replaceChildren();
    const overview=el("div",undefined,"plan-overview");
    for(const [key,title,multiline] of [
      ["title","Titel",false],["goal","Lernziele",true],["question","Leitfrage",true],
      ["motivation","Motivation",true],["product","Erwartetes Lernergebnis",true],
      ["zeit","Zeitliche Hinweise (optional)",true]
    ])input(overview,title,lesson[key]||"",{multiline},v=>{lesson[key]=v;});
    fields.append(overview);
    input(overview,"Reihenfolge (stabile ID bleibt unverändert)",lesson.order,{number:true,step:"any"},v=>{lesson.order=v;});
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
        remove.type="button";remove.disabled=p.schritte.length<=1||si===p.schritte.length-1;
        remove.addEventListener("click",()=>{if(p.schritte.length<=1||si===p.schritte.length-1)return;p.schritte.splice(si,1);commit();render();});
        row.append(remove);rows.append(row);
      });
      card.append(rows);
      card.append(el("p","", "plan-step-total"));
      const add=el("button","+ Arbeitsschritt","button light");add.type="button";
      add.addEventListener("click",()=>{
        p.schritte.splice(p.schritte.length-1,0,{art:"Auftrag",wer:"Tandem",min:0,text:"Neuen Arbeitsschritt formulieren."});
        commit();render();
      });
      card.append(add);phases.append(card);
    });
    totalMinutes();
  }
  picker.addEventListener("change",()=>{selected=Number(picker.value);render();onSelect();});
  return {
    open(source,view){
      draft=JSON.parse(source);
      if(!Array.isArray(draft.lessons))throw Error("Unterrichtsplan ohne Doppellektionen.");
      selected=Math.max(0,draft.lessons.findIndex(l=>l.view===view));
      panel.hidden=false;render();
    },
    close(){panel.hidden=true;draft=null;},
    validate(source){return validatePlan(JSON.parse(source));}
  };
}
