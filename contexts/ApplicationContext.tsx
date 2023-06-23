import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from '@web3auth/base';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ETS_TOKEN_SYMBOL, PROGRAM_ID } from '@/constants/program';
import {
  getOrCreateTokenAccount,
  getTokenAccount,
} from '@/services/getTokenAccount';
import { getWalletBalance } from '@/services/getWalletBalance';
import { getWalletPK } from '@/services/getWalletPK';
import {
  setupBuyTokensIx,
  setupSellTokensIx,
} from '@/services/transfer-services';
import { ETSTokenTransaction } from '@/types/transaction';
import { Account } from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TokenBalance,
  Transaction,
} from '@solana/web3.js';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { SolanaWallet } from '@web3auth/solana-provider';

import { ExchangeTokenDialog } from '@/components/dialogs/ExchangeTokenDialog';
import {
  executeCreateCompanyTx,
  executeUpdateCompanyTx,
} from '@/services/company-services';
import { generatePda } from '@/services/common';
import { BorshCompanySchema, Company } from '@/types/company';
import { deserializeUnchecked } from 'borsh';
import { BorshPayload } from '@/serialization/borsh';
import { AUTH_0_CLIENT_ID, AUTH_0_DOMAIN } from '@/constants/auth0';

type ApplicationContextProps = {
  children: ReactNode;
};

type OpenLoginUserInfo = {
  email: string;
  name: string;
  profileImage: string;
  aggregateVerifier: string;
  verifier: string;
  verifierId: string;
};

type ApplicationState = {
  user?: Partial<OpenLoginUserInfo>;
  tokenAccount?: Account;
  balance?: number;
  walletPublicKey?: PublicKey;
  transactions: ETSTokenTransaction[];
  company?: Company;
  onLogin: () => void;
  onLogout: () => void;
  // eslint-disable-next-line no-unused-vars
  buyTokens: (amount: number) => void;
  // eslint-disable-next-line no-unused-vars
  sellTokens: (amount: number) => void;
  openBuyTokenDialog: () => void;
  openSellTokenDialog: () => void;
  // eslint-disable-next-line no-unused-vars
  updateCompany: (obj: { name: string; address: string }) => void;
  // eslint-disable-next-line no-unused-vars
  createCompany: (obj: { name: string; address: string }) => void;
};

const clientId =
  'BDCRXBofI6RKLAU-yvHhdkMonkkLqgXCDYLqG12GObr7zjNG2oRIIbgmDkluIy8Zr9gyENkU4_lEgOcVaUvItA8';

const web3Auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA, // SOLANA, OTHER
    chainId: '0x3',
  },
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    clientId,
    uxMode: 'popup',
    loginConfig: {
      jwt: {
        verifier: 'auth-0-verifier',
        typeOfLogin: 'jwt',
        clientId: AUTH_0_CLIENT_ID,
      },
    },
  },
});

const ADMIN_WALLET = Keypair.fromSecretKey(
  Uint8Array.from([
    212, 200, 51, 254, 54, 48, 9, 21, 15, 98, 105, 64, 170, 78, 18, 47, 181, 89,
    227, 71, 98, 33, 117, 1, 20, 55, 21, 10, 154, 23, 44, 104, 6, 190, 92, 42,
    135, 144, 244, 179, 184, 196, 134, 18, 69, 61, 58, 141, 161, 201, 183, 254,
    33, 118, 27, 80, 47, 131, 183, 24, 254, 138, 14, 90,
  ])
);

web3Auth.configureAdapter(openloginAdapter);
web3Auth.init();

export const ApplicationCtx = createContext<ApplicationState>({
  onLogin: () => {
    throw new Error('onLogin() not implemented');
  },
  onLogout: () => {
    throw new Error('onLogout() not implemented');
  },
  buyTokens: () => {
    throw new Error('buyTokens() not implemented');
  },
  sellTokens: () => {
    throw new Error('sellTokens() not implemented');
  },
  transactions: [],
  user: undefined,
  openBuyTokenDialog: () => {},
  openSellTokenDialog: () => {},
  updateCompany: () => {
    throw new Error('updateCompany() not implemented');
  },
  createCompany: () => {
    throw new Error('createCompany() not implemented');
  },
});

const DIALOGS = {
  BUY_TOKEN: 'buy-token',
  SELL_TOKEN: 'sell-token',
};

type DIALOGS_TYPES = (typeof DIALOGS)[keyof typeof DIALOGS] | undefined;
export const ApplicationContext = ({ children }: ApplicationContextProps) => {
  const [user, setUser] = useState<Partial<OpenLoginUserInfo>>();
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey>();
  const [connection, setConnection] = useState<Connection>();
  const [tokenAccount, setTokenAccount] = useState<Account>();
  const [balance, setBalance] = useState<number>();
  const [openedDialog, setOpenedDialog] = useState<DIALOGS_TYPES>(undefined);
  const [transactions, setTransactions] = useState<ETSTokenTransaction[]>([]);
  const [company, setCompany] = useState<Company>();

  const openBuyTokenDialog = useCallback(() => {
    setOpenedDialog(DIALOGS.BUY_TOKEN);
  }, []);

  const openSellTokenDialog = useCallback(() => {
    setOpenedDialog(DIALOGS.SELL_TOKEN);
  }, []);

  const loadUser = useCallback(async () => {
    const user = await web3Auth.getUserInfo();
    if (user) {
      setUser(user);
    }
  }, []);

  const onLogout = useCallback(async () => {
    await web3Auth.logout();
    setUser(undefined);
    setWalletPublicKey(undefined);
    setBalance(undefined);
    setTokenAccount(undefined);
    setConnection(undefined);
  }, []);

  const loadConnection = useCallback(async (): Promise<Connection> => {
    if (!web3Auth.provider) {
      throw new Error('[WEB3 Load Connection] provider not initialized yet');
    }

    const provider = new SolanaWallet(web3Auth.provider);

    const connectionConfig = (await provider.request({
      method: 'solana_provider_config',
      params: [],
    })) as any;

    const connection = new Connection(connectionConfig.rpcTarget);
    setConnection(connection);
    return connection;
  }, []);

  const buyTokens = useCallback(
    async (amount: number) => {
      if (!connection) {
        console.error('[TX TOKEN] connection not initialized yet');
        return;
      }
      if (!web3Auth.provider) {
        console.error('[TX TOKEN] provider not initialized yet');
        return;
      }
      if (!walletPublicKey) {
        console.error('[TX TOKEN] walletAccount not initialized yet');
        return;
      }

      if (!tokenAccount?.address) {
        console.error('[TX TOKEN] tokenAccount not initialized yet');
        return;
      }

      const provider = new SolanaWallet(web3Auth.provider);
      const blockhash = (await connection.getRecentBlockhash('finalized'))
        .blockhash;

      const tIx = await setupBuyTokensIx({
        walletPK: walletPublicKey,
        userTokenAccount: tokenAccount?.address,
        amount: (LAMPORTS_PER_SOL / 100) * amount,
      });

      const tx = new Transaction();
      tx.add(tIx);
      tx.feePayer = walletPublicKey;
      tx.recentBlockhash = blockhash;
      tx.sign(ADMIN_WALLET);

      await provider.signAndSendTransaction(tx);
    },
    [connection, walletPublicKey, tokenAccount?.address]
  );

  const sellTokens = useCallback(
    async (amount: number) => {
      if (!connection) {
        console.error('[TX TOKEN] connection not initialized yet');
        return;
      }
      if (!web3Auth.provider) {
        console.error('[TX TOKEN] provider not initialized yet');
        return;
      }
      if (!walletPublicKey) {
        console.error('[TX TOKEN] walletAccount not initialized yet');
        return;
      }

      if (!tokenAccount?.address) {
        console.error('[TX TOKEN] tokenAccount not initialized yet');
        return;
      }

      const provider = new SolanaWallet(web3Auth.provider);
      const blockhash = (await connection.getRecentBlockhash('finalized'))
        .blockhash;

      const tIx = await setupSellTokensIx({
        walletPK: walletPublicKey,
        userTokenAccount: tokenAccount?.address,
        amount: (LAMPORTS_PER_SOL / 100) * amount,
      });

      const tx = new Transaction();
      tx.add(tIx);
      tx.feePayer = ADMIN_WALLET.publicKey;
      tx.recentBlockhash = blockhash;
      tx.sign(ADMIN_WALLET);

      await provider.signAndSendTransaction(tx);
    },
    [connection, walletPublicKey, tokenAccount?.address]
  );

  const updateCompany = useCallback(
    async (obj: { name: string; address: string }) => {
      if (!connection) {
        console.error('[TX TOKEN] connection not initialized yet');
        return;
      }
      if (!web3Auth.provider) {
        console.error('[TX TOKEN] provider not initialized yet');
        return;
      }
      if (!walletPublicKey) {
        console.error('[TX TOKEN] walletAccount not initialized yet');
        return;
      }

      const provider = new SolanaWallet(web3Auth.provider);

      await executeUpdateCompanyTx({
        connection,
        provider,
        walletPublicKey,
        companyName: obj.name,
        address: obj.address,
      });
    },
    [connection, walletPublicKey]
  );

  const createCompany = useCallback(
    async (obj: { name: string; address: string }) => {
      if (!connection) {
        console.error('[TX TOKEN] connection not initialized yet');
        return;
      }
      if (!web3Auth.provider) {
        console.error('[TX TOKEN] provider not initialized yet');
        return;
      }
      if (!walletPublicKey) {
        console.error('[TX TOKEN] walletAccount not initialized yet');
        return;
      }

      const provider = new SolanaWallet(web3Auth.provider);

      await executeCreateCompanyTx({
        connection,
        provider,
        walletPublicKey,
        companyName: obj.name,
        address: obj.address,
      });
    },
    [connection, walletPublicKey]
  );

  const getTransactions = useCallback(
    async (
      connection: Connection,
      tokenAccountAddress: PublicKey,
      walletPublicKey: PublicKey
    ): Promise<void> => {
      console.debug('[WEB 3] - Get Transactions');
      const transactionList = await connection.getSignaturesForAddress(
        tokenAccountAddress,
        {
          limit: 10,
        }
      );
      let signatureList = transactionList.map(
        (transaction) => transaction.signature
      );

      let transactionDetails = await connection.getParsedTransactions(
        signatureList,
        { maxSupportedTransactionVersion: 0 }
      );

      const transactions: ETSTokenTransaction[] = [];
      transactionList.forEach((transaction, i) => {
        const date = new Date(transaction?.blockTime! * 1000);

        const txKeys = transactionDetails[i]!.transaction.message.accountKeys;
        const txMeta = transactionDetails[i]!.meta;

        const tkPubkeyIndex = txKeys.findIndex(
          (key) => key.pubkey.toBase58() === walletPublicKey?.toBase58()
        );

        let tokenPreBalance: number = 0;
        let tokenPostBalance: number = 0;
        const solPostBalance =
          txMeta?.postBalances?.[tkPubkeyIndex]! / LAMPORTS_PER_SOL || 0;
        const solPreBalance =
          txMeta?.preBalances?.[tkPubkeyIndex]! / LAMPORTS_PER_SOL || 0;

        txMeta?.preTokenBalances?.forEach((tBalance: TokenBalance) => {
          const { pubkey } = txKeys[tBalance.accountIndex];
          if (pubkey.toString() === tokenAccountAddress?.toString()) {
            tokenPreBalance = tBalance.uiTokenAmount.uiAmount ?? 0;
            return;
          }
        });

        txMeta?.postTokenBalances?.forEach((tBalance: TokenBalance) => {
          const { pubkey } = txKeys[tBalance.accountIndex];
          if (pubkey.toString() === tokenAccountAddress?.toString()) {
            tokenPostBalance = tBalance.uiTokenAmount.uiAmount ?? 0;
            return;
          }
        });

        if (tokenPreBalance === tokenPostBalance) return;

        // console.log({ solPostBalance, solPreBalance });
        if (tokenPreBalance || tokenPostBalance) {
          const transactionData: ETSTokenTransaction = {
            txSignature: transaction.signature,
            preBalance: tokenPreBalance,
            postBalance: tokenPostBalance,
            timestamp: date.getTime(),
            status: transaction?.confirmationStatus,
            tokenSymbol: ETS_TOKEN_SYMBOL,
            solPostBalance,
            solPreBalance,
          };
          transactions.push(transactionData);
        }
      });

      setTransactions(transactions);
    },
    []
  );

  const getCompanyPDA = useCallback(
    async (connection: Connection, walletPublicKey: PublicKey) => {
      const { pda } = await generatePda(
        new PublicKey(PROGRAM_ID),
        walletPublicKey
      );

      const accountInfo = await connection.getAccountInfo(pda);
      if (!accountInfo) throw new Error('Company account not found');

      const company: Company = deserializeUnchecked(
        BorshCompanySchema,
        BorshPayload,
        accountInfo?.data
      ) as Company;

      setCompany(company);
    },
    []
  );

  const initUserFn = useCallback(async () => {
    await loadUser();
    const connection = await loadConnection();
    if (!web3Auth.provider) {
      throw new Error('[WEB3 Load Connection] provider not initialized yet');
    }
    const provider = new SolanaWallet(web3Auth.provider);
    const walletPublicKey = await getWalletPK({
      provider,
    });

    const tokenAccount = await getOrCreateTokenAccount({
      connection,
      walletPublicKey,
      adminWallet: ADMIN_WALLET,
    });

    const balance = await getWalletBalance({
      connection,
      walletPublicKey,
    });

    if (tokenAccount)
      getTransactions(connection, tokenAccount.address, walletPublicKey);

    setTokenAccount(tokenAccount);
    setBalance(balance);
    setWalletPublicKey(walletPublicKey);
    getCompanyPDA(connection, walletPublicKey);
  }, [loadUser, loadConnection, getTransactions, getCompanyPDA]);

  const onLogin = useCallback(async () => {
    let isAuthenticated = false;

    try {
      console.debug('[WEB 3] - authenticateUser');
      await web3Auth.authenticateUser();
      isAuthenticated = true;
      return;
    } catch (e) {
      console.error('[WEB 3] - error on authenticateUser', e);
    }

    try {
      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'jwt',
        extraLoginOptions: {
          domain: AUTH_0_DOMAIN,
          verifierIdField: 'email',
        },
      });
      isAuthenticated = true;
    } catch (e) {
      console.error(e);
    } finally {
      if (isAuthenticated) {
        console.debug('[WEB 3] - connected to wallet, redirect to dashboard');
        // Redirect window to dashboard
        window.location.href = '/dashboard';
      }
    }
  }, []);

  useEffect(() => {
    if (!walletPublicKey) return;
    if (!connection) return;

    // eslint-disable-next-line no-undef
    let tId: NodeJS.Timeout | null = null;

    const clID = connection?.onAccountChange(
      walletPublicKey,
      (account) => {
        setBalance(account.lamports / LAMPORTS_PER_SOL);
        getTokenAccount({ walletPublicKey, connection }).then((account) => {
          if (!account) return;
          setTokenAccount(account);
          if (tId) clearTimeout(tId);
          tId = setTimeout(() => {
            getTransactions(connection, account.address!, walletPublicKey);
          }, 5000);
        });
      },
      'finalized'
    );
    () => {
      if (tId) clearTimeout(tId);
      connection?.removeAccountChangeListener(clID);
    };
  }, [walletPublicKey, connection, getTransactions]);

  useEffect(() => {
    const listener = () => {
      console.debug('[WEB 3] - Adapter connected');
      initUserFn();
    };
    web3Auth.on(ADAPTER_EVENTS.CONNECTED, listener);

    return () => {
      console.debug('[WEB 3] - Adapter disconnected');
      web3Auth.off(ADAPTER_EVENTS.CONNECTED, listener);
    };
  }, [initUserFn]);

  return (
    <ApplicationCtx.Provider
      value={{
        user,
        tokenAccount,
        balance,
        walletPublicKey,
        company,
        transactions,
        onLogin,
        onLogout,
        buyTokens,
        sellTokens,
        openBuyTokenDialog,
        openSellTokenDialog,
        updateCompany,
        createCompany,
      }}
    >
      <ExchangeTokenDialog
        isOpen={openedDialog === DIALOGS.BUY_TOKEN}
        closeModal={() => setOpenedDialog(undefined)}
        exchangeType='buy'
      />

      <ExchangeTokenDialog
        isOpen={openedDialog === DIALOGS.SELL_TOKEN}
        closeModal={() => setOpenedDialog(undefined)}
        exchangeType='sell'
      />

      {children}
    </ApplicationCtx.Provider>
  );
};

export const ApplicationContextProvider = ({
  children,
}: ApplicationContextProps) => {
  return (
    <UserProvider>
      <ApplicationContext>{children}</ApplicationContext>
    </UserProvider>
  );
};

export const useApplicationContextState = (): ApplicationState =>
  useContext(ApplicationCtx);
