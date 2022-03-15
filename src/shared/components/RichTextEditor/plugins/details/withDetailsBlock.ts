import { 
  WithOverride,
  isCollapsed,
  TNode,
  queryNode,
  TElement,
  setNodes,
  someNode,
  isSelectionAtBlockStart,
  unwrapNodes,
  getPluginType
} from '@udecode/plate-core';
import {
  ELEMENT_PARAGRAPH,
} from '@udecode/plate';
import {
  ELEMENT_DETAILS
} from './constants'
import { insertFragmentDetails } from './insertFragmentDetails';
import Slate, { Editor } from 'slate';
// import { getCodeLineEntry, getIndentDepth } from './queries';
// import { ins\\ } from './transforms';
import { DetailsPlugin } from './types';

export const withDetailsBlock: WithOverride<{}, DetailsPlugin> = (editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit: 'character' | 'word' | 'line' | 'block') => {
    const onDetailsDeleteBackward = () => {
      const inDetails = someNode(editor, {
        match: { type: getPluginType(editor, ELEMENT_DETAILS) },
      });
      const { selection } = editor;

      if (unit !== 'character' || !isCollapsed(selection) || !inDetails) {
        return;
      }

      const prevNode = Editor.before(editor, selection as Slate.Location, {
        unit,
      });
    
      if (prevNode) {
        return;
      }

      if (!isSelectionAtBlockStart(editor)) {
        return;
      }

      unwrapNodes(editor, {
        match: { type: getPluginType(editor, ELEMENT_DETAILS) },
        split: true,
      });

    }

    onDetailsDeleteBackward();
    deleteBackward(unit);
  };

  return editor;
};
