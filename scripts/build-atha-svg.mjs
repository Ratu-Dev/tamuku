// Membuat assets/atha.svg dari gambar maskot asli (tamuku-base.png dan dua mata).
// Jalankan dari folder utama proyek:  node scripts/build-atha-svg.mjs
// Gambar disisipkan sebagai base64 karena GitHub tidak memuat gambar eksternal dari dalam SVG.
import fs from 'node:fs';

const DIR = 'public/maskot';
const OUT = 'assets/atha.svg';

// posisi mata dalam persen dari gambar utama (sama dengan components/Mascot.tsx)
const EYES = [
  { file: 'tamuku-mata-l.png', left: 27.31, top: 43.61, w: 16.3, h: 12.59 },
  { file: 'tamuku-mata-r.png', left: 56.79, top: 43.61, w: 16.3, h: 12.59 },
];

// area tangan yang terangkat (lengan bawah dan kepalan), dalam piksel pada gambar 640 x 953.
// Jika gambar maskot diganti, sesuaikan poligon dan titik engsel (pergelangan) ini.
const HAND = {
  ref: [640, 953],
  poly: [[28,545],[62,512],[95,497],[124,500],[147,536],[153,575],[153,640],[125,668],[80,640],[40,600]],
  pivot: [150, 600],
};

// teks balon sapaan: tiap pesan maksimal dua baris, bergantian setiap SECONDS detik
const MESSAGES = [
  ['Halo, aku Atha!'],
  ['Asisten Tata Hajat Andalan,', 'siap membantu kalian.'],
  ['Jadi, ada acara apa yang', 'mau kita susun?'],
];
const SECONDS = 4; // lama tiap pesan tampil
const FADE = 0.4; // lama memudar masuk dan keluar

const read = (f) => fs.readFileSync(`${DIR}/${f}`);
const b64 = (b) => b.toString('base64');
const base = read('tamuku-base.png');
const W = base.readUInt32BE(16); // lebar dan tinggi PNG ada di header
const H = base.readUInt32BE(20);
const sx = W / HAND.ref[0], sy = H / HAND.ref[1];
const handPoints = HAND.poly.map(([x, y]) => `${(x * sx).toFixed(1)},${(y * sy).toFixed(1)}`).join(' ');
const [px, py] = [(HAND.pivot[0] * sx).toFixed(1), (HAND.pivot[1] * sy).toFixed(1)];
const fs_ = Math.round(W * 0.045); // ukuran huruf balon
const lh = Math.round(fs_ * 1.25); // jarak antarbaris
const bw = Math.round(W * 0.8), bh = lh * 2 + Math.round(fs_ * 0.9);
const TOP = bh + Math.round(bh * 0.5); // ruang di atas untuk balon sapaan dan ekornya

const eyes = EYES.map((e) => {
  const buf = read(e.file);
  const x = (e.left / 100) * W, y = (e.top / 100) * H;
  const w = (e.w / 100) * W, h = (e.h / 100) * H;
  return `<g class="look"><image class="blink" href="data:image/png;base64,${b64(buf)}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/></g>`;
}).join('\n    ');

const d = Math.round(W * 0.012);
const total = MESSAGES.length * SECONDS;
const pc = (t) => ((t / total) * 100).toFixed(2);
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bx = W - bw - Math.round(W * 0.04), by = -TOP + 6; // jarak kanan agar tidak terpotong saat berdenyut
const cx = bx + bw / 2;
const texts = MESSAGES.map((lines, i) => {
  const single = lines.length === 1;
  const size = single ? Math.round(fs_ * 1.2) : fs_;
  const first = by + bh / 2 - ((lines.length - 1) * lh) / 2 + size * 0.35;
  const tspans = lines.map((l, j) => `<text x="${cx}" y="${(first + j * lh).toFixed(1)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="700" fill="#27408B">${esc(l)}</text>`).join('');
  return `<g class="msg m${i}">${tspans}</g>`;
}).join('\n      ');
const msgCss = MESSAGES.map((_, i) => `.m${i}{animation-delay:${i * SECONDS}s}`).join('');
const t1 = bx + bw * 0.1, t2 = bx + bw * 0.3, tx = bx + bw * 0.04, ty = by + bh + bh * 0.4;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 ${-TOP} ${W} ${H + TOP}" role="img" aria-labelledby="atha-t">
  <title id="atha-t">Atha, maskot Tamuku</title>
  <style>
    .bob{animation:bob 3.2s ease-in-out infinite}
    .blink{animation:blink 5s infinite;transform-box:fill-box;transform-origin:50% 55%}
    .look{animation:look 7s ease-in-out infinite}
    .wave{animation:wave 3.2s ease-in-out infinite}
    .bubble{animation:pop 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 100%}
    @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(H * 0.02)}px)}}
    @keyframes blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
    @keyframes look{0%,15%,100%{transform:translate(0,0)}30%,45%{transform:translate(${d}px,${Math.round(d / 3)}px)}60%,75%{transform:translate(-${d}px,0)}}
    @keyframes wave{0%,60%,100%{transform:rotate(0deg)}10%,30%,50%{transform:rotate(5deg)}20%,40%{transform:rotate(-3deg)}}
    .msg{opacity:0;animation:msg ${total}s linear infinite}
    ${msgCss}
    @keyframes msg{0%{opacity:0}${pc(FADE)}%,${pc(SECONDS - FADE)}%{opacity:1}${pc(SECONDS)}%,100%{opacity:0}}
    @keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    @media (prefers-reduced-motion:reduce){.bob,.blink,.look,.wave,.bubble,.msg{animation:none}.m0{opacity:1}}
  </style>
  <defs>
    <image id="base" href="data:image/png;base64,${b64(base)}" x="0" y="0" width="${W}" height="${H}"/>
    <clipPath id="hand"><polygon points="${handPoints}"/></clipPath>
  </defs>
  <g class="bob">
    <use href="#base" xlink:href="#base"/>
    <g transform="translate(${px} ${py})"><g class="wave"><g transform="translate(-${px} -${py})" clip-path="url(#hand)"><use href="#base" xlink:href="#base"/></g></g></g>
    ${eyes}
    <g class="bubble">
      <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${Math.round(bh / 3)}" fill="#fff" stroke="#C9D3FF" stroke-width="2"/>
      <path d="M${t1} ${by + bh} L${tx} ${ty} L${t2} ${by + bh}" fill="#fff" stroke="#C9D3FF" stroke-width="2" stroke-linejoin="round"/>
      <rect x="${t1 + 1}" y="${by + bh - 3}" width="${t2 - t1 - 2}" height="5" fill="#fff"/>
      ${texts}
    </g>
  </g>
</svg>
`;

fs.mkdirSync('assets', { recursive: true });
fs.writeFileSync(OUT, svg);
const kb = Math.round(Buffer.byteLength(svg) / 1024);
console.log(`Selesai: ${OUT} (${kb} KB)`);
if (kb > 1500) console.warn('File besar. Kecilkan PNG maskot dulu (misalnya lewat squoosh.app) supaya README cepat dimuat.');
