import {
  findNode,
  getPluginType,
  PlateEditor,
  TDescendant,
} from '@udecode/plate-core';
import { Node, Transforms } from 'slate';
import { ELEMENT_DETAILS } from './constants';

export const insertFragmentDetails = (editor: PlateEditor) => {
  const { insertFragment } = editor;
  const detailsType = getPluginType(editor, ELEMENT_DETAILS);
  // const codeLineType = getPluginType(editor, ELEMENT_CODE_LINE);

  return (fragment: TDescendant[]) => {
    // const inCodeLine = findNode(editor, { match: { type: codeLineType } });
    // if (!inCodeLine) {
    //   return insertFragment(fragment);
    // }

    return insertFragment(fragment)

    // return Transforms.insertFragment(
    //   editor,
    //   fragment.flatMap((node) =>
    //     node.type === detailsType
    //       ? extractCodeLinesFromCodeBlock(node)
    //       : convertNodeToCodeLine(node)
    //   )
    // );
  };
};
