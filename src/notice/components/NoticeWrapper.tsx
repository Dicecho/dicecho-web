import React from "react";
import { observer } from "mobx-react";
import { Col, Row } from "antd";
import ScrollToTop from "@/shared/components/ScrollToTop";

const NoticeWrapper: React.FunctionComponent = observer((props) => {
  return (
    <div className='container'>
      <Row gutter={16}>
        <ScrollToTop />
        <Col xs={0} sm={0} md={6} />
        <Col xs={24} sm={24} md={12}>
          {props.children}
        </Col>
      </Row>
    </div>
  );
});

export default NoticeWrapper;
