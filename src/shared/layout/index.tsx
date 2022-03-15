import React, { Ref, useRef, createContext, useState } from "react";
import { Helmet } from "react-helmet";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { Layout, message } from "antd";
import UIStore from "shared/stores/UIStore";
import AppMobileHeader from "./AppMobileHeader";
import AppMobileFooter from "./AppMobileFooter";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import TopicPostModal from '@/forum/components/TopicPostModal';
import { TopicSingleStore, TopicListQuery, ITopicDto } from '@/forum/stores/TopicStore';
import { DialogModal } from "@/shared/components/Comment";
import { AppealModal } from "@/shared/components/ReportModal";
import LoginModal from "@/shared/components/Login/LoginModal";
import "./styles.less";

const { Content } = Layout;

const AppLayout: React.FunctionComponent<any> = observer(({ children }) => {
  // const [headerOptions, setHeaderOptions] = useState<Partial<HeaderOptions>>({});

  return (
    <React.Fragment>
      <Helmet title="骰声回响 | Dicecho" />
      <Layout className="app-layout">
        {UIStore.isMobile ? (
          <AppMobileHeader headerOptions={toJS(UIStore.headerOptions)} />
        ) : (
          <AppHeader headerOptions={toJS(UIStore.headerOptions)}/>
        )}

        <Content
          className={`app-layout-content ${
            (UIStore.isMobile && UIStore.headerOptions.transparent) ? "transparent" : ""
          } ${
            (UIStore.isMobile && (UIStore.footerOptions.visible === false)) ? "no-footer" : ""
          } ${
            (UIStore.headerOptions.visible === false) ? "no-header" : ""
          }`}
        >
          {children}
        </Content>

        {UIStore.isMobile ? (
          <AppMobileFooter footerOptions={toJS(UIStore.footerOptions)} />
        ) : (
          <AppFooter />
        )}
      </Layout>
      <LoginModal />
      <DialogModal />
      <AppealModal />

    </React.Fragment>
  );
});

export default AppLayout;
