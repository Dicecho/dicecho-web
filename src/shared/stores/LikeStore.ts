import { action } from 'mobx';
import BaseProvider from '@/utils/BaseProvider';

class LikeStore {
  @action likeOrCancel(targetName: string, targetId: string, cancel:boolean = false) {
    if (cancel) {
      return BaseProvider.post('/api/like/cancel', {
        targetName,
        targetId,
      })
    }

    return BaseProvider.post('/api/like/', {
      targetName,
      targetId,
    })
  }

  @action dislikeOrCancel(targetName: string, targetId: string, cancel:boolean = false) {
    if (cancel) {
      return BaseProvider.post('/api/like/cancel', {
        targetName,
        targetId,
      })
    }

    return BaseProvider.post('/api/like/dislike/', {
      targetName,
      targetId,
    })
  }

  @action declareOrCancel(targetName: string, targetId: string, attitude: string, cancel: boolean = false) {
    if (cancel) {
      return BaseProvider.post<{
        declareCounts: Record<string, number>;
        declareStatus: Record<string, boolean>;
      }>('/api/like/declare/cancel', {
        targetName,
        targetId,
        attitude,
      })
    }

    return BaseProvider.post<{
      declareCounts: Record<string, number>;
      declareStatus: Record<string, boolean>;
    }>('/api/like/declare/', {
      targetName,
      targetId,
      attitude,
    })
  }
}

export default new LikeStore();
