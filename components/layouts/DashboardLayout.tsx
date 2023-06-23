import { ReactNode, useState } from 'react';
import {
  Bars3Icon,
  CheckCircleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

import { StaticSidebar } from '../sidebars/StaticSidebar';
import { MobileSidebar } from '../sidebars/MobileSidebar';
import { useApplicationContextState } from '@/contexts/ApplicationContext';
import { Button } from '../atoms/button/Button';

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openBuyTokenDialog, openSellTokenDialog, updateCompany } =
    useApplicationContextState();
  return (
    <div>
      <MobileSidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <StaticSidebar navigation={navigation} />
      <div className='flex flex-1 flex-col lg:pl-72'>
        <div className='sticky top-0 z-10 flex items-center border-b border-primary bg-primary pr-4 pb-1 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden'>
          <button
            type='button'
            className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>

          <h1 className='flex-1 text-lg font-semibold text-gray-200'>
            Dashboard
          </h1>

          <button
            type='button'
            onClick={() =>
              updateCompany({
                name: 'Giancarlo',
                address: 'Via Roma 1',
              })
            }
            className='mr-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Buy tokens
            <CheckCircleIcon className='-mr-0.5 h-5 w-5' aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={openBuyTokenDialog}
            className='mr-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Buy tokens
            <CheckCircleIcon className='-mr-0.5 h-5 w-5' aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={openSellTokenDialog}
            className='inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Sell tokens
            <CheckCircleIcon className='-mr-0.5 h-5 w-5' aria-hidden='true' />
          </button>
        </div>
        <main className='flex-1'>
          <div className='hidden border-b border-primary bg-primary py-4 lg:block'>
            <div className='mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8'>
              <h1 className='flex-1 text-lg font-semibold text-gray-200'>
                Dashboard
              </h1>

              <Button
                size='md'
                variant='primary'
                onClick={openBuyTokenDialog}
                className='mr-4'
              >
                Buy tokens
              </Button>

              <Button
                size='md'
                variant='secondary'
                onClick={openSellTokenDialog}
              >
                Sell tokens
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
