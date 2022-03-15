import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Typography } from "antd";
import NoticeWrapper from "../components/NoticeWrapper";
import RateRuleText from "../components/RateRuleText";

const { Title, Paragraph, Text } = Typography;

const RuleNotice: React.FunctionComponent = observer(() => {
  return (
    <NoticeWrapper>
      <Typography style={{ marginTop: 64 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          社区规则
        </Title>

        <Title level={5}>关于 Dicecho 社区的基本原则</Title>
        <Paragraph>
          <ul>
            <li>
              价值：我们鼓励用户分享、创造有价值的内容，为社区变得美好贡献一份力量，并从中获益
            </li>
            <li>
              尊重：我们希望每位用户都尊重其他人的权利，包括私人隐私、个人空间、言论自由等权利；尊重社区群体努力引导和维护的，以分享、互助、开放、包容为特征的网站氛围和社区环境
            </li>
          </ul>
        </Paragraph>
        <Title level={5}>共同管理社区</Title>
        <Paragraph>
          秉承互联网共享精神，我们希望所有社区成员都加入社区内容的编写与管理中，共同建设Dicecho。
          <br />
          所有社区成员都可以：
          <br />
          <ul>
            <li>
              上传自己的原创作品或创建模组讨论条目：分享你喜欢的模组，让更多人知道、玩到，并喜欢上它；
            </li>
            <li>撰写评价：发表有价值、有意义的评价；</li>
            <li>
              撰写文章：撰写与模组相关的各种文章，不限于模组讨论、带团指南、模组资讯、同人创作等等。模组评价建议发表在模组评价处，相比文章，专门的模组评价功能提供打星评分
            </li>
          </ul>
        </Paragraph>
        <Title level={5}>共同维护社区氛围</Title>
        <Paragraph>
          我们支持言论自由，无论是赞美模组还是批评模组，社区支持一切关于TRPG的友好讨论或激烈争辩。但一旦讨论与争辩上升到人身攻击、辱骂程度，不但会对社区成员造成伤害，还将影响整个社区的氛围，我们要坚决杜绝这种行为。
          <br />
          <br />
          Dicecho不欢迎:
          <br />
          针对国家、民族、性别、种族、宗教、年龄、地缘、性取向、生理特征等方面的歧视和仇恨言论；
          <br />
          侮辱谩骂、造谣诽谤、话语胁迫等骚扰以及其他侵犯用户人身权利的行为；
          <br />
          破坏Dicecho社区环境以及危害网站安全的行为，包括但不限于：
          <br />
          <ul>
            <li>
              恶意提及无关内容、主动煽动情绪对立、故意引导不同立场群体相互攻击的引战行为；
            </li>
            <li>
              刷分、养号、控评，诱导点赞、回复、投诉，批量发布重复性内容等影响条目评分公正性的行为；
            </li>
            <li>
              散布广告或垃圾信息，例如：以营销推广或导流为目的发布内容的用户和行为；
            </li>
            <li>发布激进时政、意识形态方面内容的行为；</li>
          </ul>
          如果遇到以上内容，请联系info@dicecho.com以解决
        </Paragraph>
      </Typography>
    </NoticeWrapper>
  );
});

export default RuleNotice;
