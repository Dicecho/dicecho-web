import useSWR from 'swr';
import { ResponseError } from "@/interfaces/response";
import baseProvider from "@/utils/BaseProvider";

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

export function useSelfPendant() {
  const { data, error } = useSWR<Array<IPendantDto>, ResponseError>(
    '/api/pendant/self',
    () => baseProvider.get<Array<IPendantDto>>('/api/pendant/self').then((res) => res.data),
  )

  return {
    data,
    isLoading: !error && !data,
    error
  }
}

export function usePendant() {
  const { data, error, mutate } = useSWR<Array<IPendantDto>, ResponseError>(
    '/api/pendant',
    () => baseProvider.get<Array<IPendantDto>>('/api/pendant').then((res) => res.data),
  )

  return {
    data,
    isLoading: !error && !data,
    error,
    refresh: mutate,
  }
}

export function useRetrievePendant(uuid: string) {
  const { data, error, mutate } = useSWR<IPendantDto, ResponseError>(
    `/api/pendant/${uuid}`,
    () => baseProvider.get<IPendantDto>( `/api/pendant/${uuid}`).then((res) => res.data),
  )

  return {
    data,
    isLoading: !error && !data,
    error,
    refresh: mutate,
  }
}

export const createPendant = (dto: ICreatePendantDto) => baseProvider.post<IPendantDto>('/api/pendant', dto).then((res) => res.data)

export const sendPendant = (dto: ISendPendantDto) => baseProvider.post('/api/pendant/send', dto)