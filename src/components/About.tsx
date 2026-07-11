import Reveal from './Reveal';

const details = [
  { label: 'Degree', value: 'B.Tech Computer Engineering, AI/ML' },
  { label: 'Focus', value: 'Multi agent systems, applied ML' },
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Status', value: 'Open to Jan 2027 internships' },
];

const About = () => {
  return (
    <section id="about" className="relative mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="flex items-baseline gap-3 border-b border-hairline pb-3">
          <span className="font-body text-xs text-muted">02</span>
          <span className="font-body text-xs italic text-accent">About</span>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-[minmax(0,9rem)_1fr]">
        <Reveal delay={80} className="sm:mt-12 sm:-ml-2">
          <div className="mx-auto w-40 sm:mx-0 sm:w-full">
            <div className="border border-hairline bg-panel p-3">
              <img
                src="/image.jpg"
                alt="Shrey Parekh"
                className="aspect-[4/5] w-full object-cover grayscale-[8%] sepia-[6%] contrast-[1.02]"
              />
            </div>
            <p className="mt-2 font-body text-[10px] italic text-muted">Fig. 01</p>
          </div>
        </Reveal>

        <div>
          <Reveal delay={140}>
            <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
              I build at the intersection of multi agent systems and applied machine learning.
            </p>
          </Reveal>

          <Reveal delay={220} className="mt-5">
            <p className="font-body text-sm leading-relaxed text-muted sm:text-base">
              I'm a final-year computer engineering student at NMIMS MPSTME in Mumbai, working
              through a six-year integrated program specialized in AI/ML. Most of what I make
              starts as a question I wanted to answer for myself — graph attention networks for
              traffic signal control, retrieval augmented systems for institutional knowledge, and
              the occasional gym tracker that leans on Gaussian processes more than it needs to.
            </p>
          </Reveal>

          <Reveal delay={280} className="mt-4">
            <p className="font-body text-sm leading-relaxed text-muted sm:text-base">
              Outside coursework, I've led technical teams at IET and ACM's campus chapters and
              spent time teaching web development to students who hadn't written a line of code
              before.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120} className="mt-14">
        <div className="grid grid-cols-2 border-t border-hairline sm:grid-cols-4">
          {details.map((d) => (
            <div key={d.label} className="border-b border-r border-hairline px-4 py-4 last:border-r-0 sm:border-b-0">
              <p className="font-body text-[10px] uppercase tracking-[0.15em] text-accent">
                {d.label}
              </p>
              <p className="mt-1.5 font-body text-xs leading-snug text-ink sm:text-sm">{d.value}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default About;
