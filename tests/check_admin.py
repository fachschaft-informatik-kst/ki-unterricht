"""Basic contracts for the static teacher editor and its GitHub gateway."""
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
site=ROOT/"projekt/admin"
worker=ROOT/"admin-worker/src/index.mjs"
for name in ("index.html","admin.css","admin.js"):
    assert (site/name).is_file(),name
assert worker.is_file()
source=(site/"index.html").read_text(encoding="utf-8")
soup=BeautifulSoup(source,"html.parser")
iframe=soup.find("iframe",id="preview")
assert iframe is not None and iframe.has_attr("sandbox") and not iframe.get("sandbox")
assert soup.select_one("script[src='admin.js'][type='module']")
for selector in ("#source","#create","#addImage","#addAnswer","#stage","#publish","#archive","#login"):
    assert soup.select_one(selector),selector
code=(site/"admin.js").read_text(encoding="utf-8")
for item in ("/api/file","/api/chapters","/api/publish","data-answer",
             "grafiken/uploads/","sandbox"):
    assert item in code,item
backend=worker.read_text(encoding="utf-8")
for item in ("GITHUB_CLIENT_SECRET","GITHUB_CLIENT_ID","SESSION_KEY",
             "AES-GCM","code_challenge_method","/auth/callback","/git/trees",
             "/git/commits","/pulls","SameSite=Lax","expectedSha"):
    assert item in backend,item
course=(ROOT/"projekt/index.html").read_text(encoding="utf-8")
assert '<a href="admin/">' in course
assert "access_token" not in source and "client_secret" not in source
print("PASS static teacher editor, sandboxed preview and GitHub App gateway contracts")
