import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import NotificationStore from "shared/stores/NotificationStore";
import styles from "./styles.module.less";

interface IProps {
}

const HeaderNotification: React.FC<IProps> = observer((props) => {
  return (
    <Link to="/account/notification">
      <Badge
        className="login-avatar-badge"
        dot={NotificationStore.unreadNotificationCount > 0}
      >
        <BellOutlined />
      </Badge>
    </Link>
  )
});

export { HeaderNotification };
