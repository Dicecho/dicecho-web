import {
  createPluginFactory,
  getPlugin,
  KEY_DESERIALIZE_HTML,
  someNode,
  onKeyDownToggleElement,
} from '@udecode/plate-core';
import { ELEMENT_DETAILS } from './constants';
// import { decorateCodeLine } from './decorateCodeLine';
// import { deserializeHtmlDetails } from './deserializeHtmlDetails';
// import { onKeyDownCodeBlock } from './onKeyDownCodeBlock';
import { DetailsPlugin } from './types';
import { withDetailsBlock } from './withDetailsBlock';

/**
 * Enables support for pre-formatted code blocks.
 */
export const createDetailsPlugin = createPluginFactory<DetailsPlugin>({
  key: ELEMENT_DETAILS,
  isElement: true,
  // deserializeHtml: deserializeHtmlDetails,
  deserializeHtml: {
    rules: [{ validNodeName: 'DETAILS' }],
  },
  handlers: {
    onKeyDown: onKeyDownToggleElement,
  },
  // handlers: {
  //   onKeyDown: onKeyDownCodeBlock,
  // },
  withOverrides: withDetailsBlock,
  // options: {
  //   hotkey: ['mod+opt+8', 'mod+shift+8'],
  //   syntax: true,
  //   syntaxPopularFirst: false,
  // },
  // then: (editor) => ({
  //   inject: {
  //     pluginsByKey: {
  //       [KEY_DESERIALIZE_HTML]: {
  //         editor: {
  //           insertData: {
  //             query: () => {
  //               const code_line = getPlugin(editor, ELEMENT_CODE_LINE);

  //               return !someNode(editor, {
  //                 match: { type: code_line.type },
  //               });
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // }),
});
