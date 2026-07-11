const Footer = () => {
  return (
    <footer className="mx-auto max-w-2xl border-t border-hairline px-6 py-8">
      <div className="flex flex-col gap-2 font-body text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>Mumbai, India</span>
        <a
          href="mailto:shreyparekh3@gmail.com"
          className="border-b border-hairline text-ink no-underline"
        >
          shreyparekh3@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
