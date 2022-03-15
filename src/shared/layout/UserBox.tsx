import React, { useState } from "react";
import { Link, NavLink, useHistory, useLocation, withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { Layout, Button, Avatar, Menu, Tooltip, Badge, Input, Popover } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined, BankOutlined, StarOutlined } from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import AuthStore from "shared/stores/AuthStore";
import UIStore from "shared/stores/UIStore";
import CommonStore from "shared/stores/CommonStore";
import { MenuList } from "./MenuList";
import styles from "./UserBox.module.less";
import "./styles.less";

const { Header } = Layout;


const UserBox: React.FC = observer(() => {
  const [search, setSearch] = useState('');
  const history = useHistory();
  const location = useLocation();


  return (
    <div className={styles.userBox}>
      <div className={styles.boxHeader}>
        <div className={styles.nickname}>
          {AuthStore.user.nickName}
        </div>
      </div>

      <div className={styles.boxList}>
        <Link to={`/account/${AuthStore.user._id}`} className='custom-link'>
          <div className={styles.boxListItem}>
            <UserOutlined className={styles.boxListItemIcon} />
            个人中心
          </div>
        </Link>

        <Link to={`/account/notification`} className='custom-link'>
          <div className={styles.boxListItem}>
            <BellOutlined className={styles.boxListItemIcon} />
            消息中心
          </div>
        </Link>

        {AuthStore.isAuthenticated &&
          <Link to={`/account/${AuthStore.user._id}/collection`} className="custom-link">
            <div className={styles.boxListItem}>
              <StarOutlined className={styles.boxListItemIcon} />
              我的收藏
            </div>
          </Link>
        }

        <Link to={`/setting`} className='custom-link'>
          <div className={styles.boxListItem}>
            <SettingOutlined className={styles.boxListItemIcon} />
            设置
          </div>
        </Link>

        {AuthStore.checkRole('superuser') &&
          <Link to={`/manager`} className='custom-link'>
            <div className={styles.boxListItem}>
              <BankOutlined className={styles.boxListItemIcon} />
              管理
            </div>
          </Link>
        }

        <div 
          className={`${styles.boxListItem} ${styles.danger}`}
          onClick={() => CommonStore.logout()}
        >
          <LogoutOutlined className={styles.boxListItemIcon} />
          登出
        </div>
      </div>
    </div>
  );
})

export default UserBox
