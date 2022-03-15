import { observable, action } from 'mobx';
import BaseProvider, { setAccessToken, setRefreshToken, getRefreshToken, refreshTokens, clearRefreshToken } from '@/utils/BaseProvider';
import { ILocalApiResponse, IPorileApiResponse, IUserDto, IEmailRegisterUserDto } from '@/interfaces/shared/api';
import { EVENT_KEYS } from 'shared/constants';

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfileDto {
  nickName: string;
  avatarUrl: string;
  backgroundUrl: string;
  note: string;
  notice: string;
}

class AuthStore {
  @observable initialized = false;
  @observable loading = false;
  
  @observable user: IUserDto = {
    _id: '',
    nickName: '',
    avatarUrl: '',
    pendantUrl: '',
    note: '',
    notice: '',
    backgroundUrl: '',
    email: '',
    roles: [],

    likedCount: 0,
    rateCount: 0,
    contributionCount: 0,
    followerCount: 0,
    followingCount: 0,
    isFollowed: false,
  };
  @observable isAuthenticated = false;
  @observable isLoggingIn = false;


  constructor() {
    this.init();
  }

  @action async init() {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      this.initialized = true;
      return Promise.resolve();
    }

    return refreshTokens()
      .then(() => {
        this.isAuthenticated = true;
        window.dispatchEvent(new Event(EVENT_KEYS.UserLogin))
      })
      .catch(async () => {
        await this.logout();
        this.initialized = true;
      })
  }

  @action _update(user: IUserDto) {
    this.user = user;
  }

  @action fetchUserData() {
    return BaseProvider.get<IPorileApiResponse>('/api/user/profile/').then((res) => {
      this._update(res.data);
      return res.data;
    })
    .finally(() => {
      this.initialized = true
    });
  }

  @action updateProfile = async (updateProfileDto: Partial<IUpdateProfileDto>) => {
    return BaseProvider.put<IPorileApiResponse>('/api/user/profile/', updateProfileDto).then((res) => {
      this._update(res.data);
      return res.data;
    });
  }

  @action changePassword = async (changePasswordDto: ChangePasswordDto) => {
    return BaseProvider.put<IPorileApiResponse>('/api/user/password/', changePasswordDto);
  }

  @action _handleLoggedIn(access: string, refresh: string) {
    setAccessToken(access);
    setRefreshToken(refresh).then(() => {
      window.dispatchEvent(new Event(EVENT_KEYS.UserLogin))
    });
    this.isAuthenticated = true;
  }

  @action async login(email: string, password: string) {
    if (this.isLoggingIn) {
      return Promise.reject({ detail: '重复登录' });
    }
    this.isLoggingIn = true;
    return BaseProvider.post<ILocalApiResponse>(
        '/api/auth/local/',
        {
          email: email,
          password: password,
        }
      ).then(res =>
        this._handleLoggedIn(
          res.data.accessToken,
          res.data.refreshToken,
        ),
      )
      .finally(() => (this.isLoggingIn = false));
  }

  @action signup = (data: IEmailRegisterUserDto) => {
    return BaseProvider.post('/api/user/register/email', data);
  }

  @action forget = (data: { email: string }) => {
    return BaseProvider.post('/api/user/send-rescue', data);
  }

  @action vertify = (data: { email: string, vertifyCode: string, nickName: string, password: string }) => {
    return BaseProvider.post('/api/user/vertify', data);
  }

  @action checkVertify = (data: { email: string, vertifyCode: string }) => {
    return BaseProvider.post('/api/user/check-vertify', data);
  }

  @action rescue = (data: { email: string, rescueCode: string, newPassword: string }) => {
    return BaseProvider.post('/api/user/rescue', data);
  }

  @action async logout() {  
    return clearRefreshToken().then(() => {
      window.dispatchEvent(new Event(EVENT_KEYS.UserLogout))
      this.reset();
    });
  }

  @action checkRole = (role: string) => {
    if (!this.isAuthenticated) {
      return false;
    }

    if (!this.user.roles || this.user.roles.length === 0) {
      return false;
    }

    if (this.user.roles.findIndex(r => r === 'superuser') !== -1) {
      return true;
    }

    return this.user.roles.findIndex(r => r === role) !== -1
  }

  @action reset = () => {
    this.loading = false;
    this.user =  {
      _id: '',
      nickName: '',
      avatarUrl: '',
      pendantUrl: '',
      note: '',
      notice: '',
      backgroundUrl: '',
      email: '',
      roles: [],

      likedCount: 0,
      rateCount: 0,
      contributionCount: 0,
      followerCount: 0,
      followingCount: 0,
      isFollowed: false,
    };
    this.isAuthenticated = false;
  }
}

export default new AuthStore();
