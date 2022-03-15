import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import ResponsiveModal from "shared/components/ResponsiveModal";
import { Button, Input, Avatar } from "antd";
import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import LoadableButton from "@/shared/components/LoadableButton";
import { CollectionSingleStore, AccessLevelMap } from '../store/CollectionStore'
import styles from "./CollectionAction.module.less";
import classNames from "classnames";

interface IProps {
  targetName: string;
  targetId: string;
  visible: boolean;
  onCancel: Function;
}

const CollectionActionModal: React.FunctionComponent<IProps> = observer((props) => {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!props.visible) {
      return;
    }

    CollectionSingleStore.getMineCollection();
    CollectionSingleStore.getCollectionStatus({
      targetName: props.targetName,
      targetId: props.targetId,
    }).then((res) => {
      setStatus(res.data)
    })

  }, [props.targetId, props.targetName, props.visible]);

  return (
    <ResponsiveModal
      modalProps={{
        visible: props.visible,
        onCancel: () => props.onCancel(),
        title: '添加到收藏夹',
        footer: null,
        closable: false,
        centered: true,
        destroyOnClose: true,
        className: styles.antModal,
      }}
      drawerProps={{
        placement: "bottom",
        visible: props.visible,
        onClose: () => props.onCancel(),
        closable: false,
        height: "60vh",
        title: '添加到收藏夹',
        className: styles.antDrawer,
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.scrollView}>
          {CollectionSingleStore.managerCollections.map((collection) => (
            <div 
              key={collection._id}
              className={styles.collectionItem} 
              onClick={() => {
                const api = status[collection._id] 
                  ? CollectionSingleStore.removeItemForCollection
                  : CollectionSingleStore.addItemForCollection;

                return api(collection._id, { targetName: props.targetName, targetId: props.targetId })
                  .then(() => {
                    setStatus(preStatus => ({
                      ...preStatus,
                      [collection._id]: !preStatus[collection._id],
                    }))
                  })
              }}
            >
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
                  <span 
                    className={classNames(
                      'success-text',
                      styles.successToken,
                      { [styles.active]: status[collection._id] },
                    )}
                  >
                    <CheckCircleFilled style={{ marginRight: 8 }}/>
                    已收藏
                  </span>
                </div>
                <div className={styles.collectionItemInfo}>
                  {AccessLevelMap[collection.accessLevel]} · {collection.items.length} 个藏品
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Input 
            prefix={<PlusOutlined />}
            bordered={false}
            className={classNames(styles.createCollectionInput, { [styles.hasInput]: inputValue !== '' })}
            placeholder='新建收藏夹（最大20字）'
            value={inputValue}
            onChange={(e => setInputValue(e.target.value))}
          />
          <LoadableButton 
            type='primary'
            style={{ marginLeft: 8 }}
            className={classNames(styles.createCollectionBtn, { [styles.hasInput]: inputValue !== '' })}
            onSubmit={() => CollectionSingleStore.createCollection(inputValue).then(() => {
              setInputValue('')
            })}
          >
            新建
          </LoadableButton>
        </div>
      </div>
    </ResponsiveModal>
  );
});

export default CollectionActionModal;
