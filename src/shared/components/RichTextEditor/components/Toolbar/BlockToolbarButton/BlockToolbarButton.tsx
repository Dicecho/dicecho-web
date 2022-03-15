import React from 'react';
import {
  getPreventDefaultHandler,
  someNode,
  toggleNodeType,
  usePlateEditorState,
} from '@udecode/plate-core';
import { 
  ToolbarButton,
} from '@udecode/plate'
import { BlockToolbarButtonProps } from './BlockToolbarButton.types';

/**
 * Toolbar button to toggle the type of elements in selection.
 */
export const BlockToolbarButton = ({
  type,
  inactiveType,
  active,
  id,
  ...props
}: BlockToolbarButtonProps) => {
  const editor = usePlateEditorState(id)!;

  return (
    <ToolbarButton
      active={
        active ?? (!!editor?.selection && someNode(editor, { match: { type } }))
      }
      onMouseDown={
        editor &&
        getPreventDefaultHandler(toggleNodeType, editor, {
          activeType: type,
          inactiveType,
        })
      }
      {...props}
    />
  );
};
