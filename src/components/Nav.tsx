import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

const ToggleButton = ({
  isDarkMode,
  toggleTheme,
}: {
  isDarkMode: boolean;
  toggleTheme: () => void;
}) => (
  <button
    onClick={toggleTheme}
    className="toggle-flip h-[26px] w-[58px] shrink-0 rounded-sm border border-hairline font-body text-xs text-ink"
    aria-label="Toggle day and night theme"
  >
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
  </button>
);

const Nav = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
        <a href="#top" className="font-display text-base font-semibold text-ink no-underline">
          Shrey Parekh
        </a>

        <nav className="hidden items-center gap-6 font-body text-sm sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="link-annotate">
              {link.label}
            </a>
          ))}
          <ToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </nav>

        <div className="flex items-center gap-4 sm:hidden">
          <ToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-rise flex flex-col gap-1 border-t border-hairline px-6 py-4 font-body text-sm sm:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-ink no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Nav;
