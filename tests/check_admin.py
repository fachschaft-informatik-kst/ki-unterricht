"""Basic contracts for the static teacher editor and its GitHub gateway."""
from pathlib import Path
from bs4 import BeautifulSoup
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"scripts"))
from build_portal import render_fragment

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
archived=render_fragment("---\ntype: chapter\nid: example-archived\nnummer: \"7\"\ntitel: \"Archiviert\"\nkurz: \"Nicht sichtbar\"\narchiviert: true\n---\n<label><textarea data-answer=\"old_answer\"></textarea></label>\n",ROOT/"kursseiten"/"test.md")
fragment=BeautifulSoup(archived,"html.parser")
chapter=fragment.select_one("details#example-archived")
assert chapter.has_attr("hidden") and chapter["data-archived"]=="true"
assert fragment.select_one('textarea[data-answer="old_answer"]'),"Archived answer keys must survive"
print("PASS static teacher editor, reversible archive and protected OAuth gateway contracts")
