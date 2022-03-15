import React from "react";
import { observer } from "mobx-react";
import { Row, Col, Button, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ModuleStore from "@/module/stores/ModuleStore";
import styles from './ModuleDetailDownload.module.less';

const ModuleDetailDownload: React.FC = observer(() => {
  const module = ModuleStore.moduleDetail;
  if (!module) {
    return null;
  }

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false} className={styles.moduleInfo}>
            {module.modFiles.map((file) => (
              <div key={file.name} className={styles.fileItem}>
                <div className={styles.fileName}>
                  {file.name}
                </div>
                {file.clickCount > 0 &&
                  <div className={styles.fileInfo}>
                    下载数:{file.clickCount}
                  </div>
                }
                <div className={styles.fileActions}>
                  <Button
                    href={file.url}
                    target="_blank"
                    type='primary'
                    icon={<DownloadOutlined />}
                    onClick={() => ModuleStore.clickFile(module._id, file.name)}
                  />
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default ModuleDetailDownload;
