import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {readFileSync,readdirSync} from "node:fs";
import {lessonTemplate} from "../shared/course-model.js";
import backend,{appInstallationStatus} from "../admin-worker/src/index.mjs";
const env={SESSION_KEY:randomBytes(32).toString("base64url")};
async function route(path,opts={}){
  return backend.fetch(new Request("https://teacher-editor.example"+path,opts),env);
}
const unauth=await route("/api/session");
assert.equal(unauth.status,200);
assert.equal((await unauth.json()).authenticated,false);
assert.equal((await route("/api/chapters")).status,401);
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
  for(const [path,mime] of [["/admin.js","text/javascript"],["/plan-editor.js","text/javascript"],
      ["/course-model.js","text/javascript"],["/course-rules.json","application/json"]]){
    const result=await route(path);
    assert.equal(result.status,200,"Worker route missing: "+path);
    assert.match(result.headers.get("Content-Type"),new RegExp(mime));
    assert.equal(result.headers.get("X-Content-Type-Options"),"nosniff");
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
const manifest=JSON.parse(readFileSync(new URL("../kursseiten/manifest.json",import.meta.url)));
const basisManifest=JSON.parse(readFileSync(new URL("../kursseiten/basis-manifest.json",import.meta.url)));
const sources=new Map([["kursseiten/manifest.json",JSON.stringify(manifest)],["kursseiten/basis-manifest.json",JSON.stringify(basisManifest)]]);
for(const section of [...manifest.sections,...basisManifest.sections].filter(s=>s.teaching)){
  const prefix="kursseiten/"+section.id+"/";
  for(const name of readdirSync(new URL("../"+prefix,import.meta.url))){
    if(/\.(json|md)$/.test(name))
      sources.set(prefix+name,readFileSync(new URL("../"+prefix+name,import.meta.url),"utf8"));
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
  {path:"kursseiten/manifest.json",expectedSha:"a".repeat(40),content:JSON.stringify(nextManifest)},
  {path:"kursseiten/test-topic/planung.json",expectedSha:null,content:JSON.stringify({
    lessons:[{...lessonTemplate("test-topic","Test","test-topic"),order:110}]
  })},
  {path:"kursseiten/test-topic/010-test.md",expectedSha:null,content:'---\ntype: chapter\nid: test-topic-test\nnummer: "1"\ntitel: Test\nkurz: Test\n---\n\nTest'},
  {path:"kursseiten/test-topic/materialien.md",expectedSha:null,content:"## Doppellektion test-topic\n"}
];
const writes=[];
try{
  globalThis.fetch=async(url,options={})=>{
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
      data={content:Buffer.from(sources.get(source)).toString("base64")};
    }else if(path.includes("/git/ref/"))data={object:{sha:"a".repeat(40)}};
    else if(path.includes("/git/commits/"))data={tree:{sha:"a".repeat(40)}};
    else if(path.includes("/git/trees/"))data={tree:[...sources.keys()].map(path=>({path,type:"blob",sha:"a".repeat(40)}))};
    else throw Error("Unexpected API request "+path);
    return Response.json(data);
  };
  const submit=(changes,origin="https://teacher-editor.example")=>route("/api/publish",{
    method:"POST",headers:{"Content-Type":"application/json",Origin:origin,Cookie:"ki_session="+session},
    body:JSON.stringify({title:"New topic",changes})
  });
  const published=await submit(changes);
  assert.equal(published.status,201,await published.clone().text());
  assert.equal((await published.json()).number,1);
  assert.equal(writes.length,4,"Exactly one tree, commit, branch and PR");
  const tree=writes.find(w=>w.path.endsWith("/git/trees")).body.tree;
  assert.deepEqual(tree.map(e=>e.path),changes.map(c=>c.path));
  assert.ok(tree.every(e=>typeof e.content==="string"&&!e.sha),"JSON and Markdown are UTF-8 text, not image blobs");
  writes.length=0;
  assert.equal((await submit(changes,"https://evil.example")).status,403);
  assert.equal((await submit(changes.map((c,i)=>i===0?{...c,expectedSha:"c".repeat(40)}:c))).status,409);
  const renamed=JSON.parse(sources.get("kursseiten/einstieg/planung.json"));
  renamed.lessons[0].id="renamed";
  const rejected=await submit([{path:"kursseiten/einstieg/planung.json",expectedSha:"a".repeat(40),content:JSON.stringify(renamed)}]);
  assert.equal(rejected.status,400);
  assert.match((await rejected.json()).error,/Lektions-IDs/);
  assert.equal((await submit(changes.filter(c=>!c.path.endsWith("materialien.md")))).status,400);
  assert.equal(writes.length,0,"Invalid courses and conflicts must never create Git objects");
}finally{globalThis.fetch=priorFetch;}
// OAuth flow is intentionally not fully simulated: no GitHub credentials in CI.
console.log("PASS admin: protected endpoints, OAuth PKCE, app permissions, atomic course PR, stable IDs and conflict protection");

// The editor's Markdown table recognizer must accept the real DL3 truth
// tables (including two-hyphen alignment cells) from both course variants.
const editorSource=readFileSync(new URL("../projekt/admin/admin.js",import.meta.url),"utf8");
const separatorDefinition=editorSource.match(/const isSeparator=line=>(\/[^\n]+?\/)\.test\(line\);/);
assert.ok(separatorDefinition,"Editor table separator recognizer missing");
const separatorRegex=Function("return "+separatorDefinition[1])();
for(const course of ["perzeptron","basis-neuron"]){
  const chapter=readFileSync(new URL("../kursseiten/"+course+"/030-perzeptron-3.md",import.meta.url),"utf8");
  const lines=chapter.split(/\r?\n/);
  const headerIndex=lines.findIndex(line=>line.includes("| AND | OR | NAND |"));
  assert.ok(headerIndex>=0,course+" truth table missing");
  assert.ok(separatorRegex.test(lines[headerIndex+1]),course+" truth table not recognized by editor");
  const rows=lines.slice(headerIndex+2,headerIndex+6);
  assert.equal(rows.length,4);
  assert.ok(rows.every(line=>line.trim().startsWith("|")&&line.trim().endsWith("|")));
}
