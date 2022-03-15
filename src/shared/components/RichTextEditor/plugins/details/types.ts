import { HotkeyPlugin, InsertNodesOptions } from '@udecode/plate-core';

export interface DetailsPlugin extends HotkeyPlugin {
  // syntax?: boolean;
  // syntaxPopularFirst?: boolean;
  // deserializers?: string[];
}

export interface DetailsNodeData {
  summary?: string;
}

export interface DetailsInsertOptions {
  defaultType?: string;
  level?: number;
  insertNodesOptions?: Omit<InsertNodesOptions, 'match'>;
}
