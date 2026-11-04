// Warmup must reuse a managed iframe and must never lose/replay uploaded code.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const source=file=>fs.readFileSync(path.join(root,file),'utf8');
 const script=source('projekt/notebook-blocks.js');
 assert(script.includes('const warmOnPageLoad = () =>'),'Course page must warm up without a hover');
 assert(script.includes('window.addEventListener("load", warmOnPageLoad'),'Warmup starts only after course handlers are installed');
 assert(script.includes('const name = selected.dataset.notebook.split("/").pop()'),'Warm the target lesson only');
 assert(script.includes('window.dispatchEvent(new CustomEvent("ki-notebook-warmup"'),'Warmup uses the managed iframe');
 assert(script.includes('if (managed) {'),'Managed notebooks may not create a second iframe');
 const basic=source('basis/persistence.js'),advanced=source('projekt/portal.js');
 assert(basic.includes('if(current&&ready&&owner)await snapshot()'),'ZIP must remain available during background startup');
 assert(advanced.includes("frame.dataset.startKind==='warmup'"),'ZIP must remain available during background startup');
 assert(advanced.includes("location.hash==='#journal'&&activeName&&activeOwner"),
   'Passive chapter navigation must not open a warmed notebook dialog');
 assert(advanced.includes('notebookUploads[name]=await fileUpdates'),'Uploads must be indexed per notebook');
 assert(advanced.includes('uploads:notebookUploads'),'Upload ownership must survive browser reload and ZIP');
 assert(advanced.includes('notebookUploadPayload(name)'),'Restored uploads must return to their owner');
 assert(basic.includes('files:notebookUploads[current]||[]'),'First-year uploads must survive restart');
 const helper=await import('data:text/javascript;base64,'+Buffer.from(source('extensions/ki-autostart/restore-uploads.js')).toString('base64'));
 const bytes=Buffer.from([0,255,10,65,42]);
 const files=[{name:'../../bad\'file.json',content:bytes.toString('base64'),type:'application/json'}];
 assert.equal(helper.prepareUploads(files)[0].filename,'0___.._bad_file.json');
 assert.throws(()=>helper.prepareUploads([{name:'x.py',content:'not base64'}]),/ungültig/);
 assert.throws(()=>helper.prepareUploads([{name:'large.json',content:'AAAA'.repeat(3*1024*1024)}]),/zu gross/);
 const codes=[],kernel={requestExecute({code,silent,store_history}){
   assert.equal(silent,true);assert.equal(store_history,false);
   codes.push(code);return {done:Promise.resolve({content:{status:'ok'}})};
 }};
 assert.equal(await helper.restoreNotebookUploads(kernel,files),1);
 assert(codes.some(s=>s.includes('ki-uploads')));
 assert(codes.some(s=>s.includes(bytes.toString('base64'))));
 assert(!codes.some(s=>s.includes("../../bad'file.json")),'Original path must not be interpolated into Python');
 assert.equal(await helper.restoreNotebookUploads(kernel,[]),0,'An empty restore cannot replace live files');
 const embed=source('extensions/ki-autostart/embed.js');
 assert(embed.includes('restoreNotebookUploads(panel.sessionContext.session.kernel,files)'));
 assert(embed.includes('event.origin!==origin'),'The upload bridge must remain same-origin');
 const foto=source('kurse/bok/4-klasse/content/ki_projekt/ki_foto_tools.py');
 assert(foto.includes('def gespeicherte_uploads()'));
 console.log('PASS managed idle warmup, ZIP while warming, per-notebook uploads and safe filesystem restaging');
})().catch(error=>{console.error(error);process.exitCode=1;});
