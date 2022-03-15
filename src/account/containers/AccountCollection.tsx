import React, { useEffect, useState } from "react";
import classNames from 'classnames';
import { observer } from "mobx-react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Row, Col, Card, Select, Avatar, Button, Modal, Input } from "antd";
import LoadableButton from "@/shared/components/LoadableButton";
import { RightOutlined, LockOutlined, UnlockOutlined, FolderAddOutlined } from '@ant-design/icons';
import { IAccountDto } from '../stores/AccountStore';
import { Error } from "@/shared/components/Empty";
import CollectionHeader from '@/collection/components/CollectionHeader';
import CollectionDetailCard from '@/collection/components/CollectionDetailCard';
import CollectionItemList from '@/collection/components/CollectionItemList';
import { AccessLevel, CollectionSingleStore, ICollectionDto, AccessLevelMap } from '@/collection/store/CollectionStore'

import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import styles from "./AccountCollection.module.less";

const { Option } = Select;

interface IProps {
  user: IAccountDto,
}
enum TabKey {
  EditProfile = 'editProfile',
  ChangePassword = 'changePassword',
}

const AccountCollection: React.FC<IProps> = observer(({
  user
}) => {
  const [activeId, setActiveId] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalName, setCreateModalName] = useState('');
  const [collections, setCollections] = useState<Array<ICollectionDto>>([]);
  const [initialized, setInitialized] = useState(false);
  const history = useHistory();
  const route = useRouteMatch();
  const isSelf = user._id === AuthStore.user._id;

  const activeCollection = collections.find(c => c._id === activeId)

  useEffect(() => {
    const isSelf = user._id === AuthStore.user._id;
    if (isSelf) {
      CollectionSingleStore.getMineCollection().then((res) => {
        setCollections(res);
        if (res.length > 0) {
          setActiveId(res[0]._id)
        }
        setInitialized(true);
      })

      return;
    }

    CollectionSingleStore.fetchCollections({ creatorId: user._id, pageSize: 100 }).then((res) => {
      setCollections(res.data.data);
      if (res.data.data.length > 0) {
        setActiveId(res.data.data[0]._id)
      }
      setInitialized(true);
    })

  }, [user._id, AuthStore.user._id])

  if (initialized && collections.length === 0) {
    return (
      <Error text={isSelf ? '似乎出错了，请联系管理员' : 'TA还没有公开的收藏' }/>
    )
  }

  if (!activeCollection) {
    return null;
  }

  if (UIStore.isMobile) {
    return (
      <Card bordered={false} className={styles.mobileCard}>
        {collections.map((collection) => (
          <Link to={`/collection/${collection._id}`}>
          <div className={styles.collectionItem}>
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
          </Link>
        ))}
      </Card>
    )
  }

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={0} sm={0} md={8} xl={8}>
          <Card bordered={false} className={styles.siderCard}>
            <div className={styles.siderCardHeader}>
              {isSelf 
                ? (
                    <React.Fragment>
                      <span>
                        我的收藏
                      </span>
                      <Button 
                        style={{ marginLeft: 'auto' }}
                        icon={<FolderAddOutlined />}
                        onClick={() => setCreateModalVisible(true)}
                        type='primary'
                      />
                    </React.Fragment>
                  ) 
                : 'TA的收藏'
              }
            </div>
            <div className={styles.siderCardContent}>
              {collections.map((collection) => (
                <div
                  key={collection._id}
                  onClick={() => setActiveId(collection._id)}
                  className={classNames(styles.siderCardItem, { [styles.siderCardItemActive]: collection._id === activeId })}
                >
                  <div className={styles.siderCardTab}>
                    {collection.accessLevel === AccessLevel.Public
                      ? <UnlockOutlined style={{ marginRight: 8 }} />
                      : <LockOutlined style={{ marginRight: 8 }} />
                    }
                    {collection.name}
                    <span className='secondary-text' style={{ marginLeft: 'auto' }} >
                      {collection.items.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} xl={16}>
          {activeCollection &&
            <Card bordered={false} style={{ marginBottom: 8 }}>
              <CollectionHeader
                  collection={activeCollection} 
                  onUpdate={(nColletion) => {
                    const index = collections.findIndex((c) => c._id === nColletion._id);
                    if (index !== -1) {
                      const nCollections = collections;
                      nCollections[index] = nColletion;
                      setCollections([...nCollections]);
                    }
                  }} 
                  onDeleted={() => {
                    const index = collections.findIndex((c) => c._id === activeCollection._id);
                    if (index !== -1) {
                      const nCollections = [...collections];
                      nCollections.splice(index, 1);
                      setActiveId(nCollections[0]._id);
                      setCollections([...nCollections]);
                    }
                  }}
                /> 
            </Card>
          }
          <CollectionDetailCard collection={activeCollection}/>
        </Col>
      </Row>

      <Modal 
        visible={createModalVisible}
        title='创建新收藏夹'
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Input
          value={createModalName}
          onChange={(e) => setCreateModalName(e.target.value)}
          placeholder='收藏夹名称（最大20字）'
          style={{ marginBottom: 16 }}
        />

        <LoadableButton 
          block
          type='primary'
          onSubmit={() => CollectionSingleStore.createCollection(createModalName).then((res) => {
            setCreateModalName('')
            setCreateModalVisible(false)
            setCollections((preCollections) => [
              ...preCollections,
              res.data,
            ]);
          })}
        >
          新建
        </LoadableButton>
      </Modal>
    </React.Fragment>
  );
});
export default AccountCollection;
