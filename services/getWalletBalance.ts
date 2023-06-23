import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const getWalletBalance = async ({
  walletPublicKey,
  connection,
}: {
  walletPublicKey: PublicKey;
  connection: Connection;
}) => {
  const balance = await connection.getBalance(walletPublicKey);
  return balance / LAMPORTS_PER_SOL;
};
