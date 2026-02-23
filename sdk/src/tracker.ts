(function () {
  // Find the script tag to read config
  const scripts = document.querySelectorAll('script[data-key]');
  const scriptTag = scripts[scripts.length - 1] as HTMLScriptElement | undefined;

  if (!scriptTag) return;

  const API_KEY = scriptTag.getAttribute('data-key') || '';
  const API_URL = scriptTag.getAttribute('data-endpoint') || scriptTag.src.replace(/\/sdk\.js.*$/, '');

  if (!API_KEY) return;

  // Visitor ID — persisted in localStorage
  function getVisitorId(): string {
    const key = '_es_vid';
    let id = localStorage.getItem(key);
    if (!id) {
      id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  }

  // Session ID — new per page load
  const sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  const visitorId = getVisitorId();

  // Event buffer
  let buffer: Record<string, unknown>[] = [];
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  const FLUSH_INTERVAL = 5000;
  const FLUSH_SIZE = 20;

  function flush() {
    if (buffer.length === 0) return;

    const events = [...buffer];
    buffer = [];

    const payload = JSON.stringify({ events });

    // Try sendBeacon first, fall back to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(API_URL + '/api/events/batch?key=' + API_KEY, blob);
      if (sent) return;
    }

    fetch(API_URL + '/api/events/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  function scheduleFlush() {
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, FLUSH_INTERVAL);
  }

  function track(eventType: string, data: Record<string, unknown> = {}) {
    buffer.push({
      eventType,
      ...data,
      pageUrl: window.location.href,
      referrer: document.referrer || undefined,
      visitorId,
      sessionId,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
      },
    });

    if (buffer.length >= FLUSH_SIZE) {
      flush();
    } else {
      scheduleFlush();
    }
  }

  function truncate(str: string, maxLen: number): string {
    return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
  }

  // Track page view
  track('pageview');

  // Track clicks
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (!el || !el.tagName) return;

    track('click', {
      elementTag: el.tagName.toLowerCase(),
      elementId: el.id || undefined,
      elementClass: el.className && typeof el.className === 'string' ? el.className : undefined,
      elementText: el.innerText ? truncate(el.innerText.trim(), 100) : undefined,
      metadata: {
        ...({} as Record<string, unknown>),
        href: (el as HTMLAnchorElement).href || undefined,
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      },
    });
  }, { capture: true });

  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (!form || form.tagName !== 'FORM') return;

    const fieldNames: string[] = [];
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      const field = elements[i] as HTMLInputElement;
      if (field.name) fieldNames.push(field.name);
    }

    track('form_submit', {
      elementTag: 'form',
      elementId: form.id || undefined,
      elementClass: form.className || undefined,
      metadata: {
        action: form.action || undefined,
        method: form.method || undefined,
        fieldNames,
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      },
    });
  }, { capture: true });

  // Flush on page unload
  function onUnload() {
    flush();
  }

  window.addEventListener('pagehide', onUnload);
  window.addEventListener('beforeunload', onUnload);
})();
