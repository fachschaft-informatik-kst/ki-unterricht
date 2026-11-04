/* One notebook control for every first- and fourth-year lesson.
 * The published course and the teacher preview share this markup and CSS.
 * Existing course controllers own notebook persistence; new lesson notebooks
 * use an isolated iframe and only start after an explicit click.
 */
(() => {
  // Notebook dialogs are non-modal floating windows: centered when opened,
  // then freely movable by the title bar and resizable from every edge, so the
  // course page stays readable and usable behind them. The same <dialog> and
  // iframe are reused, hence Pyodide keeps running. Shared with
  // lab-fullscreen.js through window.kiNotebookFloat.
  if (!window.kiNotebookFloat) {
    const floats = new Set();
    const MIN_W = 360, MIN_H = 260, KEEP = 80;
    const wide = () => window.matchMedia("(min-width:701px)").matches;
    const EDGES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
    const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

    window.kiNotebookFloat = {
      bind(panel, head) {
        if (panel.kiFloat) return panel.kiFloat;
        const setBox = box => {
          const width = clamp(box.width, MIN_W, innerWidth);
          const height = clamp(box.height, MIN_H, innerHeight);
          // Keep the title bar reachable so the window can always be moved back.
          const left = clamp(box.left, KEEP - width, innerWidth - KEEP);
          const top = clamp(box.top, 0, innerHeight - 48);
          Object.assign(panel.style, {inset: "auto", margin: "0", left: left + "px", top: top + "px",
            width: width + "px", height: height + "px", maxWidth: "none", maxHeight: "none"});
        };
        const resetBox = () => {
          for (const name of ["inset", "margin", "left", "top", "width", "height", "maxWidth", "maxHeight"]) panel.style[name] = "";
        };
        const isFloating = () => panel.open && wide();

        // Drag by the title bar, but never when a control in it was pressed.
        head.classList.add("lab-drag-handle");
        head.addEventListener("pointerdown", event => {
          if (!isFloating() || event.button !== 0 || event.target.closest("button,a,input,select,textarea,summary")) return;
          if (panel.classList.contains("lab-modal-maximized")) return;
          const start = panel.getBoundingClientRect();
          const dx = event.clientX - start.left, dy = event.clientY - start.top;
          head.setPointerCapture(event.pointerId);
          panel.classList.add("lab-floating-active");
          const move = e => setBox({left: e.clientX - dx, top: e.clientY - dy, width: start.width, height: start.height});
          const stop = () => {
            panel.classList.remove("lab-floating-active");
            head.removeEventListener("pointermove", move);
            head.removeEventListener("pointerup", stop);
            head.removeEventListener("pointercancel", stop);
          };
          head.addEventListener("pointermove", move);
          head.addEventListener("pointerup", stop);
          head.addEventListener("pointercancel", stop);
          event.preventDefault();
        });

        for (const edge of EDGES) {
          const handle = document.createElement("div");
          handle.className = "lab-resize-handle lab-resize-" + edge;
          handle.setAttribute("aria-hidden", "true");
          panel.append(handle);
          handle.addEventListener("pointerdown", event => {
            if (!isFloating() || event.button !== 0 || panel.classList.contains("lab-modal-maximized")) return;
            const start = panel.getBoundingClientRect();
            handle.setPointerCapture(event.pointerId);
            panel.classList.add("lab-floating-active");
            const move = e => {
              const box = {left: start.left, top: start.top, width: start.width, height: start.height};
              if (edge.includes("e")) box.width = Math.min(e.clientX, innerWidth) - start.left;
              if (edge.includes("s")) box.height = Math.min(e.clientY, innerHeight) - start.top;
              if (edge.includes("w")) {
                box.width = clamp(start.right - e.clientX, MIN_W, innerWidth);
                box.left = start.right - box.width;
              }
              if (edge.includes("n")) {
                box.height = clamp(start.bottom - e.clientY, MIN_H, innerHeight);
                box.top = start.bottom - box.height;
              }
              setBox(box);
            };
            const stop = () => {
              panel.classList.remove("lab-floating-active");
              handle.removeEventListener("pointermove", move);
              handle.removeEventListener("pointerup", stop);
              handle.removeEventListener("pointercancel", stop);
            };
            handle.addEventListener("pointermove", move);
            handle.addEventListener("pointerup", stop);
            handle.addEventListener("pointercancel", stop);
            event.preventDefault();
          });
        }

        // A non-modal dialog no longer closes on Escape by itself.
        panel.addEventListener("keydown", event => {
          if (event.key !== "Escape" || event.defaultPrevented || !panel.open) return;
          event.preventDefault();
          panel.close();
        });

        window.addEventListener("resize", () => {
          if (!panel.open || !panel.style.left) return;
          if (!wide()) { resetBox(); return; }
          const rect = panel.getBoundingClientRect();
          setBox({left: rect.left, top: rect.top, width: rect.width, height: rect.height});
        });

        const show = () => {
          // One notebook window at a time: the controllers share one kernel per course.
          for (const other of floats) if (other.panel !== panel && other.panel.open) other.panel.close();
          resetBox();
          panel.classList.add("lab-floating");
          if (!panel.open) panel.show();
          // The course shell is its own stacking context (below the sidebar).
          // The top layer lifts the window above it without moving the iframe.
          if (typeof panel.showPopover === "function") {
            panel.popover = "manual";
            if (!panel.matches(":popover-open")) panel.showPopover();
          }
        };
        panel.addEventListener("close", () => {
          if (typeof panel.hidePopover === "function" && panel.matches(":popover-open")) panel.hidePopover();
        });
        const api = {panel, show, get floating() { return isFloating(); }};
        panel.kiFloat = api;
        floats.add(api);
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
    const float = window.kiNotebookFloat?.bind(region, head);
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
    window.addEventListener("hashchange", () => { if (!float) close(); });
    open.addEventListener("click", event => {
      event.preventDefault();
      if (region.open) { close(); return; }
      region.hidden = false;
      if (float) float.show(); else region.showModal();
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
