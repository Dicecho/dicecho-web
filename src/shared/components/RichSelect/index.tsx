import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { Dropdown, Menu,  DropDownProps, Badge } from "antd";
import styles from "./styles.module.less";

interface IProps<T extends string | number = string | number> extends Partial<DropDownProps> {
  options: Array<{
    key: T,
    icon: React.ForwardRefExoticComponent<any>;
    title: string,
    description?: string,
  }>
  activeKey: string;
  onSelect: (key: T) => any;
  hint?: boolean;
  hintKey?: string;
}

const RichSelect: React.FunctionComponent<IProps> = observer(({
  options,
  activeKey,
  onSelect,
  children,
  hint,
  hintKey,
  ...props
}) => {
  const storageKey = `@HintBadge:${hintKey}`
  const [isRead, setIsRead] = useState(localStorage.getItem(storageKey) === 'true');

  useEffect(() => {
    setIsRead(localStorage.getItem(storageKey) === 'true')
  }, [hintKey])

  const renderContent = () => {
    if (hint && hintKey) {
      return (
        <Badge dot={!isRead}>
          {children}
        </Badge>
      )
    }

    return children
  }

  return (
    <Dropdown
      trigger={['click']}
      onVisibleChange={(visible) => {
        if (visible && hint && hintKey) {
          setIsRead(true);
          localStorage.setItem(storageKey, 'true');
        }
      }}
      overlay={() => (
        <Menu onClick={({ key }) => onSelect(key)}>
          {options.map(option => (
            <Menu.Item
              className={classnames(styles.richSelectItem, { [styles.active]: activeKey === option.key } )}
              key={option.key}
            >
              <option.icon className={classnames(styles.richSelectItemIcon)} style={{ marginRight: 12 }} />
              <div className={classnames(styles.richSelectItemContent)}>
                <div className={classnames(styles.richSelectItemTitle)}>{option.title}</div>
                {option.description &&
                  <div className={classnames(styles.richSelectItemDescription)}>{option.description}</div>
                }
              </div>
            </Menu.Item>
          ))}
        </Menu>
      )}
      {...props}
    >
      {renderContent()}
    </Dropdown>
  );
});

export { RichSelect };
