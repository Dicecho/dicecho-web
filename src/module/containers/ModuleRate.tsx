import React, { Component, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Avatar, Button, Typography, List } from 'antd';
import ModuleStore from '@/module/stores/ModuleStore';
import RateStore from '@/rate/stores/RateStore';
import ModuleRateList from '../components/ModuleRateList';

const { Paragraph, Text } = Typography;


const ModuleRate: React.FC = observer(() => {
  const module = ModuleStore.moduleDetail;
  if (!module) {
    return null;
  }

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={16}>
        <ModuleRateList module={module}/>
      </Col>
      <Col xs={0} sm={0} md={8}>
      </Col>
    </Row>
  );
});
export default ModuleRate;
