// Run after `jupyter lite build ... --output-dir dist`.
// Requires playwright-core and CHROMIUM_PATH (optional CHROMIUM_ARGS as JSON).
const {chromium} = require('playwright-core');
const {spawn} = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');
const directory = process.env.LITE_SITE || path.resolve(__dirname, '../dist');
async function reveal(page, selector) {
  for (let i=0;i<30;i++) {
    if (await page.locator(selector).first().isVisible()) return;
    await page.locator('.jp-Notebook').hover();
    await page.mouse.wheel(0,400);
    await page.waitForTimeout(100);
  }
  await page.screenshot({path:'/tmp/ki-autostart-widget.png'});
  console.log(await page.locator('.jp-Notebook').evaluate(e=>({tag:e.tagName,classes:e.className,scroll:e.scrollTop,height:e.clientHeight,total:e.scrollHeight})));
  throw Error('Widget not rendered: '+selector);
}
(async () => {
  const server = spawn('python', ['-m','http.server','8765','--bind','127.0.0.1','--directory',directory], {stdio:'ignore'});
  let browser;
  try {
    await new Promise(r => setTimeout(r, 1000));
    // CI tests a genuinely cold standalone JupyterLite notebook, before any
    // manual restart. The full local variant also checks reload + project.
    const coldStart = process.env.KI_WIDGET_COLD_START === '1';
    for (const name of (coldStart
      ? ['perzeptron_und_neuronale_netze.ipynb']
      : ['perzeptron_und_neuronale_netze.ipynb','ki_projekt/ki_tandemprojekt.ipynb'])) {
    browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH, headless:true, args:JSON.parse(process.env.CHROMIUM_ARGS || '[]')});
      const context = await browser.newContext();
      const page = await context.newPage();
      page.on('console', m=>{if (m.type()==='error') console.error(m.text());});
      page.on('pageerror',e=>console.error('PAGEERROR',e.message));
      await page.goto('http://127.0.0.1:8765/lab/index.html?path='+encodeURIComponent(name));
      for (let pass=0;pass<(coldStart ? 1 : 2);pass++) {
        await page.waitForFunction(() => [...document.querySelectorAll('.ki-autostart-status')].some(e=>e.textContent.includes('Bereit') || e.textContent.includes('fehlgeschlagen')), null, {timeout:180000}).catch(async error=>{console.error(await page.locator('body').innerText());throw error;});
        assert.equal(await page.locator('.ki-autostart-status').textContent(), '✓ Bereit', await page.locator('body').innerText());
        if (name.startsWith('perzeptron')) {
          // Der kompakte Gatterversuch zeigt Ziel und Ist-Ausgabe direkt in der Live-Tabelle.
          const aufgabe = '.widget-dropdown select:has(option:text-is("OR"))';
          await reveal(page, aufgabe);
          const widgetOutput = page.locator('.jp-CodeCell').nth(1).locator('.jp-OutputArea');
          assert(!/FloatSlider\\(value=|HTML\\(value=/.test(await widgetOutput.innerText()),
            'Interactive controls must never be duplicated as a Python repr');
          assert.equal(await page.locator('.jp-OutputArea').filter({hasText:'Error displaying widget: model not found'}).count(),0,
            'No widget may fail its first model registration on cold startup');
          assert.equal(await page.locator('.widget-checkbox').count(),3,
            'All three swimming situation inputs must render on initial launch');
          assert.equal(await page.locator('.widget-dropdown select:has(option:text-is("XOR"))').count(),0,'DL3 must not introduce XOR');
          await page.locator(aufgabe).first().selectOption({label:'OR'});
          await page.waitForTimeout(300);
          assert.equal(await page.locator(aufgabe).first().inputValue(),'OR');
          await page.getByText('Gatter-Ziel', {exact:true}).first().waitFor({state:'visible'});
          await page.getByText('OR: 2/4 richtig.', {exact:false}).first().waitFor({state:'visible'});
        } else {
          const body=await page.locator('body').innerText();
          assert(!body.includes('Traceback'));
          // Only imports run; no upload or download widget appears.
          assert.equal(await page.locator('.widget-upload, .widget-button').count(),0);
          assert.equal(await page.locator('.jp-InputPrompt').filter({hasText:'[1]:'}).count(),1);
          assert.equal(await page.locator('.jp-InputPrompt').filter({hasText:'[2]:'}).count(),0);
        }
        console.log('PASS', name, pass ? 'reload' : 'open');
        if (!pass && !coldStart) await page.reload();
      }
      await browser.close();
    }
  } finally {if(browser) await browser.close();server.kill();}
})().catch(error => {console.error(error);process.exitCode=1;});
