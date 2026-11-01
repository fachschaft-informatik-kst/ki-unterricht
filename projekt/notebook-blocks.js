/* One notebook control for every first- and fourth-year lesson.
 * The published course and the teacher preview share this markup and CSS.
 * Existing course controllers own notebook persistence; new lesson notebooks
 * use an isolated iframe and only start after an explicit click.
 */
(() => {
  const safe = /^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/;
  const labUrl = new URL("../lab/index.html", location.href);
  // Warm the JupyterLite app shell in the HTTP cache while the lesson is read.
  // This does NOT start a second Python kernel or a hidden notebook session.
  const prefetched = new Set();
  const prefetch = url => {
    if (navigator.connection?.saveData || document.visibilityState !== "visible" || prefetched.has(url)) return;
    prefetched.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url;
    document.head.append(link);
  };
  // Intent warming starts at most one managed course iframe, not a second
  // throwaway kernel. Avoid surprising costs on metered or low-RAM devices.
  const warmManaged = name => {
    if (navigator.connection?.saveData || document.visibilityState !== "visible" ||
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        /^(slow-2g|2g)$/.test(navigator.connection?.effectiveType || "")) return;
    window.dispatchEvent(new CustomEvent("ki-notebook-warmup", {detail:{name}}));
  };
  const warmShell = () => prefetch(labUrl.href);
  if ("requestIdleCallback" in window) requestIdleCallback(warmShell, {timeout:5000});
  else window.addEventListener("load", () => setTimeout(warmShell, 1000), {once:true});
  const basic = /\/basis\//.test(location.pathname);
  const coursePage = /\/(?:basis|projekt)\/(?:index\.html)?$/.test(location.pathname);
  // A material index also contains direct links to notebook downloads.
  // Keep those downloads and add the same interactive notebook element.
  if (/\/materialien\.html$/.test(location.pathname)) {
    const titles = {
      basis_neuron: "Ein Neuron entscheidet", xor_einzelne_neuronen: "XOR mit einem Neuron",
      basis_netze: "Neuronale Netze", mehrschichtige_netze: "Neuronale Netze",
      perzeptron_und_neuronale_netze: "Ein Neuron entscheidet",
      ziffernerkennung: "Ziffernerkennung", daten_training: "Daten fair aufteilen",
      basis_bildmodell: "Ziffern und Buchstaben", basis_fotoprojekt: "Eigene Fotos erkennen",
      ki_lernlabor: "Projekt-Lernlabor", ki_tandemprojekt: "Unser Versuch"
    };
    for (const link of document.querySelectorAll("main a[href]")) {
      if (link.closest(".ki-notebook-block")) continue;
      const target = new URL(link.href);
      const embedded = target.pathname.endsWith("/lab/index.html");
      const downloadable = /\/downloads\/[a-z0-9_]+\.ipynb$/.test(target.pathname);
      if (!embedded && !downloadable) continue;
      const found = embedded
        ? /^portal\/([a-z0-9_]+\.ipynb)$/.exec(target.searchParams.get("path") || "")
        : /\/([a-z0-9_]+\.ipynb)$/.exec(target.pathname);
      if (!found) continue;
      const name = found[1];
      const title = titles[name.slice(0, -6)] || name.replace(/\.ipynb$/, "").replaceAll("_", " ");
      const card = document.createElement("div");
      card.className = "ki-notebook-block";
      card.dataset.notebook = "content/" + (name.startsWith("ki_") ? "ki_projekt/" : "") + name;
      card.dataset.title = title;
      const heading = document.createElement("h3");
      heading.textContent = "Jupyter-Notebook · " + title;
      const desc = document.createElement("p");
      desc.textContent = "Python-Zellen direkt bearbeiten und ausführen.";
      card.append(heading, desc);
      (link.closest("li") || link.closest("p") || link).after(card);
    }
  }
  const basicNotebooks = new Set([
    "basis_neuron.ipynb", "xor_einzelne_neuronen.ipynb", "basis_netze.ipynb",
    "basis_bildmodell.ipynb", "basis_fotoprojekt.ipynb"
  ]);
  const advancedNotebooks = new Set([
    "perzeptron_und_neuronale_netze.ipynb", "xor_einzelne_neuronen.ipynb",
    "mehrschichtige_netze.ipynb", "ziffernerkennung.ipynb",
    "daten_training.ipynb", "ki_lernlabor.ipynb", "ki_tandemprojekt.ipynb"
  ]);

  for (const card of document.querySelectorAll(".ki-notebook-block[data-notebook]")) {
    const path = card.dataset.notebook;
    if (!safe.test(path) || card.dataset.notebookInitialized === "true") continue;
    const name = path.split("/").pop();
    const url = new URL(labUrl);
    url.searchParams.set("path", "portal/" + name);
    const managed = coursePage && (basic ? basicNotebooks.has(name) : advancedNotebooks.has(name));

    const actions = card.querySelector(".ki-notebook-actions") || document.createElement("div");
    actions.className = "ki-notebook-actions";
    let open = card.querySelector(".ki-notebook-launch, button[data-lab], #start-project");
    if (!open) {
      if (basic && managed) {
        open = document.createElement("a");
        open.href = "../lab/index.html?path=" + encodeURIComponent("portal/" + name);
      } else {
        open = document.createElement("button");
        open.type = "button";
        if (managed) open.dataset.lab = name;
      }
    }
    open.classList.add("ki-notebook-launch");
    open.textContent = "Notebook öffnen";
    open.setAttribute("aria-expanded", "false");
    // Hover/focus is a useful signal for a specific notebook; prefetch its
    // document, but leave all Python workers off until the actual open action.
    const warmNotebook = () => {
      const embed = new URL(url);
      embed.searchParams.set("ki-embed", "1");
      embed.searchParams.set("reset", "");
      prefetch(embed.href);
    };
    if (managed) {
      const warm = () => warmManaged(name);
      open.addEventListener("pointerenter", warm, {once:true});
      open.addEventListener("focus", warm, {once:true});
    } else {
      open.addEventListener("pointerenter", warmNotebook, {once:true});
      open.addEventListener("focus", warmNotebook, {once:true});
    }

    const external = card.querySelector(".ki-notebook-direct") || document.createElement("a");
    external.className = "ki-notebook-direct";
    external.href = url.href;
    external.target = "_blank";
    external.rel = "noopener noreferrer";
    external.textContent = "Separat öffnen ↗";
    external.setAttribute("aria-label", "Notebook separat in JupyterLite öffnen");
    actions.append(open, external);
    card.append(actions);
    card.dataset.notebookInitialized = "true";

    if (managed) {
      // The existing portal/persistence controller mounts its saved lab here.
      // Do not create a second iframe or a second Python kernel.
      open.addEventListener("click", () => open.setAttribute("aria-expanded", "true"));
      continue;
    }

    // Extra lesson notebooks/material-page notebooks also use a native modal.
    // Closing it only hides the iframe, so the Python runtime remains mounted.
    const region = document.createElement("dialog");
    region.className = "ki-notebook-runtime ki-notebook-dialog";
    region.hidden = true;
    region.setAttribute("aria-label", (card.dataset.title || "Jupyter-Notebook") + " bearbeiten");
    const head = document.createElement("div");
    head.className = "ki-notebook-modal-head";
    const label = document.createElement("strong");
    label.textContent = card.dataset.title || "Jupyter-Notebook";
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "lab-close-toggle";
    dismiss.title = "Notebook schliessen";
    dismiss.setAttribute("aria-label", "Notebook schliessen");
    dismiss.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    head.append(label, dismiss);
    const status = document.createElement("p");
    status.className = "ki-notebook-status";
    status.setAttribute("role", "status");
    status.textContent = "JupyterLite wird geladen …";
    region.append(head, status);
    let frame;
    const close = () => { if (region.open) region.close(); };
    dismiss.addEventListener("click", close);
    region.addEventListener("click", event => {
      if (event.target !== region) return;
      const rect = region.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) close();
    });
    region.addEventListener("close", () => {
      region.hidden = true;
      document.body.classList.remove("ki-notebook-modal-open");
      open.setAttribute("aria-expanded", "false");
      open.textContent = "Notebook öffnen";
      if (open.isConnected) open.focus({preventScroll:true});
    });
    window.addEventListener("hashchange", close);
    open.addEventListener("click", event => {
      event.preventDefault();
      if (region.open) { close(); return; }
      region.hidden = false;
      region.showModal();
      document.body.classList.add("ki-notebook-modal-open");
      open.setAttribute("aria-expanded", "true");
      dismiss.focus({preventScroll:true});
      if (frame) return;
      frame = document.createElement("iframe");
      frame.title = (card.dataset.title || "Jupyter-Notebook") + " · bearbeiten und ausführen";
      frame.className = "ki-notebook-iframe";
      frame.loading = "lazy";
      frame.allow = "clipboard-read; clipboard-write";
      const embed = new URL(url);
      embed.searchParams.set("ki-embed", "1");
      embed.searchParams.set("ki-restore", "1");
      embed.searchParams.set("reset", "");
      frame.src = embed.href;
      frame.addEventListener("load", () => {
        status.textContent = "Python-Zellen mit Shift + Enter ausführen.";
      });
      region.append(frame);
    });
    card.append(region);
  }

  // Warm only after a reader deliberately visits a chapter containing exactly
  // one managed notebook. Home-page visits and multi-notebook chapters remain
  // cold until the user hovers or focuses a specific launcher.
  let chapterTimer;
  const warmChapter = () => {
    clearTimeout(chapterTimer);
    const hash = location.hash;
    if (!coursePage || hash.length < 2) return;
    let section;
    try { section = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    const cards = [...(section?.querySelectorAll(".ki-notebook-block[data-notebook]") || [])]
      .filter(card => card.querySelector(".ki-notebook-launch") &&
        (basic ? basicNotebooks : advancedNotebooks).has(card.dataset.notebook.split("/").pop()));
    if (cards.length !== 1) return;
    const name = cards[0].dataset.notebook.split("/").pop();
    chapterTimer = setTimeout(() => {
      if (location.hash === hash) warmManaged(name);
    }, 1600);
  };
  window.addEventListener("hashchange", warmChapter);
  warmChapter();
})();
