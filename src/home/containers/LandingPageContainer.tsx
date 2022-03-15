import React, { Component, useEffect, useState } from "react";
import { Button, Form, message, Card, Tabs, Input } from "antd";
import { useRouteMatch, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import discordSVG from "@/assets/svg/Discord-Logo-White.svg";
import { WeiboOutlined, QqOutlined } from "@ant-design/icons";
import UIStore from "@/shared/stores/UIStore";
import { Error } from '@/shared/components/Empty'

import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import CustomizedFooter from "@/shared/layout/CustomizedFooter";
import LoginForm from "shared/components/Login/LoginForm";
import SignupForm from "shared/components/Login/SignupForm";
import ForgetForm from "shared/components/Login/ForgetForm";
import AuthStore from "@/shared/stores/AuthStore";
import { DEFAULT_HOME_PAGE, DEFAULT_MOBILE_HOME_PAGE } from "@/shared/constants";
import { observer } from "mobx-react";
import styles from "./LandingPageContainer.module.less";

const { TabPane } = Tabs;

enum optionKeys {
  LOGIN = "0",
  SIGNUP = "1",
  FORGET = "2",
  CONTACT = '3',
}

const LandingPageContainer: React.FunctionComponent = observer(() => {
  const history = useHistory();
  const route = useRouteMatch<{ uuid: string }>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [optionKey, setOptionKey] = useState(optionKeys.LOGIN);

  const handleLogin = (
    username: string,
    password: string,
    remember: boolean
  ) => {
    return AuthStore.login(username, password).then(() => {
      message.success("登录成功");
    });
  };

  const handleSignup = (email: string, code?: string) => {
    return AuthStore.signup({ email }).then(() => {
      message.success("注册邮件发送成功，请到邮箱中激活账号");
      // setOptionKey(optionKeys.LOGIN);
    });
  };

  return (
    <React.Fragment>
      {/* <CustomizedHeader /> */}
      {/* <CustomizedFooter visible={false}/> */}

      <Helmet title={`着陆页 | 骰声回响`}/>
      <div className={styles.homepage}>
        <div
          className={styles.homepageBanner}
          style={{ background: `url(${UIStore.isMobile ? DEFAULT_MOBILE_HOME_PAGE : DEFAULT_HOME_PAGE})` }}
        />
        <div className={`container`}>
          <div className={styles.homepageMain}>
            <div
              className={styles.homepageText}
              style={{ marginBottom: 8, fontSize: "1.5rem" }}
            >
              骰声回响
            </div>
            <div
              className={styles.homepageText}
              style={{ marginBottom: 8, fontWeight: "bold" }}
            >
              TRPG综合社区
            </div>
            <div className={styles.homepageSlogan}>
              念念不忘，必有回响
            </div>
          {/* <Card bordered={false} style={{ width: '100%', maxWidth: 400 }}>
            <Tabs
              defaultActiveKey={optionKey}
              activeKey={optionKey}
              onChange={(key) => setOptionKey(key as optionKeys)}
            >
              <TabPane tab="登录" key={optionKeys.LOGIN}>
                <LoginForm
                  onLogin={handleLogin}
                  onForget={() => setOptionKey(optionKeys.FORGET)}
                />
              </TabPane>

              <TabPane tab="注册" key={optionKeys.SIGNUP}>  
                <Error text='肥肠抱歉，网站暂时关闭注册' padding={0}>
                  <div style={{ textAlign: 'center', margin: '16px 0 24px' }}>
                    通过以下联系方式获得更多信息
                  </div>
                  <Button 
                    href="https://jq.qq.com/?_wv=1027&k=U69VlAni"
                    target="_blank"
                    block
                    // ghost
                    type='primary'
                    icon={(<QqOutlined />)}
                    style={{ marginBottom: 16 }}
                  >
                    官方qq群
                  </Button>
                  <Button 
                    href="https://weibo.com/u/7575371655"
                    target="_blank"
                    block
                    // ghost
                    type='primary'
                    icon={(<WeiboOutlined />)}
                    style={{ marginBottom: 16 }}
                  >
                    官博 @骰声回响Dicecho
                  </Button>
                  <Button 
                    href="https://discord.gg/GdV3BMrABX"
                    target="_blank"
                    block
                    // ghost
                    type='primary'
                    // ghost
                    icon={(<img src={discordSVG} width={16} style={{ marginRight: 8 }}/>)}
                    style={{ marginBottom: 16 }}
                  >
                    官方DISCORD服务器
                  </Button>
                </Error>
              </TabPane>
              <TabPane tab="忘记密码" key={optionKeys.FORGET}>
                <ForgetForm
                  onForget={(email) =>
                    AuthStore.forget({ email }).then(() =>
                      message.success("已发送重置邮件到您的邮箱")
                    )
                  }
                />
              </TabPane>
            </Tabs>
          </Card> */}
      
            <Input
              className={styles.homepageInput}
              placeholder={"输入您的email"}
              style={{ marginBottom: 32 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <Button 
                loading={loading}
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => {
                  if (loading) {
                    return;
                  }
                  setLoading(true)
                  AuthStore.signup({ email }).then(() => {
                    message.success('注册邮件发送成功，请到邮箱中激活账号')
                    setEmail('');
                  }).finally(() => {
                    setLoading(false);
                  })
                }}
              >
                立刻加入
              </Button>
              <Button 
                onClick={() => UIStore.openLoginModal()}
                type="primary"
                ghost
              >
                已有账号，立刻登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
export default LandingPageContainer;
