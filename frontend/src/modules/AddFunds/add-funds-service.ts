import { useHttp } from '../../composables/useHttp';
import type { AddFundsUserDto, ResponseDto } from './add-funds.interfaces';

export class AddFundsService {
  private readonly http = useHttp();

  async addFunds(
    payload: AddFundsUserDto,
    userId: number
  ): Promise<ResponseDto> {
    const url = `/bank-accounts/add-funds/${userId}`;
    return await this.http.$post<ResponseDto, AddFundsUserDto>(url, payload);
  }
}
