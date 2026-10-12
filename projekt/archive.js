// Small, dependency-free ZIP writer/reader for our own uncompressed backup format.
const enc=new TextEncoder(),dec=new TextDecoder();
const table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export function crc32(data){let c=0xffffffff;for(const b of data)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
export async function makeZip(entries){
 const chunks=[],central=[];let offset=0,centralSize=0;
 for(const entry of entries){
  const name=enc.encode(entry.name),blob=entry.data instanceof Blob?entry.data:new Blob([entry.data]);
  if(blob.size>0xffffffff || offset+blob.size>0xffffffff)throw Error('Das Paket ist zu gross.');
  const bytes=new Uint8Array(await blob.arrayBuffer()),crc=crc32(bytes);
  const header=new Uint8Array(30+name.length),v=new DataView(header.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,blob.size,true);v.setUint32(22,blob.size,true);v.setUint16(26,name.length,true);header.set(name,30);
  chunks.push(header,blob);
  const center=new Uint8Array(46+name.length),c=new DataView(center.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,33,true);c.setUint32(16,crc,true);c.setUint32(20,blob.size,true);c.setUint32(24,blob.size,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);center.set(name,46);central.push(center);centralSize+=center.length;offset+=header.length+blob.size;
 }
 const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
 return new Blob([...chunks,...central,end],{type:'application/zip'});
}
export async function readZip(file){
 if(file.size>550*1024*1024)throw Error('Das Paket ist zu gross (maximal 550 MB).');
 const files=new Map();let offset=0;
 while(offset+4<=file.size){
  const bytes=new Uint8Array(await file.slice(offset,offset+30).arrayBuffer());const v=new DataView(bytes.buffer),magic=v.getUint32(0,true);
  if(magic===0x02014b50)break;
  if(magic!==0x04034b50||bytes.length<30)throw Error('Keine gültige Sicherung.');
  const flags=v.getUint16(6,true),method=v.getUint16(8,true),size=v.getUint32(18,true),length=v.getUint16(26,true),extra=v.getUint16(28,true);
  if(method!==0 || (flags&9))throw Error('Bitte eine unveränderte ZIP-Sicherung dieser Seite wählen.');
  const start=offset+30+length+extra;if(start+size>file.size)throw Error('Unvollständiges ZIP.');
  const name=dec.decode(await file.slice(offset+30,offset+30+length).arrayBuffer());
  if(files.has(name)||name.includes('..')||name.startsWith('/'))throw Error('Ungültiger Dateiname im ZIP.');
  const blob=file.slice(start,start+size);
  if(crc32(new Uint8Array(await blob.arrayBuffer()))!==v.getUint32(14,true))throw Error('Beschädigte Datei: '+name);
  files.set(name,blob);offset=start+size;
  if(files.size>500)throw Error('Zu viele Dateien.');
 }
 if(!files.has('kursstand.json'))throw Error('Das ZIP enthält keinen Kursstand.');
 return files;
}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
