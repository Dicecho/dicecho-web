import { ToggleMarkPlugin, WithPlatePlugin } from '@udecode/plate-core';
import { ToolbarButtonProps } from '@udecode/plate';

export interface MarkToolbarButtonProps
  extends ToolbarButtonProps,
    Pick<WithPlatePlugin, 'type'>,
    Pick<ToggleMarkPlugin, 'clear'> {}
