import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import useSWR, { useSWRConfig } from 'swr';
import { Link } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { CollectionSingleStore, ICollectionDto } from '../store/CollectionStore';
import { Spin } from 'antd';
import { ICollectionItem } from '@/collection/store/CollectionStore';
import { Error } from "@/shared/components/Empty";
import ModuleWidget from '@/module/components/ModuleWidget';
import { DragableItem } from './DragableItem'
import update from 'immutability-helper'
import styles from './CollectionItemList.module.less';



interface IProps {
  collection: ICollectionDto;
  editable?: boolean;
  setItems?: (items: Array<ICollectionItem>) => any;
}

const ConditionalWrap: React.FC<{
  condition: boolean,
  wrap: (children: React.ReactNode) => any,
}> = ({ condition, wrap, children }) => (
  condition ? wrap(children) : children
);

const CollectionItemList: React.FC<IProps> = observer(({
  collection,
  editable = false,
  setItems = () => {},
}) => {
  const [items, _setItems] = useState(collection.items);
  const { mutate } = useSWRConfig()
  const { data: mods, error } = useSWR(
    `/collection/${collection._id}/items`,
    () => CollectionSingleStore.getCollectionItems(collection._id)
  )

  useEffect(() => {
    _setItems(collection.items);
  }, [collection])

  if (!mods) {
    return <div className={styles.loadingPage}>
      <Spin size="large" />
    </div>;
  }

  if (error) {
    if (error.response?.data.detail) {
      return (
        <Error text={error.response?.data.detail}/>
      )
    }

    return null;
  }

  if (mods.length === 0) {
    return (
      <Error text='这里似乎没有收藏'/>
    )
  }

  const moveItems = (dragIndex: number, hoverIndex: number) => {
    const dragItem = items[dragIndex]
    const nItems = update(items, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragItem],
      ],
    })
    _setItems(nItems)
    setItems(nItems)
  
    const dragMods = mods[dragIndex]
    const nMods = update(mods, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragMods],
      ],
    })
  
    mutate(`/collection/${collection._id}/items`, nMods, false)
  }

  const removeItem = (index: number) => {
    const nItems = update(items, {
      $splice: [
        [index, 1],
      ],
    })
    _setItems(nItems)
    setItems(nItems)
  
    const nMods = update(mods, {
      $splice: [
        [index, 1],
      ],
    })
  
    mutate(`/collection/${collection._id}/items`, nMods, false)
  }

  return (
    <React.Fragment>
      {mods.map((module, index) => (
        <ConditionalWrap
          key={module._id}
          condition={!editable}
          wrap={children => <Link to={`/module/${module._id}`} key={module._id}>{children}</Link>}
        >
          <DragableItem 
            index={index} 
            id={module._id}
            key={module._id}
            move={moveItems}
            dragable={editable}
            style={{ position: 'relative' }}
          >
            {editable &&
              <div 
                className={styles.close}
                onClick={() => removeItem(index)}
              >
                <CloseOutlined />
              </div>
            }
            <ModuleWidget mod={module} />
          </DragableItem>
        </ConditionalWrap>
      ))}
    </React.Fragment>
  );
});
export default CollectionItemList;
