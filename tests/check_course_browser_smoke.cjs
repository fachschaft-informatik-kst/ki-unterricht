/* Minimal technical browser smoke: every independently rendered course loads. */
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=process.env.PORTAL_SITE||'dist';
const port=8778;
const server=spawn('python',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
(async()=>{
 let browser;
 try {
  browser=await chromium.launch({headless:true});
  for(const slug of ['bok/1-klasse','bok/4-klasse','irn/1-klasse','irn/4-klasse']){
   const page=await browser.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:'+port+'/'+slug+'/',{waitUntil:'domcontentloaded'});
   assert.equal(response?.status(),200,slug+' must load');
   assert(await page.locator('main > section').count()>0,slug+' must render course sections');
   assert(await page.locator('h1').count()>0,slug+' must have a heading');
   const title=await page.title();
   assert(title.includes(slug.split('/')[0].toUpperCase()),slug+' has incorrect tab title');
   assert.deepEqual(errors,[],slug+' has script errors');
   await page.close();
   console.log('PASS browser: '+slug);
  }
 } finally {
  if(browser)await browser.close();
  server.kill();
 }
})().catch(error=>{console.error(error);process.exitCode=1});
