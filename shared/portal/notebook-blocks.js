/* One notebook control for every first- and fourth-year lesson.
 * The published course and the teacher preview share this markup and CSS.
 * Existing course controllers own notebook persistence; new lesson notebooks
 * use an isolated iframe and only start after an explicit click.
 */
(() => {
  // Optional "next to the page" mode for every notebook dialog. A native modal
  // makes the course page inert, so docking re-opens the same <dialog> as a
  // non-modal side panel. The iframe is never moved, so Pyodide keeps running.
  // Shared with lab-fullscreen.js through window.kiNotebookDock.
  if (!window.kiNotebookDock) {
    const docks = new Set();
    const KEY = "ki-notebook-docked", WIDTH_KEY = "ki-notebook-dock-width";
    const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
    const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
    const wide = () => window.matchMedia("(min-width:901px)").matches;
    const clampWidth = px => Math.min(Math.max(px, 340), Math.max(340, innerWidth - 700));
    const setWidth = px => {
      const width = clampWidth(px);
      document.documentElement.style.setProperty("--ki-dock-w", width + "px");
      return width;
    };
    const stored = parseInt(read(WIDTH_KEY), 10);
    if (stored) setWidth(stored);
    const syncBody = () => document.body.classList.toggle("ki-notebook-docked",
      [...docks].some(dock => dock.panel.open && dock.panel.classList.contains("lab-docked")));
    const svg = path => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
    const DOCK_ICON = "M3 5h18v14H3zM14 5v14", WINDOW_ICON = "M5 5h14v14H5z";

    window.kiNotebookDock = {
      bind(panel, head, before = null) {
        if (panel.dataset.dockBound) return panel.kiDock;
        panel.dataset.dockBound = "1";
        let docked = read(KEY) === "1";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lab-dock-toggle";
        before ? before.before(button) : head.append(button);
        const handle = document.createElement("div");
        handle.className = "lab-dock-resizer";
        handle.setAttribute("role", "separator");
        handle.setAttribute("aria-orientation", "vertical");
        handle.setAttribute("aria-label", "Breite des Notebooks ändern");
        handle.tabIndex = 0;
        panel.append(handle);

        const isDocked = () => panel.open && panel.classList.contains("lab-docked");
        const sync = () => {
          const on = panel.open && docked && wide();
          panel.classList.toggle("lab-docked", on);
          const label = docked ? "Als Fenster in der Mitte anzeigen" : "Neben der Kursseite anzeigen";
          button.innerHTML = svg(docked ? WINDOW_ICON : DOCK_ICON) + '<span class="lab-dock-text">' + (docked ? "Fenster" : "Daneben") + "</span>";
          button.setAttribute("aria-pressed", String(docked));
          button.setAttribute("aria-label", label);
          button.title = label;
          syncBody();
        };
        // Close handlers of the controllers ignore the close event caused by switching mode.
        const reopen = () => {
          panel.dataset.switching = "1";
          const done = () => { delete panel.dataset.switching; };
          panel.addEventListener("close", done, {once: true});
          setTimeout(done, 300);
          panel.close();
          show();
        };
        const show = () => {
          for (const other of docks) if (other.panel !== panel && other.panel.open) other.panel.close();
          if (docked && wide()) panel.show(); else panel.showModal();
          sync();
        };
        button.addEventListener("click", () => {
          docked = !docked;
          write(KEY, docked ? "1" : "0");
          if (docked) panel.querySelector(".lab-fullscreen-toggle[aria-pressed=true]")?.click();
          if (panel.open) { reopen(); button.focus({preventScroll: true}); } else sync();
        });
        panel.addEventListener("close", () => { if (!panel.dataset.switching) sync(); });
        window.addEventListener("resize", () => { if (isDocked() && !wide()) reopen(); });

        let dragging = false;
        handle.addEventListener("pointerdown", event => {
          dragging = true;
          handle.setPointerCapture(event.pointerId);
          panel.classList.add("lab-docked-resizing");
          event.preventDefault();
        });
        handle.addEventListener("pointermove", event => { if (dragging) setWidth(innerWidth - event.clientX); });
        const stop = () => {
          if (!dragging) return;
          dragging = false;
          panel.classList.remove("lab-docked-resizing");
          write(WIDTH_KEY, String(Math.round(panel.getBoundingClientRect().width)));
        };
        handle.addEventListener("pointerup", stop);
        handle.addEventListener("pointercancel", stop);
        handle.addEventListener("keydown", event => {
          const step = event.key === "ArrowLeft" ? 40 : event.key === "ArrowRight" ? -40 : 0;
          if (!step) return;
          event.preventDefault();
          write(WIDTH_KEY, String(setWidth(panel.getBoundingClientRect().width + step)));
        });

        const api = {panel, show, get docked() { return isDocked(); }};
        panel.kiDock = api;
        docks.add(api);
        sync();
        return api;
      }
    };
  }
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
  // The published BOK routes are nested one level deeper than the legacy
  // /basis/ and /projekt/ addresses, but they use the SAME course controllers.
  // Treating them as standalone cards creates a competing iframe/kernel.
  const basic = /\/(?:basis|[a-z][a-z0-9]*\/1-klasse)\/(?:index\.html)?$/.test(location.pathname);
  const coursePage = /\/(?:basis|projekt|[a-z][a-z0-9]*\/(?:1|4)-klasse)\/(?:index\.html)?$/.test(location.pathname);
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
    const dock = window.kiNotebookDock?.bind(region, head, dismiss);
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
      if (region.dataset.switching) return;
      region.hidden = true;
      document.body.classList.remove("ki-notebook-modal-open");
      open.setAttribute("aria-expanded", "false");
      open.textContent = "Notebook öffnen";
      if (open.isConnected) open.focus({preventScroll:true});
    });
    window.addEventListener("hashchange", () => { if (!dock?.docked) close(); });
    open.addEventListener("click", event => {
      event.preventDefault();
      if (region.open) { close(); return; }
      region.hidden = false;
      if (dock) dock.show(); else region.showModal();
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
      // These extra lesson/material notebooks have no course restore controller.
      // ki-restore=1 would suppress all trusted autostart cells and leave their
      // interactive widgets uninitialized on every launch.
      embed.searchParams.set("reset", "");
      frame.src = embed.href;
      frame.addEventListener("load", () => {
        status.textContent = "Python-Zellen mit Shift + Enter ausführen.";
      });
      region.append(frame);
    });
    card.append(region);
  }

  // Start one real, managed JupyterLite session while the learner reads the
  // course page. The course controllers own this iframe, its saved notebook and
  // its uploads. Never spawn a disposable prewarm worker or multiple kernels.
  // Choose the notebook in the deep-linked chapter; otherwise the first course
  // notebook. Clicking another notebook supersedes the warmup safely.
  const warmOnPageLoad = () => {
    if (!coursePage) return;
    const cards = [...document.querySelectorAll(".ki-notebook-block[data-notebook]")]
      .filter(card => (basic ? basicNotebooks : advancedNotebooks)
        .has(card.dataset.notebook.split("/").pop()));
    if (!cards.length) return;
    let anchor = null;
    try { anchor = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch {}
    const chapter = anchor?.closest(".kapitel, main > section") || anchor;
    let previous = null;
    try { previous = sessionStorage.getItem(basic ? "ki-last-opened-bok-1" : "ki-last-opened-bok-4"); } catch {}
    const selected = cards.find(card => chapter && chapter.contains(card)) ||
      cards.find(card => card.dataset.notebook.split("/").pop() === previous) || cards[0];
    const name = selected.dataset.notebook.split("/").pop();
    const start = () => warmManaged(name);
    // Leave text, navigation and answers interactive before starting Pyodide.
    if ("requestIdleCallback" in window) requestIdleCallback(start, {timeout:2500});
    else setTimeout(start,900);
  };
  if (document.readyState === "complete") warmOnPageLoad();
  else window.addEventListener("load", warmOnPageLoad, {once:true});

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
