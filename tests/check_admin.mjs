import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
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
// OAuth flow is intentionally not fully simulated: no GitHub credentials in CI.
console.log("PASS admin: protected endpoints, OAuth PKCE, encrypted-cookie gateway and origin protection");