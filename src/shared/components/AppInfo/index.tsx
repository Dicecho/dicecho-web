import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import styles from "./styles.module.less";

const AppInfo: React.FC = observer(() => {
  return (
    <div className={styles.appInfo}>
      <div className={styles.appInfoList} style={{ marginBottom: 8 }}>
        <Link
          className={styles.appInfoItem}
          // style={{ marginRight: 16 }}
          to="/notice/rule"
        >
          社区规则
        </Link>
        <Link
          className={styles.appInfoItem}
          // style={{ marginRight: 16 }}
          to="/notice/about"
        >
          关于我们
        </Link>
        <Link
          className={styles.appInfoItem}
          // style={{ marginRight: 16 }}
          to="/notice/develop"
        >
          开发日志
        </Link>
        <Link
          className={styles.appInfoItem}
          // style={{ marginRight: 16 }}
          to="/notice/rate"
        >
          评价规则
        </Link>

        <Link
          className={styles.appInfoItem}
          to="/notice/terms"
        >
          使用协议与条款
        </Link>

        <Link
          className={styles.appInfoItem}
          to="/logs/"
        >
          管理公示
        </Link>
      </div>
      <div>© 2021 Dicecho.com</div>
    </div>
  );
});
export default AppInfo;
