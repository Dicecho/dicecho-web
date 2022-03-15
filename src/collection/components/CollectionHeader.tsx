import React, { useState } from "react";
import { observer } from "mobx-react";
import { Avatar, Button, message, Modal, Popconfirm } from 'antd';
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import { FormOutlined, ShareAltOutlined, FolderAddOutlined, DeleteOutlined, FolderOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { ICollectionDto, CollectionSingleStore, AccessLevelMap } from '../store/CollectionStore';
import CollectionUpdateForm from './CollectionUpdateForm';
import ShareWrapper from "@/shared/components/ShareWrapper";
import styles from './CollectionHeader.module.less';
import moment from 'moment';
import classnames from 'classnames';
import AuthStore from "@/shared/stores/AuthStore";


interface IProps {
  collection: ICollectionDto;
  onUpdate?: (collection: ICollectionDto) => any;
  onDeleted?: () => any;
}

const CollectionHeader: React.FC<IProps> = observer(({
  collection,
  onUpdate = () => {},
  onDeleted = () => {},
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fold, setFold] = useState(true);

  const canEdit = collection.user._id === AuthStore.user._id;

  return (
    <React.Fragment>
    <div className={styles.wrapper}>
      <Avatar
        shape='square'
        size={160}
        src={collection.coverUrl}
        style={{ marginRight: 24 }}
        className={styles.avatar}
      >
        {collection.name[0]}
      </Avatar>
      <div className={styles.headerMain}>
        <div className={styles.title} style={{ marginBottom: 4 }}>
          {collection.name}
          {canEdit &&
            <FormOutlined 
              className={styles.editBtn}
              style={{ marginLeft: 4 }}
              onClick={() => setEditModalVisible(true)}
            />
          }
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
          {moment(collection.createdAt).format('YYYY-MM-DD')} 创建
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
                onUpdate(res.data);
              })
            }}
          >
            {collection.isFavorited ? '取消收藏' : '收藏'}
            {collection.favoriteCount > 0 && ` (${collection.favoriteCount})`}
          </Button>
          <ShareWrapper url={`${window.location.origin}/collection/${collection._id}`}>
            <Button 
              shape='round'
              type='primary'
              ghost
              style={{ marginRight: 8 }}
              icon={<ShareAltOutlined />}
            >
              分享
            </Button>
          </ShareWrapper>
          {canEdit && !collection.isDefault &&
            <Popconfirm
              title="是否要删除收藏夹？"
              onConfirm={() =>
                CollectionSingleStore.deleteCollection(collection._id).then(() => {
                  message.success('删除成功')
                  onDeleted();
                })
              }
              okText="删除"
              cancelText="取消"
            >
              <Button 
                shape='round'
                ghost
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          }
        </div>
        <div className={styles.info}>{collection.items.length} 个藏品 · {AccessLevelMap[collection.accessLevel]}</div>
        <div className={styles.descriptionBlock}>
          <div 
            className={classnames(styles.description, { [styles.unfold]: !fold })}
            style={{ marginRight: 8 }}
          >
            简介：
            {!collection.description && canEdit 
              ? <a onClick={() => setEditModalVisible(true)}>添加简介</a> 
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
    <Modal 
      visible={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      title='编辑收藏夹'
      closable={false}
    >
      <CollectionUpdateForm 
        collection={collection}
        onSave={(dto) => CollectionSingleStore.updateCollection(collection._id, dto).then((res) => {
          message.success('更新成功')
          setEditModalVisible(false);
          onUpdate(res.data)
        })}
      />
    </Modal>
    </React.Fragment>
  );
});
export default CollectionHeader;
