import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-cursor]';

/* A print registration-mark cursor. Tracks the pointer exactly via a single
   transform write per frame (no easing/trail, so no perceived lag), and only
   engages on fine pointers — touch devices keep their native behaviour. */
const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const el = ref.current;
    if (!fine || !el) return;

    document.documentElement.classList.add('has-cursor-mark');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;

    const render = () => {
      raf = 0;
      // element is 40px; offset by 20 to centre on the hotspot
      el.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onOver = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) el.classList.add('is-hot');
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) el.classList.remove('is-hot');
    };
    const onDown = () => el.classList.add('is-press');
    const onUp = () => el.classList.remove('is-press');
    const hide = () => (el.style.opacity = '0');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      document.documentElement.classList.remove('has-cursor-mark');
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-mark" aria-hidden="true">
      <span className="cursor-mark-inner">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="7.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="20" cy="20" r="1.4" fill="currentColor" />
          <path
            d="M20 3v6.5M20 30.5V37M3 20h6.5M30.5 20H37"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
};

export default Cursor;
