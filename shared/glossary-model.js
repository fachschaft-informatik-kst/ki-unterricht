/* One glossary data contract for the authenticated editor and its Worker. */
export const GLOSSARY_PATH = "kursseiten/glossar.json";
export const GLOSSARY_FIELDS = ["begriff","basis","vertieft","beispiel","frage","antwort"];
const validText = (value,min,max) => typeof value==="string" && value.trim().length>=min && value.length<=max;
export function validateGlossary(doc){
  if(!doc || typeof doc!=="object" || Array.isArray(doc) || doc.version!==1)throw Error("Glossar-Version ungültig.");
  if(!Array.isArray(doc.gruppen)||doc.gruppen.length<1||doc.gruppen.length>20||
     doc.gruppen.some(g=>!validText(g,2,70))||new Set(doc.gruppen).size!==doc.gruppen.length)
    throw Error("Glossar-Themenbereiche fehlen oder sind doppelt.");
  if(!Array.isArray(doc.begriffe)||doc.begriffe.length<1||doc.begriffe.length>160)
    throw Error("Glossar muss 1–160 Begriffe enthalten.");
  const seen=new Set();
  for(const term of doc.begriffe){
    if(!term || typeof term!=="object" || Array.isArray(term) || !/^[a-z][a-z0-9-]{0,69}$/.test(term.id||"") || seen.has(term.id))
      throw Error("Glossar-ID fehlt, ist ungültig oder doppelt.");
    seen.add(term.id);
    if(!doc.gruppen.includes(term.gruppe))throw Error("Ungültiger Themenbereich bei "+term.id+".");
    for(const key of GLOSSARY_FIELDS){
      const min=key==="begriff"?2:8;
      const max=key==="antwort"?180:key==="begriff"?100:1500;
      if(!validText(term[key],min,max))throw Error("Glossarbegriff "+term.id+": Feld "+key+" fehlt oder ist zu lang/kurz.");
    }
    // Optional course-specific text overrides keep existing shared values as
    // backwards-compatible defaults. The editor never writes across levels.
    for(const key of ["basisBeispiel","basisFrage","basisAntwort","vertieftBeispiel","vertieftFrage","vertieftAntwort"]){
      if(term[key]!==undefined&&!validText(term[key],8,key.endsWith("Antwort")?180:1500))
        throw Error("Glossarbegriff "+term.id+": Kursfeld "+key+" fehlt oder ist zu lang/kurz.");
    }
    if(term.basis===term.vertieft)throw Error("1. und 4. Klasse brauchen unterschiedliche Begriffserklärungen: "+term.id+".");
  }
  return doc;
}
