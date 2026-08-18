import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import TextureOverlay from './components/TextureOverlay';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Experience from './pages/Experience';
import { ThemeProvider } from './context/ThemeContext';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Shrey Parekh — AI/ML Engineer & Developer Portfolio',
  '/projects': 'Projects — Shrey Parekh',
  '/blogs': 'Blogs — Shrey Parekh',
  '/experience': 'Experience — Shrey Parekh',
};

/* On route change: keep the document title in sync, and scroll to the hash
   target if there is one (the section mounts with the route), else to the top. */
function RouteManager() {
  const location = useLocation();

  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] ?? 'Shrey Parekh — Portfolio';
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
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
