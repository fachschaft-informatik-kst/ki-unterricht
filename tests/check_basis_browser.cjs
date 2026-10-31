/* Real-browser smoke test for the independent Kurzgymi basic course. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs'),os=require('node:os');
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
    assert.equal(await page.locator('a.choice').count(),4,'Two BOK courses and two IRN course slots must appear');
    assert.equal(await page.locator('a.choice[href="bok/1-klasse/"]').count(),1);
    assert.equal(await page.locator('a.choice[href="bok/4-klasse/"]').count(),1);
    assert.equal(await page.locator('a.choice[href="irn/1-klasse/"]').count(),1);
    assert.equal(await page.locator('a.choice[href="irn/4-klasse/"]').count(),1);
    const routed=await browser.newPage();
    await routed.goto('http://127.0.0.1:8770/bok/1-klasse/');
    assert.equal(await routed.title(),'BOK · 1. Klasse · KI entdecken');
    assert.equal(await routed.locator('a[href="../../kurse.html"]').count(),1);
    assert.equal(await routed.locator('img.school-logo').evaluate(img=>img.complete&&img.naturalWidth>0),true);
    await routed.goto('http://127.0.0.1:8770/bok/4-klasse/');
    assert.equal(await routed.title(),'BOK · 4. Klasse · KI vertiefen');
    assert.equal(await routed.locator('a[href="../../kurse.html"]').count(),1);
    await routed.goto('http://127.0.0.1:8770/irn/1-klasse/');
    assert((await routed.locator('main').innerText()).includes('in Vorbereitung'));
    await routed.close();
    // Legacy URL remains available to preserve existing bookmarks and student data.
    await page.goto('http://127.0.0.1:8770/basis/');
    assert.equal(await page.title(),'BOK · 1. Klasse · KI entdecken');
    assert.equal(await page.locator('main > section').count(),13);
    // Shared KST breadcrumb; track switching happens only via the landing page.
    const basicBreadcrumb=(await page.locator('.crumb').innerText()).replace(/\s+/g,' ').trim();
    assert(!await page.locator('a[href="../projekt/"]').count(),'No direct link to 4th-year course');
    assert.equal(await page.locator('a[href="../kurse.html"]').count(),1);
    // Full blue surface, network illustration and the same desktop menu behavior.
    const colors=await page.evaluate(()=>({
      background:getComputedStyle(document.body).backgroundImage,
      artwork:getComputedStyle(document.body,'::before').backgroundImage,
      sidebar:getComputedStyle(document.querySelector('.sidebar')).backgroundImage
    }));
    assert(colors.background.includes('223, 233, 255'), 'First-year background glow must be blue');
    assert(colors.artwork.includes('netz_hintergrund_blau.svg'), 'First-year illustration must be blue');
    assert(colors.sidebar.includes('245, 248, 255'), 'First-year sidebar must be blue-tinted');
    const toggle=page.locator('button.nav-toggle');
    assert.equal(await toggle.count(),1,'Desktop sidebar toggle must match the fourth year');
    await toggle.click();
    assert(await page.locator('body').evaluate(el=>el.classList.contains('nav-collapsed')));
    await toggle.click();
    assert(!await page.locator('body').evaluate(el=>el.classList.contains('nav-collapsed')));
    assert.equal(await page.locator('footer.footer details summary').innerText(),'Quellen & Hinweise für die Lehrperson');
    await page.locator('footer.footer details summary').click();
    assert(await page.locator('footer.footer a[href="materialien.html"]').count());
    assert(await page.locator('footer.footer a[href="unterrichtsplan.html"]').count());
    assert.equal((await page.request.get('http://127.0.0.1:8770/basis/materialien.html')).status(),200);
    await page.locator('.sidebar-bottom a[href="#basis-sicherung"]').click();
    await page.locator('#basis-sicherung').waitFor({state:'visible'});
    assert(await page.locator('#basis-sicherung #basis-backup-controls button').count());
    const advanced=await browser.newPage();
    await advanced.goto('http://127.0.0.1:8770/projekt/');
    // Figure limits come from the same styles as the fourth-year course, not a 100% override.
    const figureSizes=async target=>({
      rules:await target.locator('img[src="grafiken/ki_programmierung.png"]').first().evaluate(el=>getComputedStyle(el).maxWidth),
      neuron:await target.locator('img[src="grafiken/neuron_biologisch.svg"]').first().evaluate(el=>getComputedStyle(el).maxWidth)
    });
    const firstYearSizes=await figureSizes(page),fourthYearSizes=await figureSizes(advanced);
    assert.deepEqual(firstYearSizes,fourthYearSizes,'First-year diagrams must retain fourth-year max widths');
    assert.equal(firstYearSizes.rules,'700px');
    assert.equal(firstYearSizes.neuron,'900px');
    const firstYearTableColor=await page.locator('#basis-ki table.typen thead th').first()
      .evaluate(el=>getComputedStyle(el).backgroundColor);
    assert.equal(firstYearTableColor,'rgb(230, 237, 255)','First-year table headers must be blue');
    const advancedBreadcrumb=(await advanced.locator('.crumb').innerText()).replace(/\s+/g,' ').trim();
    assert.equal(basicBreadcrumb,advancedBreadcrumb,'Both course headers must match exactly');
    assert.equal(await advanced.locator('a[href="../basis/"]').count(),0,'Advanced course must link to landing, not basic class');
    await advanced.close();
    await page.locator('.nav > a[href="#basis-lernziele"]').click();
    await page.locator('#basis-lernziele .card').first().waitFor({state:'visible'});
    assert.equal(await page.locator('#basis-lernziele .card').count(),7);
    // Keep all double-lesson links visible, but expand one chapter list only.
    const activeSubmenus=page.locator('.nav-sub:not([hidden])');
    assert.equal(await page.locator('.nav > a').count(),13);
    assert.equal(await activeSubmenus.count(),0,'Overview must not expand lesson chapters');
    await page.locator('.nav > a[href="#basis-ki"]').click();
    await activeSubmenus.first().waitFor({state:'visible'});
    assert.equal(await activeSubmenus.count(),1);
    assert.equal(await activeSubmenus.locator('a').count(),6,'Only lesson one chapters should expand');
    assert.equal(await page.locator('.nav > a[href="#basis-ki"]').getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('.nav > a[href="#basis-lernen"]').getAttribute('aria-expanded'),'false');
    // Deep link: selecting a chapter opens its parent lesson and the detail.
    await page.locator('.nav-sub:not([hidden]) a[href="#einstieg-3"]').click();
    assert.equal(await activeSubmenus.count(),1);
    assert.equal(await page.locator('#einstieg-3').evaluate(el=>el.open),true);
    await page.locator('.nav > a[href="#basis-ki"]').click();
    const note=page.locator('[data-basis-answer="regeln_oder_daten"]');
    assert.equal(await page.locator('#basis-ki details.kapitel').count(),6,'Retained original introductory chapters');

    // Glossary access mirrors the advanced course on every first-year DL start.
    for(const topic of ['basis-ki','basis-lernen','basis-neuron','basis-netze','basis-daten','basis-plan','basis-training','basis-abschluss','basis-sprache','basis-gesellschaft'])
      assert(await page.locator('#'+topic+' .glossary-related a[href^="#basis-glossar-"]').count(),topic+' glossary links');
    assert.equal(await page.locator('#basis-ki #einstieg-3 .milestone-trigger').count(),9);

    // Both course palettes must distinguish rule-based milestones from data-driven ones.
    const milestoneBadgeColours=await page.locator('#basis-ki #einstieg-3 .section-intro .marke').evaluateAll(nodes=>
      nodes.map(node=>({label:node.textContent.trim(),background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color})));
    assert.deepEqual(milestoneBadgeColours,[
      {label:'Regeln von Menschen',background:'rgb(30, 64, 175)',color:'rgb(255, 255, 255)'},
      {label:'Lernen aus Daten',background:'rgb(154, 52, 18)',color:'rgb(255, 255, 255)'}
    ],'Distinct blue/orange markers with white text in DL1');
    const legendDescription=await page.locator('#basis-ki #einstieg-3 .section-intro').innerText();
    assert(legendDescription.includes('Regeln von Menschen')&&legendDescription.includes('Lernen aus Daten')&&legendDescription.includes('KI-Winter'));

    const firstYearHistory=page.locator('#basis-ki #einstieg-3 [data-milestone-open="turing"]');
    const basisScrollBefore=await page.evaluate(()=>{window.scrollTo({top:340,behavior:'instant'});return window.scrollY});
    assert(basisScrollBefore>80,'Timeline in first-year course is scrollable');
    const basisHashBefore=await page.evaluate(()=>location.hash);
    await firstYearHistory.evaluate(el=>el.click());
    await page.waitForTimeout(80);
    assert.equal(await page.evaluate(()=>window.scrollY),basisScrollBefore,'Opening in first-year course must not jump to top');
    assert.equal(await page.evaluate(()=>location.hash),basisHashBefore,'Opening popup must not change lesson');
    const firstYearHistoryDialog=page.locator('dialog.milestone-dialog');
    assert(await firstYearHistoryDialog.isVisible(),'History modal in basic course');
    assert((await firstYearHistoryDialog.locator('figcaption').innerText()).includes('Alan Turing'));
    assert(await firstYearHistoryDialog.locator('img[alt]').count());
    assert((await firstYearHistoryDialog.locator('.milestone-source').innerText()).includes('Bildquelle'));
    await page.keyboard.press('Escape');
    await firstYearHistoryDialog.waitFor({state:'hidden'});
    // The native <dialog> "close" event fires asynchronously after the
    // dialog disappears. Wait for our focus-return handler, then check scroll.
    await page.waitForFunction(()=>
      document.activeElement===document.querySelector('#basis-ki #einstieg-3 [data-milestone-open="turing"]'),
      null,{timeout:3000});
    assert.equal(await page.evaluate(()=>window.scrollY),basisScrollBefore,'Closing in first-year course must preserve scroll');

    const logo=page.locator('.crumb img.school-logo');
    assert.equal(await logo.count(),1,'KST school logo must be present');
    assert(await logo.evaluate(img=>img.complete&&img.naturalWidth>0),'KST school logo must actually load');
    const palette=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    assert.equal(palette,'#3653a3','First-year theme must be blue, not advanced-course green');
    // Same two DL1 activities in the first-year course; touch/keyboard select persists.
    const basisRules=page.locator('#basis-ki [data-ki-sort-task="regeln"]');
    const basisTerms=page.locator('#basis-ki [data-ki-sort-task="begriffe"]');
    assert.equal(await basisRules.locator('[data-ki-sort-card]').count(),4);
    assert.equal(await basisTerms.locator('[data-ki-sort-card]').count(),5);
    // Exercise the HTML5 drag-and-drop event contract deterministically in Chromium.
    const transfer=await page.evaluateHandle(()=>new DataTransfer());
    await basisRules.locator('[data-ki-sort-card="automat"]').dispatchEvent('dragstart',{dataTransfer:transfer});
    await basisRules.locator('[data-ki-sort-bin="regeln"]').dispatchEvent('dragover',{dataTransfer:transfer});
    await basisRules.locator('[data-ki-sort-bin="regeln"]').dispatchEvent('drop',{dataTransfer:transfer});
    await basisRules.locator('[data-ki-sort-card="automat"]').dispatchEvent('dragend',{dataTransfer:transfer});
    assert.equal(await basisRules.locator('[data-ki-sort-card="automat"] select').inputValue(),'regeln',JSON.stringify(await basisRules.evaluate(el=>({ready:el.classList.contains('ki-sort-ready'),pool:el.querySelector('[data-ki-sort-pool]').children.length,target:el.querySelector('[data-ki-sort-bin="regeln"] [data-ki-sort-target]').children.length}))));
    await basisTerms.locator('[data-ki-sort-card="spam"] select').selectOption('ml');
    assert.equal(await basisTerms.locator('[data-ki-sort-card="spam"] select').inputValue(),'ml');
    await note.fill('Nicht jedes automatische Programm ist KI.');
    await page.reload();
    await page.locator('.nav > a[href="#basis-ki"]').click();
    assert.equal(await page.locator('#basis-ki [data-ki-sort-card="automat"] select').inputValue(),'regeln','Basis drag answer is saved');
    assert.equal(await page.locator('#basis-ki [data-ki-sort-card="spam"] select').inputValue(),'ml','Basis select answer is saved');
    await page.locator('.nav > a[href="#basis-lernen"]').click();
    await page.waitForFunction(()=>document.querySelector('.nav > a[href="#basis-lernen"]')?.getAttribute('aria-expanded')==='true');
    assert.equal(await activeSubmenus.count(),1);
    assert.equal(await activeSubmenus.locator('a').count(),9);
    assert.equal(await activeSubmenus.locator('a[href^="#einstieg-"]').count(),0,'Previous lesson submenu must collapse');
    assert.equal(await page.locator('.nav > a[href="#basis-ki"]').getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('#basis-lernen details.kapitel').count(),9,'Retained original learning-type chapters');
    assert.equal(await page.locator('#memory-board .basis-memory-grid button').count(),6,'Original learning memory must be interactive');
    await page.locator('.nav > a[href="#basis-neuron"]').click();
    await page.locator('#basis-neuron-1').waitFor({state:'visible'});
    assert.equal(await page.locator('#basis-neuron details.kapitel').count(),7,'DL3 must reproduce all seven advanced neuron chapters');
    assert.equal(await page.locator('#basis-neuron img[src="grafiken/neuron_biologisch.svg"]').count(),1);
    assert.equal(await page.locator('#basis-neuron img[src="grafiken/neuron_entscheider.svg"]').count(),1);
    assert((await page.locator('#basis-neuron-4').innerText()).includes('Lernrate'),'DL3 must explain the perceptron learning rule');
    assert.equal(await page.locator('#basis-neuron a[href*="portal/basis_neuron.ipynb"]').count(),1);
    const neuronWeight=page.locator('[data-basis-answer="basis-neuron-sw_gs"]');
    const neuronScore=page.locator('[data-basis-answer="basis-neuron-sw_treffer"]');
    await neuronWeight.fill('2.5');
    await neuronScore.selectOption('7');
    await page.locator('.nav > a[href="#basis-netze"]').click();
    await page.waitForFunction(()=>document.querySelector('.nav > a[href="#basis-netze"]')?.getAttribute('aria-expanded')==='true');
    assert.equal(await activeSubmenus.count(),1,'Navigation should show one expanded lesson submenu');
    assert.equal(await page.locator('#basis-netze details.kapitel').count(),4,'DL4 must reproduce advanced XOR and network training without digit model');
    assert.equal(await page.locator('#basis-netze img[src="grafiken/xor_gerade.svg"]').count(),1);
    assert.equal(await page.locator('#basis-netze img[src="grafiken/merhschichtiges_netzwerk.svg"]').count(),1);
    assert.equal(await page.locator('#basis-netze a[href*="portal/xor_einzelne_neuronen.ipynb"]').count(),1);
    assert.equal(await page.locator('#basis-netze a[href*="portal/basis_netze.ipynb"]').count(),1);
    assert.equal(await page.locator('#basis-netze a[href*="ziffernerkennung.ipynb"]').count(),0,'Digit classifier belongs to DL5 only');
    const xorScore=page.locator('[data-basis-answer="basis-netze-hand_xor_max"]');
    await xorScore.selectOption('3');
    await page.locator('.nav > a[href="#basis-sprache"]').click();
    assert.equal(await page.locator('#basis-sprache details.kapitel').count(),7);
    assert.equal(await page.locator('#basis-sprache #basis-sprache-papagei iframe').count(),1);
    const language=page.locator('[data-basis-language]');
    assert.equal(await language.locator('[data-language-options] button').count(),3);
    assert((await language.locator('[data-language-prompt]').innerText()).includes('Garten'));
    const firstChoices=await language.locator('[data-language-options]').innerText();
    await language.locator('[data-language-context]').selectOption('sport');
    const secondChoices=await language.locator('[data-language-options]').innerText();
    assert.notEqual(firstChoices,secondChoices,'Text suggestions must change with context');
    await language.locator('[data-language-options] button').first().click();
    assert((await language.locator('[data-language-result]').innerText()).includes('Fussball'));
    const languageNote=page.locator('[data-basis-answer="basis-sprache-b"]');
    await languageNote.fill('Kontext beeinflusst Fortsetzungen, Behauptungen müssen geprüft werden.');
    await page.reload();
    await activeSubmenus.first().waitFor({state:'visible'});
    assert.equal(await activeSubmenus.count(),1,'Reload should restore only the current lesson submenu');
    assert.equal(await page.locator('.nav > a[href="#basis-sprache"]').getAttribute('aria-expanded'),'true');
    await page.locator('.nav > a[href="#basis-ki"]').click();
    await page.locator('.nav > a[href="#basis-neuron"]').click();
    assert.equal(await neuronWeight.inputValue(),'2.5','Neuron experiment weight must survive reload');
    assert.equal(await neuronScore.inputValue(),'7','Selected experiment score must survive reload');
    await page.locator('.nav > a[href="#basis-netze"]').click();
    assert.equal(await xorScore.inputValue(),'3','XOR result must survive reload');
    await page.locator('.nav > a[href="#basis-ki"]').click();
    assert.equal(await note.inputValue(),'Nicht jedes automatische Programm ist KI.','Basic-course notes must survive reload');
    await page.locator('.nav > a[href="#basis-sprache"]').click();
    assert.equal(await languageNote.inputValue(),'Kontext beeinflusst Fortsetzungen, Behauptungen müssen geprüft werden.');
    assert(await page.evaluate(()=>Boolean(localStorage.getItem('kst-ki-basis-v1'))));
    assert.equal(await page.evaluate(()=>localStorage.getItem('kst-ki-kursportal-v1')),null,
      'Basic course must not use the advanced course storage');
    // Full first-year ZIP round trip: reflection fields, notebook snapshots and Fotostudio JSON.
    const notebook={nbformat:4,nbformat_minor:5,metadata:{},cells:[{cell_type:'code',metadata:{},source:['print("Mein Versuch")'],execution_count:1,outputs:[{output_type:'stream',name:'stdout',text:['Mein Ergebnis\\n']}]}]};
    await page.evaluate(nb=>localStorage.setItem('kst-ki-basis-notebooks-v1',JSON.stringify({'basis_neuron.ipynb':nb})),notebook);
    await page.reload();
    await page.locator('.nav > a[href="#basis-ki"]').click();
    await note.fill('Gesicherte Reflexion im ZIP.');
    const studio={schema:'fotostudio-v1',pipeline:'mobilenet-v2-050-224-rgb-whitepad-v1',records:[]};
    await page.locator('input[aria-label="Fotostudio-JSON zur ZIP-Sicherung hinzufügen"]').setInputFiles({name:'fotos.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(studio))});
    const downloadPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'Gesamten Kursstand als ZIP sichern'}).click();
    const download=await downloadPromise;
    const archivePath=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'ki-basis-zip-')),'kursstand.zip');
    await download.saveAs(archivePath);
    const archive=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(__dirname,'../projekt/archive.js')).toString('base64'));
    const files=await archive.readZip(new Blob([fs.readFileSync(archivePath)]));
    assert(files.has('Reflexionen.txt')&&files.has('notebooks/basis_neuron.ipynb')&&files.has('fotodaten/fotostudio.json'));
    assert.equal(JSON.parse(await files.get('notebooks/basis_neuron.ipynb').text()).cells[0].source[0],'print("Mein Versuch")');
    await note.fill('Wird beim Import ersetzt');
    const restoredPhoto=page.waitForEvent('download');
    await page.locator('input[aria-label="ZIP-Kursstand wiederherstellen"]').setInputFiles(archivePath);
    await restoredPhoto;
    assert.equal(await note.inputValue(),'Gesicherte Reflexion im ZIP.');
    assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('kst-ki-basis-notebooks-v1')))['basis_neuron.ipynb'].cells[0].execution_count,1);
    // ZIP export/import must remain accessible when the navigation becomes mobile.
    const mobilePage=await browser.newPage({viewport:{width:390,height:840}});
    await mobilePage.goto('http://127.0.0.1:8770/basis/');
    assert(await mobilePage.locator('#basis-sicherung #basis-backup-controls button').isVisible(),
      'Mobile devices must expose the full ZIP backup controls outside the hidden sidebar');
    await mobilePage.close();
    // The first-year buttons must launch the selected notebook directly inside
    // the same lab-panel component used in the fourth-year course.
    for(const [lesson,link,notebook,title] of [
      ['basis-neuron','basis_neuron.ipynb','basis_neuron.ipynb','Ein Neuron'],
      ['basis-netze','xor_einzelne_neuronen.ipynb','xor_einzelne_neuronen.ipynb','XOR: Ein Neuron'],
      ['basis-netze','basis_netze.ipynb','basis_netze.ipynb','Neuronale Netze']
    ]){
      const notebookPage=await browser.newPage();
      await notebookPage.goto('http://127.0.0.1:8770/basis/#'+lesson);
      await notebookPage.locator('#'+lesson+' a.btn.primary[href*="'+link+'"]').first().click();
      await notebookPage.waitForFunction(()=>!!document.querySelector('#basis-lab-frame')?.getAttribute('src'));
      const source=await notebookPage.locator('#basis-lab-frame').getAttribute('src');
      assert.equal(new URL(source,notebookPage.url()).searchParams.get('path'),'portal/'+notebook,
        'Notebook must launch its own Jupyter document directly');
      assert.equal(await notebookPage.locator('#basis-lab-title').innerText(),title);
      assert.equal(await notebookPage.locator('#basis-notebook-panel.lab-panel').count(),1);
      assert.equal(await notebookPage.getByText('Notebook der 1. Klasse').count(),0);
      assert.equal(await notebookPage.locator('#basis-lab-fullscreen').count(),1);
      await notebookPage.close();
    }
    // Jupyter notebooks can now be launched and edited within the chapter.
    // The expensive Python runtime must only load after explicit interaction.
    const notebookPageInline=await browser.newPage();
    await notebookPageInline.route('**/lab/index.html?**',route=>route.fulfill({
      status:200,contentType:'text/html',body:'<!doctype html><html><body>JupyterLite test runtime</body></html>'
    }));
    for(const [url,section,expected] of [
      ['http://127.0.0.1:8770/basis/','basis-neuron','content/basis_neuron.ipynb'],
      ['http://127.0.0.1:8770/projekt/','perzeptron','content/perzeptron_und_neuronale_netze.ipynb']
    ]){
      // Navigate just as a student would: inactive lesson sections are hidden.
      // Opening only the nested <details> does not make a hidden lesson visible.
      await notebookPageInline.goto(url+'#'+section);
      const card=notebookPageInline.locator('.ki-notebook-block[data-notebook="'+expected+'"]');
      assert.equal(await card.count(),1,'Notebook must be present in the matching chapter');
      await card.evaluate(el=>{el.closest('details.kapitel').open=true;});
      assert.equal(await card.locator('.ki-notebook-iframe').count(),0,'No runtime iframe before user action');
      const launch=card.locator('button.ki-notebook-launch');
      const scriptResult=await notebookPageInline.request.get(new URL('notebook-blocks.js',url).href);
      assert.equal(scriptResult.status(),200,'Notebook block script must be served alongside each course');
      await notebookPageInline.waitForFunction(path=>{
        const card=document.querySelector('.ki-notebook-block[data-notebook="'+path+'"]');
        return !!card?.querySelector('button.ki-notebook-launch');
      },expected,{timeout:10000}).catch(async e=>{
        throw Error('Notebook launcher missing: '+JSON.stringify(await card.evaluate(el=>({
          script:[...document.scripts].map(s=>s.src).filter(x=>x.includes('notebook')),
          outer:el.outerHTML.slice(0,1400),
          scriptCount:document.querySelectorAll('.ki-notebook-block').length
        })))+' '+e.message);
      });
      await launch.click();
      assert.equal(await launch.getAttribute('aria-expanded'),'true');
      const frame=card.locator('iframe.ki-notebook-iframe');
      await frame.waitFor({state:'visible'});
      assert.match(await frame.getAttribute('src'),new RegExp('portal%2F'+expected.split('/').pop().replace('.','\\.')));
      assert.equal(await card.locator('.ki-notebook-runtime').isVisible(),true);
      await card.getByRole('button',{name:'Notebook schliessen'}).click();
      assert.equal(await card.locator('.ki-notebook-runtime').isVisible(),false);
      assert.equal(await card.locator('a.ki-notebook-direct').getAttribute('target'),'_blank');
    }
    await notebookPageInline.close();
    // Glossary links open an accessible explanation without leaving the current lesson.
    const glossaryPage=await browser.newPage();
    await glossaryPage.goto('http://127.0.0.1:8770/basis/#basis-daten');
    await glossaryPage.locator('a[href="#basis-glossar-modell"]').first().click();
    assert(await glossaryPage.locator('dialog.glossary-dialog').isVisible(),'Inline glossary dialog');
    assert((await glossaryPage.locator('dialog.glossary-dialog').innerText()).includes('Modell'));
    const popupAnswer=glossaryPage.locator('dialog.glossary-dialog details.glossary-answer');
    assert(!await popupAnswer.evaluate(el=>el.open),'Antwort in der Begriffs-Erklärung bleibt anfangs zu');
    const popupToggle=popupAnswer.locator('summary');
    assert.equal(await popupToggle.innerText(),'Antwort anzeigen');
    assert.equal(await popupToggle.evaluate(el=>getComputedStyle(el,'::after').content),'none','Kein überlagerndes globales Plus-Symbol');
    assert((await popupToggle.boundingBox()).height>=44,'Gut antippbarer Schalter auch im Dialog');
    await popupToggle.click();
    assert(await popupAnswer.evaluate(el=>el.open),'Antwort lässt sich im Dialog aufklappen');
    assert.equal(await popupToggle.innerText(),'Antwort verbergen');
    await popupToggle.click();
    assert(!await popupAnswer.evaluate(el=>el.open),'Antwort lässt sich wieder schliessen');
    await glossaryPage.locator('dialog.glossary-dialog .glossary-close').click();
    assert(!await glossaryPage.locator('dialog.glossary-dialog').isVisible());
    await glossaryPage.locator('.nav a[href="#basis-glossar"]').click();
    await glossaryPage.locator('#basis-glossar [data-glossary-search]').waitFor({state:'visible',timeout:10000});
    await glossaryPage.locator('[data-glossary-search]').fill('Token');
    assert(await glossaryPage.locator('#basis-glossar-token').isVisible());
    const tokenAnswer=glossaryPage.locator('#basis-glossar-token details.glossary-answer');
    assert(!await tokenAnswer.evaluate(el=>el.open),'Glossar-Antwort ist zunächst verborgen');
    await tokenAnswer.locator('summary').click();
    assert(await tokenAnswer.evaluate(el=>el.open),'Glossar-Antwort lässt sich öffnen');
    assert(await tokenAnswer.locator('.glossary-answer-content').isVisible());
    await glossaryPage.setViewportSize({width:390,height:844});
    const mobileToggle=tokenAnswer.locator('summary');
    assert((await mobileToggle.boundingBox()).height>=44,'Mobile Schaltfläche ist gross genug');
    assert(await glossaryPage.locator('#basis-glossar-token .glossary-selfcheck').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Kein horizontales Überlaufen');
    assert(!await glossaryPage.locator('#basis-glossar-xor').isVisible());
    await glossaryPage.locator('[data-glossary-search]').fill('');
    assert.equal(await glossaryPage.locator('#basis-glossar .glossary-entry:visible').count(),29);
    await glossaryPage.close();
    assert.deepEqual(errors,[]);
    console.log('PASS both course links, ten lessons, reused KI/ML, blue KST layout, two-layer network, live neuron controls and isolated persistent answers');
  }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
