import { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}

const Container = ({ children, as: Tag = 'div', className = '', id }: ContainerProps) => {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-4xl px-6 sm:px-10 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
