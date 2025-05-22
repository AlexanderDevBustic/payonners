import { useHttp } from '../../composables/useHttp';
import type { Balance } from './home.interfaces';

export class HomeService {
  private readonly http = useHttp();

  async getAmountCurrencies(userId: number): Promise<Balance> {
    const url = `/bank-accounts/balance/${userId}`;
    return await this.http.$get<Balance>(url);
  }
}