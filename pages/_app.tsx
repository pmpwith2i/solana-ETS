import { ApplicationContextProvider } from '@/contexts/ApplicationContext';
import { ToastProvider } from '@/contexts/ToastContext';

import '@/styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ReactElement } from 'react';

export type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement | ReactElement[]) => any;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ['latin'] });

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ApplicationContextProvider>
      <ToastProvider>
        <main className={inter.className}>
          {getLayout(<Component {...pageProps} />)}
        </main>
      </ToastProvider>
    </ApplicationContextProvider>
  );
};

export default App;
