export type IPorileApiResponse = IUserDto;

export interface IUserDto {
  _id: string;
  nickName: string;
  note: string;
  notice: string;
  avatarUrl: string;
  pendantUrl: string;
  backgroundUrl: string;
  email?: string;
  roles?: Array<string>;

  likedCount: number;
  rateCount: number;
  contributionCount: number;
  followerCount: number;
  followingCount: number;
  isFollowed: boolean;
}

export interface ISimpleUserDto {
  _id: string;
  nickName: string;
  avatarUrl: string;
  pendantUrl: string;
}

export interface IEmailRegisterUserDto {
  email: string;
}
