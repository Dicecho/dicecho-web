import React from "react";
import { observer } from "mobx-react";
import { MarkdownRender } from '@/shared/components/MarkdownEditor';
import { Row, Col, Card } from "antd";
import { IAccountDto } from '../stores/AccountStore';
import AccountModulesCard from '@/account/components/AccountModulesCard';
import AccountRateCard from '@/account/components/AccountRateCard';
import AuthStore from '@/shared/stores/AuthStore';
import SettingStore from '@/shared/stores/SettingStore';
import UIStore from '@/shared/stores/UIStore';


interface IProps {
  user: IAccountDto,
}

const AccountHome: React.FC<IProps> = observer((props) => {
  const isSelf = props.user._id === AuthStore.user._id;

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          {UIStore.isMobile &&
            <Card bordered={false} title='简介' style={{ marginBottom: 16 }}>
              <MarkdownRender content={props.user.notice || '暂无简介'} />
            </Card>
          }
          <AccountModulesCard hidden={!isSelf} user={props.user} style={{ marginBottom: 16 }}/>
          {SettingStore.rateAvailable &&
            <AccountRateCard user={props.user}/>
          }
        </Col>
        <Col xs={0} sm={0} md={8}>
          <Card bordered={false} title='简介'>
            <MarkdownRender content={props.user.notice || '暂无简介'} />
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default AccountHome;
