// Reconnect saved teaching-widget inputs to freshly executed, verified
// autostart cells. Only primitive input traits are transferred: never Python
// code, arbitrary widget methods, uploaded file contents or kernel objects.
export const VIEW = 'application/vnd.jupyter.widget-view+json';
export const STATE = 'application/vnd.jupyter.widget-state+json';

export function notebookWidgetRoots(nb) {
  const roots = {};
  for (const cell of nb?.cells || []) {
    if (cell.cell_type !== 'code' || !cell.id) continue;
    const ids = (cell.outputs || []).map(output => output.data?.[VIEW]?.model_id).filter(id => typeof id === 'string');
    if (ids.length) roots[cell.id] = ids;
  }
  return roots;
}

const refId = value => typeof value === 'string' && value.startsWith('IPY_MODEL_') ? value.slice(10) : null;
const selection = /^(?:Dropdown|RadioButtons|ToggleButtons|Select|SelectMultiple|SelectionSlider|SelectionRangeSlider)Model$/;
const input = /^(?:FloatSlider|IntSlider|FloatRangeSlider|IntRangeSlider|FloatText|IntText|BoundedFloatText|BoundedIntText|Checkbox|ToggleButton|Text|Textarea|Combobox)Model$/;
const safeValue = value => (typeof value === 'number' && Number.isFinite(value)) ||
  typeof value === 'boolean' || (typeof value === 'string' && value.length <= 2000) ||
  (Array.isArray(value) && value.length <= 2 && value.every(v => typeof v === 'number' && Number.isFinite(v)));
const safeIndex = value => (Number.isInteger(value) && value >= 0 && value <= 1000) ||
  (Array.isArray(value) && value.length <= 20 && value.every(v => Number.isInteger(v) && v >= 0 && v <= 1000));

export function widgetTraitUpdates(saved, live, liveModels) {
  const oldModels = saved?.metadata?.widgets?.[STATE]?.state || {};
  const newModels = liveModels?.state || {};
  const oldRoots = saved?.metadata?.ki_widget_roots || {};
  const newRoots = notebookWidgetRoots(live);
  const claimed = new Set(), visited = new Set(), updates = [];
  // Older ZIP archives predate ki_widget_roots: infer root widgets from
  // manager state, excluding models referenced as another widget's child.
  const referenced = new Set();
  for (const model of Object.values(oldModels)) {
    for (const child of model?.state?.children || []) {
      const id = refId(child);
      if (id) referenced.add(id);
    }
  }
  const legacy = Object.keys(oldModels).filter(id => !referenced.has(id) &&
    new Set(Object.values(newModels).map(m => m.model_name)).has(oldModels[id]?.model_name));
  const allOldRoots = Object.values(oldRoots).flat();
  function pair(oldId, newId) {
    if (updates.length >= 500 || visited.has(newId)) return;
    const before = oldModels[oldId], after = newModels[newId];
    if (!before || !after || before.model_name !== after.model_name) return;
    visited.add(newId);
    const kind = before.model_name, state = before.state || {};
    if (selection.test(kind) && safeIndex(state.index)) updates.push({id:newId,trait:'index',value:state.index});
    else if (input.test(kind) && safeValue(state.value)) updates.push({id:newId,trait:'value',value:state.value});
    const previousChildren = state.children || [], currentChildren = after.state?.children || [];
    for (let i=0;i<Math.min(previousChildren.length,currentChildren.length);i++) {
      const a=refId(previousChildren[i]), b=refId(currentChildren[i]);
      if (a && b) pair(a,b);
    }
  }
  for (const cell of live?.cells || []) {
    if (!newRoots[cell.id]) continue;
    for (const newId of newRoots[cell.id]) {
      const model = newModels[newId];
      if (!model) continue;
      const explicit = (oldRoots[cell.id] || []).find(id =>
        !claimed.has(id) && oldModels[id]?.model_name === model.model_name);
      const fallback = legacy.find(id =>
        !claimed.has(id) && !allOldRoots.includes(id) && oldModels[id]?.model_name === model.model_name);
      const oldId = explicit || fallback;
      if (oldId) { claimed.add(oldId); pair(oldId,newId); }
    }
  }
  return updates;
}
