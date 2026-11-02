const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const {portableNotebook,uploadedFiles}=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(__dirname,'../extensions/ki-autostart/snapshot.js')).toString('base64'));
 const png='iVBORw0KGgo=',bytes=Buffer.from([0,255,128,13,10]);
 const widgets={state:{
  box:{model_name:'VBoxModel',state:{children:['IPY_MODEL_slider','IPY_MODEL_selection','IPY_MODEL_out','IPY_MODEL_upload']}},
  slider:{model_name:'FloatSliderModel',state:{description:'Gewicht',value:-1.5}},
  selection:{model_name:'DropdownModel',state:{description:'Aufgabe',_options_labels:['AND','XOR'],index:1}},
  out:{model_name:'OutputModel',state:{outputs:[{output_type:'display_data',data:{'image/png':png,'text/plain':'Versuchsdiagramm'},metadata:{}}]}},
  upload:{model_name:'FileUploadModel',state:{value:[{name:'äpfel..json',type:'application/json',size:5}]},buffers:[{encoding:'base64',path:['value',0,'content'],data:bytes.toString('base64')}]}
 }};
 const nb={nbformat:4,nbformat_minor:5,metadata:{custom:'kept'},cells:[
  {id:'md',cell_type:'markdown',source:'# Eigene Notiz',metadata:{},attachments:{'bild.png':{'image/png':png}}},
  {id:'code',cell_type:'code',source:'mein_code()',metadata:{custom:42},execution_count:7,outputs:[{output_type:'display_data',metadata:{},data:{'application/vnd.jupyter.widget-view+json':{model_id:'box'},'text/plain':'VBox(...)'}}]}
 ]};
 const before=structuredClone(nb),snapshot=portableNotebook(nb,widgets);
 assert.deepEqual(nb,before,'Snapshot must not change the live notebook');
 assert.deepEqual(snapshot.cells[0],nb.cells[0],'Markdown attachments survive');
 assert.equal(snapshot.cells[1].source,'mein_code()');assert.equal(snapshot.cells[1].execution_count,7);
 const text=JSON.stringify(snapshot.cells[1].outputs);
 assert(text.includes('Gewicht: -1.5'));assert(text.includes('Aufgabe: XOR'));assert(text.includes(png));
 assert(!text.includes('application/vnd.jupyter.widget-view+json'));
 assert.deepEqual(snapshot.metadata.ki_widget_roots,{code:['box']},
   'Save original widget root IDs before flattening the display output');
 assert.deepEqual(portableNotebook(snapshot),snapshot,'Repeated save/restore must not duplicate results');
 assert.deepEqual(Buffer.from(uploadedFiles(widgets)[0].content,'base64'),bytes);
 const missing=structuredClone(widgets);delete missing.state.upload.buffers;
 assert.throws(()=>uploadedFiles(missing),/konnte nicht gesichert/);
 // Unknown old widget IDs retain their available text, rather than losing an output.
 assert(JSON.stringify(portableNotebook(nb).cells[1].outputs).includes('VBox(...)'));
 console.log('PASS portable notebook code, Markdown, image attachments, widget parameters/plots, binary uploads and repeated snapshots');
})().catch(e=>{console.error(e);process.exitCode=1;});
