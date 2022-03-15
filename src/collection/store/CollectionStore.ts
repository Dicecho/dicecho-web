import { observable, action, computed } from "mobx";
import { PaginatedResponse, SortOrder, PageableQuery } from '@/interfaces/shared/api';
import { IModDto } from '@/module/stores/ModuleStore';

import BaseProvider from "@/utils/BaseProvider";
import qs from 'qs';

export enum AccessLevel {
  Public = 'public',
  Private = 'private',
}

export const AccessLevelMap = {
  [AccessLevel.Private]: '私密',
  [AccessLevel.Public]: '公开',
}

export interface ICollectionItem {
  targetName: string;
  targetId: string;
}

export interface ICollectionDto {
  _id: string;
  name: string;
  description: string;
  coverUrl: string;
  isDefault: boolean;
  accessLevel: AccessLevel;
  createdAt: string;
  user: {
    _id: string;
    avatarUrl: string;
    nickName: string;
  };
  isFavorited: boolean;
  canEdit: boolean;
  favoriteCount: number;
  commentCount: number;
  items: Array<ICollectionItem>;
}


export interface UpdateCollectionItemsDto {
  items: Array<ICollectionItem>;
}


export interface UpdateCollectionDto {
  name: string;
  description: string;
  coverUrl: string;
  accessLevel: AccessLevel;
}

export enum CollectionSortKey {
  CREATED_AT = 'createdAt',
  FAVORITE_COUNT = 'favoriteCount',
}

export interface CollectionFilter {
  isRecommend: boolean;
}

export interface CollectionListQuery {
  readonly pageSize: number;
  readonly page: number;
  readonly sort?: Partial<Record<CollectionSortKey, SortOrder>>;
  readonly targetName?: string;
  targetId?: string;
  creatorId?: string;
  readonly filter?: Partial<CollectionFilter>;
}



class CollectionStore {
  @observable mineCollection: Array<ICollectionDto> = [];
  @observable initialized: boolean = false;
  @observable recommendCollection: Array<ICollectionDto> = [];

  @computed get managerCollections() {
    return this.mineCollection.filter(c => c.canEdit)
  }

  @action getMineCollection = () => {
    if (this.mineCollection.length > 0) {
      return Promise.resolve(this.mineCollection);
    }
    return this.fetchMineCollection().then((res) => {
      this.mineCollection = res.data;
      return res.data;
    })
  }

  @action fetchCollections = (query: Partial<CollectionListQuery>) => {
    return BaseProvider.get<PaginatedResponse<ICollectionDto>>(`/api/collection?${qs.stringify(query)}`);
  }

  @action fetchRecommendCollection = () => {
    return this.fetchCollections({
      pageSize: 6,
      filter: { isRecommend: true },
      sort: { createdAt: -1 },
    }).then((res) => {
      this.recommendCollection = res.data.data;
    });
  }

  @action fetchMineCollection = () => {
    return BaseProvider.get<Array<ICollectionDto>>(`/api/collection/mine`);
  }

  @action fetchCollectionDetail = (uuid: string) => {
    return BaseProvider.get<ICollectionDto>(`/api/collection/${uuid}`);
  }

  @action getCollectionStatus = (item: ICollectionItem) => {
    return BaseProvider.get<Record<string, boolean>>(`/api/collection/status?${qs.stringify(item)}`);
  }

  @action addItemForCollection = (uuid: string, item: ICollectionItem) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}/add`, item).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === uuid);
      if (index !== -1) {
        this.mineCollection[index].items = [...this.mineCollection[index].items.concat(item)];
        this.mineCollection = [...this.mineCollection];
      }

      return res;
    });
  }

  @action removeItemForCollection = (uuid: string, item: ICollectionItem) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}/remove`, item).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === uuid);
      if (index !== -1) {
        const spliceIndex = this.mineCollection[index].items.findIndex((i) => i.targetId === item.targetId && i.targetName === item.targetName);
        if (spliceIndex !== -1) {
          this.mineCollection[index].items.splice(spliceIndex, 1);
          this.mineCollection = [...this.mineCollection];
        }
      }

      return res;
    });
  }

  @action getCollectionItems = (uuid: string) => {
    return BaseProvider.get<IModDto[]>(`/api/collection/${uuid}/items`).then((res) => {
      return res.data;
    });
  }

  @action updateCollectionItems = (uuid: string, dto: Partial<UpdateCollectionItemsDto>) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}/items`, dto).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === res.data._id);
      if (index !== -1) {
        this.mineCollection[index] = res.data;
        this.mineCollection = [...this.mineCollection];
      }

      return res;
    });
  }

  @action updateCollection = (uuid: string, dto: Partial<UpdateCollectionDto>) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}`, dto).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === res.data._id);
      if (index !== -1) {
        this.mineCollection[index] = res.data;
        this.mineCollection = [...this.mineCollection];
      }

      return res;
    });
  }

  @action createCollection = (name: string) => {
    return BaseProvider.post<ICollectionDto>(`/api/collection/`, { name }).then((res) => {
      this.mineCollection = [...this.mineCollection.concat(res.data)];
      return res;
    });
  }

  @action deleteCollection = (uuid: string) => {
    return BaseProvider.delete(`/api/collection/${uuid}`).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === uuid);
      if (index !== -1) {
        this.mineCollection.splice(index, 1);
        this.mineCollection = [...this.mineCollection];
      }
      return res;
    });
  }

  @action favoriteCollection = (uuid: string) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}/favorite`).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === uuid);
      if (index !== -1) {
        this.mineCollection[index] = res.data;
        this.mineCollection = [...this.mineCollection];
      }
      return res;
    });
  }

  @action cancelFavoriteCollection = (uuid: string) => {
    return BaseProvider.put<ICollectionDto>(`/api/collection/${uuid}/cancelFavorite`).then((res) => {
      const index = this.mineCollection.findIndex((c) => c._id === uuid);
      if (index !== -1) {
        this.mineCollection[index] = res.data;
        this.mineCollection = [...this.mineCollection];
      }
      return res;
    });
  }


}

const CollectionSingleStore = new CollectionStore();
export { CollectionSingleStore };
export { CollectionStore };
