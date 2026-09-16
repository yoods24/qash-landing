// Deployment-dependent links. The WhatsApp number is the sales line; override either value in .env.
export const waNumber: string = import.meta.env.PUBLIC_WHATSAPP_NUMBER || '628211963355';
// A WhatsApp link with a pre-filled opening message; pages pass their own context so the chat starts on topic.
export const wa = (text: string): string => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export const appUrl: string = import.meta.env.PUBLIC_APP_URL || '#';
export const waUrl: string = wa('Halo Qash, saya ingin menjadwalkan demo untuk usaha saya.');
export const waSalesUrl: string = wa('Halo Qash, saya ingin bertanya tentang Qash.');
export const waDisplay: string = `+${waNumber.slice(0, 2)} ${waNumber.slice(2, 5)}-${waNumber.slice(5, 9)}-${waNumber.slice(9)}`;
