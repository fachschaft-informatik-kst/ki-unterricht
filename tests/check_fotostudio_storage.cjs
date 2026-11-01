/* Exercise real IndexedDB restore, import, conflict protection, download and erase in Chromium. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const dir=process.env.PORTAL_SITE||path.resolve(__dirname,'../dist');
 const server=spawn('python',['-m','http.server','8777','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(done=>setTimeout(done,700));
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https:\/\//,route=>route.abort()); // No model download needed to test saved records.
  const url='http://127.0.0.1:8777/projekt/studio/';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#autosave-status')?.textContent.includes('aktiv'),null,{timeout:10000});
  assert.equal(await page.locator('.eyebrow').textContent(),'KI-Bildprojekt · Schritt 2: Bilder vorbereiten');
  assert.equal(await page.locator('.studio-card').count(),3,'Studio has the same card-based visual hierarchy as the course');
  assert.equal(await page.locator('#studio-progress').getAttribute('max'),'80');
  assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(245, 244, 238)','Studio uses course background');
  assert.equal(await page.locator('#add').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(7, 105, 89)','Studio primary button uses course accent');

  const record={id:'local-digest-1',group:'T1',label:'Tasse',source:'Probedaten',filename:'tasse.jpg',features:Array(1280).fill(0),preview:''};
  const doc={schema:'fotostudio-v1',pipeline:'mobilenet-v2-050-224-rgb-whitepad-v1',tfjs:'4.22.0',mobilenet:'2.1.1',records:[record]};
  await page.locator('#resume').setInputFiles({name:'foto-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(doc))});
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('1 Bilder wiederhergestellt'));
  assert((await page.locator('#counts').innerText()).includes('T1 / Tasse: 1'));
  assert.equal(await page.locator('#count-total').innerText(),'1','Progress count reflects restored collection');
  assert.equal(await page.locator('#studio-progress').getAttribute('value'),'1','Progress bar reflects restored collection');

  const downloadEvent=page.waitForEvent('download');
  await page.locator('#save').click();
  const download=await downloadEvent;
  const exported=JSON.parse(fs.readFileSync(await download.path(),'utf-8'));
  assert.equal(exported.schema,'fotostudio-v1');
  assert.deepEqual(exported.records,[record]);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Browser-Speicher wiederhergestellt'));
  assert((await page.locator('#counts').innerText()).includes('T1 / Tasse: 1'),'Persisted record must survive reload');
  const conflict={...doc,records:[{...record,label:'Buch'}]};
  await page.locator('#resume').setInputFiles({name:'konflikt.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(conflict))});
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Widersprüchliche Bild-ID'));
  assert((await page.locator('#counts').innerText()).includes('T1 / Tasse: 1'),'Conflict must not overwrite data');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#clear').click();
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Lokale Sammlung gelöscht'));
  assert.equal((await page.locator('#counts li').count()),0);
  assert.equal(await page.locator('#count-total').innerText(),'0','Progress count resets on erase');

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#autosave-status')?.textContent.includes('aktiv'));
  assert.equal((await page.locator('#counts li').count()),0,'Erase must survive reload');
  assert.deepEqual(errors,[]);
  console.log('PASS Fotostudio local autosave, reload recovery, compatible JSON, conflict isolation and erase');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});
