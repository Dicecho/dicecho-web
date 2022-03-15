import React from 'react';
import { ELEMENT_DETAILS } from '../constants';
import { insertEmptyDetails } from '../transform';
import { DetailsInsertOptions } from '../types';
import {
  getPluginType,
  getPreventDefaultHandler,
  usePlateEditorState,
} from '@udecode/plate-core';
import {
  BlockToolbarButton,
  ToolbarButtonProps,
} from '@udecode/plate-ui-toolbar';

export const DetailsToolbarButton = ({
  options,
  id,
  ...props
}: ToolbarButtonProps & {
  options?: DetailsInsertOptions;
}) => {
  const editor = usePlateEditorState(id)!;
  if (!editor) {
    return null;
  }

  return (
    <BlockToolbarButton
      type={getPluginType(editor, ELEMENT_DETAILS)}
      onMouseDown={getPreventDefaultHandler(insertEmptyDetails, editor, {
        insertNodesOptions: { select: true },
        ...options,
      })}
      {...props}
    />
  );
};
