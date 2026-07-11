import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import TextureOverlay from './components/TextureOverlay';
import FlipDotHero from './components/FlipDotHero';
import About from './components/About';
import { ThemeProvider } from './context/ThemeContext';

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
      <div id="top" className="relative min-h-screen">
        <Nav />
        <main>
          <FlipDotHero />
          <About />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
