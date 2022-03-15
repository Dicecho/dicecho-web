import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import BaseProvider from '@/utils/BaseProvider';
import ResetPasswordForm from '../components/ResetPasswordForm';
import UIStore from '@/shared/stores/UIStore';
import AuthStore from '@/shared/stores/AuthStore';
import qs from 'qs';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

interface ISearch {
  email: string;
  rescueCode: string;
}


const ResetPassword: React.FunctionComponent = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [rescueCode, setRescueCode] = useState('');

  useEffect(() => {
    const data: Partial<ISearch> = qs.parse(
      location.search.replace("?", "")
    );

    if (!data.email || !data.rescueCode) {
      setError('链接出错，请检查您的重置链接或者重新获取重置密码的链接')
      setInitialized(true);
      return;
    }

    setEmail(data.email)
    setRescueCode(data.rescueCode)

    BaseProvider.post('/api/user/check-rescue', {
      email: data.email,
      rescueCode: data.rescueCode,
    }).catch((err: any) => {
      setError(err.response.data.detail);
    }).finally(() => {
      setInitialized(true);
    })

  }, [location.search])

  const handleRescue = (newPassword: string) => {
    return AuthStore.rescue({ email, rescueCode, newPassword }).then(() => {
      message.success('您已重置密码')
      UIStore.openLoginModal();
      history.push('/');
    })
  }

  if (!initialized) {
    return (
      <div className='container' style={{ padding: '40px 16px' }}>
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            {error}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className='container' style={{ padding: '40px 16px' }}>
      <Card bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px', fontSize: '1rem' }}>
            重置您的密码
          </div>
          <ResetPasswordForm
            onSend={handleRescue}
            style={{ minWidth: '40%' }}
          />
        </div>
      </Card>
    </div>
  )
});
export default ResetPassword;
