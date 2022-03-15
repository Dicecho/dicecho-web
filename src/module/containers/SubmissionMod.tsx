import React, { useEffect, useState } from "react";
import { Card, Row, Col, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import ScrollToTop from "@/shared/components/ScrollToTop";
import ModuleStore from '../stores/ModuleStore';
import { InfoCircleFilled } from '@ant-design/icons';
import ModuleEditForm from "@/module/components/ModuleEditForm";
import { observer } from "mobx-react";
import styles from './SubmissionMod.module.less';

interface ISearch {
  email: string;
  vertifyCode: string;
}

const SubmissionMod: React.FunctionComponent = observer(() => {
  const history = useHistory();

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <ScrollToTop />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false}>
            <div className={styles.header}>
              <div className={styles.title}>模组投稿</div>
              <div className={styles.info}>
                <InfoCircleFilled className={styles.warning} style={{ marginRight: 4 }} />
                请在这里投稿您的作品。如您不是原作者，请使用<Link to='/module/addition'>添加词条</Link>来增加新模组
              </div>
            </div>
            <ModuleEditForm
              btnText='投稿'
              onSave={(data) => ModuleStore.createModule({
                isForeign: false,
                  ...data,
                }).then((res) => {
                message.success('模组发布成功！')
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
export default SubmissionMod;
