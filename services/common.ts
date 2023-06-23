import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export const generatePda = async (
  programId: PublicKey,
  walletPubkey: PublicKey
): Promise<{
  pda: PublicKey;
  bumpSeed: number;
}> => {
  const seeds = [walletPubkey.toBuffer()];
  const [pda, bumpSeed] = await PublicKey.findProgramAddress(seeds, programId);
  return { pda, bumpSeed };
};

export const prepareTransaction = async (
  transactionIxs: TransactionInstruction | TransactionInstruction,
  connection: Connection,
  walletPK: PublicKey
): Promise<{
  transaction: Transaction;
  lastValidBlockHeight: number;
  latestBlockhash: any;
}> => {
  const transaction = new Transaction();

  if (Array.isArray(transactionIxs)) {
    transactionIxs.forEach((ix) => {
      transaction.add(ix);
    });
  } else {
    transaction.add(transactionIxs);
  }

  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = walletPK;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  const lastValidBlockHeight = await connection.getSlot('max');
  return { transaction, lastValidBlockHeight, latestBlockhash };
};
