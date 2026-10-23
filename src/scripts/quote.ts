// Quote thread: a "copy the link" button for the private thread URL (shown only when the clipboard works).
const btn = document.querySelector<HTMLButtonElement>('[data-copy-link]');
const out = document.querySelector<HTMLElement>('[data-copy-status]');
if (btn && navigator.clipboard) {
  btn.hidden = false;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(new URL(btn.dataset.copyLink ?? location.href, location.href).href);
      if (out) out.textContent = btn.dataset.copied ?? '';
    } catch {
      /* the link is still in the address bar */
    }
  });
}
