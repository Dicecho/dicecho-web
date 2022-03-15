import React, { HTMLAttributes, HtmlHTMLAttributes, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Drawer, Avatar, Badge } from "antd";
import { STORAGE_KEYS } from "shared/constants/storage";
import {
  UserAddOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  RightOutlined,
  BulbOutlined,
  StarOutlined,
} from "@ant-design/icons";
import UIStore from "@/shared/stores/UIStore";
import CommonStore from "@/shared/stores/CommonStore";
import AuthStore from "shared/stores/AuthStore";
import styles from "./styles.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

const HeaderMenu: React.FC<IProps> = observer((props) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <React.Fragment>
      <Badge dot={UIStore.promptVisible && localStorage.getItem(STORAGE_KEYS.AppInstallHint) !== 'true'}>
        <MenuOutlined {...props} onClick={() => setDrawerVisible(true)} />
      </Badge>
      <Drawer
        // title="筛选"
        placement="left"
        width={'240px'}
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Link
          to={`/account/setting`}
          className="custom-link"
          onClick={() => setDrawerVisible(false)}
        >
          <div className={styles.drawerUser}>
            {AuthStore.isAuthenticated ? (
              <Avatar
                size={40}
                style={{ marginRight: 16 }}
                src={AuthStore.user.avatarUrl}
              />
            ) : (
              <div
                className="login-avatar"
                style={{ height: 40, width: 40, marginRight: 16 }}
              >
                <UserAddOutlined style={{ fontSize: 16 }} />
              </div>
            )}
            <div className={styles.drawerUserInfo}>
              <div className={styles.drawerUserName}>
                {AuthStore.isAuthenticated ? AuthStore.user.nickName : "未登录"}
              </div>
              <div className={styles.drawerInfoHint}>
                资料与账号
                <RightOutlined />
              </div>
            </div>
          </div>
        </Link>

        <div className={styles.drawerList}>
          <Link
            to={`/account/notification`}
            className="custom-link"
            onClick={() => setDrawerVisible(false)}
          >
            <div className={styles.drawerItem}>
              <BellOutlined className={styles.drawerItemIcon} />
              消息中心
            </div>
          </Link>
          
          {AuthStore.isAuthenticated &&
            <Link
              to={`/account/${AuthStore.user._id}/collection`}
              className="custom-link"
              onClick={() => setDrawerVisible(false)}
            >
              <div className={styles.drawerItem}>
                <StarOutlined className={styles.drawerItemIcon} />
                我的收藏
              </div>
            </Link>
          }
          {UIStore.promptVisible && (
            <div
              className={styles.drawerItem}
              onClick={async () => {
                if (UIStore.deferredPrompt === null) {
                  return;
                }
                UIStore.deferredPrompt.prompt();
                const { outcome } = await UIStore.deferredPrompt.userChoice;
                if (outcome === "accepted") {
                  UIStore.setDeferredPrompt(null);
                  UIStore.setPromptVisible(false);
                } else {
                  localStorage.setItem(STORAGE_KEYS.AppInstallHint, 'true')
                }
              }}
            >
              <Badge dot={localStorage.getItem(STORAGE_KEYS.AppInstallHint) !== 'true'}>
                <BulbOutlined className={styles.drawerItemIcon} />
                获取APP
              </Badge>
            </div>
          )}

          <Link
            to={`/setting`}
            className="custom-link"
            onClick={() => setDrawerVisible(false)}
          >
            <div className={styles.drawerItem}>
              <SettingOutlined className={styles.drawerItemIcon} />
              设置
            </div>
          </Link>

          {AuthStore.isAuthenticated && (
            <div
              className={`${styles.drawerItem} ${styles.danger}`}
              onClick={() => {
                setDrawerVisible(false);
                CommonStore.logout();
              }}
            >
              <LogoutOutlined className={styles.drawerItemIcon} />
              登出
            </div>
          )}
        </div>
      </Drawer>
    </React.Fragment>
  );
});

export { HeaderMenu };
