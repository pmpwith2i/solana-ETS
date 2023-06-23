import { PublicKey } from '@solana/web3.js';
import { SolanaWallet } from '@web3auth/solana-provider';

export const getWalletPK = async ({
  provider,
}: {
  provider: SolanaWallet;
}): Promise<PublicKey> => {
  const userAccounts = await provider.requestAccounts();
  const accPK = new PublicKey(userAccounts[0]);
  return accPK;
};
