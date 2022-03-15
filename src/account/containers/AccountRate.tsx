import React from "react";
import { observer } from "mobx-react";
import { Row, Col } from "antd";
import { IAccountDto } from '../stores/AccountStore';
import AccountRateCard from '@/account/components/AccountRateCard';

interface IProps {
  user: IAccountDto,
}

const AccountRate: React.FC<IProps> = observer((props) => {

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <AccountRateCard user={props.user}/>
        </Col>
        <Col xs={0} sm={0} md={8}>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default AccountRate;
