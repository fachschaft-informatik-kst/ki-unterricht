"""Render an independent first course page for newly onboarded teachers.

The BOK portals stay untouched. A generated course only reads its *own*
manifest and chapter files and has a namespaced answer store and JSON transfer.
"""
from __future__ import annotations

from html import escape
from pathlib import Path
import json

from build_portal import render_fragment
from build_course import render as render_lesson
from course_model import load_course


def generic_page(course: dict, root: Path) -> str:
    manifest = json.loads((root / course["manifest"]).read_text(encoding="utf-8"))
    model = load_course(root, course["manifest"])
    lessons = model["lessons"]
    navigation, sections = [], []
    for section in sorted(manifest["sections"], key=lambda s: s["navigation"]["order"]):
        sid = section["id"]
        path = (root / course["manifest"]).parent / sid
        chapters = sorted(path.glob("[0-9][0-9][0-9]-*.md"))
        if not chapters:
            raise ValueError(f"Keine Kapitel für {course['slug']}: {sid}")
        content = "".join(render_fragment(p.read_text(encoding="utf-8"), p) for p in chapters)
        individual = [l for l in lessons if l["view"] == sid]
        if individual:
            content = "".join(render_lesson(l) for l in individual) + content
        sections.append(f'<section id="{escape(sid)}"><h2>{escape(section["navigation"]["title"])}</h2>{content}</section>')
        navigation.append(f'<a href="#{escape(sid)}">{escape(section["navigation"]["title"])}</a>')
    accent = escape(course["theme"]["accent"])
    title = escape(course["name"])
    label = escape(f'{course["teacher"]} · {course["grade"]}. Klasse')
    course_id = escape(course["id"])
    tab = escape(f'{course["teacher"]} KI {course["grade"]}. Klasse')
    return f"""<!doctype html><html lang="de-CH"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{tab}</title><link rel="icon" href="../../projekt/favicon.svg" type="image/svg+xml">
<style>
:root{{--accent:{accent};--soft:#f4f6f7;--line:#dce3e8;}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}
body{{margin:0;font:16px/1.6 system-ui,sans-serif;color:#24353c;background:#f7f8f9}}
header,footer{{background:white;padding:20px max(18px,calc((100% - 1050px)/2));border-bottom:1px solid var(--line)}}
h1,h2{{line-height:1.25}}h1{{font-size:clamp(1.7rem,4vw,2.4rem);margin:7px 0}}h2{{color:var(--accent)}}
a{{color:var(--accent)}}nav{{display:flex;gap:15px;flex-wrap:wrap;margin-top:16px}}nav a{{font-weight:700}}
main{{max-width:1050px;margin:0 auto;padding:20px 18px 70px}}
main>section{{padding:20px 28px;margin:20px 0;background:white;border:1px solid var(--line);border-radius:12px}}
.kapitel,.lesson-plan{{border:1px solid var(--line);border-radius:10px;margin:14px 0;padding:9px 15px}}
.kapitel summary,.lesson-plan summary{{cursor:pointer;font-weight:650;padding:9px 0}}
.kapitel-body{{padding:8px 0 18px}}.kapitel-body img{{max-width:100%;height:auto}}
.field.answer{{display:grid;gap:7px;margin:15px 0}}textarea,input,select{{font:inherit;max-width:100%;padding:10px;border:1px solid #aab7be;border-radius:6px}}
textarea{{width:100%;min-height:100px}}button,.button{{display:inline-block;font:inherit;font-weight:700;color:white;background:var(--accent);padding:9px 14px;border:0;border-radius:8px;cursor:pointer}}
.transfer{{margin-top:24px;background:#fff;border:1px solid var(--line);padding:24px;border-radius:12px}}
.transfer-actions{{display:flex;flex-wrap:wrap;gap:14px;align-items:center}}
.transfer-actions label{{cursor:pointer;border:1px solid var(--accent);padding:9px 14px;border-radius:8px;color:var(--accent);font-weight:700}}
[hidden]{{display:none!important}}.muted{{color:#53636c;font-size:.9rem}}
@media(max-width:700px){{main>section{{padding:15px}}}}
</style></head>
<body data-course="{course_id}"><header><small>{label}</small><h1>{title}</h1>
<nav aria-label="Unterrichtsbereiche">{''.join(navigation)}
<a href="../../kurse.html">Kursübersicht</a></nav></header>
<main>{''.join(sections)}
<section id="sicherung" class="transfer"><h2>Antworten sichern</h2>
<p>Textfelder und Auswahlaufgaben bleiben in diesem Browser gespeichert.
Mit einer JSON-Datei können Sie auf einem anderen Gerät weiterarbeiten.
Notebooks und Dateien sind nicht Bestandteil dieser Antwortdatei.</p>
<div class="transfer-actions"><button id="answer-download" type="button">Antworten herunterladen ↓</button>
<label for="answer-import">Antworten hochladen ↑</label><input id="answer-import" type="file"
accept=".json,application/json" hidden></div><p id="answer-status" role="status"></p></section>
</main><footer><a href="../../kurse.html">Kursübersicht</a> ·
<a href="https://kst-ki-admin.kevin-bohn.workers.dev/">Lehrpersonen-Editor</a></footer>
<script>
(()=>{{
  const key="kst-ki-"+document.body.dataset.course+"-antworten-v1";
  const fields=[...document.querySelectorAll("[data-answer]")];
  const status=document.getElementById("answer-status");
  let answers={{}};try{{answers=JSON.parse(localStorage.getItem(key)||"{{}}");}}catch{{}}
  function save(){{
    try{{localStorage.setItem(key,JSON.stringify(answers));status.textContent="Antworten im Browser gespeichert.";}}
    catch{{status.textContent="Browserspeicher nicht verfügbar. Bitte Antwortdatei herunterladen.";}}
  }}
  for(const f of fields){{
    const name=f.dataset.answer;
    if(typeof answers[name]==="string")f.value=answers[name];
    f.addEventListener("input",()=>{{answers[name]=f.value;save();}});
  }}
  document.getElementById("answer-download").addEventListener("click",()=>{{
    const current=Object.fromEntries(fields.map(f=>[f.dataset.answer,f.value]));
    const file=new Blob([JSON.stringify({{schema:key,answers:current}},null,2)],{{type:"application/json"}});
    const url=URL.createObjectURL(file),a=document.createElement("a");
    a.href=url;a.download=document.body.dataset.course+"-antworten.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
    status.textContent="Antwortdatei heruntergeladen.";
  }});
  document.getElementById("answer-import").addEventListener("change",async event=>{{
    const input=event.target,file=input.files?.[0];if(!file)return;
    try{{
      if(file.size>1024*1024)throw Error("Datei zu gross (max. 1 MB).");
      const data=JSON.parse(await file.text());
      if(data?.schema!==key||!data.answers||typeof data.answers!=="object"||Array.isArray(data.answers))
        throw Error("Datei gehört nicht zu diesem Kurs.");
      if(Object.keys(data.answers).length>500||
         Object.values(data.answers).some(v=>typeof v!=="string"||v.length>20000))
        throw Error("Antwortdaten ungültig.");
      if(!confirm("Aktuelle Antworten durch die Datei ersetzen?"))return;
      for(const field of fields){{
        const value=data.answers[field.dataset.answer]??"";
        field.value=field.tagName==="SELECT"&&![...field.options].some(o=>o.value===value)?"":value;
      }}
      answers=Object.fromEntries(fields.map(f=>[f.dataset.answer,f.value]));
      save();status.textContent="Antworten wiederhergestellt.";
    }}catch(e){{status.textContent="Import fehlgeschlagen: "+e.message;}}
    finally{{input.value="";}}
  }});
}})();
</script></body></html>"""
