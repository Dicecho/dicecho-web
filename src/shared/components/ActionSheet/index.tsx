import React from "react";
import classNames from 'classnames';
import { observer } from "mobx-react";
import toArray from 'rc-util/lib/Children/toArray';
import { Drawer, DrawerProps } from "antd";
import { ActionSheetItem, ActionSheetItemProps } from './ActionSheetItem'
import styles from "./styles.module.less";

interface IProps extends Omit<DrawerProps, 'placement' | 'closable'> {}

export interface Item extends ActionSheetItemProps {
  // key: string;
  // node: React.ReactElement;
}

function parseItemList(children: React.ReactNode): Item[] {
  return toArray(children)
    .map((node: React.ReactElement<ActionSheetItemProps>) => {
      if (React.isValidElement(node)) {
        return node.props
      }

      return null;
    }).filter(tab => tab) as Item[];
}


const ActionSheet: React.FC<IProps> = observer(({
  children,
  onClose = () => {},
  ...props
}) => {
  const items = parseItemList(children);
  return (
    <Drawer 
      placement='bottom'
      closable={false}
      maskClosable={true}
      className={classNames(styles.actionSheet)}
      maskStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      height={((items.length + 1) * 56) + items.length + 23}
      onClose={onClose}
      {...props}
    >
      <div className={styles.menu}>
        {items.map((itemProps, index) => (
          <ActionSheetItem
            {...itemProps}
            key={index}
            onOptionClick={(e) => {
              itemProps.onOptionClick(e);
              onClose(e);
            }}
          />
        ))}
      </div>
      <div className={`${styles.cancel} ${styles.menuOption}`} onClick={(e) => onClose(e)}>
        取消
      </div>
    </Drawer>
  )
});

export default ActionSheet;
export { ActionSheetItem }