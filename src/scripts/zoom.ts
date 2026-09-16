// Screenshot zoom. Every framed app screen opens full screen: a copy of the screen flies from its exact box in the
// page to the middle of the viewport and grows to the image's real proportions. Closing flies it back into that box.
// The original stays in the layout, hidden, as the placeholder, so nothing around it moves while the copy is open.
import gsap from 'gsap';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** A clip-path inset kept as numbers. GSAP tweens this object; the browser's shortened inset() strings never get parsed. */
interface Clip {
  t: number;
  r: number;
  b: number;
  l: number;
  rad: number;
}

interface Bezel {
  borderTopWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  borderRadius: number;
}

interface Zoom {
  trigger: HTMLElement;
  source: HTMLElement;
  placeholder: HTMLElement;
  clone: HTMLElement;
  media: HTMLImageElement | HTMLVideoElement;
  aspect: number;
  maxMediaWidth: number;
  /** The bezel the frame has where it sits in the page (a page may override it) and the one it has on its own. */
  pageBezel: Bezel;
  zoomBezel: Bezel;
  clip: Clip | null;
  /** Opacity the source is painted with in the page (it may be mid crossfade). */
  opacity: number;
  /** A ghost source paints nothing in the page (a photo stands in for it): the copy fades in as it lifts out. */
  ghost: boolean;
  shown: boolean;
  closing: boolean;
  tl?: gsap.core.Timeline;
}

const GAP = 14;
const closeIcon =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

let dialog: HTMLDialogElement | null = null;
let scrim: HTMLElement;
let caption: HTMLElement;
let closeBtn: HTMLButtonElement;
let zoom: Zoom | null = null;

const root = document.documentElement;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const px = (v: string) => parseFloat(v) || 0;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const toBox = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });
const place = (b: Box) => ({ left: b.left, top: b.top, width: b.width, height: b.height });
const noClip = (rad: number): Clip => ({ t: 0, r: 0, b: 0, l: 0, rad });
const writeClip = (z: Zoom) => {
  const c = z.clip;
  z.clone.style.clipPath = c ? `inset(${c.t}px ${c.r}px ${c.b}px ${c.l}px round ${c.rad}px)` : 'none';
};

const bezelOf = (el: HTMLElement): Bezel => {
  const cs = getComputedStyle(el);
  return {
    borderTopWidth: px(cs.borderTopWidth),
    borderRightWidth: px(cs.borderRightWidth),
    borderBottomWidth: px(cs.borderBottomWidth),
    borderLeftWidth: px(cs.borderLeftWidth),
    borderRadius: px(cs.borderTopLeftRadius),
  };
};

/** The part of `el` that is actually painted: its box cut down by every ancestor that clips overflow and by the sticky
 *  header that covers the top of the page, plus the corner radius of whatever did the cutting. */
function visible(el: HTMLElement): { box: Box; radius: number } {
  const r = el.getBoundingClientRect();
  let { left, top, right, bottom } = r;
  let radius = -1;
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const cs = getComputedStyle(p);
    const clipX = cs.overflowX !== 'visible';
    const clipY = cs.overflowY !== 'visible';
    if (!clipX && !clipY) continue;
    const pr = p.getBoundingClientRect();
    const before = [left, top, right, bottom].join();
    if (clipX) {
      left = Math.max(left, pr.left);
      right = Math.min(right, pr.right);
    }
    if (clipY) {
      top = Math.max(top, pr.top);
      bottom = Math.min(bottom, pr.bottom);
    }
    if (radius < 0 && before !== [left, top, right, bottom].join()) radius = px(cs.borderTopLeftRadius);
  }
  const bar = document.querySelector('.site-header');
  if (bar && !bar.contains(el)) {
    const edge = bar.getBoundingClientRect().bottom;
    if (top < edge) {
      top = edge;
      if (radius < 0) radius = 0;
    }
  }
  return { box: { left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) }, radius: Math.max(0, radius) };
}

/** Inset that trims box `b` down to its painted part `v`; null when nothing is cut away. */
function clipFor(b: Box, v: Box, radius: number): Clip | null {
  const c = { t: v.top - b.top, l: v.left - b.left, r: b.left + b.width - (v.left + v.width), b: b.top + b.height - (v.top + v.height), rad: radius };
  return Math.max(c.t, c.l, c.r, c.b) < 0.5 ? null : c;
}

/** Opacity an element is painted with: its own times every ancestor's. */
function paintedOpacity(el: HTMLElement): number {
  let o = 1;
  for (let p: HTMLElement | null = el; p && p !== document.body; p = p.parentElement) o *= parseFloat(getComputedStyle(p).opacity) || 0;
  return o;
}

/** Where the zoomed screen lands: as large as the viewport allows at the image's own aspect ratio, bezel included,
 *  never more than 1.25x the original pixels, centred above its caption. */
function target(z: Zoom): Box {
  const vw = dialog!.clientWidth;
  const vh = dialog!.clientHeight;
  const narrow = vw < 1024;
  const short = vh < 560; // landscape phones: no caption, and the sides stay clear of the close button
  const padX = short ? 64 : narrow ? 12 : 48;
  const padTop = short ? 12 : narrow ? 68 : 76;
  const padBottom = short ? 12 : narrow ? 16 : 32;
  const b = z.zoomBezel;
  const bx = b.borderLeftWidth + b.borderRightWidth;
  const by = b.borderTopWidth + b.borderBottomWidth;
  caption.hidden = short || !caption.textContent;
  caption.style.width = `${Math.min(vw - padX * 2, 640)}px`;
  const cap = caption.hidden ? 0 : caption.offsetHeight + GAP;
  const maxW = Math.max(60, Math.min(vw - padX * 2 - bx, z.maxMediaWidth));
  const maxH = Math.max(60, vh - padTop - padBottom - cap - by);
  let w = maxW;
  let h = w / z.aspect;
  if (h > maxH) {
    h = maxH;
    w = h * z.aspect;
  }
  const width = Math.round(w + bx);
  const height = Math.round(h + by);
  const top = Math.round(padTop + Math.max(0, (vh - padTop - padBottom - height - cap) / 2));
  return { left: Math.round((vw - width) / 2), top, width, height };
}

function ensureDialog() {
  if (dialog?.isConnected) return;
  dialog = document.createElement('dialog');
  dialog.className = 'lb';
  dialog.setAttribute('aria-label', 'Tampilan layar penuh');
  dialog.setAttribute('aria-describedby', 'lb-caption');
  dialog.innerHTML = `<div class="lb-scrim"></div><p class="lb-caption" id="lb-caption"></p><button type="button" class="lb-close" aria-label="Tutup">${closeIcon}</button>`;
  scrim = dialog.querySelector('.lb-scrim')!;
  caption = dialog.querySelector('.lb-caption')!;
  closeBtn = dialog.querySelector('.lb-close')!;
  // Any click closes: the scrim, the screen itself, or the close button. The second click of a double-click is
  // ignored, otherwise the click that opened the view would also close it straight away.
  dialog.addEventListener('click', (e) => {
    if (e.detail > 1) return;
    close();
  });
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  // Safety net: if the browser closes the dialog on its own (a repeated Esc), still put everything back.
  dialog.addEventListener('close', () => zoom && finish(zoom));
  document.body.append(dialog);
}

async function open(trigger: HTMLElement) {
  if (zoom) return;
  const source = trigger.closest<HTMLElement>('.frame');
  const srcMedia = source?.querySelector<HTMLImageElement | HTMLVideoElement>('img, video');
  if (!source || !srcMedia) return;
  const opacity = paintedOpacity(source);
  if (opacity < 0.05) return; // a screen that is not showing yet (mid crossfade) cannot be picked

  const from = toBox(source.getBoundingClientRect());
  const painted = visible(source);
  const startClip = clipFor(from, painted.box, painted.radius);
  const pageBezel = bezelOf(source);

  const ghost = source.hasAttribute('data-ghost');
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelector('.frame-zoom')?.remove();
  clone.removeAttribute('data-ghost');
  clone.classList.add('lb-frame');
  const media = clone.querySelector<HTMLImageElement | HTMLVideoElement>('img, video')!;
  const mcs = getComputedStyle(srcMedia);
  // The copy's media always fills its bezel; object-fit does the cropping, so growing the box towards the image's
  // own aspect ratio reveals the parts the page view had cropped away, smoothly.
  Object.assign(media.style, {
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    maxHeight: 'none',
    aspectRatio: 'auto',
    objectFit: mcs.objectFit === 'fill' ? 'cover' : mcs.objectFit,
    objectPosition: mcs.objectPosition,
  });
  media.setAttribute('aria-hidden', 'true');
  if (media instanceof HTMLImageElement && srcMedia instanceof HTMLImageElement) {
    media.removeAttribute('srcset');
    media.removeAttribute('sizes');
    media.removeAttribute('fetchpriority');
    media.loading = 'eager';
    media.alt = '';
    media.src = srcMedia.currentSrc || srcMedia.src;
  }

  ensureDialog();
  const natW = Number(srcMedia.getAttribute('width')) || from.width;
  const natH = Number(srcMedia.getAttribute('height')) || from.height;
  const z: Zoom = {
    trigger,
    source,
    placeholder: source.parentElement?.closest<HTMLElement>('[data-zoom-placeholder]') ?? source,
    clone,
    media,
    aspect: natW / natH,
    maxMediaWidth: natW * 1.25,
    pageBezel,
    zoomBezel: pageBezel,
    clip: startClip,
    opacity,
    ghost,
    shown: false,
    closing: false,
  };
  zoom = z;

  caption.textContent = srcMedia.getAttribute('alt') || srcMedia.getAttribute('aria-label') || '';
  gsap.set([scrim, caption, closeBtn], { opacity: 0, y: 0 });
  scrim.after(clone);
  // Outside the page, only the frame's own styles apply: that is the bezel the zoomed view ends with.
  z.zoomBezel = bezelOf(clone);
  gsap.set(clone, { ...place(from), ...pageBezel, opacity: reduced() || ghost ? 0 : opacity });
  writeClip(z);
  // Lock the page without a layout jump: the scrollbar's width moves into padding while it is hidden.
  root.style.setProperty('--sbw', `${innerWidth - root.clientWidth}px`);
  root.classList.add('lb-open');
  dialog!.showModal();

  if (media instanceof HTMLVideoElement && srcMedia instanceof HTMLVideoElement) {
    media.muted = true;
    media.currentTime = srcMedia.currentTime;
    void media.play().catch(() => {});
  } else if (media instanceof HTMLImageElement) {
    // A fresh image element paints only once decoded; waiting a moment keeps the first frame from showing an empty bezel.
    await Promise.race([media.decode().catch(() => {}), wait(150)]);
  }
  if (zoom !== z || z.closing) return;

  z.shown = true;
  const to = target(z);
  caption.style.top = `${to.top + to.height + GAP}px`;

  if (reduced()) {
    // No travel: the page keeps its screenshot while the full view fades in over it.
    z.clip = null;
    writeClip(z);
    gsap.set(clone, { ...place(to), ...z.zoomBezel });
    z.tl = gsap.timeline().to([scrim, clone, caption, closeBtn], { opacity: 1, duration: 0.2 });
  } else {
    z.placeholder.style.visibility = 'hidden';
    const tl = gsap.timeline();
    tl.to(scrim, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0);
    tl.to(clone, { ...place(to), ...z.zoomBezel, opacity: 1, duration: 0.6, ease: 'expo.out' }, 0);
    if (z.clip) {
      tl.to(z.clip, {
        ...noClip(z.zoomBezel.borderRadius),
        duration: 0.6,
        ease: 'expo.out',
        onUpdate: () => writeClip(z),
        onComplete: () => {
          z.clip = null;
          writeClip(z);
        },
      }, 0);
    }
    tl.fromTo([caption, closeBtn], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.28);
    z.tl = tl;
  }

  upgrade(z, srcMedia, to);
}

/** Swap in a sharper file from the original srcset, chosen for the zoomed size, once it has decoded. */
function upgrade(z: Zoom, srcMedia: HTMLImageElement | HTMLVideoElement, to: Box) {
  const media = z.media;
  if (!(srcMedia instanceof HTMLImageElement) || !(media instanceof HTMLImageElement) || !srcMedia.srcset) return;
  const hi = new Image();
  hi.sizes = `${Math.ceil(to.width)}px`;
  hi.srcset = srcMedia.srcset;
  hi.decode()
    .then(() => {
      if (zoom === z && hi.currentSrc && hi.currentSrc !== media.currentSrc) media.src = hi.currentSrc;
    })
    .catch(() => {});
}

function close() {
  const z = zoom;
  if (!z || z.closing) return;
  z.closing = true;
  z.tl?.kill();
  const { source, clone } = z;

  const home = source.isConnected ? toBox(source.getBoundingClientRect()) : null;
  const onScreen = !!home && home.width > 0 && home.height > 0 && home.top < innerHeight && home.top + home.height > 0;
  const landable = onScreen && z.shown && !reduced() && !source.closest('[inert]') && (z.placeholder.checkVisibility?.({ visibilityProperty: false, opacityProperty: false }) ?? true);

  const tl = gsap.timeline({ onComplete: () => finish(z) });
  tl.to([caption, closeBtn], { opacity: 0, duration: 0.15, ease: 'power1.out' }, 0);
  tl.to(scrim, { opacity: 0, duration: landable ? 0.42 : 0.2, ease: 'power2.inOut' }, 0);
  if (landable) {
    const painted = visible(source);
    const endClip = clipFor(home!, painted.box, painted.radius);
    if (endClip) {
      // Tween from wherever the clip is now: fully open, or part-way if the open animation was interrupted.
      z.clip ??= noClip(px(getComputedStyle(clone).borderTopLeftRadius));
      tl.to(z.clip, { ...endClip, duration: 0.48, ease: 'power3.inOut', onUpdate: () => writeClip(z) }, 0);
    }
    tl.to(clone, { ...place(home!), ...z.pageBezel, opacity: z.ghost ? 0 : z.opacity, duration: 0.48, ease: z.ghost ? 'power3.in' : 'power3.inOut' }, 0);
  } else {
    // Its place is gone, hidden, or scrolled away: fade out where it is instead of flying somewhere invisible.
    tl.to(clone, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0);
  }
  z.tl = tl;
}

/** Put the page back exactly as it was. Safe to call more than once. */
function finish(z: Zoom) {
  if (zoom !== z) return;
  zoom = null;
  z.tl?.kill();
  z.placeholder.style.visibility = '';
  z.clone.remove();
  if (dialog?.open) dialog.close();
  root.classList.remove('lb-open');
  root.style.removeProperty('--sbw');
  // The screen may have been swapped out while zoomed (a step change made it inert): focus the one now showing.
  let target: HTMLElement | null | undefined = z.trigger;
  const hidden = z.trigger.closest<HTMLElement>('[inert]');
  if (hidden) target = hidden.parentElement?.querySelector<HTMLElement>(':scope > :not([inert]) .frame-zoom');
  if (target?.isConnected) target.focus({ preventScroll: true });
}

/** Zoom buttons render hidden so pages without JavaScript never show a control that does nothing. */
const arm = () => document.querySelectorAll<HTMLButtonElement>('.frame-zoom[hidden]').forEach((b) => (b.hidden = false));
arm();
document.addEventListener('astro:page-load', arm);

document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  const trigger = target?.closest?.('.frame-zoom');
  if (trigger instanceof HTMLElement) {
    e.preventDefault();
    void open(trigger);
    return;
  }
  // A box marked data-zoom-proxy (a photo with the screen in it) opens the frame inside it wherever it is clicked.
  const proxy = target?.closest?.('[data-zoom-proxy]');
  const inner = proxy?.querySelector<HTMLElement>('.frame-zoom');
  if (inner && !target?.closest('a, button')) {
    e.preventDefault();
    void open(inner);
  }
});

addEventListener('resize', () => {
  const z = zoom;
  if (!z || z.closing || !z.shown || !dialog?.open) return;
  z.tl?.progress(1);
  z.clip = null;
  writeClip(z);
  const to = target(z);
  gsap.set(z.clone, { ...place(to), ...z.zoomBezel, opacity: 1 });
  caption.style.top = `${to.top + to.height + GAP}px`;
});

// Leaving while zoomed (browser Back/Forward, even to a hash on the same page, or any router navigation): restore the
// page instantly, before the router scrolls it or captures it for the view transition.
const restore = () => zoom && finish(zoom);
addEventListener('popstate', restore);
document.addEventListener('astro:before-preparation', restore);
document.addEventListener('astro:before-swap', restore);
