import assert from "node:assert/strict";
import {validatePlan,validateManifest} from "../shared/course-model.js";
import {readFileSync} from "node:fs";
import {answerRows,materialForLesson,questionsFromSource,fieldTopic,teacherData,teacherShell,DEFAULT_COURSES,normalizeTeacherCourses,loadTeacherCourses,teacherThemeStylesheet} from "../admin-worker/src/teacher.mjs";
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
const studentSamples=[
  '<label class="field answer"><span>Warum ist nicht jedes automatische Programm eine KI?</span><textarea data-basis-answer="regeln_oder_daten"></textarea></label>',
  '<label class="field"><span>Was soll Ihr Modell unterscheiden – und für wen ist das nützlich?</span><textarea data-journal="purpose"></textarea></label>',
  '<select data-basis-answer="dl1_begriffe_ampel" aria-label="Ampel mit festem Zeitplan – Kategorie"></select>'
].join("\n");
const associated=questionsFromSource(studentSamples);
assert.match(associated.regeln_oder_daten,/automatische Programm/);
assert.match(associated.purpose,/Modell unterscheiden/);
assert.match(associated.dl1_begriffe_ampel,/Ampel mit festem Zeitplan/);
assert.equal(Object.keys(associated).length,3,"All student input conventions should yield questions");
assert.match(fieldTopic("basis-neuron-sw_gs"),/Gewicht Sonne/);
assert.match(fieldTopic("basis-sprache-pst_1_anfang"),/Anfangstext/);
assert.match(fieldTopic("sw2_gp"),/Gewicht Prüfung/);
assert(!fieldTopic("basis-neuron-sw_gs").includes("Originalfrage"));
const sources=[
  ["kursseiten/basis-ki/020-reflexion.md","regeln_oder_daten"],
  ["kursseiten/einstieg/010-einstieg-1.md","dl1_regeln_automat"],
  ["kursseiten/journal/000-inhalt.md","purpose"],
  ["kursseiten/fremdmodell/030-reproduktion.md","reproduktion"]
];
for(const [source,key] of sources){
  const page=readFileSync(new URL("../"+source,import.meta.url),"utf8");
  const texts=questionsFromSource(page);
  assert(texts[key]&&texts[key].length>=10,source+": missing actual question for "+key);
}

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
assert(!markdown.includes("Der genaue Wortlaut wurde nicht eindeutig erkannt"),
  "The teacher view must not repeatedly show a parsing warning");
assert(markdown.includes('entry.questionSource==="thema"'),
  "Unmatched dynamically generated fields should be labeled as topics");

const shell=teacherShell({course:"bok/4-klasse",kind:"planung"});
assert(shell.includes('id="lessonNav"')&&shell.includes('data-grade="4"'));
assert(shell.includes('class="area-nav"'));
const options=normalizeTeacherCourses({version:1,courses:DEFAULT_COURSES});
assert.deepEqual(options.map(x=>x.slug),["bok/1-klasse","bok/4-klasse","irn/1-klasse","irn/4-klasse"]);
assert.deepEqual(options.map(x=>x.ready),[true,true,true,true]);
for(const kind of ["planung","materialien","musterloesungen"]){
  const html=teacherShell({course:"bok/4-klasse",kind},options);
  assert(html.includes('id="teacherCourseSelect"'),"Course choice missing on "+kind);
  assert(html.includes('value="bok/4-klasse" selected'),"Current course must be selected");
  assert(html.includes('value="bok/1-klasse"'),"Other BOK course must be selectable");
  assert(html.includes('value="irn/1-klasse"'),"Independent IRN course should be selectable");
  assert(html.includes('value="irn/4-klasse"'));
  assert(!html.includes('value="irn/1-klasse" disabled'));
  assert(html.includes('/teacher-theme.css?course=bok%2F4-klasse'),"Theme must load as a stylesheet compatible with strict CSP");
}
assert(teacherShell({course:"bok/1-klasse",kind:"materialien"},options)
  .includes('/teacher-theme.css?course=bok%2F1-klasse'));
assert.equal(teacherThemeStylesheet(options,"bok/1-klasse"),'body[data-grade="1"]{--accent:#3653a3}');
assert.equal(teacherThemeStylesheet(options,"bok/4-klasse"),'body[data-grade="4"]{--accent:#076959}');
assert(teacherShell({course:"irn/1-klasse",kind:"planung"},options).includes('data-grade="1"'));
assert(teacherShell({course:"irn/4-klasse",kind:"materialien"},options).includes('IRN'));
assert.throws(()=>normalizeTeacherCourses({version:1,courses:DEFAULT_COURSES.slice(0,2)}),/vier/);
const malicious=structuredClone(DEFAULT_COURSES);
malicious[0].theme.accent="red; background:url(https://example.org/steal)";
assert.throws(()=>normalizeTeacherCourses({version:1,courses:malicious}),/ungültig/);
const courseMock=async(_token,path)=>{
  assert(path.includes("/contents/shared/course-sites.json?ref=main"));
  return {encoding:"base64",content:Buffer.from(JSON.stringify({version:1,courses:DEFAULT_COURSES})).toString("base64")};
};
assert.deepEqual((await loadTeacherCourses("token",courseMock,"example/repo")).map(x=>x.ready),
  [true,true,true,true],"Course picker must use the source registry");

// Real IRN scaffolds must belong to their own profiles and validate as complete AVIVA drafts.
const sourceFiles=[1,4].map(grade=>{
  const prefix="../kursseiten/irn-"+grade+"-kurs/planung.json";
  return JSON.parse(readFileSync(new URL(prefix,import.meta.url),"utf8"));
});
assert(sourceFiles.every(p=>p.lessons.length===10));
assert(sourceFiles[0].lessons.every(x=>x.view==="irn-1-kurs"));
assert(sourceFiles[1].lessons.every(x=>x.view==="irn-4-kurs"));
assert(sourceFiles.every(p=>validatePlan(p)),"IRN draft plans must pass the canonical AVIVA validator");
for(const grade of [1,4]){
  const manifest=JSON.parse(readFileSync(new URL("../kursseiten/irn-"+grade+"-manifest.json",import.meta.url),"utf8"));
  assert(validateManifest(manifest));
  assert(manifest.sections.every(x=>x.id.startsWith("irn-"+grade+"-")));
}
const fake={
  "kursseiten/basis-manifest.json":JSON.stringify({sections:[{id:"basis-test",teaching:true}]}),
  "kursseiten/basis-test/planung.json":JSON.stringify({lessons:[
    {id:"test-1",order:10,view:"basis-test",title:"Regeln",goal:"Ziel",question:"Leitfrage",phases:[]},
    {id:"test-2",order:20,view:"basis-test",title:"Lernen",goal:"Ziel 2",question:"Leitfrage 2",phases:[]}
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
assert.deepEqual(plan.lessons.map(l=>l.number),[1,2],"DL numbering must be generated from order");
assert.equal(plan.lesson.title,"Lernen");
assert.equal(plan.lessons.length,2);
const kit=await teacherData({course:"bok/1-klasse",kind:"materialien"},...params,1);
assert.match(kit.sections[0].markdown,/Mathematikblatt/);
const solutions=await teacherData({course:"bok/1-klasse",kind:"musterloesungen"},...params,1);
assert.equal(solutions.entries.length,1);
assert.equal(solutions.entries[0].question,"Worin unterscheiden sich Regeln von Lernen?");
assert.equal(solutions.entries[0].questionSource,"original");

assert(solutions.entries[0].courseLink.endsWith("/bok/1-klasse/#basis-test"));
console.log("PASS teacher view: DL navigation, color coding, lesson-specific materials, precise questions");
