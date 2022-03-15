import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import copy from "copy-to-clipboard";
import { Avatar, Button, message, Modal, Popconfirm } from 'antd';
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderNotification, HeaderBack } from '@/shared/components/Header'
import { EllipsisOutlined, UpOutlined, DownOutlined, RightOutlined, FolderAddOutlined, FolderOutlined } from '@ant-design/icons';
import { ICollectionDto, CollectionSingleStore, AccessLevelMap } from '../store/CollectionStore';
import ActionSheet, { ActionSheetItem } from "@/shared/components/ActionSheet";
import CollectionUpdateForm from './CollectionUpdateForm';
import ShareWrapper from "@/shared/components/ShareWrapper";
import classnames from 'classnames';
import styles from './CollectionMobileHeader.module.less';
import moment from 'moment';
import AuthStore from "@/shared/stores/AuthStore";
import { ResponseError } from "@/interfaces/response";
import { useIsMounted } from "react-tidy";
import { useRouteMatch } from "react-router-dom";


interface IProps {
  collection: ICollectionDto;
  reload?: (collection: ICollectionDto) => any;
  onUpdate: () => any;
  onDeleted?: () => any;
}

const CollectionMobileHeader: React.FC<IProps> = observer(({
  collection,
  onUpdate,
  reload = () => {},
  onDeleted = () => {},
}) => {
  const [actionsOpened, setActionsOpened] = useState(false);
  const [fold, setFold] = useState(true);
  const canEdit = collection.user._id === AuthStore.user._id;

  return (
    <React.Fragment>
      <CustomizedHeader options={{ transparent: true }}>
        <HeaderLayout
          className={`${styles.moduleDetailHeader}`}
          left={<HeaderBack />}
          titleProps={{ className: styles.moduleDetailHeaderTitle }}
          title={''}
          right={(<EllipsisOutlined onClick={() => setActionsOpened(true)} />)}
        />
      </CustomizedHeader>
      <div className={styles.background}>
        <div 
          className={styles.mask}
          style={{ backgroundImage: `url(${collection.coverUrl})` }}
        />
      </div>
      <div className='container'>
      <div className={styles.wrapper}>
        <Avatar
          shape='square'
          size={120}
          src={collection.coverUrl}
          style={{ marginRight: 16, minWidth: 120 }}
        >
          {collection.name[0]}
        </Avatar>
        <div className={styles.headerMain}>
          <div className={styles.title} style={{ marginBottom: 4 }}>
            {collection.name}
          </div>
          <div className={styles.user} style={{ marginBottom: 8 }}>
            <AccountInfoWrapper _id={collection.user._id}>
              <Avatar
                size="small"
                src={collection.user.avatarUrl}
                style={{ marginRight: 4 }}
              />
            </AccountInfoWrapper>
            <AccountInfoWrapper _id={collection.user._id}>
              <span style={{ marginRight: 8 }}>{collection.user.nickName}</span>
            </AccountInfoWrapper>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Button 
              shape='round'
              type='primary'
              ghost
              disabled={canEdit}
              danger={collection.isFavorited}
              style={{ marginRight: 8 }}
              icon={collection.isFavorited ? <FolderOutlined /> : <FolderAddOutlined />}
              onClick={() => {
                
                const api = collection.isFavorited 
                  ? CollectionSingleStore.cancelFavoriteCollection
                  : CollectionSingleStore.favoriteCollection;
                
                api(collection._id).then((res) => {
                  reload(res.data);
                })
              }}
            >
              {collection.isFavorited ? '取消收藏' : '收藏'}
              {collection.favoriteCount > 0 && ` (${collection.favoriteCount})`}
            </Button>

          </div>
          
          
          <div className={styles.info}>{collection.items.length} 个藏品 · {AccessLevelMap[collection.accessLevel]}</div>
          <div className={styles.descriptionBlock}>
          <div 
            className={classnames(styles.description, { [styles.unfold]: !fold })}
            style={{ marginRight: 8 }}
          >
            简介：
            {!collection.description && canEdit 
              ? <div onClick={() => onUpdate()}>编辑简介 <RightOutlined /></div>
              : collection.description
            }
          </div> 
          {collection.description &&
            <div 
              className={styles.foldIcon}
              style={{ marginLeft: 'auto' }}
              onClick={() => setFold(prefold => !prefold)}
            >
              {fold
                ? <DownOutlined />
                : <UpOutlined />
              }
            </div>
          }
        </div>
        </div>
      </div>
      </div>

      <ActionSheet 
          visible={actionsOpened}
          onClose={() => setActionsOpened(false)}
        >
          <ActionSheetItem
            content="分享"
            onOptionClick={() => {
              copy(`${window.location.origin}/collection/${collection._id}`);
              message.success("链接复制到剪贴板成功");
            }}
          />
          {canEdit &&
            <ActionSheetItem
              content={'编辑'}
              onOptionClick={() => {
                onUpdate();
              }}
            />
          }
          {canEdit &&
            <ActionSheetItem 
              content='删除'
              danger
              onOptionClick={() => CollectionSingleStore.deleteCollection(collection._id).then(() => {
                message.success('删除成功')
                onDeleted();
              })}
            />
          }
        </ActionSheet>
    </React.Fragment>
  );
});
export default CollectionMobileHeader;
