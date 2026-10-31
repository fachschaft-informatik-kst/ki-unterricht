/* Inline notebook blocks in first- and fourth-year course chapters.
 * Only published lesson notebook paths are accepted. Nothing executes before
 * the learner explicitly clicks "Notebook öffnen".
 */
(() => {
  const safe = /^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/;
  const root = new URL("../lab/index.html", location.href);
  for (const card of document.querySelectorAll(".ki-notebook-block[data-notebook]")) {
    const path=card.dataset.notebook;
    if(!safe.test(path))continue;
    const name=path.split("/").pop();
    const url=new URL(root.href);
    url.searchParams.set("path","portal/"+name);
    url.searchParams.set("ki-embed","1");
    url.searchParams.set("ki-restore","1");
    url.searchParams.set("reset","");
    const actions=document.createElement("div");
    actions.className="ki-notebook-actions";
    const open=document.createElement("button");open.type="button";
    open.className="ki-notebook-launch";open.textContent="Notebook hier öffnen";
    open.setAttribute("aria-expanded","false");
    const external=document.createElement("a");external.href=url.href;
    external.target="_blank";external.rel="noopener noreferrer";
    external.textContent="In JupyterLite öffnen ↗";
    actions.append(open,external);card.append(actions);
    const region=document.createElement("div");region.className="ki-notebook-runtime";
    region.hidden=true;
    const status=document.createElement("p");status.className="ki-notebook-status";
    status.setAttribute("role","status");status.textContent="JupyterLite wird geladen …";
    region.append(status);
    let frame;
    open.addEventListener("click",()=>{
      const show=region.hidden;
      region.hidden=!show;open.setAttribute("aria-expanded",String(show));
      open.textContent=show?"Notebook schliessen":"Notebook hier öffnen";
      if(!show||frame)return;
      frame=document.createElement("iframe");
      frame.title=(card.dataset.title||"Jupyter-Notebook")+" · bearbeiten und ausführen";
      frame.className="ki-notebook-iframe";frame.loading="lazy";
      frame.allow="clipboard-read; clipboard-write";
      frame.src=url.href;
      frame.addEventListener("load",()=>{status.textContent="Notebook geöffnet. Zellen bearbeiten und mit Shift + Enter ausführen. Falls es noch lädt, kurz den Python-Start abwarten.";});
      region.append(frame);
    });
    card.append(region);
  }
})();
