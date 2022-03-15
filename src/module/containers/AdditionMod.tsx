import React, { useEffect, useState } from "react";
import { Card, Row, Col, message } from "antd";
import ScrollToTop from "@/shared/components/ScrollToTop";
import ModuleStore from '../stores/ModuleStore';
import { InfoCircleFilled } from '@ant-design/icons';
import ModuleEditForm from "@/module/components/ModuleEditForm";
import ModuleContributeForm from "@/module/components/ModuleContributeForm";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import styles from './AdditionMod.module.less';

interface ISearch {
  email: string;
  vertifyCode: string;
}

const AdditionMod: React.FunctionComponent = observer(() => {
  const history = useHistory();

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <ScrollToTop />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false}>
            <div className={styles.header}>
              <div className={styles.title}>添加词条</div>
            </div>
            <ModuleContributeForm 
              btnText='添加词条'
              onSave={(data) => ModuleStore.createModule({
                  isForeign: true,
                  ...data,
                }).then((res) => {
                message.success('词条添加成功！')
                history.push(`/module/${res.data._id}`)
              })}
            />
          </Card>
        </Col>
        <Col xs={0} sm={0} md={8}></Col>
      </Row>
    </div>
  );
});
export default AdditionMod;
