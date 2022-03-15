import { observable, action, computed } from "mobx";
import {
  IRateDto,
  IRateListQuery,
  IRateListApiResponse,
  IRatePostApiResponse,
  RateType,
  AccessLevel,
  RemarkContentType,
} from "interfaces/shared/api";
import AuthStore from '@/shared/stores/AuthStore';
import UIStore from '@/shared/stores/UIStore';
import BlockStore from '@/shared/stores/BlockStore';
import BaseProvider from "@/utils/BaseProvider";
import qs from "qs";
import { PostRateDto } from '@/rate/interfaces';
export * from '@/interfaces/shared/api';


class RateStore {
  @observable initialized = false;
  @observable loading = false;
  @observable currentModuleId: string = '';
  @observable currentModuleRate?: IRateDto;
  @observable currentModuleHasRated: boolean = false;
  @observable currenRateType?: RateType;


  @observable rates: Array<IRateDto> = [];
  @observable ratesTotal: number = 0;
  @observable ratesHasNext: boolean = false;
  @observable ratesPage: number = 1;

  @observable ratesPostModalVisible: boolean = false;

  // @observable moduleDetail?: IModDto;

  @observable repository: Record<string, IRateDto> = {};
  @computed get repositoryList() {
    return Object.values(this.repository)
  }
  
  @action addItemToRepository = (item: IRateDto) => {
    this.repository[item._id] = item;
  }

  @action addItemsToRepository = (items: IRateDto[]) => {
    items.map(this.addItemToRepository)
  }

  @action initStore = (modId: string, query: Partial<IRateListQuery> = {}) => {
    if (this.initialized && this.currentModuleId === modId) {
      return Promise.resolve();
    }

    this.resetRate();
    this.currentModuleId = modId;
    return Promise.all([
      this.fetchSelfRate(),
    ]).then(() => {
      this.initialized = true;
    })
  };

  @action initModuleRateList = (modId: string, query: Partial<IRateListQuery>) => {
    return this.fetchModuleRateList(modId, query).then((res) => {
      this.rates = res.data;
      this.ratesTotal = res.totalCount;
      this.ratesPage = res.page;
      this.ratesHasNext = res.hasNext;
      this.initialized = true;
      return res.data;
    });
  };

  @action loadNext = (modId: string, query: Partial<IRateListQuery>) => {
    query.page = this.ratesPage + 1;
    return this.fetchModuleRateList(modId, query).then((res) => {
      this.rates = [...this.rates.concat(res.data)];
      this.ratesPage = res.page;
      this.ratesHasNext = res.hasNext;
    });
  };

  _innerPromise?: Promise<IRateListApiResponse> 
  @action fetchModuleRateList = (
    modId: string,
    query: Partial<IRateListQuery> = {}
  ): Promise<IRateListApiResponse> => {
    if (this._innerPromise) {
      return this._innerPromise;
    }

    query.modId = modId;

    this._innerPromise = this.fetchModuleRateListApi(query).finally(() => {
      this._innerPromise = undefined;
    });
    return this._innerPromise
  };

  @action fetchModuleRateListApi = (
    query: Partial<IRateListQuery> = {}
  ): Promise<IRateListApiResponse> => {
    return BaseProvider.get<IRateListApiResponse>(
      `/api/rate/?${qs.stringify(query)}`
    ).then((res) => {
      this.addItemsToRepository(res.data.data);
      return res.data;
    })
  };

  @action fetchRateDetailApi = (
    uuid: string,
    forceRefresh: boolean = true,
  ): Promise<IRateDto> => {
    if (!forceRefresh && this.repository[uuid]) {
      return Promise.resolve(this.repository[uuid]);
    }

    return BaseProvider.get<IRateDto>(
      `/api/rate/${uuid}`
    ).then((res) => {
      this.addItemToRepository(res.data);
      return res.data;
    })
  };

  @action markModule = (modId: string) => {
    return this.postModuleRate(
      modId, 
      { 
        type: RateType.Mark,
        accessLevel: AccessLevel.Public,
        remarkType: RemarkContentType.Richtext,
      }
    )
  };

  @action postModuleRate = (modId: string, dto: Partial<PostRateDto>) => {
    if (this.loading) {
      return Promise.reject("正在上传中");
    }

    this.loading = true;
    return BaseProvider.post<IRatePostApiResponse>(`/api/rate/mod/${modId}`, dto)
      .then((res) => {
        if (this.currentModuleId === modId) {
          this.rates = [...this.rates.concat(res.data)];
          this.currentModuleRate = res.data;
          this.currentModuleHasRated = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  };

  @action updateRate = (rateId: string, dto: Partial<PostRateDto>) => {
    if (this.loading) {
      return Promise.reject("正在更新中");
    }

    this.loading = true;

    return BaseProvider.put<IRateDto>(`/api/rate/${rateId}`, dto)
      .then((res) => {
        const index = this.rates.findIndex(rate => rate._id === res.data._id)
        if (index !== -1) {
          this.rates[index] = res.data;
          this.rates = [...this.rates];
        }
        if (this.currentModuleRate?._id === res.data._id) {
          this.currentModuleRate = res.data;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  };

  @action onRemoveRate = (rateId: string) => {
    const index = this.rates.findIndex(rate => rate._id === rateId)
    if (index !== -1) {
      this.rates.splice(index, 1);
      this.rates = [...this.rates];
    }

    if (this.currentModuleRate?._id === rateId) {
      this.currentModuleRate = undefined;
      this.currentModuleHasRated = false;
    }
  }

  @action deleteRate = (rateId: string) => {
    return BaseProvider.delete(`/api/rate/${rateId}`)
  };

  @action blockRate = (rateId: string) => {
    return BlockStore.block('Rate', rateId).then((res) => {
        const index = this.rates.findIndex(rate => rate._id === res.data._id)
        if (index !== -1) {
          this.rates[index] = res.data;
          this.rates = [...this.rates];
        }
        if (this.currentModuleRate?._id === res.data._id) {
          this.currentModuleRate = res.data;
        }
      });
  }

  @action hideRate = (rateId: string, hideDto: {
    log: string;
    message: string;
  }) => {
    return BaseProvider.post(`/api/rate/${rateId}/hide`, hideDto);
  }

  @action reportSpoiler = (rateId: string) => {
    return BaseProvider.post<IRateDto>(`/api/rate/${rateId}/reportSpoiler`)
      .then((res) => {
        const index = this.rates.findIndex(rate => rate._id === res.data._id)
        if (index !== -1) {
          this.rates[index] = res.data;
          this.rates = [...this.rates];
        }
        if (this.currentModuleRate?._id === res.data._id) {
          this.currentModuleRate = res.data;
        }
      });
  }

  @action fetchSelfRate = (): Promise<any> => {
    if (!AuthStore.isAuthenticated) {
      return Promise.resolve();
    }

    const query = {
      userId: AuthStore.user._id,
      modId: this.currentModuleId,
    }

    return BaseProvider.get<IRateListApiResponse>(
      `/api/rate/?${qs.stringify(query)}`
    ).then((res) => {
      if (res.data.data.length !== 0) {
        this.currentModuleRate = res.data.data[0];
        this.currentModuleHasRated = true;
      }
    });
  };

  @action openRatesPostModal = (type?: RateType) => {
    if (!AuthStore.isAuthenticated) {
      UIStore.openLoginModal({
        callBack: () => {
          this.ratesPostModalVisible = true;
          this.currenRateType = type;
        },
      });
      return;
    }
    this.ratesPostModalVisible = true;
    this.currenRateType = type;
  }

  @action closeRatesPostModal = () => {
    this.ratesPostModalVisible = false;
  }

  @action resetRate = () => {
    this.initialized = false;
    this.loading = false;
    this.currentModuleId = '';
    this.currentModuleRate = undefined;
    this.currentModuleHasRated = false;
    this.rates = [];
    this.ratesTotal = 0;
    this.ratesHasNext = false;
    this.ratesPage = 1;
  }
}

const store = new RateStore();

export default store;
