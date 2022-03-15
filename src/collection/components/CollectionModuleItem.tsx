import React, { useState } from "react";
import { observer } from "mobx-react";
import { Row, Col, Card, Select, message } from "antd";
import ModuleStore, { IModDto, IModListQuery } from '@/module/stores/ModuleStore';
import { RightOutlined } from '@ant-design/icons';
import styles from "./CollectionModuleItem.module.less";

const { Option } = Select;

interface IProps {
  module: IModDto;
}


const CollectionModuleItem: React.FC<IProps> = observer(({
  module
}) => {

  return (
    <div>
      {module.title}
    </div>
  );
});
export default CollectionModuleItem;
