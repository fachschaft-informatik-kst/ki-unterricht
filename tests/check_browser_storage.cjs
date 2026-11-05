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
const serviceWorker=fs.readFileSync(path.resolve(__dirname,"../dist/service-worker.js"),"utf8");
const driveStart=serviceWorker.indexOf("async function broadcastOne(");
const driveEnd=serviceWorker.indexOf("async function openCache(",driveStart);
assert(driveStart>=0&&driveEnd>driveStart,"Expected pinned service-worker drive bridge");
const driveRequest=serviceWorker.slice(driveStart,driveEnd);
async function checkDriveRequests(){
  const listeners=new Set(),sent=[],errors=[];
  const broadcast={
    onmessage:null,
    addEventListener(type,listener){assert.equal(type,"message");listeners.add(listener);},
    removeEventListener(type,listener){assert.equal(type,"message");listeners.delete(listener);},
    postMessage(message){sent.push(message);},
    reply(data){
      const event={data};
      this.onmessage?.(event);
      for(const listener of [...listeners])listener(event);
    }
  };
  let sequence=0;
  const timers=new Map();
  const request=vm.runInNewContext("("+driveRequest+")",{
    broadcast,Response,console:{error:(...args)=>errors.push(args)},crypto:{randomUUID:()=>String(++sequence)},
    setTimeout(fn){const id=Symbol();timers.set(id,fn);return id;},
    clearTimeout(id){timers.delete(id);}
  });
  const first=request({json:async()=>({method:"getattr",path:"first.py"})});
  const second=request({json:async()=>({method:"get",path:"second.py"})});
  await new Promise(setImmediate);
  assert.equal(sent.length,2);
  assert.notEqual(sent[0].kiDriveRequestId,sent[1].kiDriveRequestId);
  const reply={channel:{postMessage:data=>broadcast.reply(data)}};
  const worker=fs.readFileSync(path.resolve(__dirname,
    "../dist/extensions/@jupyterlite/pyodide-kernel-extension/static/352.3014c3141745cb055fab.js"),"utf8");
  const expression="this._channel.postMessage(t.kiDriveRequestId?{kiDriveRequestId:t.kiDriveRequestId,data:i}:i)";
  assert(worker.includes(expression),"Kernel must echo correlated drive request IDs");
  const respond=vm.runInNewContext("(function(t,i){"+expression+"})");
  const core=fs.readFileSync(path.resolve(__dirname,"../dist/build/649.062c1f9.js"),"utf8");
  const coreExpression="this._channel.postMessage(e.kiDriveRequestId?{kiDriveRequestId:e.kiDriveRequestId,data:n}:n)";
  assert(core.includes(coreExpression),"JupyterLite core must echo correlated drive request IDs");
  const coreRespond=vm.runInNewContext("(function(e,n){"+coreExpression+"})");
  const send=(message,data)=>respond.call({_channel:reply.channel},message,data);
  coreRespond.call({_channel:reply.channel},sent[1],{content:"second file"});
  send(sent[0],{atime:"2026-01-01T00:00:00Z"});
  send(sent[1],{content:"late duplicate"});
  assert.deepEqual(await (await first).json(),{atime:"2026-01-01T00:00:00Z"});
  assert.deepEqual(await (await second).json(),{content:"second file"});
  assert.equal(listeners.size,0,"Completed requests remove their listeners");
  assert.equal(timers.size,0,"Completed requests remove their timeout timers");
  const third=request({json:async()=>({method:"get",path:"third.py"})});
  await new Promise(setImmediate);
  send(sent[0],{content:"old response"});
  assert.equal(listeners.size,1,"A late response cannot complete another request");
  send(sent[2],{content:"third file"});
  assert.deepEqual(await (await third).json(),{content:"third file"});
  const timedOut=request({json:async()=>({method:"get",path:"missing.py"})});
  await new Promise(setImmediate);
  for(const timer of timers.values())timer();
  assert.equal((await timedOut).status,504,"Missing drive replies fail explicitly");
  assert.equal(listeners.size,0,"Timeout removes its response listener");
  assert.equal(errors.length,1,"Drive timeout is logged explicitly");
  assert(errors[0].includes("missing.py"));
  const original=vm.runInNewContext(
    '(async function(e){const a=new Promise(resolve=>{broadcast.onmessage=event=>resolve(event.data)});'
    +'const t=await e.json();broadcast.postMessage(t);return a;})',{broadcast});
  let originalFirstDone=false,originalSecondDone=false;
  original({json:async()=>({method:"getattr"})}).then(()=>{originalFirstDone=true;});
  original({json:async()=>({method:"get"})}).then(()=>{originalSecondDone=true;});
  await new Promise(setImmediate);
  broadcast.reply({atime:"wrong response for second request"});
  await new Promise(setImmediate);
  assert.equal(originalFirstDone,false,"Original bridge loses the first concurrent request");
  assert.equal(originalSecondDone,true,"Original bridge consumes a reply belonging to another request");
}
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
  await checkDriveRequests();
  console.log("PASS IndexedDB reconnect with initializing and ready stores; original race reproduced");
  console.log("PASS concurrent drive requests, out-of-order/duplicate responses and explicit timeout");
})().catch(error=>{console.error(error);process.exitCode=1;});
