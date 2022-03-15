import React from "react";
import { observer } from "mobx-react";
import { Card, Typography, Rate, Avatar } from "antd";
import { IModDto } from "@/interfaces/shared/api";
import SettingStore from '@/shared/stores/SettingStore';
import styles from "./ModuleItem.module.less";

const { Paragraph, Text } = Typography;

interface IProps {
  module: IModDto;
  ellipsis?: boolean;
}

const ModuleItem: React.FC<IProps> = observer(({ module, ellipsis = false }) => {
  const renderRate = () => {
    if (!SettingStore.rateAvailable || !SettingStore.rateScoreAvailable) {
      return undefined;
    }

    if (module.rateAvg === 0) {
      return <div className={styles.moduleRateEmpty}>暂无评分</div>;
    }

    return (
      <div className={styles.moduleRateInfo}>
        <Rate
          className={styles.rate}
          style={{ marginRight: 8 }}
          allowHalf
          value={module.rateAvg / 2}
          disabled
        />
        <span className={styles.rateAvg}>{module.rateAvg}</span>
        <div className={styles.rateCount} style={{ marginLeft: 4 }}>
          ({module.rateCount})
        </div>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.coverBox}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${module.coverUrl})` }}
        />
        <div className={styles.coverMask} />
      </div>
      <div className={styles.cardHeader}>
        <Paragraph style={{ marginBottom: 0 }} ellipsis={ellipsis ? { rows: 1 } : false} className={styles.cardTitle}>{module.title}</Paragraph>
        <div className={styles.moduleAuther}>
          <Avatar
            style={{ marginRight: 8 }}
            size={16}
            src={module.author.avatarUrl}
          />
          <span className={styles.authorName} style={{ flex: 1 }}>{module.author.nickName}</span>
        </div>
        {renderRate()}
        {/* <div className={styles.moduleInfo}>
          <span>
            发布于 {moment(module.releaseDate).format('YYYY-MM-DD')}
          </span>
        </div> */}
      </div>
    </div>
  );
});

export default ModuleItem;
