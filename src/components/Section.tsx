import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, kicker, children, className = '' }: SectionProps) => {
  return (
    <section id={id} className={`relative mx-auto max-w-2xl px-6 py-20 sm:py-28 ${className}`}>
      {kicker && <p className="mb-4 font-body text-xs italic text-accent">{kicker}</p>}
      {children}
    </section>
  );
};

export default Section;
