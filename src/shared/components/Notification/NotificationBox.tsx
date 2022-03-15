import React, { useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
  Link,
} from "react-router-dom";
import { observer } from "mobx-react";
import { Layout, Tabs, Spin, Button } from "antd";
import {
  UnorderedListOutlined,
  MessageOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import NotificationItem from "./NotificationItem";
import NotificationStore, { NotificationListQuery, NotificationType } from "shared/stores/NotificationStore";
import Scrollbars from "react-custom-scrollbars";
import styles from "./NotificationBox.module.less";

const { Header } = Layout;

const notificationsNavigation = [
  {
    icon: <UnorderedListOutlined />,
    uniqueName: "all",
    name: "提醒",
  },
  {
    icon: <MessageOutlined />,
    uniqueName: "comment",
    name: "回复",
  },
  {
    icon: <HeartOutlined />,
    uniqueName: "like",
    name: "获赞",
  },
];

interface IProps {
  visible: boolean;
  onCancel: Function;
}

const NotificationBox: React.FC<IProps> = observer((props) => {
  const [tab, setTab] = useState("all");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!props.visible) {
      return;
    }

    if ((NotificationStore.lastFetchAt.getTime() + (60 * 1000)) < Date.now()) {
      const query: Partial<NotificationListQuery> = {
        filter: {
          ...getFilter(tab)
        }
      }
      NotificationStore.fetchUnreadNotifications(query);
    }
  }, [props.visible, tab])

  useEffect(() => {
    const query: Partial<NotificationListQuery> = {
      filter: {
        ...getFilter(tab)
      }
    }
    NotificationStore.fetchUnreadNotifications(query);
  }, [tab])

  const getFilter = (key: string) => {
    if (key === 'comment') {
      return {
        type: NotificationType.Comment
      }
    }

    if (key === 'like') {
      return {
        type: NotificationType.Like
      }
    }

    return {}
  }

  const renderContent = () => {
    if (!NotificationStore.initialized) {
      return (
        <div className={styles.empty}>
          <Spin />
        </div>
      );
    }

    if (NotificationStore.unreadNotificationTotal === 0) {
      return (
        <div className={styles.empty}>
          <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无更多提醒"} />
        </div>
      );
    }

    return (
      <Scrollbars
        autoHide
        renderThumbVertical={() => <div className="custom-scroll" />}
      >
        {NotificationStore.unreadNotification.map((notification) => (
          <NotificationItem
            notification={notification}
            key={notification._id}
          />
        ))}
      </Scrollbars>
    );
  };

  return (
    <div className={styles.notificationBox}>
      <div className={styles.boxHeader}>
        <Tabs
          defaultActiveKey={tab}
          activeKey={tab}
          onChange={(key) => setTab(key)}
          className={styles.boxHeaderTabs}
        >
          {notificationsNavigation.map((tab) => (
            <Tabs.TabPane
              className={styles.boxHeaderTab}
              tab={
                <div>
                  {tab.icon}
                  {tab.name}
                </div>
              }
              key={tab.uniqueName}
            />
          ))}
        </Tabs>
      </div>

      <div className={styles.boxList}>
        {renderContent()}
      </div>
      <div className={styles.boxFooter}>
        <Button type='link' onClick={() => NotificationStore.markAllRead()}>
          全部已读
        </Button>
        <Link to='/account/notification' style={{ marginLeft: 'auto' }}>
          <Button type='link'>
            查看全部
          </Button>
        </Link>
      </div>
    </div>
  );
});

export { NotificationBox };
export default NotificationBox;
