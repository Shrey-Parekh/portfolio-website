import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Container from './Container';

type NavLink =
  | { kind: 'hash'; href: string; label: string }
  | { kind: 'route'; href: string; label: string };

const links: NavLink[] = [
  { kind: 'hash', href: '#about', label: 'About' },
  { kind: 'route', href: '/projects', label: 'Projects' },
  { kind: 'route', href: '/blogs', label: 'Blogs' },
  { kind: 'route', href: '/experience', label: 'Experience' },
  { kind: 'hash', href: '#contact', label: 'Contact' },
];

const SunGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
  </svg>
);

const MoonGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ToggleButton = ({
  isDarkMode,
  toggleTheme,
}: {
  isDarkMode: boolean;
  toggleTheme: () => void;
}) => (
  <button
    onClick={toggleTheme}
    className="toggle-flip flex h-[32px] w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-sm border border-hairline px-2 font-body text-sm text-ink transition-colors duration-300 hover:border-accent sm:w-[86px] sm:justify-start"
    aria-label="Toggle day and night theme"
    aria-pressed={isDarkMode}
  >
    {/* Celestial dial: sun and moon on a strip that slides behind a window,
        mirroring the placard flip of the word beside it. */}
    <span aria-hidden="true" className="relative h-[18px] w-[18px] shrink-0 overflow-hidden">
      <span
        className={`flex flex-col transition-transform duration-[450ms] ease-inout ${
          isDarkMode ? '-translate-y-[18px]' : 'translate-y-0'
        }`}
      >
        <span className="flex h-[18px] w-[18px] items-center justify-center text-accent">
          <MoonGlyph />
        </span>
        <span className="flex h-[18px] w-[18px] items-center justify-center text-accent">
          <SunGlyph />
        </span>
      </span>
    </span>

    <span className="relative hidden h-full flex-1 overflow-hidden sm:block">
      <span
        className={`word transition-all ${
          isDarkMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        Night
      </span>
      <span
        className={`word transition-all ${
          isDarkMode ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        Day
      </span>
    </span>
  </button>
);

const Nav = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sections = links
      .filter((link): link is Extract<NavLink, { kind: 'hash' }> => link.kind === 'hash')
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const isActive = (link: NavLink) =>
    link.kind === 'route' ? location.pathname === link.href : isHome && activeHash === link.href;

  const renderLink = (
    link: NavLink,
    classNameFor: (active: boolean) => string,
    onClick?: () => void
  ) => {
    const active = isActive(link);
    if (link.kind === 'route') {
      return (
        <Link key={link.href} to={link.href} onClick={onClick} className={classNameFor(active)}>
          {link.label}
        </Link>
      );
    }
    if (!isHome) {
      // Client-side hop back to the home page; ScrollManager handles the hash.
      return (
        <Link key={link.href} to={`/${link.href}`} onClick={onClick} className={classNameFor(active)}>
          {link.label}
        </Link>
      );
    }
    return (
      <a key={link.href} href={link.href} onClick={onClick} className={classNameFor(active)}>
        {link.label}
      </a>
    );
  };

  return (
    <header
      className={`sticky top-0 z-20 border-b border-hairline transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-surface/90 shadow-sm backdrop-blur-md' : 'bg-surface'
      }`}
    >
      <Container className="flex items-center justify-between py-4 sm:py-5">
        {(() => {
          // The wordmark is the site's "go home" control. On the home page a
          // plain hash anchor is enough (id="top" wraps every route, so a
          // bare #top from another page would just scroll that page's own
          // top rather than navigating anywhere) — off it, a real route Link
          // to "/#top" is required, same cross-page pattern the nav's own
          // hash links already use.
          const brand = (
            <>
              <span className="brand-mark flex h-7 w-7 shrink-0 items-center justify-center border border-hairline transition-colors duration-300 group-hover:border-accent">
                <span className="font-display text-[13px] italic leading-none text-accent">
                  SP
                </span>
              </span>
              <span className="relative font-display text-lg font-semibold text-ink transition-[letter-spacing] duration-300 group-hover:tracking-[0.02em] sm:text-xl">
                Shrey <span className="italic text-accent">Parekh</span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </span>
            </>
          );
          const brandClass = 'group flex items-center gap-2.5 no-underline';
          return isHome ? (
            <a href="#top" className={brandClass}>
              {brand}
            </a>
          ) : (
            <Link to="/#top" className={brandClass}>
              {brand}
            </Link>
          );
        })()}

        <nav className="hidden items-center gap-8 font-body text-base sm:flex">
          {links.map((link) =>
            renderLink(
              link,
              (active) => `link-annotate ${active ? 'is-active text-accent' : ''}`
            )
          )}
          <ToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </nav>

        <div className="flex items-center gap-4 sm:hidden">
          <ToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center text-ink"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-hairline sm:hidden">
          <Container className="animate-rise flex flex-col py-2 font-body text-base">
            {links.map((link) =>
              renderLink(
                link,
                (active) => `flex min-h-[44px] items-center no-underline ${active ? 'text-accent' : 'text-ink'}`,
                () => setOpen(false)
              )
            )}
          </Container>
        </nav>
      )}
    </header>
  );
};

export default Nav;
