// Shared fullscreen control for the first- and fourth-year notebook panels.
// Use the same 24px corner icon as the teacher editor and switch to inward
// corners when the notebook is fullscreen. Escape also restores the icon.
const SVG_NS = 'http://www.w3.org/2000/svg';
const EXPAND = 'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5';
const COLLAPSE = 'M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5';

export function bindLabFullscreen(button, panel) {
  if (!button || !panel) throw Error('Notebook-Vollbildschalter ohne zugehöriges Panel.');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const corners = document.createElementNS(SVG_NS, 'path');
  svg.append(corners);
  button.replaceChildren(svg);
  button.classList.add('lab-fullscreen-toggle');
  button.type = 'button';

  // Browsers explicitly disallow requestFullscreen() on <dialog>. Keep the
  // same icon behavior with a viewport-filling dialog style, preserving its
  // close button, keyboard focus trap and existing JupyterLite iframe.
  const isDialog = panel.tagName === 'DIALOG';
  const sync = () => {
    const expanded = isDialog
      ? panel.classList.contains('lab-modal-maximized')
      : document.fullscreenElement === panel;
    const label = expanded ? 'Notebook verkleinern' : 'Notebook vergrössern';
    corners.setAttribute('d', expanded ? COLLAPSE : EXPAND);
    button.setAttribute('aria-pressed', String(expanded));
    button.setAttribute('aria-label', label);
    button.title = label;
  };
  button.addEventListener('click', async () => {
    try {
      if (isDialog) {
        panel.classList.toggle('lab-modal-maximized');
      } else if (document.fullscreenElement === panel) {
        await document.exitFullscreen();
      } else {
        await panel.requestFullscreen();
      }
    } catch (error) {
      console.warn('Notebook-Vollbildmodus konnte nicht umgeschaltet werden:', error);
    } finally {
      sync();
    }
  });
  document.addEventListener('fullscreenchange', sync);
  if (isDialog) panel.addEventListener('close', () => {
    panel.classList.remove('lab-modal-maximized');
    sync();
  });
  sync();
}


// A real in-page dialog, never a new browser tab. Do not reparent or remove the
// iframe on close: JupyterLite's in-browser kernel and unsaved edits survive.
export function bindNotebookDialog(panel) {
  if (panel.tagName !== 'DIALOG') throw Error('Notebook-Overlay braucht ein dialog-Element.');
  const heading = panel.querySelector('.lab-head');
  if (!heading) throw Error('Notebook-Overlay ohne Kopfzeile.');
  panel.classList.add('lab-modal');
  const title = heading.querySelector('[id]');
  if (title) panel.setAttribute('aria-labelledby', title.id);
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lab-close-toggle';
  closeButton.setAttribute('aria-label', 'Notebook schliessen');
  closeButton.title = 'Notebook schliessen';
  closeButton.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  heading.append(closeButton);
  let opener = null;
  const close = async () => {
    if (document.fullscreenElement === panel) await document.exitFullscreen();
    if (panel.open) panel.close();
  };
  closeButton.addEventListener('click', () => { void close(); });
  panel.addEventListener('click', event => {
    if (event.target !== panel) return;
    const rect = panel.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) void close();
  });
  panel.addEventListener('close', () => {
    panel.hidden = true;
    document.body.classList.remove('ki-notebook-modal-open');
    if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus({preventScroll:true});
  });
  window.addEventListener('hashchange', () => { if (panel.open) void close(); });
  return {
    get isOpen() { return panel.open; },
    open(trigger=null) {
      if (panel.open) return;
      opener = trigger || document.activeElement;
      panel.hidden = false;
      panel.showModal();
      document.body.classList.add('ki-notebook-modal-open');
      closeButton.focus({preventScroll:true});
    },
    close
  };
}
