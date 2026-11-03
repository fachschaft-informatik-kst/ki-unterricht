// Measure the SAME BOK 1 and BOK 4 course workloads on the same CI runner.
// The candidate site is built from PR #124's main tree, with ONLY the
// experimental JupyterLite/runtime files overlaid. No student data is read.
const {chromium} = require('playwright');
const fs = require('node:fs');
const {performance} = require('node:perf_hooks');
const assert = require('node:assert/strict');

const targets = [
  {name:'BOK 1 · Ein Neuron',id:'bok1',route:'/bok/1-klasse/',
    launch:'.ki-notebook-block .ki-notebook-launch',loader:'#basis-lab-loading'},
  {name:'BOK 4 · Projektjournal',id:'bok4',route:'/bok/4-klasse/',
    launch:'#start-project',loader:'#project-lab-loading'}
];
const variants = [
  {id:'pr124',label:'PR #124 on main · JupyterLite 0.5',port:8891},
  {id:'jl08',label:'PR #124 + JupyterLite 0.8',port:8892}
];
const maxWaitMs=Number(process.env.KI_BENCH_TIMEOUT_MS||110000);
const iterations=Number(process.env.KI_BENCH_ITERATIONS||3);
const reportPath=process.env.KI_BENCH_REPORT||'course-start-report.json';
const output={schema:'ki-course-start-benchmark-v1',createdAt:new Date().toISOString(),
  referenceCommit:process.env.KI_REFERENCE_SHA||null,
  candidateCommit:process.env.KI_CANDIDATE_SHA||null,
  source:'same PR #124 main tree; experimental requirements/config/copy_portal only',
  policy:'cold = fresh browser context; warm = new page in same context (cached resources, fresh kernel)',
  timeoutMs:maxWaitMs,iterations,results:[],summary:[]};
const elapsed=t=>Math.round(performance.now()-t);
const median=a=>{const b=[...a].sort((x,y)=>x-y);return b.length?b[Math.floor((b.length-1)/2)]:null;};
function save(){fs.writeFileSync(reportPath,JSON.stringify(output,null,2)+'\n');}
function summary(){
  const groups=[];
  for(const target of targets)for(const variant of variants)for(const cache of ['cold','warm']){
    const runs=output.results.filter(r=>r.target===target.id&&r.variant===variant.id&&r.cache===cache);
    const success=runs.filter(r=>r.ok);
    groups.push({target:target.id,variant:variant.id,cache,passed:success.length,total:runs.length,
      medianReadyMs:median(success.map(x=>x.untilReadyMs)),medianVisibleMs:median(success.map(x=>x.visibleWaitMs).filter(Number.isFinite))});
  }
  output.summary=groups;
  save();
}
function markdown(){
  let report='# Browser-Startvergleich (PR #124 vs. JupyterLite 0.8)\n\n';
  report+='Dieselbe Kursversion, dieselben Notebooks, derselbe Runner und Chromium. Zwei voneinander getrennte Python-/JupyterLite-Builds; ausschliesslich die Kernel-/JupyterLite-Konfiguration wurde geändert.\n\n';
  report+='| Kurs | Laufzeit | Cold ready | Warm ready (Median) | Warm success |\n|---|---|---:|---:|---:|\n';
  for(const target of targets)for(const v of variants){
    const cold=output.summary.find(x=>x.target===target.id&&x.variant===v.id&&x.cache==='cold');
    const warm=output.summary.find(x=>x.target===target.id&&x.variant===v.id&&x.cache==='warm');
    const pretty=x=>x===null?'n/a':(x/1000).toFixed(2)+' s';
    report+='| '+target.name+' | '+v.label+' | '+pretty(cold.medianReadyMs)+' | '+pretty(warm.medianReadyMs)+' | '+warm.passed+'/'+warm.total+' |\n';
  }
  report+='\nKaltstart = Browserkontext ohne HTTP/Service-Worker-Cache. Warmstart = neues Tab im selben Kontext; der Python-Kernel wird **neu** initialisiert, Ressourcen können aus dem Cache kommen. Messung vom Beginn der Navigation bis zum verwendbaren Notebook; zusätzlich ist die Klick-bis-Bereit-Zeit im JSON verfügbar. **Kein** Test der Wiederherstellung älterer ZIP-Dateien, dafür die separate Kompatibilitätssuite verwenden.\n';
  report+='\nDie Zeiten sind CI-Messwerte, **keine** garantierten Werte auf Schulgeräten; nur komplette, erfolgreiche Starts sind für Zeitvergleiche aussagekräftig. Fehlgeschlagene Starts erscheinen als n/a und dürfen nicht als Beschleunigung gewertet werden.\n';
  const file=process.env.GITHUB_STEP_SUMMARY;
  if(file)fs.appendFileSync(file,report);
  console.log(report);
}
async function runOnce(browser,context,variant,target,n){
  const page=await context.newPage();
  const failures=[];
  page.on('pageerror',error=>failures.push('Page: '+error.message.slice(0,240)));
  const t0=performance.now();
  let clickAt=null;
  try {
    await page.goto('http://127.0.0.1:'+variant.port+target.route,{waitUntil:'domcontentloaded',timeout:35000});
    const button=page.locator(target.launch).first();
    // Course chapter panels hide inactive sections. Trigger the same genuine
    // DOM click handler independently of the sidebar's current chapter;
    // the browser still runs the real course controller and Python iframe.
    await button.waitFor({state:'attached',timeout:12000});
    clickAt=performance.now();
    await button.evaluate(el=>el.click());
    await page.waitForFunction(id=>{
      if(id==='bok1'){
        const loader=document.querySelector('#basis-lab-loading');
        const frame=document.querySelector('#basis-lab-frame');
        return loader?.dataset.state==='ready' && loader.hidden && frame && !frame.inert;
      }
      const loader=document.querySelector('#project-lab-loading');
      const frame=document.querySelector('#project-frame');
      return loader?.hidden && frame?.dataset.ready==='yes' && !frame.inert;
    },target.id,{timeout:maxWaitMs});
    const doc=await page.evaluate(()=>{
      const frame=document.querySelector('#project-frame,#basis-lab-frame');
      return {status:document.querySelector('#project-lab-status,#basis-lab-status')?.textContent?.slice(0,160),
        frameStartKind:frame?.dataset.startKind||null,
        frameStartMs:frame?.dataset.loadMs?Number(frame.dataset.loadMs):null,
        metric:(window.KINotebookTimings||[]).at(-1)||null};
    });
    const record={variant:variant.id,target:target.id,cache:n?'warm':'cold',iteration:n,
      ok:true,untilReadyMs:elapsed(t0),visibleWaitMs:Math.round(performance.now()-clickAt),
      measuredFrameMs:doc.frameStartMs,recordedMetric:doc.metric,
      frameStartKind:doc.frameStartKind,errors:failures.slice(0,3)};
    output.results.push(record);
    console.log('PASS '+target.id+' '+variant.id+' '+record.cache+' #'+n+
      ': '+record.untilReadyMs+'ms navigation→ready, '+record.visibleWaitMs+'ms click→ready');
    return true;
  }catch(error){
    const loaderText=await page.locator(target.loader).evaluate(e=>e?.textContent?.slice(0,350)).catch(()=>null);
    const status=await page.locator('#project-lab-status,#basis-lab-status').first().textContent().catch(()=>null);
    const record={variant:variant.id,target:target.id,cache:n?'warm':'cold',iteration:n,
      ok:false,untilReadyMs:null,visibleWaitMs:null,error:String(error.message||error).slice(0,900),
      status,loaderText,errors:failures.slice(0,6)};
    output.results.push(record);
    console.log('FAILED '+target.id+' '+variant.id+' '+record.cache+': '+record.error.split('\n')[0]+'; '+status);
    return false;
  }finally {summary();await page.close().catch(()=>{});}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 output.browserVersion=browser.version();
 try{
   // Each target has a dedicated origin/context, which isolates HTTP cache,
   // notebook edits, service workers and browser-side persistence.
   for(const target of targets){
     for(const variant of variants){
       const context=await browser.newContext({acceptDownloads:true});
       try{
         for(let i=0;i<iterations;i++){
           const ok=await runOnce(browser,context,variant,target,i);
           if(!ok)break;  // Do not spend several minutes repeating a broken kernel.
         }
       }finally{await context.close();}
     }
   }
 }finally{await browser.close();}
 summary();markdown();
 // A broken experimental runtime still produces a useful benchmark artifact.
 // The reference runtime failing means the comparison itself is invalid.
 const baseline=output.results.filter(r=>r.variant==='pr124');
 assert(baseline.length>=targets.length&&baseline.every(r=>r.ok),
   'Reference PR #124 could not initialize all requested course runs');
})().catch(error=>{summary();markdown();console.error('Benchmark incomplete:',error);process.exitCode=1;});
