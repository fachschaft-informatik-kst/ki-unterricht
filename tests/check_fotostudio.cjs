/* npm install --no-save @tensorflow/tfjs@4.22.0 @tensorflow-models/mobilenet@2.1.1 @napi-rs/canvas */
const assert=require('node:assert/strict');
const tf=require('@tensorflow/tfjs'),mobile=require('@tensorflow-models/mobilenet');
const {createCanvas}=require('@napi-rs/canvas');
const core=require('../content/ki_projekt/fotostudio_core.js');
(async()=>{
 const input=createCanvas(100,50),ctx=input.getContext('2d');ctx.fillStyle='red';ctx.fillRect(0,0,100,50);
 const out=core.prepare(input,createCanvas),pixels=out.getContext('2d');
 assert.equal(out.width,224);assert.equal(out.height,224);
 assert.deepEqual([...pixels.getImageData(0,0,1,1).data],[255,255,255,255]);
 assert.deepEqual([...pixels.getImageData(112,112,1,1).data],[255,0,0,255]);
 const model=await mobile.load(core.MODEL),before=tf.memory().numTensors;
 const a=await core.extract(model,out),b=await core.extract(model,out);
 assert.equal(a.length,1280);assert(a.every(Number.isFinite));assert.deepEqual(a,b);
 assert.equal(tf.memory().numTensors,before);
 console.log('PASS proportional padding, actual embeddings, determinism, tensor disposal');
})().catch(e=>{console.error(e);process.exit(1)});
