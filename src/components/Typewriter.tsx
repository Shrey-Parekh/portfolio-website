import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import SoundToggle from './SoundToggle';
import { sound } from '../hooks/useSound';

const TO = 'shreyparekh3@gmail.com';
const MAX = 1500;
// How far the sheet travels across one line, as the carriage would carry it.
const CARRIAGE_PX = 28;
// A typewriter rings its bell a few characters before the right margin,
// so the typist knows to finish the word.
const BELL_BEFORE = 7;

type Phase = 'writing' | 'folding' | 'sealed';

/* Each character prints a little differently, the way a worn ribbon and type
   bars that never land quite square do: ink weight, a hair of drift either
   way, capitals struck harder, and now and then a slug that lands twice.
   Derived from the position, so a letter never changes once it is struck. */
const ink = (i: number, ch: string) => {
  const h = Math.imul(i + 1, 2654435761) >>> 0;
  const capital = ch !== ch.toLowerCase();
  return {
    opacity: Math.min(1, 0.7 + (h % 29) / 100 + (capital ? 0.06 : 0)),
    top: `${(((h >>> 7) % 3) - 1) * 0.04}em`,
    left: `${(((h >>> 11) % 3) - 1) * 0.025}em`,
    textShadow: (h >>> 15) % 17 === 0 ? '0.035em 0 0 currentColor, 0 0 0.5px currentColor' : undefined,
  };
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* A letter typed on paper, then folded into an envelope, stamped, and handed
   to the visitor's own mail app to send. No form service or backend: the note
   leaves from their address, so a reply comes straight back to them. */
const Typewriter = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<Phase>('writing');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const carriage = useRef({ line: 0, col: 0 });
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* The carriage. After each change, find the printing position from the
     inked copy, slide the sheet to match it, ring the bell on the way past
     the margin, and hear the return whenever a new line begins, whether by
     Enter or by the text wrapping. */
  useLayoutEffect(() => {
    const text = textRef.current;
    const field = fieldRef.current;
    const sheet = sheetRef.current;
    if (!text || !field || !sheet) return;

    const spans = Array.from(text.children) as HTMLElement[];
    const lh = parseFloat(getComputedStyle(text).lineHeight);
    const probe = spans.find((s) => s.textContent !== '\n');
    // Courier Prime is monospace, so one character's width is every character's.
    const ch = probe?.getBoundingClientRect().width || parseFloat(getComputedStyle(field).fontSize) * 0.6;
    const cols = Math.max(1, Math.floor(field.clientWidth / ch));

    let line = 0;
    let col = 0;
    const last = spans[spans.length - 1];
    if (last) {
      line = Math.round(last.offsetTop / lh);
      col = Math.round((last.offsetLeft + last.getBoundingClientRect().width) / ch);
      if (message.endsWith('\n')) {
        line += 1;
        col = 0;
      }
    }

    const prev = carriage.current;
    const margin = cols - BELL_BEFORE;
    if (line > prev.line) sound.carriage();
    else if (line === prev.line && prev.col < margin && col >= margin) sound.bell();
    carriage.current = { line, col };

    if (reduced()) return;
    const returning = line !== prev.line || col < prev.col - 1;
    sheet.style.transition = returning
      ? 'translate 0.42s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s'
      : 'translate 0.08s linear, border-color 0.3s';
    sheet.style.translate = `${Math.round((0.5 - Math.min(col, cols) / cols) * CARRIAGE_PX)}px 0`;
  }, [message, phase]);

  const today = new Date();
  const dateline = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const postmark = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  const signer = name.trim() || 'A visitor to your portfolio';
  const body = `Dear Shrey,\n\n${message.trim()}\n\nYours,\n${signer}`;
  const mailto = `mailto:${TO}?subject=${encodeURIComponent(
    `A note from ${name.trim() || 'your portfolio'}`
  )}&body=${encodeURIComponent(body)}`;

  const strike = () => {
    if (reduced()) return;
    sheetRef.current?.animate([{ transform: 'translateY(0.6px)' }, { transform: 'none' }], {
      duration: 70,
    });
  };

  /* Sound follows what changed in the text rather than which key went down,
     so it also works with phone keyboards, autocorrect and paste. */
  const typed = (prev: string, next: string, caret: number) => {
    if (next.length < prev.length) {
      sound.back();
      return;
    }
    if (next.length === prev.length) return;
    const ch = next[caret - 1] ?? next[next.length - 1];
    if (ch === '\n') return; // the return is heard from the carriage above
    if (ch === ' ') sound.space();
    else if (ch !== ch.toLowerCase()) sound.shiftKey();
    else sound.key();
    strike();
  };

  const onNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    typed(message, e.target.value, e.target.selectionStart);
    setMessage(e.target.value);
  };

  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    typed(name, e.target.value, e.target.selectionStart ?? e.target.value.length);
    setName(e.target.value);
  };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 2) {
      setError('Type a few words first.');
      return;
    }
    setError('');
    setCopied(false);
    const fast = reduced();
    sound.pull();
    setPhase('folding');
    later(() => setPhase('sealed'), fast ? 0 : 650);
    if (!fast) {
      later(() => sound.stamp(), 1250);
      later(() => sound.stamp(), 1650);
    }
    // Browsers only let a page open the mail app shortly after a click, so the
    // whole fold-and-stamp sequence stays well inside that window.
    later(() => {
      window.location.href = mailto;
    }, fast ? 50 : 2000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    carriage.current = { line: 0, col: 0 };
    setMessage('');
    setName('');
    setCopied(false);
    setPhase('writing');
  };

  return (
    <div className="tw">
      <div className="tw-head">
        <p className="tw-kicker">Or write it here</p>
        <SoundToggle />
      </div>

      {phase !== 'sealed' ? (
        <form onSubmit={send} noValidate>
          <div ref={sheetRef} className={phase === 'folding' ? 'tw-sheet is-folding' : 'tw-sheet'}>
            <p className="tw-dateline">{dateline}</p>
            <p className="tw-salute" aria-hidden="true">
              Dear Shrey,
            </p>

            <label htmlFor="tw-note" className="sr-only">
              Your note to Shrey
            </label>
            <div ref={fieldRef} className="tw-field">
              {/* What you see is this inked copy; the real textarea sits on top
                  of it with transparent text, so editing, selection and screen
                  readers all work as normal. */}
              <div className="tw-ink" aria-hidden="true">
                <div ref={textRef} className="tw-ink-text">
                  {[...message].map((ch, i) => (
                    <span key={i} style={ink(i, ch)}>
                      {ch}
                    </span>
                  ))}{' '}
                </div>
              </div>
              <textarea
                id="tw-note"
                className="tw-input"
                value={message}
                maxLength={MAX}
                onChange={onNote}
                placeholder="Start typing…"
                rows={1}
                spellCheck
                disabled={phase !== 'writing'}
              />
            </div>

            <p className="tw-sign" aria-hidden="true">
              Yours,
            </p>
            <label htmlFor="tw-name" className="sr-only">
              Your name
            </label>
            <input
              id="tw-name"
              className="tw-name"
              value={name}
              maxLength={60}
              onChange={onName}
              placeholder="Your name"
              autoComplete="name"
              disabled={phase !== 'writing'}
            />
          </div>

          <div className="tw-actions">
            <span className="tw-count">
              {message.length} / {MAX}
            </span>
            {error && (
              <p role="alert" className="tw-error">
                {error}
              </p>
            )}
            <button type="submit" className="tw-send" disabled={phase !== 'writing'}>
              Seal and send
            </button>
          </div>
        </form>
      ) : (
        <div className="tw-sealed">
          <div className="tw-envelope">
            <span aria-hidden="true" className="tw-flap" />
            <p className="tw-from">From {signer}</p>
            <div aria-hidden="true" className="stamp-block tw-env-stamp">
              <span className="postmark">
                <span className="postmark-ring" />
                <span className="postmark-text">
                  {postmark}
                  <br />
                  {today.getFullYear()}
                </span>
              </span>
              <span className="stamp">
                <span className="stamp-face">
                  <span className="stamp-mono">SP</span>
                  <span className="stamp-city">Mumbai</span>
                </span>
              </span>
            </div>
            <div className="tw-address">
              <p>Shrey Parekh</p>
              <p>Mumbai, India</p>
            </div>
          </div>

          <div className="tw-after" role="status">
            <p>
              Sealed. Your mail app should open with the note ready, so press send there to post
              it.
            </p>
            <div className="tw-after-actions">
              <a href={mailto} className="tw-ghost">
                Open it again
              </a>
              <button type="button" onClick={copy} className="tw-ghost">
                {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy the note'}
              </button>
              <button type="button" onClick={reset} className="tw-ghost">
                <RotateCcw size={13} aria-hidden="true" />
                Write another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Typewriter;
