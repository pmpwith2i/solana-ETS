import { ReactNode } from 'react';

interface DashboardContainerProps {
  children: ReactNode;
}

export const DashboardContainer = ({ children }: DashboardContainerProps) => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</div>
  );
};
