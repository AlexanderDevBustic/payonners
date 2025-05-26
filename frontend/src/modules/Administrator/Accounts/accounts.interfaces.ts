export interface CreateBankAccountDto {
  identificationNumber: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  country: string;
  currency: string;
  accountCategory: string;
  userId: number;
}

export interface BankAccountResponseDto {
  id: number;
  identificationNumber: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  country: string;
  currency: string;
  accountCategory: string;
  balance: number;
  userId: number;
}

export interface AddFundsDto {
  amount: number
}