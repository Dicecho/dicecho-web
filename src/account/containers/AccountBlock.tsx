import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Typography, Collapse, Card, Row, Avatar, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  AliyunOSSUpload,
  UploadFile,
} from "@/shared/components/Uploader";
import { MarkdownEditor } from '@/shared/components/MarkdownEditor';
import { DEFAULT_ACCOUNT_BACKGROUND } from "@/shared/constants";
import UIStore from "@/shared/stores/UIStore";
import { IAccountDto } from "../stores/AccountStore";
import AccountBlockList from '../components/AccountBlockList';
import BlockStore, { BlockTargetName } from "@/shared/stores/BlockStore";

const { Paragraph, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface IProps {

}

const selectOptions = [
  { 
    value: BlockTargetName.User,
    label: '屏蔽用户'
  },
  { 
    value: BlockTargetName.Mod,
    label: '屏蔽模组'
  },
]

const AccountBlock: React.FunctionComponent<IProps> = observer((props) => {
  const [target, setTarget] = useState(BlockTargetName.User)

  return (
    <Card
      bordered={false}
      title={(
        <Select
          value={target}
          onChange={(value) => setTarget(value)}
          bordered={false}
        >
          {selectOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}
    >
      <AccountBlockList targetName={target} />
    </Card>
  )
});

export default AccountBlock;
