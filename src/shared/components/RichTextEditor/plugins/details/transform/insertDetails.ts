import {
  getPluginType,
  InsertNodesOptions,
  isExpanded,
  isSelectionAtBlockStart,
  PlateEditor,
  setNodes,
  someNode,
  TElement,
  wrapNodes,
  ELEMENT_DEFAULT,
} from '@udecode/plate-core';
import { ELEMENT_DETAILS } from '../constants';

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
export const insertDetails = (
  editor: PlateEditor,
  insertNodesOptions: Omit<InsertNodesOptions, 'match'> = {}
) => {
  if (!editor.selection || isExpanded(editor.selection)) return;

  const matchCodeElements = (node: TElement) =>
    node.type === getPluginType(editor, ELEMENT_DETAILS);

  if (
    someNode(editor, {
      match: matchCodeElements,
    })
  ) {
    return;
  }

  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak();
  }

  setNodes<TElement>(
    editor,
    {
      type: getPluginType(editor, ELEMENT_DEFAULT),
      children: [{ text: '' }],
    },
    insertNodesOptions
  );

  wrapNodes(
    editor,
    {
      type: getPluginType(editor, ELEMENT_DETAILS),
      children: [],
    },
    insertNodesOptions
  );
};
