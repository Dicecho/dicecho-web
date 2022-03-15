import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Button, Modal, Typography } from "antd";
import NoticeWrapper from "../components/NoticeWrapper";

const { Title, Paragraph, Text } = Typography;

const ArticleNotice: React.FunctionComponent = observer(() => {
  return (
    <NoticeWrapper>
      <Typography style={{ marginTop: 64 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          词条功能使用及规则
        </Title>

        <Title level={5}>词条定义以及声明</Title>
        <Paragraph>
          词条为用户提供某一类讨论内容的主题，只包含不涉及版权内容的公开信息：作品名称、作者、用于介绍作品的简介等，并根据引用原则提供内容链接作为来源。引用作品信息，仅用作讨论交流主题。符合 <a href='http://www.npc.gov.cn/npc/c30834/202011/848e73f58d4e4c5b82f69d25d46048c6.shtml' target="_blank">《著作权法》第二十四条</a>限定范围。
          <br />
          收录和删除词条只为了本站用户讨论和交流，其收录和删除与否也只与本站相关。
        </Paragraph>
        <Title level={5}>词条的收录/共同编辑</Title>
        <Paragraph>
          dicecho.com向用户开放了词条的创建和编辑功能，具体条件查阅相关管理条例
          <br />
          除以下两小节中提到的条款，其他任何对词条的创建和编辑操作都是dicecho.com所鼓励的行为。
        </Paragraph>
        <Title level={5}>拒绝收录的词条</Title>
        <Paragraph>
          当词条的标题、简介、封面等文字或图片无可避免地违反以下条款时，dicecho.com将拒绝收录：
          <ul>
            <li>反对宪法所确定的基本原则的；</li>
            <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；损害国家荣誉和利益的；</li>
            <li>煽动民族仇恨、民族歧视、破坏民族团结的；</li>
            <li>破坏国家宗教政策的；</li>
            <li>散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
            <li>侮辱或者诽谤他人，侵害他人合法权利的；</li>
            <li>含有虚假、诈骗、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、色情、猥亵的内容；</li>
            <li>含有中国法律、法规、（部门）规章以及任何具有法律效力之规范所限制或禁止的其他内容的。</li>
          </ul>
        </Paragraph>
        <Title level={5}>
          被认为是恶意编辑的行为
        </Title>
        <Paragraph>
          <ul>
            <li>无故删除文字或图片内容</li>
            <li>多次覆盖其他用户的合理修改</li>
            <li>违反【拒绝收录的词条】小节中的条目</li>
          </ul>
        </Paragraph>
        <Title level={5}>
          违反规则的处理方法
        </Title>
        <Paragraph>
          <ul>
            <li>首次违反规则的账户会暂时被取消编辑权限</li>
            <li>多次违反规则的账号会被永久取消编辑权限</li>
            <li>如违反规则情节严重，将根据<Link to='/notice/terms'>《Dicecho使用协议与条款》</Link>停止账号使用</li>
          </ul>
        </Paragraph>

        <Title level={5}>词条版权声明</Title>
        <Paragraph>
          如果词条中包含侵害您版权权利的内容，请点击<Link to='/notice/copyright'>版权声明</Link>中获取更多信息和进行“侵权通知”步骤说明。
        </Paragraph>

        本声明之修改权、更新权和最终解释权均属dicecho.com所有
      </Typography>
    </NoticeWrapper>
  );
});

export default ArticleNotice;
