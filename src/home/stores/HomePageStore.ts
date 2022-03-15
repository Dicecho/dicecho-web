import { action, observable } from 'mobx';
import BaseProvider from '@/utils/BaseProvider';
import ModuleStore from "@/module/stores/ModuleStore";
import { IModDto, ModSortKey } from "@/interfaces/shared/api";
import { CollectionSingleStore } from '@/collection/store/CollectionStore';

export interface EventDto {
  priority: number,
  imageUrl: string,
  action: string,
  page: string,
  startAt: Date,
  endAt: Date,
}

export interface BannerDto {
  priority: number,
  action: string,
  imageUrl: string,
  link: string,
}

class HomePageStore {
  @observable initialized = false;
  @observable recentlyForeignMods: Array<IModDto> = [];
  @observable recentlyMods: Array<IModDto> = [];
  @observable hotMods: Array<IModDto> = [];
  @observable banners: Array<BannerDto> = [];
  @observable events: Array<EventDto> = [];


  @action fetchBanner = () => {
    return BaseProvider.get<Array<BannerDto>>('/api/config/banner').then((res) => {
      this.banners = res.data;
    })
  }

  @action fetchEvent = () => {
    return BaseProvider.get<Array<EventDto>>('/api/config/event').then((res) => {
      this.events = res.data;
    })
  }

  @action initStore = () => {
    if (this.initialized) {
      return;
    }

    Promise.all([
      ModuleStore.fetchModuleList({ pageSize: 8, filter: { isForeign: true }, sort: { [ModSortKey.CREATED_AT]: -1 } }).then((res) => {
        this.recentlyForeignMods = res.data;
      }),
      ModuleStore.fetchModuleList({ pageSize: 8, filter: { isForeign: false }, sort: { [ModSortKey.CREATED_AT]: -1 } }).then((res) => {
        this.recentlyMods = res.data;
      }),
      ModuleStore.getHot().then((res) => {
        this.hotMods = res.data.data;
      }),
      CollectionSingleStore.fetchRecommendCollection(),
      this.fetchBanner(),
      this.fetchEvent(),
    ]).then(() => {
      this.initialized = true;
    })
  }
}

const store = new HomePageStore();

export default store;
