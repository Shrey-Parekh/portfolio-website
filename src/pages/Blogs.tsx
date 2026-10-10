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

export interface Paper {
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

export const papers: Paper[] = [
  {
    id: 'paper-1',
    numeral: 'I',
    kind: 'Research paper',
    title:
      'Detection of Electronic Waste Contamination in Wet Biodegradable Waste Using Segmentation and Explainable AI',
    status: 'Under review',
    abstract:
      'No photographs of electronic waste mixed into organic waste exist to train a detector, so this work trains one on synthetic data: 54 screened e-waste cut-outs are composited into real organic-waste photographs with colour harmonisation, grain matching, contact shadows, and partial burial, with labels derived from the pixels left visible. A YOLOv11s detector trained only on these composites, tested on 387 withheld real e-waste photographs and 746 clean organic ones, flags 84.5% of e-waste images while alerting on 10% of clean loads, rising to 97.2% for circuit boards. In paired ablations, attention (CBAM) lowered detection by 11.9 to 16.3 points, and an eleven-model ensemble added a non-significant 1.8 points at 11.8 times the latency.',
    keywords: [
      'Synthetic training data',
      'Object detection',
      'Compost contamination',
      'Municipal solid waste',
    ],
  },
  {
    id: 'paper-2',
    numeral: 'II',
    kind: 'Research paper',
    title:
      'VehicleClassAttention: Learning PCU-Weighted Signal Control for Heterogeneous Indian Urban Traffic',
    venue: 'ICCCNet, United Kingdom',
    year: '2026',
    status: 'Accepted',
    abstract:
      'Indian urban traffic mixes two-wheelers, auto-rickshaws, cars, and buses with very different Passenger Car Unit (PCU) equivalents, yet existing reinforcement learning controllers treat every vehicle the same. VehicleClassAttention (VCA) is a learnable attention module that weights vehicle classes by their PCU-scaled congestion contribution, initialised from IRC:106-1990 priors and integrated into a graph attention network for multi-intersection control. On a SUMO 9-intersection grid calibrated to Indian traffic, GAT-DQN with VCA reaches an average queue of 10.57 PCU, 14.9% below the best classical baseline, with 5.7% higher throughput; ablation attributes 12.5% to graph structure, 1.8% to attention, and a further 5.5% to VCA.',
    keywords: [
      'Deep reinforcement learning',
      'Graph attention networks',
      'Traffic signal control',
      'Passenger car units',
    ],
    pdf: '/vca-paper.pdf',
    size: '1.4 MB',
  },
  {
    id: 'paper-3',
    numeral: 'III',
    kind: 'Research paper',
    title:
      'Machine Learning-Based Crime Category Classification and Spatio-Temporal Pattern Analysis',
    venue: 'NSHM Minds, IEEE 2026',
    status: 'Accepted',
    abstract:
      'Classifies 1,060,801 Chicago crime incidents from 2020 to 2024 into four categories, Violent, Property, Drug/Public Order, and White-Collar, from eleven district, location, and time-based features with no victim demographic inputs. Five classical classifiers and three neural baselines (a multilayer perceptron, an FT-Transformer, and a graph convolutional network over district adjacency) are trained under matched unweighted and sample-weighted configurations. XGBoost performs best at 67.5% accuracy and a macro-F1 of 0.51, significantly ahead of every other tested model except the MLP under paired McNemar tests. The two rarest classes reach the highest ROC-AUCs (0.88 and 0.86) despite low F1, showing their weakness is a thresholding and base-rate effect rather than missing signal.',
    keywords: [
      'Crime classification',
      'Class imbalance',
      'Gradient boosting',
      'Spatio-temporal features',
    ],
    pdf: '/crime-paper.pdf',
    size: '648 KB',
  },
  {
    id: 'paper-4',
    numeral: 'IV',
    kind: 'Research paper',
    title:
      'Learning Behavioral Patterns from Handwritten Document Margins Using OCR-Derived Spatial Features',
    status: 'Under review',
    abstract:
      'Graphological practice reads the margins of a handwritten page as indicators of behavioral patterns; this paper tests whether those patterns, as annotated by a practitioner, can be learned from margin features derived by optical character recognition. Word bounding boxes give 18 binary spatial features per page, including left- and right-edge drift profiles and fitted first- and last-line slopes. On 29 practitioner-annotated pages, a knowledge-guided weight matrix reaches 70.0% mean accuracy over seven patterns against a 58.6% majority-class rate (permutation p < 0.001), on par with the best of six trained classifiers, while automatically detected margins fall to 56.7%. The results concern agreement with annotations, not psychological validity.',
    keywords: [
      'Handwriting analysis',
      'Optical character recognition',
      'Document layout analysis',
      'Multi-label classification',
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

/* The opening words are set in small caps so the block has a way in. Splitting
   on words rather than characters keeps it safe for any abstract length. */
const Abstract = ({ text }: { text: string }) => {
  const words = text.split(' ');
  const lead = words.slice(0, 3).join(' ');
  const rest = words.slice(3).join(' ');

  return (
    <p className="sheet-abstract">
      <span className="abstract-lead">{lead}</span> {rest}
    </p>
  );
};

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
          <h2 className="sheet-title">{paper.title}</h2>
          <div className="sheet-abstract-head">
            <p className="rail-label">Abstract</p>
            <span aria-hidden="true" className="abstract-rule" />
          </div>
          <Abstract text={paper.abstract} />
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

        <h1 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Four papers, one to a sheet.{' '}
            <em className="font-display italic text-accent">Turn through them</em>, take the full
            document with you.
          </span>
        </h1>
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
