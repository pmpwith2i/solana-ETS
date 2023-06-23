import { PROGRAM_ID } from '@/constants/program';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { generatePda } from './common';
import { BorshPayload } from '@/serialization/borsh';
import * as borsh from 'borsh';
import { SolanaWallet } from '@web3auth/solana-provider';

interface CreateCompanyTX {
  walletPublicKey: PublicKey;
  companyName: string;
  address: string;
}
interface UpdateCompanyIx {
  walletPublicKey: PublicKey;
  companyName: string;
  address: string;
}

export const setupCreateCompanyIx = async ({
  walletPublicKey,
  companyName,
  address,
}: CreateCompanyTX): Promise<TransactionInstruction> => {
  const programId = new PublicKey(PROGRAM_ID);
  const { pda } = await generatePda(programId, walletPublicKey);

  const payload = new BorshPayload({
    name: companyName,
    address,
    created_at: Date.now(),
  });

  const createCompanySchema = new Map([
    [
      BorshPayload,
      {
        kind: 'struct',
        fields: [
          ['name', 'string'],
          ['address', 'string'],
          ['created_at', 'u64'],
        ],
      },
    ],
  ]);

  const data = borsh.serialize(createCompanySchema, payload);

  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: walletPublicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
    data: Buffer.concat([Buffer.from(new Uint8Array([0])), Buffer.from(data)]),
  });

  return ix;
};
export const executeCreateCompanyTx = async (obj: {
  connection: Connection;
  provider: SolanaWallet;
  walletPublicKey: PublicKey;
  address: string;
  companyName: string;
}) => {
  const { connection, provider, walletPublicKey, address, companyName } = obj;
  const ix = await setupCreateCompanyIx({
    walletPublicKey: walletPublicKey,
    address,
    companyName,
  });

  const tx = new Transaction();

  const blockhash = (await connection.getRecentBlockhash('finalized'))
    .blockhash;
  tx.add(ix);
  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = blockhash;

  console.log('[WEB 3] Sign and send transaction for create company');
  // const signedTX = await provider.signAndSendTransaction(tx);
  const signedTX = await provider.signAndSendTransaction(tx);

  console.log('[TX] Create company', { signedTX });
};

export const setupUpdateCompanyIX = async ({
  walletPublicKey,
  companyName,

  address,
}: UpdateCompanyIx): Promise<TransactionInstruction> => {
  const programId = new PublicKey(PROGRAM_ID);
  const { pda } = await generatePda(programId, walletPublicKey);

  const payload = new BorshPayload({
    name: companyName,
    address,
    updated_at: Date.now(),
  });

  // Borsh needs a schema describing the payload
  const updateCompanySchema = new Map([
    [
      BorshPayload,
      {
        kind: 'struct',
        fields: [
          ['name', 'string'],
          ['address', 'string'],
          ['updated_at', 'u64'],
        ],
      },
    ],
  ]);

  const data = borsh.serialize(updateCompanySchema, payload);

  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: walletPublicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
    data: Buffer.concat([Buffer.from(new Uint8Array([1])), Buffer.from(data)]),
  });

  return ix;
};

export const executeUpdateCompanyTx = async (obj: {
  connection: Connection;
  provider: SolanaWallet;
  walletPublicKey: PublicKey;
  companyName: string;
  address: string;
}) => {
  const { connection, provider, walletPublicKey, companyName, address } = obj;
  const ix = await setupUpdateCompanyIX({
    walletPublicKey,
    companyName,
    address,
  });

  const tx = new Transaction();

  const blockhash = (await connection.getRecentBlockhash('finalized'))
    .blockhash;
  tx.add(ix);
  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = blockhash;

  console.log('[WEB 3] Sign and send transaction for Update company');
  const signedTX = await provider.signAndSendTransaction(tx);
  console.log('[TX] Update company', { signedTX });
};
