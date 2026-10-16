import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import backend from "../admin-worker/src/index.mjs";
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
// OAuth flow is intentionally not fully simulated: no GitHub credentials in CI.
console.log("PASS admin: protected endpoints, OAuth PKCE, encrypted-cookie gateway and origin protection");