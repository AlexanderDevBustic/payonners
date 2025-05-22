export interface Transacction {
  id: number;
  bankAccountId: number;
  type: string;
  amount: string;
  previousBalance: string;
  newBalance: string;
  userId: number;
  accountNumber: string;
  accountHolder: string;
  currency: string;
  accountCategory: string;
  identificationNumber: string;
  createdAt: string;
}
