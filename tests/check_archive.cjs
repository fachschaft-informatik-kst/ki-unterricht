const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const {makeZip,readZip,escapeHTML}=await import('data:text/javascript;base64,'+fs.readFileSync(require('node:path').join(__dirname,'../projekt/archive.js')).toString('base64'));
 const zip=await makeZip([{name:'kursstand.json',data:'{"schema":"test"}'},{name:'daten/äpfel.png',data:new Uint8Array([0,255,1,128])}]);
 const files=await readZip(zip);assert.equal(await files.get('kursstand.json').text(),'{"schema":"test"}');assert.deepEqual([...new Uint8Array(await files.get('daten/äpfel.png').arrayBuffer())],[0,255,1,128]);
 const bad=new Uint8Array(await zip.arrayBuffer());bad[30+'kursstand.json'.length]^=1;await assert.rejects(()=>readZip(new Blob([bad])),/Beschädigte/);
 await assert.rejects(()=>readZip(new Blob(['not a zip'])));
 await assert.rejects(()=>makeZip([{name:'../kursstand.json',data:'{}'}]).then(readZip),/Dateiname/);
 assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');console.log('PASS ZIP binary/Unicode roundtrip, corruption, invalid archive, unsafe path and HTML escaping');
})().catch(e=>{console.error(e);process.exitCode=1;});
