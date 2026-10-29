// Illustrated, full-colour trust icons (64×64). Used in the trust strip,
// product page and cart. Gradient ids are namespaced per icon.
const svg = (id, body, cls) =>
  `<svg class="${cls}" viewBox="0 0 64 64" fill="none" aria-hidden="true"><defs>${body[0]}</defs><ellipse cx="32" cy="58" rx="20" ry="3" fill="#0b0c0f" opacity=".08"/>${body[1]}</svg>`;

const ICONS = {
  // red delivery van with "FREE" on the cargo box
  delivery: (id) => [
    `<linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef2b40"/><stop offset="1" stop-color="#a90012"/></linearGradient>
     <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d45"/><stop offset="1" stop-color="#0b0c0f"/></linearGradient>`,
    `<path d="M3 26h7M1 32h9M5 38h5" stroke="#c80015" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>
     <rect x="11" y="16" width="31" height="28" rx="4" fill="url(#${id}a)"/>
     <rect x="11" y="16" width="31" height="7" rx="4" fill="#fff" opacity=".14"/>
     <text x="26.5" y="35" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="800" fill="#fff" letter-spacing=".4">FREE</text>
     <path d="M42 24h8.6a3 3 0 0 1 2.5 1.3l5 7.2a3 3 0 0 1 .5 1.7V41a3 3 0 0 1-3 3H42z" fill="url(#${id}b)"/>
     <path d="M45 27h5.4l3.8 5.6H45z" fill="#9fd3ff"/>
     <rect x="9" y="43" width="51" height="4" rx="2" fill="#23252b"/>
     <circle cx="21" cy="48" r="5.6" fill="#0b0c0f"/><circle cx="21" cy="48" r="2.3" fill="#d5d7dc"/>
     <circle cx="50" cy="48" r="5.6" fill="#0b0c0f"/><circle cx="50" cy="48" r="2.3" fill="#d5d7dc"/>`,
  ],
  // green shield with tick and "1 YR" ribbon
  warranty: (id) => [
    `<linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34c26b"/><stop offset="1" stop-color="#0b7a3e"/></linearGradient>
     <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef2b40"/><stop offset="1" stop-color="#a90012"/></linearGradient>`,
    `<path d="M32 5 52 12v15c0 13-8.4 22.6-20 27-11.6-4.4-20-14-20-27V12z" fill="url(#${id}a)"/>
     <path d="M32 5 52 12v15c0 2-.2 3.9-.6 5.7L32 9.6z" fill="#fff" opacity=".18"/>
     <path d="m23 29 6.2 6.2L41.5 23" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M17 44h30l-3 4.5 3 4.5H17l3-4.5z" fill="url(#${id}b)"/>
     <text x="32" y="51.4" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="6.6" font-weight="800" fill="#fff" letter-spacing=".5">1 YR SG</text>`,
  ],
  // kraft parcel with a return arrow badge
  returns: (id) => [
    `<linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6b57c"/><stop offset="1" stop-color="#bf8448"/></linearGradient>
     <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d45"/><stop offset="1" stop-color="#0b0c0f"/></linearGradient>`,
    `<path d="M8 20 28 12l20 8v24l-20 8-20-8z" fill="url(#${id}a)"/>
     <path d="M8 20 28 28l20-8-20-8z" fill="#f1cc9c"/>
     <path d="M28 28v24l-20-8V20z" fill="#000" opacity=".08"/>
     <path d="m15 17 20 8.2v7" stroke="#f7e1c2" stroke-width="4" opacity=".9"/>
     <circle cx="45" cy="42" r="12" fill="url(#${id}b)"/>
     <path d="M40.5 39.5a5.6 5.6 0 1 1 .2 6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
     <path d="m38.2 36.2.9 4.4 4.4-1" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  ],
  // dark card with gold chip + green padlock
  secure: (id) => [
    `<linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3d45"/><stop offset="1" stop-color="#0b0c0f"/></linearGradient>
     <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#d79a1e"/></linearGradient>
     <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34c26b"/><stop offset="1" stop-color="#0b7a3e"/></linearGradient>`,
    `<rect x="4" y="14" width="42" height="28" rx="5" fill="url(#${id}a)" transform="rotate(-8 25 28)"/>
     <rect x="4" y="20" width="42" height="5" fill="#c80015" transform="rotate(-8 25 28)" opacity=".9"/>
     <rect x="10" y="29" width="9" height="7" rx="1.6" fill="url(#${id}b)" transform="rotate(-8 25 28)"/>
     <path d="M37 33v-4.5a7 7 0 0 1 14 0V33" stroke="#9a9ea7" stroke-width="3.6"/>
     <rect x="32" y="32" width="24" height="19" rx="4.5" fill="url(#${id}c)"/>
     <rect x="32" y="32" width="24" height="6" rx="4.5" fill="#fff" opacity=".18"/>
     <circle cx="44" cy="40.5" r="2.6" fill="#fff"/><path d="M44 42v4" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`,
  ],
  // gold rosette with "100%" for genuine products
  genuine: (id) => [
    `<linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#d48b12"/></linearGradient>
     <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef2b40"/><stop offset="1" stop-color="#a90012"/></linearGradient>`,
    `<path d="m22 36-6 18 7-3 4 6 5-17zM42 36l6 18-7-3-4 6-5-17z" fill="url(#${id}b)"/>
     <path d="m32 4 4.6 3.4 5.7-.3 1.9 5.4 4.9 2.9-1 5.6 2.6 5.1-3.9 4.2-.3 5.7-5.4 1.8-3.2 4.7-5.6-1.2-5.2 2.4-3.9-4.2-5.7-.8-1-5.6-4.3-3.8 2.2-5.3-.6-5.7 5-2.7 2.2-5.3 5.7.1z" fill="url(#${id}a)"/>
     <circle cx="32" cy="24" r="12.5" fill="#fff" opacity=".22"/>
     <text x="32" y="27.6" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="800" fill="#7a4a00">100%</text>`,
  ],
};

let n = 0;
export const trustIcon = (name, cls = 'size-12') => {
  const id = `ti${name[0]}${n++}`;
  return svg(id, ICONS[name](id), cls);
};
