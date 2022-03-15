import React, { useState } from "react";
import { observer } from "mobx-react";
import { useHistory, NavLink, useRouteMatch, Switch, Route } from "react-router-dom";
import { Row, Col, Card, Select, message } from "antd";
import { RightOutlined } from '@ant-design/icons';
import { IAccountDto } from '../stores/AccountStore';
import AccountAvatar from '@/account/components/AccountAvatar';
import ProfileEditForm from '@/account/components/ProfileEditForm';
import ChangePasswordForm from '@/account/components/ChangePasswordForm';
import AccountBlock from './AccountBlock';
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import styles from "./AccountSetting.module.less";

const { Option } = Select;

interface IProps {
  user: IAccountDto,
  onUpdate: Function,
}

const tabItems = [
  {
    link: "",
    title: "修改个人资料",
    exact: true,
  },
  {
    link: "avatar",
    title: "设置头像",
  },
  {
    link: "change-password",
    title: "修改密码",
  },
  {
    link: "block",
    title: "屏蔽",
  },
]

const AccountSetting: React.FC<IProps> = observer((props) => {
  const history = useHistory();
  const route = useRouteMatch();

  if (UIStore.isMobile) {
    history.replace(`/account/setting`)
    return null;
  }

  if (props.user._id !== AuthStore.user._id) {
    history.push(`/account/${props.user._id}`)
    return null;
  }

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={0} sm={0} md={8} xl={8}>
          <Card bordered={false} className={styles.siderCard}>
            <div className={styles.siderCardHeader}>
              个人设置
            </div>
            <div className={styles.siderCardContent}>
              {tabItems.map((tab) => (
                <NavLink
                  key={tab.link}
                  exact={tab.exact}
                  activeClassName={styles.siderCardItemActive}
                  className={styles.siderCardItem}
                  replace={true}
                  to={tab.link === "" ? route.url : `${route.url}/${tab.link}`}
                >
                  <div className={styles.siderCardTab}>
                    {tab.title}
                    <RightOutlined style={{ marginLeft: 'auto' }} />
                  </div>
                </NavLink>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} xl={16}>
          <Switch>
            <Route exact path={`${route.url}`}>
              <Card bordered={false} title='修改个人资料'>
                <ProfileEditForm
                  profile={props.user}
                  onSave={(dto) => AuthStore.updateProfile(dto).then(() => props.onUpdate())}
                />
              </Card>
            </Route>
            <Route path={`${route.url}/avatar`}>
              <Card bordered={false} title='设置头像'>
                <AccountAvatar />
              </Card>
            </Route>
            <Route path={`${route.url}/change-password`}>
              <Card bordered={false} title='修改密码'>
                <ChangePasswordForm 
                  onSubmit={(dto) => AuthStore.changePassword(dto).then(() => message.success('修改成功'))}
                />
              </Card>
            </Route>
            <Route path={`${route.url}/block`}>
              <AccountBlock />
            </Route>
          </Switch>
        </Col>
      </Row>
    </React.Fragment>
  );
});
export default AccountSetting;
