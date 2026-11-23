'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react';

// posisi sprite mata dalam persen dari gambar utama
const EYES = [
  { src: '/maskot/tamuku-mata-l.png', left: 27.31, top: 43.61, w: 16.3, h: 12.59 },
  { src: '/maskot/tamuku-mata-r.png', left: 56.79, top: 43.61, w: 16.3, h: 12.59 },
];

const css = `
.tm-bob{animation:tm-bob 3.2s ease-in-out infinite}
.tm-blink{animation:tm-blink 5s infinite;transform-origin:50% 55%}
.tm-bubble{position:absolute;top:1%;right:-4%;background:#fff;color:#27408b;font-weight:600;
  font-size:14px;padding:8px 12px;border-radius:16px 16px 16px 4px;box-shadow:0 4px 14px rgba(39,64,139,.18)}
@keyframes tm-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes tm-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@media (prefers-reduced-motion:reduce){.tm-bob,.tm-blink{animation:none}}
`;

export default function Mascot({ size = 300 }: { size?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const eyes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.45;
      // arah kursor, -1 sampai 1 (jarak setengah layar = maksimum)
      const dx = clamp((e.clientX - cx) / (window.innerWidth / 2.5));
      const dy = clamp((e.clientY - cy) / (window.innerHeight / 2.5));

      el.style.transform = `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 9}deg)`;
      const w = r.width;
      eyes.current.forEach((n) => {
        if (n) n.style.transform = `translate(${dx * 0.015 * w}px, ${dy * 0.0095 * w}px)`;
      });
    };

    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div className="tm-bob" style={{ width: size, position: 'relative' }}>
      <style>{css}</style>
      <div ref={wrap} style={{ position: 'relative', width: '100%', transition: 'transform .15s ease-out' }}>
        <img
          src="/maskot/tamuku-base.png"
          alt="Maskot Tamuku"
          draggable={false}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        {EYES.map((e, i) => (
          <div
            key={e.src}
            ref={(n) => {
              eyes.current[i] = n;
            }}
            style={{
              position: 'absolute',
              left: `${e.left}%`,
              top: `${e.top}%`,
              width: `${e.w}%`,
              height: `${e.h}%`,
              pointerEvents: 'none',
              transition: 'transform .1s ease-out',
            }}
          >
            <img
              className="tm-blink"
              src={e.src}
              alt=""
              draggable={false}
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          </div>
        ))}
        <div className="tm-bubble">Selamat datang!</div>
      </div>
    </div>
  );
}
