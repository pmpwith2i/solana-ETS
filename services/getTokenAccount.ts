import { ETS_TOKEN } from '@/constants/program';
import {
  getAssociatedTokenAddress,
  getAccount,
  Account,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { SolanaWallet } from '@web3auth/solana-provider';
import { PublicKey, Connection, Signer } from '@solana/web3.js';
import { executeCreateTokenAccountTx } from './token-services';
interface GetTokenAccount {
  walletPublicKey: PublicKey;
  connection: Connection;
}

interface GetOrCreateTokenAccount {
  walletPublicKey: PublicKey;
  connection: Connection;
  adminWallet: Signer;
}

export const getTokenAccount = async ({
  walletPublicKey,
  connection,
}: GetTokenAccount): Promise<Account | undefined> => {
  const associatedTokenAccountAddress = await getAssociatedTokenAddress(
    new PublicKey(ETS_TOKEN),
    walletPublicKey
  );
  console.log(
    '[TOKEN ACCOUNT get token account for ',
    walletPublicKey.toBase58(),
    associatedTokenAccountAddress.toBase58()
  );
  try {
    const tokenAccount = await getAccount(
      connection,
      associatedTokenAccountAddress
    );
    return tokenAccount;
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

export const getOrCreateTokenAccount = async ({
  walletPublicKey,
  connection,
  adminWallet,
}: GetOrCreateTokenAccount): Promise<Account | undefined> => {
  console.log(
    '[TOKEN ACCOUNT get token account or creating for ',
    walletPublicKey.toBase58()
  );
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      adminWallet,
      new PublicKey(ETS_TOKEN),
      walletPublicKey
    );
    return tokenAccount;
  } catch (e) {
    console.error(e);
  }
  return undefined;
};
