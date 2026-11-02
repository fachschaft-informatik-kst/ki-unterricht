/* Protected teacher reader. No sensitive content in the public JS bundle. */
(async()=>{
  const root=document.getElementById("teacherContent");
  const kind=root.dataset.kind,course=root.dataset.course;
  const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;");
  const markdown=window.markdownit({html:false,linkify:true,typographer:true}).enable("table");
  const route="/api/teacher?course="+encodeURIComponent(course)+"&kind="+encodeURIComponent(kind);
  function relink(){
    for(const node of root.querySelectorAll("a[href],img[src]")){
      const attr=node.tagName==="IMG"?"src":"href";
      const raw=node.getAttribute(attr);
      if(!raw||/^(?:https?:|mailto:|#|data:)/i.test(raw))continue;
      const filename=/^(?:\.\/)?materialien\/downloads\/([a-zA-Z0-9_.-]+)$/.exec(raw);
      if(filename){
        const teacherOnly=new Set(["Arbeitsblatt_Perzeptron_Lsg.md","KI_Bewertungsraster.md",
          "koordinatengitter_perzeptron_and_loesung.svg","koordinatengitter_or_nand_xor.svg"]);
        node.setAttribute(attr,teacherOnly.has(filename[1])?
          "/teacher/downloads/"+filename[1]:
          "https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/materialien/downloads/"+filename[1]);
      }else if(/^\.?\/?grafiken\//.test(raw))
        node.setAttribute(attr,"https://fachschaft-informatik-kst.github.io/ki-unterricht/projekt/"+raw.replace(/^\.\//,""));
      if(node.tagName==="A"&&node.href.startsWith("https://"))node.rel="noopener noreferrer";
    }
  }
  const lessonTable=lesson=>{
    const rows=(lesson.phases||[]).flatMap(phase=>(phase.schritte||[]).map((step,i)=>
      "<tr>"+(i===0?'<th rowspan="'+phase.schritte.length+'">'+esc(phase.phase)+
       "<small>"+esc(phase.titel)+" · "+esc(phase.minutes)+" Min.</small></th>":"")+
      "<td>"+esc(step.wer)+"</td><td>"+esc(step.text)+"</td><td>"+esc(step.min||"")+"</td></tr>")).join("");
    return '<section class="resource" id="dl-'+esc(lesson.id)+'"><h2>Doppellektion '+
      esc(lesson.number)+' · '+esc(lesson.title)+'</h2><p><strong>Lernziel:</strong> '+
      esc(lesson.goal)+'</p><p><strong>Leitfrage:</strong> '+esc(lesson.question)+'</p>'+
      (lesson.motivation?'<p><strong>Motivation:</strong> '+esc(lesson.motivation)+'</p>':"")+
      '<div class="table-scroll"><table><thead><tr><th>Phase</th><th>Wer</th><th>Was</th><th>Min.</th></tr></thead><tbody>'+
      rows+'</tbody></table></div>'+(lesson.product?'<p><strong>Ergebnis:</strong> '+
      esc(lesson.product)+'</p>':"")+'</section>';
  };
  try{
    const res=await fetch(route,{credentials:"same-origin",cache:"no-store"});
    if(res.status===401){location.href="/auth/start?next="+encodeURIComponent(location.pathname);return;}
    if(!res.ok)throw Error("Lehrpersonenmaterial nicht verfügbar (HTTP "+res.status+").");
    const data=await res.json();
    if(data.kind==="planung"){
      root.innerHTML='<p class="lead">Vollständige AVIVA-Ablauftabellen für alle Doppellektionen.</p>'+
        '<nav class="toc">'+data.lessons.map(l=>'<a href="#dl-'+esc(l.id)+'">'+esc(l.number)+
          ' · '+esc(l.title)+'</a>').join("")+'</nav>'+
        data.lessons.map(lessonTable).join("");
    }else{
      root.innerHTML='<nav class="toc">'+data.sections.map((s,i)=>'<a href="#material-'+i+'">'+
        esc(s.title)+'</a>').join("")+'</nav>'+data.sections.map((s,i)=>
        '<section class="resource" id="material-'+i+'"><h2>'+esc(s.title)+'</h2>'+
        markdown.render(s.markdown)+'</section>').join("");
    }
    relink();
  }catch(err){root.replaceChildren();const p=document.createElement("p");
    p.setAttribute("role","alert");p.textContent=err.message;root.append(p);}
  document.getElementById("printPage").addEventListener("click",()=>window.print());
})();
