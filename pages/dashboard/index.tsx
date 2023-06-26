import { DashboardUserHeader } from '@/components/headers/DashboardUserHeader';
import { DashboardDetailsList } from '@/components/lists/DashboardDetailsList';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { useApplicationContextState } from '@/contexts/ApplicationContext';
import { useToast } from '@/contexts/ToastContext';
import { withDashboardLayout } from '@/hoc/withDashboardLayout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';

//TODO: Remember to add authentication to this route
const Dashboard = withDashboardLayout(() => {
  const {
    user,
    balance,
    tokenAccount,
    walletPublicKey,
    transactions,
    company,
  } = useApplicationContextState();

  const { toast } = useToast();

  useEffect(() => {
    toast('Welcome to your dashboard!');
  }, [toast]);

  return (
    <div className='flex items-start'>
      <div className='flex min-h-screen flex-1 flex-col'>
        <div className='border-b border-primary bg-primary/95 py-4'>
          <div className='mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 lg:px-8'>
            <DashboardUserHeader
              userName={user?.name}
              balance={balance}
              tokenBalance={tokenAccount?.amount}
              publicKey={walletPublicKey?.toString()}
            />
          </div>
        </div>
        <div className='flex-1 border-b border-primary bg-primary py-4'>
          <div className='mx-auto max-w-7xl'>
            <span className='inline-flex rounded-md px-8 text-gray-200 shadow-sm'>
              Latest Activities
            </span>
            {/* <h2 className='my-4 text-sm font-bold'>Recent transactions</h2> */}
            <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </div>
      <div className='sticky top-0 h-screen w-1/3 border-l border-primary bg-primary p-4'>
        {company && (
          <DashboardDetailsList
            company={company}
            userName={user?.name!}
            email={user?.email!}
          />
        )}
      </div>
    </div>
  );
});

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
