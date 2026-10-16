import {createPlanner} from "./plan-editor.js";
// The public Pages origin has no authenticated API. Send editors to the Worker origin.
const pagesOrigin = location.hostname === "fachschaft-informatik-kst.github.io";
if (pagesOrigin) location.replace("https://kst-ki-admin.kevin-bohn.workers.dev/" + location.search + location.hash);
/* Admin editor: browser UI never receives GitHub secrets or tokens. */
const $=id=>document.getElementById(id);
const state={chapters:[],current:null,staged:new Map()};
const planner=createPlanner($("planEditor"),content=>{$("source").value=content;});
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
  const isPlan=path==="projekt/kurs.json";
  $("source").value=content;
  $("move").disabled=!sha||isPlan;$("archive").disabled=!sha||isPlan;
  for(const id of ["toolbar","editorHelper","sourceLabel","previewButton","previewHeading","preview"])
    $(id).hidden=isPlan;
  $("source").hidden=isPlan;
  if(isPlan)planner.open(content,$("section").value);
  else {planner.close();preview();}
  chapterList();
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
  const known=data.chapters.filter(c=>!state.staged.get(c.path)?.delete);
  // A refresh must not discard newly created (as yet unmerged) lesson chapters.
  const pending=[...state.staged.values()].filter(c=>c.path.startsWith("kursseiten/")&&!c.delete&&!known.some(k=>k.path===c.path))
    .map(c=>({path:c.path,sha:c.expectedSha}));
  const unsubmitted=state.chapters.filter(c=>!c.sha&&!state.staged.has(c.path)&&!known.some(k=>k.path===c.path));
  state.chapters=[...known,...pending,...unsubmitted].sort((a,b)=>a.path.localeCompare(b.path));
  const valid=[...new Set(state.chapters.map(c=>c.path.split("/")[1]))].filter(x=>sections.includes(x)||/^dl-\d{2}$/.test(x));
  const previous=$("section").value;
  $("section").replaceChildren();
  for(const value of valid){const option=document.createElement("option");option.value=value;option.textContent=value;$("section").append(option);}
  const currentSection=state.current?.path.split("/")[1];
  $("section").value=valid.includes(previous)?previous:(valid.includes(currentSection)?currentSection:valid[0]||"");
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
  out=out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^)]*)&quot;)?\)/g,(_,caption,url,title)=>'<img alt="'+caption+'" src="'+url+'"'+(title?' title="'+title+'"':"")+'>');
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
const COURSE_PREVIEW_BASE = "https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/";
const COURSE_PREVIEW_CSS = "\n:root{--ink:#182b31;--muted:#52656a;--paper:#f5f4ee;--white:#fff;--line:#d8dfdb;--accent:#076959;--soft:#e7f1eb;--orange:#b84d27;--orange-soft:#fff0e7;--radius:16px;--nav:244px}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:30px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif}a{color:var(--accent);text-underline-offset:4px}a:hover{text-decoration-thickness:2px}button,input,select,textarea{font:inherit}button,a,input,select,textarea,summary{-webkit-tap-highlight-color:transparent}:focus-visible{outline:3px solid #ba552e;outline-offset:4px}button{cursor:pointer}button:disabled{opacity:.6;cursor:wait}h1,h2,h3,p{margin-top:0}h1,h2,h3{line-height:1.15;letter-spacing:-.035em}h1{font-size:clamp(2.8rem,5.2vw,4.7rem);max-width:800px;margin-bottom:26px;font-weight:750}h2{font-size:clamp(1.8rem,3vw,2.45rem);margin-bottom:14px}h3{font-size:1.17rem;letter-spacing:-.015em}p{margin-bottom:16px}.skip{position:absolute;left:20px;top:-100px;background:white;padding:12px;z-index:100}.skip:focus{top:10px}.sidebar{position:fixed;inset:0 auto 0 0;width:var(--nav);background:var(--white);border-right:1px solid var(--line);padding:32px 22px;display:flex;flex-direction:column;z-index:5;overflow:auto}.brand{font-weight:750;font-size:18px;letter-spacing:-.02em;text-decoration:none;color:var(--ink);display:flex;align-items:center;gap:11px}.mark{display:inline-grid;place-items:center;background:var(--accent);color:white;border-radius:9px;width:36px;height:36px;font-size:14px;letter-spacing:.02em}.brand small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-weight:500}.nav{display:grid;gap:5px;margin-top:38px}.nav a{padding:9px 12px;border-radius:7px;text-decoration:none;color:var(--muted);font-size:14px}.nav a[aria-current],.nav a:hover{background:var(--soft);color:var(--accent)}.nav span{display:inline-block;width:24px;color:#768880;font-size:11px}.sidebar-bottom{margin-top:auto;padding-top:28px;font-size:12px;color:var(--muted)}.sidebar-bottom a{display:block;margin-top:8px}.shell{margin-left:var(--nav)}main{max-width:1180px;margin:auto;padding:46px 54px 80px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}.crumb{font-size:12px;color:var(--muted);margin-bottom:42px}.hero{padding-bottom:48px;border-bottom:1px solid var(--line)}.hero p.lead{font-size:19px;max-width:720px;color:var(--muted)}.hero h1 em{font-style:normal;color:var(--accent)}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);background:var(--white);border-radius:8px;padding:11px 17px;font-weight:650;font-size:14px;color:var(--ink);text-decoration:none;line-height:1.5}.btn.primary{background:var(--accent);border-color:var(--accent);color:white}.btn:hover{filter:brightness(.96);text-decoration:none}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:35px}.fact{border-left:2px solid var(--line);padding-left:15px}.fact strong{display:block;font-size:22px;font-weight:700;line-height:1.2}.fact small{color:var(--muted);font-size:12px}.section{padding:55px 0;border-bottom:1px solid var(--line);scroll-margin-top:26px}.section-intro{max-width:760px;color:var(--muted);margin-bottom:26px}.section-label{font:650 12px/1.4 system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:13px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.card{border:1px solid var(--line);background:white;border-radius:var(--radius);padding:24px;min-width:0}.card p:last-child{margin-bottom:0}.muted{color:var(--muted)}.small{font-size:13px}.tag{display:inline-block;font-size:11px;line-height:1.4;font-weight:650;border:1px solid var(--line);border-radius:30px;padding:4px 9px;letter-spacing:.01em;color:var(--muted);margin-bottom:12px}.tag.green{color:var(--accent);background:var(--soft);border-color:transparent}.tag.orange{color:#963b19;background:var(--orange-soft);border-color:transparent}.callout{padding:20px 23px;border-left:3px solid var(--accent);background:var(--soft);border-radius:0 10px 10px 0;margin:22px 0}.callout p:last-child{margin-bottom:0}.callout.warn{background:var(--orange-soft);border-color:var(--orange)}.flow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:25px}.flow .card{padding:19px}.flow strong{display:block;margin:7px 0}.flow .step{font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.09em}.progress-card{background:var(--ink);color:white;padding:23px 27px;border-radius:var(--radius);margin:24px 0}.progress-title{display:flex;gap:16px;justify-content:space-between;align-items:center}.progress-card p{font-size:12px;margin:8px 0 0;color:#d6e3dc}progress{width:100%;height:8px;border:0;border-radius:8px;overflow:hidden;background:#46605f;accent-color:#a6d9b4;margin-top:15px}progress::-webkit-progress-bar{background:#46605f}progress::-webkit-progress-value{background:#a6d9b4}details{border:1px solid var(--line);border-radius:12px;background:white;margin:10px 0;overflow:hidden}summary{padding:19px 22px;cursor:pointer;font-weight:650;list-style:none;display:flex;align-items:center;gap:14px}summary::-webkit-details-marker{display:none}summary::after{content:'+';margin-left:auto;font-weight:400;font-size:23px;color:var(--accent)}details[open]>summary::after{content:'−'}details[open]>summary{border-bottom:1px solid var(--line)}.phase-num{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;background:var(--soft);color:var(--accent);border-radius:50%;font-size:12px}.detail-body{padding:22px 25px}.detail-body ul{padding-left:20px;margin-top:0}.check{display:flex;gap:12px;align-items:flex-start;cursor:pointer;margin:12px 0;line-height:1.5}.check input{width:19px;height:19px;margin-top:3px;flex:0 0 19px;accent-color:var(--accent)}.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:white}table{border-collapse:collapse;width:100%;font-size:14px;text-align:left}th,td{padding:16px 18px;border-bottom:1px solid var(--line);vertical-align:top}thead th{background:#edf1ec;font-size:12px;font-weight:700;white-space:nowrap}tbody tr:last-child>*{border-bottom:0}tbody th{font-weight:650}.date{white-space:nowrap;font-weight:650}.topic-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:20px}input[type=search],select,textarea{border:1px solid #aebeb5;background:white;border-radius:8px;padding:10px 12px;max-width:100%;color:var(--ink)}input[type=search]{min-width:260px;flex:1}textarea{width:100%;min-height:110px;resize:vertical}.topic h3{margin-bottom:12px}.topic p{font-size:14px}.topic .btn{margin-top:8px;font-size:12px}.topic.is-chosen{border:2px solid var(--accent);padding:23px}.empty{padding:20px;border:1px dashed var(--line)}.plan{margin-top:22px}.field{display:grid;gap:6px;margin:16px 0}.field>span{font-size:13px;font-weight:650}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips button{background:white;border:1px solid var(--line);border-radius:8px;padding:9px 14px;font-size:13px;color:var(--ink)}.chips button[aria-pressed=true]{background:var(--accent);color:white;border-color:var(--accent)}.groups{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:20px 0}.group-box{border-radius:9px;text-align:center;padding:17px 3px;font-size:12px;border:1px solid var(--line);background:white}.group-box strong{display:block;font-size:14px}.group-box.train{background:var(--soft);border-color:#92b9a7}.group-box.val{background:#e6edf9;border-color:#a7b9d7}.group-box.test{background:var(--orange-soft);border-color:#d9b9a4}.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--muted)}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}.experiment{background:white;border:1px solid var(--line);border-radius:var(--radius);padding:26px;margin-top:18px}.experiment .versus{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0}.variant{border:1px solid var(--line);border-radius:10px;padding:20px;background:#fafbf8}.variant strong{display:block;font-size:24px;margin-top:9px}.gradebar{display:flex;min-height:62px;border-radius:11px;overflow:hidden;margin:22px 0}.gradebar div{padding:12px 8px;text-align:center;color:white;font-size:13px;line-height:1.3;min-width:0}.gradebar b{display:block;font-size:20px}.gradebar div:nth-child(1){background:#557567;flex:15}.gradebar div:nth-child(2){background:#216a60;flex:20}.gradebar div:nth-child(3){background:#0c4946;flex:25}.gradebar div:nth-child(4){background:#263b43;flex:40}.skill-row{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:25px;padding:21px 0;border-bottom:1px solid var(--line)}.skill-row h3{font-size:16px;margin-bottom:6px}.skill-row p{font-size:13px;margin-bottom:0}.skill-row select{width:100%;align-self:center;font-size:13px}.skill-row:last-child{border-bottom:0}.resource{display:flex;gap:18px;align-items:flex-start}.resource .resource-icon{background:var(--soft);color:var(--accent);padding:7px 11px;border-radius:7px;font-size:16px}.resource a{font-weight:650}.resource p{font-size:13px;margin:7px 0 0}.footer{padding:24px 0 0;color:var(--muted);font-size:12px}.footer a{margin-right:18px}[hidden]{display:none!important}.js-only{display:none}.has-js .js-only{display:block}.has-js .js-flex{display:flex}.status{font-size:12px;color:var(--muted);min-height:1.5em}.noscript{background:var(--orange-soft);padding:15px}.print-note{display:none}\n@media(min-width:1500px){main{padding-left:70px;padding-right:70px}}@media(max-width:1050px){:root{--nav:205px}main{padding:35px 28px 60px}.sidebar{padding:27px 16px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.facts{gap:10px}.groups{grid-template-columns:repeat(4,1fr)}.fact strong{font-size:19px}.flow{grid-template-columns:1fr}.flow .card{display:flex;gap:18px;align-items:center}.flow strong{font-size:15px}.flow p{margin:0;font-size:13px}}@media(max-width:720px){html{scroll-padding-top:90px}.sidebar{position:sticky;top:0;width:100%;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:12px 18px;overflow:visible}.brand{font-size:15px}.brand small{font-size:10px}.mark{width:29px;height:29px}.nav{display:flex;overflow-x:auto;gap:4px;margin:10px -8px -3px;padding:0 0 3px}.nav a{flex:0 0 auto;font-size:12px;padding:6px 8px}.nav span{display:none}.sidebar-bottom{display:none}.shell{margin:0}main{padding:25px 20px 50px}.crumb{margin-bottom:28px}h1{font-size:2.8rem}.hero p.lead{font-size:17px}.facts{grid-template-columns:1fr 1fr;row-gap:22px}.section{padding:38px 0;scroll-margin-top:100px}.grid,.grid.two{grid-template-columns:1fr}.card{padding:21px}.skill-row{grid-template-columns:1fr;gap:12px}.skill-row select{width:100%}.experiment{padding:18px}.variant{padding:15px}.variant strong{font-size:19px}.gradebar span{font-size:10px}.gradebar b{font-size:17px}summary{padding:16px 17px;font-size:14px}.detail-body{padding:18px}.groups{gap:5px}.group-box{font-size:11px}.topic-controls input{min-width:0;width:100%}.progress-title{font-size:14px}.table-wrap table{min-width:520px}.hero{padding-bottom:32px}}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{body{background:white;font-size:11px;color:black}.sidebar,.actions,.chips,.topic-controls,.topic .btn,.js-only,.js-flex,.skip,.footer button,.progress-card{display:none!important}.shell{margin:0}main{max-width:none;padding:0}.section{padding:20px 0;break-inside:auto}h1{font-size:32px}h2{font-size:23px}h3{font-size:15px}.hero{padding-bottom:20px}.crumb{margin-bottom:12px}.grid{grid-template-columns:repeat(2,1fr)}.card,details,.skill-row{break-inside:avoid}.table-wrap{overflow:visible}.table-wrap table{min-width:0}th,td{padding:8px}.print-note{display:block}.topic[hidden],[data-experiment][hidden]{display:block!important}.btn{padding:4px;border:0}.detail-body{display:block!important}.gradebar{print-color-adjust:exact;-webkit-print-color-adjust:exact}.skill-row select{appearance:none;border:0;font-size:11px}.callout{background:#f3f3f3}.check input{width:12px;height:12px}a{color:black}.plan textarea{min-height:50px}}\n\n/* Focused views: one project area at a time; all information remains printable. */\n.overview-path{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:32px 0 18px}.overview-path a{display:grid;gap:9px;padding:24px;background:white;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink)}.overview-path b{font-size:30px;color:var(--accent);font-weight:500}.overview-path strong{font-size:19px}.overview-path span,.overview-note{font-size:13px;color:var(--muted)}.topic-icon{display:block;font-size:30px;margin-bottom:12px}.topic details{border:0;border-top:1px solid var(--line);border-radius:0}.topic summary{padding:10px 0;font-size:12px}.topic details p{padding:8px 0}.skill-row details{border:0;margin:3px 0 0}.skill-row summary{padding:3px 0;font-size:12px;color:var(--muted)}.skill-row .detail-body{padding:8px 0}.section{padding-top:10px;border-bottom:0}.hero{border:0}.crumb{margin-bottom:25px}.section-intro{font-size:17px}.footer{border-top:1px solid var(--line);margin-top:25px}.has-js .view-hidden{display:none}.section:focus,.hero:focus{outline:none}\n@media(max-width:720px){.overview-path{grid-template-columns:1fr;gap:9px}.overview-path a{grid-template-columns:35px 1fr;padding:15px;gap:4px 12px}.overview-path b{grid-row:span 2;font-size:25px}.overview-path strong{font-size:16px}.overview-path span{grid-column:2}.section{padding-top:5px}.hero h1{font-size:2.3rem}}\n@media print{.has-js .view-hidden{display:block!important}.overview-path{grid-template-columns:repeat(3,1fr)}.overview-path a{padding:12px}.topic details p{display:block}.section{padding-top:22px}}\n";
// Resolve images just like the built course pages: their URLs are relative to /projekt/,
// NOT to the Markdown file in /kursseiten/ or to the worker's root.
function previewAssets(content){
  const doc = new DOMParser().parseFromString("<main>"+content+"</main>","text/html");
  const root=doc.querySelector("main");
  for(const el of root.querySelectorAll("[src]")){
    const value=el.getAttribute("src");
    if(!value || /^(?:data:|blob:|https?:\/\/)/i.test(value))continue;
    // The published course treats grafiken/* as relative to the /projekt/ root.
    const absolute=new URL(value,COURSE_PREVIEW_BASE);
    if(absolute.origin===new URL(COURSE_PREVIEW_BASE).origin)
      el.setAttribute("src",absolute.href);
  }
  return root.innerHTML;
}
function preview(){
  let content=$("source").value;
  if(content.includes("<!-- MD:START -->"))
    content=content.replace(/<!-- MD:START -->([\s\S]*?)<!-- MD:END -->/g,(_,text)=>markdown(text));
  else if(!/^\s*<(?:details|section)\b/.test(content))
    content=markdown(content);
  content=previewAssets(content);
  // Display staged image uploads without uploading or executing their content.
  for(const item of state.staged.values()){
    if(!item.path.startsWith("projekt/grafiken/uploads/")||item.delete)continue;
    const url=COURSE_PREVIEW_BASE+item.path.replace(/^projekt\//,"");
    const extension=item.path.split(".").pop();
    const mime=extension==="jpg"||extension==="jpeg"?"jpeg":extension;
    content=content.replaceAll(url,"data:image/"+mime+";base64,"+item.content);
  }
  // Keep scripts disabled and the iframe on an opaque sandbox origin.
  // Apply the actual published course CSS inside the same section/topic hierarchy.
  const stylesheet="<style>"+COURSE_PREVIEW_CSS+"\nbody{margin:0}main#inhalt{margin:0;width:100%;max-width:none;min-width:0;padding:22px}.section{margin:0;padding:0}.topic{margin:0;max-width:none}img{max-width:100%;height:auto}</style>";
  $("preview").srcdoc='<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+COURSE_PREVIEW_BASE+'">'+stylesheet+'</head><body><main id="inhalt"><section class="section"><div class="topic">'+content+'</div></section></main></body></html>';
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
  const content=$("source").value;if(!content.trim())throw Error("Kapitel darf nicht leer sein.");
  if(c.path==="projekt/kurs.json"){
    planner.validate(content);
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
  if(!path.startsWith("lehrperson/"))return "";
  let id=path.match(/ergaenzungen\/dl-(\d{2})\.md$/)?.[1];
  if(!id){
    const previous=$("source").value.slice(0,$("source").selectionStart);
    id=[...previous.matchAll(/^## Doppellektion (\d+)\s*$/gm)].at(-1)?.[1];
  }
  if(!id)throw Error("Bild in den Materialien unter einer Doppellektion-Überschrift einfügen.");
  const json=state.staged.get("projekt/kurs.json")?.content||
    (await api("/api/file?path=projekt/kurs.json")).content;
  const lesson=JSON.parse(json).lessons.find(l=>Number(l.id)===Number(id));
  if(!lesson)throw Error("Doppellektion "+id+" im Unterrichtsplan nicht gefunden.");
  const phases=lesson.phases.map(p=>p.phase);
  const phase=prompt("AVIVA-Phase für Doppellektion "+Number(id)+":\n"+phases.join(" / "),phases[0]);
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
    const c=state.current;
    if(c&&!state.staged.get(c.path)?.delete&&$("source").value!==savedText()&&!stage())return;
    status("Pull Request wird bei GitHub erstellt …");
    const changes=[...state.staged.values()].map(c=>c.delete?
      {path:c.path,expectedSha:c.expectedSha,delete:true}:
      {path:c.path,expectedSha:c.expectedSha,content:c.content});
    const result=await post("/api/publish",{title:$("prTitle").value,changes});
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
    const path="projekt/kurs.json",staged=state.staged.get(path);
    if(staged&&!staged.delete){useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);return;}
    const file=await api("/api/file?path="+encodeURIComponent(path));
    useFile(path,file.sha,file.content);status("AVIVA-Plan als Formular bearbeiten: pro Doppellektion fünf Phasen und insgesamt 90 Minuten.");
  }catch(e){error(e);}
}
async function editMaterials(){
  try{
    if(!confirmUnsaved())return;
    const section=$("section").value;
    const path=/^dl-\d{2}$/.test(section)?"lehrperson/ergaenzungen/"+section+".md":"lehrperson/materialien.md";
    const staged=state.staged.get(path);
    if(staged&&!staged.delete){useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);return;}
    const file=await api("/api/file?path="+encodeURIComponent(path));
    useFile(path,file.sha,file.content);status("Lehrpersonenmaterial bearbeiten. Ergänzungen werden beim nächsten Build generiert.");
  }catch(e){error(e);}
}

function confirmUnsaved(){
  return !(state.current&&$("source").value!==savedText())||
    confirm("Nicht vorgemerkte Änderungen verwerfen? Bitte vorher «Änderung vormerken» wählen.");
}
function lessonPlan(id,title,view){
  const labels=["Ankommen","Vorwissen aktivieren","Informieren","Verarbeiten","Auswerten"];
  const minutes=[5,10,15,50,10];
  return {
    id,title,view,goal:"Lernziel für diese Doppellektion formulieren.",
    question:"Leitfrage für diese Doppellektion formulieren.",
    motivation:"Begründen, weshalb dieses Thema relevant ist.",
    product:"Ein begründetes Lernergebnis.",
    phases:labels.map((phase,i)=>({
      phase,titel:phase,minutes:minutes[i],
      schritte:[
        {wer:"Lehrperson",min:minutes[i]-1,text:"Arbeitsauftrag und Ablauf festlegen.",art:"Auftrag"},
        {wer:"Ergebnis",min:1,text:"Ergebnis festhalten.",art:"Ergebnis"}
      ]
    }))
  };
}
async function addLesson(){
  try{
    if(!confirmUnsaved())return;
    status("Lade aktuelle Unterrichtsplanung …");
    const file=await api("/api/file?path=projekt/kurs.json");
    const staged=state.staged.get("projekt/kurs.json");
    const original=JSON.parse(staged?.content||file.content);
    const committed=JSON.parse(file.content);
    if(original.lessons.length!==committed.lessons.length)
      throw Error("Eine neue Doppellektion ist bereits vorgemerkt. Pro Pull Request ist nur eine möglich.");
    const next=original.lessons.length+1;
    if(next>99)throw Error("Es werden maximal 99 Doppellektionen unterstützt.");
    const id=String(next).padStart(2,"0"),view="dl-"+id;
    const title=prompt("Titel der neuen Doppellektion "+next+":");
    if(!title)return;
    const chapterTitle=prompt("Titel des ersten Unterkapitels:","Einstieg und Auftrag");
    if(!chapterTitle)return;
    if(!title.trim()||!slug(chapterTitle))throw Error("Titel und Kapitelname dürfen nicht leer sein.");
    const lesson=lessonPlan(id,title.trim(),view);
    original.lessons.push(lesson);
    const metadata="projekt/kurs.json";
    state.staged.set(metadata,{path:metadata,expectedSha:file.sha,original:file.content,content:JSON.stringify(original,null,2)+"\n"});
    const chapter="kursseiten/"+view+"/010-"+slug(chapterTitle)+".md";
    const chapterSource="---\ntype: chapter\nid: "+view+"-"+slug(chapterTitle)+
      "\nnummer: \"1\"\ntitel: "+JSON.stringify(chapterTitle)+
      "\nkurz: "+JSON.stringify(chapterTitle)+"\nopen: true\n---\n\n"+
      "## Lernauftrag\n\nHier die Aufgabe beschreiben.\n";
    state.staged.set(chapter,{path:chapter,expectedSha:null,content:chapterSource});
    const extras="lehrperson/ergaenzungen/"+view+".md";
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
    useFile(metadata,file.sha,state.staged.get(metadata).content,file.content);
    stagingList();
    status("Doppellektion "+next+" mit Kapitel und Materialien vorgemerkt. Jetzt den AVIVA-Plan im Formular ausarbeiten, danach Kapitel und Materialien ergänzen.");
  }catch(e){error(e);}
}

$("createLesson").addEventListener("click",addLesson);
$("editPlan").addEventListener("click",editPlan);
$("editMaterials").addEventListener("click",editMaterials);
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
if (!pagesOrigin) (async()=>{
  try{
    const s=await api("/api/session");
    $("intro").hidden=s.authenticated;$("login").hidden=s.authenticated;$("logout").hidden=!s.authenticated;
    $("who").textContent=s.authenticated?"GitHub: "+s.login:"Nicht angemeldet";
    if(!s.authenticated){status("Mit GitHub anmelden, um Kapitel zu bearbeiten.");return;}
    $("workspace").hidden=false;await refresh();status("Angemeldet. Kapitel auswählen.");
  }catch(e){$("login").hidden=true;$("intro").hidden=false;error("Admin-Gateway nicht verbunden: "+e.message);}
})();
