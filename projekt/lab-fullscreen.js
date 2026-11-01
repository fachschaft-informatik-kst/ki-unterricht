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

  const sync = () => {
    const expanded = document.fullscreenElement === panel;
    const label = expanded ? 'Notebook verkleinern' : 'Notebook vergrössern';
    corners.setAttribute('d', expanded ? COLLAPSE : EXPAND);
    button.setAttribute('aria-pressed', String(expanded));
    button.setAttribute('aria-label', label);
    button.title = label;
  };
  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === panel) {
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
  sync();
}
