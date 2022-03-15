/** @jsx customjsx */

import {
  PlateEditor,
} from '@udecode/plate-core';
import { customjsx } from './hyperscript';
import { 
  createPlateUIEditor,
  createParagraphPlugin,
} from '@udecode/plate';
import { createDetailsPlugin } from '../createDetailsPlugin';

customjsx;

describe('test details delete', () => {
  it('delete forward on second line', () => {
    const input = ((
      <editor>
        <hp> </hp>
        <hdetails summary='testsummary'><hp><cursor />test</hp></hdetails>
        <hp>after</hp>
      </editor>
    ) as any) as PlateEditor;

    const expected = ((
      <editor>
        <hp> <cursor />test</hp>
        <hp>after</hp>
      </editor>
    ) as any) as PlateEditor;

    const editor = createPlateUIEditor({
      editor: input,
      plugins: [
        createParagraphPlugin(),
        createDetailsPlugin(),
      ],
    });

    editor.deleteBackward('character');

    expect(editor.children).toEqual(expected.children);
  });

  it('delete forward on first line', () => {
    const input = ((
      <editor>
        <hdetails><hp><cursor />test</hp></hdetails>
        <hp>after</hp>
      </editor>
    ) as any) as PlateEditor;

    const expected = ((
      <editor>
        <hp>test</hp>
        <hp>after</hp>
      </editor>
    ) as any) as PlateEditor;

    const editor = createPlateUIEditor({
      editor: input,
      plugins: [
        createParagraphPlugin(),
        createDetailsPlugin(),
      ],
    });

    editor.deleteBackward('character');

    expect(editor.children).toEqual(expected.children);
  });
})
