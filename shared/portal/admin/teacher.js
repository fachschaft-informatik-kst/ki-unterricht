/* Authenticated teacher reader: only server-provided content is rendered. */
(async()=>{
  const root=document.getElementById("teacherContent");
  const nav=document.getElementById("lessonNav");
  const kind=root.dataset.kind,course=root.dataset.course;
  // Course selection is independent of the chosen teacher material area.
  // Switching courses resets to DL 01 to avoid carrying an unrelated lesson.
  const coursePicker=document.getElementById("teacherCourseSelect");
  coursePicker?.addEventListener("change",()=>{
    const option=coursePicker.selectedOptions[0];
    if(!option||option.disabled||coursePicker.value===course)return;
    const slug=coursePicker.value;
    if(!/^[a-z][a-z0-9]*\/(?:1|4)-klasse$/.test(slug))return;
    location.assign("/teacher/"+slug+"/"+kind+"?dl=1");
  });
  const escape=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;");
  const markdown=window.markdownit({html:false,linkify:true,typographer:true}).enable("table");
  const site="https://fachschaft-informatik-kst.github.io/ki-unterricht/";
  const downloadable=new Set(["Arbeitsblatt_Perzeptron_Lsg.md","KI_Bewertungsraster.md",
    "koordinatengitter_perzeptron_and_loesung.svg","koordinatengitter_or_nand_xor.svg"]);
  let lessons=[],current=null,requestId=0;
  const selection=()=>{
    const params=new URLSearchParams(location.search);
    const number=Number(params.get("dl")||1);
    return Number.isInteger(number)&&number>=1&&number<=20?number:1;
  };
  function updateTabLinks(number){
    document.querySelectorAll(".area-nav a").forEach(a=>{
      const url=new URL(a.href);
      url.searchParams.set("dl",String(number));
      a.href=url.pathname+url.search;
    });
  }
  function renderNav(number){
    nav.innerHTML=lessons.map(l=>{
      const active=Number(l.number)===number;
      return '<a class="lesson-link'+(active?' is-active':'')+'" href="?dl='+encodeURIComponent(l.number)+
        '" data-dl="'+escape(l.number)+'"'+(active?' aria-current="page"':'')+
        '><span class="lesson-index">'+String(l.number).padStart(2,"0")+
        '</span><span class="lesson-name"><small>Doppellektion '+escape(l.number)+
        '</small><strong>'+escape(l.title)+'</strong></span></a>';
    }).join("");
    updateTabLinks(number);
  }
  nav.addEventListener("click",event=>{
    const a=event.target.closest("a[data-dl]");
    if(!a)return;
    event.preventDefault();
    const number=Number(a.dataset.dl);
    if(number===current)return;
    const url=new URL(location.href);
    url.searchParams.set("dl",String(number));
    history.pushState({dl:number},"",url);
    load(number,true);
  });
  window.addEventListener("popstate",()=>load(selection(),false));
  function relink(){
    for(const element of root.querySelectorAll("a[href],img[src]")){
      const attr=element.tagName==="IMG"?"src":"href";
      const raw=element.getAttribute(attr);
      if(!raw||/^(?:https?:|mailto:|#|data:)/i.test(raw))continue;
      const asset=/^(?:\.\/)?materialien\/downloads\/([a-zA-Z0-9_.-]+)$/.exec(raw);
      if(asset){
        element.setAttribute(attr,downloadable.has(asset[1])?
          "/teacher/downloads/"+asset[1]+"?course="+encodeURIComponent(course):site+course+"/materialien/downloads/"+asset[1]);
      }else if(/^(?:\.\/)?(?:grafiken|studio|runtime|previews)\//.test(raw)){
        element.setAttribute(attr,site+course+"/"+raw.replace(/^\.\//,""));
      }else if(/^(\.\.\/)*index\.html(?:#.*)?$/.test(raw)){
        element.setAttribute(attr,site+course+"/"+raw.replace(/^(?:\.\.\/)*/,""));
      }else if(raw.startsWith("../lab/")){
        const url=new URL(site+raw.replace("../",""));
        const notebook=url.searchParams.get("path");
        if(/^portal\/[a-z0-9_]+\.ipynb$/.test(notebook||""))
          url.searchParams.set("path","portal/"+course+"/"+notebook.split("/").pop());
        element.setAttribute(attr,url.href);
      }
      if(element.tagName==="A"&&element.href.startsWith("https://")){
        element.rel="noopener noreferrer";
        element.target="_blank";
      }
    }
  }
  const roleClass=wer=>{
    if(wer==="Lehrperson")return "wer-l";
    if(wer==="Ergebnis")return "wer-r";
    if(wer.startsWith("Klasse")||wer.startsWith("Plenum"))return "wer-k";
    if(wer.startsWith("Einzeln"))return "wer-e";
    return "wer-t";
  };
  const legend='<div class="role-legend" aria-label="Farblegende">'+
    '<span class="wer-l">Lehrperson · Input</span>'+
    '<span class="wer-e">Einzelarbeit</span>'+
    '<span class="wer-t">Tandem / Gruppe</span>'+
    '<span class="wer-k">Klasse / Plenum</span>'+
    '<span class="wer-r">Ergebnis</span></div>';
  const phaseTable=lesson=>{
    const rows=(lesson.phases||[]).flatMap(phase=>(phase.schritte||[]).map((step,i)=>{
      const wer=String(step.wer||"");
      return '<tr class="'+roleClass(wer)+'">'+(i===0?
        '<th class="phase" scope="rowgroup" rowspan="'+phase.schritte.length+'"><strong>'+
        escape(phase.phase)+'</strong><small>'+escape(phase.titel)+' · '+escape(phase.minutes)+
        ' Min.</small></th>':"")+
        '<td class="wer">'+escape(wer)+'</td><td class="was">'+escape(step.text)+
        '</td><td class="min">'+escape(step.min??"")+'</td></tr>';
    })).join("");
    return '<div class="table-scroll"><table class="phase-table"><thead><tr>'+
      '<th scope="col">Phase</th><th scope="col">Wer</th><th scope="col">Was</th>'+
      '<th scope="col">Min.</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  };
  function heading(data,kicker){
    return '<div class="lesson-heading"><p class="lesson-kicker">'+escape(kicker)+
      ' · Doppellektion '+escape(data.selectedNumber)+'</p><h2>DL '+
      String(data.selectedNumber).padStart(2,"0")+' · '+escape(data.selectedTitle)+'</h2></div>';
  }
  function lessonView(data){
    const l=data.lesson;
    return heading(data,"AVIVA-Planung")+
      '<section class="resource aviva-content">'+
      '<p class="lesson-lead"><strong>Lernziel</strong>'+escape(l.goal)+'</p>'+
      '<p class="lesson-question"><strong>Leitfrage</strong>'+escape(l.question)+'</p>'+
      (l.motivation?'<p class="small-info"><strong>Warum diese Lektion?</strong> '+
        escape(l.motivation)+'</p>':"")+
      '<h3 class="subheading">Unterrichtsablauf · 90 Minuten</h3>'+legend+
      phaseTable(l)+
      (l.product?'<p class="lesson-output"><strong>Ergebnis am Ende</strong> '+escape(l.product)+'</p>':"")+
      (l.zeit?'<p class="small-info"><strong>Zeitliche Hinweise</strong> '+escape(l.zeit)+'</p>':"")+
      '</section>';
  }
  function materialsView(data){
    return heading(data,"Materialkoffer")+
      (data.intro?'<div class="intro-note">'+markdown.render(data.intro)+'</div>':"")+
      data.sections.map(section=>'<section class="resource materials-content">'+
        '<p class="section-label">Materialien für DL '+escape(data.selectedNumber)+'</p>'+
        markdown.render(section.markdown)+'</section>').join("");
  }
  const fileSize=bytes=>bytes?(bytes>=1048576?(bytes/1048576).toFixed(1).replace(".",",")+" MB":
    Math.max(1,Math.round(bytes/1024))+" KB"):"";
  // Visible Word download in the top-right corner of each AVIVA phase.
  function documentLink(doc,className){
    const link=document.createElement("a");
    link.className=className;link.href=doc.url;link.setAttribute("download",doc.file);
    link.setAttribute("aria-label","Word-Dokument für Schülerinnen und Schüler herunterladen: "+
      doc.phaseName+" · "+doc.title+(doc.bytes?" ("+fileSize(doc.bytes)+")":""));
    const icon=document.createElement("span");icon.className="doc-icon";icon.setAttribute("aria-hidden","true");icon.textContent="W";
    const label=document.createElement("span");label.className="doc-label";
    const strong=document.createElement("strong");strong.textContent="Word-Dokument";
    const small=document.createElement("small");small.textContent="für Lernende · .docx";
    label.append(strong,small);link.append(icon,label);
    return link;
  }
  function formatMaterialWorkshop(data){
    if(!["bok/4-klasse","irn/4-klasse"].includes(course)||kind!=="materialien")return;
    const documents=new Map((data.documents||[]).map(doc=>[doc.phase,doc]));
    for(const resource of root.querySelectorAll(".materials-content")){
      resource.classList.add("materials-workshop");
      const quick=document.createElement("nav");
      quick.className="material-phase-nav";quick.setAttribute("aria-label","AVIVA-Phasen im Materialkoffer");
      const preparation=document.createElement("div");preparation.className="material-preparation";
      let destination=preparation,index=0;
      const nodes=[...resource.childNodes];
      for(const node of nodes){
        if(node.nodeType===Node.ELEMENT_NODE&&node.matches("h3")&&
          /^(Ankommen|Vorwissen aktivieren|Informieren|Verarbeiten|Auswerten) · /.test(node.textContent)){
          const parts=node.textContent.split(" · ");
          destination=document.createElement("article");
          destination.className="material-phase";destination.id="material-phase-"+(++index);
          const badge=document.createElement("span");badge.className="material-phase-index";
          badge.textContent=String(index).padStart(2,"0");badge.setAttribute("aria-hidden","true");
          const header=document.createElement("header");header.className="material-phase-heading";
          const label=document.createElement("p");label.className="material-phase-label";
          label.textContent=parts[0]+" · "+parts[1];
          node.textContent=parts.slice(2).join(" · ");
          header.append(badge,label,node);
          const doc=documents.get(index);
          if(doc){header.classList.add("has-document");header.append(documentLink(doc,"material-phase-download"));}
          destination.append(header);resource.append(destination);
          const link=document.createElement("a");link.href="#"+destination.id;
          link.textContent=parts[0]+" · "+parts[1];quick.append(link);
        }else if(node.nodeType===Node.ELEMENT_NODE&&node.matches("h3")&&
          /^Doppellektion \d+/.test(node.textContent)){
          node.remove();
        }else destination.append(node);
      }
      resource.prepend(preparation,quick);
      for(const table of resource.querySelectorAll("table")){
        const scroll=document.createElement("div");scroll.className="material-table-scroll";
        scroll.tabIndex=0;scroll.setAttribute("role","region");
        scroll.setAttribute("aria-label","Materialtabelle – horizontal scrollbar");
        table.before(scroll);scroll.append(table);
      }
      for(const paragraph of resource.querySelectorAll("p")){
        const image=paragraph.querySelector(":scope > img:only-child");
        if(!image||paragraph.textContent.trim())continue;
        const figure=document.createElement("figure");
        const link=document.createElement("a");link.href=image.getAttribute("src");
        link.target="_blank";link.rel="noopener noreferrer";
        const caption=document.createElement("figcaption");caption.textContent=image.alt;
        image.loading="lazy";link.append(image);figure.append(link,caption);paragraph.replaceWith(figure);
      }
      for(const figure of [...resource.querySelectorAll(".material-phase > figure")]){
        if(figure.parentElement.classList.contains("material-gallery"))continue;
        const gallery=document.createElement("div");gallery.className="material-gallery";
        figure.before(gallery);
        let next=figure;
        while(next?.matches("figure")){
          const following=next.nextElementSibling;
          gallery.append(next);next=following;
        }
      }
    }
  }
  function documentsView(data){
    const docs=data.documents||[];
    const head='<div class="lesson-heading"><p class="lesson-kicker">Word-Dokumente für Schülerinnen und Schüler</p>'+
      '<h2>Alle Dokumente</h2></div>';
    if(!docs.length)return head+'<section class="resource"><p>Für diesen Kurs sind noch keine Dokumente erstellt. '+
      'Sie werden mit <code>scripts/build_student_documents.py</code> aus dem Materialkoffer erzeugt.</p></section>';
    const lessonsWithDocs=[...new Set(docs.map(d=>d.dl))].sort((a,b)=>a-b);
    const zip=data.zip?'<a class="zip-download" href="'+escape(data.zip.url)+'" download="'+escape(data.zip.file)+'">'+
      '<span class="zip-icon" aria-hidden="true">ZIP</span><span><strong>Alle Dokumente als ZIP herunterladen</strong>'+
      '<small>'+escape(docs.length)+' Word-Dokumente · '+escape(lessonsWithDocs.length)+' Doppellektionen'+
      (data.zip.bytes?' · '+escape(fileSize(data.zip.bytes)):'')+'</small></span></a>':"";
    const groups=lessonsWithDocs.map(dl=>{
      const items=docs.filter(d=>d.dl===dl).sort((a,b)=>a.phase-b.phase);
      const title=(data.lessons||[]).find(l=>Number(l.number)===dl)?.title||items[0].lesson;
      return '<section class="resource document-group'+(dl===data.selectedNumber?' is-selected':'')+
        '" id="dokumente-dl-'+escape(dl)+'" aria-labelledby="dokumente-dl-'+escape(dl)+'-title">'+
        '<div class="document-group-head"><p class="section-label">Doppellektion '+escape(dl)+'</p>'+
        '<h3 id="dokumente-dl-'+escape(dl)+'-title">DL '+String(dl).padStart(2,"0")+' · '+escape(title)+'</h3>'+
        '<a class="document-group-link" href="/teacher/'+escape(course)+'/materialien?dl='+escape(dl)+'">Im Materialkoffer öffnen</a></div>'+
        '<ol class="document-list">'+items.map(d=>'<li><a href="'+escape(d.url)+'" download="'+escape(d.file)+'">'+
          '<span class="doc-icon" aria-hidden="true">W</span><span class="doc-text"><small>Phase '+escape(d.phase)+' · '+
          escape(d.phaseName)+(d.minutes?' · '+escape(d.minutes)+' Min.':'')+'</small><strong>'+escape(d.title)+'</strong></span>'+
          '<span class="doc-meta">.docx'+(d.bytes?' · '+escape(fileSize(d.bytes)):'')+'</span></a></li>').join("")+
        '</ol></section>';
    }).join("");
    return head+'<div class="documents-overview">'+zip+'<p class="intro-note">Pro AVIVA-Phase ein Word-Dokument mit Aufträgen, '+
      'Tabellen und Grafiken für die Lernenden. Lehrpersonenhinweise, Selbstkontrollen und Lösungen sind nicht enthalten. '+
      'Die Dokumente lassen sich in Word bearbeiten, drucken oder an die Klasse weitergeben.</p></div>'+groups;
  }
  function solutionsView(data){
    const header=heading(data,"Musterlösungen")+
      '<p class="intro-note">Die Musterantworten sind Beispiele, keine einzig gültigen Lösungen. '+
      'Beobachtungen und Zahlen aus den Experimenten müssen anhand der eigenen Daten überprüft werden.</p>';
    const answerCards=data.entries.map(entry=>
      '<article class="solution-card">'+
      '<div class="solution-meta"><span>'+(entry.questionSource==="thema"?'Thema / Teilaufgabe':entry.questionSource==="sinngemaess"?'Fragestellung (sinngemäss)':'Originalfrage / Auftrag')+'</span><code>'+escape(entry.field)+'</code></div>'+
      '<h3 class="solution-question">'+escape(entry.question)+'</h3>'+
      '<p class="question-source"><a href="'+escape(entry.courseLink)+
      '" target="_blank" rel="noopener noreferrer">'+(entry.courseLink.includes("#feld-")?
        'Zugehörige Aufgabe auf der Kursseite öffnen':'Doppellektion auf der Kursseite öffnen')+'</a></p>'+
      '<div class="sample-answer"><span class="answer-label">Mögliche Musterantwort</span>'+
      markdown.render(entry.answer)+'</div></article>').join("");
    return header+'<section class="resource">'+
      '<h3 class="subheading">Antworten zu den Aufgaben dieser Doppellektion</h3>'+
      (answerCards||'<p>Für diese Doppellektion sind keine einzelnen Antwortfelder erfasst. '+
        'Die fachlichen Hinweise stehen unten.</p>')+
      '</section>'+
      data.notes.map(note=>'<details class="teacher-notes"><summary>Fachliche Hinweise: '+
        escape(note.title)+'</summary><div class="notes-body">'+markdown.render(note.markdown)+
        '</div></details>').join("");
  }
  async function load(number,scroll){
    const req=++requestId;
    root.setAttribute("aria-busy","true");
    root.innerHTML='<p class="loading">Doppellektion '+escape(number)+' wird geladen …</p>';
    if(lessons.length)renderNav(number);
    try{
      const url="/api/teacher?course="+encodeURIComponent(course)+"&kind="+encodeURIComponent(kind)+
        "&dl="+encodeURIComponent(number);
      const res=await fetch(url,{credentials:"same-origin",cache:"no-store"});
      if(req!==requestId)return;
      if(res.status===401){location.href="/auth/start?next="+encodeURIComponent(location.pathname+location.search);return;}
      if(!res.ok)throw Error("Materialien konnten nicht geladen werden (HTTP "+res.status+").");
      const data=await res.json();
      if(req!==requestId)return;
      lessons=data.lessons;
      current=data.selectedNumber;
      renderNav(current);
      root.innerHTML=data.kind==="planung"?lessonView(data):
        data.kind==="materialien"?materialsView(data):
        data.kind==="dokumente"?documentsView(data):solutionsView(data);
      formatMaterialWorkshop(data);
      relink();
      const group=data.kind==="dokumente"&&document.getElementById("dokumente-dl-"+current);
      if(group&&(scroll||new URLSearchParams(location.search).has("dl")&&current!==1))
        group.scrollIntoView({behavior:scroll?"smooth":"auto",block:"start"});
      else if(scroll)root.scrollIntoView({behavior:"smooth",block:"start"});
    }catch(error){
      if(req!==requestId)return;
      root.innerHTML='<p role="alert">'+escape(error.message)+'</p>';
    }finally{if(req===requestId)root.removeAttribute("aria-busy");}
  }
  document.getElementById("printPage").addEventListener("click",()=>window.print());
  load(selection(),false);
})();
