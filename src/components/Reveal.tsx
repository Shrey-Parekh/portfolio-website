import { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${visible ? 'animate-rise' : 'opacity-0'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
