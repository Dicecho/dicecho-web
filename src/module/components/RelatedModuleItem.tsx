import React, { HTMLAttributes } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Tooltip } from 'antd';
import SettingStore from '@/shared/stores/SettingStore';
import { IModDto } from '@/interfaces/shared/api';
import styles from './RelatedModuleItem.module.less';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  module: IModDto;
}

const RelatedModuleItem: React.FC<IProps> = observer((props) => {
  const { module, ...wrapProps } = props;
 
  return (
    <div className={styles.relatedModuleItem} {...wrapProps}>
      {/* <div className={styles.relatedModuleCoverBox} style={{ backgroundImage: `url(${module.coverUrl})` }}/> */}
      <div className={styles.relatedModuleMain}>
        <div className={styles.relatedModuleItemHeader}>
          <Tooltip title={module.title}>
            <div className={styles.relatedModuleItemTitle}>
              {module.title}
            </div>
          </Tooltip>
          {SettingStore.rateAvailable && SettingStore.rateScoreAvailable && module.rateAvg > 0 && 
            <React.Fragment>
              <div className={styles.relatedModuleItemRate}>
                {module.rateAvg}
              </div>
              <div className={styles.relatedModuleItemRateCount} style={{ marginLeft: 4 }}>
                ({module.rateCount})
              </div>
            </React.Fragment>
          }
        </div>
        <div className={styles.relatedModuleItemAuthor}>
          <Avatar style={{ marginRight: 8 }} size={20} src={module.author.avatarUrl} />
          {module.author.nickName}
        </div>
      </div>
    </div>
  )
});

export default RelatedModuleItem
export { RelatedModuleItem }