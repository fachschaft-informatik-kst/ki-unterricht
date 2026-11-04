/* Real Python startup must work on every course-scoped notebook route. */
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const path=require("node:path");
const {chromium}=require("playwright");
const courses=require("../shared/course-sites.json").courses.filter(c=>c.status==="published"&&(!process.argv[2]||c.slug===process.argv[2]));
assert(courses.length,"No published courses selected");
const site=process.env.PORTAL_SITE||path.resolve(__dirname,"../dist");
const base="http://127.0.0.1:8774";
const repeats=Number(process.env.KI_RUNTIME_REPEATS||1);
assert(Number.isInteger(repeats)&&repeats>0,"KI_RUNTIME_REPEATS must be a positive integer");

(async()=>{
  const server=spawn("python",["-m","http.server","8774","--bind","127.0.0.1","--directory",site],{stdio:"ignore"});
  let browser;
  try{
    let ready=false;
    for(let attempt=0;attempt<50;attempt++){
      try{
        if((await fetch(base+"/kurse.html")).ok){ready=true;break;}
      }catch(error){
        if(error.cause?.code!=="ECONNREFUSED")throw error;
      }
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert(ready,"Course test server did not start");
    browser=await chromium.launch({headless:true});
    for(let run=1;run<=repeats;run++)for(const course of courses){
      const context=await browser.newContext();
      try{
        const page=await context.newPage();
        const errors=[];
        const diagnostics=[];
        const pending=new Map();
        const started=Date.now();
        const record=message=>diagnostics.push({ms:Date.now()-started,...message});
        page.on("console",message=>{
          if(["error","warning"].includes(message.type()))record({console:message.type(),text:message.text()});
        });
        page.on("request",request=>pending.set(request,Date.now()));
        page.on("requestfinished",request=>pending.delete(request));
        page.on("requestfailed",request=>{
          pending.delete(request);
          record({request:request.url(),error:request.failure()?.errorText});
        });
        page.on("response",response=>{
          if(response.status()>=400)record({request:response.url(),status:response.status()});
        });
        await page.exposeFunction("recordNotebookStage",data=>record({bridge:data}));
        await page.addInitScript(()=>{
          window.addEventListener("message",event=>{
            if(event.origin!==location.origin||event.data?.channel!=="ki-portal-v1")return;
            const {type,phase,ready,error}=event.data;
            if(type==="milestone"||type==="ready")window.recordNotebookStage({type,phase,ready,error});
          });
        });
        page.on("pageerror",error=>errors.push(error.message));
        const basic=course.grade===1;
        const section=basic?"basis-neuron":"perzeptron";
        const name=basic?"basis_neuron.ipynb":"perzeptron_und_neuronale_netze.ipynb";
        const frame=basic?"#basis-lab-frame":"#project-frame";
        const loader=basic?"#basis-lab-loading":"#project-lab-loading";
        await page.goto(base+"/"+course.slug+"/#"+section);
        await page.locator("#"+section+" .ki-notebook-launch").first().click();
        await page.waitForFunction(selector=>{
          const loading=document.querySelector(selector);
          return loading?.dataset.state==="ready"&&loading.hidden;
        },loader,{timeout:180000}).catch(async error=>{
          console.error(course.slug+": "+await page.locator(loader).innerText());
          console.error(await page.frameLocator(frame).locator("body").innerText());
          console.error(errors);
          console.error(JSON.stringify({diagnostics,pending:[...pending].map(([request,time])=>({
            url:request.url(),ms:Date.now()-time
          }))},null,2));
          throw error;
        });
        const url=new URL(await page.locator(frame).getAttribute("src"),page.url());
        assert.equal(url.searchParams.get("path"),"portal/"+course.slug+"/"+name);
        await page.frameLocator(frame).locator(".jupyter-widgets").first().waitFor({state:"visible",timeout:20000});
        assert.equal(await page.frameLocator(frame).locator(".jp-OutputArea-error").count(),0);
        assert.deepEqual(errors,[]);
        console.log("PASS "+course.slug+" ("+run+"/"+repeats+", "+(Date.now()-started)+" ms): real Python, own notebook path and rendered neuron widgets");
      }finally{await context.close();}
    }
  }finally{
    await browser?.close();
    server.kill();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
