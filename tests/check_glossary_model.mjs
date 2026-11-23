import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateGlossary,GLOSSARY_PATH,GLOSSARY_FIELDS} from "../shared/glossary-model.js";
assert.equal(GLOSSARY_PATH,"kursseiten/glossar.json");
assert.deepEqual(GLOSSARY_FIELDS,["begriff","basis","vertieft","beispiel","frage","antwort"]);
const original=JSON.parse(readFileSync(new URL("../kurse/bok/4-klasse/kursseiten/glossar.json",import.meta.url)));
assert.equal(validateGlossary(original),original);
assert.ok(original.begriffe.length > 0, "Glossary must contain at least one entry");
const copy=()=>structuredClone(original);
let next=copy();next.begriffe[0].basis="Eine kindgerechte Beschreibung.";
next.begriffe[0].vertieft="Eine differenzierte technische Beschreibung.";
validateGlossary(next);
next=copy();
next.begriffe[0].basisBeispiel="Ein sehr einfaches Beispiel für die 1. Klasse.";
next.begriffe[0].vertieftBeispiel="Ein technisch differenziertes Beispiel für die 4. Klasse.";
next.begriffe[0].basisFrage="Was bedeutet das im Alltag?";
next.begriffe[0].vertieftFrage="Welche Annahmen sind entscheidend?";
next.begriffe[0].basisAntwort="Das ist die einfachere Erklärung.";
next.begriffe[0].vertieftAntwort="Eine technisch genauere und differenzierte Erklärung.";
assert.doesNotThrow(()=>validateGlossary(next));
next.begriffe[0].basisAntwort="Zu kurz";
assert.throws(()=>validateGlossary(next),/basisAntwort/);
next=copy();next.begriffe.push({...next.begriffe[0]});
assert.throws(()=>validateGlossary(next),/doppelt/);
next=copy();next.begriffe[0].basis=next.begriffe[0].vertieft;
assert.throws(()=>validateGlossary(next),/unterschiedliche/);
next=copy();next.begriffe[0].antwort="Ein viel zu langer Satz. ".repeat(15);
assert.throws(()=>validateGlossary(next),/antwort/);
next=copy();next.begriffe[0].gruppe="Unbekannt";
assert.throws(()=>validateGlossary(next),/Themenbereich/);
next=copy();next.begriffe[0].id="Invalid Path";
assert.throws(()=>validateGlossary(next),/Glossar-ID/);
next=copy();next.begriffe.push({id:"neuer-begriff",gruppe:original.gruppen[0],begriff:"Neuer Begriff",
 basis:"Einfache Beschreibung.",vertieft:"Technische und genauere Beschreibung.",
 beispiel:"Ein nachvollziehbares Beispiel.",frage:"Was ist der wichtigste Unterschied?",
 antwort:"Die kurze fachlich korrekte Antwort."});
assert.doesNotThrow(()=>validateGlossary(next));
// Technical contract only: lesson links must resolve to an ID in their own course
// (no fixed term count or mandatory editorial vocabulary).
let checkedLinks=0;
for(const course of ["_vorlagen/1-klasse","_vorlagen/4-klasse","bok/1-klasse","bok/4-klasse"]){
  const folder=new URL("../kurse/"+course+"/kursseiten/",import.meta.url);
  const glossary=JSON.parse(readFileSync(new URL("glossar.json",folder),"utf8"));
  validateGlossary(glossary);
  const ids=new Set(glossary.begriffe.map(item=>item.id));
  const prefix=course.endsWith("/1-klasse")?"basis-glossar-":"glossar-";
  const scan=dir=>{
    for(const entry of readdirSync(dir,{withFileTypes:true})){
      const file=new URL(entry.name+(entry.isDirectory()?"/":""),dir);
      if(entry.isDirectory()){scan(file);continue;}
      if(!entry.name.endsWith(".md"))continue;
      const source=readFileSync(file,"utf8");
      assert(!/\shhref\s*=/.test(source),course+"/"+entry.name+": ungültiges hhref-Attribut");
      for(const match of source.matchAll(/href="#((?:basis-)?glossar-[a-z0-9-]+)"/g)){
        assert(match[1].startsWith(prefix),course+"/"+entry.name+": falsches Glossar-Präfix: "+match[1]);
        assert(ids.has(match[1].slice(prefix.length)),course+"/"+entry.name+": Glossar-Ziel fehlt: "+match[1]);
        checkedLinks++;
      }
    }
  };
  scan(folder);
}
assert(checkedLinks>0,"At least one contextual glossary link is expected");
console.log("PASS Glossar-Schema und "+checkedLinks+" bestehende Glossar-Links in BOK/Vorlagen");
