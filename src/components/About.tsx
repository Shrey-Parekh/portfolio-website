import { CSSProperties } from 'react';
import Section from './Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

const details = [
  { label: 'Degree', value: 'B.Tech Computer Engineering, AI/ML' },
  { label: 'Focus', value: 'Multi agent systems, applied ML' },
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
                <img
                  src="/portrait.png"
                  alt="Shrey Parekh"
                  className="w-full grayscale-[8%] sepia-[6%] contrast-[1.02]"
                />
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
                I build with <em className="font-display italic text-accent">curiosity</em>, and
                unplug just as intentionally.
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
                NMIMS MPSTME in Mumbai, and I'm all in on AI and machine learning. I love digging
                into how things work and building systems that actually solve problems worth
                solving. Alongside classes, I've been running campus tech chapters and helping
                beginners write their very first lines of code — genuinely one of my favorite parts
                of college.
              </p>
              <p className="font-body text-base leading-relaxed text-muted sm:text-lg">
                I try not to be glued to a desk all day though. I'm big on the outdoors and will
                jump at any excuse for something adventurous. When I'm winding down, it's usually
                sports, some gaming, or catching F1. And I'm a serious binge-watcher — comedy,
                sci-fi, horror, mystery thrillers, if it's good, I've probably already seen it.
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
