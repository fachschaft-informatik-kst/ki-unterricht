/* Admin editor: browser UI never receives GitHub secrets or tokens. */
const $=id=>document.getElementById(id);
const state={chapters:[],current:null,staged:new Map()};
const sections=["einstieg","lernarten","perzeptron","netze","projekt","sprache","gesellschaft"];
function status(message,error=false){$("notice").textContent=message;$("notice").classList.toggle("error",error);}
function error(err){status(String(err.message||err),true);}
async function api(url,options={}){
  const response=await fetch(url,{credentials:"same-origin",cache:"no-store",...options});
  const data=await response.json().catch(()=>({error:"Admin-Gateway nicht eingerichtet."}));
  if(!response.ok)throw Error(data.error||"Serverfehler "+response.status);
  return data;
}
const post=(url,value)=>api(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(value)});
const slug=text=>text.trim().toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const filename=path=>path.split("/").pop().replace(".md","");
function stagingList(){
  const node=$("staged");node.replaceChildren();
  if(!state.staged.size){const li=document.createElement("li");li.textContent="Keine Änderungen vorgemerkt.";node.append(li);return;}
  for(const c of state.staged.values()){
    const li=document.createElement("li");
    li.textContent=(c.delete?"Archivieren: ":"Ändern: ")+c.path+" ";
    const remove=document.createElement("button");remove.type="button";remove.textContent="Entfernen";
    remove.addEventListener("click",()=>{state.staged.delete(c.path);stagingList();});
    li.append(remove);node.append(li);
  }
}
function chapterList(){
  const nav=$("chapters");nav.replaceChildren();
  const prefix="kursseiten/"+$("section").value+"/";
  for(const item of state.chapters.filter(c=>c.path.startsWith(prefix))){
    const button=document.createElement("button");button.type="button";
    button.textContent=filename(item.path);button.setAttribute("aria-current",String(state.current?.path===item.path));
    button.addEventListener("click",()=>load(item.path));nav.append(button);
  }
}
function useFile(path,sha,content,original=content){
  state.current={path,sha,original};
  $("path").textContent=path;$("heading").textContent=filename(path);
  $("source").value=content;$("move").disabled=!sha;$("archive").disabled=!sha;
  chapterList();preview();
}
function savedText(){return state.current?state.staged.get(state.current.path)?.content??state.current.original:"";}
async function load(path){
  if(state.current&&$("source").value!==savedText()&&!confirm("Nicht vorgemerkte Änderungen verwerfen?"))return;
  try{
    status("Lade Kapitel …");
    const staged=state.staged.get(path);
    if(staged&&!staged.delete)useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);
    else{const file=await api("/api/file?path="+encodeURIComponent(path));useFile(path,file.sha,file.content);}
    status("Kapitel bereit. Nach dem Speichern einen Pull Request erstellen.");
  }catch(e){error(e);}
}
async function refresh(){
  const data=await api("/api/chapters");
  state.chapters=data.chapters.sort((a,b)=>a.path.localeCompare(b.path));
  const valid=[...new Set(state.chapters.map(c=>c.path.split("/")[1]))].filter(x=>sections.includes(x));
  const previous=$("section").value;
  $("section").replaceChildren();
  for(const value of valid){const option=document.createElement("option");option.value=value;option.textContent=value;$("section").append(option);}
  $("section").value=valid.includes(previous)?previous:state.current?.path.split("/")[1]||valid[0]||"";
  chapterList();
}
function insert(text){
  const source=$("source");source.focus();
  const start=source.selectionStart,end=source.selectionEnd;
  source.setRangeText(text,start,end,"end");preview();
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function inline(s){
  let out=escapeHtml(s);
  out=out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,(_,caption,url)=>'<img alt="'+caption+'" src="'+url+'">');
  out=out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(_,label,url)=>'<a href="'+url+'">'+label+'</a>');
  return out.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
}
function markdown(source){
  const lines=source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,"").split(/\r?\n/);
  let list=false;const out=[];
  for(const raw of lines){
    const s=raw.trim();
    if(!s){if(list){out.push("</ul>");list=false;}continue;}
    if(s.startsWith("<")){if(list){out.push("</ul>");list=false;}out.push(raw);continue;}
    const heading=s.match(/^(#{1,5})\s+(.+)$/);
    if(heading){if(list){out.push("</ul>");list=false;}const n=heading[1].length;out.push("<h"+n+">"+inline(heading[2])+"</h"+n+">");continue;}
    if(/^[-*] /.test(s)){if(!list){out.push("<ul>");list=true;}out.push("<li>"+inline(s.slice(2))+"</li>");continue;}
    if(list){out.push("</ul>");list=false;}out.push("<p>"+inline(s)+"</p>");
  }
  if(list)out.push("</ul>");
  return out.join("\n");
}
function preview(){
  let content=$("source").value;
  if(content.includes("<!-- MD:START -->"))
    content=content.replace(/<!-- MD:START -->([\s\S]*?)<!-- MD:END -->/g,(_,text)=>markdown(text));
  else if(!/^\s*<details\b/.test(content)&&!/^\s*<section\b/.test(content))
    content=markdown(content);
  const stylesheet='<style>body{font:15px/1.55 system-ui;margin:22px;color:#192f32}img{max-width:100%;height:auto}details{padding:15px;border:1px solid #ddd}summary{cursor:pointer}textarea{min-height:70px;width:90%}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}a{color:#076959}</style>';
  // A sandbox WITHOUT allow-scripts and allow-same-origin isolates source HTML.
  $("preview").srcdoc='<!doctype html><html lang="de"><head><meta charset="utf-8"><base href="https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/">'+stylesheet+'</head><body>'+content+"</body></html>";
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
    const section=$("section").value;
    const title=prompt("Titel des neuen Unterkapitels:");if(!title)return;
    const number=prompt("Sichtbare Kapitelnummer (z. B. 3a):");if(!number)return;
    if(!/^\d+[a-z]?$/.test(number))throw Error("Kapitelnummer muss z. B. 3 oder 3a sein.");
    const after=prompt("Nach welchem Dateipräfix einfügen (z. B. 030)? Leer = anhängen:","");if(after===null)return;
    const numberPrefix=String(availableOrder(section,after.trim())).padStart(3,"0");
    const name=slug(title);if(!name)throw Error("Ungültiger Titel.");
    const path="kursseiten/"+section+"/"+numberPrefix+"-"+name+".md";
    if(state.chapters.some(c=>c.path===path)||state.staged.has(path))throw Error("Kapitel existiert.");
    const doc="---\ntype: chapter\nid: "+section+"-"+name+"\nnummer: "+JSON.stringify(number)+"\ntitel: "+JSON.stringify(title)+"\nkurz: "+JSON.stringify(title)+"\nopen: true\n---\n\nText hier bearbeiten.\n\n## Auftrag\n\nAufgabe formulieren.\n";
    state.chapters.push({path,sha:null});state.chapters.sort((a,b)=>a.path.localeCompare(b.path));
    useFile(path,null,doc);status("Neues Kapitel angelegt; zuerst vormerken, dann Pull Request erstellen.");
  }catch(e){error(e);}
}
function stage(){
  const c=state.current;if(!c)throw Error("Kein Kapitel geladen.");
  const content=$("source").value;if(!content.trim())throw Error("Kapitel darf nicht leer sein.");
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
  if(!confirm("Kapitel archivieren? Es verschwindet aus dem Schülerkurs; ältere Lesezeichen funktionieren dann nicht mehr."))return;
  const to="kursseiten/_archiv/"+c.path.slice("kursseiten/".length);
  state.staged.set(c.path,{path:c.path,expectedSha:c.sha,delete:true});
  state.staged.set(to,{path:to,expectedSha:null,content:$("source").value});
  stagingList();status("Archivierung vorgemerkt.");
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
async function addImage(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
    if(file.size>3000000)throw Error("Maximal 3 MB pro Bild.");
    const ext={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"}[file.type];
    if(!ext)throw Error("Nur PNG, JPG oder WebP verwenden.");
    const name=(slug(file.name.replace(/\.[^.]+$/,""))||"bild").slice(0,42)+"-"+crypto.randomUUID().slice(0,8)+"."+ext;
    const bytes=new Uint8Array(await file.arrayBuffer());
    let chars="";for(let i=0;i<bytes.length;i+=8192)chars+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const path="projekt/grafiken/uploads/"+name;
    state.staged.set(path,{path,expectedSha:null,content:btoa(chars)});
    const caption=prompt("Bildbeschreibung:",file.name)||"Illustration";
    insert("\n\n!["+caption.replaceAll("]","")+"](grafiken/uploads/"+name+")\n\n");
    stagingList();status("Bild vorgemerkt. Wird zusammen mit dem Kapitel veröffentlicht.");
  }catch(e){error(e);}finally{event.target.value="";}
}
async function publish(){
  if(!state.staged.size)return status("Zuerst Änderungen vormerken.",true);
  $("publish").disabled=true;
  try{
    const c=state.current;
    if(c&&!state.staged.get(c.path)?.delete&&$("source").value!==savedText()&&!stage())return;
    status("Pull Request wird bei GitHub erstellt …");
    const changes=[...state.staged.values()].map(c=>c.delete?
      {path:c.path,expectedSha:c.expectedSha,delete:true}:
      {path:c.path,expectedSha:c.expectedSha,content:c.content});
    const result=await post("/api/publish",{title:$("prTitle").value,changes});
    state.staged.clear();stagingList();
    const out=$("published");out.replaceChildren("Pull Request #"+result.number+": ");
    const link=document.createElement("a");link.href=result.url;link.rel="noopener noreferrer";link.target="_blank";link.textContent="Auf GitHub öffnen";out.append(link);
    status("Pull Request erstellt. Nach Merge und grünen CI-Tests wird veröffentlicht.");
    await refresh();
  }catch(e){error(e);}finally{$("publish").disabled=false;}
}
$("section").addEventListener("change",chapterList);
$("refresh").addEventListener("click",()=>refresh().catch(error));
$("create").addEventListener("click",addChapter);
$("move").addEventListener("click",move);
$("archive").addEventListener("click",archive);
$("source").addEventListener("input",()=>{});
$("previewButton").addEventListener("click",preview);
$("stage").addEventListener("click",()=>{try{stage();}catch(e){error(e);}});
$("publish").addEventListener("click",publish);
$("addHeading").addEventListener("click",()=>insert("\n\n## Neue Zwischenüberschrift\n\n"));
$("addAnswer").addEventListener("click",()=>{
  const question=prompt("Frage an die Lernenden:");if(!question)return;
  const id="aufgabe_"+slug(question).slice(0,26)+"_"+crypto.randomUUID().slice(0,7);
  insert('\n\n<label class="field answer"><span>'+escapeHtml(question)+
    '</span><textarea aria-label="'+escapeHtml(question)+'" data-answer="'+id+'" rows="4"></textarea></label>\n\n');
});
$("addImage").addEventListener("click",()=>$("imageFile").click());
$("imageFile").addEventListener("change",addImage);
$("logout").addEventListener("click",async()=>{try{await post("/auth/logout",{});location.assign("/");}catch(e){error(e);}});
window.addEventListener("beforeunload",e=>{if(state.staged.size||(state.current&&$("source").value!==savedText())){e.preventDefault();e.returnValue="";}});
(async()=>{
  try{
    const s=await api("/api/session");
    $("intro").hidden=s.authenticated;$("login").hidden=s.authenticated;$("logout").hidden=!s.authenticated;
    $("who").textContent=s.authenticated?"GitHub: "+s.login:"Nicht angemeldet";
    if(!s.authenticated){status("Mit GitHub anmelden, um Kapitel zu bearbeiten.");return;}
    $("workspace").hidden=false;await refresh();status("Angemeldet. Kapitel auswählen.");
  }catch(e){$("login").hidden=true;$("intro").hidden=false;error("Admin-Gateway nicht verbunden: "+e.message);}
})();
