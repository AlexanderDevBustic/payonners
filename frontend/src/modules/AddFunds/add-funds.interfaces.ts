export interface AddFundsUserDto {
  amount: number;
  currency: string;
}

export interface ResponseDto {
  message: string;
  newBalance: number;
}
