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
  assert.equal(await p.locator('.course-card').count(),7);assert.equal(await p.locator('.nav a').count(),9);
  assert.equal(await p.locator('a[href*="/lab/"]').count(),0);
  await p.screenshot({path:'/tmp/ki-portal-home.png',fullPage:true});
  assert.equal(await p.locator('.lesson-plan').count(),10);
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
    assert.equal(await p.locator('#einstieg .concept').count(),0);
    assert.equal(await p.locator('#einstieg .external-map iframe').getAttribute('src'),'https://inf-schule.de/ki/menueansicht');
  await p.locator('.nav a[href="#lernarten"]').click();
  await p.locator('#lernarten').waitFor({state:'visible'});
  const systemsOverview=p.locator('#lernarten .learning-system-overview');
  assert.equal(await systemsOverview.count(),1);
  assert((await systemsOverview.innerText()).includes('Wissensbasiert · Regeln anwenden'));
  assert((await systemsOverview.innerText()).includes('Lernend · Muster aus Daten'));
  assert.equal(await systemsOverview.locator('img').getAttribute('alt').then(value=>value.includes('Erfahrungsschatz')),true);
  assert.equal(await systemsOverview.locator('img').getAttribute('src'),'https://inf-schule.de/content/5_ki/1_menueansicht/1_basiswissen_ki/2_lernarten/2_erkundung_LernendeSysteme/evas.png');
  assert.equal(await systemsOverview.locator('a[href="https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/erkundung_WissensbasierteSysteme"]').count(),1);
  assert.equal(await systemsOverview.locator('a[href="https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/erkundung_LernendeSysteme"]').count(),1);
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
  assert.equal(await learningCards.nth(2).locator('a[href="#nim-example"]').count(),1);
  assert.equal(await p.locator('#nim-example').count(),1);
  const groupMemory=p.locator('#lernarten details').filter({has:p.locator('[data-answer="memory"]')});
  assert((await groupMemory.locator('.group-memory-instructions').innerText()).includes('In Fünfergruppen'));
  assert((await groupMemory.locator('.group-memory-instructions').innerText()).includes('+1 Punkt'));
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
  await p.locator('[data-answer="nim"]').fill('Mehr Training hilft gegen den Zufallsgegner.');
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
  await p.locator('.nav a[href="#lernarten"]').click();assert((await p.locator('[data-answer="nim"]').inputValue()).includes('Zufallsgegner'));
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
  await p.setViewportSize({width:390,height:844});await p.locator('.nav a[href="#start"]').click();await p.locator('#start').waitFor({state:'visible'});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.screenshot({path:'/tmp/ki-portal-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS portal navigation, persistence, attachments, ZIP download/import, Papagei learning path, mobile and page errors');
  await p.setViewportSize({width:1440,height:1000});await p.locator('.nav a[href="#perzeptron"]').click();await p.locator('[data-lesson="03"] summary').click();await p.screenshot({path:'/tmp/ki-lesson-plan.png',fullPage:true});
  if(process.env.CHECK_NOTEBOOK){
   await p.setViewportSize({width:1440,height:1000});await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();
   await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000}).catch(async e=>{console.log('FRAME',await p.frameLocator('#project-frame').locator('body').innerText());console.log('ERRORS',errors);throw e;});
   const f=p.frameLocator('#project-frame');assert.equal(await f.locator('.jp-SideBar:visible').count(),0);assert.equal(await f.locator('#jp-top-panel:visible').count(),0);assert.equal(await f.locator('#jp-left-stack:visible').count(),0);
   assert(await f.locator('.jp-NotebookPanel').evaluate(e=>{const r=e.getBoundingClientRect();return r.left===0&&r.top===0&&Math.abs(r.width-innerWidth)<2;}));
   await p.screenshot({path:'/tmp/ki-portal-embedded.png',fullPage:true});
   await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();const file=await downloaded;await file.saveAs('/tmp/ki-portal-notebook.zip');
   assert.equal(await p.locator('iframe[src*="lab/index"]').count(),1);
   console.log('PASS independent project initializes on demand, hides file navigation and exports real notebook');
  await p.reload();await p.locator('a[href="#sicherung"]').first().click();await p.locator('#restore-package').setInputFiles('/tmp/ki-portal-notebook.zip');await p.waitForFunction(()=>document.querySelector('#download-status').textContent.includes('Projektstand wiederhergestellt'));
   await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.restored==='yes',null,{timeout:180000}).catch(async e=>{console.log('RESTORE STATUS',await p.locator('#project-lab-status').innerText());console.log('RESTORE FRAME',await p.frameLocator('#project-frame').locator('body').innerText());throw e;});
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
    await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded.catch(async e=>{console.log('EXPORT STATUS',await p.locator('#download-status').innerText());console.log('CELLS',await cells.allInnerTexts());throw e;})).saveAs('/tmp/ki-portal-trained.zip');
    console.log('PASS actual training, manual final test and result package');
    const kernelBefore=await p.locator('#project-frame').getAttribute('data-kernel-id');await p.locator('.nav a[href="#perzeptron"]').click();await p.locator('[data-lab="perzeptron_und_neuronale_netze.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/perzeptron_und_neuronale_netze.ipynb',null,{timeout:180000});
    assert.notEqual(await p.locator('#project-frame').getAttribute('data-kernel-id'),kernelBefore);
    assert.equal(await p.locator('iframe[src*="lab/index"]').count(),1);
    assert.equal(await p.frameLocator('#project-frame').locator('.jp-NotebookPanel').count(),1);
    assert((await p.frameLocator('#project-frame').locator('body').innerText()).includes('Gewichte'));
    await p.frameLocator('#project-frame').locator('.jp-MarkdownCell img').first().waitFor();
    assert(await p.frameLocator('#project-frame').locator('.jp-MarkdownCell img').first().evaluate(img=>img.complete&&img.naturalWidth>100));
    await p.frameLocator('#project-frame').locator('.jp-MarkdownCell img').first().scrollIntoViewIfNeeded();
    await p.screenshot({path:'/tmp/ki-notebook-graphic.png',fullPage:true});
    const lessonCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    assert(/\[\d+\]/.test(await lessonCells.nth(1).locator('.jp-InputPrompt').innerText()));
    const prior=await lessonCells.nth(1).locator('.jp-InputPrompt').innerText();await lessonCells.nth(1).locator('.cm-content').click();await p.keyboard.press('Shift+Enter');
    await p.waitForFunction(prior=>{const text=document.querySelector('#project-frame').contentDocument.querySelectorAll('.jp-CodeCell')[1].querySelector('.jp-InputPrompt').textContent;return /\[\d+\]/.test(text)&&text!==prior;},prior);
    await p.locator('.nav a[href="#projekt"]').click();await p.locator('[data-lab="ki_lernlabor.ipynb"]').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/ki_lernlabor.ipynb',null,{timeout:180000});
    assert(/\[\d+\]/.test(await lessonCells.nth(2).locator('.jp-InputPrompt').innerText()));

    await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes'&&document.querySelector('#project-frame').dataset.path==='portal/ki_tandemprojekt.ipynb',null,{timeout:180000});assert.equal(await p.locator('#project-frame').count(),1);
    assert((await cells.nth(5).innerText()).includes('Abschlusstest'));
    assert.notEqual(await p.locator('#project-frame').getAttribute('data-kernel-id'),kernelBefore);
    await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded).saveAs('/tmp/ki-portal-after-switch.zip');
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
    await p.locator('.sidebar-bottom a[href="#journal"]').click();
    // Shift+Enter appends a blank cell at the end; keep the executed cell's index.
    const importedCells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
    const last=importedCells.nth(await importedCells.count()-1);
    assert.equal(await last.locator('.jp-InputPrompt').innerText(),'[ ]:');
    await last.locator('.cm-content').fill("assert 'experiment' not in globals() and 'foto' not in globals()\nprint('Fresh kernel confirmed')");
    await p.keyboard.press('Shift+Enter');
    await last.locator('.jp-OutputArea-output').filter({hasText:'Fresh kernel confirmed'}).waitFor({timeout:180000});
    // Reload must also refuse an edited preparation, even with an original filename.
    await p.locator('a[href="#sicherung"]').first().click();downloaded=p.waitForEvent('download');await p.locator('#download-backup').click();await(await downloaded).saveAs('/tmp/ki-portal-import-check.zip');
    await p.reload();await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();
    await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000});
    assert.equal(await p.frameLocator('#project-frame').locator('.jp-OutputArea-error').count(),0);
    assert((await p.frameLocator('#project-frame').locator('.ki-autostart-status').innerText()).includes('Geänderte Vorbereitung'));
    console.log('PASS repeated import clears live Python; neither imported setup nor extra tags execute, including after reload');
   }

  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
