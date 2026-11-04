/* Every teacher/grade has working chapter, AVIVA, material, glossary, solution
 * and PR interactions. GitHub API is mocked; no real draft is submitted. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const registry=require("../shared/course-sites.json").courses;
const keys={"bok/1-klasse":"basis","bok/4-klasse":"vertiefung","irn/1-klasse":"irn1","irn/4-klasse":"irn4"};
const chapters=registry.flatMap(profile=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,profile.manifest),"utf8"));
  return manifest.sections.flatMap(section=>{
    const dir=path.join(ROOT,profile.courseRoot,"kursseiten",section.id);
    return fs.readdirSync(dir).filter(f=>/^\d{3}-.*\.md$/.test(f))
      .map(f=>({path:profile.courseRoot+"/kursseiten/"+section.id+"/"+f,sha:"a".repeat(40)}));
  });
});
const server=http.createServer((req,res)=>{
  const rel=new URL(req.url,"http://localhost").pathname.replace(/^\//,"")||"projekt/admin/index.html";
  const clean=rel==="projekt/admin"||rel==="projekt/admin/"?"projekt/admin/index.html":rel;
  const shared=["course-model.js","course-rules.json","glossary-model.js"].includes(path.basename(clean));
  const absolute=path.resolve(ROOT,shared?"shared/"+path.basename(clean):clean.replace(/^projekt\//,"shared/portal/"));
  if(!absolute.startsWith(ROOT+path.sep)||(!shared&&!absolute.startsWith(path.join(ROOT,"shared/portal/admin")+path.sep)))return res.writeHead(404).end();
  fs.readFile(absolute,(error,data)=>{
    if(error)return res.writeHead(404).end();
    const suffix=path.extname(absolute);
    res.writeHead(200,{"Content-Type":suffix===".js"?"text/javascript":suffix===".css"?"text/css":suffix===".json"?"application/json":"text/html",
      "Content-Security-Policy":"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://fachschaft-informatik-kst.github.io; frame-src 'self' blob: https://fachschaft-informatik-kst.github.io; connect-src 'self'; base-uri 'none'"});
    res.end(data);
  });
});
(async()=>{
  await new Promise(r=>server.listen(0,"127.0.0.1",r));
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.route("**/api/session",route=>route.fulfill({json:{authenticated:true,login:"matrix-test"}}));
    await page.route("**/api/notebooks",route=>route.fulfill({json:{notebooks:[]}}));
    await page.route("**/api/chapters",route=>route.fulfill({json:{chapters}}));
    await page.route(/\/api\/file\?/,route=>{
      const rel=new URL(route.request().url()).searchParams.get("path");
      if(!rel||!rel.startsWith("kurse/")&&rel!=="shared/course-sites.json")
        return route.fulfill({status:400,json:{error:"Unknown resource"}});
      const file=path.resolve(ROOT,rel);
      if(!file.startsWith(ROOT+path.sep))return route.fulfill({status:400,json:{error:"Unsafe path"}});
      return route.fulfill({json:{path:rel,sha:"a".repeat(40),content:fs.readFileSync(file,"utf8")}});
    });
    let submitted=null;
    await page.route("**/api/publish",route=>{
      submitted=route.request().postDataJSON();
      return route.fulfill({json:{url:"https://github.com/example/matrix/pull/999",number:999}});
    });
    const url="http://127.0.0.1:"+server.address().port+"/projekt/admin/";
    await page.goto(url);
    await page.locator("#courseSelect option").first().waitFor({state:"attached"});
    assert.equal(await page.locator("#courseSelect option").count(),4);
    for(const profile of registry){
      const slug=profile.slug,root=profile.courseRoot;
      await page.locator("#courseSelect").selectOption(keys[slug]);
      const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,profile.manifest),"utf8"));
      const section=manifest.sections.find(section=>section.teaching);
      assert(section,slug+" has no teaching lessons");
      await page.locator("#section").selectOption(section.id);
      await page.locator("#chapters button").first().click();
      await page.waitForFunction(root=>document.querySelector("#path")?.textContent?.startsWith(root+"/kursseiten/"),root);
      assert.match(await page.locator("#preview").getAttribute("srcdoc"),/<section/);
      await page.locator("#editPlan").click();
      const plan=root+"/kursseiten/"+section.id+"/planung.json";
      await page.waitForFunction(plan=>document.querySelector("#path")?.textContent===plan,plan);
      assert(await page.locator("#formEditor").isVisible(),slug+" AVIVA form invisible");
      await page.frameLocator("#preview").locator(".phase-table tbody tr").first().waitFor();
      assert((await page.frameLocator("#preview").locator(".phase-table tbody tr").count())>=5,slug+" AVIVA row missing");
      await page.locator("#editMaterials").click();
      const material=root+"/kursseiten/"+section.id+"/materialien.md";
      await page.waitForFunction(material=>document.querySelector("#path")?.textContent===material,material);
      assert(await page.locator("#codeEditor").isVisible(),slug+" materials editor invisible");
      const content=await page.locator("#source").inputValue();
      await page.locator("#source").fill(content+"\n\n## Regressionstest "+profile.id+"\n\nEin unabhängiger Materialkoffer.\n");
      await page.frameLocator("#preview").locator("h2").filter({hasText:"Regressionstest "+profile.id}).waitFor();
      await page.locator("#stage").click();
      await page.waitForFunction(()=>document.querySelector("#pendingCount")?.textContent==="1");
      assert((await page.locator("#staged").innerText()).includes(material),slug+" staged file outside course root");
      await page.locator("#toggleChanges").click();
      const sent=page.waitForResponse(response=>response.url().includes("/api/publish")&&response.request().method()==="POST");
      await page.locator("#publish").click();
      await sent;
      await page.waitForFunction(()=>document.querySelector("#pendingCount")?.textContent==="0");
      assert.equal(submitted.changes.length,1,slug+" must submit one file");
      assert.equal(submitted.changes[0].path,material);
      assert(submitted.changes[0].content.includes("Regressionstest "+profile.id));
      await page.locator("#editSolutions").click();
      await page.waitForFunction(root=>document.querySelector("#path")?.textContent===root+"/lehrperson/musterloesungen.md",root);
      await page.locator("#editSolutionFields").click();
      await page.waitForFunction(root=>document.querySelector("#path")?.textContent===root+"/lehrperson/musterloesungen-felder.md",root);
      await page.locator("#editGlossary").click();
      await page.waitForFunction(root=>document.querySelector("#path")?.textContent===root+"/kursseiten/glossar.json",root);
      assert(await page.locator("#glossaryEditor").isVisible(),slug+" glossary editing unavailable");
      assert((await page.locator("#glossaryTerms button").count())>=5,slug+" glossary terms absent");
      assert.equal(await page.locator("#pendingCount").textContent(),"0",slug+" must clear staged changes on successful PR");
      console.log("PASS "+slug+": chapters, AVIVA, materials, private solutions, glossary, staged PR");
    }
    assert.deepEqual(errors,[],"Uncaught browser errors");
  } finally {
    await browser.close();
  }
})().then(()=>server.close(),error=>{console.error(error);server.close();process.exitCode=1;});
