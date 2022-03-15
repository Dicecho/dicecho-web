import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import { CardProps } from 'antd/lib/card'
import { Card, Typography, Rate, Avatar } from "antd";
import classnames from 'classnames';
import styles from "./CollectionCard.module.less";

const { Paragraph, Text } = Typography;

interface IProps extends HTMLAttributes<HTMLDivElement> {
  collection: {
    _id: string;
    coverUrl: string;
    name: string;
  };
}

const CollectionCard: React.FC<IProps> = observer(({ collection, ...props }) => {
  return (
    <div {...props} className={classnames(styles.card, props.className)} >
      <div className={styles.coverBox}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${collection.coverUrl})` }}
        />
        <div className={styles.coverMask} />
      </div>
      <div className={styles.cardHeader}>
        <Paragraph ellipsis={{ rows: 2, expandable: false }} className={styles.cardTitle}>{collection.name}</Paragraph>
      </div>
    </div>
  );
});

export default CollectionCard;
