import {
  getAbove,
  getPluginType,
  isCollapsed,
  PlateEditor,
  unwrapNodes,
} from '@udecode/plate-core';
import { ELEMENT_LINK, upsertLinkAtSelection, LinkPlugin } from '@udecode/plate-link';

export const getAndUpsertLink = async <T = {}>(
  editor: PlateEditor<T>,
  getLinkUrl?: LinkPlugin['getLinkUrl']
) => {
  const type = getPluginType(editor, ELEMENT_LINK);
  let prevUrl = '';

  const linkNode = getAbove(editor, {
    match: { type },
  });
  if (linkNode) {
    prevUrl = linkNode[0].url as string;
  }

  let url;
  if (getLinkUrl) {
    url = await getLinkUrl(prevUrl);
  } else {
    url = window.prompt(`输入链接的URL:`, prevUrl);
  }

  if (!url) {
    linkNode &&
      editor.selection &&
      unwrapNodes(editor, {
        at: editor.selection,
        match: { type: getPluginType(editor, ELEMENT_LINK) },
      });

    return;
  }

  // If our cursor is in middle of a link, then we don't want to insert it inline
  const shouldWrap: boolean =
    linkNode !== undefined && isCollapsed(editor.selection);
  upsertLinkAtSelection(editor, { url, wrap: shouldWrap });
};
