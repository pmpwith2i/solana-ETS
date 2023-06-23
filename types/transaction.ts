import { TransactionConfirmationStatus } from '@solana/web3.js';

export type ETSTokenTransaction = {
  preBalance: number;
  postBalance: number;
  solPreBalance: number;
  solPostBalance: number;
  txSignature: string;
  status?: TransactionConfirmationStatus;
  timestamp: number;
  tokenSymbol: string;
};
