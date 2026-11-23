'use client';

import { useEffect, useRef } from 'react';

const css = `
.tm{--dx:0;--dy:0;display:inline-block;position:relative;
  transform:perspective(700px) rotateY(calc(var(--dx)*12deg)) rotateX(calc(var(--dy)*-9deg));
  transition:transform .15s ease-out}
.tm svg{display:block;animation:tm-bob 3.2s ease-in-out infinite}
.tm-head{transform-origin:100px 150px;
  transform:translate(calc(var(--dx)*5px),calc(var(--dy)*3px)) rotate(calc(var(--dx)*3deg));
  transition:transform .12s ease-out}
.tm-eyes{transform:translate(calc(var(--dx)*4px),calc(var(--dy)*3px));transition:transform .12s ease-out}
.tm-pupil{transform:translate(calc(var(--dx)*4px),calc(var(--dy)*4px));transition:transform .1s ease-out}
.tm-blink{transform-origin:100px 98px;animation:tm-blink 4.6s infinite}
.tm-wave{transform-origin:142px 162px;animation:tm-wave 1.6s ease-in-out infinite}
.tm-bubble{position:absolute;top:2%;right:-6%;background:#fff;color:#27408b;font-weight:600;
  font-size:14px;padding:8px 12px;border-radius:16px 16px 16px 4px;box-shadow:0 4px 14px rgba(39,64,139,.18)}
@keyframes tm-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes tm-blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.08)}}
@keyframes tm-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}
@media (prefers-reduced-motion:reduce){
  .tm,.tm svg,.tm-head,.tm-eyes,.tm-pupil,.tm-blink,.tm-wave{animation:none!important;transition:none!important}
}
`;

export default function Mascot({ size = 280 }: { size?: number }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.4;
      el.style.setProperty('--dx', String(clamp((e.clientX - cx) / (window.innerWidth / 2))));
      el.style.setProperty('--dy', String(clamp((e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div ref={wrap} className="tm">
      <style>{css}</style>
      <div className="tm-bubble">Selamat datang!</div>
      <svg viewBox="0 0 200 230" width={size} height={size * 1.15} role="img" aria-label="Maskot Tamuku">
        <defs>
          <pattern id="tm-batik" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill="#27408b" />
            <g fill="none" stroke="#f2c14e" strokeWidth="1.4">
              <ellipse cx="14" cy="7" rx="4.5" ry="7" />
              <ellipse cx="14" cy="21" rx="4.5" ry="7" />
              <ellipse cx="7" cy="14" rx="7" ry="4.5" />
              <ellipse cx="21" cy="14" rx="7" ry="4.5" />
            </g>
            <circle cx="14" cy="14" r="1.6" fill="#f2c14e" />
          </pattern>
          <radialGradient id="tm-skin" cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#ffe3c9" />
            <stop offset="1" stopColor="#f2b48a" />
          </radialGradient>
          <radialGradient id="tm-shade" cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
            <stop offset=".6" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".3" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="223" rx="54" ry="7" fill="#000" opacity=".14" />

        {/* badan */}
        <ellipse cx="80" cy="213" rx="15" ry="8" fill="#5b3a29" />
        <ellipse cx="120" cy="213" rx="15" ry="8" fill="#5b3a29" />
        <rect x="60" y="146" width="80" height="64" rx="28" fill="url(#tm-batik)" />
        <rect x="60" y="146" width="80" height="64" rx="28" fill="url(#tm-shade)" />
        <rect x="60" y="180" width="80" height="8" fill="#f2c14e" opacity=".9" />

        {/* lengan kiri */}
        <ellipse cx="56" cy="172" rx="10" ry="17" fill="url(#tm-batik)" transform="rotate(15 56 172)" />
        <circle cx="51" cy="188" r="7" fill="url(#tm-skin)" />

        {/* lengan kanan melambai */}
        <g className="tm-wave">
          <ellipse cx="156" cy="150" rx="10" ry="17" fill="url(#tm-batik)" transform="rotate(-35 156 150)" />
          <circle cx="167" cy="132" r="7" fill="url(#tm-skin)" />
        </g>

        {/* kepala */}
        <g className="tm-head">
          <circle cx="41" cy="98" r="10" fill="url(#tm-skin)" />
          <circle cx="159" cy="98" r="10" fill="url(#tm-skin)" />
          <circle cx="100" cy="92" r="60" fill="url(#tm-skin)" />
          <circle cx="100" cy="92" r="60" fill="url(#tm-shade)" />
          <ellipse cx="47" cy="88" rx="6" ry="10" fill="#2b1b17" />
          <ellipse cx="153" cy="88" rx="6" ry="10" fill="#2b1b17" />

          {/* blangkon batik */}
          <circle cx="100" cy="40" r="11" fill="url(#tm-batik)" />
          <path d="M48 74 Q100 8 152 74 Q100 58 48 74Z" fill="url(#tm-batik)" />
          <path d="M48 74 Q100 8 152 74 Q100 58 48 74Z" fill="url(#tm-shade)" />
          <path d="M48 74 Q100 58 152 74" fill="none" stroke="#f2c14e" strokeWidth="3" strokeLinecap="round" />

          {/* wajah */}
          <ellipse cx="62" cy="117" rx="9" ry="6" fill="#ff8fa3" opacity=".55" />
          <ellipse cx="138" cy="117" rx="9" ry="6" fill="#ff8fa3" opacity=".55" />
          <path d="M89 119 Q100 134 111 119Z" fill="#b83a4e" stroke="#b83a4e" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="100" cy="127" rx="5" ry="3" fill="#ff8fa3" />

          <g className="tm-eyes">
            <g className="tm-blink">
              {[78, 122].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="98" r="13" fill="#fff" />
                  <g className="tm-pupil">
                    <circle cx={x} cy="98" r="8.5" fill="#2b1b17" />
                    <circle cx={x - 3} cy="94" r="3" fill="#fff" />
                    <circle cx={x + 3} cy="102" r="1.5" fill="#fff" />
                  </g>
                </g>
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
