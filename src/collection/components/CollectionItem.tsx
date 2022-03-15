import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import { Avatar } from "antd";
import { AccessLevel, AccessLevelMap } from '../store/CollectionStore'
import styles from "./CollectionItem.module.less";
import classNames from "classnames";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  collection: {
    coverUrl: string;
    name: string;
    accessLevel: AccessLevel;
    items: Array<any>;
  };
}

const CollectionItem: React.FunctionComponent<IProps> = observer(({ collection, ...props }) => {
  return (
    <div {...props} className={classNames(styles.collectionItem, props.className)} >
      <Avatar 
        shape='square'
        size={40}
        src={collection.coverUrl} 
        style={{ marginRight: 8 }}
      >
        {collection.name[0]}
      </Avatar>
      <div style={{ flex: 1 }}>
        <div className={styles.collectionItemHeader}>
          <span style={{ marginRight: 'auto',  }}>
            {collection.name}
          </span>
        </div>
        <div className={styles.collectionItemInfo}>
          {AccessLevelMap[collection.accessLevel]} · {collection.items.length} 个藏品
        </div>
      </div>
    </div>
  );
});

export default CollectionItem;
