import type { ImageMetadata } from "astro";

import posLaptop from "./assets/features/pos/laptop.png";
import posMobile from "./assets/features/pos/mobile.png";
import posSession from "./assets/features/pos/session.png";
import waiterTakeOrder from "./assets/features/waiter/take-order-mobile.png";
import kdsBoard from "./assets/features/kds/board.png";
import kdsScene from "./assets/features/kds/board-display.png";
import waiterScene from "./assets/features/waiter/take-order-image.png";
import tablesScene from "./assets/features/tables/floor-plan-image.png";
import studioScene from "./assets/features/design-studio/design-studio-image.png";
import floorPlan from "./assets/features/tables/floor-plan.png";
import reservationCalendar from "./assets/features/reservations/calendar.png";
import orderingDesktop from "./assets/features/ordering/desktop.png";
import orderingMobile from "./assets/features/ordering/mobile.png";
import studioEditor from "./assets/features/design-studio/editor.png";
import studioTheme from "./assets/features/design-studio/theme-mobile.png";
import recipeCard from "./assets/features/inventory/recipe-card.png";
import promoSummary from "./assets/features/promo/summary.png";
import reportSales from "./assets/features/reports/sales.png";
import reportInventory from "./assets/features/reports/inventory.png";
import attendanceSummary from "./assets/features/attendance/summary.png";
import attendanceDetail from "./assets/features/attendance/detail.png";
import rosterWeek from "./assets/features/hrm/roster.png";
import ordersList from "./assets/features/orders/list.png";
import eReceipt from "./assets/features/orders/e-receipt.png";
import reservationScene from "./assets/features/reservations/calendar-scene.png";
import invAnalytics from "./assets/features/inventory/analytics.png";
import invAnalyticsScene from "./assets/features/inventory/analytics-scene.png";
import lowStock from "./assets/features/inventory/low-stock.png";
import stockMovement from "./assets/features/inventory/stock-movement.png";
import stockOpname from "./assets/features/inventory/stock-opname.png";
import stockAlerts from "./assets/features/inventory/alerts.png";
import activeOrders from "./assets/features/waiter/active-orders.png";
import posScene from "./assets/features/pos/pos-scene.png";
import promoScene from "./assets/features/promo/summary-scene.png";
import appliedChip from "./assets/features/promo/applied-chip.png";
import attendanceScene from "./assets/features/attendance/summary-scene.png";
import digitalPlaceholder from "./assets/features/payments/digital-placeholder.png";
import driveThru from "./assets/brand/images/drive-thru-handoff.png";
import qashBook from "./assets/brand/images/qash-book.jpg";
import phoneFabric from "./assets/brand/images/phone-on-fabric.jpg";
import barEvening from "./assets/brand/images/bar-evening.jpg";
import appScreens from "./assets/brand/images/app-screens-grid.jpg";
import coffeeOrder from "./assets/brand/images/coffee-order-phone.jpg";

/** An imported image's plain metadata. Reading width or height off the import itself tells Astro the original file is
 *  used as is and keeps it in the build; the clone carries the same numbers without the bookkeeping. */
export const plain = (img: ImageMetadata): ImageMetadata =>
  (img as ImageMetadata & { clone?: ImageMetadata }).clone ?? img;

export type ShotKind = "laptop" | "phone" | "card";
export interface Shot {
  src: ImageMetadata;
  kind: ShotKind;
  alt: string;
}

const laptop = (src: ImageMetadata, alt: string): Shot => ({
  src,
  kind: "laptop",
  alt,
});
const phone = (src: ImageMetadata, alt: string): Shot => ({
  src,
  kind: "phone",
  alt,
});
const card = (src: ImageMetadata, alt: string): Shot => ({
  src,
  kind: "card",
  alt,
});

// Every screenshot, named once, so pages can compose them without re-importing.
export const shots = {
  posLaptop: laptop(
    posLaptop,
    "Layar kasir Qash di laptop: daftar menu, keranjang, dan pilihan jenis layanan",
  ),
  posMobile: phone(posMobile, "Layar kasir Qash di ponsel"),
  posSession: card(
    posSession,
    "Lembar sesi register: kas awal, penjualan tunai, kas yang seharusnya ada, dan selisih",
  ),
  waiterTakeOrder: phone(
    waiterTakeOrder,
    "Aplikasi pelayan: mengambil pesanan untuk meja T4 dari ponsel",
  ),
  kdsBoard: laptop(
    kdsBoard,
    "Layar dapur stasiun Bar: tiket baru, sedang disiapkan, dan siap",
  ),
  floorPlan: laptop(
    floorPlan,
    "Editor denah meja: lantai, bentuk meja, jumlah kursi, dan status",
  ),
  reservationCalendar: laptop(
    reservationCalendar,
    "Kalender reservasi dengan daftar tamu per hari",
  ),
  orderingDesktop: laptop(
    orderingDesktop,
    "Halaman pemesanan online di laptop",
  ),
  orderingMobile: phone(
    orderingMobile,
    "Halaman pemesanan online di ponsel tamu",
  ),
  studioEditor: laptop(
    studioEditor,
    "Design Studio: mengedit hero website kafe dengan pratinjau langsung",
  ),
  studioTheme: phone(
    studioTheme,
    "Design Studio di ponsel: preset tampilan, tipografi, dan warna",
  ),
  recipeCard: card(
    recipeCard,
    "Kartu resep: bahan per porsi, stok di tangan, sisa porsi, dan HPP per porsi",
  ),
  promoSummary: laptop(
    promoSummary,
    "Ringkasan promo: berapa kali dipakai, biaya diskon, dan pendapatan yang dibawa",
  ),
  reportSales: laptop(
    reportSales,
    "Laporan penjualan: penjualan kotor, diskon, penjualan bersih, dan tren",
  ),
  reportInventory: laptop(
    reportInventory,
    "Laporan inventaris: nilai stok, stok mati, item kedaluwarsa",
  ),
  attendanceSummary: laptop(
    attendanceSummary,
    "Rekap kehadiran per karyawan dalam satu bulan",
  ),
  attendanceDetail: card(
    attendanceDetail,
    "Detail absensi: jam masuk, jam pulang, lokasi, dan jam kerja",
  ),
  roster: laptop(
    rosterWeek,
    "Roster mingguan per posisi dengan cakupan per hari",
  ),
  ordersList: laptop(
    ordersList,
    "Daftar pesanan outlet: jenis, pelanggan, kasir, metode bayar, status penyajian dan pembayaran",
  ),
  eReceipt: phone(
    eReceipt,
    "Struk digital di ponsel tamu: pembayaran berhasil, nomor pesanan A-214, rincian item, dan total",
  ),
  invAnalytics: laptop(
    invAnalytics,
    "Analitik inventaris: nilai stok, pembelian, biaya waste, persentase waste, dan bahan yang paling cepat habis",
  ),
  lowStock: card(
    lowStock,
    "Bahan di bawah batas minimum: stok di tangan, batas minimum, dan kekurangannya",
  ),
  stockMovement: laptop(
    stockMovement,
    "Detail pergerakan stok Cold Brew: kartu stok, valuasi, tren 30 hari, dan ke mana stok pergi",
  ),
  stockOpname: laptop(
    stockOpname,
    "Sesi stock opname: jumlah sistem, jumlah terhitung, selisih, dan nilai selisih per bahan",
  ),
  stockAlerts: card(
    stockAlerts,
    "Notifikasi stok rendah: Iced Americano Bottle di bawah batas pesan ulang",
  ),
  activeOrders: card(
    activeOrders,
    "Pesanan aktif di aplikasi pelayan: status tiap pesanan dengan tombol struk dan bayar",
  ),
  appliedChip: card(
    appliedChip,
    "Promo per total belanja terpasang otomatis di kasir: Belanja 100K Diskon 10%",
  ),
  digitalPlaceholder: phone(
    digitalPlaceholder,
    "Placeholder layar pembayaran digital di ponsel",
  ),
};

const svg = (paths: string): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const icons = {
  register: svg(
    '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 9h18M8 21h8M12 17v4"/>',
  ),
  waiter: svg(
    '<path d="M4 15h16a8 8 0 0 0-16 0Z"/><path d="M2 19h20M12 7V5"/>',
  ),
  kitchen: svg(
    '<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .3-2 1-3 0 2 1 3 2 3 0-3 1-6 1-8Z"/><path d="M5 21h14"/>',
  ),
  tables: svg(
    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><circle cx="17.5" cy="6.5" r="3.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  ),
  calendar: svg(
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15h3"/>',
  ),
  qr: svg(
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-4M14 21h1"/>',
  ),
  studio: svg(
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>',
  ),
  stock: svg(
    '<path d="M3 8 12 3l9 5-9 5-9-5Z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
  ),
  recipe: svg(
    '<path d="M9 3h6v5l4 8a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 16l4-8V3Z"/><path d="M7 14h10"/>',
  ),
  promo: svg(
    '<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.4"/>',
  ),
  reports: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  attendance: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  roster: svg(
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h3M14 14h3M7 18h3"/>',
  ),
  payroll: svg(
    '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  ),
  coffee: svg(
    '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M7 4v2M11 3v3"/>',
  ),
  bakery: svg(
    '<path d="M4 12a8 8 0 0 1 16 0v1H4v-1Z"/><path d="M3 13h18v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2ZM9 8l1 2M14 7l-1 3"/>',
  ),
  restaurant: svg(
    '<path d="M6 3v18M4 3v5a2 2 0 0 0 4 0V3M17 3c-2 0-3 3-3 6 0 2 1 3 3 3v9"/>',
  ),
  bar: svg('<path d="M5 3h14l-7 9-7-9Z"/><path d="M12 12v8M8 21h8"/>'),
  foodcourt: svg(
    '<path d="M3 10 5 4h14l2 6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9M10 21v-5h4v5"/>',
  ),
  retail: svg(
    '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  ),
  outlets: svg(
    '<rect x="3" y="9" width="8" height="12" rx="1"/><rect x="13" y="4" width="8" height="17" rx="1"/><path d="M6 13h2M6 17h2M16 8h2M16 12h2M16 16h2"/>',
  ),
  orders: svg(
    '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
  ),
  lock: svg(
    '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/>',
  ),
  bill: svg(
    '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z"/><path d="M9 8h6M9 12h6"/>',
  ),
  users: svg(
    '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
  ),
  dashboard: svg(
    '<rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="15" width="8" height="6" rx="1.5"/>',
  ),
  bell: svg(
    '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  ),
  transfer: svg('<path d="M4 7h13l-3-3M20 17H7l3 3"/>'),
  truck: svg(
    '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  ),
  split: svg('<path d="M12 3v18M4 8h5M4 12h5M4 16h5M15 8h5M15 12h5M15 16h5"/>'),
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.5-.3Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
};

/** A photograph of the feature in use, with the real app screen's place in it (percent of the photo), so the page
 *  can lift the first shot out of the photo into the full-screen view. Which component tells the scene is chosen by
 *  the feature's slug in src/pages/fitur/[slug].astro. */
export interface Scene {
  src: ImageMetadata;
  alt: string;
  screen: { left: number; top: number; width: number; height: number };
  /** A second device in the same photo (the POS photo has a tablet and a phone): its screenshot and where it sits. */
  extra?: {
    shot: Shot;
    screen: { left: number; top: number; width: number; height: number };
  };
}

export interface Feature {
  slug: string;
  name: string;
  icon: string;
  short: string; // one line for menus and cards
  tagline: string; // the feature's headline
  body: string;
  highlights: string[];
  shots: Shot[];
  scene?: Scene;
}

export interface Suite {
  slug: string;
  name: string;
  icon: string;
  short: string;
  tagline: string;
  body: string;
  features: Feature[];
}

// Shared by Manajemen pesanan and Point of Sales; one object so the copy stays in step.
const reservasi: Feature = {
  slug: "reservasi",
  name: "Manajemen reservasi",
  icon: icons.calendar,
  short: "Kalender pemesanan dan penahanan meja.",
  tagline: "Terima pesanan tempat sebelum tamunya datang.",
  body: "Catat reservasi dari telepon atau WhatsApp ke kalender, tahan mejanya untuk jam itu, lalu tandai tiba saat tamu datang.",
  highlights: [
    "Tampilan kalender dan daftar per hari",
    "Meja tertahan otomatis di jam reservasi",
    "Status dikonfirmasi, tiba, dan batal",
  ],
  shots: [shots.reservationCalendar],
  scene: {
    src: reservationScene,
    alt: "Staf restoran di pass dapur membuka kalender reservasi Qash di laptop",
    screen: { left: 42.6, top: 41.1, width: 38.9, height: 42.2 },
  },
};

// The eleven parts of Qash. One page each at /fitur/<slug>, one section per feature. A feature with `scene` is told
// by its own component (src/pages/fitur/[slug].astro, scenes) and can open its group's page (suiteScenes).
export const suites: Suite[] = [
  {
    slug: "pesanan",
    name: "Manajemen pesanan",
    icon: icons.orders,
    short:
      "QR meja, daftar pesanan, pembayaran digital, reservasi, struk digital.",
    tagline: "Setiap pesanan masuk ke satu daftar yang sama.",
    body: "Dari QR meja, kasir, pelayan, atau reservasi, semua pesanan masuk ke satu daftar, dibayar dengan cara apa pun, dan struknya sampai ke ponsel tamu.",
    features: [
      {
        slug: "daftar-pesanan",
        name: "Manajemen pesanan",
        icon: icons.orders,
        short: "Semua pesanan aktif, dari mana pun asalnya.",
        tagline: "Satu daftar untuk pesanan dari kasir, pelayan, dan QR.",
        body: "Makan di tempat, bawa pulang, ambil sendiri, drive-thru, dan pesanan QR tampil di satu daftar dengan statusnya. Ubah, gabung, atau batalkan dengan alasan yang tercatat.",
        highlights: [
          "Saring per jenis layanan, status, atau stasiun",
          "Alasan batal dan void tercatat",
          "Nomor pesanan harian yang berurutan",
        ],
        shots: [shots.ordersList],
      },
      {
        slug: "pembayaran-digital",
        name: "Integrasi pembayaran digital",
        icon: icons.payroll,
        short: "QRIS dan pembayaran online masuk otomatis.",
        tagline:
          "Tamu bayar dari ponselnya, kasir tidak perlu mengecek mutasi.",
        body: "Aktifkan gateway pembayaran per outlet. Tamu yang memesan lewat QR atau tautan membayar online, statusnya berubah lunas sendiri, dan biayanya tampil di laporan biaya pembayaran.",
        highlights: [
          "QRIS, kartu, transfer bank, dan EDC di kasir",
          "Pembayaran online untuk pesanan QR dan tautan",
          "Rekening pencairan per akun",
        ],
        shots: [shots.digitalPlaceholder],
      },
      {
        slug: "denah-meja",
        name: "QR menu statis & sesi",
        icon: icons.qr,
        short: "QR statis di meja atau QR sesi per tamu.",
        tagline: "QR menu statis atau sesi terbuka, Anda yang pilih.",
        body: "Susun lantai dan meja sesuai ruangan, lalu pasang QR di tiap meja. QR statis tercetak permanen dan selalu membuka menu meja itu; QR sesi dicetak kasir per tamu dan tutup sendiri saat tagihannya selesai. Status meja mengikuti pesanan yang berjalan.",
        highlights: [
          "Beberapa lantai per outlet",
          "QR statis permanen atau QR sesi per tamu",
          "Laporan pemakaian meja",
        ],
        shots: [shots.floorPlan, shots.orderingMobile],
        scene: {
          src: tablesScene,
          alt: "Manajer restoran di pass dapur menyusun denah lantai dasar di editor denah meja Qash dari laptop",
          screen: { left: 44.4, top: 36.4, width: 42.3, height: 40.9 },
        },
      },
      reservasi,
      {
        slug: "struk-digital",
        name: "Struk digital",
        icon: icons.bill,
        short: "Struk ke ponsel tamu, bukan hanya kertas.",
        tagline: "Struk yang sampai ke ponsel tamu.",
        body: "Setiap transaksi punya struk digital yang bisa dibuka dari tautan atau dikirim ke tamu. Templat struk mengikuti brand Anda, dan struk kertas tetap bisa dicetak ke printer thermal.",
        highlights: [
          "Templat struk dengan logo dan pesan Anda",
          "Tautan struk per transaksi",
          "Cetak thermal lewat stasiun cetak",
        ],
        shots: [shots.eReceipt],
      },
    ],
  },
  {
    slug: "inventaris",
    name: "Inventaris",
    icon: icons.stock,
    short: "Stok, opname, transfer, produksi, pemasok, dan pembelian.",
    tagline: "Tahu apa yang menipis sebelum benar-benar habis.",
    body: "Setiap penjualan memotong bahan sesuai resep. Stok per outlet, pergerakannya, opname, transfer, produksi, dan pembelian dari pemasok saling terhubung, dan peringatannya datang setiap pagi.",
    features: [
      {
        slug: "analitik-stok",
        name: "Analitik",
        icon: icons.reports,
        short: "Nilai stok, stok mati, dan selisih pemakaian.",
        tagline: "Angka stok yang menunjukkan bahan yang bocor.",
        body: "Laporan inventaris menampilkan nilai stok, stok mati, item kedaluwarsa, dan selisih antara pemakaian menurut resep dan hasil opname. Menu matrix menunjukkan produk mana yang laris dan mana yang menguntungkan.",
        highlights: [
          "Nilai stok per outlet",
          "Selisih pemakaian versus resep",
          "HPP, margin, dan menu matrix per produk",
        ],
        shots: [shots.invAnalytics, shots.lowStock],
        scene: {
          src: invAnalyticsScene,
          alt: "Laptop di meja kafe menampilkan analitik inventaris Qash, di samping secangkir kopi",
          screen: { left: 14, top: 33, width: 41.8, height: 39.5 },
        },
      },
      {
        slug: "pergerakan-stok",
        name: "Pergerakan stok",
        icon: icons.transfer,
        short: "Masuk, keluar, waste, dan penyesuaian, semua tercatat.",
        tagline: "Setiap perubahan stok punya alasan dan jejaknya.",
        body: "Penerimaan barang, pemakaian karena penjualan, waste, transfer, dan penyesuaian manual masuk ke satu riwayat per item. Siapa yang mencatat dan kapan ikut tersimpan.",
        highlights: [
          "Riwayat per item dan per outlet",
          "Alasan waste dan penyesuaian",
          "Terima barang dengan atau tanpa pesanan pembelian",
        ],
        shots: [shots.stockMovement],
      },
      {
        slug: "stok-produk-bahan",
        name: "Stok produk & bahan",
        icon: icons.recipe,
        short: "Bahan baku dan produk jadi per outlet, dengan resepnya.",
        tagline: "Setiap porsi tahu harga pokoknya sendiri.",
        body: "Bahan baku dan produk jadi tersimpan per outlet dengan satuan dan konversinya. Pasang resep pada produk, dan setiap penjualan memotong bahan sekaligus menghitung HPP per porsi. Versi resep tersimpan.",
        highlights: [
          "Master bahan lintas outlet",
          "Resep dengan versi dan HPP per porsi",
          "Sisa porsi dihitung dari stok bahan",
        ],
        shots: [shots.recipeCard],
      },
      {
        slug: "stock-opname",
        name: "Stock opname",
        icon: icons.stock,
        short: "Hitung fisik, sistem menyesuaikan.",
        tagline: "Opname tanpa lembar kertas.",
        body: "Buat sesi opname, hitung fisik dari ponsel atau laptop, dan sistem menampilkan selisihnya sebelum Anda menyetujui penyesuaian.",
        highlights: [
          "Opname per kategori atau seluruh outlet",
          "Selisih terlihat sebelum disetujui",
          "Riwayat opname tersimpan",
        ],
        shots: [shots.stockOpname],
      },
      {
        slug: "transfer-outlet",
        name: "Transfer antar outlet",
        icon: icons.outlets,
        short: "Kirim stok ke cabang lain dengan bukti.",
        tagline: "Stok pindah cabang, tercatat di dua sisi.",
        body: "Buat permintaan transfer, kirim, lalu outlet penerima mengonfirmasi jumlah yang diterima. Selisih di perjalanan terlihat.",
        highlights: [
          "Status dikirim dan diterima",
          "Selisih pengiriman tercatat",
          "Riwayat per outlet",
        ],
        shots: [],
      },
      {
        slug: "produksi",
        name: "Stok produksi",
        icon: icons.bakery,
        short: "Barang setengah jadi dan buatan sendiri.",
        tagline: "Produksi harian yang memotong bahan dan menambah stok.",
        body: "Catat batch produksi untuk roti, saus, atau bahan setengah jadi. Bahan mentahnya terpotong, hasil produksinya masuk stok dengan HPP-nya.",
        highlights: [
          "Batch produksi dengan resep",
          "HPP hasil produksi terhitung",
          "Cocok untuk bakery dan dapur sentral",
        ],
        shots: [],
      },
      {
        slug: "peringatan-stok",
        name: "Peringatan otomatis",
        icon: icons.bell,
        short: "Stok menipis, minus, dan kedaluwarsa, setiap pagi.",
        tagline: "Diberi tahu sebelum bahan habis di jam sibuk.",
        body: "Tentukan batas minimum per item. Setiap pagi Qash mengirim daftar item yang menipis, minus, atau mendekati kedaluwarsa ke dashboard dan notifikasi Anda.",
        highlights: [
          "Batas minimum per item per outlet",
          "Notifikasi harian",
          "Item kedaluwarsa terpantau",
        ],
        shots: [shots.stockAlerts],
      },
      {
        slug: "pemasok",
        name: "Penyuplai",
        icon: icons.truck,
        short: "Data pemasok dan pembayarannya.",
        tagline: "Tahu berapa yang belum dibayar ke pemasok.",
        body: "Simpan pemasok beserta item yang dipasoknya, catat pembayaran per pesanan, dan lihat saldo yang masih terutang.",
        highlights: [
          "Pemasok per item",
          "Riwayat pembayaran pemasok",
          "Saldo terutang per pemasok",
        ],
        shots: [],
      },
      {
        slug: "pesanan-pembelian",
        name: "PO & saran pembelian",
        icon: icons.orders,
        short: "Pesanan pembelian dari saran sistem.",
        tagline: "Belanja dari daftar yang sistem susun.",
        body: "Qash menyarankan item yang perlu dibeli dari batas minimum dan pemakaian. Ubah jumlahnya, jadikan pesanan pembelian, kirim ke pemasok, lalu terima barangnya ke stok.",
        highlights: [
          "Saran belanja dari pemakaian",
          "PO per pemasok",
          "Penerimaan sebagian atau penuh",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "promo",
    name: "Promo",
    icon: icons.promo,
    short: "Diskon dasar, per total, per produk, dan kode promo.",
    tagline: "Promo yang bisa diukur, bukan ditebak.",
    body: "Empat jenis promo dengan periode dan audiensnya sendiri. Ringkasan promo menunjukkan berapa kali dipakai, berapa biayanya, dan pendapatan yang dibawanya.",
    features: [
      {
        slug: "promo-dasar",
        name: "Promo dasar",
        icon: icons.promo,
        short: "Diskon persen atau nominal untuk semua transaksi.",
        tagline: "Diskon yang berlaku otomatis di kasir.",
        body: "Potongan persen atau nominal dengan periode, hari, dan jam berlaku. Kasir tidak perlu mengingat, promonya terpasang sendiri.",
        highlights: [
          "Periode, hari, dan jam berlaku",
          "Per outlet atau semua outlet",
          "Promo khusus karyawan",
        ],
        shots: [shots.promoSummary],
        scene: {
          src: promoScene,
          alt: "Laptop di meja kerja menampilkan ringkasan promo Qash, di samping buku dan kopi",
          screen: { left: 24.2, top: 21, width: 47.8, height: 47 },
        },
      },
      {
        slug: "promo-total",
        name: "Promo per total pembelian",
        icon: icons.promo,
        short: "Diskon saat belanja mencapai nominal tertentu.",
        tagline: "Dorong tamu menambah pesanan.",
        body: "Tetapkan batas minimum belanja dan potongannya. Saat keranjang mencapai batas itu, diskonnya terpasang di kasir dan di pesanan QR.",
        highlights: [
          "Batas minimum belanja",
          "Potongan persen atau nominal",
          "Berlaku di kasir dan pesanan online",
        ],
        shots: [shots.appliedChip],
      },
      {
        slug: "promo-produk",
        name: "Promo per produk",
        icon: icons.promo,
        short: "Diskon untuk produk atau kategori tertentu.",
        tagline: "Habiskan stok lewat promo, bukan lewat waste.",
        body: "Pilih produk atau kategori, tetapkan harga promo atau potongannya. Cocok untuk menu yang stoknya mendekati kedaluwarsa.",
        highlights: [
          "Per produk atau per kategori",
          "Harga promo atau potongan",
          "Terhubung ke laporan performa produk",
        ],
        shots: [],
      },
      {
        slug: "kode-promo",
        name: "Kode promo",
        icon: icons.promo,
        short: "Kode yang ditukar saat membayar.",
        tagline: "Kode untuk kampanye yang bisa dilacak.",
        body: "Buat kode dengan kuota, batas per pelanggan, dan periode. Tamu menyebutkan kodenya di kasir atau memasukkannya di pesanan online, dan setiap penukaran tercatat.",
        highlights: [
          "Kuota dan batas per pelanggan",
          "Riwayat penukaran",
          "Pendapatan per Rp1 diskon",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "pelayan-dapur",
    name: "Pelayan & dapur",
    icon: icons.waiter,
    short: "Ambil pesanan di meja, pantau yang aktif, siapkan di dapur.",
    tagline: "Kasir, pelayan, dan dapur bergerak bersama.",
    body: "Pelayan mencatat di samping meja, dapur melihatnya seketika, dan yang siap diantar terlihat di papan pelayan. Tidak ada yang perlu berteriak ke belakang.",
    features: [
      {
        slug: "pelayan",
        name: "Pelayan ambil pesanan",
        icon: icons.waiter,
        short: "Ambil pesanan di samping meja dari ponsel.",
        tagline: "Catat di samping meja, antar begitu siap.",
        body: "Pelayan memilih meja, menyusun pesanan dari ponselnya, dan mengirimnya ke dapur. Berjalan di browser ponsel, tanpa instal.",
        highlights: [
          "Berjalan di browser ponsel, tanpa instal",
          "Catatan per item untuk dapur",
          "Meja berubah status begitu pesanan terkirim",
        ],
        shots: [shots.waiterTakeOrder],
        scene: {
          src: waiterScene,
          alt: "Pelayan berdiri di pass dapur, mencatat pesanan meja T4 di aplikasi pelayan Qash dari ponselnya",
          screen: { left: 48, top: 34.4, width: 17.6, height: 38.9 },
        },
      },
      {
        slug: "pesanan-aktif",
        name: "Pesanan aktif",
        icon: icons.orders,
        short: "Siap diantar, sedang disiapkan, menunggu.",
        tagline:
          "Papan pelayan yang menunjukkan apa yang harus diantar sekarang.",
        body: "Papan pelayan memisahkan pesanan yang siap diantar, yang masih disiapkan, dan yang menunggu. Antar semua item yang siap dengan satu tombol.",
        highlights: [
          "Saring per stasiun atau jenis pesanan",
          "Antar semua yang siap sekaligus",
          "Item yang butuh perhatian ditandai",
        ],
        shots: [shots.activeOrders],
      },
      {
        slug: "layar-dapur",
        name: "Halaman persiapan dapur",
        icon: icons.kitchen,
        short: "Tiket per stasiun, tanpa kertas yang hilang.",
        tagline: "Tiket dapur yang tidak pernah hilang.",
        body: "Setiap pesanan tampil di stasiunnya: bar, dapur, atau stasiun lain yang Anda tentukan. Mulai siapkan, tandai siap, atau tarik kembali. Antrean bahan yang harus dibuat terlihat di baris atas.",
        highlights: [
          "Stasiun terpisah per kelompok produk",
          "Hitungan waktu per tiket dan penanda terlambat",
          "Bunyi saat pesanan baru masuk",
        ],
        shots: [shots.kdsBoard],
        scene: {
          src: kdsScene,
          alt: "Dapur restoran di jam sibuk: koki menata piring, tablet layar dapur Qash berdiri di meja pass",
          screen: { left: 45.9, top: 38.9, width: 38.7, height: 39.1 },
        },
      },
    ],
  },
  {
    slug: "kehadiran",
    name: "Kehadiran karyawan",
    icon: icons.attendance,
    short: "Rekap kehadiran, absensi dengan bukti, dan shift.",
    tagline: "Absen dari ponsel, dengan bukti.",
    body: "Staf absen dari ponselnya dengan lokasi atau selfie, shiftnya jelas, dan rekap bulanannya siap dipakai payroll.",
    features: [
      {
        slug: "rekap-kehadiran",
        name: "Ringkasan & detail kehadiran",
        icon: icons.reports,
        short: "Rekap bulanan per karyawan sampai detail per hari.",
        tagline: "Siapa terlambat, siapa lembur, terlihat per hari.",
        body: "Rekap bulanan per karyawan: hadir, terlambat, izin, dan jam kerja. Buka satu hari untuk melihat jam masuk, jam pulang, lokasi, dan istirahatnya.",
        highlights: [
          "Rekap bulanan per karyawan",
          "Detail jam masuk, pulang, dan istirahat",
          "Koreksi absen dengan persetujuan",
        ],
        shots: [shots.attendanceSummary, shots.attendanceDetail],
        scene: {
          src: attendanceScene,
          alt: "Laptop di meja kerja kafe menampilkan rekap kehadiran Qash, dengan logo Qash di dinding",
          screen: { left: 19.5, top: 23.5, width: 55, height: 49 },
        },
      },
      {
        slug: "absensi",
        name: "Absensi geotagging & selfie",
        icon: icons.attendance,
        short: "Wajibkan lokasi atau selfie saat absen.",
        tagline: "Absen hanya dari tempat dan orang yang benar.",
        body: "Clock-in dengan lokasi GPS dalam radius outlet, selfie wajah, atau keduanya, sesuai aturan tiap outlet. Toleransi terlambat dan pengajuan terlambat diatur per outlet.",
        highlights: [
          "Radius lokasi per outlet",
          "Selfie saat masuk dan pulang",
          "Pengajuan terlambat dengan alasan",
        ],
        shots: [],
      },
      {
        slug: "shift",
        name: "Shift karyawan",
        icon: icons.roster,
        short: "Jam kerja per shift dan penempatannya.",
        tagline: "Setiap orang tahu shiftnya.",
        body: "Tentukan shift pagi, siang, malam, atau jam khusus outlet Anda, lalu tempatkan karyawan. Absensi membaca shift itu untuk menghitung terlambat dan lembur.",
        highlights: [
          "Shift dengan jam dan toleransi",
          "Penempatan per karyawan",
          "Terhubung ke absensi dan lembur",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "hrm",
    name: "HRM",
    icon: icons.users,
    short: "Roster, cuti, tukar shift, data karyawan, dan payroll.",
    tagline: "Dari roster sampai slip gaji, satu alur.",
    body: "Semua yang ada di Kehadiran karyawan, ditambah roster mingguan, tukar shift, cuti dan libur, data karyawan per departemen, dan komponen payroll yang membaca semuanya.",
    features: [
      {
        slug: "roster",
        name: "Shift roster",
        icon: icons.roster,
        short: "Siapa kerja kapan, jelas seminggu ke depan.",
        tagline: "Siapa bekerja kapan, jelas seminggu ke depan.",
        body: "Susun roster mingguan per posisi atau departemen, salin dari minggu lalu, cek cakupan per hari, lalu terbitkan.",
        highlights: [
          "Cakupan per hari terlihat sebelum diterbitkan",
          "Salin minggu sebelumnya",
          "Kebutuhan orang per posisi per hari",
        ],
        shots: [shots.roster],
      },
      {
        slug: "dasbor-hrm",
        name: "Dasbor HRM",
        icon: icons.dashboard,
        short: "Kehadiran, cuti, dan lembur hari ini dalam satu layar.",
        tagline: "Kondisi tim hari ini, sekali lihat.",
        body: "Siapa yang hadir, yang terlambat, yang cuti, dan pengajuan yang menunggu persetujuan tampil di satu dashboard untuk manajer. Staf punya dashboardnya sendiri.",
        highlights: [
          "Pengajuan menunggu persetujuan",
          "Kehadiran hari ini per outlet",
          "Dashboard staf untuk absen dan pengajuan",
        ],
        shots: [],
      },
      {
        slug: "karyawan-departemen",
        name: "Daftar karyawan & departemen",
        icon: icons.users,
        short: "Profil, posisi, departemen, dan riwayat kerja.",
        tagline: "Data karyawan yang rapi sejak hari pertama.",
        body: "Profil kerja, posisi, departemen, pendidikan, dan pengalaman tersimpan per karyawan. Rekrutmen dan halaman karier mengalirkan pelamar ke daftar ini.",
        highlights: [
          "Departemen dan posisi",
          "Profil kerja dan riwayat",
          "Rekrutmen dan halaman karier",
        ],
        shots: [],
      },
      {
        slug: "tukar-shift",
        name: "Penggantian shift",
        icon: icons.transfer,
        short: "Staf mengajukan, manajer menyetujui.",
        tagline: "Tukar shift tanpa grup chat.",
        body: "Staf mengajukan tukar shift dengan rekannya dari dashboardnya. Manajer menyetujui, roster dan absensi ikut berubah.",
        highlights: [
          "Pengajuan dari ponsel staf",
          "Persetujuan manajer",
          "Roster diperbarui otomatis",
        ],
        shots: [],
      },
      {
        slug: "cuti",
        name: "Manajemen cuti & libur",
        icon: icons.calendar,
        short: "Jenis cuti, jatah, hari libur, dan pengajuannya.",
        tagline: "Jatah cuti yang menghitung dirinya sendiri.",
        body: "Tentukan jenis cuti dan jatahnya per kelompok karyawan, daftarkan hari libur nasional dan libur outlet. Staf mengajukan, admin menyetujui, saldo cuti berkurang sendiri.",
        highlights: [
          "Kebijakan jatah per kelompok",
          "Hari libur nasional dan outlet",
          "Saldo cuti per karyawan",
        ],
        shots: [],
      },
      {
        slug: "payroll",
        name: "Komponen payroll",
        icon: icons.payroll,
        short: "Tunjangan, potongan, kasbon, dan slip gaji PDF.",
        tagline: "Payroll yang membaca absensi, cuti, dan lembur.",
        body: "Komponen gaji dengan rumus Anda sendiri, ditugaskan per karyawan. Payroll bulanan menghitung tunjangan, potongan, lembur, dan cicilan kasbon, lalu mengeluarkan slip gaji PDF.",
        highlights: [
          "Rumus komponen sendiri",
          "Kasbon dipotong otomatis",
          "Slip gaji PDF per karyawan",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "keamanan",
    name: "PIN & keamanan",
    icon: icons.lock,
    short: "Hak akses per peran, PIN, dan log-nya.",
    tagline: "Setiap tindakan sensitif punya PIN dan jejaknya.",
    body: "Peran dan izin per karyawan, PIN untuk void, refund, dan diskon manual, serta log yang mencatat siapa memasukkan PIN untuk apa.",
    features: [
      {
        slug: "hak-akses",
        name: "Hak akses karyawan",
        icon: icons.users,
        short: "Peran dan izin per karyawan dan per outlet.",
        tagline: "Kasir melihat kasir, manajer melihat semuanya.",
        body: "Susun peran dengan izin yang Anda pilih, tugaskan per karyawan dan per outlet. Menu yang tidak diizinkan tidak muncul.",
        highlights: [
          "Peran dengan izin terperinci",
          "Akses per outlet",
          "Peran bawaan yang bisa diubah",
        ],
        shots: [],
      },
      {
        slug: "pin",
        name: "Pengaturan PIN",
        icon: icons.lock,
        short: "PIN manajer untuk void, refund, dan diskon.",
        tagline: "Void dan refund hanya dengan PIN manajer.",
        body: "Tentukan tindakan mana yang butuh PIN: void, refund, diskon manual, buka laci, atau ubah harga. Setiap karyawan punya PIN-nya sendiri.",
        highlights: [
          "Tindakan yang butuh PIN bisa dipilih",
          "PIN per karyawan",
          "PIN untuk buka laci kas",
        ],
        shots: [],
      },
      {
        slug: "log-pin",
        name: "Log PIN",
        icon: icons.reports,
        short: "Siapa memasukkan PIN, untuk apa, kapan.",
        tagline: "Jejak setiap PIN yang dipakai.",
        body: "Setiap penggunaan PIN tercatat: karyawan, tindakan, transaksi, waktu, dan hasilnya. Percobaan gagal ikut tercatat.",
        highlights: [
          "Log per karyawan dan per tindakan",
          "Percobaan gagal tercatat",
          "Terhubung ke transaksi terkait",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "pos",
    name: "Point of Sales",
    icon: icons.register,
    short: "Kasir, laporan penjualan, kas, reservasi, pelanggan, dan sesi.",
    tagline: "Layar kasir yang tetap cepat saat antrean panjang.",
    body: "Kasir digital di tablet atau PC, laporan penjualan per kasir, pergerakan kas laci, data pelanggan, dan lembar sesi yang menghitung selisih saat tutup.",
    features: [
      {
        slug: "kasir",
        name: "POS digital",
        icon: icons.register,
        short: "Layar kasir untuk jam sibuk, di tablet atau PC.",
        tagline: "Menu, keranjang, dan pembayaran dalam satu layar.",
        body: "Buka register, pilih makan di tempat, bawa pulang, ambil sendiri, atau drive-thru, lalu terima tunai, kartu, QRIS, transfer bank, atau EDC. Layar pelanggan dan papan nomor antrean berjalan di layar apa pun.",
        highlights: [
          "Struk dan tiket dapur ke printer thermal lewat stasiun cetak",
          "Layar pelanggan dan papan nomor antrean",
          "Pajak, PB1, dan biaya layanan dihitung otomatis",
        ],
        shots: [shots.posLaptop, shots.posMobile],
        scene: {
          src: posScene,
          alt: "Barista menunjukkan kasir Qash di tablet kepada tamu, rekannya memegang aplikasi pelayan di ponsel",
          screen: { left: 25.8, top: 59.5, width: 26.5, height: 28 },
          extra: {
            shot: shots.waiterTakeOrder,
            screen: { left: 86.8, top: 39, width: 6.3, height: 17 },
          },
        },
      },
      {
        slug: "laporan-kasir",
        name: "Laporan penjualan kasir",
        icon: icons.reports,
        short: "Penjualan per kasir, per register, per shift.",
        tagline: "Tahu kasir mana yang menjual apa.",
        body: "Penjualan kotor, diskon, penjualan bersih, dan metode pembayaran per kasir dan per register. Bandingkan dua periode, lihat per outlet atau semua outlet, ekspor CSV.",
        highlights: [
          "Per kasir dan per register",
          "Bandingkan dua periode",
          "Ekspor CSV untuk akuntan",
        ],
        shots: [shots.reportSales],
      },
      {
        slug: "kas",
        name: "Pergerakan kas",
        icon: icons.payroll,
        short: "Kas masuk dan keluar dari laci, dengan alasan.",
        tagline: "Laci kas yang selalu bisa dijelaskan.",
        body: "Catat kas masuk dan keluar di luar penjualan: setoran, pengambilan, dan pengeluaran kecil, dengan alasan. Lembar sesi membacanya saat menghitung selisih.",
        highlights: [
          "Kas masuk dan keluar dengan alasan",
          "Terhubung ke sesi register",
          "Riwayat per kasir",
        ],
        shots: [],
      },
      reservasi,
      {
        slug: "pelanggan",
        name: "Data pelanggan",
        icon: icons.users,
        short: "Nama, kontak, dan riwayat pesanan pelanggan.",
        tagline: "Kenali tamu yang kembali.",
        body: "Simpan nama dan kontak pelanggan dari kasir atau pesanan online, lihat riwayat pesanannya, dan pakai untuk promo yang ditujukan ke pelanggan tertentu.",
        highlights: [
          "Riwayat pesanan per pelanggan",
          "Diminta otomatis untuk bawa pulang",
          "Audiens promo",
        ],
        shots: [],
      },
      {
        slug: "sesi-kasir",
        name: "Detail sesi kasir",
        icon: icons.register,
        short: "Kas awal, penjualan, kas seharusnya, dan selisih.",
        tagline: "Tutup kasir dalam satu lembar.",
        body: "Buka sesi dengan kas awal, dan saat tutup lembar sesi menghitung penjualan tunai, kas yang seharusnya ada di laci, dan selisihnya. Semua per kasir dan per register.",
        highlights: [
          "Kas awal dan kas akhir",
          "Selisih terhitung otomatis",
          "Riwayat sesi per register",
        ],
        shots: [shots.posSession],
      },
    ],
  },
  {
    slug: "back-office",
    name: "Back office",
    icon: icons.dashboard,
    short: "Dashboard, multi-outlet, dan manajemen karyawan.",
    tagline: "Angka yang pemilik butuhkan, tanpa membuka Excel.",
    body: "Dashboard untuk operasional harian dan untuk pemilik, beberapa outlet dalam satu akun, dan pengelolaan karyawan per outlet.",
    features: [
      {
        slug: "dasbor",
        name: "Dashboard back office",
        icon: icons.dashboard,
        short: "Penjualan, pesanan, dan stok hari ini.",
        tagline: "Operasional hari ini dalam satu layar.",
        body: "Penjualan hari ini, pesanan aktif, stok yang menipis, dan pengajuan yang menunggu tampil di satu dashboard untuk manajer outlet.",
        highlights: [
          "Penjualan dan pesanan hari ini",
          "Peringatan stok",
          "Pengajuan menunggu",
        ],
        shots: [],
      },
      {
        slug: "dasbor-pemilik",
        name: "Dashboard pemilik bisnis",
        icon: icons.reports,
        short: "Semua outlet, tren, dan margin dalam satu tampilan.",
        tagline: "Tampilan pemilik: semua cabang, satu angka.",
        body: "Penjualan, laba kotor, dan tren semua outlet berdampingan. Bandingkan cabang dan periode tanpa membuka laporan satu per satu.",
        highlights: [
          "Semua outlet berdampingan",
          "Tren dan perbandingan periode",
          "Laba kotor dan margin",
        ],
        shots: [],
      },
      {
        slug: "multi-outlet",
        name: "Manajemen multi-outlet",
        icon: icons.outlets,
        short: "Beberapa cabang, satu akun, pengaturan per outlet.",
        tagline: "Beberapa cabang, satu dashboard.",
        body: "Tambah outlet dalam akun yang sama. Menu, pajak, jam operasional, pembayaran, dan modul aktif diatur per outlet; laporan bisa per outlet atau gabungan.",
        highlights: [
          "Pengaturan per outlet",
          "Laporan per outlet atau gabungan",
          "Transfer stok antar outlet",
        ],
        shots: [],
      },
      {
        slug: "manajemen-karyawan",
        name: "Manajemen karyawan",
        icon: icons.users,
        short: "Akun, peran, dan outlet tiap karyawan.",
        tagline: "Satu akun per orang, akses sesuai perannya.",
        body: "Buat akun karyawan, tentukan peran dan outlet tempatnya bekerja, dan nonaktifkan saat keluar. Data HR-nya tersambung ke HRM.",
        highlights: [
          "Akun per karyawan",
          "Peran dan outlet per akun",
          "Terhubung ke HRM dan payroll",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "bill-pembayaran",
    name: "Bill & pembayaran",
    icon: icons.bill,
    short: "Open bill, split bill, dan split payment.",
    tagline: "Tagihan yang mengikuti cara tamu makan.",
    body: "Buka tagihan dan tambahkan pesanan sepanjang tamu duduk, bagi tagihannya per orang, dan terima pembayaran dengan lebih dari satu cara.",
    features: [
      {
        slug: "open-bill",
        name: "Open bill / close bill",
        icon: icons.bill,
        short: "Tagihan terbuka selama tamu masih duduk.",
        tagline: "Pesan dulu, bayar saat selesai.",
        body: "Buka tagihan saat tamu duduk, tambahkan pesanan dari pelayan atau QR sepanjang mereka makan, lalu tutup saat mereka minta bill. Mejanya lepas begitu tagihan tertutup.",
        highlights: [
          "Tambah pesanan ke tagihan yang sama",
          "Status meja mengikuti tagihan",
          "Tutup dari kasir atau ponsel pelayan",
        ],
        shots: [],
      },
      {
        slug: "split-bill",
        name: "Split bill",
        icon: icons.split,
        short: "Bagi tagihan per item atau rata.",
        tagline: "Satu meja, beberapa tagihan.",
        body: "Bagi tagihan per item atau rata per orang. Setiap bagian punya struknya sendiri, dan pajak serta biaya layanan ikut terbagi.",
        highlights: [
          "Per item atau rata",
          "Struk per bagian",
          "Pajak dan biaya layanan ikut terbagi",
        ],
        shots: [],
      },
      {
        slug: "split-payment",
        name: "Split payment",
        icon: icons.payroll,
        short: "Satu tagihan, beberapa metode bayar.",
        tagline: "Sebagian tunai, sisanya QRIS.",
        body: "Terima satu tagihan dengan lebih dari satu metode: sebagian tunai, sisanya kartu atau QRIS. Semua tercatat di laporan metode pembayaran.",
        highlights: [
          "Kombinasi metode bebas",
          "Sisa tagihan terhitung",
          "Masuk laporan per metode",
        ],
        shots: [],
      },
    ],
  },
  {
    slug: "design-studio",
    name: "Design Studio",
    icon: icons.studio,
    short: "Website brand dan halaman pesan online, tanpa developer.",
    tagline: "Website brand Anda, jadi tanpa developer.",
    body: "Susun landing page brand Anda dari editor dengan pratinjau langsung, dan halaman pesan online memakai menu yang sama dengan kasir.",
    features: [
      {
        slug: "design-studio",
        name: "Landing page",
        icon: icons.studio,
        short: "Website brand Anda, tanpa developer.",
        tagline: "Pilih tampilan, atur bagian, terbitkan.",
        body: "Pilih tampilan, lalu atur header, hero, menu, galeri, kontak, dan footer dengan pratinjau langsung untuk laptop dan ponsel. Halaman acara dan karier ikut tersedia.",
        highlights: [
          "Preset tampilan: font, warna, dan tombol dalam satu klik",
          "Pratinjau ponsel saat mengedit",
          "Halaman karier terhubung ke rekrutmen di HRM",
        ],
        shots: [shots.studioEditor, shots.studioTheme],
        scene: {
          src: studioScene,
          alt: "Pemilik kafe mengedit hero website brandnya di Design Studio Qash dari laptop, di meja kafenya sendiri",
          screen: { left: 38.3, top: 30.3, width: 45, height: 43.1 },
        },
      },
      {
        slug: "pesan-online",
        name: "Pesan online",
        icon: icons.qr,
        short: "Menu, keranjang, dan status pesanan di ponsel tamu.",
        tagline: "Tamu pesan sendiri, dari tautan atau QR.",
        body: "Tamu membuka tautan pemesanan dari website brand atau memindai QR, menyusun pesanan, lalu membayar di kasir atau secara online saat pembayaran digital aktif. Pesanannya masuk ke daftar yang sama dengan pesanan kasir.",
        highlights: [
          "Tanpa aplikasi tambahan, tanpa membuat akun",
          "Status pesanan bisa dipantau dari ponsel",
          "Nama pelanggan diminta untuk bawa pulang dan ambil sendiri",
        ],
        shots: [shots.orderingDesktop, shots.orderingMobile],
      },
    ],
  },
];

/** Groups whose page opens on a photo scene: the feature named here lends its photo and vignette to the hero, which
 *  carries the group's own copy (src/pages/fitur/[slug].astro). The others open on the cream hero with their screens. */
export const suiteHeroes: Record<string, string> = {
  pesanan: "reservasi",
  inventaris: "analitik-stok",
  promo: "promo-dasar",
  "pelayan-dapur": "pelayan",
  kehadiran: "rekap-kehadiran",
  pos: "kasir",
  "design-studio": "design-studio",
};

export interface BusinessType {
  slug: string;
  name: string;
  icon: string;
  short: string;
}

// Every type links to the same page, /jenis-usaha#<slug>.
export const businessTypes: BusinessType[] = [
  {
    slug: "kedai-kopi",
    name: "Kedai kopi & warung",
    icon: icons.coffee,
    short: "Pesan di kasir, ambil di counter.",
  },
  {
    slug: "kafe-bakery",
    name: "Kafe & bakery",
    icon: icons.bakery,
    short: "Meja, QR, dan produksi harian.",
  },
  {
    slug: "restoran",
    name: "Restoran & rumah makan",
    icon: icons.restaurant,
    short: "Pelayan, meja, dapur, reservasi.",
  },
  {
    slug: "bar-lounge",
    name: "Bar & lounge",
    icon: icons.bar,
    short: "Stasiun bar dan jam lewat tengah malam.",
  },
  {
    slug: "food-court",
    name: "Food court & kios",
    icon: icons.foodcourt,
    short: "Antrean cepat dan papan nomor.",
  },
  {
    slug: "ritel",
    name: "Toko & ritel di kafe",
    icon: icons.retail,
    short: "Merchandise di kasir yang sama.",
  },
  {
    slug: "multi-outlet",
    name: "Jaringan multi-outlet",
    icon: icons.outlets,
    short: "Beberapa cabang, satu dashboard.",
  },
];

export interface VibePhoto {
  src: ImageMetadata;
  alt: string;
  /** object-position that keeps the subject in frame. The bar-evening file itself is cropped below the guests' faces. */
  position: string;
}

// Brand photography from the Qash brand guidelines (F3 Visual Amplification), one meaning each.
export const photos = {
  driveThru: {
    src: driveThru,
    alt: "Tas kertas oranye bertuliskan Qash diserahkan ke jendela mobil oranye",
    position: "58% 34%",
  },
  book: {
    src: qashBook,
    alt: "Buku oranye bersampul logo Qash di atas meja kecil berkeramik",
    position: "50% 58%",
  },
  phoneFabric: {
    src: phoneFabric,
    alt: "Ponsel dengan layar pembuka Qash di atas kain kanvas hijau",
    position: "50% 50%",
  },
  bar: {
    src: barEvening,
    alt: "Gelas koktail, sampanye, dan wiski di meja kayu sebuah bar di malam hari",
    position: "50% 45%",
  },
  appScreens: { src: appScreens, alt: "", position: "50% 50%" },
  coffee: {
    src: coffeeOrder,
    alt: "Tangan memegang dua kopi bawa pulang dan ponsel dengan aplikasi Qash",
    position: "50% 55%",
  },
} satisfies Record<string, VibePhoto>;

// The brand photo behind a group page's hero when the group has no scene photo (suiteHeroes), and behind each
// business type that has one.
export const suitePhotos: Record<string, VibePhoto> = {
  hrm: photos.phoneFabric,
  keamanan: photos.phoneFabric,
  "back-office": photos.book,
  "bill-pembayaran": photos.driveThru,
};
export const typePhotos: Record<string, VibePhoto> = {
  "kedai-kopi": photos.coffee,
  restoran: photos.driveThru,
  "bar-lounge": photos.bar,
};
