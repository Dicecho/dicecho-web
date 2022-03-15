import React, { HTMLAttributes } from "react";
import classNames from 'classnames';
import { observer } from "mobx-react";
import styles from "./styles.module.less";

export interface ActionSheetItemProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  onOptionClick: React.MouseEventHandler<HTMLDivElement>;
  danger?: boolean;
}

const ActionSheetItem: React.FC<ActionSheetItemProps> = observer(({
  content,
  onOptionClick,
  danger = false,
  ...props
}) => {

  return (
    <div
      className={classNames(styles.menuOption, { [styles.danger]: danger })}
      onClick={onOptionClick}
      {...props}
    >
      {content}
    </div>
  )
});

export default ActionSheetItem;
export { ActionSheetItem };
