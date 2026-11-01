// No browser required: verify execution order, error handling and project boundary.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let source = fs.readFileSync(path.join(root, 'extensions/ki-autostart/index.js'), 'utf8');
source = source.replace(/^import .*;\n/gm, '').replace('export default', 'globalThis.plugin =');
async function simulate(name, fail = false, twice = false, modification = '') {
  const nb = JSON.parse(fs.readFileSync(path.join(root, 'content', name==='fremdes_notebook.ipynb'?'perzeptron_und_neuronale_netze.ipynb':name)));
  const template = structuredClone(nb);
  if (modification === 'edit') nb.cells.find(c => c.cell_type === 'code').source = ['raise RuntimeError("untrusted setup")'];
  if (modification === 'tag') nb.cells.push({id:'untrusted',cell_type:'code',metadata:{tags:['ki-autostart']},source:['raise RuntimeError("untrusted tag")']});
  if (modification === 'remove') nb.cells.splice(nb.cells.findIndex(c => c.cell_type === 'code'),1);
  const executed = [], badges = [];
  const panel = {
    context: {ready: Promise.resolve(), path: name},
    disposed: {connect() {}},
    content: {widgets: nb.cells.map((cell, index) => ({index, model: {id:cell.id, type: cell.cell_type, sharedModel:{getSource:()=>cell.source.join('')}, getMetadata: key => cell.metadata[key]}}))},
    sessionContext: {ready: Promise.resolve(), session: {kernel: {}}},
    toolbar: {addItem: (_, status) => badges.push(status)}
  };
  let callback;
  const context = {fetch:async()=>({ok:true,json:async()=>template}),URL,location:{href:'https://example.org/lab/index.html'},INotebookTracker: {}, console: {error() {}, warn() {}}, performance: {getEntriesByType:()=>[{type:'navigate'}]}, CodeCell: {execute: async cell => {
    executed.push(cell.index); return {content: {status: fail ? 'error' : 'ok'}};
  }}, Widget: class {constructor() {this.node = {style: {}, setAttribute() {}};}}};
  vm.runInNewContext(source, context);
  context.plugin.activate({restored:Promise.resolve()}, {widgetAdded: {connect: cb => callback = cb}, forEach: cb => cb(panel)});
  if (twice) callback(null, panel);
  await new Promise(resolve => setImmediate(resolve));
  return {nb, executed, badges};
}
(async () => {
  // SVG widgets must be usable without loading the large Matplotlib package.
  // Plotting and ML experiments continue to load their required dependencies.
  const packages = name => {
    const nb = JSON.parse(fs.readFileSync(path.join(root, 'content', name)));
    const setup = nb.cells.find(c => c.cell_type==='code' && c.metadata.tags?.includes('ki-autostart'));
    const match = setup.source.join('').match(/await pyodide_js\.loadPackage\(\[([^\]]+)\]\)/);
    assert(match, 'Package declaration missing in ' + name);
    return [...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
  };
  assert.deepEqual(packages('perzeptron_und_neuronale_netze.ipynb'), ['numpy']);
  assert.deepEqual(packages('xor_einzelne_neuronen.ipynb'), ['numpy']);
  assert.deepEqual(packages('basis_neuron.ipynb'), ['numpy']);
  const tools = fs.readFileSync(path.join(root,'content/unterricht_tools.py'),'utf8');
  assert(!/^import matplotlib\\.pyplot as plt$/m.test(tools),
    'Matplotlib must not initialize when importing HTML/SVG teaching widgets');
  assert(tools.includes('class _LazyPlots'));
  assert(tools.includes("widgets.interact_manual.options(manual_name='Netz trainieren ▶')"),
    'The XOR learning widget must wait for an explicit click before training');
  for (const name of ['mehrschichtige_netze.ipynb','ziffernerkennung.ipynb','daten_training.ipynb']) {
    assert(!packages(name).includes('pillow'), name + ' must not preload unused Pillow');
    assert(packages(name).includes('scikit-learn'));
  }
  for (const name of ['ki_projekt/ki_lernlabor.ipynb','ki_projekt/ki_tandemprojekt.ipynb']) {
    assert(packages(name).includes('pillow'), 'Image-project experiments still need Pillow');
  }
  for (const name of ['perzeptron_und_neuronale_netze.ipynb','xor_einzelne_neuronen.ipynb','mehrschichtige_netze.ipynb','ziffernerkennung.ipynb','daten_training.ipynb','ki_projekt/ki_lernlabor.ipynb']) {
    // JupyterLite shows the Python repr of a returned widget object unless the
  // cell suppresses the final expression.  Interactive controls already call
  // display(...) internally, so their auto-run cells must end with ';'.
  const uiCells = nb => nb.cells.filter(c => c.cell_type === 'code').map(c => c.source.join('').trim());
  for (const statement of uiCells(JSON.parse(fs.readFileSync(path.join(root, 'content', name))))) {
    if (/^u\.(?:live_alltag|live_gatter|lernen_klick|regler_logik)\(/.test(statement)) {
      assert(statement.endsWith(';'), `Duplicate plain-text widget output in ${name}: ${statement}`);
    }
  }
  const result = await simulate(name, false, true);
    // Optionale Zusatzzellen tragen den Tag nicht und bleiben manuell.
    assert.deepEqual(result.executed, result.nb.cells.flatMap((c,i) => c.cell_type === 'code' && (c.metadata.tags||[]).includes('ki-autostart') ? [i] : []));
    assert.equal(result.badges.length, 1);
    assert.equal(result.badges[0].node.textContent, '✓ Bereit');
  }
  const journal = await simulate('ki_projekt/ki_tandemprojekt.ipynb');
  assert.equal(journal.executed.length, 1, 'Only preparation may run in the submission journal');
  const setup = journal.nb.cells[journal.executed[0]].source.join('');
  assert(setup.includes('import ki_foto_tools'));
  assert(!/projekt_test|vergleichen|daten_upload|fotostudio\(/.test(setup));
  for (const modification of ['edit','remove']) {
    const changed = await simulate('ki_projekt/ki_tandemprojekt.ipynb',false,false,modification);
    assert.equal(changed.executed.length,0,'Changed preparation must remain manual');
  }
  const tagged = await simulate('ki_projekt/ki_tandemprojekt.ipynb',false,false,'tag');
  assert.equal(tagged.executed.length,1,'Imported tags must never expand automatic execution');
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
  console.log('PASS autostart: order, once per panel, journal boundary, edited/removed/imported start cells, excluded notebook, stop on error, reload restoration and explicit links');
})().catch(error => {console.error(error);process.exitCode = 1;});
