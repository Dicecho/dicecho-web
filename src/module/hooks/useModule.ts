import useSWR, { useSWRConfig } from 'swr';
import { ResponseError } from "@/interfaces/response";
import BaseProvider from '@/utils/BaseProvider';
import { toJS } from 'mobx';
import { ORIGIN_REVERSE_MAP } from '../constants';
import { CollectionSingleStore, ICollectionDto, CollectionSortKey } from '@/collection/store/CollectionStore'; 
import { IModDto, IModListQuery, ModListApiResponse, ModRetrieveApiResponse, ModOrigin, PaginatedResponse, RateType } from '@/interfaces/shared/api';
import qs from 'qs';
import _ from 'lodash';
import { LanguageCodes } from '@/utils/language';


export interface ISendPendantDto {
  userId: string,
  pendantId: string,
}

export interface ICreatePendantDto {
  name: string,
  url: string,
}

export interface IPendantDto {
  _id: string,
  name: string,
  url: string,
}

export function useRecommendModule(modId: string) {
  const { data, error } = useSWR<Array<IModDto>, ResponseError>(
    `/api/mod/${modId}/recommend`,
    () => BaseProvider.get<ModListApiResponse>(`/api/mod/${modId}/recommend`).then((res) => res.data.data),
  )

  return {
    data,
    isLoading: !error && !data,
    error
  }
}
