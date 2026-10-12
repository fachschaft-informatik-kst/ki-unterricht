/* npm install --no-save pyodide@0.27.0
   node tests/check_pyodide.cjs
   Optional offline widget wheels: WIDGET_WHEELS=/path/to/wheels
   Pyodide scientific packages must be available in its package cache or fetched online. */
const fs=require('node:fs'),path=require('node:path');
const {loadPyodide}=require('pyodide');
const root=path.resolve(__dirname,'..');
(async()=>{
 const indexURL=path.dirname(require.resolve('pyodide/package.json'))+'/';
 const py=await loadPyodide({indexURL});
 await py.loadPackage(['numpy','scipy','scikit-learn','matplotlib','pillow','ipython','micropip']);
 if(process.env.WIDGET_WHEELS){
  py.FS.mkdir('/wheels');
  for(const w of fs.readdirSync(process.env.WIDGET_WHEELS).filter(x=>x.endsWith('.whl')))py.FS.writeFile('/wheels/'+w,fs.readFileSync(path.join(process.env.WIDGET_WHEELS,w)));
  await py.runPythonAsync("import micropip,os; await micropip.install(['emfs:/wheels/'+w for w in os.listdir('/wheels')], deps=False)");
 }else await py.runPythonAsync("import micropip; await micropip.install('ipywidgets==8.1.7')");
 function copy(dir,dest){
  py.FS.mkdirTree(dest);
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   if(e.name==='__pycache__')continue;
   if(e.isDirectory())copy(path.join(dir,e.name),dest+'/'+e.name);
   else if(/\.(py|json|html|js)$/.test(e.name))py.FS.writeFile(dest+'/'+e.name,fs.readFileSync(path.join(dir,e.name)));
  }
 }
 copy(path.join(root,'content'),'/project/content');copy(path.join(root,'tests'),'/project/tests');
 await py.runPythonAsync("import sys,os,matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt; sys.path[:0]=['/project/content','/project/content/ki_projekt']; plt.show=lambda *a,**k: plt.close('all')");
 py.setStdout({batched:s=>{if(s.startsWith('PASS'))console.log(s);}});
 for(const name of ['lernarten.ipynb','perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','klassifikation_ziffern.ipynb','ki_projekt/ki_lernlabor.ipynb','ki_projekt/ki_tandemprojekt.ipynb'].flatMap(n=>[n,'portal/'+path.basename(n)])){
  await py.runPythonAsync(`os.chdir(${JSON.stringify('/project/content/'+path.dirname(name))})`);
  const ns=py.toPy({__name__:'__main__'});
  for(const c of JSON.parse(fs.readFileSync(path.join(root,'content',name))).cells)if(c.cell_type==='code')await py.runPythonAsync(Array.isArray(c.source)?c.source.join(''):c.source,{globals:ns});
  ns.destroy();console.log('PASS Pyodide notebook:',name);
 }
 await py.runPythonAsync("import runpy; runpy.run_path('/project/tests/check_ki_basis.py',run_name='__main__')");
 console.log('PASS Pyodide 0.27.0: full required notebook path, optional digits, import and project gates');
})().catch(e=>{console.error(e);process.exitCode=1;});
