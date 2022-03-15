import { observable, action } from 'mobx';
import BaseProvider from '@/utils/BaseProvider';
import { toJS } from 'mobx';
import { ORIGIN_REVERSE_MAP } from '../constants';
import { CollectionSingleStore, ICollectionDto, CollectionSortKey } from '@/collection/store/CollectionStore'; 
import { IModDto, IModListQuery, ModListApiResponse, ModRetrieveApiResponse, ModOrigin, PaginatedResponse, RateType } from '@/interfaces/shared/api';
import qs from 'qs';
import _ from 'lodash';
import { LanguageCodes } from '@/utils/language';
export * from '@/interfaces/shared/api/mod'

export interface editModDto {
  title: string;
  alias: string;
  description: string;
  coverUrl: string;
  languages: string[];
  imageUrls: string[];
  tags: string[];
  modFiles: Array<{
    name: string;
    size: number;
    url: string;
    type: string;
  }>;
  playerNumber: [number, number];
  moduleRule: string;
  releaseDate: Date;
}

export interface CreateModDto {
  isForeign: boolean;
  title: string;
  alias?: string;
  description?: string;
  coverUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  playerNumber?: [number, number];
  moduleRule: string;
}

export interface SubmissionModDto extends CreateModDto {
  isForeign: false;
  title: string;
  moduleRule: string;
  modFiles: Array<{
    name: string;
    size: number;
    url: string;
    type: string;
  }>;
  alias?: string;
  description?: string;
  coverUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  playerNumber?: [number, number];
}

export interface AdditionModDto extends CreateModDto {
  isForeign: true;
  title: string;
  alias?: string;
  description?: string;
  coverUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  playerNumber?: [number, number];
  moduleRule: string;
  releaseDate: Date;
  author: string;
}


export interface contributeModDto {
  title: string;
  originUrl: string;
  author: string;
  moduleRule: string;
  releaseDate: Date;
  originTitle?: string;
  alias?: string;
  description?: string;
  coverUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  playerNumber?: [number, number];
  languages?: string[];
}

export interface Origin {
  key: string;
  value: Array<string>;
  count: number;
}

export interface Rule {
  key: string;
  count: number;
}

export interface Language {
  key: LanguageCodes;
  count: number;
}

class ModuleStore {
  @observable lastFilterQuery: Partial<Omit<IModListQuery, 'page'>> = {};

  @observable origins: Array<Origin> = [];
  @observable languages: Array<Language> = [];
  @observable rules: Array<Rule> = [];
  @observable configInitialized: boolean = false;

  @observable modules: Array<IModDto> = [];
  @observable modulesTotal: number = 0;
  @observable modulesHasNext: boolean = false;
  @observable modulesPage: number = 1;
  @observable lastFilterUpdatedAt: Date = new Date();

  @observable moduleDetail?: IModDto;
  @observable collectionRelated: Array<ICollectionDto> = [];
  @observable moduleRelated: Array<IModDto> = [];

  @action hasUpdated = (query: Partial<IModListQuery>) => {
    return qs.stringify(_.omit(query, ['page'])) !== qs.stringify(_.omit(toJS(this.lastFilterQuery), ['page']));
  }

  @action getKeyFromOrigin = (origin: string) => {
    const INNER_ORIGIN_MAP: { [key: string]: Array<string> } = this.origins.reduce((a, b) => ({
      ...a,
      [b.key]: b.value,
    }), {})

    const INNER_REVERSE_MAP: { [key: string]: string } = Object.keys(INNER_ORIGIN_MAP).reduce((a, b) => ({ 
        ...a,
        ...(INNER_ORIGIN_MAP[b].reduce((x, y) => ({ ...x, [y]: b }), {})) 
    }), {})

    return INNER_REVERSE_MAP[origin] || origin
  }

  @action getOriginsFromKey = (key: string) => {
    const INNER_ORIGIN_MAP: { [key: string]: Array<string> } = this.origins.reduce((a, b) => ({
      ...a,
      [b.key]: b.value,
    }), {})

    return INNER_ORIGIN_MAP[key] || [key]
  }

  @action initModuleFilterConfig = async () => {
    if (this.configInitialized) {
      return;
    }
  
    return this.fetchModFilterConfig().then((res) => {
      const originMaps = (res.data.origins).reduce((a: { [key: string]: Origin }, origin) => ({
        ...a,
        [ORIGIN_REVERSE_MAP[origin._id] || origin._id]: {
          key: ORIGIN_REVERSE_MAP[origin._id] || origin._id,
          value: (a[ORIGIN_REVERSE_MAP[origin._id] || origin._id]?.value || []).concat(origin._id),
          count: (a[ORIGIN_REVERSE_MAP[origin._id] || origin._id]?.count || 0) + origin.count,
        }
      }), {})

      const preOrigins = Object.keys(originMaps).map(key => originMaps[key])

      const origins = (preOrigins.filter(origin => origin.count >= 10))
        .concat(preOrigins.filter(origin => origin.count < 10).reduce((a, b) => ({
          key: '其他',
          value: a.value.concat(b.value),
          count: a.count + b.count,
        }), {
          key: '其他',
          value: [],
          count: 0,
        }))

      const rules = res.data.rules.map((rule) => ({ key: rule._id, count: rule.count }));
      const languages = res.data.languages.map((language) => ({ key: language._id as LanguageCodes, count: language.count }));

      this.origins = origins
      this.rules = rules
      this.languages = languages

      // const origins = (await this.modService.getModOrigin()).reduce((a, origin) => ({
      //   ...a,
      //   [ORIGIN_REVERSE_MAP[origin._id] || origin._id]: (a[ORIGIN_REVERSE_MAP[origin._id] || origin._id] || 0) + origin.count
      // }), {})
    }).then(() => {
      this.configInitialized = true;
    })
  }

  @action initModuleList = async (query: Partial<IModListQuery>) => {
    return this.fetchModuleList(query).then((res) => {
      this.modules = res.data;
      this.modulesTotal = res.totalCount;
      this.modulesPage = res.page;
      this.modulesHasNext = res.hasNext;
      this.lastFilterUpdatedAt = new Date();
      this.lastFilterQuery = _.omit(query, ['page'])
    });
  }

  @action loadNext = (query: Partial<IModListQuery>) => {
    const innerQuery = { ...query };
    innerQuery.page = this.modulesPage + 1

    if (!innerQuery.filter) {
      innerQuery.filter = {};
    }

    Object.assign(innerQuery.filter, { updatedAt: { $lt: this.lastFilterUpdatedAt } })
    return this.fetchModuleList(innerQuery).then((res) => {
      this.modules = [...this.modules.concat(res.data)];
      this.modulesPage = res.page;
      this.modulesHasNext = res.hasNext;
    });
  }

  @action fetchModuleList = (query: Partial<IModListQuery> = {}): Promise<ModListApiResponse> => {
    return BaseProvider.get<ModListApiResponse>(`/api/mod/?${qs.stringify(query)}`).then((res) => {
      return res.data;
    });
  }

  @action fetchModuleDetail = (uuidOrTitle: string): Promise<IModDto> => {
    const index = this.modules.findIndex(mod => (mod._id === uuidOrTitle || mod.title === uuidOrTitle))
    if (index !== -1) {
      this.moduleDetail = this.modules[index];

      BaseProvider.get<ModRetrieveApiResponse>(`/api/mod/${uuidOrTitle}`).then((res) => {
        this.moduleDetail = res.data;
      })
      return Promise.resolve(this.moduleDetail);
    }

    return BaseProvider.get<ModRetrieveApiResponse>(`/api/mod/${uuidOrTitle}`).then((res) => {
      this.moduleDetail = res.data;
      return this.moduleDetail
    })
  }

  @action updateModuleDetail = (uuidOrTitle: string): Promise<IModDto> => {
    return BaseProvider.get<ModRetrieveApiResponse>(`/api/mod/${uuidOrTitle}`).then((res) => {
      this.moduleDetail = res.data;
      return this.moduleDetail
    })
  }

  @action fetchRelatedModule = (uuidOrTitle: string): Promise<Array<IModDto>> => {
    return BaseProvider.get<Array<IModDto>>(`/api/mod/${uuidOrTitle}/related`).then((res) => {
      this.moduleRelated = res.data;
      return this.moduleRelated;
    })
  }

  @action fetchRelatedCollection = (uuid: string): Promise<Array<ICollectionDto>> => {
    return CollectionSingleStore.fetchCollections({ 
      targetName: 'Mod',
      targetId: uuid,
      sort: { [CollectionSortKey.FAVORITE_COUNT]: -1 },
      pageSize: 10,
    }).then((res) => {
      this.collectionRelated = res.data.data;
      return res.data.data;
    })
  }

  @action applyEditor = (uuid: string) => {
    return BaseProvider.post(`/api/mod/${uuid}/apply-editor`).then(() => {
      if (this.moduleDetail?._id === uuid) {
        this.moduleDetail.canEdit = true;
      }
    });
  }

  @action editModule = (uuid: string, updateDto: Partial<editModDto> | Partial<contributeModDto>) => {
    return BaseProvider.put<ModRetrieveApiResponse>(`/api/mod/${uuid}`, updateDto).then((result) => {
      if (this.moduleDetail?._id === uuid) {
        this.moduleDetail = result.data;
      }
    });
  }

  @action createModule = (createModDto: Partial<SubmissionModDto> | Partial<AdditionModDto>) => {
    return BaseProvider.post<IModDto>(`/api/mod`, createModDto)
  }

  @action onRated = (uuid: string, type: RateType) => {
    if (this.moduleDetail?._id !== uuid) {
      return;
    }

    if (type === RateType.Mark) {
      this.moduleDetail.markCount += 1;
      return;
    }

    this.moduleDetail.rateCount += 1;
  }

  @action refreshMod = (uuid: string) => {
    return BaseProvider.get<ModRetrieveApiResponse>(`/api/mod/${uuid}`).then((res) => {
      if (this.moduleDetail?._id === uuid) {
        this.moduleDetail = res.data;
      }
      const index = this.modules.findIndex((mod) => mod._id === uuid);

      if (index !== -1) {
        this.modules[index] = res.data;
        this.modules = [...this.modules];
      }
    })

  }

  @action claimMod = (id: string) => {
    return BaseProvider.post(`/api/mod/${id}/claim`);
  }

  @action invalidMod = (id: string) => {
    return BaseProvider.post(`/api/mod/${id}/invalid`);
  }

  @action blockMod = (id: string) => {
    return BaseProvider.post(`/api/block`, {
      targetName: 'Mod', 
      targetId: id, 
    }).then(() => {
      const index = this.modules.findIndex(mod => mod._id === id)
      if (index !== -1) {
        this.modules.splice(index, 1);
        this.modules = [...this.modules];
      }
    });
  }

  @action withdrawMod = (id: string) => {
    return BaseProvider.post(`/api/mod/${id}/withdraw`);
  }

  @action clickLink = (id: string, linkName: string) => {
    return BaseProvider.put(`/api/mod/${id}/link/${linkName}/click`);
  }

  @action clickFile = (id: string, fileName: string) => {
    return BaseProvider.put(`/api/mod/${id}/${fileName}/click`);
  }

  @action getHot = () => {
    return BaseProvider.get<PaginatedResponse<IModDto>>(`/api/mod/hot`);
  }

  @action getRandom = (query: Partial<IModListQuery>) => {
    return BaseProvider.get<IModDto>(`/api/mod/random?${qs.stringify(query)}`);
  }

  @action fetchModFilterConfig = () => {
    return BaseProvider.get<{
      rules: Array<{ _id: string, count: number }>;
      origins: Array<{ _id: string, count: number }>;
      languages: Array<{ _id: string, count: number }>;
    }>(`/api/mod/config`);
  }


  @observable reportVisible: boolean = false;

  @action setReportVisible = (value: boolean) => {
    this.reportVisible = value;
  }
}

const store = new ModuleStore();

export default store;
