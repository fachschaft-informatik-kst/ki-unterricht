import {createPlanner} from "./plan-editor.js";
import {lessonTemplate} from "./course-model.js";
import {validateGlossary,GLOSSARY_PATH} from "./glossary-model.js";
// The public Pages origin has no authenticated API. Send editors to the Worker origin.
const pagesOrigin = location.hostname === "fachschaft-informatik-kst.github.io";
if (pagesOrigin) location.replace("https://kst-ki-admin.kevin-bohn.workers.dev/" + location.search + location.hash);
/* Admin editor: browser UI never receives GitHub secrets or tokens. */
const $=id=>document.getElementById(id);
const state={chapters:[],current:null,staged:new Map(),manifest:null,plans:new Map(),notebooks:[],course:"vertiefung",glossary:null,glossarySelected:null};
const manifestPath=()=>$("courseSelect").value==="basis"?"kursseiten/basis-manifest.json":"kursseiten/manifest.json";
const planner=createPlanner($("planEditor"),content=>{$("source").value=content;preview();},()=>preview());

const sidebarToggle=$("toggleSidebar");
sidebarToggle.addEventListener("click",()=>{
  const collapsed=$("workspace").classList.toggle("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded",String(!collapsed));
  const label=collapsed?"Kapitelnavigation einblenden":"Kapitelnavigation ausblenden";
  sidebarToggle.setAttribute("aria-label",label);
  sidebarToggle.title=label;
});

const sourceLayer=$("sourceHighlight");
function highlightSource(){
  const raw=$("source").value;
  const escape=v=>v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const token=(kind,s)=>'<span class="tok-'+kind+'">'+escape(s)+'</span>';
  const renderTag=part=>{
    const start=/^<(\/?)([A-Za-z][\w:-]*)/.exec(part);
    if(!start)return token("tag",part);
    let result=escape("<"+start[1])+token("tag",start[2]);
    const tail=part.slice(start[0].length);
    const attrs=/(\s+)([^\s=/>]+)(?:(\s*=\s*)("(?:[^"]*)"|'(?:[^'])*'|[^\s>]+))?/g;
    let index=0,match;
    while((match=attrs.exec(tail))){
      result+=escape(tail.slice(index,match.index)+match[1]);
      result+=token("attr",match[2])+(match[3]?escape(match[3])+token("string",match[4]):"");
      index=attrs.lastIndex;
    }
    return result+escape(tail.slice(index));
  };
  // A quoted > is not a tag terminator. HTML comments span multiple lines.
  const pieces=/(<!--[\s\S]*?(?:-->|$)|<!DOCTYPE\b[^>]*>|<\/?[A-Za-z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>|^#{1,6}[^\n]*)/gm;
  let result="",position=0;
  for(const match of raw.matchAll(pieces)){
    result+=escape(raw.slice(position,match.index));
    const part=match[0];
    result+=part.startsWith("<!--")?token("comment",part):
      /^<!DOCTYPE/i.test(part)?token("tag",part):
      part.startsWith("<")?renderTag(part):token("heading",part);
    position=match.index+part.length;
  }
  sourceLayer.innerHTML=result+escape(raw.slice(position))+"\n";
  sourceLayer.scrollTop=$("source").scrollTop;
  sourceLayer.scrollLeft=$("source").scrollLeft;
}
$("source").addEventListener("scroll",()=>{
  sourceLayer.scrollTop=$("source").scrollTop;
  sourceLayer.scrollLeft=$("source").scrollLeft;
});

function status(message,error=false){$("notice").textContent=message;$("notice").classList.toggle("error",error);}
function error(err){status(String(err.message||err),true);}
async function api(url,options={}){
  let response;
  try{response=await fetch(url,{credentials:"same-origin",cache:"no-store",redirect:"manual",...options});}
  catch(e){throw Error("Admin-Gateway nicht erreichbar ("+url+"): "+String(e.message||e));}
  const raw=await response.text();
  let data=null;
  try{data=JSON.parse(raw);}catch{}
  if(!response.ok||!data||typeof data!=="object"){
    const detail=typeof data?.error==="string"?data.error:null;
    const label="HTTP "+response.status+" bei "+url;
    if(response.status===401)throw Error("GitHub-Sitzung abgelaufen. Bitte erneut anmelden. ("+label+")");
    if(response.status===413)throw Error("Die Änderungen sind für das Gateway zu gross ("+label+"). Bitte Bilder verkleinern.");
    if(response.status===403)throw Error((detail||"Zugriff verweigert – GitHub-App-Rechte und Anmeldung prüfen.")+" ("+label+")");
    if(detail)throw Error(detail+" ("+label+")");
    throw Error("Admin-Gateway liefert keine gültige JSON-Antwort ("+label+
      ", Content-Type: "+(response.headers.get("content-type")||"unbekannt")+
      "). Prüfe Cloudflare Worker Logs und die Bereitstellung unter "+location.origin+".");
  }
  return data;
}
const post=(url,value)=>api(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(value)});
const slug=text=>text.trim().toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const filename=path=>path.split("/").pop().replace(".md","");
const notebookPath=path=>/^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/.test(path);
function stagingList(){
  const node=$("staged");node.replaceChildren();
  const count=state.staged.size;
  $("pendingCount").textContent=String(count);
  $("pendingCount").setAttribute("aria-label",count+" vorgemerkt");
  $("toggleChanges").classList.toggle("has-changes",count>0);
  $("publishHint").textContent=count===0?"Noch nichts vorgemerkt":
    count===1?"1 Datei bereit für den Pull Request":count+" Dateien bereit für den Pull Request";
  $("publish").disabled=count===0;
  if(!count){
    const li=document.createElement("li");li.className="staged-empty";
    li.textContent="Noch keine Änderungen. Bearbeite einen Inhalt und klicke auf «Änderung vormerken».";
    node.append(li);return;
  }
  for(const c of state.staged.values()){
    const li=document.createElement("li");li.className="staged-item";
    const text=document.createElement("span");text.className="staged-info";
    const name=document.createElement("strong");
    name.textContent=c.path.split("/").pop();
    const location=document.createElement("small");location.textContent=c.path;
    location.title=c.path;
    text.append(name,location);
    const remove=document.createElement("button");remove.type="button";remove.className="staged-remove";
    remove.textContent="×";remove.title="Vormerkung entfernen";remove.setAttribute("aria-label",c.path+" aus Vormerkungen entfernen");
    remove.addEventListener("click",()=>{state.staged.delete(c.path);stagingList();});
    li.append(text,remove);node.append(li);
  }
}
// Section and chapter navigation share one selection state; the legacy
// native selector remains available to keyboard and assistive technologies.
function renderSectionNav(){
  const nav=$("sectionNav");nav.replaceChildren();
  const selected=$("section").value;
  for(const [index,option] of [...$("section").options].entries()){
    const section=option.value;
    const button=document.createElement("button");
    button.type="button";button.className="section-link";
    button.dataset.section=section;
    button.setAttribute("aria-current",String(section===selected));
    const icon=document.createElement("span");icon.className="section-icon";
    icon.setAttribute("aria-hidden","true");
    icon.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z"/></svg>';
    const name=document.createElement("span");name.className="section-name";name.textContent=option.textContent;
    const count=document.createElement("span");count.className="section-count";
    count.textContent=String(chaptersFor(section).length);
    count.title="Anzahl Unterkapitel";
    button.append(icon,name,count);
    button.addEventListener("click",()=>{
      if($("section").value!==section){
        if(!confirmUnsaved())return;
        $("section").value=section;
        chapterList();
      }
      const first=$("chapters").querySelector("button");
      if(first)first.focus();
    });
    nav.append(button);
  }
}
const chapterPath=path=>/^kursseiten\/[^/]+\/[0-9]{3}-[^/]+\.md$/.test(path);
const chaptersFor=section=>state.chapters.filter(c=>c.path.startsWith("kursseiten/"+section+"/")&&chapterPath(c.path))
  .sort((a,b)=>a.path.localeCompare(b.path));
function chapterContent(item){
  if(state.current?.path===item.path)return $("source").value;
  return state.staged.get(item.path)?.content;
}
async function stageChapterOrder(section,source,target){
  if(source===target)return;
  if(!confirmUnsaved())return;
  const items=chaptersFor(section);
  const from=items.findIndex(x=>x.path===source),to=items.findIndex(x=>x.path===target);
  if(from<0||to<0)throw Error("Kapitel nicht gefunden.");
  const ordered=items.slice(),[moving]=ordered.splice(from,1);
  ordered.splice(to,0,moving);
  const pos=ordered.findIndex(x=>x.path===source);
  const prev=pos>0?Number(ordered[pos-1].path.split("/").pop().slice(0,3)):0;
  const next=pos<ordered.length-1?Number(ordered[pos+1].path.split("/").pop().slice(0,3)):999;
  const prefix=Math.floor((prev+next)/2);
  if(prefix<=prev||prefix>=next)
    throw Error("Zwischen diesen Kapiteln ist kein freier Sortierplatz. Bitte ein benachbartes Kapitel verschieben.");
  const path="kursseiten/"+section+"/"+String(prefix).padStart(3,"0")+source.split("/").pop().slice(3);
  if(state.chapters.some(x=>x.path===path)||state.staged.has(path))
    throw Error("Der Zielplatz ist belegt.");
  if(state.staged.size+(moving.sha?2:1)>12)
    throw Error("Maximal zwölf Dateien pro Pull Request. Bitte bestehende Änderungen zuerst einreichen.");
  const content=chapterContent(moving)??(await api("/api/file?path="+encodeURIComponent(source))).content;
  if(moving.sha)state.staged.set(source,{path:source,expectedSha:moving.sha,delete:true});
  else state.staged.delete(source);
  state.staged.set(path,{path,expectedSha:null,content});
  state.chapters=state.chapters.map(x=>x.path===source?{path,sha:null}:x);
  if(state.current?.path===source)useFile(path,null,content);
  chapterList();stagingList();
  status("Unterkapitel verschoben und für den Pull Request vorgemerkt.");
}
function chapterList(){
  const nav=$("chapters");nav.replaceChildren();
  const section=$("section").value;
  const items=chaptersFor(section);
  $("subchapterTitle").textContent="Unterkapitel";
  if(!items.length){
    const empty=document.createElement("p");empty.className="chapter-empty";
    empty.textContent="Noch keine Unterkapitel.";
    nav.append(empty);
  }
  for(const [index,item] of items.entries()){
    const row=document.createElement("div");row.className="order-row";row.draggable=true;row.dataset.path=item.path;
    const grip=document.createElement("span");grip.className="drag-handle";grip.textContent="⠿";
    grip.setAttribute("aria-hidden","true");grip.title="Zum Sortieren ziehen";
    const button=document.createElement("button");button.type="button";
    const number=document.createElement("span");number.className="chapter-number";
    number.textContent=String(index+1).padStart(2,"0");
    const label=document.createElement("span");label.className="chapter-label";
    const name=document.createElement("span");name.className="chapter-name";
    name.textContent=filename(item.path).replace(/^[0-9]{3}-/,"").replaceAll("-"," ");
    const detail=document.createElement("small");detail.className="chapter-file";
    detail.textContent=filename(item.path);
    label.append(name,detail);button.append(number,label);
    button.setAttribute("aria-current",String(state.current?.path===item.path));
    button.title=item.path;
    button.addEventListener("click",()=>load(item.path));
    row.append(grip,button);
    row.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",item.path);e.dataTransfer.effectAllowed="move";});
    row.addEventListener("dragover",e=>{e.preventDefault();row.classList.add("drag-over");});
    row.addEventListener("dragleave",()=>row.classList.remove("drag-over"));
    row.addEventListener("drop",e=>{e.preventDefault();row.classList.remove("drag-over");
      const source=e.dataTransfer.getData("text/plain");
      if(source.startsWith("kursseiten/"+section+"/"))stageChapterOrder(section,source,item.path).catch(error);
    });
    nav.append(row);
  }
  renderSectionNav();
}
async function loadPlans(){
  const manifest=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content);
  await Promise.all(manifest.sections.filter(x=>x.teaching).map(async section=>{
    const path="kursseiten/"+section.id+"/planung.json";
    if(!state.plans.has(path)){
      const file=state.staged.get(path)||await api("/api/file?path="+encodeURIComponent(path));
      state.plans.set(path,{sha:file.expectedSha??file.sha,original:file.original??file.content});
    }
  }));
  renderLessonOrder();
}
function orderedSections(){
  const manifest=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content);
  return manifest.sections.filter(x=>x.teaching).map(section=>{
    const path="kursseiten/"+section.id+"/planung.json";
    const stored=state.staged.get(path)?.content||state.plans.get(path)?.original;
    const lessons=JSON.parse(stored).lessons.slice().sort((a,b)=>a.order-b.order);
    return {section,path,lessons};
  }).sort((a,b)=>a.lessons[0].order-b.lessons[0].order);
}
function commitLessonOrder(groups){
  const lessonIds=groups.flatMap(g=>g.lessons.map(l=>l.id));
  if(new Set(lessonIds).size!==lessonIds.length)throw Error("Doppelte Lektions-ID.");
  let number=0;
  for(const group of groups){
    for(const lesson of group.lessons)lesson.order=(++number)*10;
    const entry=state.plans.get(group.path);
    const plan=JSON.parse(state.staged.get(group.path)?.content||entry.original);
    plan.lessons=group.lessons;
    const content=JSON.stringify(plan,null,2)+"\n";
    if(content===entry.original&&!state.staged.has(group.path))continue;
    state.staged.set(group.path,{path:group.path,expectedSha:entry.sha,
      original:entry.original,content});
    if(state.current?.path===group.path){
      $("source").value=content;
      planner.open(content,group.section.id);
    }
  }
  if(state.staged.size>12)throw Error("Maximal zwölf Dateien pro PR.");
  stagingList();renderLessonOrder();
  status("Neue Reihenfolge vorgemerkt. Sichtbare Lektionsnummern werden automatisch neu berechnet.");
}
function renderLessonOrder(){
  const list=$("lessonOrder");list.replaceChildren();
  if(!state.plans.size)return;
  const groups=orderedSections();
  const selector=$("section"),selected=selector.value;
  const options=[...selector.options];
  const position=new Map(groups.map((group,i)=>[group.section.id,i]));
  options.sort((a,b)=>(position.get(a.value)??-1)-(position.get(b.value)??-1));
  selector.replaceChildren(...options);
  selector.value=selected;
  renderSectionNav();
  let visible=0;
  for(const group of groups){
    const box=document.createElement("div");box.className="lesson-sort-group";
    const head=document.createElement("div");head.className="lesson-sort-head";head.draggable=true;
    const first=visible+1;visible+=group.lessons.length;
    head.textContent="⠿  "+(first===visible?first:first+"–"+visible)+" · "+group.section.navigation.title;
    head.title="Gesamten Unterrichtsblock ziehen";
    head.addEventListener("dragstart",e=>{e.dataTransfer.setData("application/x-course-group",group.section.id);e.dataTransfer.effectAllowed="move";});
    head.addEventListener("dragover",e=>{e.preventDefault();e.stopPropagation();head.classList.add("drag-over");});
    head.addEventListener("dragleave",()=>head.classList.remove("drag-over"));
    head.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();head.classList.remove("drag-over");
      const id=e.dataTransfer.getData("application/x-course-group");
      if(!id||id===group.section.id)return;
      try{if(!confirmUnsaved())return;const from=groups.findIndex(g=>g.section.id===id);
        const to=groups.findIndex(g=>g.section.id===group.section.id);
        const [item]=groups.splice(from,1);groups.splice(to,0,item);commitLessonOrder(groups);
      }catch(err){error(err);}
    });
    box.append(head);
    for(const lesson of group.lessons){
      const row=document.createElement("div");row.className="lesson-sort-item";row.draggable=true;
      row.textContent="⋮⋮  "+(group.lessons.indexOf(lesson)+first)+". "+lesson.title;
      row.title="Innerhalb dieses Bereichs verschieben";
      row.addEventListener("dragstart",e=>{e.stopPropagation();e.dataTransfer.setData("application/x-course-lesson",lesson.id);});
      row.addEventListener("dragover",e=>{e.preventDefault();e.stopPropagation();row.classList.add("drag-over");});
      row.addEventListener("dragleave",()=>row.classList.remove("drag-over"));
      row.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();row.classList.remove("drag-over");
        const id=e.dataTransfer.getData("application/x-course-lesson");
        const from=group.lessons.findIndex(l=>l.id===id),to=group.lessons.findIndex(l=>l.id===lesson.id);
        if(from<0||from===to)return;
        try{if(!confirmUnsaved())return;const [item]=group.lessons.splice(from,1);
          group.lessons.splice(to,0,item);commitLessonOrder(groups);
        }catch(err){error(err);}
      });
      box.append(row);
    }
    list.append(box);
  }
}
let navigationRevision=0;
function useFile(path,sha,content,original=content){
  const targetSection=path.split("/")[1];
  if(/\/(?:planung\.json|materialien\.md)$/.test(path) &&
      (targetSection.startsWith("basis-")!==(state.course==="basis")))
    throw Error("Dieser Inhalt gehört zur anderen Klassenstufe. Bitte zuerst den Kurs wechseln.");
  state.current={path,sha,original};
  $("path").textContent=path;
  $("courseContext").textContent=state.course==="basis"?"1. Kurzgymnasium · KI entdecken":"4. Kurzgymnasium · KI vertiefen";
  $("heading").textContent=path===GLOSSARY_PATH?"KI-Glossar bearbeiten":
    path.endsWith("/planung.json")?"AVIVA-Unterrichtsplan":
    path.endsWith("/materialien.md")?"Unterrichtsmaterialien":filename(path);
  const isGlossary=path===GLOSSARY_PATH;
  const isPlan=path.endsWith("/planung.json");
  const isNotebook=notebookPath(path);
  $("source").value=content;
  highlightSource();
  const isChapter=/\/[0-9]{3}-[^/]+\.md$/.test(path);
  $("move").disabled=!sha||!isChapter;$("archive").disabled=!sha||!isChapter;
  for(const id of ["toolbar","editorHelper"])
    $(id).hidden=isPlan||isNotebook||isGlossary;
  $("sourceLabel").hidden=isNotebook;
  $("sourceLabel").textContent=isPlan?"AVIVA-Formular":isGlossary?"Glossarbegriffe bearbeiten":"HTML / Markdown";
  $("planCourseTag").textContent=state.course==="basis"?"1. Klasse":"4. Klasse";
  $("formEditor").hidden=!(isPlan||isGlossary);
  $("glossaryEditor").hidden=!isGlossary;
  $("notebookEditor").hidden=!isNotebook;
  if(isNotebook)openRuntimeNotebook(content,path);
  $("previewButton").hidden=isNotebook;
  $("previewHeading").hidden=isNotebook;
  $("preview").hidden=isNotebook;
  $("codeEditor").hidden=isPlan||isNotebook||isGlossary;
  // Every course editor has the same resizable two-column workspace.
  $("splitEditor").hidden=isNotebook;
  $("splitEditor").classList.remove("preview-only");
  $("splitEditor").querySelector(".split-source").hidden=false;
  if(isGlossary)openGlossaryControls(content);
  if(isPlan)planner.open(content,$("section").value);
  else planner.close();
  // Force a new document for every navigation, including plans and materials.
  $("preview").removeAttribute("srcdoc");
  if(!isNotebook)preview();
  chapterList();
  for(const [id,active] of [
    ["editPlan",isPlan],["editMaterials",path.endsWith("/materialien.md")],["editGlossary",isGlossary]
  ])$(id).setAttribute("aria-current",String(active));
  for(const b of $("notebooks").querySelectorAll("button"))b.setAttribute("aria-current",String(b.title===path));
}
function savedText(){return state.current?state.staged.get(state.current.path)?.content??state.current.original:"";}
async function load(path){
  if(state.current&&(runtimeDirty&&notebookPath(state.current.path)||$("source").value!==savedText())&&!confirm("Nicht vorgemerkte Änderungen verwerfen?"))return;
  const revision=++navigationRevision;
  try{
    status("Lade Kapitel …");
    const staged=state.staged.get(path);
    if(staged&&!staged.delete)useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);
    else{const file=await api("/api/file?path="+encodeURIComponent(path));if(revision!==navigationRevision)return;useFile(path,file.sha,file.content);}
    status("Kapitel bereit. Nach dem Speichern einen Pull Request erstellen.");
  }catch(e){error(e);}
}
async function refresh(){
  const course=state.course;
  const manifest=await api("/api/file?path="+encodeURIComponent(manifestPath()));
  if(course!==state.course)return;
  state.manifest={sha:manifest.sha,content:manifest.content};
  const data=await api("/api/chapters");
  if(course!==state.course)return;
  const known=data.chapters.filter(c=>!state.staged.get(c.path)?.delete);
  // A refresh must not discard newly created (as yet unmerged) lesson chapters.
  const pending=[...state.staged.values()].filter(c=>/^kursseiten\/[^/]+\/[0-9]{3}-[^/]+\.md$/.test(c.path)&&!c.delete&&!known.some(k=>k.path===c.path))
    .map(c=>({path:c.path,sha:c.expectedSha}));
  const unsubmitted=state.chapters.filter(c=>!c.sha&&!state.staged.has(c.path)&&!known.some(k=>k.path===c.path));
  state.chapters=[...known,...pending,...unsubmitted].sort((a,b)=>a.path.localeCompare(b.path));
  const definitions=JSON.parse(state.staged.get(manifestPath())?.content||manifest.content).sections;
  const valid=definitions.filter(s=>s.teaching||s.id==="lernziele").map(s=>s.id);
  const previous=$("section").value;
  $("section").replaceChildren();
  for(const entry of definitions.filter(s=>valid.includes(s.id))){const option=document.createElement("option");option.value=entry.id;option.textContent=entry.navigation?.title||entry.id;$("section").append(option);}
  const currentSection=state.current?.path.split("/")[1];
  $("section").value=valid.includes(previous)?previous:(valid.includes(currentSection)?currentSection:valid[0]||"");
  chapterList();
  state.plans.clear();
  await loadPlans();
  if(course!==state.course)return;
  await refreshNotebooks();
}
function insert(text){
  const source=$("source");source.focus();
  const start=source.selectionStart,end=source.selectionEnd;
  source.setRangeText(text,start,end,"end");highlightSource();preview();
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
// Match the published Python markdown-it-py renderer, which is a Markdown-it port.
// Both use CommonMark + explicit table support + raw HTML support.
// No fallback parser: a missing asset must be visible instead of showing wrong content.
const MARKDOWN_RENDERER=globalThis.markdownit?.("commonmark",{html:true}).enable("table");
function markdown(source){
  if(!MARKDOWN_RENDERER)throw Error("Markdown-it für die Vorschau konnte nicht geladen werden.");
  return MARKDOWN_RENDERER.render(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""));
}
const COURSE_PREVIEW_BASE = "https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/";
const BASIS_PREVIEW_BASE = "https://fachschaft-informatik-kst.github.io/ki-unterricht/basis/";
const COURSE_PREVIEW_CSS = "\n:root{--ink:#182b31;--muted:#52656a;--paper:#f5f4ee;--white:#fff;--line:#d8dfdb;--accent:#076959;--soft:#e7f1eb;--orange:#b84d27;--orange-soft:#fff0e7;--radius:16px;--nav:244px}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:30px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif}a{color:var(--accent);text-underline-offset:4px}a:hover{text-decoration-thickness:2px}button,input,select,textarea{font:inherit}button,a,input,select,textarea,summary{-webkit-tap-highlight-color:transparent}:focus-visible{outline:3px solid #ba552e;outline-offset:4px}button{cursor:pointer}button:disabled{opacity:.6;cursor:wait}h1,h2,h3,p{margin-top:0}h1,h2,h3{line-height:1.15;letter-spacing:-.035em}h1{font-size:clamp(2.8rem,5.2vw,4.7rem);max-width:800px;margin-bottom:26px;font-weight:750}h2{font-size:clamp(1.8rem,3vw,2.45rem);margin-bottom:14px}h3{font-size:1.17rem;letter-spacing:-.015em}p{margin-bottom:16px}.skip{position:absolute;left:20px;top:-100px;background:white;padding:12px;z-index:100}.skip:focus{top:10px}.sidebar{position:fixed;inset:0 auto 0 0;width:var(--nav);background:var(--white);border-right:1px solid var(--line);padding:32px 22px;display:flex;flex-direction:column;z-index:5;overflow:auto}.brand{font-weight:750;font-size:18px;letter-spacing:-.02em;text-decoration:none;color:var(--ink);display:flex;align-items:center;gap:11px}.mark{display:inline-grid;place-items:center;background:var(--accent);color:white;border-radius:9px;width:36px;height:36px;font-size:14px;letter-spacing:.02em}.brand small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-weight:500}.nav{display:grid;gap:5px;margin-top:38px}.nav a{padding:9px 12px;border-radius:7px;text-decoration:none;color:var(--muted);font-size:14px}.nav a[aria-current],.nav a:hover{background:var(--soft);color:var(--accent)}.nav span{display:inline-block;width:24px;color:#768880;font-size:11px}.sidebar-bottom{margin-top:auto;padding-top:28px;font-size:12px;color:var(--muted)}.sidebar-bottom a{display:block;margin-top:8px}.shell{margin-left:var(--nav)}main{max-width:1180px;margin:auto;padding:46px 54px 80px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}.crumb{font-size:12px;color:var(--muted);margin-bottom:42px}.hero{padding-bottom:48px;border-bottom:1px solid var(--line)}.hero p.lead{font-size:19px;max-width:720px;color:var(--muted)}.hero h1 em{font-style:normal;color:var(--accent)}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);background:var(--white);border-radius:8px;padding:11px 17px;font-weight:650;font-size:14px;color:var(--ink);text-decoration:none;line-height:1.5}.btn.primary{background:var(--accent);border-color:var(--accent);color:white}.btn:hover{filter:brightness(.96);text-decoration:none}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:35px}.fact{border-left:2px solid var(--line);padding-left:15px}.fact strong{display:block;font-size:22px;font-weight:700;line-height:1.2}.fact small{color:var(--muted);font-size:12px}.section{padding:55px 0;border-bottom:1px solid var(--line);scroll-margin-top:26px}.section-intro{max-width:760px;color:var(--muted);margin-bottom:26px}.section-label{font:650 12px/1.4 system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:13px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.card{border:1px solid var(--line);background:white;border-radius:var(--radius);padding:24px;min-width:0}.card p:last-child{margin-bottom:0}.muted{color:var(--muted)}.small{font-size:13px}.tag{display:inline-block;font-size:11px;line-height:1.4;font-weight:650;border:1px solid var(--line);border-radius:30px;padding:4px 9px;letter-spacing:.01em;color:var(--muted);margin-bottom:12px}.tag.green{color:var(--accent);background:var(--soft);border-color:transparent}.tag.orange{color:#963b19;background:var(--orange-soft);border-color:transparent}.callout{padding:20px 23px;border-left:3px solid var(--accent);background:var(--soft);border-radius:0 10px 10px 0;margin:22px 0}.callout p:last-child{margin-bottom:0}.callout.warn{background:var(--orange-soft);border-color:var(--orange)}.flow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:25px}.flow .card{padding:19px}.flow strong{display:block;margin:7px 0}.flow .step{font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.09em}.progress-card{background:var(--ink);color:white;padding:23px 27px;border-radius:var(--radius);margin:24px 0}.progress-title{display:flex;gap:16px;justify-content:space-between;align-items:center}.progress-card p{font-size:12px;margin:8px 0 0;color:#d6e3dc}progress{width:100%;height:8px;border:0;border-radius:8px;overflow:hidden;background:#46605f;accent-color:#a6d9b4;margin-top:15px}progress::-webkit-progress-bar{background:#46605f}progress::-webkit-progress-value{background:#a6d9b4}details{border:1px solid var(--line);border-radius:12px;background:white;margin:10px 0;overflow:hidden}summary{padding:19px 22px;cursor:pointer;font-weight:650;list-style:none;display:flex;align-items:center;gap:14px}summary::-webkit-details-marker{display:none}summary::after{content:'+';margin-left:auto;font-weight:400;font-size:23px;color:var(--accent)}details[open]>summary::after{content:'−'}details[open]>summary{border-bottom:1px solid var(--line)}.phase-num{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;background:var(--soft);color:var(--accent);border-radius:50%;font-size:12px}.detail-body{padding:22px 25px}.detail-body ul{padding-left:20px;margin-top:0}.check{display:flex;gap:12px;align-items:flex-start;cursor:pointer;margin:12px 0;line-height:1.5}.check input{width:19px;height:19px;margin-top:3px;flex:0 0 19px;accent-color:var(--accent)}.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:white}table{border-collapse:collapse;width:100%;font-size:14px;text-align:left}th,td{padding:16px 18px;border-bottom:1px solid var(--line);vertical-align:top}thead th{background:#edf1ec;font-size:12px;font-weight:700;white-space:nowrap}tbody tr:last-child>*{border-bottom:0}tbody th{font-weight:650}.date{white-space:nowrap;font-weight:650}.topic-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:20px}input[type=search],select,textarea{border:1px solid #aebeb5;background:white;border-radius:8px;padding:10px 12px;max-width:100%;color:var(--ink)}input[type=search]{min-width:260px;flex:1}textarea{width:100%;min-height:110px;resize:vertical}.topic h3{margin-bottom:12px}.topic p{font-size:14px}.topic .btn{margin-top:8px;font-size:12px}.topic.is-chosen{border:2px solid var(--accent);padding:23px}.empty{padding:20px;border:1px dashed var(--line)}.plan{margin-top:22px}.field{display:grid;gap:6px;margin:16px 0}.field>span{font-size:13px;font-weight:650}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips button{background:white;border:1px solid var(--line);border-radius:8px;padding:9px 14px;font-size:13px;color:var(--ink)}.chips button[aria-pressed=true]{background:var(--accent);color:white;border-color:var(--accent)}.groups{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:20px 0}.group-box{border-radius:9px;text-align:center;padding:17px 3px;font-size:12px;border:1px solid var(--line);background:white}.group-box strong{display:block;font-size:14px}.group-box.train{background:var(--soft);border-color:#92b9a7}.group-box.val{background:#e6edf9;border-color:#a7b9d7}.group-box.test{background:var(--orange-soft);border-color:#d9b9a4}.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--muted)}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}.experiment{background:white;border:1px solid var(--line);border-radius:var(--radius);padding:26px;margin-top:18px}.experiment .versus{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0}.variant{border:1px solid var(--line);border-radius:10px;padding:20px;background:#fafbf8}.variant strong{display:block;font-size:24px;margin-top:9px}.gradebar{display:flex;min-height:62px;border-radius:11px;overflow:hidden;margin:22px 0}.gradebar div{padding:12px 8px;text-align:center;color:white;font-size:13px;line-height:1.3;min-width:0}.gradebar b{display:block;font-size:20px}.gradebar div:nth-child(1){background:#557567;flex:15}.gradebar div:nth-child(2){background:#216a60;flex:20}.gradebar div:nth-child(3){background:#0c4946;flex:25}.gradebar div:nth-child(4){background:#263b43;flex:40}.skill-row{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:25px;padding:21px 0;border-bottom:1px solid var(--line)}.skill-row h3{font-size:16px;margin-bottom:6px}.skill-row p{font-size:13px;margin-bottom:0}.skill-row select{width:100%;align-self:center;font-size:13px}.skill-row:last-child{border-bottom:0}.resource{display:flex;gap:18px;align-items:flex-start}.resource .resource-icon{background:var(--soft);color:var(--accent);padding:7px 11px;border-radius:7px;font-size:16px}.resource a{font-weight:650}.resource p{font-size:13px;margin:7px 0 0}.footer{padding:24px 0 0;color:var(--muted);font-size:12px}.footer a{margin-right:18px}[hidden]{display:none!important}.js-only{display:none}.has-js .js-only{display:block}.has-js .js-flex{display:flex}.status{font-size:12px;color:var(--muted);min-height:1.5em}.noscript{background:var(--orange-soft);padding:15px}.print-note{display:none}\n@media(min-width:1500px){main{padding-left:70px;padding-right:70px}}@media(max-width:1050px){:root{--nav:205px}main{padding:35px 28px 60px}.sidebar{padding:27px 16px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.facts{gap:10px}.groups{grid-template-columns:repeat(4,1fr)}.fact strong{font-size:19px}.flow{grid-template-columns:1fr}.flow .card{display:flex;gap:18px;align-items:center}.flow strong{font-size:15px}.flow p{margin:0;font-size:13px}}@media(max-width:720px){html{scroll-padding-top:90px}.sidebar{position:sticky;top:0;width:100%;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:12px 18px;overflow:visible}.brand{font-size:15px}.brand small{font-size:10px}.mark{width:29px;height:29px}.nav{display:flex;overflow-x:auto;gap:4px;margin:10px -8px -3px;padding:0 0 3px}.nav a{flex:0 0 auto;font-size:12px;padding:6px 8px}.nav span{display:none}.sidebar-bottom{display:none}.shell{margin:0}main{padding:25px 20px 50px}.crumb{margin-bottom:28px}h1{font-size:2.8rem}.hero p.lead{font-size:17px}.facts{grid-template-columns:1fr 1fr;row-gap:22px}.section{padding:38px 0;scroll-margin-top:100px}.grid,.grid.two{grid-template-columns:1fr}.card{padding:21px}.skill-row{grid-template-columns:1fr;gap:12px}.skill-row select{width:100%}.experiment{padding:18px}.variant{padding:15px}.variant strong{font-size:19px}.gradebar span{font-size:10px}.gradebar b{font-size:17px}summary{padding:16px 17px;font-size:14px}.detail-body{padding:18px}.groups{gap:5px}.group-box{font-size:11px}.topic-controls input{min-width:0;width:100%}.progress-title{font-size:14px}.table-wrap table{min-width:520px}.hero{padding-bottom:32px}}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{body{background:white;font-size:11px;color:black}.sidebar,.actions,.chips,.topic-controls,.topic .btn,.js-only,.js-flex,.skip,.footer button,.progress-card{display:none!important}.shell{margin:0}main{max-width:none;padding:0}.section{padding:20px 0;break-inside:auto}h1{font-size:32px}h2{font-size:23px}h3{font-size:15px}.hero{padding-bottom:20px}.crumb{margin-bottom:12px}.grid{grid-template-columns:repeat(2,1fr)}.card,details,.skill-row{break-inside:avoid}.table-wrap{overflow:visible}.table-wrap table{min-width:0}th,td{padding:8px}.print-note{display:block}.topic[hidden],[data-experiment][hidden]{display:block!important}.btn{padding:4px;border:0}.detail-body{display:block!important}.gradebar{print-color-adjust:exact;-webkit-print-color-adjust:exact}.skill-row select{appearance:none;border:0;font-size:11px}.callout{background:#f3f3f3}.check input{width:12px;height:12px}a{color:black}.plan textarea{min-height:50px}}\n\n/* Focused views: one project area at a time; all information remains printable. */\n.overview-path{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:32px 0 18px}.overview-path a{display:grid;gap:9px;padding:24px;background:white;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink)}.overview-path b{font-size:30px;color:var(--accent);font-weight:500}.overview-path strong{font-size:19px}.overview-path span,.overview-note{font-size:13px;color:var(--muted)}.topic-icon{display:block;font-size:30px;margin-bottom:12px}.topic details{border:0;border-top:1px solid var(--line);border-radius:0}.topic summary{padding:10px 0;font-size:12px}.topic details p{padding:8px 0}.skill-row details{border:0;margin:3px 0 0}.skill-row summary{padding:3px 0;font-size:12px;color:var(--muted)}.skill-row .detail-body{padding:8px 0}.section{padding-top:10px;border-bottom:0}.hero{border:0}.crumb{margin-bottom:25px}.section-intro{font-size:17px}.footer{border-top:1px solid var(--line);margin-top:25px}.has-js .view-hidden{display:none}.section:focus,.hero:focus{outline:none}\n@media(max-width:720px){.overview-path{grid-template-columns:1fr;gap:9px}.overview-path a{grid-template-columns:35px 1fr;padding:15px;gap:4px 12px}.overview-path b{grid-row:span 2;font-size:25px}.overview-path strong{font-size:16px}.overview-path span{grid-column:2}.section{padding-top:5px}.hero h1{font-size:2.3rem}}\n@media print{.has-js .view-hidden{display:block!important}.overview-path{grid-template-columns:repeat(3,1fr)}.overview-path a{padding:12px}.topic details p{display:block}.section{padding-top:22px}}\n\n.course-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:38px}.course-card{display:block;position:relative;min-height:205px;padding:25px 28px;background:#fff;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink)}.course-card:hover{border-color:var(--accent);box-shadow:0 6px 24px #193d2810}.course-card>b{position:absolute;right:25px;top:24px;font-size:27px;color:#7e9990}.course-card h3{font-size:24px;margin:13px 0 10px}.course-card p{font-size:14px;color:var(--muted);margin-right:18px}.course-arrow{position:absolute;bottom:20px;right:25px;color:var(--accent)}.lesson-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:28px 0}.lesson-steps article{border-top:3px solid var(--accent);background:white;padding:20px;border-radius:0 0 12px 12px}.lesson-steps b{display:block;margin-bottom:10px}.lesson-steps p{font-size:14px;margin:0;color:var(--muted)}.concept,.concept div{border:2px solid #558b7c;border-radius:14px;padding:22px;background:#e5f2ed}.concept div{margin-top:18px;background:#cbe6dc}.concept div div{background:#b0d6c8}.concept small{display:block;font-size:14px;font-weight:400}.process{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:28px 0;padding:22px;background:var(--soft);border-radius:14px;font-size:16px;text-align:center}.process span{flex:1}.answer{padding:20px;background:white;border:1px solid var(--line);border-radius:12px}.field textarea{resize:vertical;min-height:95px}.subnav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}.lab-panel{border:1px solid #b4c9c0;border-radius:14px;overflow:hidden;background:white;margin:26px 0}.lab-head{display:flex;align-items:center;gap:14px;padding:12px 16px;background:#e7f1eb;font-size:13px}.lab-head>span{margin-left:auto;font-size:12px}.compact{padding:6px 10px;font-size:12px}.lab-panel iframe{display:block;width:100%;height:680px;border:0;background:white}.lab-panel>p{padding:12px 18px;margin:0}.lab-panel:fullscreen{border:0;overflow:auto}.lab-panel:fullscreen iframe{height:calc(100vh - 65px)}.studio-frame{display:block;width:100%;height:800px;border:0}.completion{font-size:11px;color:var(--accent);margin-left:auto;font-weight:400}.memory-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}.memory-card{min-height:120px;border-radius:12px;border:1px solid #becdc6;background:var(--accent);color:white;font-size:16px;padding:15px}.memory-card.revealed{background:var(--soft);color:var(--ink)}.memory-card.matched{background:#f0f3ef;color:var(--muted);border-style:dashed}.generated-text{padding:20px;background:var(--soft);border-radius:10px;font-size:22px;min-height:90px}.attachment-list{list-style:none;padding:0}.attachment-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding:9px 0;font-size:13px;overflow-wrap:anywhere}.attachment-list button{flex-shrink:0}.journal-step summary{flex-wrap:wrap}#journal h1,#sicherung h1{font-size:clamp(2.2rem,4.5vw,3.7rem)}main{max-width:1300px}.sidebar-bottom #portal-save-status{line-height:1.5}.section .field textarea{width:100%}textarea,input[type=file]{max-width:100%}#download-status{font-size:14px}.save-error{color:#973b1b!important}.journal-step .detail-body{padding-top:8px}\n@media(max-width:800px){.lesson-steps{grid-template-columns:1fr}.course-grid{grid-template-columns:1fr}.course-card{min-height:165px}.process{flex-wrap:wrap;font-size:13px;padding:14px}.process span{min-width:60px}.lab-head{flex-wrap:wrap;gap:8px}.lab-head>span{margin-left:0}.lab-panel iframe{height:620px}.memory-board{grid-template-columns:repeat(2,minmax(0,1fr))}.memory-card{font-size:14px}.concept,.concept div{padding:15px}.studio-frame{height:700px}}\n@media print{.lab-panel,iframe,.memory-board,.subnav,#sicherung{display:none!important}.course-grid{grid-template-columns:1fr 1fr}.course-card{min-height:0;padding:10px}.lesson-steps{grid-template-columns:repeat(3,1fr)}.field textarea{border:0}}\n\n.table-scroll{max-width:100%;overflow-x:auto;margin:24px 0;border:1px solid var(--line);border-radius:12px;background:white}.rubric{width:100%;min-width:1000px;border-collapse:collapse;font-size:13px;line-height:1.5}.rubric caption{padding:16px;text-align:left;font-weight:700}.rubric th,.rubric td{padding:14px;vertical-align:top;border:1px solid var(--line);text-align:left}.rubric thead{background:var(--soft)}.rubric tbody th{min-width:170px}.rubric th small{display:block;color:var(--muted);font-weight:400;margin-top:5px}.rubric select{min-width:55px}.grade-calculator output{display:block;padding:18px;background:var(--soft);border-radius:10px;font-size:20px;font-weight:700}#lernziele .card h2{font-size:22px}#lernziele li{margin:12px 0}@media print{.table-scroll{overflow:visible}.rubric{min-width:0;font-size:9px}.rubric th,.rubric td{padding:5px}.rubric tbody th{min-width:0}}\n\n/* Dated AVIVA plans: short summaries first, detailed actions on demand. */\n.lesson-plan summary{gap:12px;font-size:14px}\n.lesson-plan summary>span:nth-child(2){flex:1}\n.lesson-plan summary small{white-space:nowrap;color:var(--muted);font-weight:400}\n.lesson-plan summary::after{margin-left:0}\n.lesson-question{font-size:19px;line-height:1.5;color:var(--accent)}\n.lesson-motivation{font-size:15px;line-height:1.55;margin:.2em 0 1em}\n.lesson-recap{font-size:15px;line-height:1.55;margin:.2em 0 1em;padding:.5em .9em;border-left:3px solid var(--accent);background:rgba(127,127,127,.08)}\n.lesson-phases{list-style:none;padding:0!important;margin:0 0 20px}\n.lesson-phases li{display:grid;grid-template-columns:65px 1fr;gap:15px;padding:14px 0;border-top:1px solid var(--line)}\n.phase-time{font-size:12px;font-weight:700;color:var(--accent);padding-top:3px}\n.lesson-phases strong{font-size:14px}.lesson-phases p{font-size:14px;margin:5px 0 0}\n.wer-legende{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px;font-size:12px}.wer-legende span{padding:3px 10px;border-radius:999px;border:1px solid var(--line)}\n.phase-table-wrap{overflow-x:auto;margin:0 0 20px}.phase-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}\n.phase-table th,.phase-table td{padding:9px 11px;border-top:1px solid var(--line);vertical-align:top;text-align:left}\n.phase-table thead th{font-size:12px;text-transform:none;color:var(--muted);border-top:0}\n.phase-table th.phase{width:132px;background:white;font-size:14px}.phase-table th.phase small{display:block;font-weight:400;color:var(--muted);font-size:12px;margin-top:2px}\n.phase-table td.wer{width:118px;font-weight:700;font-size:13px}.phase-table td.min{width:44px;text-align:right;color:var(--muted);white-space:nowrap}\n.wer-l{background:#e3edfb}.wer-e{background:#fdf0d8}.wer-t{background:#e1f2e6}.wer-k{background:#ece6f6}.wer-r{background:#f1f3f4}\ntr.wer-r td.was{font-style:italic}tr.wer-r td.wer{color:var(--muted)}\ntr.wer-l td.wer{color:#1f4e8c}tr.wer-e td.wer{color:#8a5a00}tr.wer-t td.wer{color:#1f6b3a}tr.wer-k td.wer{color:#5b3a8c}\n.phase-table tr.wer-l td,.phase-table tr.wer-e td,.phase-table tr.wer-t td,.phase-table tr.wer-k td,.phase-table tr.wer-r td{background:inherit}\n.lesson-product{background:var(--soft);border-radius:8px;padding:14px;font-size:14px;margin-bottom:0}\n.concept-figure{margin:24px 0;background:white;border:1px solid var(--line);border-radius:16px;padding:20px;text-align:center}\n.concept-figure img{display:block;width:100%;max-width:700px;height:auto;margin:auto}\n.concept-figure figcaption{max-width:610px;margin:15px auto 0;color:var(--muted);font-size:13px}\n#sicherung.project-transfer{margin:34px 0;padding:28px;background:var(--soft);border-top:5px solid var(--accent)}\n.project-transfer-actions{display:grid;gap:18px;margin:24px 0}\n.project-transfer-primary{display:flex;flex-wrap:wrap;gap:10px;align-items:center}\n.project-transfer-primary #download-backup{min-height:52px;padding:13px 22px;font-size:17px;font-weight:700}\n.project-submission-action{display:flex;flex-wrap:wrap;align-items:center;gap:12px;border-top:1px solid var(--line);padding-top:15px}\n.project-submission-action p{margin:0}\n.external-map{margin:24px 0;background:white;border:1px solid var(--line);border-radius:8px;padding:10px}\n.external-map iframe{display:block;width:100%;height:680px;border:0;background:white}\n.external-map figcaption{padding:12px 8px 4px;color:var(--muted);font-size:13px}\n.learning-example-links{display:grid;gap:7px;margin-top:12px}\n.learning-example-links a{font-size:13px;font-weight:650}\n.learning-system-overview{margin:24px 0 32px}\n.learning-system-overview>.grid{margin:14px 0}\n.learning-system-overview .card h3{font-size:18px}\n.learning-system-overview .card a{font-size:13px;font-weight:650}\n.learning-system-figure{margin:18px 0}\n.learning-system-figure img{max-height:300px}\n.learning-system-figure figcaption{max-width:720px}\n.group-memory-instructions{margin:0 0 18px;padding:15px 18px;border-left:3px solid var(--accent);background:var(--soft)}\n.group-memory-instructions p{margin:0 0 10px;font-size:14px}\n.group-memory-instructions ol{margin:0 0 10px;padding-left:22px}\n.group-memory-instructions li{margin:7px 0;font-size:13px;line-height:1.5}\n.memory-round{margin:20px 0;padding:16px 18px;border:1px solid var(--line);border-radius:12px}\n.memory-round h3{font-size:18px;margin:0 0 8px}\n.learning-example-note{margin:7px 0 0!important;font-size:11px!important;line-height:1.45;color:var(--muted)}\n.learning-path-intro{padding:14px 10px 2px}\n.learning-path-intro h2,.turing-activity h2{font-size:22px;margin-bottom:8px}\n.learning-path-intro p{margin-bottom:14px;color:var(--muted)}\n.turing-activity{margin:24px 0;padding:20px 22px;border-left:4px solid var(--orange);background:var(--orange-soft)}\n.turing-activity p{margin-bottom:12px}\n@media(max-width:720px){.lesson-plan summary{flex-wrap:wrap}.lesson-plan summary small{display:none}.phase-table{font-size:13px}.phase-table th.phase{width:90px}.phase-table td.wer{width:84px}.concept-figure{padding:15px}}\n@media(max-width:720px){.external-map{padding:6px}.external-map iframe{height:620px}}\n@media(max-width:720px){#sicherung.project-transfer{padding:22px 17px}.project-transfer-primary{display:grid;grid-template-columns:1fr}.project-transfer-primary .btn{width:100%;text-align:center}.project-submission-action{align-items:flex-start;flex-direction:column}}\n\n.nav span{width:38px}\n.task{background:var(--soft);border-left:4px solid var(--accent);border-radius:0 8px 8px 0;padding:12px 16px;margin:16px 0}\n.typen{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}.typen th,.typen td{padding:10px 12px;border-top:1px solid var(--line);text-align:left;vertical-align:top}\n.typen thead th{font-size:12px;color:var(--muted);border-top:0}.typen tbody th{width:190px;background:var(--soft)}\n.timeline{list-style:none;margin:18px 0;padding:0;border-left:3px solid var(--line)}\n.timeline li{display:grid;grid-template-columns:104px 1fr;gap:14px;position:relative;padding:8px 0 14px 18px}\n.timeline li::before{content:\"\";position:absolute;left:-9px;top:14px;width:15px;height:15px;border-radius:50%;background:white;border:3px solid var(--accent)}\n.timeline .jahr{font-weight:700;color:var(--accent);font-size:14px}.timeline p{margin:4px 0 0;font-size:14px}\n.marke{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;vertical-align:middle}\n/* Both courses: high-contrast blue versus burnt orange; never theme-tint these categories. */\n.marke.regeln{background:#1e40af;color:#fff}.marke.daten{background:#9a3412;color:#fff}\n@media(max-width:720px){.timeline li{grid-template-columns:1fr;gap:2px}.typen tbody th{width:auto}}\n\n/* Layout: Netz im Hintergrund, ruhigere Marke, lebendigere Karten */\nbody{background:radial-gradient(1200px 600px at 85% -10%,#e7f1eb 0,transparent 60%) no-repeat fixed,var(--paper)}\nbody::before{content:\"\";position:fixed;top:0;right:0;width:min(58vw,860px);aspect-ratio:1;background:url(grafiken/netz_hintergrund.svg) right top/100% 100% no-repeat;opacity:.17;-webkit-mask-image:linear-gradient(225deg,#000 35%,transparent 80%);mask-image:linear-gradient(225deg,#000 35%,transparent 80%);pointer-events:none;z-index:0}\n.shell{position:relative;z-index:1}\nbody .sidebar{background:linear-gradient(180deg,#fff 0,#f7faf7 100%)}\nbody .sidebar .brand{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:12px;font-size:17px;line-height:1.15;letter-spacing:-.015em}\nbody .sidebar .brand .mark{width:42px;height:42px;border-radius:12px;background:linear-gradient(145deg,#0a8a74,#054f43)}\nbody .sidebar .brand .mark svg{width:26px;height:26px;display:block}\nbody .sidebar .brand small{margin-top:5px;font-size:10.5px;letter-spacing:.12em}\nbody .nav{gap:2px;margin-top:34px}\nbody .nav a{border-left:3px solid transparent;border-radius:0 8px 8px 0;padding:9px 12px 9px 11px;transition:color .15s,border-color .15s}\nbody .nav a[aria-current],body .nav a:hover{border-left-color:var(--accent)}\n.hero h1{letter-spacing:-.03em}\n.course-card{background:rgba(255,255,255,.94);border-radius:18px;transition:transform .18s,box-shadow .18s,border-color .18s;overflow:hidden}\n.course-card::before{content:\"\";position:absolute;left:0;top:0;width:100%;height:4px;background:linear-gradient(90deg,var(--accent),#5fb39f);opacity:0;transition:opacity .18s}\n.course-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px #193d2818}\n.course-card:hover::before{opacity:1}\n.course-arrow{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--soft);transition:background .18s,color .18s}\n.course-card:hover .course-arrow{background:var(--accent);color:#fff}\n@media(max-width:720px){body .sidebar .brand{grid-template-columns:auto 1fr}body .sidebar .brand .mark{width:32px;height:32px}body .sidebar .brand .mark svg{width:20px;height:20px}}\n@media(prefers-reduced-motion:reduce){.course-card,.course-arrow{transition:none}.course-card:hover{transform:none}}\n@media print{body::before{display:none}}\n\n.crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:36px;font-size:12.5px;letter-spacing:.02em}\n.crumb span{display:inline-flex;align-items:center;gap:8px;color:var(--muted)}\n.crumb span+span::before{content:\"\";width:5px;height:5px;border-top:1.6px solid #9bb0a8;border-right:1.6px solid #9bb0a8;transform:rotate(45deg);margin-right:3px}\n.crumb span:first-child{font-weight:650;text-transform:uppercase;letter-spacing:.1em;font-size:11px;color:var(--ink)}\n.crumb .school-logo{display:block;height:22px;width:auto;border-radius:3px}\n.crumb span:last-child{color:var(--accent);font-weight:650;background:var(--soft);border-radius:30px;padding:3px 11px}\n.phase-table th.phase strong{display:block}.phase-table .phase-titel{display:block;margin-top:3px;font-size:12.5px;font-weight:500;line-height:1.35;color:var(--muted)}\n.learning-system-overview .card>a{display:inline-block;margin:4px 0 16px}.learning-system-overview .card ol{padding-left:20px;margin:6px 0 14px}.learning-system-overview .card ol li{margin-bottom:6px}\n.neuron-figure img{max-width:900px}\n\n/* Navigation einklappen */\n:root{--nav-full:244px}@media(max-width:1050px){:root{--nav-full:205px}}\n.nav-toggle{position:fixed;top:24px;left:calc(var(--nav) - 16px);z-index:6;width:32px;height:32px;padding:0;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:#fff;color:var(--accent);font:22px/1 system-ui;cursor:pointer;box-shadow:0 2px 8px #193d2818;transition:left .22s,background .15s}\n.nav-toggle:hover{background:var(--soft)}\n@media(min-width:721px){.sidebar{transition:transform .22s}.shell{transition:margin-left .22s}}\n@media(min-width:721px){body.nav-collapsed{--nav:0px}body.nav-collapsed .sidebar{width:var(--nav-full);transform:translateX(-100%);visibility:hidden;transition:transform .22s,visibility 0s .22s}body.nav-collapsed .nav-toggle{left:12px}}\n@media(max-width:720px){.nav-toggle{display:none}}\n@media(prefers-reduced-motion:reduce){.nav-toggle,.sidebar,.shell{transition:none!important}}\n@media print{.nav-toggle{display:none}}\n@media(min-width:721px){body.nav-collapsed .crumb{padding-left:44px}}\n.typen td textarea{min-width:200px;font-size:13px}\n\n/* Kapitel (einklappbare Unterkapitel einer Doppellektion) */\n.kapitel{margin:26px 0;overflow:visible;background:rgba(255,255,255,.92)}\n.kapitel>summary{padding:16px 24px;gap:16px}\n.kapitel>summary .kapitel-nr{flex:0 0 34px;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font:700 15px/1 system-ui}\n.kapitel>summary h2{margin:0;font-size:1.3rem;line-height:1.25;font-weight:700}\n.kapitel>.kapitel-body{padding:6px 26px 26px}\n.kapitel>.kapitel-body>:first-child{margin-top:16px}\n.nav-sub{display:grid;gap:1px;margin:2px 0 10px 22px;padding-left:8px;border-left:2px solid var(--line)}\nbody .nav .nav-sub a{padding:5px 10px;border-left-width:0;border-radius:6px;font-size:12.5px;line-height:1.35}\n.nav-sub a span{width:18px;font-size:11px}\n@media(max-width:720px){.nav-sub{display:none}.kapitel>summary{padding:13px 16px}.kapitel>.kapitel-body{padding:4px 16px 18px}.kapitel>summary h2{font-size:1.1rem}}\n@media print{.nav-sub{display:none}.kapitel{border:0}}\n\n.lesson-steps.single{grid-template-columns:1fr}\n.kapitel .lesson-steps.single article>b{display:none}\n.kapitel .lesson-steps.single article{border:0;padding:0;background:none;box-shadow:none}\n.kapitel .turing-activity{margin:0}\n\n.kapitel-uebersicht{margin:22px 0 8px}\n.kapitel-uebersicht-kopf{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}\n.kapitel-uebersicht-kopf p{margin:0;font:650 12px/1.4 system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}\n.kapitel-karten{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}\n.kapitel-karte{display:flex;gap:13px;align-items:flex-start;padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.94);color:var(--ink);text-decoration:none;transition:border-color .15s,box-shadow .15s,transform .15s}\n.kapitel-karte:hover{border-color:var(--accent);box-shadow:0 8px 22px #193d2814;transform:translateY(-2px)}\n.kapitel-karte .kapitel-nr{flex:0 0 30px;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font:700 14px/1 system-ui}\n.kapitel-karte-text{display:grid;gap:3px;font-size:13px;line-height:1.45;color:var(--muted)}\n.kapitel-karte-text b{font-size:14.5px;line-height:1.3;color:var(--ink)}\n@media(max-width:720px){.kapitel-karten{grid-template-columns:1fr}}\n@media(prefers-reduced-motion:reduce){.kapitel-karte{transition:none}.kapitel-karte:hover{transform:none}}\n@media print{.kapitel-uebersicht{display:none}}\n\ninput[type=text]{border:1px solid #aebeb5;background:#fff;border-radius:8px;padding:8px 10px;max-width:100%;color:var(--ink)}\n.protokoll input[type=text]{width:100%;min-width:70px;max-width:150px}\n.protokoll select{max-width:240px;font-size:13px;padding:8px 10px}\n.protokoll-block{margin-top:26px;padding:16px 18px;border:1px solid var(--line);border-radius:12px}\n.protokoll-block h3{margin:0 0 6px;font-size:18px}\n.protokoll-block h4{margin:18px 0 6px;font-size:15px}\n.protokoll input.breit{max-width:none;min-width:160px}\n.protokoll td textarea{min-width:260px}\n\n/* Tandemprojekt: vier gut lesbare Schritte, eingefrorenes vs. trainiertes Netz. */\n.project-train-overview{margin:23px 0 25px;padding:20px 22px;background:#fff;border:1px solid var(--line);border-radius:14px}\n.project-train-overview h2{font-size:1.22rem;letter-spacing:-.01em;margin:0 0 17px}\n.project-train-flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;list-style:none;margin:0;padding:0}\n.project-train-flow li{position:relative;min-width:0;padding:13px;background:#f6f8f6;border:1px solid var(--line);border-radius:10px}\n.project-train-flow li+li::before{content:\"→\";position:absolute;left:-19px;top:calc(50% - .75em);font-size:19px;font-weight:750;color:var(--accent)}\n.project-train-flow strong{display:block;font-size:14px;line-height:1.3;margin-bottom:7px}\n.project-train-flow span{display:block;font-size:12px;line-height:1.5;color:var(--muted)}\n.project-train-flow em{display:inline-block;margin-top:10px;padding:3px 7px;border-radius:6px;background:#e8ebe9;color:#435d58;font:700 11px/1.4 system-ui}\n.project-train-flow .model-trained{border:2px solid var(--accent);background:var(--soft);padding:12px}\n.project-train-flow .model-trained em{background:var(--accent);color:#fff}\n.project-train-note{margin:14px 0 0;font-size:13px;line-height:1.5;color:var(--muted)}\n@media(max-width:1050px){\n  .project-train-flow{grid-template-columns:minmax(0,1fr);gap:20px}\n  .project-train-flow li+li::before{content:\"↓\";top:-24px;left:50%;transform:translateX(-50%)}\n}\n@media(max-width:500px){.project-train-overview{padding:16px}.project-train-overview h2{font-size:1.1rem}}\n\n/* One loader shared by all embedded notebooks, including restored projects. */\n.lab-frame-shell{position:relative;min-width:0}\n.lab-loading:not([hidden]){position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;background:#f8fbf9;text-align:center;color:var(--ink)}\n.lab-loading[hidden],.lab-loading button[hidden]{display:none!important}\n.lab-loading p{margin:0;max-width:36rem;font-size:15px;font-weight:600;line-height:1.55}\n.lab-loading-spinner{width:46px;height:46px;border:4px solid #d0e2d9;border-top-color:var(--accent);border-radius:50%;animation:ki-notebook-loading .85s linear infinite}\n.lab-loading[data-state=\"error\"] .lab-loading-spinner{display:none}\n@keyframes ki-notebook-loading{to{transform:rotate(360deg)}}\n@media(prefers-reduced-motion:reduce){.lab-loading-spinner{animation:none;border-top-color:var(--accent);border-right-color:var(--accent)}}\n\n/* KI-Glossar: gleicher Aufbau in beiden Kursen, Farben aus der jeweiligen Palette. */\n.glossary{max-width:1050px}\n.glossary-search-label{display:block;font-weight:700;margin:18px 0 6px}\n.glossary [data-glossary-search]{display:block;width:100%;max-width:580px;min-height:45px;border:1px solid var(--line);border-radius:9px;padding:9px 13px;background:#fff;color:var(--ink)}\n.glossary-group{margin:30px 0}\n.glossary-group h2{font-size:1.6rem;margin-bottom:14px}\n.glossary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}\n.glossary-entry{background:#fff;border:1px solid var(--line);border-radius:13px;padding:18px 20px;min-width:0;scroll-margin-top:25px}\n.glossary-entry h3{font-size:1.14rem;color:var(--accent);margin-bottom:9px}\n.glossary-entry p{font-size:14px;line-height:1.6;margin:0 0 9px}\n.glossary-entry p:last-child{margin-bottom:0}\n.glossary-example{padding-top:8px;border-top:1px solid var(--line)}\n\n/* Self-check is one calm panel, not a second accordion card within a card.\n   Override the course-wide details/summary borders, padding and + marker. */\n.glossary-selfcheck{margin-top:15px;padding:14px 16px 8px;background:#f8faf9;background:color-mix(in srgb,var(--soft) 48%,#fff);border:1px solid var(--line);border-radius:12px}\n.glossary-entry .glossary-question{display:grid;gap:4px;margin:0;color:var(--ink);line-height:1.5}\n.glossary-question-label{display:block;font-size:11px;line-height:1.35;font-weight:800;letter-spacing:.085em;text-transform:uppercase;color:var(--accent)}\n.glossary-question-text{font-size:14px;font-weight:550;overflow-wrap:anywhere}\n.glossary-selfcheck>details.glossary-answer{margin:0;border:0;border-radius:0;background:transparent;overflow:visible}\n.glossary-answer>summary{display:flex;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:44px;margin:10px 0 0;padding:10px 0 0;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;color:var(--accent);font-size:14px;font-weight:700;line-height:1.4;list-style:none;cursor:pointer}\n.glossary-answer>summary::-webkit-details-marker{display:none}\n.glossary-answer>summary::after,.glossary-answer[open]>summary::after{content:none}\n.glossary-answer[open]>summary{border-top:1px solid var(--line);border-bottom:0}\n.glossary-answer>summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:5px}\n.glossary-answer>summary:hover{color:var(--ink)}\n.glossary-answer-hide{display:none}\n.glossary-answer[open] .glossary-answer-show{display:none}\n.glossary-answer[open] .glossary-answer-hide{display:inline}\n.glossary-answer-icon{width:28px;height:28px;margin-left:auto;flex:none;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:white;color:var(--accent)}\n.glossary-answer-icon::before{content:\"\";display:block;width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-2px) rotate(45deg);transition:transform .16s ease}\n.glossary-answer[open] .glossary-answer-icon::before{transform:translateY(2px) rotate(225deg)}\n.glossary-answer>summary:hover .glossary-answer-icon{border-color:var(--accent)}\n.glossary-answer-content{margin:8px 0 6px;padding:11px 13px;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;background:#fff}\n.glossary-answer-content p{margin:0;color:var(--ink);line-height:1.6;overflow-wrap:anywhere}\n\n.glossary-related{font-size:14px;line-height:1.6;color:var(--muted);margin:12px 0 18px}\n.glossary-related a{color:var(--accent);font-weight:600;text-underline-offset:3px}\na[href^=\"#glossar-\"]:not(.nav a),a[href^=\"#basis-glossar-\"]:not(.nav a){text-decoration-style:dotted;text-underline-offset:4px}\n.glossary-dialog{position:relative;box-sizing:border-box;overflow-y:auto;border:1px solid var(--line);border-radius:16px;width:min(540px,calc(100vw - 24px));max-height:85vh;padding:27px 28px;background:#fff;color:var(--ink);box-shadow:0 18px 55px #182b3140}\n.glossary-dialog::backdrop{background:#182b3180}\n.glossary-dialog .glossary-entry{border:0;padding:0}\n.glossary-dialog .glossary-entry h3{padding-right:46px}\n.glossary-close{position:absolute;top:17px;right:17px;display:grid;place-items:center;border:1px solid var(--line);background:var(--soft);color:var(--accent);font-size:22px;line-height:1;border-radius:9px;width:38px;height:38px;padding:0}\n.glossary-close:hover{border-color:var(--accent)}\n.glossary-close:focus-visible{outline:2px solid var(--accent);outline-offset:3px}\n.glossary-empty{padding:20px;background:#fff;border:1px dashed var(--line);border-radius:12px}\n@media(max-width:720px){.glossary-grid{grid-template-columns:1fr}.glossary-group h2{font-size:1.3rem}.glossary-entry{scroll-margin-top:100px}.glossary-selfcheck{padding:13px 14px 7px}.glossary-dialog{padding:22px 18px}.glossary-close{top:12px;right:12px}}\n@media(prefers-reduced-motion:reduce){.glossary-answer-icon::before{transition:none}}\n@media print{.glossary-dialog{display:none!important}.glossary-entry{break-inside:avoid}.glossary [data-glossary-search]{display:none}}\n\n\n/* DL1 – dieselbe interaktive KI-Zeitleiste in beiden Klassen.\n   Die Bilder bleiben bis zur Dialogöffnung in HTML-Templates verborgen. */\n.timeline .milestone-trigger{display:inline-flex;align-items:center;gap:7px;max-width:100%;border:0;border-radius:5px;background:transparent;padding:2px 4px 3px 0;color:var(--accent);font-size:inherit;line-height:1.4;font-weight:800;text-align:left;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:4px;cursor:pointer}\n.timeline .milestone-trigger:hover{text-decoration-style:solid;color:var(--ink)}\n.timeline .milestone-trigger:focus-visible{outline:3px solid var(--accent);outline-offset:3px}\n.milestone-trigger-icon{font-size:.85em;opacity:.7}\n.milestone-dialog{box-sizing:border-box;position:fixed;inset:0;width:min(740px,calc(100vw - 26px));max-height:min(88vh,900px);overflow-y:auto;margin:auto;padding:30px 32px;border:1px solid var(--line);border-radius:18px;background:white;color:var(--ink);box-shadow:0 25px 65px #182b314d}\n.milestone-dialog::backdrop{background:#14242f99}\n.milestone-dialog .milestone-detail-kicker{margin:0 42px 7px 0;color:var(--accent);font-size:12px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}\n.milestone-dialog h2{padding-right:44px;margin:0 0 18px;font-size:clamp(1.55rem,4vw,2.15rem);color:var(--ink)}\n.milestone-dialog figure{margin:0}\n.milestone-dialog figure img{display:block;max-height:390px;width:100%;object-fit:contain;border:1px solid var(--line);border-radius:11px;background:#f5f6f7}\n.milestone-dialog figcaption{font-size:15px;line-height:1.6;margin:14px 0 8px;color:var(--ink)}\n.milestone-dialog .milestone-source{margin:0;font-size:12px;line-height:1.6;color:var(--muted);overflow-wrap:anywhere}\n.milestone-dialog .milestone-source a{color:var(--accent);text-underline-offset:3px}\n.milestone-close{position:absolute;right:17px;top:17px;z-index:1;display:grid;place-items:center;width:40px;height:40px;padding:0;border:1px solid var(--line);border-radius:9px;background:var(--soft);color:var(--accent);font-size:25px;line-height:1;cursor:pointer}\n.milestone-close:hover{border-color:var(--accent)}\n.milestone-close:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n@media(max-width:720px){.milestone-dialog{padding:23px 18px}.milestone-close{right:12px;top:12px}.milestone-dialog figure img{max-height:300px}}\n@media print{.milestone-dialog{display:none!important}.timeline .milestone-trigger{color:inherit;text-decoration:none}}\n\n/* Historical examples are more useful as comparisons than as screenshots\n   of a user interface. Keep both image credits directly below the images. */\n.milestone-dialog .milestone-image-lead,.milestone-dialog .milestone-image-context{font-size:15px;line-height:1.6;margin:0 0 16px}\n.milestone-dialog .milestone-image-context{margin:15px 0 0}\n.milestone-dialog .milestone-art-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}\n.milestone-dialog .milestone-art-grid figure{min-width:0}\n.milestone-dialog .milestone-art-grid figure img{aspect-ratio:1/1;max-height:300px}\n.milestone-dialog .milestone-art-grid figcaption{font-size:13px;font-weight:650;margin:8px 0 4px}\n.milestone-dialog .milestone-art-grid .milestone-source{font-size:11px}\n.timeline-thinking{background:var(--soft);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:13px 16px;line-height:1.6;margin:0 0 20px}\n.timeline-thinking strong{color:var(--accent)}\n@media(max-width:540px){.milestone-dialog .milestone-art-grid{grid-template-columns:1fr;gap:17px}.milestone-dialog .milestone-art-grid figure img{max-height:220px;aspect-ratio:4/3}}\n\n/* DL1 cards use existing blue / green course variables. */\n.ki-sort-task{max-width:990px;margin:22px 0;padding:20px;border:1px solid var(--line);border-radius:16px;background:white}\n.ki-sort-intro{font-size:15px;line-height:1.6;margin:0 0 17px}\n.ki-sort-layout{display:grid;gap:19px}\n.ki-sort-subtitle{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:16px;margin:0 0 10px}\n.ki-sort-subtitle small{font-size:12px;color:var(--muted);font-weight:500}\n.ki-sort-pool,.ki-sort-bin-cards{display:grid;gap:9px;align-content:start}\n.ki-sort-pool{min-height:38px}\n.ki-sort-card{display:grid;grid-template-columns:27px minmax(0,1fr);gap:9px 12px;padding:13px;border:1px solid var(--line);border-radius:11px;background:white;min-width:0;box-shadow:0 2px 8px #203d3710}\n.ki-sort-card[draggable=true]{cursor:grab}\n.ki-sort-card.ki-sort-dragging{opacity:.45}\n.ki-sort-card.ki-sort-selected{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-card-index{width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font-size:13px;font-weight:800}\n.ki-sort-card-text{font-size:14px;line-height:1.5;font-weight:550;overflow-wrap:anywhere}\n.ki-sort-select-label{grid-column:2;display:grid;gap:5px;font-size:12px;color:var(--muted);font-weight:700}\n.ki-sort-card select{width:100%;min-width:0;max-width:100%;min-height:44px;border:1px solid var(--line);border-radius:8px;background:white;color:var(--ink);padding:7px 9px;font:13px/1.4 system-ui;cursor:pointer}\n.ki-sort-card select:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-bins{display:none;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}\n.ki-sort-ready .ki-sort-bins{display:grid}\n.ki-sort-bin{min-width:0;min-height:110px;padding:12px;border:1px dashed var(--line);border-radius:12px;background:var(--soft);background:color-mix(in srgb,var(--soft) 60%,white)}\n.ki-sort-bin h3{font-size:13px;color:var(--accent);line-height:1.4;margin:0 0 10px}\n.ki-sort-bin-cards{min-height:45px}\n.ki-sort-bin-cards:empty::after{content:\"Hier ablegen\";padding:13px 5px;text-align:center;color:var(--muted);font-size:12px}\n.ki-sort-bin .ki-sort-card{padding:10px 9px}\n.ki-sort-drop-active{outline:2px solid var(--accent);outline-offset:2px}\n.ki-sort-card-result{grid-column:2;font-size:12px;font-weight:700;line-height:1.4}\n.ki-sort-card-result:empty{display:none}\n.ki-sort-card[data-ki-sort-result=correct]{border-color:#36845d}\n.ki-sort-card[data-ki-sort-result=correct] .ki-sort-card-result{color:#236044}\n.ki-sort-card[data-ki-sort-result=incorrect]{border-color:#b57933}\n.ki-sort-card[data-ki-sort-result=incorrect] .ki-sort-card-result{color:#955a13}\n.ki-sort-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:18px 0 4px}\n.ki-sort-actions button{min-height:44px;padding:8px 15px;border:1px solid var(--accent);border-radius:9px;font:700 13px/1.4 system-ui;cursor:pointer}\n.ki-sort-actions button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-check{background:var(--accent);color:white}.ki-sort-check:disabled{opacity:.48;cursor:not-allowed}\n.ki-sort-reset{background:white;color:var(--accent)}\n.ki-sort-status{flex-basis:100%;font-size:13px;color:var(--muted);line-height:1.5}\n/* Same panel, divider, toggle and answer surface as the glossary Leitfrage. */\n.ki-sort-task details.ki-sort-help{margin:15px 0 0;padding:14px 16px 8px;border:1px solid var(--line);border-radius:12px;background:#f8faf9;background:color-mix(in srgb,var(--soft) 48%,#fff);overflow:visible}\n.ki-sort-task .ki-sort-help>summary{display:flex;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:44px;margin:0;padding:10px 0 0;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;color:var(--accent);font-size:14px;font-weight:700;line-height:1.4;list-style:none;cursor:pointer}\n.ki-sort-help>summary::-webkit-details-marker{display:none}\n.ki-sort-help>summary::after,.ki-sort-help[open]>summary::after{content:none}\n.ki-sort-help>summary:hover{color:var(--ink)}\n.ki-sort-help>summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:5px}\n.ki-sort-help-hide{display:none}\n.ki-sort-help[open] .ki-sort-help-show{display:none}\n.ki-sort-help[open] .ki-sort-help-hide{display:inline}\n.ki-sort-help-icon{width:28px;height:28px;margin-left:auto;flex:none;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:white;color:var(--accent)}\n.ki-sort-help-icon::before{content:\"\";display:block;width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-2px) rotate(45deg);transition:transform .16s ease}\n.ki-sort-help[open] .ki-sort-help-icon::before{transform:translateY(2px) rotate(225deg)}\n.ki-sort-help>summary:hover .ki-sort-help-icon{border-color:var(--accent)}\n.ki-sort-help>p{margin:8px 0 6px;padding:11px 13px;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;background:#fff;color:var(--ink);font-size:14px;line-height:1.6;overflow-wrap:anywhere}\n@media(prefers-reduced-motion:reduce){.ki-sort-help-icon::before{transition:none}}\n@media(max-width:720px){.ki-sort-task details.ki-sort-help{padding:13px 14px 7px}}\n.ki-sort-reflection{max-width:700px}\n.ki-sort-legacy{margin:22px 0;border:1px solid var(--line);border-radius:12px;background:white}\n.ki-sort-legacy>summary{padding:13px 16px;font-size:14px}\n.ki-sort-legacy-fields{padding:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.ki-sort-legacy>.small{padding:0 16px 12px;margin:0}\n@media(max-width:720px){.ki-sort-task{padding:14px 12px;margin:15px 0}.ki-sort-bins{grid-template-columns:1fr}.ki-sort-legacy-fields{grid-template-columns:1fr}.ki-sort-card[draggable=true]{cursor:auto}}\n";
const COURSE_PREVIEW_CHROME = "\n<a class=\"skip\" href=\"#inhalt\">Zum Inhalt</a>\n<aside class=\"sidebar\"><a class=\"brand\" href=\"#start\"><span aria-hidden=\"true\" class=\"mark\"><svg viewBox=\"0 0 26 26\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.4\" stroke-linecap=\"round\"><path d=\"M4 6l9 -2M4 6l9 8M4 6l9 15M4 20l9 -16M4 20l9 -6M4 20l9 1M13 4l9 9M13 14l9 -1M13 21l9 -8\" opacity=\".7\"/><g fill=\"#fff\" stroke=\"none\"><circle cx=\"4\" cy=\"6\" r=\"2.2\"/><circle cx=\"4\" cy=\"20\" r=\"2.2\"/><circle cx=\"13\" cy=\"4\" r=\"2.2\"/><circle cx=\"13\" cy=\"14\" r=\"2.2\"/><circle cx=\"13\" cy=\"21\" r=\"2.2\"/><circle cx=\"22\" cy=\"13\" r=\"2.6\"/></g></svg></span><span class=\"brand-text\">Künstliche<br/>Intelligenz<small>Informatik</small></span></a>\n<nav aria-label=\"Unterricht\" class=\"nav\"><!-- NAVIGATION --></nav><div class=\"sidebar-bottom\"><a href=\"../kurse.html\">Kursauswahl</a><a href=\"#journal\">✎ Unser Journal</a><a href=\"#sicherung\">Notizen &amp; Projekt</a><p class=\"status\" id=\"portal-save-status\" role=\"status\">Nur in diesem Browser gespeichert.</p></div></aside>\n<div class=\"shell\"><main id=\"inhalt\"><div class=\"crumb\"><span><img alt=\"Logo KST\" class=\"school-logo\" height=\"22\" src=\"grafiken/kst_logo.png\" width=\"44\"/>Kantonsschule Stadelhofen</span><span>Informatik</span><span>Künstliche Intelligenz</span></div>\n";
const BASIS_PREVIEW_CSS = "/* Same KST course layout; blue accent distinguishes the 1st-year course. */\n:root{--accent:#3653a3;--soft:#e9eefc;--paper:#f3f5fb;--line:#d9e0ef;--muted:#46536a}\n.sidebar .mark{background:var(--accent)}\n.course-card:hover,.basis-language-option:hover{border-color:var(--accent)}\n.basis-answer{border-color:var(--line)}\n.basis-answer textarea,.basis-language-lab select{border-color:#9daeca}\n.basis-language-option:hover,.basis-language-option:focus-visible{background:var(--soft)}\n.basis-language-result{background:var(--soft)}\n.concept-figure img{display:block;width:100%;max-width:700px;height:auto;margin-inline:auto}\n.neuron-figure img{max-width:900px}\n.school-logo{display:inline-block;vertical-align:middle;object-fit:contain}\n.crumb>span:first-child{display:inline-flex;gap:9px;align-items:center}\n.basis-network-diagram{display:block;width:100%;max-width:760px;height:auto;margin:auto}\n.basis-network-lab{background:white;border:1px solid var(--line);border-radius:12px;padding:17px;margin:17px 0}\n.basis-network-controls{display:flex;gap:15px;flex-wrap:wrap}\n.basis-network-controls label{background:var(--soft);border:1px solid var(--line);padding:12px 18px;border-radius:9px;cursor:pointer;font-weight:650}\n.basis-network-controls input{accent-color:var(--accent);width:17px;height:17px}\n.basis-network-lab td[data-selected=\"true\"]{background:var(--soft);font-weight:700}\n.basis-hint{background:white}\n.memory-board{max-width:100%}\n.basis-memory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:15px 0}\n.basis-memory-grid button{background:var(--soft);padding:16px 8px;border:1px solid var(--line);border-radius:8px;min-height:72px;font-weight:650;overflow-wrap:anywhere}\n.basis-memory-grid button[data-matched=\"true\"]{background:#dbe7ff;color:#244a8c}\n@media(max-width:720px){.basis-memory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.basis-network-lab{padding:12px}.basis-network-diagram{min-width:0}.basis-network-lab table{font-size:12px}}\n\n/* The base typography and portal components come from the shared project styles. */\n.basis-answer{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px;margin:20px 0}\n.basis-answer label{display:block;font-weight:650;font-size:14px;margin-bottom:9px}\n.basis-answer textarea{display:block;width:100%;min-height:100px;resize:vertical;padding:12px;border:1px solid #9daeca;border-radius:9px}\n.basis-neuron{background:#fff;border:1px solid var(--line);padding:20px;border-radius:12px;margin:24px 0}\n.basis-neuron>label{display:grid;grid-template-columns:minmax(140px,1fr) minmax(80px,2fr) 35px;gap:10px;align-items:center;margin:8px 0}\n.basis-neuron input{width:100%;accent-color:var(--accent)}\n.basis-neuron output{text-align:right;font-variant-numeric:tabular-nums}\n.basis-neuron table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}\n.basis-neuron th,.basis-neuron td{padding:9px 10px;text-align:center;border-bottom:1px solid var(--line)}\n.basis-neuron td[data-on=\"1\"]{color:var(--accent);font-weight:750}\n.basis-hint{padding:14px;border:1px solid var(--line);border-radius:10px;margin:18px 0}\n.course-grid{margin-bottom:40px}.course-card{min-height:155px}\n.section-label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);margin-bottom:13px}\n.section{padding-top:24px}\n.section .lead{max-width:780px;font-size:18px;color:var(--muted)}\n.section details.kapitel{max-width:100%;overflow-wrap:anywhere}\n.crumb{margin-bottom:30px}\n.sidebar-bottom .btn{margin-top:12px;text-align:left;font-size:11px}\n.has-js .basis-view-hidden{display:none!important}\n.nav-sub{display:grid;gap:1px;padding-left:14px;margin-bottom:8px}.nav-sub a{font-size:12px;line-height:1.35;padding:6px 8px}.nav-sub span{margin-right:4px}\n@media(max-width:720px){.basis-neuron>label{grid-template-columns:1fr 50px}.basis-neuron input{grid-column:1 / 2}.basis-neuron output{grid-column:2;grid-row:2}.basis-neuron table{font-size:12px}}\n@media print{.has-js .basis-view-hidden{display:block!important}.sidebar-bottom button{display:none}}\n\n.basis-language-lab{border:1px solid var(--line);background:#fff;border-radius:12px;padding:20px;margin:20px 0;max-width:100%;overflow:hidden}\n.basis-language-lab>label{display:block;font-weight:650;font-size:14px;margin-bottom:6px}\n.basis-language-lab select{display:block;max-width:100%;width:100%;padding:9px;border:1px solid #9daeca;border-radius:8px;font:inherit}\n.basis-language-prompt{margin:18px 0;font-weight:700;font-size:1.1rem;overflow-wrap:anywhere}\n.basis-language-options{display:grid;gap:9px}\n.basis-language-option{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 14px;align-items:center;text-align:left;width:100%;padding:10px 12px;border:1px solid #d9e0ef;border-radius:8px;background:#f7f9ff;font:inherit}\n.basis-language-option:hover,.basis-language-option:focus-visible{border-color:var(--accent);background:#e9eefc}\n.basis-language-option>span:first-child{overflow-wrap:anywhere}\n.basis-language-option strong{font-size:.9rem;font-variant-numeric:tabular-nums}\n.basis-language-bar{grid-column:1/-1;display:block;height:7px;border-radius:99px;background:#d9e3f7;overflow:hidden}\n.basis-language-bar>span{display:block;height:100%;border-radius:99px;background:var(--accent)}\n.basis-language-result{padding:11px 13px;background:#e9eefc;border-radius:8px;margin:16px 0 0;overflow-wrap:anywhere}\n\n/* An active lesson is the only one with an expanded chapter list. */\n.nav-sub[hidden]{display:none!important}\n\n/* First-year colour layer: override the shared fourth-year green theme. */\nbody .sidebar .brand .mark{background:linear-gradient(145deg,#5079d7,#253f91)}\nbody .course-card::before{background:linear-gradient(90deg,var(--accent),#89a8f3)}\nbody .nav a[aria-current],body .nav a:hover{background:var(--soft);color:var(--accent)}\nbody .sidebar .brand,body .sidebar .brand:hover{color:var(--ink)}\nbody .basis-language-option:hover,body .basis-language-option:focus-visible{background:var(--soft)}\nbody .basis-language-result{background:var(--soft)}\nbody .basis-memory-grid button[data-matched=\"true\"]{background:#dbe7ff;color:#244a8c}\nbody .wer-t{background:#e6edff}\nbody tr.wer-t td.wer{color:#3156a0}\nbody .btn.primary{background:var(--accent);border-color:var(--accent)}\nbody input[type=\"checkbox\"],body input[type=\"radio\"]{accent-color:var(--accent)}\n\n/* Match the fourth-year mobile navigation: no nested chapters in the compact header. */\n@media(max-width:720px){body .sidebar .nav-sub{display:none!important}}\n\n\n/* Complete first-year palette: the shared theme also contains hard-coded\n   green gradients, a green illustration and pale-green card backgrounds. */\nbody{\n  background:radial-gradient(1200px 600px at 85% -10%,#dfe9ff 0,transparent 60%) no-repeat fixed,var(--paper);\n  color:#1e2d43;\n}\nbody::before{background-image:url(grafiken/netz_hintergrund_blau.svg);}\nbody .sidebar{background:linear-gradient(180deg,#fff 0,#f5f8ff 100%);}\nbody .course-card:hover{box-shadow:0 14px 34px #253f9118;}\nbody .lab-head{background:#e9eefc;}\nbody .concept,body .concept div{border-color:#7893d1;background:#e7edff;}\nbody .concept div{background:#d8e4ff;}\nbody .concept div div{background:#c6d8ff;}\nbody .group-box.train{background:#edf2ff;border-color:#acbde6;}\nbody .memory-card.matched{background:#edf2ff;}\nbody .variant{background:#f8faff;}\nbody .wer-t{background:#e6edff;}\nbody .lesson-recap{border-left-color:var(--accent);}\nbody .footer{border-top:1px solid var(--line);margin-top:25px;}\nbody .footer .detail-body a{overflow-wrap:anywhere;}\nbody .footer .detail-body>p:last-child a{margin-right:18px;}\n.basis-transfer{margin:34px 0;padding:26px;background:#e9eefc;border-top:5px solid var(--accent);border-radius:0 0 12px 12px;}\n.basis-transfer h2{font-size:clamp(1.5rem,2.4vw,2rem);}\n.basis-transfer-actions{display:grid;gap:14px;max-width:680px;}\n.basis-backup-controls{display:grid;gap:14px;}\n.basis-backup-controls label{display:grid;gap:6px;font-size:14px;font-weight:650;}\n.basis-backup-controls input[type=\"file\"]{font-weight:400;background:white;border:1px solid var(--line);border-radius:8px;padding:10px;width:100%;}\n.basis-backup-controls button{justify-self:start;}\n@media(max-width:720px){\n  .basis-transfer{padding:19px 16px;}\n  .basis-backup-controls button{width:100%;}\n}\n\n\n/* Consistent figure sizes with the 4th-year course, especially in DL 1–4.\n   The original portal defines 700px for diagrams and 900px for the biological\n   neuron. Don't override that with max-width:100%, which made both larger. */\nbody .concept-figure img{display:block;width:100%;max-width:700px;height:auto;margin-inline:auto}\nbody .neuron-figure img{max-width:900px}\nbody .learning-system-figure img{max-height:300px}\nbody .concept-figure svg{max-width:700px;height:auto;margin-inline:auto}\n\n/* Shared table layout, blue first-year palette instead of inherited sage. */\nbody thead th,body .typen thead th,body .phase-table thead th{\n  background:#e6edff;\n  color:#284b8e;\n  border-bottom-color:#c3d2f0;\n}\nbody .typen tbody th{background:var(--soft);color:#294778}\nbody .table-scroll,body .table-wrap{border-color:#c6d2e7}\nbody .phase-table tr.wer-l td{background:#e7eeff}\nbody .phase-table tr.wer-t td{background:#e9f0ff}\nbody .phase-table tr.wer-k td{background:#f0edff}\nbody input[type=text],body select,body textarea{border-color:#9daeca}\nbody .lab-panel{border-color:#b5c5e8}\nbody .lab-head{background:#e6edff;color:#284b8e}\nbody .lab-loading:not([hidden]){background:#f7faff}\nbody .lab-loading-spinner{border-color:#d1dffa;border-top-color:var(--accent)}\n@media(max-width:720px){body .concept-figure img{max-width:100%}}\n\n/* KI-Glossar: gleicher Aufbau in beiden Kursen, Farben aus der jeweiligen Palette. */\n.glossary{max-width:1050px}\n.glossary-search-label{display:block;font-weight:700;margin:18px 0 6px}\n.glossary [data-glossary-search]{display:block;width:100%;max-width:580px;min-height:45px;border:1px solid var(--line);border-radius:9px;padding:9px 13px;background:#fff;color:var(--ink)}\n.glossary-group{margin:30px 0}\n.glossary-group h2{font-size:1.6rem;margin-bottom:14px}\n.glossary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}\n.glossary-entry{background:#fff;border:1px solid var(--line);border-radius:13px;padding:18px 20px;min-width:0;scroll-margin-top:25px}\n.glossary-entry h3{font-size:1.14rem;color:var(--accent);margin-bottom:9px}\n.glossary-entry p{font-size:14px;line-height:1.6;margin:0 0 9px}\n.glossary-entry p:last-child{margin-bottom:0}\n.glossary-example{padding-top:8px;border-top:1px solid var(--line)}\n\n/* Self-check is one calm panel, not a second accordion card within a card.\n   Override the course-wide details/summary borders, padding and + marker. */\n.glossary-selfcheck{margin-top:15px;padding:14px 16px 8px;background:#f8faf9;background:color-mix(in srgb,var(--soft) 48%,#fff);border:1px solid var(--line);border-radius:12px}\n.glossary-entry .glossary-question{display:grid;gap:4px;margin:0;color:var(--ink);line-height:1.5}\n.glossary-question-label{display:block;font-size:11px;line-height:1.35;font-weight:800;letter-spacing:.085em;text-transform:uppercase;color:var(--accent)}\n.glossary-question-text{font-size:14px;font-weight:550;overflow-wrap:anywhere}\n.glossary-selfcheck>details.glossary-answer{margin:0;border:0;border-radius:0;background:transparent;overflow:visible}\n.glossary-answer>summary{display:flex;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:44px;margin:10px 0 0;padding:10px 0 0;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;color:var(--accent);font-size:14px;font-weight:700;line-height:1.4;list-style:none;cursor:pointer}\n.glossary-answer>summary::-webkit-details-marker{display:none}\n.glossary-answer>summary::after,.glossary-answer[open]>summary::after{content:none}\n.glossary-answer[open]>summary{border-top:1px solid var(--line);border-bottom:0}\n.glossary-answer>summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:5px}\n.glossary-answer>summary:hover{color:var(--ink)}\n.glossary-answer-hide{display:none}\n.glossary-answer[open] .glossary-answer-show{display:none}\n.glossary-answer[open] .glossary-answer-hide{display:inline}\n.glossary-answer-icon{width:28px;height:28px;margin-left:auto;flex:none;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:white;color:var(--accent)}\n.glossary-answer-icon::before{content:\"\";display:block;width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-2px) rotate(45deg);transition:transform .16s ease}\n.glossary-answer[open] .glossary-answer-icon::before{transform:translateY(2px) rotate(225deg)}\n.glossary-answer>summary:hover .glossary-answer-icon{border-color:var(--accent)}\n.glossary-answer-content{margin:8px 0 6px;padding:11px 13px;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;background:#fff}\n.glossary-answer-content p{margin:0;color:var(--ink);line-height:1.6;overflow-wrap:anywhere}\n\n.glossary-related{font-size:14px;line-height:1.6;color:var(--muted);margin:12px 0 18px}\n.glossary-related a{color:var(--accent);font-weight:600;text-underline-offset:3px}\na[href^=\"#glossar-\"]:not(.nav a),a[href^=\"#basis-glossar-\"]:not(.nav a){text-decoration-style:dotted;text-underline-offset:4px}\n.glossary-dialog{position:relative;box-sizing:border-box;overflow-y:auto;border:1px solid var(--line);border-radius:16px;width:min(540px,calc(100vw - 24px));max-height:85vh;padding:27px 28px;background:#fff;color:var(--ink);box-shadow:0 18px 55px #182b3140}\n.glossary-dialog::backdrop{background:#182b3180}\n.glossary-dialog .glossary-entry{border:0;padding:0}\n.glossary-dialog .glossary-entry h3{padding-right:46px}\n.glossary-close{position:absolute;top:17px;right:17px;display:grid;place-items:center;border:1px solid var(--line);background:var(--soft);color:var(--accent);font-size:22px;line-height:1;border-radius:9px;width:38px;height:38px;padding:0}\n.glossary-close:hover{border-color:var(--accent)}\n.glossary-close:focus-visible{outline:2px solid var(--accent);outline-offset:3px}\n.glossary-empty{padding:20px;background:#fff;border:1px dashed var(--line);border-radius:12px}\n@media(max-width:720px){.glossary-grid{grid-template-columns:1fr}.glossary-group h2{font-size:1.3rem}.glossary-entry{scroll-margin-top:100px}.glossary-selfcheck{padding:13px 14px 7px}.glossary-dialog{padding:22px 18px}.glossary-close{top:12px;right:12px}}\n@media(prefers-reduced-motion:reduce){.glossary-answer-icon::before{transition:none}}\n@media print{.glossary-dialog{display:none!important}.glossary-entry{break-inside:avoid}.glossary [data-glossary-search]{display:none}}\n\n\n/* DL1 – dieselbe interaktive KI-Zeitleiste in beiden Klassen.\n   Die Bilder bleiben bis zur Dialogöffnung in HTML-Templates verborgen. */\n.timeline .milestone-trigger{display:inline-flex;align-items:center;gap:7px;max-width:100%;border:0;border-radius:5px;background:transparent;padding:2px 4px 3px 0;color:var(--accent);font-size:inherit;line-height:1.4;font-weight:800;text-align:left;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:4px;cursor:pointer}\n.timeline .milestone-trigger:hover{text-decoration-style:solid;color:var(--ink)}\n.timeline .milestone-trigger:focus-visible{outline:3px solid var(--accent);outline-offset:3px}\n.milestone-trigger-icon{font-size:.85em;opacity:.7}\n.milestone-dialog{box-sizing:border-box;position:fixed;inset:0;width:min(740px,calc(100vw - 26px));max-height:min(88vh,900px);overflow-y:auto;margin:auto;padding:30px 32px;border:1px solid var(--line);border-radius:18px;background:white;color:var(--ink);box-shadow:0 25px 65px #182b314d}\n.milestone-dialog::backdrop{background:#14242f99}\n.milestone-dialog .milestone-detail-kicker{margin:0 42px 7px 0;color:var(--accent);font-size:12px;font-weight:750;letter-spacing:.07em;text-transform:uppercase}\n.milestone-dialog h2{padding-right:44px;margin:0 0 18px;font-size:clamp(1.55rem,4vw,2.15rem);color:var(--ink)}\n.milestone-dialog figure{margin:0}\n.milestone-dialog figure img{display:block;max-height:390px;width:100%;object-fit:contain;border:1px solid var(--line);border-radius:11px;background:#f5f6f7}\n.milestone-dialog figcaption{font-size:15px;line-height:1.6;margin:14px 0 8px;color:var(--ink)}\n.milestone-dialog .milestone-source{margin:0;font-size:12px;line-height:1.6;color:var(--muted);overflow-wrap:anywhere}\n.milestone-dialog .milestone-source a{color:var(--accent);text-underline-offset:3px}\n.milestone-close{position:absolute;right:17px;top:17px;z-index:1;display:grid;place-items:center;width:40px;height:40px;padding:0;border:1px solid var(--line);border-radius:9px;background:var(--soft);color:var(--accent);font-size:25px;line-height:1;cursor:pointer}\n.milestone-close:hover{border-color:var(--accent)}\n.milestone-close:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n@media(max-width:720px){.milestone-dialog{padding:23px 18px}.milestone-close{right:12px;top:12px}.milestone-dialog figure img{max-height:300px}}\n@media print{.milestone-dialog{display:none!important}.timeline .milestone-trigger{color:inherit;text-decoration:none}}\n\n/* Historical examples are more useful as comparisons than as screenshots\n   of a user interface. Keep both image credits directly below the images. */\n.milestone-dialog .milestone-image-lead,.milestone-dialog .milestone-image-context{font-size:15px;line-height:1.6;margin:0 0 16px}\n.milestone-dialog .milestone-image-context{margin:15px 0 0}\n.milestone-dialog .milestone-art-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}\n.milestone-dialog .milestone-art-grid figure{min-width:0}\n.milestone-dialog .milestone-art-grid figure img{aspect-ratio:1/1;max-height:300px}\n.milestone-dialog .milestone-art-grid figcaption{font-size:13px;font-weight:650;margin:8px 0 4px}\n.milestone-dialog .milestone-art-grid .milestone-source{font-size:11px}\n.timeline-thinking{background:var(--soft);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:13px 16px;line-height:1.6;margin:0 0 20px}\n.timeline-thinking strong{color:var(--accent)}\n@media(max-width:540px){.milestone-dialog .milestone-art-grid{grid-template-columns:1fr;gap:17px}.milestone-dialog .milestone-art-grid figure img{max-height:220px;aspect-ratio:4/3}}\n\n/* DL1 cards use existing blue / green course variables. */\n.ki-sort-task{max-width:990px;margin:22px 0;padding:20px;border:1px solid var(--line);border-radius:16px;background:white}\n.ki-sort-intro{font-size:15px;line-height:1.6;margin:0 0 17px}\n.ki-sort-layout{display:grid;gap:19px}\n.ki-sort-subtitle{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:16px;margin:0 0 10px}\n.ki-sort-subtitle small{font-size:12px;color:var(--muted);font-weight:500}\n.ki-sort-pool,.ki-sort-bin-cards{display:grid;gap:9px;align-content:start}\n.ki-sort-pool{min-height:38px}\n.ki-sort-card{display:grid;grid-template-columns:27px minmax(0,1fr);gap:9px 12px;padding:13px;border:1px solid var(--line);border-radius:11px;background:white;min-width:0;box-shadow:0 2px 8px #203d3710}\n.ki-sort-card[draggable=true]{cursor:grab}\n.ki-sort-card.ki-sort-dragging{opacity:.45}\n.ki-sort-card.ki-sort-selected{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-card-index{width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font-size:13px;font-weight:800}\n.ki-sort-card-text{font-size:14px;line-height:1.5;font-weight:550;overflow-wrap:anywhere}\n.ki-sort-select-label{grid-column:2;display:grid;gap:5px;font-size:12px;color:var(--muted);font-weight:700}\n.ki-sort-card select{width:100%;min-width:0;max-width:100%;min-height:44px;border:1px solid var(--line);border-radius:8px;background:white;color:var(--ink);padding:7px 9px;font:13px/1.4 system-ui;cursor:pointer}\n.ki-sort-card select:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-bins{display:none;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}\n.ki-sort-ready .ki-sort-bins{display:grid}\n.ki-sort-bin{min-width:0;min-height:110px;padding:12px;border:1px dashed var(--line);border-radius:12px;background:var(--soft);background:color-mix(in srgb,var(--soft) 60%,white)}\n.ki-sort-bin h3{font-size:13px;color:var(--accent);line-height:1.4;margin:0 0 10px}\n.ki-sort-bin-cards{min-height:45px}\n.ki-sort-bin-cards:empty::after{content:\"Hier ablegen\";padding:13px 5px;text-align:center;color:var(--muted);font-size:12px}\n.ki-sort-bin .ki-sort-card{padding:10px 9px}\n.ki-sort-drop-active{outline:2px solid var(--accent);outline-offset:2px}\n.ki-sort-card-result{grid-column:2;font-size:12px;font-weight:700;line-height:1.4}\n.ki-sort-card-result:empty{display:none}\n.ki-sort-card[data-ki-sort-result=correct]{border-color:#36845d}\n.ki-sort-card[data-ki-sort-result=correct] .ki-sort-card-result{color:#236044}\n.ki-sort-card[data-ki-sort-result=incorrect]{border-color:#b57933}\n.ki-sort-card[data-ki-sort-result=incorrect] .ki-sort-card-result{color:#955a13}\n.ki-sort-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:18px 0 4px}\n.ki-sort-actions button{min-height:44px;padding:8px 15px;border:1px solid var(--accent);border-radius:9px;font:700 13px/1.4 system-ui;cursor:pointer}\n.ki-sort-actions button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.ki-sort-check{background:var(--accent);color:white}.ki-sort-check:disabled{opacity:.48;cursor:not-allowed}\n.ki-sort-reset{background:white;color:var(--accent)}\n.ki-sort-status{flex-basis:100%;font-size:13px;color:var(--muted);line-height:1.5}\n/* Same panel, divider, toggle and answer surface as the glossary Leitfrage. */\n.ki-sort-task details.ki-sort-help{margin:15px 0 0;padding:14px 16px 8px;border:1px solid var(--line);border-radius:12px;background:#f8faf9;background:color-mix(in srgb,var(--soft) 48%,#fff);overflow:visible}\n.ki-sort-task .ki-sort-help>summary{display:flex;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:44px;margin:0;padding:10px 0 0;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;color:var(--accent);font-size:14px;font-weight:700;line-height:1.4;list-style:none;cursor:pointer}\n.ki-sort-help>summary::-webkit-details-marker{display:none}\n.ki-sort-help>summary::after,.ki-sort-help[open]>summary::after{content:none}\n.ki-sort-help>summary:hover{color:var(--ink)}\n.ki-sort-help>summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:5px}\n.ki-sort-help-hide{display:none}\n.ki-sort-help[open] .ki-sort-help-show{display:none}\n.ki-sort-help[open] .ki-sort-help-hide{display:inline}\n.ki-sort-help-icon{width:28px;height:28px;margin-left:auto;flex:none;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:white;color:var(--accent)}\n.ki-sort-help-icon::before{content:\"\";display:block;width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-2px) rotate(45deg);transition:transform .16s ease}\n.ki-sort-help[open] .ki-sort-help-icon::before{transform:translateY(2px) rotate(225deg)}\n.ki-sort-help>summary:hover .ki-sort-help-icon{border-color:var(--accent)}\n.ki-sort-help>p{margin:8px 0 6px;padding:11px 13px;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;background:#fff;color:var(--ink);font-size:14px;line-height:1.6;overflow-wrap:anywhere}\n@media(prefers-reduced-motion:reduce){.ki-sort-help-icon::before{transition:none}}\n@media(max-width:720px){.ki-sort-task details.ki-sort-help{padding:13px 14px 7px}}\n.ki-sort-reflection{max-width:700px}\n.ki-sort-legacy{margin:22px 0;border:1px solid var(--line);border-radius:12px;background:white}\n.ki-sort-legacy>summary{padding:13px 16px;font-size:14px}\n.ki-sort-legacy-fields{padding:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.ki-sort-legacy>.small{padding:0 16px 12px;margin:0}\n@media(max-width:720px){.ki-sort-task{padding:14px 12px;margin:15px 0}.ki-sort-bins{grid-template-columns:1fr}.ki-sort-legacy-fields{grid-template-columns:1fr}.ki-sort-card[draggable=true]{cursor:auto}}\n";
const BASIS_PREVIEW_CHROME = "\n<a class=\"skip\" href=\"#inhalt\">Zum Inhalt</a>\n<aside class=\"sidebar\"><a class=\"brand\" href=\"#basis-start\"><span aria-hidden=\"true\" class=\"mark\"><svg viewBox=\"0 0 26 26\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.4\" stroke-linecap=\"round\"><path d=\"M4 6l9 -2M4 6l9 8M4 6l9 15M4 20l9 -16M4 20l9 -6M4 20l9 1M13 4l9 9M13 14l9 -1M13 21l9 -8\" opacity=\".7\"/><g fill=\"#fff\" stroke=\"none\"><circle cx=\"4\" cy=\"6\" r=\"2.2\"/><circle cx=\"4\" cy=\"20\" r=\"2.2\"/><circle cx=\"13\" cy=\"4\" r=\"2.2\"/><circle cx=\"13\" cy=\"14\" r=\"2.2\"/><circle cx=\"13\" cy=\"21\" r=\"2.2\"/><circle cx=\"22\" cy=\"13\" r=\"2.6\"/></g></svg></span><span class=\"brand-text\">Künstliche<br/>Intelligenz<small>Informatik</small></span></a>\n<nav class=\"nav\" aria-label=\"Unterricht\">\n<!-- NAVIGATION -->\n</nav>\n<div class=\"sidebar-bottom\"><a href=\"../kurse.html\">Kursauswahl</a><a href=\"#basis-sicherung\">Notizen &amp; Projekt</a><p class=\"status\" id=\"basis-save-status\" role=\"status\">Nur in diesem Browser gespeichert.</p></div>\n</aside>\n<div class=\"shell\"><main id=\"inhalt\">\n<div class=\"crumb\"><span><img alt=\"Logo KST\" class=\"school-logo\" height=\"22\" src=\"grafiken/kst_logo.png\" width=\"44\"/>Kantonsschule Stadelhofen</span><span>Informatik</span><span>Künstliche Intelligenz</span></div>\n";
// Resolve images just like the built course pages: their URLs are relative to /projekt/,
// NOT to the Markdown file in /kursseiten/ or to the worker's root.
function previewAssets(content,baseUrl){
  const doc = new DOMParser().parseFromString("<main>"+content+"</main>","text/html");
  const root=doc.querySelector("main");
  for(const el of root.querySelectorAll("[src]")){
    const value=el.getAttribute("src");
    if(!value || /^(?:data:|blob:|https?:\/\/)/i.test(value))continue;
    // Resolve relative assets exactly against the selected course root.
    const absolute=new URL(value,baseUrl);
    if(absolute.origin===new URL(baseUrl).origin)
      el.setAttribute("src",absolute.href);
  }
  return root.innerHTML;
}
// Mirror build_portal.render_fragment's chapter wrapper for YAML-backed chapters.
// The number and title must appear even before the first PR is merged.
function chapterFromYaml(source){
  const header=/^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if(!header)return null;
  const meta={};
  for(const line of header[1].split(/\r?\n/)){
    const match=/^([a-z_]+):\s*(.*?)\s*$/.exec(line);
    if(!match)continue;
    const raw=match[2];
    if(raw.startsWith('"')){try{meta[match[1]]=JSON.parse(raw);}catch{meta[match[1]]=raw;}}
    else if(raw.startsWith("'")&&raw.endsWith("'"))
      meta[match[1]]=raw.slice(1,-1).replaceAll("''","'");
    else if(raw==="true"||raw==="false")meta[match[1]]=raw==="true";
    else meta[match[1]]=raw;
  }
  if(meta.type!=="chapter")return null;
  const id=String(meta.id||"");
  if(!/^[a-z][a-z0-9-]*$/.test(id))return null;
  const nr=escapeHtml(meta.nummer??"");
  const title=escapeHtml(meta.titel??"");
  const short=escapeHtml(meta.kurz??"");
  const archived=meta.archiviert===true;
  const open=meta.open!==false&&!archived?' open':"";
  const hidden=archived?' data-archived="true" hidden style="display:none"':"";
  return '<details class="kapitel" id="'+id+'" data-kurz="'+short+'"'+open+hidden+
    '><summary><span class="kapitel-nr">'+nr+'</span><h2 class="kapitel-titel">'+
    title+'</h2></summary><div class="kapitel-body">'+markdown(source.slice(header[0].length))+
    '</div></details>';
}

/* The glossary lives in a single versioned JSON file, shared by the two courses.
   The first-year and fourth-year explanations are intentionally independent. */
function currentGlossaryTerm(){
  return state.glossary?.begriffe.find(t=>t.id===state.glossarySelected);
}
function glossaryList(){
  const root=$("glossaryTerms");root.replaceChildren();
  const q=$("glossarySearch").value.trim().toLocaleLowerCase("de-CH");
  const terms=state.glossary.begriffe.slice().sort((a,b)=>a.begriff.localeCompare(b.begriff,"de-CH"));
  const matches=terms.filter(t=>(t.begriff+" "+t.gruppe).toLocaleLowerCase("de-CH").includes(q));
  $("glossaryCount").textContent=matches.length+" von "+terms.length+" Begriffen";
  for(const term of matches){
    const button=document.createElement("button");button.type="button";
    button.textContent=term.begriff||"(Neuer Begriff)";
    const group=document.createElement("small");group.textContent=term.gruppe;button.append(group);
    button.setAttribute("aria-current",String(state.glossarySelected===term.id));
    button.addEventListener("click",()=>{
      state.glossarySelected=term.id;
      glossaryList();glossaryFields();preview();
    });
    root.append(button);
  }
}
// The shared glossary keeps stable term IDs and names, but each course edits
// only its own definition and optional example/self-check overrides.
const glossaryDetailKey=(level,key)=>level+(key==="beispiel"?"Beispiel":key==="frage"?"Frage":"Antwort");
const glossaryContent=(term,level,key)=>term[glossaryDetailKey(level,key)]??term[key];
function glossaryFields(){
  const term=currentGlossaryTerm();if(!term)return;
  const level=state.course==="basis"?"basis":"vertieft";
  $("glossaryCurrent").textContent=term.begriff||"Neuer Begriff";
  $("glossaryId").textContent="Stabile Verknüpfungs-ID: "+term.id;
  $("glossaryBasis").value=term.basis;
  $("glossaryVertieft").value=term.vertieft;
  $("glossaryExample").value=glossaryContent(term,level,"beispiel");
  $("glossaryQuestion").value=glossaryContent(term,level,"frage");
  $("glossaryAnswer").value=glossaryContent(term,level,"antwort");
  $("glossaryName").value=term.begriff;
  const group=$("glossaryGroup");group.replaceChildren();
  for(const name of state.glossary.gruppen){
    const option=document.createElement("option");option.value=name;option.textContent=name;group.append(option);
  }
  group.value=term.gruppe;
  $("glossaryBasis").closest(".glossary-level").hidden=level!=="basis";
  $("glossaryVertieft").closest(".glossary-level").hidden=level!=="vertieft";
}
function openGlossaryControls(content){
  state.glossary=validateGlossary(JSON.parse(content));
  if(!state.glossary.begriffe.some(t=>t.id===state.glossarySelected))
    state.glossarySelected=state.glossary.begriffe[0].id;
  $("glossaryCourseTitle").textContent="KI-Glossar · "+(state.course==="basis"?"1. Klasse":"4. Klasse");
  $("glossaryLevelName").textContent=state.course==="basis"?"die 1. Klasse":"die 4. Klasse";
  $("glossarySearch").value="";
  $("glossaryEditor").querySelector(".glossary-common").open=false;
  glossaryList();glossaryFields();
}
function glossaryChange(key,value){
  const term=currentGlossaryTerm();if(!term)return;
  const level=state.course==="basis"?"basis":"vertieft";
  // UI guards against changing the other course even with programmatic events.
  if(key==="basis"||key==="vertieft"){
    if(key!==level)return;
    term[level]=value;
  }else if(["beispiel","frage","antwort"].includes(key)){
    term[glossaryDetailKey(level,key)]=value;
  }else{
    // Explicitly grouped shared metadata, never silently tied to level changes.
    term[key]=value;
  }
  $("source").value=JSON.stringify(state.glossary,null,2)+"\n";
  if(key==="begriff"||key==="gruppe"){
    $("glossaryCurrent").textContent=term.begriff||"Neuer Begriff";
    glossaryList();
  }
  preview();
}
function glossaryAdd(){
  const name=prompt("Neuer Glossarbegriff:");
  if(name===null)return;
  if(name.trim().length<2){status("Der Begriff muss mindestens zwei Zeichen haben.",true);return;}
  const id=slug(name);
  if(!/^[a-z][a-z0-9-]{0,69}$/.test(id)||state.glossary.begriffe.some(t=>t.id===id)){
    status("Ungültige oder bereits vorhandene Glossar-ID. Bitte einen anderen Begriff verwenden.",true);return;
  }
  const term={id,gruppe:state.glossary.gruppen[0],begriff:name.trim(),
    basis:"Erklärung für die 1. Klasse hier ergänzen.",
    vertieft:"Vertiefte fachliche Erklärung für die 4. Klasse hier ergänzen.",
    beispiel:"Hier ein konkretes Beispiel ergänzen.",
    frage:"Welche Frage passt zu diesem Begriff?",
    antwort:"Eine kurze Antwort zur Leitfrage ergänzen."};
  state.glossary.begriffe.push(term);
  state.glossarySelected=id;
  $("glossarySearch").value="";
  $("source").value=JSON.stringify(state.glossary,null,2)+"\n";
  glossaryList();glossaryFields();preview();
  $(state.course==="basis"?"glossaryBasis":"glossaryVertieft").focus();
  status("Begriff angelegt. Nur die ausgewählte Klassenstufe bearbeiten; bitte auch die andere Erklärung später ergänzen.");
}
function glossaryPreviewHtml(level){
  const t=currentGlossaryTerm();if(!t)return "";
  const prefix=level==="basis"?"basis-glossar":"glossar";
  const e=escapeHtml;
  return '<span class="section-label">Nachschlagen · '+(level==="basis"?"1. Kurzgymnasium":"4. Kurzgymnasium")+'</span>'+
    '<h1>KI-Glossar</h1><div class="glossary"><div class="glossary-group"><h2>'+e(t.gruppe)+'</h2><div class="glossary-grid">'+
    '<article class="glossary-entry" id="'+prefix+'-'+e(t.id)+'" data-glossary-id="'+e(t.id)+'">'+
    '<h3>'+e(t.begriff)+'</h3><p>'+e(t[level==="basis"?"basis":"vertieft"])+'</p>'+
    '<p class="glossary-example"><strong>Beispiel:</strong> '+e(glossaryContent(t,level,"beispiel"))+'</p>'+
    '<div class="glossary-selfcheck">'+
    '<p class="glossary-question"><span class="glossary-question-label">Leitfrage</span>'+
    '<span class="glossary-question-text">'+e(glossaryContent(t,level,"frage"))+'</span></p>'+
    '<details class="glossary-answer"><summary>'+
    '<span class="glossary-answer-show">Antwort anzeigen</span>'+
    '<span class="glossary-answer-hide">Antwort verbergen</span>'+
    '<span class="glossary-answer-icon" aria-hidden="true"></span></summary>'+
    '<div class="glossary-answer-content"><p>'+e(glossaryContent(t,level,"antwort"))+'</p></div>'+
    '</details></div></article></div></div></div>';
}

function preview(){
  const isGlossary=state.current?.path===GLOSSARY_PATH;
  const isBasis=state.course==="basis";
  document.body.classList.toggle("course-basis",state.course==="basis");
  const previewBase=isBasis?BASIS_PREVIEW_BASE:COURSE_PREVIEW_BASE;
  let content=isGlossary?glossaryPreviewHtml(isBasis?"basis":"vertieft"):$("source").value;
  if(isGlossary){
    // Same semantic elements and stylesheet as scripts/glossary.py on the published pages.
  }else if(state.current?.path.endsWith("/planung.json")){
    const plan=JSON.parse(content),selected=Math.max(0,Number($("planLesson").value)||0);
    const lesson=plan.lessons[selected]||plan.lessons[0];
    const esc=escapeHtml;
    if(!lesson)content="<p>Keine Doppellektion vorhanden.</p>";
    else{
      const rows=lesson.phases.map((phase,index)=>{
        const steps=(phase.schritte||[]).map(step=>
          '<div class="aviva-step"><strong>'+esc(step.art||"Auftrag")+'</strong> · '+esc(step.wer||"")+
          (step.min?' · '+Number(step.min)+' Min.':'')+'<p>'+esc(step.text||"")+'</p></div>').join("");
        return '<tr><th scope="row">'+(index+1)+'. '+esc(phase.phase||"")+'</th><td><strong>'+esc(phase.titel||"")+'</strong>'+steps+'</td><td>'+Number(phase.minutes||0)+' Min.</td></tr>';
      }).join("");
      const detail=[["Leitfrage",lesson.question],["Motivation",lesson.motivation],["Lernergebnis",lesson.product]]
        .filter(([name,value])=>value).map(([name,value])=>'<p><strong>'+name+':</strong> '+esc(value)+'</p>').join("");
      const sum=lesson.phases.reduce((total,phase)=>total+Number(phase.minutes||0),0);
      content='<span class="section-label">Unterrichtsplanung · '+(isBasis?"1.":"4.")+' Kurzgymnasium</span>'+
        '<h2>AVIVA · '+esc(lesson.title)+'</h2>'+
        '<div class="card"><h3>Lernziele</h3><p>'+esc(lesson.goal||"")+'</p>'+detail+'</div>'+
        '<div class="table-scroll"><table class="phase-table"><thead><tr><th>Phase</th><th>Arbeitsschritte</th><th>Zeit</th></tr></thead>'+
        '<tbody>'+rows+'</tbody></table></div><p><strong>Gesamtzeit: '+sum+' Minuten</strong></p>';
    }
  }else if(content.includes("<!-- MD:START -->"))
    content=content.replace(/<!-- MD:START -->\r?\n([\s\S]*?)\r?\n<!-- MD:END -->/g,(_,text)=>markdown(text));
  else if(content.startsWith("---\n"))
    content=chapterFromYaml(content)??markdown(content);
  else if(!/^\s*<(?:details|section)\b/.test(content))
    content=markdown(content);
  content=previewAssets(content,previewBase);
  // Display staged image uploads without uploading or executing their content.
  for(const item of state.staged.values()){
    if(!item.path.startsWith("projekt/grafiken/uploads/")||item.delete)continue;
    const url=previewBase+item.path.replace(/^projekt\//,"");
    const extension=item.path.split(".").pop();
    const mime=extension==="jpg"||extension==="jpeg"?"jpeg":extension;
    content=content.replaceAll(url,"data:image/"+mime+";base64,"+item.content);
  }
  // Match the actual rendered /projekt/index.html DOM hierarchy. The course's
  // main and section layout rules must not be replaced with generic editor styles.
  // Keep the preview inert: no allow-scripts and no allow-same-origin.
  const section=isGlossary?(isBasis?"basis-glossar":"glossar"):(state.current?.path.split("/")[1]||(isBasis?"basis-start":"einstieg"));
  const safeSection=/^[a-z0-9-]+$/.test(section)?section:(isBasis?"basis-start":"einstieg");
  const stylesheet="<style>"+COURSE_PREVIEW_CSS+(isBasis?BASIS_PREVIEW_CSS:"")+"</style>";
  // The Worker CSP intentionally forbids <base> (base-uri 'none'). Inline chrome
  // assets must therefore be absolute, just like images from edited chapters.
  const definitions=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content).sections;
  const navigation=definitions.filter(s=>s.navigation).sort((a,b)=>a.navigation.order-b.navigation.order)
    .map(s=>'<a href="#'+escapeHtml(s.id)+'"><span>'+escapeHtml(s.navigation.label)+'</span>'+escapeHtml(s.navigation.title)+'</a>').join("");
  const courseChrome=isBasis?BASIS_PREVIEW_CHROME:COURSE_PREVIEW_CHROME;
  const chrome=courseChrome.replace("<!-- NAVIGATION -->",navigation)
    .replace(/\bsrc="grafiken\//g,'src="'+previewBase+'grafiken/');
  const sectionClass=definitions.find(s=>s.id===safeSection)?.class||"section";
  $("preview").srcdoc='<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+previewBase+'">'+stylesheet+'</head><body>'+chrome+'<section class="'+escapeHtml(sectionClass)+'" id="'+safeSection+'">'+content+'</section></main></div></body></html>';

}
function availableOrder(section,after){
  const prefix="kursseiten/"+section+"/";
  const orders=state.chapters.filter(c=>c.path.startsWith(prefix)).map(c=>Number(filename(c.path).slice(0,3))).filter(Number.isFinite).sort((a,b)=>a-b);
  if(!orders.length)throw Error("Dieser Unterrichtsbereich ist leer.");
  if(!after){const last=Math.max(...orders.filter(n=>n!==999));if(last+10>=999)throw Error("Kein freier Platz am Ende.");return last+10;}
  const current=Number(after);
  if(!orders.includes(current)||current===999)throw Error("Einfügepunkt nicht gefunden.");
  const next=orders.find(n=>n>current)??999;
  const middle=Math.floor((current+next)/2);
  if(middle<=current||orders.includes(middle))throw Error("Kein freier Platz dazwischen.");
  return middle;
}
function addChapter(){
  try{
    if(!confirmUnsaved())return;
    const section=$("section").value;
    const title=prompt("Titel des neuen Unterkapitels:");if(!title)return;
    const number=prompt("Sichtbare Kapitelnummer (z. B. 3a):");if(!number)return;
    if(!/^\d+[a-z]?$/.test(number))throw Error("Kapitelnummer muss z. B. 3 oder 3a sein.");
    const after=prompt("Nach welchem Dateipräfix einfügen (z. B. 030)? Leer = anhängen:","");if(after===null)return;
    const numberPrefix=String(availableOrder(section,after.trim())).padStart(3,"0");
    const name=slug(title);if(!name)throw Error("Ungültiger Titel.");
    const path="kursseiten/"+section+"/"+numberPrefix+"-"+name+".md";
    if(state.chapters.some(c=>c.path===path||c.path.split("/").pop().slice(4)===(name+".md")&&c.path.startsWith("kursseiten/"+section+"/"))||state.staged.has(path))throw Error("Kapitel-ID oder Dateiname existiert bereits.");
    const doc="---\ntype: chapter\nid: "+section+"-"+name+"\nnummer: "+JSON.stringify(number)+"\ntitel: "+JSON.stringify(title)+"\nkurz: "+JSON.stringify(title)+"\nopen: true\n---\n\nText hier bearbeiten.\n\n## Auftrag\n\nAufgabe formulieren.\n";
    state.chapters.push({path,sha:null});state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
    useFile(path,null,doc);status("Neues Kapitel angelegt; zuerst vormerken, dann Pull Request erstellen.");
  }catch(e){error(e);}
}
function stage(){
  const c=state.current;if(!c)throw Error("Kein Kapitel geladen.");
  if(notebookPath(c.path)&&runtimeDirty)throw Error("Notebook wurde verändert. Vor dem Vormerken bitte «Notebook-Stand übernehmen» wählen.");
  const content=$("source").value;if(!content.trim())throw Error("Kapitel darf nicht leer sein.");
  if(c.path.endsWith("/planung.json")){
    planner.validate(content);
  }
  if(notebookPath(c.path))validateNotebook(JSON.parse(content));
  if(c.path===GLOSSARY_PATH){
    const doc=validateGlossary(JSON.parse(content));
    if(c.sha){
      const old=validateGlossary(JSON.parse(c.original));
      const nextIds=new Set(doc.begriffe.map(t=>t.id));
      if(old.begriffe.some(t=>!nextIds.has(t.id)))throw Error("Bestehende Glossar-IDs dürfen nicht gelöscht werden.");
    }
  }
  if(c.sha){
    const selector=/data-(?:answer|journal|score|skill|check|lab)\s*=\s*["']([^"']+)["']/g;
    const before=[...c.original.matchAll(selector)].map(x=>x[0]);
    const removed=before.filter(x=>!content.includes(x));
    if(removed.length&&!confirm(removed.length+" gespeicherte Antwort- oder Notebook-Schlüssel entfernt! Das gefährdet bestehende Sicherungen. Trotzdem vormerken?"))return false;
  }
  state.staged.set(c.path,{path:c.path,expectedSha:c.sha,content,original:c.original});
  stagingList();status("Vorgemerkt – noch nicht veröffentlicht.");return true;
}
function archive(){
  const c=state.current;if(!c?.sha)return;
  if(!confirm("Kapitel ausblenden? Der Inhalt bleibt mit seinen stabilen IDs in der Datei erhalten und kann später wieder aktiviert werden."))return;
  let contents=$("source").value;
  if(contents.startsWith("---\n")){
    if(/^archiviert:\s*true\s*$/m.test(contents))return status("Kapitel ist bereits ausgeblendet.");
    contents=contents.replace(/^---\n/,"---\narchiviert: true\n");
  }else{
    const tag=/<details\b[^>]*class="kapitel"[^>]*>/;
    if(!tag.test(contents))return error(Error("Kapitel-Markierung nicht gefunden."));
    contents=contents.replace(tag,match=>{
      let changed=match.replace(/\s+open(?=[\s>])/,"");
      changed=changed.replace(/>$/,' data-archived="true" hidden style="display:none">');
      return changed;
    });
  }
  $("source").value=contents;
  highlightSource();
  stage();
  status("Kapitel ausgeblendet und vorgemerkt. IDs und gespeicherte Antworten bleiben erhalten.");
}
function move(){
  const c=state.current;if(!c?.sha)return;
  try{
    const after=prompt("Nach welchem Dateipräfix verschieben?","030");if(after===null)return;
    const section=c.path.split("/")[1];
    const num=String(availableOrder(section,after.trim())).padStart(3,"0");
    const target="kursseiten/"+section+"/"+num+c.path.split("/").pop().slice(3);
    if(state.chapters.some(x=>x.path===target)||state.staged.has(target))throw Error("Zielposition schon belegt.");
    state.staged.set(c.path,{path:c.path,expectedSha:c.sha,delete:true});
    state.staged.set(target,{path:target,expectedSha:null,content:$("source").value});
    state.chapters.push({path:target,sha:null});state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
    useFile(target,null,$("source").value);stagingList();status("Verschiebung vorgemerkt; Kapitel-ID bleibt erhalten.");
  }catch(e){error(e);}
}
async function imageAvivaAttribution(){
  const path=state.current?.path||"";
  if(!path.endsWith("/materialien.md"))return "";
  const previous=$("source").value.slice(0,$("source").selectionStart);
  const id=[...previous.matchAll(/^## Doppellektion ([a-z0-9-]+)\s*$/gm)].at(-1)?.[1];
  if(!id)throw Error("Bild in den Materialien unter einer Doppellektion-Überschrift einfügen.");
  const planPath="kursseiten/"+path.split("/")[1]+"/planung.json";
  const json=state.staged.get(planPath)?.content||
    (await api("/api/file?path="+encodeURIComponent(planPath))).content;
  const lesson=JSON.parse(json).lessons.find(l=>l.id===id);
  if(!lesson)throw Error("Doppellektion "+id+" im Unterrichtsplan nicht gefunden.");
  const phases=lesson.phases.map(p=>p.phase);
  const phase=prompt("AVIVA-Phase für Doppellektion "+id+":\n"+phases.join(" / "),phases[0]);
  if(phase===null)throw Error("Bild-Upload abgebrochen.");
  const entry=lesson.phases.find(p=>p.phase===phase.trim());
  if(!entry)throw Error("AVIVA-Phase muss exakt einer der fünf Phasen entsprechen.");
  const roles=[...new Set(entry.schritte.map(step=>step.wer))];
  const role=prompt("Sozialform in dieser Phase:\n"+roles.join(" / "),roles[0]);
  if(role===null)throw Error("Bild-Upload abgebrochen.");
  if(!roles.includes(role.trim()))throw Error("Sozialform kommt in der gewählten AVIVA-Phase nicht vor.");
  return ' "'+entry.phase+" | "+role.trim()+'"';
}
async function addImage(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
    if(file.size>3000000)throw Error("Maximal 3 MB pro Bild.");
    const ext={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"}[file.type];
    if(!ext)throw Error("Nur PNG, JPG oder WebP verwenden.");
    const caption=prompt("Bildbeschreibung:",file.name);
    if(caption===null)throw Error("Bild-Upload abgebrochen.");
    if(!caption.trim()||/[\[\]\n"]/.test(caption))throw Error("Bitte eine kurze Bildbeschreibung ohne Klammern oder Anführungszeichen wählen.");
    const attribution=await imageAvivaAttribution();
    const name=(slug(file.name.replace(/\.[^.]+$/,""))||"bild").slice(0,42)+"-"+crypto.randomUUID().slice(0,8)+"."+ext;
    const bytes=new Uint8Array(await file.arrayBuffer());
    let chars="";for(let i=0;i<bytes.length;i+=8192)chars+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const path="projekt/grafiken/uploads/"+name;
    state.staged.set(path,{path,expectedSha:null,content:btoa(chars)});
    insert("\n\n!["+caption.trim()+"](grafiken/uploads/"+name+attribution+")\n\n");
    stagingList();status("Bild mit AVIVA-Zuordnung vorgemerkt und im Inhalt eingefügt.");
  }catch(e){error(e);}finally{event.target.value="";}
}
async function publish(){
  if(!state.staged.size)return status("Zuerst Änderungen vormerken.",true);
  $("publish").disabled=true;
  try{
    // Verify session immediately before writing. A browser tab may stay open
    // long after the GitHub OAuth access token expires.
    const session=await api("/api/session");
    if(!session.authenticated){
      $("login").hidden=false;
      throw Error("Die GitHub-Sitzung ist abgelaufen. Bitte oben erneut anmelden; vorgemerkte Änderungen bleiben erhalten.");
    }
    const c=state.current;
    if(c&&!state.staged.get(c.path)?.delete&&$("source").value!==savedText()&&!stage())return;
    status("Pull Request wird bei GitHub erstellt …");
    const changes=[...state.staged.values()].map(c=>c.delete?
      {path:c.path,expectedSha:c.expectedSha,delete:true}:
      {path:c.path,expectedSha:c.expectedSha,content:c.content});
    if(changes.length>12)throw Error("Maximal 12 Dateien pro Pull Request. Bitte Änderungen auf mehrere Pull Requests verteilen.");
    const payload={title:$("prTitle").value,changes};
    const bytes=new TextEncoder().encode(JSON.stringify(payload)).byteLength;
    if(bytes>5000000)throw Error("Das Änderungspaket ist "+(bytes/1000000).toFixed(1)+" MB gross (maximal 5 MB). Bilder verkleinern oder Änderungen auf mehrere Pull Requests verteilen; vorgemerkte Änderungen bleiben erhalten.");
    const result=await post("/api/publish",payload);
    const newPaths=new Set([...state.staged.values()].filter(c=>!c.expectedSha&&c.path.startsWith("kursseiten/")).map(c=>c.path));
    state.staged.clear();stagingList();
    // The chapter only exists on the PR branch until GitHub merges it.
    state.chapters=state.chapters.filter(c=>!newPaths.has(c.path));
    if(state.current)state.current.original=$("source").value;
    const out=$("published");out.replaceChildren("Pull Request #"+result.number+": ");
    const link=document.createElement("a");link.href=result.url;link.rel="noopener noreferrer";link.target="_blank";link.textContent="Auf GitHub öffnen";out.append(link);
    status("Pull Request erstellt. Nach Merge und grünen CI-Tests wird veröffentlicht.");
    await refresh();
  }catch(e){error(e);}finally{$("publish").disabled=false;}
}


async function editPlan(){
  try{
    if(!confirmUnsaved())return;
    const section=$("section").value;
    const currentManifest=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content);
    if(!currentManifest.sections.some(item=>item.id===section&&item.teaching))
      throw Error("Bitte einen Unterrichtsbereich der ausgewählten Klasse wählen.");
    const path="kursseiten/"+section+"/planung.json",staged=state.staged.get(path);
    if(staged&&!staged.delete){useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);return;}
    const file=await api("/api/file?path="+encodeURIComponent(path));
    useFile(path,file.sha,file.content);status("AVIVA-Plan als Formular bearbeiten: pro Doppellektion fünf Phasen und insgesamt 90 Minuten.");
  }catch(e){error(e);}
}
async function editMaterials(){
  try{
    if(!confirmUnsaved())return;
    const section=$("section").value;
    const currentManifest=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content);
    if(!currentManifest.sections.some(item=>item.id===section&&item.teaching))
      throw Error("Bitte einen Unterrichtsbereich der ausgewählten Klasse wählen.");
    const path="kursseiten/"+section+"/materialien.md";
    const staged=state.staged.get(path);
    if(staged&&!staged.delete){useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);return;}
    const file=await api("/api/file?path="+encodeURIComponent(path));
    useFile(path,file.sha,file.content);status("Lehrpersonenmaterial bearbeiten. Ergänzungen werden beim nächsten Build generiert.");
  }catch(e){error(e);}
}

function confirmUnsaved(){
  return !(state.current&&(runtimeDirty&&notebookPath(state.current.path)||$("source").value!==savedText()))||
    confirm("Nicht vorgemerkte Änderungen verwerfen? Bitte vorher «Änderung vormerken» wählen.");
}
function lessonPlan(id,title,view){
  return lessonTemplate(id,title,view);
}
async function addLesson(){
  try{
    if(!confirmUnsaved())return;
    status("Lade aktuelle Unterrichtsplanung …");
    const file=await api("/api/file?path="+encodeURIComponent(manifestPath()));
    const manifest=JSON.parse(state.staged.get(manifestPath())?.content||file.content);
    const title=prompt("Titel der neuen Doppellektion:");
    if(!title)return;
    const chapterTitle=prompt("Titel des ersten Unterkapitels:","Einstieg und Auftrag");
    if(!chapterTitle)return;
    if(!title.trim()||!slug(chapterTitle))throw Error("Titel und Kapitelname dürfen nicht leer sein.");
    const id=($("courseSelect").value==="basis"?"basis-":"")+slug(title),view=id;
    if(!/^[a-z]/.test(view)||manifest.sections.some(s=>s.id===view))throw Error("Bereichs-ID ungültig oder bereits vorhanden.");
    const blocks=await Promise.all(manifest.sections.filter(s=>s.teaching).map(async s=>{
      const path="kursseiten/"+s.id+"/planung.json";
      const draft=state.staged.get(path);
      return JSON.parse(draft?.content||(await api("/api/file?path="+encodeURIComponent(path))).content);
    }));
    if(blocks.some(b=>b.lessons.some(l=>l.id===id)))throw Error("Lektions-ID bereits vorhanden.");
    const order=Math.max(...blocks.flatMap(b=>b.lessons.map(l=>l.order)))+10;
    const lesson=lessonPlan(id,title.trim(),view);
    lesson.order=order;
    const metadata="kursseiten/"+view+"/planung.json";
    const planSource=JSON.stringify({lessons:[lesson]},null,2)+"\n";
    state.staged.set(metadata,{path:metadata,expectedSha:null,content:planSource});
    const next=Math.max(...manifest.sections.map(s=>s.navigation?.order??-1))+1;
    manifest.sections.push({id:view,class:"section",teaching:true,navigation:{order:next,label:"",title:title.trim()}});
    state.staged.set(manifestPath(),{path:manifestPath(),expectedSha:file.sha,original:file.content,content:JSON.stringify(manifest,null,2)+"\n"});
    const chapter="kursseiten/"+view+"/010-"+slug(chapterTitle)+".md";
    const chapterSource="---\ntype: chapter\nid: "+view+"-"+slug(chapterTitle)+
      "\nnummer: \"1\"\ntitel: "+JSON.stringify(chapterTitle)+
      "\nkurz: "+JSON.stringify(chapterTitle)+"\nopen: true\n---\n\n"+
      "## Lernauftrag\n\nHier die Aufgabe beschreiben.\n";
    state.staged.set(chapter,{path:chapter,expectedSha:null,content:chapterSource});
    const extras="kursseiten/"+view+"/materialien.md";
    state.staged.set(extras,{path:extras,expectedSha:null,content:
      "## Doppellektion "+id+"\n\n### Zusätzliche Materialien\n\n"+
      "Hier ergänzende Grafiken, Tabellen und Hinweise für die Lehrperson einfügen.\n\n"+
      "- [Zur neuen Kursseite](index.html#"+view+")\n"});
    state.chapters.push({path:chapter,sha:null});state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
    if(!$("section").querySelector('option[value="'+view+'"]')){
      const opt=document.createElement("option");opt.value=view;
      opt.textContent=next+" · "+title;$("section").append(opt);
    }
    $("section").value=view;
    useFile(metadata,null,planSource);
    stagingList();
    status("Neue Doppellektion mit Kapitel und Materialien vorgemerkt. Jetzt den AVIVA-Plan im Formular ausarbeiten, danach Kapitel und Materialien ergänzen.");
  }catch(e){error(e);}
}

async function addLessonToCurrentSection(){
  try{
    if(!confirmUnsaved())return;
    const view=$("section").value;
    if(!/^[a-z][a-z0-9-]*$/.test(view))throw Error("Bitte zuerst einen bestehenden Unterrichtsbereich wählen.");
    const title=prompt("Titel der zusätzlichen Doppellektion:");
    if(!title)return;
    const chapterTitle=prompt("Titel des ersten Unterkapitels:","Einstieg und Auftrag");
    if(!chapterTitle)return;
    const id=slug(title),chapterSlug=slug(chapterTitle);
    if(!/^[a-z][a-z0-9-]*$/.test(id)||!chapterSlug)throw Error("Ungültiger Titel.");
    const manifest=JSON.parse(state.staged.get(manifestPath())?.content||state.manifest.content);
    if(!manifest.sections.some(x=>x.id===view&&x.teaching))throw Error("Kein Unterrichtsbereich.");
    const all=await Promise.all(manifest.sections.filter(x=>x.teaching).map(async x=>{
      const path="kursseiten/"+x.id+"/planung.json",draft=state.staged.get(path);
      const file=draft?.expectedSha===null?null:await api("/api/file?path="+encodeURIComponent(path));
      return {path,draft,file,data:JSON.parse(draft?.content||file?.content)};
    }));
    if(all.some(x=>x.data.lessons.some(l=>l.id===id)))throw Error("Die Lektions-ID existiert bereits.");
    const target=all.find(x=>x.path==="kursseiten/"+view+"/planung.json");
    if(!target)throw Error("Planungsdatei fehlt.");
    const max=Math.max(...all.flatMap(x=>x.data.lessons.map(l=>l.order)));
    const lesson=lessonPlan(id,title.trim(),view);
    lesson.order=max+10;
    target.data.lessons.push(lesson);
    const planSource=JSON.stringify(target.data,null,2)+"\n";
    const chapterPrefix=Math.max(0,...chaptersFor(view).map(x=>Number(x.path.split("/").pop().slice(0,3))))+10;
    if(chapterPrefix>=999)throw Error("Kein Sortierplatz für ein neues Kapitel.");
    const chapter="kursseiten/"+view+"/"+String(chapterPrefix).padStart(3,"0")+"-"+id+"-"+chapterSlug+".md";
    const materialsPath="kursseiten/"+view+"/materialien.md";
    const materialsDraft=state.staged.get(materialsPath);
    const materials=materialsDraft?.content??(await api("/api/file?path="+encodeURIComponent(materialsPath))).content;
    const materialFile=materialsDraft?null:await api("/api/file?path="+encodeURIComponent(materialsPath));
    if(state.staged.size+3>12)throw Error("Maximal zwölf Dateien pro Pull Request. Änderungen zuerst einreichen.");
    state.staged.set(target.path,{path:target.path,expectedSha:target.draft?.expectedSha??target.file?.sha??null,content:planSource});
    const chapterSource="---\ntype: chapter\nid: "+view+"-"+id+"-"+chapterSlug+
      "\nnummer: \""+(target.data.lessons.length)+"\"\ntitel: "+JSON.stringify(chapterTitle)+
      "\nkurz: "+JSON.stringify(chapterTitle)+"\nopen: true\n---\n\n"+
      "## Lernauftrag\n\nHier die Aufgabe beschreiben.\n";
    state.staged.set(chapter,{path:chapter,expectedSha:null,content:chapterSource});
    state.staged.set(materialsPath,{path:materialsPath,expectedSha:materialsDraft?.expectedSha??materialFile?.sha??null,
      content:materials+"\n\n## Doppellektion "+id+"\n\n### Zusätzliche Materialien\n\n"});
    state.chapters.push({path:chapter,sha:null});
    state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
    useFile(target.path,target.draft?.expectedSha??target.file?.sha??null,planSource);
    stagingList();
    status("Zusätzliche Doppellektion im bestehenden Bereich vorgemerkt. AVIVA-Plan und Kapitel vor dem Pull Request ausarbeiten.");
  }catch(e){error(e);}
}


function validateNotebook(doc){
  if(!doc||!Array.isArray(doc.cells)||doc.nbformat!==4||!doc.metadata||!doc.cells.every(c=>
    ["markdown","code","raw"].includes(c.cell_type)&&Array.isArray(c.source)&&c.source.every(s=>typeof s==="string")))
    throw Error("Ungültiges Jupyter-Notebook. Zellen, Metadaten und nbformat müssen erhalten bleiben.");
}
// JupyterLite runs on Pages; the teacher editor remains on the authenticated Worker.
// The existing notebook bridge sends explicit snapshots to the editor for GitHub PRs.
const runtimeOrigin="https://fachschaft-informatik-kst.github.io";
const runtimeFrame=$("notebookRuntime");
let runtimeReady=false,runtimeDirty=false,runtimeRevision=0,runtimePath="",runtimeRequests=new Map();
function runtimeStatus(message){$("notebookRuntimeStatus").textContent=message;}
function runtimeRequest(type,extra={}){
  return new Promise((resolve,reject)=>{
    if(!runtimeFrame.contentWindow)return reject(Error("JupyterLite ist nicht geöffnet."));
    const id=crypto.randomUUID();
    const timeout=setTimeout(()=>{runtimeRequests.delete(id);reject(Error("JupyterLite antwortet nicht."));},120000);
    runtimeRequests.set(id,{resolve,reject,timeout});
    runtimeFrame.contentWindow.postMessage({channel:"ki-portal-v1",type,id,...extra},runtimeOrigin);
  });
}
async function openRuntimeNotebook(content,path){
  validateNotebook(JSON.parse(content));
  runtimePath=path;runtimeReady=false;runtimeDirty=false;runtimeRevision=0;
  for(const request of runtimeRequests.values()){clearTimeout(request.timeout);request.reject(Error("Notebook gewechselt."));}
  runtimeRequests.clear();
  runtimeStatus("Python-Umgebung wird geladen …");
  // Start with a known teaching notebook and restore the actual selected source.
  // The iframe may not access OAuth cookies or the GitHub API.
  const name="portal/"+path.split("/").pop();
  runtimeFrame.src=runtimeOrigin+"/ki-unterricht/lab/index.html?path="+encodeURIComponent(name)+"&ki-embed=1&ki-restore=1&ki-teacher=1&reset";
}
window.addEventListener("message",async event=>{
  if(event.origin!==runtimeOrigin||event.source!==runtimeFrame.contentWindow||event.data?.channel!=="ki-portal-v1"||!notebookPath(state.current?.path||""))return;
  const data=event.data;
  if(data.id&&runtimeRequests.has(data.id)){
    const req=runtimeRequests.get(data.id);clearTimeout(req.timeout);runtimeRequests.delete(data.id);
    if(data.type==="error")req.reject(Error(data.error||"Notebook-Fehler"));else req.resolve(data);
  }
  if(data.type==="ready"){
    if(!data.ready){runtimeStatus(data.error||"Notebook-Start fehlgeschlagen.");return;}
    if(runtimeReady)return;
    runtimeReady=true;
    try{
      const original=JSON.parse($("source").value);
      await runtimeRequest("restore",{notebook:original,keepKernel:true});
      runtimeStatus("Bereit: Zellen bearbeiten und mit Shift + Enter ausführen.");
    }catch(e){error(e);runtimeStatus("Notebook konnte nicht geladen werden: "+e.message);}
  }
  if(data.type==="dirty"){runtimeDirty=true;runtimeStatus("Änderungen vorhanden – bitte Notebook-Stand übernehmen.");}
  if(data.type==="save-error")runtimeStatus("Automatische Sicherung fehlgeschlagen: "+data.error);
  if(data.type==="changed"&&data.notebook&&data.revision>=runtimeRevision){
    runtimeRevision=data.revision;runtimeDirty=true;
  }
});
async function snapshotRuntime(){
  if(!runtimeReady)throw Error("JupyterLite ist noch nicht bereit.");
  const data=await runtimeRequest("snapshot");
  validateNotebook(data.notebook);
  $("source").value=JSON.stringify(data.notebook,null,1)+"\\n";
  runtimeDirty=false;runtimeStatus("Notebook übernommen. Jetzt «Änderung vormerken» wählen.");
}
$("notebookSnapshot").addEventListener("click",()=>snapshotRuntime().catch(error));
$("notebookReload").addEventListener("click",()=>{if(!confirmUnsaved())return;if(state.current&&notebookPath(state.current.path))openRuntimeNotebook(savedText(),state.current.path);});
async function refreshNotebooks(){
  const result=await api("/api/notebooks");
  state.notebooks=result.notebooks;
  const list=$("notebooks");list.replaceChildren();
  for(const item of state.notebooks.filter(item=>state.course==="basis"?/\/basis_[^/]+\.ipynb$/.test(item.path):!/\/basis_[^/]+\.ipynb$/.test(item.path))){
    const button=document.createElement("button");button.type="button";
    button.textContent=item.path.split("/").pop().replace(".ipynb","").replaceAll("_"," ");
    button.title=item.path;button.addEventListener("click",()=>load(item.path));
    button.setAttribute("aria-current",String(state.current?.path===item.path));list.append(button);
  }
}

// The publishing workflow lives next to the editor actions rather than
// below the editing canvas. Keep it closed unless requested.
function showChanges(open){
  $("publishPanel").hidden=!open;
  $("toggleChanges").setAttribute("aria-expanded",String(open));
}
$("toggleChanges").addEventListener("click",()=>showChanges($("publishPanel").hidden));
$("closeChanges").addEventListener("click",()=>{
  showChanges(false);$("toggleChanges").focus();
});
document.addEventListener("pointerdown",event=>{
  if(!$("publishPanel").hidden&&!$("publishPanel").contains(event.target)&&
    !$("toggleChanges").contains(event.target))showChanges(false);
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&!$("publishPanel").hidden){
    showChanges(false);$("toggleChanges").focus();
  }
});
$("createLesson").addEventListener("click",addLesson);
$("createLessonHere").addEventListener("click",addLessonToCurrentSection);
$("editPlan").addEventListener("click",editPlan);
$("editMaterials").addEventListener("click",editMaterials);
$("editGlossary").addEventListener("click",()=>load(GLOSSARY_PATH));
$("glossarySearch").addEventListener("input",()=>{if(state.glossary)glossaryList();});
$("glossaryAdd").addEventListener("click",glossaryAdd);

for(const [id,key] of Object.entries({glossaryName:"begriff",glossaryBasis:"basis",
  glossaryVertieft:"vertieft",glossaryExample:"beispiel",glossaryQuestion:"frage",glossaryAnswer:"antwort"}))
  $(id).addEventListener("input",event=>glossaryChange(key,event.target.value));
$("glossaryGroup").addEventListener("change",event=>glossaryChange("gruppe",event.target.value));
$("section").addEventListener("change",chapterList);
$("courseSelect").addEventListener("change",async()=>{
  const selected=$("courseSelect").value;
  if(!confirmUnsaved()){$("courseSelect").value=state.course;return;}
  state.course=selected;
  document.body.classList.toggle("course-basis",selected==="basis");
  $("courseContext").textContent=selected==="basis"?"1. Kurzgymnasium · KI entdecken":"4. Kurzgymnasium · KI vertiefen";
  ++navigationRevision;
  state.plans.clear();
  state.manifest=null;
  $("section").replaceChildren();$("chapters").replaceChildren();$("lessonOrder").replaceChildren();
  state.current=null;
  $("source").value="";
  $("path").textContent="Kurs gewechselt";
  $("heading").textContent="Kapitel auswählen";
  $("notebookEditor").hidden=true;
  $("planEditor").hidden=true;$("glossaryEditor").hidden=true;
  $("formEditor").hidden=true;$("splitEditor").hidden=true;
  $("notebooks").replaceChildren();
  await refresh().catch(error);
  status("Kursauswahl geändert. Kapitel und AVIVA-Pläne gehören zum gewählten Kurs.");
});
$("refresh").addEventListener("click",()=>refresh().catch(error));
$("create").addEventListener("click",addChapter);
$("move").addEventListener("click",move);
$("archive").addEventListener("click",archive);
// Render changes shortly after typing, but do not interrupt rapid edits.
let previewDebounce=null;
$("source").addEventListener("input",()=>{
  highlightSource();
  clearTimeout(previewDebounce);
  if(!$("codeEditor").hidden)previewDebounce=setTimeout(()=>{try{preview();}catch(e){error(e);}},220);
});
$("previewButton").addEventListener("click",preview);
// Real resizable split pane: pointer, keyboard and double-click reset all use
// the same 25–75% limits. Save the width, never the page or chapter contents.
const splitEditor=$("splitEditor");
const splitDivider=$("splitDivider");
const SPLIT_KEY="ki-teacher-source-ratio";
let splitRatio=50;
function setSplitRatio(value,persist=false){
  splitRatio=Math.max(25,Math.min(75,Number(value)||50));
  splitEditor.style.setProperty("--split-left",splitRatio+"fr");
  splitEditor.style.setProperty("--split-right",(100-splitRatio)+"fr");
  splitDivider.setAttribute("aria-valuenow",String(Math.round(splitRatio)));
  splitDivider.setAttribute("aria-valuetext",Math.round(splitRatio)+" Prozent Code, "+Math.round(100-splitRatio)+" Prozent Vorschau");
  if(persist){try{localStorage.setItem(SPLIT_KEY,String(splitRatio));}catch{/* private browsing */}}
}
try{setSplitRatio(localStorage.getItem(SPLIT_KEY)??50);}catch{setSplitRatio(50);}
let draggingSplit=false;
function endSplitDrag(){
  if(!draggingSplit)return;
  draggingSplit=false;
  splitEditor.classList.remove("is-resizing");
  document.body.classList.remove("resizing-split");
  setSplitRatio(splitRatio,true);
}
splitDivider.addEventListener("pointerdown",event=>{
  if(event.button!==0||splitEditor.classList.contains("preview-only"))return;
  event.preventDefault();
  draggingSplit=true;
  splitDivider.setPointerCapture(event.pointerId);
  splitEditor.classList.add("is-resizing");
  document.body.classList.add("resizing-split");
});
splitDivider.addEventListener("pointermove",event=>{
  if(!draggingSplit)return;
  const bounds=splitEditor.getBoundingClientRect();
  setSplitRatio(100*(event.clientX-bounds.left-8)/Math.max(1,bounds.width-16));
});
splitDivider.addEventListener("pointerup",endSplitDrag);
splitDivider.addEventListener("pointercancel",endSplitDrag);
splitDivider.addEventListener("lostpointercapture",endSplitDrag);
splitDivider.addEventListener("keydown",event=>{
  const change={ArrowLeft:-5,ArrowRight:5,Home:25,End:75};
  if(!(event.key in change))return;
  event.preventDefault();
  setSplitRatio(event.key==="Home"||event.key==="End"?change[event.key]:splitRatio+change[event.key],true);
});
splitDivider.addEventListener("dblclick",()=>setSplitRatio(50,true));

// Fullscreen belongs to the surface itself, not to an external toolbar.
// The source overlay, selection and syntax layer remain functional in fullscreen.
const fullscreenSurfaces=[
  {element:$("codeEditor"),button:$("sourceFullscreen"),name:"Code"},
  {element:$("formEditor"),button:$("formFullscreen"),name:"Formular"},
  {element:$("previewFrame"),button:$("previewFullscreen"),name:"Vorschau"}
];
for(const {element,button} of fullscreenSurfaces){
  button.addEventListener("click",async()=>{
    try{
      if(document.fullscreenElement===element)await document.exitFullscreen();
      else await element.requestFullscreen();
    }catch{status("Vollbildansicht wird vom Browser nicht unterstützt.",true);}
  });
}
document.addEventListener("fullscreenchange",()=>{
  for(const {element,button,name} of fullscreenSurfaces){
    const expanded=document.fullscreenElement===element;
    const label=expanded?"Vollbild schliessen":name+" im Vollbild anzeigen";
    button.setAttribute("aria-pressed",String(expanded));
    button.setAttribute("aria-label",label);
    button.title=label;
  }
});
$("stage").addEventListener("click",()=>{try{stage();}catch(e){error(e);}});
$("checkPermissions").addEventListener("click",async()=>{
  const button=$("checkPermissions");button.disabled=true;
  try{
    const result=await api("/api/permissions");
    status(result.ready?
      "GitHub-App-Installation, Repository-Zugriff und Schreibrechte überprüft.":
      "GitHub-Berechtigungen fehlen: "+(result.error||"Bitte App-Installation prüfen."),!result.ready);
  }catch(e){error(e);}finally{button.disabled=false;}
});
$("publish").addEventListener("click",publish);
$("addHeading").addEventListener("click",()=>insert("\n\n## Neue Zwischenüberschrift\n\n"));
$("addAnswer").addEventListener("click",()=>{
  const question=prompt("Frage an die Lernenden:");if(!question)return;
  const id="aufgabe_"+slug(question).slice(0,26)+"_"+crypto.randomUUID().slice(0,7);
  insert('\n\n<label class="field answer"><span>'+escapeHtml(question)+
    '</span><textarea aria-label="'+escapeHtml(question)+'" data-answer="'+id+'" rows="4"></textarea></label>\n\n');
});
// Reusable, production-styled content blocks. They do not create persistent
// answer IDs or alter existing course markup when inserted.
const blocks={
  task:'<div class="task">\n  <p><strong>Aufgabe:</strong> Beschreiben Sie den Arbeitsauftrag.</p>\n</div>',
  info:'<div class="callout">\n  <p><strong>Merksatz:</strong> Die wichtigste Erkenntnis.</p>\n</div>',
  warning:'<div class="callout warn">\n  <p><strong>Achtung:</strong> Diesen Punkt beachten.</p>\n</div>',
  card:'<div class="card">\n  <h3>Titel der Karte</h3>\n  <p>Inhalt der Karte.</p>\n</div>',
  two:'<div class="grid two">\n  <div class="card"><h3>Links</h3><p>Erster Inhalt.</p></div>\n  <div class="card"><h3>Rechts</h3><p>Zweiter Inhalt.</p></div>\n</div>',
  three:'<div class="grid">\n  <div class="card"><h3>1</h3><p>Inhalt.</p></div>\n  <div class="card"><h3>2</h3><p>Inhalt.</p></div>\n  <div class="card"><h3>3</h3><p>Inhalt.</p></div>\n</div>',
  steps:'<div class="lesson-steps">\n  <article><b>1 · Einstieg</b><p>Erster Schritt.</p></article>\n  <article><b>2 · Erarbeiten</b><p>Zweiter Schritt.</p></article>\n  <article><b>3 · Sichern</b><p>Dritter Schritt.</p></article>\n</div>',
  flow:'<div class="process">\n  <span>Eingabe</span><strong>→</strong><span>Verarbeitung</span><strong>→</strong><span>Ausgabe</span>\n</div>',
  timeline:'<ol class="timeline">\n  <li><span class="jahr">1950</span><div><strong>Meilenstein</strong> <span class="marke regeln">Regeln von Menschen</span><p>Beschreibung.</p></div></li>\n  <li><span class="jahr">2022</span><div><strong>Weiterer Meilenstein</strong> <span class="marke daten">Lernen aus Daten</span><p>Beschreibung.</p></div></li>\n</ol>',
  figure:'<figure class="concept-figure">\n  <img src="grafiken/beispiel.svg" alt="Bildbeschreibung">\n  <figcaption>Bildlegende und Quellenangabe.</figcaption>\n</figure>',
  table:'<div class="table-scroll">\n  <table><thead><tr><th>Kriterium</th><th>Wert</th></tr></thead>\n    <tbody><tr><td>Beispiel</td><td>Erklärung</td></tr></tbody></table>\n</div>',
  quote:'<blockquote>\n  <p>Zitat oder zentraler Gedanke.</p>\n</blockquote>',
  code:'<pre><code class="language-python"># Python-Beispiel\nprint("Hallo Welt")</code></pre>',
  goal:'<div class="callout">\n  <p><strong>Lernziele:</strong> Nach diesem Abschnitt können Sie …</p>\n  <ul><li>ein Konzept erklären</li><li>ein Beispiel beurteilen</li></ul>\n</div>',
  prior:'<div class="task">\n  <p><strong>Vorwissen aktivieren</strong></p>\n  <p>Was wissen Sie bereits über dieses Thema? Notieren Sie zwei Gedanken und tauschen Sie sich aus.</p>\n</div>',
  checklist:'<div class="card">\n  <h3>Checkliste</h3>\n  <ul><li>☐ Aufgabenstellung verstanden</li><li>☐ Beispiel ausprobiert</li><li>☐ Ergebnis überprüft</li></ul>\n</div>',
  reflect:'<div class="task">\n  <p><strong>Reflexion:</strong> Was habe ich gelernt?</p>\n  <ul><li>Das habe ich verstanden: …</li><li>Das ist noch offen: …</li></ul>\n</div>',
  compare:'<div class="grid two">\n  <div class="card"><h3>Vorteile</h3><ul><li>Erster Vorteil</li><li>Zweiter Vorteil</li></ul></div>\n  <div class="card"><h3>Grenzen</h3><ul><li>Erste Grenze</li><li>Zweite Grenze</li></ul></div>\n</div>',
  reveal:'<details class="card">\n  <summary><strong>Warum ist das so? – Antwort aufklappen</strong></summary>\n  <p>Hier steht die Erklärung oder Musterlösung.</p>\n</details>',
  example:'<div class="grid two">\n  <div class="card"><h3>Begriff</h3><p>Kurze Erklärung des Konzepts.</p></div>\n  <div class="card"><h3>Beispiel</h3><p>Konkrete Anwendung aus dem Alltag.</p></div>\n</div>'
};
// Every block uses the same course classes as the published site.
const blockHelp={
  task:"Aufgabe mit hervorgehobenem Arbeitsauftrag",
  info:"Merksatz in einer Infobox",
  warning:"Auffälliger Hinweis oder Warnung",
  goal:"Zwei Lernziele mit klaren Erwartungen",
  prior:"Kurze Einstiegsfrage zum Vorwissen",
  steps:"Drei nummerierte Arbeitsschritte",
  checklist:"Übersichtliche Checkliste zum Abhaken auf Papier",
  reflect:"Rückblick mit zwei Reflexionsfragen",
  card:"Eine Karte mit Titel und Text",
  two:"Zwei Karten nebeneinander",
  three:"Drei Karten in einem Raster",
  compare:"Pro und Contra in zwei Spalten",
  figure:"Bild mit Alternativtext, Legende und Quelle",
  table:"Tabelle mit zwei Spalten",
  flow:"Eingabe, Verarbeitung und Ausgabe",
  timeline:"Zeitachse mit zwei Meilensteinen",
  quote:"Zitat als eigener Textblock",
  code:"Formatiertes Codebeispiel",
  reveal:"Frage mit ausklappbarer Erklärung",
  example:"Begriff und konkretes Beispiel nebeneinander"
};
const blockSelect=$("blockType"),blockPicker=$("blockPicker"),blockMenu=$("blockMenu");
const blockChoiceContainer=$("blockChoices"),blockPreview=$("blockPreview");
const blockOption=value=>[...blockSelect.options].find(option=>option.value===value);

function updateBlockHelp(){
  const option=blockOption(blockSelect.value);
  $("blockPickerName").textContent=option?.textContent||"Baustein wählen";
  $("blockDescription").textContent=blockHelp[blockSelect.value]||"Baustein auswählen";
  for(const button of blockChoiceContainer.querySelectorAll("[data-block]")){
    const selected=button.dataset.block===blockSelect.value;
    button.setAttribute("aria-pressed",String(selected));
  }
}
// The floating example uses the same course CSS strings as the full editor
// preview. A sandboxed iframe renders authored, static snippets without scripts.
function inspectBlock(value){
  if(!Object.hasOwn(blocks,value))return;
  const option=blockOption(value);
  $("blockPreviewTitle").textContent=option?.textContent||"Baustein";
  $("blockPreviewHint").textContent=blockHelp[value]||"Beispielansicht";
  const isBasis=state.course==="basis";
  const base=isBasis?BASIS_PREVIEW_BASE:COURSE_PREVIEW_BASE;
  const sample=previewAssets(blocks[value],base);
  const styles=COURSE_PREVIEW_CSS+(isBasis?BASIS_PREVIEW_CSS:"");
  blockPreview.srcdoc='<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+
    styles+'\nhtml,body{margin:0!important;overflow-x:hidden}body{background:var(--paper)!important;padding:12px!important;font-size:14px!important}main{display:block!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important}.section,.kapitel{display:block!important;max-width:100%!important;width:100%!important;margin:0!important;padding:0!important;box-shadow:none!important}.kapitel>*:first-child{margin-top:0!important}.lesson-steps{grid-template-columns:repeat(3,minmax(0,1fr))}.lesson-steps article{padding:8px!important}.timeline li{grid-template-columns:58px minmax(0,1fr)}.grid{gap:8px}.card{padding:12px!important}img{max-height:130px;object-fit:contain}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><main><section class="section" id="einstieg"><article class="kapitel">'+
    sample+'</article></section></main></body></html>';
}
function renderBlockChoices(){
  blockChoiceContainer.replaceChildren();
  for(const group of blockSelect.querySelectorAll("optgroup")){
    const wrapper=document.createElement("section");wrapper.className="block-choice-group";
    const heading=document.createElement("h3");heading.textContent=group.label;
    wrapper.append(heading);
    for(const option of group.querySelectorAll("option")){
      const button=document.createElement("button");button.type="button";
      button.className="block-choice";
      button.dataset.block=option.value;
      button.textContent=option.textContent;
      button.addEventListener("pointerenter",()=>inspectBlock(option.value));
      button.addEventListener("focus",()=>inspectBlock(option.value));
      button.addEventListener("click",()=>{
        blockSelect.value=option.value;
        blockSelect.dispatchEvent(new Event("change",{bubbles:true}));
        setBlockMenuOpen(false);
        blockPicker.focus();
      });
      wrapper.append(button);
    }
    blockChoiceContainer.append(wrapper);
  }
  updateBlockHelp();
}
function setBlockMenuOpen(open,focus=false){
  blockMenu.hidden=!open;
  blockPicker.setAttribute("aria-expanded",String(open));
  if(open){
    inspectBlock(blockSelect.value);
    if(focus)blockChoiceContainer.querySelector('[aria-pressed="true"]')?.focus();
  }
}
blockPicker.addEventListener("click",()=>setBlockMenuOpen(blockMenu.hidden));
blockSelect.addEventListener("change",updateBlockHelp);
blockChoiceContainer.addEventListener("keydown",event=>{
  if(!["ArrowDown","ArrowUp","Home","End"].includes(event.key))return;
  const choices=[...blockChoiceContainer.querySelectorAll("button[data-block]")];
  const current=choices.indexOf(document.activeElement);
  const next=event.key==="Home"?0:event.key==="End"?choices.length-1:
    (current+(event.key==="ArrowDown"?1:-1)+choices.length)%choices.length;
  event.preventDefault();choices[next]?.focus();
});
blockPicker.addEventListener("keydown",event=>{
  if(event.key==="ArrowDown"||event.key==="ArrowUp"){
    event.preventDefault();
    setBlockMenuOpen(true,true);
  }
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&!blockMenu.hidden){
    event.preventDefault();setBlockMenuOpen(false);blockPicker.focus();
  }
});
document.addEventListener("pointerdown",event=>{
  if(!blockMenu.hidden&&!$("toolbar").querySelector(".toolbar-template").contains(event.target))
    setBlockMenuOpen(false);
});
renderBlockChoices();

function insertBlock(){
  const value=$("blockType").value;
  if(!Object.hasOwn(blocks,value))return status("Unbekannter Baustein.",true);
  insert("\n\n"+blocks[value]+"\n\n");
  status("Baustein eingefügt – Änderungen vormerken, bevor sie veröffentlicht werden.");
}

$("addImage").addEventListener("click",()=>$("imageFile").click());
$("addBlock").addEventListener("click",insertBlock);
$("imageFile").addEventListener("change",addImage);
$("logout").addEventListener("click",async()=>{try{await post("/auth/logout",{});location.assign("/");}catch(e){error(e);}});
window.addEventListener("beforeunload",e=>{if(state.staged.size||(state.current&&$("source").value!==savedText())){e.preventDefault();e.returnValue="";}});
if (!pagesOrigin) (async()=>{
  try{
    const s=await api("/api/session");
    $("intro").hidden=s.authenticated;$("login").hidden=s.authenticated;$("logout").hidden=!s.authenticated;
    $("who").textContent=s.authenticated?"GitHub: "+s.login:"Nicht angemeldet";
    if(!s.authenticated){status("Mit GitHub anmelden, um Kapitel zu bearbeiten.");return;}
    $("workspace").hidden=false;await refresh();status("Angemeldet. Kapitel auswählen.");
  }catch(e){$("login").hidden=true;$("intro").hidden=false;error("Admin-Gateway nicht verbunden: "+e.message);}
})();
