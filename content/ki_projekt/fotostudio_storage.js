/* IndexedDB checkpoints for the Fotostudio. A local cache, never a replacement for JSON export. */
(function(root){
 'use strict';
 const NAME='kst-ki-fotostudio-records-v1',STORE='records';
 function open(){
  if(!root.indexedDB)return Promise.reject(Error('Browser-Speicher ist nicht verfügbar'));
  return new Promise((resolve,reject)=>{
   let request;
   try{request=root.indexedDB.open(NAME,1);}
   catch(e){reject(e);return;}
   request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});};
   request.onerror=()=>reject(request.error||Error('Browser-Speicher konnte nicht geöffnet werden'));
   request.onblocked=()=>reject(Error('Browser-Speicher durch anderen Tab blockiert'));
   request.onsuccess=()=>{
    const db=request.result;
    db.onversionchange=()=>db.close();
    function run(mode,action){
     return new Promise((ok,fail)=>{
      let tx,req;
      try{tx=db.transaction(STORE,mode);req=action(tx.objectStore(STORE));}
      catch(e){fail(e);return;}
      tx.oncomplete=()=>ok(req?.result);
      tx.onerror=()=>fail(tx.error||Error('Browser-Speicherfehler'));
      tx.onabort=()=>fail(tx.error||Error('Speichervorgang abgebrochen'));
     });
    }
    resolve({
     list:()=>run('readonly',s=>s.getAll()),
     put:record=>run('readwrite',s=>s.put(record)),
     putMany:records=>run('readwrite',s=>{for(const record of records)s.put(record);}),
     clear:()=>run('readwrite',s=>s.clear())
    });
   };
  });
 }
 const api={open,NAME};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.PhotoStorage=api;
})(globalThis);
