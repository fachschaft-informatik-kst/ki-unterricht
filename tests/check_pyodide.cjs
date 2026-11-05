/* npm install --no-save pyodide@0.27.0
   node tests/check_pyodide.cjs [course-slug ...]
   Runs every notebook of each published course (shared/course-sites.json, notebooks from
   the experiment registry of the course) in real Pyodide: the source notebook and the
   packaged copy that python scripts/build_portal_notebooks.py writes to _build/content.
   The course templates in kurse/_vorlagen run as well (source notebooks only).
   Without arguments everything runs; `node tests/check_pyodide.cjs irn/1-klasse` runs one folder.
   Optional offline widget wheels: WIDGET_WHEELS=/path/to/wheels
   Pyodide scientific packages must be available in its package cache or fetched online. */
const fs=require('node:fs'),path=require('node:path');
const {loadPyodide}=require('pyodide');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
// The notebooks ask for numpy and friends in every first cell; Pyodide reports each request.
const noise=/already loaded from default channel$|^No new packages to load$/;
const log=console.log.bind(console);
console.log=(...args)=>{if(!(args.length===1&&noise.test(String(args[0]))))log(...args);};
(async()=>{
 const started=Date.now();
 const wanted=process.argv.slice(2);
 // Course templates are not published and have no packaged copy, but new courses are copied from them.
 const templates=fs.readdirSync(path.join(root,'kurse/_vorlagen')).filter(d=>fs.existsSync(path.join(root,'kurse/_vorlagen',d,'experimente/registry.json')))
  .map(d=>({slug:'_vorlagen/'+d,courseRoot:'kurse/_vorlagen/'+d,template:true}));
 const known=[...read('shared/course-sites.json').courses.filter(c=>c.status==='published'),...templates];
 const unknown=wanted.filter(slug=>!known.some(c=>c.slug===slug));
 if(unknown.length)throw new Error('Unknown or unpublished course: '+unknown.join(', '));
 const courses=wanted.length?known.filter(c=>wanted.includes(c.slug)):known;
 const runs=courses.flatMap(course=>read(course.courseRoot+'/experimente/registry.json').flatMap(({source})=>[
  {course,name:`${course.courseRoot}/content/${source}`},
  ...(course.template?[]:[{course,name:`_build/content/portal/${course.slug}/${path.basename(source)}`}])]));
 for(const {name} of runs)if(!fs.existsSync(path.join(root,name)))throw new Error(`${name} is missing. Run python scripts/build_portal_notebooks.py first.`);
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
 for(const course of courses)copy(path.join(root,course.courseRoot,'content'),`/project/${course.courseRoot}/content`);
 copy(path.join(root,'_build/content'),'/project/_build/content');
 copy(path.join(root,'tests'),'/project/tests');
 await py.runPythonAsync(`
import sys,os,matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.show=lambda *a,**k: plt.close('all')
def fresh(paths,cwd):
    # Start like a new kernel: no helper module or search path of an earlier notebook or course.
    for name,module in list(sys.modules.items()):
        if (getattr(module,'__file__',None) or '').startswith('/project/'):
            del sys.modules[name]
    sys.path[:]=[p for p in sys.path if not p.startswith('/project/')]
    sys.path[:0]=paths
    os.chdir(cwd)
    plt.close('all')
`);
 const fresh=(paths,cwd)=>py.runPythonAsync(`fresh(${JSON.stringify(paths)},${JSON.stringify(cwd)})`);
 const tail=(error,lines)=>String(error.message).trim().split('\n').slice(-lines).join('\n');
 const failures=[];
 py.setStdout({batched:s=>{if(s.startsWith('PASS'))console.log(s);}});
 for(const {course,name} of runs){
  const content=`/project/${course.courseRoot}/content`;
  // The packaged copy puts its own folders on sys.path in its first cell.
  await fresh(name.startsWith('_build/')?[]:[content,content+'/ki_projekt'],'/project/'+path.dirname(name));
  const ns=py.toPy({__name__:'__main__'});
  let cell=0;
  try{
   for(const c of read(name).cells){
    cell++;
    if(c.cell_type==='code')await py.runPythonAsync(Array.isArray(c.source)?c.source.join(''):c.source,{globals:ns});
   }
   console.log('PASS Pyodide notebook:',name);
  }catch(e){
   failures.push(`${name}, cell ${cell}: ${tail(e,1)}`);
   console.error(`FAIL Pyodide notebook: ${name}, cell ${cell}\n${tail(e,12)}`);
  }finally{ns.destroy();}
 }
 for(const course of courses){
  const content=`/project/${course.courseRoot}/content`;
  await fresh([content,content+'/ki_projekt'],'/project/tests');
  try{
   await py.runPythonAsync(`import os,runpy\nos.environ['KI_COURSE_CONTENT']=${JSON.stringify(course.courseRoot+'/content')}\nrunpy.run_path('/project/tests/check_ki_basis.py',run_name='__main__')`);
   console.log('PASS Pyodide project gates:',course.slug);
  }catch(e){
   failures.push(`project gates ${course.slug}: ${tail(e,1)}`);
   console.error(`FAIL Pyodide project gates: ${course.slug}\n${tail(e,12)}`);
  }
 }
 if(failures.length){
  console.error(`\n${failures.length} Pyodide run(s) failed:\n - ${failures.join('\n - ')}`);
  process.exitCode=1;
  return;
 }
 console.log(`PASS Pyodide 0.27.0: ${runs.length} notebook runs (sources and packaged copies) and project gates in ${courses.length} course folders, ${Math.round((Date.now()-started)/1000)} s`);
})().catch(e=>{console.error(e);process.exitCode=1;});
