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
export async function teacherData({course,kind},token,github,repo){
  const profile=PROFILES[course];if(!profile)throw Error("Kurs unbekannt.");
  if(kind==="musterloesungen"){
    const docs=await Promise.all(["lehrperson/musterloesungen.md",
      "lehrperson/musterloesungen-felder-"+profile.grade+"-klasse.md"]
      .map(p=>getText(token,p,github,repo)));
    return {kind,course,sections:[{title:"Allgemeine Musterlösungen",markdown:docs[0]},
      {title:"Musterlösungen · "+profile.grade+". Klasse",markdown:docs[1]}]};
  }
  const manifest=await getJson(token,profile.manifest,github,repo);
  const sections=(manifest.sections||[]).filter(s=>s.teaching&&/^[a-z][a-z0-9-]*$/.test(s.id));
  if(sections.length>20)throw Error("Zu viele Unterrichtsbereiche.");
  if(kind==="planung"){
    const plans=await Promise.all(sections.map(s=>getJson(token,"kursseiten/"+s.id+"/planung.json",github,repo)));
    return {kind,course,lessons:plans.flatMap(p=>p.lessons||[]).sort((a,b)=>a.number-b.number)};
  }
  const docs=await Promise.all(sections.map(s=>getText(token,"kursseiten/"+s.id+"/materialien.md",github,repo)));
  const result=sections.map((s,i)=>({title:s.navigation?.title||s.id,markdown:docs[i]}));
  if(profile.grade===4)result.unshift({title:"Materialkoffer und Projektmaterial",
    markdown:await getText(token,"lehrperson/materialien.md",github,repo)});
  return {kind,course,sections:result};
}
export function teacherShell(route){
  const titles={planung:"AVIVA-Unterrichtsplanung",materialien:"Materialkoffer",musterloesungen:"Musterlösungen"};
  const title=titles[route.kind],label="BOK · "+(route.course.includes("/1-")?"1.":"4.")+" Klasse";
  const nav=Object.entries(titles).map(([id,name])=>'<a href="/teacher/'+route.course+'/'+id+'"'+
    (id===route.kind?' aria-current="page"':'')+'>'+name+'</a>').join("");
  return '<!doctype html><html lang="de-CH"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<meta name="robots" content="noindex,nofollow,noarchive">'+
    '<title>'+title+' · '+label+'</title><link rel="stylesheet" href="/teacher.css"></head>'+
    '<body><header><p class="eyebrow">Geschützter Lehrpersonenbereich · '+label+'</p>'+
    '<h1>'+title+'</h1><nav aria-label="Lehrpersonenmaterial">'+nav+'</nav></header>'+
    '<main id="teacherContent" data-course="'+route.course+'" data-kind="'+route.kind+'"><p>Lade Inhalte …</p></main>'+
    '<footer><a href="https://fachschaft-informatik-kst.github.io/ki-unterricht/'+route.course+'/">Zur Kursseite</a> · '+
    '<a href="/">Lehrpersonen-Editor</a> · <button type="button" id="printPage">Drucken</button></footer>'+
    '<script src="/markdown-it.min.js" defer></script><script src="/teacher.js" defer></script></body></html>';
}
