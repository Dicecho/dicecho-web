import React from "react";
import { observer } from "mobx-react";
import { Row, Col } from "antd";
import { IAccountDto } from '../stores/AccountStore';
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { TopicSingleStore, TopicListQuery, ITopicDto } from '@/forum/stores/TopicStore';
import TopicCard from "@/forum/components/TopicCard";


interface IProps {
  user: IAccountDto,
}

const AccountTopic: React.FC<IProps> = observer((props) => {
  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <InfiniteScrollWrapper<ITopicDto, TopicListQuery>
            fetchApi={TopicSingleStore.fetchList}
            query={{ filter: { author: props.user._id } }}
            renderList={(data) => (
              <React.Fragment>
                {data.map((topic) => <TopicCard topic={topic} key={topic._id} showDomain/>)}
              </React.Fragment>
            )}
          />
        </Col>
        <Col xs={0} sm={0} md={8}>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default AccountTopic;
