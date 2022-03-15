import { action, observable } from 'mobx';
import { PaginatedResponse } from '@/interfaces/pagination';
import { SortOrder, ISimpleUserDto } from '@/interfaces/shared/api';
import BaseProvider from '@/utils/BaseProvider';
import qs from 'qs';

export interface CommentDto {
  targetId: string,
  targetName: string,
  content: string,
  createdAt: Date,
  likeCount: number,
  repliesCount: number,
  isLiked: boolean,
  canEdit: boolean,
  _id: string,
  user: ISimpleUserDto,
}

export interface ReplyDto extends CommentDto {
  parentId: string,
  replyTo: CommentDto,
}

export interface ParentCommentDto extends CommentDto {
  repliesPagination: {
    load: boolean;
    page: number;
    total: number;
  },
  replies: Array<ReplyDto>,
}



// export interface IRateFilter {
//   view: RateView,
//   rate: Partial<{ [key in Operation]: number }>,
//   remarkLength: Partial<{ [key in Operation]: any }>,
//   isAnonymous: boolean,
// }

export enum CommentSortKey {
  LIKE_COUNT = 'likeCount',
  CREATED_AT = 'createdAt',
}


export type ICommentSort = {
  [key in CommentSortKey]: SortOrder;
}


export interface ICommentQuery {
  pageSize: number;
  page: number;
  sort: Partial<ICommentSort>;
}


class CommentStore {
  @observable initialized = false;
  @observable loading = false;
  @observable currentName = '';
  @observable currentId = '';
  @observable currentQuery: Partial<ICommentQuery> = {};
  @observable comments: Array<ParentCommentDto> = [];
  @observable commentsTotal: number = 0;
  @observable commentsHasNext: boolean = false;
  @observable commentsPage: number = 1;

  @observable dialogTargetId = '';
  @observable dialogModalVisible = false;

  @action initStore(targetName: string, targetId: string, query: Partial<ICommentQuery> = {}) {
    this.currentName = targetName;
    this.currentId = targetId;
    this.currentQuery = query;
    this.fetchComments(targetName, targetId, query).then(() => {
      this.initialized = true;
    })
  }

  @action async fetchComments(targetName: string, targetId: string, query: Partial<ICommentQuery> = {}) {
    if (this.loading) {
      return Promise.reject('正在获取评论中')
    }
    this.loading = true;
    return BaseProvider.get<PaginatedResponse<ParentCommentDto>>(`/api/comment/${targetName}/${targetId}?${qs.stringify(query)}`).then((result) => {
      this.comments = result.data.data.map((c) => ({ 
        ...c, 
        repliesPagination: {
          load: false,
          page: 1,
          total: c.repliesCount,
        }
      }));
      this.commentsTotal = result.data.totalCount;
      this.commentsHasNext = result.data.hasNext;
      this.commentsPage = result.data.page;
    }).finally(() => {
      this.loading = false;
    })
  }

  @action async loadNext() {
    if (this.loading) {
      return Promise.reject('正在获取评论中')
    }

    this.loading = true;
    return BaseProvider.get<PaginatedResponse<ParentCommentDto>>(
      `/api/comment/${this.currentName}/${this.currentId}?${qs.stringify({ ...this.currentQuery, page: this.commentsPage + 1 })}`).then((result) => {
      this.comments = this.comments.concat(result.data.data.map((c) => ({ 
        ...c, 
        repliesPagination: {
          load: false,
          page: 1,
          total: c.repliesCount,
        }
      })))
      this.comments = [...this.comments];
      this.commentsHasNext = result.data.hasNext;
      this.commentsPage = result.data.page;
    }).finally(() => {
      this.loading = false;
    })
  }


  @action fetchCommentReplies(commentId: string, page: number = 1) {
    const query = {
      page,
    }

    const index = this.comments.findIndex(c => c._id === commentId)
    if (index === -1) {
      return Promise.resolve('未找到需要获取回复的评论')
    }

    return BaseProvider.get<PaginatedResponse<ReplyDto>>(
      `/api/comment/${commentId}/replies?${qs.stringify(query)}`
    ).then((result) => {
      this.comments[index].replies = [...result.data.data];
      this.comments[index].repliesPagination.load = true;
      this.comments[index].repliesPagination.page = result.data.page;
      this.comments[index].repliesPagination.total = result.data.totalCount;
      this.comments = [...this.comments];
    })
  }

  @action comment(targetName: string, targetId: string, content: string) {
    return BaseProvider.post<ParentCommentDto>(
      `/api/comment/${targetName}/${targetId}`,
      { content },
    ).then((result) => {
      this.comments.unshift(result.data);
      this.comments = [...this.comments];
    })
  }

  @action replyTo(commentId: string, content: string, parentCommentId?: string) {
    return BaseProvider.post<ReplyDto>(
      `/api/comment/${commentId}/reply`,
      { content },
    ).then((result) => {
      if (parentCommentId) {
        const index = this.comments.findIndex(c => c._id === parentCommentId)
        this.comments[index].replies.push(result.data);
        this.comments = [...this.comments];
      }
    })
  }

  @action getDialog(commentId: string) {
    return BaseProvider.get<Array<ReplyDto>>(`/api/comment/${commentId}/dialog`)
  }

  @action deleteObj(commentId: string) {
    return BaseProvider.delete(`/api/comment/${commentId}`)
  }

  @action onRemoveComment(commentId: string) {
    const index = this.comments.findIndex((c) => c._id === commentId)
    if (index !== -1) {
      this.comments.splice(index, 1);
      this.comments = [...this.comments];
    }
  }

  @action onRemoveReply(parentId: string, commentId: string) {
    const parentIndex = this.comments.findIndex((c) => c._id === parentId)
    if (parentIndex === -1) {
      return;
    }

    const index = this.comments[parentIndex].replies.findIndex((c) => c._id === commentId)
    if (index === -1) {
      return;
    }

    this.comments[parentIndex].replies.splice(index, 1);
    this.comments[parentIndex].replies = [...this.comments[parentIndex].replies]
    this.comments = [...this.comments];
  }

  @action openDialogModal = (commentId: string) => {
    this.dialogTargetId = commentId;
    this.dialogModalVisible = true;
  };

  @action closeDialogModal = () => {
    this.dialogModalVisible = false;
  };
}

const CommentSingleStore = new CommentStore();
export { CommentSingleStore };

export default CommentStore
