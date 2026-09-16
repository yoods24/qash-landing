// Custom cursor for mouse users (the .cur element in src/layouts/Layout.astro, styled in src/styles/global.css): an
// orange dot rides under the pointer and a ring follows it a beat behind. Over a link or button the ring widens and
// the dot slips inside it; over a screen that opens full screen (a photo scene, a framed screenshot) the ring becomes
// a viewfinder with a plus, and inside the full-screen view a cross; pressing pinches it. Only mice get it: touch
// screens, pens, and coarse pointers keep the native cursor, and with reduced motion the ring keeps up with the dot.
import gsap from 'gsap';

const root = document.documentElement;
const cur = document.querySelector<HTMLElement>('.cur');

if (cur && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = cur.querySelector<HTMLElement>('.cur-dot')!;
  const ring = cur.querySelector<HTMLElement>('.cur-ring')!;
  const lag = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.05 : 0.3;
  const dx = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
  const rx = gsap.quickTo(ring, 'x', { duration: lag, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: lag, ease: 'power3' });
  let on = false;
  let seen = false;

  /** The top layer paints in order of arrival, so the cursor is re-shown whenever something opens above it. */
  const raise = () => {
    if (!('showPopover' in cur)) return;
    if (cur.matches(':popover-open')) cur.hidePopover();
    cur.showPopover();
  };
  const show = (state: boolean) => {
    on = state;
    root.classList.toggle('cur-on', on);
  };
  const stateOf = (target: Element | null) => {
    if (target?.closest('.lb')) return 'close';
    if (target?.closest('[data-zoom-proxy], .frame-zoom')) return 'zoom';
    if (target?.closest('a, button, summary, [role="button"]')) return 'link';
    return '';
  };

  raise();
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!seen) {
      // The first time, both parts appear where the pointer already is instead of flying in from the corner.
      seen = true;
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
    }
    dx(e.clientX);
    dy(e.clientY);
    rx(e.clientX);
    ry(e.clientY);
    if (!on) show(true);
  });
  document.addEventListener('pointerover', (e) => (cur.dataset.state = stateOf(e.target as Element)));
  document.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') cur.setAttribute('data-down', ''); });
  document.addEventListener('pointerup', () => cur.removeAttribute('data-down'));
  root.addEventListener('mouseleave', () => show(false));
  root.addEventListener('mouseenter', () => seen && show(true));
  // The full-screen view opens a modal dialog into the top layer (zoom.ts marks the page while it is open).
  new MutationObserver(() => root.classList.contains('lb-open') && raise()).observe(root, { attributeFilter: ['class'] });
  // The router copies <html> attributes from the fetched page and moves the persisted element, which closes the popover.
  document.addEventListener('astro:after-swap', () => {
    raise();
    cur.dataset.state = '';
    root.classList.toggle('cur-on', on);
  });
}
