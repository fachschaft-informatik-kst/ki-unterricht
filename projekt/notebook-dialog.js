/* One lightweight, accessible overlay for all teaching notebooks.
 * It never reparents or clears the iframe: hiding the dialog must not restart
 * Pyodide or discard unsaved student code. The existing course controllers
 * retain exclusive responsibility for snapshots, kernels and persistence.
 */
let active = null;

export function notebookDialog(panel, options = {}) {
  if (!panel) throw Error('Notebook-Dialog benötigt ein Panel.');
  const head = panel.querySelector('.lab-head');
  if (!head) throw Error('Notebook-Dialog benötigt eine Kopfzeile.');
  const title = head.querySelector('b, h2, h3');
  if (title && !title.id) title.id = 'ki-notebook-title-' + (panel.id || 'lesson');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'ki-notebook-close';
  close.title = 'Notebook schliessen';
  close.setAttribute('aria-label', 'Notebook schliessen');
  close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  head.append(close);
  const veil = document.createElement('div');
  veil.className = 'ki-notebook-veil';
  veil.hidden = true;
  document.body.append(veil);
  const previousRole = panel.getAttribute('role');
  let opener = null;

  const isOpen = () => panel.classList.contains('ki-notebook-modal');
  const hide = () => {
    if (!isOpen()) return;
    if (document.fullscreenElement === panel) {
      // Exit fullscreen before removing the overlay surface; the browser
      // fires fullscreenchange and resets the existing expand/shrink icon.
      void document.exitFullscreen().catch(() => {});
    }
    panel.classList.remove('ki-notebook-modal');
    panel.hidden = true;
    veil.hidden = true;
    if (previousRole === null) panel.removeAttribute('role');
    else panel.setAttribute('role', previousRole);
    panel.removeAttribute('aria-modal');
    document.body.classList.remove('ki-notebook-dialog-open');
    if (active === api) active = null;
    options.onClose?.();
    if (opener?.isConnected) opener.focus({preventScroll:true});
  };
  const show = trigger => {
    if (isOpen()) return;
    if (active && active !== api) active.hide();
    opener = trigger || document.activeElement;
    panel.hidden = false;
    panel.classList.add('ki-notebook-modal');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    if (title) panel.setAttribute('aria-labelledby', title.id);
    veil.hidden = false;
    document.body.classList.add('ki-notebook-dialog-open');
    active = api;
    options.onOpen?.();
    close.focus({preventScroll:true});
  };
  const keydown = event => {
    if (!isOpen() || active !== api) return;
    if (event.key === 'Escape') {
      if (document.fullscreenElement) return; // Escape exits fullscreen first
      event.preventDefault();event.stopPropagation();hide();
    } else if (event.key === 'Tab') {
      const items = [...panel.querySelectorAll(
        'button:not(:disabled):not([hidden]),a[href]:not([hidden]),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),iframe'
      )].filter(node => !node.closest('[hidden]'));
      if (!items.length) {event.preventDefault();close.focus();return;}
      const first = items[0],last=items[items.length-1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault();first.focus();
      }
    }
  };
  close.addEventListener('click', hide);
  veil.addEventListener('click', hide);
  document.addEventListener('keydown', keydown, true);
  // If the page is restored or re-rendered, the active iframe remains owned
  // by its original controller. Never dispose it on a dialog close.
  const api = {show, hide, isOpen};
  return api;
}
