import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Section from '../components/Section';
import Container from '../components/Container';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

type Tag = 'Research' | 'AI / ML' | 'Web' | 'Hardware';

const TAG_STYLES: Record<Tag, { text: string; dot: string }> = {
  Research: { text: 'text-tagResearch', dot: 'bg-tagResearch' },
  'AI / ML': { text: 'text-tagSystems', dot: 'bg-tagSystems' },
  Web: { text: 'text-tagWeb', dot: 'bg-tagWeb' },
  Hardware: { text: 'text-tagHardware', dot: 'bg-tagHardware' },
};

interface Deliverable {
  label: string;
  state: string;
  href?: string;
}

interface Project {
  id: string;
  no: string;
  numeral: string;
  title: string;
  tag: Tag;
  year?: string;
  status: string;
  statusShort: string;
  state: string;
  summary: string;
  stack: string[];
  deliverables: Deliverable[];
}

const projects: Project[] = [
  {
    id: 'plate-1',
    no: 'No. 01',
    numeral: 'I',
    title: 'Traffic Signal Control via Multi-Agent RL',
    tag: 'Research',
    year: '2026',
    status: 'Published',
    statusShort: 'Published',
    state: 'Paper accepted at ICCCNet (UK) 2026; code public.',
    summary:
      'A multi-agent reinforcement learning system for adaptive signal control on a 9-intersection SUMO grid. A graph attention network policy with VehicleClassAttention — a learnable module seeded with IRC:106-1990 PCU priors — cut queues 14.9% and lifted throughput 5.7% over the strongest classical baseline.',
    stack: ['Python', 'PyTorch', 'torch_geometric', 'SUMO'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/traffic-marl' },
      { label: 'Paper', state: 'accepted · ICCCNet 2026' },
      { label: 'Ablations', state: '4 architectures × 3 seeds' },
    ],
  },
  {
    id: 'plate-2',
    no: 'No. 02',
    numeral: 'II',
    title: 'ClassAI — Hybrid Retrieval RAG Assistant',
    tag: 'AI / ML',
    year: '2026',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Shipped via Docker Compose — JWT auth, rate limiting, SSE streaming.',
    summary:
      'A hybrid retrieval pipeline fusing bge-m3 dense embeddings in Qdrant with BM25 sparse retrieval via reciprocal rank fusion, re-ranked by a BGE cross-encoder. A two-pass hierarchical splitter cut the chunk kill-rate from 51–75% to 0–4%; inference runs on a locally-hosted Gemma3 12B for privacy.',
    stack: ['Python', 'FastAPI', 'Qdrant', 'LangChain', 'Ollama', 'Docker'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/ClassAi' },
      { label: 'Inference', state: 'local-first by design' },
      { label: 'API', state: 'JWT · rate-limited' },
    ],
  },
  {
    id: 'plate-3',
    no: 'No. 03',
    numeral: 'III',
    title: 'IronLog — ML-Driven Strength Training',
    tag: 'AI / ML',
    year: '2025',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Build complete; nine-step analytics pipeline running end to end.',
    summary:
      'A strength-training platform whose async analytics pipeline (Celery, Redis) pairs a Gaussian Process 1RM predictor with PELT changepoint detection, and a Banister fitness–fatigue model producing per-muscle readiness — feeding an autoregulation engine that adjusts weekly volume from −50% to +20%.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'scikit-learn', 'Docker'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/IronLog' },
      { label: 'Pipeline', state: '9 steps · async' },
      { label: 'Write-up', state: 'planned' },
    ],
  },
  {
    id: 'plate-4',
    no: 'No. 04',
    numeral: 'IV',
    title: 'Handwriting Margin Geometry',
    tag: 'Research',
    year: '2024',
    status: 'Under review',
    statusShort: 'In review',
    state: 'Manuscript under journal review.',
    summary:
      'A computer-vision pipeline (OpenCV, EasyOCR) extracting margin-geometry features from handwriting — left-margin shape, top and bottom gradients — feeding multi-output SVM, Naive Bayes, and Random Forest classifiers.',
    stack: ['Python', 'OpenCV', 'EasyOCR', 'scikit-learn'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/Margin-Detection' },
      { label: 'Paper', state: 'under journal review' },
      { label: 'Features', state: 'margin shape · gradients' },
    ],
  },
  {
    id: 'plate-5',
    no: 'No. 05',
    numeral: 'V',
    title: 'AI Tutor — PDF Learning Assistant',
    tag: 'AI / ML',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'RAG assistant over uploaded PDFs, with speech and multilingual translation.',
    summary:
      'A document assistant that answers questions over uploaded PDFs through a Retrieval-Augmented Generation pipeline: Sentence-Transformer embeddings, FAISS semantic search, and a local Llama 3 via Ollama, with conversational memory for multi-turn chats. Adds text-to-speech (gTTS / MeloTTS) and multilingual translation for cross-language learning.',
    stack: ['Python', 'Streamlit', 'LangChain', 'FAISS', 'Ollama', 'Llama 3'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/AI-TUTOR' },
      { label: 'Pipeline', state: 'RAG · FAISS · Llama 3' },
      { label: 'Extras', state: 'TTS · translation' },
    ],
  },
  {
    id: 'plate-6',
    no: 'No. 06',
    numeral: 'VI',
    title: 'ResumeAI — AI Resume Management Platform',
    tag: 'AI / ML',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'HR and job-seeker modules with AI scoring, matching, and skill-gap analysis.',
    summary:
      'An AI-powered resume platform with separate HR and job-seeker modules — resume scoring, tailored resume generation, job-description analysis, and skill-gap identification. A Flask / MySQL backend handles multi-format ingest and export (PDF, Word, text) via python-docx, PyPDF2, and ReportLab, with scikit-learn, NLTK, and Pandas driving the analysis.',
    stack: ['Python', 'Flask', 'MySQL', 'scikit-learn', 'NLTK', 'Pandas'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/RusumeAI' },
      { label: 'Modules', state: 'HR + job seeker' },
      { label: 'Export', state: 'PDF · Word · Text' },
    ],
  },
  {
    id: 'plate-7',
    no: 'No. 07',
    numeral: 'VII',
    title: 'Game Arena — Realtime Multiplayer Platform',
    tag: 'Web',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Full-stack platform with live rooms, state sync, and in-game chat over WebSockets.',
    summary:
      'A full-stack multiplayer gaming platform on React (Vite) and a Node / Express backend, with WebSockets carrying room creation, game-state synchronization, and live player chat. The server is organized around controllers, socket event handlers, and a room manager for scalable concurrent play, backed by PostgreSQL.',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets', 'Tailwind'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/game-arena' },
      { label: 'Realtime', state: 'rooms · sync · chat' },
      { label: 'Backend', state: 'controllers · sockets' },
    ],
  },
  {
    id: 'plate-8',
    no: 'No. 08',
    numeral: 'VIII',
    title: 'LoopIn — College Event & Community Portal',
    tag: 'Web',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Full-stack events & community portal, deployed on Vercel over a cloud backend.',
    summary:
      'A full-stack portal for college events and community, built with React + TypeScript (Vite) on a Node / Express and Supabase backend. Authentication, PostgreSQL, and React Query handle data and state; the interface leans on Tailwind, Radix UI, and Framer Motion, deployed through Vercel.',
    stack: ['React', 'TypeScript', 'Supabase', 'Express', 'React Query', 'Tailwind'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/loopin-iet-portal' },
      { label: 'Auth', state: 'Supabase · PostgreSQL' },
      { label: 'Deploy', state: 'Vercel + cloud API' },
    ],
  },
  {
    id: 'plate-9',
    no: 'No. 09',
    numeral: 'IX',
    title: 'Trivio — Full-Stack Quiz Platform',
    tag: 'Web',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Quiz app with auth, live scoring, leaderboards, and subscriptions.',
    summary:
      'A full-stack quiz application on Node / Express and MySQL with secure authentication (bcryptjs): registration and login, quiz management, real-time score calculation, leaderboards, profiles, and subscriptions. RESTful APIs serve auth, question retrieval, and scoring behind a responsive multi-category front end.',
    stack: ['Node.js', 'Express', 'MySQL', 'JavaScript', 'bcryptjs'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/Quiz-App' },
      { label: 'Features', state: 'scores · leaderboards' },
      { label: 'API', state: 'auth · questions · scores' },
    ],
  },
  {
    id: 'plate-10',
    no: 'No. 10',
    numeral: 'X',
    title: 'Sumo Bot — ESP32 Combat Robot',
    tag: 'Hardware',
    status: 'Built',
    statusShort: 'Built',
    state: "Four-wheeled combat bot, phone-driven over the ESP32's own Wi-Fi.",
    summary:
      "A four-wheeled sumo robot built around an ESP32 that hosts its own Wi-Fi access point, so it can be driven straight from a phone with no external network. Steered through a wireless remote to push rival bots out of the ring.",
    stack: ['ESP32', 'C++', 'Wi-Fi', 'Motor drivers'],
    deliverables: [
      { label: 'Platform', state: 'ESP32 · self-hosted Wi-Fi' },
      { label: 'Control', state: 'phone remote' },
      { label: 'Class', state: '4-wheel combat' },
    ],
  },
  {
    id: 'plate-11',
    no: 'No. 11',
    numeral: 'XI',
    title: 'Gesture-Controlled Rover',
    tag: 'Hardware',
    status: 'Built',
    statusShort: 'Built',
    state: 'Hand gestures read by a Python vision app, driving a 4-wheel ESP32 rover.',
    summary:
      'A four-wheeled rover driven by hand gestures: a Python vision application reads the camera feed, recognizes hand poses, and streams movement commands to an ESP32 on the bot. Wave it forward, turn it, stop it — no controller in hand.',
    stack: ['ESP32', 'Python', 'OpenCV', 'Computer vision'],
    deliverables: [
      { label: 'Vision', state: 'Python hand tracking' },
      { label: 'Board', state: 'ESP32' },
      { label: 'Drive', state: '4-wheel rover' },
    ],
  },
];

const tagText = (tag: Tag) => TAG_STYLES[tag].text;
const tagDot = (tag: Tag) => TAG_STYLES[tag].dot;

/* Discipline spine colour — the folder's coloured edge. */
const SPINE: Record<Tag, string> = {
  Research: 'bg-tagResearch',
  'AI / ML': 'bg-tagSystems',
  Web: 'bg-tagWeb',
  Hardware: 'bg-tagHardware',
};

/* An archive-folder specimen card. No illustration stands in for artwork that
   doesn't exist — the record itself is the object: a coloured discipline
   spine, a watermarked plate numeral, and the entry set as a catalogue sheet. */
const PlateCard = ({ project }: { project: Project }) => (
  <article
    data-card
    id={project.id}
    className="rail-card group w-[82vw] shrink-0 snap-center sm:w-[24rem] lg:w-[26rem]"
  >
    <div className="rail-card-inner relative flex h-full flex-col border border-hairline bg-panel">
      {/* Discipline spine — grows from the top as the card centres */}
      <span
        aria-hidden="true"
        className={`card-spine absolute left-0 top-0 h-full w-[3px] ${SPINE[project.tag]}`}
      />

      {/* Catalogue number, hung vertically up the spine gutter like a
          folder tab — keeps the head of the card clear for the title. */}
      <span aria-hidden="true" className="card-folio absolute bottom-6 left-0 flex w-10 justify-center">
        <span className="font-body text-[10px] uppercase tracking-[0.28em] text-muted [writing-mode:vertical-rl] rotate-180">
          {project.no}
        </span>
      </span>

      {/* Plate numeral, watermarked into the sheet */}
      <span
        aria-hidden="true"
        className="card-numeral pointer-events-none absolute right-5 top-1 select-none font-display text-[4.5rem] italic leading-none text-ink"
      >
        {project.numeral}
      </span>

      <div className="relative flex h-full flex-col py-6 pl-12 pr-6">
        {/* Head: discipline and year only — the number lives on the spine */}
        <div className="flex items-baseline gap-3">
          <span className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.14em] ${tagText(project.tag)}`}>
            <span aria-hidden="true" className={`card-dot inline-block h-1.5 w-1.5 rounded-full ${tagDot(project.tag)}`} />
            {project.tag}
          </span>
          {project.year && (
            <span className="ml-auto font-body text-xs text-muted">{project.year}</span>
          )}
        </div>

        <span aria-hidden="true" className="card-rule mt-3 block h-px w-full bg-hairline" />

        <h3 className="mt-4 font-display text-[1.375rem] leading-[1.18] text-ink">
          {project.title}
        </h3>

        <p className="mt-3.5 line-clamp-4 font-body text-[0.84rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        {/* Current state as a margin note, not another labelled row */}
        <p className="card-note mt-4 border-l border-hairline pl-3 font-body text-[0.82rem] italic leading-relaxed text-muted">
          {project.state}
        </p>

        {/* Deliverables ledger */}
        <div className="mt-5">
          {project.deliverables.map((d) =>
            d.href ? (
              <a
                key={d.label}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="deliv-row group/row flex items-baseline py-1 font-body text-xs no-underline"
              >
                <span className="uppercase tracking-[0.16em] text-ink">{d.label}</span>
                <span aria-hidden="true" className="leader mx-3 flex-1 border-b border-dotted border-hairline" />
                <span className="flex items-center gap-1 italic text-muted transition-colors duration-300 group-hover/row:text-accent">
                  {d.state}
                  <ArrowUpRight
                    size={11}
                    className="transition-transform duration-300 ease-out group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5"
                  />
                </span>
              </a>
            ) : (
              <div key={d.label} className="deliv-row flex items-baseline py-1 font-body text-xs">
                <span className="uppercase tracking-[0.16em] text-ink">{d.label}</span>
                <span aria-hidden="true" className="leader mx-3 flex-1 border-b border-dotted border-hairline" />
                <span className="italic text-muted">{d.state}</span>
              </div>
            )
          )}
        </div>

        {/* Foot: stack, and the status as a struck label */}
        <div className="mt-auto pt-6">
          <span aria-hidden="true" className="card-rule block h-px w-full bg-hairline" />
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="font-body text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
              {project.stack.join('  ·  ')}
            </p>
            <span className="card-stamp shrink-0 border border-accent px-2 py-0.5 font-body text-[9px] uppercase tracking-[0.16em] text-accent">
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
);

const Projects = () => {
  const header = useScrollReveal<HTMLDivElement>(0.1);
  const index = useScrollReveal<HTMLDivElement>(0.15);
  const closing = useScrollReveal<HTMLDivElement>(0.3);

  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Scroll-driven state: proximity of each card to the rail centre drives its
     lift / scale / ink density, plus the counter and progress rule. One
     transform write per frame, rAF-throttled. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rr = rail.getBoundingClientRect();
      const centre = rr.left + rr.width / 2;
      const cards = rail.querySelectorAll<HTMLElement>('[data-card]');
      let best = 0;
      let bestD = Infinity;

      cards.forEach((card, i) => {
        const cr = card.getBoundingClientRect();
        const off = cr.left + cr.width / 2 - centre;
        const d = Math.abs(off);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
        if (!reduce) {
          // --p: proximity to the centre (0..1) — how "read" a card is.
          // --s: which side it sits on (-1..1) — lets cards turn away from
          // the reader like leaves in a drawer instead of all scaling alike.
          // Wide falloff so the drawer recedes gradually across several cards
          // rather than snapping every distant plate to the same flat pose.
          const p = Math.max(0, 1 - d / (rr.width * 0.95));
          const s = Math.max(-1, Math.min(1, off / (rr.width * 0.95)));
          card.style.setProperty('--p', p.toFixed(3));
          card.style.setProperty('--s', s.toFixed(3));
        }
      });

      const max = rail.scrollWidth - rail.clientWidth;
      setActive(best);
      setAtStart(rail.scrollLeft <= 2);
      setAtEnd(rail.scrollLeft >= max - 2);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Vertical wheel drives the rail sideways while there is rail left to
     travel; at either end the page takes the scroll back so nothing traps. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if ((e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max - 1)) {
        return;
      }
      e.preventDefault();
      rail.scrollLeft = Math.max(0, Math.min(max, rail.scrollLeft + e.deltaY));
    };

    rail.addEventListener('wheel', onWheel, { passive: false });
    return () => rail.removeEventListener('wheel', onWheel);
  }, []);

  /* Drag the drawer with a mouse. Touch keeps its native momentum scroll. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || (e.target as Element).closest('a')) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      rail.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
    };
    // Swallow the click that ends a drag so links don't fire mid-pull.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    rail.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    rail.addEventListener('click', onClick, true);
    return () => {
      rail.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      rail.removeEventListener('click', onClick, true);
    };
  }, []);

  const scrollToCard = useCallback((i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelectorAll<HTMLElement>('[data-card]')[i];
    if (!card) return;
    const rr = rail.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    const delta = cr.left + cr.width / 2 - (rr.left + rr.width / 2);
    rail.scrollTo({ left: rail.scrollLeft + delta, behavior: 'smooth' });
  }, []);

  const step = useCallback(
    (dir: number) => scrollToCard(Math.min(projects.length - 1, Math.max(0, active + dir))),
    [active, scrollToCard]
  );

  return (
    <Section id="projects" className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-10 top-48 hidden font-body text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl] xl:block"
      >
        Selected works — research to hardware
      </span>

      {/* Header */}
      <div ref={header.ref} data-inview={header.visible ? 'true' : 'false'}>
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">03</span>
          <span className="font-body text-sm italic text-accent">Projects</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <h2 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Eleven builds, <em className="font-display italic text-accent">honestly stamped</em> —
            from published research to fighting robots.
          </span>
        </h2>
      </div>

      {/* Index of works — doubles as the rail's table of contents */}
      <div
        ref={index.ref}
        data-inview={index.visible ? 'true' : 'false'}
        className="mt-12 sm:mt-16"
      >
        <p data-reveal className="font-body text-xs uppercase tracking-[0.18em] text-accent">
          Index of works
        </p>
        <div data-grow style={delay(0.1)} className="mt-3 h-px bg-hairline" />
        <ul className="pl-4">
          {projects.map((p, i) => (
            <li key={p.id} data-reveal style={delay(0.12 + i * 0.05)}>
              <button
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={`Show ${p.title}`}
                className={`ledger-row grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-hairline py-3.5 text-left font-body transition-colors duration-300 sm:grid-cols-[3rem_1fr_auto_6rem] ${
                  active === i ? 'is-current' : ''
                }`}
              >
                <span className="ledger-num text-sm text-muted">{p.no.replace('No. ', '')}</span>
                <span className="text-sm text-ink sm:text-base">{p.title}</span>
                <span className={`hidden text-xs uppercase tracking-[0.14em] sm:inline ${tagText(p.tag)}`}>
                  {p.tag}
                </span>
                <span className="text-right text-xs italic text-muted">{p.statusShort}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── The plan chest: a horizontal drawer of plates ──────────────── */}
      <div className="rail-bleed mt-14 sm:mt-16">
        {/* Rail controls, aligned to the text column */}
        <Container className="flex items-center gap-4">
          <span className="shrink-0 font-display text-lg italic text-accent">
            {projects[active].numeral}
          </span>
          <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.18em] text-muted">
            of XI
          </span>

          {/* A measuring rule: one tick per plate, the standing one marked. */}
          <div className="mx-2 flex flex-1 items-end justify-between">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={`Show ${p.title}`}
                aria-current={active === i}
                className={`tick flex h-6 flex-1 items-end justify-center ${
                  active === i ? 'is-on' : ''
                }`}
              >
                <span aria-hidden="true" className="tick-mark" />
              </button>
            ))}
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous plate"
              className="flex h-9 w-9 items-center justify-center border border-hairline text-ink transition-colors duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next plate"
              className="flex h-9 w-9 items-center justify-center border border-hairline text-ink transition-colors duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </Container>

        <div
          ref={railRef}
          tabIndex={0}
          role="region"
          aria-label="Project plates — scroll sideways"
          data-at-start={atStart}
          data-at-end={atEnd}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              step(1);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              step(-1);
            }
          }}
          className="rail mt-6 flex snap-x snap-proximity items-stretch gap-6 overflow-x-auto overscroll-x-contain pb-4 pt-2 sm:gap-8"
        >
          {projects.map((p) => (
            <PlateCard key={p.id} project={p} />
          ))}
        </div>

        <Container>
          <p className="mt-2 font-body text-xs italic text-muted">
            Drag, scroll, or use the arrows — the drawer runs sideways.
          </p>
        </Container>
      </div>

      {/* Closing note */}
      <div
        ref={closing.ref}
        data-inview={closing.visible ? 'true' : 'false'}
        className="mt-14 sm:mt-16"
      >
        <div data-grow className="h-px bg-hairline" />
        <p data-reveal style={delay(0.15)} className="mt-6 font-body text-sm italic text-muted">
          Statuses are kept honest — entries move up the ladder as the work does.
        </p>
      </div>
    </Section>
  );
};

export default Projects;
