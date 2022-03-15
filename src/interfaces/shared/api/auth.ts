export interface ILoginUserDto {
  email: string;
  password: string;
}

export interface IRefreshTokenDto {
  refreshToken: string;
}

export interface ILocalApiResponse {
  accessToken: string,
  refreshToken: string,
}

export interface IRefreshApiResponse {
  accessToken: string,
  refreshToken: string,
}