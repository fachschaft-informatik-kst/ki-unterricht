/* Shared browser / Node preprocessing. MobileNet consumes RGB values 0..255
   and applies its own [0,1] normalization. Do not normalize twice. */
(function(root) {
  const MODEL = {version:2, alpha:0.5};
  const PIPELINE = 'mobilenet-v2-050-224-rgb-whitepad-v1';
  function prepare(image, makeCanvas) {
    const canvas=makeCanvas(224,224), ctx=canvas.getContext('2d');
    const w=image.naturalWidth||image.width, h=image.naturalHeight||image.height;
    if (!(w>0 && h>0)) throw Error('Ungültige Bildgrösse');
    const scale=Math.min(224/w,224/h);
    ctx.fillStyle='white';ctx.fillRect(0,0,224,224);
    ctx.drawImage(image,(224-w*scale)/2,(224-h*scale)/2,w*scale,h*scale);
    return canvas;
  }
  async function extract(model, canvas) {
    const rgba=canvas.getContext('2d').getImageData(0,0,224,224);
    const tensor=model.infer({data:new Uint8Array(rgba.data),width:224,height:224},true);
    try {
      const values=Array.from(await tensor.data());
      if(values.length!==1280 || !values.every(Number.isFinite)) throw Error('Unerwartete Bildmerkmale');
      return values.map(v=>Number(v.toFixed(6)));
    } finally {tensor.dispose();}
  }
  const api={MODEL,PIPELINE,prepare,extract};
  if(typeof module!=='undefined')module.exports=api;else root.PhotoCore=api;
})(globalThis);
