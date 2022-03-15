import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Card, Button } from 'antd';
import { CardProps } from 'antd/lib/card';
import { ITag } from "@/shared/stores/TagStore";
import styles from './TagCard.module.less';


interface IProps extends CardProps {
  tag: ITag
}

const TagCard: React.FC<IProps> = observer(({ 
  tag,
  ...props
}) => {

  return (
    <Card bordered={false} {...props} className={classNames(styles.tagCard, props.className)} >
      <div className={styles.tagCardContent}>
        <div className={styles.tagCardCover} style={{ background: `url(${tag.coverUrl})` }} />
        <div className={styles.tagName}>
          {tag.name}
        </div>
      </div>
  
      {tag.description &&
        <div className={styles.tagDescription} style={{ marginTop: 8 }} >
          {tag.description}
        </div>
      }

      <div className={styles.tagInfo} style={{ marginTop: 16 }}>
        <div className={styles.tagInfoItem}>
          模组 {tag.modCount}
        </div>
        
        <Button size='small' type='primary' ghost className={styles.tagFollowBtn}>
          关注
        </Button>
      </div>
    </Card>
  );
});

export default TagCard;
