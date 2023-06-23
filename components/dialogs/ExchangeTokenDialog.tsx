import { useApplicationContextState } from '@/contexts/ApplicationContext';
import { Portal } from '@/hoc/withModal';
import { formatDecimals } from '@/utils/formatDecimals';
import { Transition, Dialog } from '@headlessui/react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Fragment, useMemo, useState } from 'react';
import { Button } from '../atoms/button/Button';

interface ExchangeTokenDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  exchangeType: 'buy' | 'sell';
}
export const ExchangeTokenDialog = ({
  isOpen,
  closeModal,
  exchangeType,
}: ExchangeTokenDialogProps) => {
  const { balance, user, buyTokens, sellTokens } = useApplicationContextState();

  const [amount, setAmount] = useState(0);

  const calculatedSOLPrice = useMemo(() => {
    if (!isNaN(amount))
      return formatDecimals((LAMPORTS_PER_SOL / 100) * amount, 9);
    else return 0;
  }, [amount]);

  const handleSetAmount = (amount: string) => {
    if (isNaN(parseInt(amount))) return setAmount(0);

    setAmount(parseInt(amount));
  };

  const handleBuyTokens = () => {
    if (exchangeType === 'buy') buyTokens(amount);
    if (exchangeType === 'sell') sellTokens(amount);

    closeModal();
  };

  return isOpen ? (
    <Portal>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Trade ETS Tokens
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Buy new permits or sell unused ones with your wallet, use
                      your solana wallet and if you have enough balance you can
                      top up your account in the dashboard.
                    </p>
                  </div>

                  <div className='mt-4 flex flex-col gap-4'>
                    <div>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        ETS Tokens to {exchangeType === 'buy' ? 'Buy' : 'Sell'}
                      </label>
                      <div className='relative mt-2 rounded-md shadow-sm'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <span className='text-gray-500 sm:text-sm'>
                            {exchangeType === 'buy' ? '+' : '-'}
                          </span>
                        </div>
                        <input
                          type='number'
                          name='amount'
                          value={amount}
                          min={0}
                          id='amount'
                          onChange={(e) => handleSetAmount(e.target.value)}
                          className='block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          placeholder='0'
                          aria-describedby='price-currency'
                        />
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                          <span
                            className='text-gray-500 sm:text-sm'
                            id='price-currency'
                          >
                            ETS
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        SOL Amount to {exchangeType === 'buy' ? 'Pay' : 'Get'}
                      </label>
                      <div className='relative mt-2 rounded-md shadow-sm'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          {exchangeType === 'sell' ? '+' : '-'}
                          <span className='text-gray-500 sm:text-sm'></span>
                        </div>
                        <input
                          type='text'
                          name='price'
                          id='price'
                          disabled
                          value={calculatedSOLPrice}
                          className='block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          placeholder='0.00'
                          aria-describedby='price-currency'
                        />
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                          <span
                            className='text-gray-500 sm:text-sm'
                            id='price-currency'
                          >
                            SOL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <Button
                      variant='primary'
                      onClick={handleBuyTokens}
                      size='xl'
                    >
                      {`${
                        exchangeType === 'buy' ? 'Buy' : 'Sell'
                      } ${amount} ETS`}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Portal>
  ) : (
    <></>
  );
};
