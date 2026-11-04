// Execute the bundled reconnect against an instance whose IndexedDB is not ready.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../dist/build/927.399dde7.js"),"utf8");
const start=source.indexOf("function(e){g(e);for(var n=v[e.name]");
const end=source.indexOf("}(e).then(",start);
assert(start>=0&&end>start,"Expected pinned localForage reconnect implementation");
const reconnect=source.slice(start,end+1);
async function simulate(code,initializing){
  let closed=0;
  const ready={_dbInfo:{db:{close(){closed++;}}}};
  const waiting={_dbInfo:initializing?null:{db:null}};
  const stores={test:{forages:[ready,waiting]}};
  const db={name:"test",db:ready._dbInfo.db};
  const connection={};
  const fn=vm.runInNewContext("("+code+")",{
    v:stores,g(){},S:async()=>connection,N:()=>false,E:()=>assert.fail("Unexpected upgrade"),
    w:(_,error)=>assert.fail("Reconnect rejected: "+error)
  });
  await fn(db);
  assert.equal(closed,1);
  assert.equal(ready._dbInfo.db,connection);
  assert.equal(db.db,connection);
  if(initializing)assert.equal(waiting._dbInfo,null,"Initialization retains ownership of its store");
  else assert.equal(waiting._dbInfo.db,connection,"All ready stores get the reconnected database");
}
(async()=>{
  await simulate(reconnect,true);
  await simulate(reconnect,false);
  const original=reconnect
    .replace("o._dbInfo&&o._dbInfo.db&&","o._dbInfo.db&&")
    .replace("t[o]._dbInfo&&(t[o]._dbInfo.db=r)","t[o]._dbInfo.db=r");
  assert.notEqual(original,reconnect,"Build must include the storage race fix");
  await assert.rejects(simulate(original,true),/Cannot read properties of null/);
  console.log("PASS IndexedDB reconnect with initializing and ready stores; original race reproduced");
})().catch(error=>{console.error(error);process.exitCode=1;});
