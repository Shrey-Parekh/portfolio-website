import { CSSProperties } from 'react';
import { Download } from 'lucide-react';
import Section from '../components/Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

interface Paper {
  id: string;
  no: string;
  kind: string;
  title: string;
  venue: string;
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
    no: '01',
    kind: 'Research paper',
    title:
      'VehicleClassAttention: Learning PCU-Weighted Signal Control for Heterogeneous Urban Traffic',
    venue: 'ICCCNet, United Kingdom · 2026 · Accepted',
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
    no: '02',
    kind: 'Research paper',
    title: 'Handwriting Margin Geometry: Computer-Vision Feature Extraction',
    venue: 'Under journal review',
    abstract:
      'A computer-vision pipeline built on OpenCV and EasyOCR extracts margin-geometry features from handwritten documents — left-margin shape and top/bottom gradients — which feed multi-output SVM, Naive Bayes, and Random Forest classifiers. The manuscript is currently under journal review; the full document will appear here once it clears.',
    keywords: ['Computer vision', 'OpenCV', 'EasyOCR', 'Multi-output classification'],
  },
  {
    id: 'paper-3',
    no: '03',
    kind: 'Research paper',
    title: 'Detecting Electronic Waste Contaminants in Wet Biodegradable Waste',
    venue: 'Under journal review',
    abstract:
      'Since no dataset exists for e-waste embedded in wet biodegradable waste, and real photographs of the scenario are hard to obtain, this work builds one synthetically: e-waste objects are segmented and composited into real organic-waste imagery with colour harmonisation, contact-shadow rendering, and occlusion matching, yielding 1,500 automatically labelled images. A YOLOv8 model trained on this set reaches 72.7% mAP on synthetic validation and 89.1% detection on 46 held-out real e-waste photos, though a 12.6% false-positive rate on clean waste (reducible to 4.3% at lower recall) shows the synthetic-to-real transfer is only partial. The manuscript is currently under journal review; the full document will appear here once it clears.',
    keywords: ['Synthetic data generation', 'Object detection', 'YOLOv8', 'Sim-to-real transfer'],
  },
  {
    id: 'paper-4',
    no: '04',
    kind: 'Research paper',
    title:
      'Machine Learning-Based Crime Category Classification and Spatio-Temporal Pattern Analysis',
    venue: 'Under journal review',
    abstract:
      'Builds a spatio-temporal classifier for Chicago crime incidents from 2020 to 2024, using 1,060,801 records from the City of Chicago Open Data Portal grouped into four categories, Violent, Property, Drug/Public Order, and White-Collar, from eleven district, location, and time-based features with no victim demographic inputs. Five classifiers are trained under matched unweighted and sample-weighted configurations; XGBoost performs best at 67.5% accuracy and a macro-F1 of 0.51, with ROC-AUCs of 0.88 and 0.86 on the two rarest classes, showing strong ranking even where thresholding is imprecise. The manuscript is currently under journal review; the full document will appear here once it clears.',
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
const DownloadChip = ({ paper }: { paper: Paper }) => {
  if (paper.pdf) {
    return (
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
            PDF{paper.size ? ` · ${paper.size}` : ''}
          </span>
        </span>
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-3 border border-dashed border-hairline px-4 py-2.5 opacity-80">
      <span className="flex h-8 w-8 items-center justify-center border border-dashed border-hairline text-muted">
        <Download size={14} />
      </span>
      <span className="flex flex-col">
        <span className="font-body text-sm text-muted">Full document — forthcoming</span>
        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-muted">
          PDF will appear here
        </span>
      </span>
    </span>
  );
};

const PaperEntry = ({ paper, index }: { paper: Paper; index: number }) => {
  const { ref, visible } = useScrollReveal<HTMLElement>(0.2);

  return (
    <article
      id={paper.id}
      ref={ref}
      data-inview={visible ? 'true' : 'false'}
      className="scroll-mt-24 border-b border-hairline py-10 sm:py-12"
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-12">
        {/* Margin column: number + kind */}
        <div className="flex items-baseline gap-4 sm:col-span-2 sm:flex-col sm:gap-2">
          <span data-reveal className="font-display text-3xl italic text-muted opacity-70 sm:text-4xl">
            {paper.no}
          </span>
          <span data-reveal style={delay(0.1)} className="font-body text-[10px] uppercase tracking-[0.18em] text-accent">
            {paper.kind}
          </span>
        </div>

        {/* Entry body */}
        <div className="sm:col-span-10">
          <h3 className="font-display text-xl leading-snug text-ink sm:text-2xl">
            <span data-wipe style={delay(0.15 + (index % 2) * 0.05)}>{paper.title}</span>
          </h3>

          <p data-reveal style={delay(0.25)} className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-muted">
            {paper.venue}
          </p>

          <p data-reveal style={delay(0.32)} className="mt-4 font-body text-xs uppercase tracking-[0.18em] text-accent">
            Abstract
          </p>
          <p data-reveal style={delay(0.38)} className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-muted sm:text-base">
            {paper.abstract}
          </p>

          <p data-reveal style={delay(0.46)} className="mt-4 font-body text-xs italic text-muted">
            {paper.keywords.join(' · ')}
          </p>

          <div data-reveal style={delay(0.54)} className="mt-6">
            <DownloadChip paper={paper} />
          </div>
        </div>
      </div>
    </article>
  );
};

const Blogs = () => {
  const header = useScrollReveal<HTMLDivElement>(0.1);
  const closing = useScrollReveal<HTMLDivElement>(0.3);

  return (
    <Section id="blogs">
      {/* Header */}
      <div ref={header.ref} data-inview={header.visible ? 'true' : 'false'}>
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">04</span>
          <span className="font-body text-sm italic text-accent">Blogs</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <h2 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Papers &amp; longer notes — <em className="font-display italic text-accent">read the
            abstract here</em>, take the full document with you.
          </span>
        </h2>
      </div>

      {/* Entries */}
      <div className="mt-10 border-t border-hairline sm:mt-14">
        {papers.map((p, i) => (
          <PaperEntry key={p.id} paper={p} index={i} />
        ))}
      </div>

      {/* Closing note */}
      <div
        ref={closing.ref}
        data-inview={closing.visible ? 'true' : 'false'}
        className="mt-8"
      >
        <p data-reveal className="font-body text-sm italic text-muted">
          Documents are added as they clear review — abstracts first, PDFs the moment they're
          public.
        </p>
      </div>
    </Section>
  );
};

export default Blogs;
