// Portable documents, not Python sessions: retain widget values and their visible
// results as ordinary notebook outputs. They can be read without a widget server.
const VIEW = 'application/vnd.jupyter.widget-view+json';
const STATE = 'application/vnd.jupyter.widget-state+json';
const stream = text => ({output_type:'stream',name:'stdout',text});
import {notebookWidgetRoots} from './rehydrate';

export function portableNotebook(notebook, widgets) {
  const nb = structuredClone(notebook);
  // Keep the original per-cell widget view IDs before converting the outputs
  // into readable fallbacks. On reopen, they identify which saved sliders
  // belong to which trusted re-created visualisation.
  const roots = notebookWidgetRoots(nb);
  if (Object.keys(roots).length) nb.metadata = {...nb.metadata,ki_widget_roots:roots};
  const previous = nb.metadata?.widgets?.[STATE]?.state || {};
  const models = {...previous, ...widgets?.state};
  const used = new Set();
  function widget(id, ancestors = new Set()) {
    if (ancestors.has(id)) return [];
    const model = models[id];
    if (!model) return [stream('Widget-Ansicht nicht verfügbar. Die Zelle erneut ausführen.\n')];
    used.add(id);
    const visited = new Set([...ancestors,id]), state = model.state || {};
    if (model.model_name === 'OutputModel') return outputs(state.outputs || [], visited);
    if (Array.isArray(state.children)) return state.children.flatMap(ref => widget(ref.replace(/^IPY_MODEL_/,''), visited));
    if (['HTMLModel','HTMLMathModel'].includes(model.model_name)) {
      return [{output_type:'display_data',data:{'text/html':state.value || '', 'text/plain':state.value || ''},metadata:{}}];
    }
    if (model.model_name === 'FileUploadModel') {
      return [stream('Ausgewählte Dateien: '+(state.value || []).map(f=>f.name).join(', ')+'\n')];
    }
    let value = state.value;
    if (state._options_labels && state.index !== undefined) {
      value = Array.isArray(state.index) ? state.index.map(i=>state._options_labels[i]) : state._options_labels[state.index];
    }
    return value === undefined ? [] : [stream((state.description || model.model_name)+': '+(typeof value === 'string' ? value : JSON.stringify(value))+'\n')];
  }
  function outputs(items, ancestors = new Set()) {
    return items.flatMap(output => {
      const view = output.data?.[VIEW];
      if (!view) return [structuredClone(output)];
      const fallback = {...output.data}; delete fallback[VIEW];
      if (!models[view.model_id] && Object.keys(fallback).length) {
        return [{...structuredClone(output),data:fallback},...widget(view.model_id,ancestors)];
      }
      return [stream('Gesicherte Widget-Ergebnisse · Zelle für neue Berechnungen erneut ausführen.\n'),...widget(view.model_id,ancestors)];
    });
  }
  for (const cell of nb.cells) if (cell.cell_type === 'code') cell.outputs = outputs(cell.outputs || []);
  // Preserve the original widget state as data, including less common controls.
  // No widget views are restored, and no model/code is rehydrated in the kernel.
  if (used.size) {
    nb.metadata = {...nb.metadata,widgets:{[STATE]:{version_major:2,version_minor:0,state:Object.fromEntries([...used].map(id=>[id,models[id]]))}}};
  }
  return nb;
}

export function uploadedFiles(widgets) {
  const files = [];
  for (const model of Object.values(widgets?.state || {})) {
    if (model.model_name !== 'FileUploadModel') continue;
    for (const [index,file] of (model.state?.value || []).entries()) {
      const buffer = model.buffers?.find(b=>b.encoding==='base64' && b.path.join('/')===`value/${index}/content`);
      if (!buffer) throw Error('Notebook-Datei konnte nicht gesichert werden: '+file.name);
      files.push({name:file.name,type:file.type || 'application/octet-stream',content:buffer.data});
    }
  }
  return files;
}
