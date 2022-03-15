import { 
  ToolbarButtonProps,
} from '@udecode/plate'

export interface BlockToolbarButtonProps extends ToolbarButtonProps {
  type: string;

  id?: string;
  inactiveType?: string;
}
