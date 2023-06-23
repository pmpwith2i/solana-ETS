import { useApplicationContextState } from '@/contexts/ApplicationContext';
import { NavigationElement } from '@/types/navigation';
import { classNames } from '@/utils/classNames';

interface StaticSidebarProps {
  navigation: NavigationElement[];
}

export const StaticSidebar = ({ navigation }: StaticSidebarProps) => {
  const { user } = useApplicationContextState();
  return (
    <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col'>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className='flex min-h-0 flex-1 flex-col border-r border-primary bg-primary'>
        <div className='flex flex-1 flex-col overflow-y-auto'>
          <div className='100 mx-4 flex flex-shrink-0 items-center py-4'>
            <span className='text-sm font-bold text-gray-200'>Solana ETS </span>
          </div>
          <nav className='mt-4 flex-1 space-y-1 px-4'>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-button-primary text-white hover:bg-button-primary/80'
                    : 'text-gray-200 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                )}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? 'text-gray-200'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-6 w-6 flex-shrink-0'
                  )}
                  aria-hidden='true'
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        <div className='flex flex-shrink-0 border-t border-primary p-4'>
          <a href='#' className='group block w-full flex-shrink-0'>
            <div className='flex items-center'>
              <div>
                <img
                  className='inline-block h-9 w-9 rounded-full'
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  alt=''
                />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-200 group-hover:text-gray-300'>
                  {user?.name}
                </p>
                <p className='text-xs font-medium text-gray-300 group-hover:text-gray-400'>
                  View profile
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
