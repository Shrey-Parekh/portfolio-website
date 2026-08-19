import { CSSProperties } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import Section from './Section';
import { useScrollReveal } from '../hooks/useScrollReveal';

type DelayStyle = CSSProperties & Record<'--d', string>;

const delay = (seconds: number): DelayStyle => ({ '--d': `${seconds}s` });

interface Channel {
  label: string;
  handle: string;
  href?: string;
}

const channels: Channel[] = [
  {
    label: 'LinkedIn',
    handle: 'shrey-parekh',
    href: 'https://www.linkedin.com/in/shrey-parekh-599a44276/',
  },
  {
    label: 'GitHub',
    handle: 'Shrey-Parekh',
    href: 'https://github.com/Shrey-Parekh',
  },
];

/* Stamp and postmark, franked into the corner of the address side.
   This sits in the layout rather than floating over it: as an absolutely
   positioned overlay it landed on whatever row happened to be beneath it,
   and the column underneath had to dodge it with a hand-set top margin. */
const PostageStamp = () => (
  <div aria-hidden="true" className="stamp-block">
    <span className="postmark">
      <span className="postmark-ring" />
      <span className="postmark-text">
        Mumbai
        <br />
        India
      </span>
    </span>
    <span className="stamp">
      <span className="stamp-face">
        <span className="stamp-mono">SP</span>
        <span className="stamp-city">Mumbai</span>
      </span>
    </span>
  </div>
);

const ChannelRow = ({ channel, d }: { channel: Channel; d: number }) => {
  const inner = (
    <>
      <span className="font-body text-xs uppercase tracking-[0.16em] text-ink">
        {channel.label}
      </span>
      <span aria-hidden="true" className="chan-leader mx-3 flex-1" />
      {channel.href ? (
        <span className="flex items-center gap-1 font-body text-sm italic text-muted transition-colors duration-300 group-hover:text-accent">
          {channel.handle}
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      ) : (
        <span className="font-body text-sm italic text-muted opacity-70">{channel.handle}</span>
      )}
    </>
  );

  if (channel.href) {
    return (
      <a
        data-reveal
        style={delay(d)}
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        className="chan-row group flex items-baseline py-2.5 no-underline"
      >
        {inner}
      </a>
    );
  }
  return (
    <div data-reveal style={delay(d)} className="flex items-baseline py-2.5">
      {inner}
    </div>
  );
};

const Contact = () => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>(0.15);

  return (
    <Section id="contact">
      <div ref={ref} data-inview={visible ? 'true' : 'false'}>
        {/* Header */}
        <div data-reveal className="mb-8 flex items-baseline gap-3 sm:mb-10">
          <span className="font-body text-sm text-muted">05</span>
          <span className="font-body text-sm italic text-accent">Contact</span>
          <span data-grow style={delay(0.1)} className="ml-2 h-px flex-1 bg-hairline" />
        </div>

        <h2 className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl lg:text-[1.7rem]">
          <span data-wipe style={delay(0.15)}>
            The inbox is <em className="font-display italic text-accent">open</em>, for work,
            ideas, or a good F1 take.
          </span>
        </h2>

        {/* Postcard */}
        <div data-reveal style={delay(0.3)} className="relative mt-10 border border-hairline bg-panel sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-[color:var(--border)]">
            {/* Correspondence half. Email is the one action worth taking here,
                so it is the only thing on the card set at display size. */}
            <div className="flex flex-col p-6 sm:p-8">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">
                Correspondence
              </p>

              <a
                href="mailto:shreyparekh3@gmail.com"
                className="group/mail mt-5 w-fit no-underline"
              >
                <span className="block font-display text-xl leading-tight text-ink transition-colors duration-300 group-hover/mail:text-accent sm:text-2xl">
                  shreyparekh3@gmail.com
                </span>
                <span className="mt-2 flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.16em] text-mutedStrong transition-colors duration-300 group-hover/mail:text-accent">
                  Write a note
                  <ArrowUpRight
                    size={12}
                    className="transition-transform duration-300 ease-out group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5"
                  />
                </span>
              </a>

              <a
                href="tel:+919004905435"
                className="mt-5 w-fit border-t border-hairline pt-5 font-body text-sm text-muted no-underline transition-colors duration-300 hover:text-ink"
              >
                +91 90049 05435
              </a>

              <p className="mt-auto pt-6 max-w-xs font-body text-sm italic leading-relaxed text-muted">
                Mail gets read daily. Expect a reply within a day or two.
              </p>
            </div>

            {/* Elsewhere half */}
            <div className="flex flex-col border-t border-hairline p-6 sm:border-t-0 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">
                  Elsewhere
                </p>
                <PostageStamp />
              </div>

              <div className="mt-3">
                {channels.map((c, i) => (
                  <ChannelRow key={c.label} channel={c} d={0.4 + i * 0.1} />
                ))}
              </div>

              {/* Availability: the thing a visitor is actually trying to work
                  out when they reach this card. */}
              <div data-reveal style={delay(0.6)} className="mt-auto border-t border-hairline pt-5">
                <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mutedStrong">
                  Availability
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink">
                  Open to internships and collaborations, from January 2027.
                </p>
                <p className="mt-3 font-body text-xs italic text-muted">
                  Mumbai, India · IST (UTC +5:30)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé band */}
        <div
          data-reveal
          style={delay(0.5)}
          className="mt-6 flex flex-col gap-5 border border-hairline bg-panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">
              Curriculum vitae
            </p>
            <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-muted">
              The full record in print form: education, experience, and the works catalogued
              above, on a single page.
            </p>
          </div>
          <a
            href="/resume.pdf"
            download="Shrey-Parekh-Resume.pdf"
            className="group/dl inline-flex w-fit shrink-0 items-center gap-3 border border-hairline bg-surface px-4 py-2.5 no-underline transition-colors duration-300 hover:border-accent"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-hairline text-accent transition-transform duration-300 ease-out group-hover/dl:translate-y-0.5">
              <Download size={14} />
            </span>
            <span className="flex flex-col">
              <span className="font-body text-sm text-ink">Download résumé</span>
              <span className="font-body text-[10px] uppercase tracking-[0.16em] text-muted">
                PDF · one page
              </span>
            </span>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
