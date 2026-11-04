/* Browser regression of the authenticated teacher portal with mocked private API. */
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
(async()=>{
  const {teacherShell,teacherThemeStylesheet,normalizeTeacherCourses,DEFAULT_COURSES}=
    await import("../admin-worker/src/teacher.mjs");
  const teacherCourses=normalizeTeacherCourses({version:1,courses:DEFAULT_COURSES});
  const irnTheme=DEFAULT_COURSES.find(course=>course.slug==="irn/4-klasse").theme.accent;
  const materialLessons=fs.readdirSync(path.join(ROOT,"kurse/bok/4-klasse/kursseiten"))
    .map(view=>path.join(ROOT,"kurse/bok/4-klasse/kursseiten",view,"planung.json"))
    .filter(file=>fs.existsSync(file))
    .flatMap(file=>JSON.parse(fs.readFileSync(file,"utf8")).lessons)
    .sort((a,b)=>a.order-b.order);
  let realIrnMaterials=false;
  const materialFor=(number,course="bok/4-klasse")=>{
    const lesson=materialLessons[number-1];
    const source=fs.readFileSync(path.join(ROOT,"kurse",course,"kursseiten",lesson.view,"materialien.md"),"utf8");
    const marker="<!-- lesson:"+lesson.id+" -->";
    return source.includes(marker)?source.split(marker)[1].split("<!-- lesson:")[0]:source;
  };
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
    const route=/^\/teacher\/(bok|irn)\/(1|4)-klasse\/(planung|materialien|musterloesungen)$/.exec(url.pathname);
    if(route){
      const html=teacherShell({course:route[1]+"/"+route[2]+"-klasse",kind:route[3]});
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}).end(html);return;
    }
    if(url.pathname==="/api/teacher"){
      const number=Number(url.searchParams.get("dl")||1);
      const kind=url.searchParams.get("kind");
      const base={kind,course:url.searchParams.get("course"),lessons,selectedNumber:number,
        selectedTitle:lessons[number-1]?.title||""};
      const data=kind==="planung"?{...base,lesson:fakeLesson(number)}:
        kind==="materialien"?{...base,intro:"",sections:[{title:"DL "+number,
          markdown:base.course==="bok/4-klasse"||realIrnMaterials&&base.course==="irn/4-klasse"?
            materialFor(number,base.course):"## Doppellektion "+number+"\n\nMaterial für DL "+number+
            "\n\n[Studio](studio/) · [Notebook](../lab/index.html?path=portal/basis_neuron.ipynb)"+
            " · [Lösung](materialien/downloads/Arbeitsblatt_Perzeptron_Lsg.md)"}]}:
        {...base,entries:[{field:"sample_"+number,question:"Welche Beobachtung gehört zu DL "+number+"?",
          questionFound:number!==8,questionSource:number===8?"thema":"original",answer:"Die Musterlösung zu DL "+number,
          courseLink:"https://example.org/course#lesson"+number}],
          notes:[{title:"Fachlicher Hinweis DL "+number,markdown:"**Fachlicher Hintergrund**"}]};
      res.writeHead(200,{"Content-Type":"application/json"}).end(JSON.stringify(data));return;
    }
    if(url.pathname==="/teacher-theme.css"){
      const course=url.searchParams.get("course");
      res.writeHead(200,{"Content-Type":"text/css"}).end(
        teacherThemeStylesheet(teacherCourses,course));
      return;
    }
    const files={"/teacher.js":"shared/portal/admin/teacher.js","/teacher.css":"shared/portal/admin/teacher.css",
      "/markdown-it.min.js":"shared/portal/admin/markdown-it.min.js"};
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
    await page.route("https://fachschaft-informatik-kst.github.io/ki-unterricht/bok/4-klasse/grafiken/dl01_*.jpg",
      route=>route.fulfill({contentType:"image/jpeg",body:fs.readFileSync(path.join(
        ROOT,"kurse/bok/4-klasse/assets/grafiken",new URL(route.request().url()).pathname.split("/").pop()))}));
    await page.goto(origin+"/teacher/bok/4-klasse/planung?dl=3");
    await page.locator(".lesson-heading h2").waitFor();
    assert.match(await page.locator(".lesson-heading h2").innerText(),/DL 03 · Ein Neuron/);
    assert.equal(await page.locator("#teacherCourseSelect").inputValue(),"bok/4-klasse");
    assert.equal(await page.locator("#teacherCourseSelect option").count(),4);
    assert.equal(await page.locator('#teacherCourseSelect option:disabled').count(),0);
    assert.match(await page.locator("#teacherCourseSelect").innerText(),/IRN · 1. Klasse/);
    assert.match(await page.locator(".course-picker-note").innerText(),/in Vorbereitung/);
    assert.match(await page.locator(".course-context").innerText(),/BOK · 4. Klasse/);

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
    assert.match(await page.locator(".materials-content").innerText(),/A und B vergleichen/);
    assert.equal(await page.locator(".material-phase").count(),5);
    await page.locator('.area-nav a[href*="/musterloesungen"]').click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 06"}).waitFor();
    assert.match(await page.locator(".solution-question").innerText(),/Welche Beobachtung gehört zu DL 6/);
    assert.match(await page.locator(".sample-answer").innerText(),/Musterlösung zu DL 6/);
    assert.equal(await page.locator(".solution-meta code").innerText(),"sample_6");
    await page.locator("#lessonNav a[data-dl='8']").click();
    await page.locator(".lesson-heading h2").filter({hasText:"DL 08"}).waitFor();
    assert.match(await page.locator(".solution-question").innerText(),/DL 8/);
    assert.match(await page.locator(".solution-meta span").innerText(),/Thema \/ Teilaufgabe/i);
    assert.equal(await page.locator(".question-source a").count(),1);
    assert.equal(await page.locator(".question-hint").count(),0);
    assert.doesNotMatch(await page.locator("#teacherContent").innerText(),/Der genaue Wortlaut wurde nicht eindeutig erkannt/);

    await page.goto(origin+"/teacher/bok/4-klasse/materialien?dl=1");
    for(let number=1;number<=10;number++){
      if(number!==1)await page.locator("#lessonNav a[data-dl='"+number+"']").click();
      await page.waitForFunction(n=>document.querySelector(".lesson-heading h2")?.textContent.includes(
        "DL "+String(n).padStart(2,"0")),number);
      assert.equal(await page.locator(".material-phase").count(),5,"Five AVIVA cards for DL "+number);
      assert.equal(await page.locator(".material-phase-nav a").count(),5);
      assert.deepEqual(await page.locator(".material-phase-label").allTextContents(),
        materialLessons[number-1].phases.map(p=>p.phase+" · "+p.minutes+" Min."));
      assert.equal(await page.locator(".material-table-scroll").count()>0,true);
      if(number===1){
        assert.match(await page.locator(".materials-workshop").innerText(),/Fünf Wenn-dann-Regeln/);
        assert.equal(await page.locator(".material-gallery img").count(),2);
        await page.waitForFunction(()=>[...document.querySelectorAll(".material-gallery img")]
          .every(image=>image.complete&&image.naturalWidth>0));
        assert.equal(await page.locator('a[href$="dl01_intelligenz_regeln.pdf"]').count(),0);
        await page.setViewportSize({width:390,height:844});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,
          "Material cards must not overflow on mobile");
        await page.emulateMedia({media:"print"});
        assert.equal(await page.locator(".material-phase-nav").isVisible(),false);
        assert.equal(await page.locator(".material-phase").first().isVisible(),true);
        await page.emulateMedia({media:"screen"});
        await page.setViewportSize({width:1300,height:900});
      }
    }

    await page.goto(origin+"/teacher/bok/4-klasse/musterloesungen?dl=8");
    await page.locator(".lesson-heading h2").waitFor();

    // Switching courses must retain the material area, but start at DL 01
    // because DL numbers refer to different content in another course.
    await page.locator("#teacherCourseSelect").selectOption("bok/1-klasse");
    await page.waitForURL("**/teacher/bok/1-klasse/musterloesungen?dl=1");
    await page.locator(".lesson-heading h2").filter({hasText:"DL 01"}).waitFor();
    assert.equal(await page.locator("#teacherCourseSelect").inputValue(),"bok/1-klasse");
    assert.match(await page.locator(".course-context").innerText(),/BOK · 1. Klasse/);
    assert.equal(await page.locator("#lessonNav a[aria-current=page]").count(),1);
    const accent=await page.locator("body").evaluate(el=>getComputedStyle(el).getPropertyValue("--accent").trim());
    assert.equal(accent,"#3653a3","Selected course should have the registry accent");
    await page.locator("#teacherCourseSelect").selectOption("irn/4-klasse");
    await page.waitForURL("**/teacher/irn/4-klasse/musterloesungen?dl=1");
    await page.locator(".lesson-heading h2").filter({hasText:"DL 01"}).waitFor();
    assert.equal(await page.locator("#teacherCourseSelect").inputValue(),"irn/4-klasse");
    assert.match(await page.locator(".course-context").innerText(),/IRN · 4. Klasse/);
    const irnAccent=await page.locator("body").evaluate(el=>getComputedStyle(el).getPropertyValue("--accent").trim());
    assert.equal(irnAccent,irnTheme);
    await page.locator('.area-nav a[href*="/materialien"]').click();
    await page.locator(".materials-content").waitFor();
    const site="https://fachschaft-informatik-kst.github.io/ki-unterricht/";
    assert.equal(await page.locator(".material-phase").count(),0,
      "Legacy material without phase headings must remain readable");
    assert.equal(await page.getByRole("link",{name:"Studio",exact:true}).getAttribute("href"),site+"irn/4-klasse/studio/");
    const notebook=new URL(await page.getByRole("link",{name:"Notebook",exact:true}).getAttribute("href"));
    assert.equal(notebook.searchParams.get("path"),"portal/irn/4-klasse/basis_neuron.ipynb");
    const solution=await page.getByRole("link",{name:"Lösung",exact:true}).getAttribute("href");
    assert.equal(new URL(solution,page.url()).searchParams.get("course"),"irn/4-klasse");

    realIrnMaterials=true;
    await page.reload();
    for(let number=1;number<=10;number++){
      if(number!==1)await page.locator("#lessonNav a[data-dl='"+number+"']").click();
      await page.waitForFunction(n=>document.querySelector(".lesson-heading h2")?.textContent.includes(
        "DL "+String(n).padStart(2,"0")),number);
      assert.equal(await page.locator(".material-phase").count(),5,"IRN4 phase cards for DL "+number);
      assert.deepEqual(await page.locator(".material-phase-label").allTextContents(),
        materialLessons[number-1].phases.map(p=>p.phase+" · "+p.minutes+" Min."));
      if(number===1){
        assert.equal(await page.locator('a[href$="dl01_intelligenz_regeln.pdf"]').count(),0);
        assert.equal(await page.locator(".material-gallery img").count(),2);
        assert.equal(await page.locator(".material-phase-index").first().evaluate(
          el=>getComputedStyle(el).backgroundColor),
          "rgb("+irnTheme.slice(1).match(/../g).map(value=>parseInt(value,16)).join(", ")+")");
      }
    }
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator(".lesson-link").count(),10);
    assert(await page.locator(".lesson-sidebar").isVisible(),"Mobile DL navigation must remain visible");
    console.log("PASS teacher browser: course switch, DL navigation, AVIVA role colors, kit and precise solutions");
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
