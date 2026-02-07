export type Balance = {
  currentCredit: number;
};

export type Options = {
  id: number;
  amount: number;
  basicCredit: number;
  bonusCredit: number;
  totalCredit: number;
  bonusRateText: string;
};

export type Result = {
  status: string;
  paymentId: string;
  addedCredit: number;
  totalBalance: number;
};
