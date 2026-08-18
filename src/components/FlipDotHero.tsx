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
    let visible = true;

    // Fill-colour lookup: building an rgba() string per dot per frame (thousands
    // of allocations/sec, forever, even scrolled off-screen) was the actual
    // source of reported cursor lag elsewhere on the page — it was competing
    // with the cursor's own rAF for main-thread frame budget. Bucket opacity
    // into a fixed palette computed once (and only rebuilt on a theme change,
    // detected via a cheap string compare) instead of allocating every frame.
    const LUT_STEPS = 64;
    let lutInk = '';
    let lutFill: string[] = [];
    let lutFillAnti: string[] = [];
    let lutStroke = '';
    function buildLut() {
      lutInk = inkRef.current;
      lutFill = new Array(LUT_STEPS);
      lutFillAnti = new Array(LUT_STEPS);
      for (let i = 0; i < LUT_STEPS; i++) {
        const sc = i / (LUT_STEPS - 1);
        lutFill[i] = `rgba(${lutInk},${(0.5 + sc * 0.5).toFixed(3)})`;
        lutFillAnti[i] = `rgba(${lutInk},${(0.06 + (1 - sc) * 0.26).toFixed(3)})`;
      }
      lutStroke = `rgba(${lutInk},0.35)`;
    }

    function pickCell(width: number) {
      // Dot pitch. Denser than a coarse grid so each letter is built from
      // enough dots to be legible (a heavy blob at ~6 dots tall is not).
      if (width < 480) return 8;
      if (width < 768) return 9;
      if (width < 1024) return 10;
      if (width < 1440) return 12;
      return 14;
    }

    function pickLayout(width: number) {
      // Single line "SHREY PAREKH" only fits legibly at desktop widths. Below
      // ~1024px it gets cramped (and clips outright in the 768–870px band where
      // the cell size jumps), so stack it as two lines there instead.
      return width < 1024 ? CONFIG.lines : [CONFIG.lines.join(' ')];
    }

    function build() {
      W = wrap!.clientWidth;
      H = wrap!.clientHeight;
      // The wrap can briefly report zero size before layout has committed
      // (React 18 StrictMode's double-mount in dev, or a route transition
      // mid-flight). Bail out rather than sizing an offscreen canvas to 0,
      // which throws on getImageData; the ResizeObserver below re-runs build
      // the moment the element actually has real dimensions.
      if (W <= 0 || H <= 0) return;
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
      // A one-dot gap between glyphs keeps letters from merging at low
      // resolution — the difference between "PAREKH" and an inkblot.
      if ('letterSpacing' in octx) {
        (octx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '1px';
      }

      const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));
      // Horizontal budget in cells. Conservative so the bold glyphs — whose ink
      // overhangs their advance width — never touch the edge.
      const budgetW = cols * 0.86;
      let fs = Math.floor((rows / lines.length) * 0.74);
      do {
        // 700 (bold), not 900 (black): a lighter weight keeps the counters and
        // stroke gaps open so E, R, K, Y stay distinguishable as dots.
        octx.font = `700 ${fs}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
        const m = octx.measureText(longest);
        // True ink extent (bounding box), not just the advance width, so the
        // last letter's overhang is accounted for. Fall back to advance width
        // on the rare engine without actualBoundingBox support.
        const ink =
          (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
        if (Math.max(ink, m.width) <= budgetW) break;
        fs -= 1;
      } while (fs > 6);

      octx.fillStyle = '#000';
      const lineStep = fs * 1.14;
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
      // Skip all physics and drawing while scrolled off-screen. The loop still
      // reschedules itself (cheap) so it resumes instantly on scroll-back,
      // but stops burning frame budget the moment it isn't visible — which is
      // most of the time a visitor spends reading the rest of the page.
      if (!visible) {
        frameId = requestAnimationFrame(step);
        return;
      }

      if (lutInk !== inkRef.current) buildLut();

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
      const nRipples = ripples.length;

      for (let j = 0; j < dots.length; j++) {
        const d = dots[j];
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const kick = (1 - Math.sqrt(d2) / cursorRadius) * (0.1 + speed * 0.02) * strength;
          d.v += d.target === 1 ? -kick : kick;
        }
        for (let k = 0; k < nRipples; k++) {
          const rp = ripples[k];
          const rdx = d.x - rp.x;
          const rdy = d.y - rp.y;
          // Cheap squared-distance bound before the sqrt below: a dot can only
          // be inside the 26px band if it falls within [r-26, r+26] of the
          // ripple centre. For thousands of dots against a thin ring this
          // rules out the overwhelming majority without ever calling sqrt.
          const rdSq = rdx * rdx + rdy * rdy;
          const outer = rp.r + 26;
          if (rdSq > outer * outer) continue;
          const inner = rp.r - 26;
          if (inner > 0 && rdSq < inner * inner) continue;
          const rd = Math.sqrt(rdSq);
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
        const lutIdx = Math.round(sc * (LUT_STEPS - 1));
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y - lift, Math.max(0.6, R * sc), R, 0, 0, Math.PI * 2);
        ctx!.fillStyle = ink ? lutFill[lutIdx] : lutFillAnti[lutIdx];
        ctx!.fill();
        if (sc < 0.45) {
          ctx!.beginPath();
          ctx!.ellipse(p.x, p.y - lift, Math.max(0.5, R * sc) + 0.6, R, 0, 0, Math.PI * 2);
          ctx!.strokeStyle = lutStroke;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(wrap);

    // Observes wrap directly rather than only window resize, so build() also
    // re-runs the moment the element itself first gets real dimensions (the
    // zero-size mount the guard above bails out of), not just on viewport
    // resize.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);

    buildLut();
    build();
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerleave', onPointerLeave);
    wrap.addEventListener('pointerdown', onPointerDown);
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      resizeObserver.disconnect();
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
