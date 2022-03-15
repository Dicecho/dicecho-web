import React, { useRef, useState } from "react";
import {
  Link,
  NavLink,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";
import { observer } from "mobx-react";
import {
  Layout,
  Button,
  Avatar,
  Menu,
  Tooltip,
  Badge,
  Input,
  Popover,
} from "antd";
import { UserAddOutlined, BellOutlined } from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import { HeaderSearch } from 'shared/components/Header';
import UserBox from "./UserBox";
import UnloginBox from "./UnloginBox";

import { NotificationBox } from "@/shared/components/Notification";
import AuthStore from "shared/stores/AuthStore";
import NotificationStore from "shared/stores/NotificationStore";
import UIStore, { HeaderOptions } from "shared/stores/UIStore";

import { MenuList } from "./MenuList";
import styles from "./styles.module.less";
import "./styles.less";

const { Header } = Layout;

interface Props {
  headerOptions?: Partial<HeaderOptions>;
}

const AppHeader: React.FC<Props> = observer(({ headerOptions = {} }) => {
  // const [search, setSearch] = useState("");
  const [boxVisible, setBoxVisible] = useState(false);
  const history = useHistory();
  const location = useLocation();
  if (headerOptions.visible === false) {
    return null;
  }

  return (
    <Header className={`app-header ${UIStore.theme}`}>
      <div className="app-header-content container">
        <div className="app-header-logo">
          <Link to="/">
            <img src={logo} />
          </Link>
        </div>

        <div className="app-header-menu">
          {MenuList.map((item) => (
            <div className="app-header-menu-item" key={item.title}>
              <Tooltip title={item.title} placement="bottom">
                <NavLink
                  activeClassName="active"
                  to={item.link}
                  className="app-header-menu-icon"
                >
                  <item.icon style={{ fontSize: "16px" }} />
                </NavLink>
              </Tooltip>
            </div>
          ))}
        </div>

        {UIStore.searchVisible && (
          <div className={styles.headerSearch} style={{ marginLeft: 16 }}>
            <HeaderSearch className={styles.headerSearchInput} />
          </div>
        )}

        {/* <Menu
            className="app-header-menu"
            theme={UIStore.theme}
            mode="horizontal"
            selectable={false}
          >
            {MenuList.map((item) => (
              <Menu.Item key={item.title}>
                <Link to={item.link}>{item.title}</Link>
              </Menu.Item>
            ))}
          </Menu> */}

        <div className="app-header-right" style={{ marginLeft: "auto" }}>
          {AuthStore.isAuthenticated && (
            <div style={{ marginRight: 16 }}>
              <Popover
                content={
                  <NotificationBox
                    visible={boxVisible}
                    onCancel={() => setBoxVisible(false)}
                  />
                }
                trigger="click"
                overlayClassName={styles.userBoxWrapper}
                getPopupContainer={(triggerNode) => triggerNode}
              >
                <Badge
                  className="login-avatar-badge"
                  dot={NotificationStore.unreadNotificationCount > 0}
                >
                  <BellOutlined className={styles.notificationIcon} />
                </Badge>
              </Popover>
            </div>
          )}

          {!AuthStore.isAuthenticated ? (
            <Popover
              content={<UnloginBox />}
              trigger="hover"
              overlayClassName={styles.userBoxWrapper}
              getPopupContainer={(triggerNode) => triggerNode}
            >
              <Badge className="login-avatar-badge" dot={true}>
                <div
                  className="login-avatar"
                  onClick={() => UIStore.openLoginModal()}
                >
                  <UserAddOutlined style={{ fontSize: 16 }} />
                </div>
              </Badge>
            </Popover>
          ) : (
            <Popover
              content={<UserBox />}
              trigger="hover"
              overlayClassName={styles.userBoxWrapper}
              getPopupContainer={(triggerNode) => triggerNode}
            >
              <div className="user-profile-icon">
                <Link to={`/account/${AuthStore.user._id}`}>
                  <Avatar
                    size="large"
                    src={AuthStore.user.avatarUrl}
                    alt="avatar"
                  />
                </Link>
              </div>
            </Popover>
          )}
        </div>
      </div>
    </Header>
  );
});

export default AppHeader;
