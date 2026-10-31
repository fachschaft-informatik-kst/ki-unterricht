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
  const shared=["course-model.js","course-rules.json","glossary-model.js"].includes(path.basename(relative));
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
    await page.locator("#courseSelect").selectOption("basis");
    assert.equal(await page.locator("body").evaluate(node=>node.classList.contains("course-basis")),true,"First-year editor theme is not blue");
    assert.equal(await page.locator("body").evaluate(node=>getComputedStyle(node).getPropertyValue("--accent").trim()),"#3653a3");
    await page.locator("#courseSelect").selectOption("vertiefung");
    assert.equal(await page.locator("body").evaluate(node=>node.classList.contains("course-basis")),false,"Fourth-year editor should retain green theme");
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
    assert.equal(await page.locator("#splitEditor").evaluate(el=>el.classList.contains("preview-only")),true,
      "Plan view must not reserve a blank source column");
    assert.equal(await page.locator(".split-source").isVisible(),false);
    assert.equal(await page.locator("#splitDivider").isVisible(),false,"Plan view must not expose a resize handle");
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
    assert.equal(await page.locator("#splitEditor").evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length),3,
      "Editor requires two side-by-side panels with a separate draggable divider");
    assert.equal(await page.locator("#splitDivider").getAttribute("role"),"separator");
    // Both working surfaces must align, and fullscreen belongs inside the preview.
    const layout=await page.locator("#splitEditor").evaluate(el=>{
      const code=el.querySelector("#codeEditor").getBoundingClientRect();
      const render=el.querySelector("#previewFrame").getBoundingClientRect();
      const action=el.querySelector("#previewFullscreen").getBoundingClientRect();
      const iframe=el.querySelector("#preview").getBoundingClientRect();
      return {
        topDiff:Math.abs(code.top-render.top),heightDiff:Math.abs(code.height-render.height),
        frameContainsButton:action.left>=render.left&&action.right<=render.right&&
          action.top>=render.top&&action.bottom<=render.bottom,
        iframeHeight:iframe.height,frameHeight:render.height,
        fullscreenParent:el.querySelector("#previewFullscreen").parentElement.id
      };
    });
    assert.ok(layout.topDiff<=2,"Source and preview must start on the same horizontal line");
    assert.ok(layout.heightDiff<=2,"Source and preview must have the same height");
    assert.ok(Math.abs(layout.iframeHeight-layout.frameHeight)<=2,"Preview iframe must fill its frame");
    assert.ok(layout.frameContainsButton,"Fullscreen button must overlay the preview, not use its own toolbar");
    assert.equal(layout.fullscreenParent,"previewFrame");
    assert.equal(await page.locator("#previewFullscreen").getAttribute("aria-label"),"Vorschau im Vollbild anzeigen");
    // Both fullscreen buttons must live inside their own surface, not the header.
    assert.equal(await page.locator("#sourceFullscreen").evaluate(el=>el.parentElement.id),"codeEditor");
    assert.equal(await page.locator("#sourceFullscreen").getAttribute("aria-label"),"Code im Vollbild anzeigen");
    const sourceControl=await page.locator("#codeEditor").evaluate(el=>{
      const box=el.getBoundingClientRect();
      const icon=el.querySelector("#sourceFullscreen").getBoundingClientRect();
      return icon.left>=box.left&&icon.right<=box.right&&icon.top>=box.top&&icon.bottom<=box.bottom;
    });
    assert.ok(sourceControl,"Source fullscreen control must be inside the source textbox");
    // Resize by pointer and then use keyboard and reset. Both panes keep equal heights.
    const divider=page.locator("#splitDivider");
    const dividerBox=await divider.boundingBox();
    const originalSplit=Number(await divider.getAttribute("aria-valuenow"));
    await page.mouse.move(dividerBox.x+dividerBox.width/2,dividerBox.y+dividerBox.height/2);
    await page.mouse.down();
    await page.mouse.move(dividerBox.x+dividerBox.width/2+95,dividerBox.y+dividerBox.height/2,{steps:5});
    await page.mouse.up();
    const resized=Number(await divider.getAttribute("aria-valuenow"));
    assert.ok(resized>originalSplit+3,"Dragging should enlarge the code panel");
    const resizedHeights=await page.locator("#splitEditor").evaluate(el=>[
      el.querySelector("#codeEditor").getBoundingClientRect().height,
      el.querySelector("#previewFrame").getBoundingClientRect().height
    ]);
    assert.ok(Math.abs(resizedHeights[0]-resizedHeights[1])<=2,"Resizing must preserve equal panel heights");
    await divider.focus();
    await page.keyboard.press("ArrowLeft");
    assert.equal(Number(await divider.getAttribute("aria-valuenow")),Math.round(resized-5));
    await divider.dblclick();
    assert.equal(await divider.getAttribute("aria-valuenow"),"50","Double-click should restore 50:50");
    // Native fullscreen must be toggled from within each respective textbox.
    for(const [button,surface] of [["sourceFullscreen","codeEditor"],["previewFullscreen","previewFrame"]]){
      await page.locator("#"+button).click();
      assert.equal(await page.evaluate(()=>document.fullscreenElement?.id),surface,
        "Expected "+surface+" to enter browser fullscreen");
      await page.locator("#"+button).click();
      assert.equal(await page.evaluate(()=>document.fullscreenElement),null);
    }
    // Selected blocks describe their effect and insert the original course-compatible markup.
    await page.locator("#blockType").selectOption("timeline");
    assert.match(await page.locator("#blockDescription").textContent(),/Zeitachse/);
    const beforeBlock=await page.locator("#source").inputValue();
    await page.locator("#addBlock").click();
    assert.match(await page.locator("#source").inputValue(),/class="timeline"/);
    await page.locator("#source").fill(beforeBlock);
    // On a narrow viewport the stacked panes keep fullscreen buttons but hide the divider.
    await page.setViewportSize({width:900,height:800});
    assert.equal(await page.locator("#splitDivider").isVisible(),false);
    assert.equal(await page.locator("#codeEditor").isVisible(),true);
    assert.equal(await page.locator("#previewFrame").isVisible(),true);
    await page.setViewportSize({width:1280,height:720});
    await page.locator("#toggleSidebar").click();
    assert.equal(await page.locator("#courseSidebar").isVisible(),false,"Chapter navigation must collapse");
    assert.equal(await page.locator("#toggleSidebar").getAttribute("aria-expanded"),"false");
    await page.locator("#toggleSidebar").click();
    assert.equal(await page.locator("#courseSidebar").isVisible(),true,"Chapter navigation must expand");
    assert.equal(await page.locator("#toggleSidebar").getAttribute("aria-expanded"),"true");
    assert.ok((await page.locator("#sourceHighlight").innerHTML()).includes("tok-"),
      "Source preview must contain syntax highlighting tokens");
    const originalSource=await page.locator("#source").inputValue();
    await page.locator("#source").fill('<figure class="test" data-info="1 > 0" hidden><img src="bild.svg" alt="Sonne > Wolken"></figure>\\n<!-- Kommentar -->');
    const coloured=await page.locator("#sourceHighlight").evaluate(el=>({
      tags:[...el.querySelectorAll(".tok-tag")].map(n=>n.textContent),
      attrs:[...el.querySelectorAll(".tok-attr")].map(n=>n.textContent),
      strings:[...el.querySelectorAll(".tok-string")].map(n=>n.textContent),
      comments:[...el.querySelectorAll(".tok-comment")].map(n=>n.textContent),
      text:el.textContent
    }));
    assert(coloured.tags.includes("figure")&&coloured.tags.includes("img"),"HTML tag names highlighted");
    assert(["class","data-info","hidden","src","alt"].every(a=>coloured.attrs.includes(a)),"HTML attributes including boolean attributes highlighted");
    assert(coloured.strings.includes('"1 > 0"')&&coloured.strings.includes('"Sonne > Wolken"'),"Quoted > in HTML attribute values preserved");
    assert(coloured.comments.includes("<!-- Kommentar -->"),"HTML comments highlighted");
    assert(coloured.text.includes("<figure")&&coloured.text.includes("</figure>"),"Source remains readable");
    await page.locator("#source").fill(originalSource);
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
      columns:getComputedStyle(el).gridTemplateColumns,
      viewport:document.documentElement.clientWidth
    }));
    assert.equal(timelineStyle.display,"grid","Milestones must use published timeline styles");
    // A split-screen preview can be narrower than the site's mobile breakpoint.
    // Check the real responsive layout at its actual iframe width.
    if(timelineStyle.viewport<=620)
      assert.equal(timelineStyle.columns.split(" ").length,1,"Narrow preview must match mobile course layout");
    else
      assert.match(timelineStyle.columns,/104px/,"Wide preview year column must match site CSS");
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
    await page.locator('#section option[value="basis-neuron"]').waitFor({state:"attached"});
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
    await page.locator('#section option[value="perzeptron"]').waitFor({state:"attached"});
    await page.locator("#section").selectOption("perzeptron");
    await page.locator("#chapters button").filter({hasText:"030-perzeptron-3"}).click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/perzeptron/030-perzeptron-3.md");
    const fourthPreview=page.frameLocator("#preview");
    await fourthPreview.locator("table").first().waitFor();
    const fourthAccent=await fourthPreview.locator("html").evaluate(el=>
      getComputedStyle(el).getPropertyValue("--accent").trim());
    assert.equal(fourthAccent,"#076959","Fourth-year accent must remain green");

    // Structured glossary form edits one shared JSON file, with separate definitions.
    await page.reload();
    await page.locator("#editGlossary").click();
    await page.waitForFunction(()=>document.querySelector("#path")?.textContent==="kursseiten/glossar.json");
    assert(await page.locator("#glossaryEditor").isVisible());
    assert.equal(await page.locator("#splitEditor").evaluate(el=>el.classList.contains("preview-only")),true,
      "Glossary view must use the whole preview width");
    assert(!await page.locator("#codeEditor").isVisible(),"JSON must be edited through form fields");
    assert.equal(await page.locator("#glossaryTerms button").count(),29);
    await page.locator("#glossarySearch").fill("Token");
    assert.equal(await page.locator("#glossaryTerms button").count(),1);
    await page.locator("#glossaryTerms button").click();
    assert.notEqual(await page.locator("#glossaryBasis").inputValue(),await page.locator("#glossaryVertieft").inputValue());
    await page.locator("#glossaryBasis").fill("Ein Token ist ein Wort oder ein Stück davon.");
    await page.locator("#glossaryVertieft").fill("Ein Token ist die Einheit einer Tokenisierung im neuronalen Sprachmodell.");
    await page.locator("#glossaryPreviewLevel").selectOption("basis");
    const glossaryFrame=page.frameLocator("#preview");
    await glossaryFrame.locator(".glossary-entry .glossary-question").waitFor();
    assert.match(await glossaryFrame.locator(".glossary-entry").innerText(),/Ein Token ist ein Wort oder ein Stück davon/);
    assert.equal(await glossaryFrame.locator("html").evaluate(el=>getComputedStyle(el).getPropertyValue("--accent").trim()),"#3653a3");
    await glossaryFrame.locator("details.glossary-answer summary").click();
    assert(await glossaryFrame.locator("details.glossary-answer").evaluate(el=>el.open));
    await page.locator("#glossaryPreviewLevel").selectOption("vertiefung");
    await glossaryFrame.locator(".glossary-entry").waitFor();
    assert.match(await glossaryFrame.locator(".glossary-entry").innerText(),/Ein Token ist die Einheit einer Tokenisierung/);
    assert.equal(await glossaryFrame.locator("html").evaluate(el=>getComputedStyle(el).getPropertyValue("--accent").trim()),"#076959");
    await page.evaluate(()=>window.prompt=()=>"Testglossarbegriff");
    await page.locator("#glossaryAdd").click();
    assert.match(await page.locator("#glossaryId").innerText(),/testglossarbegriff/);
    await page.locator("#glossaryBasis").fill("Eine Erklärung für den Basiskurs.");
    await page.locator("#glossaryVertieft").fill("Eine genauere Erklärung für den vertieften Kurs.");
    await page.locator("#glossaryExample").fill("Ein konkretes Unterrichtsbeispiel.");
    await page.locator("#glossaryQuestion").fill("Wie kann man das erklären?");
    await page.locator("#glossaryAnswer").fill("Mit einem klaren Beispiel.");
    await page.locator("#stage").click();
    assert((await page.locator("#staged").innerText()).includes("kursseiten/glossar.json"));
    publishFailure=false; // Earlier simulated 502 must not affect the successful glossary publication test.
    await page.locator("#publish").click();
    await page.waitForFunction(()=>document.querySelector("#published")?.textContent?.includes("#123"));
    assert.equal(submitted.changes.length,1);
    assert.equal(submitted.changes[0].path,"kursseiten/glossar.json");
    const submittedGlossary=JSON.parse(submitted.changes[0].content);
    assert.equal(submittedGlossary.begriffe.length,30);
    assert.equal(submittedGlossary.begriffe.find(t=>t.id==="token").basis,"Ein Token ist ein Wort oder ein Stück davon.");
    assert.equal(submittedGlossary.begriffe.find(t=>t.id==="token").vertieft,"Ein Token ist die Einheit einer Tokenisierung im neuronalen Sprachmodell.");
    assert(submittedGlossary.begriffe.some(t=>t.id==="testglossarbegriff"));

    console.log("PASS admin AVIVA form, dynamic DL11, materials, chapter and atomic PR payload");
  }finally{
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
