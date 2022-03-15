import React, { useState } from "react";
import { observer } from "mobx-react";
import { RouteProps, useHistory } from "react-router-dom";
import { message, Tabs } from "antd";
import AuthStore from "shared/stores/AuthStore";
import UIStore from "shared/stores/UIStore";
import LoginForm from "shared/components/Login/LoginForm";
import SignupForm from "shared/components/Login/SignupForm";
import ForgetForm from "shared/components/Login/ForgetForm";
import logo from "@/assets/img/logo.png";

const { TabPane } = Tabs;

enum optionKeys {
  LOGIN = "0",
  SIGNUP = "1",
  FORGET = "2",
}

interface IProps extends RouteProps {}

const DefaultAccount: React.FunctionComponent<IProps> = observer(() => {
    const history = useHistory();

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

    const handleSignup = (email: string) => {
      return AuthStore.signup({ email }).then(() => {
        message.success("注册邮件发送成功，请到邮箱中激活账号");
        // setOptionKey(optionKeys.LOGIN);
      });
    };

    if (!UIStore.isMobile) {
      UIStore.openLoginModal();
      history.goBack();
      return null;
    }

    return (
      <div className='container'>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 140,
          }}
        >
          <img src={logo} style={{ height: 80 }} />
        </div>
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
            <SignupForm onSignup={handleSignup} />
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
      </div>
    );
  }
);

export default DefaultAccount;
