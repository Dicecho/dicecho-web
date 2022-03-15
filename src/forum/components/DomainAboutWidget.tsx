import { Avatar, Button, Card, Divider, message } from "antd";
import { CardProps } from "antd/lib/card";
import { observer } from "mobx-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DomainSingleStore, IDomainDto } from "../stores/DomainStore";
import styles from "./DomainAboutWidget.module.less";

interface IProps extends CardProps {
  domain?: IDomainDto;
}

const DomainAboutWidget: React.FC<IProps> = observer(({ domain, ...props }) => {
  const [joined, setJoined] = useState(domain?.joined || false);

  useEffect(() => {
    setJoined(domain?.joined || false);
  }, [domain]);

  if (!domain) {
    return <Card bordered={false} title="关于版块" {...props} loading />;
  }

  return (
    <Card bordered={false} title="关于版块" {...props}>
      <Link to={`/forum/domain/${domain._id}`}>
        <div className={styles.domainAvatar} style={{ marginBottom: 8 }}>
          <Avatar size={32} style={{ marginRight: 8 }} src={domain.coverUrl}>
            {domain.title[0]}
          </Avatar>
          <div className={styles.domainTitle}>{domain.title}</div>
        </div>
      </Link>
      {domain.description && (
        <div className={styles.domainDescription} style={{ marginBottom: 8 }}>
          {domain.description}
        </div>
      )}
      <div className={styles.domainInfo}>
        <div className={styles.domainInfoItem}>
          <div className={styles.domainInfoData}>{domain.memberCount}</div>
          <div className={styles.domainInfoLabel}>成员</div>
        </div>
        <div className={styles.domainInfoItem}>
          <div className={styles.domainInfoData}>{domain.topicCount}</div>
          <div className={styles.domainInfoLabel}>帖子</div>
        </div>
      </div>

      <Divider />

      <div className={styles.domainAction}>
        <div style={{ marginBottom: 16 }}>
          创建于 {moment(domain.createdAt).format("YYYY年MM月DD日")}
        </div>
        {/* <Button 
          block
          type='primary'
          style={{ marginBottom: 16 }}
          ghost
          shape='round'
        >
          发布新帖
        </Button> */}
        {/* <Button
          block
          type='primary'
          ghost
          shape='round'
        >
          加入版块
        </Button> */}
        <Button
          shape="round"
          type="primary"
          ghost
          block
          danger={joined}
          onClick={() => {
            const api = joined
              ? () => DomainSingleStore.exitDomain(domain._id)
              : () => DomainSingleStore.joinDomain(domain._id);

            api().then(() => {
              message.success(joined ? "退出成功" : "加入成功");
              setJoined(!joined);
            });
          }}
        >
          {joined ? "退出版块" : "加入版块"}
        </Button>
      </div>
    </Card>
  );
});
export default DomainAboutWidget;
