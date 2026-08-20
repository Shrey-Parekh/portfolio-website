import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import TextureOverlay from './components/TextureOverlay';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Experience from './pages/Experience';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext';

const SITE_URL = 'https://shrey-parekh.vercel.app';

interface PageMeta {
  title: string;
  description: string;
}

/* Every route is served the same index.html, so without this each page would
   report the home page's description, canonical and Open Graph tags. Search
   engines then see four near-duplicate pages instead of four distinct ones. */
const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Shrey Parekh — AI/ML Engineer & Developer Portfolio',
    description:
      'Shrey Parekh is a final-year computer engineering student in Mumbai, India, specialising in artificial intelligence and machine learning. Portfolio of AI and ML projects, research papers, experience, and résumé.',
  },
  '/projects': {
    title: 'Projects — AI, Machine Learning & Web Builds | Shrey Parekh',
    description:
      'Ten engineering projects by Shrey Parekh across AI and machine learning, web, and hardware: security analysis pipelines, retrieval-augmented systems, realtime multiplayer platforms, and robotics. Live demos and source code.',
  },
  '/blogs': {
    title: 'Research Papers — Machine Learning & Computer Vision | Shrey Parekh',
    description:
      'Research papers by Shrey Parekh on applied machine learning, computer vision, and reinforcement learning, covering traffic signal control, handwriting analysis, e-waste detection, and crime classification.',
  },
  '/experience': {
    title: 'Experience & Leadership — Shrey Parekh',
    description:
      'The professional and extracurricular record of Shrey Parekh: engineering experience, AI and machine learning work, and student committee leadership at NMIMS MPSTME, Mumbai.',
  },
};

const NOT_FOUND_META: PageMeta = {
  title: 'Page not found — Shrey Parekh',
  description: 'That page is not in the index. Browse the projects, papers, and experience instead.',
};

/* Meta tags live in index.html, so they are updated in place rather than
   rendered: one helper for <meta>, one for the canonical <link>. */
function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute('content', content);
}

function setCanonical(href: string) {
  const el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (el) el.setAttribute('href', href);
}

/* On route change: keep the document title in sync, and scroll to the hash
   target if there is one (the section mounts with the route), else to the top. */
function RouteManager() {
  const location = useLocation();

  useEffect(() => {
    const meta = PAGE_META[location.pathname] ?? NOT_FOUND_META;
    const url = `${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);
    setCanonical(url);

    /* A missing page must not invite indexing under its own URL. */
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) {
      robots.setAttribute(
        'content',
        PAGE_META[location.pathname] ? 'index, follow' : 'noindex, follow'
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeProvider value={{ isDarkMode, toggleTheme }}>
      <TextureOverlay />
      <Cursor />
      <RouteManager />
      <Analytics />
      <div id="top" className="relative flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
