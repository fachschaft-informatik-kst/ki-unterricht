/* One notebook control for every first- and fourth-year lesson.
 * The published course and the teacher preview share this markup and CSS.
 * Existing course controllers own notebook persistence; new lesson notebooks
 * use an isolated iframe and only start after an explicit click.
 */
(() => {
  const safe = /^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/;
  const labUrl = new URL("../lab/index.html", location.href);
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
      desc.textContent = "Die Python-Zellen hier öffnen, bearbeiten und mit Shift + Enter ausführen.";
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
    open.textContent = "Notebook hier öffnen";
    open.setAttribute("aria-expanded", "false");

    const external = card.querySelector(".ki-notebook-direct") || document.createElement("a");
    external.className = "ki-notebook-direct";
    external.href = url.href;
    external.target = "_blank";
    external.rel = "noopener noreferrer";
    external.textContent = "In JupyterLite öffnen ↗";
    actions.append(open, external);
    card.append(actions);
    card.dataset.notebookInitialized = "true";

    if (managed) {
      // The existing portal/persistence controller mounts its saved lab here.
      // Do not create a second iframe or a second Python kernel.
      open.addEventListener("click", () => open.setAttribute("aria-expanded", "true"));
      continue;
    }

    const region = document.createElement("div");
    region.className = "ki-notebook-runtime";
    region.hidden = true;
    const status = document.createElement("p");
    status.className = "ki-notebook-status";
    status.setAttribute("role", "status");
    status.textContent = "JupyterLite wird geladen …";
    region.append(status);
    let frame;
    open.addEventListener("click", event => {
      event.preventDefault();
      const show = region.hidden;
      region.hidden = !show;
      open.setAttribute("aria-expanded", String(show));
      open.textContent = show ? "Notebook schliessen" : "Notebook hier öffnen";
      if (!show || frame) return;
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
        status.textContent = "Notebook geöffnet. Python-Zellen mit Shift + Enter ausführen.";
      });
      region.append(frame);
    });
    card.append(region);
  }
})();
