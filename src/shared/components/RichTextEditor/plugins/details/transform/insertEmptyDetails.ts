import {
  ELEMENT_DEFAULT,
  getPluginType,
  insertNodes,
  isBlockAboveEmpty,
  isExpanded,
  PlateEditor,
  TElement,
} from '@udecode/plate-core';
import { Editor, Path } from 'slate';
import { DetailsInsertOptions } from '../types';
import { insertDetails } from './insertDetails';

/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */
export const insertEmptyDetails = (
  editor: PlateEditor,
  {
    defaultType = getPluginType(editor, ELEMENT_DEFAULT),
    insertNodesOptions,
    level = 0,
  }: DetailsInsertOptions
) => {
  if (!editor.selection) return;

  if (isExpanded(editor.selection)) {
    const selectionPath = Editor.path(editor, editor.selection);
    const insertPath = Path.next(selectionPath.slice(0, level + 1));
    insertNodes<TElement>(
      editor,
      { type: defaultType, children: [{ text: '' }] },
      {
        at: insertPath,
        select: true,
      }
    );
  }
  insertDetails(editor, insertNodesOptions);
};
