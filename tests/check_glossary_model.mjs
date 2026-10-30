import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateGlossary,GLOSSARY_PATH,GLOSSARY_FIELDS} from "../shared/glossary-model.js";
assert.equal(GLOSSARY_PATH,"kursseiten/glossar.json");
assert.deepEqual(GLOSSARY_FIELDS,["begriff","basis","vertieft","beispiel","frage","antwort"]);
const original=JSON.parse(readFileSync(new URL("../kursseiten/glossar.json",import.meta.url)));
assert.equal(validateGlossary(original),original);
assert.equal(original.begriffe.length,29);
const copy=()=>structuredClone(original);
let next=copy();next.begriffe[0].basis="Eine kindgerechte Beschreibung.";
next.begriffe[0].vertieft="Eine differenzierte technische Beschreibung.";
validateGlossary(next);
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
console.log("PASS Glossar-Schema: 29 Begriffe, getrennte Stufen, neue Begriffe und sichere Validierung");
