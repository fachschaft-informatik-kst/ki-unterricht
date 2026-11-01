/* One notebook control for every first- and fourth-year lesson.
 * The published course and the teacher preview share this markup and CSS.
 * Existing course controllers own notebook persistence; new lesson notebooks
 * use an isolated iframe and only start after an explicit click.
 */
(() => {
  const safe = /^content\/(?:ki_projekt\/)?[a-z0-9_]+\.ipynb$/;
  const labUrl = new URL("../lab/index.html", location.href);
  const basic = /\/basis\//.test(location.pathname);
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
    const managed = basic ? basicNotebooks.has(name) : advancedNotebooks.has(name);

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
