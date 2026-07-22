import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Dot {
  x: number;
  y: number;
  f: number;
  v: number;
  target: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
}

const INK_LIGHT = '31,51,36';
const INK_DARK = '216,205,188';

const FlipDotHero = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDarkMode } = useTheme();
  const inkRef = useRef(INK_LIGHT);

  useEffect(() => {
    inkRef.current = isDarkMode ? INK_DARK : INK_LIGHT;
  }, [isDarkMode]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const CONFIG = {
      lines: ['SHREY', 'PAREKH'],
      flipStrength: 1,
      idleWaves: !reduceMotion,
    };

    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
    let W = 0;
    let H = 0;
    let cell = 0;
    let cursorRadius = 90;
    let dots: Dot[] = [];
    let ripples: Ripple[] = [];
    let frameId = 0;
    let t = 0;
    let nextWave = 4;

    function pickCell(width: number) {
      if (width < 400) return 7;
      if (width < 480) return 9;
      if (width < 768) return 11;
      if (width < 1280) return 15;
      return 18;
    }

    function pickLayout(width: number) {
      return width < 640 ? CONFIG.lines : [CONFIG.lines.join(' ')];
    }

    function build() {
      W = wrap!.clientWidth;
      H = wrap!.clientHeight;
      canvas!.width = W * DPR;
      canvas!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);

      cell = pickCell(W);
      cursorRadius = Math.max(60, cell * 7.5);
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      const ox = (W - cols * cell) / 2;
      const oy = (H - rows * cell) / 2;

      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;

      const lines = pickLayout(W);
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';

      const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));
      let fs = Math.floor((rows / lines.length) * 0.74);
      do {
        octx.font = `900 ${fs}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        if (octx.measureText(longest).width <= cols * 0.92) break;
        fs -= 1;
      } while (fs > 6);

      octx.fillStyle = '#000';
      const lineStep = fs * 1.06;
      const startY = rows / 2 - (lineStep * (lines.length - 1)) / 2;
      lines.forEach((line, i) => {
        octx.fillText(line, cols / 2, startY + i * lineStep);
      });

      const data = octx.getImageData(0, 0, cols, rows).data;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const on = data[(r * cols + c) * 4 + 3] > 100 ? 1 : 0;
          dots.push({
            x: ox + c * cell + cell / 2,
            y: oy + r * cell + cell / 2,
            f: on,
            v: 0,
            target: on,
          });
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      if (mouse.x > -9000) {
        mouse.vx = nx - mouse.x;
        mouse.vy = ny - mouse.y;
      }
      mouse.x = nx;
      mouse.y = ny;
    }

    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    }

    function onPointerDown(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0 });
    }

    function step() {
      t += 0.016;
      if (CONFIG.idleWaves && t > nextWave) {
        nextWave = t + 7 + Math.random() * 6;
        ripples.push({ x: Math.random() * W, y: Math.random() * H, r: 0 });
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 9;
        if (ripples[i].r > Math.max(W, H) * 1.3) ripples.splice(i, 1);
      }

      const strength = CONFIG.flipStrength;
      const r2 = cursorRadius * cursorRadius;
      const speed = Math.min(24, Math.abs(mouse.vx) + Math.abs(mouse.vy));

      for (let j = 0; j < dots.length; j++) {
        const d = dots[j];
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const kick = (1 - Math.sqrt(d2) / cursorRadius) * (0.1 + speed * 0.02) * strength;
          d.v += d.target === 1 ? -kick : kick;
        }
        for (let k = 0; k < ripples.length; k++) {
          const rp = ripples[k];
          const rdx = d.x - rp.x;
          const rdy = d.y - rp.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy);
          const band = Math.abs(rd - rp.r);
          if (band < 26) {
            const rk = (1 - band / 26) * 0.22 * strength;
            d.v += d.target === 1 ? -rk : rk;
          }
        }
        d.v += (d.target - d.f) * 0.16;
        d.v *= 0.85;
        d.f += d.v;
        if (!isFinite(d.f)) {
          d.f = d.target;
          d.v = 0;
        }
      }

      ctx!.clearRect(0, 0, W, H);
      const R = cell * 0.4;
      for (let m = 0; m < dots.length; m++) {
        const p = dots[m];
        const a = Math.max(-0.35, Math.min(1.35, p.f));
        const cs = Math.cos(a * Math.PI);
        const sc = Math.abs(cs);
        const ink = cs < 0;
        const lift = Math.abs(Math.sin(a * Math.PI)) * cell * 0.1;
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y - lift, Math.max(0.6, R * sc), R, 0, 0, Math.PI * 2);
        ctx!.fillStyle = ink
          ? `rgba(${inkRef.current},${(0.5 + sc * 0.5).toFixed(3)})`
          : `rgba(${inkRef.current},${(0.06 + (1 - sc) * 0.26).toFixed(3)})`;
        ctx!.fill();
        if (sc < 0.45) {
          ctx!.beginPath();
          ctx!.ellipse(p.x, p.y - lift, Math.max(0.5, R * sc) + 0.6, R, 0, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${inkRef.current},0.35)`;
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }
      }
      frameId = requestAnimationFrame(step);
    }

    let resizeTimer: number;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 120);
    }

    build();
    window.addEventListener('resize', onResize);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerleave', onPointerLeave);
    wrap.addEventListener('pointerdown', onPointerDown);
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
      wrap.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[540px] w-full overflow-hidden"
      style={{ height: '100dvh', background: 'var(--bg)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />

      <div className="pointer-events-none absolute inset-x-0 top-10 text-center font-body text-xs uppercase tracking-[0.3em] text-accent sm:top-14 sm:text-sm">
        Portfolio
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 px-6 text-center sm:bottom-12 sm:gap-3">
        <p className="max-w-xs font-body text-base text-ink sm:max-w-none sm:text-lg">
          Projects · skills · interests — everything I make and love
        </p>
        <small className="font-body text-xs uppercase tracking-[0.22em] text-muted sm:text-sm">
          Sweep across · click for a ripple
        </small>
      </div>
    </div>
  );
};

export default FlipDotHero;
