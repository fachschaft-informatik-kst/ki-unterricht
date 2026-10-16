/* Teacher lesson editor: plain forms for AVIVA, materials and new complete lessons. */
const PHASES=["Ankommen","Vorwissen aktivieren","Informieren","Verarbeiten","Auswerten"];
const ROLES=["Lehrperson","Einzeln","Tandem","Gruppe","Klasse","Ergebnis"];
const TYPES=["Input","Auftrag","Ergebnis"];
const node=(name,cls,content)=>{const n=document.createElement(name);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;};
const field=(label,value,kind="input")=>{
  const wrapper=node("label","lesson-field");
  wrapper.append(node("span",null,label));
  const input=kind==="textarea"?node("textarea"):node("input");
  if(kind==="number"){input.type="number";input.min="0";input.max="90";}
  input.value=String(value??"");
  wrapper.append(input);
  return {wrapper,input};
};
function select(values,current){
  const s=node("select");
  for(const value of values){const item=node("option",null,value);item.value=value;s.append(item);}
  s.value=current||values[0];return s;
}
function phasePanel(p,idx){
  const section=node("section","aviva-phase");
  const title=node("h3",null,(idx+1)+". "+PHASES[idx]);section.append(title);
  const titleInput=field("Thema dieser Phase",p.titel);
  const minutes=field("Dauer in Minuten",p.minutes,"number");
  section.append(titleInput.wrapper,minutes.wrapper);
  const steps=node("div","aviva-steps");section.append(steps);
  const add=node("button","button light","Arbeitsschritt hinzufügen");add.type="button";
  section.append(add);
  function stepRow(step){
    const row=node("div","aviva-step");
    const kind=select(TYPES,step.art),who=select(ROLES,step.wer);
    const duration=field("Minuten (Ergebnis ohne Zeit)",step.min||0,"number");
    const what=field("Was geschieht?",step.text,"textarea");
    row.append(kind,who,duration.wrapper,what.wrapper);
    const remove=node("button","button subtle","Entfernen");remove.type="button";
    row.append(remove);
    remove.addEventListener("click",()=>row.remove());
    kind.addEventListener("change",()=>{if(kind.value==="Ergebnis"){who.value="Ergebnis";duration.input.value="0";}});
    row.getStep=()=>({art:kind.value,wer:who.value,
      ...(Number(duration.input.value)>0?{min:Number(duration.input.value)}:{}),
      text:what.input.value.trim()});
    steps.append(row);
  }
  for(const step of p.schritte)stepRow(step);
  add.addEventListener("click",()=>stepRow({art:"Auftrag",wer:"Tandem",min:5,text:"Neuer Arbeitsschritt."}));
  section.getPhase=()=>({phase:PHASES[idx],titel:titleInput.input.value.trim(),
    minutes:Number(minutes.input.value),schritte:[...steps.children].map(row=>row.getStep())});
  return section;
}
export function setupLessonEditor({state,api,stage,status,error,$}){
  const nodes={};
  const bindings=[
    ["title","Titel der Doppellektion"],
    ["goal","Lernziel: Heute können Sie …"],
    ["question","Leitfrage"],
    ["motivation","Warum ist das wichtig?"],
    ["product","Lernprodukt"],
    ["zeit","Hinweise zur Zeitplanung"]
  ];
  function show(plan,source,sha,teacherText,teacherSha){
    state.lesson={plan:structuredClone(plan),path:source,sha,teacherText,teacherSha};
    document.querySelector(".workspace > .editor").hidden=true;
    $("lessonWorkspace").hidden=false;
    $("lessonPath").textContent=source;
    $("lessonHeading").textContent="Doppellektion "+Number(plan.id)+" · "+plan.title;
    const root=$("lessonFields");root.replaceChildren();
    for(const [key,label] of bindings){
      const f=field(label,plan[key]||"",key==="title"?"input":"textarea");
      nodes[key]=f.input;root.append(f.wrapper);
    }
    const phases=$("phaseFields");phases.replaceChildren();
    plan.phases.forEach((p,i)=>phases.append(phasePanel(p,i)));
    $("teacherSource").value=teacherText;
  }
  async function read(path){
    const staged=state.staged.get(path);
    if(staged&&!staged.delete)return {path,sha:staged.expectedSha,content:staged.content};
    return api("/api/file?path="+encodeURIComponent(path));
  }
  async function edit(){
    const path=$("lessonPick").value;
    if(!path)return status("Bitte eine Doppellektion auswählen.",true);
    try{
      const item=await read(path);
      const lesson=JSON.parse(item.content);
      const materials=await read("lehrperson/lektionen/"+lesson.id+".md");
      show(lesson,path,item.sha,materials.content,materials.sha);
      status("Unterrichtsplan und Materialien geladen.");
    }catch(e){error(e);}
  }
  function template(id,title){
    const lengths=[5,10,15,50,10];
    const phases=PHASES.map((phase,i)=>({
      phase,titel:phase+" · "+title,minutes:lengths[i],
      schritte:[
        {art:"Auftrag",wer:"Tandem",min:lengths[i],text:"Arbeitsauftrag zu "+title+" formulieren."},
        {art:"Ergebnis",wer:"Ergebnis",text:"Ergebnis dieser Phase festhalten."}
      ]
    }));
    return {id,view:"lektion-"+id,title,
      goal:"Das Thema «"+title+"» fachlich begründet bearbeiten.",
      question:"Leitfrage: Welche Erkenntnisse gewinnen wir zu «"+title+"»?",
      motivation:"Warum ist dieses Thema relevant?",
      product:"Ein überprüfbares Ergebnis zum Thema «"+title+"».",
      phases};
  }
  function materialsFor(id,title){
    return "## Doppellektion "+id+"\n\n### Zusätzliche Materialien\n\n"+
      "Didaktische Hinweise und zusätzliche Grafiken zu **"+title+"** ergänzen.\n\n"+
      "- [Kurskapitel](index.html#lektion-"+id+")\n"+
      "- [AVIVA-Unterrichtsplan](unterrichtsplan.html#doppellektion-"+id+")\n";
  }
  function chapterFor(id,title){
    return "---\ntype: chapter\nid: lektion-"+id+"-einstieg\nnummer: \"1\"\n"+
      "titel: "+JSON.stringify(title)+"\nkurz: Einstieg und Lernaufgaben\nopen: true\n---\n\n"+
      "Hier den Unterrichtsinhalt ergänzen.\n\n## Auftrag\n\nAufgabe formulieren.\n";
  }
  function nextId(){
    const numbers=[...state.plans,...[...state.staged.keys()].filter(path=>
      /^unterricht\/lektionen\/\d{2}\.json$/.test(path)).map(path=>({path}))]
      .map(item=>Number(item.path.match(/(\d{2})\.json$/)?.[1]||0));
    const maximum=Math.max(0,...numbers);
    if(maximum>=99)throw Error("Maximal 99 Doppellektionen.");
    return String(maximum+1).padStart(2,"0");
  }
  function add(){
    try{
      const title=prompt("Titel der neuen Doppellektion:");
      if(!title||!title.trim())return;
      const id=nextId();
      const lesson=template(id,title.trim());
      const lessonPath="unterricht/lektionen/"+id+".json";
      const contentPath="kursseiten/lektionen/"+id+"/010-einstieg.md";
      const teacherPath="lehrperson/lektionen/"+id+".md";
      const content=chapterFor(id,title.trim()),material=materialsFor(id,title.trim());
      state.staged.set(lessonPath,{path:lessonPath,expectedSha:null,content:JSON.stringify(lesson,null,2)+"\n"});
      state.staged.set(contentPath,{path:contentPath,expectedSha:null,content});
      state.staged.set(teacherPath,{path:teacherPath,expectedSha:null,content:material});
      state.chapters.push({path:contentPath,sha:null});
      state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
      const section=$("section"),view="lektion-"+id;
      if(![...section.options].some(o=>o.value===view)){
        const option=node("option",null,"Doppellektion "+Number(id));
        option.value=view;section.append(option);
      }
      section.value=view;
      state.plans.push({path:lessonPath,sha:null});
      renderOptions();
      $("lessonPick").value=lessonPath;
      show(lesson,lessonPath,null,material,null);
      stage();
      status("Doppellektion "+Number(id)+" vorgemerkt. AVIVA-Phasen, Material und Kapitel jetzt bearbeiten.");
    }catch(e){error(e);}
  }
  function collect(){
    if(!state.lesson)throw Error("Keine Doppellektion ausgewählt.");
    const lesson=structuredClone(state.lesson.plan);
    for(const [key] of bindings)lesson[key]=nodes[key].value.trim();
    lesson.phases=[...$("phaseFields").children].map(el=>el.getPhase());
    if(!lesson.title||!lesson.goal||!lesson.question||!lesson.product)throw Error("Titel, Ziel, Leitfrage und Lernprodukt sind Pflicht.");
    if(lesson.phases.length!==5||lesson.phases.some((p,i)=>p.phase!==PHASES[i]||
      !Number.isInteger(p.minutes)||p.minutes<1||!p.titel||
      !p.schritte.length||p.schritte.at(-1).art!=="Ergebnis"||
      p.schritte.reduce((sum,s)=>sum+(s.min||0),0)!==p.minutes))
      throw Error("Jede AVIVA-Phase braucht eine gültige Dauer und einen Ergebnis-Schritt. Die Schritte müssen zeitlich aufgehen.");
    if(lesson.phases.reduce((sum,p)=>sum+p.minutes,0)!==90)throw Error("Die fünf Phasen müssen zusammen genau 90 Minuten dauern.");
    for(const phase of lesson.phases)if(phase.schritte.some(s=>!s.text||!s.art||!s.wer))throw Error("Jeder Schritt braucht eine Beschreibung.");
    return lesson;
  }
  function stage(){
    const lesson=collect();
    const current=state.lesson;
    const planPath=current.path;
    const teacherPath="lehrperson/lektionen/"+lesson.id+".md";
    const material=$("teacherSource").value;
    if(!/^## Doppellektion \d{2}/.test(material))throw Error("Lehrpersonenmaterial muss mit ## Doppellektion "+lesson.id+" beginnen.");
    state.staged.set(planPath,{path:planPath,expectedSha:current.sha,
      content:JSON.stringify(lesson,null,2)+"\n"});
    state.staged.set(teacherPath,{path:teacherPath,expectedSha:current.teacherSha,
      content:material});
    status("AVIVA-Unterrichtsplan und Lehrpersonenmaterial vorgemerkt.");
    $("lessonHeading").textContent="Doppellektion "+Number(lesson.id)+" · "+lesson.title;
    const list=$("staged");list.replaceChildren();
    for(const c of state.staged.values()){
      const item=document.createElement("li");item.textContent=(c.delete?"Entfernen: ":"Ändern: ")+c.path;
      list.append(item);
    }
  }
  function renderOptions(){
    const select=$("lessonPick"),prior=select.value;
    select.replaceChildren();
    state.plans.sort((a,b)=>a.path.localeCompare(b.path));
    for(const item of state.plans){
      const opt=node("option",null,"Doppellektion "+Number(item.path.match(/(\d{2})\.json$/)?.[1]));
      opt.value=item.path;select.append(opt);
    }
    select.value=state.plans.some(x=>x.path===prior)?prior:state.plans[0]?.path||"";
  }
  async function refresh(){
    const result=await api("/api/lessons");
    const drafts=[...state.staged.values()].filter(x=>
      /^unterricht\/lektionen\/\d{2}\.json$/.test(x.path)&&x.expectedSha===null)
      .map(x=>({path:x.path,sha:null}));
    state.plans=[...result.plans,...drafts.filter(x=>!result.plans.some(p=>p.path===x.path))];
    renderOptions();
  }
  $("editLesson").addEventListener("click",edit);
  $("newLesson").addEventListener("click",add);
  $("stageLesson").addEventListener("click",()=>{try{stage();}catch(e){error(e);}});
  $("backToChapters").addEventListener("click",()=>{
    $("lessonWorkspace").hidden=true;
    document.querySelector(".workspace > .editor").hidden=false;
  });
  return {refresh,edit,stage,add};
}
