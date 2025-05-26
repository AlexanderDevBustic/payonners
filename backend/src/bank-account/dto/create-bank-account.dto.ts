export class CreateBankAccountDto {
  identificationNumber: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Personal' | 'Negocio';
  country: string;
  currency: 'COP' | 'USD' | 'EUR';
  accountCategory: 'Cuenta Corriente' | 'Cuenta Ahorros';
  userId: number;
  balance?: number;
}
