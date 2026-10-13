// No browser required: verify execution order, error handling and project boundary.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let source = fs.readFileSync(path.join(root, 'extensions/ki-autostart/index.js'), 'utf8');
source = source.replace(/^import .*;\n/gm, '').replace('export default', 'globalThis.plugin =');
async function simulate(name, fail = false, twice = false) {
  const nb = JSON.parse(fs.readFileSync(path.join(root, 'content', name==='fremdes_notebook.ipynb'?'perzeptron_und_neuronale_netze.ipynb':name)));
  const executed = [], badges = [];
  const panel = {
    context: {ready: Promise.resolve(), path: name},
    disposed: {connect() {}},
    content: {widgets: nb.cells.map((cell, index) => ({index, model: {type: cell.cell_type, getMetadata: key => cell.metadata[key]}}))},
    sessionContext: {ready: Promise.resolve(), session: {kernel: {}}},
    toolbar: {addItem: (_, status) => badges.push(status)}
  };
  let callback;
  const context = {INotebookTracker: {}, console: {error() {}, warn() {}}, performance: {getEntriesByType:()=>[{type:'navigate'}]}, CodeCell: {execute: async cell => {
    executed.push(cell.index); return {content: {status: fail ? 'error' : 'ok'}};
  }}, Widget: class {constructor() {this.node = {style: {}, setAttribute() {}};}}};
  vm.runInNewContext(source, context);
  context.plugin.activate({restored:Promise.resolve()}, {widgetAdded: {connect: cb => callback = cb}, forEach: cb => cb(panel)});
  if (twice) callback(null, panel);
  await new Promise(resolve => setImmediate(resolve));
  return {nb, executed, badges};
}
(async () => {
  for (const name of ['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_projekt/ki_lernlabor.ipynb']) {
    const result = await simulate(name, false, true);
    assert.deepEqual(result.executed, result.nb.cells.flatMap((c,i) => c.cell_type === 'code' ? [i] : []));
    assert.equal(result.badges.length, 1);
    assert.equal(result.badges[0].node.textContent, '✓ Bereit');
  }
  const journal = await simulate('ki_projekt/ki_tandemprojekt.ipynb');
  assert.equal(journal.executed.length, 1, 'Only preparation may run in the submission journal');
  const setup = journal.nb.cells[journal.executed[0]].source.join('');
  assert(setup.includes('import ki_foto_tools'));
  assert(!/projekt_test|vergleichen|daten_upload|fotostudio\(/.test(setup));
  const optional = await simulate('fremdes_notebook.ipynb');
  assert.equal(optional.executed.length, 0);
  const failure = await simulate('perzeptron_und_neuronale_netze.ipynb', true);
  assert.equal(failure.executed.length, 1, 'Stop after first error');
  assert(failure.badges[0].node.textContent.includes('fehlgeschlagen'));
  for (const [navigation, size, query, remembered, expected] of [
    ['reload',0,'','perzeptron_und_neuronale_netze.ipynb',1],
    ['navigate',0,'','perzeptron_und_neuronale_netze.ipynb',0],
    ['reload',1,'','perzeptron_und_neuronale_netze.ipynb',0],
    ['reload',0,'?path=daten_training.ipynb','perzeptron_und_neuronale_netze.ipynb',0],
    ['reload',0,'','fremdes_notebook.ipynb',0]
  ]) {
    const opened = [];
    const context = {INotebookTracker:{}, CodeCell:{}, Widget:class {}, console,
      performance:{getEntriesByType:()=>[{type:navigation}]}, URLSearchParams,
      location:{search:query}, sessionStorage:{getItem:()=>remembered}};
    vm.runInNewContext(source, context);
    context.plugin.activate({restored:Promise.resolve(), commands:{execute:async (command,args)=>opened.push([command,args.path])}},
      {size,widgetAdded:{connect(){}},forEach(){}});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(opened.length,expected);
    if(expected) assert.deepEqual(opened[0],['docmanager:open','perzeptron_und_neuronale_netze.ipynb']);
  }
  console.log('PASS autostart: order, once per panel, journal boundary, excluded notebook, stop on error, reload restoration and explicit links');
})().catch(error => {console.error(error);process.exitCode = 1;});
