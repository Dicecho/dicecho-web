import React from "react";
import { Button, Divider, Card } from "antd";
import { Link } from "react-router-dom";
import { CloudUploadOutlined, LogoutOutlined } from "@ant-design/icons";
import CommonStore from "@/shared/stores/CommonStore";
import AuthStore from "@/shared/stores/AuthStore";
import { observer } from "mobx-react";
import styles from "./HomepageAccount.module.less";
import Avatar from "antd/lib/avatar/avatar";

const HomepageAccountActions: React.FunctionComponent = observer(() => {
  return (
    <div className={styles.userAction}>
      <Link to={`/module/submission`}>
        <Button
          type="primary"
          ghost
          block
          style={{ marginBottom: 8 }}
          icon={<CloudUploadOutlined />}
        >
          模组投稿
        </Button>
      </Link>

      <Button
        ghost
        block
        danger
        icon={<LogoutOutlined />}
        style={{ marginBottom: 8 }}
        onClick={() => CommonStore.logout()}
      >
        登出
      </Button>
    </div>
  );
});
export default HomepageAccountActions;
