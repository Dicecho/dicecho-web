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


const UnloginBox: React.FC = observer(() => {
  const [search, setSearch] = useState('');
  const history = useHistory();
  const location = useLocation();


  return (
    <div className={styles.userBox}>
      <div className={styles.boxList}>
        <div className={styles.boxListItem} onClick={() => UIStore.openLoginModal()}>
          <UserOutlined className={styles.boxListItemIcon} />
          登录
        </div>
        <Link to={`/setting`} className='custom-link'>
          <div className={styles.boxListItem}>
            <SettingOutlined className={styles.boxListItemIcon} />
            设置
          </div>
        </Link>
      </div>
    </div>
  );
})

export default UnloginBox
