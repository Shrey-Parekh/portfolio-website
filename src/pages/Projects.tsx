import { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '../components/Section';
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

/* Print-style crop marks on the corners of each plate frame. */
const CropMarks = () => (
  <>
    <span aria-hidden="true" className="pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-accent opacity-60" />
    <span aria-hidden="true" className="pointer-events-none absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-accent opacity-60" />
    <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-1.5 h-2.5 w-2.5 border-b border-l border-accent opacity-60" />
    <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-accent opacity-60" />
  </>
);

/* Circular ink-stamp seal carrying the project's status. */
const StatusSeal = ({ status }: { status: string }) => (
  <div className="relative flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-2 border-accent opacity-90 transition-transform duration-700 ease-out group-hover:-rotate-6 sm:h-28 sm:w-28">
    <span aria-hidden="true" className="absolute inset-1.5 rounded-full border border-dashed border-accent opacity-70" />
    <span className="px-3 text-center font-body text-[10px] uppercase leading-snug tracking-[0.18em] text-accent">
      {status}
    </span>
  </div>
);

const Plate = ({ project, index }: { project: Project; index: number }) => {
  const { ref, visible } = useScrollReveal<HTMLElement>(0.2);
  const flipped = index % 2 === 1;

  return (
    <article
      id={project.id}
      ref={ref}
      data-inview={visible ? 'true' : 'false'}
      className="group scroll-mt-24 py-10 sm:py-12"
    >
      <div className="grid grid-cols-1 items-start gap-x-10 gap-y-6 sm:grid-cols-12">
        {/* Plate frame */}
        <div className={`sm:col-span-5 ${flipped ? 'sm:order-2' : ''}`}>
          <div className="imgframe relative border border-hairline bg-panel p-3">
            <CropMarks />
            <div data-wipe style={delay(0.1)}>
              <div className="plate-hatch relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                <span className="absolute left-3 top-1.5 select-none font-display text-2xl italic text-muted opacity-60">
                  {project.numeral}
                </span>
                <StatusSeal status={project.status} />
              </div>
            </div>
          </div>
          <div data-reveal style={delay(0.45)} className="mt-2 flex items-center justify-between gap-2">
            <p className="font-body text-xs italic text-muted">Plate {project.numeral}</p>
            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-muted">
              Figure on release
            </p>
          </div>
        </div>

        {/* Entry text */}
        <div className={`sm:col-span-7 ${flipped ? 'sm:order-1' : ''}`}>
          <div data-reveal style={delay(0.15)} className="flex items-baseline gap-4">
            <span className="font-body text-xs uppercase tracking-[0.18em] text-accent">
              {project.no}
            </span>
            <span className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.14em] ${tagText(project.tag)}`}>
              <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 rounded-full ${tagDot(project.tag)}`} />
              {project.tag}
            </span>
            {project.year && (
              <span className="ml-auto font-body text-xs text-muted">{project.year}</span>
            )}
          </div>

          <h3 className="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">
            <span data-wipe style={delay(0.25)}>{project.title}</span>
          </h3>

          <p data-reveal style={delay(0.35)} className="mt-3 max-w-lg font-body text-sm leading-relaxed text-muted sm:text-base">
            {project.summary}
          </p>

          <p data-reveal style={delay(0.42)} className="mt-4 max-w-lg font-body text-sm text-muted">
            <span className="mr-2 font-body text-xs uppercase tracking-[0.16em] text-accent">
              Current state
            </span>
            <em>{project.state}</em>
          </p>

          {/* Deliverables ledger: label … state, with dotted leaders.
              Rows with an href are live links. */}
          <div data-reveal style={delay(0.5)} className="mt-5 max-w-sm">
            {project.deliverables.map((d) =>
              d.href ? (
                <a
                  key={d.label}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/row flex items-baseline py-1 font-body text-xs no-underline"
                >
                  <span className="uppercase tracking-[0.16em] text-ink">{d.label}</span>
                  <span aria-hidden="true" className="mx-3 flex-1 border-b border-dotted border-hairline" />
                  <span className="flex items-center gap-1 italic text-muted transition-colors duration-300 group-hover/row:text-accent">
                    {d.state}
                    <ArrowUpRight
                      size={11}
                      className="transition-transform duration-300 ease-out group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5"
                    />
                  </span>
                </a>
              ) : (
                <div key={d.label} className="flex items-baseline py-1 font-body text-xs">
                  <span className="uppercase tracking-[0.16em] text-ink">{d.label}</span>
                  <span aria-hidden="true" className="mx-3 flex-1 border-b border-dotted border-hairline" />
                  <span className="italic text-muted">{d.state}</span>
                </div>
              )
            )}
          </div>

          <p data-reveal style={delay(0.58)} className="mt-5 font-body text-xs uppercase tracking-[0.16em] text-muted">
            {project.stack.join('  ·  ')}
          </p>
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const header = useScrollReveal<HTMLDivElement>(0.1);
  const index = useScrollReveal<HTMLDivElement>(0.15);
  const closing = useScrollReveal<HTMLDivElement>(0.3);

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

      {/* Index of works */}
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
              <a
                href={`#${p.id}`}
                className="ledger-row grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-hairline py-3.5 font-body no-underline sm:grid-cols-[3rem_1fr_auto_6rem]"
              >
                <span className="ledger-num text-sm text-muted">{p.no.replace('No. ', '')}</span>
                <span className="text-sm text-ink sm:text-base">{p.title}</span>
                <span className={`hidden text-xs uppercase tracking-[0.14em] sm:inline ${tagText(p.tag)}`}>
                  {p.tag}
                </span>
                <span className="text-right text-xs italic text-muted">{p.statusShort}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Plates */}
      <div className="mt-6 divide-y divide-[color:var(--border)] sm:mt-8">
        {projects.map((p, i) => (
          <Plate key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Closing note */}
      <div
        ref={closing.ref}
        data-inview={closing.visible ? 'true' : 'false'}
        className="mt-4 sm:mt-6"
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
