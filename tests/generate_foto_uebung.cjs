const tf=require('@tensorflow/tfjs'),mobilenet=require('@tensorflow-models/mobilenet'),{createCanvas}=require('@napi-rs/canvas'),fs=require('fs'),crypto=require('crypto');
const core=require('../content/ki_projekt/fotostudio_core.js');
(async()=>{
const model=await mobilenet.load(core.MODEL);console.log('Model loaded');
const records=[];
for(let g=1;g<=8;g++)for(let c=0;c<2;c++)for(let k=0;k<12;k++){
 const img=createCanvas(300+g*5,240+k*3),ctx=img.getContext('2d');
 ctx.fillStyle=`rgb(${230+g},${235-k},${240-g})`;ctx.fillRect(0,0,img.width,img.height);
 ctx.translate(img.width/2+(k-5)*2,img.height/2);ctx.rotate((g-4)*.09+(k-5)*.015);
 ctx.fillStyle=`rgb(${35+g*5},${65+k*5},${90+g*7})`;ctx.beginPath();
 if(c===0)ctx.arc(0,0,55+k,0,2*Math.PI);else {ctx.moveTo(0,-70-k);ctx.lineTo(65+k,50);ctx.lineTo(-65-k,50);ctx.closePath();}ctx.fill();
 const canvas=core.prepare(img,createCanvas),features=await core.extract(model,canvas);
 const id=crypto.createHash('sha256').update(canvas.getContext('2d').getImageData(0,0,224,224).data).digest('hex');
 const thumb=createCanvas(64,64);thumb.getContext('2d').drawImage(canvas,0,0,64,64);
 records.push({id,group:'G'+String(g).padStart(2,'0'),label:['Kreis','Dreieck'][c],source:'Synthetisch erzeugte geometrische Formen; keine echten Fotos',filename:`form-${g}-${c}-${k}.png`,features,preview:thumb.toDataURL('image/png')});
 if(k===11)console.log(g,c,records.length);
}
fs.writeFileSync(require('path').join(__dirname,'../content/ki_projekt/foto_uebungsdaten.json'),JSON.stringify({schema:'fotostudio-v1',pipeline:core.PIPELINE,tfjs:'4.22.0',mobilenet:'2.1.1',synthetic:true,records}));
console.log('PASS actual MobileNet extraction',records.length);
})().catch(e=>{console.error(e);process.exit(1)});
