import { MISSION_STATS } from '@/constants/stats';

export const Mission = () => {
  return (
    <div className='py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-none'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl'>
            The thesis
          </h2>
          <div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
            <div className='lg:w-full lg:max-w-2xl lg:flex-auto'>
              <p className='text-xl leading-8 text-gray-200'>
                {`Considering the growth of blockchain-based technologies and
                decentralized applications this thesis aims to explore the
                potential of Solana, a blockchain committed to studying
                open-sourcing the data and taking steps to bring the chain's
                footprint to zero. Specifically, the thesis will examine how
                Solana's features, such as its high transaction speed and low
                transaction fees, can facilitate the implementation and
                operation of an Emission Trading System.`}
              </p>
              <p className='mt-10 max-w-xl text-base leading-7 text-gray-400'>
                {`Through this thesis, I aim to explore the technical aspects,
                challenges, and potential benefits of implementing a simple
                Solana-based ETS. By conducting an analysis of the existing ETS
                frameworks, examining the capabilities of the Solana blockchain,
                and designing and implementing a prototype system, we can gain
                insights into the practicality and scalability of such an
                application.`}
              </p>
            </div>
            <div className='lg:flex lg:flex-auto lg:justify-center'>
              <dl className='w-64 space-y-8 xl:w-80'>
                {MISSION_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className='flex flex-col-reverse gap-y-4'
                  >
                    <dt className='text-base leading-7 text-gray-200'>
                      {stat.label}
                    </dt>
                    <dd className='text-5xl font-semibold tracking-tight text-gray-100'>
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
