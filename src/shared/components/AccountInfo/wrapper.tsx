import React, { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { Popover } from "antd";
import UIStore from 'shared/stores/UIStore';
import AccountDrawer from "./AccountDrawer";
import AccountCard from "./AccountCard";
import styles from "./styles.module.less";

interface IProps extends Partial<HTMLAttributes<HTMLSpanElement>> {
  _id: string;
  tag?: string;
}

const AccountInfoWrapper: React.FunctionComponent<IProps> = observer(({
  _id,
  children,
  tag = "span",
  ...wrapperProps
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  if (UIStore.isMobile) {
    const result = React.createElement(tag, {
      ...wrapperProps,
      children,
      onClick: () => setDrawerVisible(true),
      className: `${styles.wrapper} ${wrapperProps?.className || ""}`,
    });

    return (
      <React.Fragment>
        {result}
        <AccountDrawer
          _id={_id}
          placement='bottom'
          visible={drawerVisible}
          height='400px'
          onClose={() => setDrawerVisible(false)}
          closable={false}
        />
      </React.Fragment>
    )
  }

  const result = React.createElement(tag, {
    ...wrapperProps,
    children,
    className: `${styles.wrapper} ${wrapperProps?.className || ""}`,
  });

  return (
    <Link to={`/account/${_id}`} className='custom-link'>
      <Popover
        content={<AccountCard _id={_id} className={styles.userPopoverCard} />}
        // trigger='click'
        overlayClassName={styles.userCardPopover}
        getPopupContainer={(triggerNode) => triggerNode}
      >
        {result}
      </Popover>
    </Link>
  );
});

export { AccountInfoWrapper };
export default AccountInfoWrapper;
