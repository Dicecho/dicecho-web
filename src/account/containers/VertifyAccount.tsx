import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import VertifyForm from '../components/VertifyForm';
import UIStore from '@/shared/stores/UIStore';
import AuthStore from '@/shared/stores/AuthStore';
import qs from 'qs';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

interface ISearch {
  email: string;
  vertifyCode: string;
}

const VertifyAccount: React.FunctionComponent = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [vertifyCode, setVertifyCode] = useState('');

  useEffect(() => {
    const data: Partial<ISearch> = qs.parse(
      location.search.replace("?", "")
    );

    if (!data.email || !data.vertifyCode) {
      setError('链接出错，请检查您链接或者重新获取链接')
      setInitialized(true);
      return;
    }

    setEmail(data.email)
    setVertifyCode(data.vertifyCode)

    AuthStore.checkVertify({
      email: data.email,
      vertifyCode: data.vertifyCode,
    }).catch((err: any) => {
      setError(err.response.data.detail);
    }).finally(() => {
      setInitialized(true);
    })

  }, [location.search])

  const handleVertify = (nickName: string, password: string) => {
    return AuthStore.vertify({ email, vertifyCode, nickName, password }).then(() => {
      message.success('您已成功激活账号！')
      UIStore.openLoginModal();
      history.push('/');
    })
  }

  if (!initialized) {
    return (
      <div className='container' style={{ padding: '40px 16px' }}>
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
            <Spin size='large' />
          </div>
        </Card>
      </div>
    )
  }

  if (error !== '') {
    return (
      <div className='container' style={{ padding: '40px 16px' }}>
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
            {error}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className='container' style={{ padding: '40px 16px' }}>
      <Card bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320, flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px', fontSize: '1rem' }}>
            激活您的账户
          </div>
          <VertifyForm
            onSubmit={(nickName: string, password: string) => handleVertify(nickName, password)}
            style={{ minWidth: '40%' }}
          />
        </div>
      </Card>
    </div>
  )
});
export default VertifyAccount;
