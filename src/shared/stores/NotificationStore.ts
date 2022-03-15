import { action, observable } from 'mobx';
import { PaginatedResponse } from '@/interfaces/shared/api';
import BaseProvider from '@/utils/BaseProvider';
import qs from 'qs';


export enum NotificationType {
  Like = 'like',
  Comment = 'comment',
  Reply = 'reply',
  Follow = 'follow',
}

export interface NotificationFilter {
  type: NotificationType;
  isUnread: boolean;
}

export interface NotificationListQuery {
  pageSize: number;
  page: number;
  filter: Partial<NotificationFilter>;
}

export interface BaseNotificationDto {
  _id: string;
  sender?: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
  recipient: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
  isUnread: boolean;
  createdAt: Date;
}

export interface INotificationLikeRate extends BaseNotificationDto {
  type: NotificationType.Like,
  data: {
    targetName: 'Rate',
    targetId: string,
    content: string,
    attitude: string,
    mod: {
      _id: string,
      title: string,
    }
  }
}

export interface INotificationLikeComment extends BaseNotificationDto {
  type: NotificationType.Like,
  data: {
    targetName: 'Comment',
    targetId: string,
    content: string,
    attitude: string,
  }
}

export interface INotificationConmmentCollection extends BaseNotificationDto {
  type: NotificationType.Comment,
  data: {
    _id: string,
    targetName: 'Collection',
    targetId: string,
    content: string,
    collection: {
      _id: string,
      title: string,
    }
  }
}

export interface INotificationConmmentRate extends BaseNotificationDto {
  type: NotificationType.Comment,
  data: {
    _id: string,
    targetName: 'Rate',
    targetId: string,
    content: string,
    remark: string,
    mod: {
      _id: string,
      title: string,
    }
  }
}

export interface INotificationConmmentTopic extends BaseNotificationDto {
  type: NotificationType.Comment,
  data: {
    _id: string,
    targetName: 'Topic',
    targetId: string,
    content: string,
    topic: {
      title: string,
    },
    domain: {
      _id: string,
      title: string,
    }
  }
}

export interface INotificationReply extends BaseNotificationDto {
  type: NotificationType.Reply,
  data: {
    _id: string,
    targetName: string,
    targetId: string,
    content: string,
    replyToContent: string,
  }
}

export type INotificationReplyDto = INotificationReply;
export type INotificationCommentDto = INotificationConmmentRate | INotificationConmmentTopic | INotificationConmmentCollection;
export type INotificationLikeDto = INotificationLikeRate | INotificationLikeComment;

export type INotificationDto = INotificationLikeDto | INotificationCommentDto | INotificationReplyDto;

export interface NotificationPaginatedResponse<T> extends PaginatedResponse<T> {
  unreadCount: number;
}

class NotificationStore {
  @observable initialized = false;
  @observable loading = false;
  @observable lastFetchAt: Date = new Date();



  @observable lastQuery: Partial<NotificationListQuery> | undefined = undefined;
  @observable unreadNotificationHasNext: boolean = false;
  @observable unreadNotificationLoading: boolean = false;
  @observable unreadNotificationPage: number = 0;
  @observable unreadNotificationTotal: number = 0;
  @observable unreadNotificationCount: number = 0;
  @observable unreadNotification: Array<INotificationDto> = [];


  _fetchUnreadNotificationsPromise?: Promise<void>
  @action fetchUnreadNotifications = (query?: Partial<NotificationListQuery>) => {
    if (this._fetchUnreadNotificationsPromise) {
      return this._fetchUnreadNotificationsPromise;
    }

    this.unreadNotificationLoading = true;
    this._fetchUnreadNotificationsPromise = this.fetchNotifications(query).then((res) => {
      this.unreadNotification = res.data.data;
      this.unreadNotificationPage = res.data.page;
      this.unreadNotificationHasNext = res.data.hasNext;
      this.unreadNotificationCount = res.data.unreadCount;
      this.unreadNotificationTotal = res.data.totalCount;
      this.lastFetchAt = new Date();
      this.lastQuery = query;
      this.initialized = true;
    }).finally(() => {
      this._fetchUnreadNotificationsPromise = undefined;
      this.unreadNotificationLoading = false;
    })
    return this._fetchUnreadNotificationsPromise;
  }

  _loadNextUnreadNotificationsPromise?: Promise<void>;
  @action loadNextUnreadNotifications = (query?: Partial<NotificationListQuery>) => {
    if (this._loadNextUnreadNotificationsPromise) {
      return this._loadNextUnreadNotificationsPromise;
    }

    this.unreadNotificationLoading = true;
    this._loadNextUnreadNotificationsPromise = this.fetchNotifications(query).then((res) => {
      this.unreadNotificationPage = res.data.page;
      this.unreadNotificationHasNext = res.data.hasNext;
      this.unreadNotificationCount = res.data.unreadCount;
      this.unreadNotificationTotal = res.data.totalCount;
      this.unreadNotification = [...this.unreadNotification.concat(res.data.data)];
      this.lastFetchAt = new Date();
      this.lastQuery = query;
      this.initialized = true;
    }).finally(() => {
      this._loadNextUnreadNotificationsPromise = undefined;
      this.unreadNotificationLoading = false;
    })

    return this._loadNextUnreadNotificationsPromise
  }

  @action loadNext = () => {
    return this.loadNextUnreadNotifications({
      ...this.lastQuery,
      page: this.unreadNotificationPage + 1,
    })
  };
  
  @action fetchNotifications = (query?: Partial<NotificationListQuery>) => {
    return BaseProvider.get<NotificationPaginatedResponse<INotificationDto>>(`/api/notification?${qs.stringify(query)}`)
  }

  @action markRead = (uuid: string) => {
    return BaseProvider.post<INotificationDto>(`/api/notification/${uuid}/mark`).then((res) => {
      const index = this.unreadNotification.findIndex(n => n._id === uuid);
      if (index !== -1) {
        this.unreadNotification[index] = res.data;
        this.unreadNotification = [...this.unreadNotification]
        this.unreadNotificationCount -= 1
      }
      return res.data;
    })
  }

  @action markAllRead = () => {
    return BaseProvider.post(`/api/notification/markAll`).then(() => {
      this.unreadNotification.map((n) => {
        n.isUnread = false;
      })
      this.unreadNotification = [...this.unreadNotification];
      this.unreadNotificationCount = 0;
    })
  }

  

}

export default new NotificationStore();
