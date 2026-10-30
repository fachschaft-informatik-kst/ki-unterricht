/* Parse every embedded Fotostudio script before costly browser / notebook tests. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('content/ki_projekt/fotostudio.html','utf-8');
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(x=>x.trim());
assert.equal(inline.length,1,'Expected one embedded Fotostudio controller');
for(const script of inline)new vm.Script(script,{filename:'fotostudio.inline.js'});
assert(html.includes('fotostudio_storage.js'));
assert(html.includes('if(!validRecord(r))throw Error'));
console.log('PASS Fotostudio inline JavaScript parses and validates imported records');
