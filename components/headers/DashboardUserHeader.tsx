import {
  MapPinIcon,
  CalendarIcon,
  WalletIcon,
} from '@heroicons/react/20/solid';

import { formatDecimals } from '@/utils/formatDecimals';
interface DashboardUserHeaderProps {
  userName?: string;
  balance?: number;
  tokenBalance?: bigint;
  publicKey?: string;
}
export const DashboardUserHeader = ({
  userName,
  balance,
  tokenBalance,
  publicKey,
}: DashboardUserHeaderProps) => {
  const copyPKToClipboard = () => {
    navigator.clipboard.writeText(publicKey ?? '');
  };
  return (
    <div className='lg:flex lg:items-center lg:justify-between'>
      <div className='min-w-0 flex-1'>
        <h2 className='text-xs text-gray-300 sm:truncate sm:tracking-tight'>
          {userName}
        </h2>
        <h3 className='text-3xl font-bold text-gray-100'>
          {tokenBalance ? formatDecimals(tokenBalance, 9) : 0} ETS
        </h3>
        <h3 className='text-xs font-bold text-gray-200'>{balance ?? 0} SOL</h3>
        <div className='mt-1 flex flex-col text-xs sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6'>
          <div className='mt-2 flex items-center text-gray-200'>
            <MapPinIcon
              className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300'
              aria-hidden='true'
            />
            Italy, Monteprandone
          </div>
          <div className='mt-2 flex items-center text-gray-200'>
            <CalendarIcon
              className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300'
              aria-hidden='true'
            />
            Started on January 9, 2020
          </div>
        </div>
        <div className='mt-2 flex items-center text-gray-200'>
          <WalletIcon
            className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300'
            aria-hidden='true'
          />
          <p className='text-xs'>
            <b>Wallet address:</b>{' '}
            <span
              className='cursor-pointer text-gray-200 hover:text-gray-100'
              onClick={copyPKToClipboard}
            >
              {publicKey}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
