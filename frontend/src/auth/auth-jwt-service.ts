import { decode } from 'js-base64';

export class TokenService {
  private static readonly TOKEN_KEY = 'AUTH_TOKEN';

  public static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public static parseToken(token: string): any {
    const base64Payload = token.split('.')[1];
    const decodedPayload = decode(base64Payload);
    return JSON.parse(decodedPayload);
  }

  public static getUserInfo(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return this.parseToken(token);
  }

  public static getClaim(claimName: string): any | null {
    const userInfo = this.getUserInfo();
    if (!userInfo || !userInfo[claimName]) {
      return null;
    }
    return userInfo[claimName];
  }
}