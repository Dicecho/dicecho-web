import { RateType, AccessLevel } from "interfaces/shared/api";
export * from '@/interfaces/shared/api';

export enum RateView {
  PL = 0,
  KP = 1,
  OB = 2,
}

export enum RemarkContentType {
  Markdown = 'markdown',
  Richtext = 'richtext',
}

export interface PostRateDto {
  rate: number;
  remark: string;
  remarkType: RemarkContentType;
  richTextState: any;
  type: RateType;
  view: RateView;
  isAnonymous: boolean;
  accessLevel: AccessLevel;
}

export interface IRatePostSearch {
  rateId?: string;
  type?: RateType;
  modId?: string;
};
