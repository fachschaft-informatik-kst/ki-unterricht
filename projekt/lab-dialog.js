// Shared, accessible notebook overlay. The iframe stays mounted at a stable
// DOM position: hiding this overlay must never restart JupyterLite's kernel.
// Unlike a browser popup, this needs no popup permission and works on tablets.
let activeDialog = null;
const NS = 'http://www.w3.org/2000/svg';

export function setupLabDialog(panel, {title = 'Jupyter-Notebook', onClose = null} = {}) {
  if (!panel) throw Error('Notebook-Dialog benötigt ein Panel.');
  // IMPORTANT: call this before assigning src to the notebook iframe. Only
  // initialise/move the panel once; never reparent it between chapter cards.
  if (panel.dataset.labDialog === 'true') throw Error('Notebook-Dialog bereits initialisiert.');
  panel.dataset.labDialog = 'true';

  const backdrop = document.createElement('div');
  backdrop.className = 'ki-lab-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.append(backdrop);
  document.body.append(panel);

  panel.classList.add('ki-lab-dialog');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  const heading = panel.querySelector('.lab-head b, .lab-head strong');
  if (heading?.id) panel.setAttribute('aria-labelledby', heading.id);
  else panel.setAttribute('aria-label', title);
  let header = panel.querySelector('.lab-head');
  if (!header) {
    header = document.createElement('div');
    header.className = 'lab-head';
    const label = document.createElement('strong');
    label.textContent = title;
    header.append(label);
    panel.prepend(header);
  }

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lab-dialog-close lab-fullscreen-toggle';
  closeButton.title = 'Notebook schliessen';
  closeButton.setAttribute('aria-label', 'Notebook schliessen');
  const svg = document.createElementNS(NS, 'svg');
  for (const [attr, value] of Object.entries({
    viewBox:'0 0 24 24',width:'18',height:'18',fill:'none',
    stroke:'currentColor','stroke-width':'1.8',
    'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'
  })) svg.setAttribute(attr, value);
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M18 6 6 18M6 6l12 12');
  svg.append(path);
  closeButton.append(svg);
  header.append(closeButton);

  let trigger = null;
  const api = {
    get isOpen() { return panel.classList.contains('ki-lab-dialog-open'); },
    open(button = null) {
      if (activeDialog && activeDialog !== api) activeDialog.close();
      if (api.isOpen) {
        closeButton.focus();
        return;
      }
      trigger = button;
      backdrop.hidden = false;
      panel.hidden = false;
      panel.classList.add('ki-lab-dialog-open');
      document.documentElement.classList.add('ki-lab-dialog-active');
      button?.setAttribute('aria-expanded', 'true');
      activeDialog = api;
      closeButton.focus();
    },
    async close() {
      if (!api.isOpen) return;
      if (document.fullscreenElement === panel) {
        try { await document.exitFullscreen(); } catch {}
      }
      panel.classList.remove('ki-lab-dialog-open');
      panel.hidden = true;
      backdrop.hidden = true;
      document.documentElement.classList.remove('ki-lab-dialog-active');
      if (activeDialog === api) activeDialog = null;
      trigger?.setAttribute('aria-expanded', 'false');
      if (trigger?.isConnected) trigger.focus();
      try { await onClose?.(); } catch (error) {
        console.warn('Notebook-Stand wird im Hintergrund gesichert:', error);
      }
    }
  };

  closeButton.addEventListener('click', () => { void api.close(); });
  backdrop.addEventListener('click', () => { void api.close(); });
  document.addEventListener('keydown', event => {
    if (!api.isOpen) return;
    if (event.key === 'Escape') {
      // Native fullscreen handles its own first Escape.
      if (document.fullscreenElement === panel) return;
      event.preventDefault();
      void api.close();
    } else if (event.key === 'Tab') {
      const focusables = [...panel.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex="0"]'
      )].filter(item => !item.closest('[hidden]') && item.getClientRects().length);
      const first = focusables[0] || closeButton;
      const last = focusables.at(-1) || closeButton;
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
  }, true);
  return api;
}
