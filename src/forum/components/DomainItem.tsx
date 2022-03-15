import React, { HTMLAttributes, useState, useRef } from "react";
import { observer } from "mobx-react";
import classnames from 'classnames'
import { Avatar } from "antd";
import styles from "./DomainItem.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  domain: {
    _id: string;
    coverUrl: string;
    title: string;
  };
}


const DomainItem: React.FC<IProps> = observer(({
  domain,
  ...props
}) => {

  return (
    <div {...props} className={classnames(styles.domainItem, props.className)}>
      <Avatar
        size={32}
        style={{ marginRight: 8 }}
        src={domain.coverUrl}
      >
        {domain.title[0]}
      </Avatar>
      <div className={styles.domainTitle}>
        {domain.title}
      </div>
    </div>
  );
});
export default DomainItem;
