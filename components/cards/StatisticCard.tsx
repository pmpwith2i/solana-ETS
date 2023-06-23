import { classNames } from '@/utils/classNames';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { FC, SVGProps } from 'react';
import { Card } from './Card';

export interface StatisticCardProps {
  id: number;
  name: string;
  stat: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: FC<SVGProps<SVGSVGElement>>;
}

export const StatisticCard = ({
  id,
  name,
  stat,
  change,
  changeType,
  icon: Icon,
}: StatisticCardProps) => {
  return (
    <Card key={id}>
      <dt>
        <div className='absolute rounded-md bg-indigo-500 p-3'>
          <Icon className='h-6 w-6 text-white' aria-hidden='true' />
        </div>
        <p className='ml-16 truncate text-sm font-medium text-gray-500'>
          {name}
        </p>
      </dt>
      <dd className='ml-16 flex items-baseline'>
        <p className='text-2xl font-semibold text-gray-900'>{stat}</p>
        <p
          className={classNames(
            changeType === 'increase' ? 'text-green-600' : 'text-red-600',
            'ml-2 flex items-baseline text-sm font-semibold'
          )}
        >
          {changeType === 'increase' ? (
            <ArrowUpIcon
              className='h-5 w-5 flex-shrink-0 self-center text-green-500'
              aria-hidden='true'
            />
          ) : (
            <ArrowDownIcon
              className='h-5 w-5 flex-shrink-0 self-center text-red-500'
              aria-hidden='true'
            />
          )}

          <span className='sr-only'>
            {changeType === 'increase' ? 'Increased' : 'Decreased'} by{' '}
          </span>
          {change}
        </p>
      </dd>
    </Card>
  );
};
