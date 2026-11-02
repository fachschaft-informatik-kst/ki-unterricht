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

// Match scripts/course_model.py: raw plan JSON only has order; DL numbers are derived.
const sortLessons=(a,b)=>Number(a.order??a.number*10)-Number(b.order??b.number*10);
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
  reproduktion:"Lässt sich das fremde Modell anhand seiner Originaldaten nachvollziehen?",
  "basis-daten-a":"Was gibt das bisherige Ziffernnetz aus, wenn es neue Buchstabenbilder sieht?",
  "basis-daten-b":"Warum erkennt das alte Ziffernnetz die Buchstaben A und B nicht zuverlässig?",
  "basis-plan-a":"Welche Schicht wird beim Transfer Learning übernommen und welche neu trainiert?",
  "basis-plan-b":"Wie schneidet der neue A/B-Kopf im Vergleich zum unveränderten Netz ab?",
  "basis-training-a":"Welche Bildklassen und unabhängigen Trainings- und Validierungsgruppen verwendet ihr?",
  "basis-training-b":"Wie vergleicht ihr die beiden Modellvarianten fair auf denselben Validierungsbildern?",
  "basis-training-test":"Welches Modell wurde vor dem Test gewählt und wie schnitt es auf den unabhängigen Testdaten ab?",
  "basis-abschluss-a":"Welche Fragestellung, Daten und Ergebnisse könnt ihr im Fachgespräch belegen?",
  "basis-abschluss-b":"Was habt ihr gelernt, und welche Grenzen hat euer Versuch?",
  fremd_erwartung:"Was erwartet ihr, bevor ihr eure eigenen Bildklassen mit dem fremden Modell prüft?",
  fremd_c_1:"Wie oft ordnet das fremde Modell eure erste eigene Klasse seiner ursprünglichen Klasse 1 zu?",
  fremd_c_2:"Wie oft ordnet das fremde Modell eure erste eigene Klasse seiner ursprünglichen Klasse 2 zu?",
  fremd_d_1:"Wie oft ordnet das fremde Modell eure zweite eigene Klasse seiner ursprünglichen Klasse 1 zu?",
  fremd_d_2:"Wie oft ordnet das fremde Modell eure zweite eigene Klasse seiner ursprünglichen Klasse 2 zu?",
  fremd_trenn:"Wie gross ist die Trennschärfe bei der günstigsten Zuordnung, und was bedeutet sie?",
  fremd_wert:"Wie gross ist der durchschnittliche Modellwert bei eurem Fremdversuch?",
  fremd_zuordnung:"Welchen ursprünglichen Ausgabeklassen ordnet das fremde Modell eure zwei neuen Klassen zu?",
  fremd_trennt:"Welche Merkmale könnte das Modell bei euren unbekannten Bildklassen unterscheiden?",
  fremd_warum:"Welchen konkreten Fehlfall habt ihr beobachtet, und wie könntet ihr die Ursache prüfen?",
  fremd_grenze:"Warum sind Ergebnisse mit euren neuen Klassen keine Trefferquote für diese Klassen?",
  fremd_rueckmeldung:"Welche begründete Rückmeldung gebt ihr dem fremden Tandem zu Daten und Ergebnissen?",
  fremd_name_1:"Wie heisst die erste Person, die die individuelle Reflexion ausfüllt?",
  fremd_reflexion_1_test:"Wie deutet Person 1 Originaltest und Fremdversuch im Vergleich?",
  fremd_reflexion_1_grenzen:"Welche Modellgrenzen und möglichen Ursachen nennt Person 1?",
  fremd_reflexion_1_repro:"Welche Beobachtungen aus dem Nachvollziehen des fremden Modells macht Person 1?",
  fremd_reflexion_1_transfer:"Welchen sinnvollen zusätzlichen Kontrollversuch schlägt Person 1 vor?",
  fremd_name_2:"Wie heisst die zweite Person, die die individuelle Reflexion ausfüllt?",
  fremd_reflexion_2_test:"Wie deutet Person 2 Originaltest und Fremdversuch im Vergleich?",
  fremd_reflexion_2_grenzen:"Welche Modellgrenzen und möglichen Ursachen nennt Person 2?",
  fremd_reflexion_2_repro:"Welche Beobachtungen aus dem Nachvollziehen des fremden Modells macht Person 2?",
  fremd_reflexion_2_transfer:"Welchen sinnvollen zusätzlichen Kontrollversuch schlägt Person 2 vor?"
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
// Student fields occur as data-answer (4th grade), data-basis-answer (1st
// grade) and data-journal (the shared project). Prefer actual field labels.
// Never silently attach a neighbouring, unrelated paragraph as the question.
export function questionsFromSource(source){
  const out={};
  for(const match of source.matchAll(/\bdata-(?:answer|basis-answer|journal)=["']([^"']+)["']/g)){
    const field=match[1];
    const start=source.lastIndexOf("<",match.index);
    const end=source.indexOf(">",match.index);
    if(start<0||end<0||end-start>1500)continue;
    const tag=source.slice(start,end+1);
    // Some controls have a direct aria-label (especially drag-and-drop cards).
    const aria=/\baria-label=["']([^"']+)["']/.exec(tag);
    let question=aria?clean(aria[1]):"";
    const prefix=source.slice(Math.max(0,match.index-2000),start);
    const labelStart=prefix.lastIndexOf("<label");
    const labelEnd=prefix.lastIndexOf("</label");
    if(!question&&labelStart>labelEnd){
      const label=prefix.slice(labelStart);
      const spans=[...label.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)];
      if(spans.length)question=clean(spans.at(-1)[1]);
      if(!question){
        const raw=label.slice(label.indexOf(">")+1).replace(/<(?:select|textarea|input)\b[\s\S]*$/,"");
        question=clean(raw);
      }
    }
    if(question.length>=4)out[field]=question.slice(0,600);
  }
  return out;
}

// Some notebook controls and legacy journal fields are created dynamically;
// their original texts aren't embedded as data-* attributes in chapter Markdown.
// Give these fields a useful subject label without claiming to quote the task.
const FIELD_GROUPS={
  sw:"Schwimmbad-Neuron · Startgewichte",sw2:"Schwimmbad-Neuron · verbesserte Gewichte",
  lr:"Lernrate und Trainingsverlauf",iris:"Iris-Erkennung",hand:"Logische Gatter am Perzeptron",
  neuron:"Schwimmbad-Neuron",xornetz:"XOR-Netzwerk",netze:"Neuronale Netze",
  zif:"Ziffernerkennung",typ:"Arten künstlicher Intelligenz",
  pst:"Textvorhersage und Kontext",pap:"Stochastischer Papagei",netz:"Neuronales Sprachmodell",
  soe:"Soekia-Experiment",turing:"Turing-Test",wmd:"Wahrheit und Manipulation",
  video:"Videobeispiel",bild:"Bildbeispiel",gesellschaft:"KI und Gesellschaft",
  wissen:"Akinator und regelbasiertes Wissen",memory:"Lernarten und Memory",
  lernend:"Filmlandkarte",begriff:"KI-Begriffe",begriffe:"KI-Begriffe",regeln:"Regeln oder Daten",
  projekt:"Eigenes Bildprojekt",fremd:"Prüfung des fremden Modells"
};
const FIELD_TERMS={
  w1:"Gewicht 1",w2:"Gewicht 2",b:"Bias",bias:"Bias",ok:"Ergebnis prüfen",
  gs:"Gewicht Sonne",gf:"Gewicht Freundinnen/Freunde",gp:"Gewicht Prüfung",
  treffer:"Anzahl korrekter Vorhersagen",gefunden:"Geeignete Parameter gefunden?",
  beob:"Beobachtung",richtig:"Richtige Vorhersagen",gewicht:"Einfluss der Gewichte",
  lr:"Lernrate",start:"Startwerte",daten:"Daten",lernen:"Lernen",frage:"Frage",
  anfang:"Anfangstext",kontext:"Gegebener Kontext",wort:"Nächstes Wort",
  plausibel:"Plausibilität",wahr:"Faktenprüfung",beleg:"Begründung / Beleg",
  art:"Art des Beispiels",text:"Textbeispiel",eindruck:"Erster Eindruck",
  hinweise:"Erkennungsmerkmale",werte:"Werte",ausgabe:"Vorhersage",
  variable:"Geänderte Variable",gut:"Gelingendes Beispiel",problem:"Problematisches Beispiel",
  zeitstrahl:"KI-Zeitstrahl",ordnung:"KI-Begriffe ordnen",
  zusammen:"Zusammenfassung",vergleichen:"Vergleich",vergleich:"Vergleich",
  beispiel:"Eigenes Beispiel",bsp:"Beispiel"
};
export function fieldTopic(field,lessonTitle=""){
  let f=field.replace(/^basis-/,"").replace(/^dl\d+_/,"");
  const parts=f.split(/[-_]/).filter(Boolean);
  const subject=FIELD_GROUPS[parts[0]]||lessonTitle||"Unterrichtsaufgabe";
  const detail=parts.slice(1).map(x=>FIELD_TERMS[x]||
    (/[a-z]+/.test(x)?x.replace(/^./,c=>c.toUpperCase()):x)).join(" · ");
  // Keep titles short and readable; IDs remain available separately.
  return detail?subject+": "+detail:subject;
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
  // One missing chapter must not hide every other original prompt.
  const data=await Promise.allSettled(files.map(path=>getText(token,path,github,repo)));
  return Object.assign({},...data.filter(item=>item.status==="fulfilled")
    .map(item=>questionsFromSource(item.value)));
}
export async function teacherData({course,kind},token,github,repo,selected=1){
  const profile=PROFILES[course];if(!profile)throw Error("Kurs unbekannt.");
  const manifest=await getJson(token,profile.manifest,github,repo);
  const views=(manifest.sections||[]).filter(s=>s.teaching&&/^[a-z][a-z0-9-]*$/.test(s.id));
  if(views.length>20)throw Error("Zu viele Unterrichtsbereiche.");
  const plans=await Promise.all(views.map(s=>getJson(token,"kursseiten/"+s.id+"/planung.json",github,repo)));
  const lessons=plans.flatMap(p=>p.lessons||[]).sort(sortLessons)
    .map((lesson,index)=>({...lesson,number:index+1}));
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
    const original=questions[entry.field];
    const curated=PROMPTS[entry.field];
    entry.question=original||curated||fieldTopic(entry.field,current.title);
    entry.questionSource=original?"original":curated?"sinngemaess":"thema";
    entry.questionFound=Boolean(original||curated);
    entry.courseLink="https://fachschaft-informatik-kst.github.io/ki-unterricht/"+
      course+"/#"+current.view;
  }
  return {...base,notes,entries,
    sections:[{title:"Allgemeine Musterlösungen",markdown:general},
      {title:"Feldgenaue Lösungen",markdown:fields}]};
}


// Course selection follows the same registry as the public course overview.
// An unconfigured course must never fall back to BOK teacher material.
export const DEFAULT_COURSES = [{"id":"bok-1-klasse","teacher":"BOK","grade":1,"slug":"bok/1-klasse","source":"basis","status":"published","name":"KI entdecken","theme":{"accent":"#3653a3"}},{"id":"bok-4-klasse","teacher":"BOK","grade":4,"slug":"bok/4-klasse","source":"projekt","status":"published","name":"KI vertiefen","theme":{"accent":"#076959"}},{"id":"irn-1-klasse","teacher":"IRN","grade":1,"slug":"irn/1-klasse","source":null,"status":"planned","name":"KI entdecken – IRN","theme":{"accent":"#69419b"}},{"id":"irn-4-klasse","teacher":"IRN","grade":4,"slug":"irn/4-klasse","source":null,"status":"planned","name":"KI vertiefen – IRN","theme":{"accent":"#9a481d"}}];
const VALID_SLUGS=new Set(DEFAULT_COURSES.map(c=>c.slug));
export function normalizeTeacherCourses(registry){
  if(registry?.version!==1||!Array.isArray(registry.courses))throw Error("Kursregister ungültig.");
  const courses=[];
  for(const item of registry.courses){
    if(!VALID_SLUGS.has(item?.slug)||courses.some(c=>c.slug===item.slug)||
      !/^[a-z][a-z0-9-]*$/.test(item.id||"")||
      !["BOK","IRN"].includes(item.teacher)||![1,4].includes(item.grade)||
      !/^[#][0-9a-fA-F]{6}$/.test(item.theme?.accent||""))
      throw Error("Kursauswahl enthält einen ungültigen Eintrag.");
    const template=DEFAULT_COURSES.find(c=>c.slug===item.slug);
    if(item.id!==template.id||item.teacher!==template.teacher||item.grade!==template.grade)
      throw Error("Kursidentität darf nicht geändert werden.");
    courses.push({id:item.id,teacher:item.teacher,grade:item.grade,slug:item.slug,
      name:String(item.name||"").slice(0,120),accent:item.theme.accent,
      ready:!!PROFILES[item.slug]&&item.status==="published"&&!!item.source});
  }
  if(courses.length!==4)throw Error("Alle vier Kursplätze müssen vorhanden sein.");
  return courses;
}
export async function loadTeacherCourses(token,github,repo){
  return normalizeTeacherCourses(await getJson(token,"shared/course-sites.json",github,repo));
}

export function teacherThemeStylesheet(courses,course){
  const selected=courses.find(item=>item.slug===course&&item.ready);
  if(!selected)throw Error("Kurs-Farbthema nicht vorhanden.");
  return 'body[data-grade="'+selected.grade+'"]{--accent:'+selected.accent+'}';
}
export function teacherShell(route,courses=normalizeTeacherCourses({version:1,courses:DEFAULT_COURSES})){
  const titles={planung:"AVIVA-Unterrichtsplanung",materialien:"Materialkoffer",musterloesungen:"Musterlösungen"};
  const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
  const active=courses.find(c=>c.slug===route.course&&c.ready);
  if(!active)throw Error("Dieser Kurs ist noch nicht für Lehrpersonenmaterial freigeschaltet.");
  const label=active.teacher+" · "+active.grade+". Klasse";
  const title=titles[route.kind];
  const opts=courses.map(c=>{
    const name=c.teacher+" · "+c.grade+". Klasse · "+c.name+(c.ready?"":" (in Vorbereitung)");
    return '<option value="'+esc(c.slug)+'"'+(c.slug===route.course?' selected':'')+
      (c.ready?"":' disabled')+'>'+esc(name)+'</option>';
  }).join("");
  const nav=Object.entries(titles).map(([id,name])=>'<a href="/teacher/'+route.course+'/'+id+'"'+
    (id===route.kind?' aria-current="page"':'')+'>'+esc(name)+'</a>').join("");
  return '<!doctype html><html lang="de-CH"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<meta name="robots" content="noindex,nofollow,noarchive">'+
    '<title>'+esc(title)+' · '+esc(label)+'</title><link rel="stylesheet" href="/teacher.css">'+
    '<link rel="stylesheet" href="/teacher-theme.css?course='+encodeURIComponent(route.course)+'"></head>'+
    '<body data-grade="'+active.grade+'"><header><div class="header-inner">'+
    '<p class="eyebrow">Geschützter Lehrpersonenbereich · '+esc(label)+'</p>'+
    '<div class="course-switcher"><div class="course-picker">'+
    '<label for="teacherCourseSelect">Kurs auswählen</label>'+
    '<select id="teacherCourseSelect" aria-label="Lehrperson und Klasse auswählen">'+opts+'</select>'+
    '<p class="course-picker-note">IRN-Kurse sind angelegt. Ihre eigenen Lehrpersonenmaterialien sind noch in Vorbereitung.</p>'+
    '</div><div class="course-context"><span>Aktueller Kurs</span><strong>'+esc(label)+'</strong>'+
    '<small>'+esc(active.name)+'</small></div></div>'+
    '<h1>'+esc(title)+'</h1><nav class="area-nav" aria-label="Lehrpersonenmaterial">'+nav+'</nav></div></header>'+
    '<div class="teacher-layout"><aside class="lesson-sidebar">'+
    '<p class="sidebar-eyebrow">Unterrichtsübersicht · '+esc(label)+'</p><h2>Doppellektionen</h2>'+
    '<nav id="lessonNav" class="lesson-nav" aria-label="Doppellektion auswählen"></nav></aside>'+
    '<main id="teacherContent" data-course="'+route.course+'" data-kind="'+route.kind+'" aria-live="polite">'+
    '<p>Lade Lehrpersonenmaterial …</p></main></div>'+
    '<footer><a href="https://fachschaft-informatik-kst.github.io/ki-unterricht/'+route.course+'/">Zur Kursseite</a> · '+
    '<a href="/">Lehrpersonen-Editor</a> · <button type="button" id="printPage">Drucken</button></footer>'+
    '<script src="/markdown-it.min.js" defer></script><script src="/teacher.js" defer></script></body></html>';
}
