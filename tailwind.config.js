/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'var(--bg)',
        panel: 'var(--panel)',
        ink: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        hairline: 'var(--border)',
        band: 'var(--band-bg)',
        bandFg: 'var(--band-fg)',
        tagResearch: 'var(--tag-research)',
        tagSystems: 'var(--tag-systems)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"EB Garamond"', 'serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        lg: 'var(--radius-lg)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        inout: 'var(--ease-inout)',
        stamp: 'var(--ease-stamp)',
      },
    },
  },
  plugins: [],
}
