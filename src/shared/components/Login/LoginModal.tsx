import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Modal, message, Tabs, Button } from 'antd';
import AuthStore from 'shared/stores/AuthStore';
import UIStore from 'shared/stores/UIStore';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgetForm from './ForgetForm';
import logo from '@/assets/img/logo.png'

const { TabPane } = Tabs;

enum optionKeys {
  LOGIN = '0',
  SIGNUP = '1',
  FORGET = '2',
}

const LoginModal: React.FunctionComponent<any> = observer(() => {
  const [optionKey, setOptionKey] = useState(optionKeys.LOGIN);


  // const handleForget = (username: string, password: string, remember: boolean) => {
  //   return AuthStore.login(username, password).then(() => {
  //     message.success('登录成功');
  //     UIStore.closeLoginModal();
  //   })
  // }

  const handleLogin = (username: string, password: string, remember: boolean) => {
    return AuthStore.login(username, password).then(() => {
      message.success('登录成功');
      UIStore.closeLoginModal();
    })
  }

  const handleSignup = (email: string) => {
    return AuthStore.signup({ email }).then(() => {
      message.success('注册邮件发送成功，请到邮箱中激活账号');
      // setOptionKey(optionKeys.LOGIN);
    })
  }
 
  return (
    <Modal
      visible={UIStore.loginModalVisible}
      width={400}
      onCancel={UIStore.closeLoginModal}
      closable={false}
      footer={null}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140 }}>
        <img src={logo} style={{ height: 80 }} />
      </div>
      <Tabs defaultActiveKey={optionKey} activeKey={optionKey} onChange={(key) => setOptionKey(key as optionKeys)}>
        <TabPane tab="登录" key={optionKeys.LOGIN}>
          <LoginForm
            onLogin={handleLogin}
            onForget={() => setOptionKey(optionKeys.FORGET)}
          />
        </TabPane>

        <TabPane tab="注册" key={optionKeys.SIGNUP}>
          <SignupForm
            onSignup={handleSignup}
          />
        </TabPane>
        <TabPane tab="忘记密码" key={optionKeys.FORGET}>
          <ForgetForm 
            onForget={(email) => AuthStore.forget({ email }).then(() => message.success('已发送重置邮件到您的邮箱'))}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
})

export default LoginModal;
