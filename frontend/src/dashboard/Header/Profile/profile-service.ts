import { useHttp } from '../../../composables/useHttp';
import type { UpdateUserDto, UserResponse } from './profile.interfaces';

export class ProfileService {
  private readonly http = useHttp();

  async updateUser(
    userId: number,
    payload: UpdateUserDto
  ): Promise<UserResponse> {
    const url = `/auth/update/${userId}`;
    return await this.http.$patch<UserResponse, UpdateUserDto>(url, payload);
  }
}