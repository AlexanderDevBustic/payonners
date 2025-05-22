export interface UpdateUserDto {
  avatar?: string | null;
  password?: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  email: string;
  country: string;
  state: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  avatar: string | null;
}