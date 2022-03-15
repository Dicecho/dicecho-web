import { createHyperscript } from 'slate-hyperscript';
import { ELEMENT_DETAILS } from '../constants';
import { createText } from '@udecode/plate-test-utils';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_IMAGE,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TODO_LI,
  ELEMENT_TR,
  ELEMENT_UL,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_LIC,
  // ELEMENT_EXCALIDRAW,
} from '@udecode/plate';

const voidChildren = [{ text: '' }];

export const customjsx = createHyperscript({
  elements: {
    ha: { type: ELEMENT_LINK },
    hblockquote: { type: ELEMENT_BLOCKQUOTE },
    hcodeblock: { type: ELEMENT_CODE_BLOCK },
    hcodeline: { type: ELEMENT_CODE_LINE },
    // hexcalidraw: { type: ELEMENT_EXCALIDRAW },
    hh1: { type: ELEMENT_H1 },
    hh2: { type: ELEMENT_H2 },
    hh3: { type: ELEMENT_H3 },
    hh4: { type: ELEMENT_H4 },
    hh5: { type: ELEMENT_H5 },
    hh6: { type: ELEMENT_H6 },
    himg: { type: ELEMENT_IMAGE, children: voidChildren },
    hli: { type: ELEMENT_LI },
    hmention: { type: ELEMENT_MENTION, children: voidChildren },
    hmentioninput: {
      type: ELEMENT_MENTION_INPUT,
      children: voidChildren,
    },
    hmediaembed: { type: ELEMENT_MEDIA_EMBED, children: voidChildren },
    hol: { type: ELEMENT_OL },
    hp: { type: ELEMENT_PARAGRAPH },
    htable: { type: ELEMENT_TABLE },
    htd: { type: ELEMENT_TD },
    hth: { type: ELEMENT_TH },
    htodoli: { type: ELEMENT_TODO_LI },
    htr: { type: ELEMENT_TR },
    hul: { type: ELEMENT_UL },
    hdefault: { type: ELEMENT_PARAGRAPH },
    hlic: { type: ELEMENT_LIC },
    hdetails: { type: ELEMENT_DETAILS },
  },
  creators: {
    htext: createText,
  },
});