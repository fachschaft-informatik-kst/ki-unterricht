import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {readFileSync,readdirSync} from "node:fs";
import {lessonTemplate} from "../shared/course-model.js";
import backend,{appInstallationStatus} from "../admin-worker/src/index.mjs";
import {parseTeacher,teacherData,teacherShell,DOWNLOADS} from "../admin-worker/src/teacher.mjs";
const env={SESSION_KEY:randomBytes(32).toString("base64url")};
assert.deepEqual(parseTeacher("/teacher/bok/4-klasse/planung"),{course:"bok/4-klasse",kind:"planung"});
assert.deepEqual(parseTeacher("/teacher/irn/1-klasse/musterloesungen"),{course:"irn/1-klasse",kind:"musterloesungen"});
assert.equal(parseTeacher("/teacher/bok/1-klasse/../../api/session"),null);
assert.match(teacherShell({course:"bok/1-klasse",kind:"materialien"}),/Lehrpersonenbereich/);
assert.equal(Object.keys(DOWNLOADS).length,4);
async function route(path,opts={}){
  return backend.fetch(new Request("https://teacher-editor.example"+path,opts),env);
}
const unauth=await route("/api/session");
assert.equal(unauth.status,200);
assert.equal((await unauth.json()).authenticated,false);
assert.equal((await route("/api/chapters")).status,401);
assert.equal((await route("/api/teacher?course=bok%2F1-klasse&kind=planung")).status,401);
assert.equal((await route("/api/teacher?course=bok%2F4-klasse&kind=musterloesungen")).status,401);
const teacherGuest=await route("/teacher/bok/1-klasse/materialien");
assert.equal(teacherGuest.status,302,"Teacher pages must redirect unauthenticated users to GitHub OAuth");
assert.equal(teacherGuest.headers.get("Location"),
  "/auth/start?next=%2Fteacher%2Fbok%2F1-klasse%2Fmaterialien");
assert.equal((await route("/teacher/irn/1-klasse/materialien")).status,302);
assert.equal((await route("/teacher/downloads/Arbeitsblatt_Perzeptron_Lsg.md")).status,302);
assert.equal((await route("/teacher/bok/4-klasse/unknown")).status,404);
assert.equal((await route("/api/file?path=kursseiten/einstieg/010-einstieg-1.md")).status,401);
assert.equal((await route("/api/publish",{method:"POST",headers:{"Content-Type":"application/json","Origin":"https://teacher-editor.example"},body:'{"changes":[]}'})).status,401);
assert.equal((await route("/auth/start")).status,503);
assert.equal((await route("/auth/callback?code=wrong&state=wrong")).status,503);
assert.equal((await route("/auth/logout",{method:"POST",headers:{"Content-Type":"application/json","Origin":"https://evil.example"},body:"{}"})).status,403);
const logout=await route("/auth/logout",{method:"POST",headers:{"Content-Type":"application/json","Origin":"https://teacher-editor.example"},body:"{}"});
assert.equal(logout.status,200);
assert.match(logout.headers.get("Set-Cookie"),/HttpOnly; Secure; SameSite=Lax/);
env.GITHUB_CLIENT_ID="dummy-client";
env.GITHUB_CLIENT_SECRET="dummy-secret";
const auth=await route("/auth/start");
assert.equal(auth.status,302);
assert.equal(new URL(auth.headers.get("Location")).host,"github.com");
const query=new URL(auth.headers.get("Location")).searchParams;
assert.equal(query.get("code_challenge_method"),"S256");
assert.equal(query.get("code_challenge").length,43);
assert.ok(query.get("state").length>=32);
assert.match(auth.headers.get("Set-Cookie"),/HttpOnly; Secure; SameSite=Lax/);
const invalid=await route("/auth/callback?code=wrong&state=wrong");
assert.equal(invalid.status,403);
// Asynchronous upstream errors must be caught by the Worker and encoded as
// JSON. Otherwise Cloudflare returns a bare Error 1101 HTML page.
const priorFetch=globalThis.fetch;
try{
  globalThis.fetch=async()=>{throw Error("Mock static upstream unavailable");};
  const failure=await route("/admin.css");
  assert.equal(failure.status,502);
  assert.equal((await failure.json()).error,"Mock static upstream unavailable");
}finally{globalThis.fetch=priorFetch;}
// The Cloudflare Worker must serve the new browser modules with the correct
// MIME types; the editor cannot start if its import dependency returns a 404.
const priorStaticFetch=globalThis.fetch;
try{
  const files=[];
  globalThis.fetch=async url=>{
    files.push(String(url));
    return new Response("export const ok = true;",{status:200,headers:{"Content-Type":"text/javascript"}});
  };
  for(const [path,mime] of [["/admin.js","text/javascript"],["/markdown-it.min.js","text/javascript"],["/plan-editor.js","text/javascript"],
      ["/course-model.js","text/javascript"],["/glossary-model.js","text/javascript"],["/course-rules.json","application/json"],["/teacher.js","text/javascript"],["/teacher.css","text/css"]]){
    const result=await route(path);
    assert.equal(result.status,200,"Worker route missing: "+path);
    assert.match(result.headers.get("Content-Type"),new RegExp(mime));
    assert.equal(result.headers.get("X-Content-Type-Options"),"nosniff");
    const csp=result.headers.get("Content-Security-Policy");
    assert.match(csp,/frame-src 'self' blob: https:\/\/fachschaft-informatik-kst\.github\.io(?:;|$)/,
      "Authenticated editor must explicitly permit framing the trusted Pages JupyterLite runtime");
    assert.match(csp,/frame-ancestors 'none'/,"Editor itself must remain protected against framing");
    assert.doesNotMatch(csp,/frame-src[^;]*\*/,"Do not allow arbitrary origins in notebook frames");
  }
  assert.ok(files.every(x=>x.startsWith("https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/admin/")));
}finally{globalThis.fetch=priorStaticFetch;}

// The authenticated user's push permission is not enough: the GitHub App
// must be installed on the organization repo with both write permissions.
const app=async(token,path)=>{
  if(path.startsWith("/user/installations?"))return {installations:[{
    id:42,account:{login:"fachschaft-informatik-kst"},
    permissions:{contents:"write",pull_requests:"write"},
    repository_selection:"selected"
  }]};
  if(path.startsWith("/user/installations/42/repositories?"))return {
    total_count:1,repositories:[{full_name:"fachschaft-informatik-kst/ki-unterricht"}]
  };
  throw Error("Unexpected mock request "+path);
};
assert.equal((await appInstallationStatus("dummy",app)).ready,true);
const withoutInstall=await appInstallationStatus("dummy",async()=>({installations:[]}));
assert.equal(withoutInstall.ready,false);
assert.match(withoutInstall.reason,/nicht auf der Organisation/);
const lackingPull=await appInstallationStatus("dummy",async()=>({installations:[{
  id:42,account:{login:"fachschaft-informatik-kst"},
  permissions:{contents:"write",pull_requests:"read"},
  repository_selection:"all"
}]}));
assert.equal(lackingPull.ready,false);
assert.match(lackingPull.reason,/Pull requests/);
const wrongRepo=await appInstallationStatus("dummy",async(token,path)=>
  path.startsWith("/user/installations/")?
    {total_count:1,repositories:[{full_name:"fachschaft-informatik-kst/anderes-repo"}]}:
    {installations:[{id:42,account:{login:"fachschaft-informatik-kst"},
      permissions:{contents:"write",pull_requests:"write"},repository_selection:"selected"}]});
assert.equal(wrongRepo.ready,false);
assert.match(wrongRepo.reason,/Repository/);
// Exercise the actual publisher against an isolated GitHub API contract.
const registry=JSON.parse(readFileSync(new URL("../shared/course-sites.json",import.meta.url),"utf8"));
const bySlug=Object.fromEntries(registry.courses.map(c=>[c.slug,c]));
const first="kurse/bok/1-klasse/",fourth="kurse/bok/4-klasse/";
const manifest=JSON.parse(readFileSync(new URL("../"+bySlug["bok/4-klasse"].manifest,import.meta.url),"utf8"));
const sources=new Map([["shared/course-sites.json",JSON.stringify(registry)]]);
for(const course of registry.courses){
  const source=course.courseRoot+"/kursseiten/";
  const doc=JSON.parse(readFileSync(new URL("../"+course.manifest,import.meta.url),"utf8"));
  sources.set(course.manifest,JSON.stringify(doc));
  sources.set(source+"glossar.json",
    readFileSync(new URL("../"+source+"glossar.json",import.meta.url),"utf8"));
  for(const section of doc.sections.filter(x=>x.teaching)){
    const prefix=source+section.id+"/";
    for(const name of readdirSync(new URL("../"+prefix,import.meta.url))){
      if(/\.(json|md)$/.test(name))
        sources.set(prefix+name,readFileSync(new URL("../"+prefix+name,import.meta.url),"utf8"));
    }
  }
}
const sessionKey=await crypto.subtle.importKey("raw",Buffer.from(env.SESSION_KEY,"base64url"),"AES-GCM",false,["encrypt"]);
const iv=randomBytes(12);
const encrypted=await crypto.subtle.encrypt({name:"AES-GCM",iv},sessionKey,
  new TextEncoder().encode(JSON.stringify({token:"test-user-token",login:"test",exp:Date.now()+60000})));
const session=iv.toString("base64url")+"."+Buffer.from(encrypted).toString("base64url");
const nextManifest=structuredClone(manifest);
nextManifest.sections.push({id:"test-topic",class:"section",teaching:true,navigation:{order:100,label:"",title:"Test"}});
const changes=[
  {path:fourth+"kursseiten/manifest.json",expectedSha:"a".repeat(40),content:JSON.stringify(nextManifest)},
  {path:fourth+"kursseiten/test-topic/planung.json",expectedSha:null,content:JSON.stringify({
    lessons:[{...lessonTemplate("test-topic","Test","test-topic"),order:110}]
  })},
  {path:fourth+"kursseiten/test-topic/010-test.md",expectedSha:null,content:'---\ntype: chapter\nid: test-topic-test\nnummer: "1"\ntitel: Test\nkurz: Test\n---\n\nTest'},
  {path:fourth+"kursseiten/test-topic/materialien.md",expectedSha:null,content:"## Doppellektion test-topic\n"}
];
const writes=[];
let requests=[];
try{
  globalThis.fetch=async(url,options={})=>{
    requests.push(String(url));
    assert.ok(requests.length<=50,"Publisher must stay within the 50-subrequest Worker budget");
    const path=new URL(url).pathname;
    const method=options.method||"GET";
    let data;
    if(path==="/repos/fachschaft-informatik-kst/ki-unterricht")data={permissions:{push:true}};
    else if(path==="/user/installations")data={installations:[{
      account:{login:"fachschaft-informatik-kst"},permissions:{contents:"write",pull_requests:"write"},repository_selection:"all"
    }]};
    else if(method==="POST"){
      const body=JSON.parse(options.body);
      writes.push({path,body});
      data=path.endsWith("/pulls")?{html_url:"https://github.com/example/test/pull/1",number:1}:{sha:"b".repeat(40)};
    }else if(path.includes("/contents/")){
      const source=path.split("/contents/")[1];
      assert.ok(sources.has(source),"Unexpected source "+source);
      data={encoding:"base64",content:Buffer.from(sources.get(source)).toString("base64")};
    }else if(path.includes("/git/ref/"))data={object:{sha:"a".repeat(40)}};
    else if(path.includes("/git/commits/"))data={tree:{sha:"a".repeat(40)}};
    else if(path.includes("/git/trees/"))data={tree:[...sources.keys()].map(path=>({path,type:"blob",sha:"a".repeat(40)}))};
    else throw Error("Unexpected API request "+path);
    return Response.json(data);
  };
  const submit=(changes,origin="https://teacher-editor.example")=>{
    requests=[];
    return route("/api/publish",{
    method:"POST",headers:{"Content-Type":"application/json",Origin:origin,Cookie:"ki_session="+session},
    body:JSON.stringify({title:"New topic",changes})
    });
  };
  const published=await submit(changes);
  assert.equal(published.status,201,await published.clone().text());
  assert.equal((await published.json()).number,1);
  const reads=requests.filter(url=>url.includes("/contents/"));
  assert.equal(new Set(reads).size,reads.length,"Read each source only once per invocation");
  assert.ok(reads.every(url=>url.includes("/contents/shared/course-sites.json")||
    url.includes("/contents/"+fourth)),"Do not fetch unrelated courses while publishing");
  assert.equal(writes.length,4,"Exactly one tree, commit, branch and PR");
  const tree=writes.find(w=>w.path.endsWith("/git/trees")).body.tree;
  assert.deepEqual(tree.map(e=>e.path),changes.map(c=>c.path));
  assert.ok(tree.every(e=>typeof e.content==="string"&&!e.sha),"JSON and Markdown are UTF-8 text, not image blobs");
  writes.length=0;
  assert.equal((await submit(changes,"https://evil.example")).status,403);
  assert.equal((await submit(changes.map((c,i)=>i===0?{...c,expectedSha:"c".repeat(40)}:c))).status,409);
  const renamed=JSON.parse(sources.get(fourth+"kursseiten/einstieg/planung.json"));
  renamed.lessons[0].id="renamed";
  const rejected=await submit([{path:fourth+"kursseiten/einstieg/planung.json",expectedSha:"a".repeat(40),content:JSON.stringify(renamed)}]);
  assert.equal(rejected.status,400);
  assert.match((await rejected.json()).error,/Lektions-IDs/);
  assert.equal((await submit(changes.filter(c=>!c.path.endsWith("materialien.md")))).status,400);
  assert.equal(writes.length,0,"Invalid courses and conflicts must never create Git objects");
  // Glossary updates use the same atomic PR workflow. Existing deep-link IDs are protected.
  const glossary=JSON.parse(sources.get(fourth+"kursseiten/glossar.json"));
  const glossaryChanges=doc=>[{path:fourth+"kursseiten/glossar.json",expectedSha:"a".repeat(40),content:JSON.stringify(doc)}];
  const edited=structuredClone(glossary);
  edited.begriffe[0].basis="Einfache Unterrichtserklärung für die 1. Klasse.";
  edited.begriffe[0].vertieft="Ausführliche technische Erklärung für die 4. Klasse.";
  assert.equal((await submit(glossaryChanges(edited))).status,201);
  assert.equal(writes.find(w=>w.path.endsWith("/git/trees")).body.tree[0].path,fourth+"kursseiten/glossar.json");
  writes.length=0;
  const removed=structuredClone(glossary);removed.begriffe.shift();
  const blocked=await submit(glossaryChanges(removed));
  assert.equal(blocked.status,400);
  assert.match((await blocked.json()).error,/Glossar-IDs/);
  const invalid=structuredClone(glossary);invalid.begriffe[0].basis=invalid.begriffe[0].vertieft;
  assert.equal((await submit(glossaryChanges(invalid))).status,400);
  assert.equal(writes.length,0,"Invalid glossary edits must not write to GitHub");
  // A new lesson notebook may be created from the editor, but is not allowed
  // to appear without its corresponding chapter in the same atomic PR.
  const lessonNotebook={nbformat:4,nbformat_minor:5,
    metadata:{kernelspec:{name:"python3",language:"python",display_name:"Python 3"}},
    cells:[
      {cell_type:"markdown",id:"nbtask01",metadata:{},source:["# Notebook-Auftrag\\n"]},
      {cell_type:"code",id:"nbcode01",metadata:{},source:["print('Hallo')\\n"],execution_count:null,outputs:[]}
    ]};
  const lessonFile=fourth+"content/lesson_einstieg_testlabor.ipynb";
  const newNotebook={path:lessonFile,expectedSha:null,content:JSON.stringify(lessonNotebook)};
  const chapterFile=fourth+"kursseiten/einstieg/030-einstieg-3.md";
  const chapterLinked={path:chapterFile,expectedSha:"a".repeat(40),
    content:sources.get(chapterFile)+'\\n<div class="ki-notebook-block" data-notebook="'+lessonFile.slice(fourth.length)+'"></div>\\n'};
  const alone=await submit([newNotebook]);
  assert.equal(alone.status,400);
  assert.match((await alone.json()).error,/Unterkapitel/);
  assert.equal((await submit([chapterLinked,newNotebook])).status,201,
    "Chapter and fresh notebook must be accepted in one PR");
  assert.equal(writes.find(w=>w.path.endsWith("/git/trees")).body.tree.length,2);
  writes.length=0;
  const otherCourse={...chapterLinked,path:first+"kursseiten/basis-neuron/030-perzeptron-3.md",
    content:sources.get(first+"kursseiten/basis-neuron/030-perzeptron-3.md")+
      '\\n<div class="ki-notebook-block" data-notebook="'+lessonFile.slice(fourth.length)+'"></div>'};
  assert.equal((await submit([otherCourse,newNotebook])).status,400,
    "A fourth-year notebook must not be linked from first-year pages");
  assert.equal(writes.length,0);
  const image={path:fourth+"assets/grafiken/uploads/test.png",expectedSha:null,
    content:Buffer.from([137,80,78,71,13,10,26,10,...Array(16).fill(0)]).toString("base64")};
  assert.equal((await submit([{...chapterLinked,content:sources.get(chapterFile)},image])).status,201);
  assert.equal((await submit([
    {...chapterLinked,content:sources.get(chapterFile)},
    ...Array.from({length:11},(_,i)=>({...image,path:fourth+"assets/grafiken/uploads/test-"+i+".png"}))
  ])).status,201,"Maximum-size 12-file upload must fit the subrequest budget");
  writes.length=0;
  assert.equal((await submit([{...image,path:"assets/grafiken/uploads/test.png"}])).status,400);
  assert.equal((await submit([otherCourse,image])).status,400,"Uploads must belong to the same course as chapters");
  assert.equal(writes.length,0);
  const download=bySlug["irn/1-klasse"].courseRoot+"/"+DOWNLOADS["Arbeitsblatt_Perzeptron_Lsg.md"];
  sources.set(download,"IRN course-local download");
  const response=await route("/teacher/downloads/Arbeitsblatt_Perzeptron_Lsg.md?course=irn%2F1-klasse",{
    headers:{Cookie:"ki_session="+session}
  });
  assert.equal(response.status,200,await response.clone().text());
  assert.equal(await response.text(),"IRN course-local download");
  assert.equal((await route("/teacher/downloads/Arbeitsblatt_Perzeptron_Lsg.md?course=unknown",{
    headers:{Cookie:"ki_session="+session}
  })).status,404);

  // Word documents: session download, signed short-lived link for the local Word app.
  const docRoot=bySlug["irn/4-klasse"].courseRoot+"/lehrperson/dokumente/";
  sources.set(docRoot+"dokumente.json",readFileSync(new URL("../"+docRoot+"dokumente.json",import.meta.url),"utf8"));
  sources.set(docRoot+"DL01_1_Ankommen.docx","DOCX-BYTES");
  const docPath="/teacher/dokumente/DL01_1_Ankommen.docx?course=irn%2F4-klasse";
  assert.equal((await route(docPath)).status,302,"Documents require OAuth without a ticket");
  const direct=await route(docPath,{headers:{Cookie:"ki_session="+session}});
  assert.equal(direct.status,200,await direct.clone().text());
  assert.equal(await direct.text(),"DOCX-BYTES");
  assert.match(direct.headers.get("Content-Type"),/wordprocessingml/);
  assert.equal((await route("/teacher/dokumente/Unlisted.docx?course=irn%2F4-klasse",
    {headers:{Cookie:"ki_session="+session}})).status,404,"Only indexed documents are served");
  assert.equal((await route("/api/teacher/dokument-link?course=irn%2F4-klasse&file=DL01_1_Ankommen.docx")).status,401);
  const linkResponse=await route("/api/teacher/dokument-link?course=irn%2F4-klasse&file=DL01_1_Ankommen.docx",
    {headers:{Cookie:"ki_session="+session}});
  assert.equal(linkResponse.status,200,await linkResponse.clone().text());
  const link=await linkResponse.json();
  assert.equal(link.word,"ms-word:ofe|u|"+link.url);
  assert(link.url.startsWith("https://teacher-editor.example/teacher/dokumente/DL01_1_Ankommen.docx?course=irn%2F4-klasse&ticket="));
  assert(!link.url.includes("test-user-token"),"The GitHub token is encrypted in the ticket");
  const signedPath=link.url.replace("https://teacher-editor.example","");
  const viaWord=await route(signedPath);
  assert.equal(viaWord.status,200,"Word opens the signed link without the browser cookie");
  assert.equal(await viaWord.text(),"DOCX-BYTES");
  const head=await route(signedPath,{method:"HEAD"});
  assert.equal(head.status,200);assert.equal(await head.text(),"");
  assert.equal((await route(signedPath,{method:"OPTIONS"})).status,200);
  assert.equal((await route(signedPath.replace("DL01_1_Ankommen","DL01_2_Vorwissen_aktivieren"))).status,403,
    "A ticket is bound to one document");
  assert.equal((await route(signedPath.replace("irn%2F4-klasse","bok%2F4-klasse"))).status,403);
  const ticket=new URL(link.url).searchParams.get("ticket");
  const asSession=await route("/api/session",{headers:{Cookie:"ki_session="+ticket}});
  assert.equal((await asSession.json()).authenticated,false,"A Word ticket is never a session");
  assert.equal((await route("/api/teacher/dokument-link?course=irn%2F4-klasse&file=IRN_4-Klasse_Alle_Dokumente.zip",
    {headers:{Cookie:"ki_session="+session}})).status,400,"ZIP files are not opened in Word");
  const realNow=Date.now;
  try{
    Date.now=()=>realNow()+11*60*1000;
    assert.equal((await route(signedPath)).status,403,"Word links expire after ten minutes");
  }finally{Date.now=realNow;}

}finally{globalThis.fetch=priorFetch;}

// Direct source URLs and downloads must not be reachable without OAuth.
// The Worker must not use public GitHub Pages as the teacher content backend.
const fakeSources={
  [first+"kursseiten/manifest.json"]:JSON.stringify({sections:[{id:"basis-test",teaching:true,navigation:{title:"Testbereich"}}]}),
  [first+"kursseiten/basis-test/planung.json"]:JSON.stringify({lessons:[{number:1,id:"basis-test",view:"basis-test",title:"Beispiel",phases:[]}]}),
  [first+"kursseiten/basis-test/materialien.md"]:"## Beispielmaterial",
  [first+"lehrperson/musterloesungen.md"]:"# Allgemein",
  [first+"lehrperson/musterloesungen-felder.md"]:"# Musterantworten"
};
const fakeGithub=async(_token,path)=>{
  const name=path.split("/contents/")[1].split("?")[0];
  if(!(name in fakeSources))throw Error("Unexpected private source path "+name);
  return {encoding:"base64",content:Buffer.from(fakeSources[name]).toString("base64")};
};
const teacherPlan=await teacherData({course:"bok/1-klasse",kind:"planung"},"token",fakeGithub,"example/repo");
assert.equal(teacherPlan.lessons[0].title,"Beispiel");
const irnSources=Object.fromEntries([...sources.entries()]
  .filter(([path])=>path.startsWith("kurse/irn/1-klasse/")));
for(const filepath of Object.values(bySlug["irn/1-klasse"].teacherFiles))
  irnSources[filepath]=readFileSync(new URL("../"+filepath,import.meta.url),"utf8");
const irnGithub=async(_token,route)=>{
  if(route.includes("/git/trees/main"))return {tree:[],truncated:false};
  const name=route.split("/contents/")[1]?.split("?")[0];
  assert(name in irnSources,"IRN must only read its own sources: "+name);
  return {encoding:"base64",content:Buffer.from(irnSources[name]).toString("base64")};
};
const irnPlan=await teacherData({course:"irn/1-klasse",kind:"planung"},"token",irnGithub,"example/repo");
assert.equal(irnPlan.lessons.length,10);
assert(irnPlan.lessons.every(l=>l.view.startsWith("basis-")));
const irnKit=await teacherData({course:"irn/1-klasse",kind:"materialien"},"token",irnGithub,"example/repo");
assert(irnKit.sections[0].markdown.length>20);
const irnSolutions=await teacherData({course:"irn/1-klasse",kind:"musterloesungen"},"token",irnGithub,"example/repo");
assert(irnSolutions.sections[0].markdown.length>50);

const teacherKit=await teacherData({course:"bok/1-klasse",kind:"materialien"},"token",fakeGithub,"example/repo");
assert.match(teacherKit.sections[0].markdown,/Beispielmaterial/);
const teacherSolutions=await teacherData({course:"bok/1-klasse",kind:"musterloesungen"},"token",fakeGithub,"example/repo");
assert.equal(teacherSolutions.sections.length,2);
// OAuth flow is intentionally not fully simulated: no GitHub credentials in CI.
console.log("PASS admin: protected endpoints, OAuth PKCE, app permissions, atomic course PR, stable IDs and conflict protection");
