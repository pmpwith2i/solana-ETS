import Head from 'next/head';

import { HomepageHero } from '@/components/hero/HomepageHero';

import { Mission } from '@/components/stats/Mission';

const Home = () => {
  return (
    <>
      <Head>
        <title>Solana ETS - Federico Pomponii</title>
        <meta name='description' content='Solana ETS application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='bg-black'>
        <HomepageHero />
        <Mission />
      </main>
    </>
  );
};

export default Home;
