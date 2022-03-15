import React from 'react';
import { observer } from 'mobx-react';
import styles from './ModuleInfoItem.module.less';

interface IProps {
  title: string,
  content: React.ReactNode,
}

const ModuleInfoItem: React.FC<IProps> = observer((props) => {
  return (
    <div className={styles.moduleInfoItem}>
      <div className={styles.moduleInfoItemTitle}>
        {props.title}
      </div>
      <div className={styles.moduleInfoItemContent}>
        {props.content}
      </div>
    </div>
  )
});

export default ModuleInfoItem;
