import {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import Section from '../components/Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

interface Paper {
  id: string;
  numeral: string;
  kind: string;
  title: string;
  /* Where it was published. Omitted while a manuscript is still out. */
  venue?: string;
  year?: string;
  status: string;
  abstract: string;
  keywords: string[];
  /* Set to a public path (e.g. "/papers/title.pdf") once the document is
     uploaded — the pending chip becomes a live download automatically. */
  pdf?: string;
  size?: string;
}

const papers: Paper[] = [
  {
    id: 'paper-1',
    numeral: 'I',
    kind: 'Research paper',
    title:
      'VehicleClassAttention: Learning PCU-Weighted Signal Control for Heterogeneous Urban Traffic',
    venue: 'ICCCNet, United Kingdom',
    year: '2026',
    status: 'Accepted',
    abstract:
      'Proposes VehicleClassAttention (VCA), a learnable attention module that embeds IRC:106-1990 passenger-car-unit priors into a graph attention network for traffic signal control. On a 9-intersection SUMO grid, the full policy cuts queues by 14.9% against the strongest classical baseline; ablations across four architectures and three seeds isolate VCA’s independent 5.5% queue reduction at only 400 additional parameters.',
    keywords: [
      'Multi-agent RL',
      'Graph attention networks',
      'Traffic signal control',
      'PCU weighting',
    ],
    pdf: '/vca-paper.pdf',
    size: '1.4 MB',
  },
  {
    id: 'paper-2',
    numeral: 'II',
    kind: 'Research paper',
    title: 'Handwriting Margin Geometry: Computer-Vision Feature Extraction',
    status: 'Under review',
    abstract:
      'A computer-vision pipeline built on OpenCV and EasyOCR extracts margin-geometry features from handwritten documents, namely left-margin shape and top/bottom gradients, which feed multi-output SVM, Naive Bayes, and Random Forest classifiers. The manuscript is currently under journal review; the full document will appear here once it clears.',
    keywords: ['Computer vision', 'OpenCV', 'EasyOCR', 'Multi-output classification'],
  },
  {
    id: 'paper-3',
    numeral: 'III',
    kind: 'Research paper',
    title: 'Detecting Electronic Waste Contaminants in Wet Biodegradable Waste',
    status: 'Under review',
    abstract:
      'Since no dataset exists for e-waste embedded in wet biodegradable waste, and real photographs of the scenario are hard to obtain, this work builds one synthetically: e-waste objects are segmented and composited into real organic-waste imagery with colour harmonisation, contact-shadow rendering, and occlusion matching, yielding 1,500 automatically labelled images. A YOLOv8 model trained on this set reaches 72.7% mAP on synthetic validation and 89.1% detection on 46 held-out real e-waste photos, though a 12.6% false-positive rate on clean waste (reducible to 4.3% at lower recall) shows the synthetic-to-real transfer is only partial.',
    keywords: ['Synthetic data generation', 'Object detection', 'YOLOv8', 'Sim-to-real transfer'],
  },
  {
    id: 'paper-4',
    numeral: 'IV',
    kind: 'Research paper',
    title:
      'Machine Learning-Based Crime Category Classification and Spatio-Temporal Pattern Analysis',
    status: 'Under review',
    abstract:
      'Builds a spatio-temporal classifier for Chicago crime incidents from 2020 to 2024, using 1,060,801 records from the City of Chicago Open Data Portal grouped into four categories, Violent, Property, Drug/Public Order, and White-Collar, from eleven district, location, and time-based features with no victim demographic inputs. Five classifiers are trained under matched unweighted and sample-weighted configurations; XGBoost performs best at 67.5% accuracy and a macro-F1 of 0.51, with ROC-AUCs of 0.88 and 0.86 on the two rarest classes, showing strong ranking even where thresholding is imprecise.',
    keywords: [
      'Crime classification',
      'Spatio-temporal analysis',
      'XGBoost',
      'Imbalanced classification',
    ],
  },
];

/* Download chip: a live link when a PDF exists, a quiet dashed placeholder
   until then. The whole element is the click target. */
const DownloadChip = ({ paper }: { paper: Paper }) =>
  paper.pdf ? (
    <a
      href={paper.pdf}
      download
      className="group/dl inline-flex items-center gap-3 border border-hairline bg-panel px-4 py-2.5 no-underline transition-colors duration-300 hover:border-accent"
    >
      <span className="flex h-8 w-8 items-center justify-center border border-hairline text-accent transition-transform duration-300 ease-out group-hover/dl:translate-y-0.5">
        <Download size={14} />
      </span>
      <span className="flex flex-col">
        <span className="font-body text-sm text-ink">Download full paper</span>
        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-muted">
          PDF{paper.size ? `, ${paper.size}` : ''}
        </span>
      </span>
    </a>
  ) : (
    <span className="inline-flex items-center gap-3 border border-dashed border-hairline px-4 py-2.5 opacity-80">
      <span className="flex h-8 w-8 items-center justify-center border border-dashed border-hairline text-muted">
        <Download size={14} />
      </span>
      <span className="flex flex-col">
        <span className="font-body text-sm text-muted">Full document forthcoming</span>
        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-muted">
          PDF appears here once it clears
        </span>
      </span>
    </span>
  );

/* One paper, set as an offprint: a masthead across the head of the sheet,
   metadata in a rail down the left the way it sits on a printed paper, and
   the title and abstract in the reading column beside it. */
const Sheet = ({ paper }: { paper: Paper }) => (
  <article data-sheet id={paper.id} className="sheet scroll-mt-28">
    <div className="sheet-inner">
      <div className="sheet-masthead">
        <span className="masthead-kind">{paper.kind}</span>
        <span
          className={paper.status === 'Accepted' ? 'masthead-status is-out' : 'masthead-status'}
        >
          {paper.status}
        </span>
      </div>

      <div className="sheet-grid">
        <div className="sheet-rail">
          <div className="rail-folio-block">
            <span className="rail-folio">{paper.numeral}</span>
            <span aria-hidden="true" className="rail-divider" />
          </div>

          {paper.venue && (
            <div>
              <p className="rail-label">Venue</p>
              <p className="rail-line">
                {paper.venue}
                {paper.year ? `, ${paper.year}` : ''}
              </p>
            </div>
          )}

          <div>
            <p className="rail-label">Keywords</p>
            <ul className="rail-keys">
              {paper.keywords.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sheet-body">
          <h3 className="sheet-title">{paper.title}</h3>
          <p className="rail-label sheet-abstract-label">Abstract</p>
          <p className="sheet-abstract">{paper.abstract}</p>
          <div className="sheet-foot">
            <DownloadChip paper={paper} />
          </div>
        </div>
      </div>
    </div>
  </article>
);

const Blogs = () => {
  const header = useScrollReveal<HTMLDivElement>(0.1);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Glide to whichever sheet sits nearest the centre. Used after a drag,
     since snap is suspended during the gesture. */
  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const tr = track.getBoundingClientRect();
    const centre = tr.left + tr.width / 2;
    let best: HTMLElement | null = null;
    let bestD = Infinity;
    track.querySelectorAll<HTMLElement>('[data-sheet]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centre);
      if (d < bestD) {
        bestD = d;
        best = el;
      }
    });
    if (!best) return;
    const br = (best as HTMLElement).getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (br.left + br.width / 2 - centre),
      behavior: 'smooth',
    });
  }, []);

  /* Which sheet is centred, and how near each one is. No CSS transition
     rides on --p: it is recomputed every frame from scroll position, so
     easing it would make the sheet trail the gesture instead of track it. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const tr = track.getBoundingClientRect();
      if (tr.width <= 0) return;
      const centre = tr.left + tr.width / 2;
      let best = 0;
      let bestD = Infinity;

      track.querySelectorAll<HTMLElement>('[data-sheet]').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centre);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
        if (!reduce) {
          el.style.setProperty('--p', Math.max(0, 1 - d / (tr.width * 0.85)).toFixed(3));
        }
      });

      setActive(best);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Drag to turn pages with a mouse; touch and trackpads keep their native
     momentum scrolling. There is deliberately no wheel handling here: taking
     over the vertical wheel made the section feel like it had swallowed the
     page, so the arrows, gauge, keys and drag carry navigation instead. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || (e.target as Element).closest('a, button')) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      if (moved) snapToNearest();
    };
    // Swallow the click that ends a drag so a link never fires mid-pull.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    track.addEventListener('click', onClick, true);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      track.removeEventListener('click', onClick, true);
    };
  }, [snapToNearest]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const sheet = track.querySelectorAll<HTMLElement>('[data-sheet]')[i];
    if (!sheet) return;
    const tr = track.getBoundingClientRect();
    const sr = sheet.getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (sr.left + sr.width / 2 - (tr.left + tr.width / 2)),
      behavior: 'smooth',
    });
  }, []);

  const step = useCallback(
    (dir: number) => goTo(Math.min(papers.length - 1, Math.max(0, active + dir))),
    [active, goTo]
  );

  const onKey = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  return (
    <Section id="blogs">
      <div ref={header.ref} data-inview={header.visible ? 'true' : 'false'}>
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">04</span>
          <span className="font-body text-sm italic text-accent">Blogs</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <h2 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Four papers, one to a sheet.{' '}
            <em className="font-display italic text-accent">Turn through them</em>, take the full
            document with you.
          </span>
        </h2>
      </div>

      <div className="reader-bleed">
        <div
          ref={trackRef}
          className="reader"
          role="region"
          aria-label="Papers, scroll sideways"
          tabIndex={0}
          onKeyDown={onKey}
        >
          {papers.map((p) => (
            <Sheet key={p.id} paper={p} />
          ))}
        </div>
      </div>

      <div className="reader-gauge">
        <div className="gauge-marks">
          {papers.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show paper ${p.numeral}: ${p.title}`}
              aria-current={active === i}
              className={`gauge-mark ${active === i ? 'is-on' : ''}`}
            >
              <span className="gauge-numeral">{p.numeral}</span>
              <span aria-hidden="true" className="gauge-rule" />
            </button>
          ))}
        </div>

        <div className="gauge-arrows">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous paper"
            className="gauge-arrow"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={active === papers.length - 1}
            aria-label="Next paper"
            className="gauge-arrow"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <p className="mt-10 font-body text-sm italic text-muted">
        Documents are added as they clear review, abstracts first.
      </p>
    </Section>
  );
};

export default Blogs;
