// Regression against actual Chromium-rendered layout before MVC refactoring.
// All authored content, visible geometry and screenshots should remain equivalent.
const {chromium}=require('playwright-core');
const {spawn,spawnSync}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');

(async()=>{
 const dist=path.resolve(process.env.PORTAL_SITE||'dist');
 const server=spawn('python',['-m','http.server','8766','--bind','127.0.0.1','--directory',dist],{stdio:'ignore'});
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ki-layout-'));
 let browser;
 try{
  await new Promise(resolve=>setTimeout(resolve,650));
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
  const pages=[];
  for(const folder of ['baseline','projekt']){
   const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await context.newPage();
   page.on('dialog',d=>d.accept());
   await page.route(/^https?:\/\//,async route=>{
    const url=route.request().url();
    if(url.startsWith('http://127.0.0.1:8766/'))return route.continue();
    return route.abort();  // stable offline external embeds/images on both versions
   });
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8766/'+folder+'/',{waitUntil:'domcontentloaded'});
   await page.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}'});
   pages.push({context,page,errors,folder});
  }
  const sections=[
   ['start','#start'],
   ['lernziele','#lernziele .grid'],
   ['lernarten','#lernarten-1'],
   ['lernarten','#lernarten-2'],
   ['lernarten','#lernarten-3'],
   ['lernarten','#lernarten-5'],
   ['lernarten','#lernarten-6'],
   ['lernarten','#lernarten-7'],
   ['sprache','#sprache-2'],
   ['sprache','#sprache-4'],
   ['sicherung','#sicherung']
  ];
  const pairs=[];
  for(let i=0;i<sections.length;i++){
   const [view,selector]=sections[i];
   const photos=[];
   const text=[];
   const boxes=[];
   for(const item of pages){
    const {page,folder}=item;
    await page.locator('a[href="#'+view+'"]').first().click();
    await page.locator(selector).waitFor({state:'visible'});
    await page.evaluate(()=>document.fonts.ready);
    const elt=page.locator(selector);
    text.push((await elt.innerText()).replace(/\s+/g,' ').trim());
    boxes.push(await elt.boundingBox());
    const filename=path.join(tmp,folder+'-'+i+'.png');
    await elt.screenshot({path:filename,animations:'disabled',timeout:60000});
    photos.push(filename);
   }
   assert.equal(text[0],text[1],'Rendered teaching copy changed in '+selector);
   assert(Math.abs(boxes[0].width-boxes[1].width)<=2,'Width mismatch '+selector);
   assert(Math.abs(boxes[0].height-boxes[1].height)<=2,'Height mismatch '+selector);
   pairs.push(...photos);
  }
  for(const p of pages)assert.deepEqual(p.errors,[],p.folder+' had JS errors');
  const compare=spawnSync('python',['tests/compare_layout_png.py',...pairs],{cwd:path.resolve(__dirname,'..'),stdio:'inherit'});
  assert.equal(compare.status,0,'Screenshot regression failed');
  console.log('PASS same visible teaching copy, browser element geometry and visual layout as PR #12');
 }finally{
  if(browser)await browser.close();
  server.kill();
  fs.rmSync(tmp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
