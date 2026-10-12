/* npm install --no-save playwright && npx playwright install chromium */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CHROMIUM_PATH?'playwright-core':'playwright');
const root=path.resolve(__dirname,'..'),shots=fs.mkdtempSync(path.join(os.tmpdir(),'ki-projekt-page-'));
const server=http.createServer((req,res)=>{if(req.url.split('?')[0]!=='/projekt/'){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(root,'projekt/index.html')));});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:JSON.parse(process.env.CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage"]')}: {})});
  const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/projekt/`;await page.goto(url);
  await page.screenshot({path:path.join(shots,'desktop.png'),fullPage:false});
  assert.equal(await page.locator('main > section:visible').count(),1);
  await page.locator('.nav a[href="#ideen"]').click();await page.locator('#ideen').waitFor({state:'visible'});
  assert.equal(await page.locator('.topic:visible').count(),12);
  await page.locator('#topic-search').fill('Früchte');assert.equal(await page.locator('.topic:visible').count(),1);
  await page.locator('[data-choose="Früchte"]').click();assert.equal(await page.locator('[data-choose="Früchte"]').getAttribute('aria-pressed'),'true');
  await page.locator('#topic-search').fill('xyzabc');assert(await page.locator('#topic-empty').isVisible());
  await page.locator('#topic-search').fill('');await page.locator('#topic-filter').selectOption('leicht');assert.equal(await page.locator('.topic:visible').count(),4);
  await page.locator('#topic-filter').selectOption('all');
  await page.locator('.nav a[href="#ablauf"]').click();await page.locator('#ablauf').waitFor({state:'visible'});await page.locator('#ablauf details').first().locator('summary').click();await page.locator('[data-check="phase-1"]').check();await page.locator('.nav a[href="#ideen"]').click();await page.locator('#ideen').waitFor({state:'visible'});await page.locator('.plan summary').click();await page.locator('[data-note="topic"]').fill('Unsere Anwendung mit eigenen Bildern.');await page.locator('.nav a[href="#kompetenzen"]').click();await page.locator('#kompetenzen').waitFor({state:'visible'});await page.locator('[data-skill="daten"]').selectOption('sicher');
  await page.reload();assert(await page.locator('[data-check="phase-1"]').isChecked());assert.equal(await page.locator('[data-note="topic"]').inputValue(),'Unsere Anwendung mit eigenen Bildern.');assert.equal(await page.locator('[data-skill="daten"]').inputValue(),'sicher');
  await page.locator('.nav a[href="#versuch"]').click();await page.locator('#versuch').waitFor({state:'visible'});assert.equal(await page.locator('[data-experiment]:visible').count(),1);assert(await page.locator('[data-experiment="vielfalt"]').isVisible());
  await page.locator('.nav a[href="#daten"]').click();await page.locator('#daten').waitFor({state:'visible'});assert((await page.locator('#image-total').textContent()).includes('80 Bilder'));
  await page.locator('.nav a[href="#material"]').click();await page.locator('#material').waitFor({state:'visible'});await page.locator('#material > details.js-only > summary').click();
  const downloading=page.waitForEvent('download');await page.locator('#export-state').click();const download=await downloading,exportPath=path.join(shots,'state.json');await download.saveAs(exportPath);const saved=JSON.parse(fs.readFileSync(exportPath));assert.equal(saved.schema,'ki-projekt-seitenstand-v1');assert(saved.checks['phase-1']);assert.equal(saved.topic,'Früchte');
  page.on('dialog',d=>d.accept());await page.locator('#reset-state').click();assert(!await page.locator('[data-check="phase-1"]').isChecked());
  await page.locator('#import-state').setInputFiles(exportPath);await page.waitForFunction(()=>document.querySelector('[data-check="phase-1"]').checked);assert.equal(await page.locator('[data-note="topic"]').inputValue(),saved.notes.topic);
  await page.locator('#import-state').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"wrong"}')});await page.waitForFunction(()=>document.getElementById('save-status').textContent.includes('Import fehlgeschlagen'));assert(await page.locator('[data-check="phase-1"]').isChecked());
  const hrefs=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
  for(const href of hrefs){if(href.startsWith('#'))assert(await page.locator(href).count(),href);if(href.includes('?path='))assert(fs.existsSync(path.join(root,'content',new URL(href,url).searchParams.get('path'))),href);}
  await page.locator('.nav a[href="#bewertung"]').click();await page.locator('#bewertung').waitFor({state:'visible'});await page.waitForTimeout(300);await page.screenshot({path:path.join(shots,'bewertung.png')});
  await page.emulateMedia({media:'print'});await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));assert.equal(await page.locator('[data-experiment]:visible').count(),1);assert.equal(await page.locator('.topic:visible').count(),12);await page.pdf({path:path.join(shots,'projekt.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
  const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await mobile.goto(url);assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mobile.screenshot({path:path.join(shots,'mobile.png')});
  await mobile.locator('.nav a[href="#kompetenzen"]').click();await mobile.locator('#kompetenzen').waitFor({state:'visible'});await mobile.waitForTimeout(300);assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mobile.screenshot({path:path.join(shots,'mobile-skills.png')});
  const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(url);assert.equal(await nojs.locator('.topic:visible').count(),12);assert.equal(await nojs.locator('[data-experiment]:visible').count(),1);
  const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked');};});await blocked.goto(url);await blocked.locator('.nav a[href="#ablauf"]').click();await blocked.locator('#ablauf').waitFor({state:'visible'});await blocked.locator('#ablauf details').first().locator('summary').click();await blocked.locator('[data-check="phase-1"]').click();await blocked.waitForFunction(()=>document.getElementById('save-status').textContent.includes('nicht verfügbar'),null,{timeout:10000});
  assert.deepEqual(errors,[]);console.log('PASS page interactions, persistence, import/export, links, mobile, print, no-JS and blocked storage. Screenshots:',shots);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
