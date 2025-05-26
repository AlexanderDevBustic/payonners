import { useHttp } from '../../../composables/useHttp';
import type { Transacction } from './transacctions.interfaces';

export class TransacctionService {
  private readonly http = useHttp();

  async getAllTransacctions(): Promise<Transacction[]> {
    const url = `/bank-accounts/transactions`;
    return await this.http.$get<Transacction[]>(url);
  }

  async getTransacctionsByUserId(userId: number): Promise<Transacction[]> {
    const url = `/bank-accounts/transactions/user/${userId}`;
    return await this.http.$get<Transacction[]>(url);
  }
}
