import React from "react";
import { observer } from "mobx-react";
import { Row, Col, Card } from "antd";
import FollowList from "../components/FollowList";
import { IAccountDto } from "../stores/AccountStore";

interface IProps {
  user: IAccountDto;
}

const AccountFollowers: React.FC<IProps> = observer((props) => {
  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={0} sm={0} md={4}></Col>
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false} title={`${props.user.nickName} 关注的用户`}>
            <FollowList user={props.user} type='following' />
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default AccountFollowers;
