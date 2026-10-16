"""Create student chapter, AVIVA plan and teacher materials for a new double lesson."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from lesson_schema import PHASES,ROOT,load_lessons,validate

def template(identifier:str,title:str)->dict:
    minutes=(5,10,15,50,10)
    phases=[]
    for phase,m in zip(PHASES,minutes):
        phases.append({"phase":phase,"titel":phase+" · "+title,"minutes":m,"schritte":[
            {"art":"Auftrag","wer":"Tandem","min":m,"text":phase+": Auftrag zum Thema "+title+" präzisieren."},
            {"art":"Ergebnis","wer":"Ergebnis","text":"Ergebnis zu "+phase+" festhalten."}
        ]})
    return {"id":identifier,"view":"lektion-"+identifier,"title":title,
            "goal":"Das Thema «"+title+"» fachlich begründet bearbeiten.",
            "question":"Leitfrage: Welche Erkenntnisse gewinnen wir zu «"+title+"»?",
            "motivation":"Warum ist «"+title+"» relevant?",
            "product":"Überprüfbares Ergebnis zu «"+title+"».","phases":phases}

def chapter(identifier:str,title:str)->str:
    return ('---\ntype: chapter\nid: lektion-'+identifier+'-einstieg\nnummer: "1"\ntitel: '+
            json.dumps(title,ensure_ascii=False)+'\nkurz: Einstieg und Lernaufgaben\nopen: true\n---\n\n'+
            'Hier den Unterrichtsinhalt in Markdown ergänzen.\n\n## Auftrag\n\nAufgabe formulieren.\n')

def teacher(identifier:str,title:str)->str:
    return (f"## Doppellektion {identifier}\n\n### Zusätzliche Materialien\n\n"+
            f"Didaktische Hinweise und zusätzliche Grafiken für **{title}** ergänzen.\n\n"+
            f"- [Kurskapitel](index.html#lektion-{identifier})\n"+
            f"- [AVIVA-Plan](unterrichtsplan.html#doppellektion-{identifier})\n")

def create(root:Path,title:str)->tuple[Path,Path,Path]:
    lessons=load_lessons(root)
    if len(lessons)>=99:raise ValueError("Maximal 99 Doppellektionen")
    identifier=f"{len(lessons)+1:02d}"
    plan=template(identifier,title)
    validate(plan,identifier)
    data=root/"unterricht"/"lektionen"/f"{identifier}.json"
    content=root/"kursseiten"/"lektionen"/identifier/"010-einstieg.md"
    materials=root/"lehrperson"/"lektionen"/f"{identifier}.md"
    if any(p.exists() for p in (data,content,materials)):
        raise ValueError("Zieldatei existiert bereits")
    for p in (data,content,materials):p.parent.mkdir(parents=True,exist_ok=True)
    data.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    content.write_text(chapter(identifier,title),encoding="utf-8")
    materials.write_text(teacher(identifier,title),encoding="utf-8")
    return data,content,materials

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("title",help="Titel der neuen Doppellektion")
    args=parser.parse_args()
    for p in create(ROOT,args.title):print("Erstellt:",p.relative_to(ROOT))
if __name__=="__main__":main()
