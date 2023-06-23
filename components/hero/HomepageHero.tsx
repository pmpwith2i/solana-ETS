import { HomepageHeroImageSection } from './HomepageHeroImageSection';

export const HomepageHero = () => {
  return (
    <div className='min-w-screen relative mt-10 flex min-h-screen overflow-hidden bg-black'>
      <div className='mt-[10%] h-full pr-24 pl-24 text-white'>
        <div>
          <h1 className='text-7xl font-bold'>
            Carbon neutral.
            <br />
            Climate focused.
          </h1>

          <h2 className='pt-4 text-sm text-gray-300'>
            World is changing fast and we need a new solutions for reducing GHS
            emissions. <br />
            ETS is the solution and we built it in Solana.
          </h2>
        </div>
      </div>
      <HomepageHeroImageSection />
    </div>
  );
};
