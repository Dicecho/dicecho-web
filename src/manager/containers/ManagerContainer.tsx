
import React, { Component, useState } from 'react';
import { observer } from 'mobx-react';
import {
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import AppHeader from "@/shared/layout/AppHeader";
import WorkingPage from "@/shared/components/Working";
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
// import SiderMenu from './SiderMenu';
import styles from './styles.module.less';
import { MENUS } from '../menu';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const ManagerContainer: React.FunctionComponent<any> = observer(({ children }) => {
  const route = useRouteMatch();
  
  return (
    <Layout style={{ overflow: 'hidden', height: '100vh' }}>
      <AppHeader />
      <Layout className={styles.managerLayout}>
        <Sider width={200} className={styles.sider}>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
          >
            {MENUS.map(tab => (
              <SubMenu key={tab.key} icon={tab.icon} title={tab.title} style={{ userSelect: 'none' }}>
                {tab.items.map(item => (
                  <Menu.Item key={item.key} style={{ userSelect: 'none' }}>
                    <Link to={`${route.url}/${tab.key}/${item.link}`}>{item.title}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ overflowY: 'scroll' }}>
          <Content>
            <Switch>
              <Route exact path={`${route.url}`} component={() => <div>早上好</div>} />
              {MENUS.flatMap(tab => 
                tab.items.map(item => ({ 
                  path: `${route.url}/${tab.key}/${item.link}`,
                  component: item.component,
                }))
              ).map((item => (
                <Route key={item.path} path={item.path} component={item.component} />
              )))}
              <Redirect to={`${route.url}`} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});

export default ManagerContainer;
