import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import AvatarUploader from "@/shared/components/AvatarUploader";
import { Pendant } from "@/shared/components/Pendant";
import Empty from "@/shared/components/Empty";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import { Error } from "@/shared/components/Empty";
import AccountStore from "../stores/AccountStore";
import { Button, Typography, Collapse, Card, List, Tabs, Avatar } from "antd";
import { useSelfPendant } from '@/shared/hooks';
import PendantItem from './PendantItem';
import AuthStore from '@/shared/stores/AuthStore';
import styles from './AccountAvatar.module.less';


const { TabPane } = Tabs;

interface IProps {

}

const AccountAvatar: React.FunctionComponent<IProps> = observer((props) => {
  const { data, error, isLoading } = useSelfPendant();

  if (error) {
    if (error.response?.data.detail) {
      return (
        <Error text={error.response?.data.detail}/>
      )
    }

    return null;
  }

  const activeId = data?.find(pendant => pendant.url === AuthStore.user.pendantUrl)?._id


  return (
    <>
      <div className={styles.avatarPreview} style={{ marginBottom: 32, marginTop: 16 }}>
        <Pendant url={AuthStore.user.pendantUrl} style={{ marginRight: 24 }}>
          <AvatarUploader />
        </Pendant>
      </div>

      <Tabs defaultActiveKey="self">
        <TabPane tab="我的挂件" key="self">
          <List
            grid={{
              // @ts-ignore
              gutter: [40, 16],
              xs: 2,
              sm: 3,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 5,
            }}
            loading={isLoading}
            dataSource={data}
            locale={{ emptyText: <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无更多挂件"} /> }}
            renderItem={pendant => (
              <List.Item key={pendant._id}>
                <PendantItem pendant={pendant} previewAvatar={AuthStore.user.avatarUrl}>
                  {activeId === pendant._id 
                    ? <Button block ghost type='primary' onClick={() => AccountStore.inactivePendant().then(() => AuthStore.fetchUserData())}>
                      卸下
                    </Button>
                    : <Button block type='primary' onClick={() => AccountStore.activePendant(pendant._id).then(() => AuthStore.fetchUserData())}>
                      激活
                    </Button>
                  }
                </PendantItem>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </>
  )
});

export default AccountAvatar;
