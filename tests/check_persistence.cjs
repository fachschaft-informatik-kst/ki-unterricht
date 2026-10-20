// End-to-end storage contract: local reload, all five notebooks, a fresh browser,
// binary attachments, real widget outputs/uploads and replacement without leaks.
const {chromium}=require('playwright-core');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ki-persistence-'));
 const archive=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(__dirname,'../projekt/archive.js')).toString('base64'));
 const names=['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_lernlabor.ipynb'];
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=';
 const doc=name=>({nbformat:4,nbformat_minor:5,metadata:{kernelspec:{display_name:'Python (Pyodide)',language:'python',name:'python'},custom:name},cells:[
  {id:'notes',cell_type:'markdown',metadata:{},source:'Eigene Notiz '+name+' ![Bild](attachment:bild.png)',attachments:{'bild.png':{'image/png':png}}},
  {id:'setup',cell_type:'code',metadata:{jupyter:{source_hidden:false}},source:"raise RuntimeError('Imported code must stay manual')",execution_count:null,outputs:[]},
  {id:'result',cell_type:'code',metadata:{},source:"print('Mein Ergebnis')",execution_count:3,outputs:[{output_type:'stream',name:'stdout',text:'Mein Ergebnis\n'},{output_type:'display_data',data:{'image/png':png},metadata:{}}]}
 ]});
 const state={schema:'ki-kursportal-v1',journal:{names:'Ada & Alan',class:'4f',purpose:'Äpfel erkennen'},answers:{ki_ordnung:'Meine eigene Erklärung'},files:[{id:'original',name:'äpfel.png',type:'image/png'}],progress:{schema:'ki-projekt-seitenstand-v1',scores:{k1:'2'}},notebooks:['versuch.ipynb',...names.map(n=>'notebooks/'+n)]};
 const entries=[{name:'kursstand.json',data:JSON.stringify(state)},{name:'daten/original__pfel.png',data:Buffer.from(png,'base64')},{name:'versuch.ipynb',data:JSON.stringify(doc('Projekt'))},...names.map(n=>({name:'notebooks/'+n,data:JSON.stringify(doc(n))}))];
 async function zipFile(entries,name){const file=path.join(tmp,name);fs.writeFileSync(file,Buffer.from(await (await archive.makeZip(entries)).arrayBuffer()));return file;}
 const fixture=await zipFile(entries,'alle-daten.zip');
 const port=process.env.PORTAL_TEST_PORT||'8765';
 const server=spawn('python',['-m','http.server',port,'--bind','127.0.0.1','--directory',process.env.PORTAL_SITE||path.resolve(__dirname,'../dist')],{stdio:'ignore'});
 let browser;
 const errors=[];
 const setup=async()=>{
  const context=await browser.newContext(),p=await context.newPage();
  p.on('dialog',d=>d.accept());p.on('pageerror',e=>errors.push(e.message));
  // External teaching links are unrelated to the local storage contract.
  await p.route(/https:\/\/(inf-schule\.de|humanornot\.so|pair-code\.github\.io)\//,r=>r.abort());
  await p.goto(`http://127.0.0.1:${port}/projekt/`);
  return {context,p};
 };
 const importZip=async(p,file)=>{
  await p.locator('a[href="#sicherung"]').first().click();
  await p.locator('#restore-package').setInputFiles(file);
  await p.waitForFunction(()=>document.querySelector('#download-status').textContent.startsWith('Projektstand wiederhergestellt'));
 };
 const download=async(p,name)=>{
  await p.locator('a[href="#sicherung"]').first().click();
  const event=p.waitForEvent('download',{timeout:120000});
  await p.locator('#download-backup').click();
  const item=await event.catch(async e=>{console.error('DOWNLOAD',await p.locator('#download-status').innerText());throw e;});
  const file=path.join(tmp,name);await item.saveAs(file);
  return {file,files:await archive.readZip(new Blob([fs.readFileSync(file)]))};
 };
 const openProject=async p=>{
  await p.locator('.sidebar-bottom a[href="#journal"]').click();await p.locator('#start-project').click();
  await p.locator('#project-lab-loading').waitFor({state:'visible'});
  await p.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000}).catch(async e=>{console.error(await p.locator('#project-lab-status').innerText());throw e;});
  assert.equal(await p.locator('#project-lab-loading').isVisible(),false,'The loader must hide after every project restore');
 };
 const localArtifacts=p=>p.evaluate(()=>new Promise((resolve,reject)=>{const q=indexedDB.open('kst-ki-kursportal',1);q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,r=db.transaction('artifacts').objectStore('artifacts').get('project');r.onsuccess=()=>{resolve(r.result);db.close();};r.onerror=()=>reject(r.error);};}));
 const edit=async(p,cell,source)=>{
  const editor=cell.locator('.cm-content');await editor.click();
  await editor.press('ControlOrMeta+A');await editor.press('Backspace');await p.keyboard.insertText(source);
  assert.equal((await editor.locator('.cm-line').allTextContents()).join('\n'),source);
 };
 try{
  await new Promise(r=>setTimeout(r,500));
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
  const first=await setup(),p=first.p;
  await importZip(p,fixture);await p.reload();
  const saved=await localArtifacts(p);
  assert.deepEqual(saved.notebook,doc('Projekt'));assert.equal(Object.keys(saved.others).length,4);
  await openProject(p);
  console.log('PASS local restore of imported project without automatic code execution');
  let cells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
  assert.equal(await cells.locator('.jp-OutputArea-error').count(),0,'Imported code must not execute');
  assert((await cells.nth(1).innerText()).includes('Mein Ergebnis'));
  // Upload only through a genuine ipywidgets.FileUpload, not the portal file list.
  await edit(p,cells.nth(0),"import piplite\nawait piplite.install('ipywidgets==8.1.0')\nimport ipywidgets as widgets\nfrom IPython.display import display\nupload = widgets.FileUpload(multiple=True)\ndisplay(upload)");
  await p.keyboard.press('Shift+Enter');
  const uploadButton=p.frameLocator('#project-frame').locator('.widget-upload');
  await uploadButton.waitFor({timeout:60000}).catch(async e=>{console.error('UPLOAD CELL',await cells.nth(0).innerText());throw e;});
  const chooser=p.waitForEvent('filechooser');await uploadButton.click();
  await(await chooser).setFiles({name:'daten..json',mimeType:'application/json',buffer:Buffer.from('{"meine_daten":[1,2,3],"text":"Äpfel"}')});
  await p.waitForFunction(()=>document.querySelector('#attachment-list').textContent.includes('daten..json'),null,{timeout:60000});
  // Fill EVERY course textbox and journal field with identifiable test content.
  // This detects newly missed fields in both ZIP export and clean-browser restore.
  const formSnapshot=await p.evaluate(()=>{
    const saved={answers:{},journal:{}};
    for(const el of document.querySelectorAll('[data-answer], [data-journal]')){
      const kind=el.hasAttribute('data-answer')?'answers':'journal';
      const key=el.getAttribute(kind==='answers'?'data-answer':'data-journal');
      if(kind==='answers'&&key==='ki_ordnung'){
        saved.answers[key]=el.value;
        continue; // preserve the fixture's existing answer
      }
      if(el.tagName==='SELECT'){
        const opt=[...el.options].find(option=>option.value&&!option.disabled);
        if(opt)el.value=opt.value;
      }else{
        el.value='ZIP-Test: '+key;
      }
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
      saved[kind][key]=el.value;
    }
    return saved;
  });
  assert(Object.keys(formSnapshot.answers).length>=140,'Not all course answer fields found');
  assert(Object.keys(formSnapshot.journal).length>=15,'Not all project journal fields found');
  // Immediate export must include edits even before the background save delay.
  await edit(p,cells.nth(1),"print('zuletzt geändert – noch nicht ausgeführt')");
  const exported=await download(p,'export.zip'),manifest=JSON.parse(await exported.files.get('kursstand.json').text());
  for(const [key,value] of Object.entries(formSnapshot.answers))assert.equal(manifest.answers[key],value,'ZIP answer: '+key);
  for(const [key,value] of Object.entries(formSnapshot.journal))assert.equal(manifest.journal[key],value,'ZIP journal: '+key);
  assert.equal(manifest.notebooks.length,5);
  assert.equal(manifest.answers.ki_ordnung,state.answers.ki_ordnung);
  const uploaded=manifest.files.find(f=>f.name==='daten..json');assert(uploaded,'Notebook upload missing');
  assert.equal(await exported.files.get('daten/'+uploaded.id+'_daten_json').text(),'{"meine_daten":[1,2,3],"text":"Äpfel"}');
  assert.deepEqual(Buffer.from(await exported.files.get('daten/original__pfel.png').arrayBuffer()),Buffer.from(png,'base64'));
  const exportedNotebook=JSON.parse(await exported.files.get('versuch.ipynb').text());
  assert(JSON.stringify(exportedNotebook).includes('zuletzt geändert'));
  for(const n of names)assert.deepEqual(JSON.parse(await exported.files.get('notebooks/'+n).text()),doc(n));
  for(const n of ['unterricht_tools.py','ki_projekt/ki_foto_tools.py','notebooks/unterricht_tools.py'])assert(exported.files.has(n),'Missing runtime '+n);
  await p.reload();await openProject(p);cells=p.frameLocator('#project-frame').locator('.jp-CodeCell');
  assert((await cells.nth(1).innerText()).includes('zuletzt geändert'));
  assert((await cells.nth(0).innerText()).includes('daten..json'));
  assert.equal(await p.frameLocator('#project-frame').locator('.widget-upload').count(),0,'Restored output is readable, not a stale live widget');
  console.log('PASS all five notebooks, latest edit, Markdown/image attachment, binary files and real notebook upload in ZIP and after reload');

  const second=await setup();await importZip(second.p,exported.file);await openProject(second.p);
  assert((await second.p.frameLocator('#project-frame').locator('.jp-CodeCell').nth(1).innerText()).includes('zuletzt geändert'));
  const transferred=await download(second.p,'transferred.zip');
  const transferredState=JSON.parse(await transferred.files.get('kursstand.json').text());
  assert.deepEqual(transferredState.answers,manifest.answers);
  assert.deepEqual(transferredState.journal,manifest.journal);
  // Missing manifest entries fail before changing any stored document.
  const broken=await zipFile(entries.filter(e=>e.name!=='notebooks/'+names[0]),'missing.zip');
  await second.p.locator('#restore-package').setInputFiles(broken);
  await second.p.waitForFunction(()=>document.querySelector('#download-status').textContent.startsWith('Import fehlgeschlagen'));
  assert((await localArtifacts(second.p)).notebook.cells.some(c=>JSON.stringify(c.source).includes('zuletzt geändert')));
  // An empty archive must also replace a currently open project and its exercises.
  const empty=await zipFile([{name:'kursstand.json',data:JSON.stringify({schema:'ki-kursportal-v1',journal:{names:'Neues Tandem'},answers:{},files:[],notebooks:[]})}],'empty.zip');
  await importZip(second.p,empty);const emptyExport=await download(second.p,'empty-export.zip');
  assert(!emptyExport.files.has('versuch.ipynb'));assert(![...emptyExport.files.keys()].some(n=>n.startsWith('notebooks/')));
  assert.equal((await localArtifacts(second.p)).notebook,null);await second.context.close();
  console.log('PASS clean-browser transfer, missing-notebook rejection and complete replacement without old tandem data');

  // A real teaching widget: values and figures must survive without a Python session.
  const third=await setup(),q=third.p;
  await q.locator('.nav a[href="#perzeptron"]').click();await q.locator('[data-lab="perzeptron_und_neuronale_netze.ipynb"]').click();
  await q.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:240000}).catch(async e=>{console.error('LESSON',await q.locator('#project-lab-status').innerText());throw e;});
  const choices=q.frameLocator('#project-frame').locator('.widget-dropdown select:has(option:text-is("XOR"))');
  await choices.first().selectOption({label:'XOR'});
  await q.waitForFunction(async()=>{
   const db=await new Promise(resolve=>{const r=indexedDB.open('kst-ki-kursportal',1);r.onsuccess=()=>resolve(r.result);});
   const a=await new Promise(resolve=>{const r=db.transaction('artifacts').objectStore('artifacts').get('project');r.onsuccess=()=>resolve(r.result);});db.close();
   return JSON.stringify(a?.others?.['perzeptron_und_neuronale_netze.ipynb']?.cells).includes('Gatter: XOR');
  },null,{timeout:60000});
  const widgetExport=await download(q,'widget.zip');
  const lesson=JSON.parse(await widgetExport.files.get('notebooks/perzeptron_und_neuronale_netze.ipynb').text());
  assert(lesson.cells.some(c=>c.outputs?.some(o=>String(o.data?.['text/html']||'').includes('<table'))),'Live widget table missing');
  assert(JSON.stringify(lesson.cells).includes('Gatter: XOR'));
  assert(!lesson.cells.some(c=>c.outputs?.some(o=>o.data?.['application/vnd.jupyter.widget-view+json'])));
  await q.reload();await q.locator('.nav a[href="#perzeptron"]').click();await q.locator('[data-lab="perzeptron_und_neuronale_netze.ipynb"]').click();
  await q.waitForFunction(()=>document.querySelector('#project-frame').dataset.ready==='yes',null,{timeout:180000});
  // Opening the teaching lab reloads the latest template (not a stale saved widget).
  await q.frameLocator('#project-frame').locator('.widget-html table').first().waitFor({state:'visible'});
  assert((await q.frameLocator('#project-frame').locator('body').innerText()).includes('Gatter: AND') || (await q.frameLocator('#project-frame').locator('body').innerText()).includes('AND: 4/4'));
  assert(JSON.stringify(lesson.cells).includes('Gatter: XOR'),'Previously exported choice must remain in the ZIP');
  await q.screenshot({path:path.join(tmp,'restored-widget.png'),fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS interactive gate selection and HTML truth table persisted locally and exported; no browser errors');
  console.log('Evidence:',tmp);
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
