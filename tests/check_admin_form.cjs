/* Browser regression: guided AVIVA form -> new lesson -> materials -> one PR. */
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const files=[
  "kursseiten/einstieg/000-einstieg.md",
  "kursseiten/einstieg/010-einstieg-1.md",
  "kursseiten/einstieg/030-einstieg-3.md",
  "kursseiten/perzeptron/030-perzeptron-3.md",
  "kursseiten/basis-neuron/030-perzeptron-3.md"
];
const server=http.createServer((req,res)=>{
  const location=new URL(req.url,"http://localhost").pathname;
  const relative=location==="/projekt/admin/"?"projekt/admin/index.html":location.replace(/^\//,"");
  const shared=["course-model.js","course-rules.json"].includes(path.basename(relative));
  const file=path.resolve(ROOT,shared?"shared/"+path.basename(relative):relative);
  if(!file.startsWith(ROOT+path.sep)||(!shared&&!file.startsWith(path.join(ROOT,"projekt/admin")+path.sep))){
    res.writeHead(404).end();return;
  }
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    res.writeHead(200,{"Content-Type":ext===".json"?"application/json":ext===".js"?"text/javascript":ext===".css"?"text/css":"text/html",
      // Reproduce the Worker constraint that causes <base href> to be ignored.
      "Content-Security-Policy":"base-uri 'none'; img-src 'self' data: blob: https://fachschaft-informatik-kst.github.io"});
    res.end(data);
  });
});
(async()=>{
  await new Promise(r=>server.listen(0,"127.0.0.1",r));
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage();
    page.on("pageerror",error=>{throw error;});
    await page.route("**/api/session",route=>route.fulfill({json:{authenticated:true,login:"integration-test"}}));
    await page.route("**/api/notebooks",route=>route.fulfill({json:{notebooks:[]}}));
    await page.route("**/api/chapters",route=>route.fulfill({json:{
      chapters:[...files.map(path=>({path,sha:"a".repeat(40)})),
        {path:"kursseiten/einstieg/planung.json",sha:"a".repeat(40)},
        {path:"kursseiten/einstieg/materialien.md",sha:"a".repeat(40)},
        {path:"kursseiten/lernziele/000-inhalt.md",sha:"a".repeat(40)}]
    }}));
    // Match query strings containing slashes too (glob * does not cross /).
    await page.route(/\/api\/file\?/,route=>{
      const p=new URL(route.request().url()).searchParams.get("path");
      const content=fs.readFileSync(path.join(ROOT,p),"utf8");
      return route.fulfill({json:{path:p,sha:"a".repeat(40),content}});
    });
    let submitted=null;
    let publishFailure=false;
    await page.route("**/api/publish",route=>{
      submitted=route.request().postDataJSON();
      if(publishFailure)return route.fulfill({status:502,contentType:"text/html",body:"<h1>Upstream failure</h1>"});
      return route.fulfill({json:{url:"https://github.com/example/repo/pull/123",number:123}});
    });
    // Mock only the published KST logo; relative requests to worker origin
    // must fail under the server rules above, just like on Cloudflare.
    const logoUrl="https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/grafiken/kst_logo.png";
    const tinyPng=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/XxkAAAAASUVORK5CYII=","base64");
    await page.route(logoUrl,route=>route.fulfill({
      status:200,contentType:"image/png",body:tinyPng
    }));

    await page.goto("http://127.0.0.1:"+server.address().port+"/projekt/admin/");
    await page.locator("#section").selectOption("einstieg");
    await page.locator(".sidebar-details summary").first().click();
    await page.locator("#lessonOrder .lesson-sort-head").first().waitFor();
    assert.equal(await page.locator("#lessonOrder .lesson-sort-head").count(),7,
      "All teaching sections need an ordered draggable entry");
    assert.equal(await page.locator("#lessonOrder .lesson-sort-item").count(),10,
      "All ten existing lessons remain visible in the ordering overview");
    assert.equal(await page.locator("#chapters button").count(),3,
      "Only numbered chapter Markdown files belong in chapter navigation");

    // Reordering a lesson group must update the staged plan without changing stable IDs.
    const lessonHeads=page.locator("#lessonOrder .lesson-sort-head");
    await lessonHeads.nth(1).dragTo(lessonHeads.nth(2));
    await page.waitForFunction(()=>document.querySelector("#staged")?.textContent?.includes("planung.json"));
    assert.ok((await lessonHeads.nth(2).textContent()).includes("Wie lernt KI?"));
    assert.ok((await page.locator("#staged").textContent()).includes("planung.json"));
    // Reset the reorder before testing the normal editor flow by refreshing
    // (a new page resets unstaged test changes).
    await page.reload();
    await page.locator("#section").selectOption("einstieg");

    // Materials are Markdown documents with tables; they must have a usable
    // preview and update without the manual refresh button.
    await page.locator("#editMaterials").click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/einstieg/materialien.md");
    const materialFrame=page.frameLocator("#preview");
    await materialFrame.locator("table").first().waitFor();
    assert.equal(await materialFrame.locator("table th").count()>=2,true);
    await page.locator("#source").fill("# Testmaterialien\n\n| Schritt | Ziel |\n|---|---|\n| Übung | Prüfen |\n");
    await materialFrame.locator("table td").filter({hasText:"Übung"}).waitFor();
    assert.equal(await materialFrame.locator("table td").first().textContent(),"Übung");
    await page.locator("#blockType").selectOption("warning");
    await page.locator("#addBlock").click();
    await materialFrame.locator(".callout.warn").waitFor();
    assert.match(await page.locator("#source").inputValue(),/callout warn/);
    // Restore the original un-staged content before changing files.
    await page.locator("#source").fill(fs.readFileSync(path.join(ROOT,"kursseiten/einstieg/materialien.md"),"utf8"));
    await materialFrame.locator("table").first().waitFor();

    // Every navigation must replace the iframe document, even after viewing
    // AVIVA plans or material files. No stale material preview may remain.
    await page.locator("#editPlan").click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/einstieg/planung.json");
    assert.equal(await page.locator("#preview").isVisible(),true);
    await page.frameLocator("#preview").locator("h2").filter({hasText:"Unterrichtsplan"}).waitFor();
    await page.locator("#editMaterials").click();
    await page.frameLocator("#preview").locator("table").first().waitFor();
    // Visual regression for the real CSS selectors and HTML wrappers.
    // Missing portal.css used to turn the milestone timeline into an ordinary
    // numbered list and removed the circular chapter numbers.
    await page.locator("#chapters button").filter({hasText:"030-einstieg-3"}).click();
    assert.equal(await page.locator("#preview").isVisible(),true,
      "Chapter preview must reappear after editing materials");
    assert.equal(await page.locator("#codeEditor").isVisible(),true,
      "Highlighted source editor must be visible for chapters");
    assert.ok((await page.locator("#sourceHighlight").innerHTML()).includes("tok-"),
      "Source preview must contain syntax highlighting tokens");
    const preview=page.frameLocator("#preview");
    await preview.locator(".timeline li").first().waitFor();
    const kstLogo=preview.locator(".crumb .school-logo");
    await kstLogo.waitFor();
    const logoResult=await kstLogo.evaluate(img=>new Promise(resolve=>{
      const finish=()=>resolve({src:img.currentSrc||img.src,loaded:img.complete&&img.naturalWidth>0});
      if(img.complete)finish();
      else{
        img.addEventListener("load",finish,{once:true});
        img.addEventListener("error",finish,{once:true});
      }
    }));
    assert.equal(logoResult.src,logoUrl,"Logo must resolve to published asset despite CSP base-uri 'none'");
    assert.equal(logoResult.loaded,true,"The KST logo must actually load in the sandboxed preview");

    assert.equal(await preview.locator(".timeline li").count(),9);
    const timelineStyle=await preview.locator(".timeline li").first().evaluate(el=>({
      display:getComputedStyle(el).display,
      columns:getComputedStyle(el).gridTemplateColumns
    }));
    assert.equal(timelineStyle.display,"grid","Milestones must use published two-column timeline");
    assert.match(timelineStyle.columns,/104px/,"Milestone year column must match site CSS");
    const chapterStyle=await preview.locator(".kapitel > summary .kapitel-nr").evaluate(el=>({
      display:getComputedStyle(el).display,
      radius:getComputedStyle(el).borderTopLeftRadius,
      width:getComputedStyle(el).width,
      value:el.textContent
    }));
    assert.equal(chapterStyle.value,"3");
    assert.equal(chapterStyle.display,"grid","Chapter number styling was missing");
    assert.equal(chapterStyle.radius,"50%","Chapter number circle must match site");
    assert.equal(chapterStyle.width,"34px");
    assert.equal(await preview.locator(".sidebar").count(),1,"Course sidebar shell must match site");

    // An unmerged YAML-backed chapter also needs the exact numbered wrapper.
    await page.locator("#source").fill("---\ntype: chapter\nid: einstieg-test\nnummer: \"3a\"\ntitel: \"Testtitel\"\nkurz: \"Test\"\nopen: true\n---\n\n## Neuer Inhalt\n");
    await page.locator("#previewButton").click();
    assert.equal(await preview.locator(".kapitel-nr").first().textContent(),"3a");
    assert.equal(await preview.locator(".kapitel-titel").first().textContent(),"Testtitel");
    // Restore the original source without staging a change.
    await page.locator("#source").fill(fs.readFileSync(path.join(ROOT,"kursseiten/einstieg/030-einstieg-3.md"),"utf8"));

    await page.locator("#editPlan").click();
    // UI operations fetch their files asynchronously; click() does not await handlers.
    await page.locator("#planEditor").waitFor({state:"visible"});
    assert.equal(await page.locator("#planEditor").isVisible(),true);
    assert.equal(await page.locator("#source").isVisible(),false);
    assert.match(await page.locator("#planTotal").textContent(),/90 von 90/);
    await page.locator("#planFields input").first().fill("Was ist KI? – Überarbeitet");
    await page.locator("#stage").click();
    assert.match(await page.locator("#notice").textContent(),/Vorgemerkt/,"Initial plan change was not staged");
    await page.evaluate(()=>{
      const responses=["Vertiefung: KI im Alltag","Einstieg und Auftrag"];
      window.__promptCalls=[];
      window.prompt=()=>{const value=responses.shift()??null;window.__promptCalls.push(value);return value;};
    });
    await page.locator("#createLesson").evaluate(button=>button.closest("details").open=true);
    await page.locator("#createLesson").click();
    try{
      await page.waitForFunction(()=>document.querySelector("#section")?.value==="vertiefung-ki-im-alltag",null,{timeout:6500});
    }catch(err){
      const diagnostic=await page.evaluate(()=>({
        notice:document.querySelector("#notice")?.textContent,
        section:document.querySelector("#section")?.value,
        prompts:window.__promptCalls,
        staged:document.querySelector("#staged")?.textContent
      }));
      throw Error("DL11 creation did not complete: "+JSON.stringify(diagnostic),{cause:err});
    }
    assert.equal(await page.locator("#section").inputValue(),"vertiefung-ki-im-alltag");
    assert.equal(await page.locator("#planLesson").inputValue(),"0");
    assert.equal(await page.locator("#planPhases fieldset").count(),5);
    const phase=page.locator("#planPhases fieldset").first();
    await phase.locator("button").last().click();
    assert.equal(await phase.locator(".plan-step").count(),3);
    await page.locator("#planPhases fieldset").first().locator("input[type=number]").first().fill("6");
    await page.locator("#planPhases fieldset").first().locator(".plan-step").first().locator("input[type=number]").fill("5");
    assert.match(await page.locator("#planTotal").textContent(),/91 von 90/);
    await page.locator("#planPhases fieldset").nth(1).locator("input[type=number]").first().fill("9");
    await page.locator("#planPhases fieldset").nth(1).locator(".plan-step").first().locator("input[type=number]").fill("8");
    assert.match(await page.locator("#planTotal").textContent(),/90 von 90/);
    await page.locator("#stage").click();
    await page.locator("#editMaterials").click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent?.includes("/vertiefung-ki-im-alltag/materialien.md"));
    assert.match(await page.locator("#path").textContent(),/kursseiten\/vertiefung-ki-im-alltag\/materialien.md/);
    await page.locator("#source").fill((await page.locator("#source").inputValue())+"\n- Neues Experiment vorbereiten\n");
    await page.locator("#stage").click();
    await page.evaluate(()=>{
      const answers=["AVIVA-Testgrafik","Ankommen","Lehrperson"];
      window.prompt=()=>answers.shift()??null;
    });
    const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/XxkAAAAASUVORK5CYII=","base64");
    await page.locator("#imageFile").setInputFiles({name:"test.png",mimeType:"image/png",buffer:png});
    await page.locator("#stage").click();
    assert.match(await page.locator("#source").inputValue(),/AVIVA-Testgrafik.*"Ankommen \| Lehrperson"/);
    await page.locator("#previewButton").click();
    const previewImage=page.frameLocator("#preview").locator('img[alt="AVIVA-Testgrafik"]');
    await previewImage.waitFor();
    assert.match(await previewImage.getAttribute("src"),/^data:image\/png;base64,/);

    await page.locator("#chapters button").first().click();
    assert.match(await page.locator("#path").textContent(),/kursseiten\/vertiefung-ki-im-alltag\//);
    await page.locator("#source").fill((await page.locator("#source").inputValue())+"\nEin eigenes Beispiel.\n");
    await page.locator("#stage").click();
    await page.locator("#publish").click();
    await page.waitForFunction(()=>document.querySelector("#published")?.textContent?.includes("#123"));
    assert.ok(submitted);
    const names=submitted.changes.map(c=>c.path).sort();
    assert.deepEqual(names.filter(n=>!n.startsWith("projekt/grafiken/uploads/")),[
      "kursseiten/einstieg/planung.json",
      "kursseiten/manifest.json",
      "kursseiten/vertiefung-ki-im-alltag/010-einstieg-und-auftrag.md",
      "kursseiten/vertiefung-ki-im-alltag/materialien.md",
      "kursseiten/vertiefung-ki-im-alltag/planung.json"
    ]);
    assert.equal(names.filter(n=>/^projekt\/grafiken\/uploads\/test-[a-f0-9]{8}\.png$/.test(n)).length,1);
    const initial=JSON.parse(submitted.changes.find(c=>c.path==="kursseiten/einstieg/planung.json").content);
    assert.equal(initial.lessons[0].title,"Was ist KI? – Überarbeitet");
    const updated=JSON.parse(submitted.changes.find(c=>c.path==="kursseiten/vertiefung-ki-im-alltag/planung.json").content);
    assert.equal(updated.lessons.length,1);
    assert.equal(updated.lessons[0].view,"vertiefung-ki-im-alltag");
    assert.equal(updated.lessons[0].phases.reduce((n,p)=>n+p.minutes,0),90);
    assert.equal(updated.lessons[0].phases[0].schritte.length,3);
    assert.equal(updated.lessons[0].phases[0].schritte.at(-1).art,"Ergebnis");
    assert.equal(updated.lessons[0].phases[0].schritte.reduce((n,s)=>n+Number(s.min||0),0),6);
    assert.match(await page.locator("#published").textContent(),/#123/);

    // A non-JSON Cloudflare/edge failure must expose its HTTP status and retain
    // all staged edits. It must never masquerade as "Gateway not installed".
    await page.locator("#section").selectOption("einstieg");
    await page.locator("#chapters button").filter({hasText:"010-einstieg-1"}).click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/einstieg/010-einstieg-1.md");
    await page.locator("#source").fill((await page.locator("#source").inputValue())+"\n<!-- regression test -->");
    await page.locator("#stage").click();
    publishFailure=true;
    await page.locator("#publish").click();
    await page.waitForFunction(()=>document.querySelector("#notice")?.textContent?.includes("HTTP 502"));
    assert.match(await page.locator("#notice").textContent(),/keine gültige JSON-Antwort/);
    assert.doesNotMatch(await page.locator("#notice").textContent(),/Gateway nicht eingerichtet/);
    assert.match(await page.locator("#staged").textContent(),/010-einstieg-1\.md/);

    // Non-teaching learning objectives are also editable using the same source editor.
    await page.locator("#section").selectOption("lernziele");
    await page.locator("#chapters button").first().click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/lernziele/000-inhalt.md");
    assert.equal(await page.locator("#source").isVisible(),true);
    assert.equal(await page.locator("#preview").isVisible(),true);

    // Theme regression: 1st-year preview must load exactly the published blue
    // basis.css and basis course shell, not the green fourth-year course chrome.
    await page.locator("#courseSelect").selectOption("basis");
    await page.locator('#section option[value="basis-neuron"]').waitFor();
    await page.locator("#section").selectOption("basis-neuron");
    await page.locator("#chapters button").filter({hasText:"030-perzeptron-3"}).click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/basis-neuron/030-perzeptron-3.md");
    const basisPreview=page.frameLocator("#preview");
    await basisPreview.locator("table").first().waitFor();
    assert.equal(await basisPreview.locator("table").first().locator("thead th").count(),5,
      "Logical-gate truth table in the blue course must have five headers");
    const basisTheme=await basisPreview.locator("html").evaluate(el=>{
      const vars=getComputedStyle(el),body=getComputedStyle(el.ownerDocument.body);
      return {accent:vars.getPropertyValue("--accent").trim(),
        paper:vars.getPropertyValue("--paper").trim(),
        background:body.backgroundColor,
        brand:el.ownerDocument.querySelector(".sidebar .brand")?.getAttribute("href"),
        image:el.ownerDocument.querySelector(".kapitel img")?.getAttribute("src")};
    });
    assert.equal(basisTheme.accent,"#3653a3","First-year accent must be blue");
    assert.equal(basisTheme.paper,"#f3f5fb","First-year paper must be pale blue");
    assert.equal(basisTheme.background,"rgb(243, 245, 251)");
    assert.equal(basisTheme.brand,"#basis-start","Preview must use the first-year course shell");
    assert.ok(basisTheme.image?.startsWith("https://fachschaft-informatik-kst.github.io/ki-unterricht/basis/grafiken/"),
      "First-year images must resolve against the blue basis course");

    // Switching back restores the actual fourth-year stylesheet and sidebar.
    await page.locator("#courseSelect").selectOption("vertiefung");
    await page.locator('#section option[value="perzeptron"]').waitFor();
    await page.locator("#section").selectOption("perzeptron");
    await page.locator("#chapters button").filter({hasText:"030-perzeptron-3"}).click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/perzeptron/030-perzeptron-3.md");
    const fourthPreview=page.frameLocator("#preview");
    await fourthPreview.locator("table").first().waitFor();
    const fourthAccent=await fourthPreview.locator("html").evaluate(el=>
      getComputedStyle(el).getPropertyValue("--accent").trim());
    assert.equal(fourthAccent,"#076959","Fourth-year accent must remain green");

    console.log("PASS admin AVIVA form, dynamic DL11, materials, chapter and atomic PR payload");
  }finally{
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
