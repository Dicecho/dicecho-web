import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Typography } from "antd";
import NoticeWrapper from "../components/NoticeWrapper";

const { Title, Paragraph, Text } = Typography;

const DevelopNotice: React.FunctionComponent = observer(() => {
  return (
    <NoticeWrapper>
      <Typography style={{ marginTop: 64 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          开发计划
        </Title>

        <Title level={5}>接下来要做什么？</Title>
        <Paragraph>
          hi，我们是骰声回响的开发团队。或许你会好奇，接下来骰声回响会做什么功能。我们也很乐于分享目前正在进行中的开发任务以及未来规划的事情<br/>
          点开下面这个云文档的链接，你可以看到我们目前规划的todolist，list上标了一些优先级，也会实时更新<br />
          <a href='https://docs.qq.com/doc/DYnF3anpBV1BKZ016' target='_blank'>
            https://docs.qq.com/doc/DYnF3anpBV1BKZ016
          </a><br/>
        </Paragraph>
        <Title level={5}>我想要这个</Title>
        <Paragraph>
          我们的目标和愿景是帮助跑团玩家们解决一些实际的问题，如果您有跑团以及网站相关的需求，欢迎反馈在这个表格当中，我们会认真对待每一个需求<br />
          <a href='https://docs.qq.com/doc/DTGFna0lpaUJGaWNT' target='_blank'>
            https://docs.qq.com/doc/DTGFna0lpaUJGaWNT
          </a><br/>
        </Paragraph>
        <Title level={5}>我觉得有些地方不太对劲</Title>
        <Paragraph>
          我们的开发团队很小，并且在很多事情上并不专业。虽然已经尽可能的的在优化每一处细节，但是很多体验仍会有很多问题，如果你到了什么体验上的问题，欢迎反馈在这个表格当中，我们会认真阅读每一项反馈，并且认真修改<br />
          <a href='https://docs.qq.com/doc/DYkZOZ1FOaHh5WHVK' target='_blank'>
            https://docs.qq.com/doc/DYkZOZ1FOaHh5WHVK
          </a><br/>
        </Paragraph>

        <Title level={5}>
          感谢你看到这里，期待能与你共同建设一个纯粹的TRPG社区。
        </Title>
      </Typography>
    </NoticeWrapper>
  );
});

export default DevelopNotice;
