// Build with scripts/copy_portal.py first. Set PORTAL_SITE, CHROMIUM_PATH,
// optional CHROMIUM_ARGS (JSON). Requires playwright-core.
const {chromium}=require('playwright-core'),{spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',process.env.PORTAL_SITE||path.resolve(__dirname,'../dist')],{stdio:'ignore'});
 let browser;
 try{
  await new Promise(r=>setTimeout(r,600));
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());p.on('console',m=>{if(m.type()==='error')console.error('BROWSER',m.text());});
  await p.goto('http://127.0.0.1:8765/projekt/');
  assert.equal(await p.locator('iframe[src*="lab/index"]').count(),0,'Reading the page must not start Python');
  assert.equal(await p.locator('.course-card').count(),7);assert.equal(await p.locator('.nav a').count(),10);
  assert((await p.locator('.ki-notebook-block .ki-notebook-direct[href*="/lab/"]').count())>=7,
    'Every registered in-chapter notebook has a direct JupyterLite link');
  assert.equal(await p.locator('iframe[src*="lab/index"]').count(),0,
    'Notebook blocks must remain unloaded until explicitly opened');
  // Visual geometry smoke test: keep overview cards sizeable on desktop.
  // Full-page desktop/mobile captures below remain available for review.
  const desktopCard=await p.locator('.course-card').first().boundingBox();
  assert(desktopCard&&desktopCard.width>=150&&desktopCard.height>=55,
    'Desktop course card collapsed or invisible');
  await p.screenshot({path:'/tmp/ki-portal-home.png',fullPage:true});
  assert.equal(await p.locator('.lesson-plan').count(),10);
  // Contextual glossary links keep learners in the lesson; answers open on demand.
  await p.locator('.nav a[href="#einstieg"]').click();
  await p.locator('#einstieg .glossary-related a[href="#glossar-ki"]').click();
  const glossaryDialog=p.locator('dialog.glossary-dialog');
  assert(await glossaryDialog.isVisible(),'Begriff wird ohne Kurswechsel erklärt');
  const quickAnswer=glossaryDialog.locator('details.glossary-answer');
  assert(!await quickAnswer.evaluate(el=>el.open),'Leitfrage-Antwort bleibt zunächst verborgen');
  const summary=quickAnswer.locator('summary');
  assert.equal(await summary.innerText(),'Antwort anzeigen');
  assert.equal(await summary.evaluate(el=>getComputedStyle(el,'::after').content),'none','Kein doppeltes Plus-Zeichen aus globalem Kurslayout');
  assert((await summary.boundingBox()).height>=44,'Antwort-Schalter ist ausreichend gross');
  await summary.click();
  assert(await quickAnswer.evaluate(el=>el.open),'Leitfrage-Antwort lässt sich aufklappen');
  assert.equal(await summary.innerText(),'Antwort verbergen');
  assert(await quickAnswer.locator('.glossary-answer-content').isVisible());
  await glossaryDialog.locator('.glossary-close').click();
  await p.locator('.nav a[href="#lernziele"]').click();await p.locator('#lernziele').waitFor({state:'visible'});assert.equal(await p.locator('#lernziele .grid > article').count(),7);
  assert.equal(await p.locator('#lernziele .grid > article').filter({hasText:'Das Bildprojekt untersuchen'}).locator('.section-label').innerText(),'05–08');
  await p.locator('#lernziele a[href="#bewertung"]').click();const scoring=p.locator('[data-score]');assert.equal(await scoring.count(),10);
  assert((await p.locator('#grade-result').innerText()).includes('Noch keine Gesamtnote'));
  for(let i=0;i<10;i++)await scoring.nth(i).selectOption(i<6?'3':'0');assert((await p.locator('#grade-result').innerText()).includes('18 / 30 Punkte → Note 4.00'));
  for(let i=0;i<10;i++)await scoring.nth(i).selectOption('3');assert((await p.locator('#grade-result').innerText()).includes('30 / 30 Punkte → Note 6.00'));
  for(let i=0;i<10;i++)await scoring.nth(i).selectOption('0');assert((await p.locator('#grade-result').innerText()).includes('0 / 30 Punkte → Note 1.00'));
  for(let i=0;i<10;i++)await scoring.nth(i).selectOption('2');assert((await p.locator('#grade-result').innerText()).includes('20 / 30 Punkte → Note 4.25'));
  await p.reload();assert((await p.locator('#grade-result').innerText()).includes('20 / 30 Punkte → Note 4.25'));await p.screenshot({path:'/tmp/ki-rubric.png',fullPage:true});
  assert.equal(await p.locator('[data-lab="lernarten.ipynb"]').count(),0);assert.equal(await p.locator('#lernarten a[href="https://inf-schule.de/ki/menueansicht/ki_erkunden/nim-spiel/lernstrecke"]').count(),1);

  await p.locator('.nav a[href="#einstieg"]').click();
    // DL1 two accessible matching activities: mouse drag, select fallback, feedback and reset.
    const rulesTask=p.locator('#einstieg [data-ki-sort-task="regeln"]');
    const termsTask=p.locator('#einstieg [data-ki-sort-task="begriffe"]');
    assert.equal(await rulesTask.locator('[data-ki-sort-card]').count(),4);
    assert.equal(await termsTask.locator('[data-ki-sort-card]').count(),5);
    assert(await rulesTask.locator('[data-ki-sort-check]').isDisabled());
    // Exercise the HTML5 drag-and-drop event contract deterministically in Chromium.
    const transfer=await p.evaluateHandle(()=>new DataTransfer());
    await rulesTask.locator('[data-ki-sort-card="automat"]').dispatchEvent('dragstart',{dataTransfer:transfer});
    await rulesTask.locator('[data-ki-sort-bin="regeln"]').dispatchEvent('dragover',{dataTransfer:transfer});
    await rulesTask.locator('[data-ki-sort-bin="regeln"]').dispatchEvent('drop',{dataTransfer:transfer});
    await rulesTask.locator('[data-ki-sort-card="automat"]').dispatchEvent('dragend',{dataTransfer:transfer});
    assert.equal(await rulesTask.locator('[data-ki-sort-card="automat"] select').inputValue(),'regeln',JSON.stringify(await rulesTask.evaluate(el=>({ready:el.classList.contains('ki-sort-ready'),pool:el.querySelector('[data-ki-sort-pool]').children.length,target:el.querySelector('[data-ki-sort-bin="regeln"] [data-ki-sort-target]').children.length}))),'Drag updates answer field');
    await rulesTask.locator('[data-ki-sort-card="uebersetzung"] select').selectOption('daten');
    await rulesTask.locator('[data-ki-sort-card="ampel"] select').selectOption('regeln');
    await rulesTask.locator('[data-ki-sort-card="gesicht"] select').selectOption('daten');
    await rulesTask.locator('[data-ki-sort-check]').click();
    assert((await rulesTask.locator('[data-ki-sort-status]').innerText()).includes('Alle 4 Beispiele richtig'));
    await rulesTask.locator('[data-ki-sort-reset]').click();
    assert.equal(await rulesTask.locator('[data-ki-sort-card="automat"] select').inputValue(),'');
    await termsTask.locator('[data-ki-sort-card="spam"] select').selectOption('deep');
    await termsTask.locator('[data-ki-sort-card="ampel"] select').selectOption('keine');
    await termsTask.locator('[data-ki-sort-card="schach"] select').selectOption('regelki');
    await termsTask.locator('[data-ki-sort-card="bilder"] select').selectOption('deep');
    await termsTask.locator('[data-ki-sort-card="text"] select').selectOption('generativ');
    await termsTask.locator('[data-ki-sort-check]').click();
    assert((await termsTask.locator('[data-ki-sort-status]').innerText()).includes('4 von 5 richtig'));
    assert.equal(await termsTask.locator('[data-ki-sort-card="spam"]').getAttribute('data-ki-sort-result'),'incorrect');
    await termsTask.locator('[data-ki-sort-card="spam"] select').selectOption('ml');
    await termsTask.locator('[data-ki-sort-check]').click();
    assert((await termsTask.locator('[data-ki-sort-status]').innerText()).includes('Alle 5 Beispiele richtig'));
    assert.equal(await termsTask.locator('select[data-answer]').count(),5);
    assert.equal(await p.locator('#einstieg-2 [data-answer="begriff_bsp_1"]').count(),1,'Prior free examples remain available');
    assert.equal(await p.locator('#einstieg-2 [data-answer="regeln_oder_daten"]').count(),1,'One reflection answer');
    assert.equal(await p.locator('#einstieg .external-map').count(),0);
    assert.equal(await p.locator('#einstieg img[src="grafiken/ki_programmierung.png"]').count(),1);
    assert.equal(await p.locator('#einstieg img[src="grafiken/ki_einteilung.png"]').count(),1);
    assert.equal(await p.locator('#einstieg .timeline li').count(),9);

    // Both course palettes must distinguish rule-based milestones from data-driven ones.
    const milestoneBadgeColours=await p.locator('#einstieg-3 .section-intro .marke').evaluateAll(nodes=>
      nodes.map(node=>({label:node.textContent.trim(),background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color})));
    assert.deepEqual(milestoneBadgeColours,[
      {label:'Programmierung durch Menschen',background:'rgb(84, 130, 53)',color:'rgb(255, 255, 255)'},
      {label:'Datengetriebene Programmierung',background:'rgb(51, 65, 85)',color:'rgb(255, 255, 255)'}
    ],'Markers match green/slate DL1 programming graphic');
    const legendDescription=await p.locator('#einstieg-3 .section-intro').innerText();
    assert(legendDescription.includes('Programmierung durch Menschen')&&legendDescription.includes('Datengetriebene Programmierung')&&legendDescription.includes('KI-Winter'));
    assert.equal(await p.locator('#einstieg-3 .section-intro a[href="#einstieg-1"]').count(),1,'Legend links to chapter 1 graphic');
    const introLayout=await p.locator('#einstieg-3 .section-intro').evaluate(el=>({width:el.getBoundingClientRect().width,containerWidth:el.parentElement.clientWidth-parseFloat(getComputedStyle(el.parentElement).paddingLeft)-parseFloat(getComputedStyle(el.parentElement).paddingRight),maxWidth:getComputedStyle(el).maxWidth,align:getComputedStyle(el).textAlign,hyphens:getComputedStyle(el).hyphens}));
    assert.equal(introLayout.maxWidth,'none','Milestone intro must not be limited to 760px');
    assert.equal(introLayout.align,'justify','Milestone intro uses justified text');
    assert.equal(introLayout.hyphens,'auto','Milestone intro allows hyphenation');
    assert(Math.abs(introLayout.width-introLayout.containerWidth)<2,'Milestone intro fills its chapter box');
    const projectIntroStyle=await p.locator('#projekt-1 .kapitel-body > .section-intro').evaluate(el=>({maxWidth:getComputedStyle(el).maxWidth,textAlign:getComputedStyle(el).textAlign}));
    assert.deepEqual(projectIntroStyle,{maxWidth:'none',textAlign:'justify'},'Project chapter introductions also use the full box width');
    assert.equal(await p.locator('#projekt .project-start-steps > li').count(),3,'Project home makes the starting sequence visible');
    assert.equal(await p.locator('#projekt .project-start-steps > li').nth(1).locator('a[href="#projekt-fotostudio"]').count(),1,'Start step 2 links to its Fotostudio');
    assert.equal(await p.locator('#projekt-1 [id^="projekt-etappe-"]').count(),6,'Six project stages remain accessible');
    assert.equal(await p.locator('#projekt-1 .lesson-plan[open]').count(),0,'Project lesson descriptions start collapsed');
    assert.equal(await p.locator('#journal #projekt-werkbank #start-project').count(),1,'Project notebook starts in the workbench');
    assert.equal(await p.locator('#projekt-3 #projekt-fotostudio #start-studio').count(),1,'Photo studio belongs to step 2 in the data plan');
    assert.equal(await p.locator('#journal #start-studio').count(),0,'Journal is for the model experiment, not photo preparation');
    assert.equal(await p.locator('#journal #projekt-reflexionen .journal-step').count(),5,'All five saved reflections remain available');



    // All nine history titles open sourced image panels without losing lesson position.
    assert.equal(await p.locator('#einstieg-3 .milestone-trigger').count(),9);
    const firstHistory=p.locator('#einstieg-3 .milestone-trigger').first();
    // Native browser activation is tested without Playwright auto-scrolling
    // the target; opening and closing must preserve the actual reading position.
    const historyScrollBefore=await p.evaluate(()=>{window.scrollTo({top:320,behavior:'instant'});return window.scrollY});
    assert(historyScrollBefore>80,'Timeline page is scrollable');
    const historyHashBefore=await p.evaluate(()=>location.hash);
    await firstHistory.evaluate(el=>el.click());
    await p.waitForTimeout(80);
    assert.equal(await p.evaluate(()=>window.scrollY),historyScrollBefore,'Opening a milestone must not scroll to the top');
    assert.equal(await p.evaluate(()=>location.hash),historyHashBefore,'Opening a milestone must not navigate');
    const historyDialog=p.locator('dialog.milestone-dialog');
    assert(await historyDialog.isVisible(),'KI history title opens a modal');
    assert(await historyDialog.locator('img[alt]').count());
    assert((await historyDialog.locator('figcaption').innerText()).length>60);
    assert((await historyDialog.locator('.milestone-source a').getAttribute('href')).includes('commons.wikimedia.org/wiki/File:'));
    await p.keyboard.press('Escape');
    await historyDialog.waitFor({state:'hidden'});
    // A hidden native dialog can still have its "close" event pending.
    // Check the focus-return contract after that event rather than racing it.
    await p.waitForFunction(()=>
      document.activeElement===document.querySelector('#einstieg-3 .milestone-trigger'),
      null,{timeout:3000});
    assert.equal(await p.evaluate(()=>window.scrollY),historyScrollBefore,'Closing a milestone must preserve scroll');
    await p.locator('#einstieg-3 [data-milestone-open="alexnet"]').evaluate(el=>el.click());
    assert((await historyDialog.innerText()).includes('AlexNet'));
    assert.equal(await p.evaluate(()=>window.scrollY),historyScrollBefore,'Opening another popup keeps position');
    await historyDialog.locator('.milestone-close').click();

    for(const [id,n] of Object.entries({einstieg:6,lernarten:9,perzeptron:7,netze:5,sprache:7,gesellschaft:6,projekt:4}))assert.equal(await p.locator('#'+id+' details.kapitel').count(),n,id);
    assert.equal(await p.locator('.nav-sub a').count(),6);
    assert.equal(await p.locator('.kapitel-uebersicht, .kapitel-karte').count(),0,'Duplicate chapter overview must be absent');
    await p.locator('#einstieg-3 > summary').click();
    assert.equal(await p.locator('#einstieg-3').evaluate(e=>e.open),false);
    await p.locator('.nav-sub a[href="#einstieg-3"]').click();
    await p.waitForFunction(()=>document.getElementById('einstieg-3').open);
    await p.locator('#einstieg-2 > summary').click();
    assert.equal(await p.locator('#einstieg-2').evaluate(e=>e.open),false);
    await p.locator('.nav-sub a[href="#einstieg-2"]').click();
    await p.waitForFunction(()=>document.getElementById('einstieg-2').open);
    assert.equal(await p.locator('#einstieg table.typen').count(),1);
    for(const key of ['ki_ordnung','gesetze','begriffe'])assert.equal(await p.locator('#einstieg [data-answer="'+key+'"]').count(),1);
  await p.locator('.nav a[href="#lernarten"]').click();
  await p.locator('#lernarten').waitFor({state:'visible'});
  const systemsOverview=p.locator('#lernarten-1, #lernarten-2, #lernarten-3');
  assert.equal(await systemsOverview.count(),3);
  const systemsText=(await systemsOverview.allInnerTexts()).join(' ');
  assert(systemsText.includes('Wissensbasiert · Regeln anwenden'));
  assert(systemsText.includes('Lernend · Muster aus Daten'));
  assert.equal(await systemsOverview.locator('img').getAttribute('alt').then(value=>value.includes('Erfahrungsschatz')),true);
  assert.equal(await systemsOverview.locator('img').getAttribute('src'),'https://inf-schule.de/content/5_ki/1_menueansicht/1_basiswissen_ki/2_lernarten/2_erkundung_LernendeSysteme/evas.png');
  assert.equal(await systemsOverview.locator('a[href="https://en.akinator.com/"]').count(),1);
  assert.equal(await systemsOverview.locator('a[href="https://pair-code.github.io/tsne-visual-recommender/"]').count(),1);
  assert.equal(await systemsOverview.locator('iframe').count(),0);
  assert.equal(await systemsOverview.locator('a[href*="inf-schule.de"]').count(),0);
  await p.waitForFunction(()=>document.querySelector('#lernarten .lesson-steps article b')?.textContent==='Überwacht · mit Labels');
  const learningCards=p.locator('#lernarten .lesson-steps article');
  assert.equal(await learningCards.count(),3);
  assert((await learningCards.nth(0).textContent()).includes('Überwacht · mit Labels'));
  assert.equal(await learningCards.nth(0).locator('a[href="https://inf-schule.de/kids/computerinalltag/lernende-systeme/schritt2"]').count(),1);
  assert.equal(await learningCards.nth(0).locator('a[href="https://quickdraw.withgoogle.com/"]').count(),1);
  assert((await learningCards.nth(0).textContent()).includes('öffentlichen Datensatz'));
  assert((await learningCards.nth(1).textContent()).includes('Unüberwacht · ohne Labels'));
  assert.equal(await learningCards.nth(1).locator('a[href="https://www.naftaliharris.com/blog/visualizing-k-means-clustering/"]').count(),1);
  assert((await learningCards.nth(2).textContent()).includes('Verstärkend · mit Rückmeldung'));
  assert.equal(await learningCards.nth(2).locator('a[href="https://inf-schule.de/ki/menueansicht/ki_erkunden/nim-spiel/lernstrecke"]').count(),1);
  assert.equal(await p.locator('#nim-example').count(),0);assert.equal(await p.locator('#lernarten h2').filter({hasText:'Verstärkendes Lernen erkunden'}).count(),0);
  assert.equal(await p.locator('#lernarten [data-answer="nim"]').count(),0);
  const groupMemory=p.locator('#lernarten details').filter({has:p.locator('[data-answer="memory"]')});
  const memoryIntro=p.locator('#lernarten-4 .group-memory-instructions');
  assert((await memoryIntro.innerText()).includes('In Fünfergruppen'));
  assert((await p.locator('#lernarten-7 .memory-round').innerText()).includes('+1 Punkt'));
  for(const [n,key] of [[5,'memory-supervised'],[6,'memory-unsupervised'],[7,'memory-reinforcement']])assert.equal(await p.locator('#lernarten-'+n+' [data-answer="'+key+'"]').count(),1);
  const groupMemoryNote=await groupMemory.locator('.detail-body > p.small').innerText();
  assert(!groupMemoryNote.includes('Arbeitsblatt'));assert(groupMemoryNote.includes('NIM ist das separate Beispiel'));
  const knowledgeCheck=p.locator('#lernarten details').filter({has:p.locator('#memory-board')});
  assert((await knowledgeCheck.locator('summary').innerText()).includes('Wissenssicherung'));
  await knowledgeCheck.locator('summary').click();assert.equal(await p.locator('.memory-card').count(),6);
  assert.equal(await p.locator('.memory-reward-guide').count(),0);
  assert.equal(await p.locator('#memory-status').innerText(),'Drehen Sie zwei Karten um.');
  const memoryCards=p.locator('#memory-board .memory-card');await memoryCards.nth(0).click();await memoryCards.nth(1).click();
  await p.waitForFunction(()=>{const text=document.querySelector('#memory-status').textContent;return text.includes('von 3 Paaren gefunden')||text.includes('Dieses Paar passt noch nicht zusammen');});
  await p.locator('#memory-reset').click();assert.equal(await p.locator('#memory-status').innerText(),'Drehen Sie zwei Karten um.');
  const memoryObservations=p.locator('#lernarten [data-answer^="memory-"]');
  assert.equal(await memoryObservations.count(),3);
  assert((await p.locator('#lernarten label.field.answer').filter({has:p.locator('[data-answer="memory"]')}).locator('span').textContent()).includes('Was fällt auf'));
  for(let i=0;i<3;i++)await memoryObservations.nth(i).fill('Beobachtung '+(i+1));
  await p.locator('#lernarten [data-answer="memory"]').fill('Labels, Ähnlichkeit und Rückmeldungen sind unterschiedliche Lernsignale.');
  await p.locator('.nav a[href="#perzeptron"]').click();
  await p.locator('#perzeptron [data-answer="hand_and_w1"]').fill('0.5');await p.locator('.nav a[href="#netze"]').click();await p.locator('#netze [data-answer="hand_xor_max"]').selectOption('3');
  await p.locator('.nav a[href="#sprache"]').click();
  await p.locator('#sprache [data-answer="pap_text_a"]').fill('Am Samstag gehe ich Brot');await p.locator('#sprache [data-answer="pst_1_plausibel"]').selectOption('ja');
  await p.locator('.nav a[href="#gesellschaft"]').click();
  await p.locator('#gesellschaft [data-answer="wmd_bild_u"]').selectOption('nein');await p.locator('#gesellschaft [data-answer="loop_text"]').fill('Kredit abgelehnt');
  await p.locator('.nav a[href="#netze"]').click();
  await p.locator('#netze [data-answer="zif_16"]').fill('95');await p.locator('#netze [data-answer="zif_brauchbar"]').selectOption('8');
  await p.locator('.sidebar-bottom a[href="#journal"]').click();
  await p.locator('[data-journal="names"]').fill('Ada & Alan <script>alert(1)</script>');
  await p.locator('[data-journal="class"]').fill('4f · Obst');
  await p.locator('[data-journal="purpose"]').fill('Äpfel und Birnen unterscheiden.');
  await p.reload();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.waitForFunction(()=>document.querySelector('[data-journal="names"]').value.includes('Ada'));
  await p.screenshot({path:'/tmp/ki-portal-journal.png',fullPage:true});
  await p.locator('a[href="#sicherung"]').first().click();
  assert.equal(await p.locator('#sicherung.project-transfer').count(),1);
  assert.equal(await p.locator('.project-transfer-primary #download-backup').count(),1);
  assert.equal(await p.locator('#restore-package').count(),1);
  assert(await p.locator('#download-backup').getAttribute('class').then(value=>value.includes('primary')));
  assert.equal(await p.locator('.project-submission-action #download-submission').count(),1);
  assert.equal(await p.locator('#download-backup').innerText(),'Notizen & Projekt herunterladen ↓');
  assert.equal(await p.locator('label[for="restore-package"]').innerText(),'Notizen & Projekt wiederherstellen ↑');
  await p.locator('#attachments').setInputFiles([{name:'fotos.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"test"}')},{name:'äpfel.png',mimeType:'image/png',buffer:Buffer.from([137,80,78,71,13,10,26,10])}]);
  await p.waitForFunction(()=>document.querySelectorAll('#attachment-list li').length===2);
  let downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();const zip=await downloaded;assert.match(zip.suggestedFilename(),/^KI-Projektstand-/);await zip.saveAs('/tmp/ki-portal-backup.zip');
  await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('[data-journal="names"]').fill('Changed');await p.locator('a[href="#sicherung"]').first().click();
  await p.locator('#restore-package').setInputFiles('/tmp/ki-portal-backup.zip');await p.waitForFunction(()=>document.querySelector('#download-status').textContent.includes('Projektstand wiederhergestellt'));
  await p.locator('.sidebar-bottom a[href="#journal"]').click();assert((await p.locator('[data-journal="names"]').inputValue()).includes('Ada'));
  await p.locator('.nav a[href="#perzeptron"]').click();
  assert.equal(await p.locator('#perzeptron [data-answer="hand_and_w1"]').inputValue(),'0.5');await p.locator('.nav a[href="#netze"]').click();assert.equal(await p.locator('#netze [data-answer="hand_xor_max"]').inputValue(),'3');
  await p.locator('.nav a[href="#sprache"]').click();
  assert.equal(await p.locator('#sprache [data-answer="pap_text_a"]').inputValue(),'Am Samstag gehe ich Brot');assert.equal(await p.locator('#sprache [data-answer="pst_1_plausibel"]').inputValue(),'ja');
  await p.locator('.nav a[href="#gesellschaft"]').click();
  assert.equal(await p.locator('#gesellschaft [data-answer="wmd_bild_u"]').inputValue(),'nein');assert.equal(await p.locator('#gesellschaft [data-answer="loop_text"]').inputValue(),'Kredit abgelehnt');
  await p.locator('.nav a[href="#netze"]').click();
  assert.equal(await p.locator('#netze [data-answer="zif_16"]').inputValue(),'95');assert.equal(await p.locator('#netze [data-answer="zif_brauchbar"]').inputValue(),'8');
  await p.locator('.nav a[href="#lernarten"]').click();
  assert.equal(await p.locator('#lernarten [data-answer="memory-supervised"]').inputValue(),'Beobachtung 1');
  assert.equal(await p.locator('#lernarten [data-answer="memory-unsupervised"]').inputValue(),'Beobachtung 2');
  assert.equal(await p.locator('#lernarten [data-answer="memory-reinforcement"]').inputValue(),'Beobachtung 3');
  assert((await p.locator('#lernarten [data-answer="memory"]').inputValue()).includes('unterschiedliche Lernsignale'));
  await p.locator('.nav a[href="#sprache"]').click();
  const papagei=p.locator('#sprache .external-map iframe');
  assert.equal(await papagei.count(),1);assert.equal(await papagei.getAttribute('src'),'https://inf-schule.de/ki/menueansicht/ki_erkunden/papagei/lernstrecke');
  assert.equal(await papagei.getAttribute('title'),'Papagei-Lernstrecke von inf-schule.de');
  assert.equal(await p.locator('#sprache #language-corpus').count(),0);
  assert.equal(await p.locator('#sprache #papagei-placeholder').count(),0);
    const turing=p.locator('#sprache .turing-activity a');
    assert.equal(await turing.getAttribute('href'),'https://humanornot.so/start-search');assert.equal(await turing.getAttribute('target'),'_blank');
    assert((await p.locator('#sprache .turing-activity').innerText()).includes('Keine persönlichen Angaben teilen'));
  assert.equal(await p.locator('#sprache #language-corpus').count(),0);
  await p.setViewportSize({width:390,height:844});await p.locator('.nav a[href="#start"]').click();await p.locator('#start').waitFor({state:'visible'});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const mobileCard=await p.locator('.course-card').first().boundingBox();assert(mobileCard&&mobileCard.width>=120,'Mobile overview card collapsed');await p.screenshot({path:'/tmp/ki-portal-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS portal navigation, persistence, attachments, ZIP download/import, Papagei learning path, mobile and page errors');
  await p.setViewportSize({width:1440,height:1000});await p.locator('.nav a[href="#perzeptron"]').click();await p.locator('[data-lesson="03"] summary').click();await p.screenshot({path:'/tmp/ki-lesson-plan.png',fullPage:true});
  if(process.env.CHECK_NOTEBOOK){
   // The notebook is now a modal editor. Return to the lesson before using
   // course navigation/backups. The live iframe continues running when closed.
   const dismissNotebook=async()=>{
     const close=p.locator('#project-lab[open] .lab-close-toggle');
     if(await close.count()){
       await close.click();
       await p.waitForFunction(()=>!document.querySelector('#project-lab')?.open);
     }
   };
   await p.setViewportSize({width:1440,height:1000});await dismissNotebook();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();
   await p.locator('#project-lab-loading').waitFor({state:'visible'});
   assert.equal(await p.locator('#project-lab-loading').getAttribute('data-state'),'loading','Spinner must cover notebook during initialization');
   assert.equal(await p.locator('#project-frame').getAttribute('inert'),'','Notebook stays inert until initialization completes');
   await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000}).catch(async e=>{console.log('FRAME',await p.frameLocator('#project-frame').locator('body').innerText());console.log('ERRORS',errors);throw e;});
   assert.equal(await p.locator('#project-lab-loading').isVisible(),false,'Spinner must disappear after all startup cells');
   assert.equal(await p.locator('#project-frame').getAttribute('inert'),null,'Ready notebook must accept input');
   const f=p.frameLocator('#project-frame');assert.equal(await f.locator('.jp-SideBar:visible').count(),0);assert.equal(await f.locator('#jp-top-panel:visible').count(),0);assert.equal(await f.locator('#jp-left-stack:visible').count(),0);
   assert(await f.locator('.jp-NotebookPanel').evaluate(e=>{const r=e.getBoundingClientRect();return r.left===0&&r.top===0&&Math.abs(r.width-innerWidth)<2;}));
   await p.screenshot({path:'/tmp/ki-portal-embedded.png',fullPage:true});
   await dismissNotebook();await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();const file=await downloaded;await file.saveAs('/tmp/ki-portal-notebook.zip');
   assert.equal(await p.locator('iframe[src*="lab/index"]').count(),1);
   console.log('PASS independent project initializes on demand, hides file navigation and exports real notebook');
  await p.reload();await dismissNotebook();await p.locator('a[href="#sicherung"]').first().click();await p.locator('#restore-package').setInputFiles('/tmp/ki-portal-notebook.zip');await p.waitForFunction(()=>document.querySelector('#download-status').textContent.includes('Projektstand wiederhergestellt'));
   await dismissNotebook();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.restored==='yes',null,{timeout:180000}).catch(async e=>{console.log('RESTORE STATUS',await p.locator('#project-lab-status').innerText());console.log('RESTORE FRAME',await p.frameLocator('#project-frame').locator('body').innerText());throw e;});
   assert.equal(await p.frameLocator('#project-frame').locator('.jp-CodeCell').nth(3).locator('.jp-InputPrompt').innerText(),'[ ]:');
   console.log('PASS imported notebook restored inside iframe without automatic training or test');
   if(process.env.CHECK_TRAINING){
    const cells=p.frameLocator('#project-frame').locator('.jp-NotebookPanel:not(.lm-mod-hidden) .jp-CodeCell');
    assert.equal(await cells.nth(3).locator('.jp-InputPrompt').innerText(),'[ ]:');
    for(let i=0;i<=5;i++){
     const editor=cells.nth(i).locator('.cm-content');await editor.click();
     if(i===5)await editor.fill("AUSGEWAEHLT = 'B'\nBEGRUENDUNG = 'Wir wählen B anhand der Validierung; bei Gleichstand bevorzugen wir die vielfältigere Trainingsauswahl.'\nTEST_FREIGEBEN = True\ntest = foto.projekt_test(experiment, AUSGEWAEHLT, BEGRUENDUNG, TEST_FREIGEBEN)");
     await p.keyboard.press('Shift+Enter');
     await p.waitForFunction(i=>{const text=document.querySelector('#project-frame').contentDocument.querySelectorAll('.jp-CodeCell')[i].querySelector('.jp-InputPrompt').textContent;return /\[\d+\]/.test(text);},i,{timeout:180000});
     assert.equal(await cells.nth(i).locator('.jp-OutputArea-error').count(),0,await cells.nth(i).innerText());
    }
    await dismissNotebook();await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded.catch(async e=>{console.log('EXPORT STATUS',await p.locator('#download-status').innerText());console.log('CELLS',await cells.allInnerTexts());throw e;})).saveAs('/tmp/ki-portal-trained.zip');
    console.log('PASS actual training, manual final test and result package');
    const kernelBefore=await p.locator('#project-frame').getAttribute('data-kernel-id');await dismissNotebook();await p.locator('.nav a[href="#perzeptron"]').click();await p.locator('[data-lab="perzeptron_und_neuronale_netze.ipynb"]').first().click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/perzeptron_und_neuronale_netze.ipynb',null,{timeout:180000});
    assert.notEqual(await p.locator('#project-frame').getAttribute('data-kernel-id'),kernelBefore);
    assert.equal(await p.locator('iframe[src*="lab/index"]').count(),1);
    assert.equal(await p.frameLocator('#project-frame').locator('.jp-NotebookPanel').count(),1);
    assert((await p.frameLocator('#project-frame').locator('body').innerText()).includes('Gewichte'));
     assert.equal(await p.locator('#project-lab-loading').isVisible(),false,'Spinner must also disappear after neuron startup');
     const liveTable=p.frameLocator('#project-frame').locator('.widget-html table').first();
     await liveTable.waitFor({state:'visible'});
     assert.equal(await liveTable.locator('tbody tr').count(),8,'Expected eight swim situations');
     // The interactive figure must match the swimming example on the lesson
     // page, and change when one of its three scenario inputs changes.
     const neuronFigure=p.frameLocator('#project-frame').locator('.widget-html img[alt^="Schwimmbad-Neuron"]').first();
     await neuronFigure.waitFor({state:'visible'});
     const originalNeuron=await neuronFigure.getAttribute('src');
     assert(originalNeuron.startsWith('data:image/svg+xml;base64,'));
     const originalSvg=Buffer.from(originalNeuron.split(',')[1],'base64').toString('utf8');
     assert(originalSvg.includes('Eingaben')&&originalSvg.includes('Gewichte')&&originalSvg.includes('Neuron')&&originalSvg.includes('Ausgabe'));
     assert(originalSvg.includes('= +0')&&originalSvg.includes('>Ja</text>'));
     const checks=p.frameLocator('#project-frame').locator('.jp-CodeCell').nth(1).locator('.widget-checkbox input[type="checkbox"]');
     assert.equal(await checks.count(),3,'Expected all three changeable situation inputs');
     await checks.nth(2).uncheck();
     await p.waitForFunction(before=>{
       const image=document.querySelector('#project-frame')?.contentDocument?.querySelector('.widget-html img[alt^="Schwimmbad-Neuron"]');
       return image&&image.getAttribute('src')!==before;
     },originalNeuron,{timeout:20000});
     const updatedSvg=Buffer.from((await neuronFigure.getAttribute('src')).split(',')[1],'base64').toString('utf8');
     assert(updatedSvg.includes('= +1')&&updatedSvg.includes('>Ja</text>'),'Changing an input must update the weighted sum and output');
     assert(!/FloatSlider\(value=|HTML\(value=/.test(await p.frameLocator('#project-frame').locator('.jp-CodeCell').nth(1).locator('.jp-OutputArea').innerText()),'Notebook must show widgets without echoing their Python repr');
     await liveTable.scrollIntoViewIfNeeded();
     await p.screenshot({path:'/tmp/ki-notebook-interactive-table.png',fullPage:true});
     const lessonCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    assert(/\[\d+\]/.test(await lessonCells.nth(1).locator('.jp-InputPrompt').innerText()));
    // DL3 retains four visualized AND/OR cases but must not show XOR.
    const smallNeuron='img[alt^="Neuron: Eingaben"]';
    const gateCell=lessonCells.nth(2);
    const gateCards=gateCell.locator(smallNeuron);
    await gateCards.first().waitFor({state:'visible'});
    assert.equal(await gateCards.count(),4,'AND must show one neuron per input pair');
    assert.equal(await gateCell.locator('.widget-dropdown option:text-is("XOR")').count(),0,'XOR belongs in DL4');
    const andSource=await gateCards.last().getAttribute('src');
    assert(andSource.startsWith('data:image/svg+xml;base64,'));
    assert(Buffer.from(andSource.split(',')[1],'base64').toString('utf8').includes('Ziel 1 ✓'));
    await gateCell.locator('.widget-dropdown select').selectOption('OR');
    await p.waitForFunction(()=>{
      const html=document.querySelector('#project-frame')?.contentDocument
        ?.querySelectorAll('.jp-CodeCell')[2]?.innerText||'';
      return html.includes('Gatter: OR');
    },null,{timeout:20000});
    assert.equal(await gateCards.count(),4,'Changing the gate must preserve all four neuron cases');
    assert((await gateCell.innerText()).includes('2/4 richtig'),'OR must initially be 2/4 with AND weights');
    const learnCell=lessonCells.nth(3);
    await learnCell.locator(smallNeuron).first().waitFor({state:'visible'});
    assert.equal(await learnCell.locator(smallNeuron).count(),1,'Learning should show its starting neuron');
    await learnCell.getByRole('button',{name:'Ganze Runde ▶▶'}).click();
    await p.waitForFunction(()=>{
      const cell=document.querySelector('#project-frame')?.contentDocument?.querySelectorAll('.jp-CodeCell')[3];
      return cell?.querySelectorAll('img[alt^="Neuron: Eingaben"]').length===2;
    },null,{timeout:30000});
    assert((await learnCell.innerText()).includes('Vorher · Entscheidung'));
    assert((await learnCell.innerText()).includes('Nachher · neue Gewichte'));
    const prior=await lessonCells.nth(1).locator('.jp-InputPrompt').innerText();await lessonCells.nth(1).locator('.cm-content').click();await p.keyboard.press('Shift+Enter');
    await p.waitForFunction(prior=>{const text=document.querySelector('#project-frame').contentDocument.querySelectorAll('.jp-CodeCell')[1].querySelector('.jp-InputPrompt').textContent;return /\[\d+\]/.test(text)&&text!==prior;},prior);
    // DL4 now starts with its own single-neuron XOR experiment after the theory.
    await dismissNotebook();await p.locator('.nav a[href="#netze"]').click();
    assert.equal(await p.locator('#netze-1 [data-lab="xor_einzelne_neuronen.ipynb"]').count(),1);
    assert.equal(await p.locator('#netze-3 [data-lab="mehrschichtige_netze.ipynb"]').count(),1);
    assert.equal(await p.locator('#netze-5 [data-lab="ziffernerkennung.ipynb"]').count(),1);
    await dismissNotebook();await p.locator('#netze-1 [data-lab="xor_einzelne_neuronen.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/xor_einzelne_neuronen.ipynb',null,{timeout:180000});
    const xorCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    const xorCell=xorCells.nth(1);
    await xorCell.locator(smallNeuron).first().waitFor({state:'visible'});
    assert.equal(await xorCell.locator(smallNeuron).count(),4,'DL4 starts with four XOR decisions');
    assert((await xorCell.innerText()).includes('Gatter: XOR'),'DL4 must expose the new XOR challenge');
    assert.equal(await xorCell.locator('.widget-dropdown option:text-is("XOR")').count(),1,'XOR should be selectable in DL4');
    assert((await xorCell.locator('.jp-OutputArea').innerText()).includes('Ziel'));
    // Network experiment is another notebook, not the XOR single-neuron cell.
    await dismissNotebook();await p.locator('#netze-3 [data-lab="mehrschichtige_netze.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/mehrschichtige_netze.ipynb',null,{timeout:180000});
    const multiCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    await multiCells.nth(2).locator('.jp-OutputArea').waitFor({state:'visible',timeout:60000});
    assert.equal(await multiCells.nth(1).locator('img[alt^="Neuron: Eingaben"]').count(),0,'XOR single-neuron experiment must be separate from network notebook');

    // Optional handwriting recognition is now its own notebook. Training must
    // only start from explicit manual buttons, not while opening the notebook.
    await dismissNotebook();await p.locator('#netze-5 [data-lab="ziffernerkennung.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/ziffernerkennung.ipynb',null,{timeout:180000});
    const digitFrame=p.frameLocator('#project-frame');
    await digitFrame.getByRole('button',{name:/Modell berechnen/}).first().waitFor({state:'visible',timeout:60000});
    await digitFrame.getByRole('button',{name:/Vorhersage berechnen/}).first().waitFor({state:'visible',timeout:60000});
    assert.equal(await digitFrame.locator('.jp-OutputArea-error').count(),0,'Optional digit notebook must start with controls, not model errors');

    await dismissNotebook();await p.locator('.nav a[href="#projekt"]').click();await p.locator('#projekt .project-start-guide a[href="#versuch"]').click();await p.locator('#projekt-4 [data-lab="ki_lernlabor.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/ki_lernlabor.ipynb',null,{timeout:180000});
    assert(/\[\d+\]/.test(await lessonCells.nth(2).locator('.jp-InputPrompt').innerText()));

    await dismissNotebook();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/ki_tandemprojekt.ipynb',null,{timeout:180000});assert.equal(await p.locator('#project-frame').count(),1);
    assert((await cells.nth(5).innerText()).includes('Abschlusstest'));
    assert.notEqual(await p.locator('#project-frame').getAttribute('data-kernel-id'),kernelBefore);
    await dismissNotebook();await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded).saveAs('/tmp/ki-portal-after-switch.zip');
    const archive=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(__dirname,'../projekt/archive.js')).toString('base64'));
    const before=await archive.readZip(new Blob([fs.readFileSync('/tmp/ki-portal-trained.zip')]));const after=await archive.readZip(new Blob([fs.readFileSync('/tmp/ki-portal-after-switch.zip')]));
    assert.deepEqual(JSON.parse(await before.get('Versuchsprotokoll.json').text()),JSON.parse(await after.get('Versuchsprotokoll.json').text()));
    console.log('PASS one notebook at a time, fresh kernels, interactive exercises and preserved project outputs/protocol');
    // A twice-imported preparation and extra autostart tags must never execute.
    const imported=JSON.parse(await before.get('versuch.ipynb').text());
    imported.cells=imported.cells.filter(c=>!c.metadata?.['ki-journal-export']);
    imported.cells.find(c=>c.cell_type==='code').source=["raise RuntimeError('Imported preparation ran automatically')"];
    imported.cells.push({id:'manual-only-check',cell_type:'code',metadata:{tags:['ki-autostart']},source:["raise RuntimeError('Imported training ran automatically')"],outputs:[],execution_count:null});
    for(let attempt=0;attempt<2;attempt++)await p.evaluate(nb=>new Promise((resolve,reject)=>{
     const f=document.querySelector('#project-frame'),id=crypto.randomUUID();
     const timer=setTimeout(()=>{window.removeEventListener('message',receive);reject(Error('Restore timeout'));},120000);
     function receive(e){if(e.source!==f.contentWindow||e.data?.id!==id)return;clearTimeout(timer);window.removeEventListener('message',receive);e.data.type==='error'?reject(Error(e.data.error)):resolve();}
     window.addEventListener('message',receive);f.contentWindow.postMessage({channel:'ki-portal-v1',type:'restore',id,notebook:nb},location.origin);
    }),imported);
    assert.equal(await p.frameLocator('#project-frame').locator('.jp-OutputArea-error').count(),0);
    await dismissNotebook();await p.locator('.sidebar-bottom a[href="#journal"]').click();
    // Shift+Enter appends a blank cell at the end; keep the executed cell's index.
    const importedCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    const last=importedCells.nth(await importedCells.count()-1);
    assert.equal(await last.locator('.jp-InputPrompt').innerText(),'[ ]:');
    // A slow runner can drop the typed text or the key press while the restored notebook re-renders: retry the input, never the assertion.
    let confirmed=false;
    for(let attempt=0;attempt<3&&!confirmed;attempt++){
     const editor=last.locator('.cm-content');
     await editor.fill("assert 'experiment' not in globals() and 'foto' not in globals()\nprint('Fresh kernel confirmed')");
     await p.keyboard.press('Shift+Enter');
     confirmed=await last.locator('.jp-OutputArea-output').filter({hasText:'Fresh kernel confirmed'}).waitFor({timeout:90000}).then(()=>true,()=>false);
    }
    assert(confirmed,'Fresh kernel not confirmed: '+await last.innerText());
    // Reload must also refuse an edited preparation, even with an original filename.
    await dismissNotebook();await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded).saveAs('/tmp/ki-portal-import-check.zip');
    await p.reload();await dismissNotebook();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000});
    assert.equal(await p.frameLocator('#project-frame').locator('.jp-OutputArea-error').count(),0);
    assert((await p.frameLocator('#project-frame').locator('.ki-autostart-status').innerText()).includes('Gesicherter Stand'));
    console.log('PASS repeated import clears live Python; neither imported setup nor extra tags execute, including after reload');
   }

  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
