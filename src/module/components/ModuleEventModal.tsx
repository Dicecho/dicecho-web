import React, { useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Pendant } from "@/shared/components/Pendant";
import { Button, Modal, Avatar, Typography, message } from "antd";
import AccountStore from "@/account/stores/AccountStore";
import PendantItem from '@/account/components/PendantItem';
import UIStore from '@/shared/stores/UIStore';
import { ModalProps } from 'antd/lib/modal'
import { useRetrievePendant } from '@/shared/hooks';
import LoadableButton from "@/shared/components/LoadableButton";
import AuthStore from '@/shared/stores/AuthStore';

const { Text, Paragraph, Title } = Typography;


export interface ModuleEventModalConfig {
  // pendantId: string,
  // pendantUrl: string,
}


export interface ModuleEventModalProps extends ModalProps, ModuleEventModalConfig {
  onCancel?: (...args: any[]) => any;
}

export const ModuleEventModal: React.FunctionComponent<ModuleEventModalProps> = observer(({
  // pendantId,
  // pendantUrl,
  ...props
}) => {
  const { data } = useRetrievePendant('61ea7b43200a600dd730f452')
  const [receiveVisible, setReceiveVisible] = useState(false);

  return (
    <>
    <Modal 
      title={null}
      closable={false}
      footer={null}
      {...props}
    >
      {/* <img 
        style={{ maxHeight: '20vh' }}
        src={'https://file.dicecho.com/mod/600af94a44f096001d6e49df/2022012119561117.png'}
      /> */}
      <div style={{ width: '100%', marginBottom: 32 }}>
        <Title level={5}>《呼兰大侠疑案》——模组联动活动</Title>
        <Paragraph>
          <Text strong>任务目标</Text>：找到此嫌疑犯人！捉拿归案
        </Paragraph>
        <Paragraph>
          <Text strong>任务方式</Text>：游玩《呼兰大侠疑案》模组后发表<Text className="primary-text" strong>50字</Text>以上的评价
        </Paragraph>
        <Paragraph>
          <Text strong>任务时间</Text>：即日起——2022年2月14日
        </Paragraph>
        <Paragraph>
          <Text strong>任务奖励</Text>：《呼兰大侠疑案》联动头像框
        </Paragraph>
      </div>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 32 }}>
        <Pendant url={data?.url} style={{ marginBottom: 24 }}>
          <Avatar 
            src={AuthStore.user.avatarUrl}
            size={64}
          />
        </Pendant>
        <div className="secondary-text">头像框预览</div>
      </div>
      <LoadableButton 
        onSubmit={(e) => 
          AccountStore.receiveHLDXYA().then(() => {
            setReceiveVisible(true);
          })
        }
        type='primary'
        block
      >
        领取《嫌犯画像》头像框
      </LoadableButton> 
    </Modal>

      <Modal
        visible={receiveVisible}
        onCancel={() => setReceiveVisible(false)}
        title={`获得了《${data?.name}》头像框！`}
        footer={null}
      >
        {data &&
          <div style={{ textAlign: 'center' }}>
            <PendantItem pendant={data} previewAvatar={AuthStore.user.avatarUrl} />
          </div>
        }
        <Link to={UIStore.isMobile ? '/account/setting/avatar' : `/account/${AuthStore.user._id}/setting/avatar`}>
          <Button
            block
            type='primary'
          >
            立刻去设置
          </Button>
        </Link>
      </Modal>  
    </>
  );
});

// export const openModuleEventModal = (config: ModuleEventModalConfig) => openGenericFuncModal<ModuleEventModalProps>(config, ModuleEventModal)
