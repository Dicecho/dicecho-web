import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Button, Modal, Typography } from "antd";
import NoticeWrapper from "../components/NoticeWrapper";

const { Title, Paragraph, Text } = Typography;

const AboutNotice: React.FunctionComponent = observer(() => {
  return (
    <NoticeWrapper>
      <Typography style={{ marginTop: 64 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          关于我们
        </Title>
        <Title level={5} style={{ textAlign: "center" }}>
          骰声回响Dicecho
        </Title>

        <Title level={5}>骰声回响是什么？</Title>
        <Paragraph>
          跑团玩家的世界，由一群热爱跑团，想为跑团人带来更好体验的人共同创造。在这里可以你结识兴趣相投的人；分享跑团趣事；发现与推荐更多优秀的模组。
        </Paragraph>
        <Title level={5}>为什么要做骰声回响？</Title>
        <Paragraph>
          “有什么有趣的模组？”，“在哪里能找到一起跑团的人？”，这样的问题你肯定遇到过，我们也是。作为一名翻看了几百篇模组的KP，我深感到找到心仪的模组是一件困难的事，并且跑到心仪的模组之后想找同好一起聊聊天也非常不容易。 于是我们抱着想要解决这些问题的想法做了骰声回响。
        </Paragraph>
        <Title level={5}>为什么叫骰声回响？</Title>
        <Paragraph>
          骰子，是一个跑团中必不可少的要素，骰子带来的随机性也是跑团中最有乐趣的一个环节。
          <br />
          而跑团中更重要的是社交和互动，主持人与玩家的互动，玩家与剧本的互动，互动让跑团变得独一无二，你一定有过用不可思议的方式过关，骰出大成功或大失败制造了有趣的场面。这些回忆常常被提起，而听的人就算没有玩过，往往也能get到其中有趣的地方。
          这样的互动，或许可以称作回响
          <br />
          人和人的互动，人和剧本的互动，产生了波纹和回响，影响了更多人。
          <br />
          我们希望能通过创建这样的社区，与大家产生更多的回响
          <br />
          于是，骰声回响 Dicecho这个名字就被定下来了
          <br />
          （小彩蛋：英文的读音与日文中的“大成功（だいせいこう）”一样）
          <br />
        </Paragraph>
        <Title level={5}>
          骰声回响具体可以做什么？
          <br />
        </Title>
        <Paragraph>
          <ul>
            <li>发现各式各样的模组</li>
            <li>添加你觉得有趣的模组，让更多的人知道它，包括你自己写的</li>
            <li>
              记录你跑过的所有模组，并对其做出标记和评价，可以帮助后来者判断这个模组
            </li>
            <li>提出想交流，或者好奇的问题</li>
            <li>分享你的知识和经验，并解答别人的疑问</li>
            <li>结识到很多有意思的社区成员</li>
          </ul>
        </Paragraph>
        <Title level={5}>
          未来的开发计划
          <br />
        </Title>
        <Paragraph>
          目前我们对于网站的很多规划还没有实现，比较重要的几个功能包括
          <ul>
            <li>模组TAG标记</li>
            <li>讨论区</li>
            <li>跑团招募板块</li>
            <li>Replay板块</li>
            <li>Log分享板块</li>
          </ul>
          别担心，我们的迭代速度很快，相信在很快这些功能都会被依次实现<br/>
          <Link to='/notice/develop'>点击这里</Link>可以看到我们目前的实时开发列表
        </Paragraph>

        <Title level={5}>如何联系我们？</Title>
        <Paragraph>
          微博：https://weibo.com/u/7575371655
          <br />
          邮箱：info@dicecho.com 
          <br />
        </Paragraph>

        <Title level={5}>
          感谢你看到这里，期待能与你共同建设一个纯粹的TRPG社区。
        </Title>
      </Typography>
    </NoticeWrapper>
  );
});

export default AboutNotice;
