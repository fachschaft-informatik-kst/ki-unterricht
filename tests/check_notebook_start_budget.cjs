// Protect interactive first-paint from growing training and dependency costs.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const notebook=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
const source=cell=>Array.isArray(cell.source)?cell.source.join(''):String(cell.source||'');
const starts=nb=>nb.cells.filter(c=>c.cell_type==='code'&&(c.metadata?.tags||[]).includes('ki-autostart'));
const setups=nb=>starts(nb).find(c=>source(c).includes('loadPackage('));
for(const [name,packages,manual] of [
 ['daten_training.ipynb',['numpy','matplotlib'],['u.drei_rollen(']],
 ['mehrschichtige_netze.ipynb',['numpy','matplotlib'],['u.xor_lernen_regler(']],
 ['basis_netze.ipynb',['numpy','matplotlib'],['u.xor_lernen_regler(']],
 ['ki_projekt/ki_lernlabor.ipynb',['numpy','pillow'],['daten = foto.projekt_laden(','experiment = foto.vergleichen(','foto.vorhersagen_zeigen(']]
]){
 const nb=notebook(name),setup=setups(nb);
 assert(setup,name+' missing trusted setup cell');
 const loaded=[...source(setup).matchAll(/'([^']+)'/g)].map(x=>x[1]).filter(x=>!['emscripten','ipywidgets==8.1.0'].includes(x));
 for(const p of packages)assert(loaded.includes(p),name+' missing base package '+p);
 for(const p of ['scipy','scikit-learn'])assert(!loaded.includes(p),name+' loads training before user intent');
 for(const needle of manual){
  const cell=nb.cells.find(c=>c.cell_type==='code'&&source(c).includes(needle));
  assert(cell,name+' missing exercise '+needle);
  assert(!(cell.metadata?.tags||[]).includes('ki-autostart'),name+' starts expensive work automatically: '+needle);
 }
 for(const cell of starts(nb)){
  assert(!/\.drei_rollen\(|foto\.vergleichen\(|u\.ziffern_regler\(|u\.ziffer_regler\(/.test(source(cell)),name+' trained on notebook launch');
 }
}
for(const [name,needle] of [
 ['daten_training.ipynb','u.drei_rollen('],
 ['mehrschichtige_netze.ipynb','u.xor_lernen_regler('],
 ['ki_projekt/ki_lernlabor.ipynb','experiment = foto.vergleichen(']
]){
 const cell=notebook(name).cells.find(c=>c.cell_type==='code'&&source(c).includes(needle));
 assert(source(cell).includes('await pyodide_js.loadPackage('),name+' must install deferred wheel dependencies explicitly');
}
const digits=notebook('ziffernerkennung.ipynb');
assert(starts(digits).some(c=>source(c).includes('u.ziffern_regler(')),'Digit-recognition controls must be visible immediately');
assert(starts(digits).some(c=>source(c).includes('u.ziffer_regler(')),'Digit-prediction controls must be visible immediately');
assert(source(setups(digits)).includes("'scikit-learn'"),'Digit buttons must have working model dependencies');
console.log('PASS heavy training deferred while primary digit widgets remain immediately interactive');
