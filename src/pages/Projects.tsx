import { CSSProperties, KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Section from '../components/Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

export type Tag = 'AI / ML' | 'Web' | 'Hardware';

const TAG_STYLES: Record<Tag, { text: string }> = {
  'AI / ML': { text: 'text-tagSystems' },
  Web: { text: 'text-tagWeb' },
  Hardware: { text: 'text-tagHardware' },
};

export interface Deliverable {
  label: string;
  state: string;
  href?: string;
}

export interface Project {
  id: string;
  no: string;
  numeral: string;
  title: string;
  tag: Tag;
  year?: string;
  status: string;
  statusShort: string;
  state: string;
  /* A deployed, clickable build. Only some works have one, and it is the most
     valuable thing on the plate when it exists, so it is its own field rather
     than a deliverable row. */
  live?: string;
  summary: string;
  stack: string[];
  deliverables: Deliverable[];
}

export const projects: Project[] = [
  {
    id: 'fixr',
    no: 'No. 01',
    numeral: 'I',
    title: 'Fixr: Security Analysis for AI-Generated Codebases',
    tag: 'AI / ML',
    year: '2026',
    status: 'In progress',
    statusShort: 'In progress',
    state: 'Building now. Five-stage pipeline running end to end.',
    summary:
      'A five-stage pipeline that makes scanner output usable. Parallel static analysis (Semgrep, Bandit, pip-audit, Gitleaks) is normalised into one schema, then an XGBoost classifier trained on OWASP Benchmark and SecureVibeBench strips false positives before anything reaches a report. Only the functions and dependencies around validated findings get embedded, never whole repositories, which keeps the pgvector store small enough for LangGraph to retrieve the exact vulnerable code and generate grounded, codebase-aware fixes.',
    stack: ['Python', 'FastAPI', 'XGBoost', 'LangGraph', 'pgvector', 'Kafka', 'Redis', 'React', 'Docker'],
    deliverables: [
      { label: 'Scanners', state: 'Semgrep, Bandit, pip-audit, Gitleaks' },
      { label: 'Classifier', state: 'XGBoost, OWASP Benchmark' },
      { label: 'Retrieval', state: 'pgvector, function-level' },
    ],
  },
  {
    id: 'plate-2',
    no: 'No. 02',
    numeral: 'II',
    title: 'ClassAI: Hybrid Retrieval RAG Assistant',
    tag: 'AI / ML',
    year: '2026',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Shipped via Docker Compose, with JWT auth, rate limiting, and SSE streaming.',
    summary:
      'A hybrid retrieval pipeline fusing bge-m3 dense embeddings in Qdrant with BM25 sparse retrieval via reciprocal rank fusion, re-ranked by a BGE cross-encoder. A two-pass hierarchical splitter cut the chunk kill-rate from 51-75% to 0-4%; inference runs on a locally-hosted Gemma3 12B for privacy.',
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
    title: 'IronLog: ML-Driven Strength Training',
    tag: 'AI / ML',
    year: '2025',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Build complete; nine-step analytics pipeline running end to end.',
    summary:
      'A strength-training platform whose async analytics pipeline (Celery, Redis) pairs a Gaussian Process 1RM predictor with PELT changepoint detection, and a Banister fitness-fatigue model producing per-muscle readiness, feeding an autoregulation engine that adjusts weekly volume from -50% to +20%.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'scikit-learn', 'Docker'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/IronLog' },
      { label: 'Pipeline', state: '9 steps · async' },
      { label: 'Write-up', state: 'planned' },
    ],
  },
  {
    id: 'plate-5',
    no: 'No. 04',
    numeral: 'IV',
    title: 'AI Tutor: PDF Learning Assistant',
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
    no: 'No. 05',
    numeral: 'V',
    title: 'ResumeAI: Resume Management Platform',
    tag: 'AI / ML',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'HR and job-seeker modules with AI scoring, matching, and skill-gap analysis.',
    summary:
      'An AI-powered resume platform with separate HR and job-seeker modules: resume scoring, tailored resume generation, job-description analysis, and skill-gap identification. A Flask / MySQL backend handles multi-format ingest and export (PDF, Word, text) via python-docx, PyPDF2, and ReportLab, with scikit-learn, NLTK, and Pandas driving the analysis.',
    stack: ['Python', 'Flask', 'MySQL', 'scikit-learn', 'NLTK', 'Pandas'],
    deliverables: [
      { label: 'Code', state: 'on GitHub', href: 'https://github.com/Shrey-Parekh/RusumeAI' },
      { label: 'Modules', state: 'HR + job seeker' },
      { label: 'Export', state: 'PDF · Word · Text' },
    ],
  },
  {
    id: 'plate-7',
    no: 'No. 06',
    numeral: 'VI',
    title: 'Game Arena: Realtime Multiplayer Platform',
    tag: 'Web',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Full-stack platform with live rooms, state sync, and in-game chat over WebSockets.',
    live: 'https://game-arena-kappa.vercel.app',
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
    no: 'No. 07',
    numeral: 'VII',
    title: 'LoopIn: College Event and Community Portal',
    tag: 'Web',
    status: 'Complete',
    statusShort: 'Complete',
    state: 'Full-stack events & community portal, deployed on Vercel over a cloud backend.',
    live: 'https://iet-portal.vercel.app',
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
    no: 'No. 08',
    numeral: 'VIII',
    title: 'Trivio: Full-Stack Quiz Platform',
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
    no: 'No. 09',
    numeral: 'IX',
    title: 'Sumo Bot: ESP32 Combat Robot',
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
    no: 'No. 10',
    numeral: 'X',
    title: 'Gesture-Controlled Rover',
    tag: 'Hardware',
    status: 'Built',
    statusShort: 'Built',
    state: 'Hand gestures read by a Python vision app, driving a 4-wheel ESP32 rover.',
    summary:
      'A four-wheeled rover driven by hand gestures: a Python vision application reads the camera feed, recognizes hand poses, and streams movement commands to an ESP32 on the bot. Wave it forward, turn it, stop it. No controller in hand.',
    stack: ['ESP32', 'Python', 'OpenCV', 'Computer vision'],
    deliverables: [
      { label: 'Vision', state: 'Python hand tracking' },
      { label: 'Board', state: 'ESP32' },
      { label: 'Drive', state: '4-wheel rover' },
    ],
  },
];
const tagText = (tag: Tag) => TAG_STYLES[tag].text;

export const ORDER: Tag[] = ['AI / ML', 'Web', 'Hardware'];

const shortName = (p: Project) => p.title.split(':')[0];
const catalogueNo = (p: Project) => p.no.replace(/\D/g, '');

/* "Fixr: Security Analysis for AI-Generated Codebases" is a name and a
   description. Set as one headline it ran to three lines, so the name leads
   and the description follows as a subtitle. */
const splitTitle = (title: string) => {
  const i = title.indexOf(':');
  return i < 0 ? [title, ''] : [title.slice(0, i), title.slice(i + 1).trim()];
};

const linkLabel = (d: Deliverable) => (d.label === 'Code' ? 'Source code' : d.label);

interface PlateProps {
  project: Project;
  position: number;
  prev: Project;
  next: Project;
  onStep: (dir: 1 | -1) => void;
}

/* The plate: the selected work, set large. Keyed on project id so React
   remounts it and the entrance animation replays on every change. */
const Plate = ({ project, position, prev, next, onStep }: PlateProps) => {
  const [name, subtitle] = splitTitle(project.title);
  const links = project.deliverables.filter((d) => d.href);
  const specs = project.deliverables.filter((d) => !d.href);
  const host = project.live ? new URL(project.live).hostname.replace(/^www\./, '') : '';

  return (
    <article className="plate" key={project.id} id={`plate-${project.id}`}>
      <header className="plate-head">
        <span className="plate-no" aria-hidden="true">
          {catalogueNo(project)}
        </span>
        <div className="plate-meta">
          <span className={tagText(project.tag)}>{project.tag}</span>
          {project.year && <span className="plate-year">{project.year}</span>}
          <span className={project.status === 'In progress' ? 'plate-live' : 'plate-status'}>
            {project.status}
          </span>
        </div>
      </header>

      <h2 className="plate-title">
        {name}
        {subtitle && <span className="plate-subtitle">{subtitle}</span>}
      </h2>

      {(project.live || links.length > 0) && (
        <div className="plate-actions">
          {project.live && (
            <a className="plate-action is-primary" href={project.live} target="_blank" rel="noopener noreferrer">
              <span>Visit the live site</span>
              <span className="plate-action-host">{host}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {links.map((d) => (
            <a key={d.label} className="plate-action" href={d.href} target="_blank" rel="noopener noreferrer">
              <span>{linkLabel(d)}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}

      <p className="plate-summary">{project.summary}</p>

      <dl className="plate-spec">
        <div className="spec-row">
          <dt>State</dt>
          <dd>{project.state}</dd>
        </div>
        {specs.map((d) => (
          <div key={d.label} className="spec-row">
            <dt>{d.label}</dt>
            <dd>{d.state}</dd>
          </div>
        ))}
      </dl>

      {/* The technologies are the only imagery this work has, so they are set
          as a field rather than hidden in a caption. */}
      <ul className="plate-stack" aria-label="Built with">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <nav className="plate-nav" aria-label="Step through the works">
        <button type="button" className="plate-step" onClick={() => onStep(-1)}>
          <span className="plate-step-dir">
            <ArrowLeft size={12} aria-hidden="true" /> Previous
          </span>
          <span className="plate-step-name">{shortName(prev)}</span>
        </button>
        <span className="plate-count">
          {String(position + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <button type="button" className="plate-step is-next" onClick={() => onStep(1)}>
          <span className="plate-step-dir">
            Next <ArrowRight size={12} aria-hidden="true" />
          </span>
          <span className="plate-step-name">{shortName(next)}</span>
        </button>
      </nav>
    </article>
  );
};

const Projects = () => {
  const header = useScrollReveal<HTMLDivElement>(0.1);
  const [activeId, setActiveId] = useState(projects[0].id);
  const plateRef = useRef<HTMLDivElement>(null);

  /* A shared link like /projects#fixr selects that work. */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && projects.some((p) => p.id === id)) setActiveId(id);
  }, []);

  const select = useCallback((id: string, scroll: boolean) => {
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
    // Below the lg breakpoint the plate sits under the index, so bring it up.
    // On wide screens only scroll when the new plate starts above the view,
    // which is where Next leaves you after reading to the end of a long one.
    if (!scroll) return;
    requestAnimationFrame(() => {
      const plate = plateRef.current;
      if (!plate) return;
      const narrow = window.matchMedia('(max-width: 1023px)').matches;
      if (narrow || plate.getBoundingClientRect().top < 0) {
        plate.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, []);

  /* Up/down arrows walk the whole catalogue, across group boundaries. */
  const onIndexKey = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const i = projects.findIndex((p) => p.id === activeId);
      const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
      const target = projects[(next + projects.length) % projects.length];
      select(target.id, false);
      document.getElementById(`idx-${target.id}`)?.focus();
    },
    [activeId, select]
  );

  const position = Math.max(0, projects.findIndex((p) => p.id === activeId));
  const active = projects[position];
  const at = (offset: number) => projects[(position + offset + projects.length) % projects.length];
  const step = (dir: 1 | -1) => select(at(dir).id, true);
  const groups = ORDER.map((tag) => ({
    tag,
    items: projects.filter((p) => p.tag === tag),
  })).filter((g) => g.items.length > 0);

  return (
    <Section id="projects">
      <div ref={header.ref} data-inview={header.visible ? 'true' : 'false'}>
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">03</span>
          <span className="font-body text-sm italic text-accent">Projects</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <h1 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Ten works, grouped by{' '}
            <em className="font-display italic text-accent">what they actually are</em>. Pick one
            from the index.
          </span>
        </h1>
      </div>

      {/* Catalogue and plate: the index stays put, the work changes beside it. */}
      <div className="works">
        <nav
          className="works-index"
          aria-label="Index of works"
          onKeyDown={onIndexKey}
        >
          {groups.map((group) => (
            <div key={group.tag} className="idx-group">
              <p className={`idx-group-name ${tagText(group.tag)}`}>{group.tag}</p>
              <ul>
                {group.items.map((p) => (
                  <li key={p.id}>
                    <button
                      id={`idx-${p.id}`}
                      type="button"
                      onClick={() => select(p.id, true)}
                      aria-current={p.id === activeId}
                      className={`idx-row ${p.id === activeId ? 'is-on' : ''}`}
                    >
                      <span aria-hidden="true" className="idx-no">
                        {catalogueNo(p)}
                      </span>
                      <span className="idx-name">{shortName(p)}</span>
                      {p.live ? (
                        <span className="idx-flag is-live">Live</span>
                      ) : p.statusShort === 'In progress' ? (
                        <span className="idx-flag">Building</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="works-plate" ref={plateRef}>
          <Plate project={active} position={position} prev={at(-1)} next={at(1)} onStep={step} />
        </div>
      </div>
    </Section>
  );
};

export default Projects;
