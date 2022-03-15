import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Card, Row, Col  } from "antd";
import LogStore, { ILogDto } from '@/shared/stores/LogStore';
import { OperationLogItem } from '@/shared/components/OperationLog';
import TagEditForm from "@/tag/components/TagEditForm";
import { ITag, UpdateTagDto } from "@/shared/stores/TagStore";

interface Props {
  tag: ITag;
  onSave: (dto: Partial<UpdateTagDto>) => Promise<any>;
}

const TagEdit: React.FC<Props> = observer(({
  tag,
  onSave,
}) => {
  const [logs, setLogs] = useState<Array<ILogDto>>([]);
  const [initialized, setInitialized] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    LogStore.fetchLogs('Tag', tag._id, { page }).then((res) => {
      setLogs(res.data.data);
      setInitialized(true)
    })
  }, [tag._id, page])

  const renderLogs = () => {
    if (logs.length === 0) {
      return (
        <div>
          暂无编辑记录
        </div>
      )
    }

    return logs.map((log) => (
      <OperationLogItem log={log} key={log._id} />
    ))
  }


  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={16}>
        <Card
          bordered={false}
          style={{ marginBottom: 16 }}
        >
          <TagEditForm
            tag={tag} 
            onSave={onSave}
          />
        </Card>
      </Col>
    
    <Col xs={0} sm={0} md={8}>
      <Card bordered={false} title='编辑记录' loading={!initialized}>
        {renderLogs()}
      </Card>
    </Col>
  </Row>
  );
});

export default TagEdit;
