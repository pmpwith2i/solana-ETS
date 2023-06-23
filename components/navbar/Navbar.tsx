import { Disclosure } from '@headlessui/react';

import { Button } from '../atoms/button/Button';
import { useApplicationContextState } from '@/contexts/ApplicationContext';
import Link from 'next/link';

export const Navbar = () => {
  const { onLogin, onLogout, user } = useApplicationContextState();

  return (
    <Disclosure as='nav' className='shadow'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16'>
              <div className='flex w-full justify-between'>
                <div className='flex-1'></div>
                <div className='flex items-center'>
                  {!user && (
                    <Button size='sm' variant='primary' onClick={onLogin}>
                      LOGIN
                    </Button>
                  )}
                  {user && (
                    <div className='flex items-center gap-4'>
                      <img
                        className='h-8 w-8 rounded-full'
                        src={user.profileImage}
                        alt=''
                      />

                      <Link href='/dashboard'>
                        <Button size='sm' variant='primary'>
                          Open Dashboard
                        </Button>
                      </Link>

                      <Button size='sm' variant='primary' onClick={onLogout}>
                        LOGOUT
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden'>
            <div className='space-y-1 pt-2 pb-3'>
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as='a'
                href='#'
                className='block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700 sm:pl-5 sm:pr-6'
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'
              >
                Team
              </Disclosure.Button>
              <Disclosure.Button
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6'
              >
                Calendar
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
