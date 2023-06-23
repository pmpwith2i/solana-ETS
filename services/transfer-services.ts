import {
  PROGRAM_ID,
  ADMIN_ACCOUNT_KEY,
  ETS_TOKEN_ACCOUNT,
} from '@/constants/program';

import {
  TransferInstruction,
  TransferInstructionSchema,
} from '@/serialization/transfer';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  TransactionInstruction,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import * as borsh from 'borsh';

interface TransferTx {
  walletPK: PublicKey;
  userTokenAccount: PublicKey;
  amount: number;
}

export const setupBuyTokensIx = async ({
  walletPK,
  userTokenAccount,
  amount,
}: TransferTx): Promise<TransactionInstruction> => {
  const programId = new PublicKey(PROGRAM_ID);

  const payload = new TransferInstruction({ amount });
  const adminAccount = new PublicKey(ADMIN_ACCOUNT_KEY);
  const data = borsh.serialize(TransferInstructionSchema, payload);

  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: walletPK,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: adminAccount,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(ETS_TOKEN_ACCOUNT),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: userTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId,
    data: Buffer.concat([Buffer.from(new Uint8Array([2])), Buffer.from(data)]),
  });

  return ix;
};

export const setupSellTokensIx = async ({
  walletPK,
  userTokenAccount,
  amount,
}: TransferTx): Promise<TransactionInstruction> => {
  const programId = new PublicKey(PROGRAM_ID);

  const payload = new TransferInstruction({ amount });
  const adminAccount = new PublicKey(ADMIN_ACCOUNT_KEY);
  const data = borsh.serialize(TransferInstructionSchema, payload);

  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: adminAccount,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: walletPK,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: userTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(ETS_TOKEN_ACCOUNT),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId,
    data: Buffer.concat([Buffer.from(new Uint8Array([2])), Buffer.from(data)]),
  });

  return ix;
};
