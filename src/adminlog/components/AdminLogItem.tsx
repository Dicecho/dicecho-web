import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { IAdminLog, AdminLogType } from '../stores/AdminLogStore';
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import { formatDate } from "@/utils/time";
import styles from "./AdminLogItem.module.less";
import RateSnapshot from './RateSnapshot';

interface IProps {
  adminLog: IAdminLog;
}

const AdminLogItem: React.FC<IProps> = ({ adminLog, ...props }) => {
  const history = useHistory();

  const renderSnapshot = () => {
    if (adminLog.type === AdminLogType.HideRate) {
      return (
        <RateSnapshot 
          remark={adminLog.snapshot.remark}
          score={adminLog.snapshot.rate}
          authorNickname={adminLog.snapshot.nickname}
        />
      )
    }

    return (
      <div>
        未知的快照类型
      </div>
    )
  };

  return (
    <div className={styles.adminLogItem}>
      <div className={styles.adminLog} style={{ marginBottom: 8 }}>
        {adminLog.log}

        <span style={{ marginLeft: 16 }}>
          处理人：
          <AccountInfoWrapper _id={adminLog.operator._id}>
            <a>{adminLog.operator.nickName}</a>
          </AccountInfoWrapper>
        </span>
      </div>
      
      {adminLog.message &&
        <div className={styles.adminLogReason} style={{ marginBottom: 8 }}>
          留言：{adminLog.message}
        </div>
      }
      <div className={styles.adminLogSnapshot} style={{ marginBottom: 8 }}>
        {renderSnapshot()}
      </div>
      <div className={'secondary-text'}>
        {formatDate(new Date(adminLog.createdAt).getTime())}
      </div>
    </div>
  );
};

export default AdminLogItem;
export { AdminLogItem };
