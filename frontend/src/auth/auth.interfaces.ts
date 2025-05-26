export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string
}

export interface CountryPrefix {
  id: number;
  prefix: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  identification: string;
  email: string;
  password: string;
  country: string;
  state: string;
  address: string;
  phoneNumber: string;
}

export interface SignUpResponse {
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
}