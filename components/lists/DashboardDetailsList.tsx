import { Company } from '@/types/company';

interface DashboardDetailsListProps {
  company: Company;
  userName: string;
  email: string;
}

export const DashboardDetailsList = ({
  company,
  userName,
  email,
}: DashboardDetailsListProps) => {
  return (
    <div>
      <div className='px-4 sm:px-0'>
        <h3 className='text-base font-semibold leading-7 text-white'>
          Details
        </h3>
        <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-400'>
          Personal details and application.
        </p>
      </div>
      <div className='mt-6 border-t border-white/10'>
        <dl className='divide-y divide-white/10'>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Full name
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {userName}
            </dd>
          </div>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Email address
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {email}
            </dd>
          </div>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Company Name
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {company.name}
            </dd>
          </div>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Address
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {company.address}
            </dd>
          </div>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Joined on
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {new Date(Number(company.created_at))?.toLocaleDateString()}
            </dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm font-medium leading-6 text-white'>
              Last updated
            </dt>
            <dd className='mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0'>
              {new Date(Number(company.updated_at))?.toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
