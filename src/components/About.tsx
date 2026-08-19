import { CSSProperties } from 'react';
import Section from './Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

const details = [
  { label: 'Degree', value: 'B.Tech Computer Engineering, AI/ML' },
  // Comma list with no conjunction, matching the other fields. The non-breaking
  // space keeps "data science" whole so the value can't orphan a word.
  { label: 'Focus', value: 'AI, ML, data science' },
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Status', value: 'Open to internships and collaborations' },
];

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

const About = () => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(0.15);

  return (
    <Section id="about">
      <div ref={ref} data-inview={visible ? 'true' : 'false'}>
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">02</span>
          <span className="font-body text-sm italic text-accent">About</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-x-12">
          <div className="mx-auto w-44 sm:mx-0 sm:mt-1 sm:w-full">
            <div data-wipe style={delay(0.05)}>
              <div className="imgframe relative">
                {/* WebP at 480w covers a 2.4x display; the PNG stays as the
                    fallback for anything that cannot decode it. Intrinsic
                    dimensions are declared so the frame reserves its space and
                    the surrounding text does not jump when the image lands. */}
                <picture>
                  <source srcSet="/portrait.webp" type="image/webp" />
                  <img
                    src="/portrait.png"
                    alt="Shrey Parekh"
                    width={480}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full grayscale-[8%] sepia-[6%] contrast-[1.02]"
                  />
                </picture>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-hairline" />
              </div>
            </div>
            <div data-reveal style={delay(0.5)} className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-body text-xs italic text-muted">Fig. 01</p>
              <p className="font-body text-[10px] uppercase tracking-[0.14em] text-muted">
                Shrey Parekh
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl lg:text-[2.1rem]">
              <span data-wipe style={delay(0.15)}>
                I build things because I'm{' '}
                <em className="font-display italic text-accent">curious</em>. I unplug just as
                deliberately.
              </span>
            </h2>

            <div data-reveal style={delay(0.4)} className="mt-5 flex max-w-xl flex-col gap-5">
              <p className="font-body text-base leading-relaxed text-muted sm:text-lg">
                <span
                  aria-hidden="true"
                  className="float-left mr-2 mt-1 font-display text-[2.9rem] leading-[0.8] text-accent"
                >
                  I
                </span>
                <span className="sr-only">I</span>'m a final-year computer engineering student at
                NMIMS MPSTME in Mumbai, focused on AI and machine learning. I like figuring out
                how something works and then building my own version of it.
              </p>
              <p className="font-body text-base leading-relaxed text-muted sm:text-lg">
                I try not to spend all day at a desk though. I like being outdoors and staying
                active when I can. When I'm not doing that, it's usually sports, gaming, or
                watching F1. I also watch a lot of movies and shows, comedy, sci-fi, horror,
                mystery thrillers, basically all of it. If it's good, I've probably already seen
                it.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-14">
          <div data-grow style={delay(0.15)} className="h-px bg-hairline" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4">
            {details.map((d, i) => (
              <div
                key={d.label}
                data-reveal
                style={delay(0.2 + i * 0.12)}
                className="border-b border-r border-hairline px-4 py-4 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:last-child]:border-r-0 sm:border-b-0"
              >
                <p className="font-body text-xs uppercase tracking-[0.15em] text-accent">
                  {d.label}
                </p>
                <p className="mt-1.5 font-body text-sm leading-snug text-ink sm:text-base">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
