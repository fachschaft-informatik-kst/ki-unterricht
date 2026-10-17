import rules from "./course-rules.json" with {type:"json"};
export {rules};
const text=value=>typeof value==="string"&&value.trim().length>0;

export function validateManifest(manifest){
  const sections=manifest?.sections;
  if(!Array.isArray(sections)||!sections.length)throw Error("Unterrichtsbereiche fehlen.");
  const ids=new Set();
  for(const s of sections){
    if(!s||typeof s.id!=="string"||!/^[a-z][a-z0-9-]*$/.test(s.id)||ids.has(s.id)||!text(s.class))
      throw Error("Ungültige oder doppelte Unterrichtsbereiche.");
    ids.add(s.id);
    const nav=s.navigation;
    if((s.teaching&&!nav)||(nav!==undefined&&(!nav||typeof nav.title!=="string"||
      typeof nav.label!=="string"||!Number.isInteger(nav.order))))
      throw Error("Navigation ungültig: "+s.id);
  }
  return true;
}

export function lessonTemplate(id,title,view){
  return {id,title,view,...rules.defaults,phases:rules.phases.map((phase,i)=>({
    phase,titel:phase,minutes:rules.defaultMinutes[i],schritte:[
      {wer:"Lehrperson",min:rules.defaultMinutes[i]-1,text:"Arbeitsauftrag und Ablauf festlegen.",art:"Auftrag"},
      {wer:"Ergebnis",min:1,text:"Ergebnis festhalten.",art:"Ergebnis"}
    ]
  }))};
}

export function validatePlan(plan){
  if(!Array.isArray(plan?.lessons)||!plan.lessons.length)throw Error("Doppellektionen fehlen.");
  const ids=new Set();
  for(const l of plan.lessons){
    if(!l||typeof l.id!=="string"||!/^[a-z0-9][a-z0-9-]*$/.test(l.id)||ids.has(l.id)||
      typeof l.view!=="string"||!/^[a-z][a-z0-9-]*$/.test(l.view)||rules.required.some(k=>!text(l[k])))
      throw Error("Ungültige oder doppelte Lektions-ID, Ansicht oder Pflichtfelder.");
    ids.add(l.id);
    if(!Array.isArray(l.phases)||l.phases.length!==rules.phases.length||
      l.phases.some((p,i)=>!p||p.phase!==rules.phases[i]||!Number.isInteger(p.minutes)||p.minutes<1||
        !text(p.titel)||!Array.isArray(p.schritte)||!p.schritte.length||
        p.schritte.at(-1)?.art!=="Ergebnis"||
        p.schritte.some(s=>!s||!text(s.wer)||!text(s.text)||
          (s.min!==undefined&&(!Number.isInteger(s.min)||s.min<0)))||
        p.schritte.reduce((n,s)=>n+(s.min||0),0)!==p.minutes)||
      l.phases.reduce((n,p)=>n+p.minutes,0)!==rules.duration)
      throw Error("AVIVA-Phasen oder Minuten ungültig: "+l.id);
  }
  return true;
}
