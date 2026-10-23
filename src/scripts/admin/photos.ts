// Resizes product photos in the browser before they are uploaded: a 4–8 MB phone photo becomes a
// ~150–400 KB WebP no wider than 1600 px, which is what the shop serves. Without this script (or in a
// browser that cannot do it) the originals go up as they are and the server still accepts them.
const MAX_EDGE = 1600;

async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 400_000) {
    bmp.close();
    return file;
  }
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const encode = (type: string, quality: number) => new Promise<Blob | null>((done) => canvas.toBlob(done, type, quality));
  let blob = await encode('image/webp', 0.84);
  // Safari draws WebP but cannot encode it and hands back a PNG instead; JPEG is the fallback there.
  // JPEG has no transparency, so a cut-out photo gets a white ground rather than a black one.
  if (!blob || blob.type !== 'image/webp') {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    blob = await encode('image/jpeg', 0.86);
  }
  if (!blob || blob.size >= file.size) return file;
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${ext}`, { type: blob.type });
}

document.querySelectorAll<HTMLFormElement>('form[data-photo-upload]').forEach((form) => {
  const input = form.querySelector<HTMLInputElement>('input[type="file"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!input || !button) return;
  const label = button.textContent ?? '';
  let pending: Promise<void> | null = null;

  input.addEventListener('change', () => {
    const files = [...(input.files ?? [])];
    if (!files.length || typeof createImageBitmap !== 'function' || typeof DataTransfer !== 'function') return;
    button.disabled = true;
    button.textContent = form.dataset.busy ?? label;
    pending = Promise.all(files.map((f) => shrink(f).catch(() => f)))
      .then((out) => {
        const dt = new DataTransfer();
        out.forEach((f) => dt.items.add(f));
        input.files = dt.files;
      })
      .finally(() => {
        button.disabled = false;
        button.textContent = label;
        pending = null;
      });
  });

  form.addEventListener('submit', (e) => {
    // Submitted while the resize is still running: wait for it, then send the resized files.
    if (pending) {
      e.preventDefault();
      pending.then(() => form.requestSubmit());
      return;
    }
    button.setAttribute('aria-busy', 'true');
    button.textContent = form.dataset.busy ?? label;
  });
});
