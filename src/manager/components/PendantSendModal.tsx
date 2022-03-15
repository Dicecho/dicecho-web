import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Avatar, message } from "antd";
import { ModalProps } from 'antd/lib/modal'
import openGenericFuncModal from '@/shared/components/CustomFuncModal';
import { SearchSelect } from '@/shared/components/SearchSelect';
import { singleSearchStore } from '@/search/stores/SearchStore';
import { IUserDto } from "interfaces/shared/api";
import { sendPendant } from '@/shared/hooks';
import LoadableButton from "@/shared/components/LoadableButton";
import { Pendant } from "@/shared/components/Pendant";


export interface PendantSendModalConfig {
  pendantId: string,
  pendantUrl: string,
}


export interface PendantSendModalProps extends ModalProps, PendantSendModalConfig {
  onCancel?: (...args: any[]) => any;
}

const renderUserItem = (user: IUserDto) => (
  <div>
    <Avatar src={user.avatarUrl} size={24} style={{ marginRight: 8 }} />
    <span>{user.nickName}({user._id})</span>
  </div>
)

export const PendantSendModal: React.FunctionComponent<PendantSendModalProps> = observer(({
  pendantId,
  pendantUrl,
  ...props
}) => {
  const [userId, setUserId] = useState<string>('');

  return (
    <Modal 
      title={'发送头像'}
      footer={null}
      {...props}
    >
      <div style={{ textAlign: 'center', width: '100%', marginBottom: 32 }}>
        <Pendant url={pendantUrl}>
          <Avatar 
            src={'/avatars/preview'}
            size={64}
          />
        </Pendant>
      </div>
      <SearchSelect 
        style={{ width: '100%', marginBottom: 16 }}
        placeholder='输入用户id来搜索用户'
        onChanged={(value) => setUserId(`${value}`)}
        onSearch={(text) => 
          singleSearchStore.searchUser({ keyword: text }).then((res) => res.data.data.map(user => (
            { 
              value: user._id,
              label: renderUserItem(user),
            }
          )))
        }
      />
      <LoadableButton 
        disabled={!userId}
        onSubmit={(e) => sendPendant({ userId, pendantId }).then(() => {
          message.success('发送成功')
          props.onCancel && props.onCancel(e);
        })}
        type='primary'
        block
      >
        发送
      </LoadableButton>
    </Modal>
  );
});

export const openPendantSendModal = (config: PendantSendModalConfig) => openGenericFuncModal<PendantSendModalProps>(config, PendantSendModal)
