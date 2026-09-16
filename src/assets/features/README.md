# Feature screenshots

One folder per module, kebab-case file names, imported by name in `src/features.ts` (`shots`).
Astro resizes and converts them at build time, so full-size exports are fine; no browser chrome.

```
pos/            laptop.png · mobile.png · session.png · pos-scene.png   POS digital (pos-scene: barista with tablet + waiter phone)
waiter/         orders.png · take-order-mobile.png · active-orders.png · take-order-image.png   Pelayan
kds/            board.png · board-display.png             Halaman persiapan dapur (board-display is the kitchen photo)
tables/         floor-plan.png · floor-plan-image.png     QR menu statis & sesi
reservations/   calendar.png · calendar-scene.png         Manajemen reservasi
orders/         list.png · e-receipt.png                  Manajemen pesanan · Struk digital
ordering/       desktop.png · mobile.png                  Pesan online  ← still placeholders
payments/       digital-placeholder.png                   Integrasi pembayaran digital  ← placeholder
design-studio/  editor.png · theme-mobile.png · about-mobile.png · design-studio-image.png
inventory/      analytics.png · analytics-scene.png · low-stock.png · stock-movement.png · stock-opname.png · alerts.png · recipe-card.png
promo/          summary.png · summary-scene.png · applied-chip.png
reports/        sales.png · product-performance.png · inventory.png
attendance/     summary.png · summary-scene.png · detail.png   Kehadiran
hrm/            roster.png                                Shift roster
```

A `-scene` / `-image` file is the AI-generated photo a PhotoScene (`Feature.scene` in `src/features.ts`) draws the real
screen into; its `screen` rectangle is measured in percent of the photo.

Kinds (`src/features.ts`): `laptop` keeps the natural aspect inside a laptop bezel, `phone` is cropped from the
top to 9:19 inside a phone bezel, `card` is a plain cropped detail (modals, side panels) shown as-is.

To add a screen: drop the file, import it in `src/features.ts`, add it to `shots`, then list it in the
feature's `shots` array. A feature with an empty `shots` array renders a text panel instead.

Brand photography lives in `src/assets/brand/images/` (full-resolution originals extracted from the brand
guidelines PDF; the owner's screenshots of them are kept in `source-screenshots/`). `photos` in `src/features.ts`
names each one with its alt text and crop; `src/components/Photo.astro` renders it.
