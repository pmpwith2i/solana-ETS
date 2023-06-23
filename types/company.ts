import { BorshPayload } from '@/serialization/borsh';

export type Company = {
  name: string;
  created_at: bigint;
  updated_at: bigint;
  address: string;
};

export const BorshCompanySchema = new Map([
  [
    BorshPayload,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['address', 'string'],
        ['created_at', 'u64'],
        ['updated_at', 'u64'],
      ],
    },
  ],
]);
