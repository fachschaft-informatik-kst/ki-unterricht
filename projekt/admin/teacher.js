/* Authenticated teacher reader: only server-provided content is rendered. */
(async()=>{
  const root=document.getElementById("teacherContent");
  const nav=document.getElementById("lessonNav");
  const kind=root.dataset.kind,course=root.dataset.course;
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
          "/teacher/downloads/"+asset[1]:site+"projekt/materialien/downloads/"+asset[1]);
      }else if(/^(?:\.\/)?grafiken\//.test(raw)){
        element.setAttribute(attr,site+"projekt/"+raw.replace(/^\.\//,""));
      }else if(/^(\.\.\/)*index\.html(?:#.*)?$/.test(raw)){
        element.setAttribute(attr,site+course+"/"+raw.replace(/^(?:\.\.\/)*/,""));
      }else if(raw.startsWith("../lab/")){
        element.setAttribute(attr,site+raw.replace("../",""));
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
  function solutionsView(data){
    const header=heading(data,"Musterlösungen")+
      '<p class="intro-note">Die Musterantworten sind Beispiele, keine einzig gültigen Lösungen. '+
      'Beobachtungen und Zahlen aus den Experimenten müssen anhand der eigenen Daten überprüft werden.</p>';
    const answerCards=data.entries.map(entry=>
      '<article class="solution-card">'+
      '<div class="solution-meta"><span>Aufgabe / Frage</span><code>'+escape(entry.field)+'</code></div>'+
      '<h3 class="solution-question">'+escape(entry.question)+'</h3>'+
      (!entry.questionFound?'<p class="question-hint">Der genaue Wortlaut wurde nicht eindeutig erkannt. '+
       '<a href="'+escape(entry.courseLink)+'" target="_blank" rel="noopener noreferrer">'+
       'Originalauftrag auf der Kursseite ansehen</a>.</p>':
       '<p class="question-source"><a href="'+escape(entry.courseLink)+
       '" target="_blank" rel="noopener noreferrer">Zur Aufgabe auf der Kursseite</a></p>')+
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
        data.kind==="materialien"?materialsView(data):solutionsView(data);
      relink();
      if(scroll)root.scrollIntoView({behavior:"smooth",block:"start"});
    }catch(error){
      if(req!==requestId)return;
      root.innerHTML='<p role="alert">'+escape(error.message)+'</p>';
    }finally{if(req===requestId)root.removeAttribute("aria-busy");}
  }
  document.getElementById("printPage").addEventListener("click",()=>window.print());
  load(selection(),false);
})();
