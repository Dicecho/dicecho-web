import React from 'react';
import { observer } from "mobx-react";
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Error } from '@/shared/components/Empty';
import AuthStore from '@/shared/stores/AuthStore';
import UIStore from '@/shared/stores/UIStore';
import { message } from 'antd';

interface IProps extends RouteProps {
  hasPermisson: boolean;
};

const PermissionRoute: React.FunctionComponent<IProps> = observer(({ ...props }) => {
  if (!props.hasPermisson) {
    return <Route {...props} component={() => (
      <Error text='世界上总有一些门不对你开放'/>
    )} />
  }

  return <Route {...props} />
})

export { PermissionRoute };