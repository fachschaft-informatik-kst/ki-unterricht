/* End-to-end JupyterLite smoke: trusted, course-scoped notebook can start. */
const {chromium}=require('playwright-core');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const path=require('node:path');
const directory=process.env.LITE_SITE||path.resolve(__dirname,'../dist');
const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',directory],{stdio:'ignore'});
(async()=>{
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,
    headless:true,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
  const page=await browser.newPage();
  const source='portal/bok/4-klasse/perzeptron_und_neuronale_netze.ipynb';
  const url='http://127.0.0.1:8765/lab/index.html?path='+encodeURIComponent(source);
  await page.goto(url);
  await page.waitForFunction(()=>[...document.querySelectorAll('.ki-autostart-status')]
    .some(e=>e.textContent.includes('Bereit')||e.textContent.includes('fehlgeschlagen')),null,{timeout:180000});
  const status=await page.locator('.ki-autostart-status').first().textContent();
  assert.equal(status,'✓ Bereit','Course-scoped notebook startup failed');
  assert.equal(await page.locator('.jp-OutputArea').filter({
    hasText:'Error displaying widget: model not found'}).count(),0,
    'Widget manager must start before the first teaching widget');
  assert(await page.locator('.jp-CodeCell').count()>0,'Notebook code cells are missing');
  console.log('PASS JupyterLite course notebook opens with a working Python kernel');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});
