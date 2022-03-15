import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Card, Typography, Row, Col, Space, List } from "antd";
import { ListProps } from "antd/lib/list";
import { IModDto } from '@/interfaces/shared/api';
import ModuleItem from "./ModuleItem";

const { Paragraph, Text } = Typography;

interface IProps extends Partial<ListProps<IModDto>> {};

const ModuleList: React.FC<IProps> = observer((props) => {
  return (
    <List 
      {...props}
      renderItem={(module: IModDto) => (
        <List.Item key={module._id} style={{ marginBottom: 0 }}>
          <Link to={`/module/${module._id}`}>
            <ModuleItem module={module} />
          </Link>
        </List.Item>
      )}
    />
  );
});

export default ModuleList;
