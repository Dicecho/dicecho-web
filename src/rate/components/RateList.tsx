import React, { useState } from "react";
import { observer } from "mobx-react";
import { IRateDto } from "interfaces/shared/api";
import { List } from "antd";
import { ListProps } from "antd/lib/list";
import RateItem from "@/rate/components/RateItem";
import styles from "./RateList.module.less";

interface IProps {
  className?: string;
  style?: React.CSSProperties;
  rates: Array<IRateDto>;
  listProps?: Partial<ListProps<any>>;
  onRemovedRate?: (rateId: string) => any;
}

const RateList: React.FC<IProps> = observer((
  {
    onRemovedRate = () => {}, 
    ...props
  }) => {
    return (
      <List
        dataSource={props.rates}
        rowKey="_id"
        renderItem={(item) => (
          <RateItem
            rate={item}
            onRemoved={() => onRemovedRate(item._id)}
          />
        )}
        {...props.listProps}
      />
    );
});
export default RateList;
