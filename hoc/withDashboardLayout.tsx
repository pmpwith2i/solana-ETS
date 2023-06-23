import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactNode } from 'react';

export const withDashboardLayout = (Component: NextPageWithLayout) => {
  Component.getLayout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
  );
  return Component;
};
