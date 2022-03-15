import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import { Rate, Progress } from "antd";
import { ModRateInfoKey } from "interfaces/shared/api";
import { IModDto } from '@/interfaces/shared/api';
import styles from "./ModuleRateInfo.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  mod: IModDto
}

const ModuleRateInfo: React.FC<IProps> = observer(({
  mod,
  ...props
}) => {
  const all = (Object.keys(mod.rateInfo) as Array<ModRateInfoKey>).reduce((a, b) => a + mod.rateInfo[b], 0)

  return (
    <div className={styles.rateInfo} {...props}>
      <div className={styles.rateInfoContent}>
        <div className={styles.rateAvg}>
          <div>
            <span className={styles.highlight} style={{ marginRight: 4 }}>
              {mod.rateAvg}
            </span>
            分
          </div>
          <div>{mod.rateCount} 个评价</div>
        </div>
        <div className={styles.rateDetail}>
          {(Object.keys(mod.rateInfo) as Array<ModRateInfoKey>)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((key) => (
              <div key={key} className={styles.rateInfoItem}>
                <Rate
                  className={styles.rateInfoItemRate}
                  disabled
                  defaultValue={parseInt(key)}
                />
                <Progress
                  className={styles.rateInfoItemProgress}
                  percent={(mod.rateInfo[key] / all) * 100}
                  format={(p) => `${p?.toFixed(1) || 0}%`}
                  showInfo={false}
                  size="small"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});
export default ModuleRateInfo;
