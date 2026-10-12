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
    browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH, headless:true, args:JSON.parse(process.env.CHROMIUM_ARGS || '[]')});
    for (const name of ['perzeptron_und_neuronale_netze.ipynb','lernarten.ipynb','ki_projekt/ki_tandemprojekt.ipynb']) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:8765/lab/index.html?path='+encodeURIComponent(name));
      for (let pass=0;pass<2;pass++) {
        await page.waitForFunction(() => [...document.querySelectorAll('.ki-autostart-status')].some(e=>e.textContent.includes('Bereit') || e.textContent.includes('fehlgeschlagen')), null, {timeout:180000});
        assert.equal(await page.locator('.ki-autostart-status').textContent(), '✓ Bereit', await page.locator('body').innerText());
        if (name.startsWith('perzeptron')) {
          await reveal(page, '.widget-dropdown select');
          await page.locator('.widget-dropdown select').selectOption({label:'XOR'});
          await page.waitForTimeout(500);
          assert.equal(await page.locator('.widget-dropdown select').inputValue(),'XOR');
          await page.locator('.widget-output').filter({hasText:'→ 1 (0)'}).first().waitFor({state:'visible'});
        } else if (name==='lernarten.ipynb') {
          await reveal(page, '.widget-button');
          const button = page.getByRole('button', {name:'1 nehmen',exact:true}).first();
          await button.click();
          await page.waitForTimeout(500);
          await page.locator('.widget-output').filter({hasText:'KI nimmt'}).first().waitFor({state:'visible'});
        } else {
          const body=await page.locator('body').innerText();
          assert(!body.includes('Traceback'));
          // Only imports run; no upload or download widget appears.
          assert.equal(await page.locator('.widget-upload, .widget-button').count(),0);
          assert.equal(await page.locator('.jp-InputPrompt').filter({hasText:'[1]:'}).count(),1);
          assert.equal(await page.locator('.jp-InputPrompt').filter({hasText:'[2]:'}).count(),0);
        }
        console.log('PASS', name, pass ? 'reload' : 'open');
        if (!pass) await page.reload();
      }
      await context.close();
    }
  } finally {if(browser) await browser.close();server.kill();}
})().catch(error => {console.error(error);process.exitCode=1;});
