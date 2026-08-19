import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Section from '../components/Section';

/* Pages that do exist, offered as a way out rather than making the reader
   guess at the URL a second time. */
const elsewhere = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/experience', label: 'Experience' },
  { to: '/#contact', label: 'Contact' },
];

/* A return slip rather than an error screen: the catalogue metaphor the rest
   of the site runs on already has a word for a page that isn't in the index. */
const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <Section id="not-found">
      <div className="flex items-center gap-4">
        <p className="shrink-0 font-body text-xs uppercase tracking-[0.18em] text-accent">
          Return slip
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
      </div>

      <h1 className="mt-8 font-display text-6xl italic leading-none text-accent sm:text-7xl">404</h1>

      <p className="mt-6 max-w-lg font-display text-xl leading-snug text-ink sm:text-2xl">
        Not in the index.
      </p>

      <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-muted">
        Nothing is catalogued at{' '}
        <span className="break-all italic text-ink">{pathname}</span>. It may have been renamed, or
        the address may have picked up a typo on the way here.
      </p>

      <div className="mt-10 border-t border-hairline pt-6">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-accent">Try instead</p>
        <ul className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-3">
          {elsewhere.map((item, i) => (
            <li key={item.to} className="flex items-baseline gap-x-5">
              {i > 0 && <span aria-hidden="true" className="h-3.5 w-px bg-hairline" />}
              <Link
                to={item.to}
                className="interest font-display text-lg italic leading-none text-ink no-underline sm:text-xl"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/"
        className="group mt-12 inline-flex items-center gap-2 font-body text-sm text-muted no-underline transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
        />
        Back to the front page
      </Link>
    </Section>
  );
};

export default NotFound;
