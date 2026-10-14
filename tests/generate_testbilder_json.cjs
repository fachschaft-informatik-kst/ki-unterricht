// Erzeugt aus testbilder/<Klasse>/<Gruppe>/*.jpg dieselbe Fotostudio-JSON wie die Kursseite.
// Benötigt @tensorflow/tfjs 4.22.0, @tensorflow-models/mobilenet 2.1.1 und @napi-rs/canvas
// (NODE_PATH auf deren node_modules setzen). Aufruf: node tests/generate_testbilder_json.cjs
const tf = require('@tensorflow/tfjs'), mobilenet = require('@tensorflow-models/mobilenet');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const core = require('../content/ki_projekt/fotostudio_core.js');
const root = path.join(__dirname, '../testbilder');
const GRUPPEN = ['T1', 'T2', 'V1', 'P1', 'P2'];
const QUELLE = 'Gezeichnete Illustration (tests/generate_testbilder.py), kein Foto';
(async () => {
  await tf.ready();
  const model = await mobilenet.load(core.MODEL);
  const records = [];
  for (const label of ['Apfel', 'Banane']) {
    for (const group of GRUPPEN) {
      const dir = path.join(root, label, group);
      for (const filename of fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort()) {
        const image = await loadImage(fs.readFileSync(path.join(dir, filename)));
        const canvas = core.prepare(image, createCanvas);
        const features = await core.extract(model, canvas);
        const id = crypto.createHash('sha256').update(canvas.getContext('2d').getImageData(0, 0, 224, 224).data).digest('hex');
        const small = createCanvas(64, 64);
        small.getContext('2d').drawImage(canvas, 0, 0, 64, 64);
        records.push({ id, group, label, source: QUELLE, filename, features, preview: small.toDataURL('image/png') });
      }
    }
    console.log(label, records.length);
  }
  fs.writeFileSync(path.join(root, 'beispielbilder_fotostudio.json'),
    JSON.stringify({ schema: 'fotostudio-v1', pipeline: core.PIPELINE, tfjs: '4.22.0', mobilenet: '2.1.1', records }));
  console.log('Fertig:', records.length, 'Bilder');
})().catch(e => { console.error(e); process.exit(1); });
