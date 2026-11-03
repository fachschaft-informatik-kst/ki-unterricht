// Run the SAME probe notebook in two separately built JupyterLite sites.
// Requires playwright-core and Chromium; prints measured timings, never guesses.
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const urls={pyodide:process.env.PYODIDE_BENCH_URL,xeus:process.env.XEUS_BENCH_URL};
if(!urls.pyodide||!urls.xeus){
 console.error('Set PYODIDE_BENCH_URL and XEUS_BENCH_URL to lab/index.html?path=xeus_probe.ipynb');
 process.exit(2);
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:JSON.parse(process.env.CHROMIUM_ARGS||'[]')});
 const results=[];
 try{
  for(const [kernel,url] of Object.entries(urls)){
   // First fresh browser context, then new page with the same browser cache.
   const context=await browser.newContext();
   for(const iteration of ['cold','warm']){
    const page=await context.newPage();
    const t0=Date.now();
    await page.goto(url);
    const first=page.locator('.jp-CodeCell').first();
    await first.locator('.cm-content').waitFor({timeout:120000});
    const uiMs=Date.now()-t0;
    await first.locator('.cm-content').click();
    await page.keyboard.press('Shift+Enter');
    await first.locator('.jp-OutputArea').getByText('KI_KERNEL_BENCH_OK',{exact:false}).waitFor({timeout:180000});
    const readyMs=Date.now()-t0;
    results.push({kernel,iteration,uiMs,readyMs});
    console.log(kernel,iteration,'UI',uiMs+'ms','usable Python',readyMs+'ms');
    await page.close();
   }
   await context.close();
  }
  const success=results.length===4;
  assert(success);
  const report=process.env.KI_BENCH_REPORT;
  if(report)fs.writeFileSync(report,JSON.stringify({schema:'ki-kernel-benchmark-v1',results},null,2)+'\n');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
