import { useHttp } from '../../composables/useHttp';
import type { WithdrawFundsUserDto, ResponseDto } from './withdraw-funds.interfaces';

export class WithdrawFundsService {
  private readonly http = useHttp();

  async withdrawFunds(
    payload: WithdrawFundsUserDto,
    userId: number
  ): Promise<ResponseDto> {
    const url = `/bank-accounts/withdraw/${userId}`;
    return await this.http.$post<ResponseDto, WithdrawFundsUserDto>(url, payload);
  }
}
