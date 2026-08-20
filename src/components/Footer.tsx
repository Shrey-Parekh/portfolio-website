import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Container from './Container';

const nav = [
  { to: '/#about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/experience', label: 'Experience' },
  { to: '/#contact', label: 'Contact' },
];

const elsewhere = [
  { href: 'https://github.com/Shrey-Parekh', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/shrey-parekh-599a44276/', label: 'LinkedIn' },
  { href: 'mailto:shreyparekh3@gmail.com', label: 'Email' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-hairline sm:mt-28">
      <Container className="py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-16">
          {/* Masthead */}
          <div>
            <Link to="/#top" className="font-display text-lg font-semibold text-ink no-underline">
              Shrey <span className="italic text-accent">Parekh</span>
            </Link>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-muted">
              Artificial intelligence, machine learning, and things built with curiosity.
            </p>
            <p className="mt-4 font-body text-xs uppercase tracking-[0.16em] text-muted">
              Mumbai, India · IST
            </p>
          </div>

          {/* Sitemap */}
          <nav className="flex flex-col gap-2.5">
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-accent">Index</p>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="w-fit font-body text-sm text-ink no-underline transition-colors duration-300 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Elsewhere */}
          <nav className="flex flex-col gap-2.5">
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-accent">Elsewhere</p>
            {elsewhere.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-fit font-body text-sm text-ink no-underline transition-colors duration-300 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-hairline pt-6">
          <p className="font-body text-xs text-muted">© {year} Shrey Parekh</p>
          <Link
            to="/#top"
            className="group inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.16em] text-muted no-underline transition-colors duration-300 hover:text-accent"
          >
            Back to top
            <ArrowUp
              size={13}
              className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
