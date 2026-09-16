// Which component tells each feature's photo scene (src/features.ts `scene`), with the props that component takes
// beyond the feature itself. Used by the group pages (src/pages/fitur/[slug].astro) and the home page carousel.
import KitchenScene from './KitchenScene.astro';
import WaiterScene from './WaiterScene.astro';
import TablesScene from './TablesScene.astro';
import StudioScene from './StudioScene.astro';
import ReservationScene from './ReservationScene.astro';
import PosScene from './PosScene.astro';
import PhotoScene from './PhotoScene.astro';

export const scenes: Record<string, { Scene: typeof PhotoScene; props?: Record<string, unknown> }> = {
  'layar-dapur': { Scene: KitchenScene },
  pelayan: { Scene: WaiterScene },
  'denah-meja': { Scene: TablesScene },
  'design-studio': { Scene: StudioScene },
  reservasi: { Scene: ReservationScene },
  kasir: { Scene: PosScene },
  'analitik-stok': { Scene: PhotoScene, props: { label: 'Buka analitik inventaris' } },
  'rekap-kehadiran': { Scene: PhotoScene, props: { label: 'Buka rekap kehadiran' } },
  'promo-dasar': { Scene: PhotoScene, props: { label: 'Buka ringkasan promo' } },
};
