"""P1 editorial contract: compare plans, student tasks, notebooks and assessment for both courses."""
from pathlib import Path
import json
import sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from course_model import load_course

def source(rel):
    return (ROOT/rel).read_text(encoding="utf-8")
def lesson(view,course):
    return next(x for x in course["lessons"] if x["view"]==view)
def ensure(terms,text,label):
    for term in terms:
        assert term in text,(label,term)

basic=load_course(ROOT,"kursseiten/basis-manifest.json")
advanced=load_course(ROOT)
assert len(basic["lessons"])==len(advanced["lessons"])==10
for course in (basic,advanced):
    assert [x["number"] for x in course["lessons"]]==list(range(1,11))
    assert all(sum(phase["minutes"] for phase in x["phases"])==90 for x in course["lessons"])
    assert all(x["goal"].strip() and x["product"].strip() for x in course["lessons"])

# Basiskurs DL1–4: route must distinguish guided compulsory work from
# optional algebraic challenges without editing the original advanced lessons.
for view in ("basis-ki","basis-lernen","basis-neuron","basis-netze"):
    name="kursseiten/"+view+"/000-start.md"
    body=source(name)
    ensure(("Pflichtkern","Wahlvertiefung","Hilfe"),body,name)
    assert 'data-p1-route=' in body
    assert "Wahlvertiefung" in lesson(view,basic)["zeit"] or view=="basis-lernen",view
ensure(("XOR","Zwischenschicht","Ungleichung"),source("kursseiten/basis-netze/000-start.md"),"basis-netze")
ensure(("Schwimmbad","Bias","Vorher-Nachher"),source("kursseiten/basis-neuron/000-start.md"),"basis-neuron")

# DL6–8: two explicitly equal preparation/data paths; V1 is the only
# A/B selection source; P1/P2 is a single held-out evaluation.
for view in ("basis-plan","basis-training"):
    plan=lesson(view,basic)
    ensure(("Übungsdaten",),plan["zeit"] if view=="basis-plan" else plan["goal"],view)
for rel in ("kursseiten/basis-plan/020-reflexion.md","kursseiten/basis-training/010-experiment.md"):
    text=source(rel)
    ensure(("Übungsdaten","freiwillig"),text,rel)
ensure(("V1","P1/P2","gewählte"),source("kursseiten/basis-training/010-experiment.md"),"DL7 testing")
nb=json.loads(source("content/basis_fotoprojekt.ipynb"))
nbtext="\n".join("".join(c["source"]) if isinstance(c["source"],list) else c["source"] for c in nb["cells"])
ensure(("MODUS = 'UEBUNG'","EIGENE_DATEN","P1/P2","synthetisch"),nbtext,"fotoprojekt notebook")
assert "Keine Vorbereitung zuhause nötig" in nbtext
rubric=source("kursseiten/basis-abschluss/bewertungsraster.md")
ensure(("Validierungsbildern V1","Test der gewählten Variante auf P1/P2"),rubric,"assessment")

# First-year DL9: observable, independent goal and compulsory vs optional
# match the actual student-facing activities.
lang=lesson("basis-sprache",basic)
assert "Inhalte der 4. Klasse" not in lang["goal"]
ensure(("Kontext","Vorhersage","Quelle"),lang["goal"],"basic language goal")
ensure(("Wahlvertiefung","Faktenprüfung"),lang["zeit"],"basic language timing")
ensure(("Pflichtkern","Wahlvertiefung","Tokens"),source("kursseiten/basis-sprache/000-start.md"),"language student guide")
ensure(("Schweiz hat 30 Kantone","Quelle"),source("kursseiten/basis-sprache/050-prompts.md"),"language fact check")

# 4th-year DL4 diagnostic (within existing 90 min), and unchanged DL8
# 100-minute oral exam (90 + contiguous 10 minutes).
assert "projekt_bereit_check" in source("kursseiten/netze/040-netze-4.md")
assert "Lernstandscheck" in source("kursseiten/netze/planung.json")
assert "Lernstandscheck" in source("kursseiten/projekt/000-einstieg.md")
assert "100 Minuten" in source("kursseiten/projekt/planung.json")
assert "100 Minuten" in source("kursseiten/projekt/planung.json") # unchanged exception
assert "100 Minuten" not in source("kursseiten/basis-abschluss/planung.json")

# Both built course pages expose the content; studio module is shipped as a
# distinct asset, without breaking the import/export v1 schema.
for course_path,required in [
    ("_build/site/basis/index.html",["b01","b02","b03","b04"]),
    ("_build/site/projekt/index.html",["projekt-bereit-check"]),
]:
    page=BeautifulSoup(source(course_path),"html.parser")
    for marker in required:
        assert page.select_one('[data-p1-route="'+marker+'"]') if marker.startswith("b") else page.select_one("#"+marker),marker
studio=source("content/ki_projekt/fotostudio.html")
ensure(("fotostudio_storage.js","autosave-status","storage.put","storage.putMany","storage.clear","fotostudio-v1"),studio,"studio")
assert (ROOT/"content/ki_projekt/fotostudio_storage.js").is_file()
print("PASS both courses' P1 teaching contracts, data paths, readiness check and studio storage")
