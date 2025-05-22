export interface FundsWithdrawDto {
  accountId: number;
  amount: number;
  currency: string;
}

export interface ResponseDto {
    message: string,
    newBalance: number
}