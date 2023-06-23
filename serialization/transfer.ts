export class TransferInstruction {
  amount = 0;
  constructor(fields: { amount: number } | undefined = undefined) {
    if (fields) {
      this.amount = fields.amount;
    }
  }
}

export const TransferInstructionSchema = new Map([
  [TransferInstruction, { kind: 'struct', fields: [['amount', 'u64']] }],
]);
