// Bildprojekt: eine Seite pro Etappe, durchgehende Unternavigation und stabile Sprungziele.
// Build with scripts/copy_portal.py (or scripts/preview.py) first. Set PORTAL_SITE, CHROMIUM_PATH,
// optional CHROMIUM_ARGS (JSON). Requires playwright-core.
const {chromium}=require('playwright-core'),{spawn}=require('node:child_process');
const path=require('node:path'),assert=require('node:assert/strict');
const PORT=process.env.PROJECT_PAGES_PORT||'8766';
(async()=>{
 const server=spawn('python',['-m','http.server',PORT,'--bind','127.0.0.1','--directory',process.env.PORTAL_SITE||path.resolve(__dirname,'../dist')],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(r=>setTimeout(r,600));
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
  const errors=[];
  for(const course of (process.env.PROJECT_PAGES_COURSES||'bok/4-klasse,irn/4-klasse').split(',')){
  const open=async(hash,context)=>{
   const p=await (context||browser).newPage({viewport:{width:1440,height:1000}});
   p.on('pageerror',e=>errors.push(e.message));
   await p.goto('http://127.0.0.1:'+PORT+'/'+course+'/'+hash);
   await p.waitForFunction(()=>document.documentElement.classList.contains('has-js'));
   return p;
  };
  // The hashchange event runs after location.hash is set, so wait for it to be handled.
  const settle=async(p,hash)=>{await p.waitForFunction(h=>location.hash===h,hash);await p.waitForTimeout(80);};
  const visibleView=p=>p.evaluate(()=>[...document.querySelectorAll('main > section')].filter(s=>!s.classList.contains('view-hidden')).map(s=>s.id));
  const visiblePages=p=>p.evaluate(()=>[...document.querySelectorAll('#projekt > details.kapitel')].filter(k=>getComputedStyle(k).display!=='none').map(k=>k.id));
  const subnav=p=>p.evaluate(()=>[...document.querySelectorAll('.nav-sub a')].map(a=>({text:a.textContent.replace(/\s+/g,' ').trim(),current:a.getAttribute('aria-current')==='page',href:a.getAttribute('href')})));

  // Fahrplan: Start plus sechs Etappen; keine Seite ist offen.
  let p=await open('#projekt');
  assert.deepEqual(await visibleView(p),['projekt']);
  assert.deepEqual(await visiblePages(p),[],'The roadmap shows no project page');
  assert(await p.locator('#projekt .roadmap').isVisible(),'Roadmap is visible on the project home');
  const menu=await subnav(p);
  assert.deepEqual(menu.map(x=>x.href),['#projekt','#projekt-regeln','#projekt-2','#projekt-3','#projekt-4','#projekt-abschluss','#journal'],'Project navigation order follows the work flow');
  assert.deepEqual(menu.filter(x=>x.current).map(x=>x.href),['#projekt'],'Roadmap is the current navigation item');
  assert.equal(menu.length,7,'Project navigation lists the roadmap, five pages and the journal');
  assert((await p.locator('.nav-sub a').nth(4).innerText()).replace(/\s+/g,' ').includes('3–4'),'Navigation numbers are the stage numbers');

  // Eine Seite zur Zeit; der Sprung über die Navigation öffnet genau diese Seite.
  await p.locator('.nav-sub a[href="#projekt-2"]').click();
  await settle(p,'#projekt-2');
  assert.deepEqual(await visiblePages(p),['projekt-2'],'Only the selected project page is shown');
  assert(!await p.locator('#projekt .roadmap').isVisible(),'The roadmap is hidden while a page is open');
  assert(await p.locator('#projekt-2').evaluate(el=>el.open),'The selected page is open');
  assert.deepEqual((await subnav(p)).filter(x=>x.current).map(x=>x.href),['#projekt-2']);
  await p.locator('#projekt-2 > summary').click({force:true});
  assert(await p.locator('#projekt-2').evaluate(el=>el.open),'A project page title does not collapse the page');

  // Weiter und Zurück folgen der Reihenfolge der Arbeitsschritte.
  await p.locator('#projekt-2 .page-next a.primary').click();
  await settle(p,'#projekt-3');
  assert.deepEqual(await visiblePages(p),['projekt-3']);
  await p.locator('#projekt-3 .page-next a:not(.primary)').click();
  await settle(p,'#projekt-2');
  await p.locator('#projekt-2 .page-crumb a').click();
  await settle(p,'#projekt');
  assert.deepEqual(await visiblePages(p),[],'The crumb returns to the roadmap');

  // Bestehende Anker und Feld-Sprünge öffnen die richtige Seite.
  for(const [hash,page,selector] of [
    ['#daten','projekt-regeln','#daten'],['#ideen','projekt-2','#ideen'],['#projekt-fotostudio','projekt-3','#projekt-fotostudio #start-studio'],
    ['#versuch','projekt-4','#versuch'],['#projekt-wer-weiss-was','projekt-4','#projekt-wer-weiss-was'],['#abschluss','projekt-abschluss','#abschluss'],
    ['#feld-projekt_datencheck','projekt-regeln','[data-answer="projekt_datencheck"]'],['#projekt-etappe-3','','#projekt-etappe-3'],['#doppellektion-06','','#doppellektion-06 .lesson-question'],
  ]){
   await p.evaluate(h=>{location.hash=h},hash);
   await settle(p,hash);
   assert.deepEqual(await visiblePages(p),page?[page]:[],hash+' opens '+(page||'the roadmap'));
   assert(await p.locator(selector).first().isVisible(),hash+' target is visible');
  }
  assert(await p.locator('#projekt-regeln').evaluate(el=>el.open===true),'Deep links open their page');
  await p.evaluate(()=>{location.hash='#daten'});
  await settle(p,'#daten');
  await p.waitForTimeout(150);
  assert((await p.evaluate(()=>window.scrollY))<120,'A link to a page body starts at the top of the page');

  // Fahrplan hebt die nächste offene Etappe hervor und markiert erledigte.
  await p.evaluate(()=>{location.hash='#projekt'});
  await settle(p,'#projekt');
  assert.equal(await p.locator('.roadmap-step.is-next').count(),1);
  assert(await p.locator('#projekt-etappe-1').evaluate(el=>el.classList.contains('is-next')),'First open stage is highlighted');
  await p.locator('#projekt-etappe-1 input[data-check="phase-1"]').check();
  assert(await p.locator('#projekt-etappe-1').evaluate(el=>el.classList.contains('is-done')&&!el.classList.contains('is-next')),'Finished stage is marked');
  assert(await p.locator('#projekt-etappe-2').evaluate(el=>el.classList.contains('is-next')),'Next open stage moves on');
  await p.locator('#projekt-etappe-1 input[data-check="phase-1"]').uncheck();
  assert(await p.locator('#projekt-etappe-1').evaluate(el=>el.classList.contains('is-next')));

  // Journal, Bewertung und Sichern behalten die Projektnavigation.
  for(const [hash,current] of [['#journal','#journal'],['#bewertung',null],['#sicherung',null]]){
   await p.evaluate(h=>{location.hash=h},hash);
   await settle(p,hash);
   const items=await subnav(p);
   assert.equal(items.length,7,hash+' keeps the project navigation');
   assert.deepEqual(items.filter(x=>x.current).map(x=>x.href),current?[current]:[],hash+' marks the matching item');
   assert.equal(await p.locator('.nav a[aria-current="page"]').first().getAttribute('href'),'#projekt','The project entry stays highlighted');
  }

  // Andere Doppellektionen behalten ihre aufklappbaren Kapitel und ihre Kapitelnavigation.
  await p.evaluate(()=>{location.hash='#einstieg'});
  await settle(p,'#einstieg');
  assert.equal((await subnav(p)).length,6,'Other lessons keep their chapter navigation');
  assert(await p.locator('#einstieg-3').isVisible(),'Other lessons show all chapters');
  await p.close();

  // Ohne Skript bleiben alle Projektkapitel als aufklappbare Abschnitte erreichbar.
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:900}});
  const q=await plain.newPage();
  await q.goto('http://127.0.0.1:'+PORT+'/'+course+'/');
  for(const id of ['projekt-regeln','projekt-2','projekt-3','projekt-4','projekt-abschluss'])
   assert.equal(await q.locator('#'+id).count(),1,id+' exists without JavaScript');
  assert.equal(await q.locator('#projekt-2').evaluate(el=>getComputedStyle(el).display),'block','Without JavaScript the chapters are not hidden');
  await plain.close();
  }

  assert.deepEqual(errors,[],'No page errors');
  console.log('PASS project pages: one page per stage, persistent navigation, stable anchors and no-script fallback');
 }finally{
  if(browser)await browser.close();
  server.kill();
 }
})().catch(e=>{console.error(e);process.exit(1);});
