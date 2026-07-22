import { ReactNode } from 'react';
import Container from './Container';

interface SectionProps {
  id: string;
  kicker?: string;
  num?: string;
  children?: ReactNode;
  className?: string;
}

const Section = ({ id, kicker, num, children, className = '' }: SectionProps) => {
  return (
    <Container as="section" id={id} className={`py-16 sm:py-20 lg:py-28 ${className}`}>
      {(kicker || num) && (
        <div className="mb-8 flex items-baseline gap-3 border-b border-hairline pb-3 sm:mb-10">
          {num && <span className="font-body text-sm text-muted">{num}</span>}
          {kicker && <span className="font-body text-sm italic text-accent">{kicker}</span>}
        </div>
      )}
      {children}
    </Container>
  );
};

export default Section;
