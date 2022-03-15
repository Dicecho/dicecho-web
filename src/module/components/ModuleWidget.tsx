import React, { useRef } from "react";
import classNames from 'classnames';
import { observer } from "mobx-react";
import { Typography } from "antd";
import SettingStore from "@/shared/stores/SettingStore";
import styles from "./ModuleWidget.module.less";

const { Paragraph } = Typography;

interface SimpleModDto {
  _id: string,
  title: string,
  description: string,
  coverUrl: string,
  rateAvg: number,
  rateCount: number,
}

export interface IProps {
  mod: SimpleModDto;

  action?: React.ReactNode;
  clickable?: boolean;
  tiny?: boolean;
}

const ModuleWidget = React.forwardRef<HTMLDivElement, IProps>(
(
  { 
    mod, 
    action, 
    clickable = true, 
    tiny=false,
  }, 
  ref
) => {

  if (tiny) {
    return (
      <div 
        ref={ref}
        className={classNames(styles.mod, styles.tiny, { [styles.clickable]: clickable })}
        style={{ marginBottom: 8 }}
      >
        <div className={styles.modMask} style={{ backgroundImage: `url(${mod.coverUrl})` }}/>
        <div
          className={styles.modCover}
          style={{ background: `url(${mod.coverUrl})` }}
        />
        <div className={styles.modMain}>
          <Paragraph
            className={styles.modTitle}
            ellipsis={{ rows: 2, expandable: false }}
          >
            {mod.title}
            {SettingStore.rateScoreAvailable && mod.rateAvg !== 0 && (
              <React.Fragment>
                <span
                  className={styles.modRate}
                  style={{ marginLeft: 8 }}
                >
                  {mod.rateAvg}
                </span>
                <span
                  className={styles.modRateCount}
                  style={{ marginLeft: 4 }}
                >
                  ({mod.rateCount})
                </span>
              </React.Fragment>
            )}
            {action &&
              <div style={{ marginLeft: 'auto' }}>
                {action}
              </div>
            }
          </Paragraph>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classNames(styles.mod, { [styles.clickable]: clickable })} style={{ marginBottom: 8 }}>
      <div
        className={styles.modCover}
        style={{ background: `url(${mod.coverUrl})` }}
      />
      <div className={styles.modMain}>
        <Paragraph
          className={styles.modTitle}
          ellipsis={{ rows: 1, expandable: false }}
        >
          {mod.title}
          {SettingStore.rateScoreAvailable && mod.rateAvg !== 0 && (
            <React.Fragment>
              <span
                className={styles.modRate}
                style={{ marginLeft: 8 }}
              >
                {mod.rateAvg}
              </span>
              <span
                className={styles.modRateCount}
                style={{ marginLeft: 4 }}
              >
                ({mod.rateCount})
              </span>
            </React.Fragment>
          )}
          {action &&
            <div style={{ marginLeft: 'auto' }}>
              {action}
            </div>
          }
        </Paragraph>
        <Paragraph
          className={styles.modDescription}
          ellipsis={{ rows: 3, expandable: false }}
        >
          {mod.description}
        </Paragraph>
      </div>
    </div>
  );
});

export default ModuleWidget;
