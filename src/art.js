// Collage artwork. Only rectangles, circles, diamonds, stars and hearts: no ovals anywhere.
const star = (x, y, s = 1, f = "#fff6e5") =>
  `<use href="#star" x="${x}" y="${y}" width="${10 * s}" height="${10 * s}" fill="${f}"/>`;
const svg = (body, fit = "slice") =>
  `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid ${fit}" aria-hidden="true">${body}</svg>`;

const petals = [0, 45, 90, 135, 180, 225, 270, 315]
  .map(
    (a, i) =>
      `<path d="M50 50L59 28L50 8L41 28Z" fill="${i % 2 ? "#ffb300" : "#ffd34d"}" transform="rotate(${a} 50 50)"/>`
  )
  .join("");

const lantern = (x, y) =>
  `<rect x="${x}" y="${y}" width="6" height="8" fill="#ffd34d"/><rect x="${x - 1}" y="${y - 2}" width="8" height="2.4" fill="#ff8fc4"/>`;

const hearts = [];
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 4; c++)
    hearts.push(
      `<use href="#heart" x="${6 + c * 24 + (r % 2) * 10}" y="${4 + r * 24}" width="16" height="16" fill="${(r + c) % 2 ? "#fff6e5" : "#ffd34d"}"/>`
    );

export const art = {
  moon: svg(
    `<rect width="100" height="100" fill="#171233"/>
     <circle cx="48" cy="52" r="32" fill="#fff1c2"/>
     <circle cx="62" cy="44" r="29" fill="#171233"/>
     ${star(10, 12, 1.4, "#ffd34d")}${star(76, 10, 1, "#ff8fc4")}${star(78, 78, 1.6, "#fff6e5")}${star(12, 80, 1, "#b69cff")}${star(70, 54, 0.8, "#ffd34d")}`,
    "meet"
  ),
  flower: svg(
    `<rect width="100" height="100" fill="#1d0f2e"/>${petals}
     <circle cx="50" cy="50" r="9" fill="#fff3b0"/><circle cx="50" cy="50" r="4" fill="#ff8fc4"/>
     ${star(6, 8, 1.2, "#ff8fc4")}${star(80, 74, 1.4, "#ffd34d")}${star(80, 6, 0.8, "#fff6e5")}`,
    "meet"
  ),
  pizza: svg(
    `<rect width="100" height="100" fill="#2a0f1c"/>
     <path d="M14 26L86 26L50 92Z" fill="#ffc857" stroke="#d9822b" stroke-width="3" stroke-linejoin="round"/>
     <rect x="10" y="14" width="80" height="12" rx="5" fill="#d9822b"/>
     <circle cx="36" cy="40" r="6" fill="#e63946"/><circle cx="62" cy="42" r="6" fill="#e63946"/><circle cx="49" cy="62" r="6" fill="#e63946"/>
     <path d="M47 36l3 3-3 3-3-3z" fill="#3fa34d"/><path d="M52 50l3 3-3 3-3-3z" fill="#3fa34d"/><path d="M40 52l2 2-2 2-2-2z" fill="#3fa34d"/>
     ${star(4, 40, 1, "#ffd34d")}${star(84, 60, 1.2, "#ff8fc4")}`,
    "meet"
  ),
  black: svg(
    `<rect width="100" height="100" fill="#000"/>
     ${star(8, 10, 1.6)}${star(60, 6, 1, "#ff8fc4")}${star(84, 26, 1.8, "#ffd34d")}${star(30, 44, 0.8, "#b69cff")}
     ${star(70, 62, 1.2)}${star(12, 70, 2)}${star(48, 80, 1, "#7fd8ff")}${star(88, 86, 0.8, "#ff8fc4")}${star(40, 20, 0.7)}
     ${star(6, 34, 1, "#ffd34d")}${star(22, 56, 1.3)}${star(44, 36, 0.9, "#ff8fc4")}${star(58, 58, 1.1, "#7fd8ff")}${star(76, 38, 1, "#b69cff")}${star(92, 54, 1.2)}${star(34, 64, 0.8, "#ffd34d")}${star(66, 32, 0.8)}`
  ),
  tangled: svg(
    `<rect width="100" height="100" fill="#1a1040"/>
     <circle cx="20" cy="20" r="9" fill="#fff1c2"/>
     <rect x="42" y="44" width="18" height="50" fill="#7a5aa6"/>
     <path d="M38 46L51 20L64 46Z" fill="#ff6fae"/>
     <rect x="47" y="54" width="8" height="10" fill="#ffd34d"/>
     <path d="M51 64C72 70 34 78 56 86S40 96 52 100" fill="none" stroke="#ffd34d" stroke-width="3"/>
     ${lantern(14, 50)}${lantern(76, 36)}${lantern(84, 62)}${lantern(24, 72)}${lantern(70, 14)}${lantern(8, 30)}
     ${star(40, 6, 1, "#fff6e5")}${star(86, 8, 0.8, "#ffd34d")}${star(66, 76, 0.9, "#ff8fc4")}
     <rect y="94" width="100" height="6" fill="#0b0620"/>`
  ),
  hearts: svg(`<rect width="100" height="100" fill="#ff6fae"/>${hearts.join("")}`),
  cake: `<svg viewBox="0 0 100 100" aria-hidden="true">
     <rect x="14" y="56" width="72" height="34" fill="#ff8fc4"/><rect x="14" y="56" width="72" height="9" fill="#fff6e5"/>
     <rect x="22" y="40" width="56" height="16" fill="#ffd34d"/><rect x="22" y="40" width="56" height="6" fill="#fff6e5"/>
     <rect x="30" y="26" width="5" height="14" fill="#7fd8ff"/><rect x="47" y="26" width="5" height="14" fill="#b69cff"/><rect x="64" y="26" width="5" height="14" fill="#7fd8ff"/>
     <path d="M32.5 12L36 19L32.5 24L29 19Z" fill="#ff6a3d"/><path d="M49.5 12L53 19L49.5 24L46 19Z" fill="#ff6a3d"/><path d="M66.5 12L70 19L66.5 24L63 19Z" fill="#ff6a3d"/>
     <rect x="8" y="90" width="84" height="6" fill="#fff6e5"/></svg>`,
};
