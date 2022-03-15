import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Typography } from "antd";
import NoticeWrapper from "../components/NoticeWrapper";
import RateRuleText from "../components/RateRuleText";

const { Title, Paragraph, Text } = Typography;

const RateRuleNotice: React.FunctionComponent = observer(() => {
  return (
    <NoticeWrapper>
      <div style={{ paddingTop: 64 }}>
      <RateRuleText />
      </div>
    </NoticeWrapper>
  );
});

export default RateRuleNotice;
