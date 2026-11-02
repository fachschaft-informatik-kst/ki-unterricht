// Serve only explicitly selected teacher resources through the authenticated Worker.
const PROFILES={"bok/1-klasse":{manifest:"kursseiten/basis-manifest.json",grade:1},"bok/4-klasse":{manifest:"kursseiten/manifest.json",grade:4}};
export const DOWNLOADS={
  "Arbeitsblatt_Perzeptron_Lsg.md":"worksheets/md/Arbeitsblatt_Perzeptron_Lsg.md",
  "KI_Bewertungsraster.md":"worksheets/md/KI_Bewertungsraster.md",
  "koordinatengitter_perzeptron_and_loesung.svg":"worksheets/md/svg/koordinatengitter_perzeptron_and_loesung.svg",
  "koordinatengitter_or_nand_xor.svg":"worksheets/md/svg/koordinatengitter_or_nand_xor.svg"
};
export function parseTeacher(path){
  const m=/^\/teacher\/(bok\/(?:1|4)-klasse)\/(planung|materialien|musterloesungen)\/?$/.exec(path);
  return m&&PROFILES[m[1]]?{course:m[1],kind:m[2]}:null;
}
export async function readTeacherFile(token,path,github,repo){
  const file=await github(token,"/repos/"+repo+"/contents/"+path+"?ref=main");
  if(file.encoding!=="base64"||typeof file.content!=="string")throw Error("Quelle nicht lesbar.");
  return Uint8Array.from(atob(file.content.replace(/\s/g,"")),c=>c.charCodeAt(0));
}
const getText=async(t,p,g,r)=>new TextDecoder().decode(await readTeacherFile(t,p,g,r));
const getJson=async(t,p,g,r)=>JSON.parse(await getText(t,p,g,r));

const sortLessons=(a,b)=>Number(a.number)-Number(b.number);
const headings=source=>{
  const matches=[...source.matchAll(/^## (.+)$/gm)];
  return matches.map((m,i)=>({title:m[1],text:source.slice(m.index+m[0].length,matches[i+1]?.index??source.length).trim()}));
};
const numbers=title=>{
  const m=/^(?:DL\s+|Doppellektion\s+)?(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?\b/.exec(title);
  if(!m)return [];
  const a=Number(m[1]),b=Number(m[2]||m[1]);
  return b>=a&&b<=20?Array.from({length:b-a+1},(_,i)=>a+i):[];
};
const JOURNAL={
  projekt_datencheck:5,names:5,class:5,purpose:5,hypothesis:5,groups:5,
  sources:5,data_limits:5,comparison:6,selection:6,test:7,
  examples:7,limits:7,conclusion:7,contribution:7,reproduktion:8
};
const PROMPTS={
  projekt_datencheck:"Wie teilt ihr Trainings-, Validierungs- und Testdaten ohne Datenleck auf?",
  names:"Wie heissen die Tandemmitglieder?",class:"Welche zwei Bildklassen werden untersucht?",
  purpose:"Wozu ist euer Bilderkennungsmodell gedacht?",
  hypothesis:"Was ist eure Vermutung, und wie plant ihr die Projektarbeit?",
  groups:"Wie teilt ihr eure Bilder in fünf unabhängige Gruppen auf?",
  sources:"Woher stammen eure Bilder, und wie habt ihr sie aufgenommen?",
  data_limits:"Welche Grenzen und möglichen Datenfehler erkennt ihr?",
  comparison:"Wie schneiden Modell A und B auf denselben Validierungsbildern ab?",
  selection:"Welches Modell wählt ihr vor dem Test und warum?",
  test:"Was zeigt der unabhängige Test nach der Modellwahl?",
  examples:"Welche richtigen und falschen Testvorhersagen könnt ihr belegen?",
  limits:"Welche Grenzen hat euer Bildmodell?",
  conclusion:"Was ist das Fazit eures Versuchs?",
  contribution:"Welchen Beitrag haben die Tandemmitglieder geleistet?",
  reproduktion:"Lässt sich das fremde Modell anhand seiner Originaldaten nachvollziehen?"
};
const dlFor=(key,fallback)=>{
  if(Object.prototype.hasOwnProperty.call(JOURNAL,key))return JOURNAL[key];
  if(key.startsWith("fremd_")||key.startsWith("fremd-"))return 8;
  const m=/^basis-(daten|plan|training|abschluss)(?:-|_)/.exec(key);
  return m?{daten:5,plan:6,training:7,abschluss:8}[m[1]]:fallback;
};
export function answerRows(markdown,number){
  return headings(markdown).flatMap(part=>{
    const ns=numbers(part.title);if(!ns.includes(number))return [];
    return part.text.split("\n").map(line=>{
      const m=/^\|\s*\x60([^\x60]+)\x60\s*\|\s*(.*?)\s*\|\s*$/.exec(line);
      return m?{field:m[1],answer:m[2]}:null;
    }).filter(entry=>entry&&dlFor(entry.field,ns[0])===number);
  });
}
export function materialForLesson(markdown,number){
  const blocks=headings(markdown).filter(x=>/^Doppellektion\s+\d+/i.test(x.title));
  return blocks.length?blocks.filter(x=>numbers(x.title).includes(number))
    .map(x=>"### "+x.title+"\n\n"+x.text).join("\n\n"):markdown;
}
const clean=source=>source.replace(/<[^>]*>/g," ").replace(/&amp;/g,"&")
  .replace(/&quot;/g,'"').replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
export function questionsFromSource(source){
  const out={};
  for(const m of source.matchAll(/\bdata-answer=["']([^"']+)["']/g)){
    const after=source.slice(m.index,m.index+400);
    const before=source.slice(Math.max(0,m.index-1200),m.index);
    const aria=/\baria-label=["']([^"']+)["']/.exec(after.slice(0,260));
    const labelIndex=before.lastIndexOf("<label"),endIndex=before.lastIndexOf("</label");
    let question=aria?clean(aria[1]):"";
    if(!question&&labelIndex>endIndex){
      const spans=[...before.slice(labelIndex).matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)];
      if(spans.length)question=clean(spans.at(-1)[1]);
    }
    if(!question){
      const p=[...before.matchAll(/<(?:p|h[234])\b[^>]*>([\s\S]*?)<\/(?:p|h[234])>/g)].at(-1);
      if(p)question=clean(p[1]);
    }
    if(question.length>=5)out[m[1]]=question.slice(0,600);
  }
  return out;
}
async function getQuestions(lesson,course,token,github,repo){
  const views=new Set([lesson.view]);
  if(lesson.number>=5&&lesson.number<=8){
    (course==="bok/4-klasse"?["projekt","journal","fremdmodell","sicherung"]:
      ["basis-daten","basis-plan","basis-training","basis-abschluss"]).forEach(x=>views.add(x));
  }
  const tree=await github(token,"/repos/"+repo+"/git/trees/main?recursive=1");
  if(tree.truncated)throw Error("Unvollständiger Quellindex");
  const files=(tree.tree||[]).filter(item=>item.type==="blob"&&
    /^kursseiten\/[a-z0-9-]+\/\d{3}-[a-z0-9-]+\.md$/.test(item.path)&&
    views.has(item.path.split("/")[1])).map(item=>item.path);
  const data=await Promise.all(files.map(path=>getText(token,path,github,repo)));
  return Object.assign({},...data.map(questionsFromSource));
}
export async function teacherData({course,kind},token,github,repo,selected=1){
  const profile=PROFILES[course];if(!profile)throw Error("Kurs unbekannt.");
  const manifest=await getJson(token,profile.manifest,github,repo);
  const views=(manifest.sections||[]).filter(s=>s.teaching&&/^[a-z][a-z0-9-]*$/.test(s.id));
  if(views.length>20)throw Error("Zu viele Unterrichtsbereiche.");
  const plans=await Promise.all(views.map(s=>getJson(token,"kursseiten/"+s.id+"/planung.json",github,repo)));
  const lessons=plans.flatMap(p=>p.lessons||[]).sort(sortLessons);
  const current=lessons.find(l=>l.number===Number(selected))||lessons[0];
  if(!current)throw Error("Kein Unterrichtsplan vorhanden.");
  const base={kind,course,lessons:lessons.map(l=>({id:l.id,number:l.number,title:l.title,view:l.view})),
    selectedNumber:current.number,selectedTitle:current.title};
  if(kind==="planung")return {...base,lesson:current};
  if(kind==="materialien"){
    const content=await getText(token,"kursseiten/"+current.view+"/materialien.md",github,repo);
    const markdown=materialForLesson(content,current.number);
    const intro=profile.grade===4?await getText(token,"lehrperson/materialien.md",github,repo):"";
    return {...base,intro,sections:[{title:"Doppellektion "+current.number+" · "+current.title,
      markdown:markdown||content}]};
  }
  const [general,fields]=await Promise.all([
    getText(token,"lehrperson/musterloesungen.md",github,repo),
    getText(token,"lehrperson/musterloesungen-felder-"+profile.grade+"-klasse.md",github,repo)]);
  const notes=headings(general).filter(block=>numbers(block.title).includes(current.number))
    .map(block=>({title:block.title,markdown:block.text}));
  const entries=answerRows(fields,current.number);
  let questions={};try{questions=await getQuestions(current,course,token,github,repo);}catch{ /* use explicit fallback */ }
  for(const entry of entries){
    entry.question=questions[entry.field]||PROMPTS[entry.field]||
      "Originalfrage im Kurs nachschlagen: "+entry.field.replace(/[-_]/g," ");
    entry.questionFound=Boolean(questions[entry.field]||PROMPTS[entry.field]);
    entry.courseLink="https://fachschaft-informatik-kst.github.io/ki-unterricht/"+
      course+"/#"+current.view;
  }
  return {...base,notes,entries,
    sections:[{title:"Allgemeine Musterlösungen",markdown:general},
      {title:"Feldgenaue Lösungen",markdown:fields}]};
}

export function teacherShell(route){
  const titles={planung:"AVIVA-Unterrichtsplanung",materialien:"Materialkoffer",musterloesungen:"Musterlösungen"};
  const title=titles[route.kind],grade=route.course.includes("/1-")?1:4;
  const label="BOK · "+grade+". Klasse";
  const nav=Object.entries(titles).map(([id,name])=>'<a href="/teacher/'+route.course+'/'+id+'"'+
    (id===route.kind?' aria-current="page"':'')+'>'+name+'</a>').join("");
  return '<!doctype html><html lang="de-CH"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<meta name="robots" content="noindex,nofollow,noarchive">'+
    '<title>'+title+' · '+label+'</title><link rel="stylesheet" href="/teacher.css"></head>'+
    '<body data-grade="'+grade+'"><header><div class="header-inner">'+
    '<p class="eyebrow">Geschützter Lehrpersonenbereich · '+label+'</p>'+
    '<h1>'+title+'</h1><nav class="area-nav" aria-label="Lehrpersonenmaterial">'+nav+'</nav></div></header>'+
    '<div class="teacher-layout"><aside class="lesson-sidebar">'+
    '<p class="sidebar-eyebrow">Unterrichtsübersicht</p><h2>Doppellektionen</h2>'+
    '<nav id="lessonNav" class="lesson-nav" aria-label="Doppellektion auswählen"></nav></aside>'+
    '<main id="teacherContent" data-course="'+route.course+'" data-kind="'+route.kind+'" aria-live="polite">'+
    '<p>Lade Lehrpersonenmaterial …</p></main></div>'+
    '<footer><a href="https://fachschaft-informatik-kst.github.io/ki-unterricht/'+route.course+'/">Zur Kursseite</a> · '+
    '<a href="/">Lehrpersonen-Editor</a> · <button type="button" id="printPage">Drucken</button></footer>'+
    '<script src="/markdown-it.min.js" defer></script><script src="/teacher.js" defer></script></body></html>';
}
