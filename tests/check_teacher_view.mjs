import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {answerRows,materialForLesson,questionsFromSource,teacherData,teacherShell} from "../admin-worker/src/teacher.mjs";
const fields=[
  "## DL 1 · Was ist KI?","","| Antwortfeld | Musterantwort |","|---|---|",
  "| "+String.fromCharCode(96)+"regeln_oder_daten"+String.fromCharCode(96)+" | Regelbasiert ist nicht dasselbe wie lernend. |",
  "","## DL 5–8 · Projekt","","| Antwortfeld | Musterantwort |","|---|---|",
  "| "+String.fromCharCode(96)+"names"+String.fromCharCode(96)+" | Mia und Luca |",
  "| "+String.fromCharCode(96)+"comparison"+String.fromCharCode(96)+" | Variante B besser |",
  "| "+String.fromCharCode(96)+"test"+String.fromCharCode(96)+" | 26/32 |",
  "| "+String.fromCharCode(96)+"fremd_zuordnung"+String.fromCharCode(96)+" | Zwei neue Klassen |"
].join("\n");
assert.deepEqual(answerRows(fields,1).map(x=>x.field),["regeln_oder_daten"]);
for(const [dl,key] of [[5,"names"],[6,"comparison"],[7,"test"],[8,"fremd_zuordnung"]])
  assert.deepEqual(answerRows(fields,dl).map(x=>x.field),[key],
    "Project answers need individual DL assignment, not a combined DL 5–8 table");
const materials="## Doppellektion 05\n\nProjektstart\n\n## Doppellektion 06\n\nVergleich\n\n## Doppellektion 07\n\nAbgabe";
for(const [dl,value] of [[5,"Projektstart"],[6,"Vergleich"],[7,"Abgabe"]]){
  const text=materialForLesson(materials,dl);
  assert(text.includes(value));
  assert(![...["Projektstart","Vergleich","Abgabe"]].filter(x=>x!==value).some(x=>text.includes(x)));
}
const sample='<label class="field answer"><span>Worin unterscheiden sich Regeln von Lernen?</span>'+
  '<textarea data-answer="regeln_oder_daten"></textarea></label>'+
  '<select data-answer="dl1_regeln_ampel" aria-label="Ampel – Kategorie"></select>';
const prompts=questionsFromSource(sample);
assert.match(prompts.regeln_oder_daten,/Worin unterscheiden/);
assert.match(prompts.dl1_regeln_ampel,/Ampel/);
const markdown=readFileSync(new URL("../projekt/admin/teacher.js",import.meta.url),"utf-8");
const css=readFileSync(new URL("../projekt/admin/teacher.css",import.meta.url),"utf-8");
for(const klass of ["wer-l","wer-e","wer-t","wer-k","wer-r"]){
  assert(markdown.includes(klass),"Missing class "+klass);
  assert(css.includes(".phase-table tr."+klass+" td"),"Missing row color for "+klass);
}
assert(markdown.includes('aria-current="page"'));
assert(markdown.includes("Doppellektion "));
assert(markdown.includes("entry.question"));
assert(markdown.includes("entry.courseLink"));
const shell=teacherShell({course:"bok/4-klasse",kind:"planung"});
assert(shell.includes('id="lessonNav"')&&shell.includes('data-grade="4"'));
assert(shell.includes('class="area-nav"'));
const fake={
  "kursseiten/basis-manifest.json":JSON.stringify({sections:[{id:"basis-test",teaching:true}]}),
  "kursseiten/basis-test/planung.json":JSON.stringify({lessons:[
    {id:"test-1",number:1,view:"basis-test",title:"Regeln",goal:"Ziel",question:"Leitfrage",phases:[]},
    {id:"test-2",number:2,view:"basis-test",title:"Lernen",goal:"Ziel 2",question:"Leitfrage 2",phases:[]}
  ]}),
  "kursseiten/basis-test/materialien.md":"## Materialien\n\nMathematikblatt",
  "lehrperson/musterloesungen.md":"## 1 · Was ist KI?\n\nFachlicher Hinweis",
  "lehrperson/musterloesungen-felder-1-klasse.md":fields,
  "kursseiten/basis-test/010-test.md":sample
};
const github=async(_token,path)=>{
  if(path.includes("/git/trees/main?recursive=1"))return {truncated:false,
    tree:[{type:"blob",path:"kursseiten/basis-test/010-test.md"}]};
  const p=path.split("/contents/")[1]?.split("?")[0];
  assert(p in fake,"Unexpected source: "+path);
  return {encoding:"base64",content:Buffer.from(fake[p]).toString("base64")};
};
const params=["token",github,"example/repository"];
const plan=await teacherData({course:"bok/1-klasse",kind:"planung"},...params,2);
assert.equal(plan.selectedNumber,2);
assert.equal(plan.lesson.title,"Lernen");
assert.equal(plan.lessons.length,2);
const kit=await teacherData({course:"bok/1-klasse",kind:"materialien"},...params,1);
assert.match(kit.sections[0].markdown,/Mathematikblatt/);
const solutions=await teacherData({course:"bok/1-klasse",kind:"musterloesungen"},...params,1);
assert.equal(solutions.entries.length,1);
assert.equal(solutions.entries[0].question,"Worin unterscheiden sich Regeln von Lernen?");
assert(solutions.entries[0].courseLink.endsWith("/bok/1-klasse/#basis-test"));
console.log("PASS teacher view: DL navigation, color coding, lesson-specific materials, precise questions");
