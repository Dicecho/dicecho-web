import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { observer } from "mobx-react";
import { SortOrder } from "interfaces/shared/api";
import { CommentSortKey } from '@/shared/stores/CommentStore';
import { CommentBox, MobileCommentBox } from "@/shared/components/Comment";
import { Card, Button, Tabs, CardProps } from "antd";
import AuthStore from '@/shared/stores/AuthStore';
import UIStore from "@/shared/stores/UIStore";
import { CollectionSingleStore, ICollectionDto, ICollectionItem } from "../store/CollectionStore";
import CollectionItemList from "../components/CollectionItemList";
const { TabPane } = Tabs;

interface ICollectionDetailCardProps extends CardProps {
  collection: ICollectionDto,
  onUpdate?: (nItems: Array<ICollectionItem>) => Promise<any>;
}


const CollectionDetailCard: React.FC<ICollectionDetailCardProps> = observer(({
  collection,
  onUpdate = () => Promise.resolve(),
  ...props
}) => {
  const { mutate } = useSWRConfig()
  const [editable, setEditable] = useState(false);
  const [tabKey, setTabKey] = useState('list');
  const [items, setItems] = useState<ICollectionItem[]>(collection.items);

  useEffect(() => {
    setItems(collection.items);
  }, [collection])

  const canEdit = collection.user._id === AuthStore.user._id;
  const handleUpdate = () => {
    CollectionSingleStore.updateCollectionItems(collection._id, { items });
    setEditable(false);
    onUpdate(items);
  };

  const handleCancelUpdate = () => {
    mutate(`/collection/${collection._id}/items`);
    setItems(collection.items);
    setEditable(false);
  };

  return (
    <Card
      bordered={false}
      title={null}
      {...props}
    >
      <Tabs 
        defaultActiveKey="list"
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        tabBarExtraContent={(!canEdit || tabKey !== 'list')
          ? null 
          : editable 
            ? (
              <div style={{ marginLeft: "auto" }}>
                <Button type="primary" onClick={handleUpdate}>
                  保存
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  danger
                  onClick={handleCancelUpdate}
                >
                  取消
                </Button>
              </div>
            ) : (
              <Button
                style={{ marginLeft: "auto" }}
                onClick={() => setEditable(true)}
              >
                编辑
              </Button>
            )
        }
      >
        <TabPane tab={`收藏列表(${collection.items.length})`} key="list">
          <CollectionItemList
            collection={collection}
            editable={editable}
            setItems={setItems}
          />
        </TabPane>
        <TabPane tab={`评论(${collection.commentCount})`} key="comment">
          {UIStore.isMobile 
            ? <MobileCommentBox 
              targetName="Collection"
              targetId={collection._id}
              query={{ sort: { [CommentSortKey.CREATED_AT]: SortOrder.DESC } } }
            />
            : <CommentBox
              isRich
              targetName="Collection"
              targetId={collection._id}
              query={{ sort: { [CommentSortKey.CREATED_AT]: SortOrder.DESC } } }
            />
          }
        </TabPane>
      </Tabs>
    </Card>
  );
});
export default CollectionDetailCard;
