/* Real-browser smoke test for the independent Kurzgymi basic course. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const directory=process.env.PORTAL_SITE||path.resolve(__dirname,'../dist');
  const server=spawn('python',['-m','http.server','8770','--bind','127.0.0.1','--directory',directory],{stdio:'ignore'});
  let browser;
  try{
    await new Promise(resolve=>setTimeout(resolve,1000));
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8770/kurse.html');
    assert.equal(await page.locator('a.choice').count(),2,'Both Kurzgymi tracks must appear');
    await page.locator('a.choice[href="basis/"]').click();
    assert.equal(await page.title(),'KI entdecken · 1. Kurzgymnasium');
    assert.equal(await page.locator('main > section').count(),7);
    await page.locator('.nav > a[href="#basis-ki"]').click();
    const note=page.locator('[data-basis-answer="basis-ki-a"]');
    await note.fill('KI lernt Muster aus Beispielen.');
    await page.locator('.nav > a[href="#basis-lernen"]').click();
    const lab=page.locator('[data-basis-neuron]');
    assert.equal(await lab.locator('tbody tr').count(),4);
    const before=await lab.locator('tbody').innerText();
    await lab.locator('[data-weight="sun"]').evaluate(el=>{el.value='-2';el.dispatchEvent(new Event('input',{bubbles:true}));});
    const after=await lab.locator('tbody').innerText();
    assert.notEqual(before,after,'Neuron outputs must react immediately to slider changes');
    await page.reload();
    await page.locator('.nav > a[href="#basis-ki"]').click();
    assert.equal(await note.inputValue(),'KI lernt Muster aus Beispielen.','Basic-course notes must survive reload');
    assert(await page.evaluate(()=>Boolean(localStorage.getItem('kst-ki-basis-v1'))));
    assert.equal(await page.evaluate(()=>localStorage.getItem('kst-ki-kursportal-v1')),null,
      'Basic course must not use the advanced course storage');
    assert.deepEqual(errors,[]);
    console.log('PASS both course links, six lessons, live neuron controls and isolated persistent answers');
  }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
