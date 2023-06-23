export const formatDecimals = (
  amount: bigint | number,
  decimals: number
): string => {
  const numAmount = Number(amount) / 10 ** decimals;
  return numAmount.toString();
};
