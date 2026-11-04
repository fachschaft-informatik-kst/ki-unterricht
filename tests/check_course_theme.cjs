const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const path=require("node:path");
const fs=require("node:fs");
const {chromium}=require("playwright");
const courses=require("../shared/course-sites.json").courses.filter(course=>course.status==="published");
const site=process.env.PORTAL_SITE||path.resolve(__dirname,"../dist");
(async()=>{
  const server=spawn("python",["-m","http.server","8779","--bind","127.0.0.1","--directory",site],{stdio:"ignore"});
  let browser;
  try{
    for(let i=0;i<50;i++){
      try{if((await fetch("http://127.0.0.1:8779/kurse.html")).ok)break;}
      catch(error){if(error.cause?.code!=="ECONNREFUSED")throw error;}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage();
    for(const course of courses){
      await page.goto("http://127.0.0.1:8779/"+course.slug+"/");
      const colors=await page.evaluate(()=>{
        const style=getComputedStyle(document.body);
        const accent=style.getPropertyValue("--accent").trim();
        const probe=document.createElement("span");
        probe.style.color=accent;document.body.append(probe);
        const rgb=getComputedStyle(probe).color;
        probe.style.color=style.getPropertyValue("--course-glow").trim();
        const glow=getComputedStyle(probe).color;
        probe.style.color=style.getPropertyValue("--course-sidebar").trim();
        const sidebarColor=getComputedStyle(probe).color;
        probe.remove();
        const mark=document.querySelector(".brand .mark");
        return {accent,rgb,glow,sidebarColor,mark:getComputedStyle(mark).backgroundImage,
          sidebar:getComputedStyle(document.querySelector(".sidebar")).backgroundImage,
          background:style.backgroundImage,art:getComputedStyle(document.body,"::before").backgroundImage};
      });
      assert.equal(colors.accent,course.theme.accent);
      assert(colors.mark.includes(colors.rgb),course.slug+": brand logo must use course accent");
      assert(colors.art.includes("netz_hintergrund_kurs.svg"));
      assert(colors.sidebar.includes(colors.sidebarColor),course.slug+": sidebar tint");
      assert(colors.background.includes(colors.glow),course.slug+": background glow");
      for(const file of ["grafiken/netz_hintergrund_kurs.svg","favicon.svg"]){
        const svg=fs.readFileSync(path.join(site,course.slug,file),"utf8");
        assert(svg.includes(course.theme.accent),course.slug+": "+file);
        if(course.theme.accent!=="#076959")assert(!svg.includes("#076959"),"No inherited green in course artwork");
      }
      await page.goto("http://127.0.0.1:8779/"+course.slug+"/studio/");
      assert.equal(await page.locator("body").evaluate(el=>getComputedStyle(el).getPropertyValue("--accent").trim()),course.theme.accent);
      console.log("PASS "+course.slug+": course palette, brand, background artwork, favicon and studio");
    }
  }finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
