import {createPlanner} from "./plan-editor.js";
import {lessonTemplate} from "./course-model.js";
// The public Pages origin has no authenticated API. Send editors to the Worker origin.
const pagesOrigin = location.hostname === "fachschaft-informatik-kst.github.io";
if (pagesOrigin) location.replace("https://kst-ki-admin.kevin-bohn.workers.dev/" + location.search + location.hash);
/* Admin editor: browser UI never receives GitHub secrets or tokens. */
const $=id=>document.getElementById(id);
const state={chapters:[],current:null,staged:new Map(),manifest:null};
const planner=createPlanner($("planEditor"),content=>{$("source").value=content;});

const sourceLayer=$("sourceHighlight");
function highlightSource(){
  const raw=$("source").value;
  // Tokenise escaped text, so authored HTML can never execute in the highlight layer.
  const escape=v=>v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const tokens=/(<!--[\s\S]*?-->|^#{1,6}[^\n]*|```[^\n]*|<\/?[a-z][^>]*>|\b[a-zA-Z_-]+(?=\s*[:=])|"(?:[^"\n]|\\.)*"|'(?:[^'\n]|\\.)*')/gm;
  let result="",end=0,match;
  while((match=tokens.exec(raw))){
    result+=escape(raw.slice(end,match.index));
    const part=match[0];
    const style=part.startsWith("<!--")?"comment":part.startsWith("#")?"heading":
      part.startsWith("\`")?"code":part.startsWith("<")?"tag":
      /^[\"']/.test(part)?"string":"key";
    result+='<span class="tok-'+style+'">'+escape(part)+'</span>';
    end=tokens.lastIndex;
  }
  sourceLayer.innerHTML=result+escape(raw.slice(end))+"\n";
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
  for(const item of state.chapters.filter(c=>c.path.startsWith(prefix)&&/\/[0-9]{3}-[^/]+\.md$/.test(c.path))){
    const button=document.createElement("button");button.type="button";
    button.textContent=filename(item.path);button.setAttribute("aria-current",String(state.current?.path===item.path));
    button.addEventListener("click",()=>load(item.path));nav.append(button);
  }
}
function useFile(path,sha,content,original=content){
  state.current={path,sha,original};
  $("path").textContent=path;$("heading").textContent=filename(path);
  const isPlan=path.endsWith("/planung.json");
  $("source").value=content;
  highlightSource();
  const isChapter=/\/[0-9]{3}-[^/]+\.md$/.test(path);
  $("move").disabled=!sha||!isChapter;$("archive").disabled=!sha||!isChapter;
  for(const id of ["toolbar","editorHelper","sourceLabel","previewButton","previewHeading","preview"])
    $(id).hidden=isPlan;
  $("codeEditor").hidden=isPlan;
  if(isPlan)planner.open(content,$("section").value);
  else {planner.close();$("preview").hidden=false;$("previewHeading").hidden=false;preview();}
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
  const manifest=await api("/api/file?path=kursseiten%2Fmanifest.json");
  state.manifest={sha:manifest.sha,content:manifest.content};
  const data=await api("/api/chapters");
  const known=data.chapters.filter(c=>!state.staged.get(c.path)?.delete);
  // A refresh must not discard newly created (as yet unmerged) lesson chapters.
  const pending=[...state.staged.values()].filter(c=>/^kursseiten\/[^/]+\/[0-9]{3}-[^/]+\.md$/.test(c.path)&&!c.delete&&!known.some(k=>k.path===c.path))
    .map(c=>({path:c.path,sha:c.expectedSha}));
  const unsubmitted=state.chapters.filter(c=>!c.sha&&!state.staged.has(c.path)&&!known.some(k=>k.path===c.path));
  state.chapters=[...known,...pending,...unsubmitted].sort((a,b)=>a.path.localeCompare(b.path));
  const definitions=JSON.parse(state.staged.get("kursseiten/manifest.json")?.content||manifest.content).sections;
  const valid=definitions.filter(s=>s.teaching||s.id==="lernziele").map(s=>s.id);
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
  source.setRangeText(text,start,end,"end");highlightSource();preview();
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function inline(s){
  // Escape plain text first; render the safe Markdown constructs afterwards.
  let out=escapeHtml(s);
  const code=[];
  out=out.replace(/`([^`]+)`/g,(_,value)=>{
    code.push("<code>"+value+"</code>");return "\uE000"+(code.length-1)+"\uE001";
  });
  out=out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^)]*)&quot;)?\)/g,(_,alt,url,title)=>{
    const safe=/^(?:javascript|vbscript):/i.test(url)?"":url;
    return '<img alt="'+alt+'" src="'+safe+'"'+(title?' title="'+title+'"':"")+'/>';
  });
  out=out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(_,name,url)=>{
    const safe=/^(?:javascript|vbscript|data):/i.test(url)?"#":url;
    return '<a href="'+safe+'">'+name+"</a>";
  });
  out=out.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,"<em>$1</em>")
    .replace(/~~(.+?)~~/g,"<del>$1</del>");
  return out.replace(/\uE000(\d+)\uE001/g,(_,i)=>code[Number(i)]);
}
function tableCells(line){
  return line.trim().replace(/^\|/,"").replace(/\|$/,"").split(/(?<!\\)\|/).map(x=>x.replace(/\\\|/g,"|").trim());
}
function markdown(source){
  const lines=source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,"").replace(/\r\n/g,"\n").split("\n");
  const out=[];let i=0;
  const heading=/^(#{1,6})\s+(.+)$/;
  const item=/^(\s*)([-+*]|\d+[.)])\s+(.+)$/;
  const tableLine=line=>line.includes("|");
  const isSeparator=line=>/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  while(i<lines.length){
    const raw=lines[i],s=raw.trim();
    if(!s){i++;continue;}
    if(/^(```|~~~)/.test(s)){
      const fence=s.slice(0,3),language=s.slice(3).trim().replace(/[^a-z0-9_-]/gi,"");
      const content=[];i++;
      while(i<lines.length&&!lines[i].trim().startsWith(fence))content.push(lines[i++]);
      if(i<lines.length)i++;
      out.push('<pre><code'+(language?' class="language-'+language+'"':"")+'>'+
        escapeHtml(content.join("\n"))+'</code></pre>');continue;
    }
    const h=s.match(heading);
    if(h){out.push("<h"+h[1].length+">"+inline(h[2])+"</h"+h[1].length+">");i++;continue;}
    if(/^([-*_])(?:\s*\1){2,}\s*$/.test(s)){out.push("<hr>");i++;continue;}
    if(tableLine(s)&&i+1<lines.length&&isSeparator(lines[i+1])){
      const headers=tableCells(s),align=tableCells(lines[i+1]).map(x=>x.startsWith(":")?(x.endsWith(":")?"center":"left"):(x.endsWith(":")?"right":""));
      out.push('<div class="table-scroll"><table><thead><tr>'+headers.map((x,j)=>'<th'+(align[j]?' style="text-align:'+align[j]+'"':"")+'>'+inline(x)+'</th>').join("")+'</tr></thead><tbody>');
      i+=2;
      while(i<lines.length&&lines[i].trim()&&tableLine(lines[i])){
        const values=tableCells(lines[i++]);
        out.push("<tr>"+headers.map((_,j)=>'<td'+(align[j]?' style="text-align:'+align[j]+'"':"")+'>'+inline(values[j]||"")+"</td>").join("")+"</tr>");
      }
      out.push("</tbody></table></div>");continue;
    }
    if(/^>\s?/.test(raw)){
      const part=[];
      while(i<lines.length&&/^>\s?/.test(lines[i]))part.push(lines[i++].replace(/^>\s?/,""));
      out.push("<blockquote>"+markdown(part.join("\n"))+"</blockquote>");continue;
    }
    if(item.test(raw)){
      const top=item.exec(raw)[1].length,ordered=/^\d/.test(item.exec(raw)[2]);
      const tag=ordered?"ol":"ul";out.push("<"+tag+">");
      while(i<lines.length){
        const match=item.exec(lines[i]);
        if(!match||match[1].length!==top||/^\d/.test(match[2])!==ordered)break;
        i++;
        const fragment=[match[3]];
        while(i<lines.length&&lines[i].trim()&&!item.test(lines[i])&&/^\s+/.test(lines[i]))
          fragment.push(lines[i++].trim());
        out.push("<li>"+fragment.map(inline).join(" ")+"</li>");
      }
      out.push("</"+tag+">");continue;
    }
    if(/^</.test(s)){
      // Legacy source files contain complete HTML blocks. Retain their markup;
      // the containing iframe forbids scripts and same-origin execution.
      const html=[];
      while(i<lines.length&&lines[i].trim()){html.push(lines[i++]);}
      out.push(html.join("\n"));continue;
    }
    const para=[s];i++;
    while(i<lines.length&&lines[i].trim()&&!heading.test(lines[i].trim())&&
      !item.test(lines[i])&&!/^>\s?/.test(lines[i])&&
      !/^(```|~~~)/.test(lines[i].trim())&&
      !/^</.test(lines[i].trim())&&!(i+1<lines.length&&tableLine(lines[i])&&isSeparator(lines[i+1]))){
      para.push(lines[i++].trim());
    }
    out.push("<p>"+inline(para.join(" "))+"</p>");
  }
  return out.join("\n");
}
const COURSE_PREVIEW_BASE = "https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/";
const COURSE_PREVIEW_CSS = "\n:root{--ink:#182b31;--muted:#52656a;--paper:#f5f4ee;--white:#fff;--line:#d8dfdb;--accent:#076959;--soft:#e7f1eb;--orange:#b84d27;--orange-soft:#fff0e7;--radius:16px;--nav:244px}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:30px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif}a{color:var(--accent);text-underline-offset:4px}a:hover{text-decoration-thickness:2px}button,input,select,textarea{font:inherit}button,a,input,select,textarea,summary{-webkit-tap-highlight-color:transparent}:focus-visible{outline:3px solid #ba552e;outline-offset:4px}button{cursor:pointer}button:disabled{opacity:.6;cursor:wait}h1,h2,h3,p{margin-top:0}h1,h2,h3{line-height:1.15;letter-spacing:-.035em}h1{font-size:clamp(2.8rem,5.2vw,4.7rem);max-width:800px;margin-bottom:26px;font-weight:750}h2{font-size:clamp(1.8rem,3vw,2.45rem);margin-bottom:14px}h3{font-size:1.17rem;letter-spacing:-.015em}p{margin-bottom:16px}.skip{position:absolute;left:20px;top:-100px;background:white;padding:12px;z-index:100}.skip:focus{top:10px}.sidebar{position:fixed;inset:0 auto 0 0;width:var(--nav);background:var(--white);border-right:1px solid var(--line);padding:32px 22px;display:flex;flex-direction:column;z-index:5;overflow:auto}.brand{font-weight:750;font-size:18px;letter-spacing:-.02em;text-decoration:none;color:var(--ink);display:flex;align-items:center;gap:11px}.mark{display:inline-grid;place-items:center;background:var(--accent);color:white;border-radius:9px;width:36px;height:36px;font-size:14px;letter-spacing:.02em}.brand small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);font-weight:500}.nav{display:grid;gap:5px;margin-top:38px}.nav a{padding:9px 12px;border-radius:7px;text-decoration:none;color:var(--muted);font-size:14px}.nav a[aria-current],.nav a:hover{background:var(--soft);color:var(--accent)}.nav span{display:inline-block;width:24px;color:#768880;font-size:11px}.sidebar-bottom{margin-top:auto;padding-top:28px;font-size:12px;color:var(--muted)}.sidebar-bottom a{display:block;margin-top:8px}.shell{margin-left:var(--nav)}main{max-width:1180px;margin:auto;padding:46px 54px 80px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}.crumb{font-size:12px;color:var(--muted);margin-bottom:42px}.hero{padding-bottom:48px;border-bottom:1px solid var(--line)}.hero p.lead{font-size:19px;max-width:720px;color:var(--muted)}.hero h1 em{font-style:normal;color:var(--accent)}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);background:var(--white);border-radius:8px;padding:11px 17px;font-weight:650;font-size:14px;color:var(--ink);text-decoration:none;line-height:1.5}.btn.primary{background:var(--accent);border-color:var(--accent);color:white}.btn:hover{filter:brightness(.96);text-decoration:none}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:35px}.fact{border-left:2px solid var(--line);padding-left:15px}.fact strong{display:block;font-size:22px;font-weight:700;line-height:1.2}.fact small{color:var(--muted);font-size:12px}.section{padding:55px 0;border-bottom:1px solid var(--line);scroll-margin-top:26px}.section-intro{max-width:760px;color:var(--muted);margin-bottom:26px}.section-label{font:650 12px/1.4 system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:13px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.card{border:1px solid var(--line);background:white;border-radius:var(--radius);padding:24px;min-width:0}.card p:last-child{margin-bottom:0}.muted{color:var(--muted)}.small{font-size:13px}.tag{display:inline-block;font-size:11px;line-height:1.4;font-weight:650;border:1px solid var(--line);border-radius:30px;padding:4px 9px;letter-spacing:.01em;color:var(--muted);margin-bottom:12px}.tag.green{color:var(--accent);background:var(--soft);border-color:transparent}.tag.orange{color:#963b19;background:var(--orange-soft);border-color:transparent}.callout{padding:20px 23px;border-left:3px solid var(--accent);background:var(--soft);border-radius:0 10px 10px 0;margin:22px 0}.callout p:last-child{margin-bottom:0}.callout.warn{background:var(--orange-soft);border-color:var(--orange)}.flow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:25px}.flow .card{padding:19px}.flow strong{display:block;margin:7px 0}.flow .step{font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.09em}.progress-card{background:var(--ink);color:white;padding:23px 27px;border-radius:var(--radius);margin:24px 0}.progress-title{display:flex;gap:16px;justify-content:space-between;align-items:center}.progress-card p{font-size:12px;margin:8px 0 0;color:#d6e3dc}progress{width:100%;height:8px;border:0;border-radius:8px;overflow:hidden;background:#46605f;accent-color:#a6d9b4;margin-top:15px}progress::-webkit-progress-bar{background:#46605f}progress::-webkit-progress-value{background:#a6d9b4}details{border:1px solid var(--line);border-radius:12px;background:white;margin:10px 0;overflow:hidden}summary{padding:19px 22px;cursor:pointer;font-weight:650;list-style:none;display:flex;align-items:center;gap:14px}summary::-webkit-details-marker{display:none}summary::after{content:'+';margin-left:auto;font-weight:400;font-size:23px;color:var(--accent)}details[open]>summary::after{content:'−'}details[open]>summary{border-bottom:1px solid var(--line)}.phase-num{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;background:var(--soft);color:var(--accent);border-radius:50%;font-size:12px}.detail-body{padding:22px 25px}.detail-body ul{padding-left:20px;margin-top:0}.check{display:flex;gap:12px;align-items:flex-start;cursor:pointer;margin:12px 0;line-height:1.5}.check input{width:19px;height:19px;margin-top:3px;flex:0 0 19px;accent-color:var(--accent)}.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:white}table{border-collapse:collapse;width:100%;font-size:14px;text-align:left}th,td{padding:16px 18px;border-bottom:1px solid var(--line);vertical-align:top}thead th{background:#edf1ec;font-size:12px;font-weight:700;white-space:nowrap}tbody tr:last-child>*{border-bottom:0}tbody th{font-weight:650}.date{white-space:nowrap;font-weight:650}.topic-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:20px}input[type=search],select,textarea{border:1px solid #aebeb5;background:white;border-radius:8px;padding:10px 12px;max-width:100%;color:var(--ink)}input[type=search]{min-width:260px;flex:1}textarea{width:100%;min-height:110px;resize:vertical}.topic h3{margin-bottom:12px}.topic p{font-size:14px}.topic .btn{margin-top:8px;font-size:12px}.topic.is-chosen{border:2px solid var(--accent);padding:23px}.empty{padding:20px;border:1px dashed var(--line)}.plan{margin-top:22px}.field{display:grid;gap:6px;margin:16px 0}.field>span{font-size:13px;font-weight:650}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips button{background:white;border:1px solid var(--line);border-radius:8px;padding:9px 14px;font-size:13px;color:var(--ink)}.chips button[aria-pressed=true]{background:var(--accent);color:white;border-color:var(--accent)}.groups{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:20px 0}.group-box{border-radius:9px;text-align:center;padding:17px 3px;font-size:12px;border:1px solid var(--line);background:white}.group-box strong{display:block;font-size:14px}.group-box.train{background:var(--soft);border-color:#92b9a7}.group-box.val{background:#e6edf9;border-color:#a7b9d7}.group-box.test{background:var(--orange-soft);border-color:#d9b9a4}.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--muted)}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}.experiment{background:white;border:1px solid var(--line);border-radius:var(--radius);padding:26px;margin-top:18px}.experiment .versus{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0}.variant{border:1px solid var(--line);border-radius:10px;padding:20px;background:#fafbf8}.variant strong{display:block;font-size:24px;margin-top:9px}.gradebar{display:flex;min-height:62px;border-radius:11px;overflow:hidden;margin:22px 0}.gradebar div{padding:12px 8px;text-align:center;color:white;font-size:13px;line-height:1.3;min-width:0}.gradebar b{display:block;font-size:20px}.gradebar div:nth-child(1){background:#557567;flex:15}.gradebar div:nth-child(2){background:#216a60;flex:20}.gradebar div:nth-child(3){background:#0c4946;flex:25}.gradebar div:nth-child(4){background:#263b43;flex:40}.skill-row{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:25px;padding:21px 0;border-bottom:1px solid var(--line)}.skill-row h3{font-size:16px;margin-bottom:6px}.skill-row p{font-size:13px;margin-bottom:0}.skill-row select{width:100%;align-self:center;font-size:13px}.skill-row:last-child{border-bottom:0}.resource{display:flex;gap:18px;align-items:flex-start}.resource .resource-icon{background:var(--soft);color:var(--accent);padding:7px 11px;border-radius:7px;font-size:16px}.resource a{font-weight:650}.resource p{font-size:13px;margin:7px 0 0}.footer{padding:24px 0 0;color:var(--muted);font-size:12px}.footer a{margin-right:18px}[hidden]{display:none!important}.js-only{display:none}.has-js .js-only{display:block}.has-js .js-flex{display:flex}.status{font-size:12px;color:var(--muted);min-height:1.5em}.noscript{background:var(--orange-soft);padding:15px}.print-note{display:none}\n@media(min-width:1500px){main{padding-left:70px;padding-right:70px}}@media(max-width:1050px){:root{--nav:205px}main{padding:35px 28px 60px}.sidebar{padding:27px 16px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.facts{gap:10px}.groups{grid-template-columns:repeat(4,1fr)}.fact strong{font-size:19px}.flow{grid-template-columns:1fr}.flow .card{display:flex;gap:18px;align-items:center}.flow strong{font-size:15px}.flow p{margin:0;font-size:13px}}@media(max-width:720px){html{scroll-padding-top:90px}.sidebar{position:sticky;top:0;width:100%;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:12px 18px;overflow:visible}.brand{font-size:15px}.brand small{font-size:10px}.mark{width:29px;height:29px}.nav{display:flex;overflow-x:auto;gap:4px;margin:10px -8px -3px;padding:0 0 3px}.nav a{flex:0 0 auto;font-size:12px;padding:6px 8px}.nav span{display:none}.sidebar-bottom{display:none}.shell{margin:0}main{padding:25px 20px 50px}.crumb{margin-bottom:28px}h1{font-size:2.8rem}.hero p.lead{font-size:17px}.facts{grid-template-columns:1fr 1fr;row-gap:22px}.section{padding:38px 0;scroll-margin-top:100px}.grid,.grid.two{grid-template-columns:1fr}.card{padding:21px}.skill-row{grid-template-columns:1fr;gap:12px}.skill-row select{width:100%}.experiment{padding:18px}.variant{padding:15px}.variant strong{font-size:19px}.gradebar span{font-size:10px}.gradebar b{font-size:17px}summary{padding:16px 17px;font-size:14px}.detail-body{padding:18px}.groups{gap:5px}.group-box{font-size:11px}.topic-controls input{min-width:0;width:100%}.progress-title{font-size:14px}.table-wrap table{min-width:520px}.hero{padding-bottom:32px}}\n@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{body{background:white;font-size:11px;color:black}.sidebar,.actions,.chips,.topic-controls,.topic .btn,.js-only,.js-flex,.skip,.footer button,.progress-card{display:none!important}.shell{margin:0}main{max-width:none;padding:0}.section{padding:20px 0;break-inside:auto}h1{font-size:32px}h2{font-size:23px}h3{font-size:15px}.hero{padding-bottom:20px}.crumb{margin-bottom:12px}.grid{grid-template-columns:repeat(2,1fr)}.card,details,.skill-row{break-inside:avoid}.table-wrap{overflow:visible}.table-wrap table{min-width:0}th,td{padding:8px}.print-note{display:block}.topic[hidden],[data-experiment][hidden]{display:block!important}.btn{padding:4px;border:0}.detail-body{display:block!important}.gradebar{print-color-adjust:exact;-webkit-print-color-adjust:exact}.skill-row select{appearance:none;border:0;font-size:11px}.callout{background:#f3f3f3}.check input{width:12px;height:12px}a{color:black}.plan textarea{min-height:50px}}\n\n/* Focused views: one project area at a time; all information remains printable. */\n.overview-path{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:32px 0 18px}.overview-path a{display:grid;gap:9px;padding:24px;background:white;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink)}.overview-path b{font-size:30px;color:var(--accent);font-weight:500}.overview-path strong{font-size:19px}.overview-path span,.overview-note{font-size:13px;color:var(--muted)}.topic-icon{display:block;font-size:30px;margin-bottom:12px}.topic details{border:0;border-top:1px solid var(--line);border-radius:0}.topic summary{padding:10px 0;font-size:12px}.topic details p{padding:8px 0}.skill-row details{border:0;margin:3px 0 0}.skill-row summary{padding:3px 0;font-size:12px;color:var(--muted)}.skill-row .detail-body{padding:8px 0}.section{padding-top:10px;border-bottom:0}.hero{border:0}.crumb{margin-bottom:25px}.section-intro{font-size:17px}.footer{border-top:1px solid var(--line);margin-top:25px}.has-js .view-hidden{display:none}.section:focus,.hero:focus{outline:none}\n@media(max-width:720px){.overview-path{grid-template-columns:1fr;gap:9px}.overview-path a{grid-template-columns:35px 1fr;padding:15px;gap:4px 12px}.overview-path b{grid-row:span 2;font-size:25px}.overview-path strong{font-size:16px}.overview-path span{grid-column:2}.section{padding-top:5px}.hero h1{font-size:2.3rem}}\n@media print{.has-js .view-hidden{display:block!important}.overview-path{grid-template-columns:repeat(3,1fr)}.overview-path a{padding:12px}.topic details p{display:block}.section{padding-top:22px}}\n\n.course-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:38px}.course-card{display:block;position:relative;min-height:205px;padding:25px 28px;background:#fff;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink)}.course-card:hover{border-color:var(--accent);box-shadow:0 6px 24px #193d2810}.course-card>b{position:absolute;right:25px;top:24px;font-size:27px;color:#7e9990}.course-card h3{font-size:24px;margin:13px 0 10px}.course-card p{font-size:14px;color:var(--muted);margin-right:18px}.course-arrow{position:absolute;bottom:20px;right:25px;color:var(--accent)}.lesson-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:28px 0}.lesson-steps article{border-top:3px solid var(--accent);background:white;padding:20px;border-radius:0 0 12px 12px}.lesson-steps b{display:block;margin-bottom:10px}.lesson-steps p{font-size:14px;margin:0;color:var(--muted)}.concept,.concept div{border:2px solid #558b7c;border-radius:14px;padding:22px;background:#e5f2ed}.concept div{margin-top:18px;background:#cbe6dc}.concept div div{background:#b0d6c8}.concept small{display:block;font-size:14px;font-weight:400}.process{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:28px 0;padding:22px;background:var(--soft);border-radius:14px;font-size:16px;text-align:center}.process span{flex:1}.answer{padding:20px;background:white;border:1px solid var(--line);border-radius:12px}.field textarea{resize:vertical;min-height:95px}.subnav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}.lab-panel{border:1px solid #b4c9c0;border-radius:14px;overflow:hidden;background:white;margin:26px 0}.lab-head{display:flex;align-items:center;gap:14px;padding:12px 16px;background:#e7f1eb;font-size:13px}.lab-head>span{margin-left:auto;font-size:12px}.compact{padding:6px 10px;font-size:12px}.lab-panel iframe{display:block;width:100%;height:680px;border:0;background:white}.lab-panel>p{padding:12px 18px;margin:0}.lab-panel:fullscreen{border:0;overflow:auto}.lab-panel:fullscreen iframe{height:calc(100vh - 65px)}.studio-frame{display:block;width:100%;height:800px;border:0}.completion{font-size:11px;color:var(--accent);margin-left:auto;font-weight:400}.memory-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}.memory-card{min-height:120px;border-radius:12px;border:1px solid #becdc6;background:var(--accent);color:white;font-size:16px;padding:15px}.memory-card.revealed{background:var(--soft);color:var(--ink)}.memory-card.matched{background:#f0f3ef;color:var(--muted);border-style:dashed}.generated-text{padding:20px;background:var(--soft);border-radius:10px;font-size:22px;min-height:90px}.attachment-list{list-style:none;padding:0}.attachment-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding:9px 0;font-size:13px;overflow-wrap:anywhere}.attachment-list button{flex-shrink:0}.journal-step summary{flex-wrap:wrap}#journal h1,#sicherung h1{font-size:clamp(2.2rem,4.5vw,3.7rem)}main{max-width:1300px}.sidebar-bottom #portal-save-status{line-height:1.5}.section .field textarea{width:100%}textarea,input[type=file]{max-width:100%}#download-status{font-size:14px}.save-error{color:#973b1b!important}.journal-step .detail-body{padding-top:8px}\n@media(max-width:800px){.lesson-steps{grid-template-columns:1fr}.course-grid{grid-template-columns:1fr}.course-card{min-height:165px}.process{flex-wrap:wrap;font-size:13px;padding:14px}.process span{min-width:60px}.lab-head{flex-wrap:wrap;gap:8px}.lab-head>span{margin-left:0}.lab-panel iframe{height:620px}.memory-board{grid-template-columns:repeat(2,minmax(0,1fr))}.memory-card{font-size:14px}.concept,.concept div{padding:15px}.studio-frame{height:700px}}\n@media print{.lab-panel,iframe,.memory-board,.subnav,#sicherung{display:none!important}.course-grid{grid-template-columns:1fr 1fr}.course-card{min-height:0;padding:10px}.lesson-steps{grid-template-columns:repeat(3,1fr)}.field textarea{border:0}}\n\n.table-scroll{max-width:100%;overflow-x:auto;margin:24px 0;border:1px solid var(--line);border-radius:12px;background:white}.rubric{width:100%;min-width:1000px;border-collapse:collapse;font-size:13px;line-height:1.5}.rubric caption{padding:16px;text-align:left;font-weight:700}.rubric th,.rubric td{padding:14px;vertical-align:top;border:1px solid var(--line);text-align:left}.rubric thead{background:var(--soft)}.rubric tbody th{min-width:170px}.rubric th small{display:block;color:var(--muted);font-weight:400;margin-top:5px}.rubric select{min-width:55px}.grade-calculator output{display:block;padding:18px;background:var(--soft);border-radius:10px;font-size:20px;font-weight:700}#lernziele .card h2{font-size:22px}#lernziele li{margin:12px 0}@media print{.table-scroll{overflow:visible}.rubric{min-width:0;font-size:9px}.rubric th,.rubric td{padding:5px}.rubric tbody th{min-width:0}}\n\n/* Dated AVIVA plans: short summaries first, detailed actions on demand. */\n.lesson-plan summary{gap:12px;font-size:14px}\n.lesson-plan summary>span:nth-child(2){flex:1}\n.lesson-plan summary small{white-space:nowrap;color:var(--muted);font-weight:400}\n.lesson-plan summary::after{margin-left:0}\n.lesson-question{font-size:19px;line-height:1.5;color:var(--accent)}\n.lesson-motivation{font-size:15px;line-height:1.55;margin:.2em 0 1em}\n.lesson-recap{font-size:15px;line-height:1.55;margin:.2em 0 1em;padding:.5em .9em;border-left:3px solid var(--accent);background:rgba(127,127,127,.08)}\n.lesson-phases{list-style:none;padding:0!important;margin:0 0 20px}\n.lesson-phases li{display:grid;grid-template-columns:65px 1fr;gap:15px;padding:14px 0;border-top:1px solid var(--line)}\n.phase-time{font-size:12px;font-weight:700;color:var(--accent);padding-top:3px}\n.lesson-phases strong{font-size:14px}.lesson-phases p{font-size:14px;margin:5px 0 0}\n.wer-legende{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px;font-size:12px}.wer-legende span{padding:3px 10px;border-radius:999px;border:1px solid var(--line)}\n.phase-table-wrap{overflow-x:auto;margin:0 0 20px}.phase-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}\n.phase-table th,.phase-table td{padding:9px 11px;border-top:1px solid var(--line);vertical-align:top;text-align:left}\n.phase-table thead th{font-size:12px;text-transform:none;color:var(--muted);border-top:0}\n.phase-table th.phase{width:132px;background:white;font-size:14px}.phase-table th.phase small{display:block;font-weight:400;color:var(--muted);font-size:12px;margin-top:2px}\n.phase-table td.wer{width:118px;font-weight:700;font-size:13px}.phase-table td.min{width:44px;text-align:right;color:var(--muted);white-space:nowrap}\n.wer-l{background:#e3edfb}.wer-e{background:#fdf0d8}.wer-t{background:#e1f2e6}.wer-k{background:#ece6f6}.wer-r{background:#f1f3f4}\ntr.wer-r td.was{font-style:italic}tr.wer-r td.wer{color:var(--muted)}\ntr.wer-l td.wer{color:#1f4e8c}tr.wer-e td.wer{color:#8a5a00}tr.wer-t td.wer{color:#1f6b3a}tr.wer-k td.wer{color:#5b3a8c}\n.phase-table tr.wer-l td,.phase-table tr.wer-e td,.phase-table tr.wer-t td,.phase-table tr.wer-k td,.phase-table tr.wer-r td{background:inherit}\n.lesson-product{background:var(--soft);border-radius:8px;padding:14px;font-size:14px;margin-bottom:0}\n.concept-figure{margin:24px 0;background:white;border:1px solid var(--line);border-radius:16px;padding:20px;text-align:center}\n.concept-figure img{display:block;width:100%;max-width:700px;height:auto;margin:auto}\n.concept-figure figcaption{max-width:610px;margin:15px auto 0;color:var(--muted);font-size:13px}\n#sicherung.project-transfer{margin:34px 0;padding:28px;background:var(--soft);border-top:5px solid var(--accent)}\n.project-transfer-actions{display:grid;gap:18px;margin:24px 0}\n.project-transfer-primary{display:flex;flex-wrap:wrap;gap:10px;align-items:center}\n.project-transfer-primary #download-backup{min-height:52px;padding:13px 22px;font-size:17px;font-weight:700}\n.project-submission-action{display:flex;flex-wrap:wrap;align-items:center;gap:12px;border-top:1px solid var(--line);padding-top:15px}\n.project-submission-action p{margin:0}\n.external-map{margin:24px 0;background:white;border:1px solid var(--line);border-radius:8px;padding:10px}\n.external-map iframe{display:block;width:100%;height:680px;border:0;background:white}\n.external-map figcaption{padding:12px 8px 4px;color:var(--muted);font-size:13px}\n.learning-example-links{display:grid;gap:7px;margin-top:12px}\n.learning-example-links a{font-size:13px;font-weight:650}\n.learning-system-overview{margin:24px 0 32px}\n.learning-system-overview>.grid{margin:14px 0}\n.learning-system-overview .card h3{font-size:18px}\n.learning-system-overview .card a{font-size:13px;font-weight:650}\n.learning-system-figure{margin:18px 0}\n.learning-system-figure img{max-height:300px}\n.learning-system-figure figcaption{max-width:720px}\n.group-memory-instructions{margin:0 0 18px;padding:15px 18px;border-left:3px solid var(--accent);background:var(--soft)}\n.group-memory-instructions p{margin:0 0 10px;font-size:14px}\n.group-memory-instructions ol{margin:0 0 10px;padding-left:22px}\n.group-memory-instructions li{margin:7px 0;font-size:13px;line-height:1.5}\n.memory-round{margin:20px 0;padding:16px 18px;border:1px solid var(--line);border-radius:12px}\n.memory-round h3{font-size:18px;margin:0 0 8px}\n.learning-example-note{margin:7px 0 0!important;font-size:11px!important;line-height:1.45;color:var(--muted)}\n.learning-path-intro{padding:14px 10px 2px}\n.learning-path-intro h2,.turing-activity h2{font-size:22px;margin-bottom:8px}\n.learning-path-intro p{margin-bottom:14px;color:var(--muted)}\n.turing-activity{margin:24px 0;padding:20px 22px;border-left:4px solid var(--orange);background:var(--orange-soft)}\n.turing-activity p{margin-bottom:12px}\n@media(max-width:720px){.lesson-plan summary{flex-wrap:wrap}.lesson-plan summary small{display:none}.phase-table{font-size:13px}.phase-table th.phase{width:90px}.phase-table td.wer{width:84px}.concept-figure{padding:15px}}\n@media(max-width:720px){.external-map{padding:6px}.external-map iframe{height:620px}}\n@media(max-width:720px){#sicherung.project-transfer{padding:22px 17px}.project-transfer-primary{display:grid;grid-template-columns:1fr}.project-transfer-primary .btn{width:100%;text-align:center}.project-submission-action{align-items:flex-start;flex-direction:column}}\n\n.nav span{width:38px}\n.task{background:var(--soft);border-left:4px solid var(--accent);border-radius:0 8px 8px 0;padding:12px 16px;margin:16px 0}\n.typen{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}.typen th,.typen td{padding:10px 12px;border-top:1px solid var(--line);text-align:left;vertical-align:top}\n.typen thead th{font-size:12px;color:var(--muted);border-top:0}.typen tbody th{width:190px;background:var(--soft)}\n.timeline{list-style:none;margin:18px 0;padding:0;border-left:3px solid var(--line)}\n.timeline li{display:grid;grid-template-columns:104px 1fr;gap:14px;position:relative;padding:8px 0 14px 18px}\n.timeline li::before{content:\"\";position:absolute;left:-9px;top:14px;width:15px;height:15px;border-radius:50%;background:white;border:3px solid var(--accent)}\n.timeline .jahr{font-weight:700;color:var(--accent);font-size:14px}.timeline p{margin:4px 0 0;font-size:14px}\n.marke{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;vertical-align:middle}\n.marke.regeln{background:#e3edfb;color:#1f4e8c}.marke.daten{background:#e1f2e6;color:#1f6b3a}\n@media(max-width:720px){.timeline li{grid-template-columns:1fr;gap:2px}.typen tbody th{width:auto}}\n\n/* Layout: Netz im Hintergrund, ruhigere Marke, lebendigere Karten */\nbody{background:radial-gradient(1200px 600px at 85% -10%,#e7f1eb 0,transparent 60%) no-repeat fixed,var(--paper)}\nbody::before{content:\"\";position:fixed;top:0;right:0;width:min(58vw,860px);aspect-ratio:1;background:url(grafiken/netz_hintergrund.svg) right top/100% 100% no-repeat;opacity:.17;-webkit-mask-image:linear-gradient(225deg,#000 35%,transparent 80%);mask-image:linear-gradient(225deg,#000 35%,transparent 80%);pointer-events:none;z-index:0}\n.shell{position:relative;z-index:1}\nbody .sidebar{background:linear-gradient(180deg,#fff 0,#f7faf7 100%)}\nbody .sidebar .brand{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:12px;font-size:17px;line-height:1.15;letter-spacing:-.015em}\nbody .sidebar .brand .mark{width:42px;height:42px;border-radius:12px;background:linear-gradient(145deg,#0a8a74,#054f43)}\nbody .sidebar .brand .mark svg{width:26px;height:26px;display:block}\nbody .sidebar .brand small{margin-top:5px;font-size:10.5px;letter-spacing:.12em}\nbody .nav{gap:2px;margin-top:34px}\nbody .nav a{border-left:3px solid transparent;border-radius:0 8px 8px 0;padding:9px 12px 9px 11px;transition:color .15s,border-color .15s}\nbody .nav a[aria-current],body .nav a:hover{border-left-color:var(--accent)}\n.hero h1{letter-spacing:-.03em}\n.course-card{background:rgba(255,255,255,.94);border-radius:18px;transition:transform .18s,box-shadow .18s,border-color .18s;overflow:hidden}\n.course-card::before{content:\"\";position:absolute;left:0;top:0;width:100%;height:4px;background:linear-gradient(90deg,var(--accent),#5fb39f);opacity:0;transition:opacity .18s}\n.course-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px #193d2818}\n.course-card:hover::before{opacity:1}\n.course-arrow{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--soft);transition:background .18s,color .18s}\n.course-card:hover .course-arrow{background:var(--accent);color:#fff}\n@media(max-width:720px){body .sidebar .brand{grid-template-columns:auto 1fr}body .sidebar .brand .mark{width:32px;height:32px}body .sidebar .brand .mark svg{width:20px;height:20px}}\n@media(prefers-reduced-motion:reduce){.course-card,.course-arrow{transition:none}.course-card:hover{transform:none}}\n@media print{body::before{display:none}}\n\n.crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:36px;font-size:12.5px;letter-spacing:.02em}\n.crumb span{display:inline-flex;align-items:center;gap:8px;color:var(--muted)}\n.crumb span+span::before{content:\"\";width:5px;height:5px;border-top:1.6px solid #9bb0a8;border-right:1.6px solid #9bb0a8;transform:rotate(45deg);margin-right:3px}\n.crumb span:first-child{font-weight:650;text-transform:uppercase;letter-spacing:.1em;font-size:11px;color:var(--ink)}\n.crumb .school-logo{display:block;height:22px;width:auto;border-radius:3px}\n.crumb span:last-child{color:var(--accent);font-weight:650;background:var(--soft);border-radius:30px;padding:3px 11px}\n.phase-table th.phase strong{display:block}.phase-table .phase-titel{display:block;margin-top:3px;font-size:12.5px;font-weight:500;line-height:1.35;color:var(--muted)}\n.learning-system-overview .card>a{display:inline-block;margin:4px 0 16px}.learning-system-overview .card ol{padding-left:20px;margin:6px 0 14px}.learning-system-overview .card ol li{margin-bottom:6px}\n.neuron-figure img{max-width:900px}\n\n/* Navigation einklappen */\n:root{--nav-full:244px}@media(max-width:1050px){:root{--nav-full:205px}}\n.nav-toggle{position:fixed;top:24px;left:calc(var(--nav) - 16px);z-index:6;width:32px;height:32px;padding:0;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:#fff;color:var(--accent);font:22px/1 system-ui;cursor:pointer;box-shadow:0 2px 8px #193d2818;transition:left .22s,background .15s}\n.nav-toggle:hover{background:var(--soft)}\n@media(min-width:721px){.sidebar{transition:transform .22s}.shell{transition:margin-left .22s}}\n@media(min-width:721px){body.nav-collapsed{--nav:0px}body.nav-collapsed .sidebar{width:var(--nav-full);transform:translateX(-100%);visibility:hidden;transition:transform .22s,visibility 0s .22s}body.nav-collapsed .nav-toggle{left:12px}}\n@media(max-width:720px){.nav-toggle{display:none}}\n@media(prefers-reduced-motion:reduce){.nav-toggle,.sidebar,.shell{transition:none!important}}\n@media print{.nav-toggle{display:none}}\n@media(min-width:721px){body.nav-collapsed .crumb{padding-left:44px}}\n.typen td textarea{min-width:200px;font-size:13px}\n\n/* Kapitel (einklappbare Unterkapitel einer Doppellektion) */\n.kapitel{margin:26px 0;overflow:visible;background:rgba(255,255,255,.92)}\n.kapitel>summary{padding:16px 24px;gap:16px}\n.kapitel>summary .kapitel-nr{flex:0 0 34px;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font:700 15px/1 system-ui}\n.kapitel>summary h2{margin:0;font-size:1.3rem;line-height:1.25;font-weight:700}\n.kapitel>.kapitel-body{padding:6px 26px 26px}\n.kapitel>.kapitel-body>:first-child{margin-top:16px}\n.nav-sub{display:grid;gap:1px;margin:2px 0 10px 22px;padding-left:8px;border-left:2px solid var(--line)}\nbody .nav .nav-sub a{padding:5px 10px;border-left-width:0;border-radius:6px;font-size:12.5px;line-height:1.35}\n.nav-sub a span{width:18px;font-size:11px}\n@media(max-width:720px){.nav-sub{display:none}.kapitel>summary{padding:13px 16px}.kapitel>.kapitel-body{padding:4px 16px 18px}.kapitel>summary h2{font-size:1.1rem}}\n@media print{.nav-sub{display:none}.kapitel{border:0}}\n\n.lesson-steps.single{grid-template-columns:1fr}\n.kapitel .lesson-steps.single article>b{display:none}\n.kapitel .lesson-steps.single article{border:0;padding:0;background:none;box-shadow:none}\n.kapitel .turing-activity{margin:0}\n\n.kapitel-uebersicht{margin:22px 0 8px}\n.kapitel-uebersicht-kopf{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}\n.kapitel-uebersicht-kopf p{margin:0;font:650 12px/1.4 system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}\n.kapitel-karten{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}\n.kapitel-karte{display:flex;gap:13px;align-items:flex-start;padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.94);color:var(--ink);text-decoration:none;transition:border-color .15s,box-shadow .15s,transform .15s}\n.kapitel-karte:hover{border-color:var(--accent);box-shadow:0 8px 22px #193d2814;transform:translateY(-2px)}\n.kapitel-karte .kapitel-nr{flex:0 0 30px;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:var(--soft);color:var(--accent);font:700 14px/1 system-ui}\n.kapitel-karte-text{display:grid;gap:3px;font-size:13px;line-height:1.45;color:var(--muted)}\n.kapitel-karte-text b{font-size:14.5px;line-height:1.3;color:var(--ink)}\n@media(max-width:720px){.kapitel-karten{grid-template-columns:1fr}}\n@media(prefers-reduced-motion:reduce){.kapitel-karte{transition:none}.kapitel-karte:hover{transform:none}}\n@media print{.kapitel-uebersicht{display:none}}\n\ninput[type=text]{border:1px solid #aebeb5;background:#fff;border-radius:8px;padding:8px 10px;max-width:100%;color:var(--ink)}\n.protokoll input[type=text]{width:100%;min-width:70px;max-width:150px}\n.protokoll select{max-width:240px;font-size:13px;padding:8px 10px}\n.protokoll-block{margin-top:26px;padding:16px 18px;border:1px solid var(--line);border-radius:12px}\n.protokoll-block h3{margin:0 0 6px;font-size:18px}\n.protokoll-block h4{margin:18px 0 6px;font-size:15px}\n.protokoll input.breit{max-width:none;min-width:160px}\n.protokoll td textarea{min-width:260px}\n\n/* Tandemprojekt: vier gut lesbare Schritte, eingefrorenes vs. trainiertes Netz. */\n.project-train-overview{margin:23px 0 25px;padding:20px 22px;background:#fff;border:1px solid var(--line);border-radius:14px}\n.project-train-overview h2{font-size:1.22rem;letter-spacing:-.01em;margin:0 0 17px}\n.project-train-flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;list-style:none;margin:0;padding:0}\n.project-train-flow li{position:relative;min-width:0;padding:13px;background:#f6f8f6;border:1px solid var(--line);border-radius:10px}\n.project-train-flow li+li::before{content:\"→\";position:absolute;left:-19px;top:calc(50% - .75em);font-size:19px;font-weight:750;color:var(--accent)}\n.project-train-flow strong{display:block;font-size:14px;line-height:1.3;margin-bottom:7px}\n.project-train-flow span{display:block;font-size:12px;line-height:1.5;color:var(--muted)}\n.project-train-flow em{display:inline-block;margin-top:10px;padding:3px 7px;border-radius:6px;background:#e8ebe9;color:#435d58;font:700 11px/1.4 system-ui}\n.project-train-flow .model-trained{border:2px solid var(--accent);background:var(--soft);padding:12px}\n.project-train-flow .model-trained em{background:var(--accent);color:#fff}\n.project-train-note{margin:14px 0 0;font-size:13px;line-height:1.5;color:var(--muted)}\n@media(max-width:1050px){\n  .project-train-flow{grid-template-columns:minmax(0,1fr);gap:20px}\n  .project-train-flow li+li::before{content:\"↓\";top:-24px;left:50%;transform:translateX(-50%)}\n}\n@media(max-width:500px){.project-train-overview{padding:16px}.project-train-overview h2{font-size:1.1rem}}\n";
const COURSE_PREVIEW_CHROME = "\n<a class=\"skip\" href=\"#inhalt\">Zum Inhalt</a>\n<aside class=\"sidebar\"><a class=\"brand\" href=\"#start\"><span aria-hidden=\"true\" class=\"mark\"><svg viewBox=\"0 0 26 26\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.4\" stroke-linecap=\"round\"><path d=\"M4 6l9 -2M4 6l9 8M4 6l9 15M4 20l9 -16M4 20l9 -6M4 20l9 1M13 4l9 9M13 14l9 -1M13 21l9 -8\" opacity=\".7\"/><g fill=\"#fff\" stroke=\"none\"><circle cx=\"4\" cy=\"6\" r=\"2.2\"/><circle cx=\"4\" cy=\"20\" r=\"2.2\"/><circle cx=\"13\" cy=\"4\" r=\"2.2\"/><circle cx=\"13\" cy=\"14\" r=\"2.2\"/><circle cx=\"13\" cy=\"21\" r=\"2.2\"/><circle cx=\"22\" cy=\"13\" r=\"2.6\"/></g></svg></span><span class=\"brand-text\">Künstliche<br/>Intelligenz<small>Informatik</small></span></a>\n<nav aria-label=\"Unterricht\" class=\"nav\"><!-- NAVIGATION --></nav><div class=\"sidebar-bottom\"><a href=\"#journal\">✎ Unser Journal</a><a href=\"#sicherung\">Notizen &amp; Projekt</a><p class=\"status\" id=\"portal-save-status\" role=\"status\">Nur in diesem Browser gespeichert.</p></div></aside>\n<div class=\"shell\"><main id=\"inhalt\"><div class=\"crumb\"><span><img alt=\"Logo KST\" class=\"school-logo\" height=\"22\" src=\"grafiken/kst_logo.png\" width=\"44\"/>Kantonsschule Stadelhofen</span><span>Informatik</span><span>Künstliche Intelligenz</span></div>\n";
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
function preview(){
  let content=$("source").value;
  if(content.includes("<!-- MD:START -->"))
    content=content.replace(/<!-- MD:START -->([\s\S]*?)<!-- MD:END -->/g,(_,text)=>markdown(text));
  else if(content.startsWith("---\n"))
    content=chapterFromYaml(content)??markdown(content);
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
  // Match the actual rendered /projekt/index.html DOM hierarchy. The course's
  // main and section layout rules must not be replaced with generic editor styles.
  // Keep the preview inert: no allow-scripts and no allow-same-origin.
  const section=state.current?.path.split("/")[1]||"einstieg";
  const safeSection=/^[a-z0-9-]+$/.test(section)?section:"einstieg";
  const stylesheet="<style>"+COURSE_PREVIEW_CSS+"</style>";
  // The Worker CSP intentionally forbids <base> (base-uri 'none'). Inline chrome
  // assets must therefore be absolute, just like images from edited chapters.
  const definitions=JSON.parse(state.staged.get("kursseiten/manifest.json")?.content||state.manifest.content).sections;
  const navigation=definitions.filter(s=>s.navigation).sort((a,b)=>a.navigation.order-b.navigation.order)
    .map(s=>'<a href="#'+escapeHtml(s.id)+'"><span>'+escapeHtml(s.navigation.label)+'</span>'+escapeHtml(s.navigation.title)+'</a>').join("");
  const chrome=COURSE_PREVIEW_CHROME.replace("<!-- NAVIGATION -->",navigation)
    .replace(/\bsrc="grafiken\//g,'src="'+COURSE_PREVIEW_BASE+'grafiken/');
  $("preview").srcdoc='<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+COURSE_PREVIEW_BASE+'">'+stylesheet+'</head><body>'+chrome+'<section class="section" id="'+safeSection+'">'+content+'</section></main></div></body></html>';

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
  if(c.path.endsWith("/planung.json")){
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
    const path="kursseiten/"+$("section").value+"/planung.json",staged=state.staged.get(path);
    if(staged&&!staged.delete){useFile(path,staged.expectedSha,staged.content,staged.original||staged.content);return;}
    const file=await api("/api/file?path="+encodeURIComponent(path));
    useFile(path,file.sha,file.content);status("AVIVA-Plan als Formular bearbeiten: pro Doppellektion fünf Phasen und insgesamt 90 Minuten.");
  }catch(e){error(e);}
}
async function editMaterials(){
  try{
    if(!confirmUnsaved())return;
    const section=$("section").value;
    const path="kursseiten/"+section+"/materialien.md";
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
  return lessonTemplate(id,title,view);
}
async function addLesson(){
  try{
    if(!confirmUnsaved())return;
    status("Lade aktuelle Unterrichtsplanung …");
    const file=await api("/api/file?path=kursseiten%2Fmanifest.json");
    const manifest=JSON.parse(state.staged.get("kursseiten/manifest.json")?.content||file.content);
    const title=prompt("Titel der neuen Doppellektion:");
    if(!title)return;
    const chapterTitle=prompt("Titel des ersten Unterkapitels:","Einstieg und Auftrag");
    if(!chapterTitle)return;
    if(!title.trim()||!slug(chapterTitle))throw Error("Titel und Kapitelname dürfen nicht leer sein.");
    const id=slug(title),view=id;
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
    state.staged.set("kursseiten/manifest.json",{path:"kursseiten/manifest.json",expectedSha:file.sha,original:file.content,content:JSON.stringify(manifest,null,2)+"\n"});
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

$("createLesson").addEventListener("click",addLesson);
$("editPlan").addEventListener("click",editPlan);
$("editMaterials").addEventListener("click",editMaterials);
$("section").addEventListener("change",chapterList);
$("refresh").addEventListener("click",()=>refresh().catch(error));
$("create").addEventListener("click",addChapter);
$("move").addEventListener("click",move);
$("archive").addEventListener("click",archive);
// Render changes shortly after typing, but do not interrupt rapid edits.
let previewDebounce=null;
$("source").addEventListener("input",()=>{
  highlightSource();
  clearTimeout(previewDebounce);
  if(!$("source").hidden)previewDebounce=setTimeout(()=>{try{preview();}catch(e){error(e);}},220);
});
$("previewButton").addEventListener("click",preview);
$("previewFullscreen").addEventListener("click",()=>{
  $("preview").requestFullscreen().catch(()=>status("Vollbildansicht wird vom Browser nicht unterstützt.",true));
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
  code:'<pre><code class="language-python"># Python-Beispiel\nprint("Hallo Welt")</code></pre>'
};
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
