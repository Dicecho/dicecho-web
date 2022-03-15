import React from 'react';
import { observer } from "mobx-react";
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AuthStore from '@/shared/stores/AuthStore';
import UIStore from '@/shared/stores/UIStore';
import { message } from 'antd';

interface IProps extends RouteProps {
};

const PrivateRoute: React.FunctionComponent<IProps> = observer(({ ...props }) => {

  if (!AuthStore.isAuthenticated) {
    message.error('请登录后再尝试')
    UIStore.openLoginModal();
    return (<Redirect to={{ pathname: '/', state: { from: props.location }}} />)
  }

  return <Route {...props} />
})

export { PrivateRoute };