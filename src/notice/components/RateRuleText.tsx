import React, { useReducer, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const RateRuleText: React.FunctionComponent = observer(() => {
  return (
    <Typography>
      <Title level={2} style={{ textAlign: "center" }}>
        评价规则
      </Title>

      <Title level={5}>关于评价和评分</Title>
      <Paragraph>
        我们欢迎每一位玩家对看过/玩过/跑过的模组进行打分
        <br />
        我们也相信评分功能可以有效的帮助玩家筛选合自己心意的模组，以及帮助优秀的模组获得更多关注
        <br />
        如果有想要推荐或者吐槽的模组，欢迎留下的您的评价
        <br />
      </Paragraph>
      <Title level={5}>如何评价会更好</Title>
      <Paragraph>
        我们不限制用户如何评价某一个作品，但是一些可量化的指标可以让其他用户有效的判断某个模组的质量
        <br />
        以下是我们推荐的一些评价方向
        <br />
        <ul>
          <li>
            <Text strong>基本逻辑</Text>
            ：故事本身能否逻辑自洽，NPC行为在故事环境下是否合理。
          </li>
          <li>
            <Text strong>规则体现</Text>
            ：模组是否体现了此规则应有的要素，鉴定设置是否合理。
          </li>
          <li>
            <Text strong>完整度</Text>：内容是否缺失，场景内的线索是否交代清晰。
          </li>
          <li>
            <Text strong>易读性</Text>：语言是否运用得体，排版是否清晰美观。
          </li>
          <li>
            <Text strong>故事性</Text>
            ：构思是否有趣，立意是否深刻，感情是否饱满，氛围是否到位。
          </li>
          <li>
            <Text strong>游戏性</Text>
            ：策略是否有深度，核心矛盾解法是否多样；策略是否有广度，每种矛盾解法需要的资源及能力是否丰富。
          </li>
        </ul>
      </Paragraph>
      <Title level={5}>评价中的禁止事项</Title>
      <Paragraph>
        评价对于模组是一种良性反馈，但是如果一旦出现以下现象，那么评价的意义就会发生改变
        <br />
        我们强烈抵制这些现象的发生，如果您看到相关的现象可以使用举报功能，管理员会根据举报对评价进行隐藏
        <br />
        <ul>
          <li>
            <Text strong>违反法律法规</Text>
            ：发布违反国家相关法律法规的信息。包括但不限于发送色情、赌博诈骗、不实信息、非法网站等信息。
          </li>
          <li>
            <Text strong>垃圾广告</Text>
            ：禁止以曝光自己为目的，发送垃圾信息。包括但不限于发送大量链接、网站名、自己ID、qq群号等。
          </li>
          <li>
            <Text strong>人身攻击</Text>
            <ul>
              <li>为内容提及到现实人类，且包含以下要点时无论任何前置条件，均被断定为【人身攻击】</li>
              <li>以侮辱性言论伤害他人。</li>
              <li>刻意捏造信息破坏他人名誉。</li>
              <li>以威胁性的话语胁迫他人服从或听从</li>
            </ul>
          </li>
          <li>
            <Text strong>任何补分，平分性质的发言</Text>
            ：任何根据分数再次打分的内容
          </li>
          <li>
            <Text strong>表达未阅读且未体验模组的内容</Text>
            ：评价中明确表述自己没有看过模组且没有玩过（带过）此模组。
          </li>
        </ul>
      </Paragraph>
      <Title level={5}>如果评价被隐藏为个人了应该怎么做？</Title>
      <Paragraph>
        您可以修改后自行重公开，不过如果同一评价多次被管理员管理会进行锁定处理，既不可自行重公开。不过其他人仍可以通过您的个人页面看到您的评价
      </Paragraph>
      <Title level={5}>评分的机制</Title>
      <Paragraph>
        我们相信公开算法和机制会让评分更加透明和可验证
        <br />
        对于评价来说，每一个评价都拥有一定的权重，权重是经过一个名为威尔逊区间的方法来计算出的，
        <a
          href="http://www.ruanyifeng.com/blog/2012/03/ranking_algorithm_wilson_score_interval.html"
          target="_blank"
        >
          点击这里
        </a>
        您可以看到相关的算法介绍
        <br />
        对于模组来说，评分是根据每个评价的权重和评分来计算加权平均数
        <br />
        简单来说，权重机制大概就是每一个评价的赞踩数据决定了这个评价能多大程度上影响模组的评分
        <br />
        我们建议每一位用户都可以更多的去赞/踩自己喜欢/不喜欢的评价，更多的赞踩数据会让模组的评分更加合理
        <br />
      </Paragraph>
      <Title level={5}>如果觉得评分不合理，应该怎么做？</Title>
      <Paragraph>
        如果认为某个模组的评分超过/没有达到心目中的分数，请不要发表一篇用来提分/降分的评价，更不要去质疑/指导其他人给出的分数
        <br />
        更加推荐的做法是：赞/踩您觉得合理/不合理的评价，这些赞踩行为会实时的反映在模组的评分上
        <br />
      </Paragraph>
      <Title level={5}>
        感谢你看到这里，期待能与你共同建设一个纯粹的TRPG社区。
      </Title>
    </Typography>
  );
});

export default RateRuleText;
