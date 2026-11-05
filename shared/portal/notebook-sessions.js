// Keep browsing contexts in their original DOM position: moving an iframe
// destroys its Python kernel. Only the selected session is visible.
export function notebookSessions(initialFrame, onState) {
  const sessions = new Map();
  const id = initialFrame.id;
  let active = null;
  function display(session) {
    if (active === session) onState(session.phase, session.message);
  }
  function loading(session, phase, message = '') {
    clearTimeout(session.timeout);
    session.phase = phase;
    if (message) session.message = message;
    session.frame.inert = phase !== 'ready';
    display(session);
    if (phase === 'loading') {
      session.timeout = setTimeout(() => {
        loading(session, 'error', 'Der Notebook-Start dauert zu lange. Bitte erneut versuchen.');
      }, 180000);
    }
  }
  function select(name) {
    let session = sessions.get(name);
    if (!session) {
      const frame = sessions.size ? initialFrame.cloneNode(false) : initialFrame;
      frame.removeAttribute('src');
      frame.removeAttribute('id');
      for (const key of Object.keys(frame.dataset)) delete frame.dataset[key];
      if (frame !== initialFrame) initialFrame.parentElement.append(frame);
      session = {name, frame, phase: 'loading', message: 'Python wird vorbereitet …',
        initializing: false, revision: 0, dirty: false};
      sessions.set(name, session);
    }
    if (active && active !== session) {
      active.frame.hidden = true;
      active.frame.removeAttribute('id');
    }
    active = session;
    session.frame.id = id;
    session.frame.hidden = false;
    display(session);
    return session;
  }
  function clear() {
    active = null;
    for (const session of sessions.values()) {
      clearTimeout(session.timeout);
      session.frame.src = 'about:blank';
      if (session.frame !== initialFrame) session.frame.remove();
    }
    sessions.clear();
    initialFrame.id = id;
    initialFrame.hidden = false;
    initialFrame.removeAttribute('src');
  }
  return {select, loading, clear, sessions,
    get active() { return active; },
    fromSource(source) {
      return [...sessions.values()].find(session => session.frame.contentWindow === source);
    }};
}
