import { useHttp } from '../../composables/useHttp';
import type { FundsWithdrawDto, ResponseDto } from './widthdraw.interfaces';

export class WithdrawService {
  private readonly http = useHttp();

  async withdraw(payload: FundsWithdrawDto, userId: number): Promise<ResponseDto> {
    const url = `/bank-accounts/withdraw/${userId}`;
    return await this.http.$post<ResponseDto, FundsWithdrawDto>(url, payload);
  }

  
}