/* Technical autostart contract: trusted course paths, immutable setup, widget order. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'extensions/ki-autostart/index.js'),'utf8')
  .replace(/^import .*;\s*$/gm,'').replace('export default','globalThis.plugin =');
const setup={id:'cell-setup',cell_type:'code',
  metadata:{tags:['ki-autostart']},source:'print("setup")'};
const manual={id:'cell-manual',cell_type:'code',metadata:{tags:[]},source:'print("manual")'};
async function simulate(notebookPath,modified=false){
 const executed=[],statuses=[],activated=[];
 const panel={
   context:{path:notebookPath,ready:Promise.resolve()},
   content:{widgets:[setup,manual].map(c=>({model:{
     id:c.id,type:'code',sharedModel:{getSource:()=>modified&&c.id==='cell-setup'?'edited()':c.source}}}))},
   disposed:{connect(){}},isDisposed:false,
   sessionContext:{ready:Promise.resolve(),session:{kernel:{}}},
   toolbar:{addItem(k,v){statuses.push(v);}}
 };
 const ctx={URL,URLSearchParams,console,
   location:{href:'https://example.org/lab/index.html',search:''},
   fetch:async()=>({ok:true,json:async()=>({cells:[setup,manual]})}),
   sessionStorage:{setItem(){},getItem(){return null},removeItem(){}},
   performance:{getEntriesByType(){return []}},
   INotebookTracker:{},CodeCell:{execute:async cell=>{
     executed.push(cell.model.id);return {content:{status:'ok'}};}},
   Widget:class{constructor(){this.node={style:{},setAttribute(){},textContent:''}}}
 };
 vm.runInNewContext(script,ctx);
 const tracker={widgetAdded:{connect(){}},forEach(fn){fn(panel)}};
 await ctx.plugin.activate({activatePlugin:async name=>activated.push(name),restored:Promise.resolve()},tracker);
 await new Promise(resolve=>setImmediate(resolve));
 return {executed,statuses,activated};
}
(async()=>{
 const normal=await simulate('portal/bok/4-klasse/perzeptron_und_neuronale_netze.ipynb');
 assert.deepEqual(normal.executed,['cell-setup']);
 assert.equal(normal.statuses[0].node.textContent,'✓ Bereit');
 assert.deepEqual(normal.activated,['@jupyter-widgets/jupyterlab-manager:plugin']);
 const saved=await simulate('portal/irn/4-klasse/perzeptron_und_neuronale_netze.ipynb',true);
 assert.equal(saved.executed.length,0,'Edited cells must never autostart');
 const project=await simulate('portal/bok/4-klasse/ki_tandemprojekt.ipynb');
 assert.deepEqual(project.executed,['cell-setup'],'Project notebooks must run from course workspace');
 const unknown=await simulate('portal/bok/4-klasse/untrusted_upload.ipynb');
 assert.equal(unknown.executed.length,0,'Untrusted notebooks must never autostart');
 console.log('PASS trusted course autostart, immutable setup and project notebook paths');
})().catch(error=>{console.error(error);process.exitCode=1});
