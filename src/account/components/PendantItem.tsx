import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Pendant } from "@/shared/components/Pendant";
import { Avatar } from "antd";
import { IPendantDto } from '@/shared/hooks';
import styles from './AccountAvatar.module.less';


interface IProps {
  pendant: IPendantDto,
  previewAvatar?: string,
}

const PendantItem: React.FunctionComponent<IProps> = observer(({ 
  pendant, 
  children,
  previewAvatar = '/avatars/avatar'
}) => {
  return (
    <div className={styles.pendantItem}>
      <Pendant url={pendant.url} style={{ marginBottom: 32, marginTop: 24 }}>
        <Avatar src={previewAvatar} size={64} />
      </Pendant>

      <div className={styles.pendantName} style={{ marginBottom: 16 }}>{pendant.name}</div>
      {children}
    </div>
  )
});

export default PendantItem;
