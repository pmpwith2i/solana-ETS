import { PublicKey } from '@solana/web3.js';

export const formatPublicKey = (publicKey: PublicKey) => {
  return `${publicKey.toBase58().slice(0, 6)}...${publicKey
    .toBase58()
    .slice(-6)}`;
};
