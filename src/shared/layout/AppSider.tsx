import React from "react";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import { Layout, Badge, Avatar, Menu, Tooltip } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import logo from "@/assets/img/logo.png";
import AuthStore from "shared/stores/AuthStore";
import UIStore from "shared/stores/UIStore";
import { MenuList } from './MenuList';
import "./styles.less";

const { Sider } = Layout;

const AppSider: React.FunctionComponent = observer(() => {

  return (
    <Sider width={72} className={`app-sider ${UIStore.theme}`}>
      <div className="app-sider-main">
        <Link to="/">
          <div className="app-sider-logo">
            <img src={logo} />
          </div>
        </Link>

        <div className="app-sider-menu">
          {MenuList.map((item) => (
            <div className="app-sider-menu-item" key={item.title}>
              <Tooltip title={item.title} placement="right">
                <NavLink activeClassName="active" to={item.link} className="app-sider-menu-icon">
                  <item.icon style={{ fontSize: "16px" }} />
                </NavLink>
              </Tooltip>
            </div>
          ))}
        </div>

      </div>

      <div className="app-sider-action">
        {!AuthStore.isAuthenticated ?
          <Tooltip title="登录账号" placement="right">
            <Badge className="login-avatar-badge" dot={true}>
              <div className="login-avatar" onClick={() => UIStore.openLoginModal()}>
                <UserAddOutlined style={{ fontSize: 16 }} />
              </div>
            </Badge>
          </Tooltip> :
          <Tooltip title="个人信息" placement="right">
            <div 
              className="user-profile-icon"
            >
              <Avatar
                size="large"
                src={AuthStore.user.avatarUrl}
                alt="avatar"
              />
            </div>
          </Tooltip>
        }
      </div>
    </Sider>
  );
});

export default AppSider;
