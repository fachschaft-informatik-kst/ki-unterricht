import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {lessonTemplate,validatePlan,validateManifest} from "../shared/course-model.js";
const fixtures=JSON.parse(execFileSync(process.env.PYTHON||"python3",
  [new URL("./check_course_model.py",import.meta.url).pathname,"--json"],{encoding:"utf8"}));
assert.deepEqual(lessonTemplate("transfer","Transfer","gesellschaft"),fixtures.template);
for(const plan of fixtures.valid)assert.equal(validatePlan(plan),true);
for(const plan of fixtures.invalid)assert.throws(()=>validatePlan(plan));
const manifest=JSON.parse(readFileSync(new URL("../kursseiten/manifest.json",import.meta.url)));
assert.equal(validateManifest(manifest),true);
for(const sections of [[],[null],[...manifest.sections,manifest.sections[0]],
  [{id:"new",class:"section",teaching:true}]]){
  assert.throws(()=>validateManifest({sections}));
}
console.log("PASS Python/JavaScript template and validation parity on valid and invalid plans");
