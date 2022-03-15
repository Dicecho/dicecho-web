import React from "react";
import { observer } from "mobx-react";
import {
  Row,
  Col,
  List,
  Spin,
  Button,
} from "antd";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import ScrollToTop from "@/shared/components/ScrollToTop";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderBack } from "@/shared/components/Header";
import ResponsiveCard from "shared/components/ResponsiveCard";
import Empty from "@/shared/components/Empty";
import { IAccountDto } from "../stores/AccountStore";
import InfiniteScroll from "react-infinite-scroller";
import { NotificationItem } from '@/shared/components/Notification';
import NotificationStore from "@/shared/stores/NotificationStore";
import styles from './NotificationContainer.module.less';

interface IProps {
  user: IAccountDto;
  onUpdate: Function;
}

const NotificationContainer: React.FC<IProps> = observer((props) => {
  const readAll = () => NotificationStore.markAllRead();

  return (
    <div className='container'>
      <ScrollToTop />
      <CustomizedHeader>
        <HeaderLayout 
          left={<HeaderBack />}
          title="消息中心"
          right={<a onClick={readAll}>全部已读</a>}
        />
      </CustomizedHeader>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <ResponsiveCard 
            style={{ marginTop: 16 }}
            bordered={false}
            title={(
              <div style={{ display: 'flex', alignItems: 'center' }}>
                消息中心
                <Button 
                  style={{ marginLeft: 'auto' }}
                  type='primary'
                  onClick={readAll}
                >
                  全部已读
                </Button>
              </div>
            )}
          >
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={() => NotificationStore.loadNext()}
              hasMore={NotificationStore.unreadNotificationHasNext}
              // useWindow={false}
              // getScrollParent={() => document.getElementById("scrollableContent")}
            >
              {NotificationStore.unreadNotificationTotal === 0 && NotificationStore.initialized 
                ? <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无更多提醒"} />
                : <List
                    dataSource={NotificationStore.unreadNotification}
                    renderItem={(item) => (
                      <NotificationItem notification={item}/>
                    )}
                  />
              }
              {(NotificationStore.initialized && NotificationStore.unreadNotificationLoading) && (
                <div className={styles.scrollLoading}>
                  <Spin size={"large"} />
                </div>
              )}
            </InfiniteScroll>
          </ResponsiveCard>
        </Col>
        <Col xs={0} sm={0} md={8}></Col>
      </Row>
    </div>
  );
});
export default NotificationContainer;
