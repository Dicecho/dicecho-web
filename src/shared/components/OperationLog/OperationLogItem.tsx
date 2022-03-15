import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Row, Col, Card, message, Modal, Typography } from "antd";
import { formatDate } from "@/utils/time";
import { ILogDto } from "@/shared/stores/LogStore";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import styles from "./OperationLogItem.module.less";

const { Paragraph, Text, Title } = Typography;

interface Props {
  log: ILogDto;
}

const OperationLogItem: React.FC<Props> = observer(({
  log,
}) => {
  const [diffModal, setDiffModal] = useState(false);

  const renderContent = () => {
    if (log.action === 'create') {
      return <span>创建了条目</span>
    }

    return (
      <span>修改 {log.changedKeys.join('、')} 字段</span>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.editLog}>
        {renderContent()}
        <a onClick={() => setDiffModal(true)} style={{ marginLeft: 8, marginRight: 8 }}>
          详细
        </a>
        <span> - </span>
        <AccountInfoWrapper _id={log.operator._id} tag='span' style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}>
          {log.operator.nickName}
        </AccountInfoWrapper>
        <span className={styles.editLogInfo}>{formatDate(new Date(log.createdAt).getTime())}</span>
      </div>
      <Modal
        visible={diffModal}
        onCancel={() => setDiffModal(false)}
        footer={null}
      >
        {log.changedKeys.map(key => (
          <Paragraph key={key}>
            <Title level={5}>{key}</Title>
            <ul>
              <li>
              <Text>修改前</Text>：{log.before ? JSON.stringify(log.before[key]) : ''}
              </li>
              <li>
              <Text>修改后</Text>：{log.after ? JSON.stringify(log.after[key]) : ''}
              </li>
            </ul>
          </Paragraph>
        ))}
      </Modal>
    </React.Fragment>
  )
})

export { OperationLogItem }
