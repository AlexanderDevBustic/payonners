export interface ResponseDto {
  message: string;
  newBalance: number;
}

export interface WithdrawFundsUserDto {
  amount: number;
  currency: string;
  accountId: number
}
