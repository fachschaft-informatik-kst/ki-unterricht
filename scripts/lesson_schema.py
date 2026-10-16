"""One source file per lesson, with validation and a legacy compatibility output."""
from __future__ import annotations
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PHASES=("Ankommen","Vorwissen aktivieren","Informieren","Verarbeiten","Auswerten")
LEGACY_VIEWS={"einstieg","lernarten","perzeptron","netze","projekt","sprache","gesellschaft"}

def validate(lesson:dict,identifier:str)->None:
    if not isinstance(lesson,dict) or lesson.get("id")!=identifier:
        raise ValueError(f"Ungültige Lektions-ID: {identifier}")
    if lesson.get("view") not in LEGACY_VIEWS|{f"lektion-{identifier}"}:
        raise ValueError(f"Unbekannter Bereich: {identifier}")
    if any(not isinstance(lesson.get(k),str) or not lesson[k].strip() for k in ("title","goal","question","product")):
        raise ValueError(f"Doppellektion {identifier}: Pflichtfeld fehlt")
    phases=lesson.get("phases")
    if not isinstance(phases,list) or [x.get("phase") for x in phases]!=list(PHASES):
        raise ValueError("Genau fünf AVIVA-Phasen erforderlich")
    if sum(p.get("minutes",0) for p in phases)!=90:
        raise ValueError("Genau 90 Minuten pro Doppellektion erforderlich")
    for phase in phases:
        steps=phase.get("schritte")
        if not isinstance(phase.get("minutes"),int) or phase["minutes"]<1 or not phase.get("titel") or not isinstance(steps,list) or not steps or steps[-1].get("art")!="Ergebnis":
            raise ValueError("Jede AVIVA-Phase braucht Titel, Dauer und ein Ergebnis")
        if sum(s.get("min",0) for s in steps)!=phase["minutes"]:
            raise ValueError("Minuten der Einzelschritte müssen zur Phase passen")
        if any(not s.get("text") or not s.get("wer") or not s.get("art") for s in steps):
            raise ValueError("Unvollständiger AVIVA-Schritt")

def load_lessons(root:Path=ROOT)->list[dict]:
    folder=root/"unterricht"/"lektionen"
    paths=sorted(folder.glob("[0-9][0-9].json"))
    if not paths or [p.stem for p in paths]!=[f"{i:02d}" for i in range(1,len(paths)+1)]:
        raise ValueError("Lektionsdateien müssen von 01 an lückenlos nummeriert sein")
    lessons=[]
    for path in paths:
        value=json.loads(path.read_text(encoding="utf-8"))
        validate(value,path.stem)
        if value["view"].startswith("lektion-"):
            folder=root/"kursseiten"/"lektionen"/path.stem
            materials=root/"lehrperson"/"lektionen"/(path.stem+".md")
            if not folder.is_dir() or not list(folder.glob("*.md")) or not materials.is_file():
                raise ValueError(f"Doppellektion {path.stem}: Kurskapitel oder Lehrpersonenmaterial fehlt")
        lessons.append(value)
    return lessons

def write_compatibility_file(root:Path=ROOT)->list[dict]:
    lessons=load_lessons(root)
    path=root/"projekt"/"kurs.json"
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps({"minutes":90,"model":"AVIVA","lessons":lessons},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return lessons
