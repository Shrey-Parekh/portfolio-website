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
  {
    label: 'Instagram',
    handle: 'handle to come',
  },
];

/* A small postage stamp with a postmark, cornering the address card. */
const PostageStamp = () => (
  <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 hidden rotate-3 sm:block">
    <div className="flex h-16 w-14 items-center justify-center border border-hairline bg-surface p-1">
      <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 border border-dashed border-accent">
        <span className="font-display text-lg italic text-accent">SP</span>
        <span className="font-body text-[8px] uppercase tracking-[0.2em] text-muted">Mumbai</span>
      </div>
    </div>
    <div className="absolute -left-8 top-2 flex h-14 w-14 -rotate-12 items-center justify-center rounded-full border border-muted opacity-40">
      <span className="text-center font-body text-[7px] uppercase leading-tight tracking-[0.18em] text-muted">
        Mum
        <br />
        Ind
      </span>
    </div>
  </div>
);

const ChannelRow = ({ channel, d }: { channel: Channel; d: number }) => {
  const inner = (
    <>
      <span className="font-body text-xs uppercase tracking-[0.16em] text-ink">
        {channel.label}
      </span>
      <span aria-hidden="true" className="mx-3 flex-1 border-b border-dotted border-hairline" />
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
        className="group flex items-baseline py-2.5 no-underline"
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
            The inbox is <em className="font-display italic text-accent">open</em> — about work,
            ideas, or a good F1 take.
          </span>
        </h2>

        {/* Postcard */}
        <div data-reveal style={delay(0.3)} className="relative mt-10 border border-hairline bg-panel sm:mt-12">
          <PostageStamp />
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-[color:var(--border)]">
            {/* Correspondence half */}
            <div className="p-6 sm:p-8">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">
                Correspondence
              </p>
              <div className="mt-5 flex flex-col gap-4">
                <a
                  href="mailto:shreyparekh3@gmail.com"
                  className="link-annotate w-fit font-display text-lg text-ink sm:text-xl"
                >
                  shreyparekh3@gmail.com
                </a>
                <a
                  href="tel:+919004905435"
                  className="w-fit font-body text-sm text-muted no-underline transition-colors duration-300 hover:text-ink"
                >
                  +91 90049 05435
                </a>
              </div>
              <p className="mt-6 max-w-xs font-body text-sm italic leading-relaxed text-muted">
                Mail gets read daily — expect a reply within a day or two.
              </p>
            </div>

            {/* Elsewhere half */}
            <div className="border-t border-hairline p-6 sm:border-t-0 sm:p-8 sm:pt-8">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">Elsewhere</p>
              <div className="mt-4 sm:mt-14">
                {channels.map((c, i) => (
                  <ChannelRow key={c.label} channel={c} d={0.4 + i * 0.1} />
                ))}
              </div>
              <p className="mt-4 font-body text-xs italic text-muted">
                Based in Mumbai, India · IST (UTC +5:30)
              </p>
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
              The full record in print form — education, experience, and the works catalogued
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
