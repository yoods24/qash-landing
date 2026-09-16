// GSAP motion: headline reveals (SplitText), the home page price line, receipts that print line by line, and the photo scenes (a kitchen ticket, an order pad, a floor plan, theme presets). Everything lives in one
// gsap.matchMedia() context so a page change can revert it all.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrollToPlugin);

let mm: gsap.MatchMedia | undefined;
let splits: SplitText[] = [];
let generation = 0;
let swooshObserver: ResizeObserver | undefined;

const showSplits = () => document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => (el.style.visibility = 'visible'));

/** Kills everything from the previous page; view transitions keep this JS context alive between pages. */
export function resetMotion() {
  generation++;
  swooshObserver?.disconnect();
  swooshObserver = undefined;
  splits.forEach((s) => s.revert());
  splits = [];
  mm?.revert();
  mm = undefined;
  ScrollTrigger.killAll();
}

const conditions = { ok: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' };

export async function initMotion() {
  resetMotion();
  const token = generation;
  feeToggle();
  showcase();

  // Everything that does not depend on text layout starts at once, so the hero photo never waits for fonts.
  mm = gsap.matchMedia();
  mm.add(conditions, (ctx) => {
    const ok = Boolean(ctx.conditions?.ok);
    heroIntro(ok);
    if (!ok) {
      photoScenesStatic();
      return;
    }
    collage();
    photoReveals();
    parallax();
    pricing();
    receipts();
    photoScenes();
  });

  // Line splitting and the swoosh position must see the final fonts, otherwise lines break in the wrong places.
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  if (token !== generation) return;
  mm.add(conditions, (ctx) => {
    if (ctx.conditions?.ok) headlines();
    else showSplits();
  });
  placeSwoosh();
  ScrollTrigger.refresh();
}

/** How much larger than its frame a photo is drawn: a parallax photo is scaled just enough for its drift (data-parallax,
 *  percent of the frame either way) never to show an edge, so a 5 becomes 1.1 and nothing more is cropped. */
const baseScale = (img: Element) => {
  const amount = Math.abs(Number(img.closest<HTMLElement>('[data-parallax]')?.dataset.parallax));
  return amount ? 1 + amount / 50 : 1;
};

/** Home hero: the photo wipes open from the right edge and settles, the drawn wing curve underlines the promise, the
 *  POS screen rises in, and the panel eases back as the page scrolls away from it. */
function heroIntro(ok: boolean) {
  const hero = document.querySelector<HTMLElement>('.vh');
  if (!hero) return;
  const media = hero.querySelector<HTMLElement>('.vh-media');
  const img = hero.querySelector<HTMLElement>('.vh-photo img');
  const path = hero.querySelector<SVGPathElement>('.swoosh path');
  const swoosh = hero.querySelector<SVGElement>('.swoosh');
  const tags = hero.querySelectorAll<HTMLElement>('.vh-tag span');
  // Inline values beat the stylesheet's pre-intro state (the photo waiting behind its wipe).
  gsap.set(media, { clipPath: 'inset(0% 0% 0% 100%)' });
  if (!ok) {
    gsap.set(media, { clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set(swoosh, { opacity: 1 });
    return;
  }
  const tl = gsap.timeline({ delay: 0.05 });
  tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' }, 0);
  if (img) tl.fromTo(img, { scale: baseScale(img) * 1.25 }, { scale: baseScale(img), duration: 1.9, ease: 'expo.out' }, 0);
  // The undrawn stroke would still show its two round caps as dots, so the curve only appears as it starts drawing.
  if (path) tl.set(swoosh, { opacity: 1 }, 0.9).fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.95, ease: 'power2.inOut' }, 0.9);
  if (tags.length) tl.fromTo(tags, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, 1.05);

  const panel = hero.querySelector<HTMLElement>('.vh-panel');
  if (panel && matchMedia('(min-width: 901px)').matches) {
    gsap.to(panel, { scale: 0.96, borderRadius: 40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

/** Sits the swoosh under the marked word wherever the headline wraps. The word's horizontal extent comes from its text
 *  (SplitText rewraps it, so the <em> itself has no box); the baseline comes from the line block around it, which the
 *  words' rise animation never moves. Everything is scaled back by the panel's own scroll scale. */
function placeSwoosh() {
  const title = document.querySelector<HTMLElement>('.vh-title');
  const swoosh = title?.querySelector<SVGElement>('.swoosh');
  const h1 = title?.querySelector<HTMLElement>('h1');
  if (!title || !swoosh || !h1) return;
  const place = () => {
    // SplitText leaves an empty copy of the <em> at the end of the previous line when the word wraps: take the one with text.
    const mark = Array.from(title.querySelectorAll<HTMLElement>('.vh-mark')).find((el) => el.textContent?.trim());
    if (!mark) return;
    const range = document.createRange();
    range.selectNodeContents(mark);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0);
    const text = document.createTreeWalker(mark, NodeFilter.SHOW_TEXT).nextNode();
    let line = text?.parentElement ?? null;
    while (line && line !== h1 && getComputedStyle(line).display !== 'block') line = line.parentElement;
    if (!rects.length || !line) return;
    const box = title.getBoundingClientRect();
    const k = title.offsetWidth / box.width || 1;
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    const size = parseFloat(getComputedStyle(h1).fontSize);
    const w = (right - left) * k;
    Object.assign(swoosh.style, {
      fontSize: `${size}px`,
      left: `${(left - box.left) * k - w * 0.02}px`,
      top: `${(line.getBoundingClientRect().bottom - box.top) * k - size * 0.1}px`,
      width: `${w * 1.06}px`,
      height: `${size * 0.36}px`,
    });
  };
  place();
  swooshObserver = new ResizeObserver(() => requestAnimationFrame(place));
  swooshObserver.observe(title);
}

/** Home collage: colour blocks slide open, photo tiles unveil upwards one after another, captions settle last. */
function collage() {
  const grid = document.querySelector<HTMLElement>('.amp-grid');
  if (!grid) return;
  const tiles = gsap.utils.toArray<HTMLElement>('.amp-tile', grid);
  const blocks = gsap.utils.toArray<HTMLElement>('.amp-block', grid);
  const caps = gsap.utils.toArray<HTMLElement>('.amp-cap', grid);
  const imgs = tiles.map((t) => t.querySelector('img')).filter(Boolean);
  const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 78%', once: true } });
  tl.fromTo(blocks, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power3.inOut', stagger: 0.14, clearProps: 'clipPath' }, 0);
  tl.fromTo(tiles, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'power3.inOut', stagger: 0.11, clearProps: 'clipPath' }, 0.1);
  tl.fromTo(imgs, { scale: (_i: number, el: Element) => baseScale(el) * 1.25 }, { scale: (_i: number, el: Element) => baseScale(el), duration: 1.6, ease: 'expo.out', stagger: 0.11 }, 0.1);
  tl.fromTo(caps, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.09 }, 0.75);
}

/** Any other photo marked data-photo-reveal unveils upwards as it enters the viewport (at once if already on screen). */
function photoReveals() {
  gsap.utils.toArray<HTMLElement>('[data-photo-reveal]').forEach((fig) => {
    const img = fig.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
    tl.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
    if (img) tl.fromTo(img, { scale: baseScale(img) * 1.2 }, { scale: baseScale(img), duration: 1.6, ease: 'expo.out' }, 0);
  });
}

/** Photos marked data-parallax drift inside their frame while they cross the viewport. */
function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((fig) => {
    const img = fig.querySelector('img');
    const amount = Number(fig.dataset.parallax) || 6;
    if (!img) return;
    gsap.set(img, { scale: baseScale(img) });
    gsap.fromTo(img, { yPercent: -amount }, { yPercent: amount, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/** Big headings: each line masked, words rising from below, once, as the heading scrolls into view. */
function headlines() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = SplitText.create(el, {
      type: 'lines,words',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        el.style.visibility = 'visible';
        return gsap.from(self.words, {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.035,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
    splits.push(split);
  });
}

/** Home page flow: the sticky screen swaps with a short tween when the active step changes, and the rule above
 *  each step fills in step with the scroll. A scrubbed crossfade would leave a half-blended screen whenever
 *  the reader stops mid-way, so only the rule is tied to scroll position. */
/** The price line (home page `.price`, pricing page `.price-plain`). On the home page the prices the market is used
 *  to come first, each struck out as it lands: 759.000 per outlet, 459.000 per fitur, 599.000 per enterprise. Then,
 *  on both pages, the number counts to 1.000, turns from grey to ink, the thousands fold into a k, and "/transaksi"
 *  slides in. The home page then opens its row of slips (held at zero height until now, so the line never sits over
 *  a blank) and prints them with what is on them. Once, when the section scrolls in. */
function pricing() {
  const sec = document.querySelector<HTMLElement>('.price');
  if (!sec) return;
  const q = (sel: string) => sec.querySelector<HTMLElement>(sel);
  const line = q('.price-line'), tag = q('.price-tag'), n = q('.price-n'), thou = q('.price-thou'), k = q('.price-k'), per = q('.price-per');
  const lead = q('.price-lead'), strike = q('.price-strike'), wrap = q('.price-cards'), zero = q('.price-zero-total');
  const cards = gsap.utils.toArray<HTMLElement>('.price-card', sec);
  const rows = gsap.utils.toArray<HTMLElement>('.price-receipt > div', sec);
  const chips = gsap.utils.toArray<HTMLElement>('.price-chips li', sec);
  if (!line || !tag || !n || !thou || !k || !per) return;
  const fakes: readonly (readonly [number, string])[] = strike && !sec.classList.contains('price-plain') ? [[759000, '/outlet'], [459000, '/fitur'], [599000, '/enterprise']] : [];
  const money = { v: 0 };
  const write = () => (n.textContent = Math.round(money.v).toLocaleString('id-ID'));
  // Before it starts: nol on the tag, the k and the unit waiting (the k out of the flow too, so the grey prices sit
  // tight), the slips' row closed, the market's grey.
  n.textContent = '0';
  gsap.set(k, { scale: 0, opacity: 0, display: 'none' });
  gsap.set(per, { opacity: 0 });
  const rowGap = wrap ? getComputedStyle(wrap).marginTop : '0px';
  if (wrap) gsap.set(wrap, { height: 0, marginTop: 0, overflow: 'hidden' });
  if (fakes.length) line.classList.add('is-fake');
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
  const unit = (text: string, at: number) => {
    tl.call(() => (per.textContent = text), [], at);
    tl.fromTo(per, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, at);
  };
  if (lead) tl.from(lead, { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0);
  tl.from(tag, { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.15);
  // The confusing ones: each lands, gets struck out, and makes way for the next.
  let t = 0.35;
  for (const [v, u] of fakes) {
    tl.to(money, { v, duration: 0.5, ease: 'power2.out', onUpdate: write }, t);
    unit(u, t + 0.1);
    tl.fromTo(strike, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.28, ease: 'power3.inOut' }, t + 0.6);
    tl.to(strike, { scaleX: 0, transformOrigin: 'right center', duration: 0.22, ease: 'power3.in' }, t + 0.95);
    t += 0.95;
  }
  // The real one: the number lands (drops hard after the fakes, climbs calmly on its own), the line turns ink, and
  // 1.000 folds into 1k.
  tl.call(() => line.classList.remove('is-fake'), [], t);
  if (fakes.length) tl.to(per, { y: -8, opacity: 0, duration: 0.25, ease: 'power2.in' }, t);
  tl.to(money, { v: 1000, duration: fakes.length ? 0.7 : 1.1, ease: fakes.length ? 'power3.inOut' : 'power2.inOut', onUpdate: write }, t);
  const land = t + (fakes.length ? 0.8 : 1.2);
  tl.call(() => { n.textContent = '1'; thou.hidden = false; gsap.set(thou, { width: thou.offsetWidth }); gsap.set(k, { display: 'inline-block' }); }, [], land);
  tl.to(thou, { width: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut' }, land + 0.1);
  tl.to(k, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)' }, land + 0.25);
  tl.call(() => (per.textContent = '/transaksi'), [], land + 0.4);
  tl.fromTo(per, { x: -14, y: 0, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, land + 0.4);
  // The slips: their row opens, they print out top to bottom one after another, then what is on them arrives: the
  // module chips, the receipt lines, and the Rp 0 that closes the last one.
  const p = land + 0.8;
  // If the reader has already scrolled past, the page grows above them: the scroll position follows, so nothing jumps.
  let seen = 0;
  if (wrap) tl.to(wrap, {
    height: 'auto',
    marginTop: rowGap,
    duration: 0.7,
    ease: 'power3.inOut',
    clearProps: 'height,marginTop,overflow',
    onStart: () => (seen = wrap.offsetHeight),
    onUpdate: () => { const h = wrap.offsetHeight; if (sec.getBoundingClientRect().bottom < 0) scrollBy(0, h - seen); seen = h; },
    onComplete: () => ScrollTrigger.refresh(),
  }, p);
  if (cards.length) tl.fromTo(cards, { clipPath: 'inset(0 0 100% 0)', y: 16 }, { clipPath: 'inset(0 0 -10px 0)', y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.18, clearProps: 'clipPath,transform' }, p + 0.15);
  if (chips.length) tl.from(chips, { scale: 0.6, opacity: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.03 }, p + 0.6);
  if (rows.length) tl.from(rows, { y: 8, opacity: 0, duration: 0.35, ease: 'power2.out', stagger: 0.08 }, p + 0.75);
  if (zero) tl.fromTo(zero, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, p + 1.8);
}

/** "Bisa dibebankan ke pelanggan": who carries the Rp1.000. Anda turns the fee line into an orange ball that bounces
 *  off to a random spot on the section's floor and fades, while the line closes up; Pelanggan bounces a ball back in
 *  from somewhere in the section and the line opens up again where it lands. The total follows either way. Bound
 *  once per page, outside the motion context, so it also works with reduced motion (the line simply shows or hides). */
function feeToggle() {
  const seg = document.querySelector<HTMLElement>('.price .seg');
  if (!seg || seg.dataset.bound) return;
  seg.dataset.bound = '1';
  const sec = seg.closest<HTMLElement>('.price')!;
  const card = seg.closest<HTMLElement>('.price-card')!;
  const row = card.querySelector<HTMLElement>('.price-receipt .fee');
  const total = card.querySelector<HTMLElement>('.price-total');
  const note = card.querySelector<HTMLElement>('.price-who-note');
  const buttons = Array.from(seg.querySelectorAll<HTMLButtonElement>('button[data-who]'));
  if (!row || !total || !note) return;
  type Who = 'pelanggan' | 'anda';
  const notes: Record<Who, string> = {
    pelanggan: 'Pelanggan membayar Rp1.000 di struknya. Usaha Anda di Rp0.',
    anda: 'Anda menanggungnya dari saldo prabayar. Struk pelanggan tanpa baris tambahan.',
  };
  const amounts: Record<Who, number> = { pelanggan: Number(total.dataset.with), anda: Number(total.dataset.without) };
  const ball = document.createElement('i');
  ball.className = 'fee-ball';
  ball.setAttribute('aria-hidden', 'true');
  card.append(ball);
  const money = { v: amounts.pelanggan };
  const writeTotal = () => (total.textContent = `Rp ${Math.round(money.v).toLocaleString('id-ID')}`);
  const collapse = { height: 0, paddingTop: 0, paddingBottom: 0, marginTop: -8, overflow: 'hidden' };
  /** Parks the ball on the middle of the fee line (card coordinates) and returns the section's box around it. */
  const park = () => {
    const r = row.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    gsap.set(ball, { left: r.left - c.left + r.width / 2 - ball.offsetWidth / 2, top: r.top - c.top + r.height / 2 - ball.offsetHeight / 2, x: 0, y: 0 });
    const s = sec.getBoundingClientRect();
    const b = ball.getBoundingClientRect();
    return { left: s.left + 24 - b.left, right: s.right - 24 - b.right, top: s.top + 24 - b.top, bottom: s.bottom - 24 - b.bottom };
  };
  seg.addEventListener('click', (e) => {
    const who = (e.target as Element).closest<HTMLButtonElement>('button[data-who]')?.dataset.who as Who | undefined;
    if (!who || seg.dataset.who === who) return;
    seg.dataset.who = who;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.who === who)));
    note.textContent = notes[who];
    gsap.killTweensOf([row, money, ball]);
    gsap.set(row, { clearProps: 'transform,opacity' }); // in case the intro had not printed the line yet
    if (matchMedia(conditions.reduce).matches) {
      row.hidden = who === 'anda';
      gsap.set([row, ball], { clearProps: 'all' });
      money.v = amounts[who];
      writeTotal();
      return;
    }
    const tl = gsap.timeline();
    if (who === 'anda') {
      // The line shrinks into the ball, which drops and bounces on the section's floor somewhere else, then fades.
      const box = park();
      gsap.set(ball, { scale: 0, opacity: 1 });
      tl.to(row, { scale: 0.7, opacity: 0, transformOrigin: 'center', duration: 0.3, ease: 'power2.in' }, 0);
      tl.to(ball, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, 0.15);
      tl.to(ball, { x: gsap.utils.random(box.left, box.right), duration: 1.3, ease: 'power1.out' }, 0.45);
      tl.to(ball, { y: box.bottom, duration: 1.3, ease: 'bounce.out' }, 0.45);
      tl.to(ball, { scale: 0.5, opacity: 0, duration: 0.35, ease: 'power2.in' }, 1.7);
      tl.to(row, { ...collapse, duration: 0.4, ease: 'power3.inOut', onComplete: () => { row.hidden = true; gsap.set(row, { clearProps: 'all' }); } }, 0.35);
      tl.to(money, { v: amounts.anda, duration: 0.6, ease: 'power2.out', onUpdate: writeTotal }, 0.5);
    } else {
      // A ball comes in from somewhere in the section, bounces onto the line's spot, and the line opens up from it.
      row.hidden = false;
      const box = park();
      gsap.set(ball, { x: gsap.utils.random(box.left, box.right), y: gsap.utils.random(box.top, box.bottom), scale: 0.5, opacity: 0 });
      gsap.set(row, { scale: 0.7, opacity: 0, transformOrigin: 'center' });
      tl.from(row, { ...collapse, duration: 0.4, ease: 'power3.out', clearProps: 'height,paddingTop,paddingBottom,marginTop,overflow' }, 0);
      tl.to(ball, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
      tl.to(ball, { x: 0, duration: 1.1, ease: 'power1.inOut' }, 0.2);
      tl.to(ball, { y: 0, duration: 1.1, ease: 'bounce.out' }, 0.2);
      tl.to(ball, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.3);
      tl.to(row, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 1.25);
      tl.fromTo(row, { backgroundColor: 'rgba(255, 131, 67, 0.45)' }, { backgroundColor: '#fff0e6', duration: 0.9, ease: 'power2.out', clearProps: 'backgroundColor' }, 1.5);
      tl.to(money, { v: amounts.pelanggan, duration: 0.6, ease: 'power2.out', onUpdate: writeTotal }, 1.3);
    }
  });
}

/** The home page carousel of photo scenes (index.astro, .showcase): a scroll-snap track that GSAP scrolls slide by
 *  slide, every 7 seconds while it is on screen and nobody is hovering or focused on it, and after a longer rest once
 *  someone has used the dashes; a native swipe or keyboard scroll keeps the dots in step. Reduced motion: no
 *  auto-advance, the controls jump. Bound once per page, outside the motion context. */
function showcase() {
  const root = document.querySelector<HTMLElement>('[data-carousel]');
  if (!root || root.dataset.bound) return;
  root.dataset.bound = '1';
  const track = root.querySelector<HTMLElement>('.track');
  const slides = gsap.utils.toArray<HTMLElement>('.slide', root);
  const dots = gsap.utils.toArray<HTMLButtonElement>('.dots button', root);
  if (!track || slides.length < 2) return;
  let i = 0;
  let moving = false;
  let timer: gsap.core.Tween | undefined;
  const reduced = () => matchMedia(conditions.reduce).matches;
  const mark = () => dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
  // A slide's photo loads lazily and a slide to the right is outside the viewport, so the one the track is about to
  // show is asked for ahead of time; otherwise it arrives as a blank dark panel.
  const warm = (j: number) =>
    slides[gsap.utils.wrap(0, slides.length, j)].querySelectorAll<HTMLImageElement>('.ps-img img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
  const later = (delay: number) => {
    timer?.kill();
    warm(i + 1);
    if (reduced() || root.matches(':hover, :focus-within')) return;
    timer = gsap.delayedCall(delay, () => go(i + 1));
  };
  const go = (to: number, delay = 7) => {
    i = gsap.utils.wrap(0, slides.length, to);
    warm(i);
    mark();
    moving = true;
    // Snapping fights a scripted scroll, so it rests until the slide has arrived.
    track.style.scrollSnapType = 'none';
    gsap.to(track, {
      scrollTo: { x: slides[i].offsetLeft },
      duration: reduced() ? 0 : 0.9,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => { track.style.scrollSnapType = ''; moving = false; later(delay); },
    });
  };
  track.addEventListener('scroll', () => {
    if (moving) return;
    const j = Math.round(track.scrollLeft / track.clientWidth);
    if (j !== i) { i = j; mark(); later(14); }
  }, { passive: true });
  dots.forEach((d, j) => {
    d.addEventListener('click', () => go(j, 14));
    d.addEventListener('pointerenter', () => d.classList.add('active'));
    d.addEventListener('pointerleave', () => d.classList.remove('active'));
  });
  root.addEventListener('pointerenter', () => timer?.kill());
  root.addEventListener('pointerleave', () => later(7));
  root.addEventListener('focusin', () => timer?.kill());
  root.addEventListener('focusout', () => later(7));
  ScrollTrigger.create({ trigger: root, start: 'top 80%', end: 'bottom 20%', onToggle: (self) => (self.isActive ? later(7) : timer?.kill()) });
  addEventListener('resize', () => { if (track.isConnected) track.scrollTo({ left: slides[i].offsetLeft }); });
}

/** The ticket vignette: 0:00 to 4:49 while the order moves Baru, Disiapkan, Siap, then it starts over. */
function ticket(scene: HTMLElement, animate: boolean) {
  const timer = scene.querySelector<HTMLElement>('.ticket-timer');
  const stages = gsap.utils.toArray<HTMLElement>('.ticket-stages li', scene);
  if (!timer || stages.length !== 3) return;
  const clock = { s: 0 };
  const write = () => {
    const s = Math.round(clock.s);
    timer.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  const stage = (i: number) =>
    stages.forEach((el, j) => {
      el.classList.toggle('is-active', j === i);
      el.classList.toggle('is-done', j < i);
    });
  if (!animate) {
    clock.s = 289;
    write();
    stage(2);
    return;
  }
  const reset = () => {
    clock.s = 0;
    write();
    stage(0);
  };
  reset();
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.4,
    onRepeat: reset,
    scrollTrigger: { trigger: scene, start: 'top 85%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  tl.to(clock, { s: 289, duration: 6.5, ease: 'none', onUpdate: write }, 0);
  tl.call(() => stage(1), [], 2.3);
  tl.call(() => stage(2), [], 4.9);
  tl.to({}, { duration: 6.5 }, 0);
}

/** Reduced motion: same step logic, but the screen swaps instantly. */
/** Sample receipts print line by line as they come into view. */
function receipts() {
  document.querySelectorAll<HTMLElement>('.bill').forEach((bill) => {
    const card = bill.closest<HTMLElement>('.card') ?? bill;
    const rows = bill.querySelectorAll<HTMLElement>('dl > div, div');
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
    tl.from(card, { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' });
    tl.from(rows, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.09 }, '-=0.3');
  });
}

/** The order pad: an order for table T4 taken on the phone in the photo. Each tap on the phone flies an item chip
 *  into the pad and the total follows; the order goes to the kitchen, comes back ready, is delivered, and the pad
 *  clears for the next table. Without motion the markup already shows the delivered order, so this is never called. */
function orderPad(scene: HTMLElement) {
  const rows = gsap.utils.toArray<HTMLElement>('.pad-rows li', scene);
  const chips = gsap.utils.toArray<HTMLElement>('.chip', scene);
  const screen = scene.querySelector<HTMLElement>('.ps-screen');
  const dot = scene.querySelector<HTMLElement>('.ps-mark i');
  const status = scene.querySelector<HTMLElement>('.pad-status');
  const total = scene.querySelector<HTMLElement>('.pad-total');
  const sum = scene.querySelector<HTMLElement>('.pad-sum');
  const btn = scene.querySelector<HTMLElement>('.pad-btn');
  const fill = scene.querySelector<HTMLElement>('.pad-btn i');
  const label = scene.querySelector<HTMLElement>('.pad-btn-label');
  if (!screen || !status || !total || !sum || !btn || !fill || !label || !rows.length || rows.length !== chips.length) return;

  const money = { v: 0 };
  const write = () => (sum.textContent = `Rp${Math.round(money.v).toLocaleString('id-ID')}`);
  const state = (text: string, cls = '') => {
    status.textContent = text;
    status.className = `pad-status ${cls}`;
  };
  const say = (text: string) => {
    label.textContent = text;
    gsap.fromTo(label, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
  };
  const reset = () => {
    money.v = 0;
    write();
    state('Mencatat');
    label.textContent = 'Kirim ke dapur';
    btn.classList.remove('is-filled', 'is-done');
    gsap.set(rows, { opacity: 0, x: 16 });
    gsap.set(total, { opacity: 1, x: 0 });
    gsap.set(chips, { opacity: 0 });
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
  };
  /** Tap i: the marker on the phone blinks, the item's chip pops up there, flies to its row, and the row prints. The
   *  chips live in the panel, so both ends are measured in the panel's coordinates at the moment of the tap. */
  const tap = (i: number) => {
    const chip = chips[i];
    const row = rows[i];
    const box = chip.offsetParent?.getBoundingClientRect() ?? new DOMRect();
    const from = screen.getBoundingClientRect();
    const to = row.getBoundingClientRect();
    const tl = gsap.timeline();
    if (dot) tl.fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
    tl.fromTo(
      chip,
      { x: from.left + from.width / 2 - box.left - chip.offsetWidth / 2, y: from.top + from.height / 2 - box.top - chip.offsetHeight / 2, scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.5)' },
      0,
    );
    tl.to(chip, { x: to.left - box.left, y: to.top - box.top, scale: 0.85, duration: 0.6, ease: 'power2.inOut' }, 0.4);
    tl.to(chip, { opacity: 0, duration: 0.15 }, 0.9);
    tl.fromTo(row, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 0.85);
    const v = rows.slice(0, i + 1).reduce((a, r) => a + Number(r.dataset.price), 0);
    tl.to(money, { v, duration: 0.5, ease: 'power2.out', onUpdate: write }, 0.9);
  };

  reset();
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.8,
    onRepeat: reset,
    scrollTrigger: { trigger: scene, start: 'top 72%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  // Taking the order: one tap per item, once the card has risen.
  rows.forEach((_, i) => tl.call(tap, [i], 1.9 + i * 1.1));
  // Sent: the button fills and the kitchen has it.
  const send = 1.9 + rows.length * 1.1 + 0.4;
  tl.to(fill, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, send);
  tl.call(() => { btn.classList.add('is-filled'); say('Terkirim ke dapur'); state('Disiapkan', 'is-prep'); }, [], send + 0.25);
  // Ready: the board says so and the button asks for the delivery.
  const ready = send + 2.2;
  tl.set(fill, { transformOrigin: 'right center' }, ready);
  tl.to(fill, { scaleX: 0, duration: 0.45, ease: 'power3.inOut' }, ready);
  tl.call(() => { btn.classList.remove('is-filled'); say(`Antar ${rows.length} item`); state('Siap diantar', 'is-ready'); }, [], ready + 0.2);
  // Delivered.
  const done = ready + 1.9;
  tl.set(fill, { transformOrigin: 'left center' }, done);
  tl.call(() => btn.classList.add('is-done'), [], done);
  tl.to(fill, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, done);
  tl.call(() => { btn.classList.add('is-filled'); say('Diantar'); state('Selesai'); }, [], done + 0.25);
  tl.to(rows, { opacity: 0.5, duration: 0.4 }, done + 0.25);
  // The pad clears for the next table.
  const clear = done + 1.7;
  tl.to([...rows, total], { opacity: 0, x: -12, duration: 0.3, ease: 'power2.in', stagger: 0.05 }, clear);
  tl.set(fill, { transformOrigin: 'right center' }, clear + 0.2);
  tl.to(fill, { scaleX: 0, duration: 0.4, ease: 'power2.inOut' }, clear + 0.2);
  tl.call(() => btn.classList.remove('is-filled'), [], clear + 0.3);
}

/** Photo scenes (PhotoScene.astro): the photo reveals in its own way per feature, the marker pops onto the screen,
 *  the card rises, the photo (and a card floating over it) drifts while the panel crosses the viewport, and the
 *  feature's vignette replays for as long as the panel is on screen. Both halves are keyed by the feature slug. */
type Reveal = (tl: gsap.core.Timeline, scene: HTMLElement, photo: HTMLElement) => void;

/** Kitchen: the photo wipes open from the right edge, as the home hero does. */
const wipe: Reveal = (tl, _scene, photo) =>
  tl.fromTo(photo, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);

/** Waiter: an iris opens from the phone's screen. */
const iris: Reveal = (tl, _scene, photo) => {
  const at = `at ${photo.style.getPropertyValue('--sx').trim()} ${photo.style.getPropertyValue('--sy').trim()}`;
  tl.fromTo(photo, { clipPath: `circle(0% ${at})` }, { clipPath: `circle(110% ${at})`, duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
};

/** Tables: a grid of shutters over the photo rolls up, starting from the one over the laptop, like the editor's grid. */
const tiles: Reveal = (tl, scene, photo) => {
  const media = photo.parentElement!;
  const grid = document.createElement('div');
  grid.className = 'ps-tiles';
  const cells = Array.from({ length: 12 }, () => grid.appendChild(document.createElement('i')));
  media.append(grid);
  const m = media.getBoundingClientRect();
  const r = scene.querySelector<HTMLElement>('.ps-screen')?.getBoundingClientRect() ?? m;
  const col = gsap.utils.clamp(0, 3, Math.floor(((r.left + r.width / 2 - m.left) / m.width) * 4));
  const row = gsap.utils.clamp(0, 2, Math.floor(((r.top + r.height / 2 - m.top) / m.height) * 3));
  tl.to(cells, { scaleY: 0, transformOrigin: 'top center', duration: 0.75, ease: 'power3.inOut', stagger: { each: 0.07, grid: [3, 4], from: row * 4 + col }, onComplete: () => grid.remove() }, 0.1);
};

/** Studio: the photo starts as the laptop's screen alone, in wireframe grey, then colours in and grows to fill the café. */
const expand: Reveal = (tl, scene, photo) => {
  const box = scene.querySelector<HTMLElement>('.ps-screen')?.style;
  if (!box) return wipe(tl, scene, photo);
  const [l, t, w, h] = [box.left, box.top, box.width, box.height].map(parseFloat);
  tl.fromTo(
    photo,
    { clipPath: `inset(${t}% ${100 - l - w}% ${100 - t - h}% ${l}% round 14px)`, filter: 'saturate(0.1) brightness(0.75)' },
    { clipPath: 'inset(0% 0% 0% 0% round 0px)', filter: 'saturate(1) brightness(1)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath,filter' },
    0,
  );
};

const reveals: Record<string, Reveal> = { 'layar-dapur': wipe, pelayan: iris, 'denah-meja': tiles, 'design-studio': expand, kasir: iris };
const replays: Record<string, (scene: HTMLElement) => void> = {
  'layar-dapur': (scene) => ticket(scene, true),
  pelayan: orderPad,
  'denah-meja': floorPlan,
  'design-studio': presets,
  reservasi: bookings,
  kasir: register,
};

function photoScenes() {
  document.querySelectorAll<HTMLElement>('[data-photo-scene]').forEach((scene) => {
    const kind = scene.dataset.photoScene ?? '';
    const photo = scene.querySelector<HTMLElement>('.ps-photo');
    const img = scene.querySelector<HTMLElement>('.ps-img img');
    const mark = scene.querySelector<HTMLElement>('.ps-mark');
    const card = scene.querySelector<HTMLElement>('.ps-card');
    if (photo) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 72%', once: true } });
      (reveals[kind] ?? wipe)(tl, scene, photo);
      if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0);
      if (mark) tl.fromTo(mark, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, 1);
      if (card) tl.fromTo(card, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.8);
      const drift = () => ({ ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(photo, { yPercent: -2.5 }, { yPercent: 2.5, ...drift() });
      // Only a card floating over the photo drifts; one under the copy stays with its text.
      if (card && card.parentElement?.classList.contains('ps-panel')) gsap.fromTo(card, { yPercent: 10 }, { yPercent: -10, ...drift() });
    }
    replays[kind]?.(scene);
  });
}

/** Reduced motion: the cards' markup already shows a finished state; only the kitchen ticket is written by script. */
function photoScenesStatic() {
  document.querySelectorAll<HTMLElement>('[data-photo-scene="layar-dapur"]').forEach((scene) => ticket(scene, false));
}

/** The floor plan: one evening on the ground floor. Tables change status one event at a time, the count of busy
 *  tables follows, and the note under the plan says what just happened. Then the evening starts over. */
function floorPlan(scene: HTMLElement) {
  const tables = new Map(gsap.utils.toArray<HTMLElement>('.plan-grid [data-t]', scene).map((el) => [el.dataset.t ?? '', el]));
  const note = scene.querySelector<HTMLElement>('.plan-note');
  const count = scene.querySelector<HTMLElement>('.plan-count b');
  const dot = scene.querySelector<HTMLElement>('.ps-mark i');
  if (!note || !count || !tables.size) return;
  const STATES = ['is-busy', 'is-bill', 'is-hold'];
  const set = (t: string, state: string) => {
    const el = tables.get(t);
    if (!el) return;
    el.classList.remove(...STATES);
    if (state) el.classList.add(state);
  };
  const recount = () => (count.textContent = String([...tables.values()].filter((el) => el.classList.contains('is-busy') || el.classList.contains('is-bill')).length));
  const event = (t: string, state: string, text: string) => {
    set(t, state);
    recount();
    note.textContent = text;
    gsap.fromTo(note, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    if (dot) gsap.fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'power2.out' });
  };
  const reset = () => {
    tables.forEach((_, t) => set(t, ''));
    recount();
    note.textContent = 'Denah mengikuti pesanan yang sedang berjalan.';
  };
  reset();
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
    onRepeat: reset,
    scrollTrigger: { trigger: scene, start: 'top 72%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  const evening: [number, string, string, string][] = [
    [1.8, 'T4', 'is-busy', 'Tamu memindai QR di T4. Menu terbuka di ponselnya.'],
    [3.6, 'T2', 'is-busy', 'Pelayan mendudukkan empat tamu di T2.'],
    [5.4, 'T4', 'is-bill', 'T4 minta tagihan. Kasir menutupnya.'],
    [7.0, 'T4', '', 'T4 kosong lagi, siap untuk tamu berikutnya.'],
    [8.6, 'T6', 'is-hold', 'Reservasi pukul 19.00 menahan T6.'],
  ];
  evening.forEach(([t, table, state, text]) => tl.call(event, [table, state, text], t));
  tl.to({}, { duration: 0.1 }, 10.4);
}

/** Design Studio presets: the little site re-dresses itself with each preset in turn, the chip is pressed, and the
 *  save tick blinks once the look has settled. */
function presets(scene: HTMLElement) {
  const site = scene.querySelector<HTMLElement>('.site');
  const chips = gsap.utils.toArray<HTMLElement>('.presets li', scene);
  const saved = scene.querySelector<HTMLElement>('.studio-saved');
  const dot = scene.querySelector<HTMLElement>('.ps-mark i');
  if (!site || chips.length < 2) return;
  const pick = (i: number) => {
    site.dataset.preset = chips[i].dataset.preset ?? '';
    chips.forEach((c, j) => c.classList.toggle('is-active', i === j));
    gsap.fromTo(chips[i], { scale: 0.9 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
    if (dot) gsap.fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'power2.out' });
    if (saved) gsap.fromTo(saved, { opacity: 0, x: 6 }, { opacity: 1, x: 0, duration: 0.35, delay: 0.8, ease: 'power2.out', overwrite: true });
  };
  if (saved) gsap.set(saved, { opacity: 0 });
  const tl = gsap.timeline({
    repeat: -1,
    scrollTrigger: { trigger: scene, start: 'top 72%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  chips.forEach((_, i) => tl.call(pick, [i], 1.6 + i * 2.6));
  tl.to({}, { duration: 0.1 }, 1.6 + chips.length * 2.6);
}

/** A pop for a status chip that has just changed. */
const pop = (el: HTMLElement) => gsap.fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });

/** The day sheet (ReservationScene): a booking for 19:00 lands as new, is confirmed and its table held for the hour,
 *  then the guest arrives; then the sheet forgets it and the evening starts over. Without motion the markup already
 *  shows the arrived guest, so this is never called. */
function bookings(scene: HTMLElement) {
  const row = scene.querySelector<HTMLElement>('.rsv-new');
  const status = row?.querySelector<HTMLElement>('.rsv-status');
  const table = scene.querySelector<HTMLElement>('.rsv-table');
  const seat = scene.querySelector<HTMLElement>('.rsv-table-label');
  const count = scene.querySelector<HTMLElement>('.rsv-count');
  const dot = scene.querySelector<HTMLElement>('.ps-mark i');
  if (!row || !status || !table || !seat || !count) return;
  const state = (text: string, cls: string) => { status.textContent = text; status.className = `rsv-status ${cls}`; pop(status); };
  const hold = (text: string, cls: string) => { seat.textContent = text; table.className = `rsv-table ${cls}`; };
  const reset = () => {
    count.textContent = '2 reservasi';
    status.textContent = 'Baru';
    status.className = 'rsv-status is-new';
    hold('Meja T6 · kosong', '');
    gsap.set(row, { opacity: 0, x: 16 });
    gsap.set(table, { opacity: 0.55 });
  };
  reset();
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.2,
    onRepeat: reset,
    scrollTrigger: { trigger: scene, start: 'top 72%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  // The booking comes in off the laptop.
  if (dot) tl.fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 1.6);
  tl.to(row, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 1.7);
  tl.call(() => { count.textContent = '3 reservasi'; pop(count); }, [], 1.7);
  // Confirmed: the table is held for the hour.
  tl.call(() => { state('Dikonfirmasi', 'is-ok'); hold('Meja T6 · ditahan 19:00', 'is-held'); }, [], 3.5);
  tl.to(table, { opacity: 1, duration: 0.4 }, 3.5);
  // The guest arrives.
  tl.call(() => { state('Tiba', 'is-in'); hold('Meja T6 · terisi', 'is-seated'); }, [], 5.8);
  tl.to({}, { duration: 2 }, 5.8);
}

/** The register (PosScene): the sale prints line by line as the cashier taps, the total follows, cash lands, the
 *  change is counted, and the sale closes; then the next customer. Without motion the markup shows the closed sale. */
function register(scene: HTMLElement) {
  const rows = gsap.utils.toArray<HTMLElement>('.reg-rows li', scene);
  const status = scene.querySelector<HTMLElement>('.reg-status');
  const sum = scene.querySelector<HTMLElement>('.reg-sum');
  const tender = scene.querySelector<HTMLElement>('.reg-tender');
  const change = scene.querySelector<HTMLElement>('.reg-change');
  const back = scene.querySelector<HTMLElement>('.reg-back');
  const dot = scene.querySelector<HTMLElement>('.ps-mark i');
  if (!rows.length || !status || !sum || !tender || !change || !back) return;
  const cash = Number(tender.dataset.cash);
  const total = rows.reduce((a, r) => a + Number(r.dataset.price), 0);
  const money = { v: 0, c: 0 };
  const rp = (n: number) => `Rp${Math.round(n).toLocaleString('id-ID')}`;
  const reset = () => {
    money.v = 0;
    money.c = 0;
    sum.textContent = rp(0);
    back.textContent = rp(0);
    status.textContent = 'Terbuka';
    status.className = 'reg-status';
    gsap.set(rows, { opacity: 0, y: 8 });
    gsap.set([tender, change], { opacity: 0, y: 8 });
  };
  reset();
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
    onRepeat: reset,
    scrollTrigger: { trigger: scene, start: 'top 72%', end: 'bottom 15%', toggleActions: 'play pause resume pause' },
  });
  // One tap on the tablet per line; the total follows each one.
  rows.forEach((row, i) => {
    const at = 1.6 + i * 0.9;
    if (dot) tl.fromTo(dot, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, at);
    tl.to(row, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, at);
    const v = rows.slice(0, i + 1).reduce((a, r) => a + Number(r.dataset.price), 0);
    tl.to(money, { v, duration: 0.5, ease: 'power2.out', onUpdate: () => (sum.textContent = rp(money.v)) }, at + 0.05);
  });
  // Cash lands, the change is counted, the sale closes.
  const pay = 1.6 + rows.length * 0.9 + 0.5;
  tl.to(tender, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, pay);
  tl.to(change, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, pay + 0.4);
  tl.to(money, { c: cash - total, duration: 0.6, ease: 'power2.out', onUpdate: () => (back.textContent = rp(money.c)) }, pay + 0.45);
  tl.call(() => { status.textContent = 'Lunas'; status.className = 'reg-status is-paid'; pop(status); }, [], pay + 1.1);
  tl.to({}, { duration: 1.8 }, pay + 1.1);
}
