export enum TRPGRule {
  COC = 1,
  DND = 2,
  MUGEN = 3,
}

export const TRPGRuleMap = {
  [TRPGRule.COC]: 'COC',
  [TRPGRule.DND]: 'DND',
  [TRPGRule.MUGEN]: '无限',
}

export interface File {
  fileName: string,
  fileSize: number,
  fileUrl: string,
}

export interface Author {
  username: string,
}

export interface Tag {
  uuid: string,
  title: string,
}

export interface Module {
  title: string,
  author: Author,
  uuid: string,
  coverUrl: string,
  abstract: string,
  minParticipants: number,
  maxParticipants: number,
  minTime: number,
  maxTime: number,
  rule: TRPGRule,
  files: Array<File>,
  tags: Array<Tag>,
  createAt: string,
}