import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return (
    <div className='d-inline-block relative overflow-hidden rounded-lg bg-white px-4 pt-6 pb-6 shadow-md sm:px-6'>
      {children}
    </div>
  );
};
