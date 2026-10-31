import {validatePlan,validateManifest} from "../../shared/course-model.js";
import {validateGlossary,GLOSSARY_PATH} from "../../shared/glossary-model.js";
const REPO = "fachschaft-informatik-kst/ki-unterricht";
const STATIC = "https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/admin/";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const COOKIE = "HttpOnly; Secure; SameSite=Lax; Path=/";
const MAX_BODY = 5200000;
const response = (data, status=200, headers={}) => new Response(JSON.stringify(data), {status,headers:{"Content-Type":"application/json","Cache-Control":"no-store",...headers}});
const fail = (status,error) => response({error},status);
const b64url = bytes => btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replace(/=+$/,"");
const from64url = value => Uint8Array.from(atob(value.replaceAll("-","+").replaceAll("_","/").padEnd(Math.ceil(value.length/4)*4,"=")),c=>c.charCodeAt(0));
const nonce = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
const cookie = (name,value,age) => name+"="+value+"; "+COOKIE+"; Max-Age="+age;
const readCookie = (req,name) => (req.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="))?.slice(name.length+1);
async function secret(env){
  const bytes=from64url(env.SESSION_KEY||"");
  if(bytes.length!==32)throw Error("SESSION_KEY muss 32 zufällige Bytes als base64url enthalten.");
  return crypto.subtle.importKey("raw",bytes,"AES-GCM",false,["encrypt","decrypt"]);
}
async function encrypt(env,value){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},await secret(env),encoder.encode(JSON.stringify(value)));
  return b64url(iv)+"."+b64url(new Uint8Array(cipher));
}
async function decrypt(env,value){
  try{
    const [iv,cipher]=(value||"").split(".");
    if(!iv||!cipher)return null;
    return JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:from64url(iv)},await secret(env),from64url(cipher))));
  }catch{return null;}
}
async function github(token,path,options={}){
  const r=await fetch("https://api.github.com"+path,{...options,headers:{
    Accept:"application/vnd.github+json",Authorization:"Bearer "+token,
    "X-GitHub-Api-Version":"2022-11-28","User-Agent":"KST-KI-Editor",...(options.headers||{})
  }});
  const data=await r.json().catch(()=>({}));
  if(!r.ok){
    const action=(options.method||"GET").toUpperCase()+" "+path.split("?")[0];
    const required=r.headers.get("X-Accepted-GitHub-Permissions");
    const hint=required?" Benötigte App-Rechte: "+required.slice(0,130)+".":"";
    throw Object.assign(Error("GitHub ("+r.status+") bei "+action+": "+
      String(data.message||r.statusText).slice(0,160)+"."+hint),{status:r.status});
  }
  return data;
}
const canWrite=async token => (await github(token,"/repos/"+REPO)).permissions?.push===true;
// A user's personal push permission does NOT prove that this GitHub App has
// been installed on the organization's repository with write permissions.
// GitHub exposes the active installation permissions to App user tokens.
async function appInstallationStatus(token,request=github){
  const owner=REPO.split("/")[0].toLowerCase();
  const all=await request(token,"/user/installations?per_page=100");
  const matches=(all.installations||[]).filter(item=>
    item.account?.login?.toLowerCase()===owner);
  if(!matches.length)return {ready:false,reason:
    "Die GitHub App ist nicht auf der Organisation "+owner+" installiert oder nicht für dein Benutzerkonto zugänglich. Unter Organisation → Settings → GitHub Apps die App installieren und "+REPO+" auswählen."};
  for(const installation of matches){
    const permissions=installation.permissions||{};
    if(permissions.contents!=="write")return {ready:false,reason:
      "Die App-Installation hat Contents: "+(permissions.contents||"keine")+" statt Read and write. App-Berechtigungen ändern und die Änderung in der Organisation genehmigen."};
    if(permissions.pull_requests!=="write")return {ready:false,reason:
      "Die App-Installation hat Pull requests: "+(permissions.pull_requests||"keine")+" statt Read and write. App-Berechtigungen ändern und die Änderung in der Organisation genehmigen."};
    if(installation.repository_selection==="all")return {ready:true};
    for(let page=1;page<=10;page++){
      const listed=await request(token,"/user/installations/"+installation.id+
        "/repositories?per_page=100&page="+page);
      if((listed.repositories||[]).some(item=>item.full_name?.toLowerCase()===REPO.toLowerCase()))
        return {ready:true};
      if(page*100>=(listed.total_count||0))break;
    }
  }
  return {ready:false,reason:"Die App ist auf "+owner+" installiert, aber das Repository "+
    REPO+" gehört nicht zur App-Auswahl. In der Organisation unter Installed GitHub Apps → Configure das Repository hinzufügen."};
}
const allowed=path => typeof path==="string"&&!path.includes("..")&&!path.includes("//")&&(
  /^kursseiten\/[a-z][a-z0-9-]*\/(?:[0-9]{3}-[a-z0-9-]+\.md|planung\.json|materialien\.md)$/.test(path)||
  (path==="kursseiten/manifest.json"||path==="kursseiten/basis-manifest.json"||path===GLOSSARY_PATH)||

  /^projekt\/grafiken\/uploads\/[a-z0-9-]+\.(png|jpe?g|webp)$/.test(path)||
  /^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/.test(path));
function validate(changes){
  if(!Array.isArray(changes)||changes.length<1||changes.length>12)throw Error("1–12 Dateien pro Pull Request.");
  const seen=new Set();
  for(const c of changes){
    if(!c||!allowed(c.path)||seen.has(c.path))throw Error("Ungültiger oder doppelter Dateipfad.");
    seen.add(c.path);
    if(c.expectedSha!==null&&!/^[a-f0-9]{40}$/.test(c.expectedSha||""))throw Error("Ungültige Ausgangsversion.");
    if(c.delete===true){
      if(c.expectedSha===null||c.content!==undefined||!/^kursseiten\/[^/]+\/[0-9]{3}-[^/]+\.md$/.test(c.path))throw Error("Nur vorhandene Kapitel können verschoben werden.");
    }else if(c.path.endsWith(".json")){
      if(typeof c.content!=="string"||c.content.length>200000)throw Error("JSON-Datei zu gross.");
      let plan;try{plan=JSON.parse(c.content);}catch{throw Error("Ungültiger Unterrichtsplan.");}
      if(c.path===GLOSSARY_PATH)validateGlossary(plan);
      else if(c.path.endsWith("/planung.json"))validatePlan(plan);
      else validateManifest(plan);
    }else if(c.path.endsWith(".ipynb")){
      if(typeof c.content!=="string"||encoder.encode(c.content).length>700000)throw Error("Notebook zu gross.");
      let doc;try{doc=JSON.parse(c.content);}catch{throw Error("Notebook ist kein gültiges JSON.");}
      if(doc.nbformat!==4||!Array.isArray(doc.cells)||!doc.metadata||!doc.cells.every(cell=>
        ["code","markdown","raw"].includes(cell.cell_type)&&Array.isArray(cell.source)&&cell.source.every(s=>typeof s==="string")))
        throw Error("Ungültige Jupyter-Notebook-Struktur.");
      if(c.expectedSha===null)throw Error("Neue Notebooks müssen vorerst über GitHub angelegt werden.");
    }else if(c.path.endsWith(".md")){
      if(typeof c.content!=="string"||!c.content.trim()||encoder.encode(c.content).length>200000)throw Error("Ungültiger Markdown-Inhalt.");
      if(c.expectedSha===null&&/\/[0-9]{3}-/.test(c.path)&&!c.content.startsWith("---\n"))throw Error("Neue Kapitel brauchen einen YAML-Kopf.");
    }else{
      if(typeof c.content!=="string"||c.content.length>4100000)throw Error("Bild ungültig oder zu gross.");
      let bytes;try{bytes=Uint8Array.from(atob(c.content),x=>x.charCodeAt(0));}catch{throw Error("Ungültiges Bildformat.");}
      if(bytes.length<16||bytes.length>3000000)throw Error("Bild muss kleiner als 3 MB sein.");
      const starts=(...ns)=>ns.every((n,i)=>bytes[i]===n);
      const ext=c.path.split(".").pop();
      if(!(ext==="png"&&starts(137,80,78,71,13,10,26,10))&&
         !(["jpg","jpeg"].includes(ext)&&starts(255,216,255))&&
         !(ext==="webp"&&decoder.decode(bytes.slice(0,4))==="RIFF"&&decoder.decode(bytes.slice(8,12))==="WEBP"))throw Error("Datei ist kein gültiges PNG, JPEG oder WebP.");
    }
  }
}
const allowedPost=req=>req.headers.get("Origin")===new URL(req.url).origin&&req.headers.get("Content-Type")?.startsWith("application/json");
async function publish(req,token){
  if(!allowedPost(req))return fail(403,"Unerlaubter Aufruf.");
  if(Number(req.headers.get("Content-Length")||0)>MAX_BODY)return fail(413,"Paket zu gross.");
  const raw=await req.text();
  if(raw.length>MAX_BODY)return fail(413,"Paket zu gross.");
  let body;try{body=JSON.parse(raw);validate(body.changes);}catch(e){return fail(400,e.message);}
  const title=String(body.title||"Unterrichtsänderung").trim().slice(0,100);
  if(!title)return fail(400,"Titel fehlt.");
  if(!(await canWrite(token)))return fail(403,"Keine persönliche Schreibberechtigung im Repository.");
  const installation=await appInstallationStatus(token);
  if(!installation.ready)return fail(403,installation.reason);
  const prefix="/repos/"+REPO;
  const ref=await github(token,prefix+"/git/ref/heads/main");
  const baseSha=ref.object.sha;
  const commit=await github(token,prefix+"/git/commits/"+baseSha);
  const tree=await github(token,prefix+"/git/trees/"+commit.tree.sha+"?recursive=1");
  if(tree.truncated)return fail(409,"Repository-Baum unvollständig.");
  const known=new Map(tree.tree.filter(x=>x.type==="blob").map(x=>[x.path,x.sha]));
  for(const c of body.changes){
    if((known.get(c.path)||null)!==c.expectedSha)return fail(409,"Konflikt bei "+c.path+". Bitte neu laden.");
  }
  const changes=new Map(body.changes.map(c=>[c.path,c]));
  const readJson=async path=>{
    const file=await github(token,prefix+"/contents/"+path+"?ref="+baseSha);
    return JSON.parse(decoder.decode(Uint8Array.from(atob(file.content.replace(/\s/g,"")),c=>c.charCodeAt(0))));
  };
  const proposed=async path=>changes.has(path)?JSON.parse(changes.get(path).content):readJson(path);
  try{
    if(changes.has(GLOSSARY_PATH)){
      const oldGlossary=validateGlossary(await readJson(GLOSSARY_PATH));
      const nextGlossary=validateGlossary(await proposed(GLOSSARY_PATH));
      const nextIds=new Set(nextGlossary.begriffe.map(t=>t.id));
      if(oldGlossary.begriffe.some(t=>!nextIds.has(t.id)))
        throw Error("Bestehende Glossar-IDs dürfen nicht gelöscht werden, weil Kursseiten darauf verlinken.");
    }
    for(const manifestPath of ["kursseiten/manifest.json","kursseiten/basis-manifest.json"]){
    const previous=await readJson(manifestPath);
    const manifest=await proposed(manifestPath);
    validateManifest(manifest);
    if(previous.sections.some(s=>!manifest.sections.some(n=>n.id===s.id&&!!n.teaching===!!s.teaching)))
      throw Error("Bestehende Bereichs-IDs müssen erhalten bleiben.");
    const all=[];
    for(const section of manifest.sections.filter(s=>s.teaching)){
      const path="kursseiten/"+section.id+"/planung.json";
      const next=await proposed(path);
      validatePlan(next);
      if(next.lessons.some(l=>l.view!==section.id))throw Error("Falsche Bereichszuordnung: "+section.id);
      if(known.has(path)){
        const old=await readJson(path);
        if(old.lessons.some(l=>!next.lessons.some(n=>n.id===l.id&&n.view===l.view)))
          throw Error("Bestehende Lektions-IDs müssen erhalten bleiben.");
      }
      const material="kursseiten/"+section.id+"/materialien.md";
      if(!known.has(material)&&!changes.has(material))throw Error("Lehrpersonenmaterial fehlt: "+section.id);
      const chapterPrefix="kursseiten/"+section.id+"/";
      if(![...new Set([...known.keys(),...changes.keys()])].some(p=>
        p.startsWith(chapterPrefix)&&/\/[0-9]{3}-[^/]+\.md$/.test(p)&&!changes.get(p)?.delete))
        throw Error("Kapitel fehlt: "+section.id);
      all.push(...next.lessons);
    }
    validatePlan({lessons:all});
    if(all.some(l=>!Number.isFinite(l.order))||new Set(all.map(l=>l.order)).size!==all.length)
      throw Error("Lektionsreihenfolge ungültig oder doppelt.");
    }
  }catch(e){if(e.status)throw e;return fail(400,e.message);}
  const entries=[];
  for(const c of body.changes){
    if(c.delete)entries.push({path:c.path,mode:"100644",type:"blob",sha:null});
    else if(/\.(md|json|ipynb)$/.test(c.path))entries.push({path:c.path,mode:"100644",type:"blob",content:c.content});
    else{
      const blob=await github(token,prefix+"/git/blobs",{method:"POST",body:JSON.stringify({content:c.content,encoding:"base64"})});
      entries.push({path:c.path,mode:"100644",type:"blob",sha:blob.sha});
    }
  }
  const resultTree=await github(token,prefix+"/git/trees",{method:"POST",body:JSON.stringify({base_tree:commit.tree.sha,tree:entries})});
  const resultCommit=await github(token,prefix+"/git/commits",{method:"POST",body:JSON.stringify({
    message:"content(editor): "+title,tree:resultTree.sha,parents:[baseSha]
  })});
  const branch="editor/"+Date.now().toString(36)+"-"+nonce().slice(0,8).toLowerCase();
  await github(token,prefix+"/git/refs",{method:"POST",body:JSON.stringify({ref:"refs/heads/"+branch,sha:resultCommit.sha})});
  const pr=await github(token,prefix+"/pulls",{method:"POST",body:JSON.stringify({
    title:"Unterricht: "+title,head:branch,base:"main",
    body:"Erstellt mit dem KI-Unterrichts-Editor.\n\n"+body.changes.map(x=>"- "+x.path+(x.delete?" (archiviert)":"")).join("\n")+
      "\n\nDie CI prüft die Unterrichtsinhalte und die ZIP-Kompatibilität."
  })});
  return response({url:pr.html_url,number:pr.number,branch},201);
}
async function auth(req,env,url){
  if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET)return fail(503,"GitHub App noch nicht konfiguriert.");
  const callback=url.origin+"/auth/callback";
  if(url.pathname==="/auth/start"){
    const state=nonce(),verifier=nonce();
    const challenge=b64url(new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(verifier))));
    const target=new URL("https://github.com/login/oauth/authorize");
    const props={client_id:env.GITHUB_CLIENT_ID,redirect_uri:callback,state,code_challenge:challenge,code_challenge_method:"S256"};
    for(const [k,v] of Object.entries(props))target.searchParams.set(k,v);
    const pending=await encrypt(env,{state,verifier,exp:Date.now()+600000});
    return new Response(null,{status:302,headers:{
      Location:target.toString(),"Set-Cookie":cookie("ki_oauth",pending,600),"Cache-Control":"no-store"
    }});
  }
  const pending=await decrypt(env,readCookie(req,"ki_oauth"));
  if(!pending||pending.exp<Date.now()||pending.state!==url.searchParams.get("state")||!url.searchParams.get("code"))return fail(403,"GitHub-Anmeldung abgelaufen.");
  const r=await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({
    client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code:url.searchParams.get("code"),code_verifier:pending.verifier,redirect_uri:callback
  })});
  const token=await r.json();
  if(!r.ok||!token.access_token)return fail(403,"GitHub-Anmeldung fehlgeschlagen.");
  const user=await github(token.access_token,"/user");
  if(!(await canWrite(token.access_token)))return fail(403,"Keine Schreibberechtigung für das Repository.");
  const ms=Math.min(3600000,Math.max(60000,Number(token.expires_in||3600)*1000-60000));
  const value=await encrypt(env,{token:token.access_token,login:user.login,exp:Date.now()+ms});
  const headers=new Headers({Location:"/","Cache-Control":"no-store"});
  headers.append("Set-Cookie",cookie("ki_oauth","",0));
  headers.append("Set-Cookie",cookie("ki_session",value,Math.floor(ms/1000)));
  return new Response(null,{status:303,headers});
}
async function staticPage(url){
  const files={"/":"index.html","/index.html":"index.html","/admin.css":"admin.css","/admin.js":"admin.js","/markdown-it.min.js":"markdown-it.min.js","/plan-editor.js":"plan-editor.js","/glossary-model.js":"glossary-model.js","/course-model.js":"course-model.js","/course-rules.json":"course-rules.json","/favicon.svg":"../favicon.svg"};
  const file=files[url.pathname];
  if(!file)return fail(404,"Nicht gefunden.");
  const source=await fetch(STATIC+file,{redirect:"manual"});
  if(source.status>=300&&source.status<400)return fail(502,"Unerwartete Weiterleitung beim Laden der Editor-Dateien.");
  if(!source.ok)return fail(503,"Admin-Dateien sind noch nicht veröffentlicht.");
  const ext=file.split(".").pop();
  const mime={html:"text/html",css:"text/css",js:"text/javascript",json:"application/json"}[ext];
  const csp=["default-src 'none'","script-src 'self'","style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://fachschaft-informatik-kst.github.io",
    "connect-src 'self'","frame-src 'self' blob:","base-uri 'none'","form-action 'none'",
    "frame-ancestors 'none'"].join("; ");
  return new Response(source.body,{headers:{
    "Content-Type":mime+"; charset=utf-8","Cache-Control":"no-store",
    "Content-Security-Policy":csp,"X-Content-Type-Options":"nosniff"
  }});
}
export default {
  async fetch(req,env){
    const url=new URL(req.url);
    try{
      if(!env.SESSION_KEY)return fail(503,"Admin-Worker ist noch nicht eingerichtet.");
      if(req.method==="GET"&&["/auth/start","/auth/callback"].includes(url.pathname))return await auth(req,env,url);
      if(req.method==="POST"&&url.pathname==="/auth/logout"){
        if(!allowedPost(req))return fail(403,"Unerlaubter Aufruf.");
        return response({ok:true},200,{"Set-Cookie":cookie("ki_session","",0)});
      }
      const session=await decrypt(env,readCookie(req,"ki_session"));
      const active=session?.exp>Date.now()?session:null;
      if(url.pathname==="/api/session"&&req.method==="GET")return response({authenticated:!!active,login:active?.login||null});
      if(url.pathname.startsWith("/api/")){
        if(!active)return fail(401,"Bitte mit GitHub anmelden.");
        if(req.method==="GET"&&url.pathname==="/api/permissions"){
          const humanCanWrite=await canWrite(active.token);
          const installation=await appInstallationStatus(active.token);
          return response({ready:humanCanWrite&&installation.ready,
            error:!humanCanWrite?"Dein GitHub-Benutzer hat keine Schreibberechtigung.":installation.reason||null});
        }
        if(req.method==="GET"&&url.pathname==="/api/chapters"){
          const tree=await github(active.token,"/repos/"+REPO+"/git/trees/main?recursive=1");
          if(tree.truncated)return fail(409,"Unvollständiger Dateiindex.");
          return response({chapters:tree.tree.filter(x=>x.type==="blob"&&allowed(x.path)&&/^kursseiten\/[^/]+\/[0-9]{3}-[^/]+\.md$/.test(x.path)).map(x=>({path:x.path,sha:x.sha}))});
        }
        if(req.method==="GET"&&url.pathname==="/api/notebooks"){
          const tree=await github(active.token,"/repos/"+REPO+"/git/trees/main?recursive=1");
          if(tree.truncated)return fail(409,"Unvollständiger Dateiindex.");
          return response({notebooks:tree.tree.filter(x=>x.type==="blob"&&x.path.endsWith(".ipynb")&&allowed(x.path)).map(x=>({path:x.path,sha:x.sha}))});
        }
        if(req.method==="GET"&&url.pathname==="/api/file"){
          const path=url.searchParams.get("path");
          if(!allowed(path)||!/\.(md|json|ipynb)$/.test(path))return fail(400,"Ungültige Datei.");
          const f=await github(active.token,"/repos/"+REPO+"/contents/"+path+"?ref=main");
          if(f.encoding!=="base64")return fail(409,"Datei nicht lesbar.");
          const content=decoder.decode(Uint8Array.from(atob(f.content.replace(/\s/g,"")),c=>c.charCodeAt(0)));
          return response({path,sha:f.sha,content});
        }
        if(req.method==="POST"&&url.pathname==="/api/publish")return await publish(req,active.token);
        return fail(404,"Unbekannte Funktion.");
      }
      if(req.method==="GET")return await staticPage(url);
      return fail(405,"Methode nicht erlaubt.");
    }catch(err){return fail(err.status>=400&&err.status<500?err.status:502,
      String(err.message||"GitHub nicht erreichbar").slice(0,230));}
  }
};

export {appInstallationStatus};
