/* Browser regression of the authenticated teacher portal with mocked private API. */
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
(async()=>{
  const {teacherShell}=await import("../admin-worker/src/teacher.mjs");
  const lessons=Array.from({length:10},(_,i)=>({
    id:"dl-"+(i+1),number:i+1,title:["Was ist KI?","Lernarten","Ein Neuron",
      "Neuronale Netze","Projektstart","Modellvergleich","Projektabschluss",
      "Fremdmodell prüfen","Sprachmodelle","Gesellschaft"][i],view:"projekt"
  }));
  const fakeLesson=n=>({...lessons[n-1],goal:"Lernziel für DL "+n,
    question:"Leitfrage DL "+n,product:"Lernprodukt "+n,
    phases:[{phase:"Ankommen",titel:"Start",minutes:20,schritte:[
      {wer:"Lehrperson",text:"Input der Lehrperson",min:5},
      {wer:"Einzeln",text:"Einzelarbeit",min:5},
      {wer:"Tandem",text:"Gruppenarbeit",min:5},
      {wer:"Klasse gemeinsam",text:"Plenum",min:5},
      {wer:"Ergebnis",text:"Sicherung"}]}]});
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,"http://127.0.0.1");
    const route=/^\/teacher\/bok\/4-klasse\/(planung|materialien|musterloesungen)$/.exec(url.pathname);
    if(route){
      const html=teacherShell({course:"bok/4-klasse",kind:route[1]});
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}).end(html);return;
    }
    if(url.pathname==="/api/teacher"){
      const number=Number(url.searchParams.get("dl")||1);
      const kind=url.searchParams.get("kind");
      const base={kind,course:"bok/4-klasse",lessons,selectedNumber:number,
        selectedTitle:lessons[number-1]?.title||""};
      const data=kind==="planung"?{...base,lesson:fakeLesson(number)}:
        kind==="materialien"?{...base,intro:"",sections:[{title:"DL "+number,
          markdown:"## Doppellektion "+number+"\n\nMaterial für DL "+number}]}:
        {...base,entries:[{field:"sample_"+number,question:"Welche Beobachtung gehört zu DL "+number+"?",
          questionFound:true,answer:"Die Musterlösung zu DL "+number,
          courseLink:"https://example.org/course#lesson"+number}],
          notes:[{title:"Fachlicher Hinweis DL "+number,markdown:"**Fachlicher Hintergrund**"}]};
      res.writeHead(200,{"Content-Type":"application/json"}).end(JSON.stringify(data));return;
    }
    const files={"/teacher.js":"projekt/admin/teacher.js","/teacher.css":"projekt/admin/teacher.css",
      "/markdown-it.min.js":"projekt/admin/markdown-it.min.js"};
    if(files[url.pathname]){
      const file=path.join(ROOT,files[url.pathname]);
      res.writeHead(200,{"Content-Type":url.pathname.endsWith(".css")?"text/css":"text/javascript"});
      fs.createReadStream(file).pipe(res);return;
    }
    res.writeHead(404).end();
  });
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin="http://127.0.0.1:"+server.address().port;
  let browser;
  try{
    browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
    const page=await browser.newPage({viewport:{width:1300,height:900}});
    await page.goto(origin+"/teacher/bok/4-klasse/planung?dl=3");
    await page.locator(".lesson-heading h2").waitFor();
    assert.match(await page.locator(".lesson-heading h2").innerText(),/DL 03 · Ein Neuron/);
    assert.equal(await page.locator("#lessonNav a").count(),10);
    assert.equal(await page.locator("#lessonNav a[aria-current=page]").count(),1);
    assert.match(await page.locator("#lessonNav a[aria-current=page]").innerText(),/Ein Neuron/);
    for(const kind of ["wer-l","wer-e","wer-t","wer-k","wer-r"]){
      const row=page.locator(".phase-table tr."+kind);
      assert.equal(await row.count(),1,"Missing role row "+kind);
      const bg=await row.locator("td").first().evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.notEqual(bg,"rgb(255, 255, 255)","Colored role must be visible: "+kind);
      assert.notEqual(bg,"rgba(0, 0, 0, 0)");
    }
    assert.equal(await page.locator(".role-legend span").count(),5);
    await page.locator("#lessonNav a[data-dl='6']").click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 06"}).waitFor();
    assert.match(page.url(),/dl=6/);
    assert.match(await page.locator("#lessonNav a[aria-current=page]").innerText(),/Modellvergleich/);
    await page.locator('.area-nav a[href*="/materialien"]').click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 06"}).waitFor();
    assert.match(await page.locator(".materials-content").innerText(),/Material für DL 6/);
    await page.locator('.area-nav a[href*="/musterloesungen"]').click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 06"}).waitFor();
    assert.match(await page.locator(".solution-question").innerText(),/Welche Beobachtung gehört zu DL 6/);
    assert.match(await page.locator(".sample-answer").innerText(),/Musterlösung zu DL 6/);
    assert.equal(await page.locator(".solution-meta code").innerText(),"sample_6");
    await page.locator("#lessonNav a[data-dl='8']").click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 08"}).waitFor();
    assert.match(await page.locator(".solution-question").innerText(),/DL 8/);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator(".lesson-link").count(),10);
    assert(await page.locator(".lesson-sidebar").isVisible(),"Mobile DL navigation must remain visible");
    console.log("PASS teacher browser: DL navigation, selected-state, AVIVA role colors, kit and precise solutions");
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
