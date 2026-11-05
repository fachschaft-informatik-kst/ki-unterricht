/* The first notebook paint must not depend on a slow/failed snapshot.
 * Simulate a ready Python kernel whose snapshot bridge never responds.
 * Also exercise both public BOK URLs (one extra path level).
 */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path');
const assert=require('node:assert/strict');

const site=process.env.PORTAL_SITE||path.resolve(__dirname,'../dist');
const base='http://127.0.0.1:8773';
const embedded=`<!doctype html><html><meta charset="utf-8"><body><script>
  const path=new URLSearchParams(location.search).get('path');
  window.boot=crypto.randomUUID();
  window.studentValue='original';
  window.allowSnapshots=false;
  window.snapshotCount=0;
  // Deliberately ignore snapshot: a slow widget serialization is not a failed
  // Python startup, and the parent should become interactive without it.
  const ready=()=>parent.postMessage({
    channel:'ki-portal-v1',path,type:'ready',ready:true
  },location.origin);
  window.addEventListener('message',event=>{
    if(event.data?.channel==='ki-portal-v1'&&event.data?.type==='hello')ready();
    if(event.data?.channel==='ki-portal-v1'&&event.data?.type==='snapshot'){
      window.snapshotCount++;
      if(window.allowSnapshots)parent.postMessage({
        channel:'ki-portal-v1',path,id:event.data.id,type:'snapshot',
        notebook:{nbformat:4,nbformat_minor:5,metadata:{ki_didaktik:{
          ursprung:path.endsWith('basis_neuron.ipynb')?'content/perzeptron_und_neuronale_netze.ipynb':'content/mehrschichtige_netze.ipynb'
        }},cells:[
          {cell_type:'code',metadata:{},source:window.studentValue,outputs:[],execution_count:1}
        ]},files:[]
      },location.origin);
    }
    if(event.data?.channel==='ki-portal-v1'&&event.data?.type==='restore'){
      window.studentValue=event.data.notebook.cells[0].source;
      parent.postMessage({channel:'ki-portal-v1',path,id:event.data.id,type:'restored'},location.origin);
    }
  });
  setTimeout(ready,path.includes('netze')?600:50);
<\/script></body></html>`;

(async()=>{
 const server=spawn('python',['-m','http.server','8773','--bind','127.0.0.1','--directory',site],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(resolve=>setTimeout(resolve,900));
  browser=await chromium.launch({headless:true});
  for(const [route,selector,frameSelector,loaderSelector] of [
    ['bok/1-klasse/','.ki-notebook-block .ki-notebook-launch','#basis-lab-frame','#basis-lab-loading'],
    ['bok/4-klasse/','#start-project','#project-frame','#project-lab-loading'],
    ['irn/1-klasse/','.ki-notebook-block .ki-notebook-launch','#basis-lab-frame','#basis-lab-loading'],
    ['irn/4-klasse/','#start-project','#project-frame','#project-lab-loading']
  ]){
   const page=await browser.newPage();
   try{
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/lab/index.html?**',request=>request.fulfill({status:200,contentType:'text/html',body:embedded}));
    await page.goto(base+'/'+route);
    await page.locator(selector).first().evaluate(el=>el.click());
    const frame=page.locator(frameSelector);
    await frame.waitFor({state:'attached',timeout:12000});
    await page.waitForFunction(sel=>{
      const loader=document.querySelector(sel);
      return loader?.dataset.state==='ready' && loader.hidden;
    },loaderSelector,{timeout:8000});
    const result=await frame.evaluate(el=>({
      url:new URL(el.getAttribute('src'),location.href).pathname,
      inert:el.inert
    }));
    assert.equal(result.url,'/lab/index.html',route+': shared JupyterLite URL must resolve from nested course');
    assert.equal(result.inert,false,route+': Python editor must be interactive before background snapshot finishes');
    const initialFrames=await page.locator('iframe[src*="/lab/index.html"]').count();
    assert(initialFrames<=2,route+': only explicit notebook plus possible lesson warmup');
    const initialSources=await page.locator('iframe[src*="/lab/index.html"]').evaluateAll(frames=>frames.map(frame=>frame.getAttribute('src')));
    assert.equal(new Set(initialSources).size,initialFrames,route+': never duplicate sessions for the same notebook');
    assert.equal(await page.locator('.ki-notebook-iframe').count(),0,
      route+': published course routes must use the managed course controller');
    const firstName=new URL(await frame.getAttribute('src'),base).searchParams.get('path').split('/').pop();
    const firstBoot=await frame.evaluate(el=>{
      el.contentWindow.studentValue='unsaved first notebook';
      return el.contentWindow.boot;
    });
    const secondName=route.includes('1-klasse')?'basis_netze.ipynb':'mehrschichtige_netze.ipynb';
    const clickNotebook=name=>page.locator(`.ki-notebook-block[data-notebook$="/${name}"] .ki-notebook-launch`).first().evaluate(el=>el.click());
    await clickNotebook(secondName);
    await page.waitForFunction(([sel,name])=>document.querySelector(sel)?.getAttribute('src')?.includes(encodeURIComponent(name)),
      [frameSelector,secondName],{timeout:2000});
    // Return while the second kernel is still starting. Its later ready
    // message must update its own cached session, not the visible notebook.
    await clickNotebook(firstName);
    assert.equal(await frame.evaluate(el=>el.contentWindow.boot),firstBoot,route+': switching back must preserve browsing context');
    assert.equal(await frame.evaluate(el=>el.contentWindow.studentValue),'unsaved first notebook');
    assert.equal(await frame.evaluate(el=>el.contentWindow.snapshotCount),0,route+': switching cannot wait for snapshots');
    await page.waitForTimeout(800);
    const reopenedMs=await page.evaluate(async ([name,sel,loaderSel])=>{
      const start=performance.now();
      document.querySelector(`.ki-notebook-block[data-notebook$="/${name}"] .ki-notebook-launch`).click();
      await new Promise(resolve=>requestAnimationFrame(resolve));
      const loader=document.querySelector(loaderSel);
      if(!loader.hidden||loader.dataset.state!=='ready')throw Error('Cached notebook is not immediately ready');
      document.querySelector(sel).contentWindow.studentValue='unsaved second notebook';
      return performance.now()-start;
    },[secondName,frameSelector,loaderSelector]);
    assert(reopenedMs<500,route+': cached reopen must take less than 500 ms, got '+reopenedMs);
    await clickNotebook(firstName);
    assert.equal(await frame.evaluate(el=>el.contentWindow.boot),firstBoot);
    const closeSelector=route.includes('1-klasse')?'#basis-notebook-panel .lab-close-toggle':'#project-lab .lab-close-toggle';
    await page.locator(closeSelector).evaluate(el=>el.click());
    await clickNotebook(firstName);
    assert.equal(await frame.evaluate(el=>el.contentWindow.boot),firstBoot,route+': closing and reopening retains live session');
    assert.equal(await page.locator('iframe[src*="/lab/index.html"]').count(),initialFrames+1,route+': one live frame per opened notebook');
    // Export must snapshot both live sessions, including the hidden one.
    await page.locator('iframe[src*="/lab/index.html"]').evaluateAll(frames=>{
      for(const frame of frames)frame.contentWindow.allowSnapshots=true;
    });
    const backupSelector=route.includes('1-klasse')?'#basis-backup-controls button.primary':'#download-backup';
    const [download]=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator(backupSelector).evaluate(el=>el.click())
    ]);
    const bytes=require('node:fs').readFileSync(await download.path());
    const snapshots=await page.evaluate(async data=>{
      const {readZip}=await import('./archive.js');
      const entries=await readZip(new Blob([Uint8Array.from(atob(data),c=>c.charCodeAt(0))]));
      const result=[];
      for(const [name,blob] of entries)if(name.endsWith('.ipynb'))result.push(...JSON.parse(await blob.text()).cells.map(cell=>cell.source));
      return result;
    },bytes.toString('base64'));
    assert(snapshots.includes('unsaved first notebook'),route+': ZIP contains current first notebook');
    assert(snapshots.includes('unsaved second notebook'),route+': ZIP contains current hidden notebook');
    page.on('dialog',dialog=>dialog.accept());
    const restoreSelector=route.includes('1-klasse')?'#basis-backup-controls input[accept=".zip"]':'#restore-package';
    await page.locator(restoreSelector).setInputFiles({
      name:'cached-notebooks.zip',mimeType:'application/zip',buffer:bytes
    });
    await page.waitForFunction(()=>!document.querySelector('iframe[src*="/lab/index.html"]'),null,{timeout:5000});
    await clickNotebook(firstName);
    await page.waitForFunction(sel=>document.querySelector(sel)?.hidden,loaderSelector,{timeout:8000});
    assert.notEqual(await frame.evaluate(el=>el.contentWindow.boot),firstBoot,route+': ZIP import must discard previous live kernels');
    assert.equal(await frame.evaluate(el=>el.contentWindow.studentValue),'unsaved first notebook',route+': imported snapshot restored into fresh session');
    assert.equal(await page.locator('iframe[src*="/lab/index.html"]').count(),1,route+': ZIP import clears all old cached frames');
    assert.deepEqual(errors,[],route+': page errors');
    console.log('PASS '+route+': startup, cached kernels, background readiness and ZIP; reopen '+Math.round(reopenedMs)+' ms');
   }finally{await page.close();}
  }
  // Standalone lesson/material blocks have no parent persistence controller.
  // They must not request restore-only mode, which skips all autostart cells.
  const extra=await browser.newPage();
  try{
   await extra.route('**/bok/4-klasse/notebook-startup-fixture.html',req=>req.fulfill({
    status:200,contentType:'text/html',body:
      '<!doctype html><html><body><main><div class="ki-notebook-block" data-notebook="content/basis_neuron.ipynb" data-title="Zusatzversuch"></div></main><script src="./notebook-blocks.js"></script></body></html>'
   }));
   await extra.goto(base+'/bok/4-klasse/notebook-startup-fixture.html');
   await extra.locator('.ki-notebook-launch').click();
   const src=await extra.locator('.ki-notebook-iframe').getAttribute('src');
   const url=new URL(src,base+'/bok/4-klasse/');
   assert.equal(url.pathname,'/lab/index.html');
   assert.equal(url.searchParams.get('ki-embed'),'1');
   assert.equal(url.searchParams.has('ki-restore'),false,
     'Standalone notebooks must execute trusted autostart instead of waiting for nonexistent restore messages');
   console.log('PASS standalone teaching notebook: normal autostart enabled');
  }finally{await extra.close();}
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
