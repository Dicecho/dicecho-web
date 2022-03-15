import React from "react";
import { observer } from "mobx-react";
import { Layout } from "antd";
import { HeaderLayout, HeaderMenu, HeaderNotification, HeaderSearch } from '@/shared/components/Header';
import UIStore, { HeaderOptions } from "shared/stores/UIStore";
import styles from "./styles.module.less";
import "./styles.less";

const { Header } = Layout;

interface Props {
  headerOptions: Partial<HeaderOptions>;
}

const AppMobileHeader: React.FC<Props> = observer(({
  children,
  headerOptions,
  ...props
}) => {
  const Default = (
    <HeaderLayout
      style={{ boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.1)' }}
      left={(<HeaderMenu />)}
      title={(<HeaderSearch/>)}
      titleProps={{
        style: { 
          margin: '0 24px',
        }
      }}
      right={(<HeaderNotification />)}
      {...headerOptions.layoutProps}
    />
  )

  if (headerOptions.visible === false) {
    return null;
  }

  return (
    <Header className={`${styles.appMobileHeader} ${UIStore.theme} ${headerOptions.transparent ? styles.transparent : ''}`}>
      {headerOptions.content || Default}
    </Header>
  )
});

export default AppMobileHeader;
