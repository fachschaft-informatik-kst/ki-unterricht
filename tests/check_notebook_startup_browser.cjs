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
  // Deliberately ignore snapshot: a slow widget serialization is not a failed
  // Python startup, and the parent should become interactive without it.
  const ready=()=>parent.postMessage({
    channel:'ki-portal-v1',path,type:'ready',ready:true
  },location.origin);
  window.addEventListener('message',event=>{
    if(event.data?.channel==='ki-portal-v1'&&event.data?.type==='hello')ready();
  });
  setTimeout(ready,50);
<\/script></body></html>`;

(async()=>{
 const server=spawn('python',['-m','http.server','8773','--bind','127.0.0.1','--directory',site],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(resolve=>setTimeout(resolve,900));
  browser=await chromium.launch({headless:true});
  for(const [route,selector,frameSelector,loaderSelector] of [
    ['bok/1-klasse/','.ki-notebook-block .ki-notebook-launch','#basis-lab-frame','#basis-lab-loading'],
    ['bok/4-klasse/','#start-project','#project-frame','#project-lab-loading']
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
    assert.deepEqual(errors,[],route+': page errors');
    console.log('PASS '+route+': live notebook appears before stalled snapshot');
   }finally{await page.close();}
  }
  // Standalone lesson/material blocks have no parent persistence controller.
  // They must not request restore-only mode, which skips all autostart cells.
  const extra=await browser.newPage();
  try{
   await extra.route('**/projekt/notebook-startup-fixture.html',req=>req.fulfill({
    status:200,contentType:'text/html',body:
      '<!doctype html><html><body><main><div class="ki-notebook-block" data-notebook="content/basis_neuron.ipynb" data-title="Zusatzversuch"></div></main><script src="./notebook-blocks.js"></script></body></html>'
   }));
   await extra.goto(base+'/projekt/notebook-startup-fixture.html');
   await extra.locator('.ki-notebook-launch').click();
   const src=await extra.locator('.ki-notebook-iframe').getAttribute('src');
   const url=new URL(src,base+'/projekt/');
   assert.equal(url.pathname,'/lab/index.html');
   assert.equal(url.searchParams.get('ki-embed'),'1');
   assert.equal(url.searchParams.has('ki-restore'),false,
     'Standalone notebooks must execute trusted autostart instead of waiting for nonexistent restore messages');
   console.log('PASS standalone teaching notebook: normal autostart enabled');
  }finally{await extra.close();}
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
