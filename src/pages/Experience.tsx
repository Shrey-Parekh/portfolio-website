import { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '../components/Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

interface Role {
  id: string;
  role: string;
  org: string;
  period: string;
  place?: string;
  points: string[];
  href?: string;
  hrefLabel?: string;
}

const experience: Role[] = [
  {
    id: 'exp-1',
    role: 'Data Analyst Intern',
    org: 'Shrey Polyplast',
    period: 'May – Jun 2026',
    place: 'Mumbai',
    points: [
      'Cleaned and analysed sales, dispatch, and IndiaMART enquiry data in Python and Pandas for a plastic injection-molding business, surfacing product-line, seasonal, and customer demand patterns.',
      'Turned those findings into charts that guided marketing focus and production planning across the measuring-cup and bottle-cap lines.',
    ],
  },
  {
    id: 'exp-2',
    role: 'Web Development Intern',
    org: 'DealBee',
    period: 'May – Oct 2025',
    place: 'WordPress · PHP · MySQL',
    points: [
      'Maintained and extended a high-traffic affiliate commerce platform spanning 80,000+ product listings across 15+ categories; owned theme and plugin customisation, template fixes, and front-end regressions.',
      'Streamlined product ingestion and affiliate link tracking across Amazon and Flipkart programmes, and tuned on-page SEO, structured metadata, and page-load performance ahead of peak sale campaigns.',
    ],
  },
  {
    id: 'exp-3',
    role: 'Web Development Mentor',
    org: 'We Can We Will Foundation',
    period: '70+ volunteer hours',
    place: 'Community service',
    points: [
      'Taught underprivileged children the basics of website development, HTML and CSS, walking them from their first tags to their first working pages.',
      'Logged 70+ volunteer hours with the foundation, building teaching material pitched for absolute beginners.',
    ],
  },
];

const leadership: Role[] = [
  {
    id: 'lead-1',
    role: 'Technical Head',
    org: 'IET MPSTME Student Chapter',
    period: 'Jul 2025 – May 2026',
    points: [
      'Built and deployed the chapter’s student portal.',
      'Ran an AI Voice Assistant workshop (50+ attendees) and a coding contest.',
    ],
    href: 'https://iet-portal.vercel.app',
    hrefLabel: 'iet-portal.vercel.app',
  },
  {
    id: 'lead-2',
    role: 'Technical Executive',
    org: 'IET MPSTME Student Chapter',
    period: 'Jul 2024 – May 2025',
    points: ['Ran technical workshops and events for the chapter before stepping up to Technical Head.'],
  },
  {
    id: 'lead-3',
    role: 'Technical Executive',
    org: 'ACM MPSTME Student Chapter',
    period: 'Jul 2023 – May 2024',
    points: ['Supported technical events and workshops for the campus chapter.'],
  },
  {
    id: 'lead-4',
    role: 'Photography Executive',
    org: 'IEC MPSTME',
    period: '2022 · 6 months',
    points: ['Covered committee events as part of the photography team.'],
  },
];

const interests = ['Outdoors & adventure', 'Sports', 'Gaming', 'Formula 1', 'Films & series'];

const RoleEntry = ({ role, d }: { role: Role; d: number }) => (
  <div data-reveal style={delay(d)} className="relative pl-9">
    {/* registration marker straddling the timeline */}
    <span
      aria-hidden="true"
      className="absolute left-2 top-1.5 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-accent bg-surface"
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
    </span>

    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="font-display text-lg text-ink sm:text-xl">
        <span className="italic text-accent">{role.role}</span>
        <span className="text-muted"> · {role.org}</span>
      </h3>
      <span className="font-body text-xs uppercase tracking-[0.14em] text-muted">
        {role.period}
        {role.place ? ` · ${role.place}` : ''}
      </span>
    </div>

    <ul className="mt-3 flex flex-col gap-2">
      {role.points.map((p, i) => (
        <li key={i} className="flex gap-2.5 font-body text-sm leading-relaxed text-muted sm:text-base">
          <span aria-hidden="true" className="mt-[2px] shrink-0 text-accent">—</span>
          <span>{p}</span>
        </li>
      ))}
    </ul>

    {role.href && (
      <a
        href={role.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link mt-3 inline-flex items-center gap-1 font-body text-xs italic text-muted no-underline transition-colors duration-300 hover:text-accent"
      >
        {role.hrefLabel ?? role.href}
        <ArrowUpRight
          size={12}
          className="transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        />
      </a>
    )}
  </div>
);

const Kicker = ({ num, label, d = 0 }: { num: string; label: string; d?: number }) => (
  <div data-reveal style={delay(d)} className="mb-8 flex items-baseline gap-3 sm:mb-10">
    <span className="font-body text-sm text-muted">{num}</span>
    <span className="font-body text-sm italic text-accent">{label}</span>
    <span data-grow style={delay(d + 0.1)} className="ml-2 h-px flex-1 bg-hairline" />
  </div>
);

const Experience = () => {
  const exp = useScrollReveal<HTMLDivElement>(0.12);
  const extra = useScrollReveal<HTMLDivElement>(0.12);

  return (
    <Section id="experience" className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-10 top-48 hidden font-body text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl] xl:block"
      >
        Record, work & off-hours
      </span>

      {/* 06 — Experience */}
      <div ref={exp.ref} data-inview={exp.visible ? 'true' : 'false'}>
        <Kicker num="06" label="Experience" />

        <h2 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            Where the work has taken me so far,{' '}
            <em className="font-display italic text-accent">and where it’s going next</em>.
          </span>
        </h2>

        <div className="relative mt-10 sm:mt-12">
          {/* the timeline rule */}
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 bottom-2 w-px bg-hairline"
          />
          <div className="flex flex-col gap-10">
            {experience.map((r, i) => (
              <RoleEntry key={r.id} role={r} d={0.25 + i * 0.12} />
            ))}

            {/* open-to-more marker */}
            <div data-reveal style={delay(0.45)} className="relative pl-9">
              <span
                aria-hidden="true"
                className="absolute left-2 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-dashed border-accent bg-surface"
              />
              <p className="font-body text-sm italic text-muted">
                Open to the next one. Internships and collaborations from Jan 2027.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 07 — Extracurriculars */}
      <div ref={extra.ref} data-inview={extra.visible ? 'true' : 'false'} className="mt-20 sm:mt-28">
        <Kicker num="07" label="Extracurriculars" />

        <div className="relative mt-2">
          <span aria-hidden="true" className="absolute left-2 top-2 bottom-2 w-px bg-hairline" />
          <div className="flex flex-col gap-10">
            {leadership.map((r, i) => (
              <RoleEntry key={r.id} role={r} d={0.25 + i * 0.12} />
            ))}
          </div>
        </div>

        {/* Off the clock: set as a run-in colophon line rather than boxed tags.
            Five bordered chips read as UI controls you could click; these are
            just things he does, so they are set in the display face and divided
            by hairlines, the way a masthead runs its credits. */}
        <div data-reveal style={delay(0.5)} className="mt-14">
          <div className="flex items-center gap-4">
            <p className="shrink-0 font-body text-xs uppercase tracking-[0.18em] text-accent">
              Off the clock
            </p>
            <div data-grow style={delay(0.15)} className="h-px flex-1 bg-hairline" />
          </div>
          <ul className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
            {interests.map((tag, i) => (
              <li key={tag} className="flex items-baseline gap-x-5">
                {i > 0 && <span aria-hidden="true" className="h-3.5 w-px bg-hairline" />}
                <span className="interest font-display text-lg italic leading-none text-ink sm:text-xl">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Closing note */}
      <div className="mt-16 sm:mt-20">
        <div data-grow className="h-px bg-hairline" />
        <p className="mt-6 font-body text-sm italic text-muted">
          The record grows as the work does. Roles are updated as they change.
        </p>
      </div>
    </Section>
  );
};

export default Experience;
