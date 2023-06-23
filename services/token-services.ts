import { ETS_TOKEN } from '@/constants/program';
import { createInitializeAccount3Instruction } from '@solana/spl-token';
import { SolanaWallet } from '@web3auth/solana-provider';
import {
  PublicKey,
  Connection,
  TransactionInstruction,
  Transaction,
} from '@solana/web3.js';
interface CreateTokenAccountIx {
  walletPublicKey: PublicKey;
  tokenAccountPublicKey: PublicKey;
}
export const setupTokenAccountIX = ({
  walletPublicKey,
  tokenAccountPublicKey,
}: CreateTokenAccountIx): TransactionInstruction => {
  const ix = createInitializeAccount3Instruction(
    tokenAccountPublicKey,
    new PublicKey(ETS_TOKEN),
    walletPublicKey
  );

  return ix;
};

export const executeCreateTokenAccountTx = async (
  connection: Connection,
  provider: SolanaWallet,
  walletPublicKey: PublicKey,
  tokenAccountPublicKey: PublicKey
) => {
  const ix = setupTokenAccountIX({
    walletPublicKey,
    tokenAccountPublicKey,
  });

  const tx = new Transaction();

  const blockhash = (await connection.getRecentBlockhash('finalized'))
    .blockhash;
  tx.add(ix);
  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = blockhash;

  console.log('[WEB 3] Sign and send transaction for token account');
  const signedTX = await provider.signAndSendTransaction(tx);
  console.log('Create token account tx', { signedTX });
};
