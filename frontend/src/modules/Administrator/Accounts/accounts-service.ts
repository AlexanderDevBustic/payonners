import { useHttp } from '../../../composables/useHttp';
import type { BankAccountResponseDto, CreateBankAccountDto } from './accounts.interfaces';

export class BankAccountService {
  private readonly http = useHttp();

  async createBankAccount(payload: CreateBankAccountDto): Promise<BankAccountResponseDto> {
    const url = '/bank-accounts';
    return await this.http.$post<BankAccountResponseDto, CreateBankAccountDto>(url, payload);
  }

  async getBankAccountsByUserId(userId: number): Promise<BankAccountResponseDto[]> {
    const url = `/bank-accounts/user/${userId}`;
    return await this.http.$get<BankAccountResponseDto[]>(url);
  }

  async getAllBankAccounts(): Promise<BankAccountResponseDto[]> {
    const url = `/bank-accounts`;
    return await this.http.$get<BankAccountResponseDto[]>(url);
  }
}