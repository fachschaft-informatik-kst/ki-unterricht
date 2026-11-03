const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
 const run=await import('data:text/javascript;base64,'+Buffer.from(read('projekt/notebook-performance.js')).toString('base64'));
 global.window={KINotebookTimings:[]};
 const frame={dataset:{}};
 run.startNotebookTiming(frame,'basis_neuron.ipynb','warmup');
 run.markNotebookTiming(frame,'document');
 run.markNotebookTiming(frame,'kernel');
 run.markNotebookTiming(frame,'untrusted-stage');
 run.markNotebookTiming(frame,'kernel');
 run.openedNotebook(frame);
 run.markNotebookTiming(frame,'interactive');
 const result=run.finishNotebookTiming(frame);
 assert.equal(result.name,'basis_neuron.ipynb');
 assert.equal(result.kind,'warmup');
 assert(Number.isInteger(result.milliseconds)&&result.milliseconds>=0);
 assert(Number.isInteger(result.visibleWaitMs)&&result.visibleWaitMs>=0);
 assert.equal(result.stages.kernel>=result.stages.document,true);
 assert.equal(result.stages['untrusted-stage'],undefined);
 assert.equal(window.KINotebookTimings.length,1);
 assert.equal(frame.dataset.loadMs,String(result.milliseconds));
 assert.equal(run.finishNotebookTiming(frame),undefined,'Do not record twice');
 run.startNotebookTiming(frame,'ready.ipynb','warmup');
 const warmed=run.finishNotebookTiming(frame);
 assert.equal(warmed.visibleWaitMs,null,'Background-only warmup has no visible click yet');
 run.openedNotebook(frame,'other.ipynb');
 assert.equal(warmed.visibleWaitMs,null,'Opening a different notebook cannot claim warmed session');
 run.openedNotebook(frame,'ready.ipynb');
 assert.equal(warmed.visibleWaitMs,0,'Opening an already-ready notebook has no visible wait');
 run.startNotebookTiming(frame,'direct.ipynb','open');
 const direct=run.finishNotebookTiming(frame);
 assert(Number.isInteger(direct.visibleWaitMs),'Direct click records a visible wait even if mounting happens after the click');
 assert.deepEqual(run.notebookTimingSummary().warmup.count,1);
 for(let i=0;i<60;i++){run.startNotebookTiming(frame,'lab.ipynb','open');run.finishNotebookTiming(frame);}
 assert.equal(window.KINotebookTimings.length,50,'Timing history must stay bounded');
 assert(!JSON.stringify(window.KINotebookTimings).includes('source'),'Timings must not store notebook code');
 for(const course of ['projekt/portal.js','basis/persistence.js']){
  const s=read(course);
  assert(s.includes('startNotebookTiming(')&&s.includes('finishNotebookTiming('));
  assert(s.includes("type==='milestone'"));
 }
 const embed=read('extensions/ki-autostart/embed.js');
 for(const phase of ['document','kernel','restoring','uploads','widgets','restored','interactive']) {
  assert(embed.includes("phase:'"+phase+"'"),'Bridge missing '+phase);
 }
 const index=read('extensions/ki-autostart/index.js');
 assert(index.includes("embed?.stage('autostart')")&&index.includes("embed?.stage('cells')"));
 console.log('PASS session-only notebook startup milestones, visible wait, privacy and bounded history');
})().catch(error=>{console.error(error);process.exitCode=1;});
