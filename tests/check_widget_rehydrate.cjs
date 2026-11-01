const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../extensions/ki-autostart/rehydrate.js'),'utf8');
  const {VIEW,STATE,notebookWidgetRoots,widgetTraitUpdates}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  const old={
    box:{model_name:'VBoxModel',state:{children:['IPY_MODEL_slider','IPY_MODEL_gate','IPY_MODEL_file']}},
    slider:{model_name:'FloatSliderModel',state:{value:-2.5}},
    gate:{model_name:'DropdownModel',state:{index:1,_options_labels:['AND','OR']}},
    file:{model_name:'FileUploadModel',state:{value:[{name:'secret.json'}]}}
  };
  const live={
    fresh:{model_name:'VBoxModel',state:{children:['IPY_MODEL_new_slider','IPY_MODEL_new_gate','IPY_MODEL_new_file']}},
    new_slider:{model_name:'FloatSliderModel',state:{value:1}},
    new_gate:{model_name:'DropdownModel',state:{index:0,_options_labels:['AND','OR']}},
    new_file:{model_name:'FileUploadModel',state:{value:[]}}
  };
  const view = id => ({output_type:'display_data',data:{[VIEW]:{model_id:id}},metadata:{}});
  const active={nbformat:4,cells:[{id:'visual',cell_type:'code',outputs:[view('fresh')]}]};
  const saved={nbformat:4,metadata:{widgets:{[STATE]:{state:old}},ki_widget_roots:{visual:['box']}},
    cells:[{id:'visual',cell_type:'code',outputs:[{output_type:'stream',name:'stdout',text:'Gewicht: -2.5'}]}]};
  assert.deepEqual(notebookWidgetRoots(active),{visual:['fresh']});
  const changes=widgetTraitUpdates(saved,active,{state:live});
  assert.equal(changes.length,2,'Slider and selection are restored, but not files');
  assert.deepEqual(changes.map(v=>[v.id,v.trait,v.value]),[['new_slider','value',-2.5],['new_gate','index',1]]);
  // Older ZIP backups without explicit model roots must remain recoverable.
  const legacy=structuredClone(saved);
  delete legacy.metadata.ki_widget_roots;
  assert.equal(widgetTraitUpdates(legacy,active,{state:live}).length,2);
  // Tampered widget data can never inject methods, code or very large strings.
  old.slider.state.value='x'.repeat(3000);
  old.gate.state.index='__proto__';
  assert.deepEqual(widgetTraitUpdates(saved,active,{state:live}),[]);
  const modified=structuredClone(saved);
  modified.metadata.widgets={};
  assert.deepEqual(widgetTraitUpdates(modified,active,{state:live}),[]);
  console.log('PASS saved widgets: stable cell mapping, legacy ZIPs, slider/selection values, no uploads or unsafe traits');
})().catch(error=>{console.error(error);process.exitCode=1;});
