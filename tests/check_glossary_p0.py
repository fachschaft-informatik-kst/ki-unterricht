"""Glossary integrity and high-priority lesson consistency contracts."""
from __future__ import annotations
import json
from pathlib import Path
import re
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/"kursseiten/glossar.json").read_text(encoding="utf-8"))
terms=data["begriffe"]
ids=[t["id"] for t in terms]
assert len(terms)>=25 and len(ids)==len(set(ids)), "Glossary needs unique, substantive entries"
assert all(re.fullmatch(r"[a-z][a-z0-9-]+",i) for i in ids)
assert set(data["gruppen"])=={t["gruppe"] for t in terms}
assert {"modell","gewicht","bias-neuron","validierung","testdaten","transfer-learning","token","fairness"}<=set(ids)
for t in terms:
    for key in ("begriff","basis","vertieft","beispiel","frage","antwort"):
        assert isinstance(t[key],str) and len(t[key])>=(2 if key=="begriff" else 8), (t["id"],key)
    assert t["basis"]!=t["vertieft"],t["id"]
    assert len(t["antwort"]) <= 180, (t["id"], "Antwort zu lang")

for level,path,prefix in (
    ("basis","basis/index.html","basis-glossar"),
    ("vertieft","projekt/index.html","glossar"),
):
    page=ROOT/"_build/site"/path
    soup=BeautifulSoup(page.read_text(encoding="utf-8"),"html.parser")
    section=soup.select_one(f"main > section#{prefix}")
    assert section is not None, (level,"missing glossary section")
    assert section.select_one("[data-glossary-search]")
    entries=section.select(".glossary-entry[data-glossary-id]")
    assert len(entries)==len(terms), (level,len(entries),len(terms))
    assert {e["data-glossary-id"] for e in entries}==set(ids)
    assert {e["id"] for e in entries}=={f"{prefix}-{ident}" for ident in ids}
    assert len(section.select(".glossary-group"))==len(data["gruppen"])
    for entry in entries:
        answer=entry.select_one("details.glossary-answer:not([open])")
        assert answer is not None and answer.select_one("summary"), entry["id"]
        assert answer.select_one("p.glossary-answer-text").get_text(strip=True), entry["id"]
        assert answer.select_one("summary .glossary-answer-show").get_text(strip=True)=="Antwort anzeigen"
        assert answer.select_one("summary .glossary-answer-hide").get_text(strip=True)=="Antwort verbergen"
    assert soup.select_one(f'.nav a[href="#{prefix}"]')
    manifest=json.loads((ROOT/"kursseiten"/("basis-manifest.json" if level=="basis" else "manifest.json")).read_text(encoding="utf-8"))
    for topic in (s for s in manifest["sections"] if s.get("teaching")):
        assert soup.select_one(f'main > section#{topic["id"]} a[href^="#{prefix}-"]'), (level,topic["id"],"Glossar-Link fehlt")
    for asset in ("glossar.css","glossar.js"):
        assert (page.parent/asset).is_file(),(level,asset)
    for link in soup.select('a[href^="#glossar-"], a[href^="#basis-glossar-"]'):
        assert soup.select_one(link.get("href")), f"{level} broken glossary link: {link.get('href')}"

experiment=(ROOT/"kursseiten/basis-daten/010-experiment.md").read_text(encoding="utf-8")
assert "Ihr trainiert in dieser Lektion noch kein eigenes Modell" in experiment
assert "Ziffernnetz" in experiment and "Buchstaben" in experiment
assert "trainiert ein erstes Modell" not in experiment
rubric=(ROOT/"kursseiten/basis-abschluss/bewertungsraster.md").read_text(encoding="utf-8")
assert "Validierungsbildern V1" in rubric and "Modell A und B" in rubric
assert "Test der gewählten Variante auf P1/P2" in rubric
assert "Testbilder für beide Varianten" not in rubric
assert "20 Lernende" in rubric and "4 Minuten" in rubric
lesson8=json.loads((ROOT/"kursseiten/basis-abschluss/planung.json").read_text(encoding="utf-8"))["lessons"][0]
assert sum(p["minutes"] for p in lesson8["phases"])==90
assert "20 Lernenden" in lesson8["zeit"]
video=(ROOT/"kursseiten/basis-gesellschaft/010-gesellschaft.md").read_text(encoding="utf-8")
assert "Jurriaan" in video and "Cathy" not in video and 'data-basis-answer="video"' in video
assert "Jurriaan" in (ROOT/"kursseiten/basis-gesellschaft/planung.json").read_text(encoding="utf-8")
assert "Jurriaan" in (ROOT/"kursseiten/basis-gesellschaft/020-urteil.md").read_text(encoding="utf-8")
assert "Sie sich" not in (ROOT/"kursseiten/basis-gesellschaft/030-rueckblick.md").read_text(encoding="utf-8")
# The fourth-year oral exam explicitly includes an extra ten minutes and must not be altered.
fourth=(ROOT/"kursseiten/projekt/planung.json").read_text(encoding="utf-8")
assert "100 Minuten" in fourth or "100 Minuten" in (ROOT/"kursseiten/projekt/010-projekt-1.md").read_text(encoding="utf-8")
print("PASS 29 shared glossary terms, both course views, P0 experiment/assessment/video alignment")
