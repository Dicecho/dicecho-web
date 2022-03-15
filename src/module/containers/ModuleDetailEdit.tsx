import React, { useEffect, useState } from "react";
import { useIsMounted } from "react-tidy";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, message, Modal, Typography } from "antd";
import ModuleStore from "@/module/stores/ModuleStore";
import LogStore, { ILogDto } from '@/shared/stores/LogStore';
import { OperationLogItem } from '@/shared/components/OperationLog';
import ModuleEditForm from "@/module/components/ModuleEditForm";
import ModuleContributeForm from "@/module/components/ModuleContributeForm";
import styles from "./ModuleDetail.module.less";

const { Paragraph, Text, Title } = Typography;

const ModuleDetailEdit: React.FC = observer(() => {
  const [logs, setLogs] = useState<Array<ILogDto>>([]);
  const [page, setPage] = useState(1);

  const history = useHistory();
  const isMounted = useIsMounted();
  const module = ModuleStore.moduleDetail;
  if (!module) {
    return null;
  }

  useEffect(() => {
    LogStore.fetchLogs('Mod', module._id, { page }).then((res) => {
      setLogs(res.data.data);
    })
  }, [module._id, page])


  const handleSave = (dto: any) => {
    return ModuleStore.editModule(module._id, dto).then(() => {
      if (!isMounted()) {
        return;
      }
  
      message.success("更新成功");
      history.push(`/module/${module._id}`);
    });
  }

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
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false} className={styles.moduleInfo}>
            {module.isForeign 
              ? <ModuleContributeForm mod={module} onSave={handleSave} />
              : <ModuleEditForm mod={module} onSave={handleSave} />
            }
          </Card>
        </Col>
        <Col xs={0} sm={0} md={8}>
          <Card title='编辑记录' bordered={false} className={styles.moduleInfo}>
            {renderLogs()}
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default ModuleDetailEdit;
