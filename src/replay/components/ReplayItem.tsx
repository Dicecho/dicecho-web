import React from "react";
import { observer } from "mobx-react";
import { Card, Typography, Rate, Avatar } from "antd";
import { IReplayDto } from '../stores/ReplayStore';
import styles from "./ReplayItem.module.less";

const { Paragraph, Text } = Typography;

interface IProps {
  replay: IReplayDto;
}

const ReplayItem: React.FC<IProps> = observer(({ replay }) => {
  return (
    <Card className={styles.card} bordered={false}>
      <div className={styles.coverBox}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${replay.coverUrl})` }}
        />
        <div className={styles.coverMask} />
      </div>
      <div className={styles.cardHeader}>
        <Paragraph 
          ellipsis={{ rows: 2, expandable: false }}
          className={styles.cardTitle}>
          {replay.title}
        </Paragraph>
        <div className={styles.moduleAuther}>
          <Avatar
            style={{ marginRight: 8 }}
            size="small"
            src={replay.owner.face}
          />
          <span style={{ flex: 1 }}>{replay.owner.name}</span>
        </div>
        {/* {renderRate()} */}
        {/* <div className={styles.moduleInfo}>
          <span>
            发布于 {moment(module.releaseDate).format('YYYY-MM-DD')}
          </span>
        </div> */}
      </div>
    </Card>
  );
});

export default ReplayItem;
