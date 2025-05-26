import { useHttp } from '../composables/useHttp';
import type { CountryPrefix, LoginPayload, LoginResponse, SignUpPayload, SignUpResponse } from './auth.interfaces';
import { TokenService } from './auth-jwt-service';

export const removeToken = (): void => {
  TokenService.removeToken();
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { $post } = useHttp();

  try {
    const response = await $post<LoginResponse, LoginPayload>(
      '/auth/sign-in',
      payload
    );
    TokenService.setToken(response.accessToken);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  const { $post } = useHttp();

  try {
    const response = await $post<SignUpResponse, SignUpPayload>(
      '/auth/sign-up',
      payload
    );
    return response;
  } catch (error) {
    console.error('Sign-up failed:', error);
    throw error;
  }
};

export const fetchCountryPrefixes = async (): Promise<CountryPrefix[]> => {
  const { $get } = useHttp();

  try {
    const countries = await $get<any[]>('https://restcountries.com/v3.1/all');

    const prefixes: CountryPrefix[] = countries
      .filter(country => country.idd && country.idd.root && country.idd.suffixes)
      .map((country, index) => ({
        id: index + 1,
        prefix: `${country.idd.root}${country.idd.suffixes[0] || ''}`,
      }));

    return prefixes;
  } catch (error) {
    console.error('Error fetching country prefixes:', error);
    throw new Error('Failed to fetch country prefixes');
  }
};

export const fetchCountries = async (): Promise<string[]> => {
  const { $get } = useHttp();

  try {
    const data = await $get<any[]>('https://restcountries.com/v3.1/all');
    return data.map((country: any) => country.name.common);
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const logout = (redirectFn: () => void): void => {
  removeToken();
  redirectFn();
};
