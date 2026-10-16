/* Browser regression: guided AVIVA form -> new lesson -> materials -> one PR. */
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const plan=fs.readFileSync(path.join(ROOT,"projekt/kurs.json"),"utf8");
const files=[
  "kursseiten/einstieg/000-einstieg.md",
  "kursseiten/einstieg/010-einstieg-1.md"
];
const server=http.createServer((req,res)=>{
  const location=new URL(req.url,"http://localhost").pathname;
  const relative=location==="/projekt/admin/"?"projekt/admin/index.html":location.replace(/^\//,"");
  const file=path.resolve(ROOT,relative);
  if(!file.startsWith(ROOT+path.sep)||!file.startsWith(path.join(ROOT,"projekt/admin")+path.sep)){
    res.writeHead(404).end();return;
  }
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    res.writeHead(200,{"Content-Type":ext===".js"?"text/javascript":ext===".css"?"text/css":"text/html"});
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
    await page.route("**/api/chapters",route=>route.fulfill({json:{
      chapters:files.map(path=>({path,sha:"a".repeat(40)}))
    }}));
    await page.route("**/api/file?*",route=>{
      const p=new URL(route.request().url()).searchParams.get("path");
      const content=p==="projekt/kurs.json"?plan:fs.readFileSync(path.join(ROOT,p),"utf8");
      return route.fulfill({json:{path:p,sha:"a".repeat(40),content}});
    });
    let submitted=null;
    await page.route("**/api/publish",route=>{
      submitted=route.request().postDataJSON();
      return route.fulfill({json:{url:"https://github.com/example/repo/pull/123",number:123}});
    });
    await page.goto("http://127.0.0.1:"+server.address().port+"/projekt/admin/");
    await page.locator("#editPlan").click();
    assert.equal(await page.locator("#planEditor").isVisible(),true);
    assert.equal(await page.locator("#source").isVisible(),false);
    assert.match(await page.locator("#planTotal").textContent(),/90 von 90/);
    await page.locator("#planFields input").first().fill("Was ist KI? – Überarbeitet");
    await page.locator("#stage").click();
    await page.evaluate(()=>{
      const responses=["Vertiefung: KI im Alltag","Einstieg und Auftrag"];
      window.prompt=()=>responses.shift()??null;
    });
    await page.locator("#createLesson").click();
    assert.equal(await page.locator("#section").inputValue(),"dl-11");
    assert.equal(await page.locator("#planLesson").inputValue(),"10");
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
    assert.match(await page.locator("#path").textContent(),/lehrperson\/ergaenzungen\/dl-11.md/);
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
    await page.locator("#chapters button").first().click();
    assert.match(await page.locator("#path").textContent(),/kursseiten\/dl-11\//);
    await page.locator("#source").fill((await page.locator("#source").inputValue())+"\nEin eigenes Beispiel.\n");
    await page.locator("#stage").click();
    await page.locator("#publish").click();
    assert.ok(submitted);
    const names=submitted.changes.map(c=>c.path).sort();
    assert.deepEqual(names.filter(n=>!n.startsWith("projekt/grafiken/uploads/")),[
      "kursseiten/dl-11/010-einstieg-und-auftrag.md",
      "lehrperson/ergaenzungen/dl-11.md",
      "projekt/kurs.json"
    ]);
    assert.equal(names.filter(n=>/^projekt\/grafiken\/uploads\/test-[a-f0-9]{8}\.png$/.test(n)).length,1);
    const updated=JSON.parse(submitted.changes.find(c=>c.path==="projekt/kurs.json").content);
    assert.equal(updated.lessons.length,11);
    assert.equal(updated.lessons[0].title,"Was ist KI? – Überarbeitet");
    assert.equal(updated.lessons[10].view,"dl-11");
    assert.equal(updated.lessons[10].phases.reduce((n,p)=>n+p.minutes,0),90);
    assert.equal(updated.lessons[10].phases[0].schritte.length,3);
    assert.equal(updated.lessons[10].phases[0].schritte.at(-1).art,"Ergebnis");
    assert.equal(updated.lessons[10].phases[0].schritte.reduce((n,s)=>n+Number(s.min||0),0),6);
    assert.match(await page.locator("#published").textContent(),/#123/);
    console.log("PASS admin AVIVA form, dynamic DL11, materials, chapter and atomic PR payload");
  }finally{
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
