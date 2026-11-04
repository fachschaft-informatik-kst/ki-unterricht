// Anonymous, session-only timings for one managed JupyterLite iframe.
// No uploads, notebook code, student identifiers or URLs are recorded.
const sessions = new WeakMap();
const completed = new WeakMap();
const phases = new Set(['document','kernel','autostart','cells','interactive','restoring','uploads','widgets','restored']);
const now = () => performance.now();
export function startNotebookTiming(frame,name,kind) {
  const start=now();
  completed.delete(frame);
  // Direct clicks must count even if the frame is initialized afterwards.
  sessions.set(frame,{name,kind,start,opened:kind==='open'?start:null,stages:{}});
}
export function markNotebookTiming(frame,phase) {
  const entry=sessions.get(frame);
  if (!entry||!phases.has(phase)||entry.stages[phase]!==undefined) return;
  entry.stages[phase]=Math.round(now()-entry.start);
}
export function openedNotebook(frame,name=null) {
  const entry=sessions.get(frame);
  if(entry) {
    if(entry.opened===null && (!name||entry.name===name))entry.opened=now();
    return;
  }
  // An already-completed warmup has zero visible wait when the same
  // notebook is opened; don't mistake clicking a different notebook for this.
  const sample=completed.get(frame);
  if(sample && sample.visibleWaitMs===null && (!name||sample.name===name))sample.visibleWaitMs=0;
}
export function finishNotebookTiming(frame) {
  const entry=sessions.get(frame);
  if(!entry) return;
  const finished=now();
  const milliseconds=Math.round(finished-entry.start);
  const visibleWaitMs=entry.opened===null?null:Math.max(0,Math.round(finished-entry.opened));
  const result={name:entry.name,kind:entry.kind,milliseconds,visibleWaitMs,stages:{...entry.stages}};
  const samples=(window.KINotebookTimings ||= []);
  samples.push(result);
  if(samples.length>50)samples.splice(0,samples.length-50);
  frame.dataset.loadMs=String(milliseconds);
  sessions.delete(frame);
  completed.set(frame,result);
  return result;
}
export function notebookTimingSummary(samples=window.KINotebookTimings||[]) {
  const groups={};
  for(const item of samples){
    if(!Number.isFinite(item.milliseconds))continue;
    (groups[item.kind] ||= []).push(item);
  }
  return Object.fromEntries(Object.entries(groups).map(([kind,items])=>{
    const median=key=>{
      const sorted=items.map(x=>x[key]).filter(Number.isFinite).sort((a,b)=>a-b);
      if(!sorted.length)return null;
      return sorted[Math.floor((sorted.length-1)/2)];
    };
    return [kind,{count:items.length,medianStartMs:median('milliseconds'),medianVisibleWaitMs:median('visibleWaitMs')}];
  }));
}
if(typeof window!=='undefined')window.KINotebookTimingSummary=()=>notebookTimingSummary();
