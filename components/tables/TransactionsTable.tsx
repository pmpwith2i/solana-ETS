import { ETSTokenTransaction } from '@/types/transaction';

interface TransactionsTableProps {
  transactions: ETSTokenTransaction[];
}

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/20/solid';
import { useMemo } from 'react';

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const formatSolBalance = (amount: number) => {
    return amount.toFixed(4);
  };

  return (
    <table className='min-w-full divide-y divide-primary'>
      <tbody className='divide-y divide-primary'>
        {transactions.map((transaction) => (
          <tr key={transaction.txSignature} className=''>
            <td className='whitespace-nowrap py-4 pl-8'>
              <div className='flex items-center'>
                {transaction.solPostBalance < transaction.solPreBalance && (
                  <ArrowTrendingDownIcon className='inline-block h-5 w-5 text-red-500/80' />
                )}
                {transaction.solPostBalance > transaction.solPreBalance && (
                  <ArrowTrendingUpIcon className='inline-block h-5 w-5 text-green-500/80' />
                )}
                <p>
                  <span className='ml-2 text-2xl font-medium text-gray-200'>
                    {transaction.solPostBalance > transaction.solPreBalance
                      ? '+'
                      : ''}
                    {formatSolBalance(
                      transaction.solPostBalance - transaction.solPreBalance
                    )}
                  </span>
                  <span className='text-xs text-gray-400'>SOL</span>
                </p>
              </div>
            </td>
            <td className='flex items-center whitespace-nowrap py-4'>
              {transaction.postBalance < transaction.preBalance && (
                <ArrowTrendingDownIcon className='inline-block h-5 w-5 text-red-500/80' />
              )}
              {transaction.postBalance > transaction.preBalance && (
                <ArrowTrendingUpIcon className='inline-block h-5 w-5 text-green-500/80' />
              )}
              <div>
                <p className='ml-2'>
                  <span className='text-2xl font-medium text-gray-200'>
                    {transaction.postBalance}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {transaction.tokenSymbol}
                  </span>
                </p>
              </div>
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
              {new Date(transaction.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
